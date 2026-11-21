/**
 * sm-readability-test — what a Grade 1 child hears is short and plain (DD17; ENGINE-SPEC §6.8;
 * EXEMPLAR-G1-U02 §6 "Spoken lines").
 *
 * Run (from frontend/): npx tsx scripts/sm-readability-test.ts
 *
 * Over every Grade 1 surface and day (200 seeds; simulated units; fix-it; look again; the
 * check-screen and review lines): every read-aloud sentence ≤ 10 words (symbols + − = □ are
 * not words); never the word "wrong"; every story (join, take-away, which bond, paper bond)
 * is two story sentences and one question; the error item's story form is two story
 * sentences and then "A child wrote …", with its question asked by the fix part.
 * Controls: an 11-word sentence; a story with three story sentences.
 */
import { sentencesOf, wordCount } from '../src/modules/school-math/engine/lib/text'
import { buildItem } from '../src/modules/school-math/engine/registry'
import type { SMItem } from '../src/modules/school-math/types'
import { FIXED_LINES, generatedCorpus } from './sm-lib-corpus'

let failures = 0
let checks = 0
const say = (ok: boolean, msg: string) => { checks++; if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`) }
const STORY = ['l6.join_story', 'l6.takeaway_story', 'l6.which_bond_story', 'l6.paper_bond'].map((s) => `sm.g1u02.${s}`)

/** Every read-aloud line: the item's spoken lines (prompt, figures, parts, rows, review lines, ladder). */
export function readProblems(lines: string[]): string[] {
  const out: string[] = []
  for (const l of lines) for (const s of sentencesOf(l)) {
    if (wordCount(s) > 10) out.push(`${wordCount(s)} words: "${s}"`)
    if (/\bwrong\b/i.test(s)) out.push(`says "wrong": "${s}"`)
  }
  return out
}

export function storyProblems(it: SMItem): string[] {
  const s = sentencesOf(it.prompt)
  if (STORY.includes(it.templateId)) {
    if (s.length !== 3 || !s[2].endsWith('?') || s.slice(0, 2).some((x) => !x.endsWith('.'))) return [`story is not two sentences and a question: "${it.prompt}"`]
  }
  if (it.templateId === 'sm.g1u02.l4.error_take_away' && it.generator.params.story === true) {
    if (s.length !== 3 || !s[2].startsWith('A child wrote') || s.slice(0, 2).some((x) => !x.endsWith('.'))) return [`error story is not two story sentences then "A child wrote": "${it.prompt}"`]
    if (!it.parts[0].prompt?.trim().endsWith('?')) return ['the error story\'s question is not asked by its fix part']
  }
  return []
}

console.log('\nevery read-aloud sentence ≤ 10 words, never "wrong"; stories two sentences and one question')
const SEEDS = Array.from({ length: 200 }, (_, i) => i * 13 + 3)
const corpus = generatedCorpus(SEEDS, SEEDS.slice(0, 40))
{
  let sentences = 0, bad = 0, first = '', stories = 0, storyBad = 0, storyFirst = '', longest = 0
  for (const { item } of corpus) {
    const lines = [...item.spokenLines, ...item.figures.map((f) => f.alt)]
    for (const l of lines) for (const s of sentencesOf(l)) { sentences++; longest = Math.max(longest, wordCount(s)) }
    const p = readProblems(lines)
    if (p.length) { bad++; if (!first) first = `${item.id}: ${p[0]}` }
    if (STORY.includes(item.templateId) || (item.templateId.endsWith('error_take_away') && item.generator.params.story === true)) {
      stories++
      const sp = storyProblems(item)
      if (sp.length) { storyBad++; if (!storyFirst) storyFirst = `${item.id}: ${sp[0]}` }
    }
  }
  const fixed = readProblems(FIXED_LINES.map((l) => l.text))
  say(bad === 0 && fixed.length === 0, `${corpus.length} items, ${sentences} spoken sentences + ${FIXED_LINES.length} fixed lines: longest ${longest} words — off ${bad + fixed.length}${first ? ' — ' + first : ''}`)
  say(storyBad === 0, `${stories} stories: two story sentences and one question — off ${storyBad}${storyFirst ? ' — ' + storyFirst : ''}`)
}

console.log('\nbroken controls — each must fire')
{
  say(readProblems(['This sentence has exactly eleven words in it for the test.']).length > 0, 'control fired: an 11-word sentence')
  const st = buildItem('sm.g1u02.l6.join_story', { seed: 3 })
  const three: SMItem = { ...st, prompt: `There are 3 ducks on the pond. 2 more ducks come. Then 1 duck sleeps. ${sentencesOf(st.prompt)[2]}` }
  say(storyProblems(three).length > 0, 'control fired: a story with three story sentences')
}

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} sm-readability-test: ${checks - failures}/${checks} checks`)
process.exit(failures === 0 ? 0 : 1)
