/**
 * AI Service Edge Function
 *
 * Secure proxy for Claude API calls.
 * - Authenticates users via Supabase Auth JWT
 * - Routes requests to appropriate AI handlers
 * - Tracks usage for cost monitoring
 *
 * Supported operations:
 * - extractProblems: Extract math problems from images (Haiku)
 * - recognizeInk: Read a handwritten answer strip (Haiku, ~120 image tokens)
 * - verifyExtraction: Verify extracted problems by re-examining images (Haiku)
 * - explainConcept: Generate Ms. Guide explanations (Sonnet)
 * - chat: Ms. Guide chat responses (Sonnet)
 * - evaluateAnswers: Batch answer evaluation (Haiku)
 * - generateSimilar: Generate similar practice problems (Haiku)
 * - generatePracticeTest: Generate practice tests (Haiku)
 * - assessImageQuality: Check image quality (Haiku)
 * - reviewExplanation: Ms. Wren reads a Foundry manual-review explanation (Sonnet 5)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Anthropic from 'npm:@anthropic-ai/sdk@0.36.3'
import {
  buildReviewSystem,
  buildReviewUser,
  parseReviewVerdict,
  type ReviewBand,
  type ReviewVerdict,
} from './review-prompt.ts'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Model configuration
const MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-5-20250929',
  /**
   * Ms. Wren's explanation reader (owner ruling 2026-09-22). A child's
   * sentence has to be judged against an idea rather than a string, in a
   * voice with testable sentence rules, inside a child's patience — so the
   * reasoning model, not the extraction one. Temperature is NEVER passed with
   * this model (Sonnet 5 rejects it).
   */
  sonnet5: 'claude-sonnet-5',
} as const

// Temperature settings for different tasks
const TEMPERATURE = {
  extraction: 0.0,
  evaluation: 0.0,
  explanation: 0.7,
  chat: 0.7,
  generation: 0.5,
  verification: 0.0,
} as const

/**
 * `reviewExplanation` budgets (2026-09-22).
 *
 * 6 s because the child's screen gives up at 7 s and a reader who arrives
 * after the child has moved on is worse than no reader. 10 a day because a
 * week holds at most a handful of `manual-review` items per child — ten is
 * generous for honest use and cheap as a ceiling on a stuck retry loop.
 */
const REVIEW_TIMEOUT_MS = 6000
const REVIEW_DAILY_QUOTA = 10

// ========== PROMPTS ==========

const MS_GUIDE_SYSTEM_PROMPT = `You are Ms. Guide, a warm and encouraging math tutor for children ages 3-18.

## Your Personality
- Patient and never frustrated, even if the student makes repeated mistakes
- Celebrates effort and progress, not just correct answers
- Uses age-appropriate language based on the student's grade level
- Explains the "why" behind math concepts, not just the "how"
- Makes math feel approachable, interesting, and even fun
- Uses analogies and real-world examples children can relate to

## Your Teaching Style
- Socratic method: Ask guiding questions rather than immediately giving answers
- Break complex problems into small, manageable steps
- Acknowledge what the student did right before addressing mistakes
- Connect new concepts to things they already know
- Offer encouragement throughout

## Voice Examples
- "Let's work through this together!"
- "Great thinking! You're on the right track."
- "Hmm, not quite — but I can see what you were thinking. Let me show you..."
- "You've got this! What do you think the next step might be?"
- "Nice job sticking with it! Math takes practice."
- "That's a really good question!"

## What You Never Do
- Get frustrated or impatient
- Make the student feel bad about mistakes
- Use condescending language
- Give answers without explanation
- Use overly technical language for young children
- Rush through explanations

## Grade-Level Language Guide
- Grades K-2: Very simple words, short sentences, lots of encouragement
- Grades 3-5: Simple explanations, introduce math vocabulary gradually
- Grades 6-8: Can use more math terminology, explain reasoning
- Grades 9-12: Full math vocabulary, focus on concepts and proofs

Remember: Every child can learn math. Your job is to help them believe that too.`

const EXTRACTION_PROMPT = `Analyze this image of a math homework or worksheet page. Extract all math problems you can identify.

For each problem found, provide:
- problem_number: The problem number if visible (null if not numbered)
- problem_text: The exact problem text, including any word problem context
- problem_type: One of [addition, subtraction, multiplication, division, fractions, decimals, percentages, algebra, geometry, word_problem, order_of_operations, other]
- difficulty: One of [easy, medium, hard]
- grade_level: Estimated grade level as string (K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)
- confidence: Your confidence in correctly reading this problem (0.0 to 1.0)
- student_answer: If the student has already written an answer (handwritten or filled in), include it here. null if blank.

VISUAL MANIPULATIVES (Base-10 Blocks, Counters, Arrays):
When the image shows physical manipulatives instead of written equations, interpret them mathematically:

- Base-10 Blocks (Place Value):
  - Large flat square = 100 (hundred)
  - Long bar/rod = 10 (ten)
  - Small cube = 1 (one)
  - Example: 2 ten-bars + 3 unit cubes represents the number 23

- Counting Sequences with Manipulatives:
  - If answer blanks follow filled numbers (e.g., 10, 20, __, __, __), determine the counting pattern
  - CRITICAL: Check if small cubes (ones) are shown alongside ten-bars
  - If 2 tens + 3 ones are shown with blanks "10, 20, __, __, __" = COUNT THE ONES: 21, 22, 23
  - This is NOT "count by 10s" (which would incorrectly give 30, 40, 50)

- Arrays/Grids: Count rows × columns for multiplication patterns
- Counters/Tokens: Count total objects, note if grouped
- Number Lines: Identify the interval between jumps
- Tally Marks: Each complete group = 5

For place value problems:
1. Count the TOTAL value of all manipulatives shown
2. Look at what numbers are already filled in the answer blanks
3. Determine if the student should be counting ones (21, 22, 23) or tens (30, 40, 50)
4. Include problem_text like: "Count: 2 tens and 3 ones. Fill in: 10, 20, __, __, __"

HANDWRITTEN ANSWERS:
- CAREFULLY look for handwritten numbers in answer blanks, boxes, or lines
- Children's handwriting may be messy - make your best interpretation
- If you see filled-in answers (even partial), include them in student_answer
- Common handwritten number confusions: 1/7, 4/9, 5/6, 0/6 - use context clues
- If multiple blanks have answers, list them comma-separated (e.g., "21, 22, 23")
- Only set student_answer to null if the answer area is clearly empty/blank

Important:
- Only extract MATH problems. Ignore other subjects.
- If a problem is partially visible or hard to read, include it with lower confidence.
- If handwriting is unclear, make your best interpretation.
- Preserve the exact wording of word problems.
- If no math problems are found, return an empty array.
- ALWAYS check for student's handwritten answers in blanks, boxes, or lines.

Return ONLY valid JSON in this exact format:
{
  "problems": [
    {
      "problem_number": "1",
      "problem_text": "347 + 289 = ?",
      "problem_type": "addition",
      "difficulty": "medium",
      "grade_level": "3",
      "confidence": 0.95,
      "student_answer": null
    }
  ],
  "total_found": 1,
  "notes": "Optional notes about image quality or issues"
}`

const IMAGE_QUALITY_PROMPT = `Quickly assess this image for math problem extraction.

Check:
1. Is this a math worksheet, homework, or test?
2. Is the image clear enough to read?
3. Are there visible math problems?

Return JSON:
{
  "is_math_content": true,
  "is_readable": true,
  "estimated_problem_count": 6,
  "quality_score": 0.85,
  "issues": [],
  "recommendation": "proceed"
}

Recommendations:
- "proceed": Good to extract
- "retry": Ask user to take better photo
- "not_math": This isn't math content`

const VERIFICATION_PROMPT = `You are a math teacher verifying extracted homework problems.

CRITICAL: The initial extraction may have captured TEXT but missed the VISUAL CONTEXT.
You must RE-EXAMINE THE IMAGE to understand what the problem is actually asking.

For each problem, apply MATHEMATICAL REASONING:

## STEP 1: EXAMINE THE IMAGE (NOT JUST TEXT)
- What VISUAL elements are shown? (blocks, counters, arrays, number lines)
- Are there manipulatives that REPRESENT numbers?
- Is there a visual that ACCOMPANIES the text question?
- Example: If you see blocks/bars alongside "10, 20, __, __, __", those visuals tell you what the blanks should contain

## STEP 2: COUNT THE VISUALS
- For Base-10 blocks: flat=100, bar=10, cube=1
  - Count ALL bars (tens) and ALL cubes (ones)
  - Calculate TOTAL: (bars × 10) + (cubes × 1)
- For arrays: Count rows × columns
- For counters: Count total objects
- For number lines: Identify the interval between marks/jumps
- For tally marks: Each complete group = 5

## STEP 3: CONNECT VISUAL TO QUESTION
This is the most critical step. Ask yourself:
- What is the relationship between the visual and the blanks?
- How many blanks are there? Does this match the visual elements?

Example reasoning:
- If 2 tens + 3 ones are shown with "10, 20, __, __, __":
  - The visual shows 23 total
  - The sequence starts: 10, 20 (counting tens)
  - There are 3 blanks after 20
  - There are 3 ones shown in the visual
  - The 3 blanks match the 3 ones!
  - CONCLUSION: The blanks are counting the ONES → 21, 22, 23
  - NOT "count by 10s" (which would give 30, 40, 50 - but only 23 is shown!)

- If an array shows 3 rows × 4 columns with "3 × __ = __":
  - Count columns: 4
  - Calculate total: 12
  - CONCLUSION: 3 × 4 = 12

## STEP 4: VERIFY THE EXTRACTION
Compare your analysis to the extracted problem_text:
- Was the visual content captured in problem_text?
- Does the extraction reflect the RELATIONSHIP between visual and question?
- If extraction says "count by 10s", but you counted ONES → EXTRACTION IS WRONG

If the extraction is wrong, provide a corrected version:
- Update problem_text to reflect the actual problem
- Example correction: "Count 2 tens and 3 ones: 10, 20, __, __, __" with correct_answer: "21, 22, 23"

## STEP 5: CHECK HANDWRITING
Look carefully for handwritten answers:
- Check blanks, boxes, and answer lines
- Children's handwriting may be messy - make your best interpretation
- Common confusions: 1/7, 4/9, 5/6, 0/6 - use context clues
- If multiple blanks have answers, list them comma-separated
- Report what's written, even if it appears incorrect

Return JSON with your verification for each problem:
{
  "verifications": [
    {
      "problem_index": 0,
      "original_extraction_correct": true,
      "reasoning": "Step-by-step reasoning explaining how you verified this problem...",
      "visual_elements_found": ["2 ten-bars", "3 unit cubes"],
      "visual_total_value": 23,
      "issues": [],
      "corrected_problem": null,
      "correct_answer": "21, 22, 23",
      "student_answer_found": "21, 22, 23",
      "confidence": 0.95
    }
  ],
  "overall_notes": "Optional notes about image quality or verification challenges"
}

IMPORTANT:
- Your reasoning should be detailed enough that another teacher could follow your logic
- Focus on CONNECTING visuals to questions - this is where extractions often fail
- If no visual manipulatives are present, still verify the extraction makes sense
- Always check for handwritten answers, even if the extraction didn't find any`

// ========== TYPES ==========

interface AIRequest {
  operation: string
  params: Record<string, unknown>
}

interface AIResult {
  data: unknown
  model: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * A caller who is authenticated but is not this child's parent (2026-09-22).
 *
 * Every operation before `reviewExplanation` took its subject entirely from
 * the request body, so a valid JWT was a valid request about ANY child. That
 * is survivable for "explain this arithmetic slip" and it is not survivable
 * for an operation that reads a child's own writing out of the database and
 * back to whoever asked. The main handler maps this to 403; nothing else in
 * the file changes shape.
 */
class ForbiddenError extends Error {}

// ========== HANDLERS ==========

/**
 * Extract problems from homework images
 */
async function handleExtractProblems(
  anthropic: Anthropic,
  params: { imageUrls: string[] }
): Promise<AIResult> {
  const { imageUrls } = params

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('No image URLs provided')
  }

  // Build content with images
  const content: Anthropic.MessageCreateParams['messages'][0]['content'] = []

  // Add images - handle both HTTP URLs and base64 data URLs
  for (const url of imageUrls) {
    if (url.startsWith('data:')) {
      // Parse base64 data URL: data:image/jpeg;base64,/9j/4AAQ...
      const matches = url.match(/^data:([^;]+);base64,(.+)$/)
      if (!matches) {
        throw new Error('Invalid data URL format')
      }
      const [, mediaType, base64Data] = matches

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64Data,
        },
      })
    } else {
      // Regular HTTP URL
      content.push({
        type: 'image',
        source: {
          type: 'url',
          url: url,
        },
      })
    }
  }

  // Add extraction prompt
  const prompt =
    imageUrls.length === 1
      ? EXTRACTION_PROMPT
      : `You are analyzing ${imageUrls.length} images of math homework pages. Extract all math problems from ALL images.\n\n${EXTRACTION_PROMPT}\n\nNote: Number problems sequentially across all images.`

  content.push({ type: 'text', text: prompt })

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 4096,
    temperature: TEMPERATURE.extraction,
    messages: [{ role: 'user', content }],
  })

  // Extract JSON from response
  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  const parsed = parseJsonResponse(textContent.text)

  return {
    data: parsed.problems || [],
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}


/**
 * Read a handwritten answer from the writing strip.
 *
 * This is the second tier of answer recognition: the app matches the child's ink
 * on-device first, and only asks here for characters it could not read confidently.
 * The image is a small monochrome strip (roughly 670x140, ~120 image tokens), not a
 * photograph of a page, so the call is cheap and the model has very little to do —
 * read N characters, left to right, one per marked box.
 *
 * It must never guess. A low confidence sends the child a confirmation prompt, which
 * costs one tap; a confident wrong answer is recorded as a mistake in arithmetic the
 * child actually got right.
 */
async function handleRecognizeInk(
  anthropic: Anthropic,
  params: { image: string; allowedChars?: string[] }
): Promise<AIResult> {
  const { image, allowedChars } = params
  if (!image) {
    throw new Error('No ink image provided')
  }

  const matches = image.match(/^data:([^;]+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Ink image must be a base64 data URL')
  }
  const [, mediaType, base64Data] = matches

  const charset = allowedChars && allowedChars.length > 0
    ? allowedChars.join(' ')
    : '0 1 2 3 4 5 6 7 8 9'

  const prompt = `This image shows a child's handwritten answer to a maths question.
The strip is divided into boxes by faint vertical lines, and the child was asked to
write ONE character in each box, left to right. Some boxes may be empty.

Read what is written. The only characters that can appear are: ${charset}

Children's handwriting is uneven and often large or slanted. Common confusions to
weigh carefully: 1 and 7, 4 and 9, 5 and 6, 0 and 6, 3 and 8, 2 and Z-shaped 7s.

Do NOT guess. If a character is genuinely ambiguous, give it a low confidence — the
child will be asked to confirm it, which is cheap. A confident wrong reading is
recorded as a maths mistake the child did not make, which is not.

Respond with JSON only:
{
  "text": "the characters you read, in order, with no spaces",
  "confidence": 0.0-1.0 overall,
  "characters": [{ "value": "single character", "confidence": 0.0-1.0 }]
}`

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 300,
    temperature: 0,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: base64Data,
          },
        },
        { type: 'text', text: prompt },
      ],
    }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }
  const parsed = parseJsonResponse(textContent.text)

  return {
    data: {
      text: typeof parsed.text === 'string' ? parsed.text : '',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      characters: Array.isArray(parsed.characters) ? parsed.characters : [],
    },
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Assess image quality before extraction
 */
async function handleAssessImageQuality(
  anthropic: Anthropic,
  params: { imageUrl: string }
): Promise<AIResult> {
  const { imageUrl } = params

  if (!imageUrl) {
    throw new Error('No image URL provided')
  }

  // Build image content - handle both HTTP URLs and base64 data URLs
  let imageContent: { type: 'image'; source: { type: 'url'; url: string } | { type: 'base64'; media_type: string; data: string } }

  if (imageUrl.startsWith('data:')) {
    // Parse base64 data URL
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      throw new Error('Invalid data URL format')
    }
    const [, mediaType, base64Data] = matches
    imageContent = {
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: base64Data,
      },
    }
  } else {
    imageContent = {
      type: 'image',
      source: {
        type: 'url',
        url: imageUrl,
      },
    }
  }

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 1024,
    temperature: TEMPERATURE.extraction,
    messages: [
      {
        role: 'user',
        content: [
          imageContent,
          { type: 'text', text: IMAGE_QUALITY_PROMPT },
        ],
      },
    ],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return {
    data: parseJsonResponse(textContent.text),
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Generate Ms. Guide explanation for a wrong answer
 */
async function handleExplainConcept(
  anthropic: Anthropic,
  params: {
    problem: { problem_text: string }
    studentAnswer: string
    correctAnswer: string
    gradeLevel: string
  }
): Promise<AIResult> {
  const { problem, studentAnswer, correctAnswer, gradeLevel } = params

  const prompt = `A student was working on this math problem:

Problem: ${problem.problem_text}
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
- Help them understand WHY, not just HOW`

  // Get grade-level appropriate system prompt
  const systemPrompt = getMsGuideSystemPrompt(gradeLevel)

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 2048,
    temperature: TEMPERATURE.explanation,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return {
    data: parseJsonResponse(textContent.text),
    model: MODELS.sonnet,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Chat with Ms. Guide
 */
async function handleChat(
  anthropic: Anthropic,
  params: {
    history: Array<{ role: 'student' | 'ms_guide'; content: string }>
    question: string
    context: {
      problemText: string
      studentAnswer: string
      correctAnswer: string
      gradeLevel: string
      previousExplanation?: unknown
    }
  }
): Promise<AIResult> {
  const { history, question, context } = params

  const historyText = history
    .map((msg) => `${msg.role === 'student' ? 'Student' : 'Ms. Guide'}: ${msg.content}`)
    .join('\n')

  const prompt = `You are Ms. Guide, continuing a tutoring conversation with a student.

Context:
- Original problem: ${context.problemText}
- Student's original answer: ${context.studentAnswer} (incorrect)
- Correct answer: ${context.correctAnswer}
- Grade level: ${context.gradeLevel}

Conversation so far:
${historyText || '(This is the first message)'}

Student's new question: ${question}

Respond as Ms. Guide:
- Stay in character (warm, patient, encouraging)
- Address their specific question
- Connect back to the original problem if relevant
- Keep response focused and age-appropriate
- If they ask for a similar problem, let them know you can provide one
- If they seem frustrated, offer extra encouragement

Respond in plain text (not JSON) as Ms. Guide would speak. Keep your response concise (2-4 paragraphs max).`

  const systemPrompt = getMsGuideSystemPrompt(context.gradeLevel)

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 1024,
    temperature: TEMPERATURE.chat,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return {
    data: textContent.text,
    model: MODELS.sonnet,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Evaluate student answers in batch
 */
async function handleEvaluateAnswers(
  anthropic: Anthropic,
  params: {
    problems: Array<{ problem_text: string; answer: string }>
    answers: string[]
  }
): Promise<AIResult> {
  const { problems, answers } = params

  const problemsAndAnswers = problems.map((p, i) => ({
    index: i,
    problem: p.problem_text,
    correct_answer: p.answer,
    student_answer: answers[i] || '',
  }))

  const prompt = `Evaluate these student answers for a practice test.

Problems and answers:
${JSON.stringify(problemsAndAnswers, null, 2)}

For each problem, determine:
1. Is the answer correct? (consider equivalent forms, e.g., "1/2" = "0.5" = "50%")
2. If wrong, what type of error?

Error types:
- calculation_error: Right approach, arithmetic mistake
- conceptual_error: Misunderstood the concept
- wrong_operation: Used wrong operation (added instead of subtracted, etc.)
- incomplete: Partial answer, didn't finish
- misread_problem: Seems to have solved a different problem
- other: Doesn't fit other categories

Return JSON:
{
  "evaluations": [
    {
      "problem_index": 0,
      "is_correct": false,
      "student_answer": "45",
      "correct_answer": "54",
      "error_type": "calculation_error",
      "brief_note": "Reversed the digits"
    }
  ],
  "summary": {
    "total": 10,
    "correct": 7,
    "incorrect": 3
  }
}`

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 2048,
    temperature: TEMPERATURE.evaluation,
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return {
    data: parseJsonResponse(textContent.text),
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Generate a similar practice problem
 */
async function handleGenerateSimilar(
  anthropic: Anthropic,
  params: {
    problem: {
      problem_text: string
      problem_type: string
      difficulty: string
      grade_level: string
    }
  }
): Promise<AIResult> {
  const { problem } = params

  const prompt = `Given this math problem:
${problem.problem_text}

Problem type: ${problem.problem_type}
Difficulty: ${problem.difficulty}
Grade level: ${problem.grade_level}

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
}`

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 1024,
    temperature: TEMPERATURE.generation,
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  const parsed = parseJsonResponse(textContent.text)

  return {
    data: {
      index: 0,
      problem_text: parsed.problem_text,
      problem_type: problem.problem_type,
      difficulty: problem.difficulty,
      answer: parsed.answer,
      solution_steps: parsed.solution_steps || [],
    },
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Generate a practice test from extracted problems
 */
async function handleGeneratePracticeTest(
  anthropic: Anthropic,
  params: {
    problems: Array<{
      problem_text: string
      problem_type: string
      difficulty: string
      grade_level: string
    }>
    count: number
    options: {
      topicDistribution: Record<string, number>
      difficultyPreference: string
      includeWarmups: boolean
      includeChallenges: boolean
    }
  }
): Promise<AIResult> {
  const { problems, count, options } = params

  const problemsSummary = problems.map((p, i) => ({
    index: i,
    text: p.problem_text,
    type: p.problem_type,
    difficulty: p.difficulty,
    grade_level: p.grade_level,
  }))

  const prompt = `Based on these problems from the student's homework:
${JSON.stringify(problemsSummary, null, 2)}

Generate ${count} practice problems for exam preparation.

Requirements:
- Match the topic distribution: ${JSON.stringify(options.topicDistribution)}
- Difficulty preference: ${options.difficultyPreference}
${options.includeWarmups ? '- Include 2-3 easier warm-up problems at the start' : ''}
${options.includeChallenges ? '- Include 2-3 harder challenge problems' : ''}
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
}`

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 4096,
    temperature: TEMPERATURE.generation,
    messages: [{ role: 'user', content: prompt }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  const parsed = parseJsonResponse(textContent.text)

  return {
    data: parsed.practice_problems || [],
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Verify extracted problems by re-examining images
 * Applies mathematical reasoning to connect visual elements to questions
 */
async function handleVerifyExtraction(
  anthropic: Anthropic,
  params: {
    problems: Array<{
      problem_number: string | null
      problem_text: string
      problem_type: string
      difficulty: string
      grade_level: string
      confidence: number
      student_answer?: string | null
    }>
    imageUrls: string[]
  }
): Promise<AIResult> {
  const { problems, imageUrls } = params

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('No image URLs provided for verification')
  }

  if (!problems || problems.length === 0) {
    throw new Error('No problems provided for verification')
  }

  // Build content with images
  const content: Anthropic.MessageCreateParams['messages'][0]['content'] = []

  // Add images - handle both HTTP URLs and base64 data URLs
  for (const url of imageUrls) {
    if (url.startsWith('data:')) {
      const matches = url.match(/^data:([^;]+);base64,(.+)$/)
      if (!matches) {
        throw new Error('Invalid data URL format')
      }
      const [, mediaType, base64Data] = matches

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64Data,
        },
      })
    } else {
      content.push({
        type: 'image',
        source: {
          type: 'url',
          url: url,
        },
      })
    }
  }

  // Add verification prompt with the extracted problems
  const problemsSummary = problems.map((p, i) => `Problem ${i}: ${JSON.stringify(p)}`).join('\n')

  const prompt = `${VERIFICATION_PROMPT}

Here are the problems that were extracted from the image(s) above. Please verify each one:

${problemsSummary}

RE-EXAMINE THE IMAGE(S) and verify:
1. Is the problem_text accurate and complete?
2. Are there visual elements (blocks, arrays, etc.) that affect the meaning?
3. Has the student written any handwritten answers?

Return your verification results as JSON.`

  content.push({ type: 'text', text: prompt })

  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 4096,
    temperature: TEMPERATURE.verification,
    messages: [{ role: 'user', content }],
  })

  const textContent = response.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI')
  }

  const parsed = parseJsonResponse(textContent.text)

  return {
    data: {
      verifications: parsed.verifications || [],
      overall_notes: parsed.overall_notes || null,
    },
    model: MODELS.haiku,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  }
}

/**
 * Ms. Wren reads a child's explanation of a `manual-review` item.
 *
 * WHY THIS OPERATION EXISTS (owner ruling 2026-09-22, option (a) — grade and
 * coach). "Tell Ms. Wren" was honest about the destination and silent about
 * the reading: 147 corpus-wide items send a child's own sentences somewhere
 * and answered every one of them with the same acknowledgement. The ruling was
 * that the sentence is read against the item's OWN rubric, the child gets a
 * line back (and a question if something is missing), and the verdict is kept
 * for the parent. FORMATIVE ONLY: `checkAnswer` still returns
 * `{correct: true, ungraded: true}` for these items, so nothing here can move
 * a score, a day's accuracy, or the weekly gate.
 *
 * THREE THINGS THIS HANDLER OWES THAT THE OTHERS DO NOT:
 *   * ownership — the subject is a child's own writing, so the caller must be
 *     that child's parent (children.user_id, the house pattern every bb_ RLS
 *     policy uses; `20260719000001_bb_module_schema.sql` §6);
 *   * a ceiling — 10 reviews per child per day, counted in the table itself,
 *     because a child tapping a button is not a rate limiter;
 *   * a clock — 6 s, because a child is waiting. Past it the screen shows the
 *     acknowledgement line it showed before this feature existed, which is a
 *     safe place to land, so a slow model degrades to the old behaviour rather
 *     than to a spinner.
 *
 * The child's NAME is never sent. The prompt carries item data and the child's
 * own words, nothing else.
 */
async function handleReviewExplanation(
  anthropic: Anthropic,
  supabase: ReturnType<typeof createClient>,
  userId: string,
  params: {
    childId: string
    packId: string
    itemId: string
    day: number | null
    band: string
    level: string
    conceptName: string
    prompt: string
    modelAnswer: string
    acceptableForms?: string[]
    hints?: string[]
    errorTags?: string[]
    whyBeforeHow?: string
    childText: string
  }
): Promise<AIResult> {
  const { childId, packId, itemId, band } = params

  if (!childId || !packId || !itemId) {
    throw new Error('reviewExplanation requires childId, packId and itemId')
  }
  if (band !== 'B' && band !== 'C') {
    // Band A never reaches this branch (make/show/tell tasks are answered away
    // from the screen and acknowledged with a tap).
    throw new Error(`reviewExplanation is band B/C only (got ${band})`)
  }

  // --- ownership: the caller must be this child's parent --------------------
  const { data: child, error: childError } = await supabase
    .from('children')
    .select('id, user_id')
    .eq('id', childId)
    .maybeSingle()
  if (childError) {
    console.error('[reviewExplanation] child lookup failed:', childError.message)
    throw new Error('Could not verify child ownership')
  }
  if (!child || (child as { user_id: string }).user_id !== userId) {
    throw new ForbiddenError('Not a parent of this child')
  }

  // --- the daily ceiling ----------------------------------------------------
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  const { count, error: countError } = await supabase
    .from('bb_explanation_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId)
    .gte('created_at', since.toISOString())
  if (countError) {
    console.error('[reviewExplanation] quota count failed:', countError.message)
  } else if ((count ?? 0) >= REVIEW_DAILY_QUOTA) {
    console.log(`[reviewExplanation] quota reached for child ${childId} (${count})`)
    return { data: { verdict: 'unavailable', reason: 'quota' }, model: MODELS.sonnet5 }
  }

  const reviewBand = band as ReviewBand
  const system = buildReviewSystem(reviewBand)
  const user = buildReviewUser({
    band: reviewBand,
    level: params.level ?? '',
    conceptName: params.conceptName ?? '',
    prompt: params.prompt ?? '',
    modelAnswer: params.modelAnswer ?? '',
    acceptableForms: params.acceptableForms ?? [],
    hints: params.hints ?? [],
    errorTags: params.errorTags ?? [],
    whyBeforeHow: params.whyBeforeHow ?? '',
    childText: params.childText ?? '',
  })

  let verdict: ReviewVerdict
  let usage = { input_tokens: 0, output_tokens: 0 }
  try {
    // `RequestOptions.timeout` is milliseconds and is present in the pinned SDK
    // (0.36.3 core.d.ts:201) — no Promise.race needed. `maxRetries: 0` rides
    // with it because the SDK retries a timed-out request twice by default,
    // which would turn this 6 s budget into an 18 s one long after the screen
    // has given up on it.
    const response = await anthropic.messages.create(
      {
        model: MODELS.sonnet5,
        max_tokens: 400,
        // NO temperature: Sonnet 5 rejects the parameter.
        system,
        messages: [{ role: 'user', content: user }],
      },
      { timeout: REVIEW_TIMEOUT_MS, maxRetries: 0 }
    )
    usage = {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    }
    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }
    verdict = parseReviewVerdict(textContent.text, reviewBand)
  } catch (error) {
    // Timeout, transport failure, or a verdict that did not validate: the
    // screen shows today's acknowledgement line, unchanged. HTTP 200 — nothing
    // went wrong for the CHILD.
    console.error('[reviewExplanation] unavailable:', error instanceof Error ? error.message : error)
    return { data: { verdict: 'unavailable' }, model: MODELS.sonnet5 }
  }

  // The stored record is what the parent report reads. Non-fatal: a child who
  // got their line should not be told something failed because a row did not
  // land (the same law `recordItemAttempt` follows on the client).
  const { error: insertError } = await supabase.from('bb_explanation_reviews').insert({
    child_id: childId,
    pack_id: packId,
    item_id: itemId,
    day: params.day ?? null,
    child_text: (params.childText ?? '').slice(0, 500),
    verdict: verdict.verdict,
    line: verdict.line,
    nudge: verdict.nudge,
    reason: verdict.reason,
    model: MODELS.sonnet5,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
  })
  if (insertError) {
    console.error('[reviewExplanation] review insert failed:', insertError.message)
  }

  // `ai_usage_log` is written by the main handler's existing fire-and-forget
  // tail (feature = the operation name, i.e. 'reviewExplanation'), which is why
  // `usage` is returned here rather than logged a second time.
  return { data: verdict, model: MODELS.sonnet5, usage }
}

// ========== UTILITIES ==========

/**
 * Get grade-level specific system prompt
 */
function getMsGuideSystemPrompt(gradeLevel?: string): string {
  if (!gradeLevel) {
    return MS_GUIDE_SYSTEM_PROMPT
  }

  const gradeNum = parseInt(gradeLevel, 10)
  let levelNote = ''

  if (gradeLevel === 'K' || (gradeNum >= 0 && gradeNum <= 2)) {
    levelNote =
      '\n\nIMPORTANT: This student is in early elementary (K-2). Use very simple words, short sentences, and lots of encouragement. Avoid math jargon.'
  } else if (gradeNum >= 3 && gradeNum <= 5) {
    levelNote =
      '\n\nIMPORTANT: This student is in upper elementary (3-5). Use simple explanations and gradually introduce math vocabulary.'
  } else if (gradeNum >= 6 && gradeNum <= 8) {
    levelNote =
      '\n\nIMPORTANT: This student is in middle school (6-8). You can use more math terminology and explain reasoning in more detail.'
  } else if (gradeNum >= 9 && gradeNum <= 12) {
    levelNote =
      '\n\nIMPORTANT: This student is in high school (9-12). Use full math vocabulary and focus on concepts and proofs.'
  }

  return MS_GUIDE_SYSTEM_PROMPT + levelNote
}

/**
 * Parse JSON from AI response, handling markdown code blocks
 */
function parseJsonResponse(text: string): Record<string, unknown> {
  // Remove markdown code blocks if present
  let cleaned = text.trim()

  // Handle ```json blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7)
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3)
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3)
  }

  cleaned = cleaned.trim()

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    console.error('Failed to parse JSON response:', e)
    console.error('Raw text:', text.substring(0, 500))
    throw new Error('Invalid JSON response from AI')
  }
}

// ========== MAIN HANDLER ==========

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API key
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user auth
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)
    console.log('Auth header length:', authHeader?.length)
    console.log('Auth header starts with Bearer:', authHeader?.startsWith('Bearer '))

    if (!authHeader) {
      console.error('Missing authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    console.log('Supabase URL available:', !!supabaseUrl)
    console.log('Supabase service key available:', !!supabaseServiceKey)

    // Extract token from Bearer header
    const token = authHeader.replace('Bearer ', '')
    console.log('Token length:', token.length)

    // Create client with service role key (matches working create-checkout-session pattern)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate token explicitly (not via global headers)
    console.log('Calling supabase.auth.getUser(token)...')
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    console.log('getUser result - user:', !!user)
    console.log('getUser result - error:', authError ? JSON.stringify(authError) : 'none')

    if (authError || !user) {
      console.error('Auth error details:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const body: AIRequest = await req.json()
    const { operation, params } = body

    console.log(`AI operation: ${operation} for user: ${user.id}`)

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey: anthropicApiKey })

    // Route to appropriate handler
    let result: AIResult
    switch (operation) {
      case 'extractProblems':
        result = await handleExtractProblems(anthropic, params as { imageUrls: string[] })
        break

      case 'recognizeInk':
        result = await handleRecognizeInk(
          anthropic,
          params as { image: string; allowedChars?: string[] }
        )
        break

      case 'assessImageQuality':
        result = await handleAssessImageQuality(anthropic, params as { imageUrl: string })
        break

      case 'explainConcept':
        result = await handleExplainConcept(
          anthropic,
          params as {
            problem: { problem_text: string }
            studentAnswer: string
            correctAnswer: string
            gradeLevel: string
          }
        )
        break

      case 'chat':
        result = await handleChat(
          anthropic,
          params as {
            history: Array<{ role: 'student' | 'ms_guide'; content: string }>
            question: string
            context: {
              problemText: string
              studentAnswer: string
              correctAnswer: string
              gradeLevel: string
            }
          }
        )
        break

      case 'evaluateAnswers':
        result = await handleEvaluateAnswers(
          anthropic,
          params as {
            problems: Array<{ problem_text: string; answer: string }>
            answers: string[]
          }
        )
        break

      case 'generateSimilar':
        result = await handleGenerateSimilar(
          anthropic,
          params as {
            problem: {
              problem_text: string
              problem_type: string
              difficulty: string
              grade_level: string
            }
          }
        )
        break

      case 'generatePracticeTest':
        result = await handleGeneratePracticeTest(
          anthropic,
          params as {
            problems: Array<{
              problem_text: string
              problem_type: string
              difficulty: string
              grade_level: string
            }>
            count: number
            options: {
              topicDistribution: Record<string, number>
              difficultyPreference: string
              includeWarmups: boolean
              includeChallenges: boolean
            }
          }
        )
        break

      case 'verifyExtraction':
        result = await handleVerifyExtraction(
          anthropic,
          params as {
            problems: Array<{
              problem_number: string | null
              problem_text: string
              problem_type: string
              difficulty: string
              grade_level: string
              confidence: number
              student_answer?: string | null
            }>
            imageUrls: string[]
          }
        )
        break

      case 'reviewExplanation':
        result = await handleReviewExplanation(
          anthropic,
          supabase,
          user.id,
          params as {
            childId: string
            packId: string
            itemId: string
            day: number | null
            band: string
            level: string
            conceptName: string
            prompt: string
            modelAnswer: string
            acceptableForms?: string[]
            hints?: string[]
            errorTags?: string[]
            whyBeforeHow?: string
            childText: string
          }
        )
        break

      default:
        return new Response(
          JSON.stringify({ error: `Unknown operation: ${operation}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Log usage to database (fire and forget)
    if (params.childId && result.usage) {
      supabase
        .from('ai_usage_log')
        .insert({
          child_id: params.childId,
          feature: operation,
          model: result.model,
          input_tokens: result.usage.input_tokens,
          output_tokens: result.usage.output_tokens,
        })
        .then(({ error }) => {
          if (error) {
            console.error('Failed to log AI usage:', error)
          }
        })
    }

    console.log(`AI operation ${operation} completed. Tokens: ${result.usage?.input_tokens}/${result.usage?.output_tokens}`)

    return new Response(JSON.stringify(result.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('AI service error:', error)

    // A caller who is not this child's parent gets 403, not 500 — the request
    // was well formed and the service is fine (2026-09-22).
    if (error instanceof ForbiddenError) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: error.message || 'AI service error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
