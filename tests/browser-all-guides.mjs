import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import catalog from '../src/data/catalog.json' with {type:'json'};
import {guideRegistry,guideExceptions} from '../src/data/guides.js';
const origin=process.env.SMOKE_ORIGIN||'http://127.0.0.1:5173';
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1200,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));let reviewed=0,unverified=0;
 for(const c of catalog.characters){
  const response=await page.goto(`${origin}/guides/${c.id}`,{waitUntil:'domcontentloaded',timeout:20000});
  assert.equal(response.status(),200,c.id);await page.locator('main').waitFor({timeout:15000});
  const text=await page.locator('main').innerText();assert.ok(text.includes('GUIDES')&&text.includes(c.name.toUpperCase()),`${c.id}: character route`);
  const metadata=await page.locator('.character-meta').innerText();assert.ok(metadata.includes(c.element)&&(!c.weaponType||metadata.includes(c.weaponType)),`${c.id}: element/weapon metadata`);
  assert.ok(await page.locator('.character-meta img').first().evaluate(async img=>{try{await img.decode();return img.naturalWidth>0}catch{return false}}),`${c.id}: element icon`);
  assert.ok(await page.locator('.character-hero .hero-art').evaluate(async img=>{try{await img.decode();return img.naturalWidth>0}catch{return false}}),`${c.id}: hero image`);
  if(guideRegistry[c.id]){
   assert.ok(text.includes('At a glance')&&text.includes('WEAPONS')&&text.includes('ARTIFACTS')&&text.includes('TALENT PRIORITY')&&text.includes('OPEN ORIGINAL GUIDE'),`${c.id}: incomplete build page`);
   assert.ok(!text.includes('No locally reviewed build yet'),`${c.id}: fallback`);reviewed++;
  }else{assert.ok(guideExceptions[c.id],c.id);assert.ok(text.includes('No independent elemental build verified.'),c.id);unverified++}
  assert.deepEqual(errors,[],`${c.id}: browser JS errors`);
 }
 console.log(`Browser guide routes: ${reviewed} substantive guide pages + ${unverified} explicit unassigned-element exceptions; all ${catalog.characters.length} routes rendered.`);
}finally{await browser.close()}
