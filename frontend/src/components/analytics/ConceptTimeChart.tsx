/**
 * ConceptTimeChart Component
 *
 * Displays a visual chart showing time spent per session compared to SCT (Standard Completion Time).
 * Uses simple CSS-based bars without external chart libraries.
 *
 * Features:
 * - Shows recent sessions with time bars
 * - Color coding: green (under SCT), yellow (near SCT), red (over SCT)
 * - SCT benchmark line
 * - Focus score indicators
 */

import { cn } from '@/lib/utils'
import type { KumonLevel } from '@/types'
import { getSctForLevel } from '@/services/progressService'

interface SessionTimeData {
  sessionId: string
  date: string           // Display date (e.g., "Jan 15")
  totalTime: number      // Total time in seconds
  focusedTime: number    // Focused time in seconds
  awayTime: number       // Away time in seconds
  focusScore: number     // 0-100
  distractionCount: number
}

interface ConceptTimeChartProps {
  level: KumonLevel
  sessions: SessionTimeData[]
  sctSeconds?: number    // Optional override, defaults to level-appropriate SCT
  className?: string
}

// Format seconds to M:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Get bar color based on time vs SCT
const getBarColor = (time: number, sct: number): string => {
  const ratio = time / sct
  if (ratio <= 0.8) return 'bg-green-500'       // Fast - under 80% of SCT
  if (ratio <= 1.2) return 'bg-yellow-500'      // On target - 80-120% of SCT
  return 'bg-orange-500'                         // Slow - over 120% of SCT
}

// Get focus score color
const getFocusColor = (score: number): string => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-orange-600'
}

const ConceptTimeChart = ({
  level,
  sessions,
  sctSeconds: sctSecondsOverride,
  className
}: ConceptTimeChartProps) => {
  // Use level-appropriate SCT, or override if provided
  const sctSeconds = sctSecondsOverride ?? getSctForLevel(level)

  if (sessions.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Time Analysis</h3>
        <p className="text-gray-500 text-sm">No sessions recorded yet. Complete practice sessions to see time analytics.</p>
      </div>
    )
  }

  // Calculate max time for scaling bars
  const maxTime = Math.max(...sessions.map(s => s.totalTime), sctSeconds * 1.5)
  const sctPosition = (sctSeconds / maxTime) * 100

  // Calculate averages
  const avgTotalTime = Math.round(sessions.reduce((acc, s) => acc + s.totalTime, 0) / sessions.length)
  const avgFocusScore = Math.round(sessions.reduce((acc, s) => acc + s.focusScore, 0) / sessions.length)
  const avgTimeVsSct = (avgTotalTime / sctSeconds * 100).toFixed(0)

  return (
    <div className={cn('bg-white rounded-xl p-6 border border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Session Time Analysis</h3>
        <span className="text-sm text-gray-500">Level {level}</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Avg Time</p>
          <p className="text-lg font-semibold text-gray-900">{formatTime(avgTotalTime)}</p>
          <p className="text-xs text-gray-500">{avgTimeVsSct}% of SCT</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Target (SCT)</p>
          <p className="text-lg font-semibold text-blue-600">{formatTime(sctSeconds)}</p>
          <p className="text-xs text-gray-500">Standard time</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Avg Focus</p>
          <p className={cn('text-lg font-semibold', getFocusColor(avgFocusScore))}>{avgFocusScore}%</p>
          <p className="text-xs text-gray-500">Focus score</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* SCT Reference Line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-blue-500 z-10"
          style={{ left: `${sctPosition}%` }}
        >
          <div className="absolute -top-6 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs text-blue-600 font-medium">SCT ({formatTime(sctSeconds)})</span>
          </div>
        </div>

        {/* Session Bars */}
        <div className="space-y-3 pt-6">
          {sessions.slice(-10).map((session, index) => {
            const totalWidth = (session.totalTime / maxTime) * 100
            const focusedWidth = (session.focusedTime / maxTime) * 100
            const awayWidth = (session.awayTime / maxTime) * 100

            return (
              <div key={session.sessionId} className="flex items-center gap-3">
                {/* Date label */}
                <div className="w-12 text-xs text-gray-500 text-right shrink-0">
                  {session.date}
                </div>

                {/* Bar container */}
                <div className="flex-1 relative h-8 bg-gray-100 rounded overflow-hidden">
                  {/* Focused time bar */}
                  <div
                    className={cn(
                      'absolute left-0 top-0 bottom-0 transition-all',
                      getBarColor(session.totalTime, sctSeconds)
                    )}
                    style={{ width: `${focusedWidth}%` }}
                  />
                  {/* Away time bar (stacked) */}
                  {awayWidth > 0 && (
                    <div
                      className="absolute top-0 bottom-0 bg-gray-400 opacity-60"
                      style={{
                        left: `${focusedWidth}%`,
                        width: `${awayWidth}%`
                      }}
                    />
                  )}

                  {/* Time label inside bar */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-white drop-shadow">
                      {formatTime(session.totalTime)}
                    </span>
                  </div>
                </div>

                {/* Focus indicator */}
                <div className={cn(
                  'w-12 text-xs font-medium text-right shrink-0',
                  getFocusColor(session.focusScore)
                )}>
                  {session.focusScore}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-xs text-gray-600">Fast (&lt;80% SCT)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-xs text-gray-600">On Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-xs text-gray-600">Slow (&gt;120% SCT)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded" />
            <span className="text-xs text-gray-600">Away Time</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConceptTimeChart
