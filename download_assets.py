import json,requests,os,concurrent.futures
c=json.load(open('src/data/catalog.json'));root='public/assets/icons';os.makedirs(root,exist_ok=True)
jobs=[]
for typ,key in [('character','characters'),('weapon','weapons'),('artifact','artifacts')]:
 for x in c[key]:
  if typ=='weapon' and x['rarity']<3:continue
  jobs.append((typ,x['id'],x['icon']))
for x in c['characters']:
 if x['name'] in ['Albedo','Furina']:
  for i,url in enumerate(x['skills']+x['constellations']):jobs.append(('skill',x['id']+'-'+str(i),url))
def fetch(job):
 typ,id,url=job;file=f'{root}/{typ}-{id}.png'
 if os.path.exists(file):return
 try:
  r=requests.get('https://enka.network'+url,timeout=12)
  if r.ok and r.headers.get('content-type','').startswith('image/') and len(r.content)<500000:open(file,'wb').write(r.content)
 except:pass
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:list(ex.map(fetch,jobs))
for name in ['Pyro','Hydro','Electro','Anemo','Geo','Cryo','Dendro']:
 try:
  r=requests.get('https://cdn.genshintrack.com/icons/elements/'+name+'.svg',timeout=10)
  if r.ok:open(f'public/assets/{name.lower()}.svg','wb').write(r.content)
 except:pass
print('assets saved:',len(os.listdir(root)))
