import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import ScratchPad, { type ScratchPadRef, type Stroke, type BackgroundStyle, COLORS, WIDTHS } from '@/components/ui/ScratchPad'
import ScratchPadAnswerBar from './ScratchPadAnswerBar'
import WorksheetProblem from './WorksheetProblem'
import type { Problem } from '@/services/generators/types'

interface ScratchPadOverlayProps {
  /** Whether the overlay is visible */
  show: boolean
  /** The current active problem to display at the top */
  problem: Problem | null
  /** Problem number for display */
  problemNumber: number
  /** Current answer for the problem */
  answer: string
  /** Initial strokes for the canvas (per-problem) */
  initialStrokes: Stroke[]
  /** Called when strokes change */
  onStrokesChange: (strokes: Stroke[]) => void
  /** Called when the user enters/changes an answer */
  onAnswerChange: (answer: string) => void
  /** Called when user taps Done */
  onClose: () => void
  /** Canvas background style */
  backgroundStyle?: BackgroundStyle
  /** Whether background style can be toggled by the user */
  allowBackgroundToggle?: boolean
  /** Navigate to next problem */
  onNext?: () => void
  /** Navigate to previous problem */
  onPrevious?: () => void
  /** Whether next button should be enabled */
  canGoNext?: boolean
  /** Whether previous button should be enabled */
  canGoPrevious?: boolean
}

/**
 * ScratchPadOverlay - Full-screen scratch pad for working out math problems.
 *
 * Layout:
 * - Fixed header: Close button + current problem display
 * - Scrollable middle: Drawing canvas with configurable background
 * - Fixed footer: Drawing tools toolbar + mini numpad for answer entry
 */
export default function ScratchPadOverlay({
  show,
  problem,
  problemNumber,
  answer,
  initialStrokes,
  onStrokesChange,
  onAnswerChange,
  onClose,
  backgroundStyle: initialBgStyle = 'grid',
  allowBackgroundToggle = false,
  onNext,
  onPrevious,
  canGoNext = false,
  canGoPrevious = false,
}: ScratchPadOverlayProps) {
  const scratchPadRef = useRef<ScratchPadRef>(null)
  const [currentColor, setCurrentColor] = useState(COLORS[0])
  const [currentWidth, setCurrentWidth] = useState(WIDTHS[1])
  const [isEraser, setIsEraser] = useState(false)
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>(initialBgStyle)
  const [canvasHeight, setCanvasHeight] = useState(500)

  // Calculate canvas height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      // Leave room for header (~160px), toolbar (~80px), answer bar (~140px)
      const available = window.innerHeight - 380
      setCanvasHeight(Math.max(300, available))
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const handleColorSelect = useCallback((color: string) => {
    setCurrentColor(color)
    setIsEraser(false)
    scratchPadRef.current?.setColor(color)
    scratchPadRef.current?.setEraser(false)
  }, [])

  const handleWidthSelect = useCallback((width: number) => {
    setCurrentWidth(width)
    scratchPadRef.current?.setLineWidth(width)
  }, [])

  const handleEraserToggle = useCallback(() => {
    const newEraser = !isEraser
    setIsEraser(newEraser)
    scratchPadRef.current?.setEraser(newEraser)
  }, [isEraser])

  const handleUndo = useCallback(() => {
    scratchPadRef.current?.undo()
  }, [])

  const handleClear = useCallback(() => {
    scratchPadRef.current?.clear()
  }, [])

  const bgStyleLabels: Record<BackgroundStyle, string> = {
    blank: 'Blank',
    grid: 'Grid',
    lined: 'Lined',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-[60] bg-gray-50 flex flex-col overflow-hidden"
        >
          {/* ── Header: Close + Problem Display ── */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-3 py-2 safe-area-pt">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={onClose}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg',
                  'bg-gray-100 hover:bg-gray-200 text-gray-700',
                  'font-medium text-sm transition-colors',
                  'touch-manipulation select-none'
                )}
                type="button"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div className="flex items-center gap-2">
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-lg',
                      'transition-colors touch-manipulation select-none',
                      canGoPrevious
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'text-gray-300 cursor-not-allowed'
                    )}
                    type="button"
                    aria-label="Previous problem"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}
                <span className="text-sm font-medium text-gray-500">
                  Q #{problemNumber}
                </span>
                {onNext && (
                  <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-lg',
                      'transition-colors touch-manipulation select-none',
                      canGoNext
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'text-gray-300 cursor-not-allowed'
                    )}
                    type="button"
                    aria-label="Next problem"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>

              {allowBackgroundToggle && (
                <div className="flex items-center gap-1">
                  {(['grid', 'lined', 'blank'] as BackgroundStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setBgStyle(style)}
                      className={cn(
                        'px-2 py-1 text-xs rounded border touch-manipulation',
                        bgStyle === style
                          ? 'border-primary bg-blue-50 text-primary font-medium'
                          : 'border-gray-300 text-gray-500'
                      )}
                      type="button"
                    >
                      {bgStyleLabels[style]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Problem display - compact read-only version */}
            {problem && (
              <div className="pointer-events-none opacity-90">
                <WorksheetProblem
                  problem={problem}
                  problemNumber={problemNumber}
                  answer={answer}
                  isActive={false}
                  isSubmitted={false}
                  onClick={() => {}}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* ── Canvas Area (scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            <ScratchPad
              ref={scratchPadRef}
              height={canvasHeight}
              initialStrokes={initialStrokes}
              onStrokesChange={onStrokesChange}
              showToolbar={false}
              backgroundStyle={bgStyle}
              fillWidth={true}
              className="w-full"
            />
          </div>

          {/* ── Footer: Drawing Tools + Answer Bar ── */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-3 py-2 safe-area-pb">
            {/* Drawing tools row */}
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              {/* Colors */}
              <div className="flex items-center gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorSelect(c)}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-transform touch-manipulation',
                      currentColor === c && !isEraser ? 'border-gray-800 scale-110' : 'border-gray-300'
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                    type="button"
                  />
                ))}
                {/* Eraser */}
                <button
                  onClick={handleEraserToggle}
                  className={cn(
                    'w-8 h-8 rounded flex items-center justify-center border touch-manipulation ml-1',
                    isEraser ? 'border-amber-500 bg-amber-50' : 'border-gray-300'
                  )}
                  aria-label="Eraser"
                  title="Eraser"
                  type="button"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 20H7L3 16C2.4 15.4 2.4 14.6 3 14L13 4C13.6 3.4 14.4 3.4 15 4L21 10C21.6 10.6 21.6 11.4 21 12L12 21" />
                  </svg>
                </button>
              </div>

              {/* Pen sizes */}
              <div className="flex items-center gap-1">
                {WIDTHS.map((w) => (
                  <button
                    key={w}
                    onClick={() => handleWidthSelect(w)}
                    className={cn(
                      'w-8 h-8 rounded flex items-center justify-center border touch-manipulation',
                      currentWidth === w && !isEraser ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                    )}
                    aria-label={`Line width ${w}`}
                    type="button"
                  >
                    <div
                      className="rounded-full bg-gray-800"
                      style={{ width: w * 2, height: w * 2 }}
                    />
                  </button>
                ))}
              </div>

              {/* Undo / Clear */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  className="px-2.5 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 touch-manipulation"
                  type="button"
                >
                  Undo
                </button>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 touch-manipulation"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Answer entry bar */}
            <ScratchPadAnswerBar
              answer={answer}
              onAnswerChange={onAnswerChange}
              onDone={onClose}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
