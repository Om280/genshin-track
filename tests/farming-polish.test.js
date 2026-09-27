import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getLocalWeekday,materialSchedule,scheduleForDay,farmableForGoal} from '../src/lib/farming.js';
import {planTalent,planGoalResources,planCharacterExp,planWeaponExp} from '../src/lib/resourcePlan.js';
import {characterBookPlan,weaponOrePlan} from '../src/data/experienceMethods.js';
import characterMaterials from '../src/data/characterMaterials.json' with {type:'json'};
import weaponMaterials from '../src/data/weaponMaterials.json' with {type:'json'};
import catalog from '../src/data/catalog.json' with {type:'json'};

const clorinde=characterMaterials['10000098'];const absolution=weaponMaterials['11515'];
test('local calendar changes rotation; Sunday contains all sourced domains and no made-up new items',()=>{
 assert.equal(getLocalWeekday(new Date('2026-09-28T09:00:00+05:30')),'monday');
 // Explicit local dates via TZ for deterministic cross-machine assertions.
 assert.equal(getLocalWeekday(new Date(2026,8,29)),'tuesday');
 const tile=materialSchedule('tile_of_decarabians_tower');assert.deepEqual(tile.days,['monday','thursday','sunday']);
 assert.equal(tile.domain,'Domain of Forgery: City of Reflections');
 assert.ok(scheduleForDay('monday').some(row=>row.domain==='Domain of Forgery: City of Reflections'));
 assert.ok(!scheduleForDay('tuesday').some(row=>row.domain==='Domain of Forgery: City of Reflections'));
 assert.ok(scheduleForDay('sunday').length>scheduleForDay('monday').length);
 assert.equal(materialSchedule('meshing_gear'),null);
});
test('base talent levels charge the remaining path and never reverse it',()=>{
 const six=planTalent(1,6,clorinde);assert.equal(six.mora,122500);assert.deepEqual(six.books,[3,21,0]);
 const eightTen=planTalent(8,10,clorinde);assert.equal(eightTen.mora,1150000);assert.deepEqual(eightTen.books,[0,0,28]);assert.equal(eightTen.weekly,4);assert.equal(eightTen.crown,1);
 assert.equal(planTalent(6,8,clorinde).mora,380000);assert.equal(planTalent(9,10,clorinde).mora,700000);
 assert.equal(planTalent(9,9,clorinde).mora,0);assert.equal(planTalent(10,10,clorinde).items.length,0);
 assert.equal(planTalent(10,9,clorinde).status,'invalid');assert.equal(planTalent(null,10,clorinde).status,'unknown');
});
test('goal resources split exact talent/ascension from EXP estimates and unknown inventory',()=>{
 const goal={currentLevel:20,targetLevel:21,currentWeapon:20,targetWeapon:21,talentCurrent:{normal:1,skill:8,burst:9},talentTargets:{normal:1,skill:10,burst:9},ascensionFrom:0,ascensionTo:1,weaponAscensionFrom:0,weaponAscensionTo:1,materialCounts:{}};
 const plan=planGoalResources(goal,clorinde,5,absolution);
 assert.equal(plan.talents.normal.mora,0);assert.equal(plan.talents.burst.mora,0);
 assert.equal(plan.mora,1150000+20000+10000);assert.ok(plan.estimatedExpMora>0);
 assert.equal(plan.items.find(x=>x.id==='mora').required,plan.moraBudget);assert.equal(plan.moraBudget,plan.mora+plan.bookPlan.mora+plan.orePlan.mora);assert.equal(plan.items.find(x=>x.id==='mystic_enhancement_ore').required,Math.ceil(plan.weapon.exp/10000));
 assert.equal(plan.items.find(x=>x.id==='guide_to_justice'),undefined); // no middle books in 8→10
 assert.equal(plan.items.find(x=>x.id==='philosophies_of_justice').remaining,null);
 assert.equal(plan.items.find(x=>x.id==='fragment_of_an_ancient_chord').required,5);
 assert.equal(plan.items.find(x=>x.id==='fragment_of_an_ancient_chord').remaining,null);
 assert.equal(plan.weapon.status,'ok');
 const monday=farmableForGoal(goal,plan,clorinde,'monday');assert.ok(monday.rows.some(x=>x.id==='fragment_of_an_ancient_chord'&&x.domain==='Domain of Forgery: Robotic Ruse'));
 assert.ok(!monday.rows.some(x=>x.id==='philosophies_of_justice'));assert.equal(monday.weekly?.id,'everamber');
 const tuesday=farmableForGoal(goal,plan,clorinde,'tuesday');assert.ok(tuesday.rows.some(x=>x.id==='philosophies_of_justice'));assert.ok(!tuesday.rows.some(x=>x.id==='fragment_of_an_ancient_chord'));
 const done=farmableForGoal({...goal,materialCounts:{philosophies_of_justice:28,everamber:4}},plan,clorinde,'tuesday');assert.ok(!done.rows.some(x=>x.id==='philosophies_of_justice'));assert.equal(done.weekly,null);
 const unsupported=planGoalResources({...goal,weaponAscensionFrom:4,weaponAscensionTo:6},clorinde,1,weaponMaterials['11101']);assert.equal(unsupported.weaponAscension,null); // zero-amount placeholders cannot count as known/free
});
test('character/weapon EXP book-use scenarios are costed from verified unit values, not level one',()=>{
 const exp=planCharacterExp(80,90);assert.equal(exp.exp,3423125);
 const balanced=characterBookPlan(exp.exp),heroOnly=characterBookPlan(exp.exp,'hero-only');
 assert.deepEqual(balanced.items.map(x=>[x.id,x.required]),[['heros_wit',171],['wanderes_advice',4]]);
 assert.equal(balanced.mora,684800);assert.equal(heroOnly.items[0].required,172);assert.equal(heroOnly.mora,688000);
 assert.equal(characterBookPlan(0).mora,0);assert.equal(weaponOrePlan(0).mora,0);
 const weap=planWeaponExp(80,90,5),ore=weaponOrePlan(weap.exp);
 assert.ok(weap.exp>0);assert.equal(ore.mora,ore.items[0].required*1000);
 assert.equal(planCharacterExp(90,80).status,'invalid');assert.equal(planWeaponExp(90,80,5).status,'invalid');
});
test('catalog weapon classes use actual stable IDs, not reversed bow/polearm labels',()=>{
 assert.equal(catalog.weapons.find(w=>w.name==='Staff of Homa').type,'Polearm');
 assert.equal(catalog.weapons.find(w=>w.name==="Hunter's Bow").type,'Bow');
});
