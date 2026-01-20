/**
 * AnimationTestPage - Test page for all educational animations
 * Phase 1.12: Educational Animation System
 *
 * Similar to TestLevelsPage, this allows testing all animation components
 * with configurable parameters and setup/solution mode toggle.
 */

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Import all animation components
import {
  AnimationPlayer,
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
  // Level I (Quadratics & Polynomials)
  FOILAnimation,
  FactoringAnimation,
  ParabolaAnimation,
  QuadraticFormulaAnimation,
  // Level J (Advanced Algebra)
  ComplexPlaneAnimation,
  PolynomialDivisionAnimation,
  AdvancedFactoringAnimation,
  DiscriminantAnimation,
  ProofStepsAnimation,
  // Level K (Functions)
  FunctionTransformAnimation,
  RationalFunctionAnimation,
  IrrationalFunctionAnimation,
  ExponentialLogAnimation,
  // Level L (Calculus Introduction)
  LimitAnimation,
  DerivativeAnimation,
  IntegrationAnimation,
  OptimizationAnimation,
  // Level M (Trigonometry)
  UnitCircleAnimation,
  TrigGraphAnimation,
  TriangleTrigAnimation,
  // Level N (Sequences & Advanced Calc)
  SequenceSeriesAnimation,
  RecurrenceInductionAnimation,
  AdvancedDifferentiationAnimation,
  // Level O (Advanced Calculus)
  CurveAnalysisAnimation,
  IntegrationMethodsAnimation,
  VolumeRevolutionAnimation,
} from '@/components/animations'
import type { ProblemData } from '@/components/animations/core/types'

// Animation options for the dropdown
const ANIMATION_OPTIONS = [
  {
    id: 'number-line-addition',
    name: 'Number Line (Addition)',
    component: 'NumberLineAnimation',
    defaultOperands: [5, 3],
    description: 'Shows hop animation for adding numbers',
  },
  {
    id: 'number-line-subtraction',
    name: 'Number Line (Subtraction)',
    component: 'NumberLineAnimation',
    defaultOperands: [8, 3],
    isSubtraction: true,
    description: 'Shows hop animation for subtracting numbers',
  },
  {
    id: 'counting-objects',
    name: 'Counting Objects',
    component: 'CountingObjectsAnimation',
    defaultOperands: [7],
    description: 'Count objects one by one with touch animation',
  },
  {
    id: 'counting-objects-groups',
    name: 'Counting Objects (Groups)',
    component: 'CountingObjectsAnimation',
    defaultOperands: [4, 3],
    showGroups: true,
    description: 'Count objects in two groups for addition',
  },
  {
    id: 'ten-frame',
    name: 'Ten Frame (Make 10)',
    component: 'TenFrameAnimation',
    defaultOperands: [8, 5],
    description: 'Fill ten frame to visualize make-10 strategy',
  },
  {
    id: 'place-value-addition',
    name: 'Place Value (Addition)',
    component: 'PlaceValueAnimation',
    defaultOperands: [47, 35],
    description: 'Vertical addition with carrying visualization',
  },
  {
    id: 'place-value-subtraction',
    name: 'Place Value (Subtraction)',
    component: 'PlaceValueAnimation',
    defaultOperands: [52, 27],
    isSubtraction: true,
    description: 'Vertical subtraction with borrowing visualization',
  },
  // === NEW ANIMATIONS (Levels 5A-I) ===
  {
    id: 'sequence',
    name: 'Sequence (Number Patterns)',
    component: 'SequenceAnimation',
    defaultOperands: [95, 3],
    description: 'Shows number sequences without + notation (for pre-addition)',
  },
  {
    id: 'array-groups',
    name: 'Array Groups (Multiplication)',
    component: 'ArrayGroupsAnimation',
    defaultOperands: [4, 5],
    description: 'Shows objects in rows/columns for multiplication (4×5 = 20)',
  },
  {
    id: 'fair-sharing',
    name: 'Fair Sharing (Division)',
    component: 'FairSharingAnimation',
    defaultOperands: [12, 3],
    description: 'Divides objects equally among groups (12÷3 = 4)',
  },
  {
    id: 'long-division-steps',
    name: 'Long Division Steps',
    component: 'LongDivisionStepsAnimation',
    defaultOperands: [156, 12],
    description: 'Step-by-step long division algorithm',
  },
  {
    id: 'fraction-bar',
    name: 'Fraction Bar',
    component: 'FractionBarAnimation',
    defaultOperands: [3, 4],
    description: 'Visual fraction representation with horizontal bars',
  },
  {
    id: 'fraction-operation',
    name: 'Fraction Operation',
    component: 'FractionOperationAnimation',
    defaultOperands: [1, 4, 2, 4],
    description: 'Fraction addition/subtraction visualization (1/4 + 2/4)',
  },
  {
    id: 'balance-scale',
    name: 'Balance Scale (Equations)',
    component: 'BalanceScaleAnimation',
    defaultOperands: [2, 3, 11],
    description: 'Solves equations by balancing (2x + 3 = 11)',
  },
  {
    id: 'algebra-tiles',
    name: 'Algebra Tiles (Integers)',
    component: 'AlgebraTilesAnimation',
    defaultOperands: [-3, 5],
    description: 'Integer operations with positive/negative tiles',
  },
  {
    id: 'coordinate-plot',
    name: 'Coordinate Plot (Graphing)',
    component: 'CoordinatePlotAnimation',
    defaultOperands: [2, 1],
    description: 'Plots points and draws lines (y = 2x + 1)',
  },
  // === LEVEL I: Quadratics & Polynomials ===
  {
    id: 'foil-visual',
    name: 'FOIL Method',
    component: 'FOILAnimation',
    defaultOperands: [1, 2, 1, 3],
    description: 'Visualizes FOIL method for (x+2)(x+3)',
  },
  {
    id: 'factoring-visual',
    name: 'Factoring Trinomials',
    component: 'FactoringAnimation',
    defaultOperands: [1, 5, 6],
    description: 'Factors x² + 5x + 6 step by step',
  },
  {
    id: 'parabola-graph',
    name: 'Parabola Graphing',
    component: 'ParabolaAnimation',
    defaultOperands: [1, -4, 3],
    description: 'Graphs quadratic function with vertex and roots',
  },
  {
    id: 'quadratic-formula',
    name: 'Quadratic Formula',
    component: 'QuadraticFormulaAnimation',
    defaultOperands: [2, -7, 3],
    description: 'Applies quadratic formula step by step',
  },
  // === LEVEL J: Advanced Algebra ===
  {
    id: 'complex-plane',
    name: 'Complex Plane',
    component: 'ComplexPlaneAnimation',
    defaultOperands: [3, 4],
    description: 'Plots complex number 3 + 4i on the plane',
  },
  {
    id: 'polynomial-division',
    name: 'Polynomial Division',
    component: 'PolynomialDivisionAnimation',
    defaultOperands: [1, 3, 2],
    description: 'Long division of polynomials',
  },
  {
    id: 'advanced-factoring',
    name: 'Advanced Factoring',
    component: 'AdvancedFactoringAnimation',
    defaultOperands: [8, 27],
    description: 'Factor sum/difference of cubes',
  },
  {
    id: 'discriminant',
    name: 'Discriminant Analysis',
    component: 'DiscriminantAnimation',
    defaultOperands: [1, -5, 6],
    description: 'Shows D > 0, D = 0, D < 0 cases',
  },
  {
    id: 'proof-steps',
    name: 'Proof Steps',
    component: 'ProofStepsAnimation',
    defaultOperands: [0],
    description: 'Step-by-step logical proof display',
  },
  // === LEVEL K: Functions ===
  {
    id: 'function-transform',
    name: 'Function Transformations',
    component: 'FunctionTransformAnimation',
    defaultOperands: [2, 3],
    description: 'Shows shift, stretch, reflect of functions',
  },
  {
    id: 'rational-function',
    name: 'Rational Functions',
    component: 'RationalFunctionAnimation',
    defaultOperands: [1, -4],
    description: 'Shows asymptotes and holes',
  },
  {
    id: 'irrational-function',
    name: 'Irrational Functions',
    component: 'IrrationalFunctionAnimation',
    defaultOperands: [1, 0],
    description: 'Square root function with domain',
  },
  {
    id: 'exponential-log',
    name: 'Exponential & Log',
    component: 'ExponentialLogAnimation',
    defaultOperands: [2, 0],
    description: 'Growth/decay curves and inverse relationship',
  },
  // === LEVEL L: Calculus Introduction ===
  {
    id: 'limit-approach',
    name: 'Limit Approach',
    component: 'LimitAnimation',
    defaultOperands: [2, 0],
    description: 'Point approaching a value visualization',
  },
  {
    id: 'derivative',
    name: 'Derivative (Tangent Line)',
    component: 'DerivativeAnimation',
    defaultOperands: [2, 0],
    description: 'Tangent line slope at a point',
  },
  {
    id: 'integration',
    name: 'Integration (Area)',
    component: 'IntegrationAnimation',
    defaultOperands: [0, 3],
    description: 'Riemann sums → area under curve',
  },
  {
    id: 'optimization',
    name: 'Optimization',
    component: 'OptimizationAnimation',
    defaultOperands: [100, 0],
    description: 'Find max/min in real-world context',
  },
  // === LEVEL M: Trigonometry ===
  {
    id: 'unit-circle',
    name: 'Unit Circle',
    component: 'UnitCircleAnimation',
    defaultOperands: [45, 0],
    description: 'Rotating angle with sin/cos projection',
  },
  {
    id: 'trig-graph',
    name: 'Trig Graph (Sin/Cos)',
    component: 'TrigGraphAnimation',
    defaultOperands: [1, 1],
    description: 'Sine/cosine waves with amplitude/period',
  },
  {
    id: 'triangle-trig',
    name: 'Triangle Trigonometry',
    component: 'TriangleTrigAnimation',
    defaultOperands: [3, 4, 5],
    description: 'Right triangle with SOH-CAH-TOA',
  },
  // === LEVEL N: Sequences & Advanced Calculus ===
  {
    id: 'sequence-series',
    name: 'Sequences & Series',
    component: 'SequenceSeriesAnimation',
    defaultOperands: [2, 3],
    description: 'Pattern visualization, partial sums',
  },
  {
    id: 'recurrence-induction',
    name: 'Recurrence & Induction',
    component: 'RecurrenceInductionAnimation',
    defaultOperands: [1, 1],
    description: 'Base case + inductive step',
  },
  {
    id: 'advanced-differentiation',
    name: 'Advanced Differentiation',
    component: 'AdvancedDifferentiationAnimation',
    defaultOperands: [2, 0],
    description: 'Chain rule, trig/log derivatives',
  },
  // === LEVEL O: Advanced Calculus ===
  {
    id: 'curve-analysis',
    name: 'Curve Analysis',
    component: 'CurveAnalysisAnimation',
    defaultOperands: [1, -3, 0, 2],
    description: 'Concavity, inflection points, extrema',
  },
  {
    id: 'integration-methods',
    name: 'Integration Methods',
    component: 'IntegrationMethodsAnimation',
    defaultOperands: [0, 0],
    description: 'U-substitution, integration by parts',
  },
  {
    id: 'volume-revolution',
    name: 'Volume of Revolution',
    component: 'VolumeRevolutionAnimation',
    defaultOperands: [0, 2],
    description: '3D solid rotating animation (disk/washer/shell)',
  },
] as const

type AnimationOption = (typeof ANIMATION_OPTIONS)[number]

export default function AnimationTestPage() {
  // State
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationOption>(ANIMATION_OPTIONS[0])
  const [showSolution, setShowSolution] = useState(false)
  const [operand1, setOperand1] = useState<number>(selectedAnimation.defaultOperands[0])
  const [operand2, setOperand2] = useState<number>(selectedAnimation.defaultOperands[1] ?? 0)
  const [animationKey, setAnimationKey] = useState(0) // For forcing re-render

  // Handle animation selection change
  const handleAnimationChange = useCallback((animationId: string) => {
    const animation = ANIMATION_OPTIONS.find((a) => a.id === animationId)
    if (animation) {
      setSelectedAnimation(animation)
      setOperand1(animation.defaultOperands[0])
      setOperand2(animation.defaultOperands[1] ?? 0)
      setShowSolution(false)
      setAnimationKey((k) => k + 1)
    }
  }, [])

  // Replay animation
  const handleReplay = useCallback(() => {
    setAnimationKey((k) => k + 1)
  }, [])

  // Toggle solution mode
  const handleToggleSolution = useCallback(() => {
    setShowSolution((prev) => !prev)
    setAnimationKey((k) => k + 1)
  }, [])

  // Build problem data - pass ALL operands to support animations that need 3+ operands
  // The UI only allows editing operand1 and operand2, so operand3+ use defaults
  const problemData: ProblemData = {
    operands: (() => {
      const defaults = [...selectedAnimation.defaultOperands]
      // Replace first two with user-edited values
      if (defaults.length >= 1) defaults[0] = operand1
      if (defaults.length >= 2) defaults[1] = operand2
      return defaults
    })(),
  }

  // Render the selected animation
  const renderAnimation = () => {
    const props = {
      key: animationKey,
      problemData,
      showSolution,
      onComplete: () => console.log('Animation complete'),
    }

    switch (selectedAnimation.component) {
      case 'NumberLineAnimation':
        return (
          <NumberLineAnimation
            {...props}
            isSubtraction={'isSubtraction' in selectedAnimation && selectedAnimation.isSubtraction}
          />
        )
      case 'CountingObjectsAnimation':
        return (
          <CountingObjectsAnimation
            {...props}
            showGroups={'showGroups' in selectedAnimation && selectedAnimation.showGroups}
          />
        )
      case 'TenFrameAnimation':
        return <TenFrameAnimation {...props} />
      case 'PlaceValueAnimation':
        return (
          <PlaceValueAnimation
            {...props}
            operationType={
              'isSubtraction' in selectedAnimation && selectedAnimation.isSubtraction
                ? 'subtraction'
                : 'addition'
            }
          />
        )
      // === NEW ANIMATIONS (Levels 5A-I) ===
      case 'SequenceAnimation':
        return <SequenceAnimation {...props} />
      case 'ArrayGroupsAnimation':
        return <ArrayGroupsAnimation {...props} />
      case 'FairSharingAnimation':
        return <FairSharingAnimation {...props} />
      case 'LongDivisionStepsAnimation':
        return <LongDivisionStepsAnimation {...props} />
      case 'FractionBarAnimation':
        return <FractionBarAnimation {...props} />
      case 'FractionOperationAnimation':
        return <FractionOperationAnimation {...props} />
      case 'BalanceScaleAnimation':
        return <BalanceScaleAnimation {...props} />
      case 'AlgebraTilesAnimation':
        return <AlgebraTilesAnimation {...props} />
      case 'CoordinatePlotAnimation':
        return <CoordinatePlotAnimation {...props} />
      // === LEVEL I: Quadratics & Polynomials ===
      case 'FOILAnimation':
        return <FOILAnimation {...props} />
      case 'FactoringAnimation':
        return <FactoringAnimation {...props} />
      case 'ParabolaAnimation':
        return <ParabolaAnimation {...props} />
      case 'QuadraticFormulaAnimation':
        return <QuadraticFormulaAnimation {...props} />
      // === LEVEL J: Advanced Algebra ===
      case 'ComplexPlaneAnimation':
        return <ComplexPlaneAnimation {...props} />
      case 'PolynomialDivisionAnimation':
        return <PolynomialDivisionAnimation {...props} />
      case 'AdvancedFactoringAnimation':
        return <AdvancedFactoringAnimation {...props} />
      case 'DiscriminantAnimation':
        return <DiscriminantAnimation {...props} />
      case 'ProofStepsAnimation':
        return <ProofStepsAnimation {...props} />
      // === LEVEL K: Functions ===
      case 'FunctionTransformAnimation':
        return <FunctionTransformAnimation {...props} />
      case 'RationalFunctionAnimation':
        return <RationalFunctionAnimation {...props} />
      case 'IrrationalFunctionAnimation':
        return <IrrationalFunctionAnimation {...props} />
      case 'ExponentialLogAnimation':
        return <ExponentialLogAnimation {...props} />
      // === LEVEL L: Calculus Introduction ===
      case 'LimitAnimation':
        return <LimitAnimation {...props} />
      case 'DerivativeAnimation':
        return <DerivativeAnimation {...props} />
      case 'IntegrationAnimation':
        return <IntegrationAnimation {...props} />
      case 'OptimizationAnimation':
        return <OptimizationAnimation {...props} />
      // === LEVEL M: Trigonometry ===
      case 'UnitCircleAnimation':
        return <UnitCircleAnimation {...props} />
      case 'TrigGraphAnimation':
        return <TrigGraphAnimation {...props} />
      case 'TriangleTrigAnimation':
        return <TriangleTrigAnimation {...props} />
      // === LEVEL N: Sequences & Advanced Calculus ===
      case 'SequenceSeriesAnimation':
        return <SequenceSeriesAnimation {...props} />
      case 'RecurrenceInductionAnimation':
        return <RecurrenceInductionAnimation {...props} />
      case 'AdvancedDifferentiationAnimation':
        return <AdvancedDifferentiationAnimation {...props} />
      // === LEVEL O: Advanced Calculus ===
      case 'CurveAnalysisAnimation':
        return <CurveAnalysisAnimation {...props} />
      case 'IntegrationMethodsAnimation':
        return <IntegrationMethodsAnimation {...props} />
      case 'VolumeRevolutionAnimation':
        return <VolumeRevolutionAnimation {...props} />
      default:
        return <div className="text-gray-500">Unknown animation type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">←</span>
              <span>Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Animation Test Page</h1>
            <span className="text-sm text-gray-500 ml-auto">Phase 1.12: Educational Animations</span>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Animation Selector */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Animation</h2>

            <div className="space-y-3">
              {ANIMATION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnimationChange(option.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border-2 transition-all',
                    selectedAnimation.id === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-gray-900">{option.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column: Configuration */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>

            {/* Operands */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Number
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={operand1}
                  onChange={(e) => {
                    setOperand1(Number(e.target.value))
                    setAnimationKey((k) => k + 1)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {selectedAnimation.defaultOperands.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Second Number
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={operand2}
                    onChange={(e) => {
                      setOperand2(Number(e.target.value))
                      setAnimationKey((k) => k + 1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {/* Mode Toggle */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animation Mode
                </label>
                <button
                  onClick={handleToggleSolution}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                    showSolution
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  )}
                >
                  {showSolution ? (
                    <>
                      <span className="text-lg">👁</span>
                      Solution Mode (Animated)
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🔒</span>
                      Setup Mode (Static)
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {showSolution
                    ? 'Shows step-by-step animated solution (for Full Teaching)'
                    : 'Shows setup with prompts (for Visual Hints)'}
                </p>
              </div>

              {/* Replay Button */}
              <button
                onClick={handleReplay}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <span className="text-lg">🔄</span>
                Replay Animation
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Problem</h3>
              <div className="text-2xl font-bold text-primary">
                {operand1}{' '}
                {'isSubtraction' in selectedAnimation && selectedAnimation.isSubtraction
                  ? '-'
                  : '+'}{' '}
                {operand2} ={' '}
                {'isSubtraction' in selectedAnimation && selectedAnimation.isSubtraction
                  ? operand1 - operand2
                  : operand1 + operand2}
              </div>
            </div>
          </div>

          {/* Right Column: Animation Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

            <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4">
              <AnimationPlayer showControls={true}>
                {renderAnimation()}
              </AnimationPlayer>
            </div>

            {/* Mode indicator */}
            <motion.div
              key={showSolution ? 'solution' : 'setup'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mt-4 p-3 rounded-lg text-center font-medium',
                showSolution ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              )}
            >
              {showSolution ? 'Showing: Solution Animation' : 'Showing: Setup (Prompt Thinking)'}
            </motion.div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/test-levels"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Test Levels Page
          </Link>
          <Link
            to="/practice"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Practice Mode
          </Link>
        </div>
      </main>
    </div>
  )
}
