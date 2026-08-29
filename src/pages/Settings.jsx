import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import { parseGOOD, ascensionToState } from '../lib/good.js';

export default function Settings() {
  const { state, update, showToast } = useStore();
  const [preview, setPreview] = useState(null);
  const [over, setOver] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseGOOD(reader.result);
      if (result.error) {
        showToast(result.error);
        setPreview(null);
        return;
      }
      setPreview(result);
    };
    reader.readAsText(file);
  };

  const applyImport = (mode) => {
    if (!preview) return;
    let charCount = 0;
    let wepCount = 0;
    update((s) => {
      const owned = mode === 'replace' ? {} : { ...(s.owned || {}) };
      const ownedWeapons = mode === 'replace' ? {} : { ...(s.ownedWeapons || {}) };

      for (const c of preview.characters) {
        owned[c.key] = {
          level: c.level,
          ascension: c.ascension,
          constellation: c.constellation,
          talents: c.talents,
        };
        charCount++;
      }
      for (const w of preview.weapons) {
        if ((weapons[w.key]?.rarity || 0) < 4) continue; // skip 1-3★ fodder
        ownedWeapons[w.key] = {
          level: w.level,
          ascension: w.ascension,
          refinement: w.refinement,
          location: w.location || null,
        };
        wepCount++;
      }
      return { ...s, owned, ownedWeapons };
    });
    showToast(`Imported ${charCount} characters and ${wepCount} weapons to your library`);
    setPreview(null);
    navigate('/my-characters');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'genshin-track-backup.json';
    a.click();
  };

  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.goals) throw new Error('bad');
        update(() => data);
        showToast('Backup restored');
      } catch {
        showToast('Not a valid Genshin Track backup file');
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm('Delete ALL your goals, library, inventory and settings? This cannot be undone.')) {
      update((s) => ({ ...s, goals: [], inventory: {}, owned: {}, ownedWeapons: {} }));
      showToast('All data cleared');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Import & settings</h1>
      <p className="page-sub">Bring your account in from Genshin Optimizer, back up your tracker, and set your server.</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-label">Genshin Optimizer import (GOOD format)</div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          In <a href="https://frzyc.github.io/genshin-optimizer/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Genshin Optimizer</a>:{' '}
          <b>Settings → Database → Export GOOD</b> (or download the .json). Drop that file here — your
          characters and weapons land in your <b>My Characters</b> library with their current levels,
          ascensions and talents — nothing is added to My Goals until you choose.
        </p>
        <div
          className={`drop-zone${over ? ' over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div style={{ fontSize: 30 }}>📥</div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>Drop your GOOD .json here or click to browse</div>
          <div style={{ fontSize: 13 }}>Only character & weapon levels are read. Artifacts stay in GO where they belong.</div>
        </div>
        <input
          ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />

        {preview && (
          <div style={{ marginTop: 16 }}>
            <div className="note-block" style={{ marginBottom: 12 }}>
              Found <b>{preview.characters.length} characters</b> and{' '}
              <b>{preview.weapons.length} weapons</b> (source: {preview.source}).
              {preview.unknownChars.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 13 }}>Unrecognized characters skipped: {preview.unknownChars.join(', ')}</div>
              )}
              {preview.unknownWeapons.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 13 }}>Unrecognized weapons skipped: {preview.unknownWeapons.join(', ')}</div>
              )}
              <div style={{ marginTop: 8, fontSize: 13 }}>
                Everything lands in your <b>My Characters</b> library first — from there you choose
                who to build and send to My Goals. Weapons below 4★ are skipped.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {preview.characters.slice(0, 14).map((c) => (
                <img
                  key={c.key} src={characters[c.key]?.icon} alt={characters[c.key]?.name}
                  title={`${characters[c.key]?.name} Lv${c.level}`}
                  style={{ width: 42, height: 42, borderRadius: 10, background: '#241f1a' }}
                />
              ))}
              {preview.characters.length > 14 && (
                <span style={{ alignSelf: 'center', color: 'var(--muted)' }}>+{preview.characters.length - 14} more</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn primary" onClick={() => applyImport('merge')}>Merge into my library</button>
              <button className="btn" onClick={() => applyImport('replace')}>Replace my library</button>
              <button className="btn" onClick={() => setPreview(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-label">Game server</div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Domains reset at 4 AM server time — this decides what "today" means on the farming calendar.
        </p>
        <div className="pill-toggle">
          {['Asia', 'Europe', 'America'].map((srv) => (
            <button
              key={srv}
              className={state.server === srv ? 'active' : ''}
              onClick={() => { update((s) => ({ ...s, server: srv })); showToast(`Server set to ${srv}`); }}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-label">Backup & restore</div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Everything lives in your browser. Export a backup before clearing site data or to move to another device.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={exportData}>⬇ Export backup</button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            ⬆ Restore backup
            <input
              type="file" accept=".json" style={{ display: 'none' }}
              onChange={(e) => e.target.files[0] && importBackup(e.target.files[0])}
            />
          </label>
          <button className="btn danger" onClick={clearAll}>Clear all data</button>
        </div>
      </div>

      <div className="card">
        <div className="section-label">About</div>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
          Genshin Track is a free fan-made build planner and farming calendar. Build recommendations are
          adapted from the paimon.moe community dataset (MIT license) plus original summaries in the same
          spirit as KQM guides; each character page links to the full KQM write-up. Game data comes from the
          open-source genshin-db project. Not affiliated with HoYoverse.
        </p>
      </div>
    </div>
  );
}
