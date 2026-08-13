"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Position = "PG" | "SG" | "SF" | "PF" | "C";
type Stage = "intro" | "setup" | "career" | "retired";
type Origin = "europe" | "usa" | null;
type TeamPath = "europe" | "college" | "nba";
type CareerRole = "Featured starter" | "Starter" | "Rotation";
type MobileTab = "season" | "career" | "player";
type AttributeKey =
  | "scoring"
  | "playmaking"
  | "defense"
  | "rebounding"
  | "athleticism";

type PlayerAttributes = Record<AttributeKey, number>;

type Team = {
  name: string;
  short: string;
  league: string;
  logo: string;
  color: string;
  accent: string;
  prestige: number;
  path: TeamPath;
  logoScale?: number;
  logoY?: number;
};

type TeamOffer = {
  teamName: string;
  role: CareerRole;
  direction: "step-up" | "playtime" | "pro";
  contractYears: number;
};

type SeasonFeedback = {
  season: string;
  event: string;
  result: string;
  ovrBefore: number;
  ovrAfter: number;
  healthBefore: number;
  healthAfter: number;
  attributesBefore: PlayerAttributes;
  attributesAfter: PlayerAttributes;
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
  jerseyNumber: string;
  position: Position;
  archetype: string;
  origin: Origin;
  phase: TeamPath;
  age: number;
  year: number;
  startingOvr: number;
  ovr: number;
  potential: number;
  attributes: PlayerAttributes;
  team: Team;
  role: CareerRole;
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
  offers: TeamOffer[];
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
  {
    name: "Paris Basketball",
    short: "PAR",
    league: "LNB Pro A",
    logo: "teams/paris.png",
    color: "#ff5d2e",
    accent: "#161b33",
    prestige: 68,
    path: "europe",
  },
  {
    name: "Maccabi Tel Aviv",
    short: "MTA",
    league: "Israeli Premier League",
    logo: "teams/maccabi-tel-aviv.png",
    color: "#f5c928",
    accent: "#194f9e",
    prestige: 74,
    path: "europe",
    logoScale: 1.02,
  },
  {
    name: "FC Barcelona",
    short: "FCB",
    league: "Liga ACB",
    logo: "teams/barcelona.png",
    color: "#9b1634",
    accent: "#1659c9",
    prestige: 88,
    path: "europe",
    logoScale: 0.9,
    logoY: 2,
  },
  {
    name: "Real Madrid",
    short: "RMA",
    league: "Liga ACB",
    logo: "teams/real-madrid.png",
    color: "#f7f7f2",
    accent: "#7256ff",
    prestige: 92,
    path: "europe",
    logoScale: 0.88,
    logoY: -1,
  },
  {
    name: "UCLA Bruins",
    short: "UCLA",
    league: "NCAA",
    logo: "teams/ucla.png",
    color: "#2d68c4",
    accent: "#f3c43d",
    prestige: 76,
    path: "college",
  },
  {
    name: "Kentucky Wildcats",
    short: "UK",
    league: "NCAA",
    logo: "teams/kentucky.png",
    color: "#0033a0",
    accent: "#ffffff",
    prestige: 80,
    path: "college",
  },
  {
    name: "Duke Blue Devils",
    short: "DUKE",
    league: "NCAA",
    logo: "teams/duke.png",
    color: "#003087",
    accent: "#ffffff",
    prestige: 85,
    path: "college",
  },
  {
    name: "UConn Huskies",
    short: "CONN",
    league: "NCAA",
    logo: "teams/uconn.png",
    color: "#000e2f",
    accent: "#ffffff",
    prestige: 86,
    path: "college",
  },
  {
    name: "Charlotte Hornets",
    short: "CHA",
    league: "NBA",
    logo: "teams/charlotte-hornets.png",
    color: "#00788c",
    accent: "#1d1160",
    prestige: 64,
    path: "nba",
  },
  {
    name: "Detroit Pistons",
    short: "DET",
    league: "NBA",
    logo: "teams/detroit-pistons.png",
    color: "#c8102e",
    accent: "#1d42ba",
    prestige: 68,
    path: "nba",
  },
  {
    name: "Orlando Magic",
    short: "ORL",
    league: "NBA",
    logo: "teams/orlando-magic.png",
    color: "#0077c0",
    accent: "#c4ced4",
    prestige: 72,
    path: "nba",
  },
  {
    name: "Chicago Bulls",
    short: "CHI",
    league: "NBA",
    logo: "teams/chicago-bulls.png",
    color: "#ce1141",
    accent: "#f4f4ef",
    prestige: 76,
    path: "nba",
  },
  {
    name: "New York Knicks",
    short: "NYK",
    league: "NBA",
    logo: "teams/new-york-knicks.png",
    color: "#f58426",
    accent: "#006bb6",
    prestige: 82,
    path: "nba",
  },
  {
    name: "Miami Heat",
    short: "MIA",
    league: "NBA",
    logo: "teams/miami-heat.png",
    color: "#98002e",
    accent: "#f9a01b",
    prestige: 87,
    path: "nba",
  },
  {
    name: "Golden State Warriors",
    short: "GSW",
    league: "NBA",
    logo: "teams/golden-state-warriors.png",
    color: "#1d428a",
    accent: "#ffc72c",
    prestige: 90,
    path: "nba",
  },
  {
    name: "Los Angeles Lakers",
    short: "LAL",
    league: "NBA",
    logo: "teams/la-lakers.png",
    color: "#fdb927",
    accent: "#552583",
    prestige: 93,
    path: "nba",
  },
  {
    name: "Boston Celtics",
    short: "BOS",
    league: "NBA",
    logo: "teams/boston-celtics.png",
    color: "#007a33",
    accent: "#ba9653",
    prestige: 95,
    path: "nba",
  },
];

const DEFAULT: GameState = {
  stage: "intro",
  name: "",
  jerseyNumber: "1",
  position: "PG",
  archetype: "Floor General",
  origin: null,
  phase: "europe",
  age: 18,
  year: 2026,
  startingOvr: 50,
  ovr: 50,
  potential: 78,
  attributes: {
    scoring: 52,
    playmaking: 55,
    defense: 48,
    rebounding: 43,
    athleticism: 54,
  },
  team: TEAMS[0],
  role: "Rotation",
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
  offers: [],
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
  {
    text: "A veteran stayed late to work on your footwork.",
    delta: 1,
    health: 0,
    morale: 4,
  },
  {
    text: "A fourth-quarter run finally put scouts on notice.",
    delta: 1,
    health: -2,
    morale: 5,
  },
  {
    text: "A minor ankle sprain cost you three weeks.",
    delta: -2,
    health: -18,
    morale: -3,
  },
  {
    text: "Your shooting coach rebuilt your release.",
    delta: 1,
    health: 0,
    morale: 2,
  },
  {
    text: "A locker-room argument damaged team chemistry.",
    delta: -1,
    health: 0,
    morale: -8,
  },
  {
    text: "Heavy minutes exposed gaps in your game.",
    delta: -2,
    health: -10,
    morale: -4,
  },
  {
    text: "A national-team camp raised your confidence.",
    delta: 1,
    health: -4,
    morale: 6,
  },
  {
    text: "A mentor changed how you read pick-and-roll coverages.",
    delta: 1,
    health: 0,
    morale: 4,
  },
  {
    text: "A wrist injury interrupted your best stretch.",
    delta: -3,
    health: -24,
    morale: -6,
  },
  {
    text: "You struggled when opponents adjusted to your tendencies.",
    delta: -2,
    health: -3,
    morale: -5,
  },
  {
    text: "A playoff breakthrough changed the way coaches see you.",
    delta: 1,
    health: -7,
    morale: 7,
  },
  {
    text: "A quiet season left scouts divided about your ceiling.",
    delta: -1,
    health: 0,
    morale: -2,
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-season",
    title: "First Steps",
    body: "Complete your first season.",
    points: 10,
  },
  {
    id: "european-roots",
    title: "European Roots",
    body: "Begin a career in Europe.",
    points: 15,
  },
  {
    id: "campus-life",
    title: "Campus Life",
    body: "Complete a college season.",
    points: 15,
  },
  {
    id: "draft-night",
    title: "Draft Night",
    body: "Make it to the NBA through the draft.",
    points: 25,
  },
  {
    id: "hidden-gem",
    title: "Hidden Gem",
    body: "Start at 47 OVR or lower and reach 75.",
    points: 40,
  },
  {
    id: "loyalty",
    title: "One Crest",
    body: "Play five seasons for the same team.",
    points: 30,
  },
  {
    id: "journeyman",
    title: "Passport Full",
    body: "Represent four different teams.",
    points: 25,
  },
  {
    id: "millionaire",
    title: "Generational Money",
    body: "Build a $10M net worth.",
    points: 20,
  },
  {
    id: "all-star",
    title: "Among the Stars",
    body: "Earn an All-Star selection.",
    points: 25,
  },
  {
    id: "champion",
    title: "Banner Season",
    body: "Win a championship.",
    points: 40,
  },
  {
    id: "mvp",
    title: "Best in the World",
    body: "Win league MVP.",
    points: 60,
  },
  {
    id: "dynasty",
    title: "Dynasty",
    body: "Win three championships in one career.",
    points: 75,
  },
  {
    id: "ironman",
    title: "Built to Last",
    body: "Play ten seasons and keep health above 75.",
    points: 40,
  },
  {
    id: "legend",
    title: "Full Court Legend",
    body: "Reach 92 OVR or 1,000 legacy points.",
    points: 100,
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function seededPick<T>(items: T[], seed: number) {
  const index = Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % items.length;
  return items[Math.floor(index)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatMoney(value: number) {
  if (value <= 0) return "$0";
  if (value < 1) return `$${Math.round(value * 1000)}K`;
  return `$${value.toFixed(value >= 10 ? 1 : 2)}M`;
}

function salaryFor(team: Team, ovr: number) {
  if (team.path === "college") return 0;
  if (team.path === "nba")
    return Math.max(0.9, Math.pow(Math.max(1, ovr - 52), 1.38) / 8);
  return Math.max(0.06, Math.pow(Math.max(1, ovr - 42), 1.22) / 20);
}

function projectionFor(ovr: number) {
  if (ovr >= 78) return "Lottery projection";
  if (ovr >= 70) return "First-round projection";
  if (ovr >= 64) return "Second-round projection";
  if (ovr >= 60) return "Fringe / two-way projection";
  return "Not on draft boards";
}

const ATTRIBUTE_KEYS: AttributeKey[] = [
  "scoring",
  "playmaking",
  "defense",
  "rebounding",
  "athleticism",
];

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  scoring: "SCORING",
  playmaking: "PLAYMAKING",
  defense: "DEFENSE",
  rebounding: "REBOUNDING",
  athleticism: "ATHLETICISM",
};

const POSITION_WEIGHTS: Record<Position, PlayerAttributes> = {
  PG: {
    scoring: 0.25,
    playmaking: 0.31,
    defense: 0.17,
    rebounding: 0.07,
    athleticism: 0.2,
  },
  SG: {
    scoring: 0.32,
    playmaking: 0.2,
    defense: 0.2,
    rebounding: 0.08,
    athleticism: 0.2,
  },
  SF: {
    scoring: 0.26,
    playmaking: 0.15,
    defense: 0.22,
    rebounding: 0.16,
    athleticism: 0.21,
  },
  PF: {
    scoring: 0.21,
    playmaking: 0.1,
    defense: 0.24,
    rebounding: 0.25,
    athleticism: 0.2,
  },
  C: {
    scoring: 0.18,
    playmaking: 0.08,
    defense: 0.27,
    rebounding: 0.29,
    athleticism: 0.18,
  },
};

function calculateOvr(attributes: PlayerAttributes, position: Position) {
  const weights = POSITION_WEIGHTS[position];
  return Math.round(
    ATTRIBUTE_KEYS.reduce(
      (total, key) => total + attributes[key] * weights[key],
      0,
    ),
  );
}

function attributesForProspect(
  overall: number,
  position: Position,
  archetype: string,
  seed: number,
): PlayerAttributes {
  const profile: PlayerAttributes = {
    scoring: overall,
    playmaking: overall,
    defense: overall,
    rebounding: overall,
    athleticism: overall,
  };
  const positionShape: Record<Position, Partial<PlayerAttributes>> = {
    PG: { playmaking: 6, rebounding: -7, scoring: 2 },
    SG: { scoring: 6, rebounding: -5, playmaking: 1 },
    SF: { scoring: 2, defense: 2, athleticism: 3, playmaking: -3 },
    PF: { rebounding: 5, defense: 3, playmaking: -6 },
    C: { rebounding: 7, defense: 6, playmaking: -8, scoring: -2 },
  };
  ATTRIBUTE_KEYS.forEach((key, index) => {
    const variation = Math.floor(Math.abs(Math.sin(seed + index * 29)) * 7) - 3;
    profile[key] += (positionShape[position][key] ?? 0) + variation;
  });
  const lowerArchetype = archetype.toLowerCase();
  if (/scorer|shooter|slasher|offensive|post/.test(lowerArchetype))
    profile.scoring += 4;
  if (/general|creator|point|maestro/.test(lowerArchetype))
    profile.playmaking += 4;
  if (/defender|lock|protector|two-way/.test(lowerArchetype))
    profile.defense += 4;
  if (/big|force|four|center/.test(lowerArchetype)) profile.rebounding += 3;

  const correction = overall - calculateOvr(profile, position);
  ATTRIBUTE_KEYS.forEach((key) => {
    profile[key] = clamp(profile[key] + correction, 35, 96);
  });
  return profile;
}

function developAttributes(
  game: GameState,
  choice: Choice,
  baseline: number,
  seed: number,
) {
  const next = { ...game.attributes };
  ATTRIBUTE_KEYS.forEach((key) => {
    next[key] = clamp(next[key] + baseline, 35, 99);
  });

  const add = (key: AttributeKey, value: number) => {
    next[key] = clamp(next[key] + value, 35, 99);
  };
  if (choice.effect === "train") {
    const primary =
      game.position === "PG"
        ? "playmaking"
        : game.position === "SG"
          ? "scoring"
          : game.position === "C"
            ? "defense"
            : "athleticism";
    add(primary, 2);
    add(seededPick(ATTRIBUTE_KEYS, seed + 53), 1);
  } else if (choice.effect === "team") {
    add("playmaking", 2);
    add("defense", 1);
    add("scoring", -1);
  } else if (choice.effect === "brand") {
    add("athleticism", -1);
  } else if (choice.effect === "health") {
    add("athleticism", 2);
  } else if (choice.effect === "lead") {
    add("scoring", 3);
    add("playmaking", 1);
    add("defense", -1);
  }
  if (game.age >= 31) add("athleticism", -1);

  const ceiling = Math.min(
    game.potential,
    choice.effect === "health" ? game.ovr + 1 : 99,
  );
  let guard = 0;
  while (calculateOvr(next, game.position) > ceiling && guard < 80) {
    const key = [...ATTRIBUTE_KEYS].sort(
      (a, b) =>
        next[b] * POSITION_WEIGHTS[game.position][b] -
        next[a] * POSITION_WEIGHTS[game.position][a],
    )[guard % ATTRIBUTE_KEYS.length];
    next[key] = Math.max(35, next[key] - 1);
    guard += 1;
  }
  return next;
}

function expectedMinutes(role: CareerRole) {
  return role === "Featured starter" ? 33 : role === "Starter" ? 26 : 16;
}

function developmentLabel(role: CareerRole, prestige: number) {
  const score = expectedMinutes(role) + (96 - prestige) * 0.15;
  return score >= 34 ? "ELITE" : score >= 28 ? "STRONG" : "LIMITED";
}

function titleOutlook(team: Team, ovr: number) {
  const score = team.prestige + ovr;
  return score >= 174 ? "CONTENDER" : score >= 155 ? "PLAYOFF PUSH" : "REBUILD";
}

async function createCareerCard(game: GameState) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  const totalGames = game.history.reduce(
    (sum, season) => sum + season.games,
    0,
  );
  const peak = Math.max(game.ovr, ...game.history.map((season) => season.ovr));
  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#070a10");
  gradient.addColorStop(0.58, "#0b1220");
  gradient.addColorStop(1, "#17213a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1200, 630);

  context.save();
  context.globalAlpha = 0.08;
  context.strokeStyle = "#91a1bd";
  context.lineWidth = 2;
  for (let x = 0; x <= 1200; x += 60) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 630);
    context.stroke();
  }
  for (let y = 0; y <= 630; y += 60) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(1200, y);
    context.stroke();
  }
  context.restore();

  context.fillStyle = game.team.color;
  context.fillRect(0, 0, 12, 630);
  context.fillStyle = "#caff35";
  context.fillRect(68, 54, 72, 72);
  context.fillStyle = "#07100c";
  context.font = "800 21px Inter, sans-serif";
  context.textAlign = "center";
  context.fillText("FCL", 104, 98);
  context.textAlign = "left";
  context.fillStyle = "#caff35";
  context.font = "800 18px Inter, sans-serif";
  context.fillText("FULL COURT LEGACY · CAREER CARD", 164, 84);
  context.fillStyle = "#7c879f";
  context.font = "700 14px Inter, sans-serif";
  context.fillText("THE FINAL BUZZER", 164, 112);

  context.fillStyle = "#eef2ff";
  context.font = "800 82px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  context.fillText(game.name.toUpperCase(), 68, 222, 770);
  context.fillStyle = "#35dcff";
  context.font = "800 25px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  context.fillText(
    `#${game.jerseyNumber} · ${game.position} · ${game.archetype.toUpperCase()}`,
    72,
    260,
  );

  context.textAlign = "right";
  context.fillStyle = "#202b42";
  context.font = "800 170px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  context.fillText(String(peak), 1128, 222);
  context.fillStyle = "#caff35";
  context.font = "800 14px Inter, sans-serif";
  context.fillText("PEAK OVERALL", 1122, 255);
  context.textAlign = "left";

  const statItems = [
    [String(game.history.length), "SEASONS"],
    [String(totalGames), "GAMES"],
    [String(game.rings), "RINGS"],
    [String(game.awards.length), "AWARDS"],
    [String(game.legacy), "LEGACY"],
  ];
  statItems.forEach(([value, label], index) => {
    const x = 68 + index * 214;
    context.fillStyle = "#111827";
    context.fillRect(x, 304, 190, 104);
    context.strokeStyle = "#283247";
    context.strokeRect(x, 304, 190, 104);
    context.fillStyle = "#eef2ff";
    context.font = "800 40px 'Barlow Condensed', 'Arial Narrow', sans-serif";
    context.fillText(value, x + 18, 356);
    context.fillStyle = "#7c879f";
    context.font = "800 11px Inter, sans-serif";
    context.fillText(label, x + 18, 383);
  });

  context.fillStyle = "#7c879f";
  context.font = "800 11px Inter, sans-serif";
  context.fillText("PLAYER DNA", 68, 455);
  ATTRIBUTE_KEYS.forEach((key, index) => {
    const x = 68 + index * 214;
    context.fillStyle = "#222a3a";
    context.fillRect(x, 478, 158, 8);
    const attributeGradient = context.createLinearGradient(x, 0, x + 158, 0);
    attributeGradient.addColorStop(0, "#8067ff");
    attributeGradient.addColorStop(1, "#35dcff");
    context.fillStyle = attributeGradient;
    context.fillRect(x, 478, (158 * game.attributes[key]) / 100, 8);
    context.fillStyle = "#eef2ff";
    context.font = "800 15px Inter, sans-serif";
    context.fillText(String(game.attributes[key]), x + 168, 486);
    context.fillStyle = "#7c879f";
    context.font = "700 10px Inter, sans-serif";
    context.fillText(ATTRIBUTE_LABELS[key], x, 510);
  });

  const journey = game.teamsPlayed.slice(-4).join("  →  ");
  context.fillStyle = "#caff35";
  context.font = "800 12px Inter, sans-serif";
  context.fillText("CAREER JOURNEY", 68, 567);
  context.fillStyle = "#a9b4ca";
  context.font = "700 17px Inter, sans-serif";
  context.fillText(journey, 68, 596, 1064);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Card failed"))),
      "image/png",
    ),
  );
  const safeName = game.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return new File([blob], `${safeName || "career"}-full-court-legacy.png`, {
    type: "image/png",
  });
}

function offersFor(
  game: GameState,
  ovr: number,
  age: number,
  seed: number,
): TeamOffer[] {
  if (game.team.path === "college" && age >= 22) {
    const pro = seededPick(
      TEAMS.filter((team) => team.path === "europe" && team.prestige <= 74),
      seed,
    );
    return [
      {
        teamName: pro.name,
        role: "Featured starter",
        direction: "pro",
        contractYears: 3,
      },
    ];
  }

  const samePath = TEAMS.filter(
    (team) => team.path === game.team.path && team.name !== game.team.name,
  );
  const threshold =
    game.team.path === "nba" ? 15 : game.team.path === "europe" ? 19 : 22;
  const stepUps = samePath.filter(
    (team) =>
      team.prestige > game.team.prestige && ovr >= team.prestige - threshold,
  );
  const playtimeMoves = samePath.filter(
    (team) => team.prestige < game.team.prestige - 2,
  );
  const offers: TeamOffer[] = [];

  if (stepUps.length) {
    const team = seededPick(stepUps, seed + 7);
    offers.push({
      teamName: team.name,
      role: ovr >= team.prestige - 9 ? "Starter" : "Rotation",
      direction: "step-up",
      contractYears: 3,
    });
  }
  if (playtimeMoves.length) {
    const team = seededPick(playtimeMoves, seed + 31);
    offers.push({
      teamName: team.name,
      role: "Featured starter",
      direction: "playtime",
      contractYears: 2,
    });
  }

  return offers;
}

function achievementIdsFor(game: GameState) {
  const ids: string[] = [];
  if (game.history.length >= 1) ids.push("first-season");
  if (game.origin === "europe" && game.history.length >= 1)
    ids.push("european-roots");
  if (
    game.origin === "usa" &&
    game.history.some(
      (season) =>
        TEAMS.find((team) => team.name === season.team)?.path === "college",
    )
  )
    ids.push("campus-life");
  if (game.phase === "nba") ids.push("draft-night");
  if (game.startingOvr <= 47 && game.ovr >= 75) ids.push("hidden-gem");
  const seasonsByTeam = game.history.reduce<Record<string, number>>(
    (map, season) => ({ ...map, [season.team]: (map[season.team] ?? 0) + 1 }),
    {},
  );
  if (Object.values(seasonsByTeam).some((count) => count >= 5))
    ids.push("loyalty");
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
  return (
    <span
      className={`team-mark ${small ? "team-mark-small" : ""}`}
      style={
        {
          "--team": team.color,
          "--team-accent": team.accent,
          "--logo-scale": team.logoScale ?? 1,
          "--logo-y": `${team.logoY ?? 0}%`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <img src={team.logo} alt="" />
    </span>
  );
}

export default function Home() {
  const [game, setGame] = useState<GameState>(DEFAULT);
  const [achievementIds, setAchievementIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<Achievement | null>(null);
  const [seasonFeedback, setSeasonFeedback] = useState<SeasonFeedback | null>(
    null,
  );
  const [shareStatus, setShareStatus] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("season");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("full-court-legacy-save");
      const trophies = localStorage.getItem("full-court-legacy-achievements");
      const profile = JSON.parse(
        localStorage.getItem("full-court-legacy-profile") ?? "{}",
      ) as { name?: string; jerseyNumber?: string };
      // This client-only hydration restores the device's saved trophy room.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (trophies) setAchievementIds(JSON.parse(trophies));
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<GameState> & {
          offerNames?: string[];
        };
        const team =
          TEAMS.find((entry) => entry.name === parsed.team?.name) ??
          DEFAULT.team;
        const startingOvr = parsed.startingOvr ?? parsed.ovr ?? DEFAULT.ovr;
        const potential = clamp(
          parsed.potential ?? startingOvr + 18,
          Math.min(93, startingOvr + 10),
          93,
        );
        const offers = (
          parsed.offers ??
          (parsed.offerNames ?? []).map((teamName) => ({
            teamName,
            role: "Rotation" as CareerRole,
            direction: "step-up" as const,
            contractYears: 3,
          }))
        ).map((offer) => ({
          ...offer,
          contractYears: offer.contractYears ?? 3,
        }));
        const attributes =
          parsed.attributes ??
          attributesForProspect(
            clamp(parsed.ovr ?? startingOvr, 38, potential),
            parsed.position ?? DEFAULT.position,
            parsed.archetype ?? DEFAULT.archetype,
            (parsed.year ?? DEFAULT.year) + (parsed.age ?? DEFAULT.age),
          );
        setGame({
          ...DEFAULT,
          ...parsed,
          name: parsed.name ?? profile.name ?? "",
          jerseyNumber: parsed.jerseyNumber ?? profile.jerseyNumber ?? "1",
          origin: parsed.origin ?? (team.path === "college" ? "usa" : "europe"),
          phase: team.path,
          startingOvr,
          potential,
          attributes,
          ovr: Math.min(
            calculateOvr(attributes, parsed.position ?? DEFAULT.position),
            potential,
          ),
          team,
          role: parsed.role ?? "Rotation",
          teamsPlayed: parsed.teamsPlayed ?? [team.name],
          offers,
          offseason: parsed.offseason ?? false,
        });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("full-court-legacy-save", JSON.stringify(game));
    if (game.name.trim() && /^\d{1,2}$/.test(game.jerseyNumber)) {
      localStorage.setItem(
        "full-court-legacy-profile",
        JSON.stringify({
          name: game.name.trim(),
          jerseyNumber: game.jerseyNumber,
        }),
      );
    }
    const newlyEarned = achievementIdsFor(game).filter(
      (id) => !achievementIds.includes(id),
    );
    if (newlyEarned.length) {
      const updated = [...achievementIds, ...newlyEarned];
      // Achievement persistence is intentionally synchronized with career state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAchievementIds(updated);
      localStorage.setItem(
        "full-court-legacy-achievements",
        JSON.stringify(updated),
      );
      setJustUnlocked(
        ACHIEVEMENTS.find((item) => item.id === newlyEarned[0]) ?? null,
      );
    }
  }, [game, loaded, achievementIds]);

  const achievementPoints = ACHIEVEMENTS.filter((item) =>
    achievementIds.includes(item.id),
  ).reduce((sum, item) => sum + item.points, 0);

  const choices = useMemo<Choice[]>(() => {
    const core: Choice[] = [
      {
        id: "work",
        eyebrow: "DEVELOPMENT",
        title: "Live in the gym",
        body: "Chase improvement with an unforgiving training load.",
        upside: "+1 development · Coach trust",
        risk: "-12 health · Injury risk",
        effect: "train",
      },
      {
        id: "chemistry",
        eyebrow: "LOCKER ROOM",
        title: "Build the brotherhood",
        body: "Sacrifice touches and become the teammate everyone trusts.",
        upside: "Best title odds · Morale",
        risk: "No growth bonus",
        effect: "team",
      },
      {
        id: "brand",
        eyebrow: "OFF COURT",
        title: "Grow the brand",
        body: "Turn attention into endorsements and a bigger platform.",
        upside: "Money · Fans",
        risk: "-1 development · Coach trust",
        effect: "brand",
      },
      {
        id: "recover",
        eyebrow: "BODY",
        title: "Protect the future",
        body: "A protected season: no major injury and a serious recovery plan.",
        upside: "Guaranteed safety · +24 health",
        risk: "Growth capped at +1",
        effect: "health",
      },
      {
        id: "lead",
        eyebrow: "LEGACY",
        title: "Demand the spotlight",
        body: "Take the biggest shots and accept the pressure that follows.",
        upside: "Stats · Award chance",
        risk: "-1 development · Chemistry",
        effect: "lead",
      },
    ];
    if (game.health < 68) {
      const health = core.find((choice) => choice.effect === "health")!;
      return [
        health,
        seededPick(
          core.filter((choice) => choice.effect !== "health"),
          game.year * 3 + game.age,
        ),
      ];
    }
    const first = seededPick(core, game.year + game.ovr);
    return [
      first,
      seededPick(
        core.filter((choice) => choice.id !== first.id),
        game.year * 3 + game.age,
      ),
    ];
  }, [game.year, game.ovr, game.age, game.health]);

  const offers = game.offers
    .map((offer) => ({
      offer,
      team: TEAMS.find((team) => team.name === offer.teamName),
    }))
    .filter((item): item is { offer: TeamOffer; team: Team } =>
      Boolean(item.team),
    );

  function beginCareer() {
    const startingOvr = randomInt(43, 58);
    const eliteUpside = Math.random() < 0.08 ? randomInt(6, 10) : 0;
    const potential = clamp(
      startingOvr + randomInt(12, 25) + eliteUpside,
      58,
      93,
    );
    let remembered: { name?: string; jerseyNumber?: string } = {};
    try {
      remembered = JSON.parse(
        localStorage.getItem("full-court-legacy-profile") ?? "{}",
      );
    } catch {}
    setGame({
      ...DEFAULT,
      stage: "setup",
      name: remembered.name ?? "",
      jerseyNumber: remembered.jerseyNumber ?? "1",
      startingOvr,
      ovr: startingOvr,
      potential,
      attributes: attributesForProspect(
        startingOvr,
        DEFAULT.position,
        DEFAULT.archetype,
        randomInt(1, 10000),
      ),
      health: randomInt(82, 97),
      morale: randomInt(66, 88),
    });
  }

  function confirmPlayer() {
    if (
      !game.name.trim() ||
      !game.origin ||
      !/^\d{1,2}$/.test(game.jerseyNumber)
    )
      return;
    const pool =
      game.origin === "usa"
        ? TEAMS.filter((team) => team.path === "college")
        : TEAMS.filter((team) => team.path === "europe" && team.prestige <= 74);
    const team = pool[randomInt(0, pool.length - 1)];
    localStorage.setItem(
      "full-court-legacy-profile",
      JSON.stringify({
        name: game.name.trim(),
        jerseyNumber: game.jerseyNumber,
      }),
    );
    const attributes = attributesForProspect(
      game.startingOvr,
      game.position,
      game.archetype,
      game.year + game.name.length * 37 + Number(game.jerseyNumber),
    );
    setGame((current) => ({
      ...current,
      stage: "career",
      phase: team.path,
      team,
      attributes,
      ovr: calculateOvr(attributes, current.position),
      role: "Rotation",
      salary: salaryFor(team, current.ovr),
      contractYears: team.path === "college" ? 1 : 2,
      teamsPlayed: [team.name],
      lastEvent: `${current.name}'s journey begins with ${team.name}. Nothing is guaranteed.`,
    }));
  }

  function playSeason(choice: Choice) {
    const seed =
      game.year * 13 +
      game.ovr * 7 +
      choice.id.length +
      game.history.length * 17;
    const eventPool =
      choice.effect === "health"
        ? EVENTS.filter((item) => item.health >= 0)
        : EVENTS;
    const event = seededPick(eventPool, seed);
    const growthCurve =
      game.age < 22 ? 1 : game.age < 27 ? 0 : game.age < 31 ? -1 : -2;
    const variance = Math.floor(Math.abs(Math.sin(seed)) * 4) - 2;
    const effectDelta: Record<Choice["effect"], number> = {
      train: 1,
      team: 0,
      brand: -1,
      health: 0,
      lead: -1,
    };
    const roleDelta: Record<CareerRole, number> = {
      "Featured starter": 1,
      Starter: 0,
      Rotation: -1,
    };
    const ceilingPressure =
      game.ovr >= game.potential ? -2 : game.ovr >= game.potential - 3 ? -1 : 0;
    const healthPressure = game.health < 45 ? -2 : game.health < 65 ? -1 : 0;
    let projectedDelta = clamp(
      growthCurve +
        variance +
        effectDelta[choice.effect] +
        roleDelta[game.role] +
        event.delta +
        ceilingPressure +
        healthPressure,
      -4,
      3,
    );
    if (choice.effect === "health")
      projectedDelta = clamp(projectedDelta, -1, 1);
    const nextAttributes = developAttributes(
      game,
      choice,
      projectedDelta,
      seed,
    );
    const nextOvr = calculateOvr(nextAttributes, game.position);
    const delta = nextOvr - game.ovr;
    const isNBA = game.team.path === "nba";
    const isCollege = game.team.path === "college";
    const roleGames =
      game.role === "Featured starter" ? 5 : game.role === "Rotation" ? -5 : 0;
    const games = Math.max(
      18,
      (isNBA
        ? 56 + (seed % 27)
        : isCollege
          ? 25 + (seed % 12)
          : 24 + (seed % 14)) + roleGames,
    );
    const scoringShare = clamp((nextAttributes.scoring - 35) / 64, 0.08, 1);
    const playmakingShare = clamp(
      (nextAttributes.playmaking - 35) / 64,
      0.08,
      1,
    );
    const reboundingShare = clamp(
      (nextAttributes.rebounding - 35) / 64,
      0.08,
      1,
    );
    const roleScoring =
      game.role === "Featured starter" ? 3 : game.role === "Rotation" ? -2 : 0;
    const points =
      Math.round(
        (3.5 +
          scoringShare * 22 +
          roleScoring +
          (choice.effect === "lead" ? 2.5 : 0)) *
          10,
      ) / 10;
    const assists =
      Math.round(
        ((game.position === "PG" ? 2.2 : 0.8) +
          playmakingShare * 5.5 +
          roleScoring * 0.18) *
          10,
      ) / 10;
    const rebounds =
      Math.round(
        ((game.position === "C" || game.position === "PF" ? 3.2 : 1.2) +
          reboundingShare * 6.2 +
          roleScoring * 0.18) *
          10,
      ) / 10;
    const chemistryBoost =
      choice.effect === "team" ? 8 : (game.teammates - 50) / 5;
    const titleChance = Math.max(
      2,
      game.team.prestige + nextOvr + chemistryBoost - 166,
    );
    const wonTitle = Math.abs(Math.sin(seed * 5)) * 100 < titleChance;
    const madePlayoffs = game.team.prestige + nextOvr > 146;
    const result = wonTitle
      ? "Champions"
      : madePlayoffs
        ? isCollege
          ? "Tournament"
          : "Playoffs"
        : "Regular season";
    const newAwards = [...game.awards];
    if (
      isNBA &&
      points > 22 &&
      nextOvr >= 78 &&
      !newAwards.includes("All-Star")
    )
      newAwards.push("All-Star");
    if (
      isNBA &&
      nextOvr >= 89 &&
      points > 25 &&
      !newAwards.includes("League MVP")
    )
      newAwards.push("League MVP");
    if (
      !isNBA &&
      game.age <= 20 &&
      delta >= 3 &&
      !newAwards.includes("Rising Star")
    )
      newAwards.push("Rising Star");
    if (wonTitle && !newAwards.includes("Champion")) newAwards.push("Champion");

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
    const nextHistory = [season, ...game.history];
    const nextHealth = clamp(
      game.health +
        event.health +
        (choice.effect === "health"
          ? 24
          : choice.effect === "train"
            ? -12
            : -4),
    );
    const nextOffers = offersFor(game, nextOvr, nextAge, seed);
    const draftEligible =
      game.team.path !== "nba" && nextAge >= 19 && nextOvr >= 60;
    const nextState: GameState = {
      ...game,
      stage: nextAge >= 39 || nextOvr <= 39 ? "retired" : "career",
      age: nextAge,
      year: game.year + 1,
      ovr: nextOvr,
      attributes: nextAttributes,
      cash:
        game.cash +
        game.salary * 0.52 +
        (choice.effect === "brand" ? 0.15 + game.fans / 160 : 0),
      contractYears: Math.max(0, game.contractYears - 1),
      health: nextHealth,
      morale: clamp(
        game.morale +
          event.morale +
          (wonTitle ? 12 : 0) +
          (choice.effect === "team" ? 7 : 0),
      ),
      coach: clamp(
        game.coach +
          (choice.effect === "train" ? 5 : choice.effect === "brand" ? -7 : 1),
      ),
      teammates: clamp(
        game.teammates +
          (choice.effect === "team" ? 10 : choice.effect === "lead" ? -5 : 0),
      ),
      fans: clamp(
        game.fans +
          Math.max(1, Math.round(points / 6)) +
          (choice.effect === "brand" ? 10 : 0),
      ),
      legacy:
        game.legacy +
        Math.max(0, nextOvr - 62) +
        (wonTitle ? 90 : 0) +
        (newAwards.length - game.awards.length) * 30,
      rings: game.rings + (wonTitle ? 1 : 0),
      awards: newAwards,
      history: nextHistory,
      lastEvent: `${event.text} The offseason is here.`,
      lastDelta: delta,
      selectedChoice: choice.id,
      offseason: nextAge < 39 && nextOvr > 39,
      offers: nextOffers,
      draftEligible,
      draftProjection: projectionFor(nextOvr),
    };
    setSeasonFeedback({
      season: season.year,
      event: event.text,
      result,
      ovrBefore: game.ovr,
      ovrAfter: nextOvr,
      healthBefore: game.health,
      healthAfter: nextHealth,
      attributesBefore: game.attributes,
      attributesAfter: nextAttributes,
    });
    setGame(nextState);
  }

  function chooseDestination(destination: Team, offer?: TeamOffer) {
    const staying = destination.name === game.team.name;
    const nextPhase = destination.path;
    const years =
      destination.path === "college"
        ? 1
        : staying && game.contractYears > 0
          ? game.contractYears
          : (offer?.contractYears ?? randomInt(2, 4));
    setGame((current) => ({
      ...current,
      team: destination,
      phase: nextPhase,
      role: staying ? current.role : (offer?.role ?? "Rotation"),
      salary: salaryFor(destination, current.ovr),
      contractYears: years,
      coach: staying ? clamp(current.coach + 4) : 48,
      teammates: staying ? clamp(current.teammates + 4) : 45,
      morale: clamp(current.morale + (staying ? 3 : 7)),
      teamsPlayed: current.teamsPlayed.includes(destination.name)
        ? current.teamsPlayed
        : [...current.teamsPlayed, destination.name],
      offseason: false,
      offers: [],
      draftEligible: false,
      selectedChoice: null,
      lastEvent: staying
        ? `You chose continuity with ${destination.name}.`
        : `${destination.name} earned your signature. Now prove the move was deserved.`,
    }));
  }

  function declareForDraft() {
    const nbaTeams = TEAMS.filter((team) => team.path === "nba").sort(
      (a, b) => a.prestige - b.prestige,
    );
    const pool =
      game.ovr >= 78
        ? nbaTeams
        : game.ovr >= 68
          ? nbaTeams.slice(0, 4)
          : nbaTeams.slice(0, 2);
    const destination = seededPick(pool, game.year * 19 + game.ovr * 11);
    setGame((current) => ({
      ...current,
      team: destination,
      phase: "nba",
      role: current.ovr >= 80 ? "Starter" : "Rotation",
      salary: salaryFor(destination, current.ovr),
      contractYears: 4,
      coach: 45,
      teammates: 42,
      morale: clamp(current.morale + 15),
      fans: clamp(current.fans + 12),
      legacy: current.legacy + 35,
      teamsPlayed: current.teamsPlayed.includes(destination.name)
        ? current.teamsPlayed
        : [...current.teamsPlayed, destination.name],
      offseason: false,
      offers: [],
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

  async function shareCareer() {
    const totalGames = game.history.reduce(
      (sum, season) => sum + season.games,
      0,
    );
    const peak = Math.max(
      game.ovr,
      ...game.history.map((season) => season.ovr),
    );
    const summary = `${game.name} #${game.jerseyNumber} finished a ${game.history.length}-season Full Court Legacy career: ${totalGames} games, ${peak} peak OVR, ${game.rings} ring${game.rings === 1 ? "" : "s"}, and ${game.legacy} legacy points.`;
    const url = window.location.href;
    setShareStatus("BUILDING YOUR CAREER CARD…");
    try {
      const file = await createCareerCard(game);
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${game.name}'s Full Court Legacy`,
          text: summary,
          url,
          files: [file],
        });
        setShareStatus("CAREER CARD SHARED");
      } else {
        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        try {
          await navigator.clipboard?.writeText(`${summary} ${url}`);
          setShareStatus("CARD SAVED · SUMMARY COPIED");
        } catch {
          setShareStatus("CAREER CARD SAVED");
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("SHARING ISN'T AVAILABLE ON THIS DEVICE");
    }
  }

  if (!loaded)
    return (
      <main className="loading-screen">
        <div className="loading-ball" />
      </main>
    );

  const achievementButton = (
    <button className="trophy-button" onClick={() => setShowAchievements(true)}>
      ACHIEVEMENTS{" "}
      <strong>
        {achievementIds.length}/{ACHIEVEMENTS.length}
      </strong>
      <span>{achievementPoints} PTS</span>
    </button>
  );
  const achievementModal = showAchievements ? (
    <AchievementModal
      earned={achievementIds}
      onClose={() => setShowAchievements(false)}
    />
  ) : null;

  if (game.stage === "intro") {
    return (
      <main className="intro-screen">
        <div className="court-grid" />
        <nav className="intro-nav">
          <span className="brand-mark">FCL</span>
          <span>FULL COURT LEGACY</span>
          <span className="edition">CAREER MODE · 2026</span>
          {achievementButton}
        </nav>
        <section className="intro-copy">
          <p className="kicker">ONE CAREER. EVERY DECISION COUNTS.</p>
          <h1>
            MAKE YOUR
            <br />
            <em>LEGACY.</em>
          </h1>
          <p className="intro-description">
            Start at eighteen in Europe or college. Fight for offers, decide
            when to enter the draft, survive injuries and build a career worth
            replaying.
          </p>
          <button className="primary-action" onClick={beginCareer}>
            START A NEW CAREER <span>→</span>
          </button>
          <p className="save-note">
            Career progress and achievements save automatically on this device.
          </p>
        </section>
        <div className="intro-player" aria-hidden="true">
          <span className="player-number">01</span>
          <div className="silhouette" />
          <div className="ball" />
        </div>
        <footer className="legal">
          Unofficial fan-made career simulation. Team and league names and marks
          belong to their respective owners.
        </footer>
        {achievementModal}
      </main>
    );
  }

  if (game.stage === "setup") {
    return (
      <main className="setup-screen">
        <header className="game-nav">
          <button className="brand-button" onClick={() => setGame(DEFAULT)}>
            <span className="brand-mark">FCL</span> FULL COURT LEGACY
          </button>
          <span className="nav-label">CREATE YOUR PLAYER</span>
          {achievementButton}
        </header>
        <section className="setup-card">
          <div className="setup-heading">
            <p className="kicker">THE JOURNEY STARTS HERE</p>
            <h1>Build your player</h1>
            <p>
              Choose your identity and starting path. Your team and overall are
              revealed when the career begins.
            </p>
            <div className="sealed-rating-note">
              <strong>RATINGS SEALED</strong>
              <span>No rerolling for the perfect prospect.</span>
            </div>
          </div>
          <div className="setup-grid">
            <div className="form-stack">
              <div className="identity-fields">
                <label>
                  PLAYER NAME
                  <input
                    value={game.name}
                    maxLength={24}
                    placeholder="Enter your name"
                    onChange={(event) =>
                      setGame((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    autoComplete="name"
                    autoFocus
                  />
                  <small>Remembered for your next career.</small>
                </label>
                <label>
                  JERSEY NUMBER
                  <input
                    className="jersey-input"
                    value={game.jerseyNumber}
                    maxLength={2}
                    inputMode="numeric"
                    pattern="[0-9]{1,2}"
                    aria-describedby="jersey-help"
                    onChange={(event) =>
                      setGame((current) => ({
                        ...current,
                        jerseyNumber: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 2),
                      }))
                    }
                  />
                  <small id="jersey-help">00–99</small>
                </label>
              </div>
              <fieldset>
                <legend>STARTING PATH</legend>
                <div className="origin-grid">
                  <button
                    aria-pressed={game.origin === "europe"}
                    onClick={() =>
                      setGame((current) => ({ ...current, origin: "europe" }))
                    }
                  >
                    <span>EU</span>
                    <strong>START IN EUROPE</strong>
                    <small>
                      Join a professional club. Earn moves to continental giants
                      or chase the NBA later.
                    </small>
                  </button>
                  <button
                    aria-pressed={game.origin === "usa"}
                    onClick={() =>
                      setGame((current) => ({ ...current, origin: "usa" }))
                    }
                  >
                    <span>US</span>
                    <strong>START IN COLLEGE</strong>
                    <small>
                      Enter the NCAA. Transfer, stay to develop, or declare when
                      scouts believe.
                    </small>
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend>POSITION</legend>
                <div className="segmented">
                  {(["PG", "SG", "SF", "PF", "C"] as Position[]).map(
                    (position) => (
                      <button
                        key={position}
                        aria-pressed={game.position === position}
                        onClick={() =>
                          setGame((current) => ({
                            ...current,
                            position,
                            archetype: ARCHETYPES[position][0],
                          }))
                        }
                      >
                        {position}
                      </button>
                    ),
                  )}
                </div>
              </fieldset>
              <fieldset>
                <legend>ARCHETYPE</legend>
                <div className="archetype-list">
                  {ARCHETYPES[game.position].map((archetype, index) => (
                    <button
                      key={archetype}
                      aria-pressed={game.archetype === archetype}
                      onClick={() =>
                        setGame((current) => ({ ...current, archetype }))
                      }
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{archetype}</strong>
                      <small>
                        {index === 0
                          ? "Balanced foundation"
                          : index === 1
                            ? "Offensive upside"
                            : "Defense changes games"}
                      </small>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <aside className="player-preview">
              <p>PROSPECT CARD</p>
              <div className="prospect-number">#{game.jerseyNumber || "?"}</div>
              <div className="preview-silhouette" />
              <h2>{game.name || "YOUR NAME"}</h2>
              <span>{game.archetype}</span>
              <div className="preview-stats">
                <div>
                  <strong>?</strong>
                  <small>OVR</small>
                </div>
                <div>
                  <strong>?</strong>
                  <small>HIDDEN POT</small>
                </div>
                <div>
                  <strong>18</strong>
                  <small>AGE</small>
                </div>
              </div>
            </aside>
          </div>
          <button
            className="primary-action setup-submit"
            disabled={
              !game.name.trim() ||
              !game.origin ||
              !/^\d{1,2}$/.test(game.jerseyNumber)
            }
            onClick={confirmPlayer}
          >
            START MY CAREER <span>→</span>
          </button>
        </section>
        {achievementModal}
      </main>
    );
  }

  if (game.stage === "retired") {
    const totalGames = game.history.reduce(
      (sum, season) => sum + season.games,
      0,
    );
    const peak = Math.max(
      game.ovr,
      ...game.history.map((season) => season.ovr),
    );
    return (
      <main className="retirement-screen">
        <div className="retired-watermark">LEGACY</div>
        <p className="kicker">CAREER COMPLETE</p>
        <h1>{game.name}</h1>
        <h2>THE FINAL BUZZER</h2>
        <p>
          {game.rings > 1
            ? "An era-defining champion."
            : game.legacy > 500
              ? "A career the game will remember."
              : "Every possession helped write the story."}
        </p>
        <section
          className="career-card-preview"
          aria-label="Shareable career card preview"
        >
          <div className="career-card-brand">
            <span className="brand-mark">FCL</span>
            <div>
              <strong>FULL COURT LEGACY</strong>
              <small>CAREER CARD</small>
            </div>
            {teamMark(game.team, true)}
          </div>
          <div className="career-card-player">
            <div>
              <p>
                #{game.jerseyNumber} · {game.position} · {game.archetype}
              </p>
              <h3>{game.name}</h3>
            </div>
            <div>
              <strong>{peak}</strong>
              <span>PEAK OVR</span>
            </div>
          </div>
          <div className="career-card-stats">
            <div>
              <strong>{game.history.length}</strong>
              <span>SEASONS</span>
            </div>
            <div>
              <strong>{totalGames}</strong>
              <span>GAMES</span>
            </div>
            <div>
              <strong>{game.rings}</strong>
              <span>RINGS</span>
            </div>
            <div>
              <strong>{game.awards.length}</strong>
              <span>AWARDS</span>
            </div>
            <div>
              <strong>{game.legacy}</strong>
              <span>LEGACY</span>
            </div>
          </div>
          <div className="career-card-journey">
            <span>CAREER JOURNEY</span>
            <strong>{game.teamsPlayed.slice(-4).join(" → ")}</strong>
          </div>
        </section>
        <div className="retired-stats">
          <div>
            <strong>{game.history.length}</strong>
            <span>SEASONS</span>
          </div>
          <div>
            <strong>{totalGames}</strong>
            <span>GAMES</span>
          </div>
          <div>
            <strong>{peak}</strong>
            <span>PEAK OVR</span>
          </div>
          <div>
            <strong>{game.rings}</strong>
            <span>RINGS</span>
          </div>
          <div>
            <strong>{formatMoney(game.cash)}</strong>
            <span>NET WORTH</span>
          </div>
        </div>
        <div className="award-strip">
          {game.awards.length ? (
            game.awards.map((award) => <span key={award}>{award}</span>)
          ) : (
            <span>CAREER COMPLETE</span>
          )}
        </div>
        <div className="retirement-actions">
          <button className="share-action" onClick={shareCareer}>
            <span>↗</span>
            SHARE CAREER
          </button>
          <button className="primary-action" onClick={resetGame}>
            START ANOTHER CAREER <span>↻</span>
          </button>
          <button
            className="secondary-action"
            onClick={() => setShowAchievements(true)}
          >
            VIEW ACHIEVEMENTS
          </button>
        </div>
        <p className="share-status" aria-live="polite">
          {shareStatus}
        </p>
        {achievementModal}
      </main>
    );
  }

  const current = game.history[0];
  const ovrTone = game.lastDelta > 0 ? "+" : "";
  const collegeEligibilityOver = game.team.path === "college" && game.age >= 22;
  return (
    <main className="career-shell">
      <header className="game-nav">
        <button
          className="brand-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="brand-mark">FCL</span>
          <span className="brand-full">FULL COURT LEGACY</span>
        </button>
        <div className="season-chip">
          <span>{game.offseason ? "OFFSEASON" : "SEASON"}</span>
          <strong>
            {game.year}-{String(game.year + 1).slice(2)}
          </strong>
        </div>
        <div className="save-status">
          <i /> CAREER SAVED
        </div>
        {achievementButton}
        <button className="text-button" onClick={() => setShowReset(true)}>
          NEW CAREER
        </button>
      </header>
      <section className="player-hero">
        <div className="hero-identity">
          {teamMark(game.team)}
          <div>
            <p>
              {game.team.league} · YEAR {game.history.length + 1}
            </p>
            <h1>{game.name}</h1>
            <div className="player-meta">
              <span>#{game.jerseyNumber}</span>
              <span>{game.position}</span>
              <span>{game.archetype}</span>
              <span>AGE {game.age}</span>
            </div>
          </div>
        </div>
        <div className="hero-team">
          <small>CURRENT TEAM</small>
          <strong>{game.team.name}</strong>
          <span>{game.team.league}</span>
        </div>
        <div className="ovr-block">
          <span>OVERALL</span>
          <strong>{game.ovr}</strong>
          <small className={game.lastDelta >= 0 ? "positive" : "negative"}>
            {game.history.length
              ? `${ovrTone}${game.lastDelta} LAST YEAR`
              : "PROSPECT"}
          </small>
        </div>
      </section>
      <nav className="mobile-career-tabs" aria-label="Career sections">
        {(
          [
            ["season", "SEASON"],
            ["career", "CAREER"],
            ["player", "PLAYER"],
          ] as [MobileTab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            aria-pressed={mobileTab === tab}
            onClick={() => {
              setMobileTab(tab);
              window.scrollTo({ top: 150, behavior: "smooth" });
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className={`dashboard-grid mobile-tab-${mobileTab}`}>
        <section className="main-column">
          <div className="mobile-panel mobile-panel-season">
            {game.offseason ? (
              <>
                <div className="section-title">
                  <div>
                    <p className="kicker">YOUR FUTURE</p>
                    <h2>Choose the next chapter</h2>
                  </div>
                  <span>ROLE · TEAM · DRAFT</span>
                </div>
                <div className="offseason-summary">
                  <strong>{game.draftProjection}</strong>
                  <span>
                    {offers.length
                      ? `${offers.length} team offer${offers.length > 1 ? "s" : ""}`
                      : "No outside offers this offseason"}
                  </span>
                </div>
                <div className="offseason-grid">
                  {!collegeEligibilityOver && (
                    <button
                      className="destination-card stay-card"
                      onClick={() => chooseDestination(game.team)}
                    >
                      {teamMark(game.team, true)}
                      <p>STAY · {game.role.toUpperCase()}</p>
                      <h3>{game.team.name}</h3>
                      <div className="offer-pitch">
                        Keep your {game.role.toLowerCase()} role, chemistry and
                        continuity.
                      </div>
                      <OfferMetrics
                        team={game.team}
                        role={game.role}
                        contractYears={Math.max(1, game.contractYears)}
                        salary={game.salary}
                        ovr={game.ovr}
                      />
                      <span>COMMIT TO STAY →</span>
                    </button>
                  )}
                  {offers.map(({ team, offer }) => (
                    <button
                      className={`destination-card ${offer.direction === "playtime" ? "playtime-card" : ""}`}
                      key={team.name}
                      onClick={() => chooseDestination(team, offer)}
                    >
                      {teamMark(team, true)}
                      <p>
                        {offer.direction === "pro"
                          ? "PRO OFFER"
                          : offer.direction === "playtime"
                            ? "MORE PLAYTIME"
                            : "STEP-UP OFFER"}
                      </p>
                      <h3>{team.name}</h3>
                      <div className="offer-pitch">
                        {offer.direction === "playtime"
                          ? "A smaller stage, but the offense runs through you."
                          : "A stronger roster with tougher competition for minutes."}
                      </div>
                      <OfferMetrics
                        team={team}
                        role={offer.role}
                        contractYears={offer.contractYears}
                        salary={salaryFor(team, game.ovr)}
                        ovr={game.ovr}
                      />
                      <span>ACCEPT OFFER →</span>
                    </button>
                  ))}
                  {game.draftEligible && (
                    <button
                      className="destination-card draft-card"
                      onClick={declareForDraft}
                    >
                      <img
                        className="draft-logo"
                        src="nba-logo.svg"
                        alt="NBA"
                      />
                      <p>DECLARE FOR THE DRAFT</p>
                      <h3>{game.draftProjection}</h3>
                      <div>
                        Leave{" "}
                        {game.team.path === "college" ? "college" : "Europe"}{" "}
                        and let draft night decide your first NBA home.
                      </div>
                      <dl className="offer-metrics draft-metrics">
                        <div>
                          <dt>ROLE</dt>
                          <dd>UNKNOWN</dd>
                        </div>
                        <div>
                          <dt>CONTRACT</dt>
                          <dd>4 YEARS</dd>
                        </div>
                        <div>
                          <dt>SALARY</dt>
                          <dd>ROOKIE SCALE</dd>
                        </div>
                        <div>
                          <dt>DESTINATION</dt>
                          <dd>DRAFT NIGHT</dd>
                        </div>
                      </dl>
                      <span>ENTER THE DRAFT →</span>
                    </button>
                  )}
                </div>
                {collegeEligibilityOver && !game.draftEligible && (
                  <div className="eligibility-note">
                    <strong>College eligibility is complete.</strong>
                    <span>
                      Your current draft stock is too low. Accept a professional
                      European offer to continue.
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="section-title">
                  <div>
                    <p className="kicker">THE DECISION</p>
                    <h2>What will define age {game.age}?</h2>
                  </div>
                  <span>CHOOSE ONE · THE YEAR WILL SIMULATE</span>
                </div>
                <div className="choice-grid">
                  {choices.map((choice, index) => (
                    <button
                      key={choice.id}
                      className={`choice-card ${choice.effect === "health" ? "health-choice" : ""}`}
                      onClick={() => playSeason(choice)}
                    >
                      <span className="choice-index">0{index + 1}</span>
                      <p>{choice.eyebrow}</p>
                      <h3>{choice.title}</h3>
                      <div>{choice.body}</div>
                      <dl>
                        <dt>UPSIDE</dt>
                        <dd>{choice.upside}</dd>
                        <dt>RISK</dt>
                        <dd>{choice.risk}</dd>
                      </dl>
                      <span className="choose-link">
                        COMMIT TO THIS PATH <b>→</b>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <section className="event-panel">
              <div className="event-icon">!</div>
              <div>
                <p className="kicker">LATEST FROM THE LOCKER ROOM</p>
                <h3>{game.lastEvent}</h3>
              </div>
              <span
                className={
                  game.lastDelta >= 0 ? "delta positive" : "delta negative"
                }
              >
                {game.history.length
                  ? `${ovrTone}${game.lastDelta} OVR`
                  : "READY"}
              </span>
            </section>
            <section className="performance-panel">
              <div className="section-title compact">
                <div>
                  <p className="kicker">PERFORMANCE FILE</p>
                  <h2>{current ? current.year : "PRESEASON"}</h2>
                </div>
                <span>{current?.result || "YOUR FIRST YEAR AWAITS"}</span>
              </div>
              <div className="stat-line">
                <div>
                  <strong>{current?.games ?? 0}</strong>
                  <span>GP</span>
                </div>
                <div>
                  <strong>{current?.points ?? "—"}</strong>
                  <span>PPG</span>
                </div>
                <div>
                  <strong>{current?.assists ?? "—"}</strong>
                  <span>APG</span>
                </div>
                <div>
                  <strong>{current?.rebounds ?? "—"}</strong>
                  <span>RPG</span>
                </div>
              </div>
              <div className="ratings">
                {ATTRIBUTE_KEYS.map((key) => (
                  <div key={key}>
                    <span>{ATTRIBUTE_LABELS[key]}</span>
                    <div>
                      <i style={{ width: `${game.attributes[key]}%` }} />
                    </div>
                    <strong>{game.attributes[key]}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="mobile-panel mobile-panel-career">
            <section className="history-panel">
              <div className="section-title compact">
                <div>
                  <p className="kicker">CAREER LEDGER</p>
                  <h2>Season by season</h2>
                </div>
                <span>{game.history.length} SEASONS</span>
              </div>
              {game.history.length === 0 ? (
                <div className="empty-history">
                  Your first line will be written after this decision.
                </div>
              ) : (
                <div className="history-table">
                  <div className="history-row history-head">
                    <span>YEAR</span>
                    <span>TEAM</span>
                    <span>OVR</span>
                    <span>PPG</span>
                    <span>RESULT</span>
                  </div>
                  {game.history.map((season) => (
                    <div
                      className="history-row"
                      key={`${season.year}-${season.team}`}
                    >
                      <span>{season.year}</span>
                      <span>{season.team}</span>
                      <strong>{season.ovr}</strong>
                      <span>{season.points}</span>
                      <span>{season.result}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <div className="mobile-career-summary">
              <section className="side-panel legacy-panel">
                <p className="kicker">LEGACY</p>
                <div className="legacy-score">
                  <strong>{game.legacy}</strong>
                  <span>LEGACY POINTS</span>
                </div>
                <div className="trophy-grid">
                  <div>
                    <strong>{game.rings}</strong>
                    <span>RINGS</span>
                  </div>
                  <div>
                    <strong>{game.awards.length}</strong>
                    <span>AWARDS</span>
                  </div>
                </div>
                <div className="award-list">
                  {game.awards.length ? (
                    game.awards.map((award) => (
                      <span key={award}>★ {award}</span>
                    ))
                  ) : (
                    <p>The cabinet is empty. For now.</p>
                  )}
                </div>
              </section>
              <section className="side-panel achievement-progress">
                <p className="kicker">CAREER CHALLENGES</p>
                <strong>
                  {achievementIds.length}/{ACHIEVEMENTS.length}
                </strong>
                <span>{achievementPoints} ACHIEVEMENT POINTS</span>
                <button onClick={() => setShowAchievements(true)}>
                  OPEN TROPHY ROOM →
                </button>
              </section>
            </div>
          </div>
        </section>
        <aside className="side-column mobile-panel mobile-panel-player">
          <section className="side-panel contract-panel">
            <p className="kicker">
              {game.team.path === "college" ? "PROGRAM" : "CONTRACT"}
            </p>
            <div className="team-contract">
              {teamMark(game.team, true)}
              <div>
                <strong>{game.team.name}</strong>
                <span>
                  {game.team.path === "college"
                    ? `${Math.max(0, 22 - game.age)} YEARS ELIGIBILITY`
                    : `${game.contractYears} YEARS REMAINING`}
                </span>
                <span className="contract-role">
                  ROLE · {game.role.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="money-grid">
              <div>
                <span>SALARY</span>
                <strong>{formatMoney(game.salary)}</strong>
                <small>PER YEAR</small>
              </div>
              <div>
                <span>NET WORTH</span>
                <strong>{formatMoney(game.cash)}</strong>
                <small>ESTIMATED</small>
              </div>
            </div>
          </section>
          <section className="side-panel">
            <p className="kicker">BODY & MIND</p>
            <div className="meter-list">
              <Meter label="HEALTH" value={game.health} />
              <Meter label="MORALE" value={game.morale} />
            </div>
          </section>
          <section className="side-panel">
            <p className="kicker">INNER CIRCLE</p>
            <div className="relationship-list">
              <Relationship icon="C" label="COACH" value={game.coach} />
              <Relationship icon="T" label="TEAMMATES" value={game.teammates} />
              <Relationship icon="F" label="FANS" value={game.fans} />
            </div>
          </section>
          <section className="side-panel legacy-panel">
            <p className="kicker">LEGACY</p>
            <div className="legacy-score">
              <strong>{game.legacy}</strong>
              <span>LEGACY POINTS</span>
            </div>
            <div className="trophy-grid">
              <div>
                <strong>{game.rings}</strong>
                <span>RINGS</span>
              </div>
              <div>
                <strong>{game.awards.length}</strong>
                <span>AWARDS</span>
              </div>
            </div>
            <div className="award-list">
              {game.awards.length ? (
                game.awards.map((award) => <span key={award}>★ {award}</span>)
              ) : (
                <p>The cabinet is empty. For now.</p>
              )}
            </div>
          </section>
          <section className="side-panel achievement-progress">
            <p className="kicker">CAREER CHALLENGES</p>
            <strong>
              {achievementIds.length}/{ACHIEVEMENTS.length}
            </strong>
            <span>{achievementPoints} ACHIEVEMENT POINTS</span>
            <button onClick={() => setShowAchievements(true)}>
              OPEN TROPHY ROOM →
            </button>
          </section>
          <section className="side-panel disclaimer">
            <strong>UNOFFICIAL FAN GAME</strong>
            <p>
              Not affiliated with or endorsed by any team, league or governing
              body. Names and marks belong to their respective owners.
            </p>
          </section>
        </aside>
      </div>
      {showReset && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowReset(false)}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="kicker">START OVER?</p>
            <h2 id="reset-title">This career will be erased.</h2>
            <p>{`${game.name}'s ${game.history.length}-season journey cannot be recovered. Achievements remain unlocked.`}</p>
            <div>
              <button
                className="secondary-action"
                onClick={() => setShowReset(false)}
              >
                KEEP PLAYING
              </button>
              <button className="danger-action" onClick={resetGame}>
                ERASE CAREER
              </button>
            </div>
          </div>
        </div>
      )}
      {seasonFeedback && (
        <SeasonResultModal
          feedback={seasonFeedback}
          onClose={() => {
            setSeasonFeedback(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {achievementModal}
      {justUnlocked && (
        <button
          className="achievement-toast"
          onClick={() => setJustUnlocked(null)}
        >
          <span>ACHIEVEMENT UNLOCKED</span>
          <strong>{justUnlocked.title}</strong>
          <small>+{justUnlocked.points} PTS · TAP TO DISMISS</small>
        </button>
      )}
    </main>
  );
}

function OfferMetrics({
  team,
  role,
  contractYears,
  salary,
  ovr,
}: {
  team: Team;
  role: CareerRole;
  contractYears: number;
  salary: number;
  ovr: number;
}) {
  return (
    <dl className="offer-metrics">
      <div>
        <dt>ROLE</dt>
        <dd>{role.toUpperCase()}</dd>
      </div>
      <div>
        <dt>MINUTES</dt>
        <dd>{expectedMinutes(role)} MPG</dd>
      </div>
      <div>
        <dt>DEVELOPMENT</dt>
        <dd>{developmentLabel(role, team.prestige)}</dd>
      </div>
      <div>
        <dt>TITLE OUTLOOK</dt>
        <dd>{titleOutlook(team, ovr)}</dd>
      </div>
      <div>
        <dt>CONTRACT</dt>
        <dd>
          {contractYears} YEAR{contractYears === 1 ? "" : "S"}
        </dd>
      </div>
      <div>
        <dt>SALARY</dt>
        <dd>{team.path === "college" ? "—" : formatMoney(salary)}</dd>
      </div>
    </dl>
  );
}

function SeasonResultModal({
  feedback,
  onClose,
}: {
  feedback: SeasonFeedback;
  onClose: () => void;
}) {
  const ovrDelta = feedback.ovrAfter - feedback.ovrBefore;
  const healthDelta = feedback.healthAfter - feedback.healthBefore;
  const attributeChanges = ATTRIBUTE_KEYS.map((key) => ({
    key,
    value: feedback.attributesAfter[key] - feedback.attributesBefore[key],
    rating: feedback.attributesAfter[key],
  })).filter((change) => change.value !== 0);
  return (
    <div className="modal-backdrop result-backdrop" role="presentation">
      <section
        className="season-result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="season-result-title"
      >
        <p className="kicker">SEASON COMPLETE · {feedback.season}</p>
        <h2 id="season-result-title">The verdict is in.</h2>
        <p className="result-event">{feedback.event}</p>
        <div className="result-scorecard">
          <div>
            <span>OVERALL</span>
            <strong>
              {feedback.ovrBefore} <i>→</i> {feedback.ovrAfter}
            </strong>
            <small className={ovrDelta >= 0 ? "positive" : "negative"}>
              {ovrDelta >= 0 ? "+" : ""}
              {ovrDelta} OVR
            </small>
          </div>
          <div>
            <span>HEALTH</span>
            <strong>
              {feedback.healthBefore} <i>→</i> {feedback.healthAfter}
            </strong>
            <small className={healthDelta >= 0 ? "positive" : "negative"}>
              {healthDelta >= 0 ? "+" : ""}
              {healthDelta}
            </small>
          </div>
        </div>
        <div className="result-attributes">
          {attributeChanges.length ? (
            attributeChanges.map((change) => (
              <div key={change.key}>
                <span>{ATTRIBUTE_LABELS[change.key]}</span>
                <strong>{change.rating}</strong>
                <small className={change.value > 0 ? "positive" : "negative"}>
                  {change.value > 0 ? "+" : ""}
                  {change.value}
                </small>
              </div>
            ))
          ) : (
            <p>Your ratings held steady this season.</p>
          )}
        </div>
        <div className="result-footer">
          <span>{feedback.result}</span>
          <button className="primary-action" onClick={onClose}>
            VIEW OFFSEASON <b>→</b>
          </button>
        </div>
      </section>
    </div>
  );
}

function AchievementModal({
  earned,
  onClose,
}: {
  earned: string[];
  onClose: () => void;
}) {
  const points = ACHIEVEMENTS.filter((item) => earned.includes(item.id)).reduce(
    (sum, item) => sum + item.points,
    0,
  );
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="achievement-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="achievement-heading">
          <div>
            <p className="kicker">PERSISTENT ACROSS CAREERS</p>
            <h2 id="achievement-title">Trophy Room</h2>
          </div>
          <div>
            <strong>
              {earned.length}/{ACHIEVEMENTS.length}
            </strong>
            <span>{points} PTS</span>
          </div>
        </div>
        <div className="achievement-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = earned.includes(achievement.id);
            return (
              <article
                key={achievement.id}
                className={unlocked ? "unlocked" : "locked"}
              >
                <div>{unlocked ? "★" : "?"}</div>
                <span>{achievement.points} PTS</span>
                <h3>{achievement.title}</h3>
                <p>{achievement.body}</p>
              </article>
            );
          })}
        </div>
        <button className="secondary-action" onClick={onClose}>
          CLOSE TROPHY ROOM
        </button>
      </section>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Relationship({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="relationship">
      <span>{icon}</span>
      <div>
        <strong>{label}</strong>
        <div>
          <i style={{ width: `${value}%` }} />
        </div>
      </div>
      <b>{value}</b>
    </div>
  );
}
