/**
 * School Problem Service
 *
 * Manages school problem templates and generates practice problems.
 * Uses LLM ONCE to extract templates, then generates problems algorithmically.
 */

import { supabase } from '../lib/supabase';
import { getAIService } from './ai';
import {
  generateFromTemplate,
  validateTemplate,
  type SchoolProblemTemplate,
  type GeneratedSchoolProblem,
  type TemplatePattern,
} from './generators/school';
import type { HomeworkProblemType } from '../types/homework';

/**
 * Template extraction result from AI
 */
interface ExtractedTemplate {
  problem_type: string;
  subtype?: string;
  grade_level: string;
  template_pattern: TemplatePattern;
  hint_templates: string[];
  solution_step_templates: string[];
}

/**
 * Find or create a template for a problem
 *
 * 1. First, check if a matching template already exists
 * 2. If not, use LLM to extract template (ONE-TIME cost)
 * 3. Save template to database for future reuse
 */
export async function findOrCreateTemplate(
  problemText: string,
  gradeLevel: string,
  childId?: string
): Promise<SchoolProblemTemplate | null> {
  try {
    // 1. Try to find existing matching template
    const existingTemplate = await findMatchingTemplate(problemText, gradeLevel, childId);
    if (existingTemplate) {
      // Update usage count
      await incrementTemplateUsage(existingTemplate.id);
      return existingTemplate;
    }

    // 2. Extract template using LLM (ONE-TIME cost)
    const extractedTemplate = await extractTemplateFromProblem(problemText, gradeLevel);
    if (!extractedTemplate) {
      console.error('Failed to extract template from problem');
      return null;
    }

    // 3. Save to database
    const savedTemplate = await saveTemplate(extractedTemplate, problemText, childId);
    return savedTemplate;
  } catch (error) {
    console.error('Error in findOrCreateTemplate:', error);
    return null;
  }
}

/**
 * Generate similar problems from a template (ZERO LLM cost)
 */
export async function generateSimilarProblems(
  templateId: string,
  count: number = 2,
  difficulty?: number
): Promise<GeneratedSchoolProblem[]> {
  try {
    // Fetch template from database
    const { data: template, error } = await supabase
      .from('school_problem_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error || !template) {
      console.error('Failed to fetch template:', error);
      return [];
    }

    // Generate problems algorithmically (FREE!)
    const problems = generateFromTemplate({
      template: template as SchoolProblemTemplate,
      count,
      difficulty: difficulty as 1 | 2 | 3 | 4 | 5 | undefined,
    });

    // Save generated problems for tracking
    await saveGeneratedProblems(problems, templateId);

    return problems;
  } catch (error) {
    console.error('Error generating similar problems:', error);
    return [];
  }
}

/**
 * Generate problems from problem text (handles template creation internally)
 */
export async function generatePracticeProblems(
  originalProblemText: string,
  gradeLevel: string,
  count: number = 2,
  childId?: string
): Promise<GeneratedSchoolProblem[]> {
  // Find or create template
  const template = await findOrCreateTemplate(originalProblemText, gradeLevel, childId);

  if (!template) {
    return [];
  }

  // Generate problems from template
  return generateFromTemplate({
    template,
    count,
    difficulty: template.difficulty_level as 1 | 2 | 3 | 4 | 5 | undefined,
  });
}

/**
 * Find matching template in database
 */
async function findMatchingTemplate(
  problemText: string,
  gradeLevel: string,
  childId?: string
): Promise<SchoolProblemTemplate | null> {
  try {
    // Classify the problem type first (simple heuristics)
    const problemType = classifyProblemType(problemText);

    // Query for matching templates
    let query = supabase
      .from('school_problem_templates')
      .select('*')
      .eq('problem_type', problemType)
      .eq('grade_level', gradeLevel)
      .order('times_used', { ascending: false })
      .limit(5);

    // If childId provided, prefer child-specific templates but also include generic
    if (childId) {
      query = query.or(`child_id.eq.${childId},child_id.is.null`);
    } else {
      query = query.is('child_id', null);
    }

    const { data: templates, error } = await query;

    if (error || !templates?.length) {
      return null;
    }

    // Find best matching template (based on operand range similarity)
    const operands = extractOperands(problemText);
    const bestMatch = findBestMatchingTemplate(templates as SchoolProblemTemplate[], operands);

    return bestMatch;
  } catch (error) {
    console.error('Error finding matching template:', error);
    return null;
  }
}

/**
 * Classify problem type using simple heuristics
 */
function classifyProblemType(problemText: string): string {
  const text = problemText.toLowerCase();

  // Check for fractions
  if (text.includes('/') && /\d+\s*\/\s*\d+/.test(text)) {
    return 'fractions';
  }

  // Check for algebra (variables)
  if (/[xyz]\s*[+\-×÷=]/.test(text) || text.includes('solve for')) {
    return 'algebra';
  }

  // Check for geometry keywords
  if (/\b(area|perimeter|triangle|square|rectangle|circle)\b/.test(text)) {
    return 'geometry';
  }

  // Check for order of operations (parentheses)
  if (text.includes('(') && text.includes(')')) {
    return 'order_of_operations';
  }

  // Check for percentages
  if (text.includes('%') || text.includes('percent')) {
    return 'percentages';
  }

  // Check for decimals
  if (/\d+\.\d+/.test(text)) {
    return 'decimals';
  }

  // Check for word problem (contains more words than numbers)
  const wordCount = text.split(/\s+/).length;
  const numberCount = (text.match(/\d+/g) || []).length;
  if (wordCount > numberCount * 3) {
    return 'word_problem';
  }

  // Check for basic operations
  if (text.includes('+') || text.includes('add') || text.includes('plus') || text.includes('sum')) {
    return 'addition';
  }
  if (text.includes('-') || text.includes('subtract') || text.includes('minus') || text.includes('take away')) {
    return 'subtraction';
  }
  if (text.includes('×') || text.includes('*') || text.includes('times') || text.includes('multiply')) {
    return 'multiplication';
  }
  if (text.includes('÷') || text.includes('divide') || text.includes('split') || text.includes('share')) {
    return 'division';
  }

  // Default to addition
  return 'addition';
}

/**
 * Extract numeric operands from problem text
 */
function extractOperands(problemText: string): number[] {
  const numbers = problemText.match(/\d+(\.\d+)?/g);
  return numbers ? numbers.map(Number) : [];
}

/**
 * Find best matching template based on operand ranges
 */
function findBestMatchingTemplate(
  templates: SchoolProblemTemplate[],
  operands: number[]
): SchoolProblemTemplate | null {
  if (!templates.length) return null;
  if (!operands.length) return templates[0];

  // Score each template based on how well it matches the operands
  let bestTemplate = templates[0];
  let bestScore = -Infinity;

  for (const template of templates) {
    const ranges = template.template_pattern.operand_ranges;
    let score = 0;

    for (let i = 0; i < Math.min(operands.length, ranges.length); i++) {
      const operand = operands[i];
      const range = ranges[i];

      // Check if operand falls within range
      if (operand >= range.min && operand <= range.max) {
        score += 10;
      }

      // Score based on proximity to range center
      const center = (range.min + range.max) / 2;
      const distance = Math.abs(operand - center);
      const rangeSize = range.max - range.min;
      score -= distance / (rangeSize || 1);
    }

    // Prefer templates that have been used more (validated)
    score += template.times_used * 0.5;

    if (score > bestScore) {
      bestScore = score;
      bestTemplate = template;
    }
  }

  return bestTemplate;
}

/**
 * Extract template from problem using LLM (ONE-TIME cost per unique problem type)
 */
async function extractTemplateFromProblem(
  problemText: string,
  gradeLevel: string
): Promise<ExtractedTemplate | null> {
  try {
    const aiService = getAIService();

    // Use AI to extract template pattern
    const response = await aiService.extractProblemTemplate(problemText, gradeLevel);

    if (!response) return null;

    // Convert AI response to our internal ExtractedTemplate format
    const converted: ExtractedTemplate = {
      problem_type: response.problem_type,
      subtype: response.subtype,
      grade_level: response.grade_level,
      template_pattern: {
        format: response.template_pattern.format === 'word'
          ? 'word'
          : response.template_pattern.format,
        operand_ranges: response.template_pattern.operand_ranges.map(range => ({
          min: range.min,
          max: range.max,
          type: range.type || 'integer',
        })),
        operators: response.template_pattern.operators,
        constraints: response.template_pattern.constraints,
        word_problem_template: response.template_pattern.word_problem_template,
        variable_names: response.template_pattern.variable_names,
      },
      hint_templates: response.hint_templates,
      solution_step_templates: response.solution_step_templates,
    };

    return converted;
  } catch (error) {
    console.error('Error extracting template:', error);
    return null;
  }
}

/**
 * Save template to database
 */
async function saveTemplate(
  extracted: ExtractedTemplate,
  sourceProblemText: string,
  childId?: string
): Promise<SchoolProblemTemplate | null> {
  try {
    const template: Partial<SchoolProblemTemplate> = {
      child_id: childId || null,
      problem_type: extracted.problem_type as HomeworkProblemType,
      subtype: extracted.subtype || null,
      grade_level: extracted.grade_level,
      template_pattern: extracted.template_pattern,
      hint_templates: extracted.hint_templates,
      solution_step_templates: extracted.solution_step_templates,
      source_problem_text: sourceProblemText,
      difficulty_level: 1,
      times_used: 0,
    };

    const { data, error } = await supabase
      .from('school_problem_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      return null;
    }

    // Validate the template can generate problems
    if (data && !validateTemplate(data as SchoolProblemTemplate)) {
      console.warn('Template validation failed, but keeping for future improvement');
    }

    return data as SchoolProblemTemplate;
  } catch (error) {
    console.error('Error saving template:', error);
    return null;
  }
}

/**
 * Increment template usage count
 */
async function incrementTemplateUsage(templateId: string): Promise<void> {
  try {
    await supabase.rpc('increment_template_usage', { template_id: templateId });
  } catch (error) {
    console.error('Error incrementing template usage:', error);
  }
}

/**
 * Save generated problems for tracking
 */
async function saveGeneratedProblems(
  problems: GeneratedSchoolProblem[],
  templateId: string
): Promise<void> {
  try {
    const records = problems.map(p => ({
      template_id: templateId,
      problem_text: p.problem_text,
      correct_answer: String(p.correct_answer),
      problem_data: p.problem_data,
      difficulty_level: p.difficulty,
    }));

    await supabase.from('school_generated_problems').insert(records);

    // Track usage
    await supabase.from('school_template_usage').insert({
      template_id: templateId,
      problems_generated: problems.length,
    });
  } catch (error) {
    console.error('Error saving generated problems:', error);
  }
}

/**
 * Get templates for a child (for analytics/management)
 */
export async function getChildTemplates(
  childId: string
): Promise<SchoolProblemTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('school_problem_templates')
      .select('*')
      .eq('child_id', childId)
      .order('times_used', { ascending: false });

    if (error) {
      console.error('Error fetching child templates:', error);
      return [];
    }

    return data as SchoolProblemTemplate[];
  } catch (error) {
    console.error('Error fetching child templates:', error);
    return [];
  }
}

/**
 * Get template statistics
 */
export async function getTemplateStats(templateId: string): Promise<{
  timesUsed: number;
  problemsGenerated: number;
  lastUsed: string | null;
}> {
  try {
    const { data: template } = await supabase
      .from('school_problem_templates')
      .select('times_used')
      .eq('id', templateId)
      .single();

    const { data: usage } = await supabase
      .from('school_template_usage')
      .select('problems_generated, used_at')
      .eq('template_id', templateId)
      .order('used_at', { ascending: false })
      .limit(1);

    const totalGenerated = await supabase
      .from('school_template_usage')
      .select('problems_generated')
      .eq('template_id', templateId);

    return {
      timesUsed: template?.times_used || 0,
      problemsGenerated: totalGenerated.data?.reduce((sum, r) => sum + r.problems_generated, 0) || 0,
      lastUsed: usage?.[0]?.used_at || null,
    };
  } catch (error) {
    console.error('Error fetching template stats:', error);
    return { timesUsed: 0, problemsGenerated: 0, lastUsed: null };
  }
}
