export type KumonLevel = 
  | '7A' | '6A' | '5A' | '4A' | '3A' | '2A'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K'
  | 'L' | 'M' | 'N' | 'O'
  | 'XV' | 'XM' | 'XP' | 'XS'

export interface WorksheetRange {
  start: number
  end: number
  type: string
  description: string
  expectedSkills: string[]
}

export interface LevelSpec {
  level: string
  name: string
  gradeRange: string
  totalWorksheets: number
  sct: string
  worksheetRanges: WorksheetRange[]
}

export interface CurriculumSpec {
  name: string
  version: string
  levels: LevelSpec[]
  getExpectedSkills(level: string, worksheet: number): string[]
  getWorksheetRange(level: string, worksheet: number): WorksheetRange | null
  validateProblemType(level: string, worksheet: number, problemType: string): boolean
}

export type IssueType = 'visual' | 'math' | 'curriculum' | 'consistency' | 'readability'
export type IssueSeverity = 'error' | 'warning' | 'info'

export interface CodeFix {
  file: string
  oldCode: string
  newCode: string
  explanation: string
  lineNumber?: number
}

export interface Issue {
  id: string
  type: IssueType
  severity: IssueSeverity
  level: string
  worksheet: number
  problemType: string
  description: string
  file?: string
  lineNumber?: number
  suggestedFix?: CodeFix
  autoFixable: boolean
}

export interface ValidationResult {
  valid: boolean
  issues: Issue[]
}

export interface TestProblem {
  id: string
  level: string
  worksheetNumber: number
  type: string
  subtype: string
  question: string | { text: string }
  correctAnswer: number | string | { numerator: number; denominator: number }
  operands?: number[]
  visualAssets?: string[]
  displayFormat?: string
  hints?: string[]
}

export interface TestResult {
  level: string
  worksheetRange: WorksheetRange
  problemsGenerated: number
  problemsTested: number
  issues: Issue[]
  passed: boolean
}

export interface QAReport {
  curriculum: string
  timestamp: Date
  totalLevels: number
  levelsPassed: number
  levelsFailed: number
  totalIssues: number
  issuesByType: Record<IssueType, number>
  issuesBySeverity: Record<IssueSeverity, number>
  results: TestResult[]
  fixesApplied: number
  fixesFailed: number
}

export interface ValidatorConfig {
  enabled: boolean
  strictMode?: boolean
}

export interface QAConfig {
  curriculum: string
  levels?: string[]
  worksheetRanges?: { level: string; start: number; end: number }[]
  problemsPerRange: number
  autoFix: boolean
  reviewFixes: boolean
  dryRun: boolean
  validators: {
    visual: ValidatorConfig
    math: ValidatorConfig
    curriculum: ValidatorConfig
    consistency: ValidatorConfig
    readability: ValidatorConfig
  }
  outputFormat: 'console' | 'html' | 'json'
  outputPath?: string
}

export interface Validator {
  name: string
  type: IssueType
  validate(problem: TestProblem, spec: CurriculumSpec): Issue[]
}

export interface Fixer {
  name: string
  canFix(issue: Issue): boolean
  fix(issue: Issue): Promise<{ success: boolean; message: string }>
}
