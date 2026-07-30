import { cn } from '@/lib/utils'
import type { Problem } from '@/services/generators/types'

export interface AlgebraKeysProps {
  /** Emits the literal text to append (e.g. "x", "²", "√"). */
  onKey: (text: string) => void
  disabled?: boolean
  /** The problem being answered — decides which variables and relations to show. */
  problem?: Problem | null
  className?: string
  /** Match the height of the numeric keys next to it. */
  buttonClassName?: string
}

/**
 * Work out which symbols this particular problem could need.
 *
 * Showing every letter of the alphabet would be unusable on a phone, and showing a
 * fixed x/y set is wrong for Level H, which solves formulas for r, t, w, l and so on.
 * So the variables come from the problem itself. Note this reveals nothing: the
 * letters are already printed in the question the child is reading.
 */
/** Short words that appear in question text and are NOT products of variables. */
const WORDS = new Set([
  'for', 'the', 'and', 'or', 'by', 'of', 'to', 'is', 'in', 'as', 'at', 'if', 'no',
  'add', 'sum', 'let', 'are', 'all', 'any', 'use',
])

export function symbolsForProblem(problem?: Problem | null): {
  variables: string[]
  relations: string[]
  extras: string[]
} {
  const text = typeof problem?.question === 'string'
    ? problem.question
    : problem?.question?.text ?? ''
  const subtype = String(problem?.subtype ?? '')

  // Letters used as variables. Runs of 2-3 lowercase letters that are not words are
  // implicit products — "Solve d = rt for r" needs r AND t as separate keys.
  const found = new Set<string>()
  for (const m of text.matchAll(/[A-Za-z]+/g)) {
    const run = m[0]
    if (run.length === 1) { found.add(run); continue }
    if (run.length <= 3 && run === run.toLowerCase() && !WORDS.has(run)) {
      for (const ch of run) found.add(ch)
    }
  }
  found.delete('i') // offered as a constant instead, when relevant

  // Some answer shapes use variables the question never spells out — the equation of
  // a line is always written in x and y even when the question only gives points.
  // "linear_inequality" is deliberately NOT here — it is solved in x alone, and an
  // unused y key is one more thing for a child to wonder about.
  if (/system|slope|intercept|graph|linear_function|\bline\b/i.test(`${subtype} ${text}`)) {
    found.add('x'); found.add('y')
  }

  // x first so the key never moves under the child's finger.
  const variables = ['x', ...[...found].filter(v => v !== 'x').sort()].slice(0, 5)

  const relations = /[<>≤≥]/.test(text) || /inequality/i.test(`${subtype} ${text}`)
    ? ['<', '>', '≤', '≥']
    : []

  const extras: string[] = []
  const hay = `${subtype} ${text}`
  if (/√|radical|square.?root/i.test(hay)) extras.push('√')
  if (/complex|imaginary|powers_of_i/i.test(hay) || /\d\s*i\b/.test(text)) extras.push('i')
  if (/π/.test(text) || /\bpi\b|circle|circumference/i.test(hay)) extras.push('π')
  if (/±/.test(text) || /quadratic.?formula/i.test(hay)) extras.push('±')
  // Answers that name more than one result: "x = 2, y = -4" / "x = -1 or x = 2".
  if (/system/i.test(hay)) extras.push(',')
  if (/solve_by|quadratic|factoring/i.test(subtype) && /solve/i.test(hay)) extras.push('or')
  if (/long_division/i.test(subtype)) extras.push('R')

  return { variables, relations, extras: [...new Set(extras)] }
}

/**
 * The algebra half of the answer keypad: variables, powers, brackets and relations.
 *
 * From Level G every answer is an expression like "(3x + 5)(x + 3)" or "y = 5x + 2",
 * which a digits-only pad simply cannot produce — those levels were unanswerable.
 * Answers are checked for mathematical equivalence rather than character equality
 * (see services/answerCheck), so the child is free to bracket and order as they like.
 */
export default function AlgebraKeys({
  onKey,
  disabled = false,
  problem,
  className,
  buttonClassName,
}: AlgebraKeysProps) {
  const { variables, relations, extras } = symbolsForProblem(problem)

  // Always-available algebra symbols, then the problem-specific ones.
  const keys: { label: string; emit: string; title?: string }[] = [
    ...variables.map(v => ({ label: v, emit: v, title: `Variable ${v}` })),
    { label: '(', emit: '(' },
    { label: ')', emit: ')' },
    { label: 'x²', emit: '²', title: 'Squared' },
    { label: 'x³', emit: '³', title: 'Cubed' },
    { label: '+', emit: ' + ' },
    { label: '−', emit: ' - ', title: 'Minus' },
    { label: '×', emit: '*', title: 'Times' },
    { label: '/', emit: '/', title: 'Divide' },
    { label: '=', emit: ' = ' },
    ...relations.map(r => ({ label: r, emit: ` ${r} ` })),
    ...extras.map(x =>
      x === 'or' ? { label: 'or', emit: ' or ', title: 'or — for a second answer' }
      : x === ',' ? { label: ',', emit: ', ', title: 'Separate two answers' }
      : x === 'R' ? { label: 'R', emit: ' R ', title: 'Remainder' }
      : { label: x, emit: x }
    ),
  ]

  const base = cn(
    'flex items-center justify-center rounded-lg',
    'bg-white font-bold text-gray-800 shadow-sm',
    'border border-gray-200',
    'transition-all duration-150 active:scale-95',
    'hover:bg-primary-50 hover:border-primary/40',
    'focus:outline-none focus:ring-2 focus:ring-primary/40',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'touch-manipulation select-none'
  )

  return (
    <div className={cn('grid grid-cols-5 gap-1 sm:gap-1.5', className)}>
      {keys.map(k => (
        <button
          key={k.label}
          type="button"
          onClick={() => onKey(k.emit)}
          disabled={disabled}
          title={k.title ?? k.label}
          aria-label={k.title ?? k.label}
          className={cn(base, buttonClassName ?? 'h-10 text-base sm:h-11 sm:text-lg')}
        >
          {k.label}
        </button>
      ))}
    </div>
  )
}
