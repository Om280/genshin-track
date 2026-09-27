// Optional browser smoke run: npx playwright install chromium && npm run smoke
// Requires npm run dev (Vite + API) in another terminal. No account credentials needed.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const materials=JSON.parse(readFileSync(new URL('../src/data/materialCatalog.json',import.meta.url)));
const materialId=Object.keys(materials)[0];
const origin=process.env.SMOKE_ORIGIN||'http://localhost:5173';
const widths=[320,390,768,1024,1440];
const pages=['/','/guides','/guides/10000098','/guides/10000089','/guides/10000125','/roster','/materials',`/materials/${materialId}`,'/goals','/wishes'];
const browser=await chromium.launch({args:['--no-sandbox']});
let visits=0;
try {
 for (const width of widths) {
  const context=await browser.newContext({viewport:{width,height:860},permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  for(const path of pages){
   const response=await page.goto(origin+path,{waitUntil:'networkidle'});
   assert.equal(response.status(),200,`${path}: HTTP status`);
   await page.locator('main').waitFor();
   const result=await page.evaluate(()=>({excess:document.documentElement.scrollWidth-window.innerWidth,body:document.querySelector('main')?.innerText||'',broken:[...document.querySelectorAll('main img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc).slice(0,3)}));
   assert.ok(result.excess<=1,`${width}px ${path}: horizontal overflow ${result.excess}px`);
   assert.ok(result.body.trim().length>50,`${width}px ${path}: empty page`);
   assert.deepEqual(result.broken,[],`${width}px ${path}: broken images`);
   assert.deepEqual(errors,[],`${width}px ${path}: JS errors`);
   visits++;
  }
  await page.goto(origin+'/goals',{waitUntil:'networkidle'});await page.getByRole('button',{name:'ADD GOAL'}).first().click();assert.ok(await page.evaluate(()=>{const m=document.querySelector('.modal');return m.scrollWidth-m.clientWidth<=1&&document.documentElement.scrollWidth-window.innerWidth<=1}),`${width}px goal editor overflow`);await page.getByRole('button',{name:'CANCEL',exact:true}).click();
  if(width===390){
   await page.goto(origin+'/wishes',{waitUntil:'networkidle'});
   // The clipboard URL must be sent directly to the backend, not saved in a form field.
   await page.route('**/api/wishes/import',async route=>{
    const payload=JSON.parse(route.request().postData());
    assert.ok(payload.url.includes('authkey=mock-ephemeral-key'));
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({records:[{id:'mock-1',uid:'888888888',date:'2026-09-26 09:50:00',itemName:'Clorinde',rarity:5,bannerType:'301',source:'HoYoverse history'}],uid:'888888888'})});
   });
   await page.getByRole('button',{name:'IMPORT HISTORY'}).first().click();
   await page.evaluate(()=>navigator.clipboard.writeText('https://hk4e-api-os.mihoyo.com/gacha_info/api/getGachaLog?authkey=mock-ephemeral-key'));
   await page.getByRole('button',{name:'IMPORT COPIED LINK'}).click();
   await page.getByText('IMPORT COMPLETE',{exact:false}).waitFor();
   assert.ok(!(await page.locator('body').innerText()).includes('mock-ephemeral-key'),'authkey must not be visible');
   assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('mock-ephemeral-key'),'authkey must not persist');
   await page.getByRole('button',{name:'DONE'}).click();
   assert.ok((await page.locator('.wish-tabs').innerText()).includes('PULL HISTORY 1'));
   console.log('390px copied-link browser flow passed (mocked backend response; not a live account)');
  }
  await context.close();
 }
 console.log(`${visits} route × viewport checks passed (${widths.join(', ')}px)`);
} finally { await browser.close(); }
