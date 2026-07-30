/**
 * Phase 7 harness sanity drive — 3 steps: login-bypass → hub renders → shot.
 *
 * Run (dev server must be up in another terminal: cd frontend && npm run dev):
 *   cd frontend && npx tsx ../modules/best-brains/testing/harness/sanity-run.ts
 *
 * Exit code 0 = harness usable; non-zero = fix the harness before persona runs.
 */

import { launchHarness } from './harness';
import { scenarioMayaMidWeek, CHILDREN, packFor } from './fixtures';

async function main() {
  const db = scenarioMayaMidWeek();
  const pack = packFor('B', 1);
  const h = await launchHarness({
    persona: 'sanity',
    db,
    viewport: 'child',
    selectedChildId: CHILDREN.maya.id,
  });

  try {
    // Step 1 — login bypass: /foundry must NOT bounce to /login.
    // 60s first-load budget: a cold Vite dev server transforms the lazy
    // /foundry chunk on first request.
    await h.page.goto(h.url('/foundry'), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await h.page.waitForTimeout(4000); // AuthContext + FoundryLayout grace window
    const url1 = h.page.url();
    if (url1.includes('/login') || url1.includes('/select-child')) {
      throw new Error(`login bypass failed — landed on ${url1}`);
    }
    await h.step('login-bypass', `landed on ${url1}`);

    // Step 2 — hub renders with the fixture week's real concept name.
    await h.page.waitForSelector(`text=${pack.identity.conceptName}`, { timeout: 15000 });
    const dayTile = await h.page.locator('text=/Day 3/i').first().isVisible().catch(() => false);
    await h.step('hub-renders', `concept "${pack.identity.conceptName}" visible; Day-3 tile visible=${dayTile}`);

    // Step 3 — screenshot.
    await h.shot('hub');

    const unexpected = h.consoleEntries().filter((c) => !c.known);
    const runFile = await h.finish('ok', `unexpected console entries: ${unexpected.length}`);
    console.log(`SANITY OK — run log: ${runFile}`);
    console.log(`unexpected console entries: ${unexpected.length}`);
    for (const c of unexpected.slice(0, 10)) console.log(`  [${c.type}] ${c.text.slice(0, 200)}`);
  } catch (e) {
    await h.shot('sanity-failure').catch(() => undefined);
    await h.finish('failed', String(e));
    console.error('SANITY FAILED:', e);
    process.exit(1);
  }
}

main();
