import type { Validator, Issue, TestProblem, CurriculumSpec } from '../types'

function computeExpectedAnswer(
  operands: number[] | undefined,
  problemType: string
): number | null {
  if (!operands || operands.length < 2) return null

  const [a, b] = operands

  switch (problemType) {
    case 'addition':
      return a + b
    case 'subtraction':
      return a - b
    case 'multiplication':
      return a * b
    case 'division':
      return b !== 0 ? a / b : null
    default:
      return null
  }
}

function getAnswerAsNumber(answer: TestProblem['correctAnswer']): number | null {
  if (typeof answer === 'number') return answer
  if (typeof answer === 'string') {
    const parsed = parseFloat(answer)
    return isNaN(parsed) ? null : parsed
  }
  if (typeof answer === 'object' && 'numerator' in answer && 'denominator' in answer) {
    return answer.numerator / answer.denominator
  }
  return null
}

function isMissingValueProblem(question: string | { text: string } | undefined): boolean {
  if (!question) return false
  const text = typeof question === 'string' ? question : question.text
  return text.includes('___') && text.includes('=')
}

export const MathValidator: Validator = {
  name: 'MathValidator',
  type: 'math',

  validate(problem: TestProblem, _spec: CurriculumSpec): Issue[] {
    const issues: Issue[] = []

    if (!problem.operands || problem.operands.length < 2) {
      return issues
    }

    const basicTypes = ['addition', 'subtraction', 'multiplication', 'division']
    if (!basicTypes.includes(problem.type)) {
      return issues
    }

    if (isMissingValueProblem(problem.question)) {
      return issues
    }

    const computed = computeExpectedAnswer(problem.operands, problem.type)
    const stated = getAnswerAsNumber(problem.correctAnswer)

    if (computed === null || stated === null) {
      return issues
    }

    const tolerance = 0.0001
    if (Math.abs(computed - stated) > tolerance) {
      const operatorSymbols: Record<string, string> = {
        addition: '+',
        subtraction: '-',
        multiplication: '×',
        division: '÷',
      }
      const op = operatorSymbols[problem.type] || '?'

      issues.push({
        id: `math-error-${problem.id}`,
        type: 'math',
        severity: 'error',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `Math error: ${problem.operands[0]} ${op} ${problem.operands[1]} = ${stated} (should be ${computed})`,
        suggestedFix: {
          file: `src/services/generators/**/${problem.level.toLowerCase()}.ts`,
          oldCode: `correctAnswer: ${stated}`,
          newCode: `correctAnswer: ${computed}`,
          explanation: `Fix the answer computation in the generator for ${problem.type} problems`,
        },
        autoFixable: true,
      })
    }

    return issues
  },
}

export default MathValidator
