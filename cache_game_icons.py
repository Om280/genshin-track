"""Cache Enka UI icons only when the declared catalog path returns a real PNG.
ID and slot naming is explicit; never substitute an unrelated set or piece.
"""
import json,requests,concurrent.futures,time,os
from pathlib import Path
from collections import Counter
cat=json.loads(Path('src/data/catalog.json').read_text());root=Path('public/assets/icons');root.mkdir(parents=True,exist_ok=True)
jobs={}
for kind,items in [('character',cat['characters']),('weapon',cat['weapons']),('artifact',cat['artifacts'])]:
 for item in items:
  if item.get('icon'):jobs[f'{kind}-{item["id"]}.png']=item['icon']
for c in cat['characters']:
 for i,path in enumerate((c.get('skills') or [])+(c.get('constellations') or [])):
  if path:jobs[f'skill-{c["id"]}-{i}.png']=path
for a in cat['artifacts']:
 for slot,path in (a.get('pieces') or {}).items():
  if path:jobs[f'artifact-piece-{a["id"]}-{slot}.png']=path

def get(pair):
 name,upstream=pair;file=root/name
 if file.is_file() and file.read_bytes()[:8]==b'\x89PNG\r\n\x1a\n':return name,True
 if not upstream.startswith('/ui/') or not upstream.endswith('.png'):return name,False
 try:
  r=requests.get('https://enka.network'+upstream,timeout=12,headers={'User-Agent':'GenshinTrack/1.0 (cached static icon snapshot)'})
  if r.status_code==200 and len(r.content)<500000 and r.content[:8]==b'\x89PNG\r\n\x1a\n':file.write_bytes(r.content);return name,True
 except requests.RequestException:pass
 return name,False
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(get,jobs.items()))
good={name for name,ok in results if ok};broken=[name for name,ok in results if not ok]
manifest={kind:sorted(name[len(kind)+1:-4] for name in good if name.startswith(kind+'-') and (kind!='artifact' or not name.startswith('artifact-piece-'))) for kind in ['character','weapon','artifact','skill','artifact-piece']}
Path('src/data/assetManifest.json').write_text(json.dumps(manifest,separators=(',',':')))
print('Verified cached icon coverage',len(good),'of',len(jobs),{k:len(v) for k,v in manifest.items()});print('Unavailable source icons',len(broken),broken[:32])
