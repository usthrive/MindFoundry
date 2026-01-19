/**
 * Achievements Module
 * Exports all achievement-related services and utilities
 */

export { achievementService, default as achievementServiceDefault } from './achievementService';
export { celebrationTrigger, default as celebrationTriggerDefault } from './celebrationTrigger';
export {
  generateShareCardBlob,
  default as shareCardGenerator,
} from './shareCardGenerator';

// Re-export types for convenience
export type { SessionResult } from './celebrationTrigger';
