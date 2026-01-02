export * from './types'
export * from './utils'
export * from './concept-availability'

export * from './pre-k'
export * from './elementary-basic'
export * from './elementary-advanced'
export * from './middle-school'
export * from './high-school'
export * from './calculus'
export * from './electives'

import type { KumonLevel, Problem, WorksheetInfo } from './types'
import { generate7AProblem, generate7AProblemSet, get7AWorksheetInfo } from './pre-k'
import { generate6AProblem, generate6AProblemSet, get6AWorksheetInfo } from './pre-k'
import { generate5AProblem, generate5AProblemSet, get5AWorksheetInfo } from './pre-k'
import { generate4AProblem, generate4AProblemSet, get4AWorksheetInfo } from './pre-k'
import { generate3AProblem, generate3AProblemSet, get3AWorksheetInfo } from './elementary-basic'
import { generate2AProblem, generate2AProblemSet, get2AWorksheetInfo } from './elementary-basic'
import { generateAProblem, generateAProblemSet, getAWorksheetInfo } from './elementary-basic'
import { generateBProblem, generateBProblemSet, getBWorksheetInfo } from './elementary-basic'
import { generateCProblem, generateCProblemSet, getCWorksheetInfo } from './elementary-advanced'
import { generateDProblem, generateDProblemSet, getDWorksheetInfo } from './elementary-advanced'
import { generateEProblem, generateEProblemSet, getEWorksheetInfo } from './elementary-advanced'
import { generateFProblem, generateFProblemSet, getFWorksheetInfo } from './elementary-advanced'
import { generateGProblem, generateGProblemSet, getGWorksheetInfo } from './middle-school'
import { generateHProblem, generateHProblemSet, getHWorksheetInfo } from './middle-school'
import { generateIProblem, generateIProblemSet, getIWorksheetInfo } from './middle-school'
import { generateJProblem, generateJProblemSet, getJWorksheetInfo } from './high-school'
import { generateKProblem, generateKProblemSet, getKWorksheetInfo } from './high-school'
import { generateLProblem, generateLProblemSet, getLWorksheetInfo } from './calculus'
import { generateMProblem, generateMProblemSet, getMWorksheetInfo } from './calculus'
import { generateNProblem, generateNProblemSet, getNWorksheetInfo } from './calculus'
import { generateOProblem, generateOProblemSet, getOWorksheetInfo } from './calculus'
import { generateXVProblem, generateXVProblemSet, getXVWorksheetInfo } from './electives'
import { generateXMProblem, generateXMProblemSet, getXMWorksheetInfo } from './electives'
import { generateXPProblem, generateXPProblemSet, getXPWorksheetInfo } from './electives'
import { generateXSProblem, generateXSProblemSet, getXSWorksheetInfo } from './electives'

type GeneratorFunction = (worksheet: number) => Problem
type ProblemSetGenerator = (worksheet: number, count?: number) => Problem[]
type WorksheetInfoGetter = (worksheet: number) => WorksheetInfo

const generators: Record<KumonLevel, GeneratorFunction> = {
  '7A': generate7AProblem,
  '6A': generate6AProblem,
  '5A': generate5AProblem,
  '4A': generate4AProblem,
  '3A': generate3AProblem,
  '2A': generate2AProblem,
  'A': generateAProblem,
  'B': generateBProblem,
  'C': generateCProblem,
  'D': generateDProblem,
  'E': generateEProblem,
  'F': generateFProblem,
  'G': generateGProblem,
  'H': generateHProblem,
  'I': generateIProblem,
  'J': generateJProblem,
  'K': generateKProblem,
  'L': generateLProblem,
  'M': generateMProblem,
  'N': generateNProblem,
  'O': generateOProblem,
  'XV': generateXVProblem,
  'XM': generateXMProblem,
  'XP': generateXPProblem,
  'XS': generateXSProblem,
}

const problemSetGenerators: Record<KumonLevel, ProblemSetGenerator> = {
  '7A': generate7AProblemSet,
  '6A': generate6AProblemSet,
  '5A': generate5AProblemSet,
  '4A': generate4AProblemSet,
  '3A': generate3AProblemSet,
  '2A': generate2AProblemSet,
  'A': generateAProblemSet,
  'B': generateBProblemSet,
  'C': generateCProblemSet,
  'D': generateDProblemSet,
  'E': generateEProblemSet,
  'F': generateFProblemSet,
  'G': generateGProblemSet,
  'H': generateHProblemSet,
  'I': generateIProblemSet,
  'J': generateJProblemSet,
  'K': generateKProblemSet,
  'L': generateLProblemSet,
  'M': generateMProblemSet,
  'N': generateNProblemSet,
  'O': generateOProblemSet,
  'XV': generateXVProblemSet,
  'XM': generateXMProblemSet,
  'XP': generateXPProblemSet,
  'XS': generateXSProblemSet,
}

const worksheetInfoGetters: Record<KumonLevel, WorksheetInfoGetter> = {
  '7A': get7AWorksheetInfo,
  '6A': get6AWorksheetInfo,
  '5A': get5AWorksheetInfo,
  '4A': get4AWorksheetInfo,
  '3A': get3AWorksheetInfo,
  '2A': get2AWorksheetInfo,
  'A': getAWorksheetInfo,
  'B': getBWorksheetInfo,
  'C': getCWorksheetInfo,
  'D': getDWorksheetInfo,
  'E': getEWorksheetInfo,
  'F': getFWorksheetInfo,
  'G': getGWorksheetInfo,
  'H': getHWorksheetInfo,
  'I': getIWorksheetInfo,
  'J': getJWorksheetInfo,
  'K': getKWorksheetInfo,
  'L': getLWorksheetInfo,
  'M': getMWorksheetInfo,
  'N': getNWorksheetInfo,
  'O': getOWorksheetInfo,
  'XV': getXVWorksheetInfo,
  'XM': getXMWorksheetInfo,
  'XP': getXPWorksheetInfo,
  'XS': getXSWorksheetInfo,
}

export function generateProblem(level: KumonLevel, worksheet: number): Problem {
  const generator = generators[level]
  if (!generator) {
    throw new Error(`No generator found for level: ${level}`)
  }
  return generator(worksheet)
}

export function generateProblemSet(level: KumonLevel, worksheet: number, count: number = 10): Problem[] {
  const generator = problemSetGenerators[level]
  if (!generator) {
    throw new Error(`No problem set generator found for level: ${level}`)
  }
  return generator(worksheet, count)
}

export function getWorksheetInfo(level: KumonLevel, worksheet: number): WorksheetInfo {
  const getter = worksheetInfoGetters[level]
  if (!getter) {
    throw new Error(`No worksheet info getter found for level: ${level}`)
  }
  return getter(worksheet)
}

export { generators, problemSetGenerators, worksheetInfoGetters }
