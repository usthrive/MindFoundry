/**
 * Video Categories Configuration
 * Defines the math topic categories for the Video Library
 * Each category maps to specific Kumon levels
 *
 * IMPORTANT: Level mappings based on Kumon curriculum:
 * - 7A-5A: Counting and number recognition
 * - 4A: Writing numbers (NOT math operations!)
 * - 3A: FIRST addition (+1, +2, +3 only)
 * - 2A: Addition +4 through +10
 * - A: FIRST subtraction (single-digit)
 * - B: FIRST 2-digit operations (carrying/borrowing)
 * - C: Multiplication & Division
 * - D: Long division, Fractions intro
 * - E: Fraction operations
 * - F: Decimals, PEMDAS
 * - G-H: Pre-algebra, equations
 * - I-J: Algebra (quadratics, polynomials)
 * - K-L: Trigonometry, logarithms
 * - M-N: Pre-calculus, advanced functions
 * - O: Calculus (derivatives, integrals)
 */

export interface VideoCategory {
  id: string
  icon: string
  label: string
  color: string
  levels: string[]  // Kumon levels that belong to this category
  levelRange: string  // Display string for level range (e.g., "7A-5A")
  description: string  // Child-friendly description
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'counting',
    icon: '🔢',
    label: 'Counting',
    color: '#3B82F6', // blue-500
    levels: ['7A', '6A', '5A'],
    levelRange: '7A-5A',
    description: 'Learn to count numbers!'
  },
  {
    id: 'addition',
    icon: '➕',
    label: 'Adding',
    color: '#22C55E', // green-500
    levels: ['3A', '2A', 'A', 'B'],  // 4A removed - 4A is writing numbers, not math
    levelRange: '3A-B',
    description: 'Put numbers together!'
  },
  {
    id: 'subtraction',
    icon: '➖',
    label: 'Taking Away',
    color: '#F97316', // orange-500
    levels: ['A', 'B'],  // Subtraction starts at Level A, not 4A!
    levelRange: 'A-B',
    description: 'Take numbers away!'
  },
  {
    id: 'multiplication',
    icon: '✖️',
    label: 'Times Tables',
    color: '#A855F7', // purple-500
    levels: ['C'],
    levelRange: 'C',
    description: 'Multiply numbers together!'
  },
  {
    id: 'division',
    icon: '➗',
    label: 'Dividing',
    color: '#EC4899', // pink-500
    levels: ['C', 'D'],
    levelRange: 'C-D',
    description: 'Share numbers equally!'
  },
  {
    id: 'fractions',
    icon: '🥧',
    label: 'Fractions',
    color: '#14B8A6', // teal-500
    levels: ['D', 'E'],
    levelRange: 'D-E',
    description: 'Learn about parts of a whole!'
  },
  {
    id: 'equations',
    icon: '⚖️',
    label: 'Solving Puzzles',
    color: '#EF4444', // red-500
    levels: ['F', 'G', 'H'],
    levelRange: 'F-H',
    description: 'Find the missing numbers!'
  },
  {
    id: 'algebra',
    icon: '🔤',
    label: 'Letters & Numbers',
    color: '#6366F1', // indigo-500
    levels: ['I', 'J'],
    levelRange: 'I-J',
    description: 'Use letters in math!'
  },
  {
    id: 'trigonometry',
    icon: '📐',
    label: 'Triangles & Angles',
    color: '#0EA5E9', // sky-500
    levels: ['K', 'L'],
    levelRange: 'K-L',
    description: 'Explore triangles and waves!'
  },
  {
    id: 'precalculus',
    icon: '📈',
    label: 'Advanced Functions',
    color: '#8B5CF6', // violet-500
    levels: ['M', 'N'],
    levelRange: 'M-N',
    description: 'Master complex patterns!'
  },
  {
    id: 'calculus',
    icon: '∫',
    label: 'Calculus',
    color: '#DC2626', // red-600
    levels: ['O'],
    levelRange: 'O',
    description: 'Discover rates of change!'
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
