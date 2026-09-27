import {writeFileSync} from 'node:fs';
import catalog from './src/data/catalog.json' with {type:'json'};
import {guideRegistry,guideExceptions,guideCoverage} from './src/data/guides.js';
const queue=catalog.characters.map(c=>{
 const g=guideRegistry[c.id],exception=guideExceptions[c.id];
 return {characterId:c.id,character:c.name,element:c.element,guideStatus:g?.guideStatus||exception?.guideStatus||'missing',reviewedAt:g?.reviewedAt||null,source:g?.source||null,sourceUrl:g?.sourceUrl||null,sourceVersion:g?.sourceVersion||null,lastUpdated:g?.lastUpdated||null,freshness:g?.freshnessStatus||'UNVERIFIED',missingFields:g?.validationGaps||[],reason:exception?.reason||null,sourceStatus:exception?.sourceStatus||null};
});
writeFileSync('src/data/guideQueue.json',JSON.stringify(queue,null,2)+'\n');
console.log(JSON.stringify(guideCoverage));
console.log('Explicitly unverified:',queue.filter(x=>x.guideStatus==='unverified').map(x=>`${x.character} (${x.characterId})`).join(', '));
