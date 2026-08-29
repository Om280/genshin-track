import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import builds from '../data/builds.json';
import { ElementIcon, ELEMENT_COLORS, Modal } from '../components/shared.jsx';
import { ascensionToState } from '../lib/good.js';
import { ItemPicker } from './Tracker.jsx';

const ELEMENTS = ['Pyro', 'Hydro', 'Electro', 'Cryo', 'Anemo', 'Geo', 'Dendro'];
const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
const SORTS = [
  { id: 'level', label: 'Level' },
  { id: 'rarity', label: 'Rarity' },
  { id: 'name', label: 'Name' },
  { id: 'element', label: 'Element' },
  { id: 'cons', label: 'Constellation' },
];

export default function MyCharacters() {
  const { state, update, showToast } = useStore();
  const [tab, setTab] = useState('characters');
  const [selected, setSelected] = useState(() => new Set());
  const [addPicker, setAddPicker] = useState(null); // 'character' | 'weapon'
  const [addForm, setAddForm] = useState(null); // { type, key }
  const [elem, setElem] = useState(null);
  const [wtype, setWtype] = useState(null);
  const [sortBy, setSortBy] = useState('level');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const ownedChars = useMemo(() => {
    let list = Object.entries(state.owned || {}).filter(([k]) => characters[k]);
    if (elem) list = list.filter(([k]) => characters[k].element === elem);
    if (wtype) list = list.filter(([k]) => characters[k].weaponType === wtype);
    if (q) list = list.filter(([k]) => characters[k].name.toLowerCase().includes(q.toLowerCase()));
    const cmp = {
      level: (a, b) => b[1].level - a[1].level || characters[b[0]].rarity - characters[a[0]].rarity,
      rarity: (a, b) => characters[b[0]].rarity - characters[a[0]].rarity || b[1].level - a[1].level,
      name: (a, b) => characters[a[0]].name.localeCompare(characters[b[0]].name),
      element: (a, b) =>
        ELEMENTS.indexOf(characters[a[0]].element) - ELEMENTS.indexOf(characters[b[0]].element) ||
        b[1].level - a[1].level,
      cons: (a, b) => (b[1].constellation || 0) - (a[1].constellation || 0) || b[1].level - a[1].level,
    }[sortBy];
    return [...list].sort(cmp);
  }, [state.owned, elem, wtype, sortBy, q]);

  const ownedWeps = useMemo(() => {
    let list = Object.entries(state.ownedWeapons || {}).filter(([k]) => weapons[k]);
    if (wtype) list = list.filter(([k]) => weapons[k].weaponType === wtype);
    if (q) list = list.filter(([k]) => weapons[k].name.toLowerCase().includes(q.toLowerCase()));
    const cmp = {
      level: (a, b) => b[1].level - a[1].level || weapons[b[0]].rarity - weapons[a[0]].rarity,
      rarity: (a, b) => weapons[b[0]].rarity - weapons[a[0]].rarity || b[1].level - a[1].level,
      name: (a, b) => weapons[a[0]].name.localeCompare(weapons[b[0]].name),
      element: (a, b) => b[1].level - a[1].level,
      cons: (a, b) => (b[1].refinement || 1) - (a[1].refinement || 1) || b[1].level - a[1].level,
    }[sortBy];
    return [...list].sort(cmp);
  }, [state.ownedWeapons, wtype, sortBy, q]);
  const goalKeys = new Set(state.goals.filter((g) => !g.done).map((g) => `${g.type}:${g.key}`));

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const list = tab === 'characters' ? ownedChars : ownedWeps;
  const selectable = list.filter(([k]) => !goalKeys.has(`${tab === 'characters' ? 'character' : 'weapon'}:${k}`));

  const addToGoals = () => {
    if (selected.size === 0) return;
    update((s) => {
      const goals = [...s.goals];
      const existing = new Set(goals.map((g) => `${g.type}:${g.key}`));
      for (const id of selected) {
        const [type, key] = [id.split(':')[0], id.split(':').slice(1).join(':')];
        if (existing.has(id)) continue;
        if (type === 'character') {
          const o = s.owned[key];
          if (!o) continue;
          const cur = ascensionToState(o.level, o.ascension);
          const tt = builds[key]?.talentTargets || [6, 9, 9];
          goals.push({
            id: crypto.randomUUID(),
            type: 'character',
            key,
            current: { ...cur, talents: o.talents || [1, 1, 1] },
            target: {
              level: 90,
              asc: false,
              talents: tt.map((t, i) => Math.max(t, (o.talents || [1, 1, 1])[i])),
            },
            done: false,
          });
        } else {
          const o = s.ownedWeapons[key];
          if (!o) continue;
          const cur = ascensionToState(o.level, o.ascension);
          goals.push({
            id: crypto.randomUUID(),
            type: 'weapon',
            key,
            current: cur,
            target: { level: 90, asc: false },
            done: false,
          });
        }
      }
      return { ...s, goals };
    });
    showToast(`${selected.size} added to My Goals`);
    setSelected(new Set());
    navigate('/tracker');
  };

  const removeOwned = (key) => {
    update((s) => {
      if (tab === 'characters') {
        const owned = { ...s.owned };
        delete owned[key];
        return { ...s, owned };
      }
      const ownedWeapons = { ...s.ownedWeapons };
      delete ownedWeapons[key];
      return { ...s, ownedWeapons };
    });
  };

  const addOwned = (type, key, form) => {
    update((s) => {
      if (type === 'character') {
        return { ...s, owned: { ...(s.owned || {}), [key]: { level: form.level, ascension: 0, constellation: form.constellation, talents: form.talents } } };
      }
      return { ...s, ownedWeapons: { ...(s.ownedWeapons || {}), [key]: { level: form.level, ascension: 0, refinement: form.refinement || 1 } } };
    });
    showToast(`${(type === 'character' ? characters : weapons)[key]?.name} added to your library`);
    setAddForm(null);
  };

  const pickerModals = (
    <>
      {addPicker && (
        <Modal onClose={() => setAddPicker(null)}>
          <ItemPicker
            type={addPicker}
            existing={new Set(Object.keys(addPicker === 'character' ? state.owned || {} : state.ownedWeapons || {}))}
            onPick={(key) => { setAddForm({ type: addPicker, key }); setAddPicker(null); }}
            onClose={() => setAddPicker(null)}
          />
        </Modal>
      )}
      {addForm && (
        <Modal onClose={() => setAddForm(null)}>
          <AddOwnedForm
            type={addForm.type}
            itemKey={addForm.key}
            onSave={(form) => addOwned(addForm.type, addForm.key, form)}
            onCancel={() => setAddForm(null)}
          />
        </Modal>
      )}
    </>
  );

  if (ownedChars.length === 0 && ownedWeps.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">My characters</h1>
        <div className="empty-state">
          <div className="big">📥</div>
          <p>
            Your library is empty. Import your account from Genshin Optimizer on the{' '}
            <Link to="/settings" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>Import page</Link>{' '}
            — everything lands here first, then you pick who to build.
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn primary" onClick={() => setAddPicker('character')}>+ Add a character manually</button>
            <button className="btn" onClick={() => setAddPicker('weapon')}>+ Add a weapon manually</button>
          </div>
        </div>
        {pickerModals}
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <h1 className="page-title">My characters</h1>
      <p className="page-sub">
        Your imported library ({ownedChars.length} characters, {ownedWeps.length} weapons). Select
        the ones you want to build and send them to My Goals — talent targets are pre-filled from
        each character's recommended talent priority.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <div className="pill-toggle">
          <button className={tab === 'characters' ? 'active' : ''} onClick={() => { setTab('characters'); setSelected(new Set()); }}>
            Characters ({Object.keys(state.owned || {}).length})
          </button>
          <button className={tab === 'weapons' ? 'active' : ''} onClick={() => { setTab('weapons'); setSelected(new Set()); }}>
            Weapons ({Object.keys(state.ownedWeapons || {}).length})
          </button>
        </div>
        <button className="btn primary" disabled={selected.size === 0} onClick={addToGoals}>
          Add {selected.size > 0 ? selected.size : ''} to My Goals →
        </button>
        <button className="btn" onClick={() => setAddPicker(tab === 'characters' ? 'character' : 'weapon')}>
          + Add {tab === 'characters' ? 'character' : 'weapon'} manually
        </button>
        {selectable.length > 0 && (
          <button
            className="btn small"
            onClick={() => {
              const prefix = tab === 'characters' ? 'character' : 'weapon';
              setSelected(new Set(selectable.map(([k]) => `${prefix}:${k}`)));
            }}
          >
            Select all untracked
          </button>
        )}
        {selected.size > 0 && (
          <button className="btn small" onClick={() => setSelected(new Set())}>Clear selection</button>
        )}
      </div>

      <div className="filter-bar">
        <input
          type="search" className="search-input" placeholder={`Search ${tab}…`}
          value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 220 }}
        />
        {tab === 'characters' && (
          <>
            <span className={`chip${!elem ? ' active' : ''}`} onClick={() => setElem(null)}>All</span>
            {ELEMENTS.map((el) => (
              <span
                key={el}
                className={`chip${elem === el ? ' active' : ''}`}
                style={elem === el ? { color: ELEMENT_COLORS[el], borderColor: ELEMENT_COLORS[el] } : {}}
                onClick={() => setElem(elem === el ? null : el)}
              >
                <ElementIcon element={el} size={15} /> {el}
              </span>
            ))}
            <span style={{ width: 10 }} />
          </>
        )}
        {WEAPON_TYPES.map((w) => (
          <span key={w} className={`chip${wtype === w ? ' active' : ''}`} onClick={() => setWtype(wtype === w ? null : w)}>{w}</span>
        ))}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13 }}>
          Sort:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORTS.filter((s) => tab === 'characters' || !['element'].includes(s.id)).map((s) => (
              <option key={s.id} value={s.id}>{s.id === 'cons' && tab === 'weapons' ? 'Refinement' : s.label}</option>
            ))}
          </select>
        </span>
      </div>

      <div className="goal-grid">
        {list.map(([key, o]) => {
          const item = tab === 'characters' ? characters[key] : weapons[key];
          if (!item) return null;
          const id = `${tab === 'characters' ? 'character' : 'weapon'}:${key}`;
          const inGoals = goalKeys.has(id);
          const isSel = selected.has(id);
          return (
            <div
              key={key}
              className="goal-card"
              style={{
                cursor: inGoals ? 'default' : 'pointer',
                borderColor: isSel ? 'var(--gold)' : inGoals ? 'rgba(95,211,154,0.35)' : undefined,
                boxShadow: isSel ? '0 0 0 1px var(--gold)' : undefined,
              }}
              onClick={() => !inGoals && toggle(id)}
            >
              <div className="goal-head">
                <img className={`avatar r${item.rarity}`} src={item.icon} alt={item.name} loading="lazy" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="gname" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {tab === 'characters' && <ElementIcon element={item.element} size={17} />}
                    {item.name}
                  </div>
                  <div className="gmeta">
                    Lv {o.level}
                    {tab === 'characters' && o.constellation > 0 && <span>· C{o.constellation}</span>}
                    {tab === 'characters' && o.talents && <span>· {o.talents.join('/')}</span>}
                    {tab === 'weapons' && o.refinement > 1 && <span>· R{o.refinement}</span>}
                  </div>
                </div>
                {inGoals ? (
                  <span className="tag" style={{ color: 'var(--green)', borderColor: 'rgba(95,211,154,0.4)' }}>in goals</span>
                ) : (
                  <span className="tag" style={isSel ? { color: 'var(--gold2)', borderColor: 'var(--gold)' } : {}}>
                    {isSel ? '✓ selected' : 'select'}
                  </span>
                )}
              </div>
              <div className="goal-actions" onClick={(e) => e.stopPropagation()}>
                <Link
                  className="btn small"
                  to={tab === 'characters' ? `/character/${key}` : `/weapon/${key}`}
                >
                  Guide
                </Link>
                <button className="btn small danger" style={{ marginLeft: 'auto' }} onClick={() => removeOwned(key)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {pickerModals}
    </div>
  );
}

function AddOwnedForm({ type, itemKey, onSave, onCancel }) {
  const item = type === 'character' ? characters[itemKey] : weapons[itemKey];
  const [level, setLevel] = useState(1);
  const [constellation, setConstellation] = useState(0);
  const [refinement, setRefinement] = useState(1);
  const [talents, setTalents] = useState([1, 1, 1]);
  if (!item) return null;
  const LEVELS = [1, 20, 40, 50, 60, 70, 80, 90];

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={item.icon} alt={item.name} style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(160deg,#3f3730,#241f1a)' }} />
        Add {item.name}
      </h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '14px 0' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
          Level
          <select value={level} onChange={(e) => setLevel(+e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        {type === 'character' ? (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
              Constellation
              <select value={constellation} onChange={(e) => setConstellation(+e.target.value)}>
                {[0, 1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>C{c}</option>)}
              </select>
            </label>
            {['Normal', 'Skill', 'Burst'].map((t, i) => (
              <label key={t} style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
                {t}
                <select
                  value={talents[i]}
                  onChange={(e) => setTalents(talents.map((v, j) => (j === i ? +e.target.value : v)))}
                >
                  {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            ))}
          </>
        ) : (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
            Refinement
            <select value={refinement} onChange={(e) => setRefinement(+e.target.value)}>
              {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>R{r}</option>)}
            </select>
          </label>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn primary" onClick={() => onSave({ level, constellation, refinement, talents })}>
          Add to library
        </button>
      </div>
    </div>
  );
}
