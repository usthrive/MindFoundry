/**
 * Best Brains-inspired module — deterministic weekly-pack generator surface.
 *
 * Public API (consumed by session screens in increment 3):
 *  - generatePack(level, week, packSeed, contentVersion?) → WeeklyConceptPack
 *  - getPackDay(pack, day) → PackDay ("today's" content slice)
 *  - validatePack(pack) → { valid, violations } (QG-1..QG-10 + structural)
 *  - AVAILABLE_WEEKS / GENERATED_WEEKS / FIXTURE_WEEKS / hasPackContent
 */

export {
  AVAILABLE_WEEKS,
  CONTENT_VERSION,
  GENERATED_WEEKS,
  generatePack,
  getPackDay,
  hasPackContent,
} from './packGenerator';
export { validatePack } from './validator';
export type { ValidationResult, Violation } from './validator';
export { FIXTURE_WEEKS, getFixture } from './fixtures';
export { Rng, streamRng } from './rng';
export { TEMPLATE_REGISTRY, getTemplate } from './templates/registry';
export type { TemplateDef } from './templates/registry';
export { numericTokens, surfaceSignature, commutedSignature } from './surface';
