import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, serverDay, DAYS } from '../lib/store.jsx';
import domainsData from '../data/domains.json';
import materials from '../data/materials.json';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import { goalNeeds, remainingNeeds } from '../lib/calc.js';

export default function Today() {
  const { state } = useStore();
  const today = serverDay(state.server);
  const [selDay, setSelDay] = useState(today);
  const isSunday = selDay === 'Sunday';

  // material -> goals that need it (after inventory)
  const needMap = useMemo(() => {
    const map = {};
    for (const goal of state.goals) {
      if (goal.done) continue;
      const rem = remainingNeeds(goalNeeds(goal), state.inventory);
      for (const mk of Object.keys(rem)) {
        if (!map[mk]) map[mk] = [];
        map[mk].push({ goal, amount: rem[mk] });
      }
    }
    return map;
  }, [state.goals, state.inventory]);

  const hasGoals = state.goals.some((g) => !g.done);

  const rotation = useMemo(() => {
    return domainsData
      .map((d) => ({
        ...d,
        series: d.series
          .filter((s) => isSunday || s.days.includes(selDay))
          .map((s) => ({
            ...s,
            neededBy: hasGoals
              ? s.items.flatMap((mk) => (needMap[mk] || []).map((x) => x.goal))
              : [],
          })),
      }))
      .filter((d) => d.series.length > 0)
      .sort((a, b) => {
        const an = a.series.some((s) => s.neededBy.length > 0) ? 0 : 1;
        const bn = b.series.some((s) => s.neededBy.length > 0) ? 0 : 1;
        if (an !== bn) return an - bn;
        return a.type === 'talent' ? -1 : 1;
      });
  }, [selDay, needMap, hasGoals, isSunday]);

  const goalIcon = (goal) =>
    goal.type === 'weapon' ? weapons[goal.key]?.icon : characters[goal.key]?.icon;
  const goalName = (goal) =>
    goal.type === 'weapon' ? weapons[goal.key]?.name : characters[goal.key]?.name;

  return (
    <div className="page">
      <h1 className="page-title">Today's farm</h1>
      <p className="page-sub">
        Domain rotation for the <b>{state.server}</b> server (resets 4 AM server time). Gold rings mark
        materials someone on your tracker still needs.
      </p>

      <div className="day-tabs">
        {DAYS.map((d) => (
          <button
            key={d}
            className={`day-tab${selDay === d ? ' active' : ''}`}
            onClick={() => setSelDay(d)}
          >
            {d.slice(0, 3)}{d === today ? ' · today' : ''}
          </button>
        ))}
      </div>

      {isSunday && (
        <div className="note-block" style={{ marginBottom: 16 }}>
          It's Sunday — every domain drops every series. Farm whatever your crew needs most.
        </div>
      )}

      {!hasGoals && (
        <div className="note-block" style={{ marginBottom: 16 }}>
          You aren't tracking anyone yet, so this is the full rotation.{' '}
          <Link to="/tracker" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>Add a goal</Link>{' '}
          and this page will highlight exactly what to farm.
        </div>
      )}

      {rotation.map((d) => (
        <div key={d.name + d.type} className="domain-card">
          <div className="dhead">
            <span className="dname">{d.name}</span>
            <span className="dregion">{d.region}</span>
            <span className="tag">{d.type === 'talent' ? 'Talent books' : 'Weapon materials'}</span>
          </div>
          {d.series.map((s) => {
            const needed = s.neededBy;
            return (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <div className="mat-row" style={{ flex: 1 }}>
                  {s.items.map((mk) => {
                    const m = materials[mk];
                    if (!m) return null;
                    const isNeeded = (needMap[mk] || []).length > 0;
                    return (
                      <div
                        key={mk}
                        className={`mat-chip r${m.rarity}`}
                        style={isNeeded ? { borderColor: 'var(--gold)', boxShadow: '0 0 0 1px var(--gold)' } : {}}
                      >
                        <img src={m.icon} alt={m.name} loading="lazy" />
                        <span>{m.name}</span>
                        {isNeeded && (
                          <span className="count">
                            need {(needMap[mk] || []).reduce((a, x) => a + x.amount, 0)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {needed.length > 0 && (
                  <div className="needed-by" title="Needed by">
                    {[...new Map(needed.map((g) => [g.id, g])).values()].slice(0, 6).map((g) => (
                      <img key={g.id} src={goalIcon(g)} alt={goalName(g)} title={goalName(g)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <WeeklyBosses needMap={needMap} />
    </div>
  );
}

function WeeklyBosses({ needMap }) {
  // weekly boss mats are Character Level-Up Materials from trounce domains — identify by known names being needed
  const entries = Object.entries(needMap).filter(([mk]) => {
    const m = materials[mk];
    return m && m.type === 'Character Level-Up Material' && m.source && /Challenge Reward/i.test(m.source || '');
  });
  const bossish = Object.entries(needMap).filter(([mk]) => {
    const m = materials[mk];
    if (!m || m.type !== 'Character Level-Up Material') return false;
    if (m.name.includes('Gemstone') || m.name.includes('Chunk') || m.name.includes('Fragment') || m.name.includes('Sliver')) return false;
    return true;
  });
  const list = entries.length ? entries : bossish;
  if (!list.length) return null;
  return (
    <div style={{ marginTop: 30 }}>
      <div className="section-label">Boss materials your crew still needs</div>
      <div className="mat-row">
        {list.map(([mk, needs]) => {
          const m = materials[mk];
          const total = needs.reduce((a, x) => a + x.amount, 0);
          return (
            <div key={mk} className={`mat-chip r${m.rarity}`}>
              <img src={m.icon} alt={m.name} loading="lazy" />
              <span>{m.name}</span>
              <span className="count">×{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
