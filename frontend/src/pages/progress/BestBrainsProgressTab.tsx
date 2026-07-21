/**
 * BestBrainsProgressTab — the "Best Brains" tab of the parent-facing My Progress
 * dashboard. A CHILD-SAFE mirror of the module's JourneyMap (moves & effort,
 * never scores): the same trail / Mastered-Shelf / this-week-effort logic, but
 * fed directly from the read-only services (no FoundrySession context here).
 *
 * Child-safe law (Best Brains P4/P6): this surface is child-reachable, so it
 * NEVER renders a %, a red mark, "Review", or "fail". Graded detail (verdicts,
 * percentages) lives only on the parent-side weekly reports at /foundry/parent.
 *
 * Reads only — getEnrollment + listWeekStatesReadOnly never initialize rows
 * (the parent surface must not create a child's week state).
 */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEnrollment } from '@/modules/best-brains/services/bbProgressService'
import { listWeekStatesReadOnly } from '@/modules/best-brains/services/bbParentService'
import { getCatalogWeek, getLevelCatalog } from '@/modules/best-brains/content/catalog'
import { deriveTiles } from '@/modules/best-brains/session/weekLogic'
import {
  BB_LEVEL_DISPLAY_NAMES,
  PASSED_STATES,
  WEEKS_PER_LEVEL,
} from '@/modules/best-brains/constants'
import type { BBEnrollment, WeekMasteryState, WeekState } from '@/modules/best-brains/types'

/** DD1 corrective-loop states — shown warmly as "strengthening", never as a fail. */
const STRENGTHENING_STATES: readonly WeekMasteryState[] = ['near_miss_cycle1', 'cycle2', 'escalated']

type TrailStatus = 'mastered' | 'strengthening' | 'current' | 'upcoming'

interface Stop {
  week: number
  conceptName: string
  status: TrailStatus
  isCheckpoint: boolean
  isLevelExit: boolean
}

type LoadState = 'loading' | 'error' | 'not-enrolled' | 'ready'

export default function BestBrainsProgressTab({
  childId,
  childName,
}: {
  childId: string
  childName: string
}) {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [enrollment, setEnrollment] = useState<BBEnrollment | null>(null)
  const [weekStates, setWeekStates] = useState<WeekState[]>([])

  const load = useCallback(async () => {
    if (!childId) return
    setLoadState('loading')
    try {
      const enr = await getEnrollment(childId)
      if (!enr) {
        setEnrollment(null)
        setLoadState('not-enrolled')
        return
      }
      const states = await listWeekStatesReadOnly(childId, enr.level)
      setEnrollment(enr)
      setWeekStates(states)
      setLoadState('ready')
    } catch (e) {
      console.error('[bb] progress tab load failed', e)
      setLoadState('error')
    }
  }, [childId])

  useEffect(() => {
    void load()
  }, [load])

  // --- Loading -------------------------------------------------------------
  if (loadState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm font-medium">Loading Best Brains…</p>
      </div>
    )
  }

  // --- Error ---------------------------------------------------------------
  if (loadState === 'error') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-8 text-center">
        <div className="text-4xl mb-2">🪶</div>
        <p className="text-sm text-gray-600">We couldn't load Best Brains just now.</p>
        <button
          onClick={() => void load()}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  // --- Not enrolled --------------------------------------------------------
  if (loadState === 'not-enrolled' || !enrollment) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-8 text-center">
        <div className="text-5xl mb-3">🪶</div>
        <h3 className="text-lg font-bold text-gray-900">
          {childName} hasn't started Best Brains yet
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
          The Best Brains Method builds one concept a week with Ms. Wren. The starting point
          feels like exploring, never like a test.
        </p>
        <button
          onClick={() => navigate('/foundry')}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-200/50 hover:bg-teal-700 transition-colors"
        >
          Start Best Brains
        </button>
      </div>
    )
  }

  // --- Ready (enrolled) ----------------------------------------------------
  const catalog = getLevelCatalog(enrollment.level)
  const stateByWeek = new Map(weekStates.map((s) => [s.week, s]))

  const trail: Stop[] = catalog.map((cell) => {
    const ws = stateByWeek.get(cell.week)
    const passed = !!ws && PASSED_STATES.includes(ws.state)
    const strengthening = !!ws && STRENGTHENING_STATES.includes(ws.state)
    return {
      week: cell.week,
      conceptName: cell.conceptName,
      status: passed
        ? 'mastered'
        : strengthening
          ? 'strengthening'
          : cell.week === enrollment.currentWeek
            ? 'current'
            : 'upcoming',
      isCheckpoint: cell.isCheckpoint,
      isLevelExit: cell.isLevelExit,
    }
  })

  const shelf = trail.filter((t) => t.status === 'mastered')
  const currentConcept = getCatalogWeek(enrollment.level, enrollment.currentWeek)?.conceptName
  const currentWeekState = stateByWeek.get(enrollment.currentWeek) ?? null
  const effort = currentWeekState ? deriveTiles(currentWeekState.dayProgress) : null

  return (
    <div className="space-y-5">
      {/* Current level & week */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-5">
        <p className="text-xs text-teal-700 uppercase tracking-wide font-semibold">
          {BB_LEVEL_DISPLAY_NAMES[enrollment.level]} · Week {enrollment.currentWeek}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">
          {currentConcept ?? 'This week'}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {shelf.length} of {WEEKS_PER_LEVEL} concepts mastered at this level
        </p>
        <div className="mt-3 h-2 bg-teal-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(3, (shelf.length / WEEKS_PER_LEVEL) * 100)}%` }}
          />
        </div>
      </div>

      {/* The trail — mastered / current / upcoming, the child's own journey view */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{childName}'s journey</h3>
        <ol className="space-y-1">
          {trail.map((stop) => (
            <li key={stop.week}>
              <div
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  stop.status === 'current'
                    ? 'bg-teal-50 ring-2 ring-teal-200'
                    : stop.status === 'strengthening'
                      ? 'bg-teal-50/60'
                      : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    stop.status === 'mastered'
                      ? 'bg-teal-500 text-white'
                      : stop.status === 'current'
                        ? 'bg-teal-600 text-white'
                        : stop.status === 'strengthening'
                          ? 'bg-teal-400 text-white'
                          : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {stop.status === 'mastered' ? '✓' : stop.week}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    stop.status === 'upcoming' ? 'text-gray-400' : 'text-gray-800'
                  } ${stop.status === 'current' ? 'font-semibold' : ''}`}
                >
                  {stop.conceptName}
                  {stop.status === 'strengthening' && (
                    <span className="ml-2 text-xs text-gray-500">— strengthening</span>
                  )}
                </span>
                {stop.status === 'current' && (
                  <span className="text-xs font-medium text-teal-700">you are here</span>
                )}
                {stop.isCheckpoint && <span aria-label="Checkpoint landmark">🌉</span>}
                {stop.isLevelExit && <span aria-label="Level exit landmark">⛰️</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* This week's effort — days shown up, never misses (effort-framed) */}
      {effort && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">This week</h3>
          <div className="mb-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((d) => (
              <span
                key={d}
                aria-label={`Day ${d} ${effort.tiles[d]}`}
                className={`h-3 flex-1 rounded-full ${
                  effort.tiles[d] === 'done'
                    ? 'bg-teal-500'
                    : effort.tiles[d] === 'partial'
                      ? 'bg-teal-300'
                      : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {childName} showed up {effort.daysDone} {effort.daysDone === 1 ? 'day' : 'days'} this week.
          </p>
        </div>
      )}

      {/* Mastered Shelf — owned concepts, by name */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-100/50 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Mastered shelf</h3>
        {shelf.length === 0 ? (
          <p className="text-sm text-gray-500">This shelf is going to fill up — one concept at a time.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {shelf.map((s) => (
              <li
                key={s.week}
                className="rounded-xl bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800"
              >
                {s.conceptName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Warm doorway to the parent-only graded detail */}
      <button
        onClick={() => navigate('/foundry/parent')}
        className="w-full flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3.5 text-left shadow-sm hover:bg-teal-50 transition-colors"
      >
        <span className="text-sm font-semibold text-teal-800">
          See Ms. Wren's weekly reports
        </span>
        <span className="text-teal-600">›</span>
      </button>
    </div>
  )
}
