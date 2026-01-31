/**
 * PerformanceQuadrantChart Component
 *
 * Displays a scatter plot showing sessions in 4 performance quadrants:
 *
 *     100% ─────────────────────────────
 *          │  FAST &      │   SLOW BUT   │
 *  Accuracy│  ACCURATE    │   ACCURATE   │
 *          │  (Mastered!) │  (Speed Work)│
 *     80% ─│──────────────┼──────────────│
 *          │  FAST BUT    │   NEEDS      │
 *          │  ERRORS      │   SUPPORT    │
 *          │  (Slow Down!)│ (More Practice)
 *       0% └────────────────────────────→
 *           Fast (50%)   Target (100%)  Slow (150%)
 *                   Time Efficiency
 *
 * Features:
 * - Each dot = one session
 * - Color coding by quadrant
 * - Recent sessions highlighted (larger dots)
 * - Summary of quadrant distribution
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface QuadrantDataPoint {
  sessionId: string
  date: string
  firstTryAccuracy: number  // 0-100
  timeEfficiency: number    // % of SCT (100 = target)
}

interface PerformanceQuadrantChartProps {
  sessions: QuadrantDataPoint[]
  recentCount?: number  // Highlight last N sessions
  className?: string
}

// Quadrant definitions
const QUADRANTS = {
  mastered: {
    name: 'Mastered',
    description: 'Fast & Accurate',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    emoji: '🌟',
    advice: 'Great work! Ready for new challenges.'
  },
  speedWork: {
    name: 'Speed Work',
    description: 'Accurate but Slow',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    emoji: '⏱️',
    advice: 'Accuracy is great! Practice for speed.'
  },
  slowDown: {
    name: 'Slow Down',
    description: 'Fast but Errors',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    emoji: '🐢',
    advice: 'Take more time to avoid mistakes.'
  },
  needsSupport: {
    name: 'Needs Support',
    description: 'Slow & Struggling',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    emoji: '💪',
    advice: 'Review concepts and practice more.'
  }
}

type QuadrantKey = keyof typeof QUADRANTS

const PerformanceQuadrantChart = ({
  sessions,
  recentCount = 5,
  className
}: PerformanceQuadrantChartProps) => {
  // Chart dimensions
  const CHART_SIZE = 280
  const PADDING = 40
  const INNER_SIZE = CHART_SIZE - PADDING * 2

  // Thresholds
  const ACCURACY_THRESHOLD = 80   // 80% first-try accuracy
  const TIME_THRESHOLD = 100      // 100% of SCT

  // Analyze sessions and categorize into quadrants
  const analysis = useMemo(() => {
    if (sessions.length === 0) return null

    const categorized: Record<QuadrantKey, QuadrantDataPoint[]> = {
      mastered: [],
      speedWork: [],
      slowDown: [],
      needsSupport: []
    }

    sessions.forEach(session => {
      // With inverted calculation: higher timeEfficiency = faster
      const isFast = session.timeEfficiency >= TIME_THRESHOLD
      const isAccurate = session.firstTryAccuracy >= ACCURACY_THRESHOLD

      if (isFast && isAccurate) {
        categorized.mastered.push(session)
      } else if (!isFast && isAccurate) {
        categorized.speedWork.push(session)
      } else if (isFast && !isAccurate) {
        categorized.slowDown.push(session)
      } else {
        categorized.needsSupport.push(session)
      }
    })

    // Calculate percentages
    const total = sessions.length
    const percentages: Record<QuadrantKey, number> = {
      mastered: Math.round((categorized.mastered.length / total) * 100),
      speedWork: Math.round((categorized.speedWork.length / total) * 100),
      slowDown: Math.round((categorized.slowDown.length / total) * 100),
      needsSupport: Math.round((categorized.needsSupport.length / total) * 100)
    }

    // Determine primary recommendation
    const maxCategory = Object.entries(categorized)
      .filter(([key]) => key !== 'mastered')
      .sort((a, b) => b[1].length - a[1].length)[0]

    const recommendation = maxCategory && maxCategory[1].length > 0
      ? QUADRANTS[maxCategory[0] as QuadrantKey].advice
      : QUADRANTS.mastered.advice

    return {
      categorized,
      percentages,
      total,
      recommendation,
      recentSessions: sessions.slice(-recentCount)
    }
  }, [sessions, recentCount])

  // Get quadrant for a session
  const getQuadrant = (session: QuadrantDataPoint): QuadrantKey => {
    // With inverted calculation: higher timeEfficiency = faster
    const isFast = session.timeEfficiency >= TIME_THRESHOLD
    const isAccurate = session.firstTryAccuracy >= ACCURACY_THRESHOLD

    if (isFast && isAccurate) return 'mastered'
    if (!isFast && isAccurate) return 'speedWork'
    if (isFast && !isAccurate) return 'slowDown'
    return 'needsSupport'
  }

  // Convert data to chart coordinates
  // X: Time efficiency (50% to 150%, 100% = center) - INVERTED so fast is on left
  // Y: Accuracy (0% to 100%, 80% = threshold)
  const getPosition = (session: QuadrantDataPoint) => {
    // X: Time efficiency - higher values (faster) on LEFT
    // 150%+ (fast) = left edge, 50% (slow) = right edge
    const timeNormalized = Math.min(Math.max(session.timeEfficiency, 50), 150)
    const x = PADDING + ((150 - timeNormalized) / 100) * INNER_SIZE

    // Y: Accuracy - 0 at bottom, 100 at top
    const y = PADDING + ((100 - session.firstTryAccuracy) / 100) * INNER_SIZE

    return { x, y }
  }

  if (!analysis || sessions.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Analysis</h3>
        <p className="text-gray-500 text-sm">
          Complete more practice sessions to see your performance quadrant analysis.
        </p>
      </div>
    )
  }

  const { categorized, percentages, total, recommendation, recentSessions } = analysis

  return (
    <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Session Analysis</h3>
        <span className="text-sm text-gray-500">{total} sessions</span>
      </div>

      {/* Chart and Stats side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Quadrant Chart */}
        <div className="relative" style={{ width: CHART_SIZE, height: CHART_SIZE }}>
          <svg width={CHART_SIZE} height={CHART_SIZE}>
            {/* Background quadrants */}
            {/* Top-left: Slow Down (fast but errors) */}
            <rect
              x={PADDING}
              y={PADDING + ((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              width={INNER_SIZE / 2}
              height={(ACCURACY_THRESHOLD / 100) * INNER_SIZE}
              fill="#fef3c7"
              opacity="0.5"
            />
            {/* Top-right: Needs Support */}
            <rect
              x={PADDING + INNER_SIZE / 2}
              y={PADDING + ((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              width={INNER_SIZE / 2}
              height={(ACCURACY_THRESHOLD / 100) * INNER_SIZE}
              fill="#fed7aa"
              opacity="0.5"
            />
            {/* Bottom-left: Mastered */}
            <rect
              x={PADDING}
              y={PADDING}
              width={INNER_SIZE / 2}
              height={((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              fill="#dcfce7"
              opacity="0.5"
            />
            {/* Bottom-right: Speed Work */}
            <rect
              x={PADDING + INNER_SIZE / 2}
              y={PADDING}
              width={INNER_SIZE / 2}
              height={((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              fill="#dbeafe"
              opacity="0.5"
            />

            {/* Grid lines */}
            <line
              x1={PADDING}
              x2={PADDING + INNER_SIZE}
              y1={PADDING + ((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              y2={PADDING + ((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE}
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <line
              x1={PADDING + INNER_SIZE / 2}
              x2={PADDING + INNER_SIZE / 2}
              y1={PADDING}
              y2={PADDING + INNER_SIZE}
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Axis border */}
            <rect
              x={PADDING}
              y={PADDING}
              width={INNER_SIZE}
              height={INNER_SIZE}
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1"
            />

            {/* Quadrant labels */}
            <text x={PADDING + INNER_SIZE * 0.25} y={PADDING + 20} textAnchor="middle" className="text-xs fill-green-700 font-medium">
              Mastered
            </text>
            <text x={PADDING + INNER_SIZE * 0.75} y={PADDING + 20} textAnchor="middle" className="text-xs fill-blue-700 font-medium">
              Speed Work
            </text>
            <text x={PADDING + INNER_SIZE * 0.25} y={PADDING + INNER_SIZE - 10} textAnchor="middle" className="text-xs fill-yellow-700 font-medium">
              Slow Down
            </text>
            <text x={PADDING + INNER_SIZE * 0.75} y={PADDING + INNER_SIZE - 10} textAnchor="middle" className="text-xs fill-orange-700 font-medium">
              Needs Support
            </text>

            {/* Data points - older sessions (smaller, more transparent) */}
            {sessions.slice(0, -recentCount).map((session, i) => {
              const { x, y } = getPosition(session)
              const quadrant = getQuadrant(session)
              const color = {
                mastered: '#22c55e',
                speedWork: '#3b82f6',
                slowDown: '#eab308',
                needsSupport: '#f97316'
              }[quadrant]

              return (
                <g key={session.sessionId || i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    opacity="0.4"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <title>
                    {session.date}: {session.firstTryAccuracy}% accuracy, {session.timeEfficiency}% time
                  </title>
                </g>
              )
            })}

            {/* Recent sessions (larger, more prominent) */}
            {recentSessions.map((session, i) => {
              const { x, y } = getPosition(session)
              const quadrant = getQuadrant(session)
              const color = {
                mastered: '#22c55e',
                speedWork: '#3b82f6',
                slowDown: '#eab308',
                needsSupport: '#f97316'
              }[quadrant]

              return (
                <g key={`recent-${session.sessionId || i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={7}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                  {/* Show session number for recent */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px] fill-white font-bold pointer-events-none"
                  >
                    {sessions.length - recentCount + i + 1}
                  </text>
                  <title>
                    Session {sessions.length - recentCount + i + 1} ({session.date}):
                    {session.firstTryAccuracy}% accuracy, {session.timeEfficiency}% of target time
                  </title>
                </g>
              )
            })}
          </svg>

          {/* Y-axis label */}
          <div
            className="absolute -rotate-90 text-xs text-gray-500 whitespace-nowrap origin-center"
            style={{ left: 2, top: PADDING + INNER_SIZE / 2, transform: 'rotate(-90deg) translateX(-50%)' }}
          >
            First-Try Accuracy
          </div>

          {/* X-axis label */}
          <div
            className="absolute text-xs text-gray-500 text-center"
            style={{ left: PADDING, width: INNER_SIZE, bottom: 4 }}
          >
            Time vs Target
          </div>

          {/* Y-axis values */}
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING - 28, top: PADDING - 6 }}>100%</div>
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING - 24, top: PADDING + ((100 - ACCURACY_THRESHOLD) / 100) * INNER_SIZE - 6 }}>80%</div>
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING - 16, top: PADDING + INNER_SIZE - 6 }}>0%</div>

          {/* X-axis values */}
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING, bottom: 16 }}>Fast</div>
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING + INNER_SIZE / 2 - 15, bottom: 16 }}>Target</div>
          <div className="absolute text-xs text-gray-400" style={{ left: PADDING + INNER_SIZE - 24, bottom: 16 }}>Slow</div>
        </div>

        {/* Quadrant Distribution */}
        <div className="flex-1 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Distribution</h4>

          {(Object.keys(QUADRANTS) as QuadrantKey[]).map(key => {
            const q = QUADRANTS[key]
            const count = categorized[key].length
            const pct = percentages[key]

            return (
              <div key={key} className={cn('p-3 rounded-lg', q.bgColor)}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{q.emoji}</span>
                    <span className={cn('text-sm font-medium', q.textColor)}>{q.name}</span>
                  </div>
                  <span className={cn('text-sm font-bold', q.textColor)}>
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', q.color)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{q.description}</p>
              </div>
            )
          })}

          {/* Recommendation */}
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h5 className="text-sm font-medium text-purple-900 mb-1">Recommendation</h5>
            <p className="text-xs text-purple-700">{recommendation}</p>
          </div>
        </div>
      </div>

      {/* Legend for recent vs older */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-xs text-gray-600">Older sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
          <span className="text-xs text-gray-600">Recent {recentCount} sessions</span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceQuadrantChart
