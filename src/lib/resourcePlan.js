import costs from '../data/levelCosts.json' with {type:'json'};
import {talentCostTable,talentCostSource} from '../data/talentCostTable.js';
import {characterBookPlan,weaponOrePlan} from '../data/experienceMethods.js';
import {planAscensions} from './materials.js';
import {planLeyLineScenario} from './resinScenario.js';
import {validateProgression} from './progression.js';
const valid=(v,min,max)=>Number.isInteger(Number(v))&&v!==null&&v!==''&&Number(v)>=min&&Number(v)<=max;
/** Base talent levels only. Constellation-granted levels above 10 cannot be bought with materials. */
export function planTalent(current,target,profile){
 if(current==null||current===' '||current==='')return {status:'unknown',reason:'Current talent level is unknown; set it to calculate a delta.'};
 if(target==null||target==='')return {status:'unselected',reason:'No numeric guide or user target selected.'};
 if(!valid(current,1,10)||!valid(target,1,10))return {status:'unsupported',reason:'Base talent costs are verified for levels 1–10 only. Constellation bonus levels are not spendable upgrades.'};
 current=Number(current);target=Number(target);
 if(current>target)return {status:'invalid',reason:'Target cannot be lower than current progress.'};
 const sums={mora:0,books:[0,0,0],enemy:[0,0,0],weekly:0,crown:0};
 for(let to=current+1;to<=target;to++){const row=talentCostTable[to];sums.mora+=row.mora;sums.weekly+=row.weekly;sums.crown+=row.crown;for(let i=0;i<3;i++){sums.books[i]+=row.books[i];sums.enemy[i]+=row.enemy[i]}}
 const types=profile?.talent;const specific=types?.books?.length===3&&types?.enemy?.length===3&&!!types.weeklyBoss;
 const items=[];
 if(specific){for(let i=0;i<3;i++){if(sums.books[i])items.push({id:types.books[i],required:sums.books[i],sourceUrl:profile.sourceUrl});if(sums.enemy[i])items.push({id:types.enemy[i],required:sums.enemy[i],sourceUrl:profile.sourceUrl})}if(sums.weekly)items.push({id:types.weeklyBoss,required:sums.weekly,sourceUrl:profile.sourceUrl})}
 if(sums.crown)items.push({id:'crown_of_insight',required:sums.crown,sourceUrl:talentCostSource});
 return {status:'ok',from:current,to:target,...sums,items,specific,sourceUrl:talentCostSource,materialSourceUrl:specific?profile.sourceUrl:null};
}
/** EXP is cumulative at index level-1; no per-level costs are guessed. */
export function planCharacterExp(from,to){
 if(from==null||from==='')return {status:'unknown',reason:'Current character level is unknown.'};
 if(!valid(from,1,90)||!valid(to,1,90))return {status:'unsupported',reason:'Character EXP data is verified for levels 1–90.'};
 from=Number(from);to=Number(to);
 if(to<from)return {status:'invalid',reason:'Target cannot be lower than current progress.'};
 const exp=costs.characterExp[to-1]-costs.characterExp[from-1];
 return {status:'ok',exp,heroOnlyWit:Math.ceil(exp/20000),baseMora:Math.ceil(exp/5),note:'Hero-only book estimate; exact Mora may differ due to book rounding and EXP already earned within the current level.',sourceUrl:costs.sourceUrls.characterExp};
}
export function planWeaponExp(from,to,rarity){
 if(from==null||from==='')return {status:'unknown',reason:'Current weapon level is unknown.'};
 if(!valid(from,1,90)||!valid(to,1,90)||!valid(rarity,3,5))return {status:'unsupported',reason:'Weapon EXP is verified here only for 3–5★ weapons, levels 1–90.'};
 from=Number(from);to=Number(to);if(to<from)return {status:'invalid',reason:'Target cannot be lower than current progress.'};
 return {status:'ok',exp:costs.weaponExp[Number(rarity)-3][to-1]-costs.weaponExp[Number(rarity)-3][from-1],note:'Weapon ascension materials and enhancement-ore conversion are not included; no unsupported costs are shown.',sourceUrl:costs.sourceUrls.weaponExp};
}
/** The goal remains source-backed and unknown owned inventory is never silently treated as zero. */
export function planGoalResources(goal,materialProfile,rarity,weaponProfile){
 const talents=Object.fromEntries(['normal','skill','burst'].map(t=>[t,planTalent(goal.talentCurrent?.[t],goal.talentTargets?.[t],materialProfile)]));
 const character=planCharacterExp(goal.currentLevel,goal.targetLevel),weapon=planWeaponExp(goal.currentWeapon,goal.targetWeapon,rarity);
 const bookPlan=character.status==='ok'?characterBookPlan(character.exp,goal.expBookMethod):null;
 const orePlan=weapon.status==='ok'?weaponOrePlan(weapon.exp):null;
 const characterPath=validateProgression(goal.currentLevel,goal.targetLevel,goal.ascensionFrom,goal.ascensionTo);
 const weaponPath=validateProgression(goal.currentWeapon,goal.targetWeapon,goal.weaponAscensionFrom,goal.weaponAscensionTo);
 const ascension=characterPath.status==='invalid'?null:planAscensions(materialProfile,goal.ascensionFrom,goal.ascensionTo,goal.materialCounts);
 const weaponAscension=weaponPath.status==='invalid'?null:planAscensions(weaponProfile,goal.weaponAscensionFrom,goal.weaponAscensionTo,goal.materialCounts);
 const rows=new Map();const put=(id,qty,url)=>{if(qty<=0)return;const row=rows.get(id)||{id,required:0,sourceUrl:url,sourceUrls:[]};row.required+=qty;if(url&&!row.sourceUrls.includes(url))row.sourceUrls.push(url);rows.set(id,row)};
 for(const t of Object.values(talents))if(t.status==='ok')for(const row of t.items)put(row.id,row.required,row.sourceUrl);
 for(const row of ascension?.items||[])put(row.id,row.required,ascension.sourceUrl);
 for(const row of weaponAscension?.items||[])put(row.id,row.required,weaponAscension.sourceUrl);
 for(const row of bookPlan?.items||[])put(row.id,row.required,row.sourceUrl);
 for(const row of orePlan?.items||[])put(row.id,row.required,row.sourceUrl);
 // Talent + selected ascension costs are exact for the known path; book/ore application is a scenario.
 const mora=Object.values(talents).filter(t=>t.status==='ok').reduce((sum,t)=>sum+t.mora,0)+(ascension?.mora||0)+(weaponAscension?.mora||0);
 const moraBudget=mora+(bookPlan?.mora||0)+(orePlan?.mora||0);
 for(const t of Object.values(talents))if(t.status==='ok'&&t.mora)put('mora',t.mora,talentCostSource);
 if(ascension?.mora)put('mora',ascension.mora,ascension.sourceUrl);
 if(weaponAscension?.mora)put('mora',weaponAscension.mora,weaponAscension.sourceUrl);
 if(bookPlan?.mora)put('mora',bookPlan.mora,bookPlan.sourceUrl);
 if(orePlan?.mora)put('mora',orePlan.mora,orePlan.sourceUrl);
 const items=[...rows.values()].map(row=>({ ...row,estimated:row.id==='mora'&&(!!bookPlan?.mora||!!orePlan?.mora)||!!(bookPlan?.items||[]).find(x=>x.id===row.id)||!!(orePlan?.items||[]).find(x=>x.id===row.id),owned:goal.materialCounts?.[row.id]??null,remaining:goal.materialCounts?.[row.id]==null?null:Math.max(0,row.required-Number(goal.materialCounts[row.id]))}));
 return {talents,character,weapon,characterPath,weaponPath,bookPlan,orePlan,ascension,weaponAscension,items,mora,moraBudget,leyLineScenario:planLeyLineScenario(character.status==='ok'?character.exp:null,moraBudget>0?moraBudget:null),estimatedExpMora:character.status==='ok'?character.baseMora:null,partial:character.status!=='ok'||Object.values(talents).some(t=>t.status==='unknown'||t.status==='unsupported')||(!ascension&&goal.targetLevel>20)||(!weaponAscension&&goal.targetWeapon>20),note:'Budget assumes the shown EXP-book mix and Mystic-only ore. In-level EXP, ascension-cap overflow and actual consumed inventory can change costs. Fixed talent/ascension Mora remains separate. No resin estimate inferred.'};
}
