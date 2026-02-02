/**
 * Problem Generation Prompts
 *
 * Used with Haiku 4.5 for generating practice problems.
 */

import type { ExtractedProblem, DifficultyPreference } from '../../../types/homework';

/**
 * Build prompt to generate a similar practice problem
 */
export function buildSimilarProblemPrompt(
  problemText: string,
  problemType: string,
  difficulty: string,
  gradeLevel: string
): string {
  return `Given this math problem:
${problemText}

Problem type: ${problemType}
Difficulty: ${difficulty}
Grade level: ${gradeLevel}

Generate a similar practice problem that:
- Tests the same mathematical concept/skill
- Has similar difficulty level
- Uses different numbers
- Has a clean answer (avoid messy decimals or fractions unless that's the point)

Return JSON:
{
  "problem_text": "The new problem",
  "answer": "The correct answer",
  "solution_steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ]
}`;
}

/**
 * Build prompt to generate a practice test from extracted problems
 */
export function buildPracticeTestPrompt(
  extractedProblems: ExtractedProblem[],
  count: number,
  topicDistribution: Record<string, number>,
  difficultyPreference: DifficultyPreference,
  includeWarmups: boolean,
  includeChallenges: boolean
): string {
  const problemsSummary = extractedProblems.map((p, i) => ({
    index: i,
    text: p.problem_text,
    type: p.problem_type,
    difficulty: p.difficulty,
    grade_level: p.grade_level,
  }));

  return `Based on these problems from the student's homework:
${JSON.stringify(problemsSummary, null, 2)}

Generate ${count} practice problems for exam preparation.

Requirements:
- Match the topic distribution: ${JSON.stringify(topicDistribution)}
- Difficulty preference: ${difficultyPreference}
${includeWarmups ? '- Include 2-3 easier warm-up problems at the start' : ''}
${includeChallenges ? '- Include 2-3 harder challenge problems' : ''}
- Use different numbers and contexts than the original homework
- Each problem should have a clean, solvable answer

Return JSON:
{
  "practice_problems": [
    {
      "index": 0,
      "problem_text": "...",
      "problem_type": "addition",
      "difficulty": "medium",
      "source_topic": "addition",
      "answer": "...",
      "solution_steps": ["Step 1...", "Step 2..."]
    }
  ]
}`;
}

/**
 * Build prompt for topic classification
 */
export function buildTopicClassificationPrompt(
  problems: ExtractedProblem[]
): string {
  const problemsList = problems.map((p, i) => ({
    index: i,
    text: p.problem_text,
    type: p.problem_type,
  }));

  return `Analyze these math problems and categorize them by topic.

Problems:
${JSON.stringify(problemsList, null, 2)}

For each problem, identify:
- Primary topic (main concept being tested)
- Secondary topics (other concepts involved, if any)
- Prerequisite skills (what the student needs to know)

Then provide an overall summary of topics covered.

Return JSON:
{
  "problem_classifications": [
    {
      "problem_index": 0,
      "primary_topic": "multi_digit_addition",
      "secondary_topics": ["place_value", "carrying"],
      "prerequisite_skills": ["single_digit_addition", "place_value_understanding"]
    }
  ],
  "topic_summary": {
    "multi_digit_addition": 5,
    "word_problems": 3,
    "fractions": 2
  },
  "recommended_focus_areas": ["carrying in addition", "reading word problems carefully"]
}`;
}

/**
 * Build audio script optimization prompt
 */
export function buildAudioScriptPrompt(text: string): string {
  return `Convert this math explanation into natural spoken text for a child.

Original text:
${text}

Requirements:
- Remove visual elements that don't work in audio (ASCII art, etc.)
- Add natural pauses (commas)
- Spell out symbols ("+" becomes "plus", "=" becomes "equals", "/" becomes "divided by")
- Keep the warm, encouraging Ms. Guide tone
- Add brief verbal cues for steps ("First...", "Next...", "Finally...")
- Keep it concise - audio should be under 60 seconds when read aloud

Return just the optimized text, ready for text-to-speech.`;
}
