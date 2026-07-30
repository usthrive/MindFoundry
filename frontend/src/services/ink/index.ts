/**
 * Reading a handwritten answer.
 *
 * Two tiers, cheapest first:
 *   1. On-device point-cloud matching. Free, instant, offline, and it learns this
 *      child's handwriting from every answer they confirm.
 *   2. The vision model, only for what tier 1 could not read confidently.
 *
 * Whatever comes back is a PROPOSAL. The child sees it and confirms it before it is
 * ever marked. That is the property that makes the whole thing safe to ship without
 * knowing in advance how well it reads any particular child's writing: the failure
 * mode is being asked a question, not being marked wrong.
 */
import { segmentByCells } from './preprocess'
import { recognizeOnDevice, learnTemplate } from './recognizer'
import { recognizeWithVision } from './escalate'
import { RECOGNITION_CONFIDENCE_FLOOR } from './types'
import type { InkResult, Stroke } from './types'

export * from './types'
export { segmentByCells, boundsOf } from './preprocess'
export { recognizeOnDevice, learnTemplate, forgetLearned, loadLearned } from './recognizer'
export { renderStripToDataUrl } from './escalate'

export interface ReadInkOptions {
  strokes: Stroke[]
  /** Number of writing cells on the strip. */
  cellCount: number
  /** Strip size in the same coordinates as the stroke points. */
  width: number
  height: number
  childId?: string
  /** Characters this answer could contain. Narrowing this is free accuracy. */
  allowedChars?: string[]
  /** Allow the paid second tier. Off for a child working offline. */
  allowVision?: boolean
}

/**
 * Read the strip. Never throws: an unreadable answer comes back as empty text with
 * zero confidence, which the UI shows as "write it again or use the keypad".
 */
export async function readInk(opts: ReadInkOptions): Promise<InkResult> {
  const {
    strokes, cellCount, width, height,
    childId = 'default',
    allowedChars = ['0','1','2','3','4','5','6','7','8','9'],
    allowVision = true,
  } = opts

  const glyphs = segmentByCells(strokes, cellCount, width)
  if (glyphs.length === 0) {
    return { text: '', chars: [], confidence: 0, source: 'empty' }
  }

  const local = recognizeOnDevice(glyphs, { childId, allowedChars })
  if (local.confidence >= RECOGNITION_CONFIDENCE_FLOOR) return local

  if (allowVision) {
    const vision = await recognizeWithVision(strokes, glyphs, cellCount, width, height, allowedChars)
    // Only prefer the model if it is actually more sure than the device was.
    if (vision && vision.confidence > local.confidence) return vision
  }
  return local
}

/**
 * Record how this child writes, from an answer they have confirmed as correct.
 *
 * Called with the FINAL text — after any corrections — so what gets stored is always
 * truthfully labelled. This is what turns a recogniser that has never seen this child
 * into one that reads them fluently, usually within a couple of worksheets.
 */
export function rememberConfirmedAnswer(
  childId: string,
  strokes: Stroke[],
  cellCount: number,
  width: number,
  confirmedText: string
): void {
  const glyphs = segmentByCells(strokes, cellCount, width)
  // Only learn when the child wrote exactly as many characters as the answer has —
  // otherwise we cannot say which ink belongs to which character.
  if (glyphs.length !== confirmedText.length) return
  glyphs
    .slice()
    .sort((a, b) => a.box.x - b.box.x)
    .forEach((g, i) => learnTemplate(childId, confirmedText[i], g.strokes))
}
