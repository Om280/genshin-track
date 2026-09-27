import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {guideRegistry,guideExceptions,guideCoverage} from '../src/data/guides.js';
import {auditTeamVariety} from '../src/lib/teams.js';
const catalog=JSON.parse(readFileSync('src/data/catalog.json'));
const queue=JSON.parse(readFileSync('src/data/guideQueue.json'));
const byWeapon=new Map(catalog.weapons.map(x=>[x.id,x]));
const bySet=new Map(catalog.artifacts.map(x=>[x.id,x]));
const byWeaponName=new Map(catalog.weapons.map(x=>[x.name,x]));
const bySetName=new Map(catalog.artifacts.map(x=>[x.name,x]));
const entityMeta=JSON.parse(readFileSync('src/data/entityMeta.json'));
const knownIds=new Set(catalog.characters.map(x=>x.id));
const verifiedSetPieces=new Set();

test('154-source guide queue: no empty structured profile and no unexplained exception',()=>{
 assert.equal(catalog.characters.length,154);assert.equal(queue.length,154);
 const queued=new Map(queue.map(x=>[x.characterId,x]));assert.equal(queued.size,154);
 let validated=0,unverified=0;
 for(const c of catalog.characters){
  const q=queued.get(c.id),g=guideRegistry[c.id],exception=guideExceptions[c.id];assert.ok(q,`missing queue ${c.id}`);
  if(!g){unverified++;assert.equal(q.guideStatus,'unverified',c.id);assert.ok(exception?.reason?.length>45,c.id);assert.ok(exception?.sourceStatus?.length>25,c.id);assert.equal(c.element,'None');continue;}
  assert.equal(q.guideStatus,g.guideStatus,c.id);assert.equal(g.characterId,c.id);assert.ok(g.summary.length>65,c.id);
  assert.ok(/^https:\/\//.test(g.sourceUrl)&&g.source&&g.sourceVersion&&g.lastUpdated&&(g.reviewedAt||g.sourceIndexedAt)&&g.freshnessStatus,c.id);
  assert.ok(['reviewed','source_structured'].includes(g.guideStatus),c.id);
  assert.ok(g.variants.length>=1,c.id);
  for(const v of g.variants){
   assert.ok(v.name&&v.description?.length>55,c.id);
   assert.ok(v.weapons.length>=1,c.id+' weapons');assert.ok(v.artifacts.length>=1,c.id+' artifacts');
   for(const w of v.weapons){const item=w.id?byWeapon.get(w.id):byWeaponName.get(w.name);assert.equal(item?.name,w.name,`${c.name}: ${w.name}`);assert.ok(w.context&&w.sourceUrl===g.sourceUrl&&w.version&&w.lastUpdated&&w.buildId);assert.ok(existsSync(`public/assets/icons/weapon-${item.id}.png`),`${c.name}: missing weapon asset ${w.name}`);assert.ok(entityMeta.weapons[w.name]?.baseAtk90&&entityMeta.weapons[w.name]?.passive,`${c.name}: missing weapon data ${w.name}`)}
   for(const a of v.artifacts){assert.equal((a.id?bySet.get(a.id):bySetName.get(a.name))?.name,a.name,`${c.name}: ${a.name}`);assert.ok(a.context&&a.sourceUrl===g.sourceUrl&&a.version&&a.lastUpdated&&a.buildId);const item=a.id?bySet.get(a.id):bySetName.get(a.name);assert.ok(existsSync(`public/assets/icons/artifact-${item.id}.png`),`${c.name}: missing set image ${a.name}`);assert.ok(entityMeta.artifacts[a.name]?.bonus2&&entityMeta.artifacts[a.name]?.bonus4,`${c.name}: unverified set bonus ${a.name}`);verifiedSetPieces.add(item.id)}
   for(const slot of ['sands','goblet','circlet'])assert.ok(v.mainStats?.[slot],`${c.name}: ${slot}`);
   assert.ok(v.substats,`${c.name} substats`);
   assert.ok(v.talents.length||g.teamDataStatus,`${c.name} talent data must be explicit`);
   for(const t of v.talents){assert.ok(t.talentId&&t.version&&t.buildId);assert.ok(t.reason||t.priority);if(t.levelSpecified)assert.ok(t.levelSource&&t.recommendedLevel>0,`${c.name} numeric talent`)}
   assert.ok(v.teams.length||g.sourceRosters?.length||g.teamDataStatus,`${c.name} team status`);
   assert.deepEqual(auditTeamVariety(v.teams),[],`${c.name} near-duplicate teams`);
   for(const team of v.teams){assert.equal(team.memberIds.length,4);assert.equal(team.memberIds[0],team.mainDpsId);assert.ok(team.memberIds.every(id=>knownIds.has(id)));assert.equal(team.roles.length,4);assert.ok(team.sourceUrl&&team.source&&team.version&&team.lastUpdated)}
   assert.ok(g.farmingSource,`${c.name} farming field must be explicit`);
  }
  validated++;
 }
 for(const id of verifiedSetPieces)for(let slot=0;slot<5;slot++)assert.ok(existsSync(`public/assets/icons/artifact-piece-${id}-${slot}.png`),`artifact ${id} slot ${slot}`);assert.ok(verifiedSetPieces.size>=40);
 assert.equal(validated,150);assert.equal(unverified,4);assert.equal(guideCoverage.structured,validated);assert.equal(guideCoverage.reviewed,3);assert.equal(guideCoverage.unverified,unverified);
});

test('actual build sections exist in every element and required Clorinde squads retain exact order',()=>{
 const samples={Pyro:'10000096',Hydro:'10000089',Cryo:'10000002',Electro:'10000098',Geo:'10000038',Anemo:'10000022',Dendro:'10000073'};
 for(const [element,id] of Object.entries(samples)){const c=catalog.characters.find(x=>x.id===id),g=guideRegistry[id],v=g?.variants[0];assert.equal(c?.element,element);assert.ok(g.summary&&v.weapons.length&&v.artifacts.length&&v.mainStats.sands&&v.talents.length&&g.sourceUrl&&g.freshnessStatus,element)}
 const cl=guideRegistry['10000098'].variants[0].teams;
 assert.deepEqual(cl.find(t=>t.id==='cl-aggravate-fischl-nahida-kazuha').members,['Clorinde','Fischl','Nahida','Kaedehara Kazuha']);
 const overload=cl.find(t=>t.id==='cl-overload-fischl-durin-chevreuse');assert.deepEqual(overload.members,['Clorinde','Fischl','Durin','Chevreuse']);assert.deepEqual(overload.roles,['MAIN DPS','SUB DPS','PYRO OFF-FIELD','SUPPORT']);assert.match(overload.sourceUrl,/durin-quickguide/);
});

test('source-linked team mix audit reports Furina share without altering legitimate teams',()=>{
 const teams=Object.values(guideRegistry).flatMap(g=>g.variants.flatMap(v=>v.teams));
 const furina=catalog.characters.find(x=>x.name==='Furina').id;
 const count=teams.filter(t=>t.memberIds.includes(furina)).length;
 assert.ok(teams.length>=9);assert.ok(count<=teams.length/2,`Furina appears in ${count}/${teams.length} teams`);
 console.log(`Curated team audit: Furina ${count}/${teams.length}; source rosters without role review excluded.`);
});
