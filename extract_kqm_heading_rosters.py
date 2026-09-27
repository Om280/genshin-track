"""Add only exact ID-matched four-character KQM heading captions; never infer roles.
Requires requests + beautifulsoup4. Limits itself to KQM entries with no existing roster.
"""
import json,re,requests,bs4
from pathlib import Path
p=Path('src/data/kqmBuildNotes.json');data=json.loads(p.read_text());chars=json.loads(Path('src/data/catalog.json').read_text())['characters']
def norm(s):return re.sub('[^a-z0-9]','',s.lower())
lookup={norm(x['name']):x for x in chars if x['name'] not in ['Traveler','Manekin','Manekina']}
aliases={'kazuha':'kaedeharakazuha','kokomi':'sangonomiyakokomi','ayaka':'kamisatoayaka','itto':'aratakiitto','yae':'yaemiko','raiden':'raidenshogun','sara':'kujousara','childe':'tartaglia','shinobu':'kukishinobu'}
new=0
for url in sorted({v['sourceUrl'] for v in data.values() if not v['sourceRosters']}):
 try:
  r=requests.get(url,timeout=15,headers={'User-Agent':'GenshinTrack/1.0 (source attribution; respectful limits)'});r.raise_for_status();body=bs4.BeautifulSoup(r.text,'html.parser').select_one('.entry-content')
  if not body:continue
  result=[];seen=set()
  for h in body.find_all(['h3','h4','h5']):
   title=' '.join(h.get_text(' ',strip=True).split());parts=[t.strip() for t in title.split('—')]
   if len(parts)!=4 or len(title)>125 or any('/' in t for t in parts):continue
   parts[0]=re.sub('^[A-Za-z -]{1,35}:\\s*','',parts[0]);resolved=[]
   for name in parts:
    key=norm(name);resolved.append(lookup.get(aliases.get(key,key)))
   if any(x is None for x in resolved):continue
   ids=[x['id'] for x in resolved]
   if len(set(ids))!=4 or tuple(ids) in seen or any(len(set(ids)&set(y['memberIds']))>=3 for y in result):continue
   seen.add(tuple(ids));context=h.find_previous(['h1','h2']);context=context.get_text(' ',strip=True)[:80] if context else 'KQM example'
   result.append({'id':'-'.join(ids),'memberIds':ids,'members':[x['name'] for x in resolved],'context':context,'sourceUrl':url,'mainDpsId':None,'rolesVerified':False,'kind':'KQM exact heading caption (roles not reviewed)'})
   if len(result)>=4:break
  for n in data.values():
   if n['sourceUrl']==url and not n['sourceRosters']:
    n['sourceRosters']=result;new+=len(result)
 except Exception as e:print('Could not retrieve',url,str(e)[:100])
for n in data.values():
 unique=[]
 for r in n['sourceRosters']:
  if not any(len(set(r['memberIds'])&set(y['memberIds']))>=3 for y in unique):unique.append(r)
 n['sourceRosters']=unique
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n');print('Added',new,'KQM heading rosters (including same guide for traveler gender variants); roles intentionally unverified')
