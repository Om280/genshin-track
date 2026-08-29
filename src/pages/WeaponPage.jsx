import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import weapons from '../data/weapons.json';
import characters from '../data/characters.json';
import weaponUsers from '../data/weapon-users.json';
import materials from '../data/materials.json';
import { ElementIcon } from '../components/shared.jsx';
import { weaponNeeds, sortMatKeys } from '../lib/calc.js';
import { MatChip, Stars, Modal } from '../components/shared.jsx';
import GoalForm from '../components/GoalForm.jsx';

export default function WeaponPage() {
  const { key } = useParams();
  const w = weapons[key];
  const { state, update, showToast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const existing = state.goals.find((g) => g.type === 'weapon' && g.key === key && !g.done);
  const maxLvl = w && w.rarity <= 2 ? 70 : 90;

  const fullNeeds = useMemo(
    () => (w ? weaponNeeds(key, { level: 1, asc: false }, { level: maxLvl, asc: false }) : {}),
    [key, w, maxLvl]
  );

  if (!w) return <div className="page"><div className="empty-state">Weapon not found.</div></div>;

  const saveGoal = (goal) => {
    update((s) => {
      const goals = existing
        ? s.goals.map((g) => (g.id === existing.id ? { ...goal, id: existing.id } : g))
        : [...s.goals, { ...goal, id: crypto.randomUUID() }];
      // a tracked weapon automatically joins the My Characters library
      const ownedWeapons = s.ownedWeapons?.[key]
        ? s.ownedWeapons
        : { ...(s.ownedWeapons || {}), [key]: { level: goal.current?.level || 1, ascension: 0, refinement: 1 } };
      return { ...s, goals, ownedWeapons };
    });
    showToast(existing ? `${w.name} goal updated` : `${w.name} added to your tracker`);
    setShowForm(false);
  };

  const domainMat = Object.keys(fullNeeds).find((mk) => materials[mk]?.type === 'Weapon Ascension Material');

  return (
    <div className="page">
      <div className="char-hero">
        <div className="splash-box" style={{ aspectRatio: '1' }}>
          <img src={w.awakenIcon || w.icon} alt={w.name} style={{ width: '75%' }} />
        </div>
        <div className="info">
          <h1>{w.name}</h1>
          <div className="elem-row">
            <Stars n={w.rarity} />
            <span className="tag">{w.weaponType}</span>
            <span className="tag gold">Base ATK {w.baseAtk}</span>
            {w.mainStat && <span className="tag gold">{w.mainStat}</span>}
          </div>
          {w.effectName && (
            <div className="note-block" style={{ margin: '12px 0' }}>
              <b>{w.effectName} (R1):</b> {w.effect}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <button className="btn primary" onClick={() => setShowForm(true)}>
              {existing ? 'Edit my goal' : '+ Track this weapon'}
            </button>
            {existing && <button className="btn" onClick={() => navigate('/tracker')}>View in tracker</button>}
          </div>
          {existing && (
            <div style={{ marginTop: 12 }} className="tag gold">
              Tracking: Lv {existing.current.level} → {existing.target.level}
            </div>
          )}
        </div>
      </div>

      <GoodFor weaponKey={key} ownedChars={state.owned || {}} />

      <div className="build-section">
        <h2>Ascension materials — full (1→{maxLvl})</h2>
        <div className="mat-row">
          {sortMatKeys(Object.keys(fullNeeds)).map((mk) => (
            <MatChip key={mk} matKey={mk} count={fullNeeds[mk]} />
          ))}
        </div>
        {domainMat && materials[domainMat]?.days && (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Domain days: {materials[domainMat].days.filter((d) => d !== 'Sunday').map((d) => d.slice(0, 3)).join(', ')} (+ Sunday)
          </p>
        )}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h2>{existing ? 'Edit goal' : 'Track'} — {w.name}</h2>
          <GoalForm
            type="weapon"
            itemKey={key}
            initial={existing}
            onSave={saveGoal}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function GoodFor({ weaponKey, ownedChars }) {
  const users = weaponUsers[weaponKey] || [];
  if (!users.length) return null;
  const hasLibrary = Object.keys(ownedChars).length > 0;
  const rankLabel = (r) => (r === 1 ? 'BiS' : r === 2 ? '2nd choice' : r === 3 ? '3rd choice' : `option #${r}`);
  return (
    <div className="build-section">
      <h2>Who is this weapon good for?</h2>
      <div className="weapon-list">
        {users.map((u) => {
          const c = characters[u.char];
          if (!c) return null;
          const own = ownedChars[u.char];
          return (
            <Link
              key={u.char}
              to={`/character/${u.char}`}
              className={`weapon-item r${c.rarity}`}
              style={{
                borderColor: hasLibrary && own ? 'rgba(95,211,154,0.45)' : undefined,
                opacity: hasLibrary && !own ? 0.6 : 1,
              }}
            >
              <img src={c.icon} alt={c.name} loading="lazy" style={{ borderRadius: '50%' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="wname" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ElementIcon element={c.element} size={14} />
                  {c.name}
                  {hasLibrary && own && <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span>}
                </div>
                <div className="wsub">{u.role.toLowerCase()}</div>
              </div>
              {u.rank <= 3 && <span className="rank-badge">{rankLabel(u.rank)}</span>}
            </Link>
          );
        })}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13 }}>
        Ranked by where this weapon appears in each character's build guide. Green = in your library.
      </p>
    </div>
  );
}
