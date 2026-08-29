import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import characters from '../data/characters.json';
import weapons from '../data/weapons.json';
import artifacts from '../data/artifacts.json';
import builds from '../data/builds.json';
import materials from '../data/materials.json';
import { characterNeeds, sortMatKeys } from '../lib/calc.js';
import { MatChip, Stars, ElementBadge, ElementIcon, Modal, HoverCard } from '../components/shared.jsx';
import GoalForm from '../components/GoalForm.jsx';

export function talentLabel(v) {
  return v <= 1 ? 'as needed' : String(v);
}

export default function CharacterPage() {
  const { key } = useParams();
  const c = characters[key];
  const build = builds[key];
  const { state, update, showToast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const roleNames = build ? Object.keys(build.roles) : [];
  const defaultRole = build
    ? roleNames.find((r) => build.roles[r].recommended) || roleNames[0]
    : null;
  const [role, setRole] = useState(defaultRole);
  const activeRole = build?.roles[role] || build?.roles[defaultRole];

  const existing = state.goals.find((g) => g.type === 'character' && g.key === key && !g.done);
  const owned = state.owned?.[key] || null;
  const talentTargets = build?.talentTargets || [6, 9, 9];



  if (!c) return <div className="page"><div className="empty-state">Character not found.</div></div>;

  const saveGoal = (goal) => {
    update((s) => {
      const goals = existing
        ? s.goals.map((g) => (g.id === existing.id ? { ...goal, id: existing.id } : g))
        : [...s.goals, { ...goal, id: crypto.randomUUID() }];
      // a tracked character automatically joins the My Characters library
      const owned = s.owned?.[key]
        ? s.owned
        : { ...(s.owned || {}), [key]: { level: goal.current?.level || 1, ascension: 0, constellation: 0, talents: goal.current?.talents || [1, 1, 1] } };
      return { ...s, goals, owned };
    });
    showToast(existing ? `${c.name} goal updated` : `${c.name} added to your tracker`);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="char-hero">
        <div className="splash-box">
          <img src={c.splash || c.icon} alt={c.name} />
        </div>
        <div className="info">
          <h1>{c.name}</h1>
          {c.title && <div className="title-line">"{c.title}"</div>}
          <div className="elem-row">
            <Stars n={c.rarity} />
            <ElementBadge element={c.element} />
            <span className="tag">{c.weaponType}</span>
            {c.region && <span className="tag">{c.region}</span>}
            {c.substat && <span className="tag gold">{c.substat}</span>}
            {owned ? (
              <span className="tag" style={{ color: 'var(--green)', borderColor: 'rgba(95,211,154,0.5)' }}>
                ✓ Owned · Lv {owned.level}{owned.constellation > 0 ? ` · C${owned.constellation}` : ''}
              </span>
            ) : (
              Object.keys(state.owned || {}).length > 0 && (
                <span className="tag" style={{ color: 'var(--muted2)' }}>Not owned</span>
              )
            )}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{c.description}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            <button className="btn primary" onClick={() => setShowForm(true)}>
              {existing ? 'Edit my goal' : '+ Track this character'}
            </button>
            <a
              className="btn"
              href={`https://keqingmains.com/?s=${encodeURIComponent(c.name)}`}
              target="_blank" rel="noreferrer"
              title="Find the full KQM theorycrafting guide"
            >
              Full KQM guide ↗
            </a>
            {existing && (
              <button className="btn" onClick={() => navigate('/tracker')}>View in tracker</button>
            )}
          </div>
          {existing && (
            <div style={{ marginTop: 12 }} className="tag gold">
              Tracking: Lv {existing.current.level} → {existing.target.level} · Talents{' '}
              {existing.current.talents.join('/')} → {existing.target.talents.join('/')}
            </div>
          )}
        </div>
      </div>

      {build && roleNames.length > 0 && (
        <>
          {activeRole?.provisional && (
            <div className="note-block" style={{ marginBottom: 16 }}>
              <b>Provisional build</b> — {c.name} is new and community numbers are still settling.
              These are sensible defaults;{' '}
              <a href={`https://keqingmains.com/?s=${encodeURIComponent(c.name)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold2)', textDecoration: 'underline' }}>
                check KQM
              </a>{' '}
              as theorycrafting firms up.
            </div>
          )}
          {roleNames.length > 1 && (
            <div className="role-tabs">
              {roleNames.map((r) => (
                <span key={r} className={`chip${(role || defaultRole) === r ? ' active' : ''}`} onClick={() => setRole(r)}>
                  {r}{build.roles[r].recommended ? ' ★' : ''}
                </span>
              ))}
            </div>
          )}

          {(build.playstyle || build.downsides) && (
            <div className="build-section" style={{ marginBottom: 18 }}>
              <h2>Playstyle & downsides</h2>
              {build.playstyle && (
                <div className="note-block" style={{ marginBottom: 10 }}>
                  <b>🎮 How they play:</b> {build.playstyle}
                </div>
              )}
              {build.downsides && (
                <div className="note-block" style={{ borderColor: 'rgba(255,120,120,0.35)' }}>
                  <b style={{ color: 'var(--red, #ff7878)' }}>⚠ Downsides:</b> {build.downsides}
                </div>
              )}
            </div>
          )}

          {activeRole && <BuildCard role={activeRole} roleName={role || defaultRole} talentTargets={talentTargets} />}
        </>
      )}

      {(build?.partners?.length > 0 || build?.teams?.length > 0) && (
        <div className="build-section">
          <h2>Teams & best partners</h2>
          <OwnedTeamSummary build={build} charKey={key} owned={state.owned || {}} />
          {build.partners?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div className="section-label" style={{ fontSize: 11 }}>Best paired with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {build.partners.map(([pk, why]) => {
                  const p = characters[pk];
                  if (!p) return null;
                  const ownedP = state.owned?.[pk];
                  const hasLibrary = Object.keys(state.owned || {}).length > 0;
                  return (
                    <Link
                      key={pk}
                      to={`/character/${pk}`}
                      className="weapon-item"
                      style={{
                        maxWidth: 280,
                        borderColor: ownedP ? 'rgba(95,211,154,0.45)' : undefined,
                        opacity: hasLibrary && !ownedP ? 0.65 : 1,
                      }}
                      title={hasLibrary ? (ownedP ? 'You own this character' : 'Not in your library') : undefined}
                    >
                      <img src={p.icon} alt={p.name} loading="lazy" style={{ borderRadius: '50%' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="wname" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <ElementIcon element={p.element} size={14} />
                          {p.name}
                          {ownedP && <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span>}
                        </div>
                        <div className="wsub">{why}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {build.teams?.length > 0 && (
            <div className="artifact-list">
              {build.teams.map((t) => {
                const hasLibrary = Object.keys(state.owned || {}).length > 0;
                const ownedCount = t.members.filter((mk) => state.owned?.[mk]).length;
                return (
                  <div key={t.name} className="artifact-item" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {t.members.map((mk) => {
                        const m = characters[mk];
                        if (!m) return null;
                        const own = state.owned?.[mk];
                        return (
                          <Link key={mk} to={`/character/${mk}`} title={`${m.name}${hasLibrary ? (own ? ' — owned ✓' : ' — not owned') : ''}`}>
                            <img
                              src={m.icon} alt={m.name} loading="lazy"
                              style={{
                                width: 44, height: 44, borderRadius: 10,
                                border: hasLibrary ? `2px solid ${own ? 'var(--green)' : 'var(--border2)'}` : '2px solid transparent',
                                opacity: hasLibrary && !own ? 0.5 : 1,
                                background: 'linear-gradient(160deg,#3f3730,#241f1a)',
                              }}
                            />
                          </Link>
                        );
                      })}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {t.name}
                        {hasLibrary && (
                          <span className="tag" style={{ marginLeft: 8, color: ownedCount === 4 ? 'var(--green)' : 'var(--muted)' }}>
                            {ownedCount}/4 owned
                          </span>
                        )}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {c.cons && (
        <div className="build-section">
          <h2>Constellations{c.rarity === 4 ? ' — key cons for 4★' : ' — early value (C1/C2)'}</h2>
          {build?.consNote && (
            <div className="note-block" style={{ marginBottom: 12 }}>
              <b>Verdict:</b> {build.consNote}
            </div>
          )}
          <div className="artifact-list">
            {c.cons.map((con, i) => {
              const isKey = build?.consBest?.includes(i + 1);
              const show = c.rarity === 4 || i < 2 || isKey;
              if (!show) return null;
              const ownedHas = owned && owned.constellation >= i + 1;
              return (
                <div
                  key={i}
                  className="artifact-item"
                  style={{
                    alignItems: 'flex-start',
                    borderColor: isKey ? 'rgba(232,180,95,0.5)' : undefined,
                  }}
                >
                  <span
                    className={`tag${isKey ? ' gold' : ''}`}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    C{i + 1}{ownedHas ? ' ✓' : ''}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {con.name} {isKey && <span style={{ color: 'var(--gold2)', fontSize: 12 }}>★ key con</span>}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>{con.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {c.rarity === 5 && (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              Showing C1–C2 {build?.consBest?.some((n) => n > 2) ? 'plus other key cons ' : ''}for this 5★ —
              deeper constellations are luxury for most players.
            </p>
          )}
        </div>
      )}

      {c.talents && (
        <div className="build-section">
          <h2>Talents</h2>
          <div className="artifact-list">
            {c.talents.map((t, i) => (
              <div key={i} className="artifact-item">
                <span className="tag gold" style={{ flexShrink: 0 }}>{['NA', 'Skill', 'Burst'][i]}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FarmingMaterials charKey={key} goal={existing} talentTargets={talentTargets} />

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h2>{existing ? 'Edit goal' : 'Track'} — {c.name}</h2>
          <GoalForm
            type="character"
            itemKey={key}
            initial={existing}
            onSave={saveGoal}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function BuildCard({ role, roleName, talentTargets }) {
  return (
    <>
      <div className="build-section">
        <h2>Weapons — {roleName}</h2>
        <div className="weapon-list">
          {role.weapons.map((w, i) => {
            const wd = weapons[w.key];
            if (!wd) return null;
            return (
              <HoverCard
                key={i}
                title={wd.name}
                sub={`${'★'.repeat(wd.rarity)} ${wd.weaponType} · ${wd.mainStat || '—'} · Base ATK ${wd.baseAtk}`}
                body={wd.effect ? `${wd.effectName ? wd.effectName + ': ' : ''}${wd.effect.slice(0, 220)}${wd.effect.length > 220 ? '…' : ''}` : null}
                rows={[{ label: `Obtain: ${wd.source || 'Wish'}`, gold: true }]}
              >
                <Link to={`/weapon/${w.key}`} className={`weapon-item r${wd.rarity}`}>
                  <img src={wd.icon} alt={wd.name} loading="lazy" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="wname">{wd.name}</div>
                    <div className="wsub">{'★'.repeat(wd.rarity)} · {wd.mainStat || '—'}{w.refine ? ` · R${w.refine[0]}` : ''} · {wd.source || ''}</div>
                  </div>
                  {i === 0 && <span className="rank-badge">BiS</span>}
                </Link>
              </HoverCard>
            );
          })}
        </div>
      </div>

      <div className="two-col">
        <div className="build-section">
          <h2>Artifacts</h2>
          <div className="artifact-list">
            {role.artifacts.slice(0, 6).map((set, i) => (
              <div key={i} className="artifact-item">
                {set.map((a, j) =>
                  a.key && artifacts[a.key] ? (
                    <HoverCard
                      key={j}
                      title={artifacts[a.key].name}
                      sub={`${'★'.repeat(artifacts[a.key].rarity)}${artifacts[a.key].domain ? ` · ${artifacts[a.key].domain}` : ''}`}
                      body={truncate(
                        set.length === 1
                          ? `2pc: ${artifacts[a.key].bonus2}\n4pc: ${artifacts[a.key].bonus4}`
                          : `2pc: ${artifacts[a.key].bonus2}`,
                        300
                      )}
                      rows={[
                        artifacts[a.key].domain
                          ? { label: `Farm: ${artifacts[a.key].domain}`, gold: true }
                          : { label: 'Farm: see world sources' },
                        { label: artifacts[a.key].strongbox ? '✓ Strongbox available' : 'Not in Strongbox' },
                        ...(set.length === 1 && artifacts[a.key].critInfo
                          ? [{ label: `⚠ Grants +${artifacts[a.key].critInfo.critMax}% CRIT Rate ${artifacts[a.key].critInfo.when}`, gold: true }]
                          : []),
                      ]}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'help' }}>
                        <img src={artifacts[a.key].icon} alt={artifacts[a.key].name} loading="lazy" style={{ width: 40, height: 40, borderRadius: 9, background: 'linear-gradient(160deg,#3f3730,#241f1a)' }} />
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>
                          {artifacts[a.key].name} {set.length === 1 ? '(4pc)' : '(2pc)'}
                          {artifacts[a.key].strongbox && <span title="Strongbox available" style={{ color: 'var(--green)', fontSize: 11, marginLeft: 6 }}>▣ strongbox</span>}
                        </span>
                      </span>
                    </HoverCard>
                  ) : (
                    <div key={j} style={{ flex: 1, fontWeight: 700, fontSize: 13.5, color: 'var(--muted)' }}>
                      {a.label} {set.length === 1 ? '' : '(2pc)'}
                    </div>
                  )
                )}
                {i === 0 && <span className="rank-badge">Best</span>}
              </div>
            ))}
          </div>
          {(() => {
            // crit-overcap advisory when a recommended 4pc set grants CRIT Rate
            const critSet = role.artifacts
              .slice(0, 6)
              .flatMap((set) => (set.length === 1 && set[0].key && artifacts[set[0].key]?.critInfo ? [artifacts[set[0].key]] : []))[0];
            if (!critSet) return null;
            return (
              <div className="note-block" style={{ marginTop: 12, fontSize: 13 }}>
                <b>⚠ CRIT Rate overcap warning:</b> 4pc <b>{critSet.name}</b> grants up to{' '}
                <b>+{critSet.critInfo.critMax}% CRIT Rate</b> {critSet.critInfo.when}. Build your sheet crit
                accordingly — aim for roughly <b>{critSet.critInfo.targetCR}</b> so the buffed total lands near
                100% instead of wasting substats past the cap.
              </div>
            );
          })()}
        </div>

        <div className="build-section">
          <h2>Main stats & priorities</h2>
          <table className="stat-table">
            <tbody>
              {role.mainStats && (
                <>
                  <tr><td>Sands</td><td>{[].concat(role.mainStats.sands || []).join(' / ')}</td></tr>
                  <tr><td>Goblet</td><td>{[].concat(role.mainStats.goblet || []).join(' / ')}</td></tr>
                  <tr><td>Circlet</td><td>{[].concat(role.mainStats.circlet || []).join(' / ')}</td></tr>
                </>
              )}
              <tr><td>Substats</td><td>{role.subStats.join(' > ')}</td></tr>
              <tr><td>Talents</td><td>{role.talent.join(' > ')}</td></tr>
              {talentTargets && (
                <tr>
                  <td>Targets</td>
                  <td>
                    <span className="tag gold" style={{ marginRight: 6 }}>NA {talentLabel(talentTargets[0])}</span>
                    <span className="tag gold" style={{ marginRight: 6 }}>Skill {talentLabel(talentTargets[1])}</span>
                    <span className="tag gold">Burst {talentLabel(talentTargets[2])}</span>
                    <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
                      Stopping points derived from this character's talent priority. "As needed" means the
                      talent isn't part of their core kit — leave it low unless you have spare books.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(role.note || role.tip) && (
        <div className="build-section">
          <h2>Notes</h2>
          {role.tip && (
            <div className="note-block" style={{ marginBottom: 10 }}>
              <b>Rotation tip:</b> <span dangerouslySetInnerHTML={{ __html: sanitize(role.tip) }} />
            </div>
          )}
          {role.note && (
            <div className="note-block" dangerouslySetInnerHTML={{ __html: sanitize(role.note) }} />
          )}
        </div>
      )}
    </>
  );
}

function OwnedTeamSummary({ build, charKey, owned }) {
  const hasLibrary = Object.keys(owned).length > 0;
  if (!hasLibrary) {
    return (
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 14px' }}>
        Import or add your characters in <Link to="/my-characters" style={{ color: 'var(--gold2)' }}>My Characters</Link> to
        see which of these teams you can already field — and who you'd need to pull.
      </p>
    );
  }

  // gather every unique teammate across all teams, split by owned / missing
  const teammates = new Set();
  for (const t of build.teams || []) for (const mk of t.members) if (mk !== charKey) teammates.add(mk);
  for (const [pk] of build.partners || []) teammates.add(pk);
  const missing = [...teammates].filter((mk) => !owned[mk] && characters[mk]);
  const ownedList = [...teammates].filter((mk) => owned[mk] && characters[mk]);

  // which missing character unlocks the most teams?
  const unlockCount = {};
  for (const mk of missing) {
    unlockCount[mk] = (build.teams || []).filter(
      (t) => t.members.includes(mk) && t.members.every((m) => m === charKey || m === mk || owned[m])
    ).length;
  }
  const topPulls = missing
    .map((mk) => [mk, unlockCount[mk]])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const readyTeams = (build.teams || []).filter((t) => t.members.every((m) => m === charKey || owned[m])).length;

  return (
    <div
      style={{
        marginBottom: 16, padding: '10px 14px', borderRadius: 10, fontSize: 13.5,
        background: 'rgba(95,211,154,0.06)', border: '1px solid rgba(95,211,154,0.22)',
      }}
    >
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <span>
          <b style={{ color: readyTeams > 0 ? 'var(--green)' : 'var(--muted)' }}>{readyTeams}</b> of {build.teams?.length || 0} teams
          ready with your roster
        </span>
        <span style={{ color: 'var(--muted)' }}>
          You own {ownedList.length}/{teammates.size} of the recommended teammates
        </span>
      </div>
      {topPulls.length > 0 && topPulls.some(([, n]) => n > 0) && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>Best next pull{topPulls.filter(([, n]) => n > 0).length > 1 ? 's' : ''}:</span>
          {topPulls.filter(([, n]) => n > 0).map(([mk, n]) => (
            <Link key={mk} to={`/character/${mk}`} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <img src={characters[mk].icon} alt={characters[mk].name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
              {characters[mk].name}
              <span style={{ color: 'var(--gold2)' }}>unlocks {n} team{n > 1 ? 's' : ''}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const EXP_LEYLINE_YIELD = 122500; // AR55+/WL8 Blossom of Revelation, char EXP per 20 resin
const MORA_LEYLINE_YIELD = 60000; // WL6+ Blossom of Wealth, Mora per 20 resin
const HEROS_WIT_EXP = 20000;

function FarmingMaterials({ charKey, goal, talentTargets }) {
  const [split, setSplit] = useState('categorized'); // categorized | all
  // scope: 'goal' (your tracked goal), 'build' (guide targets from current), 'max' (full 1→90 10/10/10)
  const [scope, setScope] = useState(goal ? 'goal' : 'max');

  const buildTgt = useMemo(() => {
    const tt = talentTargets || [9, 9, 9];
    return { level: 90, asc: false, talents: tt.map((v) => Math.max(1, Math.min(10, v))) };
  }, [talentTargets]);

  const { from, to, scopeLabel } = useMemo(() => {
    if (scope === 'goal' && goal) {
      return {
        from: goal.current,
        to: goal.target,
        scopeLabel: `your goal (Lv ${goal.current.level} → ${goal.target.level}, talents ${goal.current.talents.join('/')} → ${goal.target.talents.join('/')})`,
      };
    }
    if (scope === 'build' && goal) {
      return {
        from: goal.current,
        to: buildTgt,
        scopeLabel: `guide targets from your current progress (Lv ${goal.current.level} → 90, talents → ${buildTgt.talents.join('/')})`,
      };
    }
    if (scope === 'build') {
      return {
        from: { level: 1, asc: false, talents: [1, 1, 1] },
        to: buildTgt,
        scopeLabel: `guide targets (Lv 1 → 90, talents → ${buildTgt.talents.join('/')})`,
      };
    }
    return {
      from: { level: 1, asc: false, talents: [1, 1, 1] },
      to: { level: 90, asc: false, talents: [10, 10, 10] },
      scopeLabel: 'full build (Lv 1 → 90, talents 10/10/10)',
    };
  }, [scope, goal, buildTgt]);

  // separate need computations so categories are exact
  const ascOnly = useMemo(
    () => characterNeeds(charKey, { level: from.level, asc: from.asc, talents: [1, 1, 1] }, { level: to.level, asc: to.asc, talents: [1, 1, 1] }),
    [charKey, from, to]
  );
  const talOnly = useMemo(
    () => characterNeeds(charKey, { level: to.level, asc: to.asc, talents: from.talents }, { level: to.level, asc: to.asc, talents: to.talents }),
    [charKey, from, to]
  );

  const isExp = (mk) => mk === 'heros-wit';
  const isMora = (mk) => mk === 'mora';

  const talentMats = sortMatKeys(Object.keys(talOnly).filter((mk) => !isMora(mk)));
  const ascMats = sortMatKeys(Object.keys(ascOnly).filter((mk) => !isMora(mk) && !isExp(mk)));
  const expBooks = Object.keys(ascOnly).filter(isExp);
  const totalMora = (ascOnly['mora'] || 0) + (talOnly['mora'] || 0);

  const totalExp = (ascOnly['heros-wit'] || 0) * HEROS_WIT_EXP;
  const expLeylines = Math.ceil(totalExp / EXP_LEYLINE_YIELD);
  const moraLeylines = Math.ceil(totalMora / MORA_LEYLINE_YIELD);

  const CATS = [
    {
      label: `Talents (${from.talents.join('/')} → ${to.talents.join('/')})`,
      keys: talentMats,
      needs: talOnly,
      hint: 'Books rotate by weekday; weekly boss mats cap at 3 discounted runs/week.',
    },
    {
      label: `Ascension (Lv ${from.level} → ${to.level})`,
      keys: ascMats,
      needs: ascOnly,
      hint: 'Gems and boss drops come from world bosses (40 resin); specialties are free overworld pickups.',
    },
    {
      label: 'EXP',
      keys: expBooks,
      needs: ascOnly,
      hint:
        expLeylines > 0
          ? `≈ ${expLeylines} EXP ley line${expLeylines === 1 ? '' : 's'} (Blossom of Revelation, ~122.5k EXP / 20 resin each = ${(expLeylines * 20).toLocaleString()} resin) if farmed directly — events and chests cover a lot of it.`
          : 'No EXP needed for this range.',
    },
  ];

  return (
    <div className="build-section">
      <h2>Farming materials</h2>
      <div className="pill-toggle" style={{ marginBottom: 10 }}>
        {goal && (
          <button className={scope === 'goal' ? 'active' : ''} onClick={() => setScope('goal')}>My goal</button>
        )}
        <button className={scope === 'build' ? 'active' : ''} onClick={() => setScope('build')}>Guide targets</button>
        <button className={scope === 'max' ? 'active' : ''} onClick={() => setScope('max')}>Full build</button>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 12px' }}>
        Showing needs for {scopeLabel}.
        {!goal && ' Track this character to compute costs from your exact current progress.'}
      </p>
      <div className="pill-toggle" style={{ marginBottom: 14 }}>
        <button className={split === 'categorized' ? 'active' : ''} onClick={() => setSplit('categorized')}>By category</button>
        <button className={split === 'all' ? 'active' : ''} onClick={() => setSplit('all')}>All together</button>
      </div>

      {split === 'categorized' ? (
        <>
          {CATS.map((cat) =>
            cat.keys.length > 0 ? (
              <div key={cat.label} style={{ marginBottom: 16 }}>
                <div className="section-label" style={{ fontSize: 11 }}>{cat.label}</div>
                <div className="mat-row">
                  {cat.keys.map((mk) => (
                    <MatChip key={mk} matKey={mk} count={cat.needs[mk]} />
                  ))}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '6px 0 0' }}>{cat.hint}</p>
              </div>
            ) : null
          )}
          <div style={{ marginBottom: 6 }}>
            <div className="section-label" style={{ fontSize: 11 }}>Mora</div>
            <div className="mat-row">
              <MatChip matKey="mora" count={totalMora} />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '6px 0 0' }}>
              {totalMora > 0
                ? `≈ ${moraLeylines} Mora ley line${moraLeylines === 1 ? '' : 's'} (Blossom of Wealth, 60k / 20 resin each = ${(moraLeylines * 20).toLocaleString()} resin) — covers leveling, ascensions and talent ups.`
                : 'No Mora needed for this range.'}
            </p>
          </div>

          {(expLeylines > 0 || moraLeylines > 0) && (
            <div className="leyline-summary" style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(122,162,255,0.08)', border: '1px solid rgba(122,162,255,0.25)',
              display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13.5,
            }}>
              <span><b>{expLeylines}</b> EXP ley lines</span>
              <span><b>{moraLeylines}</b> Mora ley lines</span>
              <span style={{ color: 'var(--muted)' }}>
                = {((expLeylines + moraLeylines) * 20).toLocaleString()} resin (~{Math.ceil(((expLeylines + moraLeylines) * 20) / 180)} days of resin) if farmed purely from ley lines
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="mat-row">
          {sortMatKeys([...new Set([...Object.keys(ascOnly), ...Object.keys(talOnly)])]).map((mk) => (
            <MatChip key={mk} matKey={mk} count={(ascOnly[mk] || 0) + (talOnly[mk] || 0)} />
          ))}
        </div>
      )}

      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>
        Talent book days:{' '}
        {(() => {
          const bookKey = Object.keys(talOnly).find((mk) => materials[mk]?.type === 'Character Talent Material');
          const m = materials[bookKey];
          return m?.days ? m.days.filter((d) => d !== 'Sunday').map((d) => d.slice(0, 3)).join(', ') + ' (+ Sunday)' : '—';
        })()}
      </p>
    </div>
  );
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function sanitize(html) {
  // allow only b/i/br tags from the dataset
  return html
    .replace(/</g, '&lt;')
    .replace(/&lt;(\/?)(b|i|br)&gt;/g, '<$1$2>')
    .replace(/\n/g, '<br/>');
}
