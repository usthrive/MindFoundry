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

Important:
- Only extract MATH problems. Ignore other subjects.
- If a problem is partially visible or hard to read, include it with lower confidence.
- If handwriting is unclear, make your best interpretation.
- Preserve the exact wording of word problems.
- If no math problems are found, return an empty array.

Return ONLY valid JSON in this exact format:
{
  "problems": [
    {
      "problem_number": "1",
      "problem_text": "347 + 289 = ?",
      "problem_type": "addition",
      "difficulty": "medium",
      "grade_level": "3",
      "confidence": 0.95
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
