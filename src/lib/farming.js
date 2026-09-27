import schedule from '../data/domainSchedule.json' with {type:'json'};
import catalog from '../data/materialCatalog.json' with {type:'json'};

export const WEEKDAYS=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
export const farmingSource={url:schedule.sourceUrl,snapshot:schedule.snapshot};
/** The user's browser-local calendar date, NOT the in-game server day (04:00 server reset). */
export function getLocalWeekday(date=new Date()){return WEEKDAYS[date.getDay()]}
export function materialSchedule(id){
 const matched=schedule.entries[id];if(matched)return matched;
 // Paimon.moe's item day field supports a weekday, but does not establish the domain name.
 const days=catalog[id]?.days||[];
 return days.length?{days:[...days,'sunday'],domain:null,type:'talent',sourceUrl:catalog[id].sourceUrl}:null;
}
export function scheduleForDay(day=getLocalWeekday()){
 if(!WEEKDAYS.includes(day))return [];
 const rows=Object.entries(schedule.entries).filter(([,item])=>item.days.includes(day));
 const groups=new Map();for(const [id,item] of rows){
  const key=item.domain;
  const group=groups.get(key)||{domain:item.domain,type:item.type,sourceUrl:item.sourceUrl,materialIds:[]};
  group.materialIds.push(id);groups.set(key,group)
 }
 return [...groups.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.domain.localeCompare(b.domain));
}
/** A per-goal recommendation; never conflate unentered inventory with zero owned. */
export function farmableForGoal(goal,plan,profile,day=getLocalWeekday()){
 const rows=[];
 for(const row of plan?.items||[]){const rotation=materialSchedule(row.id);if(!rotation?.days.includes(day))continue;
  const owned=row.id==='mora'?(goal.moraOwned??goal.materialCounts?.mora):goal.materialCounts?.[row.id];
  const remaining=owned==null?null:Math.max(0,row.required-Number(owned));
  if(remaining===0)continue;
  rows.push({id:row.id,required:row.required,owned:owned??null,remaining,domain:rotation.domain,type:rotation.type,sourceUrl:rotation.sourceUrl,sourceDetailUrl:row.sourceUrl||null});
 }
 const weeklyId=profile?.talent?.weeklyBoss;
 const weeklyRequired=plan?.items?.find(row=>row.id===weeklyId)?.required;
 const weeklyOwned=weeklyId?goal.materialCounts?.[weeklyId]:null;
 const weeklyRemaining=weeklyOwned==null?null:Math.max(0,weeklyRequired-Number(weeklyOwned));
 const weekly=weeklyId&&weeklyRequired&&weeklyRemaining!==0?{
  id:weeklyId, required:weeklyRequired, owned:weeklyOwned??null, remaining:weeklyRemaining,
  sourceUrl:profile.sourceUrl, note:'Weekly boss material · specific boss and availability are not identified by this source; not a daily domain.'
 }:null;
 return {rows,weekly};
}
