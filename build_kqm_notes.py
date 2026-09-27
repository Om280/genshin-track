"""Conservative snapshot of factual structured KQM Quick Guide tables.
NOT an editorial review. Record only exact catalog matches and visible source text.
Never infer targets, team roles, ranking or builds from elemental stats.
"""
import json,re,requests,bs4,concurrent.futures,datetime,time
from pathlib import Path
from zoneinfo import ZoneInfo
chars=json.loads(Path('src/data/catalog.json').read_text())['characters'];cats=json.loads(Path('src/data/catalog.json').read_text())
sources=json.loads(Path('src/data/kqmDirectory.json').read_text());ids={str(x['id']):x for x in chars}
weaps={x['id']:x for x in cats['weapons']};arts={x['id']:x for x in cats['artifacts']}
def tidy(s):return ' '.join(str(s).split())
def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
def heading_nodes(head):
 nodes=[];level=int(head.name[1])
 for n in head.next_siblings:
  if getattr(n,'name',None) and re.fullmatch(r'h[1-6]',n.name) and int(n.name[1])<=level:break
  if getattr(n,'name',None):nodes.append(n)
 return nodes
def source_section(body,name):
 h=next((h for h in body.find_all(re.compile('^h[1-6]$')) if tidy(h.get_text(' ',strip=True)).lower()==name.lower()),None)
 return heading_nodes(h) if h else []
def source_context(head,suffix):
 title=tidy(head.get_text(' ',strip=True))
 label=(title[len(suffix):] if title.lower().startswith(suffix.lower()) else title[:-len(suffix)]).strip(' —-')
 if label:return label
 parent=head.find_previous('h1')
 parentTitle=tidy(parent.get_text(' ',strip=True)) if parent else ''
 return parentTitle if parentTitle and parentTitle.lower() not in ('artifacts','weapons','character builds','overview','builds','teams','talents') else 'Source section'
def table_data(nodes,registry,kind):
 records=[];seen=set()
 for n in nodes:
  for row in n.select('table tr'):
   cells=row.find_all(['th','td'],recursive=False)
   if len(cells)<2:continue
   text=tidy(cells[0].get_text(' ',strip=True));note=next((v for cell in cells[1:] for v in [tidy(cell.get_text(' ',strip=True))] if len(v)>=20 and re.search(r'[A-Za-z]{4}',v)),None)
   if not text or not note:continue
   if kind=='artifact' and ('2pc' in text.lower() or '+' in text):continue
   asset=cells[0].select_one(f'img[data-gi-type="{kind}"][data-gi-id]')
   item=registry.get(asset['data-gi-id']) if asset else None
   if not item:
    cleaned=re.sub(r'^(?:[345]★|4pc|4p|4-piece|four-piece)\s*','',text,flags=re.I).strip()
    cleaned=re.sub(r'\s*\([^)]{1,14}\)$','',cleaned).strip()
    item=next((x for x in registry.values() if norm(x['name'])==norm(cleaned)),None)
   if not item or item['id'] in seen:continue
   seen.add(item['id'])
   records.append({'id':item['id'],'name':item['name'],'label':text[:115],'context':note[:210], 'sourceExcerptTruncated':len(note)>210})
 return records[:10]
nameIndex={norm(x['name']):x for x in chars if x['name']!='Traveler'}
teamAliases={'kazuha':'Kaedehara Kazuha','shinobu':'Kuki Shinobu','itto':'Arataki Itto','kokomi':'Sangonomiya Kokomi','ayaka':'Kamisato Ayaka','ayato':'Kamisato Ayato','heizou':'Shikanoin Heizou','raiden':'Raiden Shogun','sara':'Kujou Sara','childe':'Tartaglia','yae':'Yae Miko'}
def sample_rosters(body,source):
 out=[]
 for cap in body.select('figcaption'):
  text=tidy(cap.get_text(' ',strip=True));parts=[tidy(p) for p in text.split('—')]
  if len(parts)!=4 or any('/' in p or len(p)>45 for p in parts):continue
  found=[nameIndex.get(norm(teamAliases.get(norm(p),p))) for p in parts]
  if any(x is None for x in found) or len({x['id'] for x in found})!=4:continue
  h=cap.find_previous(['h2','h3','h4'])
  context=tidy(h.get_text(' ',strip=True)) if h else 'KQM example'
  if context.lower() in ('example teams','sample teams'):
   h=h.find_previous('h2')
   context=tidy(h.get_text(' ',strip=True)) if h else 'KQM example'
   if context.lower() in ('teambuilding','teams','example teams','notable teammates'):context='KQM example'
  if len(context)>90:context='KQM example'
  memberIds=[x['id'] for x in found]
  if any(len(set(x['memberIds'])&set(memberIds))>=3 for x in out):continue
  out.append({'id':'-'.join(memberIds),'memberIds':memberIds,'members':[x['name'] for x in found],'context':context,'sourceUrl':source,'mainDpsId':None,'rolesVerified':False,'kind':'KQM source roster (not role-reviewed)'})
  if len(out)>=5:break
 return out

def extract(cid,d):
 entry=d.get('quick') or d.get('extended')
 if not entry:return cid,None
 try:
  r=requests.get(entry['url'],timeout=20,headers={'User-Agent':'GenshinTrack/1.0 (fan guide archive; polite source snapshot)'});r.raise_for_status()
  soup=bs4.BeautifulSoup(r.text,'html.parser');body=soup.select_one('.entry-content')
  if not body:return cid,None
  title=soup.title.get_text(' ',strip=True) if soup.title else ''
  if '404' in title or 'not found' in title.lower():return cid,None
  statHead=next((h for h in body.find_all(['h1','h2','h3']) if tidy(h.get_text(' ',strip=True)).lower().endswith('artifact stats')),None)
  stats=heading_nodes(statHead) if statHead else []
  statBuildContext=source_context(statHead,'Artifact Stats') if statHead else 'Not listed'
  statTable=next((n.select_one('table') for n in stats if n.select_one('table')),None)
  mainStats={}
  if statTable:
   rows=statTable.select('tr')
   if len(rows)>=2:
    head=[tidy(x.get_text(' ',strip=True)).lower() for x in rows[0].find_all(['td','th'],recursive=False)]
    values=[tidy(x.get_text(' ',strip=True))[:110] for x in rows[1].find_all(['td','th'],recursive=False)]
    for h,v in zip(head,values):
     if h.startswith(('sands','goblet','circlet')):mainStats[h.split()[0]]=v
  statText=next((tidy(x.get_text(' ',strip=True)) for x in stats if x.name=='p' and 'Stat Priority:' in x.get_text()),'')[:260]
  talents=source_section(body,'Talent Priority') or source_section(body,'Level and Talent Priority')
  priority=next((text for x in talents if x.name=='p' for text in [tidy(x.get_text(' ',strip=True))] if len(text)<=125 and re.search(r'[>≥=]',text) and re.search(r'\b(Skill|Burst|Normal Attack)\b',text,re.I) and not text.lower().startswith(('in teams','however','leveling him'))),'')[:125]
  talentLevels=[]
  for token in re.split(r'[>≥]',priority):
   label=tidy(token).lower().strip(' .:')
   if label in ('skill','elemental skill'):tid='skill'
   elif label in ('burst','elemental burst'):tid='burst'
   elif label in ('normal attack','normal attacks','normal'):tid='normal'
   else:continue
   if tid not in [t['talentId'] for t in talentLevels]:talentLevels.append({'talentId':tid,'priority':('PRIMARY' if not talentLevels else 'SECONDARY'),'recommendedLevel':None,'levelSpecified':False,'levelSource':None,'sourceUrl':entry['url'],'version':entry['version'],'reason':'Source priority: '+priority[:175]})
  play=source_section(body,'Playstyles');playstyles=[]
  for i,n in enumerate(play):
   if n.name in ('h3','h4','h5'):
    role=tidy(n.get_text(' ',strip=True));desc=next((tidy(x.get_text(' ',strip=True)) for x in play[i+1:i+4] if x.name=='p'),'')
    if role and desc:playstyles.append({'role':role[:90],'overview':desc[:245]})
  if not playstyles:
   first=next((tidy(n.get_text(' ',strip=True)) for n in play if n.name=='p'),'')
   if first:playstyles=[{'role':'Source-described playstyle','overview':first[:245]}]
  er=source_section(body,'ER Requirements');erContext=next((tidy(n.get_text(' ',strip=True)) for n in er if n.name=='p' and len(tidy(n.get_text(' ',strip=True)))>20),'')[:260]
  weaponHeads=[h for h in body.find_all(['h1','h2','h3']) if tidy(h.get_text(' ',strip=True)).lower().endswith('weapons')]
  weapons=[];seenWeapons=set()
  for h in weaponHeads:
   context=source_context(h,'Weapons')
   for rec in table_data(heading_nodes(h),weaps,'weapon'):
    if rec['id'] in seenWeapons:continue
    seenWeapons.add(rec['id']);rec['buildContext']=context;weapons.append(rec)
  weapons=weapons[:12]
  artifactHeads=[h for h in body.find_all(['h1','h2','h3']) if tidy(h.get_text(' ',strip=True)).lower().endswith('artifact sets') or tidy(h.get_text(' ',strip=True)).lower().startswith('artifact sets —')]
  artifacts=[];seenArtifacts=set()
  for h in artifactHeads:
   context=source_context(h,'Artifact Sets')
   for rec in table_data(heading_nodes(h),arts,'artifact'):
    if rec['id'] in seenArtifacts:continue
    seenArtifacts.add(rec['id']);rec['buildContext']=context;artifacts.append(rec)
  artifacts=artifacts[:12]
  info={'characterId':cid,'character':ids[cid]['name'],'source':'KeqingMains','sourceUrl':entry['url'],'version':entry['version'],'lastUpdated':(soup.select_one('meta[property="article:modified_time"]') or {}).get('content','')[:10] or None,'lastReviewed':None,'lastExtracted':datetime.datetime.now(ZoneInfo('Asia/Kolkata')).date().isoformat(),'status':'REVIEW NEEDED','extraction':'Source table transcription; NOT editorially reviewed','playstyles':playstyles[:5],'weapons':weapons,'artifacts':artifacts,'mainStats':mainStats,'statBuildContext':statBuildContext,'substats':statText,'talentPriorityText':priority,'talents':talentLevels,'erContext':erContext,'teams':[],'sourceRosters':sample_rosters(body,entry['url'])}
  return cid,info
 except Exception as e:
  return cid,{'error':str(e)[:90]}
job=[(cid,d) for cid,d in sources.items() if d.get('quick') or d.get('extended')]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: data=dict(pool.map(lambda j:extract(*j),job))
ok={cid:v for cid,v in data.items() if v and 'error' not in v};errors=[(cid,v) for cid,v in data.items() if not v or 'error' in v]
Path('src/data/kqmBuildNotes.json').write_text(json.dumps(ok,ensure_ascii=False,separators=(',',':')))
Path('src/data/kqmNoteIds.json').write_text(json.dumps(sorted(ok)))
print('extracted',len(ok),'errors',len(errors),errors[:10]);print('weapons',sum(bool(x['weapons']) for x in ok.values()),'artifacts',sum(bool(x['artifacts']) for x in ok.values()),'stats',sum(bool(x['mainStats']) for x in ok.values()),'talents',sum(bool(x['talentPriorityText']) for x in ok.values()))
print('Clorinde',json.dumps(ok.get('10000098'),indent=2)[:1700]);print('Navia',json.dumps(next((v for v in ok.values() if v['character']=='Navia'),None),indent=2)[:900])
