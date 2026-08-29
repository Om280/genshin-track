import React, { useEffect, useState } from 'react';
import { useStore, currentResin, minutesToFull, RESIN_CAP } from '../lib/store.jsx';
import { ResinIcon } from '../components/shared.jsx';

const SPENDS = [
  { name: 'Talent / Weapon domain', cost: 20, desc: 'Books or weapon ascension mats' },
  { name: 'Artifact domain', cost: 20, desc: 'Artifact farming run' },
  { name: 'Ley Line (Mora)', cost: 20, desc: 'Blossom of Wealth' },
  { name: 'Ley Line (EXP)', cost: 20, desc: "Blossom of Revelation — Hero's Wit" },
  { name: 'Normal boss', cost: 40, desc: 'World boss drops + gems' },
  { name: 'Weekly boss', cost: 30, desc: 'First 3 weekly bosses (30 each)', alt: 60 },
  { name: 'Condensed Resin', cost: 60, desc: 'Craft 1 (double domain rewards)' },
];

// approximate average yields per run (AR 55+, world level 8)
const COST_GUIDE = [
  { activity: 'Ley Line (Mora)', resin: 20, yield: '~60,000 Mora', per: '≈3,000 Mora per resin' },
  { activity: 'Ley Line (EXP)', resin: 20, yield: "~5 Hero's Wit + 3 Adventurer's Exp (~122k EXP)", per: '≈6,100 EXP per resin' },
  { activity: 'Talent book domain', resin: 20, yield: '~9-10 books (converted to greens)', per: '≈0.5 gold book per resin' },
  { activity: 'Weapon material domain', resin: 20, yield: '~9-10 mats (converted to lowest tier)', per: 'Similar to talent domains' },
  { activity: 'Artifact domain', resin: 20, yield: '1-2 artifacts (5★)', per: 'Endgame stat-hunting' },
  { activity: 'Normal boss', resin: 40, yield: '2-3 boss mats + gems + some Mora', per: '≈13 runs for 1→90 boss mats (~520 resin)' },
  { activity: 'Weekly boss (first 3/week)', resin: 30, yield: '1-3 weekly mats + gems + Mora', per: 'Always do 3 per week' },
  { activity: 'Condensed Resin run', resin: 60, yield: 'Double rewards from one domain run', per: 'Saves time, same efficiency' },
];

export default function Resin() {
  const { state, update, showToast } = useStore();
  const [, tick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const cur = currentResin(state.resin);
  const mins = minutesToFull(state.resin);
  const fullAt = new Date(Date.now() + mins * 60000);

  const setResin = (val) => {
    update((s) => ({ ...s, resin: { value: Math.max(0, Math.min(RESIN_CAP, val)), updatedAt: Date.now() } }));
  };

  const spend = (cost, name) => {
    if (cur < cost) {
      showToast(`Not enough resin for ${name}`);
      return;
    }
    setResin(cur - cost);
    showToast(`Spent ${cost} resin — ${name}`);
  };

  return (
    <div className="page">
      <h1 className="page-title">Resin tracker</h1>
      <p className="page-sub">Regenerates 1 resin every 8 minutes, caps at {RESIN_CAP}. Set it once, it keeps counting for you.</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="resin-hero">
          <div>
            <div className="resin-count">
              {cur}<small> / {RESIN_CAP}</small>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13.5 }}>
              {cur >= RESIN_CAP
                ? 'Full — go spend it!'
                : `Full in ${Math.floor(mins / 60)}h ${mins % 60}m (${fullAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${fullAt.getDate() !== new Date().getDate() ? ' tomorrow' : ''})`}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="resin-bar"><div className="fill" style={{ width: `${(cur / RESIN_CAP) * 100}%` }} /></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Correct it:</span>
              <input
                type="number" min="0" max={RESIN_CAP} value={cur}
                onChange={(e) => setResin(+e.target.value || 0)}
              />
              <button className="btn small" onClick={() => setResin(RESIN_CAP)}>Set full</button>
              <button className="btn small" onClick={() => setResin(0)}>Set 0</button>
              <button className="btn small" onClick={() => setResin(Math.min(RESIN_CAP, cur + 60))}>+60 (Fragile)</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">Quick spend</div>
      <div className="spend-grid">
        {SPENDS.map((s) => (
          <div key={s.name} className="spend-card" onClick={() => spend(s.cost, s.name)}>
            <div className="sc-name">{s.name}</div>
            <div className="sc-cost">−{s.cost} resin</div>
            <div className="sc-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <div className="section-label">What resin actually buys</div>
        <div className="card" style={{ overflowX: 'auto', padding: '8px 18px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Cost</th>
                <th>Typical yield</th>
                <th>Value note</th>
              </tr>
            </thead>
            <tbody>
              {COST_GUIDE.map((r) => (
                <tr key={r.activity}>
                  <td style={{ fontWeight: 700 }}>{r.activity}</td>
                  <td style={{ whiteSpace: 'nowrap' }}><ResinIcon size={15} /> {r.resin}</td>
                  <td>{r.yield}</td>
                  <td style={{ color: 'var(--muted)' }}>{r.per}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Yields are averages at AR 55+ / World Level 8 — actual drops vary per run.
        </p>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="section-label">Rough cost of a full character build</div>
        <div className="card" style={{ overflowX: 'auto', padding: '8px 18px' }}>
          <table className="data-table">
            <thead>
              <tr><th>Goal</th><th>Approx. resin</th><th>Approx. days (180/day)</th></tr>
            </thead>
            <tbody>
              <tr><td>Boss materials (46 needed, 1→90)</td><td><ResinIcon size={15} /> ~520-920</td><td>3-5 days</td></tr>
              <tr><td>Talent books for 9/9/9 (one character)</td><td><ResinIcon size={15} /> ~700-900</td><td>4-5 days (domain-day limited)</td></tr>
              <tr><td>EXP books for 1→90 (419 Hero's Wit)</td><td><ResinIcon size={15} /> ~1,675</td><td>~9 days (ley lines only)</td></tr>
              <tr><td>Mora for everything (~7M with talents)</td><td><ResinIcon size={15} /> ~2,300</td><td>~13 days (ley lines only)</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          In practice EXP and Mora accumulate passively from events, chests, and dailies — most players
          only ley-line farm the shortfall right before a big level-up push.
        </p>
      </div>

      <div className="note-block" style={{ marginTop: 24 }}>
        <b>Efficiency tip:</b> craft Condensed Resin (60 resin each, hold up to 5) whenever you can't
        spend soon — it doubles a single domain run's rewards, saving loading screens at identical
        resin efficiency. Talent/weapon domains and normal bosses are the best value while you're
        building characters; artifact farming is endgame glue.
      </div>
    </div>
  );
}
