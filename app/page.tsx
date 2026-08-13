"use client";

import { useEffect, useMemo, useState } from "react";

type Position = "PG" | "SG" | "SF" | "PF" | "C";
type Stage = "intro" | "setup" | "career" | "retired";

type Team = {
  name: string;
  short: string;
  league: string;
  logo: string;
  color: string;
  accent: string;
  prestige: number;
};

type Season = {
  age: number;
  year: string;
  team: string;
  ovr: number;
  games: number;
  points: number;
  assists: number;
  rebounds: number;
  result: string;
  event: string;
};

type GameState = {
  stage: Stage;
  name: string;
  position: Position;
  archetype: string;
  age: number;
  year: number;
  ovr: number;
  potential: number;
  team: Team;
  contractYears: number;
  salary: number;
  cash: number;
  health: number;
  morale: number;
  coach: number;
  teammates: number;
  fans: number;
  legacy: number;
  rings: number;
  awards: string[];
  history: Season[];
  lastEvent: string;
  lastDelta: number;
  selectedChoice: string | null;
};

type Choice = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  upside: string;
  risk: string;
  effect: "train" | "team" | "brand" | "health" | "transfer" | "lead";
};

const TEAMS: Team[] = [
  { name: "Real Madrid", short: "RMA", league: "Liga ACB", logo: "teams/real-madrid.png", color: "#f7f7f2", accent: "#7256ff", prestige: 91 },
  { name: "FC Barcelona", short: "FCB", league: "Liga ACB", logo: "teams/barcelona.png", color: "#9b1634", accent: "#1659c9", prestige: 90 },
  { name: "Maccabi Tel Aviv", short: "MTA", league: "Israeli Premier League", logo: "teams/maccabi-tel-aviv.png", color: "#f5c928", accent: "#194f9e", prestige: 78 },
  { name: "Paris Basketball", short: "PAR", league: "LNB Pro A", logo: "teams/paris.png", color: "#ff5d2e", accent: "#161b33", prestige: 75 },
  { name: "Chicago Bulls", short: "CHI", league: "NBA", logo: "teams/chicago-bulls.png", color: "#ce1141", accent: "#f4f4ef", prestige: 92 },
  { name: "Los Angeles Lakers", short: "LAL", league: "NBA", logo: "teams/la-lakers.png", color: "#fdb927", accent: "#552583", prestige: 96 },
  { name: "Boston Celtics", short: "BOS", league: "NBA", logo: "teams/boston-celtics.png", color: "#007a33", accent: "#ba9653", prestige: 96 },
  { name: "New York Knicks", short: "NYK", league: "NBA", logo: "teams/new-york-knicks.png", color: "#f58426", accent: "#006bb6", prestige: 89 },
  { name: "Miami Heat", short: "MIA", league: "NBA", logo: "teams/miami-heat.png", color: "#98002e", accent: "#f9a01b", prestige: 90 },
  { name: "Golden State Warriors", short: "GSW", league: "NBA", logo: "teams/golden-state-warriors.png", color: "#1d428a", accent: "#ffc72c", prestige: 95 },
];

const DEFAULT: GameState = {
  stage: "intro",
  name: "",
  position: "PG",
  archetype: "Floor General",
  age: 16,
  year: 2026,
  ovr: 51,
  potential: 91,
  team: TEAMS[2],
  contractYears: 2,
  salary: 0.08,
  cash: 0.02,
  health: 96,
  morale: 82,
  coach: 62,
  teammates: 68,
  fans: 12,
  legacy: 0,
  rings: 0,
  awards: [],
  history: [],
  lastEvent: "Your first professional season is waiting.",
  lastDelta: 0,
  selectedChoice: null,
};

const ARCHETYPES: Record<Position, string[]> = {
  PG: ["Floor General", "Shot Creator", "Two-Way Guard"],
  SG: ["Three-Level Scorer", "Sharpshooter", "Perimeter Lock"],
  SF: ["Two-Way Wing", "Slasher", "Point Forward"],
  PF: ["Stretch Four", "Interior Force", "Switch Defender"],
  C: ["Rim Protector", "Post Maestro", "Modern Big"],
};

const EVENTS = [
  { text: "A veteran stayed late to work on your footwork.", delta: 2, health: 0, morale: 5 },
  { text: "A viral fourth-quarter run put the league on notice.", delta: 3, health: 0, morale: 6 },
  { text: "A minor ankle sprain cost you three weeks.", delta: -1, health: -18, morale: -3 },
  { text: "Your shooting coach rebuilt your release.", delta: 2, health: 0, morale: 3 },
  { text: "A tense locker-room argument hurt team chemistry.", delta: -1, health: 0, morale: -7 },
  { text: "You played through fatigue and your efficiency dipped.", delta: -2, health: -10, morale: -4 },
  { text: "A national-team call-up sharpened your confidence.", delta: 2, health: -3, morale: 8 },
  { text: "You found a mentor who changed how you read the game.", delta: 3, health: 0, morale: 5 },
  { text: "A wrist injury interrupted your best stretch of the year.", delta: -2, health: -22, morale: -5 },
  { text: "Your playoff performance became an instant classic.", delta: 4, health: -5, morale: 9 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function seededPick<T>(items: T[], seed: number) {
  const index = Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % items.length;
  return items[Math.floor(index)];
}

function formatMoney(value: number) {
  if (value < 1) return `$${Math.round(value * 1000)}K`;
  return `$${value.toFixed(value >= 10 ? 1 : 2)}M`;
}

function teamMark(team: Team, small = false) {
  return (
    <span
      className={`team-mark ${small ? "team-mark-small" : ""}`}
      style={{ "--team": team.color, "--team-accent": team.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <img src={team.logo} alt="" />
      <b>{team.short}</b>
    </span>
  );
}

export default function Home() {
  const [game, setGame] = useState<GameState>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("full-court-legacy-save");
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        setGame({ ...parsed, team: TEAMS.find((team) => team.name === parsed.team?.name) ?? DEFAULT.team });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("full-court-legacy-save", JSON.stringify(game));
  }, [game, loaded]);

  const choices = useMemo<Choice[]>(() => {
    const core: Choice[] = [
      { id: "work", eyebrow: "DEVELOPMENT", title: "Live in the gym", body: "Build your game around relentless offseason work.", upside: "+OVR · Coach trust", risk: "Fatigue · Injury risk", effect: "train" },
      { id: "chemistry", eyebrow: "LOCKER ROOM", title: "Build the brotherhood", body: "Put ego aside and become the teammate everyone trusts.", upside: "Chemistry · Morale", risk: "Less personal growth", effect: "team" },
      { id: "brand", eyebrow: "OFF COURT", title: "Grow the brand", body: "Turn attention into endorsements and a bigger platform.", upside: "Money · Fans", risk: "Coach trust", effect: "brand" },
      { id: "recover", eyebrow: "BODY", title: "Protect the future", body: "Invest in recovery and arrive fresh for opening night.", upside: "Health · Longevity", risk: "Slower OVR growth", effect: "health" },
      { id: "move", eyebrow: "CAREER", title: "Ask for a new challenge", body: "Bet on a bigger role with a different club.", upside: "New opportunity", risk: "Role uncertainty", effect: "transfer" },
      { id: "lead", eyebrow: "LEGACY", title: "Demand the spotlight", body: "Tell the coach you are ready to carry the offense.", upside: "Stats · Awards", risk: "Chemistry · Pressure", effect: "lead" },
    ];
    return [seededPick(core, game.year + game.ovr), seededPick(core.filter((c) => c.id !== seededPick(core, game.year + game.ovr).id), game.year * 3 + game.age)];
  }, [game.year, game.ovr, game.age]);

  function beginCareer() {
    setGame((g) => ({ ...g, stage: "setup" }));
  }

  function confirmPlayer() {
    if (!game.name.trim()) return;
    setGame((g) => ({ ...g, stage: "career", lastEvent: `${g.name}'s journey begins with ${g.team.name}.` }));
  }

  function playSeason(choice: Choice) {
    const seed = game.year * 13 + game.ovr * 7 + choice.id.length + game.history.length * 17;
    const event = seededPick(EVENTS, seed);
    const growthCurve = game.age < 23 ? 3 : game.age < 28 ? 1 : game.age < 32 ? 0 : -2;
    const variance = Math.floor((Math.abs(Math.sin(seed)) * 7)) - 3;
    const effectDelta: Record<Choice["effect"], number> = { train: 3, team: 1, brand: 0, health: 0, transfer: 1, lead: 2 };
    const rawDelta = growthCurve + variance + effectDelta[choice.effect] + event.delta;
    const delta = clamp(rawDelta, -5, 7);
    const nextOvr = clamp(game.ovr + delta, 38, 99);
    const isNBA = game.team.league === "NBA";
    const games = isNBA ? 58 + (seed % 25) : 24 + (seed % 12);
    const role = clamp((nextOvr - 45) / 45, 0.15, 1);
    const points = Math.round((5 + role * 24 + (choice.effect === "lead" ? 4 : 0)) * 10) / 10;
    const assists = Math.round(((game.position === "PG" ? 2.5 : 1) + role * 6) * 10) / 10;
    const rebounds = Math.round(((game.position === "C" || game.position === "PF" ? 3.5 : 1.5) + role * 7) * 10) / 10;
    const titleChance = game.team.prestige + nextOvr - 145;
    const wonTitle = Math.abs(Math.sin(seed * 5)) * 100 < titleChance;
    const madePlayoffs = game.team.prestige + nextOvr > 145;
    const result = wonTitle ? "Champions" : madePlayoffs ? "Playoffs" : "Regular season";
    const newAwards = [...game.awards];
    if (points > 23 && !newAwards.includes("All-Star")) newAwards.push("All-Star");
    if (nextOvr > 86 && points > 25 && !newAwards.includes("League MVP")) newAwards.push("League MVP");
    if (game.age < 20 && delta >= 4 && !newAwards.includes("Rising Star")) newAwards.push("Rising Star");
    if (wonTitle && !newAwards.includes("Champion")) newAwards.push("Champion");

    let nextTeam = game.team;
    if (choice.effect === "transfer") {
      const eligible = TEAMS.filter((t) => t.name !== game.team.name && (nextOvr >= 75 ? true : t.league !== "NBA"));
      nextTeam = seededPick(eligible, seed + 99);
    } else if (nextOvr >= 74 && game.team.league !== "NBA" && game.age >= 19 && Math.abs(Math.sin(seed + 2)) > 0.45) {
      nextTeam = seededPick(TEAMS.filter((t) => t.league === "NBA"), seed + 41);
    }

    const salary = nextTeam.league === "NBA" ? Math.max(1.1, Math.pow(nextOvr - 55, 1.55) / 6) : Math.max(0.08, Math.pow(nextOvr - 48, 1.35) / 16);
    const season: Season = {
      age: game.age,
      year: `${game.year}-${String(game.year + 1).slice(2)}`,
      team: game.team.name,
      ovr: nextOvr,
      games,
      points,
      assists,
      rebounds,
      result,
      event: event.text,
    };
    const nextAge = game.age + 1;
    setGame((g) => ({
      ...g,
      stage: nextAge >= 39 || nextOvr <= 40 ? "retired" : "career",
      age: nextAge,
      year: g.year + 1,
      ovr: nextOvr,
      team: nextTeam,
      salary,
      cash: g.cash + salary * 0.55 + (choice.effect === "brand" ? 0.8 + g.fans / 100 : 0),
      contractYears: choice.effect === "transfer" || g.contractYears <= 1 ? 2 + (seed % 4) : g.contractYears - 1,
      health: clamp(g.health + event.health + (choice.effect === "health" ? 22 : choice.effect === "train" ? -8 : -3)),
      morale: clamp(g.morale + event.morale + (wonTitle ? 15 : 0) + (choice.effect === "team" ? 8 : 0)),
      coach: clamp(g.coach + (choice.effect === "train" ? 8 : choice.effect === "brand" ? -6 : 2)),
      teammates: clamp(g.teammates + (choice.effect === "team" ? 12 : choice.effect === "lead" ? -6 : 1)),
      fans: clamp(g.fans + Math.round(points / 4) + (choice.effect === "brand" ? 12 : 0)),
      legacy: g.legacy + Math.max(0, nextOvr - 60) + (wonTitle ? 100 : 0) + (newAwards.length - g.awards.length) * 35,
      rings: g.rings + (wonTitle ? 1 : 0),
      awards: newAwards,
      history: [season, ...g.history],
      lastEvent: nextTeam.name !== g.team.name ? `${event.text} ${nextTeam.name} came calling.` : event.text,
      lastDelta: delta,
      selectedChoice: choice.id,
    }));
  }

  function resetGame() {
    localStorage.removeItem("full-court-legacy-save");
    setGame(DEFAULT);
    setShowReset(false);
  }

  if (!loaded) return <main className="loading-screen"><div className="loading-ball" /></main>;

  if (game.stage === "intro") {
    return (
      <main className="intro-screen">
        <div className="court-grid" />
        <nav className="intro-nav"><span className="brand-mark">FCL</span><span>FULL COURT LEGACY</span><span className="edition">CAREER MODE · 2026</span></nav>
        <section className="intro-copy">
          <p className="kicker">ONE CAREER. EVERY DECISION COUNTS.</p>
          <h1>MAKE YOUR<br /><em>LEGACY.</em></h1>
          <p className="intro-description">Start at sixteen. Navigate real clubs, contracts, injuries, rivalries and impossible choices. Talent opens the door. What you do next defines the career.</p>
          <button className="primary-action" onClick={beginCareer}>START A NEW CAREER <span>→</span></button>
          <p className="save-note">Your career saves automatically on this device.</p>
        </section>
        <div className="intro-player" aria-hidden="true"><span className="player-number">01</span><div className="silhouette" /><div className="ball" /></div>
        <footer className="legal">Unofficial fan-made career simulation. Team and league names and marks belong to their respective owners.</footer>
      </main>
    );
  }

  if (game.stage === "setup") {
    return (
      <main className="setup-screen">
        <header className="game-nav"><button className="brand-button" onClick={() => setGame((g) => ({ ...g, stage: "intro" }))}><span className="brand-mark">FCL</span> FULL COURT LEGACY</button><span className="nav-label">CREATE YOUR PLAYER</span></header>
        <section className="setup-card">
          <div className="setup-heading"><p className="kicker">THE JOURNEY STARTS HERE</p><h1>Build your player</h1><p>Choose the identity and play style that will shape every season ahead.</p></div>
          <div className="setup-grid">
            <div className="form-stack">
              <label>PLAYER NAME<input value={game.name} maxLength={24} placeholder="Enter your name" onChange={(e) => setGame((g) => ({ ...g, name: e.target.value }))} autoFocus /></label>
              <fieldset><legend>POSITION</legend><div className="segmented">{(["PG","SG","SF","PF","C"] as Position[]).map((p) => <button key={p} aria-pressed={game.position === p} onClick={() => setGame((g) => ({ ...g, position: p, archetype: ARCHETYPES[p][0] }))}>{p}</button>)}</div></fieldset>
              <fieldset><legend>ARCHETYPE</legend><div className="archetype-list">{ARCHETYPES[game.position].map((a, i) => <button key={a} aria-pressed={game.archetype === a} onClick={() => setGame((g) => ({ ...g, archetype: a }))}><span>{String(i + 1).padStart(2,"0")}</span><strong>{a}</strong><small>{i === 0 ? "Balanced foundation" : i === 1 ? "Elite offensive ceiling" : "Defense changes games"}</small></button>)}</div></fieldset>
            </div>
            <aside className="player-preview">
              <p>PROSPECT CARD</p><div className="prospect-number">{game.position}</div><div className="preview-silhouette" /><h2>{game.name || "YOUR NAME"}</h2><span>{game.archetype}</span><div className="preview-stats"><div><strong>51</strong><small>OVR</small></div><div><strong>91</strong><small>POT</small></div><div><strong>16</strong><small>AGE</small></div></div>
            </aside>
          </div>
          <button className="primary-action setup-submit" disabled={!game.name.trim()} onClick={confirmPlayer}>BEGIN THE JOURNEY <span>→</span></button>
        </section>
      </main>
    );
  }

  if (game.stage === "retired") {
    const totalGames = game.history.reduce((n, s) => n + s.games, 0);
    const peak = Math.max(...game.history.map((s) => s.ovr), game.ovr);
    return (
      <main className="retirement-screen">
        <div className="retired-watermark">LEGACY</div><p className="kicker">CAREER COMPLETE</p><h1>{game.name}</h1><h2>THE FINAL BUZZER</h2><p>{game.rings > 1 ? "An era-defining champion." : game.legacy > 500 ? "A career the game will remember." : "Every possession helped write the story."}</p>
        <div className="retired-stats"><div><strong>{game.history.length}</strong><span>SEASONS</span></div><div><strong>{totalGames}</strong><span>GAMES</span></div><div><strong>{peak}</strong><span>PEAK OVR</span></div><div><strong>{game.rings}</strong><span>RINGS</span></div><div><strong>{formatMoney(game.cash)}</strong><span>NET WORTH</span></div></div>
        <div className="award-strip">{game.awards.length ? game.awards.map((a) => <span key={a}>{a}</span>) : <span>UNDRAFTED LEGEND</span>}</div>
        <button className="primary-action" onClick={resetGame}>START ANOTHER CAREER <span>↻</span></button>
      </main>
    );
  }

  const current = game.history[0];
  const ovrTone = game.lastDelta > 0 ? "+" : "";
  return (
    <main className="career-shell">
      <header className="game-nav">
        <button className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brand-mark">FCL</span><span className="brand-full">FULL COURT LEGACY</span></button>
        <div className="season-chip"><span>SEASON</span><strong>{game.year}-{String(game.year + 1).slice(2)}</strong></div>
        <div className="save-status"><i /> CAREER SAVED</div>
        <button className="text-button" onClick={() => setShowReset(true)}>NEW CAREER</button>
      </header>

      <section className="player-hero">
        <div className="hero-identity">
          {teamMark(game.team)}
          <div><p>{game.team.league} · YEAR {game.history.length + 1}</p><h1>{game.name}</h1><div className="player-meta"><span>#{game.position === "PG" ? 1 : game.position === "C" ? 33 : 11}</span><span>{game.position}</span><span>{game.archetype}</span><span>AGE {game.age}</span></div></div>
        </div>
        <div className="hero-team"><small>CURRENT CLUB</small><strong>{game.team.name}</strong><span>{game.team.league}</span></div>
        <div className="ovr-block"><span>OVERALL</span><strong>{game.ovr}</strong><small className={game.lastDelta >= 0 ? "positive" : "negative"}>{game.history.length ? `${ovrTone}${game.lastDelta} THIS YEAR` : "ROOKIE"}</small></div>
      </section>

      <div className="dashboard-grid">
        <section className="main-column">
          <div className="section-title"><div><p className="kicker">THE DECISION</p><h2>What will define age {game.age}?</h2></div><span>CHOOSE ONE · THE YEAR WILL SIMULATE</span></div>
          <div className="choice-grid">
            {choices.map((choice, index) => <button key={choice.id} className="choice-card" onClick={() => playSeason(choice)}><span className="choice-index">0{index + 1}</span><p>{choice.eyebrow}</p><h3>{choice.title}</h3><div>{choice.body}</div><dl><dt>UPSIDE</dt><dd>{choice.upside}</dd><dt>RISK</dt><dd>{choice.risk}</dd></dl><span className="choose-link">COMMIT TO THIS PATH <b>→</b></span></button>)}
          </div>

          <section className="event-panel">
            <div className="event-icon">!</div><div><p className="kicker">LATEST FROM THE LOCKER ROOM</p><h3>{game.lastEvent}</h3></div><span className={game.lastDelta >= 0 ? "delta positive" : "delta negative"}>{game.history.length ? `${ovrTone}${game.lastDelta} OVR` : "READY"}</span>
          </section>

          <section className="performance-panel">
            <div className="section-title compact"><div><p className="kicker">PERFORMANCE FILE</p><h2>{current ? current.year : "PRESEASON"}</h2></div><span>{current?.result || "YOUR FIRST YEAR AWAITS"}</span></div>
            <div className="stat-line"><div><strong>{current?.games ?? 0}</strong><span>GP</span></div><div><strong>{current?.points ?? "—"}</strong><span>PPG</span></div><div><strong>{current?.assists ?? "—"}</strong><span>APG</span></div><div><strong>{current?.rebounds ?? "—"}</strong><span>RPG</span></div></div>
            <div className="ratings">
              {[{n:"OFFENSE",v:clamp(game.ovr + 3)},{n:"PLAYMAKING",v:clamp(game.ovr + (game.position === "PG" ? 6 : -2))},{n:"DEFENSE",v:clamp(game.ovr - 2)},{n:"ATHLETICISM",v:clamp(game.health - 7)}].map((r) => <div key={r.n}><span>{r.n}</span><div><i style={{ width: `${r.v}%` }} /></div><strong>{r.v}</strong></div>)}
            </div>
          </section>

          <section className="history-panel">
            <div className="section-title compact"><div><p className="kicker">CAREER LEDGER</p><h2>Season by season</h2></div><span>{game.history.length} SEASONS</span></div>
            {game.history.length === 0 ? <div className="empty-history">Your first line will be written after this decision.</div> : <div className="history-table"><div className="history-row history-head"><span>YEAR</span><span>CLUB</span><span>OVR</span><span>PPG</span><span>RESULT</span></div>{game.history.map((s) => <div className="history-row" key={`${s.year}-${s.team}`}><span>{s.year}</span><span>{s.team}</span><strong>{s.ovr}</strong><span>{s.points}</span><span>{s.result}</span></div>)}</div>}
          </section>
        </section>

        <aside className="side-column">
          <section className="side-panel contract-panel"><p className="kicker">CONTRACT</p><div className="team-contract">{teamMark(game.team, true)}<div><strong>{game.team.name}</strong><span>{game.contractYears} YEARS REMAINING</span></div></div><div className="money-grid"><div><span>SALARY</span><strong>{formatMoney(game.salary)}</strong><small>PER YEAR</small></div><div><span>NET WORTH</span><strong>{formatMoney(game.cash)}</strong><small>ESTIMATED</small></div></div></section>
          <section className="side-panel"><p className="kicker">BODY & MIND</p><div className="meter-list"><Meter label="HEALTH" value={game.health} /><Meter label="MORALE" value={game.morale} /></div></section>
          <section className="side-panel"><p className="kicker">INNER CIRCLE</p><div className="relationship-list"><Relationship icon="C" label="COACH" value={game.coach} /><Relationship icon="T" label="TEAMMATES" value={game.teammates} /><Relationship icon="F" label="FANS" value={game.fans} /></div></section>
          <section className="side-panel legacy-panel"><p className="kicker">LEGACY</p><div className="legacy-score"><strong>{game.legacy}</strong><span>LEGACY POINTS</span></div><div className="trophy-grid"><div><strong>{game.rings}</strong><span>RINGS</span></div><div><strong>{game.awards.length}</strong><span>AWARDS</span></div></div><div className="award-list">{game.awards.length ? game.awards.map((a) => <span key={a}>★ {a}</span>) : <p>The cabinet is empty. For now.</p>}</div></section>
          <section className="side-panel disclaimer"><strong>UNOFFICIAL FAN GAME</strong><p>Not affiliated with or endorsed by any team, league or governing body. Names and marks belong to their respective owners.</p></section>
        </aside>
      </div>

      {showReset && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowReset(false)}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={(e) => e.stopPropagation()}><p className="kicker">START OVER?</p><h2 id="reset-title">This career will be erased.</h2><p>{game.name}'s {game.history.length}-season journey cannot be recovered.</p><div><button className="secondary-action" onClick={() => setShowReset(false)}>KEEP PLAYING</button><button className="danger-action" onClick={resetGame}>ERASE CAREER</button></div></div></div>}
    </main>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return <div className="meter"><div><span>{label}</span><strong>{value}</strong></div><div><i style={{ width: `${value}%` }} /></div></div>;
}

function Relationship({ icon, label, value }: { icon: string; label: string; value: number }) {
  return <div className="relationship"><span>{icon}</span><div><strong>{label}</strong><div><i style={{ width: `${value}%` }} /></div></div><b>{value}</b></div>;
}
