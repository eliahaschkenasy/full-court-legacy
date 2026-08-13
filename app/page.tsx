"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Position = "PG" | "SG" | "SF" | "PF" | "C";
type Stage = "intro" | "setup" | "career" | "retired";
type Origin = "europe" | "usa" | null;
type TeamPath = "europe" | "college" | "nba";

type Team = {
  name: string;
  short: string;
  league: string;
  logo: string;
  color: string;
  accent: string;
  prestige: number;
  path: TeamPath;
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
  origin: Origin;
  phase: TeamPath;
  age: number;
  year: number;
  startingOvr: number;
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
  teamsPlayed: string[];
  lastEvent: string;
  lastDelta: number;
  selectedChoice: string | null;
  offseason: boolean;
  offerNames: string[];
  draftEligible: boolean;
  draftProjection: string;
};

type Choice = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  upside: string;
  risk: string;
  effect: "train" | "team" | "brand" | "health" | "lead";
};

type Achievement = { id: string; title: string; body: string; points: number };

const TEAMS: Team[] = [
  { name: "Paris Basketball", short: "PAR", league: "LNB Pro A", logo: "teams/paris.png", color: "#ff5d2e", accent: "#161b33", prestige: 68, path: "europe" },
  { name: "Maccabi Tel Aviv", short: "MTA", league: "Israeli Premier League", logo: "teams/maccabi-tel-aviv.png", color: "#f5c928", accent: "#194f9e", prestige: 74, path: "europe" },
  { name: "FC Barcelona", short: "FCB", league: "Liga ACB", logo: "teams/barcelona.png", color: "#9b1634", accent: "#1659c9", prestige: 88, path: "europe" },
  { name: "Real Madrid", short: "RMA", league: "Liga ACB", logo: "teams/real-madrid.png", color: "#f7f7f2", accent: "#7256ff", prestige: 92, path: "europe" },
  { name: "UCLA Bruins", short: "UCLA", league: "NCAA", logo: "teams/ucla.png", color: "#2d68c4", accent: "#f3c43d", prestige: 76, path: "college" },
  { name: "Kentucky Wildcats", short: "UK", league: "NCAA", logo: "teams/kentucky.png", color: "#0033a0", accent: "#ffffff", prestige: 80, path: "college" },
  { name: "Duke Blue Devils", short: "DUKE", league: "NCAA", logo: "teams/duke.png", color: "#003087", accent: "#ffffff", prestige: 85, path: "college" },
  { name: "UConn Huskies", short: "CONN", league: "NCAA", logo: "teams/uconn.png", color: "#000e2f", accent: "#ffffff", prestige: 86, path: "college" },
  { name: "Chicago Bulls", short: "CHI", league: "NBA", logo: "teams/chicago-bulls.png", color: "#ce1141", accent: "#f4f4ef", prestige: 76, path: "nba" },
  { name: "New York Knicks", short: "NYK", league: "NBA", logo: "teams/new-york-knicks.png", color: "#f58426", accent: "#006bb6", prestige: 82, path: "nba" },
  { name: "Miami Heat", short: "MIA", league: "NBA", logo: "teams/miami-heat.png", color: "#98002e", accent: "#f9a01b", prestige: 87, path: "nba" },
  { name: "Golden State Warriors", short: "GSW", league: "NBA", logo: "teams/golden-state-warriors.png", color: "#1d428a", accent: "#ffc72c", prestige: 90, path: "nba" },
  { name: "Los Angeles Lakers", short: "LAL", league: "NBA", logo: "teams/la-lakers.png", color: "#fdb927", accent: "#552583", prestige: 93, path: "nba" },
  { name: "Boston Celtics", short: "BOS", league: "NBA", logo: "teams/boston-celtics.png", color: "#007a33", accent: "#ba9653", prestige: 95, path: "nba" },
];

const DEFAULT: GameState = {
  stage: "intro",
  name: "",
  position: "PG",
  archetype: "Floor General",
  origin: null,
  phase: "europe",
  age: 18,
  year: 2026,
  startingOvr: 50,
  ovr: 50,
  potential: 78,
  team: TEAMS[0],
  contractYears: 1,
  salary: 0.08,
  cash: 0.01,
  health: 92,
  morale: 78,
  coach: 55,
  teammates: 60,
  fans: 5,
  legacy: 0,
  rings: 0,
  awards: [],
  history: [],
  teamsPlayed: [],
  lastEvent: "Your first competitive season is waiting.",
  lastDelta: 0,
  selectedChoice: null,
  offseason: false,
  offerNames: [],
  draftEligible: false,
  draftProjection: "Not on draft boards",
};

const ARCHETYPES: Record<Position, string[]> = {
  PG: ["Floor General", "Shot Creator", "Two-Way Guard"],
  SG: ["Three-Level Scorer", "Sharpshooter", "Perimeter Lock"],
  SF: ["Two-Way Wing", "Slasher", "Point Forward"],
  PF: ["Stretch Four", "Interior Force", "Switch Defender"],
  C: ["Rim Protector", "Post Maestro", "Modern Big"],
};

const EVENTS = [
  { text: "A veteran stayed late to work on your footwork.", delta: 1, health: 0, morale: 4 },
  { text: "A fourth-quarter run finally put scouts on notice.", delta: 2, health: -2, morale: 5 },
  { text: "A minor ankle sprain cost you three weeks.", delta: -2, health: -18, morale: -3 },
  { text: "Your shooting coach rebuilt your release.", delta: 1, health: 0, morale: 2 },
  { text: "A locker-room argument damaged team chemistry.", delta: -1, health: 0, morale: -8 },
  { text: "Heavy minutes exposed gaps in your game.", delta: -2, health: -10, morale: -4 },
  { text: "A national-team camp raised your confidence.", delta: 1, health: -4, morale: 6 },
  { text: "A mentor changed how you read pick-and-roll coverages.", delta: 2, health: 0, morale: 4 },
  { text: "A wrist injury interrupted your best stretch.", delta: -3, health: -24, morale: -6 },
  { text: "You struggled when opponents adjusted to your tendencies.", delta: -2, health: -3, morale: -5 },
  { text: "A playoff breakthrough changed the way coaches see you.", delta: 2, health: -7, morale: 7 },
  { text: "A quiet season left scouts divided about your ceiling.", delta: -1, health: 0, morale: -2 },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-season", title: "First Steps", body: "Complete your first season.", points: 10 },
  { id: "european-roots", title: "European Roots", body: "Begin a career in Europe.", points: 15 },
  { id: "campus-life", title: "Campus Life", body: "Complete a college season.", points: 15 },
  { id: "draft-night", title: "Draft Night", body: "Make it to the NBA through the draft.", points: 25 },
  { id: "hidden-gem", title: "Hidden Gem", body: "Start at 47 OVR or lower and reach 75.", points: 40 },
  { id: "loyalty", title: "One Crest", body: "Play five seasons for the same team.", points: 30 },
  { id: "journeyman", title: "Passport Full", body: "Represent four different teams.", points: 25 },
  { id: "millionaire", title: "Generational Money", body: "Build a $10M net worth.", points: 20 },
  { id: "all-star", title: "Among the Stars", body: "Earn an All-Star selection.", points: 25 },
  { id: "champion", title: "Banner Season", body: "Win a championship.", points: 40 },
  { id: "mvp", title: "Best in the World", body: "Win league MVP.", points: 60 },
  { id: "dynasty", title: "Dynasty", body: "Win three championships in one career.", points: 75 },
  { id: "ironman", title: "Built to Last", body: "Play ten seasons and keep health above 75.", points: 40 },
  { id: "legend", title: "Full Court Legend", body: "Reach 92 OVR or 1,000 legacy points.", points: 100 },
];

function clamp(value: number, min = 0, max = 100) { return Math.min(max, Math.max(min, value)); }

function seededPick<T>(items: T[], seed: number) {
  const index = Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % items.length;
  return items[Math.floor(index)];
}

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function formatMoney(value: number) {
  if (value <= 0) return "$0";
  if (value < 1) return `$${Math.round(value * 1000)}K`;
  return `$${value.toFixed(value >= 10 ? 1 : 2)}M`;
}

function salaryFor(team: Team, ovr: number) {
  if (team.path === "college") return 0;
  if (team.path === "nba") return Math.max(0.9, Math.pow(Math.max(1, ovr - 52), 1.38) / 8);
  return Math.max(0.06, Math.pow(Math.max(1, ovr - 42), 1.22) / 20);
}

function projectionFor(ovr: number) {
  if (ovr >= 78) return "Lottery projection";
  if (ovr >= 70) return "First-round projection";
  if (ovr >= 64) return "Second-round projection";
  if (ovr >= 60) return "Fringe / two-way projection";
  return "Not on draft boards";
}

function offersFor(game: GameState, ovr: number, age: number, seed: number) {
  let candidates: Team[];
  if (game.team.path === "college" && age >= 22) {
    candidates = TEAMS.filter((team) => team.path === "europe" && team.prestige <= 74);
  } else {
    const threshold = game.team.path === "nba" ? 14 : game.team.path === "europe" ? 18 : 22;
    candidates = TEAMS.filter((team) => team.path === game.team.path && team.prestige > game.team.prestige && ovr >= team.prestige - threshold);
  }
  return candidates
    .sort((a, b) => a.prestige - b.prestige)
    .sort((a, b) => Math.sin(seed + a.prestige) - Math.sin(seed + b.prestige))
    .slice(0, 2);
}

function achievementIdsFor(game: GameState) {
  const ids: string[] = [];
  if (game.history.length >= 1) ids.push("first-season");
  if (game.origin === "europe" && game.history.length >= 1) ids.push("european-roots");
  if (game.origin === "usa" && game.history.some((season) => TEAMS.find((team) => team.name === season.team)?.path === "college")) ids.push("campus-life");
  if (game.phase === "nba") ids.push("draft-night");
  if (game.startingOvr <= 47 && game.ovr >= 75) ids.push("hidden-gem");
  const seasonsByTeam = game.history.reduce<Record<string, number>>((map, season) => ({ ...map, [season.team]: (map[season.team] ?? 0) + 1 }), {});
  if (Object.values(seasonsByTeam).some((count) => count >= 5)) ids.push("loyalty");
  if (game.teamsPlayed.length >= 4) ids.push("journeyman");
  if (game.cash >= 10) ids.push("millionaire");
  if (game.awards.includes("All-Star")) ids.push("all-star");
  if (game.rings >= 1) ids.push("champion");
  if (game.awards.includes("League MVP")) ids.push("mvp");
  if (game.rings >= 3) ids.push("dynasty");
  if (game.history.length >= 10 && game.health >= 75) ids.push("ironman");
  if (game.ovr >= 92 || game.legacy >= 1000) ids.push("legend");
  return ids;
}

function teamMark(team: Team, small = false) {
  return <span className={`team-mark ${small ? "team-mark-small" : ""}`} style={{ "--team": team.color, "--team-accent": team.accent } as CSSProperties} aria-hidden="true"><img src={team.logo} alt="" /><b>{team.short}</b></span>;
}

export default function Home() {
  const [game, setGame] = useState<GameState>(DEFAULT);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("full-court-legacy-save");
      const trophies = localStorage.getItem("full-court-legacy-achievements");
      if (trophies) setAchievementIds(JSON.parse(trophies));
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<GameState>;
        const team = TEAMS.find((entry) => entry.name === parsed.team?.name) ?? DEFAULT.team;
        setGame({
          ...DEFAULT,
          ...parsed,
          origin: parsed.origin ?? (team.path === "college" ? "usa" : "europe"),
          phase: team.path,
          startingOvr: parsed.startingOvr ?? parsed.ovr ?? DEFAULT.ovr,
          team,
          teamsPlayed: parsed.teamsPlayed ?? [team.name],
          offerNames: parsed.offerNames ?? [],
          offseason: parsed.offseason ?? false,
        });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("full-court-legacy-save", JSON.stringify(game));
    const newlyEarned = achievementIdsFor(game).filter((id) => !achievementIds.includes(id));
    if (newlyEarned.length) {
      const updated = [...achievementIds, ...newlyEarned];
      setAchievementIds(updated);
      localStorage.setItem("full-court-legacy-achievements", JSON.stringify(updated));
      setJustUnlocked(ACHIEVEMENTS.find((item) => item.id === newlyEarned[0]) ?? null);
    }
  }, [game, loaded, achievementIds]);

  const achievementPoints = ACHIEVEMENTS.filter((item) => achievementIds.includes(item.id)).reduce((sum, item) => sum + item.points, 0);

  const choices = useMemo<Choice[]>(() => {
    const core: Choice[] = [
      { id: "work", eyebrow: "DEVELOPMENT", title: "Live in the gym", body: "Chase improvement with an unforgiving training load.", upside: "Best growth chance · Coach trust", risk: "High fatigue · Injury risk", effect: "train" },
      { id: "chemistry", eyebrow: "LOCKER ROOM", title: "Build the brotherhood", body: "Sacrifice touches and become the teammate everyone trusts.", upside: "Chemistry · Morale", risk: "Limited personal growth", effect: "team" },
      { id: "brand", eyebrow: "OFF COURT", title: "Grow the brand", body: "Turn attention into endorsements and a bigger platform.", upside: "Money · Fans", risk: "Development · Coach trust", effect: "brand" },
      { id: "recover", eyebrow: "BODY", title: "Protect the future", body: "Invest in recovery and arrive fresh for opening night.", upside: "Health · Longevity", risk: "Minimal skill growth", effect: "health" },
      { id: "lead", eyebrow: "LEGACY", title: "Demand the spotlight", body: "Take the biggest shots and accept the pressure that follows.", upside: "Stats · Awards", risk: "Chemistry · Efficiency", effect: "lead" },
    ];
    const first = seededPick(core, game.year + game.ovr);
    return [first, seededPick(core.filter((choice) => choice.id !== first.id), game.year * 3 + game.age)];
  }, [game.year, game.ovr, game.age]);

  const offers = game.offerNames.map((name) => TEAMS.find((team) => team.name === name)).filter((team): team is Team => Boolean(team));

  function beginCareer() {
    const startingOvr = randomInt(43, 58);
    const potential = clamp(startingOvr + randomInt(15, 34), 61, 94);
    setGame({ ...DEFAULT, stage: "setup", startingOvr, ovr: startingOvr, potential, health: randomInt(82, 97), morale: randomInt(66, 88) });
  }

  function confirmPlayer() {
    if (!game.name.trim() || !game.origin) return;
    const pool = game.origin === "usa" ? TEAMS.filter((team) => team.path === "college") : TEAMS.filter((team) => team.path === "europe" && team.prestige <= 74);
    const team = pool[randomInt(0, pool.length - 1)];
    setGame((current) => ({
      ...current,
      stage: "career",
      phase: team.path,
      team,
      salary: salaryFor(team, current.ovr),
      contractYears: team.path === "college" ? 1 : 2,
      teamsPlayed: [team.name],
      lastEvent: `${current.name}'s journey begins with ${team.name}. Nothing is guaranteed.`,
    }));
  }

  function playSeason(choice: Choice) {
    const seed = game.year * 13 + game.ovr * 7 + choice.id.length + game.history.length * 17;
    const event = seededPick(EVENTS, seed);
    const growthCurve = game.age < 23 ? 1 : game.age < 27 ? 0 : game.age < 31 ? -1 : -2;
    const variance = Math.floor(Math.abs(Math.sin(seed)) * 5) - 2;
    const effectDelta: Record<Choice["effect"], number> = { train: 1, team: 0, brand: -1, health: 0, lead: 0 };
    const ceilingPressure = game.ovr >= game.potential ? -2 : game.ovr >= game.potential - 3 ? -1 : 0;
    const healthPressure = game.health < 45 ? -2 : game.health < 65 ? -1 : 0;
    const delta = clamp(growthCurve + variance + effectDelta[choice.effect] + event.delta + ceilingPressure + healthPressure, -4, 4);
    const nextOvr = clamp(game.ovr + delta, 38, 97);
    const isNBA = game.team.path === "nba";
    const isCollege = game.team.path === "college";
    const games = isNBA ? 56 + (seed % 27) : isCollege ? 25 + (seed % 12) : 24 + (seed % 14);
    const role = clamp((nextOvr - 43) / 50, 0.08, 1);
    const points = Math.round((3.5 + role * 22 + (choice.effect === "lead" ? 2.5 : 0)) * 10) / 10;
    const assists = Math.round(((game.position === "PG" ? 2.2 : 0.8) + role * 5.5) * 10) / 10;
    const rebounds = Math.round(((game.position === "C" || game.position === "PF" ? 3.2 : 1.2) + role * 6.2) * 10) / 10;
    const titleChance = Math.max(2, game.team.prestige + nextOvr - 158);
    const wonTitle = Math.abs(Math.sin(seed * 5)) * 100 < titleChance;
    const madePlayoffs = game.team.prestige + nextOvr > 146;
    const result = wonTitle ? "Champions" : madePlayoffs ? (isCollege ? "Tournament" : "Playoffs") : "Regular season";
    const newAwards = [...game.awards];
    if (isNBA && points > 22 && nextOvr >= 78 && !newAwards.includes("All-Star")) newAwards.push("All-Star");
    if (isNBA && nextOvr >= 89 && points > 25 && !newAwards.includes("League MVP")) newAwards.push("League MVP");
    if (!isNBA && game.age <= 20 && delta >= 3 && !newAwards.includes("Rising Star")) newAwards.push("Rising Star");
    if (wonTitle && !newAwards.includes("Champion")) newAwards.push("Champion");

    const season: Season = { age: game.age, year: `${game.year}-${String(game.year + 1).slice(2)}`, team: game.team.name, ovr: nextOvr, games, points, assists, rebounds, result, event: event.text };
    const nextAge = game.age + 1;
    const nextHistory = [season, ...game.history];
    const nextHealth = clamp(game.health + event.health + (choice.effect === "health" ? 20 : choice.effect === "train" ? -10 : -4));
    const nextOffers = offersFor(game, nextOvr, nextAge, seed);
    const draftEligible = game.team.path !== "nba" && nextAge >= 19 && nextOvr >= 60;
    const nextState: GameState = {
      ...game,
      stage: nextAge >= 39 || nextOvr <= 39 ? "retired" : "career",
      age: nextAge,
      year: game.year + 1,
      ovr: nextOvr,
      cash: game.cash + game.salary * 0.52 + (choice.effect === "brand" ? 0.15 + game.fans / 160 : 0),
      contractYears: Math.max(0, game.contractYears - 1),
      health: nextHealth,
      morale: clamp(game.morale + event.morale + (wonTitle ? 12 : 0) + (choice.effect === "team" ? 7 : 0)),
      coach: clamp(game.coach + (choice.effect === "train" ? 5 : choice.effect === "brand" ? -7 : 1)),
      teammates: clamp(game.teammates + (choice.effect === "team" ? 10 : choice.effect === "lead" ? -5 : 0)),
      fans: clamp(game.fans + Math.max(1, Math.round(points / 6)) + (choice.effect === "brand" ? 10 : 0)),
      legacy: game.legacy + Math.max(0, nextOvr - 62) + (wonTitle ? 90 : 0) + (newAwards.length - game.awards.length) * 30,
      rings: game.rings + (wonTitle ? 1 : 0),
      awards: newAwards,
      history: nextHistory,
      lastEvent: `${event.text} The offseason is here.`,
      lastDelta: delta,
      selectedChoice: choice.id,
      offseason: nextAge < 39 && nextOvr > 39,
      offerNames: nextOffers.map((team) => team.name),
      draftEligible,
      draftProjection: projectionFor(nextOvr),
    };
    setGame(nextState);
  }

  function chooseDestination(destination: Team) {
    const staying = destination.name === game.team.name;
    const nextPhase = destination.path;
    const years = destination.path === "college" ? 1 : staying && game.contractYears > 0 ? game.contractYears : randomInt(2, 4);
    setGame((current) => ({
      ...current,
      team: destination,
      phase: nextPhase,
      salary: salaryFor(destination, current.ovr),
      contractYears: years,
      coach: staying ? clamp(current.coach + 4) : 48,
      teammates: staying ? clamp(current.teammates + 4) : 45,
      morale: clamp(current.morale + (staying ? 3 : 7)),
      teamsPlayed: current.teamsPlayed.includes(destination.name) ? current.teamsPlayed : [...current.teamsPlayed, destination.name],
      offseason: false,
      offerNames: [],
      draftEligible: false,
      selectedChoice: null,
      lastEvent: staying ? `You chose continuity with ${destination.name}.` : `${destination.name} earned your signature. Now prove the move was deserved.`,
    }));
  }

  function declareForDraft() {
    const nbaTeams = TEAMS.filter((team) => team.path === "nba").sort((a, b) => a.prestige - b.prestige);
    const pool = game.ovr >= 78 ? nbaTeams : game.ovr >= 68 ? nbaTeams.slice(0, 4) : nbaTeams.slice(0, 2);
    const destination = seededPick(pool, game.year * 19 + game.ovr * 11);
    setGame((current) => ({
      ...current,
      team: destination,
      phase: "nba",
      salary: salaryFor(destination, current.ovr),
      contractYears: 4,
      coach: 45,
      teammates: 42,
      morale: clamp(current.morale + 15),
      fans: clamp(current.fans + 12),
      legacy: current.legacy + 35,
      teamsPlayed: current.teamsPlayed.includes(destination.name) ? current.teamsPlayed : [...current.teamsPlayed, destination.name],
      offseason: false,
      offerNames: [],
      draftEligible: false,
      selectedChoice: null,
      lastEvent: `Draft night: ${destination.name} called your name. The NBA starts now.`,
    }));
  }

  function resetGame() {
    localStorage.removeItem("full-court-legacy-save");
    setGame(DEFAULT);
    setShowReset(false);
  }

  if (!loaded) return <main className="loading-screen"><div className="loading-ball" /></main>;

  const achievementButton = <button className="trophy-button" onClick={() => setShowAchievements(true)}>ACHIEVEMENTS <strong>{achievementIds.length}/{ACHIEVEMENTS.length}</strong><span>{achievementPoints} PTS</span></button>;
  const achievementModal = showAchievements ? <AchievementModal earned={achievementIds} onClose={() => setShowAchievements(false)} /> : null;

  if (game.stage === "intro") {
    return <main className="intro-screen"><div className="court-grid" /><nav className="intro-nav"><span className="brand-mark">FCL</span><span>FULL COURT LEGACY</span><span className="edition">CAREER MODE · 2026</span>{achievementButton}</nav><section className="intro-copy"><p className="kicker">ONE CAREER. EVERY DECISION COUNTS.</p><h1>MAKE YOUR<br /><em>LEGACY.</em></h1><p className="intro-description">Start at eighteen in Europe or college. Fight for offers, decide when to enter the draft, survive injuries and build a career worth replaying.</p><button className="primary-action" onClick={beginCareer}>START A NEW CAREER <span>→</span></button><p className="save-note">Career progress and achievements save automatically on this device.</p></section><div className="intro-player" aria-hidden="true"><span className="player-number">01</span><div className="silhouette" /><div className="ball" /></div><footer className="legal">Unofficial fan-made career simulation. Team and league names and marks belong to their respective owners.</footer>{achievementModal}</main>;
  }

  if (game.stage === "setup") {
    return <main className="setup-screen"><header className="game-nav"><button className="brand-button" onClick={() => setGame(DEFAULT)}><span className="brand-mark">FCL</span> FULL COURT LEGACY</button><span className="nav-label">CREATE YOUR PLAYER</span>{achievementButton}</header><section className="setup-card"><div className="setup-heading"><p className="kicker">THE JOURNEY STARTS HERE</p><h1>Build your player</h1><p>Your starting ability and hidden ceiling have already been randomized. Choose where the story begins.</p></div><div className="setup-grid"><div className="form-stack"><label>PLAYER NAME<input value={game.name} maxLength={24} placeholder="Enter your name" onChange={(event) => setGame((current) => ({ ...current, name: event.target.value }))} autoFocus /></label><fieldset><legend>STARTING PATH</legend><div className="origin-grid"><button aria-pressed={game.origin === "europe"} onClick={() => setGame((current) => ({ ...current, origin: "europe" }))}><span>EU</span><strong>START IN EUROPE</strong><small>Join a professional club. Earn moves to continental giants or chase the NBA later.</small></button><button aria-pressed={game.origin === "usa"} onClick={() => setGame((current) => ({ ...current, origin: "usa" }))}><span>US</span><strong>START IN COLLEGE</strong><small>Enter the NCAA. Transfer, stay to develop, or declare when scouts believe.</small></button></div></fieldset><fieldset><legend>POSITION</legend><div className="segmented">{(["PG", "SG", "SF", "PF", "C"] as Position[]).map((position) => <button key={position} aria-pressed={game.position === position} onClick={() => setGame((current) => ({ ...current, position, archetype: ARCHETYPES[position][0] }))}>{position}</button>)}</div></fieldset><fieldset><legend>ARCHETYPE</legend><div className="archetype-list">{ARCHETYPES[game.position].map((archetype, index) => <button key={archetype} aria-pressed={game.archetype === archetype} onClick={() => setGame((current) => ({ ...current, archetype }))}><span>{String(index + 1).padStart(2, "0")}</span><strong>{archetype}</strong><small>{index === 0 ? "Balanced foundation" : index === 1 ? "Offensive upside" : "Defense changes games"}</small></button>)}</div></fieldset></div><aside className="player-preview"><p>PROSPECT CARD</p><div className="prospect-number">{game.position}</div><div className="preview-silhouette" /><h2>{game.name || "YOUR NAME"}</h2><span>{game.archetype}</span><div className="preview-stats"><div><strong>{game.startingOvr}</strong><small>OVR</small></div><div><strong>?</strong><small>HIDDEN POT</small></div><div><strong>18</strong><small>AGE</small></div></div></aside></div><button className="primary-action setup-submit" disabled={!game.name.trim() || !game.origin} onClick={confirmPlayer}>REVEAL MY DESTINATION <span>→</span></button></section>{achievementModal}</main>;
  }

  if (game.stage === "retired") {
    const totalGames = game.history.reduce((sum, season) => sum + season.games, 0);
    const peak = Math.max(game.ovr, ...game.history.map((season) => season.ovr));
    return <main className="retirement-screen"><div className="retired-watermark">LEGACY</div><p className="kicker">CAREER COMPLETE</p><h1>{game.name}</h1><h2>THE FINAL BUZZER</h2><p>{game.rings > 1 ? "An era-defining champion." : game.legacy > 500 ? "A career the game will remember." : "Every possession helped write the story."}</p><div className="retired-stats"><div><strong>{game.history.length}</strong><span>SEASONS</span></div><div><strong>{totalGames}</strong><span>GAMES</span></div><div><strong>{peak}</strong><span>PEAK OVR</span></div><div><strong>{game.rings}</strong><span>RINGS</span></div><div><strong>{formatMoney(game.cash)}</strong><span>NET WORTH</span></div></div><div className="award-strip">{game.awards.length ? game.awards.map((award) => <span key={award}>{award}</span>) : <span>CAREER COMPLETE</span>}</div><div className="retirement-actions"><button className="primary-action" onClick={resetGame}>START ANOTHER CAREER <span>↻</span></button><button className="secondary-action" onClick={() => setShowAchievements(true)}>VIEW ACHIEVEMENTS</button></div>{achievementModal}</main>;
  }

  const current = game.history[0];
  const ovrTone = game.lastDelta > 0 ? "+" : "";
  const collegeEligibilityOver = game.team.path === "college" && game.age >= 22;
  return <main className="career-shell"><header className="game-nav"><button className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brand-mark">FCL</span><span className="brand-full">FULL COURT LEGACY</span></button><div className="season-chip"><span>{game.offseason ? "OFFSEASON" : "SEASON"}</span><strong>{game.year}-{String(game.year + 1).slice(2)}</strong></div><div className="save-status"><i /> CAREER SAVED</div>{achievementButton}<button className="text-button" onClick={() => setShowReset(true)}>NEW CAREER</button></header><section className="player-hero"><div className="hero-identity">{teamMark(game.team)}<div><p>{game.team.league} · YEAR {game.history.length + 1}</p><h1>{game.name}</h1><div className="player-meta"><span>#{game.position === "PG" ? 1 : game.position === "C" ? 33 : 11}</span><span>{game.position}</span><span>{game.archetype}</span><span>AGE {game.age}</span></div></div></div><div className="hero-team"><small>CURRENT TEAM</small><strong>{game.team.name}</strong><span>{game.team.league}</span></div><div className="ovr-block"><span>OVERALL</span><strong>{game.ovr}</strong><small className={game.lastDelta >= 0 ? "positive" : "negative"}>{game.history.length ? `${ovrTone}${game.lastDelta} LAST YEAR` : "PROSPECT"}</small></div></section><div className="dashboard-grid"><section className="main-column">

    {game.offseason ? <><div className="section-title"><div><p className="kicker">YOUR FUTURE</p><h2>Choose the next chapter</h2></div><span>STAY · ACCEPT AN OFFER · DECLARE</span></div><div className="offseason-summary"><strong>{game.draftProjection}</strong><span>{offers.length ? `${offers.length} earned offer${offers.length > 1 ? "s" : ""}` : "No better team has made an offer"}</span></div><div className="offseason-grid">{!collegeEligibilityOver && <button className="destination-card stay-card" onClick={() => chooseDestination(game.team)}>{teamMark(game.team, true)}<p>STAY</p><h3>{game.team.name}</h3><div>Keep your role, chemistry and continuity. Another year may improve your options.</div><span>COMMIT TO STAY →</span></button>}{offers.map((team) => <button className="destination-card" key={team.name} onClick={() => chooseDestination(team)}>{teamMark(team, true)}<p>{team.path === "europe" && game.team.path === "college" ? "PRO OFFER" : "BETTER TEAM OFFER"}</p><h3>{team.name}</h3><div>{team.league} · Prestige {team.prestige}. You earned this move; the role must still be won.</div><span>ACCEPT OFFER →</span></button>)}{game.draftEligible && <button className="destination-card draft-card" onClick={declareForDraft}><div className="draft-badge">NBA</div><p>DECLARE FOR THE DRAFT</p><h3>{game.draftProjection}</h3><div>Leave {game.team.path === "college" ? "college" : "Europe"} and let draft night decide your first NBA home.</div><span>ENTER THE DRAFT →</span></button>}</div>{collegeEligibilityOver && !game.draftEligible && <div className="eligibility-note"><strong>College eligibility is complete.</strong><span>Your current draft stock is too low. Accept a professional European offer to continue.</span></div>}</> : <><div className="section-title"><div><p className="kicker">THE DECISION</p><h2>What will define age {game.age}?</h2></div><span>CHOOSE ONE · THE YEAR WILL SIMULATE</span></div><div className="choice-grid">{choices.map((choice, index) => <button key={choice.id} className="choice-card" onClick={() => playSeason(choice)}><span className="choice-index">0{index + 1}</span><p>{choice.eyebrow}</p><h3>{choice.title}</h3><div>{choice.body}</div><dl><dt>UPSIDE</dt><dd>{choice.upside}</dd><dt>RISK</dt><dd>{choice.risk}</dd></dl><span className="choose-link">COMMIT TO THIS PATH <b>→</b></span></button>)}</div></>}

    <section className="event-panel"><div className="event-icon">!</div><div><p className="kicker">LATEST FROM THE LOCKER ROOM</p><h3>{game.lastEvent}</h3></div><span className={game.lastDelta >= 0 ? "delta positive" : "delta negative"}>{game.history.length ? `${ovrTone}${game.lastDelta} OVR` : "READY"}</span></section><section className="performance-panel"><div className="section-title compact"><div><p className="kicker">PERFORMANCE FILE</p><h2>{current ? current.year : "PRESEASON"}</h2></div><span>{current?.result || "YOUR FIRST YEAR AWAITS"}</span></div><div className="stat-line"><div><strong>{current?.games ?? 0}</strong><span>GP</span></div><div><strong>{current?.points ?? "—"}</strong><span>PPG</span></div><div><strong>{current?.assists ?? "—"}</strong><span>APG</span></div><div><strong>{current?.rebounds ?? "—"}</strong><span>RPG</span></div></div><div className="ratings">{[{ n: "OFFENSE", v: clamp(game.ovr + 3) }, { n: "PLAYMAKING", v: clamp(game.ovr + (game.position === "PG" ? 6 : -2)) }, { n: "DEFENSE", v: clamp(game.ovr - 2) }, { n: "ATHLETICISM", v: clamp(game.health - 7) }].map((rating) => <div key={rating.n}><span>{rating.n}</span><div><i style={{ width: `${rating.v}%` }} /></div><strong>{rating.v}</strong></div>)}</div></section><section className="history-panel"><div className="section-title compact"><div><p className="kicker">CAREER LEDGER</p><h2>Season by season</h2></div><span>{game.history.length} SEASONS</span></div>{game.history.length === 0 ? <div className="empty-history">Your first line will be written after this decision.</div> : <div className="history-table"><div className="history-row history-head"><span>YEAR</span><span>TEAM</span><span>OVR</span><span>PPG</span><span>RESULT</span></div>{game.history.map((season) => <div className="history-row" key={`${season.year}-${season.team}`}><span>{season.year}</span><span>{season.team}</span><strong>{season.ovr}</strong><span>{season.points}</span><span>{season.result}</span></div>)}</div>}</section></section><aside className="side-column"><section className="side-panel contract-panel"><p className="kicker">{game.team.path === "college" ? "PROGRAM" : "CONTRACT"}</p><div className="team-contract">{teamMark(game.team, true)}<div><strong>{game.team.name}</strong><span>{game.team.path === "college" ? `${Math.max(0, 22 - game.age)} YEARS ELIGIBILITY` : `${game.contractYears} YEARS REMAINING`}</span></div></div><div className="money-grid"><div><span>SALARY</span><strong>{formatMoney(game.salary)}</strong><small>PER YEAR</small></div><div><span>NET WORTH</span><strong>{formatMoney(game.cash)}</strong><small>ESTIMATED</small></div></div></section><section className="side-panel"><p className="kicker">BODY & MIND</p><div className="meter-list"><Meter label="HEALTH" value={game.health} /><Meter label="MORALE" value={game.morale} /></div></section><section className="side-panel"><p className="kicker">INNER CIRCLE</p><div className="relationship-list"><Relationship icon="C" label="COACH" value={game.coach} /><Relationship icon="T" label="TEAMMATES" value={game.teammates} /><Relationship icon="F" label="FANS" value={game.fans} /></div></section><section className="side-panel legacy-panel"><p className="kicker">LEGACY</p><div className="legacy-score"><strong>{game.legacy}</strong><span>LEGACY POINTS</span></div><div className="trophy-grid"><div><strong>{game.rings}</strong><span>RINGS</span></div><div><strong>{game.awards.length}</strong><span>AWARDS</span></div></div><div className="award-list">{game.awards.length ? game.awards.map((award) => <span key={award}>★ {award}</span>) : <p>The cabinet is empty. For now.</p>}</div></section><section className="side-panel achievement-progress"><p className="kicker">CAREER CHALLENGES</p><strong>{achievementIds.length}/{ACHIEVEMENTS.length}</strong><span>{achievementPoints} ACHIEVEMENT POINTS</span><button onClick={() => setShowAchievements(true)}>OPEN TROPHY ROOM →</button></section><section className="side-panel disclaimer"><strong>UNOFFICIAL FAN GAME</strong><p>Not affiliated with or endorsed by any team, league or governing body. Names and marks belong to their respective owners.</p></section></aside></div>{showReset && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowReset(false)}><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={(event) => event.stopPropagation()}><p className="kicker">START OVER?</p><h2 id="reset-title">This career will be erased.</h2><p>{game.name}'s {game.history.length}-season journey cannot be recovered. Achievements remain unlocked.</p><div><button className="secondary-action" onClick={() => setShowReset(false)}>KEEP PLAYING</button><button className="danger-action" onClick={resetGame}>ERASE CAREER</button></div></div></div>}{achievementModal}{justUnlocked && <button className="achievement-toast" onClick={() => setJustUnlocked(null)}><span>ACHIEVEMENT UNLOCKED</span><strong>{justUnlocked.title}</strong><small>+{justUnlocked.points} PTS · TAP TO DISMISS</small></button>}</main>;
}

function AchievementModal({ earned, onClose }: { earned: string[]; onClose: () => void }) {
  const points = ACHIEVEMENTS.filter((item) => earned.includes(item.id)).reduce((sum, item) => sum + item.points, 0);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="achievement-modal" role="dialog" aria-modal="true" aria-labelledby="achievement-title" onMouseDown={(event) => event.stopPropagation()}><div className="achievement-heading"><div><p className="kicker">PERSISTENT ACROSS CAREERS</p><h2 id="achievement-title">Trophy Room</h2></div><div><strong>{earned.length}/{ACHIEVEMENTS.length}</strong><span>{points} PTS</span></div></div><div className="achievement-grid">{ACHIEVEMENTS.map((achievement) => { const unlocked = earned.includes(achievement.id); return <article key={achievement.id} className={unlocked ? "unlocked" : "locked"}><div>{unlocked ? "★" : "?"}</div><span>{achievement.points} PTS</span><h3>{achievement.title}</h3><p>{achievement.body}</p></article>; })}</div><button className="secondary-action" onClick={onClose}>CLOSE TROPHY ROOM</button></section></div>;
}

function Meter({ label, value }: { label: string; value: number }) { return <div className="meter"><div><span>{label}</span><strong>{value}</strong></div><div><i style={{ width: `${value}%` }} /></div></div>; }

function Relationship({ icon, label, value }: { icon: string; label: string; value: number }) { return <div className="relationship"><span>{icon}</span><div><strong>{label}</strong><div><i style={{ width: `${value}%` }} /></div></div><b>{value}</b></div>; }
