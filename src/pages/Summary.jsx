import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import materials from '../data/materials.json';
import { goalNeeds, mergeNeeds, sortMatKeys, fmtCount } from '../lib/calc.js';

export default function Summary() {
  const { state, update } = useStore();
  const [filter, setFilter] = useState('all'); // all | remaining | done

  const totals = useMemo(
    () => mergeNeeds(state.goals.filter((g) => !g.done).map(goalNeeds)),
    [state.goals]
  );
  const keys = sortMatKeys(Object.keys(totals));

  const setHave = (mk, val) => {
    update((s) => ({ ...s, inventory: { ...s.inventory, [mk]: Math.max(0, val) } }));
  };

  const groups = useMemo(() => {
    const g = {};
    for (const mk of keys) {
      const m = materials[mk];
      let cat = m?.type || 'Other';
      if (cat.startsWith('Local Specialty')) cat = 'Local Specialties';
      if (!g[cat]) g[cat] = [];
      g[cat].push(mk);
    }
    return g;
  }, [keys]);

  const visible = (mk) => {
    const need = totals[mk];
    const have = state.inventory[mk] || 0;
    if (filter === 'remaining') return have < need;
    if (filter === 'done') return have >= need;
    return true;
  };

  if (keys.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Materials summary</h1>
        <div className="empty-state">
          <div className="big">📦</div>
          <p>Nothing to sum up yet — <Link to="/tracker" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>add a goal</Link> first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <h1 className="page-title">Materials summary</h1>
      <p className="page-sub">
        Every material needed across all active goals. Type in what you own — the tracker and Today
        page subtract it automatically.
      </p>

      <div className="pill-toggle" style={{ marginBottom: 20 }}>
        {['all', 'remaining', 'done'].map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'remaining' ? 'Still needed' : 'Complete'}
          </button>
        ))}
      </div>

      {Object.entries(groups).map(([cat, mks]) => {
        const shown = mks.filter(visible);
        if (!shown.length) return null;
        return (
          <div key={cat} style={{ marginBottom: 26 }}>
            <div className="section-label">{cat}</div>
            <div className="summary-grid">
              {shown.map((mk) => {
                const m = materials[mk];
                const need = totals[mk];
                const have = state.inventory[mk] || 0;
                const isDone = have >= need;
                return (
                  <div key={mk} className={`summary-item${isDone ? ' done' : ''}`}>
                    {m?.icon && <img src={m.icon} alt={m?.name} loading="lazy" />}
                    <div className="sinfo">
                      <div className="sname" title={m?.name}>{m?.name || mk}</div>
                      <div className="sneed">
                        {isDone ? '✓ complete' : `need ${fmtCount(need - have)} more`} · total {fmtCount(need)}
                        {m?.days && <span> · {m.days.filter((d) => d !== 'Sunday').map((d) => d.slice(0, 3)).join('/')}</span>}
                      </div>
                    </div>
                    <input
                      type="number" min="0" value={have || ''}
                      placeholder="0"
                      onChange={(e) => setHave(mk, +e.target.value || 0)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
