import { useMemo } from 'react'

// Helper to format date as YYYY-MM-DD in local timezone (not UTC)
// Defined outside component for stability
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface PracticeData {
  date: string
  problems_completed: number
  problems_correct: number
}

interface DailyPracticeChartProps {
  data: PracticeData[]
}

export default function DailyPracticeChart({ data }: DailyPracticeChartProps) {

  // Process data for last 30 days
  const chartData = useMemo(() => {
    const today = new Date()
    const days = []

    // DEBUG: Log received data
    console.log('📈 Chart received data:', data)

    // Create array of last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Use local date format to avoid timezone shift issues
      const dateStr = formatLocalDate(date)

      // Find data for this date
      const dayData = data.find(d => d.date === dateStr)

      // DEBUG: Log matches for today (i=0)
      if (i === 0) {
        console.log('📈 Today check:', { dateStr, dayData, dataKeys: data.map(d => d.date) })
      }

      days.push({
        date: dateStr,
        dayLabel: date.getDate().toString(),
        monthLabel: i === 29 || date.getDate() === 1
          ? date.toLocaleDateString('en-US', { month: 'short' })
          : '',
        completed: dayData?.problems_completed || 0,
        correct: dayData?.problems_correct || 0,
        incorrect: (dayData?.problems_completed || 0) - (dayData?.problems_correct || 0)
      })
    }

    return days
  }, [data])

  // Calculate max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.completed), 10)

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Daily Practice Activity (Last 30 Days)</h3>

      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute -left-12 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="pl-2">
          <div className="flex gap-1 h-48 border-b border-gray-300">
            {chartData.map((day) => {
              const totalHeight = (day.completed / maxValue) * 100
              const correctHeight = (day.correct / maxValue) * 100
              const incorrectHeight = (day.incorrect / maxValue) * 100

              return (
                <div key={day.date} className="flex-1 h-full flex flex-col items-center justify-end relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      <br />
                      Total: {day.completed}
                      <br />
                      Correct: {day.correct}
                      {day.incorrect > 0 && (
                        <>
                          <br />
                          Incorrect: {day.incorrect}
                        </>
                      )}
                    </div>
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                  </div>

                  {/* Bars */}
                  <div className="w-full flex flex-col" style={{ height: `${totalHeight}%` }}>
                    {day.incorrect > 0 && (
                      <div
                        className="bg-red-400 w-full transition-all duration-300 hover:bg-red-500"
                        style={{ height: `${(incorrectHeight / totalHeight) * 100}%` }}
                      />
                    )}
                    {day.correct > 0 && (
                      <div
                        className="bg-green-500 w-full transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${(correctHeight / totalHeight) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1 pt-1">
            {chartData.map((day, index) => (
              <div key={day.date} className="flex-1 text-center">
                {day.monthLabel && (
                  <div className="text-xs text-gray-600 font-medium">{day.monthLabel}</div>
                )}
                {(index % 5 === 0 || index === chartData.length - 1) && (
                  <div className="text-xs text-gray-500">{day.dayLabel}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-xs text-gray-600">Incorrect</span>
        </div>
      </div>
    </div>
  )
}