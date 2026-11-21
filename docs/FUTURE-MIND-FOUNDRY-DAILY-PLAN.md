# Future idea — the Mind Foundry daily plan (Kumon + Best Brains + Singapore Method in one day)

**Status: an idea saved for later, not planned and not built.** Owner, 2026-11-21:

> "As a future enhancement keep a note to create a version of mind foundry that creates a daily
> practice plan which is worth 30 min and combines Kumon sheets, Best Brains and Singapore Method..
> all questions are reduced but all three methods / approaches are taught in parallel. This might be
> a unique Mind Foundry approach. But this is just an idea to be saved for future enhancement."

No child's name anywhere, by rule.

## The idea in one paragraph

One day of about 30 minutes, built by the app, holding a smaller dose of each method: Kumon-style
fluency (a short sheet), one Best Brains-style concept item set, and Singapore Method model-building
(a bond, chart or bar the child makes). The three are taught **in parallel** and **linked**: the same
skill seen three ways on the same day where the method ledger says they meet (e.g. Kumon's fast fact,
the Best Brains concept, the Singapore bond that pictures it), so the child learns one idea, not three
unconnected routines.

## What each method brings (from the method ledger)

| Method | Its job in the combined day | Today in the app |
|---|---|---|
| Kumon-style | speed and accuracy on written computation; a short sheet | worksheets, pass rule on first try + time |
| Best Brains-style | one named concept a week, word problems, puzzles, weekly check | 5-day weekly packs |
| Singapore Method | the structure under the arithmetic: the child builds the model, the school's formats | being built (BUILD-PLAN v2) |

`modules/school-math/design/curriculum/METHOD-LEDGER.md` already names one method per skill per
module and the link sentence between them; it is the natural spine for a combined day.

## Questions to answer when it is taken up

1. **The dose split** inside 30 minutes (e.g. 10 / 10 / 10, or weighted by the child's weakest
   method), and whether the split follows the child's records.
2. **The order of the day**: fluency first (warm), concept, then model; or the model first so the
   facts that follow have a picture.
3. **One mastery record or three**: "knows" per skill across methods (TAD §2) vs each module's own
   rule (Kumon sheet pass rule; Best Brains week gate; Singapore two-day skill rule).
4. **Alignment**: which week / sheet / unit is "today" when the three ladders are at different
   places; the method ledger's rows as the joins.
5. **The parent's single report** of one day across three methods, counts only.
6. **Whether it replaces or sits beside** the three separate modules.

## What the current build keeps possible (no work now)

- Every module's day is a **question count** with a recorded time per day.
- The Singapore Method attempt log records skill ids, and the method ledger maps them to Kumon
  ranges and Best Brains weeks.
- The module registry describes each module's session generator, so a combined planner could call
  each one for a smaller dose.

## Today (owner, 2026-11-21)

The first learner does the three separately and lighter: Kumon 15–20 minutes (2 sheets, 20
questions), Best Brains 10–15 minutes, Singapore Method 15 minutes (BUILD-PLAN v2 §14).
