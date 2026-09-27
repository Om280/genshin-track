import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const origin=process.env.SMOKE_ORIGIN||'http://localhost:5173';
const browser=await chromium.launch({args:['--no-sandbox']});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const openImport=async()=>page.getByRole('button',{name:'Import account'}).click();
 const close=async()=>page.getByRole('button',{name:'CLOSE',exact:true}).click();
 await page.goto(origin+'/');await openImport();
 await page.getByRole('button',{name:'GENSHIN OPTIMIZER / GOOD'}).click();
 const good={format:'GOOD',version:3,source:'fixture',characters:['Clorinde','Fischl','Nahida','KaedeharaKazuha'].map(key=>({key,level:80,ascension:5,constellation:0,talent:{auto:1,skill:8,burst:8}})),weapons:[{key:'FinaleOfTheDeep',level:80,refinement:5,location:'Clorinde'}],artifacts:[{setKey:'FragmentOfHarmonicWhimsy',slotKey:'flower',level:20,rarity:5,mainStatKey:'hp',substats:[],location:'Clorinde'}]};
 await page.locator('.modal textarea').fill(JSON.stringify(good));await page.getByText('I confirm this export includes EVERY character I own.').click();await page.getByRole('button',{name:'IMPORT BUILD / CHARACTER DATA'}).click();assert.equal((await page.locator('.import-status').innerText()).trim(),'COMPLETE');await close();
 await page.goto(origin+'/roster');assert.ok((await page.locator('.roster-card').allInnerTexts()).some(s=>s.includes('Clorinde')));assert.ok((await page.locator('.coverage-grid').innerText()).includes('4'));
 await page.goto(origin+'/guides/10000098');assert.ok((await page.locator('.team-verdict').first().innerText()).includes('FULL TEAM'));assert.ok((await page.locator('.team-verdict').last().innerText()).includes('MISSING'));
 await page.getByLabel('ONLY SHOW TEAMS I CAN BUILD').check();assert.equal(await page.locator('.team-block').count(),1);
 await page.getByRole('button',{name:'ADD TEAM TO GOAL'}).click();assert.ok(page.url().includes('team=cl-aggravate'));await page.locator('.goal-team-note').waitFor();assert.ok((await page.locator('.goal-team-note').innerText()).includes('Fischl: OWNED'));
 await page.getByLabel('CURRENT LEVEL',{exact:true}).first().fill('80');await page.getByLabel('Completed ascension stages').selectOption('5');await page.getByLabel('Target ascension stage').selectOption('6');await page.getByLabel('NORMAL ATTACK current level').fill('1');await page.getByLabel('NORMAL ATTACK target level').fill('6');await page.getByLabel('ELEMENTAL SKILL current level').fill('9');await page.getByLabel('ELEMENTAL SKILL target level').fill('9');await page.getByLabel('ELEMENTAL BURST current level').fill('9');await page.getByLabel('ELEMENTAL BURST target level').fill('9');
 assert.ok((await page.locator('.goal-material-chip').filter({hasText:'Lumitoile'}).innerText()).includes('60'));assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.goal-material-chip img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)),[], 'material chips must load their exact images or neutral fallback');await page.getByRole('button',{name:'SAVE GOAL'}).click();assert.equal(await page.locator('.goal-card').count(),1);
 await page.getByRole('button',{name:'UPDATE'}).first().click();await page.getByLabel('NORMAL ATTACK current level').fill('6');assert.equal(await page.locator('.goal-material-chip').filter({hasText:'Teachings of Justice'}).count(),0);
 await page.getByLabel('ELEMENTAL SKILL target level').fill('8');await page.getByRole('button',{name:'SAVE GOAL'}).click();assert.ok((await page.getByRole('alert').innerText()).includes('Target cannot be lower')||(await page.getByRole('alert').innerText()).includes('Invalid talent target'));
 await page.getByRole('button',{name:'CANCEL',exact:true}).click();await openImport();await page.getByRole('button',{name:'GENSHIN SIMULATOR / GCSIM'}).click();await page.locator('.modal textarea').fill('clorinde char lvl=90/90 cons=1 talent=1,9,9;clorinde add weapon="absolution" refine=1 lvl=90/90;');await page.getByRole('button',{name:'IMPORT BUILD / CHARACTER DATA'}).click();assert.equal((await page.locator('.import-status').innerText()).trim(),'COMPLETE');await close();
 await openImport();await page.getByRole('button',{name:'MANUAL',exact:true}).click();await page.locator('.modal select').first().selectOption('10000089');await page.locator('.modal input[type="checkbox"]').check();await page.getByRole('button',{name:'IMPORT BUILD / CHARACTER DATA'}).click();assert.equal((await page.locator('.import-status').innerText()).trim(),'COMPLETE');await close();
 // Public Enka API responses are mocked; no random UID is sent to Enka and no account data is fabricated.
 await openImport();await page.getByRole('button',{name:'ENKA NETWORK'}).click();await page.locator('.modal input[inputmode="numeric"]').fill('888888888');
 for(const [status,message] of [[400,'Invalid UID'],[404,'No player was found'],[424,'maintenance or updating'],[429,'Too many requests'],[500,'server error'],[503,'service unavailable']]){
  await page.route('**/api/enka/888888888',async route=>route.fulfill({status,contentType:'application/json',body:JSON.stringify({message:({400:'Invalid UID.',404:'No player was found for this UID.',424:'Enka is temporarily unavailable because the game data may be under maintenance or updating. Try again later.',429:'Too many requests. Please wait before syncing again.',500:'Enka is currently unavailable (server error).',503:'Enka is currently unavailable (service unavailable).'})[status]})}));
  await page.getByRole('button',{name:'IMPORT SHOWCASE'}).click();assert.ok((await page.getByRole('alert').innerText()).includes(message),`Enka ${status}`);await page.unroute('**/api/enka/888888888');
 }
 let hits=0;await page.route('**/api/enka/888888888',async route=>{hits++;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({uid:'888888888',nickname:'Mock traveler',characters:[],ttl:300,fetchedAt:Date.now(),expiresAt:Date.now()+300000,syncedAt:Date.now()})})});
 await page.getByRole('button',{name:'IMPORT SHOWCASE'}).click();assert.equal(hits,1);await page.getByRole('button',{name:'IMPORT SHOWCASE'}).click();assert.equal(hits,1,'TTL should keep cached data');await close();
 assert.deepEqual(errors,[]);console.log('GOOD → roster → owned team → goal → delta update; gcsim + manual merge; mocked Enka 400/404/424/429/500/503 + TTL all passed');
}finally{await browser.close()}
