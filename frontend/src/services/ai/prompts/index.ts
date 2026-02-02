/**
 * AI Prompts Library
 *
 * Centralized, tested prompts for all AI interactions.
 */

// Ms. Guide persona
export {
  MS_GUIDE_SYSTEM_PROMPT,
  getMsGuideSystemPrompt,
} from './msGuideSystemPrompt';

// Problem extraction
export {
  EXTRACTION_PROMPT,
  IMAGE_QUALITY_PROMPT,
  buildExtractionPrompt,
} from './extractionPrompt';

// Explanation prompts
export {
  buildExplanationPrompt,
  buildCorrectExplanationPrompt,
} from './explanationPrompt';

// Chat prompts
export {
  buildChatPrompt,
  buildSimilarProblemChatPrompt,
} from './chatPrompt';

// Evaluation prompts
export {
  buildBatchEvaluationPrompt,
  buildSingleEvaluationPrompt,
} from './evaluationPrompt';

// Generation prompts
export {
  buildSimilarProblemPrompt,
  buildPracticeTestPrompt,
  buildTopicClassificationPrompt,
  buildAudioScriptPrompt,
} from './generationPrompt';
