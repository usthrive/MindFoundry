/**
 * The second recognition tier: when the on-device matcher is unsure, ask the vision
 * model what the child wrote.
 *
 * This is the only part that costs anything, so it is kept deliberately small. The
 * strip is redrawn as a tight monochrome image — roughly 670x140, about 120 image
 * tokens — rather than sending the whole scratch canvas. At Haiku rates that is on
 * the order of a twentieth of a penny per call, and it is only reached for the
 * characters the device could not read on its own. A child whose handwriting the app
 * has learned stops reaching it almost entirely.
 *
 * If the operation is not deployed, or the network is down, this returns null and the
 * caller falls back to asking the child to confirm — which is what it would have done
 * anyway. Recognition never becomes a hard dependency on being online.
 */
import { getAIService } from '@/services/ai'
import type { Glyph, InkResult, Stroke } from './types'

/** Pixels per cell in the image we send. Small on purpose — see the cost note above. */
const CELL_PX = 112
const STRIP_PX = 140

/**
 * Redraw the ink on a clean white strip with the guide cells marked, so the model
 * sees the same character boundaries the child was writing into.
 */
export function renderStripToDataUrl(
  strokes: Stroke[],
  cellCount: number,
  sourceWidth: number,
  sourceHeight: number
): string | null {
  if (typeof document === 'undefined' || cellCount <= 0) return null
  const canvas = document.createElement('canvas')
  canvas.width = CELL_PX * cellCount
  canvas.height = STRIP_PX
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Faint cell separators — they tell the model where one character ends.
  ctx.strokeStyle = '#d0d0d0'
  ctx.lineWidth = 1
  for (let i = 1; i < cellCount; i++) {
    ctx.beginPath()
    ctx.moveTo(i * CELL_PX, 0)
    ctx.lineTo(i * CELL_PX, canvas.height)
    ctx.stroke()
  }

  const sx = canvas.width / Math.max(1, sourceWidth)
  const sy = canvas.height / Math.max(1, sourceHeight)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const stroke of strokes) {
    if (stroke.color.toLowerCase() === '#ffffff' || stroke.points.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x * sx, stroke.points[0].y * sy)
    for (const p of stroke.points.slice(1)) ctx.lineTo(p.x * sx, p.y * sy)
    ctx.stroke()
  }
  return canvas.toDataURL('image/png')
}

interface InkVisionResponse {
  text?: string
  confidence?: number
  characters?: { value: string; confidence: number }[]
}

/**
 * Ask the vision model to read the strip. Returns null on any failure — an
 * unavailable second opinion is not an error, it just means we ask the child.
 */
export async function recognizeWithVision(
  strokes: Stroke[],
  glyphs: Glyph[],
  cellCount: number,
  sourceWidth: number,
  sourceHeight: number,
  allowedChars: string[]
): Promise<InkResult | null> {
  const dataUrl = renderStripToDataUrl(strokes, cellCount, sourceWidth, sourceHeight)
  if (!dataUrl) return null

  try {
    const service = getAIService() as unknown as {
      recognizeInk?: (image: string, allowed: string[]) => Promise<InkVisionResponse>
    }
    if (typeof service.recognizeInk !== 'function') return null

    const res = await service.recognizeInk(dataUrl, allowedChars)
    const text = (res?.text ?? '').trim()
    if (!text) return null

    const perChar = res.characters ?? []
    const chars = [...text].map((value, i) => ({
      value,
      confidence: perChar[i]?.confidence ?? res.confidence ?? 0.8,
      alternatives: [] as string[],
      box: glyphs[i]?.box ?? { x: 0, y: 0, w: 0, h: 0 },
    }))

    return {
      text,
      chars,
      confidence: chars.length ? Math.min(...chars.map(c => c.confidence)) : 0,
      source: 'vision',
    }
  } catch {
    return null
  }
}
