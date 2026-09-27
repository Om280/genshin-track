import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {scheduleForDay} from '../src/lib/farming.js';
const origin=process.env.SMOKE_ORIGIN||'http://127.0.0.1:5173';
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},timezoneId:'Asia/Kolkata'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1920,1440,1280,1024,768,390]){
  await page.setViewportSize({width,height:900});
  for(const id of ['10000098','10000038','10000150']){
   await page.goto(`${origin}/guides/${id}`);const hero=page.locator('.character-hero');await hero.waitFor();const art=hero.locator('.hero-art');
   assert.ok(await art.evaluate(async image=>{await image.decode();return image.naturalWidth>900&&image.naturalHeight>400}),`Full art ${id} at ${width}`);
   assert.ok(!(await art.getAttribute('src')).includes('/characters/'),`no portrait fallback ${id}`);
   const dims=await hero.evaluate(el=>{const outer=el.getBoundingClientRect(),body=el.querySelector('.character-hero-content').getBoundingClientRect(),parts=[...el.querySelectorAll('.hero-overline,.hero-name,.character-meta,.character-hero-content p')].map(node=>node.getBoundingClientRect());return {outer:{left:outer.left,right:outer.right,top:outer.top,bottom:outer.bottom},body:{left:body.left,right:body.right,top:body.top,bottom:body.bottom},parts:parts.map(x=>({left:x.left,right:x.right,top:x.top,bottom:x.bottom})),scroll:el.scrollHeight,client:el.clientHeight}});
   for(const part of [dims.body,...dims.parts])assert.ok(part.left>=dims.outer.left-3&&part.right<=dims.outer.right+3&&part.top>=dims.outer.top-3&&part.bottom<=dims.outer.bottom+3,`hero text clipped at ${width} ${id}: ${JSON.stringify(part)}`);
   // Only the artwork may overflow its crop; every text rectangle must fit (checked above).
  }
 }
 await page.setViewportSize({width:1280,height:900});await page.goto(origin+'/guides/10000098');
 assert.equal(await page.locator('.guide-section-nav a').count(),10);
 const weapons=page.locator('.weapon-list').first();assert.equal(await weapons.locator(':scope > .weapon-row').count(),2);
 assert.ok(await weapons.locator('.more-recommendations summary').count()>0);await weapons.locator('.more-recommendations summary').click();assert.ok(await weapons.locator('.weapon-row:visible').count()>2);
 assert.equal(await page.locator('.artifact-recs').first().locator(':scope > .artifact-rec').count(),2);
 const bonus=page.locator('.artifact-rec .set-bonus-blocks').first();assert.ok(await bonus.locator('div').count()>0);
 assert.ok((await page.locator('.recommended-slots .pieces-grid a').count())===5);
 await page.locator('.guide-section-nav a[href="#guide-constellations"]').click();assert.equal(new URL(page.url()).hash,'#guide-constellations');assert.ok((await page.locator('.early-constellation-card').innerText()).includes('C2'));
 const artifact=page.locator('.artifact-rec .entity').first();await page.waitForTimeout(650);await artifact.scrollIntoViewIfNeeded();await artifact.hover();await page.waitForTimeout(400);const tip=artifact.locator('.entity-tip');assert.ok(await tip.isVisible());assert.equal(await tip.evaluate(el=>getComputedStyle(el).overflowY),'hidden','hover is a short non-scrolling summary');
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/guides/10000098');
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const mobile=await touch.newPage();await mobile.goto(origin+'/guides/10000098');const mobileArtifact=mobile.locator('.artifact-rec .entity').first();await mobileArtifact.click();assert.ok(await mobileArtifact.locator('.entity-tip.open').isVisible());await touch.close();
 await page.goto(origin+'/goals');await page.locator('.farm-domain-grid article').first().waitFor();const label=(await page.locator('.farm-today .section-title').first().innerText()).toLowerCase(),day=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].find(d=>label.includes(d));assert.ok(day,label);assert.equal(await page.locator('.farm-domain-grid > article').count(),scheduleForDay(day).length);assert.ok(await page.locator('.farm-domain-card').filter({hasText:'TALENT BOOKS'}).locator('.farm-domain-linked a').count()>0);assert.ok(await page.locator('.farm-domain-card').filter({hasText:'WEAPON ASCENSION'}).locator('.farm-domain-linked a').count()>0);
 await page.getByRole('button',{name:'ADD GOAL'}).first().click();await page.locator('.goal-editor').waitFor();assert.equal(await page.locator('.goal-editor-panel').first().locator('input[type="number"]').first().inputValue(),'1','new manual goal begins at level 1');assert.equal(await page.getByLabel('ELEMENTAL SKILL current level').inputValue(),'1');await page.getByRole('button',{name:'CANCEL',exact:true}).click();
 // Actual browser → local API → Enka; never a mock or invented account.
 await page.goto(origin+'/');await page.getByRole('button',{name:'Import account'}).click();const dialog=page.locator('.modal');await dialog.locator('input[inputmode="numeric"]').fill('618285856');await dialog.getByRole('button',{name:'IMPORT SHOWCASE'}).click();await dialog.getByText(/Imported 4 public showcased characters/).waitFor({timeout:35000});await dialog.getByRole('button',{name:'CLOSE',exact:true}).click();await page.goto(origin+'/roster');assert.equal(await page.locator('.roster-cards').first().locator('.roster-card').count(),4);
 assert.deepEqual(errors,[]);console.log('6 viewports × 3 full-art heroes with unclipped copy; guide navigation/reveal/artifact popovers; all farm domains with linked icons; live Enka browser import and 4 showcased characters passed.');
}finally{await browser.close()}
