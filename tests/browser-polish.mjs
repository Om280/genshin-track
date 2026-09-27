import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import catalog from '../src/data/catalog.json' with {type:'json'};
const origin=process.env.SMOKE_ORIGIN||'http://127.0.0.1:5173';
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:1280,height:860},timezoneId:'Asia/Kolkata'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/');await page.locator('.dash-art').waitFor();
 assert.match(await page.locator('.dash-hero-caption').innerText(),/CLORINDE.*ELECTRO.*SWORD.*★★★★★/);
 assert.ok((await page.locator('.dash-art').getAttribute('src')).includes('clorinde-splash'));
 await page.goto(origin+'/guides');await page.locator('.guide-filter-line').first().waitFor();
 assert.equal(await page.locator('.guide-card').first().locator('h3').innerText(),'Clorinde');
 assert.ok(!(await page.locator('main').innerText()).includes('REVIEW NEEDED'));
 assert.equal(await page.locator('.index-list .entity').count(),154);
 for(const element of ['Pyro','Hydro','Anemo','Electro','Cryo','Geo','Dendro']){
  await page.getByRole('group',{name:'Filter by element'}).getByRole('button',{name:element}).click();
  assert.equal(await page.locator('.index-list .entity').count(),catalog.characters.filter(c=>c.element===element).length,`${element} filter`);
 }
 await page.getByRole('group',{name:'Filter by element'}).getByRole('button',{name:'ALL'}).click();
 for(const weapon of ['Sword','Claymore','Polearm','Bow','Catalyst']){
  await page.getByRole('group',{name:'Filter by weapon'}).getByRole('button',{name:weapon}).click();
  assert.equal(await page.locator('.index-list .entity').count(),catalog.characters.filter(c=>c.weaponType===weapon).length,`${weapon} filter`);
 }
 await page.getByRole('group',{name:'Filter by weapon'}).getByRole('button',{name:'ALL'}).click();
 await page.getByRole('group',{name:'Filter by element'}).getByRole('button',{name:'Electro'}).click();
 await page.getByRole('group',{name:'Filter by weapon'}).getByRole('button',{name:'Sword'}).click();
 await page.getByRole('textbox',{name:'Search character guides'}).fill('clor');
 assert.equal(await page.locator('.index-list .entity').count(),1);
 assert.match(await page.locator('.index-list').innerText(),/Clorinde/);
 await page.getByRole('group',{name:'Filter by weapon'}).getByRole('button',{name:'Bow'}).click();assert.equal(await page.locator('.index-list .entity').count(),0);
 await page.getByRole('group',{name:'Filter by weapon'}).getByRole('button',{name:'ALL'}).click();
 await page.getByRole('group',{name:'Filter by element'}).getByRole('button',{name:'ALL'}).click();
 await page.getByRole('textbox',{name:'Search character guides'}).fill('');assert.equal(await page.locator('.index-list .entity').count(),154);
 await page.locator('.guide-card').first().click();await page.getByRole('button',{name:'ADD TO GOALS'}).click();
 await page.locator('.goal-editor').waitFor();assert.equal(await page.locator('.goal-editor-panel').first().locator('input[type="number"]').last().inputValue(),'');
 await page.getByRole('button',{name:'CANCEL',exact:true}).click();
 await page.goto(origin+'/goals');await page.locator('.farm-today').waitFor();assert.ok(await page.locator('.farm-domain-grid article').count()>0);
 await page.getByRole('button',{name:'ADD GOAL'}).first().click();await page.locator('.goal-editor').waitFor();
 await page.locator('.goal-editor').getByRole('textbox',{name:'CHARACTER',exact:true}).count().catch(()=>{}); // no reliance on dropdown contents
 const form=page.locator('.goal-editor');
 await form.locator('.goal-editor-panel').first().locator('input[type="number"]').first().fill('20'); // character CURRENT
 await form.locator('.goal-editor-panel').first().locator('input[type="number"]').last().fill('90');
 await form.getByRole('textbox',{name:'ELEMENTAL SKILL current level'}).count().catch(()=>{});
 await form.locator('input[aria-label="ELEMENTAL SKILL current level"]').fill('8');
 await form.locator('input[aria-label="ELEMENTAL SKILL target level"]').fill('10');
 await form.getByLabel('Completed ascension stages').selectOption('0');
 await form.getByLabel('Target ascension stage').selectOption('1');
 await page.locator('.goal-material-chip').first().waitFor();
 assert.match(await form.innerText(),/1,150,000 MORA/);
 assert.ok(await form.locator('.goal-material-chip').filter({hasText:'Philosophies of Justice'}).count()>0);
 assert.match(await form.locator('.goal-cost-summary').innerText(),/CHARACTER EXP/);
 assert.ok(await form.locator('.goal-material-chip').filter({hasText:"Hero's Wit"}).count()>0);
 const balancedBudget=await form.locator('.goal-cost-summary span').first().locator('b').innerText();
 await form.getByLabel(/EXP BOOK PLAN/).selectOption('hero-only');
 assert.ok(await form.locator('.goal-material-chip').filter({hasText:"Adventurer's Experience"}).count()===0);
 assert.notEqual(await form.locator('.goal-cost-summary span').first().locator('b').innerText(),balancedBudget);
 await form.getByLabel(/EXP BOOK PLAN/).selectOption('balanced');
 const book=await form.locator('.goal-material-chip').filter({hasText:'Philosophies of Justice'}).first();await book.getByRole('spinbutton').fill('28');assert.match(await book.innerText(),/0 LEFT/);
 await form.getByRole('button',{name:'SAVE GOAL'}).click();await page.locator('.goal-card').first().waitFor();
 await page.locator('.goal-card').first().getByRole('button',{name:'UPDATE'}).click();
 const edit=page.locator('.goal-editor');await edit.locator('.goal-plan-selectors select').first().selectOption('11515');
 await edit.locator('.goal-editor-panel').nth(1).locator('input[type="number"]').first().fill('20');
 await edit.locator('.goal-editor-panel').nth(1).locator('input[type="number"]').last().fill('40');
 await edit.getByLabel('Completed weapon ascension stages').selectOption('0');await edit.getByLabel('Target weapon ascension stage').selectOption('1');
 assert.ok(await edit.locator('.goal-material-chip').filter({hasText:'Fragment of an Ancient Chord'}).count()>0);
 assert.ok(await edit.locator('.goal-material-chip').filter({hasText:'Mystic Enhancement Ore'}).count()>0);
 await edit.getByRole('button',{name:'SAVE GOAL'}).click();
 assert.ok(await page.locator('.farm-goal').count()>=1);
 assert.ok(await page.locator('.farm-item.weekly').count()>=1);
 const before=await page.locator('.farm-today .section-aside').innerText();
 await page.clock.setFixedTime(new Date('2026-09-28T09:00:00+05:30'));await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 await page.locator('.farm-today .section-aside').getByText(/MONDAY/).waitFor();
 const weaponFarm=page.locator('.farm-item-detail').filter({hasText:'Fragment of an Ancient Chord'}).first();
 await weaponFarm.locator('summary').click();assert.match(await weaponFarm.innerText(),/REQUIRED FOR YOUR GOAL/);
 assert.ok(await weaponFarm.getByRole('link',{name:/VIEW MATERIAL/}).count()===1);
 await page.clock.setFixedTime(new Date('2026-09-29T09:00:00+05:30'));await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 await page.locator('.farm-today .section-aside').getByText(/TUESDAY/).waitFor();
 assert.ok(await page.locator('.farm-item').filter({hasText:'Guide to Justice'}).count()===0);
 assert.deepEqual(errors,[]);
 console.log(`Guide filters, Clorinde hero, create/update resources, owned inventory and weekday change passed (initial day ${before}).`);
}finally{await browser.close()}
