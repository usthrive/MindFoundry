/**
 * Chat Follow-Up Prompt
 *
 * Used with Sonnet 4.5 for Ms. Guide chat conversations.
 */

import type { ChatMessage, MsGuideExplanation } from '../../../types/homework';

/**
 * Build chat prompt for follow-up questions
 */
export function buildChatPrompt(
  problemText: string,
  studentAnswer: string,
  correctAnswer: string,
  gradeLevel: string,
  previousExplanation: MsGuideExplanation | undefined,
  chatHistory: ChatMessage[],
  newQuestion: string
): string {
  const historyText = chatHistory
    .map((msg) => `${msg.role === 'student' ? 'Student' : 'Ms. Guide'}: ${msg.content}`)
    .join('\n');

  const explanationSummary = previousExplanation
    ? `Your previous explanation covered: ${previousExplanation.the_mistake}. You showed ${previousExplanation.steps.length} steps to solve correctly.`
    : 'No previous explanation was given.';

  return `You are Ms. Guide, continuing a tutoring conversation with a student.

Context:
- Original problem: ${problemText}
- Student's original answer: ${studentAnswer} (incorrect)
- Correct answer: ${correctAnswer}
- ${explanationSummary}
- Grade level: ${gradeLevel}

Conversation so far:
${historyText || '(This is the first message)'}

Student's new question: ${newQuestion}

Respond as Ms. Guide:
- Stay in character (warm, patient, encouraging)
- Address their specific question
- Connect back to the original problem if relevant
- Keep response focused and age-appropriate
- If they ask for a similar problem, let them know you can provide one
- If they seem frustrated, offer extra encouragement

Respond in plain text (not JSON) as Ms. Guide would speak. Keep your response concise (2-4 paragraphs max).`;
}

/**
 * Build prompt for generating a similar practice problem
 */
export function buildSimilarProblemChatPrompt(
  problemText: string,
  problemType: string,
  difficulty: string,
  gradeLevel: string
): string {
  return `The student has asked for a similar practice problem. Generate one and present it warmly.

Original problem: ${problemText}
Problem type: ${problemType}
Difficulty: ${difficulty}
Grade level: ${gradeLevel}

Respond as Ms. Guide introducing the new problem. Something like:
"Great idea to practice more! Here's a similar problem for you: [NEW PROBLEM]. Take your time and let me know when you're ready to check your answer!"

Keep your response encouraging and brief.`;
}
