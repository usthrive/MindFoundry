/**
 * Grade 1 catalogue (GRADE-1.md §2 unit table; §3 lesson rows for G1-U01 and G1-U02;
 * EXEMPLAR-G1-U02 §1–§2 for G1-U02's skills and demos).
 *
 * All 13 units carry their id, title, school chapter (number · topic), lesson count and
 * heuristic. Full lesson and skill detail exists for G1-U02 (the exemplar) and for the
 * G1-U01 lessons its outside templates use; the other units are filled at the Grade 1
 * fan-out (BUILD-PLAN stage 7). No publisher lesson title, no child's name.
 */

import type { SMDemo, SMLesson, SMSkill, SMUnit } from '../types'

const T = (s: string) => `sm.g1u02.${s}`

// ---------------------------------------------------------------------------
// G1-U01 — the lessons G1-U02's outside templates come from
// ---------------------------------------------------------------------------

const U01_LESSONS: SMLesson[] = [
  {
    id: 'G1-U01-L1', unitId: 'G1-U01', iCan: 'count a set to 10 and say how many',
    cpaSteps: ['counters touched one at a time', 'number track', 'the numeral'],
    templates: ['sm.g1u01.l1.count_set'], skills: ['G1-U01-K1'], returnTargets: ['G1-U04-L2'],
    exitTemplates: ['sm.g1u01.l1.count_set'], isPaperLesson: false,
  },
  {
    id: 'G1-U01-L2', unitId: 'G1-U01', iCan: 'read and write the numerals 0 to 10',
    cpaSteps: ['sets matched to numerals', 'trace', 'write on the pad'],
    templates: [], skills: [], returnTargets: ['G1-U04-L2'], exitTemplates: [], isPaperLesson: false,
  },
  {
    id: 'G1-U01-L3', unitId: 'G1-U01', iCan: 'say more, fewer or the same by matching',
    cpaSteps: ['two rows matched one to one', 'which row has more?', 'the word'],
    templates: ['sm.g1u01.l3.match_more'], skills: ['G1-U01-K3'], returnTargets: ['G1-U05-L6', 'G1-U12-L2'],
    exitTemplates: ['sm.g1u01.l3.match_more'], isPaperLesson: false,
  },
  {
    id: 'G1-U01-L4', unitId: 'G1-U01', iCan: 'order numbers to 10; one more, one less',
    cpaSteps: ['one counter added', 'number track', 'what comes just before?'],
    templates: ['sm.g1u01.l4.one_more_less'], skills: ['G1-U01-K4'], returnTargets: ['G1-U04-L3'],
    exitTemplates: ['sm.g1u01.l4.one_more_less'], isPaperLesson: false,
  },
]

const U01_SKILLS: SMSkill[] = [
  { id: 'G1-U01-K1', unitId: 'G1-U01', lessonIds: ['G1-U01-L1'], kind: 'solve', says: 'counts a set to 10 by touch', earnedOn: ['sm.g1u01.l1.count_set'], fluencyKind: 'standard' },
  { id: 'G1-U01-K3', unitId: 'G1-U01', lessonIds: ['G1-U01-L3'], kind: 'solve', says: 'says which row has more by matching', earnedOn: ['sm.g1u01.l3.match_more'], fluencyKind: 'standard' },
  { id: 'G1-U01-K4', unitId: 'G1-U01', lessonIds: ['G1-U01-L4'], kind: 'solve', says: 'says one more and one less to 10', earnedOn: ['sm.g1u01.l4.one_more_less'], fluencyKind: 'standard' },
]

// ---------------------------------------------------------------------------
// G1-U02 — the exemplar unit
// ---------------------------------------------------------------------------

const U02_LESSONS: SMLesson[] = [
  {
    id: 'G1-U02-L1', unitId: 'G1-U02', iCan: 'split a set into two parts in more than one way',
    cpaSteps: [T('l1.split_any'), T('l1.split_another_way'), T('l1.list_splits')],
    templates: [T('l1.split_any'), T('l1.split_another_way'), T('l1.list_splits'), T('l1.missing_split_choice')],
    skills: ['G1-U02-K1', 'G1-U02-K2'], returnTargets: ['G1-U04-L1'],
    exitTemplates: [T('l1.missing_split_choice')], isPaperLesson: false,
  },
  {
    id: 'G1-U02-L2', unitId: 'G1-U02', iCan: 'build a number bond: the whole and its parts',
    cpaSteps: [T('l2.bond_from_split'), T('l2.bond_given')],
    templates: [T('l2.bond_from_split'), T('l2.bond_given'), T('l2.which_bond'), T('l2.whole_part_truth')],
    skills: ['G1-U02-K3', 'G1-U02-K4'], returnTargets: ['G1-U05-L2'],
    exitTemplates: [T('l2.which_bond'), T('l2.whole_part_truth')], isPaperLesson: false,
  },
  {
    id: 'G1-U02-L3', unitId: 'G1-U02', iCan: 'add by putting the parts together, and write the sentence',
    cpaSteps: [T('l3.join_bond'), T('l3.add_pad')],
    templates: [T('l3.join_bond'), T('l3.add_pad'), T('l3.which_sentence')],
    skills: ['G1-U02-K4', 'G1-U02-K5'], returnTargets: ['G1-U05-L1'],
    exitTemplates: [T('l3.add_pad')], isPaperLesson: false,
  },
  {
    id: 'G1-U02-L4', unitId: 'G1-U02', iCan: 'subtract by taking away, or by finding the missing part',
    cpaSteps: [T('l4.take_away'), T('l4.empty_part_bond'), T('l4.error_take_away')],
    templates: [T('l4.take_away'), T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l4.sign_decides'), T('l4.error_take_away')],
    skills: ['G1-U02-K5', 'G1-U02-K6', 'G1-U02-K10'], returnTargets: ['G1-U05-L4', 'G1-U08-L5'],
    exitTemplates: [T('l4.missing_part_choice')], explainTemplate: T('l4.error_take_away'), isPaperLesson: false,
  },
  {
    id: 'G1-U02-L5', unitId: 'G1-U02', iCan: 'write the four facts of one bond, and read = as "is the same as"',
    cpaSteps: [T('l5.four_facts'), T('l5.equals_truth')],
    templates: [T('l5.four_facts'), T('l5.equals_truth'), T('l5.box_any_place'), T('l5.missing_addend_choice')],
    skills: ['G1-U02-K6', 'G1-U02-K7', 'G1-U02-K8'], returnTargets: ['G1-U05-L5'],
    exitTemplates: [T('l5.equals_truth')], isPaperLesson: false,
  },
  {
    id: 'G1-U02-L6', unitId: 'G1-U02', iCan: 'solve join and take-away stories within 10',
    cpaSteps: [T('l6.join_story'), T('l6.takeaway_story'), T('l4.error_take_away')],
    templates: [T('l6.join_story'), T('l6.takeaway_story'), T('l6.which_bond_story'), T('l6.paper_bond')],
    skills: ['G1-U02-K9', 'G1-U02-K10'], returnTargets: ['G1-U05-L6', 'G1-U08-L6'],
    exitTemplates: [T('l6.which_bond_story')], explainTemplate: T('l4.error_take_away'), isPaperLesson: true,
  },
]

const U02_SKILLS: SMSkill[] = [
  { id: 'G1-U02-K1', unitId: 'G1-U02', lessonIds: ['G1-U02-L1'], kind: 'model', says: 'splits a number to 10 into two parts', earnedOn: [T('l1.split_any'), T('l1.split_another_way')], fluencyKind: 'model-long' },
  { id: 'G1-U02-K2', unitId: 'G1-U02', lessonIds: ['G1-U02-L1'], kind: 'solve', says: 'lists the ways to split a number in order', earnedOn: [T('l1.list_splits'), T('l1.missing_split_choice')], fluencyKind: 'standard' },
  { id: 'G1-U02-K3', unitId: 'G1-U02', lessonIds: ['G1-U02-L2'], kind: 'model', says: 'builds a bond: the whole in the whole circle', earnedOn: [T('l2.bond_from_split'), T('l2.bond_given')], fluencyKind: 'model-long' },
  { id: 'G1-U02-K4', unitId: 'G1-U02', lessonIds: ['G1-U02-L2', 'G1-U02-L3'], kind: 'solve', says: 'matches a bond to its picture or sentence', earnedOn: [T('l2.which_bond'), T('l3.which_sentence')], fluencyKind: 'standard' },
  { id: 'G1-U02-K5', unitId: 'G1-U02', lessonIds: ['G1-U02-L3'], kind: 'solve', says: 'adds within 10 by putting the parts together', earnedOn: [T('l3.join_bond'), T('l3.add_pad'), T('l4.sign_decides')], fluencyKind: 'standard' },
  { id: 'G1-U02-K6', unitId: 'G1-U02', lessonIds: ['G1-U02-L4'], kind: 'solve', says: 'finds a missing part; subtracts within 10', earnedOn: [T('l4.empty_part_bond'), T('l4.sub_pad'), T('l4.missing_part_choice'), T('l4.sign_decides'), T('l5.box_any_place')], fluencyKind: 'standard' },
  { id: 'G1-U02-K7', unitId: 'G1-U02', lessonIds: ['G1-U02-L5'], kind: 'solve', says: 'writes the four facts of one bond', earnedOn: [T('l5.four_facts')], fluencyKind: 'standard' },
  { id: 'G1-U02-K8', unitId: 'G1-U02', lessonIds: ['G1-U02-L5'], kind: 'solve', says: 'reads "=" as "is the same as" and judges sentences', earnedOn: [T('l5.equals_truth'), T('l5.missing_addend_choice')], fluencyKind: 'standard' },
  { id: 'G1-U02-K9', unitId: 'G1-U02', lessonIds: ['G1-U02-L6'], kind: 'model', says: 'builds the bond for a join or take-away story', earnedOn: [T('l6.join_story'), T('l6.takeaway_story'), T('l6.which_bond_story')], fluencyKind: 'model-long' },
  { id: 'G1-U02-K10', unitId: 'G1-U02', lessonIds: ['G1-U02-L4', 'G1-U02-L6'], kind: 'explain', says: 'explains a take-away mistake (whole and parts)', earnedOn: [T('l4.error_take_away')], fluencyKind: 'model-long' },
]

/** EXEMPLAR §1: the teacher's demos and the facts they fix. Checks never use these. */
const U02_DEMOS: SMDemo[] = [
  { lessonId: 'G1-U02-L1', says: '6 counters split, "how else?"', facts: [{ whole: 6, parts: [2, 4] }, { whole: 6, parts: [1, 5] }, { whole: 6, parts: [3, 3] }] },
  { lessonId: 'G1-U02-L2', says: '5 counters split into 2 and 3, then the bond', facts: [{ whole: 5, parts: [2, 3] }] },
  { lessonId: 'G1-U02-L3', says: '3 and 4 put together, 3 + 4 = 7', facts: [{ whole: 7, parts: [3, 4] }] },
  { lessonId: 'G1-U02-L4', says: '7 counters, 3 taken away, 7 − 3 = 4', facts: [{ whole: 7, parts: [3, 4] }] },
  { lessonId: 'G1-U02-L5', says: 'the bond 7, 3, 4 and its four facts', facts: [{ whole: 7, parts: [3, 4] }] },
  { lessonId: 'G1-U02-L6', says: '5 birds, 3 more come; 9 apples, 4 eaten', facts: [{ whole: 8, parts: [5, 3] }, { whole: 9, parts: [4, 5] }] },
]

// ---------------------------------------------------------------------------
// The 13 units (GRADE-1 §2)
// ---------------------------------------------------------------------------

function stub(
  n: number, title: string, ccss: string[], chapterTopic: string, lessonCount: number, modelBuilt: string, heuristic: string,
): SMUnit {
  return {
    id: `G1-U${String(n).padStart(2, '0')}`, grade: 1, title,
    schoolChapter: { number: n, topic: chapterTopic }, ccss, lessonCount, modelBuilt, heuristic,
    lessons: [], skills: [], lessonExampleNumbers: [],
  }
}

export const G1_U01: SMUnit = {
  ...stub(1, 'Numbers to 10', ['1.NBT.A.1 (K review)'], 'numbers to 10', 4, 'counters matched and split; number track read · build', 'make a list'),
  lessons: U01_LESSONS,
  skills: U01_SKILLS,
  entryCheckLine: 'count a set to 10 by touch · say which of two small sets has more',
}

export const G1_U02: SMUnit = {
  ...stub(2, 'Number bonds; + and − within 10', ['1.OA.A.1', '1.OA.B.3–4', '1.OA.C.5–6', '1.OA.D.7–8'], 'addition and subtraction within 10', 6, 'number bond from a split set · build', 'guess and check'),
  lessons: U02_LESSONS,
  skills: U02_SKILLS,
  lessonExampleNumbers: U02_DEMOS,
  entryCheckLine: 'count a set to 10 (U01 L1) · one more and one less (U01 L4) · more or fewer by matching (U01 L3)',
  storySettings: ['ducks on a pond', 'birds on a fence', 'apples in a bowl', 'boats at a dock', 'shells in a bucket', 'fish in a tank', 'stickers on a page', 'balloons at a party'],
}

export const GRADE1_UNITS: readonly SMUnit[] = [
  G1_U01,
  G1_U02,
  stub(3, 'Shapes and patterns', ['1.G.A.1–3'], 'shapes and patterns', 4, 'shapes composed; pattern extended; shapes cut into halves and fourths · build', 'look for a pattern'),
  stub(4, 'Numbers to 20: a ten and some', ['1.NBT.B.2', '1.NBT.A.1'], 'numbers to 20', 4, 'ten frame (one full, one part) · build', 'make a list'),
  stub(5, '+ and − facts within 20', ['1.OA.B.3', '1.OA.C.6', '1.OA.D.8', '1.OA.A.1–2'], 'addition and subtraction facts within 20', 7, 'make-ten on two frames; bond; matched rows · build', 'guess and check'),
  stub(6, 'Numbers to 40: tens and ones', ['1.NBT.B.2–3', '1.NBT.C.5'], 'numbers to 40', 4, 'blocks on a place-value chart · build', 'look for a pattern'),
  stub(7, 'Calendar and time', ['1.MD.B.3'], 'calendar and time', 3, 'clock hands set · build', 'make a list'),
  stub(8, '+ and − within 40', ['1.NBT.C.4–6', '1.OA.A.1'], 'addition and subtraction within 40', 6, 'chart trade; column shown · build / read', 'guess and check'),
  stub(9, 'Length', ['1.MD.A.1–2'], 'length and weight', 3, 'cubes laid end to end · build', 'make a list'),
  stub(10, 'Numbers to 120', ['1.NBT.A.1', '1.NBT.B.2–3'], 'numbers to 120', 4, 'blocks on the chart to 100; hundred square read · build', 'look for a pattern'),
  stub(11, '+ and − within 100', ['1.NBT.C.4–6'], 'addition and subtraction within 100', 6, 'chart trades; column shown · build / read', 'guess and check'),
  stub(12, 'Graphs', ['1.MD.C.4'], 'graphs', 3, 'picture graph with a key; tally · build', 'make a list'),
  stub(13, 'Money (school-beside; 2.MD.C.8)', ['2.MD.C.8'], 'money', 3, 'coins as a bond · build', 'make a list'),
]

export function getUnit(id: string): SMUnit {
  const u = GRADE1_UNITS.find((x) => x.id === id)
  if (!u) throw new Error(`unknown unit ${id}`)
  return u
}

/** Every demo fact of a unit (EXEMPLAR §1's local reuse rule reads this). */
export function demoFacts(unit: SMUnit) {
  return unit.lessonExampleNumbers.flatMap((d) => d.facts)
}
