import type { QAReport } from '../types'

export function generateJSONReport(report: QAReport): string {
  return JSON.stringify(report, null, 2)
}

export function saveJSONReport(report: QAReport, outputPath: string): void {
  const fs = require('fs')
  const content = generateJSONReport(report)
  fs.writeFileSync(outputPath, content)
}

export default { generateJSONReport, saveJSONReport }
