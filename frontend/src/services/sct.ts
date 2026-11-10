/**
 * Kumon's Standard Completion Time (SCT), the speed half of Kumon's rule for
 * moving on. Pure: no database, no React (the pass-rule gate imports it).
 *
 * Moved out of progressService.ts on 2026-11-10, when the time a sheet takes
 * started deciding whether it moves on (docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md,
 * R1). progressService re-exports everything here, so existing imports keep working.
 */

/**
 * Standard Completion Time (SCT) in seconds by Kumon level
 *
 * These are for a SINGLE PAGE (10 problems) - half of a full Kumon worksheet.
 * Full Kumon worksheets have sides a and b (20 problems total).
 * Times based on official Kumon SCT charts (halved for single page).
 *
 * See: /Requirements/KUMON-SCT-TIMING-REFERENCE.md
 */
export const SCT_BY_LEVEL: Record<string, { min: number; target: number; max: number }> = {
  // Pre-K (not timed officially, set generous defaults)
  '7A': { min: 60, target: 120, max: 300 },
  '6A': { min: 60, target: 120, max: 300 },
  '5A': { min: 60, target: 120, max: 300 },

  // Early Elementary - very fast for basic counting/addition
  '4A': { min: 15, target: 45, max: 60 },   // Number writing
  '3A': { min: 30, target: 45, max: 60 },   // Adding +1, +2, +3
  '2A': { min: 30, target: 45, max: 60 },   // Adding +4 to +10

  // Elementary - Addition/Subtraction
  'A':  { min: 30, target: 60, max: 90 },   // Subtraction intro
  'B':  { min: 60, target: 90, max: 150 },  // Vertical, regrouping

  // Elementary - Multiplication/Division/Fractions
  'C':  { min: 60, target: 90, max: 150 },  // Times tables, division
  'D':  { min: 90, target: 120, max: 180 }, // Long division, fractions intro
  'E':  { min: 90, target: 120, max: 180 }, // Fraction operations
  'F':  { min: 90, target: 150, max: 180 }, // Decimals, PEMDAS

  // Middle School - Algebra
  'G':  { min: 90, target: 150, max: 180 },  // Pre-algebra
  'H':  { min: 120, target: 150, max: 180 }, // Algebra I
  'I':  { min: 120, target: 150, max: 180 }, // Algebra I/II

  // High School - Advanced Algebra
  'J':  { min: 150, target: 240, max: 360 }, // Algebra II
  'K':  { min: 180, target: 300, max: 480 }, // Pre-calculus

  // Calculus (wide ranges)
  'L':  { min: 180, target: 480, max: 900 },  // Calculus basics
  'M':  { min: 180, target: 360, max: 720 },  // Trigonometry
  'N':  { min: 240, target: 600, max: 900 },  // Sequences, Series
  'O':  { min: 300, target: 600, max: 1200 }, // Advanced Calculus
}

/**
 * Get the target SCT for a given level (in seconds)
 * Returns 90 seconds as default for unknown levels (1.5 minutes)
 */
export function getSctForLevel(level: string): number {
  return SCT_BY_LEVEL[level]?.target || 90
}

/**
 * Get the full SCT config for a given level
 */
export function getSctConfigForLevel(level: string): { min: number; target: number; max: number } {
  return SCT_BY_LEVEL[level] || { min: 60, target: 90, max: 150 }
}

/**
 * Kumon sets the standard time per RUN of sheets, not per level: a page of ten
 * times-table facts and a page of ten 3-digit × 1-digit problems are not the same
 * work. Each value is the TOP of the reference range for one app page (Kumon's "Y
 * time": above it, the child repeats) — the same choice the level table above
 * already makes for the times tables (C 11–50: 60–90 s → 90).
 *
 * Only Levels C and D are listed (his level and the next); every other level uses
 * its level value. Source: /Requirements/KUMON-SCT-TIMING-REFERENCE.md.
 */
export const SHEET_SCT_RANGES: Record<string, Array<{ through: number; seconds: number }>> = {
  C: [
    { through: 10, seconds: 90 },   // review
    { through: 50, seconds: 90 },   // times tables
    { through: 100, seconds: 120 }, // 2-digit × 1-digit
    { through: 110, seconds: 150 }, // 3–4 digit × 1-digit
    { through: 180, seconds: 90 },  // division
    { through: 200, seconds: 150 }, // 3-digit ÷ 1-digit
  ],
  D: [
    { through: 50, seconds: 150 },  // multi-digit multiplication
    { through: 130, seconds: 150 }, // long division
    { through: 140, seconds: 150 }, // fractions intro
    { through: 160, seconds: 180 }, // multi-digit quotients
    { through: 200, seconds: 120 }, // reduction
  ],
}

/** The standard time for one sheet (10 problems), in seconds. */
export function getSctForSheet(level: string, worksheet: number): number {
  const ranges = SHEET_SCT_RANGES[level]
  const hit = ranges?.find((r) => worksheet <= r.through)
  return hit?.seconds ?? getSctForLevel(level)
}
