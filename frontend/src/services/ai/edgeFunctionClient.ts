/**
 * Edge Function AI Client
 *
 * Secure client that calls Supabase Edge Functions instead of Claude API directly.
 * The API key is stored securely in Supabase secrets, never exposed to the browser.
 */

import { supabase } from '@/lib/supabase'
import type { MsGuideServiceInterface, GenerateTestOptions, AIUsageData, ExtractedTemplateResult, BatchVerificationResult } from './types'
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
} from '@/types/homework'

/**
 * Edge Function AI Service
 *
 * All AI operations are proxied through Supabase Edge Functions
 * for security (API key never exposed to browser).
 */
export class EdgeFunctionAIService implements MsGuideServiceInterface {
  private onUsage?: (usage: AIUsageData) => void
  private supabaseUrl: string

  constructor(options?: { onUsage?: (usage: AIUsageData) => void }) {
    this.onUsage = options?.onUsage
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  }

  /**
   * Call the AI Edge Function
   */
  private async callEdgeFunction<T>(
    operation: string,
    params: Record<string, unknown>
  ): Promise<T> {
    const startTime = Date.now()

    try {
      // Get current session for auth
      console.log('[AI] Getting session...')
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log('[AI] Session result:', {
        hasSession: !!session,
        hasError: !!sessionError,
        error: sessionError?.message,
        hasAccessToken: !!session?.access_token,
        tokenLength: session?.access_token?.length,
        userId: session?.user?.id,
      })

      if (sessionError) {
        console.error('[AI] Session error:', sessionError)
        throw new Error('Session error: ' + sessionError.message)
      }

      if (!session) {
        console.error('[AI] No session found')
        throw new Error('Not authenticated - no session')
      }

      if (!session.access_token) {
        console.error('[AI] No access token in session')
        throw new Error('Not authenticated - no token')
      }

      // Call the Edge Function
      console.log('[AI] Calling Edge Function:', operation)
      const response = await fetch(`${this.supabaseUrl}/functions/v1/ai-service`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ operation, params }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[AI] Error response:', response.status, errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || 'Unknown error' }
        }
        throw new Error(errorData.error || errorData.details || `AI service error: ${response.status}`)
      }

      const data = (await response.json()) as T

      // Track usage if callback provided
      if (this.onUsage) {
        this.onUsage({
          feature: operation,
          model: 'edge-function',
          inputTokens: 0, // Edge function doesn't return this directly
          outputTokens: 0,
          responseTimeMs: Date.now() - startTime,
          success: true,
        })
      }

      return data
    } catch (error) {
      // Track error if callback provided
      if (this.onUsage) {
        this.onUsage({
          feature: operation,
          model: 'edge-function',
          inputTokens: 0,
          outputTokens: 0,
          responseTimeMs: Date.now() - startTime,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        })
      }

      throw error
    }
  }

  /**
   * Extract math problems from uploaded images
   */
  async extractProblems(imageUrls: string[]): Promise<ExtractedProblem[]> {
    return this.callEdgeFunction<ExtractedProblem[]>('extractProblems', { imageUrls })
  }

  /**
   * Verify extracted problems by re-examining images
   * Applies mathematical reasoning to connect visual elements to questions
   */
  async verifyExtraction(
    problems: ExtractedProblem[],
    imageUrls: string[]
  ): Promise<BatchVerificationResult> {
    return this.callEdgeFunction<BatchVerificationResult>('verifyExtraction', {
      problems,
      imageUrls,
    })
  }

  /**
   * Assess image quality before extraction
   */
  async assessImageQuality(imageUrl: string): Promise<ImageQualityAssessment> {
    return this.callEdgeFunction<ImageQualityAssessment>('assessImageQuality', { imageUrl })
  }

  /**
   * Classify problems by topic
   *
   * Note: This is currently a simpler operation that can be done client-side
   * based on the extracted problem types. Can be upgraded to AI-based later.
   */
  async classifyProblems(problems: ExtractedProblem[]): Promise<ClassifiedProblems> {
    // For now, do simple client-side classification
    const topicCounts: Record<string, number> = {}
    const classifications = problems.map((p, index) => {
      const primaryTopic = p.problem_type
      topicCounts[primaryTopic] = (topicCounts[primaryTopic] || 0) + 1

      return {
        problem_index: index,
        primary_topic: primaryTopic,
        secondary_topics: [],
        prerequisite_skills: [],
      }
    })

    return {
      problem_classifications: classifications,
      topic_summary: topicCounts,
      recommended_focus_areas: Object.keys(topicCounts).slice(0, 3),
    }
  }

  /**
   * Generate a similar practice problem
   */
  async generateSimilar(problem: ExtractedProblem): Promise<GeneratedProblem> {
    return this.callEdgeFunction<GeneratedProblem>('generateSimilar', { problem })
  }

  /**
   * Generate a practice test from homework problems
   */
  async generatePracticeTest(
    problems: ExtractedProblem[],
    count: number,
    options: GenerateTestOptions
  ): Promise<GeneratedProblem[]> {
    return this.callEdgeFunction<GeneratedProblem[]>('generatePracticeTest', {
      problems,
      count,
      options,
    })
  }

  /**
   * Evaluate student answers in batch
   */
  async evaluateAnswers(
    problems: GeneratedProblem[],
    answers: string[]
  ): Promise<BatchEvaluationResult> {
    return this.callEdgeFunction<BatchEvaluationResult>('evaluateAnswers', {
      problems,
      answers,
    })
  }

  /**
   * Evaluate a single answer
   */
  async evaluateSingleAnswer(
    problemText: string,
    correctAnswer: string,
    studentAnswer: string
  ): Promise<EvaluationResult> {
    // Use the batch evaluation with a single problem
    const result = await this.callEdgeFunction<BatchEvaluationResult>('evaluateAnswers', {
      problems: [{ problem_text: problemText, answer: correctAnswer }],
      answers: [studentAnswer],
    })

    if (result.evaluations && result.evaluations.length > 0) {
      return result.evaluations[0]
    }

    throw new Error('No evaluation result returned')
  }

  /**
   * Generate Ms. Guide explanation for a wrong answer
   */
  async explainConcept(
    problem: ExtractedProblem | GeneratedProblem,
    studentAnswer: string,
    correctAnswer: string,
    gradeLevel: string
  ): Promise<MsGuideExplanation> {
    return this.callEdgeFunction<MsGuideExplanation>('explainConcept', {
      problem,
      studentAnswer,
      correctAnswer,
      gradeLevel,
    })
  }

  /**
   * Chat with Ms. Guide about a problem
   */
  async chat(
    history: ChatMessage[],
    question: string,
    context: ProblemContext
  ): Promise<string> {
    return this.callEdgeFunction<string>('chat', {
      history,
      question,
      context,
    })
  }

  /**
   * Generate audio from text using TTS
   *
   * Note: This uses the separate generate-speech Edge Function
   */
  async generateAudio(text: string): Promise<string> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${this.supabaseUrl}/functions/v1/generate-speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate audio')
    }

    const data = await response.json()

    if (!data.success || !data.audioContent) {
      throw new Error(data.error || 'No audio content returned')
    }

    // Return data URL for the audio
    return `data:audio/mp3;base64,${data.audioContent}`
  }

  /**
   * Extract a reusable template from a problem (ONE-TIME LLM cost)
   * Used for algorithmic problem generation
   */
  async extractProblemTemplate(
    problemText: string,
    gradeLevel: string
  ): Promise<ExtractedTemplateResult | null> {
    try {
      return await this.callEdgeFunction<ExtractedTemplateResult>('extractProblemTemplate', {
        problemText,
        gradeLevel,
      })
    } catch (error) {
      console.error('Error extracting problem template:', error)
      return null
    }
  }
}

/**
 * Create an Edge Function AI service instance
 */
export function createEdgeFunctionAIService(options?: {
  onUsage?: (usage: AIUsageData) => void
}): MsGuideServiceInterface {
  return new EdgeFunctionAIService(options)
}
