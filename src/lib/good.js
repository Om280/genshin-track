// GOOD (Genshin Open Object Description) format import — the JSON format used by Genshin Optimizer.
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';

// map GOOD keys -> our slugs
const charByGood = {};
for (const [slug, c] of Object.entries(characters)) {
  charByGood[c.good] = slug;
}
const weaponByGood = {};
for (const [slug, w] of Object.entries(weapons)) {
  weaponByGood[w.good] = slug;
}

// GOOD stores traveler as "Traveler" (element unknown) — default to anemo variant.
const TRAVELER_DEFAULT = 'traveler-anemo';

export function parseGOOD(json) {
  let data;
  try {
    data = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (e) {
    return { error: 'Not valid JSON. Export the file from Genshin Optimizer (Settings → Database → Export GOOD).' };
  }
  if (!data || data.format !== 'GOOD') {
    return { error: 'This file is not in GOOD format. In Genshin Optimizer go to Settings → Database → Download as .json (GOOD format).' };
  }

  const chars = [];
  const unknownChars = [];
  for (const c of data.characters || []) {
    if (!c.key) continue;
    let slug = charByGood[c.key];
    if (!slug && c.key === 'Traveler') slug = TRAVELER_DEFAULT;
    if (!slug) {
      unknownChars.push(c.key);
      continue;
    }
    chars.push({
      key: slug,
      level: c.level || 1,
      ascension: c.ascension ?? 0,
      constellation: c.constellation ?? 0,
      talents: [c.talent?.auto ?? 1, c.talent?.skill ?? 1, c.talent?.burst ?? 1],
    });
  }

  const weps = [];
  const unknownWeapons = [];
  for (const w of data.weapons || []) {
    if (!w.key) continue;
    const slug = weaponByGood[w.key];
    if (!slug) {
      unknownWeapons.push(w.key);
      continue;
    }
    weps.push({
      key: slug,
      level: w.level || 1,
      ascension: w.ascension ?? 0,
      refinement: w.refinement ?? 1,
      location: w.location ? charByGood[w.location] || null : null,
    });
  }

  return {
    characters: chars,
    weapons: weps,
    unknownChars,
    unknownWeapons,
    source: data.source || 'unknown',
  };
}

// ascension count -> "level, asc" pair for our goal format
export function ascensionToState(level, ascension) {
  const bounds = [20, 40, 50, 60, 70, 80];
  // ascended=true when the character has done the ascension AT their current boundary level
  const asc = bounds.includes(level) ? ascension > bounds.indexOf(level) : false;
  return { level, asc };
}
