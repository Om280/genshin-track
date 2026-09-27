import catalog from '../data/catalog.json' with {type:'json'};
import manifest from '../data/assetManifest.json' with {type:'json'};
import materialCatalog from '../data/materialCatalog.json' with {type:'json'};
import splashManifest from '../data/splashManifest.json' with {type:'json'};
const base='https://enka.network';
const neutral='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="#222234"/><path d="M40 15 63 40 40 65 17 40Z" fill="none" stroke="#7868aa" stroke-width="1"/><path d="M40 26 52 40 40 54 28 40Z" fill="#544575"/></svg>');
const verified=Object.fromEntries(Object.entries(manifest).map(([type,keys])=>[type,new Set(keys)]));
const local=(type,key)=>verified[type]?.has(String(key))?`/assets/icons/${type}-${key}.png`:neutral;
// Stable Enka IDs (not display names) are the sole identity for cached art.
// Independently verified full Enka Gacha art, keyed by stable character ID; no portrait fallback.
const splashFiles=new Map(Object.entries(splashManifest).filter(([,entry])=>entry.path).map(([id,entry])=>[id,entry.path]));
// Preserve the existing high-resolution dashboard/featured art for these three heroes.
for(const [id,path] of [['10000038','/assets/albedo-splash.webp'],['10000089','/assets/furina-splash.webp'],['10000098','/assets/clorinde-splash.png']])splashFiles.set(id,path);
export const assetRegistry={characters:new Map(catalog.characters.map(x=>[x.id,x])),weapons:new Map(catalog.weapons.map(x=>[x.id,x])),artifacts:new Map(catalog.artifacts.map(x=>[x.id,x])),splashes:splashFiles,materials:new Map(Object.entries(materialCatalog)),verified};
export const getCharacterIcon=id=>local('character',id);
export const getCharacterSplash=id=>assetRegistry.splashes.get(String(id))||null;
// Reserved for genuine tall card art when a separately verified card registry exists.
// Never alias portrait icons or full gacha splashes as card assets.
export const getCharacterCard=_id=>null;
export const getWeaponIcon=id=>local('weapon',id);
export const getArtifactSetIcon=id=>local('artifact',id);
export const getArtifactIcon=getArtifactSetIcon;
export const getArtifactPieceIcon=(id,slot)=>local('artifact-piece',`${id}-${slot}`);
export const getTalentIcon=(id,i)=>local('skill',`${id}-${i}`);
export const getConstellationIcon=(id,i)=>local('skill',`${id}-${i+3}`);
export const getMaterialIcon=id=>assetRegistry.materials.get(String(id))?.icon||neutral;
export const getElementIcon=e=>['Pyro','Hydro','Electro','Anemo','Geo','Cryo','Dendro'].includes(e)?`/assets/${e.toLowerCase()}.svg`:neutral;
export const getCatalog=()=>catalog;
export const findCharacter=name=>catalog.characters.find(x=>x.name.toLowerCase()===String(name).toLowerCase());
export const findWeapon=name=>catalog.weapons.find(x=>x.name.toLowerCase()===String(name).toLowerCase());
export const findArtifact=name=>catalog.artifacts.find(x=>x.name.toLowerCase()===String(name).toLowerCase());
export const findMaterial=name=>Object.values(materialCatalog).find(x=>x.name.toLowerCase()===String(name).toLowerCase());
export const fallbackIcon=neutral;
export const getRemoteIcon=path=>{if(typeof path!=='string')return neutral;if(/^\/ui\/[A-Za-z0-9_]+\.png$/.test(path))return base+path;if(/^UI_[A-Za-z0-9_]+$/.test(path))return `${base}/ui/${path}.png`;return neutral};
