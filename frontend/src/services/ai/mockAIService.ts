/**
 * Mock AI Service
 *
 * Provides realistic fake responses for UI development without API costs.
 * Set AI_MODE=mock in environment to use this service.
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
  HomeworkProblemType,
  Difficulty,
} from '../../types/homework';

import type {
  MsGuideServiceInterface,
  GenerateTestOptions,
} from './types';

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get a random item from an array
 */
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Mock problem data for testing
 */
const MOCK_PROBLEMS: ExtractedProblem[] = [
  {
    problem_number: '1',
    problem_text: '347 + 289 = ?',
    problem_type: 'addition',
    difficulty: 'medium',
    grade_level: '3',
    confidence: 0.95,
  },
  {
    problem_number: '2',
    problem_text: '562 - 178 = ?',
    problem_type: 'subtraction',
    difficulty: 'medium',
    grade_level: '3',
    confidence: 0.92,
  },
  {
    problem_number: '3',
    problem_text: 'A train travels 60 miles per hour. How far does it travel in 3 hours?',
    problem_type: 'word_problem',
    difficulty: 'medium',
    grade_level: '4',
    confidence: 0.88,
  },
  {
    problem_number: '4',
    problem_text: '24 × 15 = ?',
    problem_type: 'multiplication',
    difficulty: 'medium',
    grade_level: '4',
    confidence: 0.94,
  },
  {
    problem_number: '5',
    problem_text: '144 ÷ 12 = ?',
    problem_type: 'division',
    difficulty: 'easy',
    grade_level: '4',
    confidence: 0.96,
  },
  {
    problem_number: '6',
    problem_text: '1/2 + 1/4 = ?',
    problem_type: 'fractions',
    difficulty: 'medium',
    grade_level: '4',
    confidence: 0.91,
  },
];

/**
 * Mock explanations for different problem types
 */
const MOCK_EXPLANATIONS: Record<string, MsGuideExplanation> = {
  addition: {
    greeting: "Let's work through this together!",
    what_they_did_right: "I can see you tried to add the numbers, which is the right operation to use. Good thinking!",
    the_mistake: "It looks like when you added the ones column (7 + 9 = 16), you might have forgotten to carry the 1 to the tens column. That's a common mistake, and we can fix it!",
    steps: [
      {
        step_number: 1,
        instruction: "First, let's line up the numbers by place value.",
        visual: "  347\n+ 289\n-----",
        tip: "Make sure the ones, tens, and hundreds are all lined up!",
      },
      {
        step_number: 2,
        instruction: "Add the ones place: 7 + 9 = 16. Write 6, carry the 1.",
        visual: "  347\n+ 289\n-----\n    6  (carry 1)",
        tip: "When a column adds up to 10 or more, we 'carry' the extra to the next column.",
      },
      {
        step_number: 3,
        instruction: "Add the tens place: 4 + 8 + 1 = 13. Write 3, carry the 1.",
        visual: "  347\n+ 289\n-----\n   36  (carry 1)",
      },
      {
        step_number: 4,
        instruction: "Add the hundreds place: 3 + 2 + 1 = 6.",
        visual: "  347\n+ 289\n-----\n  636",
      },
    ],
    correct_answer: "636",
    encouragement: "Great job working through this! Remember, carrying helps us handle sums greater than 9. You've got this!",
    misconception_tag: "forgot_to_carry",
  },
  subtraction: {
    greeting: "Let's figure this out together!",
    what_they_did_right: "You identified this as a subtraction problem - that's correct!",
    the_mistake: "When we need to subtract a bigger digit from a smaller one, we need to 'borrow' from the next column. Let me show you how!",
    steps: [
      {
        step_number: 1,
        instruction: "Line up the numbers by place value.",
        visual: "  562\n- 178\n-----",
      },
      {
        step_number: 2,
        instruction: "Start with the ones: 2 - 8. We can't do that! So we borrow 1 from the tens.",
        visual: "  5 5 12\n- 1 7  8\n--------",
        tip: "Borrowing turns the 2 into 12, and the 6 becomes 5.",
      },
      {
        step_number: 3,
        instruction: "Now: 12 - 8 = 4",
        visual: "  5 5 12\n- 1 7  8\n--------\n       4",
      },
      {
        step_number: 4,
        instruction: "Tens: 5 - 7... we need to borrow again! 15 - 7 = 8",
        visual: "  4 15 12\n- 1  7  8\n---------\n     8  4",
      },
      {
        step_number: 5,
        instruction: "Hundreds: 4 - 1 = 3",
        visual: "  562\n- 178\n-----\n  384",
      },
    ],
    correct_answer: "384",
    encouragement: "Borrowing can be tricky, but you're getting the hang of it! Practice makes perfect.",
    misconception_tag: "borrowing_error",
  },
  word_problem: {
    greeting: "Word problems can be fun once we break them down!",
    what_they_did_right: "You read through the problem, which is always the first step!",
    the_mistake: "The key is finding the right operation. Let's look at what the problem is really asking.",
    steps: [
      {
        step_number: 1,
        instruction: "Find the key information: The train goes 60 miles in 1 hour.",
        tip: "Underline important numbers and words!",
      },
      {
        step_number: 2,
        instruction: "What are we looking for? How far in 3 hours.",
      },
      {
        step_number: 3,
        instruction: "What operation? If 60 miles in 1 hour, then in 3 hours it's: 60 × 3",
        tip: "'Per hour' often means multiplication when finding a total.",
      },
      {
        step_number: 4,
        instruction: "Calculate: 60 × 3 = 180 miles",
      },
    ],
    correct_answer: "180 miles",
    encouragement: "Word problems just need us to find the hidden math. You're doing great at detective work!",
    misconception_tag: "wrong_operation",
  },
  multiplication: {
    greeting: "Let's multiply together!",
    what_they_did_right: "You knew we needed to multiply these numbers.",
    the_mistake: "Multi-digit multiplication has a few steps. Let me walk you through it!",
    steps: [
      {
        step_number: 1,
        instruction: "Set up the problem vertically.",
        visual: "  24\n× 15\n----",
      },
      {
        step_number: 2,
        instruction: "First, multiply 24 by 5 (the ones digit of 15).",
        visual: "  24\n× 15\n----\n 120  (24 × 5)",
      },
      {
        step_number: 3,
        instruction: "Next, multiply 24 by 1 (the tens digit). Add a 0 placeholder!",
        visual: "  24\n× 15\n----\n 120\n240   (24 × 10)",
      },
      {
        step_number: 4,
        instruction: "Add the partial products: 120 + 240 = 360",
        visual: "  24\n× 15\n----\n 120\n240\n----\n 360",
      },
    ],
    correct_answer: "360",
    encouragement: "Multi-digit multiplication is just breaking big problems into smaller ones. You've got this!",
    misconception_tag: "partial_products_error",
  },
  division: {
    greeting: "Division time! Let's work through this step by step.",
    what_they_did_right: "You set up the division correctly!",
    the_mistake: "Let's make sure we're dividing carefully.",
    steps: [
      {
        step_number: 1,
        instruction: "Set up: 144 ÷ 12",
        tip: "Ask yourself: how many 12s fit into 144?",
      },
      {
        step_number: 2,
        instruction: "12 × 10 = 120. That's close but not quite 144.",
      },
      {
        step_number: 3,
        instruction: "12 × 11 = 132. Getting closer!",
      },
      {
        step_number: 4,
        instruction: "12 × 12 = 144. Perfect!",
      },
    ],
    correct_answer: "12",
    encouragement: "Division is like reverse multiplication. You found how many 12s fit in 144!",
    misconception_tag: "calculation_error",
  },
  fractions: {
    greeting: "Fractions are like pizza slices - let's figure this out!",
    what_they_did_right: "You're working with fractions, which takes courage!",
    the_mistake: "To add fractions, they need the same denominator (bottom number) first.",
    steps: [
      {
        step_number: 1,
        instruction: "Look at the denominators: 2 and 4. Are they the same? No!",
        tip: "We need a common denominator to add fractions.",
      },
      {
        step_number: 2,
        instruction: "Find a common denominator: 4 works! (2 goes into 4)",
      },
      {
        step_number: 3,
        instruction: "Convert 1/2 to fourths: 1/2 = 2/4",
        visual: "1/2 = 2/4 (multiply top and bottom by 2)",
      },
      {
        step_number: 4,
        instruction: "Now add: 2/4 + 1/4 = 3/4",
        visual: "2/4 + 1/4 = 3/4",
      },
    ],
    correct_answer: "3/4",
    encouragement: "Finding common denominators is the key to fraction addition. You're becoming a fraction expert!",
    misconception_tag: "common_denominator",
  },
};

/**
 * Mock chat responses based on keywords
 */
const CHAT_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['carry', 'carrying', 'carried'],
    response: "Great question! We carry when the sum in any column is 10 or more. Since we can only write one digit in each place, we 'carry' the extra to the next column. Think of it like trading 10 ones for 1 ten!",
  },
  {
    keywords: ['borrow', 'borrowing'],
    response: "Borrowing is the opposite of carrying! When we can't subtract a bigger number from a smaller one, we 'borrow' 1 from the next column. It's like getting change for a dollar - we trade 1 ten for 10 ones.",
  },
  {
    keywords: ['another', 'similar', 'more', 'practice'],
    response: "Absolutely! Here's a similar problem for you: 458 + 367 = ? Give it a try and let me know when you're ready to check your answer!",
  },
  {
    keywords: ['why', 'reason', 'understand'],
    response: "That's such a thoughtful question! The reason we do this is to make sure each place value only has one digit. Just like we count 1, 2, 3... 9, 10, 11 - when we hit 10, we move to the next place. Math is all about patterns!",
  },
  {
    keywords: ['hard', 'difficult', 'confusing', 'don\'t get'],
    response: "I hear you - this can feel tricky at first! Remember, every math expert started exactly where you are now. Let's slow down and take it one tiny step at a time. What part feels the most confusing?",
  },
  {
    keywords: ['help', 'stuck', 'lost'],
    response: "I'm right here with you! Let's look at this problem together. Sometimes taking a short break and coming back helps too. What part would you like me to explain again?",
  },
];

/**
 * Mock AI Service Implementation
 */
export class MockAIService implements MsGuideServiceInterface {
  /**
   * Extract problems from images
   */
  async extractProblems(imageUrls: string[]): Promise<ExtractedProblem[]> {
    await delay(1500);

    // Return mock problems based on number of images
    const problemsPerImage = Math.min(3, Math.ceil(6 / imageUrls.length));
    const totalProblems = Math.min(imageUrls.length * problemsPerImage, MOCK_PROBLEMS.length);

    return MOCK_PROBLEMS.slice(0, totalProblems).map((p, i) => ({
      ...p,
      problem_number: String(i + 1),
    }));
  }

  /**
   * Assess image quality
   */
  async assessImageQuality(_imageUrl: string): Promise<ImageQualityAssessment> {
    await delay(500);

    // Randomly return good or "needs retry" for testing
    const isGood = Math.random() > 0.2;

    return {
      is_math_content: true,
      is_readable: isGood,
      estimated_problem_count: isGood ? Math.floor(Math.random() * 5) + 3 : 0,
      quality_score: isGood ? 0.85 : 0.4,
      issues: isGood ? [] : ['Image is blurry', 'Low lighting'],
      recommendation: isGood ? 'proceed' : 'retry',
    };
  }

  /**
   * Classify problems by topic
   */
  async classifyProblems(problems: ExtractedProblem[]): Promise<ClassifiedProblems> {
    await delay(1000);

    const topicSummary: Record<string, number> = {};
    const classifications = problems.map((p, i) => {
      const topic = p.problem_type.replace('_', ' ');
      topicSummary[topic] = (topicSummary[topic] || 0) + 1;

      return {
        problem_index: i,
        primary_topic: topic,
        secondary_topics: ['place value'],
        prerequisite_skills: ['basic counting', 'number recognition'],
      };
    });

    return {
      problem_classifications: classifications,
      topic_summary: topicSummary,
      recommended_focus_areas: ['Practice with carrying', 'Word problem reading'],
    };
  }

  /**
   * Generate a similar problem
   */
  async generateSimilar(problem: ExtractedProblem): Promise<GeneratedProblem> {
    await delay(1000);

    // Generate similar problem based on type
    const newProblems: Record<HomeworkProblemType, GeneratedProblem> = {
      addition: {
        index: 0,
        problem_text: '458 + 367 = ?',
        problem_type: 'addition',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'addition',
        answer: '825',
        solution_steps: [
          'Line up by place value',
          '8 + 7 = 15, write 5 carry 1',
          '5 + 6 + 1 = 12, write 2 carry 1',
          '4 + 3 + 1 = 8',
          'Answer: 825',
        ],
      },
      subtraction: {
        index: 0,
        problem_text: '731 - 256 = ?',
        problem_type: 'subtraction',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'subtraction',
        answer: '475',
        solution_steps: ['Borrow from tens', '11 - 6 = 5', '12 - 5 = 7', '6 - 2 = 4', 'Answer: 475'],
      },
      multiplication: {
        index: 0,
        problem_text: '32 × 14 = ?',
        problem_type: 'multiplication',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'multiplication',
        answer: '448',
        solution_steps: ['32 × 4 = 128', '32 × 10 = 320', '128 + 320 = 448'],
      },
      division: {
        index: 0,
        problem_text: '156 ÷ 12 = ?',
        problem_type: 'division',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'division',
        answer: '13',
        solution_steps: ['12 × 10 = 120', '156 - 120 = 36', '36 ÷ 12 = 3', '10 + 3 = 13'],
      },
      fractions: {
        index: 0,
        problem_text: '2/3 + 1/6 = ?',
        problem_type: 'fractions',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'fractions',
        answer: '5/6',
        solution_steps: ['Find common denominator: 6', '2/3 = 4/6', '4/6 + 1/6 = 5/6'],
      },
      decimals: {
        index: 0,
        problem_text: '3.5 + 2.75 = ?',
        problem_type: 'decimals',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'decimals',
        answer: '6.25',
        solution_steps: ['Line up decimal points', 'Add: 3.50 + 2.75 = 6.25'],
      },
      percentages: {
        index: 0,
        problem_text: 'What is 25% of 80?',
        problem_type: 'percentages',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'percentages',
        answer: '20',
        solution_steps: ['25% = 0.25', '0.25 × 80 = 20'],
      },
      algebra: {
        index: 0,
        problem_text: 'Solve: x + 7 = 15',
        problem_type: 'algebra',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'algebra',
        answer: '8',
        solution_steps: ['Subtract 7 from both sides', 'x = 15 - 7', 'x = 8'],
      },
      geometry: {
        index: 0,
        problem_text: 'Find the area of a rectangle with length 8 and width 5',
        problem_type: 'geometry',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'geometry',
        answer: '40 square units',
        solution_steps: ['Area = length × width', '8 × 5 = 40 square units'],
      },
      word_problem: {
        index: 0,
        problem_text: 'Sarah has 24 apples. She gives 6 to each friend. How many friends can she share with?',
        problem_type: 'word_problem',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'division',
        answer: '4 friends',
        solution_steps: ['Total apples: 24', 'Apples per friend: 6', '24 ÷ 6 = 4 friends'],
      },
      order_of_operations: {
        index: 0,
        problem_text: '3 + 4 × 2 = ?',
        problem_type: 'order_of_operations',
        difficulty: problem.difficulty as Difficulty,
        source_topic: 'order of operations',
        answer: '11',
        solution_steps: ['Multiply first: 4 × 2 = 8', 'Then add: 3 + 8 = 11'],
      },
      other: {
        index: 0,
        problem_text: '15 + 23 = ?',
        problem_type: 'addition',
        difficulty: 'easy',
        source_topic: 'addition',
        answer: '38',
        solution_steps: ['5 + 3 = 8', '1 + 2 = 3', 'Answer: 38'],
      },
    };

    return newProblems[problem.problem_type] || newProblems.addition;
  }

  /**
   * Generate practice test
   */
  async generatePracticeTest(
    problems: ExtractedProblem[],
    count: number,
    _options: GenerateTestOptions
  ): Promise<GeneratedProblem[]> {
    await delay(2000);

    const generatedProblems: GeneratedProblem[] = [];

    for (let i = 0; i < count; i++) {
      const baseProblem = problems[i % problems.length];
      const similar = await this.generateSimilar(baseProblem);
      generatedProblems.push({
        ...similar,
        index: i,
      });
    }

    return generatedProblems;
  }

  /**
   * Evaluate answers in batch
   */
  async evaluateAnswers(
    problems: GeneratedProblem[],
    answers: string[]
  ): Promise<BatchEvaluationResult> {
    await delay(1500);

    const evaluations = problems.map((p, i) => {
      const studentAnswer = answers[i] || '';
      const normalizedStudent = studentAnswer.toLowerCase().trim().replace(/\s+/g, '');
      const normalizedCorrect = p.answer.toLowerCase().trim().replace(/\s+/g, '');
      const isCorrect = normalizedStudent === normalizedCorrect;

      return {
        problem_index: i,
        is_correct: isCorrect,
        student_answer: studentAnswer,
        correct_answer: p.answer,
        error_type: isCorrect ? undefined : randomItem(['calculation_error', 'conceptual_error', 'wrong_operation'] as const),
        brief_note: isCorrect ? undefined : 'Check your work',
      };
    });

    const correct = evaluations.filter((e) => e.is_correct).length;

    return {
      evaluations,
      summary: {
        total: problems.length,
        correct,
        incorrect: problems.length - correct,
      },
    };
  }

  /**
   * Evaluate single answer
   */
  async evaluateSingleAnswer(
    _problemText: string,
    correctAnswer: string,
    studentAnswer: string
  ): Promise<EvaluationResult> {
    await delay(500);

    const normalizedStudent = studentAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();
    const isCorrect = normalizedStudent === normalizedCorrect;

    return {
      problem_index: 0,
      is_correct: isCorrect,
      student_answer: studentAnswer,
      correct_answer: correctAnswer,
      error_type: isCorrect ? undefined : 'calculation_error',
      brief_note: isCorrect ? undefined : 'Check your calculation',
    };
  }

  /**
   * Explain concept
   */
  async explainConcept(
    problem: ExtractedProblem | GeneratedProblem,
    _studentAnswer: string,
    correctAnswer: string,
    _gradeLevel: string
  ): Promise<MsGuideExplanation> {
    await delay(2000);

    const problemType = problem.problem_type;
    const explanation = MOCK_EXPLANATIONS[problemType] || MOCK_EXPLANATIONS.addition;

    return {
      ...explanation,
      correct_answer: correctAnswer,
    };
  }

  /**
   * Chat with Ms. Guide
   */
  async chat(
    _history: ChatMessage[],
    question: string,
    _context: ProblemContext
  ): Promise<string> {
    await delay(1000);

    const lowerQuestion = question.toLowerCase();

    // Find matching response
    for (const { keywords, response } of CHAT_RESPONSES) {
      if (keywords.some((k) => lowerQuestion.includes(k))) {
        return response;
      }
    }

    // Default response
    return "That's a great question! Let me explain... In math, understanding the 'why' is just as important as getting the right answer. Would you like me to walk through another example, or is there a specific part that's confusing?";
  }

  /**
   * Generate audio (returns placeholder in mock mode)
   */
  async generateAudio(_text: string): Promise<string> {
    await delay(500);
    // Return a placeholder - in real app, this would be a base64 audio or URL
    return 'data:audio/mp3;base64,mock_audio_placeholder';
  }
}

/**
 * Create mock AI service instance
 */
export function createMockAIService(): MsGuideServiceInterface {
  return new MockAIService();
}
