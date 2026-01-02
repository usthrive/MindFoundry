import type { QAReport, Issue } from '../types'

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
}

function colorize(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.reset}`
}

function formatSeverity(severity: Issue['severity']): string {
  switch (severity) {
    case 'error': return colorize('ERROR', 'red')
    case 'warning': return colorize('WARN', 'yellow')
    case 'info': return colorize('INFO', 'blue')
  }
}

function formatIssueType(type: Issue['type']): string {
  const typeColors: Record<Issue['type'], keyof typeof COLORS> = {
    visual: 'cyan',
    math: 'red',
    curriculum: 'yellow',
    consistency: 'red',
    readability: 'gray',
  }
  return colorize(type.toUpperCase(), typeColors[type])
}

export function generateConsoleReport(report: QAReport): string {
  const lines: string[] = []

  lines.push('')
  lines.push(colorize('╔════════════════════════════════════════════════════════════╗', 'blue'))
  lines.push(colorize(`║  QA Report: ${report.curriculum} Curriculum`, 'blue').padEnd(73) + colorize('║', 'blue'))
  lines.push(colorize(`║  Generated: ${report.timestamp.toLocaleString()}`, 'blue').padEnd(73) + colorize('║', 'blue'))
  lines.push(colorize('╚════════════════════════════════════════════════════════════╝', 'blue'))
  lines.push('')

  lines.push(colorize('Summary', 'bold'))
  lines.push('─'.repeat(60))
  lines.push(`Total Levels Tested: ${report.totalLevels}`)
  lines.push(`  ${colorize('✓', 'green')} Passed: ${report.levelsPassed}`)
  lines.push(`  ${colorize('✗', 'red')} Failed: ${report.levelsFailed}`)
  lines.push('')
  lines.push(`Total Issues: ${report.totalIssues}`)
  lines.push(`  By Type:`)
  lines.push(`    Visual:      ${report.issuesByType.visual}`)
  lines.push(`    Math:        ${report.issuesByType.math}`)
  lines.push(`    Curriculum:  ${report.issuesByType.curriculum}`)
  lines.push(`    Consistency: ${report.issuesByType.consistency}`)
  lines.push(`    Readability: ${report.issuesByType.readability}`)
  lines.push(`  By Severity:`)
  lines.push(`    ${colorize('Errors:', 'red')}   ${report.issuesBySeverity.error}`)
  lines.push(`    ${colorize('Warnings:', 'yellow')} ${report.issuesBySeverity.warning}`)
  lines.push(`    ${colorize('Info:', 'blue')}     ${report.issuesBySeverity.info}`)
  lines.push('')

  const resultsWithIssues = report.results.filter(r => r.issues.length > 0)
  
  if (resultsWithIssues.length > 0) {
    lines.push(colorize('Detailed Issues', 'bold'))
    lines.push('─'.repeat(60))
    
    let currentLevel = ''
    
    for (const result of resultsWithIssues) {
      if (result.level !== currentLevel) {
        currentLevel = result.level
        lines.push('')
        lines.push(colorize(`Level ${currentLevel}`, 'cyan'))
      }
      
      const rangeStr = `${result.worksheetRange.start}-${result.worksheetRange.end}`
      const statusIcon = result.passed ? colorize('✓', 'green') : colorize('✗', 'red')
      lines.push(`  ${statusIcon} Worksheets ${rangeStr}: ${result.worksheetRange.description}`)
      lines.push(`     Type: ${colorize(result.worksheetRange.type, 'gray')}`)
      
      const errorIssues = result.issues.filter(i => i.severity === 'error')
      const warningIssues = result.issues.filter(i => i.severity === 'warning')
      
      for (const issue of errorIssues) {
        lines.push(`     ${formatSeverity(issue.severity)} [${formatIssueType(issue.type)}] ${issue.description}`)
        if (issue.suggestedFix) {
          lines.push(colorize(`        → Fix: ${issue.suggestedFix.explanation}`, 'gray'))
        }
      }
      
      for (const issue of warningIssues) {
        lines.push(`     ${formatSeverity(issue.severity)} [${formatIssueType(issue.type)}] ${issue.description}`)
      }
    }
  }

  lines.push('')
  lines.push('─'.repeat(60))
  
  if (report.fixesApplied > 0) {
    lines.push(colorize(`Fixes Applied: ${report.fixesApplied}`, 'green'))
    if (report.fixesFailed > 0) {
      lines.push(colorize(`Fixes Failed: ${report.fixesFailed}`, 'red'))
    }
  }

  const passRate = report.totalLevels > 0 
    ? ((report.levelsPassed / report.totalLevels) * 100).toFixed(1) 
    : '0'
  
  if (report.levelsFailed === 0) {
    lines.push(colorize(`✓ All levels passed! (${passRate}% pass rate)`, 'green'))
  } else {
    lines.push(colorize(`✗ ${report.levelsFailed} levels have issues (${passRate}% pass rate)`, 'red'))
  }
  lines.push('')

  return lines.join('\n')
}

export function printReport(report: QAReport): void {
  console.log(generateConsoleReport(report))
}

export default { generateConsoleReport, printReport }
