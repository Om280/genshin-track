import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
import catalog from '../src/data/catalog.json' with {type:'json'};
import splashManifest from '../src/data/splashManifest.json' with {type:'json'};
import {getCharacterIcon,getCharacterSplash,getCharacterCard} from '../src/lib/assets.js';
import {earlyConstellations} from '../src/data/earlyConstellations.js';
import {planLeyLineScenario,leyLineAssumptions} from '../src/lib/resinScenario.js';
import {planTalent,planGoalResources} from '../src/lib/resourcePlan.js';
import {scheduleForDay} from '../src/lib/farming.js';
import materialCatalog from '../src/data/materialCatalog.json' with {type:'json'};

test('154 guide heroes use cached, verified full gacha art by ID, never a portrait fallback',()=>{
 assert.equal(catalog.characters.length,154);
 for(const c of catalog.characters){const record=splashManifest[c.id];assert.ok(record?.path&&record.sourceUrl.includes('/ui/UI_Gacha_AvatarImg_'),c.name+' '+c.id);assert.ok(existsSync('public'+record.path),record.path);const path=getCharacterSplash(c.id);assert.ok(path&&existsSync('public'+path),c.name);assert.notEqual(path,getCharacterIcon(c.id),c.name);assert.equal(getCharacterCard(c.id),null,'unverified card art must not be forged');}
 assert.notEqual(getCharacterSplash('10000098'),getCharacterSplash('10000089'));
 // Male gacha-art suffixes are the reverse of Enka's matching portrait suffixes.
 assert.match(splashManifest['10000005'].sourceUrl,/MannequinBoy\.png$/);
 assert.match(splashManifest['10000117-11701'].sourceUrl,/PlayerBoy\.png$/);
});
test('reviewed early constellations are optional, evidence-linked and never generated for missing evidence',()=>{
 assert.equal(Object.keys(earlyConstellations).length,13);
 for(const [id,row] of Object.entries(earlyConstellations)){assert.ok(row.level>0&&row.level<=6&&row.effect&&row.reason&&row.reviewedAt&&row.sourceVersion&&row.reviewScope&&row.sourceUrl.includes('keqingmains.com'),id)}
 assert.equal(earlyConstellations['10000098'].level,2);assert.equal(earlyConstellations['10000038'].level,2);
});
test('sourced gross Resin scenario uses only fixed ley-line costs and explicit EXP reward range',()=>{
 const one=planLeyLineScenario(250000,120001);assert.deepEqual(one.exp,{min:40,max:60});assert.equal(one.mora,60);assert.equal(one.totalMin,100);assert.equal(one.totalMax,120);assert.equal(leyLineAssumptions.resinPerClaim,20);
 assert.deepEqual(planLeyLineScenario(0,0).exp,{min:0,max:0});assert.equal(planLeyLineScenario(null,null),null);
 const partial=planLeyLineScenario(null,60001);assert.equal(partial.exp,null);assert.equal(partial.mora,40);
});
test('talent transitions and missing sources never invent a delta',()=>{
 const p={sourceUrl:'https://example.com',talent:{books:['a','b','c'],enemy:['d','e','f'],weeklyBoss:'g'}};
 assert.equal(planTalent(8,10,p).mora>0,true);assert.equal(planTalent(9,9,p).mora,0);assert.equal(planTalent(10,10,p).mora,0);assert.equal(planTalent(10,9,p).status,'invalid');assert.equal(planTalent(null,8,p).status,'unknown');
 const plan=planGoalResources({currentLevel:null,targetLevel:90,currentWeapon:null,targetWeapon:90,talentCurrent:{skill:8},talentTargets:{skill:10},ascensionFrom:null,ascensionTo:null,weaponAscensionFrom:null,weaponAscensionTo:null,materialCounts:{}},p,5,null);
 assert.equal(plan.character.status,'unknown');assert.equal(plan.leyLineScenario.exp,null);assert.ok(plan.leyLineScenario.mora>0);assert.equal(plan.ascension,null);
});
test('all Sunday domain groups expose identity-linked material usages without substituting unknown icons',()=>{
 const rows=scheduleForDay('sunday');assert.ok(rows.length>20);assert.ok(rows.some(x=>x.type==='talent')&&rows.some(x=>x.type==='weapon'));
 for(const group of rows){assert.ok(group.materialIds.length>0&&group.materialIds.every(id=>materialCatalog[id]),group.domain);assert.ok(group.sourceUrl.startsWith('https://'))}
 assert.ok(rows.some(x=>x.type==='talent'&&x.materialIds.some(id=>materialCatalog[id].usedBy?.length)));
 assert.ok(rows.some(x=>x.type==='weapon'&&x.materialIds.some(id=>materialCatalog[id].usedByWeapons?.length)));
});
