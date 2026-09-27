import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('../src/data/catalog.json',import.meta.url)));
const region={6:'America',7:'Europe',8:'Asia',9:'TW/HK/MO',1:'China'};
const cache=new Map();
export class PublicError extends Error{constructor(message,status=503){super(message);this.status=status}}
export function normaliseEnka(raw,uid){const p=raw.playerInfo||{};const characters=(raw.avatarInfoList||[]).map(a=>{const c=catalog.characters.find(x=>x.id===String(a.avatarId));const w=a.equipList?.find(e=>e.weapon);const weapon=w?catalog.weapons.find(x=>x.id===String(w.itemId)):null;return {id:String(a.avatarId),name:c?.name||`Character ${a.avatarId}`,element:c?.element||null,level:Number(a.propMap?.['4001']?.val||a.propMap?.['4001']?.ival||0)||null,friendship:a.fetterInfo?.expLevel||null,constellation:a.talentIdList?.length??0,skillLevelMap:a.skillLevelMap||{},stats:a.fightPropMap||{},weapon:w?{id:String(w.itemId),name:weapon?.name||null,level:w.weapon?.level||null,refinement:(w.weapon?.affixMap?Object.values(w.weapon.affixMap)[0]+1:1),baseAtk:w.flat?.weaponStats?.find(s=>s.appendPropId==='FIGHT_PROP_BASE_ATTACK')?.statValue??null,secondary:w.flat?.weaponStats?.find(s=>s.appendPropId!=='FIGHT_PROP_BASE_ATTACK')||null,icon:w.flat?.icon||weapon?.icon||null}:null,artifacts:(a.equipList||[]).filter(e=>e.reliquary).map(e=>({id:String(e.itemId),setId:e.flat?.setId?String(e.flat.setId):null,slot:e.flat?.equipType||null,icon:e.flat?.icon||null,level:(e.reliquary?.level||1)-1,rarity:e.flat?.rankLevel||null,main:e.flat?.reliquaryMainstat||null,substats:e.flat?.reliquarySubstats||[]}))}});return {uid,server:region[Number(uid[0])]||'Unknown',nickname:p.nickname||'Traveler',adventureRank:p.level??null,worldLevel:p.worldLevel??null,achievementCount:p.finishAchievementNum??null,showcase:characters.length>0,characters,ttl:Number.isFinite(Number(raw.ttl))?Math.max(0,Number(raw.ttl)):300,syncedAt:Date.now(),fetchedAt:Date.now(),expiresAt:null}}
export const ENKA_STATUS={
 400:'Invalid UID.',
 404:'No player was found for this UID.',
 424:'Enka is temporarily unavailable because the game data may be under maintenance or updating. Try again later.',
 429:'Too many requests. Please wait before syncing again.',
 500:'Enka is currently unavailable (server error).',
 503:'Enka is currently unavailable (service unavailable).'
};
export async function fetchEnka(uid){
 if(!/^\d{9,10}$/.test(uid))throw new PublicError(ENKA_STATUS[400],400);
 const existing=cache.get(uid);
 if(existing&&existing.expiresAt>Date.now())return {...existing.data,fromCache:true};
 try{
  // Enka's canonical UID URL has no trailing slash (the slash form currently returns HTTP 308).
  // With redirect:'error', requesting the slash form falsely reports a network failure.
  const upstream=await fetch(`https://enka.network/api/uid/${uid}`,{
   headers:{'User-Agent':'GenshinTrack/1.0 (fan companion; respectful TTL caching)','Accept':'application/json'},
   redirect:'error',signal:AbortSignal.timeout(14000)
  });
  if(!upstream.ok)throw new PublicError(ENKA_STATUS[upstream.status]||`Enka responded with HTTP ${upstream.status}. Try again later.`,upstream.status>=400&&upstream.status<600?upstream.status:503);
  let raw;try{raw=await upstream.json()}catch{throw new PublicError('Enka returned unreadable game data. Try again after its update.',502)}
  const data=normaliseEnka(raw,uid);
  data.expiresAt=data.fetchedAt+data.ttl*1000;
  if(data.ttl>0)cache.set(uid,{data,expiresAt:data.expiresAt});
  return data;
 }catch(e){
  if(e instanceof PublicError)throw e;
  if(e?.name==='TimeoutError')throw new PublicError('Enka took too long to respond. Try again later.',504);
  throw new PublicError('Could not reach Enka. Check your connection and try again.',503);
 }
}
const hosts=new Set(['hk4e-api-os.mihoyo.com','public-operation-hk4e-sg.hoyoverse.com','public-operation-hk4e-sg.mihoyo.com','hk4e-api.mihoyo.com','public-operation-hk4e.mihoyo.com']);
export async function importWishHistory(rawUrl){let u;try{if(typeof rawUrl!=='string'||rawUrl.length>4096)throw Error();u=new URL(rawUrl);if(u.protocol!=='https:'||!hosts.has(u.hostname)||u.port||u.username||u.password||u.hash||u.pathname!=='/gacha_info/api/getGachaLog'||!u.searchParams.get('authkey')||u.searchParams.get('authkey').length>1200)throw Error()}catch{throw new PublicError('Use a valid HoYoverse wish-history link containing an authkey.',400)}const wishes=[];try{for(const type of ['301','302','200','500','100']){let end='0';for(let page=1;page<=150;page++){const target=new URL(u);target.searchParams.set('gacha_type',type);target.searchParams.set('size','20');target.searchParams.set('page',String(page));target.searchParams.set('end_id',end);target.searchParams.set('lang','en-us');const response=await fetch(target,{headers:{'User-Agent':'GenshinTrack/1.0'},redirect:'error',signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('UPSTREAM');const j=await response.json();if(j.retcode!==0)throw Error(j.message?.includes('timeout')?'EXPIRED':'UPSTREAM');const rows=j.data?.list||[];wishes.push(...rows.map(x=>({id:String(x.id),uid:String(x.uid),date:x.time,itemId:String(x.item_id||''),itemName:x.name,rarity:Number(x.rank_type)||null,bannerType:String(x.gacha_type||type),itemType:x.item_type,source:'HoYoverse history'})));if(rows.length<20)break;const next=String(rows.at(-1).id);if(next===end)break;end=next}}return {records:wishes,uid:wishes[0]?.uid||null}}catch(e){throw new PublicError(e.message==='EXPIRED'?'That wish-history link has expired. Open Wish History in-game and get a new link.':'Wish history could not be fetched right now. Try again later.',502)}}
