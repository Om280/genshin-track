import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, serverDay } from '../lib/store.jsx';
import domains from '../data/domains.json';
import materials from '../data/materials.json';
import characters from '../data/characters.json';

export default function Landing() {
  const { state } = useStore();
  const day = serverDay(state.server);
  const isSunday = day === 'Sunday';

  const talentDomains = domains.filter((d) => d.type === 'talent');
  const todaySeries = talentDomains
    .map((d) => ({ domain: d, series: d.series.filter((s) => isSunday || s.days.includes(day)) }))
    .filter((x) => x.series.length > 0)
    .slice(0, 2);

  const featured = ['raiden-shogun', 'furina', 'neuvillette', 'arlecchino', 'nahida', 'mavuika']
    .map((k) => characters[k])
    .filter(Boolean);

  return (
    <div>
      <div className="hero">
        <h1>
          Stop guessing.<br />
          <span className="gold">Start building right.</span>
        </h1>
        <p className="lead">
          Genshin Track tells you exactly what to farm today and what each of your characters
          still needs — in plain English, no wiki required.
        </p>
        <div className="cta-row">
          <Link to="/tracker" className="btn primary">Start Tracking</Link>
          <Link to="/today" className="btn">See today's farm</Link>
        </div>
        <div className="fine">Completely free, start to finish. Your data stays in your browser.</div>
      </div>

      <div className="page">
        <div className="section-label">Overview · Today is {day} · {state.server} server</div>
        <h2 style={{ marginTop: 0 }}>Live domain rotation</h2>
        {todaySeries.map(({ domain, series }) => (
          <div key={domain.name} className="domain-card">
            <div className="dhead">
              <span className="dname">{domain.name}</span>
              <span className="dregion">{domain.region}</span>
            </div>
            {series.map((s) => (
              <div key={s.name} className="mat-row" style={{ marginBottom: 8 }}>
                {s.items.map((mk) => {
                  const m = materials[mk];
                  return m ? (
                    <div key={mk} className={`mat-chip r${m.rarity}`}>
                      <img src={m.icon} alt={m.name} loading="lazy" />
                      <span>{m.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            ))}
          </div>
        ))}
        <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>
          This is today's rotation for everyone. Once you're tracking, the <Link to="/today" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>Today page</Link> only shows what your characters actually need.
        </p>

        <div id="features" style={{ marginTop: 50 }}>
          <div className="section-label">What you get</div>
          <div className="feature-grid">
            <div className="card feature-card">
              <div className="icon">📅</div>
              <h3>A daily farming calendar</h3>
              <p>Domains rotate daily and reset at 4 AM server time. Genshin Track cross-references the rotation with your goals so you open the app, glance, and go farm.</p>
            </div>
            <div className="card feature-card">
              <div className="icon">🎯</div>
              <h3>Exact material math</h3>
              <p>Set a level, ascension and talent target per character or weapon. Every book, boss drop, gem, specialty, mora and EXP book still owed is computed for you.</p>
            </div>
            <div className="card feature-card">
              <div className="icon">📖</div>
              <h3>Build guides for everyone</h3>
              <p>Every character has an opinionated build card: weapons ranked, artifact sets settled, main stats and talent priorities called — with a link to the full KQM guide.</p>
            </div>
            <div className="card feature-card">
              <div className="icon">📥</div>
              <h3>Genshin Optimizer import</h3>
              <p>Already scanned your account? Import your GOOD-format JSON straight from Genshin Optimizer and your characters and weapons appear with their current levels.</p>
            </div>
            <div className="card feature-card">
              <div className="icon">🧪</div>
              <h3>Resin planning</h3>
              <p>A live resin counter with regeneration, plus one-tap spend buttons for domains, ley lines and bosses so you always know what your 200 resin should buy.</p>
            </div>
            <div className="card feature-card">
              <div className="icon">📦</div>
              <h3>Inventory tracking</h3>
              <p>Log what you own and the tracker subtracts it from what you need. Weekly boss materials roll up across your whole roster too.</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 50 }}>
          <div className="section-label">The roster</div>
          <h2 style={{ marginTop: 0 }}>Find your mains</h2>
          <div className="char-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
            {featured.map((c) => (
              <Link key={c.key} to={`/character/${c.key}`} className={`char-tile r${c.rarity}`}>
                <img className="portrait" src={c.icon} alt={c.name} loading="lazy" />
                <div className="cname">{c.name}</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <Link to="/characters" className="btn">Show the whole roster</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <h2>It's {day}. Your crew is waiting.</h2>
          <Link to="/tracker" className="btn primary">Start Tracking</Link>
        </div>
      </div>
    </div>
  );
}
