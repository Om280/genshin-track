import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import catalog from '../src/data/catalog.json' with {type:'json'};
import {getGuide} from '../src/data/guides.js';
const origin=process.env.SMOKE_ORIGIN||'http://127.0.0.1:5173';
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,375,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto(origin+'/guides/10000098?tab=mine');await page.locator('.tracker-investment-grid').waitFor();
  const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));assert.ok(dims.scroll<=dims.client,`${width}: horizontal overflow ${JSON.stringify(dims)}`);
  assert.equal(await page.locator('.tracker-panel').count(),6);
 }
 await page.setViewportSize({width:1280,height:900});await page.goto(origin+'/guides/10000098?tab=mine');
 assert.equal(await page.locator('.tracker-stepper').filter({hasText:'Character current level'}).locator('input').inputValue(),'1');
 await page.getByRole('spinbutton',{name:'Character current level'}).fill('80');assert.equal(await page.getByLabel('Character completed ascension stage').inputValue(),'5','minimum A5 follows level 80, but never assumes A6');
 await page.getByRole('spinbutton',{name:'Character desired level'}).fill('90');assert.equal(await page.getByLabel('Character desired ascension stage').inputValue(),'6');
 await page.getByRole('spinbutton',{name:'Normal Attack current level'}).fill('8');await page.getByRole('spinbutton',{name:'Normal Attack target level'}).fill('10');
 assert.match(await page.locator('.tracker-talent-grid article').first().innerText(),/1,150,000 MORA/);
 assert.ok((await page.locator('.tracker-resin-breakdown').innerText()).includes('NOT ESTIMABLE'),'weekly materials excluded from totals');
 await page.getByRole('combobox',{name:'Tracked weapon'}).selectOption('11515');await page.getByRole('spinbutton',{name:'Weapon desired level'}).fill('90');
 await page.getByRole('combobox',{name:'Tracked artifact set'}).selectOption({label:'Fragment of Harmonic Whimsy'});
 assert.ok((await page.locator('.tracker-artifact-bonus').first().innerText()).includes('2-PIECE BONUS'));assert.ok((await page.locator('.tracker-artifact-bonus').first().innerText()).includes('4-PIECE BONUS'));
 await page.getByRole('button',{name:'SAVE MY BUILD'}).click();assert.ok((await page.locator('.tracker-success').count())===1);
 await page.reload();assert.equal(await page.getByRole('spinbutton',{name:'Character desired level'}).inputValue(),'90');assert.equal(await page.getByRole('spinbutton',{name:'Normal Attack target level'}).inputValue(),'10');
 await page.getByRole('spinbutton',{name:'Normal Attack target level'}).fill('9');await page.getByRole('spinbutton',{name:'Normal Attack current level'}).fill('10');await page.getByRole('button',{name:'SAVE MY BUILD'}).click();assert.match(await page.getByRole('alert').innerText(),/cannot be below/);
 await page.getByRole('spinbutton',{name:'Normal Attack current level'}).fill('9');assert.match(await page.locator('.tracker-talent-grid article').first().innerText(),/0 MORA · 0 LEVELS/);
 await page.getByRole('button',{name:'BUILD GUIDE'}).click();assert.ok(await page.locator('.guide-abilities').isVisible());
 const displayNames={normal:'NORMAL ATTACK',skill:'ELEMENTAL SKILL',burst:'ELEMENTAL BURST'};assert.equal((await page.locator('.talent-row article').first().locator('.talent-name').innerText()),displayNames[getGuide('10000098').variants[0].talents[0].talentId],'render the source-data row order; do not reorder by role or calculate priorities in the UI');
 assert.deepEqual(errors,[]);console.log('My Build: six responsive sizes, 80 A5→90 A6, 8→10/9→9/10→9, cost and estimated Resin, weapon/artifact effects, one save, reload, source-order talents, zero browser errors.');
 // Every catalog identity must load the editor, even when that guide is an explicitly unavailable Traveler variant.
 for(const character of catalog.characters){await page.goto(`${origin}/guides/${character.id}?tab=mine`,{waitUntil:'domcontentloaded'});assert.equal(await page.locator('.tracker-page').count(),1,character.id);assert.deepEqual(errors,[],`${character.id}: browser JS errors`)}
 console.log(`All ${catalog.characters.length} character-centered My Build routes rendered.`);
}finally{await browser.close()}
