/**
 * The unit's ledgers as data (ENGINE-SPEC §5.4–§5.5, §6.7; EXEMPLAR-G1-U02 §9; METHOD-LEDGER).
 * `sm-ledgers-test` reads GRADE-1.md and METHOD-LEDGER.md at run time and holds these to them.
 *
 * COVERAGE: every item type in GRADE-1's U02 "Item types" column is served by named templates
 * of that lesson, or carries a reasoned deferral. Debt (an item type with neither) is a
 * ratchet: it starts at 0 (EXEMPLAR §9) and may never rise.
 *   Reading of the format codes (GRADE-2 legend, used by GRADE-1): N-I* input surfaces, T*
 *   test formats, L* lesson formats (L1 concrete objects moved, L3 a bond built from a set,
 *   L7 two sets joined into a bond, L16 make a list), `truth` claim rows.
 *
 * METHOD LINKS: the G1-U02 skills another module touches (Kumon's facts, Best Brains' facts
 * and missing addends) and the METHOD-LEDGER rows that carry their link sentences. Decision
 * T-6: a link sentence is said only when the child is enrolled in that module (read at day
 * start, stage 5); no template emits one yet.
 */

export interface CoverageRow {
  lessonId: string
  /** Item type (as GRADE-1 writes it) → the templates that serve it. */
  servedBy: Record<string, string[]>
  /** Item type → why it is not served yet (none in G1-U02). */
  deferred: Record<string, string>
}

const T = (s: string) => `sm.g1u02.${s}`

export const COVERAGE_DEBT_BASELINE = 0

export const G1U02_COVERAGE: CoverageRow[] = [
  { lessonId: 'G1-U02-L1', deferred: {}, servedBy: {
    'N-I4': [T('l1.split_any'), T('l1.split_another_way')],
    L1: [T('l1.split_any'), T('l1.split_another_way')],
    L16: [T('l1.list_splits'), T('l1.missing_split_choice')],
  } },
  { lessonId: 'G1-U02-L2', deferred: {}, servedBy: {
    L3: [T('l2.bond_from_split'), T('l2.bond_given')],
    'N-I2': [T('l2.bond_from_split'), T('l2.bond_given')],
    T1: [T('l2.which_bond')],
  } },
  { lessonId: 'G1-U02-L3', deferred: {}, servedBy: {
    L7: [T('l3.join_bond')],
    T8: [T('l3.add_pad')],
    T1: [T('l3.which_sentence')],
  } },
  { lessonId: 'G1-U02-L4', deferred: {}, servedBy: {
    'N-I2': [T('l4.empty_part_bond')],
    T8: [T('l4.sub_pad'), T('l4.sign_decides')],
  } },
  { lessonId: 'G1-U02-L5', deferred: {}, servedBy: {
    truth: [T('l5.equals_truth')],
    T8: [T('l5.four_facts'), T('l5.box_any_place')],
  } },
  { lessonId: 'G1-U02-L6', deferred: {}, servedBy: {
    T17: [T('l6.join_story'), T('l6.takeaway_story')],
    'N-I2': [T('l6.join_story'), T('l6.takeaway_story')],
    'N-I8': [T('l6.join_story'), T('l6.takeaway_story'), T('l6.paper_bond')],
  } },
]

/** G1-U02 skills another module touches → METHOD-LEDGER rows. */
export const G1U02_METHOD_LINKS: Record<string, string[]> = {
  'G1-U02-K5': ['B1'],
  'G1-U02-K6': ['B1', 'B2'],
  'G1-U02-K7': ['B1'],
  'G1-U02-K8': ['B2', 'B16'],
}
