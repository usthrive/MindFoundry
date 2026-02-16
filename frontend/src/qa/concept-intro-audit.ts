#!/usr/bin/env node

/**
 * Concept Introduction Audit Script
 *
 * Cross-references all three concept intro subsystems:
 *   1. CONCEPT_INTRODUCTION (concept-availability.ts) — which concepts exist at which worksheets
 *   2. CONCEPT_INTRO_CONFIG (conceptAnimationMapping.ts) — animation configs per concept
 *   3. renderAnimation() cases in ConceptIntroModal — which animation types are actually rendered
 *
 * Reports coverage gaps, missing mappings, and orphaned concepts.
 *
 * Usage: npx tsx src/qa/concept-intro-audit.ts
 */

import { CONCEPT_INTRODUCTION, getNewConceptsAtWorksheet } from '../services/generators/concept-availability'
import { CONCEPT_INTRO_CONFIG } from '../services/conceptAnimationMapping'
import { LEVEL_ORDER, LEVEL_WORKSHEETS } from '../services/generators/types'
import type { KumonLevel } from '../services/generators/types'

// Animation types that have actual renderAnimation() switch cases in ConceptIntroModal.tsx
const RENDERED_ANIMATION_TYPES = new Set([
  'counting-objects',
  'number-line-addition',
  'number-line-subtraction',
  'ten-frame',
  'place-value',
  'sequence',
  'array-groups',
  'fair-sharing',
  'long-division-steps',
  'fraction-bar',
  'equivalent-fractions',
  'fraction-operation',
  'algebra-tiles',
  'balance-scale',
  'coordinate-plot',
  // Level I+ placeholders (AlgebraTilesAnimation)
  'foil-visual',
  'factoring-visual',
  'parabola-graph',
  'quadratic-formula',
  'advanced-factoring',
  'discriminant',
  // Level J+ (CoordinatePlotAnimation / LongDivisionStepsAnimation / BalanceScaleAnimation)
  'complex-plane',
  'polynomial-division',
  'proof-steps',
  // Level K+ (CoordinatePlotAnimation)
  'function-graph',
  'function-transform',
  'exponential-graph',
  'exponential-log',
  'rational-function',
  'irrational-function',
  // Level L+ (CoordinatePlotAnimation)
  'limit-approach',
  'tangent-line',
  'area-under-curve',
  'optimization',
  // Level M+ (CoordinatePlotAnimation)
  'unit-circle',
  'trig-graph',
  'triangle-trig',
  // Level N+ (SequenceAnimation / CoordinatePlotAnimation)
  'sequence-series',
  'recurrence-induction',
  'advanced-differentiation',
  // Level O (CoordinatePlotAnimation)
  'curve-analysis',
  'integration-methods',
  'volume-revolution',
])

interface AuditIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO'
  concept: string
  level: string
  worksheet: number
  message: string
}

function runAudit(): void {
  const issues: AuditIssue[] = []
  const allConcepts = Object.entries(CONCEPT_INTRODUCTION)

  console.log('\n=== Concept Introduction Audit ===\n')
  console.log(`Total concepts in CONCEPT_INTRODUCTION: ${allConcepts.length}`)
  console.log(`Total entries in CONCEPT_INTRO_CONFIG: ${Object.keys(CONCEPT_INTRO_CONFIG).length}`)
  console.log(`Rendered animation types: ${RENDERED_ANIMATION_TYPES.size}`)
  console.log('')

  // ─── Check 1: CONCEPT_INTRODUCTION ↔ CONCEPT_INTRO_CONFIG coverage ───
  console.log('--- Check 1: Animation Config Coverage ---\n')

  let withConfig = 0
  let withoutConfig = 0

  for (const [concept, intro] of allConcepts) {
    if (CONCEPT_INTRO_CONFIG[concept]) {
      withConfig++
    } else {
      withoutConfig++
      issues.push({
        severity: 'ERROR',
        concept,
        level: intro.level,
        worksheet: intro.worksheet,
        message: `No CONCEPT_INTRO_CONFIG entry — animation step will be empty`,
      })
    }
  }

  console.log(`  With animation config: ${withConfig}/${allConcepts.length} (${Math.round(withConfig / allConcepts.length * 100)}%)`)
  console.log(`  Missing animation config: ${withoutConfig}`)

  // Check for orphaned configs (in CONCEPT_INTRO_CONFIG but not in CONCEPT_INTRODUCTION)
  const orphanedConfigs: string[] = []
  for (const concept of Object.keys(CONCEPT_INTRO_CONFIG)) {
    if (!CONCEPT_INTRODUCTION[concept]) {
      orphanedConfigs.push(concept)
    }
  }
  if (orphanedConfigs.length > 0) {
    console.log(`  Orphaned configs (in CONCEPT_INTRO_CONFIG but not CONCEPT_INTRODUCTION): ${orphanedConfigs.length}`)
    for (const concept of orphanedConfigs) {
      issues.push({
        severity: 'WARNING',
        concept,
        level: '?',
        worksheet: 0,
        message: `In CONCEPT_INTRO_CONFIG but not in CONCEPT_INTRODUCTION — dead config`,
      })
    }
  }
  console.log('')

  // ─── Check 2: Animation type rendering coverage ───
  console.log('--- Check 2: Animation Rendering Coverage ---\n')

  const usedAnimationTypes = new Set<string>()
  const unrenderedConcepts: Array<{ concept: string; animationType: string; level: string; worksheet: number }> = []

  for (const [concept, config] of Object.entries(CONCEPT_INTRO_CONFIG)) {
    usedAnimationTypes.add(config.animationId)
    if (!RENDERED_ANIMATION_TYPES.has(config.animationId)) {
      const intro = CONCEPT_INTRODUCTION[concept]
      unrenderedConcepts.push({
        concept,
        animationType: config.animationId,
        level: intro?.level || '?',
        worksheet: intro?.worksheet || 0,
      })
      if (intro) {
        issues.push({
          severity: 'WARNING',
          concept,
          level: intro.level,
          worksheet: intro.worksheet,
          message: `Animation type "${config.animationId}" has no renderAnimation() case — will show blank`,
        })
      }
    }
  }

  const renderedTypes = [...usedAnimationTypes].filter(t => RENDERED_ANIMATION_TYPES.has(t))
  const unrenderedTypes = [...usedAnimationTypes].filter(t => !RENDERED_ANIMATION_TYPES.has(t))

  console.log(`  Animation types used in config: ${usedAnimationTypes.size}`)
  console.log(`  Types with renderAnimation() case: ${renderedTypes.length}`)
  console.log(`  Types WITHOUT renderAnimation() case: ${unrenderedTypes.length}`)
  if (unrenderedTypes.length > 0) {
    console.log(`  Unrendered types: ${unrenderedTypes.join(', ')}`)
  }

  // Count concepts with fully working animations
  let fullyWorking = 0
  for (const [concept] of allConcepts) {
    const config = CONCEPT_INTRO_CONFIG[concept]
    if (config && RENDERED_ANIMATION_TYPES.has(config.animationId)) {
      fullyWorking++
    }
  }
  console.log(`\n  Concepts with fully rendered animations: ${fullyWorking}/${allConcepts.length} (${Math.round(fullyWorking / allConcepts.length * 100)}%)`)
  console.log('')

  // ─── Check 3: Worksheet boundary continuity ───
  console.log('--- Check 3: Worksheet Boundary Continuity ---\n')

  const reachedConcepts = new Set<string>()
  const conceptOccurrences: Record<string, Array<{ level: string; worksheet: number }>> = {}

  for (const level of LEVEL_ORDER) {
    const maxWorksheet = LEVEL_WORKSHEETS[level]
    for (let ws = 1; ws <= maxWorksheet; ws++) {
      const newConcepts = getNewConceptsAtWorksheet(level as KumonLevel, ws)
      for (const concept of newConcepts) {
        reachedConcepts.add(concept)
        if (!conceptOccurrences[concept]) {
          conceptOccurrences[concept] = []
        }
        conceptOccurrences[concept].push({ level, worksheet: ws })
      }
    }
  }

  // Check for unreachable concepts
  const unreachable: string[] = []
  for (const [concept] of allConcepts) {
    if (!reachedConcepts.has(concept)) {
      unreachable.push(concept)
      const intro = CONCEPT_INTRODUCTION[concept]
      issues.push({
        severity: 'ERROR',
        concept,
        level: intro.level,
        worksheet: intro.worksheet,
        message: `Concept is defined but never returned by getNewConceptsAtWorksheet() — orphaned`,
      })
    }
  }

  // Check for duplicates (concept returned at multiple worksheets)
  const duplicates: string[] = []
  for (const [concept, occurrences] of Object.entries(conceptOccurrences)) {
    if (occurrences.length > 1) {
      duplicates.push(concept)
      issues.push({
        severity: 'WARNING',
        concept,
        level: occurrences.map(o => o.level).join(', '),
        worksheet: occurrences[0].worksheet,
        message: `Returned at ${occurrences.length} worksheets: ${occurrences.map(o => `${o.level}/${o.worksheet}`).join(', ')}`,
      })
    }
  }

  console.log(`  Concepts reachable via getNewConceptsAtWorksheet: ${reachedConcepts.size}/${allConcepts.length}`)
  console.log(`  Unreachable concepts: ${unreachable.length}`)
  console.log(`  Multi-occurrence concepts: ${duplicates.length}`)
  console.log('')

  // ─── Check 4: Per-level breakdown ───
  console.log('--- Check 4: Per-Level Breakdown ---\n')

  const levelStats: Record<string, { total: number; withConfig: number; withRendered: number }> = {}

  for (const [concept, intro] of allConcepts) {
    if (!levelStats[intro.level]) {
      levelStats[intro.level] = { total: 0, withConfig: 0, withRendered: 0 }
    }
    levelStats[intro.level].total++
    if (CONCEPT_INTRO_CONFIG[concept]) {
      levelStats[intro.level].withConfig++
      if (RENDERED_ANIMATION_TYPES.has(CONCEPT_INTRO_CONFIG[concept].animationId)) {
        levelStats[intro.level].withRendered++
      }
    }
  }

  console.log('  Level | Total | Config | Rendered | Status')
  console.log('  ------|-------|--------|----------|-------')
  for (const level of LEVEL_ORDER) {
    const stats = levelStats[level]
    if (!stats) continue
    const status = stats.withRendered === stats.total ? 'OK' :
      stats.withConfig === stats.total ? 'PARTIAL (unrendered types)' :
        'GAPS'
    console.log(`  ${level.padEnd(5)} | ${String(stats.total).padEnd(5)} | ${String(stats.withConfig).padEnd(6)} | ${String(stats.withRendered).padEnd(8)} | ${status}`)
  }
  console.log('')

  // ─── Summary ───
  console.log('=== Summary ===\n')

  const errors = issues.filter(i => i.severity === 'ERROR')
  const warnings = issues.filter(i => i.severity === 'WARNING')

  console.log(`  ERRORS:   ${errors.length}`)
  console.log(`  WARNINGS: ${warnings.length}`)
  console.log('')

  if (errors.length > 0) {
    console.log('--- ERRORS ---\n')
    for (const issue of errors) {
      console.log(`  [${issue.level}/${issue.worksheet}] ${issue.concept}: ${issue.message}`)
    }
    console.log('')
  }

  if (warnings.length > 0) {
    console.log('--- WARNINGS ---\n')

    // Group by type of warning
    const configWarnings = warnings.filter(w => w.message.includes('renderAnimation'))
    const otherWarnings = warnings.filter(w => !w.message.includes('renderAnimation'))

    if (otherWarnings.length > 0) {
      for (const issue of otherWarnings) {
        console.log(`  [${issue.level}/${issue.worksheet}] ${issue.concept}: ${issue.message}`)
      }
      console.log('')
    }

    if (configWarnings.length > 0) {
      console.log(`  Animation types without renderAnimation() — ${configWarnings.length} concepts affected:`)
      // Group by animation type
      const byType: Record<string, string[]> = {}
      for (const w of configWarnings) {
        const match = w.message.match(/"([^"]+)"/)
        const type = match ? match[1] : 'unknown'
        if (!byType[type]) byType[type] = []
        byType[type].push(`${w.concept} (${w.level}/${w.worksheet})`)
      }
      for (const [type, concepts] of Object.entries(byType)) {
        console.log(`    ${type}:`)
        for (const c of concepts) {
          console.log(`      - ${c}`)
        }
      }
      console.log('')
    }
  }

  // Exit code
  if (errors.length > 0) {
    console.log('AUDIT FAILED\n')
    process.exit(1)
  } else if (warnings.length > 0) {
    console.log('AUDIT PASSED WITH WARNINGS\n')
    process.exit(0)
  } else {
    console.log('AUDIT PASSED\n')
    process.exit(0)
  }
}

runAudit()
