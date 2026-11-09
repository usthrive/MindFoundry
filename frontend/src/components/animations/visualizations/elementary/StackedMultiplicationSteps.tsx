/**
 * StackedMultiplicationSteps — the column method, drawn the way the worksheet
 * draws it (same boxes, same small red carries, same quiet "only if needed" box),
 * so what the child watches here is what he then does on the sheet.
 * Words and frames: services/stackedMultiplication.ts.
 *
 * Three uses:
 *   • the hint after a miss, on his OWN problem (showSolution=false): the problem
 *     and where to start — never the answer;
 *   • the full teaching step on a SIMILAR problem (problemData.context.frame given:
 *     FullTeaching walks the frames on its own timer);
 *   • walk mode (showSolution=true, no frame): the child steps through with Next.
 *
 * StackedMultiplicationLesson (below) is the new-concept lesson: two worked
 * examples, then a guided "your turn" where he works each step himself.
 */
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import AudioButton from '@/components/homework/AudioButton'
import type { BaseAnimationProps } from '@/components/animations/core/types'
import {
  answerColumns,
  guidedPrompts,
  setupSentence,
  stackedFrames,
  type StackedFrame,
} from '@/services/stackedMultiplication'

const PLACE_LABELS = ['O', 'T', 'H', 'Th']

/** The problem as the worksheet shows it, with what has been written so far. */
export function StackedGrid({
  a,
  b,
  frame,
  className,
}: {
  a: number
  b: number
  frame: StackedFrame
  className?: string
}) {
  const cols = answerColumns(a)
  const top = String(a).padStart(cols, ' ')
  const bottom = String(b).padStart(cols, ' ')
  const optional = cols - 1
  const order = Array.from({ length: cols }, (_, v) => cols - 1 - v) // visual left→right = column index
  const cell = 'w-11 text-center'
  return (
    <div className={cn('inline-flex flex-col items-end font-mono font-bold tabular-nums', className)} data-stacked-grid>
      <div className="flex gap-1.5">
        <div className="w-7" />
        {order.map((c) => (
          <div key={`l${c}`} className={cn(cell, 'text-[10px] font-medium text-gray-400', frame.focus === c && 'text-primary')}>
            {PLACE_LABELS[c]}
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 min-h-[1.25rem]">
        <div className="w-7" />
        {order.map((c) => (
          <div key={`c${c}`} className={cell} data-carry-col={c}>
            {frame.carries[c] ? <span className="text-sm font-bold text-red-500">{frame.carries[c]}</span> : null}
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 text-3xl text-gray-900">
        <div className="w-7" />
        {order.map((c, v) => (
          <div key={`t${c}`} className={cn(cell, 'rounded-md', frame.focus === c && 'bg-amber-100')}>{top[v].trim()}</div>
        ))}
      </div>
      <div className="flex gap-1.5 text-3xl text-gray-900">
        <div className="w-7 text-center text-orange-500">×</div>
        {order.map((c, v) => (
          <div key={`b${c}`} className={cn(cell, 'rounded-md', frame.focus !== null && c === 0 && 'bg-amber-100')}>{bottom[v].trim()}</div>
        ))}
      </div>
      <div className="my-1 h-0.5 self-stretch bg-orange-400" />
      <div className="flex gap-1.5">
        <div className="w-7" />
        {order.map((c) => {
          const digit = frame.written[c]
          const quiet = c === optional && digit === null
          return (
            <div
              key={`a${c}`}
              data-answer-col={c}
              data-optional={c === optional ? 'true' : undefined}
              className={cn(
                'flex h-12 w-11 items-center justify-center rounded-md border-2 text-2xl',
                quiet
                  ? 'border-dashed border-gray-300 bg-transparent'
                  : frame.focus === c
                    ? 'border-primary bg-blue-50 text-gray-900'
                    : digit !== null
                      ? 'border-gray-400 bg-gray-50 text-gray-900'
                      : 'border-gray-300 bg-white',
              )}
            >
              {digit ?? ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Say({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <p className="flex-1 text-base leading-snug text-gray-800" data-step-say>{text}</p>
      <AudioButton text={text} size="small" />
    </div>
  )
}

export default function StackedMultiplicationSteps({ problemData, showSolution = false, className, onComplete }: BaseAnimationProps) {
  const [a, b] = problemData?.operands ?? [23, 4]
  const frames = useMemo(() => stackedFrames(a, b), [a, b])
  const fixed = problemData?.context?.frame
  const [idx, setIdx] = useState(0)

  if (typeof fixed === 'number') {
    const f = frames[Math.max(0, Math.min(frames.length - 1, fixed))]
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <StackedGrid a={a} b={b} frame={f} />
      </div>
    )
  }

  if (!showSolution) {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <StackedGrid a={a} b={b} frame={frames[0]} />
        <Say text={setupSentence(a, b)} />
      </div>
    )
  }

  const f = frames[idx]
  const atEnd = idx === frames.length - 1
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <StackedGrid a={a} b={b} frame={f} />
      <Say text={f.say} />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="min-h-[44px] rounded-full bg-gray-100 px-4 text-sm font-semibold text-gray-600 disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => (atEnd ? onComplete?.() : setIdx((i) => i + 1))}
          className="min-h-[44px] rounded-full bg-primary px-5 text-sm font-semibold text-white"
        >
          {atEnd ? 'Done' : 'Next step →'}
        </button>
      </div>
    </div>
  )
}

/** Worked examples and the guided problem for each stacked concept. */
export const STACKED_LESSONS: Record<'2digit' | '3digit', { examples: Array<[number, number]>; practice: [number, number] }> = {
  // 23 × 4: a carry, two-digit answer (the hundreds box stays empty).
  // 28 × 5: a 0 written in the ones, and the last carry makes the hundreds digit.
  // 17 × 4: his turn — multiply, then ADD the carry (the step he was skipping).
  '2digit': { examples: [[23, 4], [28, 5]], practice: [17, 4] },
  '3digit': { examples: [[123, 4], [258, 6]], practice: [136, 5] },
}

type Phase = { kind: 'example'; i: number } | { kind: 'guided' } | { kind: 'done' }

export function StackedMultiplicationLesson({
  lesson,
  onDone,
}: {
  lesson: { examples: Array<[number, number]>; practice: [number, number] }
  onDone: () => void
}) {
  const [phase, setPhase] = useState<Phase>({ kind: 'example', i: 0 })
  const [stepKey, setStepKey] = useState(0)

  if (phase.kind === 'example') {
    const [a, b] = lesson.examples[phase.i]
    const more = phase.i + 1 < lesson.examples.length
    return (
      <div className="flex flex-col items-center gap-2" data-lesson-phase={`example-${phase.i + 1}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Example {phase.i + 1} of {lesson.examples.length}
        </p>
        <StackedMultiplicationSteps
          key={`ex-${phase.i}-${stepKey}`}
          problemData={{ operands: [a, b] }}
          showSolution
          onComplete={() => {
            setStepKey((k) => k + 1)
            setPhase(more ? { kind: 'example', i: phase.i + 1 } : { kind: 'guided' })
          }}
        />
        <p className="text-xs text-gray-400">{more ? 'Then another example.' : 'Then it is your turn.'}</p>
      </div>
    )
  }

  if (phase.kind === 'guided') {
    return <GuidedStacked a={lesson.practice[0]} b={lesson.practice[1]} onDone={() => setPhase({ kind: 'done' })} />
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center" data-lesson-phase="done">
      <p className="text-4xl" aria-hidden="true">🎉</p>
      <p className="text-lg font-semibold text-gray-800">You did it, one column at a time.</p>
      <p className="text-sm text-gray-600">On the worksheet: start with the ones, and add the carry after you multiply.</p>
      <button type="button" onClick={onDone} className="min-h-[48px] rounded-full bg-green-500 px-6 font-semibold text-white">
        Let's practice!
      </button>
    </div>
  )
}

/** The child works each step: multiply, then add the carry. A miss gets a nudge, a second miss the number. */
export function GuidedStacked({ a, b, onDone }: { a: number; b: number; onDone: () => void }) {
  const prompts = useMemo(() => guidedPrompts(a, b), [a, b])
  const frames = useMemo(() => stackedFrames(a, b), [a, b])
  const [pi, setPi] = useState(0)
  const [entry, setEntry] = useState('')
  const [misses, setMisses] = useState(0)
  const [note, setNote] = useState<{ kind: 'right' | 'nudge' | 'shown'; text: string } | null>(null)
  /** Columns finished so far (frames[k] shows the first k done). */
  const [doneCols, setDoneCols] = useState(0)

  const finished = pi >= prompts.length
  const p = prompts[Math.min(pi, prompts.length - 1)]
  const frame = finished
    ? frames[frames.length - 1]
    : { ...frames[doneCols], focus: p.col }

  /** After the last prompt of a column, the column's digits go in (as the example wrote them). */
  function advance() {
    const next = pi + 1
    const columnEnds = next >= prompts.length || prompts[next].col !== p.col
    if (columnEnds) setDoneCols((c) => c + 1)
    setPi(next)
    setEntry('')
    setMisses(0)
  }

  function check() {
    if (entry === '' || note) return
    if (Number(entry) === p.expect) {
      const colEnds = pi + 1 >= prompts.length || prompts[pi + 1].col !== p.col
      setNote({ kind: 'right', text: colEnds ? frames[p.col + 1].say : `Yes: ${p.expect}.` })
      return
    }
    const m = misses + 1
    setMisses(m)
    if (m === 1) {
      setNote({ kind: 'nudge', text: p.nudge })
    } else {
      const colEnds = pi + 1 >= prompts.length || prompts[pi + 1].col !== p.col
      setNote({ kind: 'shown', text: `It is ${p.expect}. ${colEnds ? frames[p.col + 1].say : ''}`.trim() })
    }
  }

  function afterNote() {
    if (!note) return
    if (note.kind === 'nudge') {
      setNote(null)
      setEntry('')
      return
    }
    setNote(null)
    advance()
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-3" data-lesson-phase="guided-done">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Your turn</p>
        <StackedGrid a={a} b={b} frame={frame} />
        <Say text={frames[frames.length - 1].say} />
        <button type="button" onClick={onDone} className="min-h-[48px] rounded-full bg-primary px-6 font-semibold text-white">
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2" data-lesson-phase="guided">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Your turn</p>
      <StackedGrid a={a} b={b} frame={frame} />
      <Say text={note ? note.text : p.ask} />
      {note ? (
        <button
          type="button"
          onClick={afterNote}
          data-guided-note={note.kind}
          className={cn(
            'min-h-[44px] rounded-full px-5 text-sm font-semibold text-white',
            note.kind === 'right' ? 'bg-green-500' : 'bg-primary',
          )}
        >
          {note.kind === 'nudge' ? 'Try again' : 'Next'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-11 min-w-[5rem] items-center justify-center rounded-lg border-2 border-primary bg-white px-3 font-mono text-2xl font-bold" data-guided-entry>
            {entry || ' '}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setEntry((e) => (e.length < 3 ? e + d : e))}
                className="h-10 w-10 rounded-lg bg-gray-100 font-mono text-lg font-bold text-gray-800 active:scale-95"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEntry((e) => e.slice(0, -1))} className="h-10 rounded-lg bg-gray-100 px-4 text-sm font-semibold text-gray-600">
              ⌫
            </button>
            <button
              type="button"
              disabled={entry === ''}
              onClick={check}
              className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Check
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
