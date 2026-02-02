/**
 * Wrong Answer Explanation Prompt
 *
 * Used with Sonnet 4.5 to explain wrong answers with Ms. Guide persona.
 */

/**
 * Build explanation prompt for a wrong answer
 */
export function buildExplanationPrompt(
  problemText: string,
  studentAnswer: string,
  correctAnswer: string,
  gradeLevel: string
): string {
  return `A student was working on this math problem:

Problem: ${problemText}
Student's answer: ${studentAnswer}
Correct answer: ${correctAnswer}
Student's grade level: ${gradeLevel}

Please help this student understand their mistake and learn the correct approach.

Structure your response as JSON:
{
  "greeting": "A warm, encouraging opening (1-2 sentences)",
  "what_they_did_right": "Acknowledge any correct thinking or effort (1-2 sentences, or null if not applicable)",
  "the_mistake": "Gently explain what went wrong (2-3 sentences)",
  "steps": [
    {
      "step_number": 1,
      "instruction": "What to do in this step",
      "visual": "Optional visual representation (ASCII math, etc.)",
      "tip": "Optional helpful tip for this step"
    }
  ],
  "correct_answer": "The final answer",
  "encouragement": "Closing encouragement (1-2 sentences)",
  "misconception_tag": "A short tag for the type of error (e.g., 'forgot_to_carry', 'wrong_operation', 'calculation_error')"
}

Remember:
- Use age-appropriate language for grade ${gradeLevel}
- Be warm and encouraging, never condescending
- Make the explanation clear and step-by-step
- Help them understand WHY, not just HOW`;
}

/**
 * Build prompt for explaining a correct answer (optional walkthrough)
 */
export function buildCorrectExplanationPrompt(
  problemText: string,
  studentAnswer: string,
  gradeLevel: string
): string {
  return `A student correctly solved this math problem:

Problem: ${problemText}
Student's answer: ${studentAnswer} (CORRECT!)
Student's grade level: ${gradeLevel}

Provide a brief congratulatory message and optionally explain why their approach worked.

Structure your response as JSON:
{
  "greeting": "Congratulations message (1-2 sentences)",
  "what_they_did_right": "Highlight their good thinking (1-2 sentences)",
  "steps": [], // Empty or optional review steps
  "correct_answer": "${studentAnswer}",
  "encouragement": "Keep up the good work message (1-2 sentences)",
  "misconception_tag": "correct"
}

Keep it brief and celebratory. Grade ${gradeLevel} appropriate language.`;
}
