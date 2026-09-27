// Level gates are identical for character and weapon ascension. Reaching a
// boundary (e.g. 80) does NOT prove whether the next ascension was completed.
export const LEVEL_CAPS=[20,40,50,60,70,80,90];
export const LEVEL_GATE_SOURCE='https://genshin-impact.fandom.com/wiki/Adventure_Rank';
export function minimumAscensionStage(level){
 if(!Number.isInteger(Number(level))||level==null||level===''||Number(level)<1||Number(level)>90)return null;
 return LEVEL_CAPS.findIndex(cap=>Number(level)<=cap);
}
export function validateProgression(from,to,fromStage,toStage){
 const start=minimumAscensionStage(from),end=minimumAscensionStage(to);
 if(start==null||end==null)return {status:'unknown',reason:'Set valid current and target levels from 1 to 90.'};
 if(Number(to)<Number(from))return {status:'invalid',reason:'Target cannot be below current progress.'};
 if(fromStage!=null&&(!Number.isInteger(Number(fromStage))||Number(fromStage)<start||Number(fromStage)>6))return {status:'invalid',reason:`The current level requires at least A${start}. Check the completed ascension stage.`};
 if(toStage!=null&&(!Number.isInteger(Number(toStage))||Number(toStage)<end||Number(toStage)>6||fromStage!=null&&Number(toStage)<Number(fromStage)))return {status:'invalid',reason:`The target requires at least A${end}; ascension cannot go backwards.`};
 const steps=[],completed=fromStage==null?null:Number(fromStage),target=toStage==null?null:Number(toStage);
 let at=Number(from);
 for(let stage=start;stage<=end;stage++){
  const cap=LEVEL_CAPS[stage],finish=Math.min(cap,Number(to));
  if(finish>at)steps.push({type:'level',from:at,to:finish});
  if(stage<end){steps.push({type:'ascend',stage:stage+1,status:completed==null?'unknown':completed>=stage+1?'complete':'required'});at=finish;}
 }
 // A target at a cap can request the next ascension without an EXP gain.
 if(target!=null&&target>end)for(let stage=end+1;stage<=target;stage++)steps.push({type:'ascend',stage,status:completed==null?'unknown':completed>=stage?'complete':'required'});
 return {status:'ok',minimumCurrentStage:start,minimumTargetStage:end,fromStage:completed,toStage:target,steps,ascensionKnown:completed!=null&&target!=null};
}
