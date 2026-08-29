import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import characters from '../data/characters.json';
import { ElementIcon, ELEMENT_COLORS } from '../components/shared.jsx';

const ELEMENTS = ['Pyro', 'Hydro', 'Electro', 'Cryo', 'Anemo', 'Geo', 'Dendro'];
const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];

export default function Roster() {
  const { state } = useStore();
  const [elem, setElem] = useState(null);
  const [wtype, setWtype] = useState(null);
  const [rarity, setRarity] = useState(null);
  const [q, setQ] = useState('');

  const trackedKeys = new Set(state.goals.filter((g) => g.type === 'character' && !g.done).map((g) => g.key));
  const owned = state.owned || {};
  const hasLibrary = Object.keys(owned).length > 0;
  const [onlyOwned, setOnlyOwned] = useState(false);

  const list = useMemo(() => {
    return Object.values(characters)
      .filter((c) => !elem || c.element === elem)
      .filter((c) => !wtype || c.weaponType === wtype)
      .filter((c) => !rarity || c.rarity === rarity)
      .filter((c) => !onlyOwned || owned[c.key])
      .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
  }, [elem, wtype, rarity, q, onlyOwned, owned]);

  return (
    <div className="page page-wide">
      <h1 className="page-title">Characters</h1>
      <p className="page-sub">{Object.keys(characters).length} characters. Every one has a build card and farming breakdown.</p>

      <div className="filter-bar">
        <input
          type="search" className="search-input" placeholder="Search characters…"
          value={q} onChange={(e) => setQ(e.target.value)}
        />
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
        <span style={{ width: 12 }} />
        {WEAPON_TYPES.map((w) => (
          <span key={w} className={`chip${wtype === w ? ' active' : ''}`} onClick={() => setWtype(wtype === w ? null : w)}>{w}</span>
        ))}
        <span style={{ width: 12 }} />
        {[5, 4].map((r) => (
          <span key={r} className={`chip${rarity === r ? ' active' : ''}`} onClick={() => setRarity(rarity === r ? null : r)}>{'★'.repeat(r)}</span>
        ))}
        {hasLibrary && (
          <>
            <span style={{ width: 12 }} />
            <span
              className={`chip${onlyOwned ? ' active' : ''}`}
              style={onlyOwned ? { color: 'var(--green)', borderColor: 'var(--green)' } : {}}
              onClick={() => setOnlyOwned(!onlyOwned)}
            >
              ✓ Owned only
            </span>
          </>
        )}
      </div>

      <div className="char-grid">
        {list.map((c) => {
          const own = owned[c.key];
          return (
            <Link
              key={c.key}
              to={`/character/${c.key}`}
              className={`char-tile r${c.rarity}`}
              style={hasLibrary ? (own
                ? { borderColor: 'rgba(95,211,154,0.55)' }
                : { opacity: 0.55 }) : {}}
            >
              <img className="portrait" src={c.icon} alt={c.name} loading="lazy" />
              <span className="elem-badge"><ElementIcon element={c.element} size={17} /></span>
              {trackedKeys.has(c.key) ? (
                <span className="tracked-badge">✓ goal</span>
              ) : own ? (
                <span className="tracked-badge" style={{ background: 'var(--green)' }}>Lv {own.level}</span>
              ) : null}
              <div className="cname">{c.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
