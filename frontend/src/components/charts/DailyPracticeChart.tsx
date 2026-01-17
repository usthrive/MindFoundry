import { useMemo } from 'react'

// Helper to format date as YYYY-MM-DD in local timezone (not UTC)
// Defined outside component for stability
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Support both old format and new detailed format
interface LegacyPracticeData {
  date: string
  problems_completed: number
  problems_correct: number
}

interface DetailedPracticeData {
  date: string
  firstTryCorrect: number
  withHintsCorrect: number
  incorrect: number
  total: number
}

type PracticeData = LegacyPracticeData | DetailedPracticeData

interface DailyPracticeChartProps {
  data: PracticeData[]
}

// Type guard to check if data is detailed format
function isDetailedData(item: PracticeData): item is DetailedPracticeData {
  return 'firstTryCorrect' in item
}

export default function DailyPracticeChart({ data }: DailyPracticeChartProps) {
  // Debug: Log what data we're receiving
  console.log('📊 DailyPracticeChart received data:', data)
  console.log('📊 First item:', data[0])
  console.log('📊 Is detailed?:', data.length > 0 && isDetailedData(data[0]))

  // Process data for last 30 days
  const chartData = useMemo(() => {
    const today = new Date()
    const days = []

    // Check if we have detailed data
    const hasDetailedData = data.length > 0 && isDetailedData(data[0])

    // Create array of last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Use local date format to avoid timezone shift issues
      const dateStr = formatLocalDate(date)

      // Find data for this date
      const dayData = data.find(d => d.date === dateStr)

      if (hasDetailedData && dayData && isDetailedData(dayData)) {
        // Detailed format with first-try/hints/incorrect breakdown
        days.push({
          date: dateStr,
          dayLabel: date.getDate().toString(),
          monthLabel: i === 29 || date.getDate() === 1
            ? date.toLocaleDateString('en-US', { month: 'short' })
            : '',
          firstTryCorrect: dayData.firstTryCorrect,
          withHintsCorrect: dayData.withHintsCorrect,
          incorrect: dayData.incorrect,
          total: dayData.total
        })
      } else if (dayData && !isDetailedData(dayData)) {
        // Legacy format - treat all correct as "first try" for backwards compat
        const completed = dayData.problems_completed || 0
        const correct = dayData.problems_correct || 0
        days.push({
          date: dateStr,
          dayLabel: date.getDate().toString(),
          monthLabel: i === 29 || date.getDate() === 1
            ? date.toLocaleDateString('en-US', { month: 'short' })
            : '',
          firstTryCorrect: correct,
          withHintsCorrect: 0,
          incorrect: completed - correct,
          total: completed
        })
      } else {
        // No data for this day
        days.push({
          date: dateStr,
          dayLabel: date.getDate().toString(),
          monthLabel: i === 29 || date.getDate() === 1
            ? date.toLocaleDateString('en-US', { month: 'short' })
            : '',
          firstTryCorrect: 0,
          withHintsCorrect: 0,
          incorrect: 0,
          total: 0
        })
      }
    }

    return days
  }, [data])

  // Calculate max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.total), 10)

  return (
    <div className="w-full">
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute -left-8 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="pl-2">
          <div className="flex gap-0.5 h-40 border-b border-gray-300">
            {chartData.map((day) => {
              const totalHeight = day.total > 0 ? (day.total / maxValue) * 100 : 0
              const firstTryPct = day.total > 0 ? (day.firstTryCorrect / day.total) * 100 : 0
              const hintsPct = day.total > 0 ? (day.withHintsCorrect / day.total) * 100 : 0
              const incorrectPct = day.total > 0 ? (day.incorrect / day.total) * 100 : 0

              return (
                <div key={day.date} className="flex-1 h-full flex flex-col items-center justify-end relative group">
                  {/* Tooltip */}
                  {day.total > 0 && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                        <br />
                        Total: {day.total}
                        {day.firstTryCorrect > 0 && (
                          <>
                            <br />
                            <span className="text-emerald-400">✅ First-try: {day.firstTryCorrect}</span>
                          </>
                        )}
                        {day.withHintsCorrect > 0 && (
                          <>
                            <br />
                            <span className="text-blue-400">🔄 With hints: {day.withHintsCorrect}</span>
                          </>
                        )}
                        {day.incorrect > 0 && (
                          <>
                            <br />
                            <span className="text-red-400">❌ Incorrect: {day.incorrect}</span>
                          </>
                        )}
                      </div>
                      <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                    </div>
                  )}

                  {/* Stacked bars - incorrect on top, then hints, then first-try at bottom */}
                  <div className="w-full flex flex-col" style={{ height: `${totalHeight}%` }}>
                    {day.incorrect > 0 && (
                      <div
                        className="bg-red-400 w-full transition-all duration-300 hover:bg-red-500"
                        style={{ height: `${incorrectPct}%` }}
                      />
                    )}
                    {day.withHintsCorrect > 0 && (
                      <div
                        className="bg-blue-500 w-full transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${hintsPct}%` }}
                      />
                    )}
                    {day.firstTryCorrect > 0 && (
                      <div
                        className="bg-emerald-500 w-full transition-all duration-300 hover:bg-emerald-600"
                        style={{ height: `${firstTryPct}%` }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-0.5 pt-1">
            {chartData.map((day, index) => (
              <div key={day.date} className="flex-1 text-center">
                {day.monthLabel && (
                  <div className="text-xs text-gray-600 font-medium">{day.monthLabel}</div>
                )}
                {(index % 7 === 0 || index === chartData.length - 1) && (
                  <div className="text-xs text-gray-500">{day.dayLabel}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-center mt-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded"></div>
          <span className="text-xs text-gray-600">First-try</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">With hints</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-400 rounded"></div>
          <span className="text-xs text-gray-600">Incorrect</span>
        </div>
      </div>
    </div>
  )
}
