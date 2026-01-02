#!/usr/bin/env node

import { ProblemTester } from './ProblemTester'
import { FixEngine } from './fixers/FixEngine'
import { kumonCurriculum } from './curricula/kumon'
import { printReport } from './reporters/ConsoleReporter'
import { saveJSONReport } from './reporters/JSONReporter'
import type { QAConfig, TestProblem } from './types'

function parseArgs(args: string[]): Partial<QAConfig> & { help?: boolean } {
  const config: Partial<QAConfig> & { help?: boolean } = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--help':
      case '-h':
        config.help = true
        break
      case '--curriculum':
      case '-c':
        config.curriculum = args[++i]
        break
      case '--level':
      case '-l':
        config.levels = config.levels || []
        config.levels.push(args[++i])
        break
      case '--all':
      case '-a':
        break
      case '--auto-fix':
      case '-f':
        config.autoFix = true
        break
      case '--review-fixes':
      case '-r':
        config.reviewFixes = true
        break
      case '--dry-run':
      case '-d':
        config.dryRun = true
        break
      case '--output':
      case '-o':
        config.outputFormat = args[++i] as 'console' | 'json' | 'html'
        break
      case '--output-path':
        config.outputPath = args[++i]
        break
      case '--problems':
      case '-n':
        config.problemsPerRange = parseInt(args[++i])
        break
    }
  }
  
  return config
}

function printHelp(): void {
  console.log(`
QA Agent - Math Problem Generator Testing Framework

Usage: npx ts-node src/qa/cli.ts [options]

Options:
  -h, --help           Show this help message
  -c, --curriculum     Curriculum to test against (default: kumon)
  -l, --level          Test specific level(s), can be repeated
  -a, --all            Test all levels (default if no level specified)
  -f, --auto-fix       Automatically apply fixes for detected issues
  -r, --review-fixes   Review each fix before applying
  -d, --dry-run        Show what would be fixed without making changes
  -o, --output         Output format: console, json, html (default: console)
  --output-path        Path for output file (for json/html formats)
  -n, --problems       Number of problems to test per worksheet range (default: 10)

Examples:
  # Test all levels
  npx ts-node src/qa/cli.ts --all

  # Test specific levels
  npx ts-node src/qa/cli.ts -l 6A -l 7A

  # Test and auto-fix issues
  npx ts-node src/qa/cli.ts --all --auto-fix

  # Dry run to see potential fixes
  npx ts-node src/qa/cli.ts --all --auto-fix --dry-run

  # Save JSON report
  npx ts-node src/qa/cli.ts --all -o json --output-path ./qa-report.json
`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const config = parseArgs(args)
  
  if (config.help) {
    printHelp()
    process.exit(0)
  }

  console.log('\n🧪 QA Agent - Math Problem Generator Tester\n')

  const curriculum = kumonCurriculum

  let generateProblem: (level: string, worksheet: number) => TestProblem
  
  try {
    const generators = await import('../services/generators')
    generateProblem = (level: string, worksheet: number) => {
      const problem = generators.generateProblem(level as any, worksheet)
      return problem as unknown as TestProblem
    }
  } catch (error) {
    console.error('Failed to load generators:', error)
    process.exit(1)
  }

  const tester = new ProblemTester(curriculum, generateProblem, {
    problemsPerRange: config.problemsPerRange || 10,
    levels: config.levels,
    autoFix: config.autoFix,
    dryRun: config.dryRun,
  })

  console.log(`Curriculum: ${curriculum.name}`)
  console.log(`Levels: ${config.levels?.join(', ') || 'All'}`)
  console.log(`Problems per range: ${config.problemsPerRange || 10}`)
  console.log(`Auto-fix: ${config.autoFix ? 'Enabled' : 'Disabled'}`)
  if (config.dryRun) console.log('Mode: DRY RUN')
  console.log('')

  console.log('Running tests...\n')
  const report = tester.testAllLevels()

  if (config.autoFix) {
    const fixableIssues = tester.getAutoFixableIssues(report)
    
    if (fixableIssues.length > 0) {
      console.log(`\n🔧 Found ${fixableIssues.length} auto-fixable issues\n`)
      
      const fixEngine = new FixEngine(process.cwd(), config.dryRun)
      const fixResults = fixEngine.applyAllFixes(fixableIssues)
      
      const successful = fixResults.filter(r => r.success)
      const failed = fixResults.filter(r => !r.success)
      
      report.fixesApplied = successful.length
      report.fixesFailed = failed.length
      
      console.log(fixEngine.generateFixReport(fixResults))
    } else {
      console.log('\n✅ No auto-fixable issues found\n')
    }
  }

  switch (config.outputFormat) {
    case 'json':
      if (config.outputPath) {
        saveJSONReport(report, config.outputPath)
        console.log(`Report saved to: ${config.outputPath}`)
      } else {
        console.log(JSON.stringify(report, null, 2))
      }
      break
    case 'html':
      console.log('HTML report not yet implemented')
      break
    default:
      printReport(report)
  }

  process.exit(report.levelsFailed > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
