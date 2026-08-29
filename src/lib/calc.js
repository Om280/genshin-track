// Material requirement calculators
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import materials from '../data/materials.json';
import exp from '../data/exp.json';

export { characters, weapons, materials };

// Ascension phase boundaries: phase i unlocks at these levels
export const ASC_LEVELS = [20, 40, 50, 60, 70, 80]; // ascend1..ascend6 happen AT these levels
export const MAX_LEVEL = 90;

export function ascPhaseForLevel(level, ascended) {
  // number of ascensions completed for a given level
  let phase = 0;
  for (const l of ASC_LEVELS) {
    if (level > l) phase++;
    else if (level === l && ascended) phase++;
  }
  return phase;
}

function addTo(map, matKey, count) {
  if (!matKey || !count) return;
  map[matKey] = (map[matKey] || 0) + count;
}

// EXP items
const HEROS_WIT = 'heros-wit';
const MORA = 'mora';
const MYSTIC_ORE = 'mystic-enhancement-ore';

export function characterNeeds(charKey, current, target) {
  // current/target: { level, asc (bool: ascended at boundary), talents: [na, skill, burst] }
  const c = characters[charKey];
  if (!c) return {};
  const needs = {};

  // Ascension materials
  const curPhase = ascPhaseForLevel(current.level, current.asc);
  const tgtPhase = ascPhaseForLevel(target.level, target.asc);
  for (let i = curPhase; i < tgtPhase; i++) {
    for (const { m, n } of c.ascend[i] || []) addTo(needs, m, n);
  }

  // Level EXP (character exp table is cumulative: value = total exp to reach that level)
  const cur = Math.min(Math.max(current.level, 1), 90);
  const tgt = Math.min(Math.max(target.level, 1), 90);
  if (tgt > cur) {
    const expNeeded = exp.characterExp[tgt - 1] - exp.characterExp[cur - 1];
    const books = Math.ceil(expNeeded / 20000);
    addTo(needs, HEROS_WIT, books);
    addTo(needs, MORA, books * 4000); // 1 mora per 5 exp
  }

  // Talents
  if (c.talentCost) {
    for (let t = 0; t < 3; t++) {
      const from = current.talents?.[t] ?? 1;
      const to = target.talents?.[t] ?? 1;
      for (let lvl = from; lvl < to && lvl <= 9; lvl++) {
        for (const { m, n } of c.talentCost[lvl - 1] || []) addTo(needs, m, n);
      }
    }
  }

  return needs;
}

export function weaponNeeds(weaponKey, current, target) {
  const w = weapons[weaponKey];
  if (!w) return {};
  const needs = {};
  const is4star = w.rarity >= 3; // ascension arrays exist for all
  const maxLvl = w.rarity <= 2 ? 70 : 90;

  const curPhase = ascPhaseForLevel(current.level, current.asc);
  const tgtPhase = ascPhaseForLevel(target.level, target.asc);
  const maxPhase = w.rarity <= 2 ? 4 : 6;
  for (let i = curPhase; i < Math.min(tgtPhase, maxPhase); i++) {
    for (const { m, n } of w.ascend[i] || []) addTo(needs, m, n);
  }

  // weaponExp arrays are cumulative tables for 3★ / 4★ / 5★ tiers
  const tierIdx = Math.max(0, Math.min(2, w.rarity - 3));
  const table = exp.weaponExp[tierIdx];
  const cur = Math.min(Math.max(current.level, 1), maxLvl);
  const tgt = Math.min(Math.max(target.level, 1), maxLvl);
  if (tgt > cur && table) {
    const expNeeded = table[tgt - 1] - table[cur - 1];
    const ores = Math.ceil(expNeeded / 10000);
    addTo(needs, MYSTIC_ORE, ores);
    addTo(needs, MORA, ores * 1000);
  }

  return needs;
}

export function goalNeeds(goal) {
  if (goal.type === 'weapon') return weaponNeeds(goal.key, goal.current, goal.target);
  return characterNeeds(goal.key, goal.current, goal.target);
}

export function mergeNeeds(list) {
  const total = {};
  for (const needs of list) {
    for (const [k, v] of Object.entries(needs)) total[k] = (total[k] || 0) + v;
  }
  return total;
}

export function remainingNeeds(needs, inventory) {
  const rem = {};
  for (const [k, v] of Object.entries(needs)) {
    const have = inventory[k] || 0;
    if (have < v) rem[k] = v - have;
  }
  return rem;
}

const TYPE_ORDER = {
  'Character Talent Material': 0,
  'Weapon Ascension Material': 1,
  'Character Level-Up Material': 2,
  'Local Specialty (Mondstadt)': 4,
  'Character and Weapon Enhancement Material': 5,
  'Character EXP Material': 6,
  'Weapon Enhancement Material': 7,
};

export function sortMatKeys(keys) {
  return [...keys].sort((a, b) => {
    const ma = materials[a] || {};
    const mb = materials[b] || {};
    const ta = ma.type?.startsWith('Local Specialty') ? 4 : TYPE_ORDER[ma.type] ?? 3;
    const tb = mb.type?.startsWith('Local Specialty') ? 4 : TYPE_ORDER[mb.type] ?? 3;
    if (ta !== tb) return ta - tb;
    if ((mb.rarity || 0) !== (ma.rarity || 0)) return (mb.rarity || 0) - (ma.rarity || 0);
    return (ma.name || '').localeCompare(mb.name || '');
  });
}

export function fmtCount(n) {
  if (n >= 1000000) return `~${(n / 1000000).toFixed(1)}M`;
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  return String(n);
}
