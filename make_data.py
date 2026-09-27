import requests,json,re,os
b='https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/gi/'
a=requests.get(b+'avatars.json').json(); w=requests.get(b+'weapons.json').json();r=requests.get(b+'relics.json').json(); l=requests.get(b+'locs.json').json()['en']
elem={'Ice':'Cryo','Water':'Hydro','Fire':'Pyro','Electric':'Electro','Wind':'Anemo','Rock':'Geo','Grass':'Dendro'}
wp={'WEAPON_SWORD_ONE_HAND':'Sword','WEAPON_CLAYMORE':'Claymore','WEAPON_BOW':'Bow','WEAPON_POLE':'Polearm','WEAPON_CATALYST':'Catalyst'}
prop={'22':'CRIT DMG','20':'CRIT Rate','23':'Energy Recharge','28':'Elemental Mastery','6':'ATK%','7':'DEF%','3':'HP%','4':'ATK','1':'HP','9':'Physical DMG','40':'Pyro DMG','41':'Electro DMG','42':'Hydro DMG','43':'Dendro DMG','44':'Anemo DMG','45':'Geo DMG','46':'Cryo DMG'}
chars=[]
for id,v in a.items():
 name=l.get(str(v.get('NameTextMapHash')),'')
 if not name or name=='TBD' or not v.get('SideIconName'): continue
 icon=v['SideIconName'].replace('UI_AvatarIcon_Side_','UI_AvatarIcon_')
 pp=v.get('PromoteProps',[])
 asc=[]
 if pp:
  for k,val in pp[-1].items():
   if k not in ('1','4','7') and val:asc.append({'name':prop.get(k,k),'value':round(val*100,1) if k in ('22','20','23','6','7','3','40','41','42','43','44','45','46') else round(val,1)})
 chars.append({'id':id,'name':name,'element':elem.get(v.get('Element'),v.get('Element','Unknown')),'weaponType':wp.get(v.get('WeaponType'),''),'rarity':5 if v.get('QualityType')=='QUALITY_ORANGE' else 4,'icon':icon,'sideIcon':v['SideIconName'],'skills':[v['Skills'].get(str(i)) for i in v.get('SkillOrder',[])], 'constellations':v.get('Consts',[]),'ascension':asc,'ascensionStat':asc[0]['name'] if asc else None,'ascensionStatValue':asc[0]['value'] if asc else None})
chars.sort(key=lambda x:x['name']);weaps=[]
for id,v in w.items():
 name=l.get(str(v.get('NameTextMapHash')),'')
 if not name or name=='TBD' or not v.get('Icon'):continue
 pr=list(v.get('BaseProps',{}).items());secondary=pr[1] if len(pr)>1 else None
 weaps.append({'id':id,'name':name,'rarity':v['Rarity'],'type':{1:'Sword',2:'Claymore',3:'Bow',4:'Polearm',5:'Catalyst'}.get(v['WeaponType'],'Weapon'),'icon':v['Icon'],'baseAtk1':round(pr[0][1],1) if pr else None,'secondary':prop.get(secondary[0],'Stat') if secondary else None,'secondaryValue1':round(secondary[1]*100,1) if secondary and secondary[0] in ('22','20','23','6','7','3') else round(secondary[1],1) if secondary else None})
weaps.sort(key=lambda x:x['name']);sets=[]
for id,v in r['Sets'].items():
 name=l.get(str(v.get('Name')),'')
 if not name or name=='TBD':continue
 pieces={}
 for itemid,item in r['Items'].items():
  if str(item.get('SetId'))==id:
   typ=item['EquipType'];pieces[str(typ)]=item['Icon']
 if not pieces:continue
 sets.append({'id':id,'name':name,'icon':pieces.get('0') or pieces.get('4') or next(iter(pieces.values())),'pieces':pieces,'bonus2': None})
sets.sort(key=lambda x:x['name']);out={'characters':chars,'weapons':weaps,'artifacts':sets,'source':'Enka.Network game data, retrieved 2026-09-26','sourceUrl':'https://github.com/EnkaNetwork/API-docs/tree/master/store/gi'}
open('src/data/catalog.json','w').write(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print(len(chars),len(weaps),len(sets));print([x for x in chars if x['name'] in ['Albedo','Furina','Arlecchino']]);print([x for x in sets if x['name'] in ['Golden Troupe','Husk of Opulent Dreams']]);
