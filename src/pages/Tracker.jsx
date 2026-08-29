import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import { goalNeeds, remainingNeeds, sortMatKeys } from '../lib/calc.js';
import { MatChip, Modal } from '../components/shared.jsx';
import GoalForm from '../components/GoalForm.jsx';

export default function Tracker() {
  const { state, update, showToast } = useStore();
  const [adding, setAdding] = useState(null); // { type, key } picking or editing
  const [editing, setEditing] = useState(null); // goal object
  const [picker, setPicker] = useState(null); // 'character' | 'weapon'
  const [showDone, setShowDone] = useState(false);
  const [view, setView] = useState(() => localStorage.getItem('goalView') || 'detailed'); // detailed | compact
  const setViewPersist = (v) => { setView(v); localStorage.setItem('goalView', v); };

  const active = state.goals.filter((g) => !g.done);
  const done = state.goals.filter((g) => g.done);

  const removeGoal = (id) => {
    update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
    showToast('Goal removed');
  };
  const removeAllGoals = () => {
    if (confirm(`Remove ALL ${state.goals.length} goals? Your My Characters library and inventory are kept.`)) {
      update((s) => ({ ...s, goals: [] }));
      showToast('All goals removed');
    }
  };
  const markDone = (id, val) => {
    update((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, done: val } : g)) }));
    showToast(val ? 'Marked complete — nice work!' : 'Goal reopened');
  };
  const saveGoal = (goal) => {
    update((s) => {
      // a tracked character automatically joins the My Characters library
      let owned = s.owned || {};
      let ownedWeapons = s.ownedWeapons || {};
      if (goal.type === 'character' && !owned[goal.key]) {
        owned = { ...owned, [goal.key]: { level: goal.current?.level || 1, ascension: 0, constellation: 0, talents: goal.current?.talents || [1, 1, 1] } };
      }
      if (goal.type === 'weapon' && !ownedWeapons[goal.key]) {
        ownedWeapons = { ...ownedWeapons, [goal.key]: { level: goal.current?.level || 1, ascension: 0, refinement: 1 } };
      }
      if (editing) {
        return { ...s, owned, ownedWeapons, goals: s.goals.map((g) => (g.id === editing.id ? { ...goal, id: editing.id } : g)) };
      }
      return { ...s, owned, ownedWeapons, goals: [...s.goals, { ...goal, id: crypto.randomUUID() }] };
    });
    setAdding(null);
    setEditing(null);
    showToast('Goal saved');
  };

  return (
    <div className="page page-wide">
      <h1 className="page-title">My goals</h1>
      <p className="page-sub">
        Every tracked character and weapon, with everything still owed after your inventory is subtracted.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
        <button className="btn primary" onClick={() => setPicker('character')}>+ Track a character</button>
        <button className="btn" onClick={() => setPicker('weapon')}>+ Track a weapon</button>
        <Link to="/settings" className="btn">Import from Genshin Optimizer</Link>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="pill-toggle">
            <button className={view === 'detailed' ? 'active' : ''} onClick={() => setViewPersist('detailed')} title="Full cards with materials">▤ Detailed</button>
            <button className={view === 'compact' ? 'active' : ''} onClick={() => setViewPersist('compact')} title="Compact cards — see everything at once">▦ Compact</button>
          </span>
          {done.length > 0 && (
            <button className="btn small" onClick={() => setShowDone(!showDone)}>
              {showDone ? 'Hide' : 'Show'} completed ({done.length})
            </button>
          )}
          {state.goals.length > 0 && (
            <button className="btn small danger" onClick={removeAllGoals}>
              Remove all goals
            </button>
          )}
        </span>
      </div>

      {active.length === 0 && (
        <div className="empty-state">
          <div className="big">🎯</div>
          <p>No goals yet. Track a character to see exactly what to farm.</p>
        </div>
      )}

      <div className="goal-grid" style={view === 'compact' ? { gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 } : {}}>
        {(showDone ? [...active, ...done] : active).map((goal) =>
          view === 'compact' ? (
            <CompactGoalCard
              key={goal.id}
              goal={goal}
              inventory={state.inventory}
              onEdit={() => setEditing(goal)}
              onRemove={() => removeGoal(goal.id)}
              onDone={(v) => markDone(goal.id, v)}
            />
          ) : (
            <GoalCard
              key={goal.id}
              goal={goal}
              inventory={state.inventory}
              onEdit={() => setEditing(goal)}
              onRemove={() => removeGoal(goal.id)}
              onDone={(v) => markDone(goal.id, v)}
            />
          )
        )}
      </div>

      {picker && (
        <Modal onClose={() => setPicker(null)}>
          <ItemPicker
            type={picker}
            existing={new Set(active.filter((g) => g.type === picker).map((g) => g.key))}
            onPick={(key) => {
              setAdding({ type: picker, key });
              setPicker(null);
            }}
            onClose={() => setPicker(null)}
          />
        </Modal>
      )}

      {(adding || editing) && (
        <Modal onClose={() => { setAdding(null); setEditing(null); }}>
          <h2>
            {editing ? 'Edit goal — ' : 'Track — '}
            {(editing?.type || adding.type) === 'weapon'
              ? weapons[editing?.key || adding.key]?.name
              : characters[editing?.key || adding.key]?.name}
          </h2>
          <GoalForm
            type={editing?.type || adding.type}
            itemKey={editing?.key || adding.key}
            initial={editing}
            onSave={saveGoal}
            onCancel={() => { setAdding(null); setEditing(null); }}
          />
        </Modal>
      )}
    </div>
  );
}

function CompactGoalCard({ goal, inventory, onEdit, onRemove, onDone }) {
  const isWeapon = goal.type === 'weapon';
  const item = isWeapon ? weapons[goal.key] : characters[goal.key];
  if (!item) return null;

  const needs = goalNeeds(goal);
  const rem = remainingNeeds(needs, inventory);
  const totalNeed = Object.values(needs).reduce((a, b) => a + b, 0);
  const totalRem = Object.values(rem).reduce((a, b) => a + b, 0);
  const pct = totalNeed === 0 ? 100 : Math.round(((totalNeed - totalRem) / totalNeed) * 100);
  const matsLeft = Object.keys(rem).filter((k) => rem[k] > 0).length;

  return (
    <div className="goal-card" style={goal.done ? { opacity: 0.55 } : {}}>
      <div className="goal-head" style={{ padding: '10px 12px 8px', gap: 9 }}>
        <Link to={isWeapon ? `/weapon/${goal.key}` : `/character/${goal.key}`}>
          <img className={`avatar r${item.rarity}`} src={item.icon} alt={item.name} loading="lazy" style={{ width: 40, height: 40 }} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="gname" style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
          <div className="gmeta" style={{ fontSize: 11.5 }}>
            Lv {goal.current.level}→{goal.target.level}
            {!isWeapon && goal.target.talents && <span>· {goal.target.talents.join('/')}</span>}
          </div>
        </div>
        <span className="tag gold" style={{ fontSize: 11.5 }}>{pct}%</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      <div className="goal-actions" style={{ padding: '8px 12px 10px', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: matsLeft === 0 ? 'var(--green)' : 'var(--muted)' }}>
          {matsLeft === 0 ? 'Ready ✓' : `${matsLeft} mats left`}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className="btn small" style={{ padding: '3px 8px', fontSize: 12 }} onClick={onEdit} title="Edit">✎</button>
          <button className="btn small" style={{ padding: '3px 8px', fontSize: 12 }} onClick={() => onDone(!goal.done)} title={goal.done ? 'Reopen' : 'Mark done'}>
            {goal.done ? '↩' : '✓'}
          </button>
          <button className="btn small danger" style={{ padding: '3px 8px', fontSize: 12 }} onClick={onRemove} title="Remove">✕</button>
        </span>
      </div>
    </div>
  );
}

function GoalCard({ goal, inventory, onEdit, onRemove, onDone }) {
  const isWeapon = goal.type === 'weapon';
  const item = isWeapon ? weapons[goal.key] : characters[goal.key];
  if (!item) return null;

  const needs = goalNeeds(goal);
  const rem = remainingNeeds(needs, inventory);
  const matKeys = sortMatKeys(Object.keys(needs));
  const totalNeed = Object.values(needs).reduce((a, b) => a + b, 0);
  const totalRem = Object.values(rem).reduce((a, b) => a + b, 0);
  const pct = totalNeed === 0 ? 100 : Math.round(((totalNeed - totalRem) / totalNeed) * 100);

  return (
    <div className="goal-card" style={goal.done ? { opacity: 0.55 } : {}}>
      <div className="goal-head">
        <Link to={isWeapon ? `/weapon/${goal.key}` : `/character/${goal.key}`}>
          <img className={`avatar r${item.rarity}`} src={item.icon} alt={item.name} loading="lazy" />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="gname">{item.name}</div>
          <div className="gmeta">
            Lv {goal.current.level} → {goal.target.level}
            {!isWeapon && goal.target.talents && (
              <span>· Talents {goal.current.talents?.join('/')} → {goal.target.talents.join('/')}</span>
            )}
          </div>
        </div>
        <span className="tag gold">{pct}%</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      <div className="goal-mats">
        {matKeys.length === 0 ? (
          <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>Nothing left to farm 🎉</span>
        ) : (
          <div className="mat-row">
            {matKeys.map((mk) => (
              <MatChip key={mk} matKey={mk} count={needs[mk]} have={inventory[mk] || 0} showHave />
            ))}
          </div>
        )}
      </div>
      <div className="goal-actions">
        <button className="btn small" onClick={onEdit}>Edit</button>
        <button className="btn small" onClick={() => onDone(!goal.done)}>{goal.done ? 'Reopen' : 'Done'}</button>
        <button className="btn small danger" style={{ marginLeft: 'auto' }} onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}

export function ItemPicker({ type, existing, onPick, onClose }) {
  const [q, setQ] = useState('');
  const pool = type === 'weapon' ? weapons : characters;
  const list = Object.values(pool)
    .filter((x) => (type === 'weapon' ? x.rarity >= 3 : true))
    .filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name))
    .slice(0, 60);

  return (
    <div>
      <h2>Pick a {type}</h2>
      <input
        type="search" autoFocus placeholder={`Search ${type}s…`} style={{ width: '100%', marginBottom: 14 }}
        value={q} onChange={(e) => setQ(e.target.value)}
      />
      <div className="char-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', maxHeight: 420, overflowY: 'auto' }}>
        {list.map((x) => (
          <div key={x.key} className={`char-tile r${x.rarity}`} onClick={() => onPick(x.key)}>
            <img className="portrait" src={x.icon} alt={x.name} loading="lazy" />
            {existing.has(x.key) && <span className="tracked-badge">✓</span>}
            <div className="cname">{x.name}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
