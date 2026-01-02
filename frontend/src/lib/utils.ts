import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AgeGroup, SessionConfig } from "@/types"

/**
 * Utility for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get age group based on grade level
 */
export function getAgeGroup(gradeLevel: number): AgeGroup {
  if (gradeLevel <= 0) return 'preK'
  if (gradeLevel <= 2) return 'grade1_2'
  return 'grade3_5'
}

/**
 * Get session configuration based on age/grade
 */
export function getSessionConfig(ageGroup: AgeGroup): SessionConfig {
  const configs: Record<AgeGroup, SessionConfig> = {
    preK: {
      ageGroup: 'preK',
      sessionDuration: 10,
      problemsPerSession: 20,
      brainBreakAt: 50,
    },
    grade1_2: {
      ageGroup: 'grade1_2',
      sessionDuration: 15,
      problemsPerSession: 40,
      brainBreakAt: 50,
    },
    grade3_5: {
      ageGroup: 'grade3_5',
      sessionDuration: 20,
      problemsPerSession: 50,
      brainBreakAt: 50,
    },
  }

  return configs[ageGroup]
}

/**
 * Format time in minutes and seconds
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Get operation symbol
 */
export function getOperatorSymbol(operation: string): string {
  const symbols: Record<string, string> = {
    addition: '+',
    subtraction: '−', // Minus sign, not hyphen
    multiplication: '×',
    division: '÷',
  }
  return symbols[operation] || '+'
}

/**
 * Simple delay utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate unique ID (simple version)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Check if dates are the same day
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
