// Only deterministic, source-documented ley-line reward assumptions are used.
// These are a *gross scenario*, not an account estimate or a domain-drop forecast.
export const leyLineSource='https://genshin-impact.fandom.com/wiki/Ley_Line_Outcrop';
export const leyLineAssumptions={worldLevels:'6–9',resinPerClaim:20,wealthMora:60000,revelationExpMin:110000,revelationExpMax:135000,sourceUrl:leyLineSource};
export function planLeyLineScenario(exp,mora){
 const knownExp=Number.isFinite(exp)&&exp>=0,knownMora=Number.isFinite(mora)&&mora>=0;
 if(!knownExp&&!knownMora)return null;
 const e=knownExp?{min:Math.ceil(exp/leyLineAssumptions.revelationExpMax)*20,max:Math.ceil(exp/leyLineAssumptions.revelationExpMin)*20}:null;
 const m=knownMora?Math.ceil(mora/leyLineAssumptions.wealthMora)*20:null;
 return {exp:e,mora:m,totalMin:(e?.min||0)+(m||0),totalMax:(e?.max||0)+(m||0),sourceUrl:leyLineSource,
  note:'Gross WL 6–9 ley-line scenario before owned EXP books or Mora: 20 Original Resin yields 110k–135k character EXP or 60k Mora. Includes only known character EXP and planned Mora; excludes talent/weapon domains, bosses, crafting, events and other sources. Book and ore spending depends on the selected mix, and rewards are variable.'};
}
