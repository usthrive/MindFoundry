import type { Validator, Issue, TestProblem, CurriculumSpec } from '../types'

function isMissingValueProblem(question: string | { text: string }): boolean {
  const text = typeof question === 'string' ? question : question.text
  return text.includes('___')
}

function isAlgebraicExpression(text: string): boolean {
  return /[a-zA-Z]\s*[+\-*/^]/.test(text) || 
         /[+\-*/^]\s*[a-zA-Z]/.test(text) ||
         /\d+[a-zA-Z]/.test(text) ||
         /[a-zA-Z]\d+/.test(text) ||
         /\([^)]*[a-zA-Z]/.test(text) ||
         text.includes('matrix') ||
         text.includes('transform') ||
         text.includes('solve for')
}

function extractQuestionAnswer(question: string | { text: string }): number | null {
  const text = typeof question === 'string' ? question : question.text
  
  if (isMissingValueProblem({ text })) {
    return null
  }
  
  if (isAlgebraicExpression(text)) {
    return null
  }
  
  const simpleArithmeticMatch = text.match(/^\s*\d+\s*[+\-×÷*/]\s*\d+\s*=\s*(\d+)\s*$/)
  if (simpleArithmeticMatch) {
    return parseInt(simpleArithmeticMatch[1])
  }
  
  return null
}


export const ConsistencyValidator: Validator = {
  name: 'ConsistencyValidator',
  type: 'consistency',

  validate(problem: TestProblem, _spec: CurriculumSpec): Issue[] {
    const issues: Issue[] = []

    if (problem.question) {
      const questionAnswer = extractQuestionAnswer(problem.question)
      if (questionAnswer !== null) {
        const correctAnswer = typeof problem.correctAnswer === 'number' 
          ? problem.correctAnswer 
          : parseFloat(String(problem.correctAnswer))

        if (!isNaN(correctAnswer) && questionAnswer !== correctAnswer) {
          issues.push({
            id: `consistency-question-answer-${problem.id}`,
            type: 'consistency',
            severity: 'error',
            level: problem.level,
            worksheet: problem.worksheetNumber,
            problemType: problem.type,
            description: `Question implies answer ${questionAnswer} but correctAnswer is ${correctAnswer}`,
            suggestedFix: {
              file: `src/services/generators/**/${problem.level.toLowerCase()}.ts`,
              oldCode: '',
              newCode: '',
              explanation: 'Ensure question text and correctAnswer are generated from the same value',
            },
            autoFixable: true,
          })
        }
      }
    }

    if (problem.operands && problem.operands.length >= 2 && problem.type) {
      if (problem.question && isMissingValueProblem(problem.question)) {
        return issues
      }

      const [a, b] = problem.operands
      let computed: number | null = null

      switch (problem.type) {
        case 'addition':
          computed = a + b
          break
        case 'subtraction':
          computed = a - b
          break
        case 'multiplication':
          computed = a * b
          break
        case 'division':
          if (b !== 0) computed = Math.floor(a / b)
          break
      }

      if (computed !== null) {
        const stated = typeof problem.correctAnswer === 'number' 
          ? problem.correctAnswer 
          : parseFloat(String(problem.correctAnswer))

        if (!isNaN(stated) && computed !== stated) {
          issues.push({
            id: `consistency-operands-answer-${problem.id}`,
            type: 'consistency',
            severity: 'error',
            level: problem.level,
            worksheet: problem.worksheetNumber,
            problemType: problem.type,
            description: `Operands [${a}, ${b}] with ${problem.type} should give ${computed}, not ${stated}`,
            suggestedFix: {
              file: `src/services/generators/**/${problem.level.toLowerCase()}.ts`,
              oldCode: `correctAnswer: ${stated}`,
              newCode: `correctAnswer: ${computed}`,
              explanation: 'Fix the correctAnswer computation to match operands',
            },
            autoFixable: true,
          })
        }
      }
    }

    if (!problem.question && !problem.operands) {
      issues.push({
        id: `consistency-missing-content-${problem.id}`,
        type: 'consistency',
        severity: 'warning',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: 'Problem has neither question text nor operands - may not display correctly',
        autoFixable: false,
      })
    }

    const complexTypes = ['matrix', 'transformation', 'reflection', 'rotation', 'scaling', 'linear_algebra', 'transform', 'induction', 'proof', 'formula', 'equation', 'simultaneous', 'system']
    const isComplexProblem = complexTypes.some(t => 
      problem.type.toLowerCase().includes(t) || 
      (problem.subtype?.toLowerCase().includes(t))
    )

    if (problem.displayFormat === 'vertical' && (!problem.operands || problem.operands.length < 2) && !isComplexProblem) {
      issues.push({
        id: `consistency-vertical-no-operands-${problem.id}`,
        type: 'consistency',
        severity: 'error',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: 'Vertical format requires operands array with at least 2 numbers',
        autoFixable: false,
      })
    }

    return issues
  },
}

export default ConsistencyValidator
