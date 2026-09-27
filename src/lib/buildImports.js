import catalog from '../data/catalog.json' with {type:'json'};
import {talentSkillIds} from '../data/talentSkillIds.js';
const norm=x=>String(x??'').toLowerCase().replace(/[^a-z0-9]/g,'');
const byKey=(rows,key)=>rows.find(x=>norm(x.name)===norm(key)||x.id===String(key));
const character=(key)=>{let x=byKey(catalog.characters.filter(c=>c.name!=='Traveler'),key);if(x)return x;const k=norm(key);return catalog.characters.find(c=>norm(`Traveler${c.element}`)===k&&c.element!=='None')||null};
const weapon=key=>byKey(catalog.weapons,key);
const artifact=key=>byKey(catalog.artifacts,key);
const slots={flower:0,plume:1,sands:2,goblet:3,circlet:4};
const validNumber=(value,min,max)=>Number.isInteger(Number(value))&&Number(value)>=min&&Number(value)<=max;
const inRange=(value,min,max)=>Number.isInteger(Number(value))&&Number(value)>=min&&Number(value)<=max?Number(value):null;
const talents=(data)=>({normal:inRange(data?.auto??data?.normal,1,15),skill:inRange(data?.skill,1,15),burst:inRange(data?.burst,1,15)});
function build(c,level,cons,talent,source){return {id:c.id,name:c.name,element:c.element,level:inRange(level,1,90),constellation:inRange(cons,0,6),talentLevels:talents(talent),weapon:null,artifacts:[],stats:null,source}}
const validity=(row)=>row&&typeof row==='object'&&!Array.isArray(row);
/** GOOD v1–v3: characters, weapons and artifacts are optional sections. Only identified IDs are displayed. */
export function parseGOOD(raw,{rosterComplete=false}={}){
 if(typeof raw==='string'&&raw.length>3_000_000)throw Error('GOOD file is too large for local browser storage (3 MB limit).');
 const obj=typeof raw==='string'?JSON.parse(raw):raw;
 if(!validity(obj)||obj.format!=='GOOD'||![1,2,3].includes(Number(obj.version)))throw Error('Use a GOOD v1–v3 JSON export.');
 if(![obj.characters,obj.weapons,obj.artifacts].some(Array.isArray))throw Error('This GOOD export contains no character, weapon or artifact sections.');
 const entries=new Map(),unknown=[];
 for(const row of obj.characters||[]){const c=character(row?.key);if(!c){unknown.push(String(row?.key||'unknown'));continue}entries.set(c.id,{...build(c,row.level,row.constellation,row.talent,'GOOD'),ascensionStage:inRange(row.ascension,0,6)})}
 const weaponInventory=[];
 for(const row of obj.weapons||[]){const item=weapon(row?.key);if(!item){unknown.push(String(row?.key||'unknown weapon'));continue}
  const loc=character(row.location),rec={id:item.id,name:item.name,level:inRange(row.level,1,90),refinement:inRange(row.refinement,1,5),ascension:inRange(row.ascension,0,6),source:'GOOD',locationId:loc?.id||null};weaponInventory.push(rec);
  if(loc&&entries.has(loc.id)&&!entries.get(loc.id).weapon)entries.get(loc.id).weapon=rec;
 }
 const artifactInventory=[];
 for(const row of obj.artifacts||[]){const set=artifact(row?.setKey),slot=slots[String(row?.slotKey).toLowerCase()];if(!set||slot===undefined){unknown.push(String(row?.setKey||'unknown artifact'));continue}
  const loc=character(row.location),rec={id:`${set.id}-${slot}`,setId:set.id,slot:row.slotKey,level:inRange(row.level,0,20),rarity:inRange(row.rarity,1,5),main:row.mainStatKey||null,substats:Array.isArray(row.substats)?row.substats.filter(s=>typeof s?.key==='string'&&Number.isFinite(s.value)).map(s=>({key:s.key,value:s.value})):[],source:'GOOD',locationId:loc?.id||null};artifactInventory.push(rec);
  if(loc&&entries.has(loc.id))entries.get(loc.id).artifacts.push(rec);
 }
 // A GOOD scanner may export only a subset. Never infer absence unless the user explicitly confirms a complete scan.
 return {source:'GOOD',sections:{characters:Array.isArray(obj.characters),weapons:Array.isArray(obj.weapons),artifacts:Array.isArray(obj.artifacts)},uid:/^\d{9,10}$/.test(String(obj.uid||''))?String(obj.uid):null,importedAt:Date.now(),characters:[...entries.values()],weaponInventory,artifactInventory,rosterComplete:!!rosterComplete&&entries.size>0,unknown};
}
/** gcsim config DSL (documented char/add weapon/add set/add stats). Simulator configs do NOT prove ownership. */
export function parseGCSIM(raw){
 if(typeof raw!=='string'||raw.length>1_000_000)throw Error('Paste a gcsim config text file under 1 MB.');
 const entries=new Map(),unknown=[],sets={};let matched=0;
 for(const statement of raw.split(';')){
  const line=statement.replace(/#[^\n]*/g,'').trim(),m=line.match(/^([\w-]+)\s+(char|add)\s+([\s\S]+)$/i);if(!m)continue;
  const [,key,kind,rest]=m,c=character(key);if(!c){unknown.push(key);continue}
  if(kind.toLowerCase()==='char'){
   const lvl=rest.match(/\blvl=(\d{1,2})(?:\/\d{1,2})?/i),cons=rest.match(/\bcons=(\d)/i),tal=rest.match(/\btalent=(\d{1,2}),(\d{1,2}),(\d{1,2})/i);
   if(!lvl)continue;
   entries.set(c.id,build(c,lvl[1],cons?.[1],tal?{auto:tal[1],skill:tal[2],burst:tal[3]}:null,'GCSIM'));matched++;
  }else if(/\bweapon=/.test(rest)){
   const w=rest.match(/\bweapon="([\w-]+)"/i),lvl=rest.match(/\blvl=(\d{1,2})(?:\/\d{1,2})?/i),refine=rest.match(/\brefine=(\d)/i),item=weapon(w?.[1]);
   if(entries.has(c.id)&&item)entries.get(c.id).weapon={id:item.id,name:item.name,level:inRange(lvl?.[1],1,90),refinement:inRange(refine?.[1],1,5),source:'GCSIM'};
  }else if(/\bset=/.test(rest)){
   const name=rest.match(/\bset="([\w-]+)"/i),count=rest.match(/\bcount=(\d)/i),item=artifact(name?.[1]);
   if(item&&entries.has(c.id)){sets[c.id]??=[];sets[c.id].push({setId:item.id,count:inRange(count?.[1],1,5)});}
  }else if(/\bstats\b/.test(rest)&&entries.has(c.id)){
   // gcsim artifact stats are aggregate simulation parameters, NOT actual owned artifacts.
   const params=[...rest.matchAll(/([a-z]+%?)=([\d.]+)/gi)].map(([,key,value])=>[key,Number(value)]).filter(([,v])=>Number.isFinite(v));
   const totals={...(entries.get(c.id).stats||{})};for(const [key,value] of params)totals[key]=(totals[key]||0)+value;entries.get(c.id).stats=totals;
  }
 }
 if(!matched)throw Error('No supported gcsim character settings found (expected: bennett char lvl=70/80 cons=6 talent=6,8,8;).');
 for(const [id,group] of Object.entries(sets))entries.get(id).simArtifactSets=group;
 return {source:'GCSIM',importedAt:Date.now(),characters:[...entries.values()],rosterComplete:false,unknown:[...new Set(unknown)]};
}
export function addManualBuild(raw){const c=character(raw?.characterId);if(!c)throw Error('Choose a known character.');for(const [key,min,max] of [['level',1,90],['constellation',0,6],['normal',1,15],['skill',1,15],['burst',1,15]]){const value=key==='level'||key==='constellation'?raw?.[key]:raw?.talentLevels?.[key];if(value!=null&&value!==''&&!validNumber(value,min,max))throw Error(`Invalid ${key}: enter ${min}–${max} or leave blank.`)}const rec=build(c,raw.level,raw.constellation,raw.talentLevels,'MANUAL');return {source:'MANUAL',importedAt:Date.now(),characters:[rec],rosterComplete:false,owned:raw.owned===true,unknown:[]}}
export function mergeBuildSources(previous={},incoming){
 if(!['GOOD','GCSIM','MANUAL'].includes(incoming?.source))throw Error('Unknown source.');
 const key=incoming.source.toLowerCase(),old=previous[key];
 if(key==='manual'){
  const characters=new Map((old?.characters||[]).map(c=>[c.id,c]));for(const c of incoming.characters)characters.set(c.id,c);
  const ownedIds=new Set(old?.ownedIds||[]);for(const c of incoming.characters){if(incoming.owned)ownedIds.add(c.id);else ownedIds.delete(c.id)}
  return {...previous,manual:{...incoming,characters:[...characters.values()],ownedIds:[...ownedIds]}};
 }
 if(old?.uid&&incoming.uid&&old.uid!==incoming.uid)throw Error(`GOOD UID ${incoming.uid} does not match previously imported UID ${old.uid}. Remove the old import before switching accounts.`);
 const characters=new Map((old?.characters||[]).map(c=>[c.id,c]));for(const rec of incoming.characters||[]){const former=characters.get(rec.id);characters.set(rec.id,former?{...former,...rec,level:rec.level??former.level,constellation:rec.constellation??former.constellation,ascensionStage:rec.ascensionStage??former.ascensionStage,talentLevels:Object.fromEntries(['normal','skill','burst'].map(t=>[t,rec.talentLevels?.[t]??former.talentLevels?.[t]??null])),weapon:rec.weapon||former.weapon,artifacts:rec.artifacts?.length?rec.artifacts:former.artifacts,stats:rec.stats||former.stats}:rec)}
 const merged={...old,...incoming,characters:[...characters.values()]};
 if(key==='good'){
  merged.uid=incoming.uid||old?.uid||null;
  // A section omitted from a second export must never erase prior full-inventory data.
  merged.weaponInventory=incoming.sections?.weapons&&incoming.weaponInventory.length>=(old?.weaponInventory?.length||0)?incoming.weaponInventory:old?.weaponInventory||incoming.weaponInventory;
  merged.artifactInventory=incoming.sections?.artifacts&&incoming.artifactInventory.length>=(old?.artifactInventory?.length||0)?incoming.artifactInventory:old?.artifactInventory||incoming.artifactInventory;
  merged.rosterComplete=!!(incoming.rosterComplete||old?.rosterComplete);
 }
 return {...previous,[key]:merged};
}
/** Per-ID public showcase wins for CURRENT EQUIPPED BUILD; GOOD remains full inventory; gcsim stays simulation-only. */
export function effectiveCharacter(account,sources={},id){const enka=account?.characters?.find(c=>c.id===id),good=sources.good?.characters?.find(c=>c.id===id),manual=sources.manual?.characters?.find(c=>c.id===id),sim=sources.gcsim?.characters?.find(c=>c.id===id);
 const primary=enka||good||manual||sim;if(!primary)return null;
 const talentLevels=primary.talentLevels||good?.talentLevels||manual?.talentLevels||sim?.talentLevels;
 const skillLevelMap={...(primary.skillLevelMap||{})};
 if(talentLevels)for(const [i,t] of ['normal','skill','burst'].entries()){const key=talentSkillIds[id]?.[i];if(key&&talentLevels[t]!=null&&!skillLevelMap[key])skillLevelMap[key]=talentLevels[t]}
 return {...primary,skillLevelMap,artifacts:primary.artifacts||[],dataSource:enka?'ENKA':good?'GOOD':manual?'MANUAL':'GCSIM',availableSources:[enka&&'ENKA',good&&'GOOD',manual&&'MANUAL',sim&&'GCSIM'].filter(Boolean)};
}
export function ownershipStatus(account,sources={},id){
 if(sources.good?.characters?.some(c=>c.id===id))return {kind:'owned',source:'GOOD'};
 if(sources.manual?.ownedIds?.includes(id))return {kind:'owned',source:'MANUAL'};
 if(account?.characters?.some(c=>c.id===id))return {kind:'owned',source:'ENKA showcase (not a full roster)'};
 if(sources.good?.rosterComplete)return {kind:'unowned',source:'GOOD · complete roster confirmed by user'};
 return {kind:'unknown',source:'No complete roster; simulator builds do not prove ownership'};
}
