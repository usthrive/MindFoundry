import type { Point, Stroke } from '@/components/ui/ScratchPad'

export type { Point, Stroke }

/** A character-sized group of strokes, with its position on the writing line. */
export interface Glyph {
  strokes: Stroke[]
  /** Bounding box in strip coordinates — used for ordering and for tap-to-correct. */
  box: { x: number; y: number; w: number; h: number }
}

/** One recognised character. */
export interface CharResult {
  /** Best guess. Empty string if nothing could be matched. */
  value: string
  /** 0-1. Below RECOGNITION_CONFIDENCE_FLOOR the child is asked to confirm. */
  confidence: number
  /** Runners-up, best first — offered as one-tap corrections. */
  alternatives: string[]
  /** Where it sits on the strip, so the UI can point at the doubtful one. */
  box: Glyph['box']
}

export interface InkResult {
  /** The characters joined up: what we think the child wrote. */
  text: string
  chars: CharResult[]
  /** Lowest per-character confidence — the one that decides whether we ask. */
  confidence: number
  /** Which tier produced this. */
  source: 'on-device' | 'vision' | 'empty'
}

/**
 * Below this, the answer is never submitted without the child confirming it.
 * Deliberately high: the cost of asking is one tap, the cost of a silent misread
 * is a wrong mark on a correct piece of maths.
 */
export const RECOGNITION_CONFIDENCE_FLOOR = 0.72

/** A normalised, resampled character used for matching. */
export interface Template {
  label: string
  /** RESAMPLE_COUNT points, centroid at origin, scaled into a unit box. */
  points: Point[]
  /** Height / width of the original ink — separates "1" from "0" cheaply. */
  aspect: number
  /** Where it came from: seeded shapes ship with the app, learned ones come from
   *  this child confirming their own handwriting. */
  origin: 'seed' | 'learned'
}
