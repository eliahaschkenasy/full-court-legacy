"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { TEAMS, type Team, type TeamPath } from "./teams";

type Position = "PG" | "SG" | "SF" | "PF" | "C";
type Stage = "intro" | "setup" | "career" | "retired";
type Origin = "europe" | "usa" | null;
type CareerRole =
  | "Star Player"
  | "Starter"
  | "6th Man"
  | "Bench Player"
  | "Fringe Player";
type MobileTab = "season" | "career" | "player";
type AttributeKey =
  | "scoring"
  | "playmaking"
  | "defense"
  | "rebounding"
  | "athleticism";

type PlayerAttributes = Record<AttributeKey, number>;

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
  attributesBefore: PlayerAttributes;
  attributesAfter: PlayerAttributes;
};

type DraftSummary = {
  team: Team;
  pick: number;
  round: 1 | 2;
  role: CareerRole;
  salary: number;
  projection: string;
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
  legacy: number;
  rings: number;
  awards: string[];
  history: Season[];
  teamsPlayed: string[];
  lastEvent: string;
  lastDelta: number;
  offseason: boolean;
  offers: TeamOffer[];
  draftEligible: boolean;
  draftProjection: string;
  retirementOffered: boolean;
};

type Achievement = { id: string; title: string; body: string; points: number };

const DEFAULT: GameState = {
  stage: "intro",
  name: "",
  jerseyNumber: "1",
  position: "PG",
  origin: null,
  phase: "europe",
  age: 17,
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
  role: "Fringe Player",
  contractYears: 1,
  salary: 0.08,
  cash: 0.01,
  legacy: 0,
  rings: 0,
  awards: [],
  history: [],
  teamsPlayed: [],
  lastEvent: "Your first competitive season is waiting.",
  lastDelta: 0,
  offseason: false,
  offers: [],
  draftEligible: false,
  draftProjection: "Not on draft boards",
  retirementOffered: false,
};

const EVENTS = [
  {
    text: "A veteran stayed late to work on your footwork.",
    delta: 1,
  },
  {
    text: "A fourth-quarter run finally put scouts on notice.",
    delta: 1,
  },
  {
    text: "A minor ankle sprain cost you three weeks.",
    delta: -2,
  },
  {
    text: "Your shooting coach rebuilt your release.",
    delta: 1,
  },
  {
    text: "A locker-room argument became a season-long distraction.",
    delta: -1,
  },
  {
    text: "Heavy minutes exposed gaps in your game.",
    delta: -2,
  },
  {
    text: "A national-team camp raised your confidence.",
    delta: 1,
  },
  {
    text: "A mentor changed how you read pick-and-roll coverages.",
    delta: 1,
  },
  {
    text: "A wrist injury interrupted your best stretch.",
    delta: -3,
  },
  {
    text: "You struggled when opponents adjusted to your tendencies.",
    delta: -2,
  },
  {
    text: "A playoff breakthrough changed the way coaches see you.",
    delta: 1,
  },
  {
    text: "A quiet season left scouts divided about your ceiling.",
    delta: -1,
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
    id: "veteran",
    title: "Built to Last",
    body: "Complete ten seasons in one career.",
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

const POSITION_GROWTH_WEIGHTS: Record<Position, PlayerAttributes> = {
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
    scoring: 0.22,
    playmaking: 0.05,
    defense: 0.28,
    rebounding: 0.31,
    athleticism: 0.14,
  },
};

const POSITION_START_MODIFIERS: Record<Position, PlayerAttributes> = {
  PG: { scoring: 2, playmaking: 6, defense: 0, rebounding: -8, athleticism: 0 },
  SG: { scoring: 5, playmaking: 0, defense: 1, rebounding: -6, athleticism: 0 },
  SF: { scoring: 0, playmaking: -5, defense: 2, rebounding: 0, athleticism: 3 },
  PF: { scoring: 0, playmaking: -6, defense: 3, rebounding: 3, athleticism: 0 },
  C: { scoring: 0, playmaking: -12, defense: 6, rebounding: 6, athleticism: 0 },
};

const ROLE_GROWTH_MULTIPLIER: Record<CareerRole, number> = {
  "Star Player": 1.2,
  Starter: 1.1,
  "6th Man": 1,
  "Bench Player": 0.85,
  "Fringe Player": 0.65,
};

const ROLE_ORDER: CareerRole[] = [
  "Star Player",
  "Starter",
  "6th Man",
  "Bench Player",
  "Fringe Player",
];

function calculateOvr(attributes: PlayerAttributes) {
  return Math.round(
    ATTRIBUTE_KEYS.reduce((total, key) => total + attributes[key], 0) / 5,
  );
}

function seededUnit(seed: number) {
  return Math.abs(Math.sin(seed * 12.9898 + 78.233)) % 1;
}

function weightedAttribute(weights: PlayerAttributes, seed: number) {
  let cursor = seededUnit(seed) * ATTRIBUTE_KEYS.reduce((sum, key) => sum + weights[key], 0);
  for (const key of ATTRIBUTE_KEYS) {
    cursor -= weights[key];
    if (cursor <= 0) return key;
  }
  return ATTRIBUTE_KEYS[ATTRIBUTE_KEYS.length - 1];
}

function attributesForProspect(
  baseRating: number,
  position: Position,
  seed: number,
): PlayerAttributes {
  const profile = {} as PlayerAttributes;
  ATTRIBUTE_KEYS.forEach((key, index) => {
    const variation = Math.floor(seededUnit(seed + index * 29) * 7) - 3;
    profile[key] = clamp(
      baseRating + POSITION_START_MODIFIERS[position][key] + variation,
      0,
      99,
    );
  });
  return profile;
}

function ageGrowthMultiplier(age: number) {
  const multipliers: Record<number, number> = {
    16: 3,
    17: 2.5,
    18: 2.2,
    19: 2,
    20: 1.8,
    21: 1.6,
    22: 1.4,
    23: 1.2,
    24: 1,
    25: 0.9,
    26: 0.8,
    27: 0.7,
    28: 0.6,
    29: 0.5,
    30: 0.4,
    31: 0.25,
    32: 0.1,
    33: 0,
    34: -0.25,
    35: -0.5,
    36: -0.75,
    37: -1,
  };
  if (age <= 16) return 3;
  if (age >= 38) return -1.25;
  return multipliers[age] ?? 0;
}

function retirementChance(age: number) {
  if (age < 30) return 0;
  if (age >= 38) return 100;
  return (age - 29) * 10;
}

function demoteRole(role: CareerRole) {
  return ROLE_ORDER[Math.min(ROLE_ORDER.length - 1, ROLE_ORDER.indexOf(role) + 1)];
}

function roleForTeam(team: Team, ovr: number): CareerRole {
  const rosterLevel = team.prestige - (team.path === "nba" ? 10 : 15);
  const difference = ovr - rosterLevel;
  if (difference >= 8) return "Star Player";
  if (difference >= 3) return "Starter";
  if (difference >= -2) return "6th Man";
  if (difference >= -8) return "Bench Player";
  return "Fringe Player";
}

function normalizeRole(role?: string): CareerRole {
  if (role === "Featured starter") return "Star Player";
  if (role === "Rotation") return "Bench Player";
  return ROLE_ORDER.includes(role as CareerRole)
    ? (role as CareerRole)
    : "Fringe Player";
}

function developAttributes(
  game: GameState,
  startingAttributes: PlayerAttributes,
  role: CareerRole,
  seed: number,
  eventDelta: number,
) {
  const next = { ...startingAttributes };
  const startingOvr = calculateOvr(next);
  const multiplier = ageGrowthMultiplier(game.age);
  const roll = 1 + seededUnit(seed + 17) * 2;
  const potentialGap = Math.max(0, game.potential - startingOvr);
  let target = eventDelta;

  if (multiplier > 0 && potentialGap > 0) {
    const growth = Math.round(
      roll *
        multiplier *
        (potentialGap / 30) *
        ROLE_GROWTH_MULTIPLIER[role] *
        game.team.trainingMultiplier,
    );
    target += Math.min(potentialGap, Math.max(0, growth));
  } else if (multiplier < 0) {
    target -= Math.round(Math.abs(multiplier) * roll);
  }

  const targetOvr = clamp(startingOvr + target, 0, 99);
  const declineWeights: PlayerAttributes = {
    scoring: 1,
    playmaking: 1,
    defense: 1,
    rebounding: 1,
    athleticism: 2,
  };
  let guard = 0;
  while (calculateOvr(next) !== targetOvr && guard < 1200) {
    const rising = calculateOvr(next) < targetOvr;
    const key = weightedAttribute(
      rising ? POSITION_GROWTH_WEIGHTS[game.position] : declineWeights,
      seed + guard * 31,
    );
    next[key] = clamp(next[key] + (rising ? 1 : -1), 0, 99);
    guard += 1;
    if (rising && ATTRIBUTE_KEYS.every((item) => next[item] === 99)) break;
    if (!rising && ATTRIBUTE_KEYS.every((item) => next[item] === 0)) break;
  }
  return next;
}

function expectedMinutes(role: CareerRole) {
  return {
    "Star Player": 34,
    Starter: 28,
    "6th Man": 22,
    "Bench Player": 12,
    "Fringe Player": 5,
  }[role];
}

function developmentLabel(role: CareerRole, team: Team) {
  const score =
    expectedMinutes(role) +
    (96 - team.prestige) * 0.15 +
    (team.trainingMultiplier - 1) * 30;
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
    `#${game.jerseyNumber} · ${game.position} · ${game.role.toUpperCase()}`,
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
        role: roleForTeam(pro, ovr),
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
      role: roleForTeam(team, ovr),
      direction: "step-up",
      contractYears: 3,
    });
  }
  if (playtimeMoves.length) {
    const team = seededPick(playtimeMoves, seed + 31);
    offers.push({
      teamName: team.name,
      role: roleForTeam(team, ovr),
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
  if (game.history.length >= 10) ids.push("veteran");
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
  const [draftSummary, setDraftSummary] = useState<DraftSummary | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("season");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [midgameDecision, setMidgameDecision] = useState(false);

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
        const potential = clamp(parsed.potential ?? startingOvr + 35, 0, 99);
        const offers = (
          parsed.offers ??
          (parsed.offerNames ?? []).map((teamName) => ({
            teamName,
            role: "Bench Player" as CareerRole,
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
            clamp(parsed.ovr ?? startingOvr, 0, 99),
            parsed.position ?? DEFAULT.position,
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
          ovr: calculateOvr(attributes),
          team,
          role: normalizeRole(parsed.role),
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

  const offers = game.offers
    .map((offer) => ({
      offer,
      team: TEAMS.find((team) => team.name === offer.teamName),
    }))
    .filter((item): item is { offer: TeamOffer; team: Team } =>
      Boolean(item.team),
    );

  function beginCareer() {
    const baseRating = randomInt(40, 54);
    const seed = randomInt(1, 10000);
    const attributes = attributesForProspect(baseRating, DEFAULT.position, seed);
    const startingOvr = calculateOvr(attributes);
    const potential = clamp(startingOvr + randomInt(30, 45), 0, 99);
    let remembered: { name?: string; jerseyNumber?: string } = {};
    try {
      remembered = JSON.parse(
        localStorage.getItem("full-court-legacy-profile") ?? "{}",
      );
    } catch {}
    setSetupStep(1);
    setGame({
      ...DEFAULT,
      stage: "setup",
      name: remembered.name ?? "",
      jerseyNumber: remembered.jerseyNumber ?? "1",
      startingOvr: baseRating,
      ovr: startingOvr,
      potential,
      attributes,
    });
    setMidgameDecision(false);
  }

  function confirmPlayer() {
    if (!game.name.trim() || !/^\d{1,2}$/.test(game.jerseyNumber))
      return;
    const origin: Exclude<Origin, null> =
      randomInt(0, 1) === 0 ? "europe" : "usa";
    const pool =
      origin === "usa"
        ? TEAMS.filter(
            (team) =>
              team.path === "college" &&
              team.prestige <= game.startingOvr + 36,
          )
        : TEAMS.filter(
            (team) => team.path === "europe" && team.prestige <= 74,
          );
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
      game.year + game.name.length * 37 + Number(game.jerseyNumber),
    );
    const startingOvr = calculateOvr(attributes);
    const potential = clamp(startingOvr + randomInt(30, 45), 0, 99);
    setGame((current) => ({
      ...current,
      stage: "career",
      origin,
      phase: team.path,
      team,
      attributes,
      startingOvr,
      ovr: startingOvr,
      potential,
      role: roleForTeam(team, startingOvr),
      salary: salaryFor(team, startingOvr),
      contractYears: team.path === "college" ? 1 : 2,
      teamsPlayed: [team.name],
      lastEvent: `${current.name}'s journey begins with ${team.name}. Nothing is guaranteed.`,
    }));
  }

  function startSeason() {
    if (randomInt(1, 100) <= 40) {
      setMidgameDecision(true);
      setGame((current) => ({
        ...current,
        lastEvent: "Down one. Final possession. The ball is in your hands.",
        lastDelta: 0,
      }));
      return;
    }
    completeSeason();
  }

  function resolveMidgameDecision(action: "shot" | "coach") {
    const attributes = { ...game.attributes };
    let role = game.role;
    let midgameEvent = "You ran the coach's play. The season moved on without changing your ratings or role.";

    if (action === "shot") {
      const makeChance = clamp(attributes.scoring, 30, 70);
      const made = randomInt(1, 100) <= makeChance;
      if (made) {
        const scoringGain = randomInt(3, 7);
        const previousScoring = attributes.scoring;
        attributes.scoring = clamp(attributes.scoring + scoringGain, 0, 99);
        midgameEvent = `You called your own number and hit the game-winner. Scoring +${attributes.scoring - previousScoring}.`;
      } else {
        const scoringLoss = randomInt(1, 4);
        const previousScoring = attributes.scoring;
        attributes.scoring = clamp(attributes.scoring - scoringLoss, 0, 99);
        const previousRole = role;
        role = demoteRole(role);
        midgameEvent = `The shot missed. Scoring -${previousScoring - attributes.scoring}${role === previousRole ? "." : ` and your role fell to ${role}.`}`;
      }
    }

    setMidgameDecision(false);
    completeSeason({ attributes, role, midgameEvent });
  }

  function completeSeason(midgame?: {
    attributes: PlayerAttributes;
    role: CareerRole;
    midgameEvent: string;
  }) {
    const seed = game.year * 13 + game.ovr * 7 + game.history.length * 17;
    const event = seededPick(EVENTS, seed);
    const startingAttributes = midgame?.attributes ?? game.attributes;
    const role = midgame?.role ?? game.role;
    const nextAttributes = developAttributes(
      game,
      startingAttributes,
      role,
      seed,
      event.delta,
    );
    const nextOvr = calculateOvr(nextAttributes);
    const delta = nextOvr - game.ovr;
    const isNBA = game.team.path === "nba";
    const isCollege = game.team.path === "college";
    const roleGames: Record<CareerRole, number> = {
      "Star Player": 6,
      Starter: 3,
      "6th Man": 0,
      "Bench Player": -8,
      "Fringe Player": -14,
    };
    const games = Math.max(
      8,
      (isNBA
        ? 56 + (seed % 27)
        : isCollege
          ? 25 + (seed % 12)
          : 24 + (seed % 14)) + roleGames[role],
    );
    const scoringShare = clamp(nextAttributes.scoring / 99, 0.03, 1);
    const playmakingShare = clamp(nextAttributes.playmaking / 99, 0.03, 1);
    const reboundingShare = clamp(nextAttributes.rebounding / 99, 0.03, 1);
    const roleScoring: Record<CareerRole, number> = {
      "Star Player": 4,
      Starter: 2,
      "6th Man": 0,
      "Bench Player": -3,
      "Fringe Player": -5,
    };
    const points =
      Math.round((3.5 + scoringShare * 22 + roleScoring[role]) * 10) / 10;
    const assists =
      Math.round(
        ((game.position === "PG" ? 2.2 : 0.8) +
          playmakingShare * 5.5 +
          roleScoring[role] * 0.18) *
          10,
      ) / 10;
    const rebounds =
      Math.round(
        ((game.position === "C" || game.position === "PF" ? 3.2 : 1.2) +
          reboundingShare * 6.2 +
          roleScoring[role] * 0.18) *
          10,
      ) / 10;
    const titleChance = Math.max(
      2,
      game.team.prestige + nextOvr - 166,
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

    const eventText = midgame?.midgameEvent
      ? `${midgame.midgameEvent} ${event.text}`
      : event.text;
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
      event: eventText,
    };
    const nextAge = game.age + 1;
    const nextHistory = [season, ...game.history];
    const mandatoryRetirement = game.age >= 38;
    const retirementOffered =
      mandatoryRetirement ||
      randomInt(1, 100) <= retirementChance(game.age);
    const nextOffers = mandatoryRetirement
      ? []
      : offersFor(game, nextOvr, nextAge, seed);
    const draftEligible =
      !mandatoryRetirement &&
      game.team.path !== "nba" &&
      nextAge >= 19 &&
      nextOvr >= 60;
    const nextState: GameState = {
      ...game,
      stage: nextOvr <= 0 ? "retired" : "career",
      age: nextAge,
      year: game.year + 1,
      ovr: nextOvr,
      attributes: nextAttributes,
      role,
      cash: game.cash + game.salary * 0.52,
      contractYears: Math.max(0, game.contractYears - 1),
      legacy:
        game.legacy +
        Math.max(0, nextOvr - 62) +
        (wonTitle ? 90 : 0) +
        (newAwards.length - game.awards.length) * 30,
      rings: game.rings + (wonTitle ? 1 : 0),
      awards: newAwards,
      history: nextHistory,
      lastEvent: `${eventText} The offseason is here.`,
      lastDelta: delta,
      offseason: nextOvr > 0,
      offers: nextOffers,
      draftEligible,
      draftProjection: projectionFor(nextOvr),
      retirementOffered,
    };
    setSeasonFeedback({
      season: season.year,
      event: eventText,
      result,
      ovrBefore: game.ovr,
      ovrAfter: nextOvr,
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
      role: staying ? current.role : (offer?.role ?? roleForTeam(destination, current.ovr)),
      salary: salaryFor(destination, current.ovr),
      contractYears: years,
      teamsPlayed: current.teamsPlayed.includes(destination.name)
        ? current.teamsPlayed
        : [...current.teamsPlayed, destination.name],
      offseason: false,
      offers: [],
      draftEligible: false,
      retirementOffered: false,
      lastEvent: staying
        ? `You chose continuity with ${destination.name}.`
        : `${destination.name} earned your signature. Now prove the move was deserved.`,
    }));
    setMidgameDecision(false);
  }

  function declareForDraft() {
    const nbaTeams = TEAMS.filter((team) => team.path === "nba").sort(
      (a, b) => a.prestige - b.prestige,
    );
    const pool =
      game.ovr >= 78
        ? nbaTeams
        : game.ovr >= 68
          ? nbaTeams.slice(0, 14)
          : nbaTeams.slice(0, 8);
    const destination = seededPick(pool, game.year * 19 + game.ovr * 11);
    const draftSeed = game.year * 23 + game.ovr * 17;
    const pickRange =
      game.ovr >= 82 ? [1, 14] : game.ovr >= 74 ? [15, 30] : [31, 60];
    const pick =
      pickRange[0] +
      Math.floor(seededUnit(draftSeed) * (pickRange[1] - pickRange[0] + 1));
    const role = roleForTeam(destination, game.ovr);
    const salary = salaryFor(destination, game.ovr);
    setDraftSummary({
      team: destination,
      pick,
      round: pick <= 30 ? 1 : 2,
      role,
      salary,
      projection: game.draftProjection,
    });
    setGame((current) => ({
      ...current,
      team: destination,
      phase: "nba",
      role,
      salary,
      contractYears: 4,
      legacy: current.legacy + 35,
      teamsPlayed: current.teamsPlayed.includes(destination.name)
        ? current.teamsPlayed
        : [...current.teamsPlayed, destination.name],
      offseason: false,
      offers: [],
      draftEligible: false,
      retirementOffered: false,
      lastEvent: `Draft night: ${destination.name} called your name. The NBA starts now.`,
    }));
    setMidgameDecision(false);
  }

  function retirePlayer() {
    setGame((current) => ({
      ...current,
      stage: "retired",
      offseason: false,
      offers: [],
      draftEligible: false,
      retirementOffered: false,
      lastEvent: `${current.name} chose to end the journey after ${current.history.length} seasons.`,
    }));
  }

  function resetGame() {
    localStorage.removeItem("full-court-legacy-save");
    setGame(DEFAULT);
    setMidgameDecision(false);
    setDraftSummary(null);
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
    const url = window.location.href;
    const summary = `${game.name} #${game.jerseyNumber} finished a ${game.history.length}-season Full Court Legacy career: ${totalGames} games, ${peak} peak OVR, ${game.rings} ring${game.rings === 1 ? "" : "s"}, and ${game.legacy} legacy points.`;
    const sharedText = `${summary}\nPlay Full Court Legacy: ${url}`;
    setShareStatus("BUILDING YOUR CAREER CARD…");
    try {
      const file = await createCareerCard(game);
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${game.name}'s Full Court Legacy`,
          text: sharedText,
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
          await navigator.clipboard?.writeText(sharedText);
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
            Rise from an unknown prospect to a basketball legend. Fight for
            minutes, weigh every offer, survive the unexpected and build a
            career worth replaying.
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
          <button
            className="brand-button"
            onClick={() => {
              setSetupStep(1);
              setGame(DEFAULT);
            }}
          >
            <span className="brand-mark">FCL</span> FULL COURT LEGACY
          </button>
          <span className="nav-label">STEP {setupStep} OF 2</span>
          {achievementButton}
        </header>
        <section className={`setup-card setup-step-${setupStep}`}>
          <div className="setup-heading">
            <p className="kicker">
              {setupStep === 1 ? "PLAYER IDENTITY" : "PLAYER BUILD"}
            </p>
            <h1>
              {setupStep === 1 ? "Put your name on it" : "Choose your game"}
            </h1>
            <p>
              {setupStep === 1
                ? "Pick the name and number that will follow your whole career."
                : "Choose your position. Your starting path will be revealed when your career begins."}
            </p>
          </div>
          {setupStep === 1 ? (
            <>
              <div className="setup-grid identity-step-grid">
                <div className="form-stack identity-form">
                  <div className="identity-fields">
                    <label>
                      <span>NAME</span>
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
                    </label>
                    <label>
                      <span>JERSEY NUMBER</span>
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
                </div>
                <aside className="player-preview jersey-card">
                  <p>YOUR JERSEY</p>
                  <div className="jersey-stage" aria-label="Jersey preview">
                    <div className="jersey-preview">
                      <span>{game.name.trim() || "YOUR NAME"}</span>
                      <strong>{game.jerseyNumber || "?"}</strong>
                    </div>
                  </div>
                </aside>
              </div>
              <button
                className="primary-action setup-submit"
                disabled={
                  !game.name.trim() || !/^\d{1,2}$/.test(game.jerseyNumber)
                }
                onClick={() => setSetupStep(2)}
              >
                CONTINUE TO PLAYER BUILD <span>→</span>
              </button>
            </>
          ) : (
            <div className="build-step">
              <div className="form-stack">
                <div className="build-options-grid">
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
                              }))
                            }
                          >
                            {position}
                          </button>
                        ),
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="setup-actions">
                <button
                  className="secondary-action"
                  onClick={() => setSetupStep(1)}
                >
                  BACK
                </button>
                <button
                  className="primary-action"
                  onClick={confirmPlayer}
                >
                  START MY CAREER <span>→</span>
                </button>
              </div>
            </div>
          )}
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
                #{game.jerseyNumber} · {game.position} · {game.role}
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
  const mandatoryRetirement = game.age >= 39 && game.retirementOffered;
  const stayAvailable = !mandatoryRetirement && !collegeEligibilityOver;
  const reservedOffseasonOptions =
    Number(stayAvailable) +
    Number(!mandatoryRetirement && game.draftEligible) +
    Number(game.retirementOffered);
  const visibleOffers = mandatoryRetirement
    ? []
    : offers.slice(0, Math.max(0, 3 - reservedOffseasonOptions));
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
              <span>{game.role}</span>
              <span>AGE {game.age}</span>
            </div>
          </div>
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
                      <p className="kicker">
                        {mandatoryRetirement ? "FINAL DECISION" : "YOUR FUTURE"}
                      </p>
                      <h2>
                        {mandatoryRetirement
                          ? "Your playing career is complete"
                          : "Choose the next chapter"}
                      </h2>
                    </div>
                    <span>
                      {mandatoryRetirement ? "RETIREMENT" : "ROLE · TEAM · DRAFT"}
                    </span>
                  </div>
                  <div className="offseason-summary">
                    <strong>
                      {mandatoryRetirement
                        ? "FINAL SEASON COMPLETE"
                        : game.draftProjection}
                    </strong>
                    <span>
                      {mandatoryRetirement
                        ? "Retirement is the only remaining choice"
                        : visibleOffers.length
                        ? `${visibleOffers.length} team offer${visibleOffers.length > 1 ? "s" : ""}`
                        : "No outside offers this offseason"}
                    </span>
                  </div>
                  <div className="offseason-grid">
                    {stayAvailable && (
                    <button
                      className="destination-card stay-card"
                      onClick={() => chooseDestination(game.team)}
                    >
                      {teamMark(game.team, true)}
                      <p>STAY · {game.role.toUpperCase()}</p>
                      <h3>{game.team.name}</h3>
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
                    {!mandatoryRetirement && visibleOffers.map(({ team, offer }) => (
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
                    {!mandatoryRetirement && game.draftEligible && (
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
                    {game.retirementOffered && (
                      <button
                        className="destination-card retirement-choice-card"
                        onClick={retirePlayer}
                      >
                        <div className="retirement-badge">END</div>
                        <p>RETIRE FROM BASKETBALL</p>
                        <h3>Walk away on your terms</h3>
                        <div className="offer-pitch">
                          Close the final chapter and reveal your complete career
                          legacy.
                        </div>
                        <span>RETIRE →</span>
                      </button>
                    )}
                  </div>
                  {!mandatoryRetirement && collegeEligibilityOver && !game.draftEligible && (
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
              midgameDecision ? (
                <>
                  <div className="section-title">
                    <div>
                      <p className="kicker">FINAL POSSESSION</p>
                      <h2>Down one. Who decides the game?</h2>
                    </div>
                    <span>{clamp(game.attributes.scoring, 30, 70)}% SHOT CHANCE</span>
                  </div>
                  <div className="choice-grid">
                    <button
                      className="choice-card"
                      onClick={() => resolveMidgameDecision("shot")}
                    >
                      <p>BET ON YOURSELF</p>
                      <h3>Take the shot</h3>
                      <div>
                        Call your own number and trust your scoring to decide the
                        game.
                      </div>
                    </button>
                    <button
                      className="choice-card"
                      onClick={() => resolveMidgameDecision("coach")}
                    >
                      <p>TRUST THE SYSTEM</p>
                      <h3>Run the coach&apos;s play</h3>
                      <div>Execute the call exactly as drawn up and let the possession play out.</div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="section-title">
                    <div>
                      <p className="kicker">NEXT SEASON</p>
                      <h2>Age {game.age} is ready.</h2>
                    </div>
                    <span>40% CHANCE OF A MID-GAME DECISION</span>
                  </div>
                  <button className="primary-action season-start" onClick={startSeason}>
                    PLAY SEASON <span>→</span>
                  </button>
                </>
              )
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
      {draftSummary && (
        <DraftSummaryModal
          summary={draftSummary}
          onClose={() => setDraftSummary(null)}
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
        <dd>{developmentLabel(role, team)}</dd>
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

function DraftSummaryModal({
  summary,
  onClose,
}: {
  summary: DraftSummary;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop draft-summary-backdrop" role="presentation">
      <section
        className="draft-summary-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-summary-title"
      >
        <div className="draft-summary-topline">
          <img src="nba-logo.svg" alt="NBA" />
          <span>DRAFT NIGHT · ROUND {summary.round}</span>
        </div>
        <div className="draft-pick-callout">
          <span>PICK</span>
          <strong>#{summary.pick}</strong>
        </div>
        <p className="kicker">THE CALL IS IN</p>
        <h2 id="draft-summary-title">{summary.team.name}</h2>
        <p className="draft-announcement">
          selected you with the {summary.pick}
          {summary.pick % 10 === 1 && summary.pick !== 11
            ? "st"
            : summary.pick % 10 === 2 && summary.pick !== 12
              ? "nd"
              : summary.pick % 10 === 3 && summary.pick !== 13
                ? "rd"
                : "th"} pick.
        </p>
        <div className="draft-team-lockup">
          {teamMark(summary.team)}
          <div>
            <span>WELCOME TO THE NBA</span>
            <strong>{summary.team.short}</strong>
          </div>
        </div>
        <dl className="draft-summary-grid">
          <div>
            <dt>ROLE</dt>
            <dd>{summary.role.toUpperCase()}</dd>
          </div>
          <div>
            <dt>CONTRACT</dt>
            <dd>4 YEARS</dd>
          </div>
          <div>
            <dt>YEAR ONE</dt>
            <dd>{formatMoney(summary.salary)}</dd>
          </div>
          <div>
            <dt>PRE-DRAFT STOCK</dt>
            <dd>{summary.projection.toUpperCase()}</dd>
          </div>
        </dl>
        <button className="primary-action" onClick={onClose}>
          BEGIN NBA CAREER <span>→</span>
        </button>
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
