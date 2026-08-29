import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'genshin-track-v1';

const defaultState = {
  server: 'Asia',
  goals: [], // { id, type: 'character'|'weapon', key, current:{level,asc,talents:[..]}, target:{...}, done:false }
  inventory: {}, // materialSlug -> count
  resin: { value: 160, updatedAt: Date.now() },
  profile: { name: 'Traveler' },
  owned: {}, // characterKey -> { level, ascension, constellation, talents:[na,skill,burst] }
  ownedWeapons: {}, // weaponKey -> { level, ascension, refinement, location }
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed, resin: { ...defaultState.resin, ...parsed.resin } };
  } catch {
    return defaultState;
  }
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const update = useCallback((fn) => setState((s) => fn(s)), []);

  return (
    <StoreCtx.Provider value={{ state, update, showToast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  return useContext(StoreCtx);
}

// ---- resin regeneration: 1 resin per 8 minutes, cap 200 ----
export const RESIN_CAP = 200;
export const RESIN_MINUTES = 8;

export function currentResin(resin) {
  const elapsedMin = (Date.now() - resin.updatedAt) / 60000;
  const regenerated = Math.floor(elapsedMin / RESIN_MINUTES);
  return Math.min(RESIN_CAP, resin.value + regenerated);
}

export function minutesToFull(resin) {
  const cur = currentResin(resin);
  if (cur >= RESIN_CAP) return 0;
  return (RESIN_CAP - cur) * RESIN_MINUTES;
}

// ---- server day: domains reset at 4 AM server time ----
const SERVER_OFFSETS = { Asia: 8, Europe: 1, America: -5 };

export function serverDay(server) {
  const offset = SERVER_OFFSETS[server] ?? 8;
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const serverTime = new Date(utcMs + offset * 3600000);
  serverTime.setHours(serverTime.getHours() - 4); // 4 AM reset
  return serverTime.toLocaleDateString('en-US', { weekday: 'long' });
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
