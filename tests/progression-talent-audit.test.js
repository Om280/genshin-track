import {test} from 'node:test';
import assert from 'node:assert/strict';
import {minimumAscensionStage,validateProgression} from '../src/lib/progression.js';
import {talentState,initialTalentTargets} from '../src/lib/talents.js';
import {resourceResinBreakdown} from '../src/lib/resinBreakdown.js';
import {planGoalResources} from '../src/lib/resourcePlan.js';
import materials from '../src/data/characterMaterials.json' with {type:'json'};
import guides from '../src/data/structuredGuides.json' with {type:'json'};
import patternWatch from '../src/data/talentGenericPatternWatch.json' with {type:'json'};
import audit from '../src/data/talentPriorityAudit.json' with {type:'json'};

const clorinde=materials['10000098'],bossId=clorinde.ascension[1].items[1].id;
test('level caps require an explicit ascension state, particularly at level 80',()=>{
 assert.deepEqual([1,20,21,40,41,50,51,60,61,70,71,80,81,90].map(minimumAscensionStage),[0,0,1,1,2,2,3,3,4,4,5,5,6,6]);
 assert.equal(minimumAscensionStage(0),null);assert.equal(minimumAscensionStage(91),null);
 const before=validateProgression(80,90,5,6);assert.equal(before.status,'ok');assert.deepEqual(before.steps,[{type:'ascend',stage:6,status:'required'},{type:'level',from:80,to:90}]);
 assert.deepEqual(validateProgression(80,90,6,6).steps,[{type:'ascend',stage:6,status:'complete'},{type:'level',from:80,to:90}]);
 assert.deepEqual(validateProgression(80,80,5,6).steps,[{type:'ascend',stage:6,status:'required'}]);
 assert.equal(validateProgression(80,90,null,6).ascensionKnown,false);
 assert.equal(validateProgression(80,90,4,6).status,'invalid');
 assert.equal(validateProgression(90,80,6,6).status,'invalid');
});
test('unknown stage withholds ascension cost; known level-80 A5→A6 includes it',()=>{
 const base={currentLevel:80,targetLevel:90,ascensionTo:6,talentCurrent:{},talentTargets:{},materialCounts:{}};
 const unknown=planGoalResources({...base,ascensionFrom:null},clorinde,5,null);
 assert.equal(unknown.ascension,null);assert.equal(unknown.characterPath.ascensionKnown,false);
 const known=planGoalResources({...base,ascensionFrom:5},clorinde,5,null);
 assert.equal(known.characterPath.ascensionKnown,true);assert.ok(known.ascension.items.some(x=>x.id===bossId));
});
test('Resin is a partial scenario with RNG rows explicitly unbounded, never an exact total',()=>{
 const goal={currentLevel:80,targetLevel:90,ascensionFrom:5,ascensionTo:6,talentCurrent:{normal:8,skill:9,burst:10},talentTargets:{normal:10,skill:9,burst:10},materialCounts:{}};
 const plan=planGoalResources(goal,clorinde,5,null),r=resourceResinBreakdown(goal,plan,clorinde,null);
 assert.ok(r.knownScenario>0);assert.equal(r.partial,true);assert.equal(r.min,null);
 assert.equal(r.items.find(x=>x.key==='boss').max,Math.ceil(20/3)*40); // WL9 guaranteed-floor spending scenario; not a universal maximum
 assert.equal(r.items.find(x=>x.key==='talent').min,null);
 assert.equal(r.items.find(x=>x.key==='weekly').max,null);
 assert.match(r.description,/excluded/);
 const done=resourceResinBreakdown({...goal,materialCounts:{[bossId]:20}},plan,clorinde,null);
 assert.ok(!done.items.some(x=>x.key==='boss'));
});
test('numeric targets require independently attributed number; contextual build has no certified single priority',()=>{
 assert.equal(talentState({priority:'PRIMARY',recommendedLevel:10,levelSpecified:false,sourceUrl:'https://example.com'}).target,null);
 assert.equal(talentState({priority:'LOW',recommendedLevel:1,levelSpecified:true,sourceUrl:'https://example.com',levelSource:'https://example.com'}).kind,'not-required');
 assert.equal(talentState({priority:'CONTEXTUAL',sourceUrl:'https://example.com'}).kind,'unavailable');
 assert.equal(talentState({priority:'SECONDARY',recommendedLevel:8,levelSpecified:true,sourceUrl:'https://example.com'}).target,null);
 for(const [id,g] of Object.entries(guides))for(const v of g.variants){
  const ids=v.talents.map(x=>x.talentId);assert.equal(new Set(ids).size,ids.length,`${id}: repeated talent`);
  for(const row of v.talents){assert.ok(['normal','skill','burst'].includes(row.talentId),id);assert.equal(row.buildId,v.id,id);assert.ok(row.reason&&row.sourceUrl&&row.version,`${id}: missing context/source/version`);
   if(!row.levelSpecified)assert.equal(talentState(row).target,null,`${id}: invented numeric goal target`);
   if(row.priority==='CONTEXTUAL')assert.equal(talentState(row).priority,null,`${id}: contextual priority cannot masquerade as primary`);
  }
  const verified=initialTalentTargets({variants:[v]});for(const t of Object.values(verified))assert.ok(t===null||Number.isInteger(t));
 }
 assert.equal(audit.contextDependent.length,14,'context-dependent records are withheld, not certified');
});
test('flag repeated generic source expressions as a monitored audit regression, not as independent reviews',()=>{
 const groups=new Map();for(const [id,g] of Object.entries(guides))for(const v of g.variants){const sourceExpression=v.talents[0]?.reason;
  if(!sourceExpression?.startsWith('Source priority:'))continue;
  const list=groups.get(sourceExpression)||[];list.push({id,buildId:v.id});groups.set(sourceExpression,list);
 }
 const flagged=[...groups].filter(([,entries])=>entries.length>=4).map(([sourceExpression,entries])=>({sourceExpression,builds:entries}));
 assert.ok(flagged.length>0,'no generic repeated source-priority patterns monitored');
 assert.deepEqual(flagged.map(x=>x.sourceExpression).sort(),patternWatch.groups.map(x=>x.sourceExpression).sort(),'new repeated templates must be inspected and entered in the watchlist');
 for(const group of flagged){const recorded=patternWatch.groups.find(x=>x.sourceExpression===group.sourceExpression);assert.equal(recorded.count,group.builds.length);assert.equal(recorded.status,'NEEDS INDEPENDENT CHARACTER/BUILD REVIEW');assert.deepEqual(recorded.builds.map(x=>[x.id,x.buildId]).sort(),group.builds.map(x=>[x.id,x.buildId]).sort());}
});
