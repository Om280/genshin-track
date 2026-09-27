"""Snapshot only matched item/domain/day records from Gamevika's published farming schedule.
Unmatched items remain unassigned; do not infer family or weekday from names.
Run from repository root; inspect changes before committing a new source snapshot.
"""
import json
import re
from collections import defaultdict
from datetime import date
from pathlib import Path
import requests
from bs4 import BeautifulSoup

SOURCE = 'https://gamevika.com/en/genshin/farming'
CATALOG = json.loads(Path('src/data/materialCatalog.json').read_text())
normalize = lambda name: re.sub('[^a-z0-9]', '', name.lower())
by_name = {normalize(row['name']): key for key, row in CATALOG.items()}
# Stable ID checked against Gamevika: Paimon.moe item text has a different display name.
by_name[normalize('Golden Branch of a Distant Sea')] = 'golden_branch_of_a_distant_sea'
page = requests.get(SOURCE, timeout=25)
page.raise_for_status()
soup = BeautifulSoup(page.text, 'html.parser')
entries = defaultdict(lambda: {'days': [], 'domain': '', 'type': '', 'sourceUrl': SOURCE})
missing = set()
for section in soup.select('section[id^="fd-"]'):
    day = section['id'][3:].lower()
    if day not in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'):
        continue
    for block in section.select('.build-block'):
        head = block.select_one('h2')
        if not head:
            continue
        domain = head.get_text(' ', strip=True)
        if not domain.startswith(('Domain of Mastery:', 'Domain of Forgery:')):
            continue
        kind = 'weapon' if domain.startswith('Domain of Forgery:') else 'talent'
        for anchor in block.select('a[href*="/genshin/item/"]'):
            name = anchor.get_text(' ', strip=True)
            key = by_name.get(normalize(name))
            if not key:
                missing.add(name)
                continue
            item = entries[key]
            if item['domain'] and (item['domain'] != domain or item['type'] != kind):
                # Sunday's page repeats the same material/domain; different domains must not be silently merged.
                raise ValueError((key, item, domain))
            item['domain'], item['type'] = domain, kind
            if day not in item['days']:
                item['days'].append(day)
if len(entries) < 100 or 'tile_of_decarabians_tower' not in entries:
    raise ValueError('Schedule source was incomplete; refusing to write')
result = {'sourceUrl': SOURCE, 'snapshot': str(date.today()), 'entries': dict(sorted(entries.items()))}
Path('src/data/domainSchedule.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(f'{len(entries)} matched schedule entries; unmatched source names: {sorted(missing)}')
