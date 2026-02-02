/**
 * AI Response Parsing Utilities
 *
 * Helper functions for parsing AI model responses.
 */

/**
 * Parse JSON from AI response text
 *
 * Handles common issues:
 * - Markdown code blocks (```json ... ```)
 * - Extra whitespace
 * - Partial JSON in text
 */
export function parseAIResponse<T>(text: string): T {
  // Remove markdown code blocks if present
  let cleaned = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim();

  // Try to parse directly
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract JSON object or array from text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // Continue to error
      }
    }

    throw new Error(`Could not parse AI response as JSON: ${text.substring(0, 200)}...`);
  }
}

/**
 * Safely extract text content from AI response
 */
export function extractTextContent(
  response: { content: Array<{ type: string; text?: string }> }
): string {
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || !textBlock.text) {
    throw new Error('No text content in AI response');
  }
  return textBlock.text;
}

/**
 * Validate extracted problems have required fields
 */
export function validateExtractedProblems(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.problems)) return false;

  return obj.problems.every((p: unknown) => {
    if (!p || typeof p !== 'object') return false;
    const problem = p as Record<string, unknown>;
    return (
      typeof problem.problem_text === 'string' &&
      typeof problem.problem_type === 'string' &&
      typeof problem.difficulty === 'string' &&
      typeof problem.grade_level === 'string' &&
      typeof problem.confidence === 'number'
    );
  });
}

/**
 * Validate explanation structure
 */
export function validateExplanation(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;
  return (
    typeof obj.greeting === 'string' &&
    typeof obj.the_mistake === 'string' &&
    Array.isArray(obj.steps) &&
    typeof obj.correct_answer === 'string' &&
    typeof obj.encouragement === 'string'
  );
}

/**
 * Validate evaluation results
 */
export function validateEvaluationResults(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.evaluations)) return false;
  if (!obj.summary || typeof obj.summary !== 'object') return false;

  return obj.evaluations.every((e: unknown) => {
    if (!e || typeof e !== 'object') return false;
    const evaluation = e as Record<string, unknown>;
    return (
      typeof evaluation.problem_index === 'number' &&
      typeof evaluation.is_correct === 'boolean'
    );
  });
}

/**
 * Clean up problem text for display
 */
export function cleanProblemText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\d+\.\s*/, ''); // Remove leading problem number if present
}

/**
 * Normalize answer for comparison
 */
export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[,\$]/g, ''); // Remove commas and dollar signs
}

/**
 * Check if two answers are equivalent
 */
export function answersAreEquivalent(a: string, b: string): boolean {
  const normA = normalizeAnswer(a);
  const normB = normalizeAnswer(b);

  // Direct match
  if (normA === normB) return true;

  // Try numeric comparison
  const numA = parseFloat(normA);
  const numB = parseFloat(normB);
  if (!isNaN(numA) && !isNaN(numB) && Math.abs(numA - numB) < 0.0001) {
    return true;
  }

  // Check fraction equivalence (e.g., "1/2" vs "0.5")
  const fractionA = parseFraction(normA);
  const fractionB = parseFraction(normB);
  if (fractionA !== null && fractionB !== null && Math.abs(fractionA - fractionB) < 0.0001) {
    return true;
  }

  return false;
}

/**
 * Parse a fraction string to a number
 */
function parseFraction(text: string): number | null {
  const fractionMatch = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fractionMatch) {
    const [, num, denom] = fractionMatch;
    const denomNum = parseInt(denom, 10);
    if (denomNum === 0) return null;
    return parseInt(num, 10) / denomNum;
  }
  const num = parseFloat(text);
  return isNaN(num) ? null : num;
}
