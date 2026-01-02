import * as fs from 'fs'
import * as path from 'path'
import type { Issue } from '../types'

export interface FixResult {
  issue: Issue
  success: boolean
  message: string
  backupPath?: string | null
}

export class FixEngine {
  private projectRoot: string
  private dryRun: boolean
  private backups: Map<string, string> = new Map()

  constructor(projectRoot: string, dryRun: boolean = false) {
    this.projectRoot = projectRoot
    this.dryRun = dryRun
  }

  private resolveFilePath(filePath: string): string {
    if (filePath.includes('**')) {
      const parts = filePath.split('**')
      const basePath = path.join(this.projectRoot, parts[0])
      const pattern = parts[1]
      
      const searchDirs = ['pre-k', 'elementary-basic', 'elementary-advanced', 'middle-school', 'high-school', 'calculus', 'electives']
      
      for (const dir of searchDirs) {
        const candidate = path.join(basePath, dir, pattern.replace(/^\//, ''))
        if (fs.existsSync(candidate)) {
          return candidate
        }
      }
      
      return path.join(this.projectRoot, filePath.replace('**/', ''))
    }
    
    return path.join(this.projectRoot, filePath)
  }

  private createBackup(filePath: string): string | null {
    if (this.backups.has(filePath)) {
      return this.backups.get(filePath)!
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const backupPath = `${filePath}.backup.${Date.now()}`
      
      if (!this.dryRun) {
        fs.writeFileSync(backupPath, content)
      }
      
      this.backups.set(filePath, content)
      return backupPath
    } catch (error) {
      return null
    }
  }

  private restoreBackup(filePath: string): boolean {
    const originalContent = this.backups.get(filePath)
    if (!originalContent) return false

    try {
      fs.writeFileSync(filePath, originalContent)
      return true
    } catch {
      return false
    }
  }

  applyFix(issue: Issue): FixResult {
    if (!issue.suggestedFix) {
      return {
        issue,
        success: false,
        message: 'No suggested fix available',
      }
    }

    const fix = issue.suggestedFix
    const resolvedPath = this.resolveFilePath(fix.file)

    if (!fs.existsSync(resolvedPath)) {
      return {
        issue,
        success: false,
        message: `File not found: ${resolvedPath}`,
      }
    }

    const backupPath = this.createBackup(resolvedPath)
    if (!backupPath && !this.dryRun) {
      return {
        issue,
        success: false,
        message: 'Failed to create backup',
      }
    }

    try {
      const content = fs.readFileSync(resolvedPath, 'utf-8')

      if (!fix.oldCode || !fix.newCode) {
        return {
          issue,
          success: false,
          message: `Fix requires manual intervention: ${fix.explanation}`,
        }
      }

      if (!content.includes(fix.oldCode)) {
        return {
          issue,
          success: false,
          message: `Could not find code to replace: "${fix.oldCode.substring(0, 50)}..."`,
        }
      }

      const newContent = content.replace(fix.oldCode, fix.newCode)

      if (!this.dryRun) {
        fs.writeFileSync(resolvedPath, newContent)
      }

      return {
        issue,
        success: true,
        message: this.dryRun ? '[DRY RUN] Would apply fix' : 'Fix applied successfully',
        backupPath,
      }
    } catch (error) {
      if (!this.dryRun) {
        this.restoreBackup(resolvedPath)
      }
      return {
        issue,
        success: false,
        message: `Error applying fix: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  applyAllFixes(issues: Issue[]): FixResult[] {
    const results: FixResult[] = []
    
    const autoFixable = issues.filter(i => i.autoFixable && i.suggestedFix)

    for (const issue of autoFixable) {
      const result = this.applyFix(issue)
      results.push(result)
    }

    return results
  }

  rollbackAll(): boolean {
    let allSuccess = true
    
    for (const [filePath] of this.backups) {
      if (!this.restoreBackup(filePath)) {
        allSuccess = false
      }
    }

    return allSuccess
  }

  generateFixReport(results: FixResult[]): string {
    const lines: string[] = []
    
    lines.push('\n=== Fix Report ===\n')
    
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    lines.push(`Total fixes attempted: ${results.length}`)
    lines.push(`Successful: ${successful.length}`)
    lines.push(`Failed: ${failed.length}`)
    lines.push('')

    if (successful.length > 0) {
      lines.push('✅ Successfully applied:')
      for (const result of successful) {
        lines.push(`   - ${result.issue.level} (${result.issue.type}): ${result.issue.description.substring(0, 60)}...`)
      }
      lines.push('')
    }

    if (failed.length > 0) {
      lines.push('❌ Failed to apply:')
      for (const result of failed) {
        lines.push(`   - ${result.issue.level} (${result.issue.type}): ${result.message}`)
      }
      lines.push('')
    }

    return lines.join('\n')
  }
}

export default FixEngine
