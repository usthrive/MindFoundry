import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import DailyPracticeChart from '@/components/charts/DailyPracticeChart'
import { BadgeRow } from '@/components/badges/BadgeDisplay'
import { VideoAnalyticsCard, VideoPreferencesForm } from '@/components/dashboard'
import { getLevelDescription } from '@/utils/levelMapping'
import {
  getWorksheetProgress,
  getPracticeSessions,
  getSessionAttemptStats,
  getLifetimeStats,
  getDailyTrendData,
  getLevelBreakdown,
  getSessionTimeAnalytics,
  getChildFocusStats,
  getPerformanceTrendData,
  type SessionAttemptStats,
  type LifetimeStats,
  type TrendDataPoint,
  type LevelStats,
  type SessionTimeData,
  type FocusStats,
  type PerformanceTrendData
} from '@/services/progressService'
import ConceptTimeChart from '@/components/analytics/ConceptTimeChart'
import PerformanceTrendChart from '@/components/analytics/PerformanceTrendChart'
import PerformanceQuadrantChart from '@/components/analytics/PerformanceQuadrantChart'
import { getChildBadges, type Badge } from '@/utils/badgeSystem'
import type { Database } from '@/lib/supabase'
import type { KumonLevel } from '@/types'

type Child = Database['public']['Tables']['children']['Row']

function calculateEstimatedWeeks(
  remainingWorksheets: number,
  dailyTarget: number = 5,
  bufferPercent: number = 0.1
): number {
  const daysNeeded = remainingWorksheets / dailyTarget
  const daysWithBuffer = daysNeeded * (1 + bufferPercent)
  return Math.ceil(daysWithBuffer / 7)
}

function calculateOverallProgress(currentLevel: string): number {
  const levelOrder = ['7A','6A','5A','4A','3A','2A','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']
  const currentIndex = levelOrder.indexOf(currentLevel)
  if (currentIndex === -1) return 0
  return Math.round((currentIndex / levelOrder.length) * 100)
}

function getGradeString(gradeLevel: number): string {
  const grades = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade']
  return grades[gradeLevel] || `Grade ${gradeLevel}`
}

function CircularProgress({ percentage, size = 120, strokeWidth = 8, color = 'blue' }: { 
  percentage: number
  size?: number
  strokeWidth?: number
  color?: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  
  const colors = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    purple: 'stroke-purple-500',
    orange: 'stroke-orange-500'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className={`${colors[color]} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  )
}

export default function ProgressDashboard() {
  const { user, children, currentChild, selectChild } = useAuth()
  const navigate = useNavigate()

  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [, setWorksheetProgress] = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [dailyPracticeData, setDailyPracticeData] = useState<any[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [sessionStats, setSessionStats] = useState<Record<string, SessionAttemptStats>>({})
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats | null>(null)
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [levelBreakdown, setLevelBreakdown] = useState<LevelStats[]>([])
  const [sessionTimeData, setSessionTimeData] = useState<SessionTimeData[]>([])
  const [focusStats, setFocusStats] = useState<FocusStats | null>(null)
  const [performanceTrend, setPerformanceTrend] = useState<PerformanceTrendData[]>([])
  const [loading, setLoading] = useState(true)

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const loadChildProgress = async (child: Child) => {
    setLoading(true)
    const [progress, sessions, childBadges, lifetime, trend, levels, timeData, focus, perfTrend] = await Promise.all([
      getWorksheetProgress(child.id, child.current_level as KumonLevel),
      getPracticeSessions(child.id, 30),
      getChildBadges(child.id),
      getLifetimeStats(child.id),
      getDailyTrendData(child.id, 30),
      getLevelBreakdown(child.id),
      getSessionTimeAnalytics(child.id, 10),
      getChildFocusStats(child.id),
      getPerformanceTrendData(child.id, 60) // Now uses level-aware SCT internally
    ])

    const dailyData = sessions.reduce((acc: any[], session: any) => {
      // Use local date format for consistency with chart component
      const date = formatLocalDate(new Date(session.created_at))
      const existing = acc.find(d => d.date === date)
      if (existing) {
        existing.problems_completed += session.problems_completed || 0
        existing.problems_correct += session.problems_correct || 0
      } else {
        acc.push({
          date,
          problems_completed: session.problems_completed || 0,
          problems_correct: session.problems_correct || 0
        })
      }
      return acc
    }, [])

    // Fetch attempt stats for recent sessions (for detailed breakdown)
    const recentSessionsToShow = sessions.slice(0, 5)
    const statsPromises = recentSessionsToShow.map((session: any) =>
      getSessionAttemptStats(session.id).then(stats => ({ id: session.id, stats }))
    )
    const statsResults = await Promise.all(statsPromises)
    const statsMap: Record<string, SessionAttemptStats> = {}
    for (const { id, stats } of statsResults) {
      statsMap[id] = stats
    }

    setWorksheetProgress(progress)
    setRecentSessions(recentSessionsToShow)
    setDailyPracticeData(dailyData)
    setBadges(childBadges)
    setSessionStats(statsMap)
    setLifetimeStats(lifetime)
    setTrendData(trend)
    setLevelBreakdown(levels)
    setSessionTimeData(timeData)
    setFocusStats(focus)
    setPerformanceTrend(perfTrend)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (children.length === 0) {
      navigate('/select-child')
      return
    }
    const childToLoad = currentChild || children[0]
    setSelectedChild(childToLoad)
    loadChildProgress(childToLoad)
  }, [user, children, currentChild, navigate])

  const handleChildChange = (childId: string) => {
    const child = children.find(c => c.id === childId)
    if (child) {
      setSelectedChild(child)
      selectChild(childId)
      loadChildProgress(child)
    }
  }

  if (loading || !selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading progress...</p>
        </div>
      </div>
    )
  }

  const levelProgress = Math.round((selectedChild.current_worksheet / 200) * 100)
  const remainingWorksheets = 200 - selectedChild.current_worksheet
  const estimatedWeeks = calculateEstimatedWeeks(remainingWorksheets)
  const overallProgress = calculateOverallProgress(selectedChild.current_level)
  const accuracy = selectedChild.total_problems > 0
    ? Math.round((selectedChild.total_correct / selectedChild.total_problems) * 100)
    : 0

  const levelOrder = ['7A','6A','5A','4A','3A','2A','A','B','C','D','E','F','G','H','I']
  const currentLevelIndex = levelOrder.indexOf(selectedChild.current_level)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        
        {/* Header */}
        <div className="text-center">
          {children.length > 1 && (
            <select
              value={selectedChild.id}
              onChange={(e) => handleChildChange(e.target.value)}
              className="mb-3 px-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{selectedChild.name}'s Progress</h1>
          <p className="text-gray-500 text-sm">{getGradeString(selectedChild.grade_level)}</p>
        </div>

        {/* Main Stats Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Current Level</p>
              <p className="text-3xl font-bold text-gray-900">{selectedChild.current_level}</p>
              <p className="text-sm text-gray-600">{getLevelDescription(selectedChild.current_level as KumonLevel)}</p>
            </div>
            <CircularProgress percentage={levelProgress} color="blue" />
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Worksheet Progress</span>
              <span className="text-sm font-semibold text-blue-700">
                {selectedChild.current_worksheet} / 200
              </span>
            </div>
            <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ~{estimatedWeeks} weeks to complete level
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-xs text-gray-500 mt-1">Accuracy</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold text-orange-500">{selectedChild.streak}</span>
              {selectedChild.streak > 0 && <span className="text-lg">🔥</span>}
            </div>
            <div className="text-xs text-gray-500 mt-1">Day Streak</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {selectedChild.total_problems > 999
                ? `${(selectedChild.total_problems / 1000).toFixed(1)}k`
                : selectedChild.total_problems}
            </div>
            <div className="text-xs text-gray-500 mt-1">Problems</div>
          </div>
        </div>

        {/* Lifetime Performance Card */}
        {lifetimeStats && lifetimeStats.totalProblems > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-semibold text-gray-700">Lifetime Performance</h3>
            </div>

            {/* Main stats row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {lifetimeStats.firstTryAccuracy}%
                </div>
                <div className="text-xs text-gray-500 mt-1">First-Try</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {lifetimeStats.totalProblems > 999
                    ? `${(lifetimeStats.totalProblems / 1000).toFixed(1)}k`
                    : lifetimeStats.totalProblems}
                </div>
                <div className="text-xs text-gray-500 mt-1">Problems</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {lifetimeStats.avgTimePerProblem}s
                </div>
                <div className="text-xs text-gray-500 mt-1">Avg Time</div>
              </div>
            </div>

            {/* Breakdown bar */}
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">Problem Breakdown</span>
                <span className="text-gray-500">{lifetimeStats.totalProblems} total</span>
              </div>

              {/* Stacked progress bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                {lifetimeStats.totalFirstTryCorrect > 0 && (
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${(lifetimeStats.totalFirstTryCorrect / lifetimeStats.totalProblems) * 100}%` }}
                    title={`First-try correct: ${lifetimeStats.totalFirstTryCorrect}`}
                  />
                )}
                {lifetimeStats.totalWithHintsCorrect > 0 && (
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${(lifetimeStats.totalWithHintsCorrect / lifetimeStats.totalProblems) * 100}%` }}
                    title={`With hints: ${lifetimeStats.totalWithHintsCorrect}`}
                  />
                )}
                {lifetimeStats.totalIncorrect > 0 && (
                  <div
                    className="bg-red-400 h-full transition-all duration-500"
                    style={{ width: `${(lifetimeStats.totalIncorrect / lifetimeStats.totalProblems) * 100}%` }}
                    title={`Incorrect: ${lifetimeStats.totalIncorrect}`}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-gray-600">✅ {lifetimeStats.totalFirstTryCorrect}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600">🔄 {lifetimeStats.totalWithHintsCorrect}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-gray-600">❌ {lifetimeStats.totalIncorrect}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Analysis Section */}
        {focusStats && focusStats.sessionsWithTimeData > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⏱️</span>
              <h3 className="text-sm font-semibold text-gray-700">Time & Focus Analysis</h3>
            </div>

            {/* Focus Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={cn(
                  'text-2xl font-bold',
                  focusStats.avgFocusScore >= 90 ? 'text-green-600' :
                  focusStats.avgFocusScore >= 70 ? 'text-yellow-600' :
                  'text-orange-600'
                )}>
                  {focusStats.avgFocusScore}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Avg Focus</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(focusStats.totalFocusedTime / 60)}m
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Focus</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {focusStats.totalDistractions}
                </div>
                <div className="text-xs text-gray-500 mt-1">Breaks Taken</div>
              </div>
            </div>

            {/* Time Chart - uses level-appropriate SCT from SCT_BY_LEVEL */}
            {sessionTimeData.length > 0 && (
              <ConceptTimeChart
                level={selectedChild.current_level as KumonLevel}
                sessions={sessionTimeData}
              />
            )}

            {/* Focus Insights */}
            {focusStats.avgFocusScore < 80 && focusStats.sessionsWithTimeData >= 3 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Focus Tip:</strong> Your child's average focus score is {focusStats.avgFocusScore}%.
                  Consider enabling Focus Lock (Guided Access or Screen Pinning) to minimize distractions during practice.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Performance Trends Section */}
        {performanceTrend.length >= 3 && (
          <div className="space-y-4">
            {/* Trend Chart - Time Efficiency & Accuracy over time */}
            <PerformanceTrendChart
              sessions={performanceTrend}
              className="shadow-lg shadow-blue-100/50"
            />

            {/* Quadrant Chart - Session Analysis */}
            <PerformanceQuadrantChart
              sessions={performanceTrend.map(p => ({
                sessionId: p.sessionId,
                date: p.date,
                firstTryAccuracy: p.firstTryAccuracy,
                timeEfficiency: p.timeEfficiency
              }))}
              recentCount={5}
              className="shadow-lg shadow-blue-100/50"
            />
          </div>
        )}

        {/* Badges Section */}
        {badges.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Badges Earned</h3>
              <span className="text-xs text-gray-500">{badges.length} total</span>
            </div>
            <BadgeRow badges={badges} maxDisplay={6} />
          </div>
        )}

        {/* Video Analytics Section */}
        <VideoAnalyticsCard childId={selectedChild.id} />

        {/* Video Preferences Section */}
        <VideoPreferencesForm childId={selectedChild.id} childName={selectedChild.name} />

        {/* Level Journey */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Level Journey</h3>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 -translate-y-1/2 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(5, (currentLevelIndex / (levelOrder.length - 1)) * 100)}%` }}
            />
            <div className="relative flex justify-between">
              {levelOrder.filter((_, i) => i % 3 === 0 || i === currentLevelIndex || i === levelOrder.length - 1).map((level) => {
                const actualIndex = levelOrder.indexOf(level)
                const isPast = actualIndex < currentLevelIndex
                const isCurrent = actualIndex === currentLevelIndex
                
                return (
                  <div key={level} className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all
                      ${isPast ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-200 scale-110' : ''}
                      ${!isPast && !isCurrent ? 'bg-gray-200 text-gray-400' : ''}
                    `}>
                      {isPast ? '✓' : level}
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-medium text-blue-600 mt-1">Now</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            {overallProgress}% through the program
          </p>
        </div>

        {/* Level Breakdown Card */}
        {levelBreakdown.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h3 className="text-sm font-semibold text-gray-700">Performance by Level</h3>
            </div>

            <div className="space-y-3">
              {levelBreakdown.slice(0, 6).map((level) => (
                <div key={level.level} className="flex items-center gap-3">
                  {/* Level badge */}
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
                    level.level === selectedChild.current_level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  )}>
                    {level.level}
                  </div>

                  {/* Progress bar and stats */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">
                        {level.firstTryAccuracy}% first-try
                      </span>
                      <span className="text-gray-500">
                        {level.totalProblems} problems
                      </span>
                    </div>

                    {/* Stacked bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                      {level.firstTryCorrect > 0 && (
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${(level.firstTryCorrect / level.totalProblems) * 100}%` }}
                        />
                      )}
                      {level.withHintsCorrect > 0 && (
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${(level.withHintsCorrect / level.totalProblems) * 100}%` }}
                        />
                      )}
                      {level.incorrect > 0 && (
                        <div
                          className="bg-red-400 h-full"
                          style={{ width: `${(level.incorrect / level.totalProblems) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more levels if available */}
            {levelBreakdown.length > 6 && (
              <p className="text-center text-xs text-gray-400 mt-3">
                +{levelBreakdown.length - 6} more levels
              </p>
            )}
          </div>
        )}

        {/* Activity Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Activity</h3>
          <DailyPracticeChart data={trendData.length > 0 ? trendData : dailyPracticeData} />
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const date = new Date(session.created_at)
                const sessionAccuracy = session.problems_completed > 0
                  ? Math.round((session.problems_correct / session.problems_completed) * 100)
                  : 0
                const stats = sessionStats[session.id]
                const hasDetailedStats = stats && stats.total > 0

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-lg
                        ${sessionAccuracy === 100 ? 'bg-yellow-100' : sessionAccuracy >= 80 ? 'bg-green-100' : 'bg-gray-100'}
                      `}>
                        {sessionAccuracy === 100 ? '⭐' : sessionAccuracy >= 80 ? '✓' : '📝'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500">Level {session.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {hasDetailedStats ? (
                        <>
                          <p className="text-sm font-semibold text-gray-800">
                            ✅ {stats.firstTryCorrect}/{stats.total}
                          </p>
                          {stats.withHintsCorrect > 0 && (
                            <p className="text-xs text-blue-600 font-medium">
                              +{stats.withHintsCorrect} with hints
                            </p>
                          )}
                          {stats.incorrect > 0 && (
                            <p className="text-xs text-red-500">
                              {stats.incorrect} incorrect
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          {session.problems_correct}/{session.problems_completed}
                        </p>
                      )}
                      <p className={cn(
                        'text-xs',
                        sessionAccuracy >= 90 ? 'text-green-600' :
                        sessionAccuracy >= 70 ? 'text-yellow-600' :
                        'text-gray-500'
                      )}>
                        {sessionAccuracy}% overall
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={() => {
            selectChild(selectedChild.id)
            navigate('/study')
          }}
          className="w-full py-4 text-lg font-semibold rounded-xl shadow-lg shadow-blue-200/50"
        >
          Continue Learning
        </Button>
      </div>
    </div>
  )
}
