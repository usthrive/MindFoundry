import type { Validator, Issue, TestProblem, CurriculumSpec } from '../types'

const ADVANCED_TERMS: Record<string, string> = {
  'coefficient': 'middle-school',
  'polynomial': 'high-school',
  'derivative': 'calculus',
  'integral': 'calculus',
  'discriminant': 'high-school',
  'asymptote': 'high-school',
  'logarithm': 'calculus',
  'trigonometric': 'calculus',
}

function getLevelCategory(level: string): string {
  const preK = ['7A', '6A', '5A', '4A']
  const elemBasic = ['3A', '2A', 'A', 'B']
  const elemAdvanced = ['C', 'D', 'E', 'F']
  const middleSchool = ['G', 'H', 'I']
  const highSchool = ['J', 'K']
  
  if (preK.includes(level)) return 'pre-k'
  if (elemBasic.includes(level)) return 'elementary-basic'
  if (elemAdvanced.includes(level)) return 'elementary-advanced'
  if (middleSchool.includes(level)) return 'middle-school'
  if (highSchool.includes(level)) return 'high-school'
  return 'calculus'
}

function getCategoryOrder(category: string): number {
  const order = ['pre-k', 'elementary-basic', 'elementary-advanced', 'middle-school', 'high-school', 'calculus']
  return order.indexOf(category)
}

export const ReadabilityValidator: Validator = {
  name: 'ReadabilityValidator',
  type: 'readability',

  validate(problem: TestProblem, _spec: CurriculumSpec): Issue[] {
    const issues: Issue[] = []

    const questionText = typeof problem.question === 'string' 
      ? problem.question 
      : problem.question?.text || ''

    if (!questionText) return issues

    const levelCategory = getLevelCategory(problem.level)
    const levelOrder = getCategoryOrder(levelCategory)

    for (const [term, requiredCategory] of Object.entries(ADVANCED_TERMS)) {
      if (questionText.toLowerCase().includes(term.toLowerCase())) {
        const termOrder = getCategoryOrder(requiredCategory)
        
        if (termOrder > levelOrder) {
          issues.push({
            id: `readability-advanced-term-${problem.id}-${term}`,
            type: 'readability',
            severity: 'warning',
            level: problem.level,
            worksheet: problem.worksheetNumber,
            problemType: problem.type,
            description: `Question uses "${term}" which is typically introduced at ${requiredCategory} level, but this is ${levelCategory} level`,
            autoFixable: false,
          })
        }
      }
    }

    const words = questionText.split(/\s+/)
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length

    if (levelCategory === 'pre-k' && avgWordLength > 5) {
      issues.push({
        id: `readability-complex-words-${problem.id}`,
        type: 'readability',
        severity: 'info',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `Question may use complex words for Pre-K level (avg word length: ${avgWordLength.toFixed(1)})`,
        autoFixable: false,
      })
    }

    if (levelCategory === 'pre-k' && words.length > 10) {
      issues.push({
        id: `readability-long-question-${problem.id}`,
        type: 'readability',
        severity: 'info',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `Question may be too long for Pre-K level (${words.length} words)`,
        autoFixable: false,
      })
    }

    return issues
  },
}

export default ReadabilityValidator
