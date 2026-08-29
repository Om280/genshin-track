// Build compact JSON data files for the app from genshin-db + paimon-moe (MIT) vendor data.
import db from 'genshin-db';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { characterExp } from './vendor/characterExp.js';
import { weaponExp } from './vendor/weaponExp.js';
import { builds as pmBuilds } from './vendor/build.js';
import { extraBuilds } from './extra-builds.mjs';
import { teamData } from './teams.mjs';
import { consNotes } from './cons-notes.mjs';

// strip HTML except <b>/<i>; anchors become their text; <br> becomes newline
const cleanRich = (s) =>
  (s || '')
    .replace(/<a\s[^>]*>(.*?)<\/a>/gis, '$1')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<(?!\/?(b|i)>)[^>]+>/gi, '');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(OUT, { recursive: true });

const ICON = (f) => (f ? `https://gi.yatta.moe/assets/UI/${f}.png` : null);
const RELIC = (f) => (f ? `https://gi.yatta.moe/assets/UI/reliquary/${f}.png` : null);

const slug = (s) =>
  s.toLowerCase().replace(/['’".,()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const goodKey = (s) =>
  s.replace(/['’".,\-()]/g, ' ')
    .split(/\s+/).filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1)).join('')
    .replace(/[^A-Za-z0-9]/g, '');
const pmKey = (s) =>
  s.toLowerCase().replace(/['’".,()]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

// ---------- materials ----------
const materialsOut = {};
function addMaterial(name) {
  if (!name || materialsOut[slug(name)]) return slug(name);
  const m = db.materials(name);
  if (!m) return slug(name);
  const k = slug(name);
  materialsOut[k] = {
    name: m.name,
    rarity: m.rarity || 1,
    type: m.typeText || '',
    icon: ICON(m.images?.filename_icon),
    days: m.daysOfWeek || null,
    domain: m.dropDomainName ? m.dropDomainName.replace(/^Domain of \w+: /, '') : null,
    source: (m.sources || []).filter((s) => !s.includes('Placeholder') && !s.includes('Crafting Bench') && !s.includes('Shop'))[0] || null,
  };
  return k;
}
const costList = (arr) => (arr || []).map((c) => ({ m: addMaterial(c.name), n: c.count }));

// ---------- characters ----------
const charNames = db.characters('names', { matchCategories: true });
const travelerElems = ['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro'];
const charactersOut = {};

// strip ALL game markup: {LINK#...}...{/LINK}, {SPRITE_PRESET#..}, color tags, html
const cleanGameText = (s) =>
  (s || '')
    .replace(/\{LINK#[^}]*\}/g, '')
    .replace(/\{\/LINK\}/g, '')
    .replace(/\{SPRITE_PRESET#[^}]*\}/g, '')
    .replace(/\{[A-Z_]+#[^}]*\}/g, '')
    .replace(/\{\/[A-Z_]+\}/g, '')
    .replace(/<color=[^>]*>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\\n/g, ' ');

const cleanDesc = (s) =>
  cleanGameText(s)
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, 2)
    .join(' ')
    .slice(0, 260);

function consFor(name) {
  const cons = db.constellations(name);
  if (!cons) return null;
  return [1, 2, 3, 4, 5, 6].map((i) => ({
    name: cons[`c${i}`]?.name || '',
    desc: cleanDesc(cons[`c${i}`]?.descriptionRaw),
  }));
}

for (const name of charNames) {
  if (name === 'Lumine' || name === 'Aether') continue;
  const c = db.characters(name);
  if (!c || !c.costs || !c.costs.ascend1) continue;
  if (!c.elementText || c.elementText === 'None') continue; // skip placeholder test units (Manekin etc.)
  if (!c.version && c.name !== 'Zibai') continue; // skip unreleased placeholder entries without data
  const t = db.talents(name);
  const key = slug(name);
  charactersOut[key] = {
    key,
    name: c.name,
    title: c.title || '',
    rarity: c.rarity,
    element: c.elementText,
    weaponType: c.weaponText,
    region: c.region || '',
    substat: c.substatText || '',
    description: (c.description || '').slice(0, 300),
    version: c.version || '',
    icon: ICON(c.images?.filename_icon),
    splash: ICON(c.images?.filename_gachaSplash),
    side: ICON(c.images?.filename_sideIcon),
    good: goodKey(c.name),
    pm: pmKey(c.name),
    ascend: [1, 2, 3, 4, 5, 6].map((i) => costList(c.costs[`ascend${i}`])),
    talentCost: t?.costs ? Array.from({ length: 9 }, (_, i) => costList(t.costs[`lvl${i + 2}`])) : null,
    talents: t
      ? ['combat1', 'combat2', 'combat3'].map((k) => ({ name: t[k]?.name || '', desc: cleanGameText(t[k]?.descriptionRaw || '').split('\n')[0].slice(0, 220) }))
      : null,
    cons: consFor(name),
  };
}

// Traveler variants
const aether = db.characters('Aether');
if (aether) {
  for (const el of travelerElems) {
    const t = db.talents(`Traveler (${el})`);
    if (!t) continue;
    const key = `traveler-${el.toLowerCase()}`;
    charactersOut[key] = {
      key,
      name: `${el} Traveler`,
      title: 'Traveler',
      rarity: 5,
      element: el,
      weaponType: 'Sword',
      region: '',
      substat: aether.substatText || '',
      description: 'The main character. Changes element at Statues of The Seven.',
      version: '1.0',
      icon: ICON(aether.images?.filename_icon),
      splash: ICON(aether.images?.filename_gachaSplash),
      side: ICON(aether.images?.filename_sideIcon),
      good: 'Traveler',
      pm: `traveler_${el.toLowerCase()}`,
      ascend: [1, 2, 3, 4, 5, 6].map((i) => costList(aether.costs[`ascend${i}`])),
      talentCost: t?.costs ? Array.from({ length: 9 }, (_, i) => costList(t.costs[`lvl${i + 2}`])) : null,
      talents: ['combat1', 'combat2', 'combat3'].map((k) => ({ name: t[k]?.name || '', desc: cleanGameText(t[k]?.descriptionRaw || '').split('\n')[0].slice(0, 220) })),
      cons: consFor(`Traveler (${el})`),
    };
  }
}

// ---------- weapons ----------
const weaponNames = db.weapons('names', { matchCategories: true });
const weaponsOut = {};
for (const name of weaponNames) {
  const w = db.weapons(name);
  if (!w || !w.costs || !w.costs.ascend1) continue;
  const key = slug(name);
  weaponsOut[key] = {
    key,
    name: w.name,
    rarity: w.rarity,
    weaponType: w.weaponText,
    baseAtk: w.baseAtkValue,
    mainStat: w.mainStatText || '',
    effectName: w.effectName || '',
    effect: (w.r1 && w.effectTemplateRaw)
      ? w.effectTemplateRaw.replace(/\{(\d+)\}/g, (_, i) => (w.r1[i] ?? '')).replace(/<[^>]+>/g, '')
      : '',
    icon: ICON(w.images?.filename_icon),
    awakenIcon: ICON(w.images?.filename_awakenIcon),
    good: goodKey(w.name),
    pm: pmKey(w.name),
    ascend: [1, 2, 3, 4, 5, 6].map((i) => costList(w.costs[`ascend${i}`])),
  };
}

// ---------- weapon sources (paimon-moe weaponList, MIT) ----------
const wlSrc = fs.readFileSync(path.join(__dirname, 'vendor', 'weaponList.js'), 'utf8');
const pmSources = {};
for (const m of wlSrc.matchAll(/id: '([a-z0-9_]+)',[\s\S]{0,220}?source: '([^']+)'/g)) {
  pmSources[m[1]] = m[2];
}
const SOURCE_LABEL = (raw, rarity) => {
  const s = (raw || '').toLowerCase();
  if (!s) return rarity >= 5 ? 'Wish (gacha)' : rarity === 4 ? 'Wish / event' : 'Wish & chests';
  if (s.includes('forging') || s.includes('forgeable')) return 'Forgeable (blacksmith)';
  if (s.includes('battle pass')) return 'Battle Pass';
  if (s.includes('fishing')) return 'Fishing exchange';
  if (s.includes('chest')) return 'Chests (world)';
  if (s.includes('event')) return 'Event (limited)';
  if (s.includes('unobtainable')) return 'Currently unobtainable';
  if (s.includes('quest')) return 'Quest reward';
  if (s.includes('wish')) return 'Wish (gacha)';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};
for (const [k, w] of Object.entries(weaponsOut)) {
  w.source = SOURCE_LABEL(pmSources[w.pm], w.rarity);
}

// ---------- artifacts ----------
// map artifact set -> farm domain via domain reward previews
const allDomainNames = db.domains('names', { matchCategories: true });
const setToDomain = {};
for (const dn of allDomainNames) {
  const d = db.domains(dn);
  if (!d || !d.rewardPreview) continue;
  for (const r of d.rewardPreview) {
    const art = db.artifacts(r.name);
    if (art && !setToDomain[art.name]) setToDomain[art.name] = d.entranceName;
  }
}
// sets currently available in the Artifact Strongbox (updated to the current 40-set list)
const STRONGBOX = new Set([
  'archaic-petra', 'blizzard-strayer', 'bloodstained-chivalry', 'crimson-witch-of-flames',
  'deepwood-memories', 'desert-pavilion-chronicle', 'echoes-of-an-offering', 'emblem-of-severed-fate',
  'finale-of-the-deep-galleries', 'flower-of-paradise-lost', 'fragment-of-harmonic-whimsy',
  'gilded-dreams', 'gladiators-finale', 'golden-troupe', 'heart-of-depth', 'husk-of-opulent-dreams',
  'lavawalker', 'long-nights-oath', 'maiden-beloved', 'marechaussee-hunter',
  'night-of-the-skys-unveiling', 'nighttime-whispers-in-the-echoing-woods', 'noblesse-oblige',
  'nymphs-dream', 'obsidian-codex', 'ocean-hued-clam', 'pale-flame', 'retracing-bolide',
  'scroll-of-the-hero-of-cinder-city', 'shimenawas-reminiscence', 'silken-moons-serenade',
  'song-of-days-past', 'tenacity-of-the-millelith', 'thundering-fury', 'thundersoother',
  'unfinished-reverie', 'vermillion-hereafter', 'viridescent-venerer', 'vourukashas-glow',
  'wanderers-troupe',
]);
const artifactNames = db.artifacts('names', { matchCategories: true });
const artifactsOut = {};
for (const name of artifactNames) {
  const a = db.artifacts(name);
  if (!a) continue;
  const key = slug(name);
  const iconFile = a.images?.filename_flower || a.images?.filename_circlet;
  artifactsOut[key] = {
    key,
    name: a.name,
    rarity: Math.max(...(a.rarityList || [5])),
    icon: RELIC(iconFile),
    bonus2: a.effect2Pc || '',
    bonus4: a.effect4Pc || '',
    pm: pmKey(a.name),
    domain: setToDomain[a.name] || null,
    strongbox: STRONGBOX.has(key),
  };
}

// ---------- builds (paimon-moe, MIT) ----------
const pmToChar = {};
for (const k of Object.keys(charactersOut)) pmToChar[charactersOut[k].pm] = k;
const pmToWeapon = {};
for (const k of Object.keys(weaponsOut)) pmToWeapon[weaponsOut[k].pm] = k;
const pmToArtifact = {};
for (const k of Object.keys(artifactsOut)) pmToArtifact[artifactsOut[k].pm] = k;

// special artifact group placeholders used by paimon builds
const artifactGroups = {
  '+18%_atk_set': '+18% ATK set (2pc)',
  '+20%_er_set': '+20% Energy Recharge set (2pc)',
  '+80_em': '+80 Elemental Mastery set (2pc)',
  '+15%_healing_bonus_set': '+15% Healing Bonus set (2pc)',
  '+25%_physical_dmg_set': '+25% Physical DMG set (2pc)',
  '+15%_anemo_dmg': '+15% Anemo DMG set (2pc)',
  '18%_atk_set': '+18% ATK set (2pc)',
};

const buildsOut = {};
let matchedBuilds = 0;
for (const [pmk, entry] of Object.entries(pmBuilds)) {
  const ck = pmToChar[pmk];
  if (!ck) continue;
  matchedBuilds++;
  const roles = {};
  for (const [roleName, role] of Object.entries(entry.roles || {})) {
    roles[roleName] = {
      recommended: !!role.recommended,
      weapons: (role.weapons || []).map((w) => ({
        key: pmToWeapon[w.id] || null,
        id: w.id,
        refine: w.refine || null,
        stack: w.stack || null,
      })).filter((w) => w.key),
      artifacts: (role.artifacts || []).map((set) =>
        set.map((a) => pmToArtifact[a] ? { key: pmToArtifact[a] } : { label: artifactGroups[a] || a.replace(/_/g, ' ') })
      ),
      mainStats: role.mainStats || null,
      subStats: role.subStats || [],
      talent: role.talent || [],
      tip: cleanRich(role.tip || ''),
      note: cleanRich(role.note || ''),
    };
  }
  buildsOut[ck] = { roles };
}
console.log('builds matched:', matchedBuilds, '/', Object.keys(pmBuilds).length);

// merge original supplemental builds (validate keys)
let extraCount = 0;
for (const [ck, entry] of Object.entries(extraBuilds)) {
  if (!charactersOut[ck]) { console.warn('extra build: unknown char', ck); continue; }
  const roles = {};
  for (const [roleName, role] of Object.entries(entry.roles)) {
    roles[roleName] = {
      ...role,
      weapons: role.weapons.filter((w) => {
        if (!weaponsOut[w.key]) { console.warn(`  [${ck}] unknown weapon:`, w.key); return false; }
        return true;
      }),
      artifacts: role.artifacts.map((set) =>
        set.map((a) => {
          if (a.key && !artifactsOut[a.key]) { console.warn(`  [${ck}] unknown artifact:`, a.key); return { label: a.key.replace(/-/g, ' ') }; }
          if (a.label && artifactGroups[a.label]) return { label: artifactGroups[a.label] };
          return a;
        })
      ),
    };
  }
  buildsOut[ck] = { roles };
  extraCount++;
}
console.log('extra builds merged:', extraCount);

// ---------- recommended talent targets from priority ----------
// Derived from each character's recommended role talent priority (KQM-style):
// 1st priority -> 9, 2nd -> 8 (or 9 if listed as equal), 3rd/unlisted NA -> 6, unlisted others -> 1-6.
const TALENT_SLOTS = { 'normal attack': 0, na: 0, attack: 0, skill: 1, 'elemental skill': 1, burst: 2, 'elemental burst': 2 };
for (const [ck, entry] of Object.entries(buildsOut)) {
  const roleName = Object.keys(entry.roles).find((r) => entry.roles[r].recommended) || Object.keys(entry.roles)[0];
  const role = entry.roles[roleName];
  const targets = [1, 1, 1]; // NA, Skill, Burst — start minimal
  const prio = (role.talent || []).map((t) => String(t).toLowerCase().trim());
  const levelsByRank = [9, 8, 6];
  let rank = 0;
  for (const p of prio) {
    // entries can be like "burst = skill" — split them
    const parts = p.split(/=|\//).map((x) => x.trim());
    for (const part of parts) {
      const slot = TALENT_SLOTS[part];
      if (slot === undefined) continue;
      targets[slot] = Math.max(targets[slot], levelsByRank[Math.min(rank, 2)]);
    }
    rank++;
  }
  // characters whose kit ignores a talent keep it at 1; but if nothing parsed, fall back to 6/9/9? no — keep parsed.
  if (targets.every((t) => t === 1)) targets.splice(0, 3, 6, 9, 9);
  entry.talentTargets = targets;
}

// ---------- teams & partners ----------
let teamsMerged = 0;
for (const [ck, td] of Object.entries(teamData)) {
  if (!charactersOut[ck]) { console.warn('teams: unknown char', ck); continue; }
  if (!buildsOut[ck]) buildsOut[ck] = { roles: {}, talentTargets: [6, 9, 9] };
  const partners = (td.partners || []).filter(([pk]) => {
    if (!charactersOut[pk]) { console.warn(`teams[${ck}]: unknown partner`, pk); return false; }
    return true;
  });
  const teams = (td.teams || []).filter((t) => {
    const bad = t.members.filter((mk) => !charactersOut[mk]);
    if (bad.length) { console.warn(`teams[${ck}] "${t.name}": unknown members`, bad.join(',')); return false; }
    return true;
  });
  buildsOut[ck].partners = partners;
  buildsOut[ck].teams = teams;
  teamsMerged++;
}
// also surface teams on partner pages: if a team contains a character, show it there too
const teamIndex = {};
for (const [ck, entry] of Object.entries(buildsOut)) {
  for (const t of entry.teams || []) {
    for (const mk of t.members) {
      if (!teamIndex[mk]) teamIndex[mk] = [];
      if (!teamIndex[mk].some((x) => x.name === t.name)) teamIndex[mk].push(t);
    }
  }
}
for (const [mk, teams] of Object.entries(teamIndex)) {
  if (!buildsOut[mk]) continue;
  const own = new Set((buildsOut[mk].teams || []).map((t) => t.name));
  buildsOut[mk].teams = [...(buildsOut[mk].teams || []), ...teams.filter((t) => !own.has(t.name))].slice(0, 6);
}
console.log('team entries merged:', teamsMerged);

// ---------- provisional builds for characters without one ----------
const PROV_WEAPONS = {
  Sword: ['mistsplitter-reforged', 'primordial-jade-cutter', 'the-black-sword', 'iron-sting', 'favonius-sword'],
  Claymore: ['wolfs-gravestone', 'serpent-spine', 'the-bell', 'rainslasher', 'favonius-greatsword'],
  Polearm: ['staff-of-homa', 'deathmatch', 'the-catch', 'favonius-lance'],
  Bow: ['aqua-simulacra', 'polar-star', 'rust', 'the-stringless', 'favonius-warbow'],
  Catalyst: ['lost-prayer-to-the-sacred-winds', 'kaguras-verity', 'the-widsith', 'favonius-codex'],
};
const PROV_ELEM_SET = {
  Pyro: 'crimson-witch-of-flames', Hydro: 'heart-of-depth', Electro: 'thundering-fury',
  Cryo: 'blizzard-strayer', Anemo: 'viridescent-venerer', Geo: 'archaic-petra', Dendro: 'deepwood-memories',
};
let provisionalCount = 0;
for (const [ck, c] of Object.entries(charactersOut)) {
  if (buildsOut[ck] && Object.keys(buildsOut[ck].roles || {}).length > 0) continue;
  const wepPool = (PROV_WEAPONS[c.weaponType] || []).filter((k) => weaponsOut[k]);
  const isEM = /Mastery/i.test(c.substat);
  const isHP = /HP/i.test(c.substat);
  const isDEF = /DEF/i.test(c.substat);
  const scaler = isEM ? 'Elemental Mastery' : isHP ? 'HP%' : isDEF ? 'DEF%' : 'ATK%';
  const role = {
    recommended: true,
    provisional: true,
    weapons: wepPool.map((k) => ({ key: k, id: k, refine: null, stack: null })),
    artifacts: [
      [{ key: PROV_ELEM_SET[c.element] || 'gladiators-finale' }],
      [{ key: 'gladiators-finale' }],
      [{ key: 'noblesse-oblige' }],
    ].filter((s) => s[0].key && artifactsOut[s[0].key]),
    mainStats: {
      sands: [scaler === 'ATK%' ? 'ATK%' : scaler],
      goblet: [`${c.element} DMG`, scaler],
      circlet: isEM ? ['Elemental Mastery'] : ['Crit Rate', 'Crit DMG'],
    },
    subStats: isEM
      ? ['Elemental Mastery', 'Energy Recharge', 'Crit Rate']
      : ['Crit Rate', 'Crit DMG', scaler, 'Energy Recharge'],
    talent: ['Skill', 'Burst', 'Normal Attack'],
    tip: '',
    note: `${c.name} is new enough that community testing is still settling. This provisional card uses sensible defaults for a ${c.rarity}★ ${c.element} ${c.weaponType} unit with a ${c.substat || 'standard'} ascension stat — check the full KQM guide as numbers firm up.`,
  };
  if (!buildsOut[ck]) buildsOut[ck] = {};
  buildsOut[ck].roles = { 'PROVISIONAL BUILD': role };
  buildsOut[ck].talentTargets = buildsOut[ck].talentTargets || [6, 9, 8];
  provisionalCount++;
}
console.log('provisional builds:', provisionalCount);

// ---------- auto-generated archetype teams: ensure at least 4 per character ----------
const T = (name, members, desc) => ({ name, members, desc, auto: true });
const ARCHETYPES = {
  Pyro: [
    T('Vaporize', ['SELF', 'xingqiu', 'bennett', 'kaedehara-kazuha'], 'Hydro app from Xingqiu turns Pyro hits into Vaporize; Bennett buffs, Kazuha shreds.'),
    T('Melt', ['SELF', 'rosaria', 'kaedehara-kazuha', 'bennett'], 'Cryo application enables Melt for big Pyro multipliers.'),
    T('Overload', ['SELF', 'chevreuse', 'fischl', 'bennett'], 'Pyro+Electro only — Chevreuse converts Overload into RES shred and ATK buffs.'),
    T('Mono Pyro', ['SELF', 'xiangling', 'bennett', 'kaedehara-kazuha'], 'Stacked Pyro damage with resonance and full buff support.'),
  ],
  Hydro: [
    T('Vaporize', ['SELF', 'xiangling', 'bennett', 'kaedehara-kazuha'], 'Off-field Pyro from Xiangling vaporizes Hydro damage.'),
    T('Electro-Charged', ['SELF', 'fischl', 'beidou', 'kaedehara-kazuha'], 'Constant Electro-Charged procs with double Electro off-fielders.'),
    T('Bloom', ['SELF', 'nahida', 'kirara', 'kuki-shinobu'], 'Dendro cores from steady Hydro application; Kuki triggers Hyperbloom.'),
    T('Freeze', ['SELF', 'rosaria', 'diona', 'kaedehara-kazuha'], 'Cryo partners lock enemies down with Freeze.'),
  ],
  Electro: [
    T('Aggravate', ['SELF', 'nahida', 'fischl', 'kaedehara-kazuha'], 'Quicken from Nahida boosts every Electro hit via Aggravate.'),
    T('Hyperbloom', ['SELF', 'nahida', 'xingqiu', 'zhongli'], 'Electro pops Dendro cores for massive EM-scaled damage.'),
    T('Overload', ['SELF', 'chevreuse', 'bennett', 'xiangling'], 'Chevreuse Overload shell — RES shred plus big ATK buffs.'),
    T('Electro-Charged', ['SELF', 'fischl', 'yelan', 'kaedehara-kazuha'], 'Double Electro + Hydro for perpetual Electro-Charged.'),
  ],
  Cryo: [
    T('Freeze', ['SELF', 'sangonomiya-kokomi', 'shenhe', 'kaedehara-kazuha'], 'Hydro + Cryo keeps enemies frozen; Shenhe amps Cryo damage.'),
    T('Melt', ['SELF', 'xiangling', 'bennett', 'kaedehara-kazuha'], 'Off-field Pyro enables Melt for 2x Cryo hits.'),
    T('Superconduct', ['SELF', 'fischl', 'raiden-shogun', 'bennett'], 'Electro partners shred Physical RES and battery the team.'),
    T('Mono Cryo', ['SELF', 'shenhe', 'diona', 'kaedehara-kazuha'], 'Cryo resonance plus Shenhe quills stack Cryo damage.'),
  ],
  Anemo: [
    T('Swirl carry shell', ['SELF', 'bennett', 'xiangling', 'zhongli'], 'Pyro Swirl core with buffs and shield comfort.'),
    T('Freeze support', ['SELF', 'kamisato-ayaka', 'sangonomiya-kokomi', 'shenhe'], 'Anemo shreds and groups for the Freeze core.'),
    T('Electro Swirl', ['SELF', 'raiden-shogun', 'fischl', 'bennett'], 'Swirl Electro for VV shred and battery support.'),
    T('National shell', ['SELF', 'xiangling', 'xingqiu', 'bennett'], 'The National core with Anemo glue on top.'),
  ],
  Geo: [
    T('Mono Geo', ['SELF', 'zhongli', 'albedo', 'gorou'], 'Stacked Geo damage with resonance and Gorou buffs.'),
    T('Furina flex', ['SELF', 'furina', 'bennett', 'jean'], 'Furina buffs everyone; healers keep Fanfare climbing.'),
    T('Crystallize shell', ['SELF', 'xiangling', 'bennett', 'zhongli'], 'Elemental teammates feed Crystallize shards and damage.'),
    T('Double Geo core', ['SELF', 'zhongli', 'fischl', 'bennett'], 'Geo resonance with flexible off-field damage.'),
  ],
  Dendro: [
    T('Aggravate', ['SELF', 'fischl', 'kuki-shinobu', 'kaedehara-kazuha'], 'Electro partners keep Quicken active for Aggravate hits.'),
    T('Bloom', ['SELF', 'xingqiu', 'sangonomiya-kokomi', 'yaoyao'], 'Double Hydro generates constant Dendro cores.'),
    T('Hyperbloom', ['SELF', 'xingqiu', 'kuki-shinobu', 'zhongli'], 'Kuki detonates the cores this character helps create.'),
    T('Burning', ['SELF', 'xiangling', 'bennett', 'zhongli'], 'Sustained Pyro keeps Burning ticking for burn-based kits.'),
  ],
};
for (const [ck, c] of Object.entries(charactersOut)) {
  if (!buildsOut[ck]) buildsOut[ck] = { roles: {}, talentTargets: [6, 9, 8] };
  const entry = buildsOut[ck];
  const existing = entry.teams || [];
  if (existing.length >= 4) continue;
  const templates = ARCHETYPES[c.element] || [];
  const have = new Set(existing.map((t) => t.name.toLowerCase()));
  const extra = [];
  for (const tpl of templates) {
    if (existing.length + extra.length >= 4) break;
    const members = tpl.members.map((m) => (m === 'SELF' ? ck : m));
    if (members.some((m, i) => members.indexOf(m) !== i)) continue; // SELF collides with a template member
    if (members.some((m) => !charactersOut[m])) continue;
    if (have.has(tpl.name.toLowerCase())) continue;
    extra.push({ name: tpl.name, members, desc: tpl.desc, auto: true });
  }
  entry.teams = [...existing, ...extra];
}
console.log('teams: every character now has', Math.min(...Object.values(buildsOut).map((b) => (b.teams || []).length)), 'to', Math.max(...Object.values(buildsOut).map((b) => (b.teams || []).length)), 'teams');

// ---------- weapon -> recommended characters reverse index ----------
const weaponUsers = {};
for (const [ck, entry] of Object.entries(buildsOut)) {
  for (const [roleName, role] of Object.entries(entry.roles || {})) {
    (role.weapons || []).forEach((w, idx) => {
      if (!w.key) return;
      if (!weaponUsers[w.key]) weaponUsers[w.key] = [];
      const existing = weaponUsers[w.key].find((u) => u.char === ck);
      const rank = idx + 1;
      if (existing) {
        if (rank < existing.rank) { existing.rank = rank; existing.role = roleName; }
      } else {
        weaponUsers[w.key].push({ char: ck, role: roleName, rank, recommended: !!role.recommended });
      }
    });
  }
}
for (const k of Object.keys(weaponUsers)) {
  weaponUsers[k].sort((a, b) => a.rank - b.rank || (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  weaponUsers[k] = weaponUsers[k].slice(0, 12);
}
fs.writeFileSync(path.join(OUT, 'weapon-users.json'), JSON.stringify(weaponUsers));
console.log('weapon-users.json written:', Object.keys(weaponUsers).length, 'weapons have recommendations');

// ---------- constellation notes ----------
let consMerged = 0;
for (const [ck, cn] of Object.entries(consNotes)) {
  if (!charactersOut[ck]) { console.warn('cons-notes: unknown char', ck); continue; }
  if (!buildsOut[ck]) buildsOut[ck] = { roles: {}, talentTargets: [6, 9, 9] };
  buildsOut[ck].consBest = cn.best;
  buildsOut[ck].consNote = cn.note;
  consMerged++;
}
console.log('cons notes merged:', consMerged);

// ---------- playstyle + downsides notes ----------
const { charNotes } = await import('./char-notes.mjs');
let notesMerged = 0;
for (const [ck, n] of Object.entries(charNotes)) {
  if (!n) continue;
  if (!charactersOut[ck]) { console.warn('char-notes: unknown char', ck); continue; }
  if (!buildsOut[ck]) buildsOut[ck] = { roles: {}, talentTargets: [6, 9, 9] };
  buildsOut[ck].playstyle = n.playstyle;
  buildsOut[ck].downsides = n.downsides;
  notesMerged++;
}
console.log('playstyle notes merged:', notesMerged);

// ---------- crit-rate artifact sets (for overcap warnings) ----------
// sets whose bonuses grant conditional CRIT Rate — used by the UI to warn about crit overcap
const CRIT_SETS = {
  'blizzard-strayer': { crit: 20, critMax: 40, when: 'vs Cryo-affected enemies (+20% more when Frozen)', targetCR: '25-35% on sheet vs frozen targets, ~50% otherwise' },
  'marechaussee-hunter': { crit: 36, critMax: 36, when: 'at 3 stacks while HP is changing', targetCR: '~40-50% on sheet (Furina teams keep stacks near-permanent)' },
  'obsidian-codex': { crit: 40, critMax: 40, when: 'for 6s after consuming a Nightsoul point on-field', targetCR: '~35-45% on sheet during Nightsoul uptime' },
  'thundersoother': { crit: 0, critMax: 0, when: '', targetCR: '' }, // dmg% not crit — excluded below
};
delete CRIT_SETS['thundersoother'];
for (const [ak, info] of Object.entries(CRIT_SETS)) {
  if (artifactsOut[ak]) artifactsOut[ak].critInfo = info;
}
console.log('crit-rate set info added:', Object.keys(CRIT_SETS).length);

// ---------- domain rotation schedule ----------
// group day-gated materials (talent books, weapon ascension mats) by domain entrance
const allMatNames = db.materials('names', { matchCategories: true });
const domainGroups = {};
for (const name of allMatNames) {
  const m = db.materials(name);
  if (!m || !m.daysOfWeek || !m.dropDomainName) continue;
  const isTalent = m.typeText === 'Character Talent Material';
  const isWeapon = m.typeText === 'Weapon Ascension Material';
  if (!isTalent && !isWeapon) continue;
  const dom = db.domains(m.dropDomainName);
  const entrance = dom?.entranceName || m.dropDomainName.replace(/^Domain of \w+: /, '');
  const region = dom?.regionName || '';
  const gk = `${entrance}|${isTalent ? 'talent' : 'weapon'}`;
  if (!domainGroups[gk]) domainGroups[gk] = { name: entrance, region, type: isTalent ? 'talent' : 'weapon', seriesMap: {} };
  const seriesName = isTalent ? m.name.replace(/^(Teachings of|Guide to|Philosophies of) /, '') : null;
  const sk = isTalent ? seriesName : m.daysOfWeek.filter((d) => d !== 'Sunday').join(',');
  const g = domainGroups[gk];
  if (!g.seriesMap[sk]) g.seriesMap[sk] = { name: seriesName, days: m.daysOfWeek.filter((d) => d !== 'Sunday'), items: [] };
  const mk = addMaterial(m.name);
  if (!g.seriesMap[sk].items.includes(mk)) g.seriesMap[sk].items.push(mk);
}
const domainsOut = Object.values(domainGroups).map((g) => ({
  name: g.name,
  region: g.region,
  type: g.type,
  series: Object.values(g.seriesMap).map((s) => {
    s.items.sort((a, b) => (materialsOut[a]?.rarity || 0) - (materialsOut[b]?.rarity || 0));
    if (!s.name) s.name = materialsOut[s.items[s.items.length - 1]]?.name || '';
    return s;
  }),
}));

// extra materials referenced by the calculator
for (const n of ["Hero's Wit", "Adventurer's Experience", "Wanderer's Advice", 'Mystic Enhancement Ore', 'Fine Enhancement Ore', 'Enhancement Ore', 'Crown of Insight', 'Mora']) addMaterial(n);

// ---------- write ----------
const write = (f, obj) => {
  fs.writeFileSync(path.join(OUT, f), JSON.stringify(obj));
  console.log(f, (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + 'KB');
};
write('characters.json', charactersOut);
write('weapons.json', weaponsOut);
write('materials.json', materialsOut);
write('artifacts.json', artifactsOut);
write('builds.json', buildsOut);
write('exp.json', { characterExp, weaponExp });
write('domains.json', domainsOut);
console.log('characters:', Object.keys(charactersOut).length, 'weapons:', Object.keys(weaponsOut).length, 'materials:', Object.keys(materialsOut).length);
