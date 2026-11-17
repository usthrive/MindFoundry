# The picture must be the thing the words name — Best Brains figures (2026-11-17)

**What the owner saw.** On his son's Best Brains Level B week 6 ("the balanced equal
sign"), day 4: *"The left pan of a balance holds three heaps: 7, 4 and 5 walnuts. The
right pan holds 12 walnuts and one closed bag. The bar sits level. How many walnuts are
inside the bag?"* The question was about a balance, but the picture showed boxes, like the
ones used for tens and ones.

**Why.** Best Brains had no balance figure, so B6 drew every balance as a **bar model**:
boxes for one pan only. This happened on 16 of the week's 35 questions, in the lesson and
in the puzzle. No check caught it. QG-13 proves a picture cannot contradict the
**numbers**, and nothing asked whether it was the right **thing**.

## What changed

| Week | Before | Now |
|---|---|---|
| **B6** (whole week: lesson, examples, practice, check, puzzle) | bar model, one pan | `balance`: beam, two pans, the heaps on each, a "?" sack for the closed bag, the bar level or tipped as the words say |
| **B7** covered-dish questions, lesson, modeled example | one bar labelled with the left pan | the balance with a covered dish marked "?" |
| **B10** "ten-blocks, each worth ten" | single small squares (the glyph a ONE gets) | ten-rods (`base-ten-blocks`) |
| **B2** GE-02 "read the number" from rods and cubes | a place-value chart that **printed 62, the answer** | 6 rods and 2 cubes in tens and ones columns, no numeral |

**The balance gives nothing away.** On a page where the child answers, each heap is a
solid **pile** of one fixed size, with its number written under it. The bag or dish is
fixed size too, so nothing on the page can be counted or measured in place of adding.
Countable dots on both pans would turn "7, 4 and 5 against 12 and a bag" into sixteen
dots against twelve, counted rather than added. That is the same reason B6 and B7 had
already refused to-scale pictures (L33: what does this picture let the child skip?).
Countable dots (`countable: true`) appear only where the answer is already on the page:
the lesson script and the modeled and completion examples, where watching the heaps
balance *is* the teaching.

A second, smaller fix: two labelled block groups ("here already", "arriving") ran into one
phrase. The gap between them now widens until the labels clear each other.

## The new gate: `scripts/bb-figure-kind-test.ts`

It walks every surface of every week × 2 seeds: lesson script, guided examples, warm-up,
practice, check forms and puzzle: 4,296 surfaces with a picture, across 117 weeks × 2 seeds. It checks three things:
- words that point at a pan balance must have a `balance` picture;
- words that name rods, ten-blocks or flats must have `base-ten-blocks`. The exception is
  B3's deliberate length model, where the words themselves say "one bar";
- a countable balance is allowed only where the answer is already on the page.

Known debt is a **ratchet**: counts may fall, never rise, and a new week may not join.
It has ten controls. Seven must fire, including B6, B10 and B2 as they were before the
fix. Three must stay quiet: "balances at nine", B3's one-bar blocks, and dots in a
lesson script. QG-13 also refuses:
- a level bar over unequal visible pans;
- a bar tipped toward the lighter side;
- an empty scale;
- piles with no numbers.

## Still wrong: the census of every week

These come from a census agent over ~15,800 surfaces. **Measured by the gate** means my
gate counts it. **Confirmed** means I checked it in the code or the pack myself. The rest
are agent findings I have not yet verified.

| Where | What the words name | What is drawn | Plan | Status |
|---|---|---|---|---|
| **B23** graph questions | "How many wrens does the graph show?" | the spoken image text lists every count ("… and 10 wrens"), so the read-aloud **says the answer** | alt names the graph and its categories, never the counts | **confirmed** (B23-D1-03, D2-03); agent count 69 surfaces. Most serious. `bb-spoken-answer-test` missed it because it checks band A only. |
| A20 | a stone on one pan, blocks on the other | a row of blocks | extend `balance`: a pan may hold a named object | measured by the gate (debt 6) |
| E13 | a sealed box and 40 g of weights on an arm | bars | `balance` with weights (grams) | measured (debt 4) |
| E15 | two pans not level; "a sealed box and thirty" | bars | same as E13 | measured (debt 2) |
| E15 | an inequality's shaded ray | a hop on a number line | number line with a shaded ray | agent |
| B4 | a hopscotch track | a tick line | a track figure, or reword | agent (78 surfaces) |
| C7 | tally marks | dots | a tally figure | agent |
| C7, C8 | wheels, legs | balls | counter icons | agent |
| C15 | pizza / cake fractions | rectangles | a fraction circle | agent |
| C23 | a pictograph | a number line (+84 with no picture) | a pictograph figure | agent |
| B23 lesson | a line plot | a box | a line-plot figure | agent |
| D23 | compound angles | a single angle | an angle figure with parts | agent |
| D6 | a leftover pile | nothing | counters can draw it | agent |
| E22 | "these bars" | no bars | draw the bars | agent |
| B1 | "the hundred chart" | a chart that runs to 120 | reword to "number chart" | agent |

**Proposed next change set:**
1. the B23 alt leak (it speaks answers);
2. extend `balance` to named objects and weights, which clears A20, E13 and E15 and the
   debt;
3. the new figure types in the order the son meets them: B23 line plot, C7 tally, C15
   fraction circle, C23 pictograph, D23 angles, E15 ray.

Each one gets added to the kind gate as it lands.

## Photographs

`docs/screens-2026-11-17/` holds the following, all at phone width:
- B6 day 4 Q2, the owner's question (piles + "?" bag);
- the B6 lesson (countable dots, right side down) and B6 GE-01 (countable);
- the B6 puzzle;
- B7 day 1 Q2 (piles + covered dish) and B7 GE-01 (countable);
- B10 GE-01 (rods, labels apart);
- B2 GE-02 (rods and cubes);
- the figure gallery's balance cases.

The B6 question at tablet width is there too. In the harness's phone-width column, the
keypad's "✓ Submit" and the header's "Anchor" clip at the right edge. That predates this
change and is noted for later.

**Battery:** 29/29 pass (2026-11-17 09:46), the new kind gate included. Two tsc runs in
this change set; the first caught the dead `partWholeBars`. The 40 lint errors in the
changed scripts are older `any`s; none is on a changed line.
