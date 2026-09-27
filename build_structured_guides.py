"""Build concise, ID-checked, source-provenanced local guide profiles from KQM source transcriptions.
Does not assert a current-version audit, team roles, numerical talent levels or BiS unless source text says so.
Regenerate with python3 build_structured_guides.py. Hand-curated guides are maintained in src/data/guides.js.
"""
import json, re
from pathlib import Path
from datetime import date

ROOT=Path('src/data'); characters=json.loads((ROOT/'catalog.json').read_text())['characters']
weapons={x['id']:x for x in json.loads((ROOT/'catalog.json').read_text())['weapons']}
artifacts={x['id']:x for x in json.loads((ROOT/'catalog.json').read_text())['artifacts']}
notes=json.loads((ROOT/'kqmBuildNotes.json').read_text()); material=json.loads((ROOT/'characterMaterials.json').read_text())
meta=json.loads((ROOT/'entityMeta.json').read_text()); TODAY='2026-09-27'

def weapon_row(x,n,build):
    w=weapons[x['id']]; m=meta['weapons'].get(w['name'],{})
    text=x['context']; note=text.lower()
    # Ranking is only indicated when the quoted source says it. Do not infer signature=BiS.
    category='BiS' if re.search(r'\bbest.in.slot\b|\bbis\b',note) else 'RECOMMENDED' if re.search(r'\bbest option\b|\brecommended\b|\bstrong option\b',note) else 'SOURCE LISTED'
    return dict(id=w['id'],name=w['name'],category=category,recommendationCategory=category,isSignature=False,isBiS=category=='BiS',context=x['buildContext'] if x['buildContext']!='Source section' else 'See source conditions',note=text+('…' if x['sourceExcerptTruncated'] else ''),baseAtk90=m.get('baseAtk90'),secondary=w.get('secondary'),secondaryValue90=m.get('secondaryValue90'),passiveName=m.get('passiveName'),refinement='R1 baseline; R2–R5 in item details',buildId=build,version=n['version'],source=n['source'],sourceUrl=n['sourceUrl'],lastUpdated=n['lastUpdated'] or 'NOT LISTED',lastReviewed=TODAY)

def artifact_row(x,n,build):
    a=artifacts[x['id']];m=meta['artifacts'].get(a['name'],{});label=x['label'];piece=4 if re.search(r'\b4\s*(?:pc|p|[- ]piece)\b',label,re.I) else 2 if re.search(r'\b2\s*(?:pc|p|[- ]piece)\b',label,re.I) else None
    category='PRIMARY' if re.search(r'\bbest.in.slot\b|\bbis\b|\bbest set\b',x['context'],re.I) else 'SOURCE LISTED'
    return dict(id=a['id'],name=a['name'],category=category,pieceCount=piece,context=x['context']+('…' if x['sourceExcerptTruncated'] else '')+(' · '+x['buildContext'] if x['buildContext']!='Source section' else ''),bonusSourceUrl=m.get('bonusSourceUrl'),buildId=build,version=n['version'],source=n['source'],sourceUrl=n['sourceUrl'],lastUpdated=n['lastUpdated'] or 'NOT LISTED',lastReviewed=TODAY)

def build(n):
    cid=n['characterId']; c=next(x for x in characters if x['id']==cid); slug='kqm-'+cid; styles=n['playstyles']
    gaps=[title for title,ok in [('overview',bool(styles)),('weapons',bool(n['weapons'])),('artifacts',bool(n['artifacts'])),('main stats',all(n['mainStats'].get(s) for s in ['sands','goblet','circlet'])),('talent priority',bool(n['talents'])),('farming materials',cid in material)] if not ok]
    blocking=[gap for gap in gaps if gap!='farming materials']
    # A source table can contain several playstyles; keep every row's source context and avoid assigning
    # a stat table / item to a different build or labeling a source roster with invented combat roles.
    summary=styles[0]['overview'] if styles else f"{c['name']} has KQM-linked build information. Source playstyle overview was not verified in this transcription."
    variant=dict(id=slug,name=(styles[0]['role'] if len(styles)==1 else 'Source-listed build options'),context=n['statBuildContext'] or 'Consult source for build context',description=summary,weapons=[weapon_row(x,n,slug) for x in n['weapons']],artifacts=[artifact_row(x,n,slug) for x in n['artifacts']],mainStats={s:n['mainStats'].get(s) or 'DATA NOT VERIFIED' for s in ['sands','goblet','circlet']},substats=n['substats'] or 'DATA NOT VERIFIED · consult the linked source for this playstyle.',statNotes=[x for x in [n['erContext']] if x],talents=[dict(t,buildId=slug,source=n['source'],sourceUrl=n['sourceUrl'],version=n['version'],lastUpdated=n['lastUpdated'] or 'NOT LISTED',lastReviewed=TODAY) for t in n['talents']],teams=[])
    return dict(characterId=cid,source=n['source'],sourceUrl=n['sourceUrl'],version=n['version'],sourceVersion=n['version'],lastUpdated=n['lastUpdated'] or 'NOT LISTED',lastReviewed=None,reviewedAt=None,sourceIndexedAt=TODAY,guideStatus='source_structured' if not blocking else 'needs_review',status='REVIEW NEEDED',freshnessStatus='REVIEW NEEDED',reviewMethod='Source transcription with catalog-ID and section validation; not a current-version or team-role audit.',validationGaps=gaps,summary=summary,playstyles=styles,sourceRosters=n['sourceRosters'],teamDataStatus='Source-example rosters available; combat roles not validated' if n['sourceRosters'] else 'DATA NOT VERIFIED · no exact four-member source roster transcribed',farmingSource='Paimon.moe character materials' if cid in material else 'DATA NOT VERIFIED',variants=[variant])

out={cid:build(n) for cid,n in notes.items()}
assert len(out)==130
(ROOT/'structuredGuides.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
print('Generated',len(out),'KQM-sourced profiles;',sum(g['guideStatus']=='source_structured' for g in out.values()),'with validated minimum sections;',sum(g['guideStatus']=='needs_review' for g in out.values()),'requiring field/source follow-up')
