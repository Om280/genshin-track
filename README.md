# Genshin Track

A Genshin Impact build tracker and farming planner that runs entirely in your browser. No account, no server — all your data lives in localStorage.

## Features

- **Goal tracker** — track characters and weapons with exact material math (ascension, talents, EXP, mora), minus what's already in your inventory
- **Today's farming** — talent-book domain rotation by weekday and server
- **Build guides** — weapons, artifacts, main/sub stats, talent priority for all 124 characters, with current-meta team comps and best-partner pairings
- **Playstyle & downsides notes** — how each character actually plays and their honest weaknesses
- **My Characters library** — import your account via GOOD format (Genshin Optimizer export) or add characters manually
- **Team readiness** — see which recommended teams you can field with your roster, and which pull unlocks the most teams
- **Resin planning** — ley line counts for EXP/Mora, resin cost tables, condensed resin math
- **Weapon reverse-index** — see who each weapon is good for
- **Artifact info** — farming domains, strongbox availability (current 40-set list), crit-rate overcap warnings
- **Weekly summary** — total farming plan across all goals
- **Backup/restore** — export and import all your data as JSON

## Running locally

Requirements: [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

### Production build

```bash
npm run build
npm run preview
```

The static site lands in `dist/` — you can host that folder anywhere (GitHub Pages, Netlify, etc.).

### Regenerating game data

Character/weapon/material data is pre-generated into `src/data/*.json`. To rebuild it (e.g. after a genshin-db update):

```bash
npm run data
```

## Tech

- React 19 + React Router 7
- Vite 8
- [genshin-db](https://github.com/theBowja/genshin-db) (build-time only)
- Icons served from gi.yatta.moe

## Disclaimer

This is a fan-made tool. Genshin Impact is a trademark of HoYoverse (miHoYo). This project is not affiliated with or endorsed by HoYoverse.
