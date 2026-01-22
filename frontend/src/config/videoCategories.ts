/**
 * Video Categories Configuration
 * Defines the math topic categories for the Video Library
 * Each category maps to specific Kumon levels
 */

export interface VideoCategory {
  id: string
  icon: string
  label: string
  color: string
  levels: string[]  // Kumon levels that belong to this category
  description: string  // Child-friendly description
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'counting',
    icon: '🔢',
    label: 'Counting',
    color: '#3B82F6', // blue-500
    levels: ['7A', '6A', '5A'],
    description: 'Learn to count numbers!'
  },
  {
    id: 'addition',
    icon: '➕',
    label: 'Adding',
    color: '#22C55E', // green-500
    levels: ['4A', '3A', '2A', 'A', 'B'],
    description: 'Put numbers together!'
  },
  {
    id: 'subtraction',
    icon: '➖',
    label: 'Taking Away',
    color: '#F97316', // orange-500
    levels: ['4A', '3A', '2A', 'A', 'B'],
    description: 'Take numbers away!'
  },
  {
    id: 'multiplication',
    icon: '✖️',
    label: 'Times Tables',
    color: '#A855F7', // purple-500
    levels: ['C'],
    description: 'Multiply numbers together!'
  },
  {
    id: 'division',
    icon: '➗',
    label: 'Dividing',
    color: '#EC4899', // pink-500
    levels: ['C', 'D'],
    description: 'Share numbers equally!'
  },
  {
    id: 'fractions',
    icon: '🥧',
    label: 'Fractions',
    color: '#14B8A6', // teal-500
    levels: ['D', 'E'],
    description: 'Learn about parts of a whole!'
  },
  {
    id: 'equations',
    icon: '⚖️',
    label: 'Solving Puzzles',
    color: '#EF4444', // red-500
    levels: ['F', 'G', 'H'],
    description: 'Find the missing numbers!'
  },
  {
    id: 'algebra',
    icon: '🔤',
    label: 'Letters & Numbers',
    color: '#6366F1', // indigo-500
    levels: ['I', 'J'],
    description: 'Use letters in math!'
  },
]

/**
 * Get a category by ID
 */
export function getCategoryById(categoryId: string): VideoCategory | undefined {
  return VIDEO_CATEGORIES.find(cat => cat.id === categoryId)
}

/**
 * Get category for a given Kumon level
 */
export function getCategoriesForLevel(level: string): VideoCategory[] {
  return VIDEO_CATEGORIES.filter(cat => cat.levels.includes(level))
}

/**
 * Get the minimum level required to unlock a category
 * (the first level in the category's levels array)
 */
export function getCategoryUnlockLevel(categoryId: string): string | null {
  const category = getCategoryById(categoryId)
  if (!category || category.levels.length === 0) return null
  return category.levels[0]
}
