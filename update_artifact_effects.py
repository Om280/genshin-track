"""Source-match set effect text by exact normalized set name. Never invent effects for historical missing sets."""
import json,re,requests,bs4
from pathlib import Path
cat=json.loads(Path('src/data/catalog.json').read_text())['artifacts'];meta=json.loads(Path('src/data/entityMeta.json').read_text())
upstream='https://raw.githubusercontent.com/MadeBaruna/paimon-moe/main/src/data/artifacts/en.json'
paimon=requests.get(upstream,timeout=20).json()
page='https://gamewith.net/genshin-impact/article/show/22393'
soup=bs4.BeautifulSoup(requests.get(page,timeout=20,headers={'User-Agent':'Mozilla/5.0'}).text,'html.parser')
def norm(t):return re.sub('[^a-z0-9]','',t.lower())
pindex={norm(x['name']):x for x in paimon.values()};gindex={}
for tr in soup.select('tr'):
 cells=tr.find_all('td',recursive=False)
 if len(cells)<2:continue
 a=cells[0].find('a',href=re.compile(r'^https://gamewith\.net/genshin-impact/article/show/'))
 if not a:continue
 name=a.get_text(' ',strip=True);text=cells[1].get_text(' ',strip=True)
 match=re.search(r'2pc\. Effect:\s*(.+?)\s*4pc\. Effect:\s*(.+?)(?:\s*Works With:|$)',text,re.I)
 if match and len(match[1])<300 and len(match[2])<1200:gindex[norm(name)]={'bonus2':match[1],'bonus4':match[2],'sourceUrl':a['href']}
added=0
for a in cat:
 name=a['name'];key=norm(name);entry=meta['artifacts'].setdefault(name,{})
 p=pindex.get(key)
 if p and p.get('setPiece')==[1]:
  entry.update({'bonus1':p['bonuses'][0],'bonus2':None,'bonus4':None,'setPiece':[1],'bonusSourceUrl':upstream});continue
 if p and p.get('setPiece')==[2,4] and len(p.get('bonuses',[]))>=2:
  if not entry.get('bonus2'):entry['bonus2']=p['bonuses'][0];added+=1
  if not entry.get('bonus4'):entry['bonus4']=p['bonuses'][1];added+=1
  entry['setPiece']=[2,4];entry.setdefault('bonusSourceUrl',upstream)
 elif key in gindex:
  g=gindex[key]
  for bonus in ['bonus2','bonus4']:
   if not entry.get(bonus):entry[bonus]=g[bonus];added+=1
  entry['setPiece']=[2,4];entry.setdefault('bonusSourceUrl',g['sourceUrl'])
Path('src/data/entityMeta.json').write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':')))
print('Added',added,'set bonuses. Matched',sum(bool(meta['artifacts'].get(a['name'],{}).get('bonus1') or (meta['artifacts'].get(a['name'],{}).get('bonus2') and meta['artifacts'].get(a['name'],{}).get('bonus4'))) for a in cat),'of',len(cat),'without inventing unavailable effects')
