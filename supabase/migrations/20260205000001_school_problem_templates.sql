-- ============================================
-- School Problem Templates
-- ============================================
-- Stores reusable problem patterns extracted by LLM.
-- Allows algorithmic problem generation without ongoing LLM costs.
--
-- Flow:
-- 1. LLM extracts problem pattern from uploaded homework (ONE-TIME cost)
-- 2. Pattern saved as template
-- 3. Future similar problems generated algorithmically (ZERO cost)

-- Problem Type Templates
CREATE TABLE school_problem_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership (NULL = generic template for all students)
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,

  -- Problem Type Classification
  problem_type TEXT NOT NULL CHECK (problem_type IN (
    'addition', 'subtraction', 'multiplication', 'division',
    'fractions', 'decimals', 'percentages', 'algebra',
    'geometry', 'word_problem', 'order_of_operations', 'other'
  )),
  subtype TEXT,  -- e.g., 'two_digit_no_carry', 'mixed_numbers', 'linear_equation'
  grade_level TEXT NOT NULL,  -- 'K', '1', '2', ... '12'

  -- Template Pattern (JSON)
  -- Contains all info needed for algorithmic generation
  template_pattern JSONB NOT NULL,
  /*
    Example structure:
    {
      "format": "horizontal" | "vertical" | "word_problem" | "expression",
      "operand_ranges": [
        { "min": 1, "max": 99, "type": "integer", "position": 0 },
        { "min": 1, "max": 9, "type": "integer", "position": 1 }
      ],
      "operators": ["+", "-"],
      "constraints": {
        "no_negative_results": true,
        "max_digits_in_answer": 3,
        "requires_carrying": false,
        "requires_borrowing": false,
        "denominator_range": { "min": 2, "max": 12 }
      },
      "word_problem_templates": [
        "{{name}} has {{num1}} apples. {{pronoun}} gives {{num2}} to a friend. How many apples does {{name}} have now?"
      ],
      "variable_names": ["x", "y", "n"]
    }
  */

  -- Generation Config
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  hint_templates JSONB DEFAULT '[]'::jsonb,
  /*
    Example: [
      "Think about what {{operation}} means...",
      "Start by {{first_step}}..."
    ]
  */
  solution_step_templates JSONB DEFAULT '[]'::jsonb,
  /*
    Example: [
      "Step 1: {{step_description}}",
      "Step 2: {{step_description}}"
    ]
  */

  -- Source tracking
  source_problem_text TEXT,  -- Original problem that created this template
  source_session_id UUID REFERENCES homework_sessions(id) ON DELETE SET NULL,

  -- Usage stats
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  -- Quality indicators
  success_rate DECIMAL(5,2),  -- Percentage of correct answers using this template
  avg_time_seconds INTEGER,   -- Average time to solve problems from this template

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_templates_child ON school_problem_templates(child_id);
CREATE INDEX idx_templates_type ON school_problem_templates(problem_type, subtype);
CREATE INDEX idx_templates_grade ON school_problem_templates(grade_level);
CREATE INDEX idx_templates_generic ON school_problem_templates(child_id) WHERE child_id IS NULL;
CREATE INDEX idx_templates_usage ON school_problem_templates(times_used DESC);

-- Template Usage Log (for analytics and learning)
CREATE TABLE school_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES school_problem_templates(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES homework_sessions(id) ON DELETE SET NULL,

  -- Usage details
  problems_generated INTEGER DEFAULT 1,
  problems_attempted INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_usage_template ON school_template_usage(template_id);
CREATE INDEX idx_template_usage_child ON school_template_usage(child_id);

-- Generated Practice Problems (for tracking and review)
CREATE TABLE school_generated_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES school_problem_templates(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES homework_sessions(id) ON DELETE SET NULL,

  -- Problem content (generated algorithmically)
  problem_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  problem_data JSONB NOT NULL,  -- Full problem structure for rendering

  -- Student interaction
  student_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  attempted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generated_problems_template ON school_generated_problems(template_id);
CREATE INDEX idx_generated_problems_child ON school_generated_problems(child_id);
CREATE INDEX idx_generated_problems_session ON school_generated_problems(session_id);

-- Function to update template usage stats
CREATE OR REPLACE FUNCTION update_template_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update success rate and average time
  UPDATE school_problem_templates
  SET
    success_rate = (
      SELECT
        CASE
          WHEN COUNT(*) = 0 THEN NULL
          ELSE ROUND((COUNT(*) FILTER (WHERE is_correct = true)::decimal / COUNT(*)::decimal) * 100, 2)
        END
      FROM school_generated_problems
      WHERE template_id = NEW.template_id AND is_correct IS NOT NULL
    ),
    avg_time_seconds = (
      SELECT AVG(time_spent_seconds)::integer
      FROM school_generated_problems
      WHERE template_id = NEW.template_id AND time_spent_seconds IS NOT NULL
    ),
    updated_at = NOW()
  WHERE id = NEW.template_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats when a problem is answered
CREATE TRIGGER update_template_stats_trigger
  AFTER UPDATE OF is_correct, time_spent_seconds ON school_generated_problems
  FOR EACH ROW
  WHEN (OLD.is_correct IS DISTINCT FROM NEW.is_correct OR OLD.time_spent_seconds IS DISTINCT FROM NEW.time_spent_seconds)
  EXECUTE FUNCTION update_template_stats();

-- RLS Policies
ALTER TABLE school_problem_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_generated_problems ENABLE ROW LEVEL SECURITY;

-- Templates: Users can see their own + generic templates
CREATE POLICY "Users can view own and generic templates"
  ON school_problem_templates FOR SELECT
  USING (
    child_id IS NULL  -- Generic templates visible to all
    OR child_id IN (SELECT id FROM children WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert templates for their children"
  ON school_problem_templates FOR INSERT
  WITH CHECK (
    child_id IN (SELECT id FROM children WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their templates"
  ON school_problem_templates FOR UPDATE
  USING (
    child_id IN (SELECT id FROM children WHERE user_id = auth.uid())
  );

-- Template usage: Users can manage their own
CREATE POLICY "Users can manage own template usage"
  ON school_template_usage FOR ALL
  USING (
    child_id IN (SELECT id FROM children WHERE user_id = auth.uid())
  );

-- Generated problems: Users can manage their own
CREATE POLICY "Users can manage own generated problems"
  ON school_generated_problems FOR ALL
  USING (
    child_id IN (SELECT id FROM children WHERE user_id = auth.uid())
  );

-- Add helpful comments
COMMENT ON TABLE school_problem_templates IS 'Stores reusable problem patterns for algorithmic generation (zero LLM cost)';
COMMENT ON COLUMN school_problem_templates.child_id IS 'NULL means generic template available to all students';
COMMENT ON COLUMN school_problem_templates.template_pattern IS 'JSON containing operand ranges, operators, constraints for algorithmic generation';
COMMENT ON TABLE school_generated_problems IS 'Problems generated algorithmically from templates';
