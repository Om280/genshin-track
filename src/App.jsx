import React from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { useStore, currentResin } from './lib/store.jsx';
import Landing from './pages/Landing.jsx';
import Today from './pages/Today.jsx';
import Tracker from './pages/Tracker.jsx';
import MyCharacters from './pages/MyCharacters.jsx';
import { ResinIcon } from './components/shared.jsx';
import Roster from './pages/Roster.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import Weapons from './pages/Weapons.jsx';
import WeaponPage from './pages/WeaponPage.jsx';
import Summary from './pages/Summary.jsx';
import Resin from './pages/Resin.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  const { state } = useStore();
  const resin = currentResin(state.resin);
  const loc = useLocation();

  return (
    <div className="app-shell">
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <span className="logo-mark">✦</span>
          Genshin&nbsp;Track
        </Link>
        <div className="nav-links">
          <NavLink to="/today" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Today</NavLink>
          <NavLink to="/tracker" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>My Goals</NavLink>
          <NavLink to="/my-characters" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>My Characters</NavLink>
          <NavLink to="/summary" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Materials</NavLink>
          <NavLink to="/characters" className={({ isActive }) => `nav-link${isActive || loc.pathname.startsWith('/character/') ? ' active' : ''}`}>Characters</NavLink>
          <NavLink to="/weapons" className={({ isActive }) => `nav-link${isActive || loc.pathname.startsWith('/weapon/') ? ' active' : ''}`}>Weapons</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Import / Settings</NavLink>
        </div>
        <div className="nav-right">
          <Link to="/resin" className="resin-pill" title="Resin tracker">
            <ResinIcon size={18} />
            {resin}<span style={{ color: 'var(--muted)' }}>/200</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/today" element={<Today />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/my-characters" element={<MyCharacters />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/characters" element={<Roster />} />
        <Route path="/character/:key" element={<CharacterPage />} />
        <Route path="/weapons" element={<Weapons />} />
        <Route path="/weapon/:key" element={<WeaponPage />} />
        <Route path="/resin" element={<Resin />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <footer className="footer">
        Genshin Track — a fan-made planner. Not affiliated with HoYoverse. Game data via{' '}
        <a href="https://github.com/theBowja/genshin-db" target="_blank" rel="noreferrer">genshin-db</a>; build data adapted from{' '}
        <a href="https://paimon.moe" target="_blank" rel="noreferrer">paimon.moe</a> (MIT). Full theorycrafting guides at{' '}
        <a href="https://keqingmains.com" target="_blank" rel="noreferrer">KQM</a>.
      </footer>
    </div>
  );
}
