/**
 * The help ladders (EXEMPLAR-G1-U02 §6; METHODOLOGY §2 Step 5; TAD §3.2).
 *
 * Four rungs: what it means → use what you know → a way to finish → the answer.
 * Number-free and role-based, so one ladder holds at every seed (FANOUT kit rule 2).
 * Rung 1 is always an orienting question. Rungs 1–3 never carry a key. Rung 4's words
 * stay number-free too: the answer is shown by the screen action (`show`), which the
 * renderer fills from the item's own key.
 *
 * Quoted rung text in EXEMPLAR §6 is used as written. Where §6 describes a screen action
 * ("the two circles light up"), the action goes in `show` and a short plain line is said.
 * The families `sign`, `count`, `match`, `order` and `teen` are not in §6 (they serve
 * l4.sign_decides and the outside templates); they are authored here in the same shape.
 */

import type { SMLadderRung } from '../../types'

type Ladder = [SMLadderRung, SMLadderRung, SMLadderRung, SMLadderRung]

const L = (r1: [string, string], r2: [string, string], r3: [string, string], r4: [string, string]): Ladder =>
  [r1, r2, r3, r4].map(([say, show]) => ({ say, show })) as Ladder

export const LADDERS: Record<string, Ladder> = {
  split: L(
    ['How many in all? Move some to the other circle.', 'none'],
    ['Look at the two circles.', 'light-both-circles'],
    ['Both circles together must still have all of them.', 'none'],
    ['Here is one way. Let us read it together.', 'show-one-split-and-bond'],
  ),
  // "Make a list" and "which way is missing?" show a list of rows, not circles (main-session
  // review of the stage-1 dump: the split ladder's "move some to the other circle" named a
  // thing the screen does not have).
  list: L(
    ['What number are we splitting? Read the list in order.', 'none'],
    ['Look at the rows that are done.', 'light-done-rows'],
    ['Each row makes the whole. Count on from the first number.', 'none'],
    ['Here is the full list. Let us read it.', 'show-full-list'],
  ),
  'bond-build': L(
    ['Which circle holds everything?', 'none'],
    ['This is the whole circle.', 'light-whole-circle'],
    ['The whole goes here. Now fill the parts.', 'place-whole'],
    ['Here is the bond. Let us read it together.', 'fill-bond'],
  ),
  'missing-part': L(
    ['What is the whole? Which part is hidden?', 'none'],
    ['Look at the bond with the numbers we know.', 'show-empty-bond-with-known'],
    ['Start at the part you know. Count on to the whole.', 'none'],
    ['Here is the bond. Let us read the sentence.', 'fill-bond-read-sentence'],
  ),
  add: L(
    ['Are we putting together or taking away?', 'none'],
    ['Look at the bond with both parts.', 'show-empty-bond-with-parts'],
    ['Start at the bigger part. Count on the other part.', 'none'],
    ['Here is the whole. Let us read the sentence.', 'fill-whole-read-sentence'],
  ),
  'four-facts': L(
    ['Read the bond: the whole, then the parts. Which is the whole?', 'none'],
    ['Look at the bond beside the sentence.', 'light-bond-beside-sentence'],
    ['Two parts make the whole. Take a part from the whole.', 'none'],
    ['Here is the sentence. Let us read it together.', 'fill-sentence'],
  ),
  truth: L(
    ['Read one row. Look at the bond. Is it true?', 'none'],
    ['Look at the bond.', 'light-bond'],
    ['The whole is the biggest number in the bond.', 'none'],
    ['Here is each row, marked. Let us read them.', 'mark-each-row'],
  ),
  story: L(
    ['Let us hear the story again. What do we want to find?', 'reread-story'],
    ['Here is a bond. Where does the question mark go?', 'show-empty-bond-with-question-mark'],
    ['The numbers we know go in the bond.', 'place-known-numbers'],
    ['Here are the bond and the sentence.', 'fill-bond-and-sentence'],
  ),
  error: L(
    ['What was the whole? What was taken away?', 'none'],
    ['Look at the whole and the part taken away.', 'show-empty-bond-whole-and-taken'],
    ['What is left must be less than the whole.', 'none'],
    ['Here is the right answer and its bond.', 'show-answer-and-bond'],
  ),
  // --- authored (not in EXEMPLAR §6) -----------------------------------------
  sign: L(
    ['Look at the sign. Are we putting together or taking away?', 'none'],
    ['Look at the bond with the numbers we know.', 'show-empty-bond-with-known'],
    ['Putting together makes more. Taking away leaves less.', 'none'],
    ['Here is the answer. Let us read the sentence.', 'fill-sentence'],
  ),
  count: L(
    ['How do we know how many there are?', 'none'],
    ['Touch each one. It goes dim.', 'dim-on-touch'],
    ['The last number we say tells how many.', 'none'],
    ['Here is the count. Let us say it together.', 'count-aloud-with-answer'],
  ),
  match: L(
    ['Which row has some with no partner?', 'none'],
    ['Look at the lines that match them.', 'light-matching-lines'],
    ['The row with some left over has more.', 'none'],
    ['Here is the row with more.', 'ring-answer-row'],
  ),
  order: L(
    ['Where is the number on the track?', 'none'],
    ['Look at the track around it.', 'light-track-window'],
    ['Before is on the left. After is on the right.', 'none'],
    ['Here is the number. Let us read it.', 'fill-track-cell'],
  ),
  teen: L(
    ['Which picture has a full ten?', 'none'],
    ['Look at the full ten frames.', 'light-full-frames'],
    ['Count the extra ones after the ten.', 'none'],
    ['Here is the picture. Let us read it.', 'ring-answer-picture'],
  ),
}

export function ladderFor(family: string): Ladder {
  const l = LADDERS[family]
  if (!l) throw new Error(`unknown ladder family ${family}`)
  return l.map((r) => ({ ...r })) as Ladder
}
