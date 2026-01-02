import { useRef, useState, useEffect, useCallback } from 'react'

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
}

interface ScratchPadProps {
  width?: number
  height?: number
  initialStrokes?: Stroke[]
  onStrokesChange?: (strokes: Stroke[]) => void
  disabled?: boolean
  className?: string
}

const COLORS = ['#000000', '#0066cc', '#cc0000', '#009933']
const WIDTHS = [2, 4, 6]

export default function ScratchPad({
  width = 400,
  height = 300,
  initialStrokes = [],
  onStrokesChange,
  disabled = false,
  className = '',
}: ScratchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes)
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [lineWidth, setLineWidth] = useState(WIDTHS[1])
  const [undoStack, setUndoStack] = useState<Stroke[][]>([])

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

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const drawStroke = (stroke: Stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    }

    strokes.forEach(drawStroke)
    if (currentStroke) {
      drawStroke(currentStroke)
    }
  }, [strokes, currentStroke])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()

    const point = getCanvasPoint(e)
    setIsDrawing(true)
    setCurrentStroke({
      points: [point],
      color,
      width: lineWidth,
    })
  }, [disabled, color, lineWidth, getCanvasPoint])

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

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const previousStrokes = undoStack[undoStack.length - 1]
    setStrokes(previousStrokes)
    setUndoStack(undoStack.slice(0, -1))
    onStrokesChange?.(previousStrokes)
  }

  const handleClear = () => {
    setUndoStack([...undoStack, strokes])
    setStrokes([])
    onStrokesChange?.([])
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 mr-2">Color:</span>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
              disabled={disabled}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 mr-2">Size:</span>
          {WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setLineWidth(w)}
              className={`w-8 h-8 rounded flex items-center justify-center border ${
                lineWidth === w ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
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
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={handleClear}
            disabled={disabled || strokes.length === 0}
            className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border-2 border-gray-300 rounded-lg bg-white touch-none ${
          disabled ? 'cursor-not-allowed opacity-75' : 'cursor-crosshair'
        }`}
        style={{ maxWidth: '100%', height: 'auto' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      <p className="text-xs text-gray-500 text-center">
        Use your finger or stylus to show your work
      </p>
    </div>
  )
}

export { type Stroke, type Point }
