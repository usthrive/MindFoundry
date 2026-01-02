import { useState } from 'react'
import type { MatchingData } from '@/services/generators/types'

const EMOJI_MAP: Record<string, string> = {
  apple: '🍎',
  star: '⭐',
  ball: '⚽',
  flower: '🌸',
  heart: '❤️',
  butterfly: '🦋',
  fish: '🐟',
  bird: '🐦',
  cat: '🐱',
  dog: '🐶',
}

interface MatchingProblemProps {
  matchingData: MatchingData
  onComplete?: (matches: Record<string, number>) => void
  disabled?: boolean
  showFeedback?: boolean
}

export default function MatchingProblem({
  matchingData,
  onComplete,
  disabled = false,
  showFeedback = false,
}: MatchingProblemProps) {
  const [matches, setMatches] = useState<Record<string, number>>({})
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  const { items, options } = matchingData

  const handleItemClick = (itemId: string) => {
    if (disabled) return

    if (selectedNumber !== null) {
      // Complete the match
      const newMatches = { ...matches, [itemId]: selectedNumber }
      setMatches(newMatches)
      setSelectedItem(null)
      setSelectedNumber(null)

      // Check if all items are matched
      if (Object.keys(newMatches).length === items.length) {
        onComplete?.(newMatches)
      }
    } else {
      setSelectedItem(itemId === selectedItem ? null : itemId)
    }
  }

  const handleNumberClick = (num: number) => {
    if (disabled) return

    if (selectedItem !== null) {
      // Complete the match
      const newMatches = { ...matches, [selectedItem]: num }
      setMatches(newMatches)
      setSelectedItem(null)
      setSelectedNumber(null)

      // Check if all items are matched
      if (Object.keys(newMatches).length === items.length) {
        onComplete?.(newMatches)
      }
    } else {
      setSelectedNumber(num === selectedNumber ? null : num)
    }
  }

  const clearMatch = (itemId: string) => {
    if (disabled) return
    const newMatches = { ...matches }
    delete newMatches[itemId]
    setMatches(newMatches)
  }

  const isNumberUsed = (num: number) => Object.values(matches).includes(num)

  const getMatchStatus = (itemId: string): 'correct' | 'incorrect' | 'neutral' => {
    if (!showFeedback) return 'neutral'
    const item = items.find(i => i.id === itemId)
    if (!item || matches[itemId] === undefined) return 'neutral'
    return matches[itemId] === item.count ? 'correct' : 'incorrect'
  }

  const renderObjects = (visual: string, count: number) => {
    const emoji = EMOJI_MAP[visual] || '●'
    const cols = count <= 3 ? count : count <= 6 ? 3 : 4

    return (
      <div
        className="grid gap-1 justify-center items-center p-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="text-2xl sm:text-3xl">
            {emoji}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="text-lg font-semibold text-gray-700">
        Count each group and match it to the correct number
      </p>

      <div className="flex flex-col sm:flex-row gap-8 items-start justify-center">
        {/* Left side: Object groups */}
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const isSelected = selectedItem === item.id
            const isMatched = matches[item.id] !== undefined
            const status = getMatchStatus(item.id)

            return (
              <div key={item.id} className="flex items-center gap-3">
                <button
                  onClick={() => isMatched ? clearMatch(item.id) : handleItemClick(item.id)}
                  disabled={disabled}
                  className={`
                    relative min-w-[120px] p-3 rounded-xl border-3 transition-all duration-200
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                      : isMatched
                        ? status === 'correct'
                          ? 'border-green-500 bg-green-50'
                          : status === 'incorrect'
                            ? 'border-red-500 bg-red-50'
                            : 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                    }
                    ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                  `}
                >
                  {renderObjects(item.visual, item.count)}
                </button>

                {/* Match indicator / connector line */}
                <div className="flex items-center gap-2">
                  {isMatched && (
                    <>
                      <div className="w-8 h-0.5 bg-gray-400" />
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                          ${status === 'correct'
                            ? 'bg-green-500 text-white'
                            : status === 'incorrect'
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white'
                          }
                        `}
                      >
                        {matches[item.id]}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right side: Number options */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500 text-center mb-2">Tap a number:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {options.map((num) => {
              const isSelected = selectedNumber === num
              const isUsed = isNumberUsed(num)

              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={disabled || isUsed}
                  className={`
                    w-14 h-14 rounded-full font-bold text-xl border-3 transition-all duration-200
                    ${isSelected
                      ? 'border-purple-500 bg-purple-500 text-white scale-110 shadow-lg'
                      : isUsed
                        ? 'border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-400 bg-white text-gray-800 hover:border-purple-400 hover:bg-purple-50'
                    }
                  `}
                >
                  {num}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-500 text-center max-w-md">
        {selectedItem
          ? 'Now tap the number that matches'
          : selectedNumber
            ? 'Now tap the group with that many objects'
            : 'Tap a group of objects, then tap its matching number'
        }
      </p>
    </div>
  )
}
