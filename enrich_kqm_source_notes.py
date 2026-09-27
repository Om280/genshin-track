"""Small, manually source-checked corrections for KQM excerpts missed by the table scraper.
Read the exact linked KQM section before changing these. No simulated teams or generic priorities.
"""
import json
from pathlib import Path
p=Path('src/data/kqmBuildNotes.json');notes=json.loads(p.read_text());cat=json.loads(Path('src/data/catalog.json').read_text());wp={x['name']:x for x in cat['weapons']};sets={x['name']:x for x in cat['artifacts']}
def ids_for(name):return [k for k,v in notes.items() if v['character']==name]
def priority(ids,text,order,explanation,levels=None):
 for cid in ids:
  n=notes[cid];n['talentPriorityText']=text;n['talents']=[{'talentId':tid,'priority':'PRIMARY' if i==0 else 'SECONDARY' if i==1 else 'LOW','recommendedLevel':(levels or {}).get(tid),'levelSpecified':tid in (levels or {}),'levelSource':n['sourceUrl'] if tid in (levels or {}) else None,'sourceUrl':n['sourceUrl'],'version':n['version'],'reason':explanation+' · KQM: '+text} for i,tid in enumerate(order)]
def text_row(cid,kind,name,context,label=None,buildContext='Source section'):
 n=notes[cid];obj=(wp if kind=='weapons' else sets)[name]
 if any(row['id']==obj['id'] for row in n[kind]):return
 n[kind].append({'id':obj['id'],'name':name,'label':label or name,'context':context,'sourceExcerptTruncated':False,'buildContext':buildContext})

def set_overview(name,text):
 for cid in ids_for(name):
  n=notes[cid];n['playstyles']=[{'role':'KQM source playstyle','overview':text}]

set_overview('Baizhu','Baizhu provides team healing, brief interruption protection, and off-field Dendro application (KQM Character Overview).')
set_overview('Chongyun','Chongyun supplies Cryo infusion for compatible teammates and can contribute quickswap Burst damage. The linked KQM guide discusses Melt and Freeze applications; its older ranking is not certified for version 7.1.')
set_overview('Mika','Cryo healer with Physical DMG and attack-speed support (KQM Character Overview).')
set_overview('Nilou','Bloom-focused Hydro support for teams comprised only of Hydro and Dendro characters (KQM introduction).')
set_overview('Tartaglia','On-field Hydro enabler who deals melee Stance damage and drives off-field teammates; KQM discusses separate Bow, Melee and Burst talent contexts.')
set_overview('Yaoyao','Dendro healer and off-field Dendro applicator. KQM discusses using her healing and Dendro application across reaction-based teams.')
set_overview('Xinyan','Xinyan can play Physical damage, Pyro damage, or shield support. The linked KQM guide separates her artifact and Talent priorities by build; Physical damage is detailed here.')
set_overview('Xinyan','Xinyan can play Physical damage, Pyro damage, or shield support. The linked KQM guide separates her artifact and Talent priorities by build; Physical damage is detailed here.')
for cid in ids_for('Traveler'):
 n=notes[cid];u=n['sourceUrl']
 if 'hydro-traveler' in u:n['playstyles']=[{'role':'Hydro damage / application','overview':'Hydro Traveler uses Skill bubbles to apply Hydro; the linked KQM guide distinguishes their on-field, off-field and reaction contexts.'}]
 elif 'dendro-traveler' in u:n['playstyles']=[{'role':'Off-field Dendro enabler','overview':'Dendro Traveler deploys their Burst for off-field Dendro application and team utility, then may swap in to use Skill for particles (KQM Playstyle).'}]
 elif 'anemo-traveler' in u:n['playstyles']=[{'role':'Swirl / resistance shred support','overview':'Anemo Traveler can provide resistance reduction with Viridescent Venerer and C6; their Burst uptime and Swirl build depend on team context (KQM Artifacts).'}]
 elif 'geo-traveler' in u:n['playstyles']=[{'role':'Geo quickswap / battery','overview':'Geo Traveler can play as a quickswap damage dealer or Geo battery; the source separates personal damage from team support (KQM Artifacts).'}]
 elif 'electro-traveler' in u:n['playstyles']=[{'role':'Electro battery support','overview':'Electro Traveler supports teammates by supplying Flat Energy from Skill Amulets and Burst effects; the KQM guide notes low personal damage multipliers in this role.'}]

priority(ids_for('Barbara'),'Pure healer: Skill = Burst; Vaporize DPS: Normal Attack > Skill > Burst',['skill','burst'],'KQM Talent Priority. The healer build is shown; DPS priorities vary.')
priority(ids_for('Kamisato Ayaka'),'Burst > Normal Attack > Skill',['burst','normal','skill'],'KQM Level Talent Priority.')
priority(ids_for('Lauma'),'Skill = Burst > Character Level',['skill','burst'],'KQM Level and Talent Priority; no numeric level supplied.')
priority(ids_for('Lisa'),'Burst ≥ Skill > Normal Attack',['burst','skill','normal'],'KQM Level & Talent Priority for Aggravate.')
priority(ids_for('Nilou'),'Burst = Skill; Normal Attack not recommended',['burst','skill','normal'],'KQM Talent Priority: levels do not increase her Bloom buff; no source numeric target set.')
priority(ids_for('Tartaglia'),'Melee focus: Skill > Burst > Normal Attack',['skill','burst','normal'],'KQM Talent Priority has different Bow, Melee and Burst variants; the Melee focus is shown.')
priority(ids_for('Thoma'),'Skill = Burst',['skill','burst'],'KQM Level and Talent Priority: 90 first for Burgeon.')
priority(ids_for('Venti'),'Off-field support (CRIT): Burst > Skill',['burst','skill'],'KQM Level and Talent Priority; on-field priorities differ.')
priority(ids_for('Zhongli'),'Shield support: Skill',['skill'],'KQM Level and Talent Priority: only Skill requires levels for this shield playstyle.')
priority(ids_for('Xinyan'),'Physical DPS: Normal Attack ≥ Burst ≥ Skill',['normal','burst','skill'],'KQM Talent Priority for Physical DPS; Pyro and support priorities differ.')
for cid in ids_for('Traveler'):
 n=notes[cid]
 if 'electro-traveler' in n['sourceUrl']:
  priority([cid],'Skill > Burst > Normal Attack',['skill','burst','normal'],'KQM Talent Priority explicitly says Skill and Burst to level 7 and Normal Attack at 1.',{'skill':7,'burst':7,'normal':1})

for cid in ids_for('Aino'):
 notes[cid]['mainStats']={'sands':'ER / EM','goblet':'EM / Hydro DMG%','circlet':'EM / CRIT'};notes[cid]['statBuildContext']='KQM Artifact Stats · off-field enabler'
for cid in ids_for('Tartaglia'):
 notes[cid]['mainStats']={'sands':'ATK%','goblet':'Hydro DMG Bonus','circlet':'CRIT Rate / CRIT DMG'};notes[cid]['statBuildContext']='KQM Artifacts Stats · general damage';notes[cid]['substats']='CRIT Rate / CRIT DMG > ATK% > EM > ER; ER until Ranged Burst every rotation (source: KQM Artifacts Stats).'
for cid in ids_for('Traveler'):
 n=notes[cid];u=n['sourceUrl']
 if 'dendro-traveler' in u:
  n['mainStats']={'sands':'ER > EM ≥ ATK (Quicken)','goblet':'Dendro DMG Bonus (Quicken)','circlet':'CRIT (Quicken)'};n['statBuildContext']='KQM Artifact Stats · Quicken row; Bloom stats differ'
 if 'anemo-traveler' in u:
  n['mainStats']={'sands':'Elemental Mastery','goblet':'Elemental Mastery','circlet':'Elemental Mastery'};n['statBuildContext']='KQM Main Stat Priority · Swirl build';n['substats']='Meet ER requirement first, then EM; source notes ~160–180% ER varies by team.'
  text_row(cid,'weapons','Favonius Sword','Energy Recharge / particles if Burst uptime is a problem (KQM Weapons).')
  text_row(cid,'weapons','Sacrificial Sword','An ER Sword discussed in the KQM Weapons comparison.')
  text_row(cid,'artifacts','Viridescent Venerer','Resistance shredding support (KQM Artifacts).','4pc Viridescent Venerer')
 if 'geo-traveler' in u:
  n['mainStats']={'sands':'ATK% / Energy Recharge','goblet':'Geo DMG Bonus','circlet':'CRIT Rate / CRIT DMG'};n['statBuildContext']='KQM Main Stat Priority · DPS versus battery';n['substats']='DPS: CRIT ≥ ATK% > ER; support: ER > CRIT Rate if using Favonius Sword (KQM Substat Priority).'
  text_row(cid,'weapons','Amenoma Kageuchi','Source names this the reference F2P damage sword; see team context.')
  text_row(cid,'weapons','Favonius Sword','Battery/support weapon for particle generation (KQM Artifacts).')
  text_row(cid,'artifacts','Noblesse Oblige','4pc support option for teamwide buffing, not the personal-damage choice (KQM Artifacts).','4pc Noblesse Oblige')
  text_row(cid,'artifacts','Archaic Petra','2pc Geo DMG option paired with 2pc ATK for damage (KQM Artifacts).','2pc Archaic Petra + 2pc ATK')
 if 'electro-traveler' in u:
  n['mainStats']={'sands':'Energy Recharge','goblet':'Electro DMG Bonus / Elemental Mastery','circlet':'CRIT Rate (Favonius) / CRIT DMG'};n['statBuildContext']='KQM Main Stat Priority · battery';n['substats']='ER >>> CRIT Rate ≥ CRIT DMG > EM > ATK% (KQM Substat Priority).'
  text_row(cid,'weapons','Favonius Sword','Source Best-in-Slot as a battery; R3+ and 50%+ CRIT Rate recommended (KQM Weapons).')
  text_row(cid,'artifacts','Emblem of Severed Fate','4pc personal Burst damage option; source cautions Amulet ER buff does not affect set passive (KQM Artifacts).','4pc Emblem of Severed Fate')
  text_row(cid,'artifacts','Noblesse Oblige','4pc support option if not already used; Burst Energy can make its uptime difficult (KQM Artifacts).','4pc Noblesse Oblige')
for cid in ids_for('Kujou Sara'):
 text_row(cid,'artifacts','Emblem of Severed Fate','BiS for personal damage (KQM Artifact Sets).','4pc Emblem of Severed Fate')
 text_row(cid,'artifacts','Noblesse Oblige','Buffing option if no teammate already carries it (KQM Artifact Sets).','4pc Noblesse Oblige')
for cid in ids_for('Xinyan'):
 n=notes[cid];n['mainStats']={'sands':'ATK% (ER if needed)','goblet':'Physical DMG Bonus','circlet':'CRIT Rate / CRIT DMG'};n['statBuildContext']='KQM Main Stats · Physical Xinyan';n['substats']='Meet rotation ER first, then CRIT and ATK for Physical DPS (KQM Sub Stats).'
 text_row(cid,'artifacts','Pale Flame','Physical Xinyan option in the source comparison; dynamic stacks matter (KQM Artifact Sets).','4pc Pale Flame','Physical Xinyan')
for n in notes.values():
 if n['lastExtracted']!='2026-09-27' and (n['character'] in ('Aino','Baizhu','Chongyun','Barbara','Kamisato Ayaka','Kujou Sara','Lauma','Lisa','Mika','Nilou','Tartaglia','Thoma','Traveler','Venti','Xinyan','Yaoyao','Zhongli')):n['lastExtracted']='2026-09-27'
p.write_text(json.dumps(notes,ensure_ascii=False,separators=(',',':'))+'\n')
print('Enriched',len(notes),'source transcriptions; rerun build_structured_guides.py')
