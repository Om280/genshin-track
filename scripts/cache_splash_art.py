"""Cache only verified full Genshin gacha splash art by stable character ID.

Enka /ui/UI_Gacha_AvatarImg_<name>.png is the full 2048x1024 game splash,
not a UI_AvatarIcon portrait. Duplicate Traveler/Manekin variants share the
same independently verified full art; no portrait is substituted on failure.
Run from repo root. Pillow and requests are required for this maintenance task.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from PIL import Image
import json
import requests

catalog = json.loads(Path('src/data/catalog.json').read_text())['characters']
root = Path('public/assets/splash');root.mkdir(parents=True, exist_ok=True)
icons = {}
for c in catalog:
    icons.setdefault(c['icon'], []).append(c['id'])

def cache(icon, ids):
    suffix = icon.rsplit('/', 1)[-1].replace('UI_AvatarIcon_', '').removesuffix('.png')
    # Enka's male full-art asset suffixes are swapped relative to its AvatarIcon
    # portraits: visually verified PlayerBoy icon=Aether but gacha PlayerBoy=Manekin.
    # Female PlayerGirl/MannequinGirl match and must NOT be swapped.
    suffix = {'PlayerBoy':'MannequinBoy','MannequinBoy':'PlayerBoy'}.get(suffix,suffix)
    url = f'https://enka.network/ui/UI_Gacha_AvatarImg_{suffix}.png'
    path = root / f'{ids[0]}.webp'
    if path.exists():
        try:
            with Image.open(path) as existing:
                if existing.width >= 900 and existing.height >= 400:
                    return ids, str(path.relative_to('public')), url, f'locally verified WebP {existing.width}x{existing.height}'
        except Exception:
            pass
    try:
        response = requests.get(url, timeout=22, headers={'User-Agent':'GenshinTrack-asset-cache/1.0'})
        if response.status_code != 200 or response.headers.get('content-type','').split(';')[0] != 'image/png' or response.content[:8] != b'\x89PNG\r\n\x1a\n':
            return ids, None, url, f'HTTP {response.status_code}'
        if len(response.content) > 9_000_000: return ids, None, url, 'over size limit'
        with Image.open(BytesIO(response.content)) as raw:
            raw.load()
            if raw.width < 900 or raw.height < 850:
                return ids, None, url, f'not full art {raw.size}'
            art = raw.convert('RGBA')
            art.thumbnail((1536, 900), Image.Resampling.LANCZOS)
            art.save(path,'WEBP',quality=80,method=5)
            return ids,str(path.relative_to('public')),url,f'{raw.width}x{raw.height}'
    except (requests.RequestException, OSError, ValueError) as exc:
        return ids,None,url,str(exc)[:100]

results = {}
with ThreadPoolExecutor(max_workers=8) as pool:
    for future in as_completed([pool.submit(cache, icon, ids) for icon, ids in icons.items()]):
        ids, path, url, status = future.result()
        for id in ids: results[id] = {'path':'/'+path if path else None,'sourceUrl':url,'verification':status}
missing = [(c['id'], c['name'], results[c['id']]['verification']) for c in catalog if not results[c['id']]['path']]
Path('src/data/splashManifest.json').write_text(json.dumps({id:results[id] for id in sorted(results)},indent=2)+'\n')
print(f'Full verified splash art: {len(catalog)-len(missing)}/{len(catalog)} entries; {len(icons)} distinct icon keys; {len(missing)} unavailable')
print('Unavailable:',missing)
