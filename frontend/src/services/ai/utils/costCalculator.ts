/**
 * AI Cost Calculator
 *
 * Utilities for calculating and estimating AI API costs.
 */

import type { ModelCostRates, SessionCostEstimate } from '../../../types/homework';

/**
 * Cost rates per model (per million tokens)
 */
export const MODEL_COST_RATES: Record<string, ModelCostRates> = {
  'claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
  'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00 },
  'claude-opus-4-5-20251101': { input: 15.00, output: 75.00 },
};

/**
 * Google Cloud TTS cost per million characters
 */
export const TTS_COST_PER_MILLION_CHARS = 4.00;

/**
 * Calculate cost for a single AI call
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const rates = MODEL_COST_RATES[model] || MODEL_COST_RATES['claude-sonnet-4-5-20250929'];
  const inputCost = (inputTokens / 1_000_000) * rates.input;
  const outputCost = (outputTokens / 1_000_000) * rates.output;
  return inputCost + outputCost;
}

/**
 * Calculate TTS cost
 */
export function calculateTTSCost(characterCount: number): number {
  return (characterCount / 1_000_000) * TTS_COST_PER_MILLION_CHARS;
}

/**
 * Estimate tokens for text (rough approximation)
 * Claude uses ~4 characters per token on average
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Estimate tokens for an image
 * Claude vision uses approximately 1,334 tokens per image for a typical homework photo
 */
export function estimateImageTokens(imageCount: number): number {
  return imageCount * 1334;
}

/**
 * Estimate cost for Homework Helper session
 */
export function estimateHomeworkHelperCost(
  imageCount: number,
  problemsHelped: number,
  chatMessages: number,
  audioPlays: number
): SessionCostEstimate {
  // Extraction: Haiku with images
  const extractionInputTokens = estimateImageTokens(imageCount) + 500; // prompt
  const extractionOutputTokens = problemsHelped * 100; // ~100 tokens per problem
  const extraction = calculateCost(
    'claude-haiku-4-5-20251001',
    extractionInputTokens,
    extractionOutputTokens
  );

  // Explanations: Sonnet for each problem helped
  const explanationInputTokens = problemsHelped * 400; // context + prompt
  const explanationOutputTokens = problemsHelped * 600; // detailed explanation
  const explanations = calculateCost(
    'claude-sonnet-4-5-20250929',
    explanationInputTokens,
    explanationOutputTokens
  );

  // Chat: Sonnet for follow-up questions
  const chatInputTokens = chatMessages * 800; // growing context
  const chatOutputTokens = chatMessages * 200; // responses
  const chat = calculateCost(
    'claude-sonnet-4-5-20250929',
    chatInputTokens,
    chatOutputTokens
  );

  // Audio: TTS
  const avgCharsPerPlay = 500; // average explanation length
  const audio = calculateTTSCost(audioPlays * avgCharsPerPlay);

  return {
    extraction,
    explanations,
    chat,
    evaluation: 0,
    generation: 0,
    audio,
    total: extraction + explanations + chat + audio,
  };
}

/**
 * Estimate cost for Exam Prep session
 */
export function estimateExamPrepCost(
  imageCount: number,
  problemsGenerated: number,
  wrongAnswers: number,
  chatMessages: number,
  audioPlays: number
): SessionCostEstimate {
  // Extraction: Haiku with images
  const extractionInputTokens = estimateImageTokens(imageCount) + 500;
  const extractionOutputTokens = imageCount * 5 * 100; // ~5 problems per image
  const extraction = calculateCost(
    'claude-haiku-4-5-20251001',
    extractionInputTokens,
    extractionOutputTokens
  );

  // Generation: Haiku for practice test
  const generationInputTokens = 1000 + (extractionOutputTokens / 2); // context + prompt
  const generationOutputTokens = problemsGenerated * 150; // problem + answer + steps
  const generation = calculateCost(
    'claude-haiku-4-5-20251001',
    generationInputTokens,
    generationOutputTokens
  );

  // Evaluation: Haiku batch evaluation
  const evaluationInputTokens = problemsGenerated * 50 + 500; // answers + prompt
  const evaluationOutputTokens = problemsGenerated * 50; // results
  const evaluation = calculateCost(
    'claude-haiku-4-5-20251001',
    evaluationInputTokens,
    evaluationOutputTokens
  );

  // Explanations: Sonnet for wrong answers
  const explanationInputTokens = wrongAnswers * 400;
  const explanationOutputTokens = wrongAnswers * 600;
  const explanations = calculateCost(
    'claude-sonnet-4-5-20250929',
    explanationInputTokens,
    explanationOutputTokens
  );

  // Chat: Sonnet for follow-up questions
  const chatInputTokens = chatMessages * 800;
  const chatOutputTokens = chatMessages * 200;
  const chat = calculateCost(
    'claude-sonnet-4-5-20250929',
    chatInputTokens,
    chatOutputTokens
  );

  // Audio: TTS
  const avgCharsPerPlay = 500;
  const audio = calculateTTSCost(audioPlays * avgCharsPerPlay);

  return {
    extraction,
    explanations,
    chat,
    evaluation,
    generation,
    audio,
    total: extraction + generation + evaluation + explanations + chat + audio,
  };
}

/**
 * Format cost for display (USD)
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `<$0.01`;
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * Check if usage is within expected bounds
 */
export function isUsageNormal(
  feature: string,
  costUSD: number
): { normal: boolean; warning?: string } {
  const thresholds: Record<string, number> = {
    extraction: 0.10,
    explanation: 0.05,
    chat: 0.02,
    evaluation: 0.02,
    generation: 0.05,
    audio: 0.02,
  };

  const threshold = thresholds[feature] || 0.10;

  if (costUSD > threshold) {
    return {
      normal: false,
      warning: `High ${feature} cost: ${formatCost(costUSD)} (threshold: ${formatCost(threshold)})`,
    };
  }

  return { normal: true };
}
