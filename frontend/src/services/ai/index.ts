/**
 * MindFoundry AI Service
 *
 * Factory for creating AI service instances based on environment configuration.
 * Exports all AI-related types, utilities, and prompts.
 *
 * Modes:
 * - 'mock': Use mock data for development (no API calls)
 * - 'edge': Use Supabase Edge Functions (secure, production) - DEFAULT
 * - 'api': Direct Anthropic API calls (NOT recommended - exposes API key)
 */

import { MockAIService } from './mockAIService';
import { AnthropicAIService } from './anthropicAIService';
import { EdgeFunctionAIService } from './edgeFunctionClient';
import type { MsGuideServiceInterface, AIServiceConfig, AIUsageData } from './types';

// Re-export types
export type {
  MsGuideServiceInterface,
  AIServiceConfig,
  AIUsageData,
  GenerateTestOptions,
} from './types';

export {
  DEFAULT_MODEL_CONFIG,
  TEMPERATURE_SETTINGS,
} from './types';

// Re-export prompts
export * from './prompts';

// Re-export utilities
export * from './utils';

// Service instance singleton
let serviceInstance: MsGuideServiceInterface | null = null;
let usageCallback: ((usage: AIUsageData) => void) | null = null;

/**
 * Get the AI mode from environment
 *
 * Modes:
 * - 'mock': Use mock data (development)
 * - 'edge': Use Edge Functions (production, secure) - DEFAULT
 * - 'api': Direct API calls (NOT recommended)
 */
function getAIMode(): 'mock' | 'edge' | 'api' {
  const mode = import.meta.env.VITE_AI_MODE || 'edge';
  if (mode === 'mock') return 'mock';
  if (mode === 'api') return 'api';
  return 'edge'; // Default to edge for security
}

/**
 * Create AI service based on environment configuration
 *
 * Set VITE_AI_MODE=mock for development with mock data
 * Set VITE_AI_MODE=edge for production with Edge Functions (default, secure)
 * Set VITE_AI_MODE=api for direct API calls (NOT recommended)
 */
export function createAIService(config?: Partial<AIServiceConfig>): MsGuideServiceInterface {
  const mode = config?.mode || getAIMode();

  if (mode === 'mock') {
    console.log('[AI] Using Mock AI Service (development mode)');
    return new MockAIService();
  }

  if (mode === 'edge') {
    console.log('[AI] Using Edge Function AI Service (secure production mode)');
    return new EdgeFunctionAIService({ onUsage: config?.onUsage || trackAIUsage });
  }

  // For API mode (NOT recommended - exposes API key)
  const apiKey = config?.apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('[AI] No API key found for direct API mode, falling back to Edge Functions');
    return new EdgeFunctionAIService({ onUsage: config?.onUsage || trackAIUsage });
  }

  console.warn('[AI] Using direct Anthropic API (NOT RECOMMENDED - API key exposed in browser)');
  return new AnthropicAIService(apiKey, config?.onUsage || trackAIUsage);
}

/**
 * Get or create the singleton AI service instance
 */
export function getAIService(): MsGuideServiceInterface {
  if (!serviceInstance) {
    serviceInstance = createAIService();
  }
  return serviceInstance;
}

/**
 * Reset the AI service instance (useful for testing)
 */
export function resetAIService(): void {
  serviceInstance = null;
}

/**
 * Set callback for tracking AI usage
 */
export function setAIUsageCallback(callback: (usage: AIUsageData) => void): void {
  usageCallback = callback;
}

/**
 * Track AI usage (called by service implementations)
 */
export function trackAIUsage(usage: AIUsageData): void {
  if (usageCallback) {
    usageCallback(usage);
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log('[AI Usage]', {
      feature: usage.feature,
      model: usage.model,
      tokens: `${usage.inputTokens} in / ${usage.outputTokens} out`,
      time: `${usage.responseTimeMs}ms`,
      success: usage.success,
    });
  }
}

/**
 * Check if AI features are available
 */
export function isAIAvailable(): boolean {
  const mode = getAIMode();

  // Mock and Edge modes are always available
  if (mode === 'mock' || mode === 'edge') return true;

  // For direct API mode, check if API key is configured
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
}

/**
 * Get current AI configuration
 */
export function getAIConfig(): {
  mode: 'mock' | 'edge' | 'api';
  isAvailable: boolean;
  isSecure: boolean;
  models: {
    extraction: string;
    generation: string;
    evaluation: string;
    explanation: string;
    chat: string;
  };
} {
  const mode = getAIMode();

  return {
    mode,
    isAvailable: isAIAvailable(),
    isSecure: mode !== 'api', // Edge and mock are secure (no API key in browser)
    models: {
      extraction: import.meta.env.VITE_MODEL_EXTRACTION || 'claude-haiku-4-5-20251001',
      generation: import.meta.env.VITE_MODEL_GENERATION || 'claude-haiku-4-5-20251001',
      evaluation: import.meta.env.VITE_MODEL_EVALUATION || 'claude-haiku-4-5-20251001',
      explanation: import.meta.env.VITE_MODEL_EXPLANATION || 'claude-sonnet-4-5-20250929',
      chat: import.meta.env.VITE_MODEL_CHAT || 'claude-sonnet-4-5-20250929',
    },
  };
}
