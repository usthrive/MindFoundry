/**
 * Point-cloud matching for handwritten characters, after the $P recogniser
 * (Vatavu, Anthony & Wobbrock). Characters are compared as unordered clouds of
 * points, so it does not matter in what order or direction the child drew the
 * strokes — a 4 drawn in two strokes and a 4 drawn in one match the same template.
 *
 * Nothing here talks to a network. It is deliberately small and deterministic: the
 * same ink always gives the same reading, so a child never sees a different verdict
 * on a retry.
 */
import { RESAMPLE_COUNT, boundsOf, normalize, templateFrom } from './preprocess'
import { SEED_SHAPES } from './shapes'
import type { CharResult, Glyph, InkResult, Point, Stroke, Template } from './types'
import { RECOGNITION_CONFIDENCE_FLOOR } from './types'

// ── Matching ────────────────────────────────────────────────────────────────

const sq = (n: number) => n * n

/**
 * Greedy cloud distance: walk one cloud from a starting point, pairing each point
 * with its nearest unused partner in the other. Points matched early carry more
 * weight, which is what stops a single wandering tail from dominating the score.
 */
function cloudDistance(a: Point[], b: Point[], start: number): number {
  const n = a.length
  const used = new Array<boolean>(n).fill(false)
  let sum = 0
  let i = start
  do {
    let best = Infinity
    let bestJ = -1
    for (let j = 0; j < n; j++) {
      if (used[j]) continue
      const d = sq(a[i].x - b[j].x) + sq(a[i].y - b[j].y)
      if (d < best) { best = d; bestJ = j }
    }
    if (bestJ >= 0) used[bestJ] = true
    const weight = 1 - ((i - start + n) % n) / n
    sum += weight * Math.sqrt(best)
    i = (i + 1) % n
  } while (i !== start)
  return sum
}

/** Symmetric distance, sampled from a few starting points. */
function matchDistance(a: Point[], b: Point[]): number {
  const n = Math.min(a.length, b.length)
  if (n === 0) return Infinity
  const step = Math.max(1, Math.round(n / 6))
  let best = Infinity
  for (let s = 0; s < n; s += step) {
    best = Math.min(best, cloudDistance(a, b, s), cloudDistance(b, a, s))
  }
  return best / n
}

/** Tall-vs-round disagreement, as a mild penalty rather than a hard filter. */
function aspectPenalty(a: number, b: number): number {
  const ratio = Math.max(a, b) / Math.max(0.001, Math.min(a, b))
  return Math.min(0.35, Math.max(0, (ratio - 1.35) * 0.22))
}

// ── Template store ──────────────────────────────────────────────────────────

const seedTemplates: Template[] = (() => {
  const out: Template[] = []
  for (const [label, variants] of Object.entries(SEED_SHAPES)) {
    for (const strokes of variants) {
      const asStrokes: Stroke[] = strokes.map(points => ({ points, color: '#000', width: 3 }))
      const t = templateFrom(asStrokes, label, 'seed')
      if (t) out.push(t)
    }
  }
  return out
})()

const LEARNED_KEY = 'mindfoundry_ink_templates'
/** Per child, and capped — recent handwriting beats a year-old sample of it. */
const MAX_LEARNED_PER_CHAR = 6

type LearnedStore = Record<string, Template[]>

function storageKey(childId: string): string {
  return `${LEARNED_KEY}_${childId || 'default'}`
}

export function loadLearned(childId: string): Template[] {
  try {
    const raw = localStorage.getItem(storageKey(childId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as LearnedStore
    return Object.values(parsed).flat()
  } catch {
    return []
  }
}

/**
 * Remember how THIS child writes THIS character. Called only when the child has
 * confirmed the reading — so what is stored is always correctly labelled.
 */
export function learnTemplate(childId: string, label: string, strokes: Stroke[]): void {
  const t = templateFrom(strokes, label, 'learned')
  if (!t) return
  try {
    const raw = localStorage.getItem(storageKey(childId))
    const store: LearnedStore = raw ? JSON.parse(raw) : {}
    const list = store[label] ?? []
    list.push(t)
    // Keep the most recent — handwriting changes as a child grows.
    store[label] = list.slice(-MAX_LEARNED_PER_CHAR)
    localStorage.setItem(storageKey(childId), JSON.stringify(store))
  } catch {
    // A full or unavailable localStorage must never break answering a question.
  }
}

export function forgetLearned(childId: string): void {
  try { localStorage.removeItem(storageKey(childId)) } catch { /* ignore */ }
}

// ── Recognition ─────────────────────────────────────────────────────────────

/**
 * Absolute distance beyond which a match means nothing, whatever the runner-up
 * looked like. Without this, a scribble matching one template slightly better than
 * all the others would be read with high confidence.
 */
const MAX_PLAUSIBLE_DISTANCE = 0.42

function recognizeGlyph(glyph: Glyph, templates: Template[], allowed: Set<string> | null): CharResult {
  const norm = normalize(glyph.strokes)
  if (!norm) {
    return { value: '', confidence: 0, alternatives: [], box: glyph.box }
  }

  const scored: { label: string; d: number; learned: boolean }[] = []
  for (const t of templates) {
    if (allowed && !allowed.has(t.label)) continue
    if (t.points.length !== RESAMPLE_COUNT) continue
    const d = matchDistance(norm.points, t.points) + aspectPenalty(norm.aspect, t.aspect)
    // The child's own handwriting is better evidence than an idealised shape.
    scored.push({ label: t.label, d: t.origin === 'learned' ? d * 0.82 : d, learned: t.origin === 'learned' })
  }
  if (scored.length === 0) {
    return { value: '', confidence: 0, alternatives: [], box: glyph.box }
  }
  scored.sort((a, b) => a.d - b.d)

  const best = scored[0]
  const runnerUp = scored.find(s => s.label !== best.label)

  // Confidence combines "is this a good match at all" with "is it clearly better
  // than the next different character". Both have to hold.
  const absolute = Math.max(0, 1 - best.d / MAX_PLAUSIBLE_DISTANCE)
  const margin = runnerUp && runnerUp.d > 0
    ? Math.max(0, Math.min(1, (runnerUp.d - best.d) / runnerUp.d * 2.4))
    : 0.5
  const confidence = Math.max(0, Math.min(1, Math.sqrt(absolute * margin)))

  const alternatives: string[] = []
  for (const s of scored) {
    if (s.label !== best.label && !alternatives.includes(s.label)) alternatives.push(s.label)
    if (alternatives.length >= 3) break
  }

  return { value: best.label, confidence, alternatives, box: glyph.box }
}

export interface RecognizeOptions {
  childId?: string
  /** Restrict to the characters this answer could contain (digits only, digits + R…). */
  allowedChars?: string[]
}

/** Read a line of handwriting, entirely on the device. */
export function recognizeOnDevice(glyphs: Glyph[], opts: RecognizeOptions = {}): InkResult {
  if (glyphs.length === 0) {
    return { text: '', chars: [], confidence: 0, source: 'empty' }
  }
  const templates = [...seedTemplates, ...loadLearned(opts.childId ?? 'default')]
  const allowed = opts.allowedChars?.length ? new Set(opts.allowedChars) : null

  const chars = glyphs
    .slice()
    .sort((a, b) => a.box.x - b.box.x)
    .map(g => recognizeGlyph(g, templates, allowed))

  return {
    text: chars.map(c => c.value).join(''),
    chars,
    confidence: chars.length ? Math.min(...chars.map(c => c.confidence)) : 0,
    source: 'on-device',
  }
}

export { RECOGNITION_CONFIDENCE_FLOOR, boundsOf }
