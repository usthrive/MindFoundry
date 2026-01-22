/**
 * Hint Animation Mapping Service
 *
 * Centralized mapping from animationId strings (used in hintGenerator.ts)
 * to React animation components.
 *
 * DESIGN PRINCIPLES:
 * - Centralized: Single source of truth for all hint animation mappings
 * - Maintainable: Easy to add new animations without modifying multiple files
 * - Fallback chain: Graceful degradation when animation not found
 *
 * PEDAGOGICAL APPROACH:
 * - Visual hints (Level 2): Use '-setup' variants with showSolution=false
 * - Teaching hints (Level 3): Use full animations with showSolution=true
 */

import { ComponentType } from 'react'
import type { BaseAnimationProps, ProblemData } from '@/components/animations/core/types'

// Import all animation components
import {
  // MVP (Levels 7A-B)
  NumberLineAnimation,
  CountingObjectsAnimation,
  TenFrameAnimation,
  PlaceValueAnimation,
  SequenceAnimation,
  // Elementary (Levels C-F)
  ArrayGroupsAnimation,
  FairSharingAnimation,
  LongDivisionStepsAnimation,
  FractionBarAnimation,
  FractionOperationAnimation,
  // Algebra (Levels G-H)
  BalanceScaleAnimation,
  AlgebraTilesAnimation,
  CoordinatePlotAnimation,
  // Quadratics (Level I)
  FOILAnimation,
  FactoringAnimation,
  ParabolaAnimation,
  QuadraticFormulaAnimation,
  // Advanced Algebra (Level J)
  ComplexPlaneAnimation,
  PolynomialDivisionAnimation,
  AdvancedFactoringAnimation,
  DiscriminantAnimation,
  ProofStepsAnimation,
  // Functions (Level K)
  FunctionTransformAnimation,
  RationalFunctionAnimation,
  IrrationalFunctionAnimation,
  ExponentialLogAnimation,
  // Calculus (Level L)
  LimitAnimation,
  DerivativeAnimation,
  IntegrationAnimation,
  OptimizationAnimation,
  // Trigonometry (Level M)
  UnitCircleAnimation,
  TrigGraphAnimation,
  TriangleTrigAnimation,
  // Sequences (Level N)
  SequenceSeriesAnimation,
  RecurrenceInductionAnimation,
  AdvancedDifferentiationAnimation,
  // Advanced Calculus (Level O)
  CurveAnalysisAnimation,
  IntegrationMethodsAnimation,
  VolumeRevolutionAnimation,
} from '@/components/animations'

// ============================================
// TYPES
// ============================================

/**
 * Animation mapping entry with component and default props
 */
export interface AnimationMapping {
  /** The React component to render */
  component: ComponentType<BaseAnimationProps & Record<string, unknown>>
  /** Default props to pass to the component */
  defaultProps?: Record<string, unknown>
  /**
   * Whether this is a "setup" animation (shows setup, not solution)
   * When true, showSolution will be forced to false
   */
  isSetup?: boolean
}

// ============================================
// CENTRALIZED ANIMATION MAPPING
// ============================================

/**
 * Maps animationId strings to their React components
 *
 * NAMING CONVENTION:
 * - '{type}' = full animation with solution
 * - '{type}-setup' = setup only, no solution (for visual hints)
 * - '{type}-demo' = teaching demonstration variant
 */
export const HINT_ANIMATION_MAP: Record<string, AnimationMapping> = {
  // ============================================
  // NUMBER LINE ANIMATIONS (Levels 3A-A)
  // ============================================
  'number-line-addition': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: false },
  },
  'number-line-setup': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: false },
    isSetup: true,
  },
  'number-line-subtraction': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: true },
  },
  'number-line-setup-subtraction': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: true },
    isSetup: true,
  },
  'addition-counting-on': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: false },
  },
  'addition-to-20': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: false },
  },
  'subtraction-count-back': {
    component: NumberLineAnimation,
    defaultProps: { isSubtraction: true },
  },

  // ============================================
  // COUNTING ANIMATIONS (Levels 7A-4A)
  // ============================================
  'counting-objects': {
    component: CountingObjectsAnimation,
  },
  'counting-objects-setup': {
    component: CountingObjectsAnimation,
    isSetup: true,
  },
  'counting-demonstration': {
    component: CountingObjectsAnimation,
  },
  'addition-counting-all': {
    component: CountingObjectsAnimation,
  },
  'objects-setup-subtraction': {
    component: CountingObjectsAnimation,
    defaultProps: { showGroups: true },
    isSetup: true,
  },
  'take-away': {
    component: CountingObjectsAnimation,
    defaultProps: { showGroups: true },
  },
  'dot-pattern': {
    component: CountingObjectsAnimation,
    defaultProps: { objectEmoji: '⚫' },
  },
  'dot-pattern-setup': {
    component: CountingObjectsAnimation,
    defaultProps: { objectEmoji: '⚫' },
    isSetup: true,
  },

  // ============================================
  // SEQUENCE ANIMATIONS (Levels 5A-3A)
  // ============================================
  'sequence': {
    component: SequenceAnimation,
  },
  'sequence-setup': {
    component: SequenceAnimation,
    isSetup: true,
  },
  'sequence-pattern': {
    component: SequenceAnimation,
  },

  // ============================================
  // TEN FRAME / MAKE-10 ANIMATIONS (Level 2A)
  // ============================================
  'ten-frame': {
    component: TenFrameAnimation,
  },
  'make-10-setup': {
    component: TenFrameAnimation,
    defaultProps: { showMake10: true },
    isSetup: true,
  },
  'addition-make-10': {
    component: TenFrameAnimation,
    defaultProps: { showMake10: true },
  },

  // ============================================
  // PLACE VALUE / REGROUPING ANIMATIONS (Level B)
  // ============================================
  'base-10-blocks': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition' },
  },
  'place-value': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition' },
  },
  'place-value-setup': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition' },
    isSetup: true,
  },
  'carrying-setup': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition', showRegrouping: true },
    isSetup: true,
  },
  'borrowing-setup': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'subtraction', showRegrouping: true },
    isSetup: true,
  },
  'vertical-addition-setup': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition' },
    isSetup: true,
  },
  'vertical-subtraction-setup': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'subtraction' },
    isSetup: true,
  },
  'vertical-addition-with-carry': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'addition', showRegrouping: true },
  },
  'vertical-subtraction-with-borrow': {
    component: PlaceValueAnimation,
    defaultProps: { operationType: 'subtraction', showRegrouping: true },
  },

  // ============================================
  // MULTIPLICATION ANIMATIONS (Level C+)
  // ============================================
  'array-groups': {
    component: ArrayGroupsAnimation,
  },
  'array-setup': {
    component: ArrayGroupsAnimation,
    isSetup: true,
  },
  'grouping-multiplication': {
    component: ArrayGroupsAnimation,
  },
  'area-model': {
    component: ArrayGroupsAnimation,
  },
  'area-model-setup': {
    component: ArrayGroupsAnimation,
    isSetup: true,
  },
  'multiplication-array': {
    component: ArrayGroupsAnimation,
  },
  'multiplication-repeated-addition': {
    component: ArrayGroupsAnimation,
  },

  // ============================================
  // DIVISION ANIMATIONS (Level C+)
  // ============================================
  'fair-sharing': {
    component: FairSharingAnimation,
  },
  'fair-sharing-setup': {
    component: FairSharingAnimation,
    isSetup: true,
  },
  'division-grouping': {
    component: FairSharingAnimation,
  },
  'division-grouping-setup': {
    component: FairSharingAnimation,
    isSetup: true,
  },
  'long-division-steps': {
    component: LongDivisionStepsAnimation,
  },
  'long-division-setup': {
    component: LongDivisionStepsAnimation,
    isSetup: true,
  },

  // ============================================
  // FRACTION ANIMATIONS (Level D+)
  // ============================================
  'fraction-bar': {
    component: FractionBarAnimation,
  },
  'fraction-bar-setup': {
    component: FractionBarAnimation,
    isSetup: true,
  },
  'fraction-circle': {
    component: FractionBarAnimation,
    defaultProps: { variant: 'circle' },
  },
  'fraction-operation': {
    component: FractionOperationAnimation,
  },
  'fraction-addition': {
    component: FractionOperationAnimation,
    defaultProps: { operation: 'addition' },
  },
  'fraction-subtraction': {
    component: FractionOperationAnimation,
    defaultProps: { operation: 'subtraction' },
  },
  'fraction-multiply': {
    component: FractionOperationAnimation,
    defaultProps: { operation: 'multiplication' },
  },
  'fraction-divide': {
    component: FractionOperationAnimation,
    defaultProps: { operation: 'division' },
  },
  'equivalent-fractions': {
    component: FractionBarAnimation,
  },
  'fraction-same-denom-setup': {
    component: FractionBarAnimation,
    isSetup: true,
  },
  'fraction-comparison': {
    component: FractionBarAnimation,
  },

  // ============================================
  // ALGEBRA ANIMATIONS (Levels G-H)
  // ============================================
  'algebra-tiles': {
    component: AlgebraTilesAnimation,
  },
  'algebra-tiles-setup': {
    component: AlgebraTilesAnimation,
    isSetup: true,
  },
  'balance-scale': {
    component: BalanceScaleAnimation,
  },
  'balance-scale-setup': {
    component: BalanceScaleAnimation,
    isSetup: true,
  },
  'number-line-algebra': {
    component: NumberLineAnimation,
  },
  'coordinate-plot': {
    component: CoordinatePlotAnimation,
  },
  'coordinate-plot-setup': {
    component: CoordinatePlotAnimation,
    isSetup: true,
  },
  'linear-equation': {
    component: BalanceScaleAnimation,
  },
  'linear-equation-setup': {
    component: BalanceScaleAnimation,
    isSetup: true,
  },
  'slope-intercept': {
    component: CoordinatePlotAnimation,
  },
  'system-of-equations': {
    component: CoordinatePlotAnimation,
  },

  // ============================================
  // POLYNOMIAL/QUADRATIC ANIMATIONS (Level I)
  // ============================================
  'foil-visual': {
    component: FOILAnimation,
  },
  'foil-setup': {
    component: FOILAnimation,
    isSetup: true,
  },
  'factoring-visual': {
    component: FactoringAnimation,
  },
  'factoring-setup': {
    component: FactoringAnimation,
    isSetup: true,
  },
  'parabola-graph': {
    component: ParabolaAnimation,
  },
  'parabola-setup': {
    component: ParabolaAnimation,
    isSetup: true,
  },
  'quadratic-formula': {
    component: QuadraticFormulaAnimation,
  },
  'quadratic-formula-setup': {
    component: QuadraticFormulaAnimation,
    isSetup: true,
  },
  'completing-square': {
    component: AlgebraTilesAnimation,
  },

  // ============================================
  // ADVANCED ALGEBRA ANIMATIONS (Level J)
  // ============================================
  'complex-plane': {
    component: ComplexPlaneAnimation,
  },
  'complex-plane-setup': {
    component: ComplexPlaneAnimation,
    isSetup: true,
  },
  'polynomial-division': {
    component: PolynomialDivisionAnimation,
  },
  'polynomial-division-setup': {
    component: PolynomialDivisionAnimation,
    isSetup: true,
  },
  'advanced-factoring': {
    component: AdvancedFactoringAnimation,
  },
  'advanced-factoring-setup': {
    component: AdvancedFactoringAnimation,
    isSetup: true,
  },
  'discriminant': {
    component: DiscriminantAnimation,
  },
  'discriminant-setup': {
    component: DiscriminantAnimation,
    isSetup: true,
  },
  'proof-steps': {
    component: ProofStepsAnimation,
  },
  'proof-steps-setup': {
    component: ProofStepsAnimation,
    isSetup: true,
  },

  // ============================================
  // FUNCTION ANIMATIONS (Level K)
  // ============================================
  'function-graph': {
    component: CoordinatePlotAnimation,
  },
  'function-transform': {
    component: FunctionTransformAnimation,
  },
  'function-transform-setup': {
    component: FunctionTransformAnimation,
    isSetup: true,
  },
  'exponential-graph': {
    component: ExponentialLogAnimation,
  },
  'exponential-log': {
    component: ExponentialLogAnimation,
  },
  'exponential-log-setup': {
    component: ExponentialLogAnimation,
    isSetup: true,
  },
  'rational-function': {
    component: RationalFunctionAnimation,
  },
  'rational-function-setup': {
    component: RationalFunctionAnimation,
    isSetup: true,
  },
  'irrational-function': {
    component: IrrationalFunctionAnimation,
  },
  'irrational-function-setup': {
    component: IrrationalFunctionAnimation,
    isSetup: true,
  },

  // ============================================
  // CALCULUS ANIMATIONS (Level L)
  // ============================================
  'limit-approach': {
    component: LimitAnimation,
  },
  'limit-setup': {
    component: LimitAnimation,
    isSetup: true,
  },
  'tangent-line': {
    component: DerivativeAnimation,
  },
  'derivative': {
    component: DerivativeAnimation,
  },
  'derivative-setup': {
    component: DerivativeAnimation,
    isSetup: true,
  },
  'area-under-curve': {
    component: IntegrationAnimation,
  },
  'integration': {
    component: IntegrationAnimation,
  },
  'integration-setup': {
    component: IntegrationAnimation,
    isSetup: true,
  },
  'curve-sketch': {
    component: DerivativeAnimation,
  },
  'optimization': {
    component: OptimizationAnimation,
  },
  'optimization-setup': {
    component: OptimizationAnimation,
    isSetup: true,
  },

  // ============================================
  // TRIGONOMETRY ANIMATIONS (Level M)
  // ============================================
  'unit-circle': {
    component: UnitCircleAnimation,
  },
  'unit-circle-setup': {
    component: UnitCircleAnimation,
    isSetup: true,
  },
  'trig-graph': {
    component: TrigGraphAnimation,
  },
  'trig-graph-setup': {
    component: TrigGraphAnimation,
    isSetup: true,
  },
  'triangle-trig': {
    component: TriangleTrigAnimation,
  },
  'triangle-trig-setup': {
    component: TriangleTrigAnimation,
    isSetup: true,
  },

  // ============================================
  // SEQUENCE ANIMATIONS (Level N)
  // ============================================
  'sequence-advanced': {
    component: SequenceSeriesAnimation,
  },
  'sequence-series': {
    component: SequenceSeriesAnimation,
  },
  'sequence-series-setup': {
    component: SequenceSeriesAnimation,
    isSetup: true,
  },
  'series-sum': {
    component: SequenceSeriesAnimation,
  },
  'recurrence-induction': {
    component: RecurrenceInductionAnimation,
  },
  'recurrence-induction-setup': {
    component: RecurrenceInductionAnimation,
    isSetup: true,
  },
  'advanced-differentiation': {
    component: AdvancedDifferentiationAnimation,
  },
  'advanced-differentiation-setup': {
    component: AdvancedDifferentiationAnimation,
    isSetup: true,
  },

  // ============================================
  // ADVANCED CALCULUS ANIMATIONS (Level O)
  // ============================================
  'curve-analysis': {
    component: CurveAnalysisAnimation,
  },
  'curve-analysis-setup': {
    component: CurveAnalysisAnimation,
    isSetup: true,
  },
  'integration-methods': {
    component: IntegrationMethodsAnimation,
  },
  'integration-methods-setup': {
    component: IntegrationMethodsAnimation,
    isSetup: true,
  },
  'volume-revolution': {
    component: VolumeRevolutionAnimation,
  },
  'volume-revolution-setup': {
    component: VolumeRevolutionAnimation,
    isSetup: true,
  },
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Get animation mapping for a given animationId
 * @param animationId The animation ID from hint generator
 * @returns AnimationMapping or null if not found
 */
export function getAnimationMapping(animationId: string): AnimationMapping | null {
  return HINT_ANIMATION_MAP[animationId] || null
}

/**
 * Check if an animationId has a mapping
 * @param animationId The animation ID to check
 * @returns true if mapping exists
 */
export function hasAnimationMapping(animationId: string): boolean {
  return animationId in HINT_ANIMATION_MAP
}

/**
 * Get fallback animation based on operation type
 * Used when specific animationId is not mapped
 *
 * @param operation The math operation type
 * @returns AnimationMapping for a suitable fallback
 */
export function getFallbackAnimation(operation?: string): AnimationMapping | null {
  if (!operation) return null

  const operationLower = operation.toLowerCase()

  // Map operations to their most appropriate generic animation
  const operationMappings: Record<string, AnimationMapping> = {
    'addition': { component: NumberLineAnimation },
    'subtraction': { component: NumberLineAnimation, defaultProps: { isSubtraction: true } },
    'multiplication': { component: ArrayGroupsAnimation },
    'division': { component: FairSharingAnimation },
    'counting': { component: CountingObjectsAnimation },
    'sequence': { component: SequenceAnimation },
    'fraction': { component: FractionBarAnimation },
    'algebra': { component: AlgebraTilesAnimation },
    'equation': { component: BalanceScaleAnimation },
    'linear': { component: CoordinatePlotAnimation },
    'quadratic': { component: ParabolaAnimation },
    'polynomial': { component: FactoringAnimation },
    'function': { component: FunctionTransformAnimation },
    'exponential': { component: ExponentialLogAnimation },
    'logarithm': { component: ExponentialLogAnimation },
    'calculus': { component: DerivativeAnimation },
    'limit': { component: LimitAnimation },
    'derivative': { component: DerivativeAnimation },
    'integral': { component: IntegrationAnimation },
    'trigonometry': { component: UnitCircleAnimation },
    'trig': { component: UnitCircleAnimation },
  }

  // Check for partial matches
  for (const [key, mapping] of Object.entries(operationMappings)) {
    if (operationLower.includes(key)) {
      return mapping
    }
  }

  return null
}

/**
 * Get all registered animation IDs
 * Useful for debugging and audit purposes
 */
export function getRegisteredAnimationIds(): string[] {
  return Object.keys(HINT_ANIMATION_MAP)
}

/**
 * Get animation stats for audit purposes
 */
export function getAnimationStats(): {
  totalMappings: number
  setupVariants: number
  fullAnimations: number
} {
  const mappings = Object.values(HINT_ANIMATION_MAP)
  return {
    totalMappings: mappings.length,
    setupVariants: mappings.filter(m => m.isSetup).length,
    fullAnimations: mappings.filter(m => !m.isSetup).length,
  }
}

// Re-export types
export type { ProblemData }
