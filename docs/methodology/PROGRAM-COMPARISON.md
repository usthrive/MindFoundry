# Math Program Comparison — Kumon vs. Best Brains

*A side-by-side of the teaching methodologies behind Mind Foundry's modules. Today it compares **Kumon** and **Best Brains**; it is structured so each new approach we add (Russian School of Math, Mathnasium, Singapore Math, …) becomes one more column — see "Adding a program" at the bottom.*

*Best Brains facts trace to the research ledger (`modules/best-brains/research/phase2-gaps/EVIDENCE-LEDGER-FINAL.md`). Kumon facts reflect the established public model and the existing Kumon-style module in this app.*

---

## The one-paragraph difference

**Kumon** is a *self-paced worksheet mastery* system: the child works a long, finely-graded ladder of worksheets, mostly independently, repeating each small step until it is fast and automatic before advancing. Repetition is the engine. **Best Brains** is a *teacher-led, weekly-concept* system: a real teacher introduces one new concept per week, the child reinforces it with short daily homework, and it's graded and reported weekly. Understanding-before-fluency is the engine. Put simply: **Kumon drills a skill until it's automatic; Best Brains teaches a concept until it's understood.** Neither removes homework — they differ in *what* the daily work is and *who* teaches.

---

## Side-by-side

| Dimension | 📚 **Kumon Method** | 🪶 **Best Brains Method** |
|---|---|---|
| **Core philosophy** | Mastery through repetition; speed + accuracy; self-learning | Non-repetitive, concept-based; "the why before the how"; anti-drill |
| **Unit of progression** | The **worksheet** (a graded ladder of ~200/level) | The **week** (one new concept per week) |
| **Who teaches** | Largely self-directed; center staff check work | A teacher introduces & explains each concept (in-app: Ms. Wren) |
| **Time per day** | ~**20–30 min**, often 2 short sessions, timed | ~**5–15 min**, one page, untimed daily work |
| **Problems per day** | **High** — often a full worksheet (10+), many near-identical; a day can total 100+ calculations at fluency levels | **Low & varied** — ~4–10 substantial items (word problems, puzzles, reasoning), ~20–30% spaced review |
| **Repetition** | Central — same pattern repeated to build automaticity | Deliberately minimized — new surface each time; review is spaced, not massed |
| **Timed work** | Yes — Standard Completion Time (speed is a promotion criterion) | Optional, private, self-referenced "beat your own time"; **never gates advancement** |
| **Feedback** | Immediate self/parent grading; corrections same session | Immediate item feedback in-app **+** a weekly narrative report |
| **Mastery / advancement** | Advance on accuracy **and speed**; repeat sets until both met | Advance on an **85% weekly check**; below → a corrective reteach week with fresh problems |
| **Levels** | ~24 levels (7A→O + electives), offset from school grade | 5 levels (A–E), 24 weekly concepts each; placement-set, grade-decoupled |
| **Parent role** | **Grades** the daily homework; runs the timer | **Reads & acknowledges** a weekly report; never grades |
| **Concept intros** | Minimal — learn by doing the examples | Explicit weekly lesson with worked examples that fade |
| **Emotional register** | Disciplined, repetitive, speed-aware | Calm, warm, strategy-praising; **child never sees %, red marks, or "fail"** |
| **Best-fit child** | Thrives on routine & repetition; building raw fluency/automaticity | Bores of drill, or needs the concept explained; likes variety & low pressure |
| **Watch-outs** | Can feel repetitive; "boredom refugee" is a common Best Brains arrival story | Fluency must be *engineered in* (spaced retrieval) since drill is rejected |

## By the numbers (quick reference)

| | Kumon | Best Brains |
|---|---|---|
| Daily time | 20–30 min | 5–15 min |
| Items/day | ~10+ (often 100+ calcs) | ~4–10 substantial |
| Progression unit | worksheet | week |
| Full ladder | ~24 levels × ~200 sheets | 5 levels × 24 weeks (120 concepts) |
| Advancement test | speed + accuracy per set | 85% weekly mastery check |
| Who grades homework | parent | the system (server-scored) |

## How our two modules embody each

- **📚 Kumon Method** (`/study`) — the original module: a worksheet generator across levels 7A–O, problems-per-page scaling, worksheet advancement, a count-up timer, and repetition-driven practice. Faithful to the drill-and-fluency model.
- **🪶 Best Brains Method** (`/foundry`) — the new module: placement → weekly concept → Ms. Wren's lesson → short daily practice with a 3-rung hint ladder and immediate explained feedback → a Day-5 puzzle → an 85% Friday check with a warm corrective loop → a weekly parent report with the "Seen it" acknowledgement. Faithful to the concept-first, teacher-led, weekly model.

Both conform to the same internal **Module Interface Contract**, which is what lets them sit side-by-side on the home menu and what makes adding a third and fourth approach a matter of building to the contract rather than rebuilding the app.

---

## Adding a program (template)

When we build the next methodology module, add a column to the tables above and a short profile here. The research → design → build → test pipeline that produced the Best Brains module is captured as a reusable, parameterized template (`modules/best-brains/meta/`), so each new program follows the same rigor.

**Planned next columns** (differentiators to research, from the pipeline's starter notes):
- **Russian School of Math (RSM)** — reasoning-heavy, discussion-based, deliberately challenging; homework-intensive; mental math emphasis.
- **Mathnasium** — in-center diagnostic-driven "learning plan," mastery checks, flexible (no fixed weekly curriculum path), prize/engagement layer.
- **Singapore Math** — Concrete→Pictorial→Abstract (CPA) progression, **bar-model** problem solving, mastery-with-depth, fewer topics per year.

**Per-program profile to fill in:** core philosophy · unit of progression · who teaches · time/day · problems/day · repetition stance · feedback model · mastery/advancement rule · level structure · parent role · emotional register · best-fit child · the signature technique that makes it recognizable.

---

*Companion doc: `BEST-BRAINS-OVERVIEW.md` (deep dive on the Best Brains approach + our implementation). Program names are used descriptively to identify each methodology; no affiliation with Kumon or Best Brains is claimed.*
