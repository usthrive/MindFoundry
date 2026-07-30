# Browser-Testing Tooling — Best Brains Module (Phase 6 smoke tests + Phase 7 personas)

**Decision (2026-07-20, orchestrator + user):** Chrome DevTools MCP is the *first* choice only when the user's logged-in Chrome session is reachable; it is known-flaky under WSL2 (remote-debug bridge dies with VM uptime). The sanctioned fallback — and the DEFAULT for Phase 7 persona runs — is **Playwright driving the system Chrome headlessly**.

## Environment facts (verified)

- Playwright CLI: v1.61.1 available via `npx playwright` (no project dependency needed for basic driving; add as devDependency only if scripts need `@playwright/test` assertions).
- Browser binaries in `~/.cache/ms-playwright`: NONE installed. Do **not** download them — system Chrome exists.
- System Chrome: `/usr/bin/google-chrome` (use `channel: 'chrome'` or `executablePath`).
- Disk: ample (912G free).

## Recommended pattern

```ts
// npx tsx <script>.ts   (tsx already a repo devDependency)
import { chromium } from 'playwright-core' // or playwright if installed
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:5173/login')
// screenshots: await page.screenshot({ path: 'modules/best-brains/testing/screenshots/<name>.png' })
```

If `playwright-core` is not resolvable, `npm i -D playwright-core` (tiny, no browsers) — flag it in the commit.

## Auth for headless runs

The user's login session is NOT available to headless Playwright. Options, in order:
1. **Dedicated test account** created via the app's own signup flow: email `bb-persona-test@mindfoundry.test`-style, clearly-named child profiles (one per persona age band). Live-DB mutation is authorized ONLY for these clearly-named test rows; never touch real users' rows or Kumon tables. Log every created row in the test run notes. If Supabase requires email confirmation and blocks signup, report it as a blocker rather than working around auth.
2. Fall back to the Chrome DevTools MCP + user's session (when alive) for anything auth-blocked.

## Dev server

`cd frontend && npm run dev` (background). Vite default port 5173; check output for the actual port before driving.

## Phase 7 note

Persona runs must capture screenshots to `modules/best-brains/testing/screenshots/<persona>/<step>.png` — they are evidence for FINDINGS.md.

## Phase 7 harness (added 2026-07-20 by the test-harness session)

The shared runner library lives at `modules/best-brains/testing/harness/`:
`harness.ts` (Playwright channel:'chrome' headless + mocked Supabase backend +
screenshot/step-log/console helpers), `fixtures.ts` (honest bb_* scenario
builders), `sanity-run.ts` (verified green 2026-07-20). Usage is documented at
the top of each `testing/personas/*.md` file. Screenshots go to
`testing/screenshots/phase7/<persona>/NN-<label>.png`, run logs to
`testing/runs/<persona>-run.json`.

Hard-won gotchas:
- **`playwright-core` is now a frontend devDependency** (^1.61.1, no browser
  downloads) — installed for this harness; flag it in the eventual commit.
- **The app is a PWA: service-worker fetches BYPASS `page.route`** and leak
  real requests to the live Supabase host (observed: 401 PGRST301 on bb_
  tables). The harness passes `serviceWorkers: 'block'` in `newContext` —
  never remove it.
- First page load on a cold Vite dev server takes up to ~60s (lazy /foundry
  chunk transform); give the first `goto` a 60s timeout, then ~4s settle for
  the AuthContext/FoundryLayout grace window.
- One intermittent `page.goto` 60s-timeout flake was observed even with a warm
  server (WSL2; server curl-checked healthy at the same moment). Retry the run
  once before debugging anything.
- The mastery RPC is EMULATED in the mock (DD1 + LS1-R5, same thresholds);
  the live guard trigger and the acknowledged_at column grant are mirrored as
  rejections. Runners must not claim server-side verification from mock runs.
