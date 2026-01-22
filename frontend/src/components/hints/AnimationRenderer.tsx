/**
 * AnimationRenderer - Shared component for rendering hint animations
 *
 * Used by both VisualHint and FullTeaching components to render
 * animations based on animationId from the hint generator.
 *
 * PEDAGOGICAL APPROACH:
 * - Visual hints (Level 2): showSolution=false (setup only)
 * - Teaching hints (Level 3): showSolution=true (full solution)
 */

import {
  getAnimationMapping,
  getFallbackAnimation,
  type ProblemData,
} from '@/services/hintAnimationMapping'

export interface AnimationRendererProps {
  /** Animation ID from hint generator */
  animationId?: string
  /** Problem data for the animation */
  problemData?: ProblemData
  /**
   * PEDAGOGICAL: Show solution or setup only
   * - false (default): Shows setup only, prompts thinking
   * - true: Shows full animation with solution
   */
  showSolution?: boolean
  /** Operation type for fallback lookup */
  operation?: string
  /** Additional CSS classes */
  className?: string
  /** Callback when animation completes */
  onComplete?: () => void
}

/**
 * Renders animation component based on animationId
 *
 * Falls back to:
 * 1. Operation-based generic animation
 * 2. Emoji placeholder
 */
export default function AnimationRenderer({
  animationId,
  problemData,
  showSolution = false,
  operation,
  className,
  onComplete,
}: AnimationRendererProps) {
  // Try to get mapped animation by ID
  let mapping = animationId ? getAnimationMapping(animationId) : null

  // If no mapping found, try operation-based fallback
  if (!mapping && operation) {
    mapping = getFallbackAnimation(operation)
  }

  // If still no mapping, render emoji placeholder
  if (!mapping) {
    return (
      <div className={`flex items-center justify-center py-6 ${className || ''}`}>
        <span className="text-6xl" role="img" aria-label="math hint">
          {getPlaceholderEmoji(operation)}
        </span>
      </div>
    )
  }

  const { component: AnimationComponent, defaultProps, isSetup } = mapping

  // Build props for the animation component
  const animationProps = {
    problemData,
    // If this is a setup variant, force showSolution to false
    showSolution: isSetup ? false : showSolution,
    onComplete,
    className,
    ...defaultProps,
  }

  return <AnimationComponent {...animationProps} />
}

/**
 * Get placeholder emoji based on operation type
 */
function getPlaceholderEmoji(operation?: string): string {
  if (!operation) return '🔢'

  const operationLower = operation.toLowerCase()

  const emojiMap: Record<string, string> = {
    'addition': '➕',
    'subtraction': '➖',
    'multiplication': '✖️',
    'division': '➗',
    'counting': '🔢',
    'sequence': '📊',
    'fraction': '🥧',
    'decimal': '🔟',
    'algebra': '🔤',
    'equation': '⚖️',
    'linear': '📈',
    'quadratic': '📉',
    'polynomial': '📐',
    'function': '📊',
    'exponential': '📈',
    'logarithm': '📉',
    'calculus': '∫',
    'limit': '→',
    'derivative': '𝑑',
    'integral': '∫',
    'trigonometry': '📐',
    'trig': '📐',
  }

  // Check for partial matches
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (operationLower.includes(key)) {
      return emoji
    }
  }

  return '🔢'
}
