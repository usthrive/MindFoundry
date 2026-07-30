import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Point, Stroke } from '@/components/ui/ScratchPad'
import { readInk, rememberConfirmedAnswer, RECOGNITION_CONFIDENCE_FLOOR } from '@/services/ink'
import type { InkResult } from '@/services/ink'

export interface HandwritingAnswerStripProps {
  /** How many characters the child may write. One guide box each. */
  cellCount?: number
  /** Characters this answer could contain — narrowing it is free accuracy. */
  allowedChars?: string[]
  /** Keys the per-child learned handwriting. */
  childId?: string
  /** Called only once the child has confirmed the reading. */
  onConfirm: (text: string) => void
  /** Offer the keypad instead. */
  onUseKeypad?: () => void
  disabled?: boolean
  className?: string
}

const CELL_HEIGHT = 92
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A row of boxes the child writes their answer into, one character per box.
 *
 * Two decisions are load-bearing here:
 *
 *  - THE BOXES. Working out where one digit ends and the next begins from the ink
 *    alone was measured at ~57% on synthesised writing, and every failure was two
 *    digits merging — children write them close together and often touching. Boxes
 *    turn that from a guess into a fact, the same way Kumon's paper worksheets do.
 *
 *  - THE CONFIRMATION. What comes back is shown to the child and has to be accepted
 *    before it is marked. Nobody's recogniser is good enough on a seven-year-old's
 *    handwriting to grade silently, and a 4 read as a 9 would be recorded as a
 *    mistake in arithmetic the child got right — wrong on the report, and wrong in
 *    what it teaches them about their own ability. Each confirmation also teaches the
 *    app how this child forms that character, so it needs to ask less every session.
 */
export default function HandwritingAnswerStrip({
  cellCount = 4,
  allowedChars = DIGITS,
  childId = 'default',
  onConfirm,
  onUseKeypad,
  disabled = false,
  className,
}: HandwritingAnswerStripProps) {
  const allowedKey = allowedChars.join('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [current, setCurrent] = useState<Point[] | null>(null)
  const [result, setResult] = useState<InkResult | null>(null)
  const [reading, setReading] = useState(false)
  const [overrides, setOverrides] = useState<Record<number, string>>({})
  const [size, setSize] = useState({ w: cellCount * 64, h: CELL_HEIGHT })

  // ── Canvas sizing ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: CELL_HEIGHT })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Drawing ──
  const pointFrom = useCallback((e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (canvas.width !== size.w * dpr || canvas.height !== size.h * dpr) {
      canvas.width = size.w * dpr
      canvas.height = size.h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    ctx.clearRect(0, 0, size.w, size.h)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 3.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const all = current ? [...strokes, { points: current, color: '#111827', width: 3.5 }] : strokes
    for (const s of all) {
      if (s.points.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(s.points[0].x, s.points[0].y)
      for (const p of s.points.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
  }, [strokes, current, size])

  useEffect(redraw, [redraw])

  // ── Recognition, debounced so it runs when the child pauses, not mid-stroke ──
  useEffect(() => {
    if (strokes.length === 0) { setResult(null); return }
    let cancelled = false
    setReading(true)
    const timer = setTimeout(async () => {
      const r = await readInk({
        strokes, cellCount, width: size.w, height: size.h, childId, allowedChars,
      })
      if (!cancelled) { setResult(r); setReading(false) }
    }, 450)
    return () => { cancelled = true; clearTimeout(timer) }
    // allowedChars is compared by content, not identity — a caller passing a fresh
    // array each render must not restart recognition in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, cellCount, size.w, size.h, childId, allowedKey])

  const handleDown = (e: React.PointerEvent) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setCurrent([pointFrom(e)])
  }
  const handleMove = (e: React.PointerEvent) => {
    if (disabled || !current) return
    setCurrent(prev => (prev ? [...prev, pointFrom(e)] : prev))
  }
  const handleUp = () => {
    if (!current) return
    if (current.length > 1) {
      setStrokes(prev => [...prev, { points: current, color: '#111827', width: 3.5 }])
      setOverrides({})
    }
    setCurrent(null)
  }

  const clear = () => { setStrokes([]); setCurrent(null); setResult(null); setOverrides({}) }

  // ── What we think it says, after any taps the child made to fix a character ──
  const readText = useMemo(() => {
    if (!result) return ''
    return result.chars.map((c, i) => overrides[i] ?? c.value).join('')
  }, [result, overrides])

  const anyDoubt = useMemo(() => {
    if (!result) return true
    return result.chars.some((c, i) => overrides[i] === undefined && c.confidence < RECOGNITION_CONFIDENCE_FLOOR)
  }, [result, overrides])

  const confirm = () => {
    if (!readText) return
    // Learn only from ink the child has vouched for — including their corrections,
    // which are the most valuable samples of all.
    rememberConfirmedAnswer(childId, strokes, cellCount, size.w, readText)
    onConfirm(readText)
  }

  const cellWidth = size.w / cellCount

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Writing strip */}
      <div ref={containerRef} className="relative w-full" style={{ height: CELL_HEIGHT }}>
        {/* Guide boxes */}
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: cellCount }, (_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 border-2 border-dashed rounded-lg',
                i > 0 && '-ml-0.5',
                'border-gray-300 bg-white'
              )}
            />
          ))}
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ width: size.w, height: size.h }}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          onPointerLeave={handleUp}
        />
      </div>
      {strokes.length === 0 && (
        <p className="text-xs text-gray-400 text-center -mt-1">
          Write your answer — one number in each box
        </p>
      )}

      {/* What we read back — always shown, never assumed */}
      <div className="flex items-center gap-2 min-h-[52px]">
        <span className="text-sm text-gray-500 font-medium shrink-0">I read:</span>
        <div className="flex gap-1 flex-1">
          {result && result.chars.length > 0 ? (
            result.chars.map((c, i) => {
              const shown = overrides[i] ?? c.value
              const unsure = overrides[i] === undefined && c.confidence < RECOGNITION_CONFIDENCE_FLOOR
              return (
                <div key={i} className="relative">
                  <div
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-lg border-2',
                      'font-mono font-bold text-xl',
                      unsure
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-green-400 bg-green-50 text-green-800'
                    )}
                    style={{ minWidth: Math.min(44, cellWidth) }}
                  >
                    {shown || '?'}
                  </div>
                  {/* One-tap corrections for a character we are unsure about */}
                  {unsure && c.alternatives.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 flex gap-0.5 z-10">
                      {[c.value, ...c.alternatives].filter(Boolean).slice(0, 3).map(alt => (
                        <button
                          key={alt}
                          type="button"
                          onClick={() => setOverrides(o => ({ ...o, [i]: alt }))}
                          className="w-7 h-7 rounded border border-amber-300 bg-white text-sm font-bold
                                     text-gray-700 shadow-sm active:scale-95 touch-manipulation"
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <span className="text-sm text-gray-400 self-center">
              {reading ? 'reading…' : 'nothing written yet'}
            </span>
          )}
        </div>
      </div>

      {anyDoubt && result && result.chars.length > 0 && (
        <p className="text-xs text-amber-700 -mt-1">
          Tap the right number under any box I got wrong, or write it again.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={clear}
          disabled={disabled || strokes.length === 0}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold
                     text-gray-600 disabled:opacity-40 touch-manipulation active:scale-95"
        >
          Rub out
        </button>
        {onUseKeypad && (
          <button
            type="button"
            onClick={onUseKeypad}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold
                       text-gray-600 touch-manipulation active:scale-95"
          >
            Use buttons
          </button>
        )}
        <button
          type="button"
          onClick={confirm}
          disabled={disabled || !readText}
          className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-primary shadow-md
                     disabled:opacity-40 touch-manipulation active:scale-[0.98]"
        >
          {readText ? `That's right — ${readText}` : 'Write your answer'}
        </button>
      </div>
    </div>
  )
}
