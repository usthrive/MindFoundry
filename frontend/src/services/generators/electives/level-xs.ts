import type { Problem, LevelXSProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generateCentralTendencyHints,
  generateVarianceHints,
  generateBinomialDistributionHints,
  generateNormalDistributionHints,
  generateZScoreHints,
  generateConfidenceIntervalHints,
  generateHypothesisTestHints,
  generateGenericHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelXSProblemType
} {
  if (worksheet <= 15) return { type: 'mean_median_mode' }
  if (worksheet <= 25) return { type: 'variance_standard_deviation' }
  if (worksheet <= 35) return { type: 'binomial_distribution' }
  if (worksheet <= 45) return { type: 'normal_distribution' }
  if (worksheet <= 55) return { type: 'z_scores' }
  if (worksheet <= 65) return { type: 'confidence_intervals' }
  return { type: 'hypothesis_test' }
}

function generateMeanMedianMode(): Problem {
  const data = Array.from({ length: 7 }, () => randomInt(1, 20))
  const sorted = [...data].sort((a, b) => a - b)
  
  const sum = data.reduce((a, b) => a + b, 0)
  const mean = (sum / data.length).toFixed(2)
  const median = sorted[Math.floor(sorted.length / 2)]
  
  const counts: Record<number, number> = {}
  data.forEach(n => {
    counts[n] = (counts[n] || 0) + 1
  })
  const maxCount = Math.max(...Object.values(counts))
  const modes = Object.entries(counts)
    .filter(([, count]) => count === maxCount)
    .map(([val]) => Number(val))
  
  const type = randomChoice(['mean', 'median', 'mode'])
  
  if (type === 'mean') {
    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'mean_median_mode',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `Find the mean of: ${data.join(', ')}`,
      correctAnswer: mean,
      hints: ['Mean = sum of values / number of values'],
      graduatedHints: generateCentralTendencyHints('mean', data, 'XS'),
    }
  }
  
  if (type === 'median') {
    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'mean_median_mode',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `Find the median of: ${data.join(', ')}`,
      correctAnswer: median,
      hints: ['Sort the data and find the middle value'],
      graduatedHints: generateCentralTendencyHints('median', data, 'XS'),
    }
  }
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'mean_median_mode',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Find the mode of: ${data.join(', ')}`,
    correctAnswer: modes.length === data.length ? 'No mode' : modes.join(', '),
    hints: ['Mode is the most frequent value'],
    graduatedHints: generateCentralTendencyHints('mode', data, 'XS'),
  }
}

function generateVarianceStdDev(): Problem {
  const data = Array.from({ length: 5 }, () => randomInt(1, 10))
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)
  
  const type = randomChoice(['variance', 'stddev'])
  
  if (type === 'variance') {
    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'variance_standard_deviation',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Find the population variance of: ${data.join(', ')}`,
      correctAnswer: variance.toFixed(2),
      hints: [
        `Mean = ${mean.toFixed(2)}`,
        'Variance = Σ(x - mean)²/n',
      ],
      graduatedHints: generateVarianceHints('variance', data, 'XS'),
    }
  }
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'variance_standard_deviation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the population standard deviation of: ${data.join(', ')}`,
    correctAnswer: stdDev.toFixed(2),
    hints: [
      'Standard deviation = √variance',
      `Mean = ${mean.toFixed(2)}`,
    ],
    graduatedHints: generateVarianceHints('stddev', data, 'XS'),
  }
}

function generateBinomialDistribution(): Problem {
  const n = randomInt(5, 10)
  const p = randomChoice([0.2, 0.3, 0.4, 0.5, 0.6])
  const k = randomInt(1, Math.min(3, n))
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'binomial_distribution',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `If X ~ B(${n}, ${p}), find P(X = ${k})`,
    correctAnswer: `C(${n},${k}) × ${p}^${k} × ${(1 - p).toFixed(1)}^${n - k}`,
    hints: [
      'P(X = k) = C(n,k) × p^k × (1-p)^(n-k)',
      'First calculate C(n,k)',
    ],
    graduatedHints: generateBinomialDistributionHints(n, p, k, 'XS'),
  }
}

function generateNormalDistribution(): Problem {
  const mean = randomChoice([50, 100, 500])
  const stdDev = randomChoice([5, 10, 15])
  const x = mean + randomChoice([-2, -1, 1, 2]) * stdDev
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'probability',
    subtype: 'normal_distribution',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `X ~ N(${mean}, ${stdDev}²). What percentage of values are below ${x}?`,
    correctAnswer: `Use z = (${x}-${mean})/${stdDev} = ${(x - mean) / stdDev}, then look up in z-table`,
    hints: [
      'Convert to z-score first',
      'z = (x - μ)/σ',
    ],
    graduatedHints: generateNormalDistributionHints(mean, stdDev, x, 'XS'),
  }
}

function generateZScore(): Problem {
  const x = randomInt(60, 90)
  const mean = 75
  const stdDev = 10
  const z = ((x - mean) / stdDev).toFixed(1)
  
  const type = randomChoice(['find_z', 'interpret'])
  
  if (type === 'find_z') {
    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'z_scores',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `A test has mean ${mean} and std dev ${stdDev}. Find the z-score for a score of ${x}.`,
      correctAnswer: z,
      hints: ['z = (x - μ)/σ'],
      graduatedHints: generateZScoreHints(x, mean, stdDev, 'XS'),
    }
  }
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'z_scores',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `A z-score of ${z} means the value is how many standard deviations from the mean?`,
    correctAnswer: `${Math.abs(Number(z))} standard deviation${Math.abs(Number(z)) !== 1 ? 's' : ''} ${Number(z) >= 0 ? 'above' : 'below'} the mean`,
    hints: ['Z-score tells how many standard deviations from mean'],
    graduatedHints: generateGenericHints('z_score_interpret', 'XS'),
  }
}

function generateConfidenceInterval(): Problem {
  const xbar = randomInt(40, 60)
  const s = randomInt(5, 15)
  const n = randomChoice([25, 36, 49, 100])
  const confidence = randomChoice([90, 95, 99])
  
  const zValues: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 }
  const z = zValues[confidence]
  const marginOfError = (z * s / Math.sqrt(n)).toFixed(2)
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'confidence_intervals',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Sample mean = ${xbar}, s = ${s}, n = ${n}. Find the ${confidence}% confidence interval for μ.`,
    correctAnswer: `${xbar} ± ${marginOfError} = (${(xbar - Number(marginOfError)).toFixed(2)}, ${(xbar + Number(marginOfError)).toFixed(2)})`,
    hints: [
      `CI = x̄ ± z*(s/√n)`,
      `z* for ${confidence}% is ${z}`,
    ],
    graduatedHints: generateConfidenceIntervalHints(xbar, s, n, confidence, 'XS'),
  }
}

function generateSamplingMethods(): Problem {
  const methods = [
    {
      name: 'Simple Random Sampling',
      description: 'Each member has equal chance of selection',
      scenario: 'Drawing names from a hat for a survey',
    },
    {
      name: 'Stratified Sampling',
      description: 'Divide population into groups, then sample from each',
      scenario: 'Selecting students proportionally from each grade level',
    },
    {
      name: 'Cluster Sampling',
      description: 'Divide into clusters, randomly select entire clusters',
      scenario: 'Randomly selecting 5 classrooms and surveying all students in them',
    },
    {
      name: 'Systematic Sampling',
      description: 'Select every kth item after random start',
      scenario: 'Selecting every 10th person entering a store',
    },
  ]

  const method = randomChoice(methods)
  const questionType = randomChoice(['identify', 'describe'])

  if (questionType === 'identify') {
    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'sampling',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `What sampling method is this: "${method.scenario}"?`,
      correctAnswer: method.name,
      hints: [method.description],
      graduatedHints: generateGenericHints('sampling', 'XS'),
    }
  }

  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'sampling',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Describe ${method.name}`,
    correctAnswer: method.description,
    hints: [`Example: ${method.scenario}`],
    graduatedHints: generateGenericHints('sampling', 'XS'),
  }
}

function generateRegression(): Problem {
  const n = 5
  const x = Array.from({ length: n }, (_, i) => i + 1)
  const slope = randomInt(1, 4)
  const intercept = randomInt(-3, 5)
  const y = x.map(xi => slope * xi + intercept + randomInt(-1, 1))

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const meanX = sumX / n
  const meanY = sumY / n

  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'regression',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Given data points: x = {${x.join(', ')}}, y = {${y.join(', ')}}. Find the slope of the regression line.`,
    correctAnswer: `b = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²`,
    hints: [
      `x̄ = ${meanX.toFixed(2)}, ȳ = ${meanY.toFixed(2)}`,
      'Calculate deviations from means first',
    ],
    graduatedHints: generateGenericHints('regression', 'XS'),
  }
}

function generateStandardError(): Problem {
  const s = randomInt(5, 15)
  const n = randomChoice([25, 36, 49, 64, 100])

  const se = (s / Math.sqrt(n)).toFixed(2)

  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'standard_error',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `If sample standard deviation s = ${s} and n = ${n}, find the standard error of the mean.`,
    correctAnswer: se,
    hints: [
      'SE = s / √n',
      `√${n} = ${Math.sqrt(n)}`,
    ],
    graduatedHints: generateGenericHints('standard_error', 'XS'),
  }
}

function generateChiSquare(): Problem {
  const observed = [randomInt(15, 25), randomInt(15, 25), randomInt(15, 25), randomInt(15, 25)]
  const total = observed.reduce((a, b) => a + b, 0)
  const expected = total / 4

  const chiSq = observed.reduce((sum, o) => sum + Math.pow(o - expected, 2) / expected, 0)

  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'chi_square',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `A die is rolled ${total} times with outcomes: 1s=${observed[0]}, 2s=${observed[1]}, 3s=${observed[2]}, 4s=${observed[3]}. Calculate χ² if expecting equal frequencies.`,
    correctAnswer: `χ² = Σ(O-E)²/E = ${chiSq.toFixed(2)}`,
    hints: [
      `Expected frequency = ${total}/${observed.length} = ${expected}`,
      'χ² = Σ(Observed - Expected)² / Expected',
    ],
    graduatedHints: generateGenericHints('chi_square', 'XS'),
  }
}

function generateHypothesisTest(): Problem {
  const type = randomChoice(['setup', 'decision'])
  
  if (type === 'setup') {
    const scenario = randomChoice(['greater', 'less', 'different'])
    const claimed = randomInt(50, 100)

    return {
      id: generateId(),
      level: 'XS',
      worksheetNumber: 1,
      type: 'statistics',
      subtype: 'hypothesis_test',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `A company claims the mean is ${claimed}. You believe it is ${scenario === 'greater' ? 'higher' : scenario === 'less' ? 'lower' : 'different'}. State the hypotheses.`,
      correctAnswer: scenario === 'greater'
        ? `H₀: μ = ${claimed}, H₁: μ > ${claimed}`
        : scenario === 'less'
        ? `H₀: μ = ${claimed}, H₁: μ < ${claimed}`
        : `H₀: μ = ${claimed}, H₁: μ ≠ ${claimed}`,
      hints: [
        'H₀ (null) includes equality',
        'H₁ (alternative) is what you want to prove',
      ],
      graduatedHints: generateHypothesisTestHints('setup', scenario, 'XS'),
    }
  }
  
  const pValue = randomChoice([0.02, 0.04, 0.06, 0.08])
  const alpha = 0.05
  
  return {
    id: generateId(),
    level: 'XS',
    worksheetNumber: 1,
    type: 'statistics',
    subtype: 'hypothesis_test',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `If p-value = ${pValue} and α = ${alpha}, what is your decision?`,
    correctAnswer: pValue < alpha ? 'Reject H₀' : 'Fail to reject H₀',
    hints: [
      'If p-value < α, reject H₀',
      'If p-value ≥ α, fail to reject H₀',
    ],
    graduatedHints: generateHypothesisTestHints('decision', pValue.toString(), 'XS'),
  }
}

export function generateXSProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  const variety = Math.random()

  switch (config.type) {
    case 'mean_median_mode':
      problem = generateMeanMedianMode()
      break
    case 'variance_standard_deviation':
      if (variety < 0.7) problem = generateVarianceStdDev()
      else problem = generateStandardError()
      break
    case 'standard_error':
      problem = generateStandardError()
      break
    case 'binomial_distribution':
    case 'probability_density_function':
      problem = generateBinomialDistribution()
      break
    case 'normal_distribution':
      problem = generateNormalDistribution()
      break
    case 'z_scores':
      problem = generateZScore()
      break
    case 'sampling':
      problem = generateSamplingMethods()
      break
    case 'confidence_intervals':
      problem = generateConfidenceInterval()
      break
    case 'hypothesis_test':
      if (variety < 0.7) problem = generateHypothesisTest()
      else problem = generateChiSquare()
      break
    case 'chi_square':
      problem = generateChiSquare()
      break
    case 'regression':
      problem = generateRegression()
      break
    default:
      problem = generateMeanMedianMode()
  }

  problem.worksheetNumber = worksheet
  return problem
}

export function generateXSProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateXSProblem(worksheet))
  }
  return problems
}

export function getXSWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelXSProblemType, string> = {
    'mean_median_mode': 'Mean, Median, Mode',
    'variance_standard_deviation': 'Variance & Standard Deviation',
    'standard_error': 'Standard Error',
    'binomial_distribution': 'Binomial Distribution',
    'probability_density_function': 'Probability Density Functions',
    'normal_distribution': 'Normal Distribution',
    'z_scores': 'Z-Scores',
    'sampling': 'Sampling Methods',
    'regression': 'Linear Regression',
    'confidence_intervals': 'Confidence Intervals',
    'hypothesis_test': 'Hypothesis Testing',
    'chi_square': 'Chi-Square Tests',
  }
  
  return {
    level: 'XS' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
