"""Conservative repair of source-transcribed talent priority ordering.

Never infer a talent priority from role/class/element or assign a numeric target.
When a source line mixes playstyles, withhold a PRIMARY label until the source
can be reviewed variant by variant. Preserve exact source text for review.
"""
import json,re
from pathlib import Path
p=Path('src/data/structuredGuides.json');guides=json.loads(p.read_text());c=json.loads(Path('src/data/catalog.json').read_text())['characters'];names={x['id']:x['name'] for x in c}
TOKEN=re.compile(r'Normal Attack|Elemental Skill|Elemental Burst|\bSkill\b|\bBurst\b|\bNA\b',re.I)
MAP={'normal attack':'normal','na':'normal','elemental skill':'skill','skill':'skill','elemental burst':'burst','burst':'burst'}
# These are textual source structures with different role / constellation rules,
# not evidence for a single generic primary. Manual source-specific variants are
# required before declaring a primary for this single generic build profile.
CONTEXT=re.compile(r'\b(?:C0|C2|C4\+|C6|Off-Field:|On-Field:|Healer:|DPS:|Support:|Shield Support:|On-Field Driver:|Non-C6:|Quickswap Support:|Physical DPS:|Skill DPS:|Plunging DPS:|Melee focus:|Bow focus:)\b',re.I)
# Some patterns have punctuation after them; use direct bounded tests.
MULTI=['C0 Melt Charged Shot:','C6 Driver:','Off-Field:','On-Field:','Off-Field DPS:','On-Field DPS:','Pure healer:','Vaporize DPS:','Shield Support:','On-Field Driver:','Skill DPS:','Plunging DPS:','Quickswap Support:','Physical DPS:','(Freeze)','(Melt)','Non-C6:','C0–C1:','C2–C6:','Support: Burst','C4+ Bunny Bomber:']
report=[];fixed=[]
for id,g in guides.items():
 for v in g.get('variants',[]):
  rows=v.get('talents') or [];reason=rows[0].get('reason','') if rows else ''
  if not reason:continue
  raw=reason.split('Source priority:',1)[-1] if 'Source priority:' in reason else reason.split('KQM:',1)[-1] if 'KQM:' in reason else None
  if not raw:continue
  if id=='10000097':raw=re.sub(r'^\s*Normal Attack DPS\s+','',raw,flags=re.I)
  ambiguous=(any(x.lower() in raw.lower() for x in MULTI) and id not in ('10000030','10000044')) or id=='10000003'
  if ambiguous:
   for row in rows:
    if not row.get('levelSpecified'):row['priority']='CONTEXTUAL';row['priorityRank']=None;row['prioritySourceStatus']='MULTIPLE SOURCE CONTEXTS · no single order certified';row['lastReviewed']=None
   report.append({'id':id,'name':names.get(id),'buildId':v['id'],'sourcePriority':raw.strip(),'status':'CONTEXTUAL · needs separate source/build review'});continue
  found=[]
  for match in TOKEN.finditer(raw):
   talent=MAP[match.group().lower()]
   if talent not in found:found.append(talent)
  if not found:continue
  previous=[(row['talentId'],row['priority']) for row in rows]
  source=rows[0].get('sourceUrl') or g.get('sourceUrl')
  existing={row['talentId']:row for row in rows}
  # Ordered source matches only; equal-sign/≥ at the top implies a tied primary.
  first_end=TOKEN.search(raw).end();second=TOKEN.search(raw,first_end)
  tie=bool(second and re.fullmatch(r'\s*(?:=|≈)\s*',raw[first_end:second.start()]))
  output=[]
  LOW_FROM_PRIOR_SOURCE={('10000070','normal'),('10000033','normal'),('10000006','normal'),('10000002','skill')}
  for rank,talent in enumerate(found):
   row=existing.get(talent)
   if row is None:
    row={'talentId':talent,'recommendedLevel':None,'levelSpecified':False,'levelSource':None,'sourceUrl':source,'version':g.get('sourceVersion',g.get('version')),'buildId':v['id'],'source':g.get('source'),'lastUpdated':g.get('lastUpdated'),'reason':reason}
   if not row.get('levelSpecified'):
    row['priority']='LOW' if row.get('priority')=='LOW' or (id,talent) in LOW_FROM_PRIOR_SOURCE else 'PRIMARY' if rank==0 or rank==1 and tie else 'SECONDARY'
   row['priorityRank']=rank+1
   row['prioritySourceStatus']='SOURCE-EXPLICIT ORDER · not editorially reviewed'
   row['lastReviewed']=None
   output.append(row)
  v['talents']=output
  if previous!=[(r['talentId'],r['priority']) for r in output]:fixed.append((names.get(id),id,previous,[(r['talentId'],r['priority']) for r in output],raw.strip()))
print('Corrected source-ordered builds:',len(fixed),'context-dependent withheld:',len(report))
for x in fixed:print(x[0],x[2],'=>',x[3],x[4][:125])
p.write_text(json.dumps(guides,indent=2,ensure_ascii=False)+'\n')
Path('src/data/talentPriorityAudit.json').write_text(json.dumps({'method':'Source-expression order only, not role-based; ambiguous multi-context sources deliberately marked CONTEXTUAL; numeric targets unchanged; no per-character current-patch review claimed.','contextDependent':report,'reorderedCount':len(fixed)},indent=2,ensure_ascii=False)+'\n')
