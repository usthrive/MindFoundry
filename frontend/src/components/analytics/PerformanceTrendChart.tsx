/**
 * PerformanceTrendChart Component
 *
 * Displays a dual-line chart showing performance trends over time:
 * - Line 1 (Green): First-Try Accuracy (0-100%)
 * - Line 2 (Blue): Time Efficiency (% of SCT, 100% = on target)
 *
 * Features:
 * - Visual trend lines using CSS/SVG
 * - Reference line at 80% target zone
 * - Hover tooltips with exact values
 * - Responsive design
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface TrendDataPoint {
  date: string              // Display date (e.g., "Jan 15")
  sessionId?: string        // Optional session ID
  firstTryAccuracy: number  // 0-100%
  timeEfficiency: number    // % of SCT (100 = on target)
  totalProblems: number
}

interface PerformanceTrendChartProps {
  sessions: TrendDataPoint[]
  className?: string
  showLegend?: boolean
}

const PerformanceTrendChart = ({
  sessions,
  className,
  showLegend = true
}: PerformanceTrendChartProps) => {
  // Chart dimensions - each chart is smaller since we have two
  const SINGLE_CHART_HEIGHT = 140
  const CHART_PADDING = 30
  const POINT_RADIUS = 5
  const CHART_GAP = 20

  // Calculate chart metrics
  const chartData = useMemo(() => {
    if (sessions.length === 0) return null

    // Use last 10 sessions max for clarity
    const displaySessions = sessions.slice(-10)

    // Max time efficiency could be > 100%, cap display at 200%
    const maxTimeEfficiency = Math.max(
      200,
      ...displaySessions.map(s => s.timeEfficiency)
    )

    // Calculate averages
    const avgAccuracy = Math.round(
      displaySessions.reduce((sum, s) => sum + s.firstTryAccuracy, 0) / displaySessions.length
    )
    const avgTimeEfficiency = Math.round(
      displaySessions.reduce((sum, s) => sum + s.timeEfficiency, 0) / displaySessions.length
    )

    // Calculate trend (slope of last few points)
    const calculateTrend = (values: number[]) => {
      if (values.length < 2) return 0
      const recent = values.slice(-5)
      const first = recent[0]
      const last = recent[recent.length - 1]
      return last - first
    }

    const accuracyTrend = calculateTrend(displaySessions.map(s => s.firstTryAccuracy))
    const timeTrend = calculateTrend(displaySessions.map(s => s.timeEfficiency))

    return {
      sessions: displaySessions,
      maxTimeEfficiency,
      avgAccuracy,
      avgTimeEfficiency,
      accuracyTrend,
      timeTrend
    }
  }, [sessions])

  if (!chartData || chartData.sessions.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Trends</h3>
        <p className="text-gray-500 text-sm">
          Complete more practice sessions to see performance trends over time.
        </p>
      </div>
    )
  }

  const { sessions: displaySessions, maxTimeEfficiency, avgAccuracy, avgTimeEfficiency, accuracyTrend, timeTrend } = chartData
  const chartWidth = 100 // percentage

  // Convert value to Y position for accuracy chart (0-100%)
  const getAccuracyY = (value: number) => SINGLE_CHART_HEIGHT - (value / 100) * (SINGLE_CHART_HEIGHT - CHART_PADDING)

  // Convert value to Y position for speed chart (0-maxTimeEfficiency%)
  const getSpeedY = (value: number) => SINGLE_CHART_HEIGHT - (value / maxTimeEfficiency) * (SINGLE_CHART_HEIGHT - CHART_PADDING)

  // Get X position for each point
  const getX = (index: number) => {
    const usableWidth = chartWidth - 10 // Leave some padding
    return 5 + (index / (displaySessions.length - 1 || 1)) * usableWidth
  }

  // Generate SVG path for a line
  const generatePath = (values: number[], getY: (v: number) => number) => {
    if (values.length === 0) return ''

    const points = values.map((v, i) => `${getX(i)}%,${getY(v)}`)
    return `M ${points.join(' L ')}`
  }

  const accuracyPath = generatePath(
    displaySessions.map(s => s.firstTryAccuracy),
    getAccuracyY
  )

  const speedPath = generatePath(
    displaySessions.map(s => s.timeEfficiency),
    getSpeedY
  )

  // Target line at 80% for accuracy chart
  const accuracyTargetY = getAccuracyY(80)

  // Target line at 100% for speed chart (on-target speed)
  const speedTargetY = getSpeedY(100)

  // Get trend arrow
  const getTrendIndicator = (trend: number) => {
    if (trend > 5) return { icon: '↗', color: 'text-green-600', label: 'Improving' }
    if (trend < -5) return { icon: '↘', color: 'text-orange-600', label: 'Declining' }
    return { icon: '→', color: 'text-gray-500', label: 'Stable' }
  }

  const accuracyTrendInfo = getTrendIndicator(accuracyTrend)
  const timeTrendInfo = getTrendIndicator(timeTrend) // Higher time efficiency = faster = better

  return (
    <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
        <span className="text-sm text-gray-500">Last {displaySessions.length} sessions</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Avg First-Try Accuracy</p>
              <p className="text-2xl font-bold text-green-700">{avgAccuracy}%</p>
            </div>
            <div className={cn('text-lg', accuracyTrendInfo.color)}>
              <span title={accuracyTrendInfo.label}>{accuracyTrendInfo.icon}</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Avg Time Efficiency</p>
              <p className="text-2xl font-bold text-blue-700">{avgTimeEfficiency}%</p>
            </div>
            <div className={cn('text-lg', timeTrendInfo.color)}>
              <span title={timeTrendInfo.label}>{timeTrendInfo.icon}</span>
            </div>
          </div>
          <p className="text-xs text-blue-500 mt-1">
            {avgTimeEfficiency >= 100 ? 'On or faster than target' : 'Slower than target'}
          </p>
        </div>
      </div>

      {/* Charts Container - Two stacked charts */}
      <div className="space-y-4">
        {/* ACCURACY CHART (Top) */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">First-Try Accuracy</span>
          </div>
          <div className="relative" style={{ height: SINGLE_CHART_HEIGHT + 10 }}>
            {/* Y-axis labels for accuracy */}
            <div className="absolute left-0 top-0 w-10 flex flex-col justify-between text-xs text-gray-400 text-right pr-2" style={{ height: SINGLE_CHART_HEIGHT }}>
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            {/* Accuracy chart area */}
            <div className="ml-10 relative" style={{ height: SINGLE_CHART_HEIGHT }}>
              <svg width="100%" height={SINGLE_CHART_HEIGHT} className="overflow-visible">
                {/* Grid lines */}
                {[0, 20, 40, 60, 80, 100].map(pct => (
                  <line
                    key={pct}
                    x1="0%"
                    x2="100%"
                    y1={getAccuracyY(pct)}
                    y2={getAccuracyY(pct)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={pct === 80 ? "4,4" : "0"}
                  />
                ))}

                {/* Target zone highlight (80%+) */}
                <rect
                  x="0%"
                  y={getAccuracyY(100)}
                  width="100%"
                  height={getAccuracyY(80) - getAccuracyY(100)}
                  fill="#dcfce7"
                  opacity="0.3"
                />

                {/* Target line at 80% */}
                <line
                  x1="0%"
                  x2="100%"
                  y1={accuracyTargetY}
                  y2={accuracyTargetY}
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                <text
                  x="100%"
                  y={accuracyTargetY - 5}
                  textAnchor="end"
                  className="text-[10px] fill-green-600"
                >
                  80% Target
                </text>

                {/* Accuracy line (green) */}
                {displaySessions.length > 1 && (
                  <path
                    d={accuracyPath}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points - Accuracy */}
                {displaySessions.map((session, i) => (
                  <g key={`acc-${i}`}>
                    <circle
                      cx={`${getX(i)}%`}
                      cy={getAccuracyY(session.firstTryAccuracy)}
                      r={POINT_RADIUS}
                      fill="#22c55e"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                    />
                    <title>
                      {session.date}: {session.firstTryAccuracy}% first-try accuracy ({session.totalProblems} problems)
                    </title>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* SPEED CHART (Bottom) */}
        <div className="relative pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm font-medium text-blue-700">Speed (% of Target Time)</span>
          </div>
          <div className="relative" style={{ height: SINGLE_CHART_HEIGHT + 30 }}>
            {/* Y-axis labels for speed */}
            <div className="absolute left-0 top-0 w-10 flex flex-col justify-between text-xs text-gray-400 text-right pr-2" style={{ height: SINGLE_CHART_HEIGHT }}>
              <span>{maxTimeEfficiency}%</span>
              <span>{Math.round(maxTimeEfficiency * 0.75)}%</span>
              <span>{Math.round(maxTimeEfficiency * 0.5)}%</span>
              <span>{Math.round(maxTimeEfficiency * 0.25)}%</span>
              <span>0%</span>
            </div>

            {/* Speed chart area */}
            <div className="ml-10 relative" style={{ height: SINGLE_CHART_HEIGHT }}>
              <svg width="100%" height={SINGLE_CHART_HEIGHT} className="overflow-visible">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(pct => (
                  <line
                    key={pct}
                    x1="0%"
                    x2="100%"
                    y1={getSpeedY(pct * maxTimeEfficiency)}
                    y2={getSpeedY(pct * maxTimeEfficiency)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {/* Target zone highlight (100%+) - fast zone */}
                <rect
                  x="0%"
                  y={getSpeedY(maxTimeEfficiency)}
                  width="100%"
                  height={getSpeedY(100) - getSpeedY(maxTimeEfficiency)}
                  fill="#dbeafe"
                  opacity="0.3"
                />

                {/* Target line at 100% (on-target speed) */}
                <line
                  x1="0%"
                  x2="100%"
                  y1={speedTargetY}
                  y2={speedTargetY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                <text
                  x="100%"
                  y={speedTargetY - 5}
                  textAnchor="end"
                  className="text-[10px] fill-blue-600"
                >
                  100% Target
                </text>

                {/* Speed line (blue) */}
                {displaySessions.length > 1 && (
                  <path
                    d={speedPath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points - Speed */}
                {displaySessions.map((session, i) => (
                  <g key={`speed-${i}`}>
                    <circle
                      cx={`${getX(i)}%`}
                      cy={getSpeedY(session.timeEfficiency)}
                      r={POINT_RADIUS}
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                    />
                    <title>
                      {session.date}: {session.timeEfficiency}% of target time
                    </title>
                  </g>
                ))}
              </svg>

              {/* X-axis labels - show only first, middle, and last to avoid overlap */}
              <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-500 translate-y-5">
                {displaySessions.length > 0 && (
                  <>
                    {/* First date */}
                    <span
                      className="absolute text-center"
                      style={{ left: `${getX(0)}%`, transform: 'translateX(-50%)' }}
                    >
                      {displaySessions[0].date}
                    </span>
                    {/* Middle date (if more than 2 sessions) */}
                    {displaySessions.length > 2 && (
                      <span
                        className="absolute text-center"
                        style={{ left: `${getX(Math.floor(displaySessions.length / 2))}%`, transform: 'translateX(-50%)' }}
                      >
                        {displaySessions[Math.floor(displaySessions.length / 2)].date}
                      </span>
                    )}
                    {/* Last date (if different from first) */}
                    {displaySessions.length > 1 && (
                      <span
                        className="absolute text-center"
                        style={{ left: `${getX(displaySessions.length - 1)}%`, transform: 'translateX(-50%)' }}
                      >
                        {displaySessions[displaySessions.length - 1].date}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5" style={{ borderTop: '2px dashed #22c55e' }} />
            <span className="text-xs text-gray-600">80% Accuracy Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5" style={{ borderTop: '2px dashed #3b82f6' }} />
            <span className="text-xs text-gray-600">100% Speed Target</span>
          </div>
        </div>
      )}

      {/* Interpretation Guide */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>How to read:</strong> Top chart shows accuracy (higher is better, aim for 80%+).
          Bottom chart shows speed (100% = on target, higher = faster than expected).
        </p>
      </div>
    </div>
  )
}

export default PerformanceTrendChart
