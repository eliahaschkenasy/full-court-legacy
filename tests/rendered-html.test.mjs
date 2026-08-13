import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the Full Court Legacy experience", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(page, /FULL COURT LEGACY/);
  assert.match(page, /full-court-legacy-save/);
  assert.match(page, /playSeason/);
  assert.match(page, /CONTRACT/);
  assert.match(page, /INNER CIRCLE/);
  assert.match(page, /CAREER LEDGER/);
  assert.match(page, /UNOFFICIAL FAN GAME/);
  assert.match(layout, /Full Court Legacy/);
  assert.match(layout, /og\.png/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(packageJson, /"build:pages": "next build"/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
