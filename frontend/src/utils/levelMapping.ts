import type { KumonLevel } from '@/types'

/**
 * Maps school grade level to appropriate Kumon starting level
 * Based on official Kumon progression document
 *
 * @param gradeLevel - School grade (0 = Kindergarten, 1 = 1st grade, etc.)
 * @returns Appropriate Kumon level for that grade
 */
export function getInitialLevelForGrade(gradeLevel: number): KumonLevel {
  // Map based on official Kumon progression:
  // Reference: /home/usthr/Penta_University/Math_Tutor/Requirements/06-KUMON-OFFICIAL-PROGRESSION.md

  switch (gradeLevel) {
    case -2: // Pre-K (Age 3-4)
      return '7A' // Counting to 10

    case -1: // Pre-K+ (Age 4-5)
      return '6A' // Number Recognition to 30

    case 0: // Kindergarten
      return '4A' // Writing numbers to 50 (Ages 5-6)

    case 1: // 1st Grade
      return '2A' // Adding 4 through 10 (Ages 6-7)

    case 2: // 2nd Grade
      return 'B'  // Vertical operations & regrouping (Ages 7-8)

    case 3: // 3rd Grade
      return 'C'  // Multiplication & division (Ages 8-9)

    case 4: // 4th Grade
      return 'D'  // Long division & fractions intro (Ages 9-10)

    case 5: // 5th Grade
      return 'E'  // Fraction operations (Ages 10-11)

    case 6: // 6th Grade
      return 'F'  // Decimals & order of operations (Ages 11-12)

    default:
      // For grades above 6th or invalid inputs, default to level F
      // Could extend to G, H, etc. for higher grades if needed
      return gradeLevel > 6 ? 'F' : '7A'
  }
}

/**
 * Gets a descriptive label for what a Kumon level covers
 * Useful for showing parents/students what they'll be learning
 */
export function getLevelDescription(level: KumonLevel): string {
  const descriptions: Record<KumonLevel, string> = {
    '7A': 'Counting to 10',
    '6A': 'Counting to 30',
    '5A': 'Reading numbers to 50',
    '4A': 'Writing numbers to 50',
    '3A': 'Addition +1, +2, +3',
    '2A': 'Addition +4 through +10',
    'A': 'Subtraction basics',
    'B': '2-digit operations with regrouping',
    'C': 'Multiplication & division',
    'D': 'Long division & fractions intro',
    'E': 'Fraction operations',
    'F': 'Decimals & order of operations',
    'G': 'Positive & negative numbers',
    'H': 'Introduction to algebra',
    'I': 'Factorization & square roots',
    'J': 'Advanced algebra',
    'K': 'Functions',
    'L': 'Logarithms',
    'M': 'Trigonometry',
    'N': 'Advanced trigonometry',
    'O': 'Calculus',
    'XV': 'Vectors',
    'XM': 'Matrices & Transformations',
    'XP': 'Permutations, Combinations & Probability',
    'XS': 'Statistics'
  }

  return descriptions[level] || 'Math practice'
}

/**
 * Gets the appropriate worksheet number for a new student
 * Most students start at worksheet 1, but could be adjusted
 * based on assessment or teacher recommendation
 */
export function getInitialWorksheetNumber(_level: KumonLevel, _gradeLevel: number): number {
  // For now, all students start at worksheet 1 of their level
  // This ensures they build a strong foundation
  // Could be enhanced to start at different points based on assessment
  return 1
}