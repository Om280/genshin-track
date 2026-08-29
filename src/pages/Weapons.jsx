import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import weapons from '../data/weapons.json';
import characters from '../data/characters.json';
import weaponUsers from '../data/weapon-users.json';

const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];

export default function Weapons() {
  const { state } = useStore();
  const [wtype, setWtype] = useState(null);
  const [rarity, setRarity] = useState(null);
  const [q, setQ] = useState('');

  const trackedKeys = new Set(state.goals.filter((g) => g.type === 'weapon' && !g.done).map((g) => g.key));
  const ownedW = state.ownedWeapons || {};
  const hasLibrary = Object.keys(ownedW).length > 0;

  const list = useMemo(() => {
    return Object.values(weapons)
      .filter((w) => w.rarity >= 3)
      .filter((w) => !wtype || w.weaponType === wtype)
      .filter((w) => !rarity || w.rarity === rarity)
      .filter((w) => !q || w.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
  }, [wtype, rarity, q]);

  return (
    <div className="page page-wide">
      <h1 className="page-title">Weapons</h1>
      <p className="page-sub">{list.length} weapons shown. Track any of them to plan ascension materials.</p>

      <div className="filter-bar">
        <input
          type="search" className="search-input" placeholder="Search weapons…"
          value={q} onChange={(e) => setQ(e.target.value)}
        />
        {WEAPON_TYPES.map((w) => (
          <span key={w} className={`chip${wtype === w ? ' active' : ''}`} onClick={() => setWtype(wtype === w ? null : w)}>{w}</span>
        ))}
        <span style={{ width: 12 }} />
        {[5, 4, 3].map((r) => (
          <span key={r} className={`chip${rarity === r ? ' active' : ''}`} onClick={() => setRarity(rarity === r ? null : r)}>{'★'.repeat(r)}</span>
        ))}
      </div>

      <div className="char-grid">
        {list.map((w) => {
          const own = ownedW[w.key];
          return (
            <Link
              key={w.key}
              to={`/weapon/${w.key}`}
              className={`char-tile r${w.rarity}`}
              style={hasLibrary && own ? { borderColor: 'rgba(95,211,154,0.55)' } : {}}
            >
              <img className="portrait" src={w.icon} alt={w.name} loading="lazy" style={{ objectFit: 'contain', padding: 8 }} />
              {trackedKeys.has(w.key) ? (
                <span className="tracked-badge">✓ goal</span>
              ) : own ? (
                <span className="tracked-badge" style={{ background: 'var(--green)' }}>Lv {own.level}{own.refinement > 1 ? ` R${own.refinement}` : ''}</span>
              ) : null}
              <div className="cname">{w.name}</div>
              {(weaponUsers[w.key] || []).length > 0 && (
                <div className="used-by" style={{ display: 'flex', justifyContent: 'center', gap: 2, padding: '0 4px 7px' }}>
                  {(weaponUsers[w.key] || []).slice(0, 4).map((u) =>
                    characters[u.char] ? (
                      <img
                        key={u.char}
                        src={characters[u.char].icon}
                        alt={characters[u.char].name}
                        title={`Good for ${characters[u.char].name}`}
                        loading="lazy"
                        style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg2)' }}
                      />
                    ) : null
                  )}
                  {(weaponUsers[w.key] || []).length > 4 && (
                    <span style={{ fontSize: 10.5, color: 'var(--muted)', alignSelf: 'center' }}>+{(weaponUsers[w.key] || []).length - 4}</span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
