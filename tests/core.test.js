import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';import {guides} from '../src/data/guides.js';import {normalizeWish,parseWishJSON,mergeWishes,calculateWishStats,planWishes} from '../src/lib/wishes.js';import {normaliseEnka,fetchEnka,PublicError} from '../server/services.js';
const cat=JSON.parse(readFileSync('src/data/catalog.json'));
const named=(kind,name)=>cat[kind].find(x=>x.name===name);
test('core asset registry: 10 verified IDs in each available entity type',()=>{for(const [kind,rows] of [['characters',cat.characters],['weapons',cat.weapons],['artifacts',cat.artifacts]]){assert.ok(rows.length>=10);for(const x of rows.slice(0,10)){assert.ok(x.id&&x.name&&x.icon);assert.ok(existsSync(`public/assets/icons/${kind==='characters'?'character':kind==='weapons'?'weapon':'artifact'}-${x.id}.png`),x.name)}}});
test('weapon and artifact image mapping uses ID-specific files',()=>{for(const name of ['Uraku Misugiri','Peak Patrol Song','Splendor of Tranquil Waters','Favonius Sword','Harbinger of Dawn'])assert.ok(existsSync(`public/assets/icons/weapon-${named('weapons',name).id}.png`));for(const name of ['Husk of Opulent Dreams','Golden Troupe','Tenacity of the Millelith','Marechaussee Hunter']){const set=named('artifacts',name);assert.ok(set?.pieces?.['0']);assert.match(set.pieces['0'],new RegExp(`_${set.id}_4\\.png$`))}});
test('sourced recommendations keep contextual metadata, main DPS and do not force Furina',()=>{let all=[];for(const [id,g] of Object.entries(guides)){assert.ok(g.sourceUrl.startsWith('https://keqingmains.com/'));for(const v of g.variants){for(const group of ['weapons','artifacts','talents','teams'])for(const rec of v[group]){assert.ok(rec.sourceUrl&&rec.version&&rec.lastUpdated&&rec.buildId);if(group==='teams'){assert.equal(rec.memberIds[0],rec.mainDpsId);assert.equal(new Set(rec.memberIds).size,4);all.push(rec)}}}}assert.ok(all.length>=4);assert.ok(all.some(t=>!t.members.includes('Furina')));assert.ok(guides['10000089'].variants[0].weapons.some(x=>x.isSignature&&!x.isBiS))});
test('wish imports merge reimports and preserve legitimate duplicates in same second',()=>{const list=parseWishJSON({list:[{id:'101',time:'2026-09-22 10:00:01',name:'Furina',gacha_type:'301',rank_type:'5',uid:'888888888'},{id:'102',time:'2026-09-22 10:00:01',name:'Furina',gacha_type:'301',rank_type:'5',uid:'888888888'}]});assert.equal(mergeWishes(list,list).length,2);assert.equal(calculateWishStats(list,'301').total,2);assert.equal(calculateWishStats(list,'301').average,1)});
test('Paimon.moe Settings backup resolves legacy IDs and preserves pity',()=>{const entries=parseWishJSON({'123-wish-counter-character-event':{pulls:[{id:'albedo',time:'2025-02-01 11:12:13',pity:47,type:'character'}]}});assert.equal(entries[0].itemName,'Albedo');assert.equal(entries[0].pityAtPull,47);assert.equal(mergeWishes(entries,entries).length,1)});
test('planner gives ceiling, not fabricated probability',()=>{assert.deepEqual(planWishes({primogems:1600,fates:0,pity:0,guaranteed:false,constellations:0}),{available:10,worst:180,shortfall:170,primogemsNeeded:27200});assert.equal(planWishes({primogems:0,fates:5,pity:70,guaranteed:true,constellations:0}).worst,20)});
test('Enka normalization only uses documented public fields',()=>{const x=normaliseEnka({playerInfo:{nickname:'Traveler',level:60},avatarInfoList:[{avatarId:10000038,propMap:{4001:{ival:'90'}},talentIdList:[101],equipList:[{itemId:11514,weapon:{level:90,affixMap:{1:0}},flat:{icon:'UI_EquipIcon_Sword_Needle',weaponStats:[]}}]}],ttl:270},'888888888');assert.equal(x.characters[0].name,'Albedo');assert.equal(x.characters[0].level,90);assert.equal(x.characters[0].weapon.refinement,1);assert.equal(x.ttl,270);assert.equal(x.showcase,true);assert.equal(normaliseEnka({playerInfo:{nickname:'Empty'},ttl:300},'888888888').showcase,false)});
test('invalid UID rejected before network',async()=>{await assert.rejects(fetchEnka('oops'),e=>e instanceof PublicError&&e.status===400)});

// Focused polish regression tests: character art/theme and four distinct talent states.
test('dashboard spotlight resolves Clorinde through verified ID and Electro palette',async()=>{
  const {getCharacterSplash,assetRegistry}=await import('../src/lib/assets.js');
  const {getElementTheme}=await import('../src/lib/elementTheme.js');
  const clorinde=cat.characters.find(x=>x.name==='Clorinde');
  assert.equal(clorinde.id,'10000098');assert.equal(clorinde.element,'Electro');assert.equal(clorinde.weaponType,'Sword');
  assert.equal(getCharacterSplash(clorinde.id),'/assets/clorinde-splash.png');assert.ok(existsSync(`public${getCharacterSplash(clorinde.id)}`));
  assert.equal(assetRegistry.splashes.get(clorinde.id),getCharacterSplash(clorinde.id));
  assert.notEqual(getElementTheme('Electro').primary,getElementTheme('Geo').primary);
  assert.notEqual(getElementTheme('Hydro').primary,getElementTheme('Electro').primary);
});
test('talent recommendation has four non-conflated presentation states',async()=>{
  const {talentState,currentTalentLevel,initialTalentTargets}=await import('../src/lib/talents.js');
  const kqm='https://keqingmains.com/q/albedo-quickguide/';
  assert.deepEqual(talentState({talentId:'skill',priority:'PRIMARY',recommendedLevel:10,levelSpecified:true,levelSource:kqm,sourceUrl:kqm}).kind,'numeric');
  const unknown=talentState({talentId:'skill',priority:'PRIMARY',recommendedLevel:null,levelSpecified:false,levelSource:null,sourceUrl:kqm});
  assert.equal(unknown.kind,'priority-only');assert.equal(unknown.target,null);assert.equal(unknown.priority,'PRIMARY');
  const leave=talentState({talentId:'normal',priority:'LOW',recommendedLevel:1,levelSpecified:true,levelSource:kqm,sourceUrl:kqm});
  assert.equal(leave.kind,'not-required');assert.equal(leave.target,1);
  assert.equal(talentState(null).kind,'unavailable');
  assert.equal(talentState({priority:'PRIMARY',recommendedLevel:0,levelSpecified:true,levelSource:kqm,sourceUrl:kqm}).kind,'priority-only');
  assert.deepEqual(initialTalentTargets(guides['10000038']),{normal:1,skill:null,burst:null});
  assert.equal(currentTalentLevel({skillLevelMap:{10386:8,10387:10}},'10000038','normal'),8);
  assert.equal(currentTalentLevel({skillLevelMap:{10386:8,10387:10}},'10000038','burst'),null);
});
test('all characters have an honest dossier; linked sources never masquerade as reviewed builds',()=>{
 const sources=JSON.parse(readFileSync('src/data/kqmDirectory.json'));
 const lore=JSON.parse(readFileSync('src/data/characterLore.json'));
 const loreIds=JSON.parse(readFileSync('src/data/loreCharacterIds.json'));assert.deepEqual(loreIds,Object.keys(lore).sort());
 assert.equal(cat.characters.length,154);assert.equal(Object.keys(sources).length,133);assert.equal(Object.keys(lore).length,126);
 const ids=new Set(cat.characters.map(c=>c.id));
 for(const [id,x] of Object.entries(sources)){assert.ok(ids.has(id),id);assert.equal(x.characterId,id);assert.ok(x.quick||x.extended||x.infographic||x.infographics?.length);for(const entry of [x.quick,x.extended,x.infographic,...(x.infographics||[])].filter(Boolean)){assert.match(entry.url,/^https:\/\/keqingmains\.com\//);assert.ok(entry.version)}}
 for(const [id,x] of Object.entries(lore)){assert.ok(ids.has(id),id);assert.equal(x.characterId,id);assert.equal(x.source,'Paimon.moe game text');assert.match(x.sourceUrl,/^https:\/\/github\.com\/MadeBaruna\/paimon-moe\/blob\/main\/src\/data\/characterData\//);for(const key of ['normal','skill','burst'])assert.ok(x.skills[key]?.name);assert.ok(x.constellations.length>=1)}
 for(const id of Object.keys(guides))assert.ok(sources[id]?.quick||sources[id]?.extended);
 assert.equal(sources['10000098'].quick.url,'https://keqingmains.com/q/clorinde-quickguide/');
 assert.equal(lore['10000098'].skills.skill.name.length>1,true);
 assert.equal(guides['10000098'].sourceUrl,sources['10000098'].quick.url);assert.equal(guides['10000098'].status,'REVIEW NEEDED');assert.ok(guides['10000098'].variants[0].teams.every(t=>t.memberIds[0]===t.mainDpsId));
});
test('KQM source transcription is locally structured and never marked editorially reviewed',()=>{
 const notes=JSON.parse(readFileSync('src/data/kqmBuildNotes.json'));
 const ids=JSON.parse(readFileSync('src/data/kqmNoteIds.json'));
 const directory=JSON.parse(readFileSync('src/data/kqmDirectory.json'));
 assert.equal(ids.length,130);assert.deepEqual(ids,Object.keys(notes).sort());
 let withWeapons=0,withArtifacts=0,withStats=0,withTalents=0;
 for(const [id,n] of Object.entries(notes)){
  assert.ok(cat.characters.some(c=>c.id===id));assert.equal(n.characterId,id);assert.equal(n.status,'REVIEW NEEDED');assert.equal(n.lastReviewed,null);assert.match(n.lastUpdated||'',/^202\d-\d\d-\d\d$/);
  assert.match(n.sourceUrl,/^https:\/\/keqingmains\.com\//);assert.equal(n.sourceUrl,(directory[id].quick||directory[id].extended).url);
  assert.ok(Array.isArray(n.weapons)&&Array.isArray(n.artifacts)&&Array.isArray(n.talents));assert.equal(n.teams.length,0);
  withWeapons+=Boolean(n.weapons.length);withArtifacts+=Boolean(n.artifacts.length);withStats+=Boolean(Object.keys(n.mainStats).length);withTalents+=Boolean(n.talentPriorityText);
  for(const w of n.weapons)assert.ok(cat.weapons.some(x=>x.id===w.id&&x.name===w.name));
  for(const a of n.artifacts)assert.ok(cat.artifacts.some(x=>x.id===a.id&&x.name===a.name));
  for(const t of n.talents){if(t.levelSpecified){assert.match(n.sourceUrl,/electro-traveler/);assert.ok([1,7].includes(t.recommendedLevel));assert.equal(t.levelSource,n.sourceUrl)}else assert.equal(t.recommendedLevel,null);assert.ok(t.sourceUrl===n.sourceUrl);assert.match(t.reason,/Source priority:|KQM:/)}
 }
 assert.ok(withWeapons>=100);assert.ok(withArtifacts>=90);assert.ok(withStats>=110);assert.ok(withTalents>=120);
 assert.equal(notes['10000098'].weapons[0].name,'Absolution');assert.equal(notes['10000098'].artifacts[0].name,'Fragment of Harmonic Whimsy');
});
test('asset registry uses only verified PNGs; unavailable set icons do not resolve to a different image',async()=>{
 const {getCharacterIcon,getWeaponIcon,getArtifactSetIcon,getArtifactPieceIcon,getTalentIcon,getConstellationIcon,fallbackIcon}=await import('../src/lib/assets.js');
 const manifest=JSON.parse(readFileSync('src/data/assetManifest.json'));
 for(const [type,ids] of Object.entries(manifest)){for(const id of ids.slice(0,10)){const path=`public/assets/icons/${type}-${id}.png`;assert.ok(existsSync(path),path);assert.equal(readFileSync(path).subarray(0,8).toString('hex'),'89504e470d0a1a0a')}}
 for(const c of cat.characters.slice(0,10)){assert.ok(getCharacterIcon(c.id).includes(c.id));for(const i of [0,1,2]){const icon=getTalentIcon(c.id,i);if(icon!==fallbackIcon)assert.ok(existsSync(`public${icon}`))}}
 for(const w of cat.weapons.slice(0,10))assert.ok(getWeaponIcon(w.id).includes(w.id));
 for(const a of cat.artifacts.slice(0,10)){const icon=getArtifactSetIcon(a.id);if(icon!==fallbackIcon)assert.ok(existsSync(`public${icon}`));for(let slot=0;slot<5;slot++){const piece=getArtifactPieceIcon(a.id,slot);if(piece!==fallbackIcon)assert.ok(existsSync(`public${piece}`))}}
 assert.equal(getArtifactSetIcon('15004'),fallbackIcon);assert.equal(getArtifactSetIcon('15012'),fallbackIcon);
 assert.ok(getConstellationIcon('10000098',0).includes('10000098-3'));
});
test('reimport dedupes across compatible formats without discarding legitimate same-second pulls',()=>{
 const a=parseWishJSON({list:[{id:'one',time:'2026-09-22 10:00:01',name:'Furina',gacha_type:'301',rank_type:'5',uid:'888888888'},{id:'two',time:'2026-09-22 10:00:01',name:'Furina',gacha_type:'301',rank_type:'5',uid:'888888888'}]});
 const b=parseWishJSON({list:[{id:'three',time:'2026-09-22 10:00:01',name:'Furina',item_id:'10000089',gacha_type:'301',rank_type:'5',uid:'888888888'}]});
 assert.equal(mergeWishes(a,b).length,2);assert.equal(mergeWishes(a,a).length,2);
});
test('wish import rejects credential-bearing or lookalike history URLs before fetching',async()=>{
 const {importWishHistory}=await import('../server/services.js');
 for(const url of ['https://evil.test/gacha_info/api/getGachaLog?authkey=x','http://hk4e-api-os.mihoyo.com/gacha_info/api/getGachaLog?authkey=x','https://u:p@hk4e-api-os.mihoyo.com/gacha_info/api/getGachaLog?authkey=x','https://hk4e-api-os.mihoyo.com/a/gacha_info/api/getGachaLog?authkey=x']){
  await assert.rejects(importWishHistory(url),e=>e instanceof PublicError&&e.status===400);
 }
});

test('ascension stat metadata is separately sourced for each character',()=>{for(const c of cat.characters){assert.equal(c.ascensionStat,c.ascension[0]?.name);assert.equal(c.ascensionStatValue,c.ascension[0]?.value)}assert.equal(named('characters','Clorinde').ascensionStat,'CRIT Rate');assert.equal(named('characters','Clorinde').ascensionStatValue,19.2)});
test('Paimon and UIGF account identifiers survive import for mixed-account safety',()=>{
 const paimon=parseWishJSON({'888888888-wish-counter-character-event':{pulls:[{id:'albedo',time:'2026-09-22 10:00:01',pity:12}]}});
 assert.equal(paimon[0].uid,'888888888');
 const uigf=parseWishJSON({genshin:[{uid:'777777777',list:[{id:'1',time:'2026-09-22 10:00:01',name:'Albedo',gacha_type:'301',rank_type:'5'}]}]});
 assert.equal(uigf[0].uid,'777777777');
});
test('editorial team rosters are unique, source-linked and explicitly main-DPS-first',()=>{
 const seen=new Set();for(const [id,g] of Object.entries(guides))for(const v of g.variants)for(const team of v.teams){assert.ok(team.sourceUrl.startsWith('https://keqingmains.com/'));assert.equal(team.memberIds[0],team.mainDpsId);assert.equal(team.members.length,4);assert.equal(new Set(team.memberIds).size,4);const key=`${id}:${[...team.memberIds].sort().join(':')}`;assert.ok(!seen.has(key),key);seen.add(key)}
 const cl=guides['10000098'];assert.ok(cl.variants[0].teams.some(t=>t.archetype.includes('Aggravate')));assert.ok(cl.variants[0].teams.some(t=>t.archetype.includes('Overload')));assert.equal(cl.variants[0].weapons.find(w=>w.name==='Absolution').isBiS,true);assert.ok(!cl.variants[0].talents.some(t=>t.recommendedLevel!=null));
});
test('Enka artifact stat labels show source values without converting percentages twice',async()=>{
 const {formatEnkaProp}=await import('../src/lib/stats.js');assert.equal(formatEnkaProp('FIGHT_PROP_CRITICAL',3.9),'CRIT Rate 3.9%');assert.equal(formatEnkaProp('FIGHT_PROP_ELEMENT_MASTERY',23),'Elemental Mastery 23');assert.equal(formatEnkaProp(null,null),'Stat unavailable');
});

test('transcribed talent expression remains priority-only without invented numeric targets',async()=>{const {talentState}=await import('../src/lib/talents.js');const n=JSON.parse(readFileSync('src/data/kqmBuildNotes.json'))['10000098'];assert.equal(talentState(n.talents.find(t=>t.talentId==='skill')).kind,'priority-only');assert.equal(talentState(n.talents.find(t=>t.talentId==='burst')).target,null);assert.equal(talentState(n.talents.find(t=>t.talentId==='normal')).kind,'unavailable')});
test('ascension material stages are source-matched, ID-mapped and icons are neutral if missing',async()=>{
 const chars=JSON.parse(readFileSync('src/data/characterMaterials.json'));
 const mats=JSON.parse(readFileSync('src/data/materialCatalog.json'));
 assert.equal(Object.keys(chars).length,126);assert.equal(Object.keys(mats).length,514);
 for(const [id,record] of Object.entries(chars)){assert.ok(cat.characters.some(c=>c.id===id));assert.equal(record.ascension.length,6);assert.equal(record.ascension.reduce((n,stage)=>n+(stage.mora||0),0),420000);assert.equal(record.source,'Paimon.moe character data');for(const stage of record.ascension)for(const item of stage.items){assert.ok(mats[item.id]?.name,item.id);assert.ok(item.amount>0)}}
 assert.equal(chars['10000098'].ascension[0].items.find(x=>x.id==='lumitoile').amount,3);
 assert.equal(chars['10000098'].ascension[5].items.find(x=>x.id==='lumitoile').amount,60);
 assert.equal(chars['10000098'].talent.weeklyBoss,'everamber');
 const {getMaterialIcon}=await import('../src/lib/assets.js');
 for(const m of Object.values(mats)){const path=getMaterialIcon(m.id);if(m.icon){assert.ok(existsSync(`public${path}`));assert.equal(readFileSync(`public${path}`).subarray(0,8).toString('hex'),'89504e470d0a1a0a')}else assert.equal(path,(await import('../src/lib/assets.js')).fallbackIcon)}
});
test('ascension resource plan requires explicit completed stages and never infers them from Enka level',async()=>{
 const {planAscensions}=await import('../src/lib/materials.js');const records=JSON.parse(readFileSync('src/data/characterMaterials.json'));
 const cl=records['10000098'];assert.equal(planAscensions(cl,null,6),null);assert.deepEqual(planAscensions(cl,6,6).items,[]);assert.equal(planAscensions(cl,6,6).mora,0);assert.equal(planAscensions(cl,6,5),null);
 const final=planAscensions(cl,5,6,{lumitoile:12});assert.equal(final.mora,120000);assert.deepEqual(final.items.find(x=>x.id==='lumitoile'),{id:'lumitoile',required:60,owned:12,remaining:48});
 const all=planAscensions(cl,0,6);assert.equal(all.items.find(x=>x.id==='lumitoile').owned,null);assert.equal(all.items.find(x=>x.id==='lumitoile').remaining,null);assert.equal(all.mora,420000);assert.equal(all.items.find(x=>x.id==='lumitoile').required,168);
});
test('source roster captions are genuine ID-matched examples, not fabricated role-ordered teams',()=>{
 const notes=JSON.parse(readFileSync('src/data/kqmBuildNotes.json'));const ids=new Set(cat.characters.map(c=>c.id));
 assert.ok(Object.values(notes).filter(n=>n.sourceRosters?.length).length>=100);
 for(const n of Object.values(notes)){
  const seen=[];
  for(const r of n.sourceRosters||[]){assert.equal(r.memberIds.length,4);assert.equal(new Set(r.memberIds).size,4);assert.equal(r.mainDpsId,null);assert.equal(r.rolesVerified,false);assert.equal(r.sourceUrl,n.sourceUrl);for(const id of r.memberIds)assert.ok(ids.has(id));assert.ok(seen.every(prev=>prev.filter(id=>r.memberIds.includes(id)).length<3));seen.push(r.memberIds)}
 }
});

test('talent costs charge only independent base-level deltas, never already completed upgrades',async()=>{
 const {planTalent,planGoalResources,planCharacterExp,planWeaponExp}=await import('../src/lib/resourcePlan.js');const profiles=JSON.parse(readFileSync('src/data/characterMaterials.json'));const cl=profiles['10000098'];
 const two=planTalent(8,10,cl);assert.equal(two.status,'ok');assert.equal(two.mora,1150000);assert.deepEqual(two.books,[0,0,28]);assert.equal(two.weekly,4);assert.equal(two.crown,1);
 assert.equal(two.items.find(x=>x.id==='everamber').required,4);
 assert.equal(planTalent(1,6,cl).mora,122500);
 assert.equal(planTalent(9,9,cl).mora,0);assert.equal(planTalent(10,10,cl).items.length,0);
 assert.equal(planTalent(10,9,cl).status,'invalid');assert.equal(planTalent(null,10,cl).status,'unknown');
 const mixed=planGoalResources({characterId:'10000098',currentLevel:80,targetLevel:90,currentWeapon:90,targetWeapon:90,talentCurrent:{normal:1,skill:9,burst:8},talentTargets:{normal:6,skill:10,burst:8},ascensionFrom:5,ascensionTo:6,materialCounts:{}},cl,5);
 assert.equal(mixed.talents.normal.mora,122500);assert.equal(mixed.talents.skill.mora,700000);assert.equal(mixed.talents.burst.mora,0);assert.equal(mixed.character.exp,3423125);assert.equal(mixed.weapon.exp,0);
 assert.equal(mixed.ascension.mora,120000);assert.equal(mixed.items.find(x=>x.id==='lumitoile').remaining,null);
 assert.equal(planCharacterExp(80,80).exp,0);assert.equal(planWeaponExp(80,90,5).exp>0,true);
});
test('GOOD, gcsim and manual imports retain independent provenance; absence is unknown without complete roster',async()=>{
 const {parseGOOD,parseGCSIM,mergeBuildSources,addManualBuild,effectiveCharacter,ownershipStatus}=await import('../src/lib/buildImports.js');
 const good=parseGOOD({format:'GOOD',version:3,source:'Fixture',characters:[{key:'Clorinde',level:90,constellation:1,talent:{auto:1,skill:9,burst:8}},{key:'Furina',level:80,ascension:5,constellation:0,talent:{auto:1,skill:8,burst:8}}],weapons:[{key:'Absolution',level:90,refinement:1,location:'Clorinde'}],artifacts:[{setKey:'FragmentOfHarmonicWhimsy',slotKey:'flower',rarity:5,level:20,mainStatKey:'hp',substats:[],location:'Clorinde'}]},{rosterComplete:false});
 const sim=parseGCSIM('clorinde char lvl=80/90 cons=0 talent=1,8,8;clorinde add weapon="finaleofthedeep" refine=5 lvl=80/90;clorinde add set="thunderingfury" count=4;');
 let sources=mergeBuildSources({},good);sources=mergeBuildSources(sources,sim);sources=mergeBuildSources(sources,addManualBuild({characterId:'10000098',level:70,owned:true}));
 assert.equal(good.characters[0].artifacts[0].setId,'15035');assert.equal(sim.characters[0].weapon.refinement,5);
 assert.equal(effectiveCharacter(null,sources,'10000098').dataSource,'GOOD');assert.equal(ownershipStatus(null,sources,'10000098').kind,'owned');
 assert.equal(ownershipStatus(null,sources,'10000052').kind,'unknown');
 const full=mergeBuildSources(sources,parseGOOD({format:'GOOD',version:3,characters:[{key:'Furina',level:80,talent:{auto:1,skill:8,burst:8}}]}, {rosterComplete:true}));
 assert.equal(ownershipStatus(null,full,'10000098').kind,'owned'); // Explicit manual claim survives a GOOD replacement.
 assert.equal(ownershipStatus(null,full,'10000052').kind,'unowned');
 const enka={characters:[{id:'10000098',level:89,skillLevelMap:{},artifacts:[],source:'ENKA'}]};
 assert.equal(effectiveCharacter(enka,sources,'10000098').level,89);
 assert.equal(sources.good.characters[0].level,90); // Richer inventory was not overwritten.
});
test('Enka propagates documented status codes and caches only until ttl expires',async()=>{
 const {fetchEnka,PublicError}=await import('../server/services.js'),original=globalThis.fetch;
 try{for(const code of [400,404,424,429,500,503]){globalThis.fetch=async()=>({ok:false,status:code});await assert.rejects(fetchEnka(`88888888${code===400?0:code===404?1:code===424?2:code===429?3:code===500?4:5}`),e=>e instanceof PublicError&&e.status===code&&!!e.message)}
 let hits=0;globalThis.fetch=async(url,options)=>{hits++;assert.equal(url,'https://enka.network/api/uid/888888999');assert.equal(options.redirect,'error');assert.match(options.headers['User-Agent'],/^GenshinTrack\/1\.0/);return {ok:true,json:async()=>({ttl:120,playerInfo:{nickname:'Fixture'},avatarInfoList:[]})}};
 const a=await fetchEnka('888888999');const b=await fetchEnka('888888999');assert.equal(hits,1);assert.equal(b.fromCache,true);assert.ok(a.expiresAt-a.fetchedAt>=120000);
 }finally{globalThis.fetch=original}
});

test('weapon ascension plan charges only manually selected stages for the exact matched weapon',async()=>{
 const {planGoalResources}=await import('../src/lib/resourcePlan.js');const profiles=JSON.parse(readFileSync('src/data/weaponMaterials.json'));const materials=JSON.parse(readFileSync('src/data/characterMaterials.json'));
 assert.ok(Object.keys(profiles).length>=250);
 const fw=profiles[named('weapons','Finale of the Deep').id];const g={characterId:'10000098',currentLevel:80,targetLevel:80,currentWeapon:80,targetWeapon:90,weaponAscensionFrom:5,weaponAscensionTo:6,talentCurrent:{normal:1,skill:9,burst:8},talentTargets:{normal:1,skill:9,burst:8},materialCounts:{}};
 const plan=planGoalResources(g,materials['10000098'],4,fw);assert.equal(plan.weapon.status,'ok');assert.equal(plan.weaponAscension.mora,45000);assert.equal(plan.ascension,null);assert.ok(plan.weaponAscension.items.length>=3);assert.equal(plan.items.find(x=>x.id===fw.ascension[5].items[0].id).required,fw.ascension[5].items[0].amount);
 assert.equal(planGoalResources({...g,weaponAscensionFrom:null},materials['10000098'],4,fw).weaponAscension,null);
});

test('reviewed teams require distinct IDs, explicit main DPS, source metadata, and no near-swap duplicates',async()=>{
 const {auditTeamVariety,teamSimilarity}=await import('../src/lib/teams.js');for(const g of Object.values(guides))for(const v of g.variants){assert.deepEqual(auditTeamVariety(v.teams),[]);for(const t of v.teams){assert.equal(t.memberIds[0],t.mainDpsId);assert.equal(t.roles.length,4);assert.ok(t.reaction&&t.playstyle&&t.rotationContext&&t.requirements.length&&t.sourceUrl&&t.version&&t.lastReviewed&&t.lastUpdated&&t.notes)}}
 assert.equal(teamSimilarity({memberIds:['A','B','C','D'],archetype:'One'},{memberIds:['A','B','C','E'],archetype:'One'}).requiresEditorialReason,true);
 assert.equal(teamSimilarity({memberIds:['A','B','C','D'],archetype:'One'},{memberIds:['A','B','C','E'],archetype:'One',alternativeReason:'Different gameplay requirements'}).requiresEditorialReason,false);
});

test('artifact effects distinguish one-piece sets and do not invent missing historical data',()=>{const meta=JSON.parse(readFileSync('src/data/entityMeta.json')).artifacts;assert.equal(meta['Prayers for Destiny'].setPiece[0],1);assert.ok(meta['Prayers for Destiny'].bonus1);assert.equal(meta['Prayers for Destiny'].bonus2,null);assert.ok(meta['Golden Troupe'].bonus2&&meta['Golden Troupe'].bonus4&&meta['Golden Troupe'].bonusSourceUrl);assert.ok(!meta['Glacier and Snowfield']?.bonus4);assert.ok(!meta['Prayers to the Firmament']?.bonus4)});

test('GOOD UID and manual inputs retain validation without guessing ownership',async()=>{const {parseGOOD,addManualBuild,ownershipStatus,mergeBuildSources}=await import('../src/lib/buildImports.js');const good=parseGOOD({format:'GOOD',version:3,uid:888888888,characters:[{key:'Clorinde',level:80,ascension:5,talent:{auto:1,skill:8,burst:8}}]});assert.equal(good.uid,'888888888');assert.equal(good.characters[0].ascensionStage,5);assert.equal(ownershipStatus(null,mergeBuildSources({},good),'10000089').kind,'unknown');assert.throws(()=>addManualBuild({characterId:'10000089',level:999}),/Invalid level/)});

test('partial GOOD reimports add a character but cannot erase richer weapon/artifact inventory',async()=>{
 const {parseGOOD,mergeBuildSources}=await import('../src/lib/buildImports.js');const full=parseGOOD({format:'GOOD',version:3,uid:'888888888',characters:[{key:'Clorinde',level:80,talent:{auto:1,skill:8,burst:8}}],weapons:[{key:'Absolution',level:90,refinement:1,location:'Clorinde'}],artifacts:[{setKey:'FragmentOfHarmonicWhimsy',slotKey:'flower',level:20,rarity:5,mainStatKey:'hp',location:'Clorinde'}]},{rosterComplete:true});const partial=parseGOOD({format:'GOOD',version:3,uid:'888888888',characters:[{key:'Clorinde',level:90},{key:'Furina',level:70}]});const merged=mergeBuildSources(mergeBuildSources({},full),partial).good;assert.equal(merged.characters.length,2);assert.equal(merged.characters.find(c=>c.name==='Clorinde').weapon?.name,'Absolution');assert.equal(merged.artifactInventory.length,1);assert.equal(merged.weaponInventory.length,1);assert.equal(merged.rosterComplete,true);
 assert.throws(()=>mergeBuildSources({good:full},parseGOOD({format:'GOOD',version:3,uid:'777777777',characters:[{key:'Furina',level:70}]})),/does not match/)
});
