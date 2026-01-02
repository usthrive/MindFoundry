import type { 
  CurriculumSpec, 
  TestProblem, 
  TestResult, 
  Issue, 
  Validator, 
  QAConfig,
  QAReport,
  LevelSpec,
  WorksheetRange 
} from './types'
import { allValidators } from './validators'

export class ProblemTester {
  private curriculum: CurriculumSpec
  private validators: Validator[]
  private config: QAConfig
  private generateProblem: (level: string, worksheet: number) => TestProblem

  constructor(
    curriculum: CurriculumSpec,
    generateProblem: (level: string, worksheet: number) => TestProblem,
    config: Partial<QAConfig> = {}
  ) {
    this.curriculum = curriculum
    this.generateProblem = generateProblem
    this.config = {
      curriculum: curriculum.name,
      problemsPerRange: 10,
      autoFix: false,
      reviewFixes: false,
      dryRun: false,
      validators: {
        visual: { enabled: true },
        math: { enabled: true },
        curriculum: { enabled: true },
        consistency: { enabled: true },
        readability: { enabled: true },
      },
      outputFormat: 'console',
      ...config,
    }
    this.validators = this.getEnabledValidators()
  }

  private getEnabledValidators(): Validator[] {
    return allValidators.filter(v => {
      const config = this.config.validators[v.type as keyof typeof this.config.validators]
      return config?.enabled !== false
    })
  }

  private validateProblem(problem: TestProblem): Issue[] {
    const issues: Issue[] = []
    for (const validator of this.validators) {
      try {
        const validatorIssues = validator.validate(problem, this.curriculum)
        issues.push(...validatorIssues)
      } catch (error) {
        issues.push({
          id: `validator-error-${validator.name}-${problem.id}`,
          type: validator.type,
          severity: 'error',
          level: problem.level,
          worksheet: problem.worksheetNumber,
          problemType: problem.type,
          description: `Validator ${validator.name} threw error: ${error instanceof Error ? error.message : String(error)}`,
          autoFixable: false,
        })
      }
    }
    return issues
  }

  testWorksheetRange(level: string, range: WorksheetRange): TestResult {
    const issues: Issue[] = []
    let problemsGenerated = 0
    let problemsTested = 0

    for (let i = 0; i < this.config.problemsPerRange; i++) {
      const worksheet = range.start + Math.floor(Math.random() * (range.end - range.start + 1))
      
      try {
        const problem = this.generateProblem(level, worksheet) as TestProblem
        problemsGenerated++
        
        const problemIssues = this.validateProblem(problem)
        issues.push(...problemIssues)
        problemsTested++
      } catch (error) {
        issues.push({
          id: `generator-error-${level}-${worksheet}-${i}`,
          type: 'consistency',
          severity: 'error',
          level,
          worksheet,
          problemType: 'unknown',
          description: `Generator threw error: ${error instanceof Error ? error.message : String(error)}`,
          autoFixable: false,
        })
      }
    }

    const hasErrors = issues.some(i => i.severity === 'error')

    return {
      level,
      worksheetRange: range,
      problemsGenerated,
      problemsTested,
      issues,
      passed: !hasErrors,
    }
  }

  testLevel(levelSpec: LevelSpec): TestResult[] {
    const results: TestResult[] = []
    
    for (const range of levelSpec.worksheetRanges) {
      const result = this.testWorksheetRange(levelSpec.level, range)
      results.push(result)
    }

    return results
  }

  testAllLevels(): QAReport {
    const results: TestResult[] = []
    const levels = this.config.levels 
      ? this.curriculum.levels.filter(l => this.config.levels!.includes(l.level))
      : this.curriculum.levels

    for (const levelSpec of levels) {
      const levelResults = this.testLevel(levelSpec)
      results.push(...levelResults)
    }

    const allIssues = results.flatMap(r => r.issues)
    const issuesByType = {
      visual: allIssues.filter(i => i.type === 'visual').length,
      math: allIssues.filter(i => i.type === 'math').length,
      curriculum: allIssues.filter(i => i.type === 'curriculum').length,
      consistency: allIssues.filter(i => i.type === 'consistency').length,
      readability: allIssues.filter(i => i.type === 'readability').length,
    }
    const issuesBySeverity = {
      error: allIssues.filter(i => i.severity === 'error').length,
      warning: allIssues.filter(i => i.severity === 'warning').length,
      info: allIssues.filter(i => i.severity === 'info').length,
    }

    const levelsPassed = new Set(results.filter(r => r.passed).map(r => r.level)).size
    const levelsFailed = new Set(results.filter(r => !r.passed).map(r => r.level)).size

    return {
      curriculum: this.curriculum.name,
      timestamp: new Date(),
      totalLevels: levels.length,
      levelsPassed,
      levelsFailed,
      totalIssues: allIssues.length,
      issuesByType,
      issuesBySeverity,
      results,
      fixesApplied: 0,
      fixesFailed: 0,
    }
  }

  getAutoFixableIssues(report: QAReport): Issue[] {
    return report.results
      .flatMap(r => r.issues)
      .filter(i => i.autoFixable && i.suggestedFix)
  }
}

export default ProblemTester
