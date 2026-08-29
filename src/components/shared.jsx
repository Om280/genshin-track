import React from 'react';
import materials from '../data/materials.json';
import { fmtCount } from '../lib/calc.js';

export const ELEMENT_COLORS = {
  Pyro: 'var(--pyro)', Hydro: 'var(--hydro)', Electro: 'var(--electro)',
  Cryo: 'var(--cryo)', Anemo: 'var(--anemo)', Geo: 'var(--geo)', Dendro: 'var(--dendro)',
};

// real in-game element icons
const ELEM_FILE = {
  Pyro: 'Fire', Hydro: 'Water', Electro: 'Electric', Cryo: 'Ice',
  Anemo: 'Wind', Geo: 'Rock', Dendro: 'Grass',
};
export const elementIconUrl = (element) =>
  ELEM_FILE[element] ? `https://gi.yatta.moe/assets/UI/UI_Buff_Element_${ELEM_FILE[element]}.png` : null;

// original resin item icon
export const RESIN_ICON = 'https://gi.yatta.moe/assets/UI/UI_ItemIcon_106.png';

export function ElementIcon({ element, size = 20 }) {
  const url = elementIconUrl(element);
  if (!url) return null;
  return (
    <img
      src={url} alt={element} title={element}
      style={{ width: size, height: size, verticalAlign: 'middle' }}
      loading="lazy"
    />
  );
}

export function ElementBadge({ element, size = 16 }) {
  return (
    <span style={{ color: ELEMENT_COLORS[element], fontWeight: 800, fontSize: size - 2, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <ElementIcon element={element} size={size + 2} />
      {element}
    </span>
  );
}

export function ResinIcon({ size = 18 }) {
  return (
    <img
      src={RESIN_ICON} alt="Original Resin" title="Original Resin"
      style={{ width: size, height: size, verticalAlign: 'middle' }}
      loading="lazy"
    />
  );
}

export function Stars({ n }) {
  return <span className="stars">{'★'.repeat(n)}</span>;
}

export function MatChip({ matKey, count, have, showHave }) {
  const m = materials[matKey];
  if (!m) return null;
  const done = showHave && have >= count;
  return (
    <div className={`mat-chip r${m.rarity || 1}${done ? ' done' : ''}`} title={`${m.name}${m.domain ? ` — ${m.domain}` : ''}${m.days ? ` (${m.days.map((d) => d.slice(0, 3)).join(', ')})` : ''}`}>
      {m.icon ? <img src={m.icon} alt={m.name} loading="lazy" /> : <span style={{ width: 30 }} />}
      <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
      <span className="count">
        {showHave ? `${fmtCount(Math.min(have, count))}/${fmtCount(count)}` : fmtCount(count)}
      </span>
    </div>
  );
}

export function HoverCard({ title, sub, body, rows, children }) {
  return (
    <span className="hover-wrap">
      {children}
      <span className="hover-card">
        <span className="hc-title" style={{ display: 'block' }}>{title}</span>
        {sub && <span className="hc-sub" style={{ display: 'block' }}>{sub}</span>}
        {body && <span className="hc-body" style={{ display: 'block', whiteSpace: 'pre-line' }}>{body}</span>}
        {rows && rows.length > 0 && (
          <span className="hc-row">
            {rows.map((r, i) => (
              <span key={i} className="tag" style={r.gold ? { color: 'var(--gold2)', borderColor: 'rgba(232,180,95,0.4)' } : {}}>
                {r.label}
              </span>
            ))}
          </span>
        )}
      </span>
    </span>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
