/** Offline, non-executing AST extraction of Paimon.moe character ascension and material references.
 * Paimon source JavaScript is parsed as data; never imported or evaluated.
 */
import {parse} from '@babel/parser';
import {readFileSync,writeFileSync} from 'node:fs';
const BASE='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/';
const [charactersJs,itemsJs]=await Promise.all(['characters.js','itemList.js'].map(async f=>{const r=await fetch(BASE+f);if(!r.ok)throw Error(`${f}: ${r.status}`);return r.text()}));
const findObject=(text,name)=>{const ast=parse(text,{sourceType:'module'});for(const row of ast.program.body){if(row.type!=='ExportNamedDeclaration'||row.declaration?.type!=='VariableDeclaration')continue;for(const decl of row.declaration.declarations){if(decl.id.name===name&&decl.init.type==='ObjectExpression')return decl.init}}throw Error(`Missing ${name}`)};
const property=(obj,key)=>obj?.properties?.find(p=>(p.key?.name||p.key?.value)===key)?.value;
const str=node=>node?.type==='StringLiteral'?node.value:null;
const num=node=>node?.type==='NumericLiteral'?node.value:null;
const key=p=>p.key?.name||p.key?.value;
const itemRef=node=>node?.type==='MemberExpression'&&node.object.name==='itemList'?(node.property?.name||node.property?.value):null;
const itemArray=node=>node?.type==='ArrayExpression'?node.elements.map(itemRef).filter(Boolean):[];
const sourceItems={};for(const p of findObject(itemsJs,'itemList').properties){const x=p.value;if(x.type!=='ObjectExpression')continue;const id=key(p);sourceItems[id]={id,name:str(property(x,'name'))||null,rarity:num(property(x,'rarity')),days:itemArray(property(x,'day'))};if(property(x,'day')?.elements)sourceItems[id].days=property(x,'day').elements.map(str).filter(Boolean)}
const cat=JSON.parse(readFileSync('src/data/catalog.json'));const byName=new Map(cat.characters.map(c=>[c.name.toLowerCase(),c]));const aliases=JSON.parse(readFileSync('src/data/paimonIds.json'));
const all={};const chars={};const ignored=[];
for(const p of findObject(charactersJs,'characters').properties){const slug=key(p),n=p.value;if(n.type!=='ObjectExpression')continue;const name=aliases[slug]?.name||str(property(n,'name'));let c=byName.get(name?.toLowerCase());if(!c&&name?.startsWith('Traveler (')){const el=name.slice(10,-1);c=cat.characters.find(x=>x.name==='Traveler'&&x.element===el)}if(!c){ignored.push(slug);continue}
 const stages=property(n,'ascension')?.elements?.map((row,i)=>({stage:i+1,mora:num(property(row,'mora')),items:property(row,'items')?.elements?.map(a=>({id:itemRef(property(a,'item')),amount:num(property(a,'amount'))})).filter(x=>x.id&&x.id!=='none'&&x.amount!=null)||[]}))||[];
 const material=property(n,'material');const talent={enemy:itemArray(property(material,'material')),books:itemArray(property(material,'book')),weeklyBoss:itemRef(property(material,'boss'))};
 const needed=new Set([...stages.flatMap(s=>s.items.map(x=>x.id)),...talent.enemy,...talent.books,talent.weeklyBoss].filter(Boolean));for(const id of needed){const item=sourceItems[id];if(!item?.name)continue;const existing=all[id]||{id,name:item.name,rarity:item.rarity,days:item.days||[],usedBy:[],sourceUrl:'https://github.com/MadeBaruna/paimon-moe/blob/main/src/data/itemList.js',icon:null};if(!existing.usedBy.includes(c.id))existing.usedBy.push(c.id);all[id]=existing}
 chars[c.id]={characterId:c.id,name:c.name,ascension:stages,talent,source:'Paimon.moe character data',sourceUrl:'https://github.com/MadeBaruna/paimon-moe/blob/main/src/data/characters.js',lastIndexed:'2026-09-26'};
}
for(const id of ['mora','heros_wit','crown_of_insight','mystic_enhancement_ore','fine_enhancement_ore','enhancement_ore','adventurers_experience','wanderes_advice']){const item=sourceItems[id];if(item?.name&&!all[id])all[id]={id,name:item.name,rarity:item.rarity,days:[],usedBy:[],sourceUrl:'https://github.com/MadeBaruna/paimon-moe/blob/main/src/data/itemList.js',icon:null}}
// Paimon.moe exposes these item names/icons but not their rarity; keep the independently
// verified Genshin item quality instead of silently downgrading them to unknown on refresh.
for(const [id,rarity,url] of [
 ['mystic_enhancement_ore',3,'https://genshin-impact.fandom.com/wiki/Mystic_Enhancement_Ore'],
 ['fine_enhancement_ore',2,'https://genshin-impact.fandom.com/wiki/Fine_Enhancement_Ore'],
 ['enhancement_ore',1,'https://genshin-impact.fandom.com/wiki/Enhancement_Ore'],
 ['adventurers_experience',3,'https://genshin-impact.fandom.com/wiki/Adventurer%27s_Experience'],
 ['wanderes_advice',2,'https://genshin-impact.fandom.com/wiki/Wanderer%27s_Advice']])if(all[id]){all[id].rarity=rarity;all[id].raritySourceUrl=url}
writeFileSync('src/data/materialCatalog.json',JSON.stringify(all));writeFileSync('src/data/characterMaterials.json',JSON.stringify(chars));
console.log('Characters with material source',Object.keys(chars).length,'Referenced materials',Object.keys(all).length,'Unmatched source slugs',ignored.slice(0,25));
console.log('Clorinde',JSON.stringify(chars['10000098']));
