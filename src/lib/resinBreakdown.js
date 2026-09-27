import materials from '../data/materialCatalog.json' with {type:'json'};

// Highest domain tier, Original Resin per claim, sourced distributions. These
// are expected-value *scenarios*, not guaranteed drop counts or precise runs.
export const resinSources={
 domains:'https://genshin-impact.fandom.com/wiki/Loot_System/Material_Drop_Distribution',
 domainCost:'https://genshin-impact.fandom.com/wiki/Domain',
 boss:'https://genshin-impact.fandom.com/wiki/Normal_Boss',
 bossFloor:'https://genshin-impact.fandom.com/wiki/Adventure_Rank',
 weekly:'https://genshin-impact.fandom.com/wiki/Trounce_Domain'
};
const remaining=(goal,id,required)=>goal.materialCounts?.[id]==null?required:Math.max(0,required-Number(goal.materialCounts[id]));
const equivalent=(rows,ids,goal)=>ids.reduce((total,id,i)=>total+(3**i)*remaining(goal,id,rows.find(x=>x.id===id)?.required||0),0);
const item=(key,label,min,max,detail,sourceUrl,extra={})=>({key,label,min,max,detail,sourceUrl,...extra});
/** All numbers are gross planning scenarios unless every relevant inventory count is known.
 * Never pretend a reward average is guaranteed; never invent artifact Resin. */
export function resourceResinBreakdown(goal,plan,characterProfile,weaponProfile){
 const items=[];
 if(plan.leyLineScenario?.exp?.max>0)items.push(item('exp','Character EXP',plan.leyLineScenario.exp.min,plan.leyLineScenario.exp.max,'WL 6–9 Revelation: 110k–135k character EXP / 20 Resin. Gross before owned books; account World Level and book inventory are not inferred.',plan.leyLineScenario.sourceUrl));
 if(plan.leyLineScenario?.mora>0)items.push(item('mora','Planned Mora',plan.leyLineScenario.mora,plan.leyLineScenario.mora,'WL 6–9 Wealth: 60,000 Mora / 20 Resin. Includes only known fixed costs and the selected book/ore scenario; gross before owned Mora.',plan.leyLineScenario.sourceUrl));
 const boss=characterProfile?.ascension?.[1]?.items?.[1]?.id;
 if(boss&&characterProfile.ascension.length===6&&characterProfile.ascension.slice(1).every(x=>x.items?.[1]?.id===boss)&&materials[boss]?.rarity>=4&&plan.ascension){
  const row=plan.ascension.items.find(x=>x.id===boss),qty=row?remaining(goal,boss,row.required):0;
  if(qty)items.push(item('boss','Ascension boss',null,Math.ceil(qty/3)*40,`${materials[boss].name} ×${qty}; 40 Resin per Normal Boss claim. At WL9, at least 3 drops per claim: ${Math.ceil(qty/3)} claims is the conservative guaranteed-floor scenario. Gem drops and lower World Levels are excluded.`,resinSources.bossFloor,{materialId:boss,assumption:'WL9 only; upper scenario, not a lower bound'}));
 }
 const books=characterProfile?.talent?.books;
 if(books?.length===3&&books.every(id=>materials[id])&&plan.items.some(x=>books.includes(x.id))){
  const equiv=equivalent(plan.items,books,goal);
  if(equiv)items.push(item('talent','Talent book domains',null,Math.ceil(equiv/10.12)*20,`${equiv} green-tier book equivalents after 3:1 crafting (before crafting fees and bonus passives). Domain IV distribution averages 2.2 green, 1.98 blue and 0.22 purple per 20 Resin. This is an expected-value scenario, NOT a maximum or guaranteed outcome.`,resinSources.domains,{assumption:'approximate; RNG may cost less or more'}));
 }
 const weaponIds=weaponProfile?.ascension?.map(x=>x.items?.[0]?.id).filter(Boolean);
 if(weaponIds?.length===6&&new Set(weaponIds).size>=3&&plan.weaponAscension){
  const unique=[...new Set(weaponIds)];const equiv=equivalent(plan.items,unique,goal);
  if(equiv)items.push(item('weapon','Weapon material domains',null,Math.ceil(equiv/17.05)*20,`${equiv} green-tier weapon-material equivalents after 3:1 crafting. Highest-tier domain historical averages: 2.2 green, 2.4 blue, 0.64 purple and 0.07 gold per 20 Resin. This is a rough expected-value scenario, NOT guaranteed.`,resinSources.domains,{assumption:'approximate; historical drop distribution'}));
 }
 const weeklyId=characterProfile?.talent?.weeklyBoss,weekly=plan.items.find(x=>x.id===weeklyId);
 if(weekly&&remaining(goal,weeklyId,weekly.required)>0)items.push(item('weekly','Weekly boss material',null,null,`${materials[weeklyId]?.name||weeklyId} ×${remaining(goal,weeklyId,weekly.required)} needed. Rewards are once per boss per week; first three claims cost 30 Resin, later claims 60. Drop identity and attempts are not source-verified here, so this is NOT added to the total.`,resinSources.weekly,{materialId:weeklyId}));
 const included=items.filter(x=>x.max!=null),allBounded=included.every(x=>x.min!=null);
 return {items,min:allBounded?included.reduce((n,x)=>n+x.min,0):null,knownScenario:included.reduce((n,x)=>n+x.max,0),partial:items.some(x=>x.max==null||x.min==null)||plan.partial,description:'Selected known costs only. EXP/Mora are gross; boss assumes WL9; talent and weapon domains use expected drop averages. Weekly drops, inventory not entered, lower World Levels, artifact RNG and unverified material identities are excluded.'};
}
