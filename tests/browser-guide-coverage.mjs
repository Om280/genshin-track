import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {guideRegistry,guideExceptions} from '../src/data/guides.js';
import catalog from '../src/data/catalog.json' with {type:'json'};
const origin=process.env.SMOKE_ORIGIN||'http://127.0.0.1:5173';
const ids={Pyro:'10000096',Hydro:'10000089',Cryo:'10000002',Electro:'10000098',Geo:'10000038',Anemo:'10000022',Dendro:'10000073'};
const extras=['10000044','10000143','10000140','10000005-505','10000117-11702'];
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/guides');const guideDir=await page.locator('main').innerText();assert.match(guideDir,/154\s*\/\s*154\s+CHARACTERS/);assert.ok(!guideDir.includes('NEED FRESHNESS REVIEW'));assert.ok(!guideDir.includes('REVIEW NEEDED'));assert.equal(await page.locator('.guide-card').first().locator('h3').innerText(),'Clorinde');assert.equal(await page.locator('.index-list .entity').count(),154);await page.locator('.guide-source-disclosure summary').click();assert.match(await page.locator('.guide-source-disclosure').innerText(),/150 locally source-structured guides/);assert.match(await page.locator('.guide-source-disclosure').innerText(),/REVIEW NEEDED/);
 for(const id of [...Object.values(ids),...extras]){
  const name=catalog.characters.find(c=>c.id===id).name;
  assert.ok(guideRegistry[id],id);
  const resp=await page.goto(origin+'/guides/'+id);assert.equal(resp.status(),200);
  const content=await page.locator('main').innerText();
  for(const label of ['At a glance','WEAPONS','ARTIFACTS','STAT PRIORITIES','TALENT PRIORITY','TEAM COMPOSITIONS','Source & freshness','OPEN ORIGINAL GUIDE'])assert.ok(content.includes(label),`${name} (${id}): ${label}`);
  assert.ok(!content.includes('No locally reviewed build yet'),id);
  assert.ok(await page.locator('.weapon-row').count()>=1,id);
  assert.ok(await page.locator('.artifact-rec').count()>=1,id);
  assert.ok(await page.locator('.stat-triple').count()>=1,id);
  assert.ok(await page.locator('.talent').count()>=3,id);
 }
 for(const id of Object.keys(guideExceptions)){
  await page.goto(origin+'/guides/'+id);const text=await page.locator('main').innerText();assert.match(text,/No independent elemental build verified/);assert.match(text,/Unresonated Traveler|unassigned Traveler variant/i);
 }
 assert.deepEqual(errors,[]);
 console.log('7 elements + 5 cross-source profiles + 4 justified unassigned Traveler exceptions rendered without JS errors.');
}finally{await browser.close()}
