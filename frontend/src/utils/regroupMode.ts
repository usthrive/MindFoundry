/**
 * Subtraction regroup (borrow) helper modes + adaptive graduation logic.
 *
 * Three scaffolding phases:
 *   'auto'     – animation demo. Tapping a column needing a borrow auto-fills the
 *                regrouped row with "-1"/"+10" chips. No gating. The introduction.
 *   'manual'   – tap targets visible; child performs the regroup before answering.
 *                Input + submit gated until the regroup is in place.
 *   'optional' – no targets, no chips, no gates. Child answers directly, doing the
 *                regrouping mentally. The graduation phase.
 *
 * Two layers decide which phase a given worksheet shows:
 *   1. A worksheet-number BASELINE (getWorksheetBaselineMode) — the curriculum default.
 *   2. A PARENT OVERRIDE (RegroupHelperOverride) stored per-child. 'adaptive' (the
 *      default) defers to the app's mastery tracking; 'auto'/'manual'/'optional' force
 *      that phase regardless of worksheet or performance.
 *
 * In adaptive mode, the manual↔optional decision is driven by the child's recent
 * first-try accuracy on borrowing problems (see RegroupStreak), NOT by worksheet
 * number — so helpers fade exactly when the child has earned it, and quietly return
 * if they start struggling.
 */

export type RegroupMode = 'auto' | 'manual' | 'optional'

/** Parent-facing override stored on the child profile (children.regroup_helper_mode). */
export type RegroupHelperOverride = 'adaptive' | RegroupMode

/** Consecutive first-try accuracy on borrowing problems, persisted per child. */
export interface RegroupStreak {
  /** Consecutive borrowing problems answered correctly on the first try. */
  correct: number
  /** Consecutive borrowing problems missed on the first try. */
  miss: number
}

/** Move from manual → optional after this many consecutive first-try-correct borrows. */
export const GRADUATE_THRESHOLD = 5
/** Fall back optional → manual after this many consecutive first-try misses. */
export const REGRESS_THRESHOLD = 3

/**
 * Worksheet-number baseline phase (the curriculum default before adaptive/override).
 *
 * Level B 2-digit borrow (121-150):
 *   121-126 auto  →  127+ enters the manual/optional band (mastery decides)
 * Level B 3-digit borrow (161-200):
 *   161-166 auto  →  167+ manual/optional band
 *
 * The baseline returns 'auto' only for the early demo window. After that it returns
 * 'optional' as the *ceiling* — the adaptive layer holds the child in 'manual' until
 * they earn the graduation, then lets them sit at 'optional'. Levels C+ are 'optional'
 * baseline (concept assumed introduced).
 */
export function getWorksheetBaselineMode(level: string, worksheetNumber: number): RegroupMode {
  if (level === 'B') {
    if (worksheetNumber >= 121 && worksheetNumber <= 126) return 'auto'
    if (worksheetNumber >= 161 && worksheetNumber <= 166) return 'auto'
    // Everything else in the borrow ranges is the manual/optional band.
    return 'optional'
  }
  return 'optional'
}

const STREAK_KEY_PREFIX = 'mindfoundry_regroup_streak_'

function streakKey(childId: string): string {
  return `${STREAK_KEY_PREFIX}${childId}`
}

/** Read the child's borrowing streak from localStorage (zeroed if absent/unavailable). */
export function readRegroupStreak(childId: string | undefined): RegroupStreak {
  const empty: RegroupStreak = { correct: 0, miss: 0 }
  if (!childId) return empty
  try {
    const raw = localStorage.getItem(streakKey(childId))
    if (!raw) return empty
    const parsed = JSON.parse(raw)
    return {
      correct: Number(parsed?.correct) || 0,
      miss: Number(parsed?.miss) || 0,
    }
  } catch {
    return empty
  }
}

/** Persist the child's borrowing streak. No-op if childId/localStorage unavailable. */
export function writeRegroupStreak(childId: string | undefined, streak: RegroupStreak): void {
  if (!childId) return
  try {
    localStorage.setItem(streakKey(childId), JSON.stringify(streak))
  } catch {
    // localStorage may be unavailable (private mode, quota) — adaptive simply won't persist.
  }
}

/**
 * Fold a single borrowing problem's first-try result into the streak.
 * Consecutive counters: a correct resets the miss run and vice-versa.
 */
export function updateStreak(streak: RegroupStreak, firstTryCorrect: boolean): RegroupStreak {
  return firstTryCorrect
    ? { correct: streak.correct + 1, miss: 0 }
    : { correct: 0, miss: streak.miss + 1 }
}

/**
 * Resolve the phase actually shown, combining baseline + parent override + adaptive streak.
 *
 *   override 'auto'|'manual'|'optional' → forced, full stop.
 *   override 'adaptive' (or undefined):
 *     baseline 'auto'     → 'auto'  (always demo first; mastery doesn't skip the intro)
 *     baseline 'optional' → start at 'optional', but:
 *        • if the child has NOT yet graduated (correct < GRADUATE) AND has never been
 *          fluent, hold them in 'manual' so they practice the action first;
 *        • once correct ≥ GRADUATE → 'optional';
 *        • if they regress (miss ≥ REGRESS) → drop back to 'manual'.
 *
 * The "have they graduated yet" question is answered purely from the streak counters,
 * which persist across worksheets — so a child who masters borrowing during the 127-130
 * window jumps straight to optional, while a struggling child keeps the manual helpers
 * well past worksheet 131.
 */
export function resolveRegroupMode(params: {
  level: string
  worksheetNumber: number
  override: RegroupHelperOverride | undefined
  streak: RegroupStreak
}): RegroupMode {
  const { level, worksheetNumber, override, streak } = params

  // Parent forced a specific phase.
  if (override === 'auto' || override === 'manual' || override === 'optional') {
    return override
  }

  // Adaptive (default).
  const baseline = getWorksheetBaselineMode(level, worksheetNumber)
  if (baseline === 'auto') return 'auto'

  // baseline === 'optional' → the manual/optional band. Mastery decides.
  if (streak.miss >= REGRESS_THRESHOLD) return 'manual'   // struggling → restore helpers
  if (streak.correct >= GRADUATE_THRESHOLD) return 'optional' // mastered → drop helpers
  // In-between: default to manual so a fresh child practices the action before fading.
  // (Once they string together GRADUATE_THRESHOLD correct, they graduate to optional.)
  return 'manual'
}
