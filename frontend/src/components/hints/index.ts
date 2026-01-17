/**
 * Hint System Components (Phase 1.8.2)
 *
 * 3-Level Graduated Hint System:
 * 1. MicroHint - Quick text hint (2-5 sec) after 1st wrong answer
 * 2. VisualHint - Inline animation (5-15 sec) after 2nd wrong answer
 * 3. FullTeaching - Fullscreen modal (30-60 sec) after 3rd wrong answer
 */

export { default as MicroHint } from './MicroHint'
export type { MicroHintProps } from './MicroHint'

export { default as VisualHint } from './VisualHint'
export type { VisualHintProps } from './VisualHint'

export { default as FullTeaching } from './FullTeaching'
export type { FullTeachingProps } from './FullTeaching'

// Re-export types from generators/types.ts for convenience
export type { HintLevel, HintData, ProblemHints } from '@/services/generators/types'
