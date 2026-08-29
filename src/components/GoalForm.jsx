import React, { useState } from 'react';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import builds from '../data/builds.json';
import { useStore } from '../lib/store.jsx';
import { ascensionToState } from '../lib/good.js';
import { characterNeeds, weaponNeeds, sortMatKeys } from '../lib/calc.js';
import { MatChip } from './shared.jsx';

const CHAR_LEVELS = [1, 20, 40, 50, 60, 70, 80, 90];

export default function GoalForm({ type, itemKey, initial, onSave, onCancel }) {
  const isWeapon = type === 'weapon';
  const item = isWeapon ? weapons[itemKey] : characters[itemKey];
  const maxLvl = isWeapon && item.rarity <= 2 ? 70 : 90;
  const levels = CHAR_LEVELS.filter((l) => l <= maxLvl);
  const { state } = useStore();

  // prefill current from the imported library when available
  const ownedEntry = isWeapon ? state.ownedWeapons?.[itemKey] : state.owned?.[itemKey];
  const libCurrent = ownedEntry
    ? {
        ...ascensionToState(ownedEntry.level, ownedEntry.ascension),
        ...(isWeapon ? {} : { talents: ownedEntry.talents || [1, 1, 1] }),
      }
    : null;

  // recommended talent targets from the build guide (researched priority), not a flat 9/9/9
  const recTalents = !isWeapon ? (builds[itemKey]?.talentTargets || [6, 9, 9]) : undefined;

  const [cur, setCur] = useState(initial?.current || libCurrent || { level: 1, asc: false, talents: [1, 1, 1] });
  const [tgt, setTgt] = useState(
    initial?.target || {
      level: maxLvl,
      asc: false,
      talents: isWeapon
        ? undefined
        : recTalents.map((t, i) => Math.max(t, (libCurrent?.talents || [1, 1, 1])[i])),
    }
  );

  const needs = isWeapon ? weaponNeeds(itemKey, cur, tgt) : characterNeeds(itemKey, cur, tgt);
  const matKeys = sortMatKeys(Object.keys(needs));

  const setTalent = (which, idx, val) => {
    const setter = which === 'cur' ? setCur : setTgt;
    const src = which === 'cur' ? cur : tgt;
    const talents = [...(src.talents || [1, 1, 1])];
    talents[idx] = val;
    setter({ ...src, talents });
  };

  return (
    <div>
      <div className="track-form" style={{ marginBottom: 16 }}>
        <div className="field">
          <label>Current level</label>
          <div className="pair">
            <select value={cur.level} onChange={(e) => setCur({ ...cur, level: +e.target.value })}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {[20, 40, 50, 60, 70, 80].includes(cur.level) && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, textTransform: 'none', margin: 0 }}>
                <input type="checkbox" checked={cur.asc} onChange={(e) => setCur({ ...cur, asc: e.target.checked })} />
                ascended
              </label>
            )}
          </div>
        </div>
        <div className="field">
          <label>Target level</label>
          <div className="pair">
            <select value={tgt.level} onChange={(e) => setTgt({ ...tgt, level: +e.target.value })}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {[20, 40, 50, 60, 70, 80].includes(tgt.level) && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, textTransform: 'none', margin: 0 }}>
                <input type="checkbox" checked={tgt.asc} onChange={(e) => setTgt({ ...tgt, asc: e.target.checked })} />
                ascended
              </label>
            )}
          </div>
        </div>
      </div>

      {!isWeapon && recTalents && (
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 10px' }}>
          Recommended talent targets for {item.name}:{' '}
          <b style={{ color: 'var(--gold2)' }}>
            NA {recTalents[0] <= 1 ? 'as needed' : recTalents[0]} / Skill {recTalents[1] <= 1 ? 'as needed' : recTalents[1]} / Burst {recTalents[2] <= 1 ? 'as needed' : recTalents[2]}
          </b>{' '}
          — from this character's talent priority, pre-filled below. "As needed" talents aren't part
          of the core kit; leave them at 1 unless you have spare books.
        </p>
      )}

      {!isWeapon && (
        <div className="track-form" style={{ marginBottom: 16 }}>
          {['Normal Attack', 'Skill', 'Burst'].map((label, i) => (
            <div className="field" key={label}>
              <label>{label}</label>
              <div className="pair">
                <select value={cur.talents?.[i] ?? 1} onChange={(e) => setTalent('cur', i, +e.target.value)}>
                  {Array.from({ length: 10 }, (_, x) => x + 1).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <span className="arrow">→</span>
                <select value={tgt.talents?.[i] ?? 1} onChange={(e) => setTalent('tgt', i, +e.target.value)}>
                  {Array.from({ length: 10 }, (_, x) => x + 1).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <div className="section-label">Materials this goal needs</div>
        {matKeys.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Nothing — targets aren't above current values yet.</p>
        ) : (
          <div className="mat-row">
            {matKeys.map((mk) => <MatChip key={mk} matKey={mk} count={needs[mk]} />)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button
          className="btn primary"
          onClick={() => onSave({ type, key: itemKey, current: cur, target: tgt, done: false })}
        >
          Save goal
        </button>
      </div>
    </div>
  );
}
