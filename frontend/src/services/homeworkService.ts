/**
 * Homework Session Service
 *
 * Orchestrates the Homework Helper and Exam Prep flows.
 * Coordinates between image upload, AI extraction, and database operations.
 */

import { supabase } from '../lib/supabase';
import { getAIService } from './ai';
import {
  uploadImages,
  getSignedUrls,
  deleteSessionImages,
} from './imageUploadService';
import type {
  HomeworkSession,
  HomeworkMode,
  ExtractedProblem,
  ExamPrepTest,
  HomeworkAttempt,
  ReviewSession,
  MsGuideExplanation,
  ChatMessage,
  GeneratedProblem,
  BatchEvaluationResult,
  TestConfiguration,
  HomeworkStats,
} from '../types/homework';

// ============================================================================
// Session Management
// ============================================================================

/**
 * Create a new homework session
 */
export async function createHomeworkSession(
  childId: string,
  mode: HomeworkMode
): Promise<{ session?: HomeworkSession; error?: string }> {
  const { data, error } = await supabase
    .from('homework_sessions')
    .insert({
      child_id: childId,
      mode,
      image_count: 0,
      extracted_problems: [],
      topics_identified: [],
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return { error: error.message };
  }

  return { session: data as HomeworkSession };
}

/**
 * Get a homework session by ID
 */
export async function getHomeworkSession(
  sessionId: string
): Promise<{ session?: HomeworkSession; error?: string }> {
  const { data, error } = await supabase
    .from('homework_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { session: data as HomeworkSession };
}

/**
 * Update session status
 */
export async function updateSessionStatus(
  sessionId: string,
  status: HomeworkSession['status'],
  errorMessage?: string
): Promise<{ error?: string }> {
  const update: Record<string, unknown> = { status };
  if (errorMessage) {
    update.error_message = errorMessage;
  }

  const { error } = await supabase
    .from('homework_sessions')
    .update(update)
    .eq('id', sessionId);

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Get recent homework sessions for a child
 */
export async function getChildHomeworkSessions(
  childId: string,
  limit = 10
): Promise<HomeworkSession[]> {
  const { data, error } = await supabase
    .from('homework_sessions')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return (data || []) as HomeworkSession[];
}

// ============================================================================
// Image Upload & Extraction
// ============================================================================

/**
 * Upload images and extract problems
 */
export async function uploadAndExtract(
  sessionId: string,
  files: File[],
  onProgress?: (step: string, progress: number) => void
): Promise<{ problems?: ExtractedProblem[]; error?: string }> {
  try {
    // Update status to processing
    await updateSessionStatus(sessionId, 'processing');

    // Upload images
    onProgress?.('Uploading images...', 10);
    const uploadResult = await uploadImages(files, sessionId, (completed, total) => {
      const progress = 10 + (completed / total) * 30;
      onProgress?.(`Uploading image ${completed}/${total}...`, progress);
    });

    if (!uploadResult.success && uploadResult.totalUploaded === 0) {
      await updateSessionStatus(sessionId, 'error', 'Failed to upload images');
      return { error: 'Failed to upload any images. Please try again.' };
    }

    // Update image count
    await supabase
      .from('homework_sessions')
      .update({ image_count: uploadResult.totalUploaded })
      .eq('id', sessionId);

    // Get signed URLs for AI
    onProgress?.('Preparing images for analysis...', 45);
    const imageIds = uploadResult.images.map((img) => img.id);
    const signedUrls = await getSignedUrls(imageIds);
    const urlList = Object.values(signedUrls);

    if (urlList.length === 0) {
      await updateSessionStatus(sessionId, 'error', 'Failed to get image URLs');
      return { error: 'Failed to process images. Please try again.' };
    }

    // Extract problems using AI
    onProgress?.('Ms. Guide is analyzing your homework...', 60);
    const aiService = getAIService();
    const problems = await aiService.extractProblems(urlList);

    // Classify problems to get topics
    onProgress?.('Identifying topics...', 85);
    const classification = await aiService.classifyProblems(problems);

    // Save extracted problems to session
    const { error: updateError } = await supabase
      .from('homework_sessions')
      .update({
        extracted_problems: problems,
        topics_identified: Object.keys(classification.topic_summary),
        status: 'ready',
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error saving extraction:', updateError);
      // Don't fail - problems were extracted
    }

    onProgress?.('Done!', 100);
    return { problems };
  } catch (error) {
    console.error('Upload and extract error:', error);
    await updateSessionStatus(
      sessionId,
      'error',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return { error: 'Failed to analyze homework. Please try again.' };
  }
}

// ============================================================================
// Homework Helper Mode
// ============================================================================

/**
 * Get explanation for a problem
 */
export async function getExplanation(
  _sessionId: string,
  problem: ExtractedProblem | GeneratedProblem,
  studentAnswer: string,
  gradeLevel: string
): Promise<{ explanation?: MsGuideExplanation; error?: string }> {
  try {
    const aiService = getAIService();
    const correctAnswer = 'answer' in problem ? problem.answer : 'N/A';
    const explanation = await aiService.explainConcept(
      problem,
      studentAnswer,
      correctAnswer,
      gradeLevel
    );
    return { explanation };
  } catch (error) {
    console.error('Error getting explanation:', error);
    return { error: 'Failed to get explanation. Please try again.' };
  }
}

/**
 * Save a homework attempt (for tracking)
 */
export async function saveHomeworkAttempt(
  sessionId: string,
  problem: ExtractedProblem,
  problemIndex: number,
  studentAnswer?: string,
  isCorrect?: boolean
): Promise<{ attempt?: HomeworkAttempt; error?: string }> {
  const { data, error } = await supabase
    .from('homework_attempts')
    .insert({
      session_id: sessionId,
      problem_index: problemIndex,
      problem_text: problem.problem_text,
      problem_type: problem.problem_type,
      difficulty: problem.difficulty,
      grade_level: problem.grade_level,
      student_answer: studentAnswer,
      is_correct: isCorrect,
      needs_review: false,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { attempt: data as HomeworkAttempt };
}

// ============================================================================
// Review Sessions (Chat with Ms. Guide)
// ============================================================================

/**
 * Create a review session for an attempt
 */
export async function createReviewSession(
  attemptId: string,
  explanation: MsGuideExplanation
): Promise<{ reviewSession?: ReviewSession; error?: string }> {
  const { data, error } = await supabase
    .from('review_sessions')
    .insert({
      attempt_id: attemptId,
      explanation,
      chat_history: [],
      audio_played: false,
      similar_problem_requested: false,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { reviewSession: data as ReviewSession };
}

/**
 * Chat with Ms. Guide about a problem
 */
export async function chatWithMsGuide(
  reviewSessionId: string,
  question: string,
  problemText: string,
  studentAnswer: string,
  correctAnswer: string,
  gradeLevel: string
): Promise<{ response?: string; error?: string }> {
  try {
    // Get current review session
    const { data: reviewSession, error: fetchError } = await supabase
      .from('review_sessions')
      .select('*')
      .eq('id', reviewSessionId)
      .single();

    if (fetchError || !reviewSession) {
      return { error: 'Review session not found' };
    }

    const history = (reviewSession.chat_history || []) as ChatMessage[];

    // Check chat limit
    const maxMessages = parseInt(import.meta.env.VITE_MAX_CHAT_MESSAGES || '20', 10);
    if (history.length >= maxMessages) {
      return { error: 'Chat limit reached for this session.' };
    }

    // Get AI response
    const aiService = getAIService();
    const response = await aiService.chat(history, question, {
      problem_text: problemText,
      student_answer: studentAnswer,
      correct_answer: correctAnswer,
      grade_level: gradeLevel,
      previous_explanation: reviewSession.explanation as MsGuideExplanation,
    });

    // Update chat history
    const updatedHistory: ChatMessage[] = [
      ...history,
      { role: 'student', content: question, timestamp: new Date().toISOString() },
      { role: 'ms_guide', content: response, timestamp: new Date().toISOString() },
    ];

    await supabase
      .from('review_sessions')
      .update({ chat_history: updatedHistory })
      .eq('id', reviewSessionId);

    return { response };
  } catch (error) {
    console.error('Chat error:', error);
    return { error: 'Failed to get response. Please try again.' };
  }
}

/**
 * Request a similar problem
 */
export async function requestSimilarProblem(
  reviewSessionId: string,
  originalProblem: ExtractedProblem
): Promise<{ problem?: GeneratedProblem; error?: string }> {
  try {
    const aiService = getAIService();
    const similarProblem = await aiService.generateSimilar(originalProblem);

    // Save to review session
    await supabase
      .from('review_sessions')
      .update({
        similar_problem_requested: true,
        similar_problem: similarProblem,
      })
      .eq('id', reviewSessionId);

    return { problem: similarProblem };
  } catch (error) {
    console.error('Similar problem error:', error);
    return { error: 'Failed to generate similar problem.' };
  }
}

/**
 * Mark audio as played
 */
export async function markAudioPlayed(reviewSessionId: string): Promise<void> {
  await supabase
    .from('review_sessions')
    .update({ audio_played: true })
    .eq('id', reviewSessionId);
}

// ============================================================================
// Exam Prep Mode
// ============================================================================

/**
 * Generate a practice test
 */
export async function generatePracticeTest(
  sessionId: string,
  config: TestConfiguration
): Promise<{ test?: ExamPrepTest; error?: string }> {
  try {
    // Get session with extracted problems
    const { session, error: sessionError } = await getHomeworkSession(sessionId);
    if (sessionError || !session) {
      return { error: sessionError || 'Session not found' };
    }

    const extractedProblems = session.extracted_problems as ExtractedProblem[];
    if (!extractedProblems || extractedProblems.length === 0) {
      return { error: 'No problems found in session' };
    }

    // Get AI service and classify problems
    const aiService = getAIService();
    const classification = await aiService.classifyProblems(extractedProblems);

    // Generate practice problems
    const generatedProblems = await aiService.generatePracticeTest(
      extractedProblems,
      config.problemCount,
      {
        topicDistribution: classification.topic_summary,
        difficultyPreference: config.difficultyPreference,
        includeWarmups: config.includeWarmups,
        includeChallenges: config.includeChallenges,
      }
    );

    // Create test record
    const { data: test, error: testError } = await supabase
      .from('exam_prep_tests')
      .insert({
        session_id: sessionId,
        generated_problems: generatedProblems,
        problem_count: generatedProblems.length,
        timer_enabled: config.timerEnabled,
        time_limit_minutes: config.timerEnabled ? config.timeLimitMinutes : null,
        difficulty_preference: config.difficultyPreference,
      })
      .select()
      .single();

    if (testError) {
      return { error: testError.message };
    }

    return { test: test as ExamPrepTest };
  } catch (error) {
    console.error('Generate test error:', error);
    return { error: 'Failed to generate practice test.' };
  }
}

/**
 * Start a practice test (record start time)
 */
export async function startPracticeTest(
  testId: string
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('exam_prep_tests')
    .update({ started_at: new Date().toISOString() })
    .eq('id', testId);

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Submit practice test answers for evaluation
 */
export async function submitPracticeTest(
  testId: string,
  answers: Record<number, string>
): Promise<{ results?: BatchEvaluationResult; error?: string }> {
  try {
    // Get test with problems
    const { data: test, error: testError } = await supabase
      .from('exam_prep_tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return { error: 'Test not found' };
    }

    const problems = test.generated_problems as GeneratedProblem[];
    const answerList = problems.map((_, i) => answers[i] || '');

    // Evaluate answers
    const aiService = getAIService();
    const results = await aiService.evaluateAnswers(problems, answerList);

    // Calculate score
    const scorePercentage = (results.summary.correct / results.summary.total) * 100;

    // Update test with results
    await supabase
      .from('exam_prep_tests')
      .update({
        completed_at: new Date().toISOString(),
        score_percentage: scorePercentage,
      })
      .eq('id', testId);

    // Save individual attempts
    for (const evaluation of results.evaluations) {
      const problem = problems[evaluation.problem_index];
      await supabase.from('homework_attempts').insert({
        test_id: testId,
        problem_index: evaluation.problem_index,
        problem_text: problem.problem_text,
        problem_type: problem.problem_type,
        difficulty: problem.difficulty,
        correct_answer: problem.answer,
        student_answer: evaluation.student_answer,
        is_correct: evaluation.is_correct,
        error_type: evaluation.error_type,
        needs_review: !evaluation.is_correct,
      });
    }

    return { results };
  } catch (error) {
    console.error('Submit test error:', error);
    return { error: 'Failed to evaluate test.' };
  }
}

/**
 * Get wrong answers for review
 */
export async function getWrongAnswersForReview(
  testId: string
): Promise<{ attempts: HomeworkAttempt[]; error?: string }> {
  const { data, error } = await supabase
    .from('homework_attempts')
    .select('*')
    .eq('test_id', testId)
    .eq('is_correct', false)
    .order('problem_index', { ascending: true });

  if (error) {
    return { attempts: [], error: error.message };
  }

  return { attempts: (data || []) as HomeworkAttempt[] };
}

// ============================================================================
// Statistics & Cleanup
// ============================================================================

/**
 * Get homework statistics for a child
 */
export async function getHomeworkStats(childId: string): Promise<HomeworkStats | null> {
  const { data, error } = await supabase.rpc('get_homework_stats', {
    p_child_id: childId,
  });

  if (error) {
    console.error('Error getting homework stats:', error);
    return null;
  }

  return data?.[0] || null;
}

/**
 * Complete and cleanup a session
 */
export async function completeSession(sessionId: string): Promise<void> {
  // Update status
  await updateSessionStatus(sessionId, 'completed');

  // Note: Images will be auto-deleted by the cleanup cron job
  // after 24 hours, so we don't delete them here
}

/**
 * Delete a session and all associated data
 */
export async function deleteSession(sessionId: string): Promise<{ error?: string }> {
  try {
    // Delete images from storage
    await deleteSessionImages(sessionId);

    // Delete session (cascades to attempts, review sessions, etc.)
    const { error } = await supabase
      .from('homework_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Delete session error:', error);
    return { error: 'Failed to delete session' };
  }
}

/**
 * Log AI usage for cost tracking
 */
export async function logAIUsage(
  childId: string,
  sessionId: string | null,
  feature: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  imageCount: number,
  estimatedCost: number,
  responseTimeMs: number,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  await supabase.from('homework_ai_usage').insert({
    child_id: childId,
    session_id: sessionId,
    feature,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    image_count: imageCount,
    estimated_cost: estimatedCost,
    response_time_ms: responseTimeMs,
    success,
    error_message: errorMessage,
  });
}
