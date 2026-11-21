/**
 * sm-device-switch-test — the "Singapore Method on this device" switch (owner, 2026-11-21).
 *
 * Why: a web app saved to an iPad / iPhone home screen keeps its own storage and opens at
 * "/", so the card that appears after /school-math is opened in Safari never reached it.
 * The switch in Settings sets the same per-device flag from inside the app.
 *
 * Run (from frontend/): npx tsx scripts/sm-device-switch-test.ts
 *
 * Asserts, on a fake window with its own storage:
 *   off by default · on after enableSchoolMath · off after disableSchoolMath (the key is
 *   removed, not left as "0") · every change fires the change event the hook listens to ·
 *   blocked storage reads as off and never throws.
 * And by scanning the source:
 *   the dashboard card is shown only through useSchoolMathEnabled (no unguarded card);
 *   Settings has the switch (role="switch", aria-checked, both enable and disable wired),
 *   hidden once the module is live; opening /school-math still turns the flag on.
 * Broken controls (each must fire): a disable that leaves the flag set; a change with no
 * event; a dashboard fixture with the card unguarded; a Settings fixture whose switch only
 * ever turns on.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

// ---- a fake window before the module loads -------------------------------------------
class FakeStorage {
  m = new Map<string, string>()
  blocked = false
  getItem(k: string) { if (this.blocked) throw new Error('blocked'); return this.m.has(k) ? this.m.get(k)! : null }
  setItem(k: string, v: string) { if (this.blocked) throw new Error('blocked'); this.m.set(k, String(v)) }
  removeItem(k: string) { if (this.blocked) throw new Error('blocked'); this.m.delete(k) }
}
const storage = new FakeStorage()
let events = 0
const listeners = new Map<string, Set<() => void>>()
;(globalThis as any).window = {
  localStorage: storage,
  dispatchEvent: (e: { type: string }) => { events++; listeners.get(e.type)?.forEach((f) => f()); return true },
  addEventListener: (t: string, f: () => void) => { if (!listeners.has(t)) listeners.set(t, new Set()); listeners.get(t)!.add(f) },
  removeEventListener: (t: string, f: () => void) => listeners.get(t)?.delete(f),
}
if (typeof (globalThis as any).Event === 'undefined') (globalThis as any).Event = class { constructor(public type: string) {} }

let pass = 0, fail = 0

const say = (ok: boolean, msg: string) => { if (ok) pass++; else fail++; console.log(`${ok ? '  ok  ' : '  FAIL'} ${msg}`) }

async function main() {
  const A = await import('../src/modules/school-math/access')
  const { getModule } = await import('../src/modules/core/registry')
  const live = getModule('school-math').status === 'live'
  console.log(`module status: ${getModule('school-math').status}`)

  // ---- behaviour (one check function, run on the real module and on broken ones) ------
  type Impl = { isOn: () => boolean; on: () => void; off: () => void }
  const behaviour = (impl: Impl): string[] => {
    const bad: string[] = []
    storage.blocked = false
    storage.m.clear()
    if (!live && impl.isOn()) bad.push('on by default')
    let e = events
    impl.on()
    if (!impl.isOn() || storage.getItem(A.SCHOOL_MATH_FLAG) !== '1') bad.push('not on after enable')
    if (events !== e + 1) bad.push('enable fired no change event')
    e = events
    impl.off()
    if (!live && (impl.isOn() || storage.getItem(A.SCHOOL_MATH_FLAG) !== null)) bad.push('not off (key left) after disable')
    if (events !== e + 1) bad.push('disable fired no change event')
    storage.blocked = true
    try { impl.on(); impl.off(); if (!live && impl.isOn()) bad.push('blocked storage reads on') } catch { bad.push('blocked storage throws') }
    storage.blocked = false
    storage.m.clear()
    return bad
  }
  const real: Impl = { isOn: A.isSchoolMathEnabled, on: A.enableSchoolMath, off: A.disableSchoolMath }
  const r = behaviour(real)
  say(r.length === 0, `switch behaviour: off by default, on, off with the key removed, an event on every change, blocked storage safe${r.length ? ' — ' + r.join('; ') : ''}`)

  // ---- source scan --------------------------------------------------------------------
  const src = (p: string) => readFileSync(join(HERE, '..', p), 'utf8')
  const dash = src('src/pages/PracticeModulesPage.tsx')
  const sheet = src('src/components/settings/SettingsBottomSheet.tsx')
  const routes = src('src/modules/school-math/SchoolMathRoutes.tsx')

  const cardGuarded = (code: string) => {
    const at = code.indexOf("getModule('school-math').displayName")
    if (at < 0) return false
    const before = code.slice(Math.max(0, at - 600), at)
    return /\{schoolMathOn && \(/.test(before) && /useSchoolMathEnabled\(\)/.test(code)
  }
  const switchWired = (code: string) =>
    /role="switch"/.test(code) && /aria-checked=\{schoolMathOn\}/.test(code) &&
    /disableSchoolMath\(\)/.test(code) && /enableSchoolMath\(\)/.test(code) &&
    /useSchoolMathEnabled\(\)/.test(code) && /\{!schoolMathLive && \(/.test(code)

  say(cardGuarded(dash), 'dashboard: the Singapore Method card is shown only when the switch is on')
  say(switchWired(sheet), 'Settings: the switch turns on AND off, reports its state, hides once live')
  say(/enableSchoolMath\(\)/.test(routes), 'opening /school-math still turns the flag on (v1 behaviour kept)')

  // ---- broken controls -----------------------------------------------------------------
  console.log('\nbroken controls — each must fire')
  // (a) a disable that writes "0" instead of removing the flag
  const leavesKey: Impl = { ...real, off: () => { storage.setItem(A.SCHOOL_MATH_FLAG, '0'); window.dispatchEvent(new Event('x')) } }
  say(behaviour(leavesKey).includes('not off (key left) after disable'), '(a) a disable that leaves the key behind fails the behaviour check')
  // (b) an enable that writes the flag but fires no event (the dashboard would not update)
  const silent: Impl = { ...real, on: () => storage.setItem(A.SCHOOL_MATH_FLAG, '1') }
  say(behaviour(silent).includes('enable fired no change event'), '(b) an enable with no change event fails the behaviour check')
  // (c) an unguarded card
  const unguarded = dash.replace('{schoolMathOn && (', '{true && (')
  say(!cardGuarded(unguarded), '(c) a dashboard with the card unguarded fails the scan')
  // (d) a switch that only turns on
  const onlyOn = sheet.replace('(schoolMathOn ? disableSchoolMath() : enableSchoolMath())', 'enableSchoolMath()')
  say(!switchWired(onlyOn), '(d) a Settings switch that never turns off fails the scan')

  console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} sm-device-switch-test: ${pass}/${pass + fail} checks`)
  process.exit(fail === 0 ? 0 : 1)
}
main().catch((e) => { console.error(e); process.exit(1) })
