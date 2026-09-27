// Unit values and leveling costs per item, not random stage fees.
// Character EXP material costs: https://game8.co/games/Genshin-Impact/archives/297404
// Weapon EXP and ore conversion: https://discover.hubpages.com/games-hobbies/Genshin-Impact-How-to-Quickly-Max-Level-Your-Weapons
// EXP totals by level remain in levelCosts.json (Paimon.moe). Actual in-level EXP and
// overflow at an intervening ascension cap are not known from a public showcase.
export const characterBookSource='https://game8.co/games/Genshin-Impact/archives/297404';
export const weaponOreSource='https://discover.hubpages.com/games-hobbies/Genshin-Impact-How-to-Quickly-Max-Level-Your-Weapons';
export const characterBooks=[{id:'heros_wit',exp:20000,mora:4000},{id:'adventurers_experience',exp:5000,mora:1000},{id:'wanderes_advice',exp:1000,mora:200}];
export const mysticOre={id:'mystic_enhancement_ore',exp:10000,mora:1000};
/** A transparent book-selection scenario, NOT a claim about what the player already owns. */
export function characterBookPlan(exp,method='balanced'){
 if(!Number.isFinite(exp)||exp<0)return null;
 const counts={heros_wit:0,adventurers_experience:0,wanderes_advice:0};
 // EXP books come in 1k units. A balanced mix minimizes overfill in that unit.
 // Hero-only prioritizes fewer taps but can overfill by up to 19,999 EXP.
 if(method==='hero-only')counts.heros_wit=Math.ceil(exp/20000);
 else{
  let units=Math.ceil(exp/1000);
  counts.heros_wit=Math.floor(units/20);units-=counts.heros_wit*20;
  counts.adventurers_experience=Math.floor(units/5);units-=counts.adventurers_experience*5;
  counts.wanderes_advice=units;
 }
 const items=characterBooks.filter(x=>counts[x.id]).map(x=>({id:x.id,required:counts[x.id],sourceUrl:characterBookSource}));
 return {method:method==='hero-only'?'hero-only':'balanced',items,mora:characterBooks.reduce((n,x)=>n+counts[x.id]*x.mora,0),expProvided:characterBooks.reduce((n,x)=>n+counts[x.id]*x.exp,0),sourceUrl:characterBookSource,note:'Example book mix from the remaining level EXP. In-level EXP, owned books and loss at an ascension cap can change actual cost.'};
}
export function weaponOrePlan(exp){
 if(!Number.isFinite(exp)||exp<0)return null;
 const required=Math.ceil(exp/mysticOre.exp);
 return {items:required?[{id:mysticOre.id,required,sourceUrl:weaponOreSource}]:[],mora:required*mysticOre.mora,expProvided:required*mysticOre.exp,sourceUrl:weaponOreSource,note:'Mystic-ore-only example. Existing in-level EXP, consumed weapons, other ore and ascension-cap overflow change actual spending.'};
}
