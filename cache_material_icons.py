"""Download only verified matching Paimon.moe material ID files, never substitute an icon."""
from pathlib import Path
import json,requests,concurrent.futures
registry=Path('src/data/materialCatalog.json');items=json.loads(registry.read_text());root=Path('public/assets/materials');root.mkdir(parents=True,exist_ok=True)
def fetch(pair):
 id,x=pair;file=root/f'{id}.png'
 if file.exists() and file.read_bytes()[:8]==b'\x89PNG\r\n\x1a\n':return id,True
 try:
  r=requests.get('https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/static/images/items/'+id+'.png',timeout=13)
  if r.status_code==200 and r.content[:8]==b'\x89PNG\r\n\x1a\n' and len(r.content)<500000:file.write_bytes(r.content);return id,True
 except requests.RequestException:pass
 return id,False
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=dict(ex.map(fetch,items.items()))
for id,good in results.items():items[id]['icon']=f'/assets/materials/{id}.png' if good else None
registry.write_text(json.dumps(items,ensure_ascii=False,separators=(',',':')))
print('Verified material icons',sum(results.values()),'of',len(items),'missing',[id for id,ok in results.items() if not ok][:30])
