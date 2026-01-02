interface VisualDisplayProps {
  visualAssets?: string[]
  className?: string
}

const EMOJI_MAP: Record<string, string> = {
  apple: '🍎',
  star: '⭐',
  ball: '⚽',
  flower: '🌸',
  heart: '❤️',
  cat: '🐱',
  dog: '🐶',
  fish: '🐟',
  bird: '🐦',
  tree: '🌳',
  book: '📚',
  pencil: '✏️',
  sun: '☀️',
  moon: '🌙',
  car: '🚗',
  house: '🏠',
  butterfly: '🦋',
  square: '🟦',
  circle: '⭕',
  block: '🟫',
  bead: '🔴',
  sticker: '⭐',
  coin: '🪙',
  dot: '●',
}

const DICE_PATTERNS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
}

function parseVisualAsset(asset: string): { type: string; count: number; pattern?: string } {
  const parts = asset.split('_')
  
  const lastPart = parts[parts.length - 1]
  const count = parseInt(lastPart) || 1
  
  if (parts[0] === 'dots') {
    const pattern = parts.length > 2 ? parts[1] : undefined
    return { type: 'dots', count, pattern }
  }
  
  if (parts[0] === 'objects') {
    return { type: 'mixed', count }
  }
  
  return { type: parts[0], count }
}

function renderObjects(type: string, count: number): JSX.Element {
  const emoji = EMOJI_MAP[type] || '●'
  const items = Array.from({ length: count }, (_, i) => i)
  
  const cols = count <= 3 ? count : count <= 6 ? 3 : count <= 9 ? 3 : 5
  
  return (
    <div 
      className="grid gap-3 justify-center items-center p-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((i) => (
        <span key={i} className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
          {emoji}
        </span>
      ))}
    </div>
  )
}

function renderDots(count: number, pattern?: string): JSX.Element {
  if (count <= 6 && DICE_PATTERNS[count] && pattern !== 'grid') {
    const positions = DICE_PATTERNS[count]
    return (
      <div className="relative w-32 h-32 bg-white rounded-xl border-4 border-gray-300 shadow-lg mx-auto">
        {positions.map(([row, col], i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-gray-800 rounded-full"
            style={{
              top: `${12 + row * 40}%`,
              left: `${12 + col * 40}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    )
  }
  
  const cols = count <= 3 ? count : count <= 6 ? 3 : count <= 9 ? 3 : 5
  const items = Array.from({ length: count }, (_, i) => i)
  
  return (
    <div 
      className="grid gap-2 justify-center items-center p-4 bg-white rounded-xl border-2 border-gray-200 mx-auto"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: 'fit-content',
      }}
    >
      {items.map((i) => (
        <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full shadow-md" />
      ))}
    </div>
  )
}

function renderMixed(count: number): JSX.Element {
  const emojis = Object.values(EMOJI_MAP)
  const items = Array.from({ length: count }, (_, i) => emojis[i % emojis.length])
  
  const cols = count <= 3 ? count : count <= 6 ? 3 : 4
  
  return (
    <div 
      className="grid gap-3 justify-center items-center p-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((emoji, i) => (
        <span key={i} className="text-4xl sm:text-5xl">
          {emoji}
        </span>
      ))}
    </div>
  )
}

export default function VisualDisplay({ visualAssets, className = '' }: VisualDisplayProps) {
  if (!visualAssets || visualAssets.length === 0) {
    return null
  }

  const asset = visualAssets[0]
  const parsed = parseVisualAsset(asset)

  return (
    <div className={`flex justify-center items-center min-h-[120px] ${className}`}>
      {parsed.type === 'dots' ? (
        renderDots(parsed.count, parsed.pattern)
      ) : parsed.type === 'mixed' ? (
        renderMixed(parsed.count)
      ) : (
        renderObjects(parsed.type, parsed.count)
      )}
    </div>
  )
}
