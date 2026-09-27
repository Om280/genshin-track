"""Build a one-time KQM homepage guide directory. Not a scraper of guide bodies."""
import bs4, requests, re, json, unicodedata
from datetime import datetime
from zoneinfo import ZoneInfo
chars=json.load(open('src/data/catalog.json'))['characters']
s=bs4.BeautifulSoup(requests.get('https://keqingmains.com/',timeout=20).text,'html.parser')
index={}
for card in s.select('div.character-card'):
 a=card.select_one('a.guide-title')
 if not a:continue
 name=card.select_one('#character-name')
 if not name:continue
 name=name.get_text(' ',strip=True).lower()
 kind=(card.get('data-category') or '').split()[-1]
 if kind not in ('Guide','Infographic'):continue
 item=index.setdefault(name,{})
 if kind=='Infographic':
  item.setdefault('infographic',{'url':a['href'],'version':card.select_one('.update-version').get_text(' ',strip=True) if card.select_one('.update-version') else 'NOT LISTED'})
 else:
  for label,selector in [('quick','a.quick-guide-link'),('extended','a.extended-guide-link')]:
   link=card.select_one(selector)
   if link:
    item[label]={'url':link['href'],'version':link.parent.get_text(' ',strip=True).replace('Quick Guide','').replace('Extended Guide','').strip() or 'NOT LISTED'}
  if not (item.get('quick') or item.get('extended')):item['extended']={'url':a['href'],'version':card.select_one('.update-version').get_text(' ',strip=True) if card.select_one('.update-version') else 'NOT LISTED'}
def norm(x):
 x=unicodedata.normalize('NFKD',x).encode('ascii','ignore').decode().lower()
 return re.sub('[^a-z0-9]','',x)
alias={'tartaglia':'childe','hu tao':'hu tao','raiden shogun':'raiden','kaedehara kazuha':'kazuha','kamisato ayaka':'ayaka','kamisato ayato':'ayato','sangonomiya kokomi':'kokomi','arataki itto':'itto','yae miko':'yae','kuki shinobu':'shinobu','shikanoin heizou':'heizou','yumemizuki mizuki':'mizuki','kujou sara':'sara','yun jin':'yunjin'}
result={};missing=[]
for c in chars:
 name=c['name'];key=norm(f"{c['element']} Traveler" if name=='Traveler' and c['element'] in ('Anemo','Geo','Electro','Dendro','Hydro','Pyro','Cryo') else alias.get(name.lower(),name))
 matched=[(k,v) for k,v in index.items() if norm(k)==key]
 if len(matched)>1:
  combined={}
  for _,part in matched:combined.update(part)
  matched=[(name,combined)]
 if name=='Traveler' and c['element']=='Cryo':
  variants=[(k,v['infographic']) for k,v in index.items() if k.startswith('cryo traveler ') and v.get('infographic')]
  if variants:
   result[c['id']]={'characterId':c['id'],'name':name,'source':'KeqingMains','quick':None,'extended':None,'infographic':None,'infographics':[{'title':k.title(),**v} for k,v in variants],'indexedAt':datetime.now(ZoneInfo('Asia/Kolkata')).date().isoformat()}
   continue
 if len(matched)!=1 and key:
  matched=[(k,v) for k,v in index.items() if norm(k)==key.split('traveler')[0]+'traveler' or (norm(k) and norm(name).endswith(norm(k)) and len(norm(k))>=4)]
 if len(matched)==1:
  item=matched[0][1]; result[c['id']]={'characterId':c['id'],'name':name,'source':'KeqingMains','quick':item.get('quick'), 'extended':item.get('extended'),'infographic':item.get('infographic'),'indexedAt':datetime.now(ZoneInfo('Asia/Kolkata')).date().isoformat()}
 else:missing.append(name)
print('matched',len(result),'missing',len(missing),missing)
open('src/data/kqmDirectory.json','w').write(json.dumps(result,ensure_ascii=False,indent=2))
