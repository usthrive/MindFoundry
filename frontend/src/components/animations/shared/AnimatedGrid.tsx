/**
 * AnimatedGrid - Reusable animated grid component
 * Phase 1.13: Educational Animation System
 *
 * Base component for:
 * - ArrayGroupsAnimation (multiplication as arrays)
 * - FractionBarAnimation (fraction visualization)
 * - TenFrameAnimation variants
 * - Area models for multiplication
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GridCell {
  row: number
  col: number
  filled: boolean
  highlighted?: boolean
  color?: string
  content?: React.ReactNode
}

export interface AnimatedGridProps {
  /** Number of rows */
  rows: number
  /** Number of columns */
  cols: number
  /** Cells to display */
  cells: GridCell[]
  /** Cell size in pixels (responsive) */
  cellSize?: 'sm' | 'md' | 'lg'
  /** Gap between cells */
  gap?: 'none' | 'sm' | 'md'
  /** Show row/column numbers */
  showLabels?: boolean
  /** Animate cells appearing */
  animateEntry?: boolean
  /** Stagger delay between cells (ms) */
  staggerDelay?: number
  /** Currently highlighted cell indices */
  highlightedIndices?: number[]
  /** Callback when a cell is clicked */
  onCellClick?: (row: number, col: number) => void
  /** Additional CSS classes */
  className?: string
}

const CELL_SIZES = {
  sm: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8',
  md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
  lg: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
}

const GAP_SIZES = {
  none: 'gap-0',
  sm: 'gap-0.5 sm:gap-1',
  md: 'gap-1 sm:gap-2',
}

export default function AnimatedGrid({
  rows,
  cols,
  cells,
  cellSize = 'md',
  gap = 'sm',
  showLabels = false,
  animateEntry = true,
  staggerDelay = 50,
  highlightedIndices = [],
  onCellClick,
  className,
}: AnimatedGridProps) {
  // Create a map for quick cell lookup
  const cellMap = new Map<string, GridCell>()
  cells.forEach((cell) => {
    cellMap.set(`${cell.row}-${cell.col}`, cell)
  })

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Column labels */}
      {showLabels && (
        <div className={cn('flex', GAP_SIZES[gap], 'mb-1')}>
          <div className={cn(CELL_SIZES[cellSize], 'flex-shrink-0')} /> {/* Spacer for row labels */}
          {Array.from({ length: cols }, (_, c) => (
            <div
              key={`col-${c}`}
              className={cn(
                CELL_SIZES[cellSize],
                'flex items-center justify-center text-xs text-gray-400 font-medium'
              )}
            >
              {c + 1}
            </div>
          ))}
        </div>
      )}

      {/* Grid with optional row labels */}
      <div className={cn('grid', GAP_SIZES[gap])} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const cell = cellMap.get(`${r}-${c}`)
            const index = r * cols + c
            const isHighlighted = highlightedIndices.includes(index) || cell?.highlighted

            return (
              <motion.div
                key={`${r}-${c}`}
                initial={animateEntry ? { scale: 0, opacity: 0 } : undefined}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  delay: animateEntry ? index * (staggerDelay / 1000) : 0,
                }}
                onClick={() => onCellClick?.(r, c)}
                className={cn(
                  CELL_SIZES[cellSize],
                  'rounded-md border transition-all flex items-center justify-center',
                  cell?.filled
                    ? cell.color || 'bg-primary/20 border-primary/40'
                    : 'bg-gray-50 border-gray-200',
                  isHighlighted && 'ring-2 ring-yellow-400 ring-offset-1 scale-105',
                  onCellClick && 'cursor-pointer hover:scale-105'
                )}
                style={cell?.color ? { backgroundColor: cell.color } : undefined}
              >
                <AnimatePresence mode="wait">
                  {cell?.content && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center"
                    >
                      {cell.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Row labels on the left (optional second render) */}
      {showLabels && (
        <div className="absolute left-0 top-0 flex flex-col">
          {Array.from({ length: rows }, (_, r) => (
            <div
              key={`row-${r}`}
              className={cn(
                CELL_SIZES[cellSize],
                'flex items-center justify-center text-xs text-gray-400 font-medium'
              )}
            >
              {r + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Utility to create cells for a filled rectangle
 */
export function createFilledGrid(rows: number, cols: number, color?: string): GridCell[] {
  const cells: GridCell[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ row: r, col: c, filled: true, color })
    }
  }
  return cells
}

/**
 * Utility to create cells with content (e.g., emojis or numbers)
 */
export function createContentGrid(
  rows: number,
  cols: number,
  contentFn: (row: number, col: number, index: number) => React.ReactNode
): GridCell[] {
  const cells: GridCell[] = []
  let index = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        row: r,
        col: c,
        filled: true,
        content: contentFn(r, c, index),
      })
      index++
    }
  }
  return cells
}
