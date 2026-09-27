/** Parse upstream Paimon.moe weaponList.js as an AST, never evaluate remote JavaScript. */
import {parse} from '@babel/parser';
import {readFileSync,writeFileSync} from 'node:fs';
const base='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/';
const [raw,itemsRaw]=await Promise.all(['weaponList.js','itemList.js'].map(async name=>{let r=await fetch(base+name);if(!r.ok)throw Error(`${name}: ${r.status}`);return r.text()}));
const declaration=(text,id)=>{let ast=parse(text,{sourceType:'module'});for(const node of ast.program.body)if(node.type==='ExportNamedDeclaration'&&node.declaration?.type==='VariableDeclaration')for(const dec of node.declaration.declarations)if(dec.id.name===id)return dec.init;throw Error(`Missing ${id}`)};
const key=n=>n.key?.name||n.key?.value,prop=(n,k)=>n?.properties?.find(p=>key(p)===k)?.value;
const str=n=>n?.type==='StringLiteral'?n.value:null,num=n=>n?.type==='NumericLiteral'?n.value:null;
const item=n=>n?.type==='MemberExpression'&&n.object.name==='itemList'?n.property?.name||n.property?.value:null;
const cat=JSON.parse(readFileSync('src/data/catalog.json'));const materials=JSON.parse(readFileSync('src/data/materialCatalog.json'));
const sourceItems={};for(const p of declaration(itemsRaw,'itemList').properties){let x=p.value;if(x.type==='ObjectExpression')sourceItems[key(p)]={id:key(p),name:str(prop(x,'name')),rarity:num(prop(x,'rarity'))}}
const byName=new Map(cat.weapons.map(w=>[w.name.toLowerCase(),w]));let profiles={};const unmatched=[];
for(const p of declaration(raw,'weaponList').properties){let row=p.value,slug=key(p);if(row.type!=='ObjectExpression')continue;let sourceName=str(prop(row,'name')),w=byName.get(sourceName?.toLowerCase());if(!w){unmatched.push(slug);continue}
 const asc=prop(row,'ascension')?.elements?.map((stage,i)=>({stage:i+1,mora:num(prop(stage,'mora')),items:prop(stage,'items')?.elements?.map(a=>({id:item(prop(a,'item')),amount:num(prop(a,'amount'))})).filter(x=>x.id&&x.amount!=null)||[]}))||[];
 if(asc.length!==6||asc.some(x=>x.mora==null||!x.items.length))continue;
 profiles[w.id]={weaponId:w.id,name:w.name,rarity:w.rarity,ascension:asc,source:'Paimon.moe weapon data',sourceUrl:'https://github.com/MadeBaruna/paimon-moe/blob/main/src/data/weaponList.js',lastIndexed:'2026-09-26'};
 for(const a of asc)for(const {id} of a.items){let from=sourceItems[id];if(!from?.name)continue;materials[id]??={id,name:from.name,rarity:from.rarity,days:[],usedBy:[],sourceUrl:'https://github.com/MadeBaruna/paimon-moe/blob/main/src/data/itemList.js',icon:null};materials[id].usedByWeapons??=[];if(!materials[id].usedByWeapons.includes(w.id))materials[id].usedByWeapons.push(w.id)}
}
// The upstream item text has a typo; Gamevika's stable-item schedule identifies this ID as Distant Sea.
if(materials.golden_branch_of_a_distant_sea){materials.golden_branch_of_a_distant_sea.name='Golden Branch of a Distant Sea';materials.golden_branch_of_a_distant_sea.displayNameSourceUrl='https://gamevika.com/en/genshin/farming'}
writeFileSync('src/data/weaponMaterials.json',JSON.stringify(profiles));writeFileSync('src/data/materialCatalog.json',JSON.stringify(materials));
console.log('matched six-stage weapons',Object.keys(profiles).length,'total referenced material IDs',Object.keys(materials).length,'unmatched source names',unmatched.length,unmatched.slice(0,12));
