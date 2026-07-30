/**
 * Foundry content PREVIEW / test view (dev only, route /test-foundry).
 *
 * Renders any servable Best Brains pack straight from the deterministic generator
 * so the actual generated QUESTIONS can be eyeballed in the browser — pick a week
 * (flip a Level-C "old engine" week against a Level-D "rebuilt" week to see the
 * difference), reroll the seed, and toggle between three visual styles. No auth,
 * no Supabase — the generator is a pure client-side function.
 */

import { type ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generatePack, AVAILABLE_WEEKS } from '@/modules/best-brains/generator/packGenerator'
import type { BBLevel, PackItem, WeeklyConceptPack } from '@/modules/best-brains/types'
import BBFigureView from '@/modules/best-brains/components/figures/BBFigureView'
import { promptText } from '@/modules/best-brains/figures/prompt'

// ---------------------------------------------------------------------------
// Three distinct visual styles to toggle between.
// ---------------------------------------------------------------------------
type ThemeKey = 'clean' | 'paper' | 'playful'

interface Theme {
  name: string
  bg: string; panel: string; card: string; ink: string; muted: string; line: string
  accent: string; accentSoft: string; good: string; warn: string
  font: string; head: string; radius: string; cardRadius: string
  headWeight: number; shadow: string; letter: string
}

const THEMES: Record<ThemeKey, Theme> = {
  clean: {
    name: 'Clean', bg: '#f4f6fb', panel: '#ffffff', card: '#ffffff', ink: '#1b1e27',
    muted: '#5c6274', line: '#e5e8f0', accent: '#4b54c6', accentSoft: '#ecedf9',
    good: '#0f7a5f', warn: '#b1462e', font: 'ui-sans-serif, system-ui, sans-serif',
    head: 'ui-sans-serif, system-ui, sans-serif', radius: '14px', cardRadius: '11px',
    headWeight: 700, shadow: '0 1px 2px rgba(24,28,44,.05), 0 10px 26px -16px rgba(24,28,44,.25)',
    letter: '-.01em',
  },
  paper: {
    name: 'Paper', bg: '#f3efe6', panel: '#fbf8f1', card: '#fffdf8', ink: '#2b271f',
    muted: '#726a58', line: '#e4dccb', accent: '#9a6a2f', accentSoft: '#f1e7d4',
    good: '#5f6f2f', warn: '#a23b28', font: 'Georgia, "Iowan Old Style", serif',
    head: 'Georgia, "Iowan Old Style", serif', radius: '8px', cardRadius: '6px',
    headWeight: 700, shadow: '0 1px 0 rgba(43,39,31,.06), 0 12px 30px -20px rgba(43,39,31,.4)',
    letter: '0',
  },
  playful: {
    name: 'Playful', bg: '#eef2ff', panel: '#ffffff', card: '#ffffff', ink: '#232244',
    muted: '#6b6a95', line: '#e3e6fb', accent: '#7048e8', accentSoft: '#eee7fe',
    good: '#0ca678', warn: '#e8590c', font: '"Baloo 2", "Comic Sans MS", ui-rounded, system-ui, sans-serif',
    head: '"Baloo 2", ui-rounded, system-ui, sans-serif', radius: '22px', cardRadius: '18px',
    headWeight: 800, shadow: '0 2px 0 rgba(112,72,232,.10), 0 16px 34px -18px rgba(112,72,232,.4)',
    letter: '-.01em',
  },
}

const TYPE_LABEL: Record<string, string> = {
  computation: 'compute', 'word-problem': 'word problem', representation: 'represent',
  reasoning: 'reasoning', 'error-analysis': 'spot the mistake', classification: 'classify',
  drawing: 'draw', fluency: 'fluency',
}

function badge(t: Theme, text: string, kind: 'type' | 'retr' | 'multi' | 'noncomp' = 'type') {
  const map = {
    type: { bg: t.accentSoft, fg: t.accent },
    retr: { bg: t.line, fg: t.muted },
    multi: { bg: 'rgba(15,122,95,.12)', fg: t.good },
    noncomp: { bg: 'rgba(176,70,46,.10)', fg: t.warn },
  }[kind]
  return (
    <span style={{ background: map.bg, color: map.fg, fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 999, letterSpacing: '.02em', whiteSpace: 'nowrap',
      fontFamily: 'ui-monospace, monospace' }}>{text}</span>
  )
}

function ItemCard({ item, t }: { item: PackItem; t: Theme }) {
  // authorMeta is stripped from shipped packs; derive the step-count from the
  // multi-step op-chain that DOES ship in generator.params.
  const params = item.generator?.params as { steps?: unknown[] } | undefined
  const stepCount = Array.isArray(params?.steps) ? params!.steps!.length : 1
  return (
    <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {badge(t, TYPE_LABEL[item.type] ?? item.type, item.type === 'error-analysis' ? 'noncomp' : 'type')}
        {item.isRetrieval && badge(t, 'warm-up', 'retr')}
        {item.strand === 'noncomputational' && badge(t, 'reasoning strand', 'noncomp')}
      </div>
      <div style={{ color: t.ink, fontSize: 15, lineHeight: 1.5 }}>{promptText(item.prompt)}</div>
      {item.figure && <BBFigureView figure={item.figure} size="md" />}
      {item.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {item.choices.map((c) => (
            <div key={c.key} style={{ fontSize: 13.5, color: c.isCorrect ? t.good : t.muted,
              fontWeight: c.isCorrect ? 600 : 400 }}>
              {c.key}. {c.text}{c.isCorrect ? '  ✓' : ''}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline', fontSize: 13 }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', color: t.muted }}>
          answer: <b style={{ color: t.ink }}>{item.answer.value}</b>
        </span>
        {typeof stepCount === 'number' && stepCount > 1 && badge(t, `${stepCount}-step`, 'multi')}
      </div>
      {item.hintLadder?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {item.hintLadder.map((h, i) => (
            <div key={i} style={{ fontSize: 12.5, color: t.muted, fontStyle: 'italic' }}>
              <span style={{ fontStyle: 'normal', fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: .7 }}>
                hint {i + 1} · </span>{h}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, t, children }: { title: string; t: Theme; children: ReactNode }) {
  return (
    <section style={{ marginTop: 26 }}>
      <h2 style={{ fontFamily: t.head, fontWeight: t.headWeight, fontSize: 18, color: t.ink,
        letterSpacing: t.letter, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 18, background: t.accent, borderRadius: 4, display: 'inline-block' }} />
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </section>
  )
}

export default function FoundryPreviewPage() {
  const navigate = useNavigate()
  const cells = AVAILABLE_WEEKS
  const [cellKey, setCellKey] = useState('D6')
  const [seed, setSeed] = useState(12345)
  const [themeKey, setThemeKey] = useState<ThemeKey>('clean')
  const t = THEMES[themeKey]

  const [lvl, wk] = [cellKey[0] as BBLevel, Number(cellKey.slice(1))]
  const source = cells.find((c) => c.level === lvl && c.week === wk)?.source

  const pack = useMemo<WeeklyConceptPack | null>(() => {
    try { return generatePack(lvl, wk, seed) } catch { return null }
  }, [lvl, wk, seed])

  const isRebuilt = lvl === 'D' && source === 'template'

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: t.font, color: t.ink }}>
      {/* toolbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: t.panel, borderBottom: `1px solid ${t.line}`,
        boxShadow: t.shadow, padding: '10px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: `1px solid ${t.line}`,
          color: t.muted, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 13 }}>← app</button>
        <strong style={{ fontFamily: t.head, fontSize: 15 }}>Foundry preview</strong>

        <label style={{ fontSize: 13, color: t.muted, display: 'flex', gap: 6, alignItems: 'center' }}>week
          <select value={cellKey} onChange={(e) => setCellKey(e.target.value)}
            style={{ padding: '5px 8px', borderRadius: 8, border: `1px solid ${t.line}`, background: t.card, color: t.ink }}>
            {(['A', 'B', 'C', 'D', 'E'] as BBLevel[]).map((L) => {
              const group = cells.filter((c) => c.level === L).sort((a, b) => a.week - b.week)
              if (!group.length) return null
              return (
                <optgroup key={L} label={`Level ${L}${L === 'D' ? ' — rebuilt' : ' — old engine'}`}>
                  {group.map((c) => (
                    <option key={`${c.level}${c.week}`} value={`${c.level}${c.week}`}>
                      {c.level}{c.week} · {c.source === 'fixture' ? 'fixture' : ''}
                    </option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </label>

        <button onClick={() => setSeed(Math.floor(Math.random() * 1e6))}
          style={{ background: t.accentSoft, color: t.accent, border: 'none', borderRadius: 8,
            padding: '5px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>↻ new seed</button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: t.bg, padding: 3, borderRadius: 999 }}>
          {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
            <button key={k} onClick={() => setThemeKey(k)} style={{
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 999,
              background: themeKey === k ? t.accent : 'transparent', color: themeKey === k ? '#fff' : t.muted }}>
              {THEMES[k].name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '22px 16px 80px' }}>
        {!pack ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.muted }}>
            No content for {cellKey} yet — only Level D (and a few seed weeks) are built.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: t.muted }}>{pack.packId}</span>
              {badge(t, isRebuilt ? 'rebuilt · v2' : 'old engine', isRebuilt ? 'multi' : 'retr')}
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: t.muted }}>seed {seed}</span>
            </div>
            <h1 style={{ fontFamily: t.head, fontWeight: t.headWeight, fontSize: 27, letterSpacing: t.letter,
              margin: '6px 0 2px', color: t.ink }}>{pack.identity.conceptName}</h1>
            <div style={{ color: t.muted, fontSize: 14 }}>Level {pack.identity.level} · Week {pack.identity.week} · {pack.identity.band} band</div>

            <Section title="The idea — why before how" t={t}>
              <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius, padding: '14px 16px' }}>
                <div style={{ fontStyle: 'italic', color: t.muted, marginBottom: 10 }}>{pack.explanation.hook}</div>
                <div style={{ fontSize: 15, lineHeight: 1.6 }}>{pack.explanation.whyBeforeHow}</div>
              </div>
            </Section>

            <Section title="The lesson — Ms. Wren's script" t={t}>
              {pack.explanation.script.map((seg, i) => (
                <div key={i} style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius, padding: '12px 14px' }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>🗣 {seg.say}</div>
                  {seg.figure
                    ? <div style={{ marginTop: 10 }}><BBFigureView figure={seg.figure} size="lg" /></div>
                    : seg.visual && <div style={{ marginTop: 8, fontSize: 13, fontStyle: 'italic', color: t.muted }}>🖼 {seg.visual}</div>}
                </div>
              ))}
            </Section>

            <Section title="Worked examples (fading support)" t={t}>
              {pack.guidedExamples.map((ge) => (
                <div key={ge.id} style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    {badge(t, ge.fadeLevel)}<span style={{ fontSize: 14, fontWeight: 600 }}>{promptText(ge.prompt)}</span>
                  </div>
                  {ge.figure && <div style={{ margin: '6px 0 10px' }}><BBFigureView figure={ge.figure} size="md" /></div>}
                  {ge.steps.map((s, i) => (
                    <div key={i} style={{ fontSize: 14, color: t.muted, lineHeight: 1.5, paddingLeft: 10,
                      borderLeft: `2px solid ${t.line}`, margin: '4px 0' }}>
                      {s.teacherSay && <span>🗣 {s.teacherSay}</span>}
                      {s.childDo && <span>✏️ {s.childDo}</span>}
                      {s.expected && <span style={{ fontFamily: 'ui-monospace, monospace', color: t.good }}> → {s.expected}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </Section>

            {pack.days.map((day) => (
              <Section key={day.day} title={`Day ${day.day} — ${day.focus.replace(/-/g, ' ')}`} t={t}>
                {day.items.map((it) => <ItemCard key={it.id} item={it} t={t} />)}
              </Section>
            ))}

            <Section title={`Puzzle — ${pack.puzzle.title}`} t={t}>
              <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius, padding: '14px 16px' }}>
                <div style={{ fontSize: 15, lineHeight: 1.55 }}>{promptText(pack.puzzle.prompt)}</div>
                {pack.puzzle.figure && <div style={{ marginTop: 10 }}><BBFigureView figure={pack.puzzle.figure} size="md" /></div>}
                <div style={{ marginTop: 8, fontFamily: 'ui-monospace, monospace', fontSize: 13, color: t.muted }}>
                  answer: <b style={{ color: t.ink }}>{pack.puzzle.answer.value}</b></div>
              </div>
            </Section>

            <Section title="Mastery check (Form A / Form B isomorphs)" t={t}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(['formA', 'formB'] as const).map((f) => (
                  <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: t.muted }}>{f === 'formA' ? 'Form A' : 'Form B'}</div>
                    {pack.masteryCheck[f].map((it) => (
                      <div key={it.id} style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: t.cardRadius, padding: '8px 10px', fontSize: 13.5 }}>
                        {promptText(it.prompt)}
                        {it.figure && <BBFigureView figure={it.figure} size="sm" />}
                        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: t.good, marginTop: 3 }}>{it.answer.value}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
