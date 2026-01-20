/**
 * Animation Components - Phase 1.12/1.13: Educational Animation System
 *
 * This module exports all animation components for the graduated hint system.
 */

// Core
export { default as AnimationPlayer, useAnimationState } from './core/AnimationPlayer'
export * from './core/types'

// Shared Components
export { default as AnimatedGrid, createFilledGrid, createContentGrid } from './shared/AnimatedGrid'
export { default as AnimatedFraction, FractionBar, FractionCircle } from './shared/AnimatedFraction'

// MVP Visualizations (Levels 7A-B)
export { default as NumberLineAnimation } from './visualizations/NumberLineAnimation'
export { default as CountingObjectsAnimation } from './visualizations/CountingObjectsAnimation'
export { default as TenFrameAnimation } from './visualizations/TenFrameAnimation'
export { default as PlaceValueAnimation } from './visualizations/PlaceValueAnimation'
export { default as SequenceAnimation } from './visualizations/SequenceAnimation'

// Elementary Visualizations (Levels C-F)
export { default as ArrayGroupsAnimation } from './visualizations/elementary/ArrayGroupsAnimation'
export { default as FairSharingAnimation } from './visualizations/elementary/FairSharingAnimation'
export { default as LongDivisionStepsAnimation } from './visualizations/elementary/LongDivisionStepsAnimation'
export { default as FractionBarAnimation } from './visualizations/elementary/FractionBarAnimation'
export { default as FractionOperationAnimation } from './visualizations/elementary/FractionOperationAnimation'

// Algebra Visualizations (Levels G-H)
export { default as BalanceScaleAnimation } from './visualizations/algebra/BalanceScaleAnimation'
export { default as AlgebraTilesAnimation } from './visualizations/algebra/AlgebraTilesAnimation'
export { default as CoordinatePlotAnimation } from './visualizations/algebra/CoordinatePlotAnimation'

// Level I: Quadratics & Polynomials
export { default as FOILAnimation } from './visualizations/algebra/FOILAnimation'
export { default as FactoringAnimation } from './visualizations/algebra/FactoringAnimation'
export { default as ParabolaAnimation } from './visualizations/algebra/ParabolaAnimation'
export { default as QuadraticFormulaAnimation } from './visualizations/algebra/QuadraticFormulaAnimation'

// Level J: Advanced Algebra
export { default as ComplexPlaneAnimation } from './visualizations/algebra/ComplexPlaneAnimation'
export { default as PolynomialDivisionAnimation } from './visualizations/algebra/PolynomialDivisionAnimation'
export { default as AdvancedFactoringAnimation } from './visualizations/algebra/AdvancedFactoringAnimation'
export { default as DiscriminantAnimation } from './visualizations/algebra/DiscriminantAnimation'
export { default as ProofStepsAnimation } from './visualizations/algebra/ProofStepsAnimation'

// Level K: Functions
export { default as FunctionTransformAnimation } from './visualizations/functions/FunctionTransformAnimation'
export { default as RationalFunctionAnimation } from './visualizations/functions/RationalFunctionAnimation'
export { default as IrrationalFunctionAnimation } from './visualizations/functions/IrrationalFunctionAnimation'
export { default as ExponentialLogAnimation } from './visualizations/functions/ExponentialLogAnimation'

// Level L: Calculus Introduction
export { default as LimitAnimation } from './visualizations/calculus/LimitAnimation'
export { default as DerivativeAnimation } from './visualizations/calculus/DerivativeAnimation'
export { default as IntegrationAnimation } from './visualizations/calculus/IntegrationAnimation'
export { default as OptimizationAnimation } from './visualizations/calculus/OptimizationAnimation'

// Level M: Trigonometry
export { default as UnitCircleAnimation } from './visualizations/trigonometry/UnitCircleAnimation'
export { default as TrigGraphAnimation } from './visualizations/trigonometry/TrigGraphAnimation'
export { default as TriangleTrigAnimation } from './visualizations/trigonometry/TriangleTrigAnimation'

// Level N: Sequences & Advanced Calculus
export { default as SequenceSeriesAnimation } from './visualizations/trigonometry/SequenceSeriesAnimation'
export { default as RecurrenceInductionAnimation } from './visualizations/trigonometry/RecurrenceInductionAnimation'
export { default as AdvancedDifferentiationAnimation } from './visualizations/trigonometry/AdvancedDifferentiationAnimation'

// Level O: Advanced Calculus
export { default as CurveAnalysisAnimation } from './visualizations/calculus/CurveAnalysisAnimation'
export { default as IntegrationMethodsAnimation } from './visualizations/calculus/IntegrationMethodsAnimation'
export { default as VolumeRevolutionAnimation } from './visualizations/calculus/VolumeRevolutionAnimation'

// Re-export type helpers
export type {
  AnimationId,
  AnimationState,
  AnimationConfig,
  BaseAnimationProps,
  NumberLineAnimationProps,
  CountingObjectsAnimationProps,
  TenFrameAnimationProps,
  PlaceValueAnimationProps,
  ProblemData,
  HintAnimationMapping,
} from './core/types'
