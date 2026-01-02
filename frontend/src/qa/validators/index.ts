export { VisualValidator } from './VisualValidator'
export { MathValidator } from './MathValidator'
export { CurriculumValidator } from './CurriculumValidator'
export { ConsistencyValidator } from './ConsistencyValidator'
export { ReadabilityValidator } from './ReadabilityValidator'

import { VisualValidator } from './VisualValidator'
import { MathValidator } from './MathValidator'
import { CurriculumValidator } from './CurriculumValidator'
import { ConsistencyValidator } from './ConsistencyValidator'
import { ReadabilityValidator } from './ReadabilityValidator'
import type { Validator } from '../types'

export const allValidators: Validator[] = [
  VisualValidator,
  MathValidator,
  CurriculumValidator,
  ConsistencyValidator,
  ReadabilityValidator,
]

export default allValidators
