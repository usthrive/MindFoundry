/**
 * Seed shapes for the characters an answer can contain.
 *
 * These are idealised paths, not samples of real handwriting, and they are only meant
 * to carry the first few answers a child writes. Every time the child confirms or
 * corrects a reading, their own version of that character is stored and takes over —
 * a child's own 4 is a far better template for their next 4 than any average is.
 *
 * Coordinates are in a 0-1 box with y increasing DOWNWARDS, matching canvas space.
 * Where children commonly write a character two ways (a 7 with or without its bar,
 * a closed or open 4), both are seeded.
 */
import type { Point } from './types'

type Path = Point[]
const p = (x: number, y: number): Point => ({ x, y })

/** Sample an ellipse arc; angles in turns (0 = right, 0.25 = down). */
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 24): Path {
  const out: Path = []
  for (let i = 0; i <= steps; i++) {
    const t = (from + (to - from) * (i / steps)) * Math.PI * 2
    out.push(p(cx + rx * Math.cos(t), cy + ry * Math.sin(t)))
  }
  return out
}

/** Straight segment, sampled so path length is comparable to the curves. */
function line(x1: number, y1: number, x2: number, y2: number, steps = 10): Path {
  const out: Path = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    out.push(p(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t))
  }
  return out
}

/** label → one or more ways of drawing it, each as a list of strokes. */
export const SEED_SHAPES: Record<string, Path[][]> = {
  '0': [
    [arc(0.5, 0.5, 0.34, 0.5, 0.75, 1.75)],
  ],
  '1': [
    [line(0.5, 0.02, 0.5, 0.98)],
    [[...line(0.28, 0.22, 0.5, 0.02, 5), ...line(0.5, 0.02, 0.5, 0.98)]],
    [[...line(0.28, 0.22, 0.5, 0.02, 5), ...line(0.5, 0.02, 0.5, 0.98)], line(0.25, 0.98, 0.75, 0.98)],
  ],
  '2': [
    [[
      ...arc(0.5, 0.28, 0.34, 0.26, 0.6, 1.05, 16),
      ...line(0.82, 0.36, 0.14, 0.95, 10),
      ...line(0.14, 0.95, 0.9, 0.95, 8),
    ]],
  ],
  '3': [
    [[
      ...arc(0.48, 0.27, 0.3, 0.25, 0.62, 1.12, 16),
      ...arc(0.46, 0.72, 0.34, 0.26, 0.85, 1.4, 18),
    ]],
  ],
  '4': [
    [[...line(0.72, 0.02, 0.1, 0.66, 12), ...line(0.1, 0.66, 0.95, 0.66, 10)], line(0.72, 0.02, 0.72, 0.98)],
    [[...line(0.72, 0.98, 0.72, 0.02, 12), ...line(0.72, 0.02, 0.1, 0.66, 10), ...line(0.1, 0.66, 0.95, 0.66, 8)]],
  ],
  '5': [
    [[
      ...line(0.85, 0.04, 0.24, 0.04, 8),
      ...line(0.24, 0.04, 0.19, 0.45, 6),
      ...arc(0.48, 0.7, 0.34, 0.28, 0.72, 1.3, 18),
    ]],
    [[...line(0.24, 0.04, 0.19, 0.45, 6), ...arc(0.48, 0.7, 0.34, 0.28, 0.72, 1.3, 18)], line(0.24, 0.04, 0.85, 0.04)],
  ],
  '6': [
    [[
      ...arc(0.55, 0.3, 0.32, 0.29, 0.82, 1.25, 14),
      ...arc(0.5, 0.71, 0.33, 0.27, 0.5, 1.5, 20),
    ]],
  ],
  '7': [
    [[...line(0.08, 0.05, 0.9, 0.05, 8), ...line(0.9, 0.05, 0.32, 0.98, 14)]],
    [[...line(0.08, 0.05, 0.9, 0.05, 8), ...line(0.9, 0.05, 0.32, 0.98, 14)], line(0.25, 0.52, 0.68, 0.52)],
  ],
  '8': [
    [[
      ...arc(0.5, 0.26, 0.28, 0.24, 0.25, 1.25, 18),
      ...arc(0.5, 0.74, 0.33, 0.24, 0.75, 1.75, 18),
    ]],
  ],
  '9': [
    [[
      ...arc(0.52, 0.28, 0.3, 0.26, 0.25, 1.25, 18),
      ...line(0.82, 0.28, 0.66, 0.98, 12),
    ]],
  ],
  '-': [
    [line(0.05, 0.5, 0.95, 0.5)],
  ],
  '.': [
    [arc(0.5, 0.9, 0.06, 0.06, 0, 1, 8)],
  ],
  ',': [
    [[...arc(0.5, 0.85, 0.06, 0.06, 0.75, 1.4, 6), ...line(0.48, 0.92, 0.36, 1.0, 4)]],
  ],
  '/': [
    [line(0.85, 0.03, 0.15, 0.97)],
  ],
  R: [
    [[...line(0.2, 0.98, 0.2, 0.02, 12), ...arc(0.24, 0.28, 0.36, 0.26, 0.75, 1.25, 12), ...line(0.24, 0.53, 0.9, 0.98, 10)]],
  ],
}

/** All labels the on-device recogniser can produce. */
export const SUPPORTED_CHARS = Object.keys(SEED_SHAPES)
