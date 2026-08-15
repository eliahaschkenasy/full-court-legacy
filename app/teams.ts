export type TeamPath = "europe" | "college" | "nba";

export type Team = {
  name: string;
  short: string;
  league: string;
  logo: string;
  color: string;
  accent: string;
  prestige: number;
  trainingMultiplier: number;
  path: TeamPath;
  logoScale?: number;
  logoY?: number;
};

type TeamSeed = Omit<Team, "path" | "logo"> & { logo: string };

const nbaLogo = (code: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${code}.png`;
const collegeLogo = (id: number) =>
  `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;
const officialSiteMark = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;

const europe: TeamSeed[] = [
  { name: "Anadolu Efes", short: "EFS", league: "EuroLeague", logo: officialSiteMark("anadoluefessk.org"), color: "#17458f", accent: "#ffffff", prestige: 86, trainingMultiplier: 1.1 },
  { name: "AS Monaco", short: "ASM", league: "EuroLeague", logo: officialSiteMark("asmonaco.basketball"), color: "#d71920", accent: "#ffffff", prestige: 84, trainingMultiplier: 1.08 },
  { name: "Crvena Zvezda", short: "CZV", league: "EuroLeague", logo: officialSiteMark("kkcrvenazvezda.rs"), color: "#d71920", accent: "#ffffff", prestige: 82, trainingMultiplier: 1.12 },
  { name: "Dubai Basketball", short: "DUB", league: "EuroLeague", logo: officialSiteMark("dubaibasketball.com"), color: "#151515", accent: "#d4af37", prestige: 75, trainingMultiplier: 1.05 },
  { name: "Olimpia Milano", short: "MIL", league: "EuroLeague", logo: officialSiteMark("olimpiamilano.com"), color: "#d71920", accent: "#ffffff", prestige: 84, trainingMultiplier: 1.08 },
  { name: "FC Barcelona", short: "FCB", league: "EuroLeague", logo: "teams/barcelona.png", color: "#9b1634", accent: "#1659c9", prestige: 89, trainingMultiplier: 1.14, logoScale: 0.9, logoY: 2 },
  { name: "Bayern Munich", short: "BAY", league: "EuroLeague", logo: officialSiteMark("fcbayern.com"), color: "#dc052d", accent: "#ffffff", prestige: 83, trainingMultiplier: 1.1 },
  { name: "Fenerbahce", short: "FEN", league: "EuroLeague", logo: officialSiteMark("fenerbahce.org"), color: "#ffed00", accent: "#002d72", prestige: 90, trainingMultiplier: 1.11 },
  { name: "Hapoel Tel Aviv", short: "HTA", league: "EuroLeague", logo: officialSiteMark("hapoeluta.org"), color: "#d71920", accent: "#ffffff", prestige: 78, trainingMultiplier: 1.1 },
  { name: "Baskonia", short: "BKN", league: "EuroLeague", logo: officialSiteMark("baskonia.com"), color: "#d71920", accent: "#003b73", prestige: 81, trainingMultiplier: 1.15 },
  { name: "ASVEL Villeurbanne", short: "ASV", league: "EuroLeague", logo: officialSiteMark("ldlcasvel.com"), color: "#111111", accent: "#ffffff", prestige: 76, trainingMultiplier: 1.12 },
  { name: "Maccabi Tel Aviv", short: "MTA", league: "EuroLeague", logo: "teams/maccabi-tel-aviv.png", color: "#f5c928", accent: "#194f9e", prestige: 84, trainingMultiplier: 1.1, logoScale: 1.02 },
  { name: "Olympiacos", short: "OLY", league: "EuroLeague", logo: officialSiteMark("olympiacosbc.gr"), color: "#d71920", accent: "#ffffff", prestige: 91, trainingMultiplier: 1.12 },
  { name: "Panathinaikos", short: "PAO", league: "EuroLeague", logo: officialSiteMark("paobc.gr"), color: "#007a3d", accent: "#ffffff", prestige: 92, trainingMultiplier: 1.12 },
  { name: "Paris Basketball", short: "PAR", league: "EuroLeague", logo: "teams/paris.png", color: "#ff5d2e", accent: "#161b33", prestige: 80, trainingMultiplier: 1.15 },
  { name: "Partizan Belgrade", short: "PAR", league: "EuroLeague", logo: officialSiteMark("kkpartizan.rs"), color: "#111111", accent: "#ffffff", prestige: 86, trainingMultiplier: 1.16 },
  { name: "Real Madrid", short: "RMA", league: "EuroLeague", logo: "teams/real-madrid.png", color: "#f7f7f2", accent: "#7256ff", prestige: 94, trainingMultiplier: 1.15, logoScale: 0.88, logoY: -1 },
  { name: "Valencia Basket", short: "VAL", league: "EuroLeague", logo: officialSiteMark("valenciabasket.com"), color: "#f36f21", accent: "#111111", prestige: 80, trainingMultiplier: 1.11 },
  { name: "Virtus Bologna", short: "VIR", league: "EuroLeague", logo: officialSiteMark("virtus.it"), color: "#111111", accent: "#ffffff", prestige: 82, trainingMultiplier: 1.09 },
  { name: "Zalgiris Kaunas", short: "ZAL", league: "EuroLeague", logo: officialSiteMark("zalgiris.lt"), color: "#007a3d", accent: "#ffffff", prestige: 84, trainingMultiplier: 1.16 },
  { name: "Hapoel Jerusalem", short: "JLM", league: "EuroCup", logo: officialSiteMark("hapoel.co.il"), color: "#d71920", accent: "#ffffff", prestige: 69, trainingMultiplier: 1.08 },
  { name: "London Lions", short: "LDN", league: "EuroCup", logo: officialSiteMark("thelondonlions.com"), color: "#111111", accent: "#d4af37", prestige: 57, trainingMultiplier: 1.04 },
  { name: "Ratiopharm Ulm", short: "ULM", league: "EuroCup", logo: officialSiteMark("ratiopharmulm.com"), color: "#f58220", accent: "#111111", prestige: 65, trainingMultiplier: 1.16 },
  { name: "BAXI Manresa", short: "MAN", league: "EuroCup", logo: officialSiteMark("basquetmanresa.com"), color: "#d71920", accent: "#ffffff", prestige: 64, trainingMultiplier: 1.14 },
  { name: "Besiktas", short: "BJK", league: "EuroCup", logo: officialSiteMark("bjk.com.tr"), color: "#111111", accent: "#ffffff", prestige: 70, trainingMultiplier: 1.08 },
  { name: "Cedevita Olimpija", short: "COL", league: "EuroCup", logo: officialSiteMark("cedevita.olimpija.com"), color: "#f58220", accent: "#008348", prestige: 66, trainingMultiplier: 1.14 },
  { name: "JL Bourg", short: "JLB", league: "EuroCup", logo: officialSiteMark("jlbourg-basket.com"), color: "#d71920", accent: "#ffffff", prestige: 66, trainingMultiplier: 1.12 },
  { name: "Aris Thessaloniki", short: "ARI", league: "EuroCup", logo: officialSiteMark("arisbc.gr"), color: "#f7d117", accent: "#111111", prestige: 67, trainingMultiplier: 1.08 },
  { name: "Buducnost", short: "BUD", league: "EuroCup", logo: officialSiteMark("kkbuducnost.me"), color: "#006bb6", accent: "#ffffff", prestige: 68, trainingMultiplier: 1.1 },
  { name: "Turk Telekom", short: "TTK", league: "EuroCup", logo: officialSiteMark("turktelekomspor.com.tr"), color: "#006bb6", accent: "#ffffff", prestige: 67, trainingMultiplier: 1.09 },
  { name: "Reyer Venice", short: "VEN", league: "EuroCup", logo: officialSiteMark("reyer.it"), color: "#7b1f29", accent: "#d4af37", prestige: 68, trainingMultiplier: 1.09 },
  { name: "Bahcesehir Koleji", short: "BKS", league: "EuroCup", logo: officialSiteMark("bahcesehirsporkulubu.org"), color: "#d71920", accent: "#17365d", prestige: 66, trainingMultiplier: 1.09 },
];

const college: TeamSeed[] = [
  { name: "Duke Blue Devils", short: "DUKE", league: "NCAA", logo: "teams/duke.png", color: "#003087", accent: "#ffffff", prestige: 85, trainingMultiplier: 1.12 },
  { name: "Kentucky Wildcats", short: "UK", league: "NCAA", logo: "teams/kentucky.png", color: "#0033a0", accent: "#ffffff", prestige: 80, trainingMultiplier: 1.11 },
  { name: "UCLA Bruins", short: "UCLA", league: "NCAA", logo: "teams/ucla.png", color: "#2d68c4", accent: "#f3c43d", prestige: 76, trainingMultiplier: 1.08 },
  { name: "UConn Huskies", short: "CONN", league: "NCAA", logo: "teams/uconn.png", color: "#000e2f", accent: "#ffffff", prestige: 86, trainingMultiplier: 1.12 },
  { name: "Kansas Jayhawks", short: "KU", league: "NCAA", logo: collegeLogo(2305), color: "#0051ba", accent: "#e8000d", prestige: 86, trainingMultiplier: 1.1 },
  { name: "North Carolina Tar Heels", short: "UNC", league: "NCAA", logo: collegeLogo(153), color: "#7bafd4", accent: "#ffffff", prestige: 87, trainingMultiplier: 1.11 },
  { name: "Michigan State Spartans", short: "MSU", league: "NCAA", logo: collegeLogo(127), color: "#18453b", accent: "#ffffff", prestige: 82, trainingMultiplier: 1.1 },
  { name: "Arizona Wildcats", short: "ARIZ", league: "NCAA", logo: collegeLogo(12), color: "#cc0033", accent: "#003366", prestige: 81, trainingMultiplier: 1.08 },
  { name: "Gonzaga Bulldogs", short: "GONZ", league: "NCAA", logo: collegeLogo(2250), color: "#002967", accent: "#c8102e", prestige: 84, trainingMultiplier: 1.11 },
  { name: "Houston Cougars", short: "HOU", league: "NCAA", logo: collegeLogo(248), color: "#c8102e", accent: "#ffffff", prestige: 84, trainingMultiplier: 1.1 },
  { name: "Baylor Bears", short: "BAY", league: "NCAA", logo: collegeLogo(239), color: "#154734", accent: "#ffb81c", prestige: 80, trainingMultiplier: 1.08 },
  { name: "Alabama Crimson Tide", short: "BAMA", league: "NCAA", logo: collegeLogo(333), color: "#9e1b32", accent: "#ffffff", prestige: 81, trainingMultiplier: 1.08 },
  { name: "Auburn Tigers", short: "AUB", league: "NCAA", logo: collegeLogo(2), color: "#0c2340", accent: "#f26522", prestige: 80, trainingMultiplier: 1.08 },
  { name: "Tennessee Volunteers", short: "TENN", league: "NCAA", logo: collegeLogo(2633), color: "#ff8200", accent: "#ffffff", prestige: 80, trainingMultiplier: 1.09 },
  { name: "Purdue Boilermakers", short: "PUR", league: "NCAA", logo: collegeLogo(2509), color: "#cfb991", accent: "#111111", prestige: 84, trainingMultiplier: 1.09 },
  { name: "Indiana Hoosiers", short: "IU", league: "NCAA", logo: collegeLogo(84), color: "#990000", accent: "#ffffff", prestige: 78, trainingMultiplier: 1.07 },
  { name: "Arkansas Razorbacks", short: "ARK", league: "NCAA", logo: collegeLogo(8), color: "#9d2235", accent: "#ffffff", prestige: 77, trainingMultiplier: 1.07 },
  { name: "Villanova Wildcats", short: "NOVA", league: "NCAA", logo: collegeLogo(222), color: "#003b5c", accent: "#13b5ea", prestige: 80, trainingMultiplier: 1.1 },
  { name: "Louisville Cardinals", short: "LOU", league: "NCAA", logo: collegeLogo(97), color: "#ad0000", accent: "#111111", prestige: 77, trainingMultiplier: 1.07 },
  { name: "Florida Gators", short: "FLA", league: "NCAA", logo: collegeLogo(57), color: "#0021a5", accent: "#fa4616", prestige: 83, trainingMultiplier: 1.09 },
  { name: "Texas Tech Red Raiders", short: "TTU", league: "NCAA", logo: collegeLogo(2641), color: "#cc0000", accent: "#111111", prestige: 76, trainingMultiplier: 1.08 },
  { name: "Illinois Fighting Illini", short: "ILL", league: "NCAA", logo: collegeLogo(356), color: "#13294b", accent: "#ff5f05", prestige: 78, trainingMultiplier: 1.08 },
  { name: "Michigan Wolverines", short: "MICH", league: "NCAA", logo: collegeLogo(130), color: "#00274c", accent: "#ffcb05", prestige: 80, trainingMultiplier: 1.09 },
  { name: "Oregon Ducks", short: "ORE", league: "NCAA", logo: collegeLogo(2483), color: "#154733", accent: "#fee123", prestige: 75, trainingMultiplier: 1.08 },
];

const nba: TeamSeed[] = [
  { name: "Atlanta Hawks", short: "ATL", league: "NBA", logo: nbaLogo("atl"), color: "#e03a3e", accent: "#fdb927", prestige: 74, trainingMultiplier: 1.2 },
  { name: "Boston Celtics", short: "BOS", league: "NBA", logo: "teams/boston-celtics.png", color: "#007a33", accent: "#ba9653", prestige: 96, trainingMultiplier: 1.24 },
  { name: "Brooklyn Nets", short: "BKN", league: "NBA", logo: nbaLogo("bkn"), color: "#111111", accent: "#ffffff", prestige: 76, trainingMultiplier: 1.2 },
  { name: "Charlotte Hornets", short: "CHA", league: "NBA", logo: "teams/charlotte-hornets.png", color: "#00788c", accent: "#1d1160", prestige: 69, trainingMultiplier: 1.19 },
  { name: "Chicago Bulls", short: "CHI", league: "NBA", logo: "teams/chicago-bulls.png", color: "#ce1141", accent: "#f4f4ef", prestige: 82, trainingMultiplier: 1.2 },
  { name: "Cleveland Cavaliers", short: "CLE", league: "NBA", logo: nbaLogo("cle"), color: "#860038", accent: "#fdbb30", prestige: 88, trainingMultiplier: 1.23 },
  { name: "Dallas Mavericks", short: "DAL", league: "NBA", logo: nbaLogo("dal"), color: "#00538c", accent: "#b8c4ca", prestige: 84, trainingMultiplier: 1.22 },
  { name: "Denver Nuggets", short: "DEN", league: "NBA", logo: nbaLogo("den"), color: "#0e2240", accent: "#fec524", prestige: 92, trainingMultiplier: 1.24 },
  { name: "Detroit Pistons", short: "DET", league: "NBA", logo: "teams/detroit-pistons.png", color: "#c8102e", accent: "#1d42ba", prestige: 70, trainingMultiplier: 1.22 },
  { name: "Golden State Warriors", short: "GSW", league: "NBA", logo: "teams/golden-state-warriors.png", color: "#1d428a", accent: "#ffc72c", prestige: 91, trainingMultiplier: 1.25 },
  { name: "Houston Rockets", short: "HOU", league: "NBA", logo: nbaLogo("hou"), color: "#ce1141", accent: "#ffffff", prestige: 82, trainingMultiplier: 1.24 },
  { name: "Indiana Pacers", short: "IND", league: "NBA", logo: nbaLogo("ind"), color: "#002d62", accent: "#fdbb30", prestige: 85, trainingMultiplier: 1.25 },
  { name: "LA Clippers", short: "LAC", league: "NBA", logo: nbaLogo("lac"), color: "#c8102e", accent: "#1d428a", prestige: 83, trainingMultiplier: 1.22 },
  { name: "Los Angeles Lakers", short: "LAL", league: "NBA", logo: "teams/la-lakers.png", color: "#fdb927", accent: "#552583", prestige: 94, trainingMultiplier: 1.22 },
  { name: "Memphis Grizzlies", short: "MEM", league: "NBA", logo: nbaLogo("mem"), color: "#5d76a9", accent: "#f5b112", prestige: 77, trainingMultiplier: 1.25 },
  { name: "Miami Heat", short: "MIA", league: "NBA", logo: "teams/miami-heat.png", color: "#98002e", accent: "#f9a01b", prestige: 88, trainingMultiplier: 1.27 },
  { name: "Milwaukee Bucks", short: "MIL", league: "NBA", logo: nbaLogo("mil"), color: "#00471b", accent: "#eee1c6", prestige: 88, trainingMultiplier: 1.23 },
  { name: "Minnesota Timberwolves", short: "MIN", league: "NBA", logo: nbaLogo("min"), color: "#0c2340", accent: "#78be20", prestige: 87, trainingMultiplier: 1.24 },
  { name: "New Orleans Pelicans", short: "NOP", league: "NBA", logo: nbaLogo("no"), color: "#0c2340", accent: "#c8102e", prestige: 73, trainingMultiplier: 1.2 },
  { name: "New York Knicks", short: "NYK", league: "NBA", logo: "teams/new-york-knicks.png", color: "#f58426", accent: "#006bb6", prestige: 90, trainingMultiplier: 1.23 },
  { name: "Oklahoma City Thunder", short: "OKC", league: "NBA", logo: nbaLogo("okc"), color: "#007ac1", accent: "#ef3b24", prestige: 94, trainingMultiplier: 1.28 },
  { name: "Orlando Magic", short: "ORL", league: "NBA", logo: "teams/orlando-magic.png", color: "#0077c0", accent: "#c4ced4", prestige: 82, trainingMultiplier: 1.25 },
  { name: "Philadelphia 76ers", short: "PHI", league: "NBA", logo: nbaLogo("phi"), color: "#006bb6", accent: "#ed174c", prestige: 83, trainingMultiplier: 1.21 },
  { name: "Phoenix Suns", short: "PHX", league: "NBA", logo: nbaLogo("phx"), color: "#1d1160", accent: "#e56020", prestige: 84, trainingMultiplier: 1.21 },
  { name: "Portland Trail Blazers", short: "POR", league: "NBA", logo: nbaLogo("por"), color: "#e03a3e", accent: "#111111", prestige: 74, trainingMultiplier: 1.23 },
  { name: "Sacramento Kings", short: "SAC", league: "NBA", logo: nbaLogo("sac"), color: "#5a2d81", accent: "#63727a", prestige: 79, trainingMultiplier: 1.22 },
  { name: "San Antonio Spurs", short: "SAS", league: "NBA", logo: nbaLogo("sa"), color: "#111111", accent: "#c4ced4", prestige: 90, trainingMultiplier: 1.28 },
  { name: "Toronto Raptors", short: "TOR", league: "NBA", logo: nbaLogo("tor"), color: "#ce1141", accent: "#111111", prestige: 79, trainingMultiplier: 1.26 },
  { name: "Utah Jazz", short: "UTA", league: "NBA", logo: nbaLogo("utah"), color: "#002b5c", accent: "#f9a01b", prestige: 71, trainingMultiplier: 1.23 },
  { name: "Washington Wizards", short: "WAS", league: "NBA", logo: nbaLogo("wsh"), color: "#002b5c", accent: "#e31837", prestige: 68, trainingMultiplier: 1.19 },
];

export const TEAMS: Team[] = [
  ...europe.map((team) => ({ ...team, path: "europe" as const })),
  ...college.map((team) => ({ ...team, path: "college" as const })),
  ...nba.map((team) => ({ ...team, path: "nba" as const })),
];
