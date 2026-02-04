/**
 * Anthropic AI Service
 *
 * Production implementation using the Anthropic API.
 * Uses Claude Haiku for fast tasks and Claude Sonnet for student-facing content.
 *
 * NOTE: This service is NOT RECOMMENDED for production use.
 * Use Edge Functions (VITE_AI_MODE=edge) instead to keep API keys secure.
 * This file has type checking disabled due to SDK type incompatibilities.
 */

// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

import Anthropic from '@anthropic-ai/sdk';
import type {
  ExtractedProblem,
  GeneratedProblem,
  MsGuideExplanation,
  ChatMessage,
  ProblemContext,
  ClassifiedProblems,
  EvaluationResult,
  BatchEvaluationResult,
  ImageQualityAssessment,
} from '../../types/homework';

import type {
  MsGuideServiceInterface,
  GenerateTestOptions,
  AIUsageData,
  ExtractedTemplateResult,
} from './types';

import { MS_GUIDE_SYSTEM_PROMPT } from './prompts/msGuideSystemPrompt';
import { buildExtractionPrompt } from './prompts/extractionPrompt';
import { buildExplanationPrompt } from './prompts/explanationPrompt';
import { buildChatPrompt } from './prompts/chatPrompt';
import { buildBatchEvaluationPrompt } from './prompts/evaluationPrompt';
import { buildSimilarProblemPrompt } from './prompts/generationPrompt';
import { parseAIResponse } from './utils/parseAIResponse';

/**
 * Model IDs for different tasks
 */
const MODELS = {
  // Fast model for backend tasks
  fast: 'claude-haiku-4-5-20251001',
  // Smart model for student-facing content
  smart: 'claude-sonnet-4-5-20250929',
};

/**
 * Anthropic AI Service Implementation
 */
export class AnthropicAIService implements MsGuideServiceInterface {
  private client: Anthropic;
  private onUsage?: (usage: AIUsageData) => void;

  constructor(apiKey: string, onUsage?: (usage: AIUsageData) => void) {
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
    this.onUsage = onUsage;
  }

  /**
   * Track API usage
   */
  private trackUsage(
    feature: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    responseTimeMs: number,
    success: boolean,
    errorMessage?: string
  ): void {
    if (this.onUsage) {
      this.onUsage({
        feature,
        model,
        inputTokens,
        outputTokens,
        responseTimeMs,
        success,
        errorMessage,
      });
    }
  }

  /**
   * Make an API call with retry logic
   */
  private async callAPI(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 4096,
    temperature: number = 0.7
  ): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.client.messages.create({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });

        const textContent = response.content.find((c) => c.type === 'text');
        const content = textContent?.type === 'text' ? textContent.text : '';

        return {
          content,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        };
      } catch (error) {
        lastError = error as Error;

        // Check if it's a rate limit error
        if ((error as { status?: number }).status === 429) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('API call failed after retries');
  }

  /**
   * Make a vision API call for image analysis
   */
  private async callVisionAPI(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    imageUrls: string[],
    maxTokens: number = 4096
  ): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
    // Build content with images
    const content: Array<{ type: 'image'; source: { type: 'base64' | 'url'; media_type?: string; data?: string; url?: string } } | { type: 'text'; text: string }> = [];

    // Add images
    for (const url of imageUrls) {
      // If it's a blob URL, we need to convert to base64
      if (url.startsWith('blob:')) {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await this.blobToBase64(blob);
        const mediaType = blob.type || 'image/jpeg';

        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: base64,
          },
        });
      } else {
        // Regular URL
        content.push({
          type: 'image',
          source: {
            type: 'url',
            url,
          },
        });
      }
    }

    // Add the text prompt
    content.push({
      type: 'text',
      text: userPrompt,
    });

    const response = await this.client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const textResult = textContent?.type === 'text' ? textContent.text : '';

    return {
      content: textResult,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Extract problems from images
   */
  async extractProblems(imageUrls: string[]): Promise<ExtractedProblem[]> {
    const startTime = Date.now();

    try {
      const prompt = buildExtractionPrompt();
      const { content, inputTokens, outputTokens } = await this.callVisionAPI(
        MODELS.fast,
        'You are an expert at reading and extracting math problems from images.',
        prompt,
        imageUrls
      );

      const problems = parseAIResponse<ExtractedProblem[]>(content);

      this.trackUsage(
        'extractProblems',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return problems || [];
    } catch (error) {
      this.trackUsage(
        'extractProblems',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Assess image quality
   */
  async assessImageQuality(imageUrl: string): Promise<ImageQualityAssessment> {
    const startTime = Date.now();

    try {
      const prompt = `Analyze this image for math homework extraction quality.
Return JSON with:
{
  "is_math_content": boolean,
  "is_readable": boolean,
  "estimated_problem_count": number,
  "quality_score": number (0-1),
  "issues": string[],
  "recommendation": "proceed" | "retry" | "skip"
}`;

      const { content, inputTokens, outputTokens } = await this.callVisionAPI(
        MODELS.fast,
        'You assess image quality for math problem extraction.',
        prompt,
        [imageUrl],
        1024
      );

      const assessment = parseAIResponse<ImageQualityAssessment>(content);

      this.trackUsage(
        'assessImageQuality',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return assessment || {
        is_math_content: false,
        is_readable: false,
        estimated_problem_count: 0,
        quality_score: 0,
        issues: ['Failed to assess'],
        recommendation: 'retry',
      };
    } catch (error) {
      this.trackUsage(
        'assessImageQuality',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Classify problems by topic
   */
  async classifyProblems(problems: ExtractedProblem[]): Promise<ClassifiedProblems> {
    const startTime = Date.now();

    try {
      const prompt = `Classify these math problems by topic:

${JSON.stringify(problems, null, 2)}

Return JSON with:
{
  "problem_classifications": [{
    "problem_index": number,
    "primary_topic": string,
    "secondary_topics": string[],
    "prerequisite_skills": string[]
  }],
  "topic_summary": { [topic: string]: number },
  "recommended_focus_areas": string[]
}`;

      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You classify math problems by topic.',
        prompt,
        2048,
        0
      );

      const classified = parseAIResponse<ClassifiedProblems>(content);

      this.trackUsage(
        'classifyProblems',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return classified || {
        problem_classifications: [],
        topic_summary: {},
        recommended_focus_areas: [],
      };
    } catch (error) {
      this.trackUsage(
        'classifyProblems',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Generate a similar problem
   */
  async generateSimilar(problem: ExtractedProblem): Promise<GeneratedProblem> {
    const startTime = Date.now();

    try {
      const prompt = buildSimilarProblemPrompt(problem);
      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You generate math practice problems.',
        prompt,
        1024,
        0.5
      );

      const generated = parseAIResponse<GeneratedProblem>(content);

      this.trackUsage(
        'generateSimilar',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return generated || {
        index: 0,
        problem_text: 'Error generating problem',
        problem_type: problem.problem_type,
        difficulty: problem.difficulty,
        source_topic: problem.problem_type,
        answer: '',
        solution_steps: [],
      };
    } catch (error) {
      this.trackUsage(
        'generateSimilar',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Generate a practice test
   */
  async generatePracticeTest(
    problems: ExtractedProblem[],
    count: number,
    options: GenerateTestOptions
  ): Promise<GeneratedProblem[]> {
    const startTime = Date.now();

    try {
      const prompt = `Generate ${count} practice problems based on these examples:

${JSON.stringify(problems.slice(0, 10), null, 2)}

Options: ${JSON.stringify(options)}

Return a JSON array of problems, each with:
{
  "index": number,
  "problem_text": string,
  "problem_type": string,
  "difficulty": "easy" | "medium" | "hard",
  "source_topic": string,
  "answer": string,
  "solution_steps": string[]
}`;

      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You generate math practice tests.',
        prompt,
        4096,
        0.5
      );

      const generated = parseAIResponse<GeneratedProblem[]>(content);

      this.trackUsage(
        'generatePracticeTest',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return generated || [];
    } catch (error) {
      this.trackUsage(
        'generatePracticeTest',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Evaluate answers in batch
   */
  async evaluateAnswers(
    problems: GeneratedProblem[],
    answers: string[]
  ): Promise<BatchEvaluationResult> {
    const startTime = Date.now();

    try {
      const prompt = buildBatchEvaluationPrompt(problems, answers);
      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You evaluate math answers.',
        prompt,
        2048,
        0
      );

      const result = parseAIResponse<BatchEvaluationResult>(content);

      this.trackUsage(
        'evaluateAnswers',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return result || {
        evaluations: [],
        summary: { total: problems.length, correct: 0, incorrect: problems.length },
      };
    } catch (error) {
      this.trackUsage(
        'evaluateAnswers',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Evaluate a single answer
   */
  async evaluateSingleAnswer(
    problemText: string,
    correctAnswer: string,
    studentAnswer: string
  ): Promise<EvaluationResult> {
    const startTime = Date.now();

    try {
      const prompt = `Evaluate this math answer:
Problem: ${problemText}
Correct answer: ${correctAnswer}
Student answer: ${studentAnswer}

Return JSON:
{
  "is_correct": boolean,
  "error_type": "calculation_error" | "conceptual_error" | "wrong_operation" | null,
  "brief_note": string | null
}`;

      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You evaluate math answers.',
        prompt,
        512,
        0
      );

      const result = parseAIResponse<{
        is_correct: boolean;
        error_type?: string;
        brief_note?: string;
      }>(content);

      this.trackUsage(
        'evaluateSingleAnswer',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return {
        problem_index: 0,
        is_correct: result?.is_correct ?? false,
        student_answer: studentAnswer,
        correct_answer: correctAnswer,
        error_type: result?.error_type,
        brief_note: result?.brief_note,
      };
    } catch (error) {
      this.trackUsage(
        'evaluateSingleAnswer',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Generate Ms. Guide explanation
   */
  async explainConcept(
    problem: ExtractedProblem | GeneratedProblem,
    studentAnswer: string,
    correctAnswer: string,
    gradeLevel: string
  ): Promise<MsGuideExplanation> {
    const startTime = Date.now();

    try {
      const prompt = buildExplanationPrompt(problem, studentAnswer, correctAnswer, gradeLevel);
      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.smart,
        MS_GUIDE_SYSTEM_PROMPT,
        prompt,
        4096,
        0.7
      );

      const explanation = parseAIResponse<MsGuideExplanation>(content);

      this.trackUsage(
        'explainConcept',
        MODELS.smart,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return explanation || {
        greeting: "Let's work through this together!",
        what_they_did_right: null,
        the_mistake: 'There seems to be an error.',
        steps: [],
        correct_answer: correctAnswer || 'See steps',
        encouragement: 'Keep practicing!',
        misconception_tag: 'unknown',
      };
    } catch (error) {
      this.trackUsage(
        'explainConcept',
        MODELS.smart,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Chat with Ms. Guide
   */
  async chat(
    history: ChatMessage[],
    question: string,
    context: ProblemContext
  ): Promise<string> {
    const startTime = Date.now();

    try {
      const prompt = buildChatPrompt(history, question, context);
      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.smart,
        MS_GUIDE_SYSTEM_PROMPT,
        prompt,
        2048,
        0.7
      );

      this.trackUsage(
        'chat',
        MODELS.smart,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return content || "I'm here to help! Could you rephrase your question?";
    } catch (error) {
      this.trackUsage(
        'chat',
        MODELS.smart,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Generate audio (placeholder - use external TTS service)
   */
  async generateAudio(_text: string): Promise<string> {
    // Anthropic doesn't provide TTS
    // Use browser's built-in speech synthesis or Google Cloud TTS
    return '';
  }

  /**
   * Extract a reusable template from a problem (ONE-TIME LLM cost)
   */
  async extractProblemTemplate(
    problemText: string,
    gradeLevel: string
  ): Promise<ExtractedTemplateResult | null> {
    const startTime = Date.now();

    try {
      const prompt = `Analyze this math problem and extract a template for generating similar problems.

Problem: ${problemText}
Grade Level: ${gradeLevel}

Return a JSON object with the following structure:
{
  "problem_type": "addition" | "subtraction" | "multiplication" | "division" | "fractions" | "decimals" | "percentages" | "algebra" | "geometry" | "word_problem" | "order_of_operations",
  "subtype": string or null (e.g., "two_digit_no_carry", "same_denominator", etc.),
  "grade_level": "${gradeLevel}",
  "template_pattern": {
    "format": "horizontal" | "vertical" | "expression" | "word",
    "operand_ranges": [
      { "min": number, "max": number, "type": "integer" | "decimal" | "fraction" }
    ],
    "operators": ["+", "-", "*", "/"],
    "constraints": {
      "no_negative_results": boolean,
      "no_remainders": boolean,
      "same_denominator": boolean,
      "common_denominators": [2, 4, 8] // example
    },
    "word_problem_template": "{{name}} had {{num1}} {{object}}. They got {{num2}} more. How many total?" // if word problem
  },
  "hint_templates": [
    "Start with {{num1}}",
    "Think about what operation to use"
  ],
  "solution_step_templates": [
    "First, {{num1}} + {{num2}}",
    "The answer is {{answer}}"
  ]
}

IMPORTANT:
- Analyze the numbers in the problem to determine appropriate min/max ranges
- For word problems, create a template with {{name}}, {{num1}}, {{num2}}, {{object}} placeholders
- Include 2-3 helpful hints appropriate for grade ${gradeLevel}
- Include step-by-step solution templates with placeholders`;

      const { content, inputTokens, outputTokens } = await this.callAPI(
        MODELS.fast,
        'You are an expert at analyzing math problems and extracting reusable patterns.',
        prompt,
        2048,
        0
      );

      const result = parseAIResponse<ExtractedTemplateResult>(content);

      this.trackUsage(
        'extractProblemTemplate',
        MODELS.fast,
        inputTokens,
        outputTokens,
        Date.now() - startTime,
        true
      );

      return result;
    } catch (error) {
      this.trackUsage(
        'extractProblemTemplate',
        MODELS.fast,
        0,
        0,
        Date.now() - startTime,
        false,
        (error as Error).message
      );
      console.error('Error extracting problem template:', error);
      return null;
    }
  }
}

/**
 * Create Anthropic AI service instance
 */
export function createAnthropicAIService(
  apiKey: string,
  onUsage?: (usage: AIUsageData) => void
): MsGuideServiceInterface {
  return new AnthropicAIService(apiKey, onUsage);
}
