/**
 * AI Service Types
 *
 * Types specific to the AI service layer.
 */

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
  AIModelConfig,
} from '../../types/homework';

/**
 * AI Service Interface
 *
 * Defines all AI operations available for Homework Helper and Exam Prep.
 * Both MockAIService and AnthropicAIService implement this interface.
 */
export interface MsGuideServiceInterface {
  /**
   * Extract math problems from uploaded images
   * @param imageUrls - Array of signed URLs to uploaded images
   * @returns Extracted problems with confidence scores
   */
  extractProblems(imageUrls: string[]): Promise<ExtractedProblem[]>;

  /**
   * Assess image quality before extraction
   * @param imageUrl - Signed URL to image
   * @returns Quality assessment with recommendation
   */
  assessImageQuality(imageUrl: string): Promise<ImageQualityAssessment>;

  /**
   * Classify problems by topic
   * @param problems - Array of extracted problems
   * @returns Classifications with topic summary
   */
  classifyProblems(problems: ExtractedProblem[]): Promise<ClassifiedProblems>;

  /**
   * Generate a similar practice problem
   * @param problem - Original problem to base new one on
   * @returns Generated problem with answer and steps
   */
  generateSimilar(problem: ExtractedProblem): Promise<GeneratedProblem>;

  /**
   * Generate a practice test from homework
   * @param problems - Extracted problems to base test on
   * @param count - Number of problems to generate
   * @param options - Test generation options
   * @returns Array of generated problems
   */
  generatePracticeTest(
    problems: ExtractedProblem[],
    count: number,
    options: GenerateTestOptions
  ): Promise<GeneratedProblem[]>;

  /**
   * Evaluate student answers in batch
   * @param problems - Problems with correct answers
   * @param answers - Student's answers
   * @returns Evaluation results with summary
   */
  evaluateAnswers(
    problems: GeneratedProblem[],
    answers: string[]
  ): Promise<BatchEvaluationResult>;

  /**
   * Evaluate a single answer
   * @param problemText - The problem text
   * @param correctAnswer - The correct answer
   * @param studentAnswer - Student's answer
   * @returns Evaluation result
   */
  evaluateSingleAnswer(
    problemText: string,
    correctAnswer: string,
    studentAnswer: string
  ): Promise<EvaluationResult>;

  /**
   * Generate Ms. Guide explanation for a wrong answer
   * @param problem - The problem
   * @param studentAnswer - What the student answered
   * @param correctAnswer - The correct answer
   * @param gradeLevel - Student's grade level
   * @returns Full explanation with steps
   */
  explainConcept(
    problem: ExtractedProblem | GeneratedProblem,
    studentAnswer: string,
    correctAnswer: string,
    gradeLevel: string
  ): Promise<MsGuideExplanation>;

  /**
   * Chat with Ms. Guide about a problem
   * @param history - Previous chat messages
   * @param question - Student's new question
   * @param context - Problem context
   * @returns Ms. Guide's response
   */
  chat(
    history: ChatMessage[],
    question: string,
    context: ProblemContext
  ): Promise<string>;

  /**
   * Generate audio from text using TTS
   * @param text - Text to convert to speech
   * @returns Audio URL or base64 data
   */
  generateAudio(text: string): Promise<string>;

  /**
   * Extract a reusable template from a problem (ONE-TIME LLM cost)
   * Used for algorithmic problem generation
   * @param problemText - The original problem text
   * @param gradeLevel - Student's grade level
   * @returns Template pattern for generating similar problems
   */
  extractProblemTemplate(
    problemText: string,
    gradeLevel: string
  ): Promise<ExtractedTemplateResult | null>;
}

/**
 * Result of template extraction for algorithmic problem generation
 */
export interface ExtractedTemplateResult {
  problem_type: string;
  subtype?: string;
  grade_level: string;
  template_pattern: {
    format: 'horizontal' | 'vertical' | 'expression' | 'word';
    operand_ranges: Array<{
      min: number;
      max: number;
      type?: 'integer' | 'decimal' | 'fraction';
    }>;
    operators: string[];
    constraints?: {
      no_negative_results?: boolean;
      no_remainders?: boolean;
      same_denominator?: boolean;
      common_denominators?: number[];
    };
    word_problem_template?: string;
    variable_names?: string[];
  };
  hint_templates: string[];
  solution_step_templates: string[];
}

/**
 * Options for generating practice tests
 */
export interface GenerateTestOptions {
  /** Topic distribution to match */
  topicDistribution: Record<string, number>;
  /** Difficulty preference */
  difficultyPreference: 'easier' | 'balanced' | 'harder';
  /** Include warm-up problems */
  includeWarmups: boolean;
  /** Include challenge problems */
  includeChallenges: boolean;
}

/**
 * AI usage tracking data
 */
export interface AIUsageData {
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  imageCount?: number;
  responseTimeMs: number;
  success: boolean;
  errorMessage?: string;
}

/**
 * AI service configuration
 */
export interface AIServiceConfig {
  /**
   * AI service mode:
   * - 'mock': Use mock data for development
   * - 'edge': Use Supabase Edge Functions (secure, production) - DEFAULT
   * - 'api': Direct Anthropic API calls (NOT recommended - exposes API key)
   */
  mode: 'mock' | 'edge' | 'api';
  /** Model configuration */
  models: AIModelConfig;
  /** API key (only needed for 'api' mode - NOT recommended) */
  apiKey?: string;
  /** Callback for tracking usage */
  onUsage?: (usage: AIUsageData) => void;
}

/**
 * Default model configuration
 */
export const DEFAULT_MODEL_CONFIG: AIModelConfig = {
  extraction: 'claude-haiku-4-5-20251001',
  generation: 'claude-haiku-4-5-20251001',
  evaluation: 'claude-haiku-4-5-20251001',
  explanation: 'claude-sonnet-4-5-20250929',
  chat: 'claude-sonnet-4-5-20250929',
};

/**
 * Temperature settings for different tasks
 */
export const TEMPERATURE_SETTINGS = {
  extraction: 0.0, // Need consistency
  evaluation: 0.0, // Need accuracy
  explanation: 0.7, // Some creativity for engagement
  chat: 0.7, // Natural conversation
  generation: 0.5, // Some variety, but controlled
} as const;
