import { useState } from 'react'
import { getLevelConfig } from '@/data/levelConfig'
import type { KumonLevel } from '@/types'

interface ConceptRoadmapProps {
  level: KumonLevel
  currentWorksheet: number
  onJumpToWorksheet: (worksheet: number) => void
}

export default function ConceptRoadmap({ level, currentWorksheet, onJumpToWorksheet }: ConceptRoadmapProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const levelConfig = getLevelConfig(level)

  if (!levelConfig) return null

  const { worksheetRanges, description, gradeRange, sct } = levelConfig
  const conceptCount = worksheetRanges.length

  // Find current concept index for highlighting
  const currentConceptIndex = worksheetRanges.findIndex(
    range => currentWorksheet >= range.start && currentWorksheet <= range.end
  )

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📚</span>
          <span className="font-medium text-gray-700">
            Concept Roadmap
          </span>
          <span className="text-sm text-gray-500">
            ({conceptCount} concepts)
          </span>
        </div>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Level Info Header */}
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <h3 className="font-semibold text-blue-900">
              Level {level} - {description}
            </h3>
            <p className="text-sm text-blue-700">
              Grade: {gradeRange} | Standard Time: {sct}
            </p>
          </div>

          {/* Concept List */}
          <div className="max-h-64 overflow-y-auto">
            {worksheetRanges.map((range, index) => {
              const isCurrent = index === currentConceptIndex
              const isCompleted = currentWorksheet > range.end

              return (
                <div
                  key={`${range.start}-${range.end}`}
                  className={`flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-b-0 ${
                    isCurrent
                      ? 'bg-yellow-50 border-l-4 border-l-yellow-400'
                      : isCompleted
                      ? 'bg-green-50/50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Status indicator */}
                    <span className="flex-shrink-0">
                      {isCurrent ? '📍' : isCompleted ? '✓' : '○'}
                    </span>

                    {/* Worksheet range */}
                    <span className="text-sm font-mono text-gray-500 w-16 flex-shrink-0">
                      {range.start}-{range.end}
                    </span>

                    {/* Concept description */}
                    <span className={`text-sm truncate ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {range.description}
                    </span>
                  </div>

                  {/* Jump button */}
                  <button
                    onClick={() => onJumpToWorksheet(range.start)}
                    className={`ml-2 px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
                      isCurrent
                        ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={`Jump to worksheet ${range.start}`}
                  >
                    Go →
                  </button>
                </div>
              )
            })}
          </div>

          {/* Footer with current position */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
            Currently on worksheet {currentWorksheet}
            {currentConceptIndex >= 0 && (
              <> • {worksheetRanges[currentConceptIndex].description}</>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
