// Only character ascension stages selected explicitly by the user are counted.
// Enka level is not an ascension-stage flag; never derive completed stages from it.
export function planAscensions(record,fromStage,toStage,owned={}){
 if(!record||!Number.isInteger(fromStage)||!Number.isInteger(toStage)||fromStage<0||fromStage>6||toStage<0||toStage>6||toStage<fromStage)return null;
 if(toStage===fromStage)return {fromStage,toStage,mora:0,items:[],sourceUrl:record.sourceUrl,indexedAt:record.lastIndexed};
 const selected=record.ascension.slice(fromStage,toStage);
 if(selected.length!==toStage-fromStage||selected.some(step=>!Number.isFinite(step.mora)||step.items.some(row=>!row.id||!Number.isInteger(row.amount)||row.amount<=0)))return null; // source placeholder zero is NOT a verified free stage
 const quantities={};for(const step of selected)for(const row of step.items)quantities[row.id]=(quantities[row.id]||0)+row.amount;
 return {fromStage,toStage,mora:selected.reduce((sum,stage)=>sum+(stage.mora||0),0),items:Object.entries(quantities).map(([id,required])=>({id,required,owned:owned[id]==null?null:Math.max(0,Number(owned[id])||0),remaining:owned[id]==null?null:Math.max(0,required-Math.max(0,Number(owned[id])||0))})),sourceUrl:record.sourceUrl,indexedAt:record.lastIndexed};
}
