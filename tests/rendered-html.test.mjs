import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the Full Court Legacy experience", async () => {
  const [page, teams, layout, css, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/teams.ts", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(page, /FULL COURT LEGACY/);
  assert.match(page, /full-court-legacy-save/);
  assert.match(page, /startSeason/);
  assert.match(page, /randomInt\(40, 54\)/);
  assert.match(page, /age: 16/);
  assert.match(page, /START IN EUROPE/);
  assert.match(page, /START IN COLLEGE/);
  assert.match(page, /DECLARE FOR THE DRAFT/);
  assert.match(page, /START MY CAREER/);
  assert.match(page, /jerseyNumber/);
  assert.match(page, /STEP \{setupStep\} OF 2/);
  assert.match(page, /CONTINUE TO PLAYER BUILD/);
  assert.match(page, /YOUR JERSEY/);
  assert.match(page, /<i>FCL<\/i>/);
  assert.match(page, /<small>FULL COURT<\/small>/);
  assert.match(page, /full-court-legacy-profile/);
  assert.match(page, /shareCareer/);
  assert.match(page, /createCareerCard/);
  assert.match(page, /calculateOvr/);
  assert.match(page, /PlayerAttributes/);
  assert.match(page, /mobile-career-tabs/);
  assert.match(page, /OfferMetrics/);
  assert.match(page, /TITLE OUTLOOK/);
  assert.match(page, /SHARE CAREER/);
  assert.doesNotMatch(page, /RATINGS SEALED/);
  assert.doesNotMatch(page, /Remembered for your next career/);
  assert.doesNotMatch(page, /<small>HIDDEN POT<\/small>/);
  assert.match(page, /"Star Player": 1\.2/);
  assert.match(page, /Starter: 1\.1/);
  assert.match(page, /"6th Man": 1/);
  assert.match(page, /"Bench Player": 0\.85/);
  assert.match(page, /"Fringe Player": 0\.65/);
  assert.match(page, /MORE PLAYTIME/);
  assert.match(page, /SeasonResultModal/);
  assert.match(page, /DraftSummaryModal/);
  assert.match(page, /THE CALL IS IN/);
  assert.match(page, /BEGIN NBA CAREER/);
  assert.match(page, /nba-logo\.svg/);
  assert.match(page, /randomInt\(1, 100\) <= 40/);
  assert.match(page, /clamp\(attributes\.scoring, 30, 70\)/);
  assert.match(page, /attributes\.scoring \+ 5/);
  assert.match(page, /attributes\.scoring - 2/);
  assert.match(page, /Take the shot/);
  assert.match(page, /Run the coach/);
  assert.match(page, /game\.potential/);
  assert.match(page, /startingOvr \+ randomInt\(30, 45\)/);
  assert.match(page, /reduce\(\(total, key\) => total \+ attributes\[key\], 0\) \/ 5/);
  assert.match(page, /athleticism: 2/);
  assert.doesNotMatch(page, /ARCHETYPES/);
  assert.doesNotMatch(page, /game\.health/);
  assert.match(page, /chooseDestination/);
  assert.match(page, /full-court-legacy-achievements/);
  assert.equal(teams.match(/league: "NBA"/g)?.length, 30);
  assert.equal(teams.match(/league: "NCAA"/g)?.length, 24);
  assert.equal(teams.match(/league: "EuroLeague"/g)?.length, 20);
  assert.equal(teams.match(/league: "EuroCup"/g)?.length, 12);
  assert.equal(teams.match(/trainingMultiplier:/g)?.length, 87);
  assert.match(teams, /Oklahoma City Thunder/);
  assert.match(teams, /Zalgiris Kaunas/);
  assert.match(page, /Hidden Gem/);
  assert.match(page, /College eligibility is complete/);
  assert.match(page, /CONTRACT/);
  assert.match(page, /INNER CIRCLE/);
  assert.match(page, /CAREER LEDGER/);
  assert.match(page, /UNOFFICIAL FAN GAME/);
  assert.match(layout, /Full Court Legacy/);
  assert.match(layout, /og\.png/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width: 390px/);
  assert.match(css, /mobile-tab-season/);
  assert.match(css, /career-card-preview/);
  assert.match(css, /offer-metrics/);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
