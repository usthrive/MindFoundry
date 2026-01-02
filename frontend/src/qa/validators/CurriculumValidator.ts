import type { Validator, Issue, TestProblem, CurriculumSpec } from '../types'

function parseAddendFromSkill(skill: string): { exact?: number; min?: number; max?: number } | null {
  const rangeMatch = skill.match(/plus_(\d+)_to_(\d+)/)
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) }
  }
  
  const exactMatch = skill.match(/plus_(\d+)$/)
  if (exactMatch) {
    return { exact: parseInt(exactMatch[1]) }
  }
  
  return null
}

function isAddendValid(addend: number, expectedSkills: string[]): boolean {
  for (const skill of expectedSkills) {
    const parsed = parseAddendFromSkill(skill)
    if (!parsed) continue
    
    if (parsed.exact !== undefined && addend === parsed.exact) {
      return true
    }
    
    if (parsed.min !== undefined && parsed.max !== undefined) {
      if (addend >= parsed.min && addend <= parsed.max) {
        return true
      }
    }
  }
  
  if (expectedSkills.some(s => s.includes('addition_mastery') || s.includes('horizontal_add_sub'))) {
    return true
  }
  
  return false
}

export const CurriculumValidator: Validator = {
  name: 'CurriculumValidator',
  type: 'curriculum',

  validate(problem: TestProblem, spec: CurriculumSpec): Issue[] {
    const issues: Issue[] = []

    const range = spec.getWorksheetRange(problem.level, problem.worksheetNumber)
    if (!range) {
      issues.push({
        id: `curriculum-unknown-range-${problem.id}`,
        type: 'curriculum',
        severity: 'warning',
        level: problem.level,
        worksheet: problem.worksheetNumber,
        problemType: problem.type,
        description: `No curriculum specification found for ${problem.level} worksheet ${problem.worksheetNumber}`,
        autoFixable: false,
      })
      return issues
    }

    const problemSubtype = problem.subtype?.toLowerCase() || problem.type.toLowerCase()
    const expectedType = range.type.toLowerCase()
    const expectedSkills = range.expectedSkills.map(s => s.toLowerCase())

    const typeMatches = problemSubtype.includes(expectedType) || 
                        expectedType.includes(problemSubtype) ||
                        expectedSkills.some(skill => 
                          problemSubtype.includes(skill) || skill.includes(problemSubtype)
                        )

    if (!typeMatches) {
      const isAdditionWhenShouldBeSequence = 
        (problem.type === 'addition' && expectedType.includes('sequence')) ||
        (problem.type === 'addition' && expectedType.includes('count'))

      if (problem.type === 'addition' && problem.operands && problem.operands[1] !== undefined) {
        const addend = problem.operands[1]
        if (isAddendValid(addend, expectedSkills)) {
          return issues
        }
      }

      if (isAdditionWhenShouldBeSequence) {
        issues.push({
          id: `curriculum-wrong-type-${problem.id}`,
          type: 'curriculum',
          severity: 'error',
          level: problem.level,
          worksheet: problem.worksheetNumber,
          problemType: problem.type,
          description: `Problem type "${problem.type}/${problem.subtype}" doesn't match expected "${range.type}" for worksheets ${range.start}-${range.end}`,
          suggestedFix: {
            file: `src/services/generators/**/${problem.level.toLowerCase()}.ts`,
            oldCode: '',
            newCode: '',
            explanation: `Generator should produce "${range.type}" problems for worksheets ${range.start}-${range.end}, not "${problem.type}"`,
          },
          autoFixable: true,
        })
      } else {
        issues.push({
          id: `curriculum-mismatch-${problem.id}`,
          type: 'curriculum',
          severity: 'warning',
          level: problem.level,
          worksheet: problem.worksheetNumber,
          problemType: problem.type,
          description: `Problem subtype "${problem.subtype}" may not align with expected "${range.type}"`,
          autoFixable: false,
        })
      }
    }

    return issues
  },
}

export default CurriculumValidator
