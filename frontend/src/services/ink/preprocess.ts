/**
 * Turning raw ink into things that can be compared.
 *
 * The scratch pad stores strokes as vectors — lists of points — rather than as a
 * bitmap. That is a large advantage: a character can be re-drawn at any size on a
 * clean background, and characters can be separated by geometry instead of by
 * image segmentation.
 */
import type { Glyph, Point, Stroke, Template } from './types'

/** Points per normalised character. Enough to keep a 5 distinct from a 6. */
export const RESAMPLE_COUNT = 32

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

function pathLength(points: Point[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i])
  return total
}

/** Bounding box of a set of strokes. */
export function boundsOf(strokes: Stroke[]): { x: number; y: number; w: number; h: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const s of strokes) {
    for (const p of s.points) {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    }
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 0, h: 0 }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

/**
 * Split a line of ink into characters.
 *
 * Children write left to right, and a character can take several strokes (the bar of
 * a 7, the two strokes of a 4). So strokes are grouped by horizontal overlap: a
 * stroke joins the group to its left when it overlaps it, or sits close enough that
 * the gap reads as part of the same character rather than a space between two.
 *
 * The gap that counts as "close" is measured against the ink itself — a child writing
 * large and a child writing small both work — rather than against a fixed pixel count.
 */
export function segmentGlyphs(strokes: Stroke[]): Glyph[] {
  const ink = strokes.filter(s => s.points.length > 1 && s.color.toLowerCase() !== '#ffffff')
  if (ink.length === 0) return []

  const items = ink
    .map(s => ({ stroke: s, box: boundsOf([s]) }))
    .sort((a, b) => a.box.x - b.box.x)

  // A character is about as wide as the tallest stroke is high; a gap much smaller
  // than that is within a character, a gap larger is between characters.
  const heights = items.map(i => i.box.h).filter(h => h > 0).sort((a, b) => a - b)
  const medianHeight = heights.length ? heights[Math.floor(heights.length / 2)] : 1
  const joinGap = Math.max(4, medianHeight * 0.28)

  const groups: { strokes: Stroke[]; box: Glyph['box'] }[] = []
  for (const item of items) {
    const last = groups[groups.length - 1]
    if (last) {
      const lastRight = last.box.x + last.box.w
      const overlaps = item.box.x <= lastRight
      const nearlyTouches = item.box.x - lastRight <= joinGap
      if (overlaps || nearlyTouches) {
        last.strokes.push(item.stroke)
        last.box = boundsOf(last.strokes)
        continue
      }
    }
    groups.push({ strokes: [item.stroke], box: item.box })
  }
  return groups
}

/**
 * Split ink by writing-guide cells, one character per cell.
 *
 * This is the path the app actually uses. Inferring character boundaries from gaps
 * alone was measured at ~57% on synthesised writing, and every single failure was two
 * adjacent characters merging into one — children write digits close together, and
 * often touching. A row of guide boxes removes the guesswork completely: the child is
 * shown where each character goes, and segmentation becomes assignment rather than
 * inference. Kumon's own paper worksheets use boxes for the same reason.
 *
 * A stroke belongs to the cell its horizontal midpoint falls in, so a tail that
 * strays over a boundary does not move the character.
 */
export function segmentByCells(strokes: Stroke[], cellCount: number, stripWidth: number): Glyph[] {
  const ink = strokes.filter(s => s.points.length > 1 && s.color.toLowerCase() !== '#ffffff')
  if (ink.length === 0 || cellCount <= 0 || stripWidth <= 0) return []

  const cellWidth = stripWidth / cellCount
  const buckets: Stroke[][] = Array.from({ length: cellCount }, () => [])

  for (const stroke of ink) {
    const box = boundsOf([stroke])
    const midX = box.x + box.w / 2
    const idx = Math.max(0, Math.min(cellCount - 1, Math.floor(midX / cellWidth)))
    buckets[idx].push(stroke)
  }

  return buckets
    .map((cellStrokes, idx) => ({ cellStrokes, idx }))
    .filter(({ cellStrokes }) => cellStrokes.length > 0)
    .map(({ cellStrokes, idx }) => ({
      strokes: cellStrokes,
      // The cell, not the ink, is the box — so the correction UI points at a stable
      // target even when the child writes small in the corner of it.
      box: { x: idx * cellWidth, y: 0, w: cellWidth, h: boundsOf(cellStrokes).h },
    }))
}

/** Walk the strokes end to end as one path, so a multi-stroke character resamples evenly. */
function concatPoints(strokes: Stroke[]): Point[] {
  const out: Point[] = []
  for (const s of strokes) out.push(...s.points)
  return out
}

/** Re-space `n` points evenly along the path, so speed of writing stops mattering. */
export function resample(points: Point[], n = RESAMPLE_COUNT): Point[] {
  if (points.length === 0) return []
  if (points.length === 1) return new Array(n).fill(points[0])

  const total = pathLength(points)
  if (total === 0) return new Array(n).fill(points[0])

  const interval = total / (n - 1)
  const out: Point[] = [points[0]]
  let accumulated = 0
  const work = [...points]

  for (let i = 1; i < work.length; i++) {
    const d = dist(work[i - 1], work[i])
    if (accumulated + d >= interval) {
      const ratio = (interval - accumulated) / d
      const next = {
        x: work[i - 1].x + ratio * (work[i].x - work[i - 1].x),
        y: work[i - 1].y + ratio * (work[i].y - work[i - 1].y),
      }
      out.push(next)
      work.splice(i, 0, next)
      accumulated = 0
    } else {
      accumulated += d
    }
  }
  while (out.length < n) out.push(work[work.length - 1])
  return out.slice(0, n)
}

/**
 * Normalise a character for comparison: even spacing, unit size, centred.
 *
 * Scaling is UNIFORM, not per-axis. Stretching each character to fill a square would
 * make a "1" and a "0" the same shape; keeping the aspect ratio is most of what
 * separates the tall thin digits from the round ones.
 */
export function normalize(strokes: Stroke[]): { points: Point[]; aspect: number } | null {
  const points = concatPoints(strokes)
  if (points.length < 2) return null

  const box = boundsOf(strokes)
  const size = Math.max(box.w, box.h)
  if (size <= 0) return null

  const resampled = resample(points)
  const scaled = resampled.map(p => ({ x: (p.x - box.x) / size, y: (p.y - box.y) / size }))

  const cx = scaled.reduce((s, p) => s + p.x, 0) / scaled.length
  const cy = scaled.reduce((s, p) => s + p.y, 0) / scaled.length
  return {
    points: scaled.map(p => ({ x: p.x - cx, y: p.y - cy })),
    aspect: box.w > 0 ? box.h / box.w : 4, // a perfectly vertical "1" has no width
  }
}

/** Build a matchable template from raw strokes. Returns null for a stray dot. */
export function templateFrom(
  strokes: Stroke[],
  label: string,
  origin: Template['origin']
): Template | null {
  const norm = normalize(strokes)
  if (!norm) return null
  return { label, points: norm.points, aspect: norm.aspect, origin }
}
