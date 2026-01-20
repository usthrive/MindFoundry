/**
 * Animation Constants - Centralized timing and configuration
 * Phase 1.13: Educational Animation System QA Fix
 *
 * These constants ensure consistent pacing across all animations
 * for optimal pedagogical effectiveness.
 */

/**
 * Timing constants in milliseconds
 *
 * SLOW: For first-time concept introductions - allows full comprehension
 * MEDIUM: For repeated viewing or practice - comfortable pace
 * FAST: For quick reference or review - efficient
 */
export const TIMING = {
  /** Slow pace for first explanation (800-1200ms per step) */
  SLOW: 800,
  /** Medium pace for repeated viewing (400-600ms per step) */
  MEDIUM: 500,
  /** Fast pace for quick reference (200-300ms per step) */
  FAST: 200,
  /** Delay between major phases */
  PHASE_DELAY: 1000,
  /** Delay before starting animation */
  START_DELAY: 500,
  /** Delay after completion before callback */
  COMPLETE_DELAY: 500,
} as const

/**
 * Speed multipliers for user-controlled playback
 */
export const SPEED_MULTIPLIERS = {
  SLOW: 0.5,
  NORMAL: 1,
  FAST: 1.5,
  FASTEST: 2,
} as const

export type SpeedMultiplier = typeof SPEED_MULTIPLIERS[keyof typeof SPEED_MULTIPLIERS]

/**
 * Animation-specific timing presets
 * These are calibrated for each animation type
 */
export const ANIMATION_TIMING = {
  /** Array groups: time per row build and per count */
  arrayGroups: {
    rowBuild: 400,
    countInterval: 500, // Changed from 150ms - too fast
  },
  /** Balance scale: time per step */
  balanceScale: {
    stepDelay: 1500,
    wobbleDuration: 450,
  },
  /** Coordinate plot: time per point */
  coordinatePlot: {
    pointInterval: 800, // Changed from 200ms - too fast
    lineDrawDuration: 500,
  },
  /** FOIL method: time per FOIL step */
  foil: {
    startDelay: 800,
    stepInterval: 2000, // Changed from 1200ms
    combineDelay: 500,
  },
  /** Factoring: time per step */
  factoring: {
    analyzeDelay: 800,
    pairRevealInterval: 800,
    verifyDelay: 500,
  },
  /** Long division: time per step */
  longDivision: {
    stepInterval: 1200,
  },
  /** Fair sharing: time per item distribution */
  fairSharing: {
    distributionInterval: 500, // Changed from 300ms
    completeDelay: 500,
  },
} as const

/**
 * Educational script templates
 * These provide narration text for each animation phase
 */
export interface AnimationScript {
  setup: string
  steps: Record<string, string>
  complete: string
}

/**
 * Get timing adjusted for speed multiplier
 */
export function getAdjustedTiming(baseTiming: number, speedMultiplier: SpeedMultiplier = 1): number {
  return Math.round(baseTiming / speedMultiplier)
}
