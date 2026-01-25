import type { KumonLevel } from '@/types'

/**
 * Grade levels for registration and profile forms
 * Supports Pre-K (-2) through 12th grade (12)
 */
export const GRADE_LEVELS = [
  { value: -2, label: 'Pre-K (Age 3-4)' },
  { value: -1, label: 'Pre-K+ (Age 4-5)' },
  { value: 0, label: 'Kindergarten' },
  { value: 1, label: '1st Grade' },
  { value: 2, label: '2nd Grade' },
  { value: 3, label: '3rd Grade' },
  { value: 4, label: '4th Grade' },
  { value: 5, label: '5th Grade' },
  { value: 6, label: '6th Grade' },
  { value: 7, label: '7th Grade' },
  { value: 8, label: '8th Grade' },
  { value: 9, label: '9th Grade' },
  { value: 10, label: '10th Grade' },
  { value: 11, label: '11th Grade' },
  { value: 12, label: '12th Grade' },
]

/**
 * Age limits for student registration
 * Supports ages 3-18 (Pre-K through high school)
 */
export const AGE_LIMITS = {
  min: 3,
  max: 18,
}

/**
 * Kumon levels for dropdown selection in forms
 * Covers all levels from 7A (Pre-K) through O (Calculus)
 */
export const KUMON_LEVELS_DROPDOWN: { value: KumonLevel; label: string }[] = [
  // Pre-K through Elementary
  { value: '7A', label: '7A - Counting to 10' },
  { value: '6A', label: '6A - Number Recognition' },
  { value: '5A', label: '5A - Number Sequences' },
  { value: '4A', label: '4A - Writing Numbers' },
  { value: '3A', label: '3A - Addition +1, +2, +3' },
  { value: '2A', label: '2A - Addition +4 to +10' },
  { value: 'A', label: 'A - Subtraction Basics' },
  { value: 'B', label: 'B - 2-Digit Operations' },
  { value: 'C', label: 'C - Multiplication & Division' },
  { value: 'D', label: 'D - Long Division & Fractions' },
  { value: 'E', label: 'E - Fraction Operations' },
  { value: 'F', label: 'F - Decimals & Order of Ops' },
  // Middle School
  { value: 'G', label: 'G - Positive & Negative Numbers' },
  { value: 'H', label: 'H - Introduction to Algebra' },
  { value: 'I', label: 'I - Factorization & Square Roots' },
  // High School
  { value: 'J', label: 'J - Advanced Algebra' },
  { value: 'K', label: 'K - Functions' },
  { value: 'L', label: 'L - Logarithms' },
  { value: 'M', label: 'M - Trigonometry' },
  { value: 'N', label: 'N - Advanced Trigonometry' },
  { value: 'O', label: 'O - Calculus' },
]
