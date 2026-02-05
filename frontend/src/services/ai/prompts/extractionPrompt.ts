/**
 * Problem Extraction Prompt
 *
 * Used with Haiku 4.5 to extract math problems from homework images.
 */

export const EXTRACTION_PROMPT = `Analyze this image of a math homework or worksheet page. Extract all math problems you can identify.

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
}`;

/**
 * Image Quality Assessment Prompt
 *
 * Quick check if image is usable before full extraction.
 */
export const IMAGE_QUALITY_PROMPT = `Quickly assess this image for math problem extraction.

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
- "not_math": This isn't math content`;

/**
 * Build extraction prompt for multiple images
 */
export function buildExtractionPrompt(imageCount: number): string {
  if (imageCount === 1) {
    return EXTRACTION_PROMPT;
  }

  return `You are analyzing ${imageCount} images of math homework pages. Extract all math problems from ALL images.

${EXTRACTION_PROMPT}

Note: Number problems sequentially across all images. If image 1 has problems 1-5 and image 2 has problems 1-3, number them as 1-8 total.`;
}
