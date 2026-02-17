import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

export interface Point {
  x: number
  y: number
}

export interface Stroke {
  points: Point[]
  color: string
  width: number
}

export type BackgroundStyle = 'blank' | 'grid' | 'lined'

export interface ScratchPadRef {
  undo: () => void
  clear: () => void
  getStrokes: () => Stroke[]
  setColor: (color: string) => void
  setLineWidth: (width: number) => void
  setEraser: (enabled: boolean) => void
}

export interface ScratchPadProps {
  width?: number
  height?: number
  initialStrokes?: Stroke[]
  onStrokesChange?: (strokes: Stroke[]) => void
  disabled?: boolean
  className?: string
  /** Whether to show the built-in toolbar (default true). Set false when parent manages toolbar. */
  showToolbar?: boolean
  /** Canvas background style */
  backgroundStyle?: BackgroundStyle
  /** Fill container width instead of using fixed width */
  fillWidth?: boolean
}

const COLORS = ['#000000', '#0066cc', '#cc0000', '#009933']
const WIDTHS = [2, 4, 6]
const ERASER_WIDTH = 16
const GRID_SIZE = 24 // px between grid lines
const LINE_SPACING = 32 // px between lined paper lines

/**
 * Draw grid background on canvas context
 */
function drawGridBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#e5e7eb' // gray-200
  ctx.lineWidth = 0.5

  // Vertical lines
  for (let x = GRID_SIZE; x < w; x += GRID_SIZE) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  // Horizontal lines
  for (let y = GRID_SIZE; y < h; y += GRID_SIZE) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
}

/**
 * Draw lined paper background on canvas context
 */
function drawLinedBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#dbeafe' // blue-100
  ctx.lineWidth = 0.5

  for (let y = LINE_SPACING; y < h; y += LINE_SPACING) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
}

const ScratchPad = forwardRef<ScratchPadRef, ScratchPadProps>(({
  width = 400,
  height = 300,
  initialStrokes = [],
  onStrokesChange,
  disabled = false,
  className = '',
  showToolbar = true,
  backgroundStyle = 'blank',
  fillWidth = false,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes)
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [lineWidth, setLineWidth] = useState(WIDTHS[1])
  const [undoStack, setUndoStack] = useState<Stroke[][]>([])
  const [isEraser, setIsEraser] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width, height })

  // Sync initial strokes when they change (e.g., switching between problems)
  useEffect(() => {
    setStrokes(initialStrokes)
    setUndoStack([])
  }, [initialStrokes])

  // Handle container resize for fillWidth mode
  useEffect(() => {
    if (!fillWidth || !containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        // Use 2x for retina displays, capped for performance
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        setCanvasSize({
          width: Math.floor(containerWidth * pixelRatio),
          height: Math.floor(height * pixelRatio),
        })
      }
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [fillWidth, height])

  const effectiveWidth = fillWidth ? canvasSize.width : width
  const effectiveHeight = fillWidth ? canvasSize.height : height

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background
    switch (backgroundStyle) {
      case 'grid':
        drawGridBackground(ctx, canvas.width, canvas.height)
        break
      case 'lined':
        drawLinedBackground(ctx, canvas.width, canvas.height)
        break
      default:
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawStroke = (stroke: Stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Eraser strokes use destination-out compositing
      if (stroke.color === '#ffffff') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    }

    strokes.forEach(drawStroke)
    if (currentStroke) {
      drawStroke(currentStroke)
    }

    // Redraw background under erased areas by compositing
    // (The destination-out approach handles this naturally)
  }, [strokes, currentStroke, backgroundStyle])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return

    // Allow multi-touch to pass through for scrolling (don't draw with 2+ fingers)
    if ('touches' in e && e.touches.length > 1) return

    e.preventDefault()

    const point = getCanvasPoint(e)
    const strokeColor = isEraser ? '#ffffff' : color
    const strokeWidth = isEraser ? ERASER_WIDTH : lineWidth

    setIsDrawing(true)
    setCurrentStroke({
      points: [point],
      color: strokeColor,
      width: strokeWidth,
    })
  }, [disabled, color, lineWidth, isEraser, getCanvasPoint])

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke || disabled) return
    e.preventDefault()

    const point = getCanvasPoint(e)
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, point],
    })
  }, [isDrawing, currentStroke, disabled, getCanvasPoint])

  const handleEnd = useCallback(() => {
    if (!isDrawing || !currentStroke) return

    setIsDrawing(false)
    if (currentStroke.points.length > 1) {
      const newStrokes = [...strokes, currentStroke]
      setStrokes(newStrokes)
      setUndoStack([...undoStack, strokes])
      onStrokesChange?.(newStrokes)
    }
    setCurrentStroke(null)
  }, [isDrawing, currentStroke, strokes, undoStack, onStrokesChange])

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    const previousStrokes = undoStack[undoStack.length - 1]
    setStrokes(previousStrokes)
    setUndoStack(undoStack.slice(0, -1))
    onStrokesChange?.(previousStrokes)
  }, [undoStack, onStrokesChange])

  const handleClear = useCallback(() => {
    setUndoStack([...undoStack, strokes])
    setStrokes([])
    onStrokesChange?.([])
  }, [undoStack, strokes, onStrokesChange])

  // Expose imperative methods for parent control
  useImperativeHandle(ref, () => ({
    undo: handleUndo,
    clear: handleClear,
    getStrokes: () => strokes,
    setColor: (c: string) => {
      setColor(c)
      setIsEraser(false)
    },
    setLineWidth: (w: number) => setLineWidth(w),
    setEraser: (enabled: boolean) => setIsEraser(enabled),
  }), [handleUndo, handleClear, strokes])

  return (
    <div ref={containerRef} className={`flex flex-col gap-2 ${className}`}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 mr-2">Color:</span>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsEraser(false) }}
                className={`w-6 h-6 rounded-full border-2 transition-transform touch-manipulation ${
                  color === c && !isEraser ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
                disabled={disabled}
              />
            ))}
            {/* Eraser toggle */}
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`ml-1 w-8 h-8 rounded flex items-center justify-center border touch-manipulation ${
                isEraser ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
              }`}
              aria-label="Eraser"
              disabled={disabled}
              title="Eraser"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 20H7L3 16C2.4 15.4 2.4 14.6 3 14L13 4C13.6 3.4 14.4 3.4 15 4L21 10C21.6 10.6 21.6 11.4 21 12L12 21" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 mr-2">Size:</span>
            {WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`w-8 h-8 rounded flex items-center justify-center border touch-manipulation ${
                  lineWidth === w && !isEraser ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                }`}
                aria-label={`Select line width ${w}`}
                disabled={disabled}
              >
                <div
                  className="rounded-full bg-gray-800"
                  style={{ width: w * 2, height: w * 2 }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={disabled || undoStack.length === 0}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Undo
            </button>
            <button
              onClick={handleClear}
              disabled={disabled || strokes.length === 0}
              className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={effectiveWidth}
        height={effectiveHeight}
        className={`border-2 border-gray-300 rounded-lg bg-white touch-none ${
          disabled ? 'cursor-not-allowed opacity-75' : isEraser ? 'cursor-cell' : 'cursor-crosshair'
        }`}
        style={fillWidth ? { width: '100%', height: `${height}px` } : { maxWidth: '100%', height: 'auto' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {showToolbar && (
        <p className="text-xs text-gray-500 text-center">
          Use your finger or stylus to show your work
        </p>
      )}
    </div>
  )
})

ScratchPad.displayName = 'ScratchPad'

export default ScratchPad
export { COLORS, WIDTHS }
