/**
 * A small expression parser and evaluator for checking algebra answers.
 *
 * Why this exists: from Level G onwards every answer is a string, and the worksheet
 * used to compare it to the stored answer character by character. That marks a child
 * wrong for writing "(x+3)(x+4)" instead of "(x + 4)(x + 3)", or "12x" instead of
 * "12x + 0" — which is a formatting opinion, not a mathematical one.
 *
 * Instead of trying to normalise notation, we evaluate both expressions at several
 * random points and compare the values. Two expressions that agree at enough points
 * are the same expression, whatever they look like on the page. Values are complex
 * so that Level J's `i` arithmetic and square roots of negatives work naturally.
 */

export interface Complex { re: number; im: number }

const C = (re: number, im = 0): Complex => ({ re, im })
const add = (a: Complex, b: Complex): Complex => C(a.re + b.re, a.im + b.im)
const sub = (a: Complex, b: Complex): Complex => C(a.re - b.re, a.im - b.im)
const mul = (a: Complex, b: Complex): Complex =>
  C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const div = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im
  return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
const neg = (a: Complex): Complex => C(-a.re, -a.im)

/** Principal square root, defined for negative reals too (√-4 = 2i). */
const sqrt = (a: Complex): Complex => {
  if (a.im === 0) {
    return a.re >= 0 ? C(Math.sqrt(a.re)) : C(0, Math.sqrt(-a.re))
  }
  const r = Math.hypot(a.re, a.im)
  return C(Math.sqrt((r + a.re) / 2), Math.sign(a.im) * Math.sqrt((r - a.re) / 2))
}

const powInt = (a: Complex, n: number): Complex => {
  let out = C(1)
  for (let i = 0; i < Math.abs(n); i++) out = mul(out, a)
  return n < 0 ? div(C(1), out) : out
}

// ── Tokenizer ────────────────────────────────────────────────────────────────

type Token =
  | { k: 'num'; v: number }
  | { k: 'var'; v: string }
  | { k: 'op'; v: '+' | '-' | '*' | '/' | '^' }
  | { k: 'sqrt' }
  | { k: '(' }
  | { k: ')' }

/** Superscript digits are how the app writes powers (x², 4x³). */
const SUPERSCRIPTS: Record<string, number> = {
  '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9,
}

export class ParseError extends Error {}

function tokenize(input: string): Token[] {
  const out: Token[] = []
  let i = 0
  const s = input
    .replace(/[−–—]/g, '-')   // unicode minus / dashes
    .replace(/[×·]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/\s+/g, '')

  while (i < s.length) {
    const c = s[i]

    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      const v = parseFloat(s.slice(i, j))
      if (Number.isNaN(v)) throw new ParseError(`bad number at ${i}`)
      out.push({ k: 'num', v })
      i = j
      continue
    }

    if (c in SUPERSCRIPTS) {
      // A run of superscripts is one exponent: x²³ would be x^23 (never occurs, but
      // parsing it consistently is cheaper than special-casing).
      let j = i
      let digits = ''
      while (j < s.length && s[j] in SUPERSCRIPTS) { digits += SUPERSCRIPTS[s[j]]; j++ }
      out.push({ k: 'op', v: '^' })
      out.push({ k: 'num', v: parseInt(digits, 10) })
      i = j
      continue
    }

    if (/[a-zA-Zπ]/.test(c)) { out.push({ k: 'var', v: c }); i++; continue }
    if (c === '√') { out.push({ k: 'sqrt' }); i++; continue }
    if (c === '(' || c === '[') { out.push({ k: '(' }); i++; continue }
    if (c === ')' || c === ']') { out.push({ k: ')' }); i++; continue }
    if (c === '^') { out.push({ k: 'op', v: '^' }); i++; continue }
    if (c === '+' || c === '-' || c === '*' || c === '/') {
      out.push({ k: 'op', v: c }); i++; continue
    }
    throw new ParseError(`unexpected character ${JSON.stringify(c)}`)
  }
  return out
}

// ── Parser (recursive descent, with implicit multiplication) ─────────────────

/**
 * Grammar, loosest binding first:
 *   expr   := term (('+' | '-') term)*
 *   term   := unary (('*' | '/')? unary)*      ← the optional operator is what makes
 *                                                "3x", "2(x+1)" and "(x+1)(x+2)" work
 *   unary  := ('-' | '+')* power
 *   power  := atom ('^' unary)?
 *   atom   := number | variable | '√' unary | '(' expr ')'
 */
class Parser {
  private pos = 0
  constructor(private toks: Token[]) {}

  parse(): Node {
    const n = this.expr()
    if (this.pos !== this.toks.length) throw new ParseError('trailing input')
    return n
  }

  private peek(): Token | undefined { return this.toks[this.pos] }

  private expr(): Node {
    let left = this.term()
    for (;;) {
      const t = this.peek()
      if (t?.k === 'op' && (t.v === '+' || t.v === '-')) {
        this.pos++
        left = { k: 'bin', op: t.v, l: left, r: this.term() }
      } else return left
    }
  }

  private term(): Node {
    let left = this.unary()
    for (;;) {
      const t = this.peek()
      if (t?.k === 'op' && (t.v === '*' || t.v === '/')) {
        this.pos++
        left = { k: 'bin', op: t.v, l: left, r: this.unary() }
      } else if (t && (t.k === 'num' || t.k === 'var' || t.k === '(' || t.k === 'sqrt')) {
        // Implicit multiplication: 3x, 2(x+1), (x+1)(x+2), 5√7
        left = { k: 'bin', op: '*', l: left, r: this.unary() }
      } else return left
    }
  }

  private unary(): Node {
    const t = this.peek()
    if (t?.k === 'op' && (t.v === '-' || t.v === '+')) {
      this.pos++
      const inner = this.unary()
      return t.v === '-' ? { k: 'neg', a: inner } : inner
    }
    return this.power()
  }

  private power(): Node {
    const base = this.atom()
    const t = this.peek()
    if (t?.k === 'op' && t.v === '^') {
      this.pos++
      return { k: 'bin', op: '^', l: base, r: this.unary() }
    }
    return base
  }

  private atom(): Node {
    const t = this.peek()
    if (!t) throw new ParseError('unexpected end of expression')
    if (t.k === 'num') { this.pos++; return { k: 'num', v: t.v } }
    if (t.k === 'var') { this.pos++; return { k: 'var', v: t.v } }
    if (t.k === 'sqrt') { this.pos++; return { k: 'sqrt', a: this.power() } }
    if (t.k === '(') {
      this.pos++
      const inner = this.expr()
      if (this.peek()?.k !== ')') throw new ParseError('missing )')
      this.pos++
      return inner
    }
    throw new ParseError(`unexpected token ${t.k}`)
  }
}

type Node =
  | { k: 'num'; v: number }
  | { k: 'var'; v: string }
  | { k: 'neg'; a: Node }
  | { k: 'sqrt'; a: Node }
  | { k: 'bin'; op: '+' | '-' | '*' | '/' | '^'; l: Node; r: Node }

export function parseExpression(src: string): Node {
  return new Parser(tokenize(src)).parse()
}

/** Every variable name the expression mentions (π and i are constants, not variables). */
export function variablesOf(node: Node, into: Set<string> = new Set()): Set<string> {
  switch (node.k) {
    case 'var': if (node.v !== 'π' && node.v !== 'i') into.add(node.v); break
    case 'neg':
    case 'sqrt': variablesOf(node.a, into); break
    case 'bin': variablesOf(node.l, into); variablesOf(node.r, into); break
  }
  return into
}

function evaluate(node: Node, env: Record<string, Complex>): Complex {
  switch (node.k) {
    case 'num': return C(node.v)
    case 'var': {
      if (node.v === 'i') return C(0, 1)
      if (node.v === 'π') return C(Math.PI)
      const v = env[node.v]
      if (!v) throw new ParseError(`unbound variable ${node.v}`)
      return v
    }
    case 'neg': return neg(evaluate(node.a, env))
    case 'sqrt': return sqrt(evaluate(node.a, env))
    case 'bin': {
      const l = evaluate(node.l, env)
      if (node.op === '^') {
        const r = evaluate(node.r, env)
        if (r.im !== 0 || !Number.isInteger(r.re)) throw new ParseError('non-integer power')
        return powInt(l, r.re)
      }
      const r = evaluate(node.r, env)
      switch (node.op) {
        case '+': return add(l, r)
        case '-': return sub(l, r)
        case '*': return mul(l, r)
        case '/': return div(l, r)
      }
    }
  }
}

/**
 * Are two expressions the same function?
 *
 * Evaluated at a fixed set of awkward, non-round sample points — awkward on purpose,
 * so that expressions which merely happen to agree at 0 and 1 are not mistaken for
 * equal ones. All variables mentioned by EITHER side are sampled.
 */
export function expressionsEquivalent(a: string, b: string): boolean {
  let na: Node, nb: Node
  try {
    na = parseExpression(a)
    nb = parseExpression(b)
  } catch {
    return false
  }

  const vars = [...new Set([...variablesOf(na), ...variablesOf(nb)])]
  // Deliberately irrational-ish and spread across sign; index-derived so the check
  // is deterministic (a child must never get a different verdict on a retry).
  const SAMPLES = [1.7, -2.3, 3.1, -0.7, 5.9, -4.1, 0.35, 7.3]

  let agreements = 0
  for (let s = 0; s < SAMPLES.length; s++) {
    const env: Record<string, Complex> = {}
    vars.forEach((v, idx) => {
      env[v] = C(SAMPLES[(s + idx * 3) % SAMPLES.length] + idx * 0.11)
    })
    let va: Complex, vb: Complex
    try {
      va = evaluate(na, env)
      vb = evaluate(nb, env)
    } catch {
      return false
    }
    // Skip sample points where either side blows up (division by zero); they carry
    // no information, but a run of them must not read as agreement.
    if (![va.re, va.im, vb.re, vb.im].every(Number.isFinite)) continue

    const scale = Math.max(1, Math.abs(va.re), Math.abs(va.im), Math.abs(vb.re), Math.abs(vb.im))
    if (Math.abs(va.re - vb.re) > 1e-6 * scale) return false
    if (Math.abs(va.im - vb.im) > 1e-6 * scale) return false
    agreements++
  }
  return agreements >= 3
}
