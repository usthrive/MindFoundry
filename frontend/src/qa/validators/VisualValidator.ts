import type { Validator, Issue, TestProblem, CurriculumSpec, CodeFix } from '../types'

function parseVisualAssetCount(asset: string): number | null {
  const parts = asset.split('_')
  const lastPart = parts[parts.length - 1]
  const count = parseInt(lastPart)
  return isNaN(count) ? null : count
}

function getExpectedAnswerAsNumber(answer: TestProblem['correctAnswer']): number | null {
  if (typeof answer === 'number') return answer
  if (typeof answer === 'string') {
    const parsed = parseFloat(answer)
    return isNaN(parsed) ? null : parsed
  }
  return null
}

export const VisualValidator: Validator = {
  name: 'VisualValidator',
  type: 'visual',

  validate(problem: TestProblem, _spec: CurriculumSpec): Issue[] {
    const issues: Issue[] = []

    if (!problem.visualAssets || problem.visualAssets.length === 0) {
      return issues
    }

    const asset = problem.visualAssets[0]
    const visualCount = parseVisualAssetCount(asset)
    const expectedAnswer = getExpectedAnswerAsNumber(problem.correctAnswer)

    if (visualCount === null) {
      issues.push({
        id: `visual-parse-${problem.id}`,
        type: 'visual',
        severity: 'warning',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `Cannot parse visual asset count from "${asset}"`,
        autoFixable: false,
      })
      return issues
    }

    if (expectedAnswer !== null && visualCount !== expectedAnswer) {
      const suggestedFix: CodeFix = {
        file: 'src/components/ui/VisualDisplay.tsx',
        oldCode: '',
        newCode: '',
        explanation: `Visual shows ${visualCount} items but answer expects ${expectedAnswer}. Either fix the generator to use matching values, or fix VisualDisplay parsing.`,
      }

      if (problem.subtype?.includes('count') || problem.subtype?.includes('dot')) {
        suggestedFix.file = `src/services/generators/**/${problem.level.toLowerCase().replace('a', 'a')}.ts`
        suggestedFix.explanation = `Generator creates mismatched visual (${visualCount}) and answer (${expectedAnswer}). Ensure visualAssets uses the same count as correctAnswer.`
      }

      issues.push({
        id: `visual-mismatch-${problem.id}`,
        type: 'visual',
        severity: 'error',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `Visual shows ${visualCount} items but correct answer is ${expectedAnswer}`,
        suggestedFix,
        autoFixable: true,
      })
    }

    return issues
  },
}

export default VisualValidator
