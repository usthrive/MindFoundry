/**
 * sm-sw-fallback-test — the service worker must not answer the Singapore Method pages
 * with the app shell (owner, 2026-11-21: in the home-screen app, Test Prep and My
 * Scorecard came back to the module home).
 *
 * Why: the pages are static HTML opened in an iframe as /school-math/<page>.html?c=<id>.
 * With the query the precache entry does not match, so workbox's NavigationRoute served
 * index.html, and the SPA inside the frame redirected to /school-math.
 *
 * Run (from frontend/): npx tsx scripts/sm-sw-fallback-test.ts [--sw <url-or-file>]
 *
 * Asserts on vite.config.ts: navigateFallbackDenylist exists, and applying it (the way
 * workbox does: pathname + search tested against each RegExp) denies every static page
 * in public/school-math/ with and without ?c=…&view=…, and does NOT deny the app's own
 * routes (/, /dashboard, /school-math, /school-math/test-prep, /foundry/hub).
 * With --sw it also checks a built or deployed sw.js carries the same denylist.
 * Broken controls: a config without the denylist; a denylist that also denies
 * /school-math (the app route), so the SPA would break offline.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
let pass = 0, fail = 0
const say = (ok: boolean, msg: string) => { if (ok) pass++; else fail++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${msg}`) }

function denylistFrom(src: string): RegExp[] | null {
  const m = src.match(/navigateFallbackDenylist:\s*\[(.*)\],?\s*$/m)
  if (!m) return null
  // our own config file: evaluate the array literal of RegExps as written
  const out = new Function(`return [${m[1]}]`)() as unknown[]
  return out.filter((x): x is RegExp => x instanceof RegExp)
}
// workbox NavigationRoute: a request is handled unless (pathname + search) matches a denylist entry
const denied = (deny: RegExp[], url: string) => deny.some((r) => r.test(url))

const pages = readdirSync(join(HERE, '..', 'public', 'school-math')).filter((f) => f.endsWith('.html'))
const mustDeny = pages.flatMap((p) => [`/school-math/${p}`, `/school-math/${p}?c=abc-123`, `/school-math/${p}?c=abc-123&view=scorecard`])
const mustHandle = ['/', '/dashboard', '/school-math', '/school-math/', '/school-math/test-prep', '/school-math/scorecard', '/school-math/bar-models', '/foundry/hub', '/study']

function check(deny: RegExp[] | null): string[] {
  const bad: string[] = []
  if (!deny || deny.length === 0) return ['no navigateFallbackDenylist']
  for (const u of mustDeny) if (!denied(deny, u)) bad.push(`not denied: ${u}`)
  for (const u of mustHandle) if (denied(deny, u)) bad.push(`app route denied: ${u}`)
  return bad
}

const cfg = readFileSync(join(HERE, '..', 'vite.config.ts'), 'utf8')
const deny = denylistFrom(cfg)
console.log(`static pages: ${pages.join(', ')}`)
const r = check(deny)
say(r.length === 0, `vite.config.ts: every static Singapore Method page (with and without ?c=, &view=) bypasses the app shell; app routes still fall back${r.length ? ' — ' + r.slice(0, 4).join('; ') : ''}`)

const swArg = process.argv.indexOf('--sw')
if (swArg > 0) {
  const where = process.argv[swArg + 1]
  const sw = where.startsWith('http') ? await (await fetch(where)).text() : readFileSync(where, 'utf8')
  const has = sw.includes('school-math') && /denylist:\s*\[[^\]]*school-math/.test(sw)
  say(has, `service worker ${where}: carries the school-math denylist`)
}

console.log('\nbroken controls — each must fire')
say(check(denylistFrom(cfg.replace(/navigateFallbackDenylist:[^\n]*\n/, ''))).length > 0, '(a) a config without the denylist fails')
say(check([/^\/school-math/]).some((b) => b.startsWith('app route denied')), '(b) a denylist that also denies the /school-math app route fails')

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} sm-sw-fallback-test: ${pass}/${pass + fail} checks`)
process.exit(fail === 0 ? 0 : 1)
