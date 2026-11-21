/**
 * School Math is in development (registry status). Version 1 shows its card on a
 * device once a grown-up has opened /school-math there, or has turned on
 * "Singapore Method on this device" in Settings, so other families do not meet a
 * Grade 2 test prep with fixed dates. Remove when the module goes live.
 *
 * The switch in Settings exists because a web app saved to an iPad / iPhone home
 * screen keeps its own storage, apart from Safari, and opens at "/": opening
 * /school-math in Safari never reached it, and the home-screen app has no address
 * bar (owner, 2026-11-21).
 */
import { useEffect, useState } from 'react'
import { getModule } from '@/modules/core/registry'

export const SCHOOL_MATH_FLAG = 'mf.schoolMath.enabled'
const CHANGED = 'mf:school-math-access'

export function isSchoolMathEnabled(): boolean {
  if (getModule('school-math').status === 'live') return true
  try {
    return window.localStorage.getItem(SCHOOL_MATH_FLAG) === '1'
  } catch {
    return false
  }
}

function setFlag(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(SCHOOL_MATH_FLAG, '1')
    else window.localStorage.removeItem(SCHOOL_MATH_FLAG)
  } catch {
    /* storage blocked: the route still works by its link */
  }
  try {
    window.dispatchEvent(new Event(CHANGED))
  } catch {
    /* no window (tests) */
  }
}

export function enableSchoolMath(): void {
  setFlag(true)
}

export function disableSchoolMath(): void {
  setFlag(false)
}

/** The flag as React state: follows the Settings switch at once, and other tabs. */
export function useSchoolMathEnabled(): boolean {
  const [on, setOn] = useState(isSchoolMathEnabled)
  useEffect(() => {
    const sync = () => setOn(isSchoolMathEnabled())
    window.addEventListener(CHANGED, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return on
}
