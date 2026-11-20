/**
 * School Math is in development (registry status). Version 1 shows its card on a
 * device once a grown-up has opened /school-math there, so other families do not
 * meet a Grade 2 test prep with fixed dates. Remove when the module goes live.
 */
import { getModule } from '@/modules/core/registry'

const FLAG = 'mf.schoolMath.enabled'

export function isSchoolMathEnabled(): boolean {
  if (getModule('school-math').status === 'live') return true
  try {
    return window.localStorage.getItem(FLAG) === '1'
  } catch {
    return false
  }
}

export function enableSchoolMath(): void {
  try {
    window.localStorage.setItem(FLAG, '1')
  } catch {
    /* storage blocked: the route still works by its link */
  }
}
