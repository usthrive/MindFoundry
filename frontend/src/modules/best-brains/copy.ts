/**
 * Best Brains-inspired module — band-keyed microcopy.
 *
 * All child-facing strings live here, keyed by interaction band (P10).
 * Rows 1–15 are the CANONICAL strings from SCREEN-SPECS.md appendix H —
 * implementers may localize but never re-tone. Additional strings are
 * [original design] in the same voice, and pass P4 (name the move, never
 * speed/"smart") and P6 (no fail-words, no "Review", no %).
 */

import type { BBLevel } from './types';

/** Interaction band per P10: A = 4–6 tap-first, B = 6–9 NumberPad, C = 9–12 symbolic. */
export type InteractionBand = 'A' | 'B' | 'C';

/** Level → interaction band (CURRICULUM-MAP §0.3: A→A, B/C→B, D/E→C). */
export function bandForLevel(level: BBLevel): InteractionBand {
  if (level === 'A') return 'A';
  if (level === 'B' || level === 'C') return 'B';
  return 'C';
}

/** Age → band guess, used only pre-placement (PlacementWelcome, DD5). */
export function bandForAge(age: number): InteractionBand {
  if (age <= 6) return 'A';
  if (age <= 9) return 'B';
  return 'C';
}

export type BandCopy = Record<InteractionBand, string>;

/** Canonical microcopy (SCREEN-SPECS appendix H). A-band sprint rows are '' (no sprints at A). */
export const COPY = {
  /** #1 Day complete */
  dayComplete: {
    A: 'Done for today! Your tile is glowing.',
    B: "That's the whole dose. Tomorrow's tile unlocks in the morning!",
    C: "Done — on time, like always. Tomorrow's set unlocks in the morning.",
  } as BandCopy,
  /** #3 Near-miss (StrengthenPlan) */
  nearMiss: {
    A: 'One more round to make it stick — like gluing!',
    B: 'So close — just the renaming step is wobbly. Tomorrow we glue it down with brand-new problems.',
    C: 'One step is still fighting you: renaming. Short revisit tomorrow, then fresh problems — everything else keeps moving.',
  } as BandCopy,
  /** #4 Sprint intro (three facts) — no sprints at A */
  sprintIntro: {
    A: '',
    B: 'Two calm minutes. Just you versus last time. This never, ever gets a grade.',
    C: 'Two minutes, you versus your last count, never graded. Musicians and athletes train exactly this way.',
  } as BandCopy,
  /** #5 Sprint end */
  sprintEnd: {
    A: '',
    B: 'The timer sang — we simply stop and see.',
    C: "Time. Pencils down, no drama — let's see the count.",
  } as BandCopy,
  /** #6 Sprint declined */
  sprintDeclined: {
    A: '',
    B: "Not today — that's completely fine. Back to the good stuff.",
    C: 'Noted. The offer comes back another day; nothing changes.',
  } as BandCopy,
  /** #7 Week passed (WeekResolve) */
  weekPassed: {
    A: 'This one goes on your shelf!',
    B: 'Two-digit subtraction is *yours* now. Up on the shelf it goes.',
    C: "That concept is yours — shelved. It'll sneak into warm-ups; you'll squash it every time.",
  } as BandCopy,
  /** #8 Welcome back after absence */
  welcomeBack: {
    A: 'Welcome back! We were right here.',
    B: 'Welcome back! Your trail waited for you — no hurry, we pick up right here.',
    C: "Good to see you. Everything's where you left it — your trail doesn't expire.",
  } as BandCopy,
  /** #9 Item parked (TreasureChest) */
  itemParked: {
    A: 'This one goes in our treasure chest for tomorrow!',
    B: "Into the treasure chest — we'll catch this sneaky one tomorrow.",
    C: 'Parking this one in the log. Professionals keep a list of bugs they\'ve beaten.',
  } as BandCopy,
  /** #10 Lesson pin (AnchorPanel fill) */
  lessonPin: {
    A: 'Our examples live right here all week!',
    B: 'These examples stay pinned right here all week — come peek any time.',
    C: 'The worked examples are pinned for the week. Stuck later? Start there, not with a guess.',
  } as BandCopy,
  /** #11 Check framing (WeeklyCheck open) */
  checkFraming: {
    A: 'Last page of the week! You know these.',
    B: "The show-what-you-know page. I'll hold my comments till the end so you can show me your own thinking.",
    C: 'Last page of the week. I hold comments till the end — and the anchor shows only the strategy card, so it\'s really you.',
  } as BandCopy,
  /** #12 Offline tally */
  offlineTally: {
    A: "I'll count these when the internet comes back!",
    B: "I'll tally this when we're back online — your answers are safe with me.",
    C: "Answers saved locally; I'll score the check when we reconnect. Nothing is lost.",
  } as BandCopy,
  /** #13 Idle timeout / soft-stop close */
  idleTimeout: {
    A: "We'll finish tomorrow. It will wait for you.",
    B: "Let's stop here — the rest will wait for you tomorrow.",
    C: 'Good stopping point. The remainder holds until tomorrow — consistency beats bingeing.',
  } as BandCopy,
  /** #14 Warm-up open */
  warmupOpen: {
    A: 'Warm-up time! Quick and easy.',
    B: 'Warm-ups first — quick ones to wake your math up.',
    C: "Warm-ups first. Old friends — you'll recognize them.",
  } as BandCopy,
  /** #15 Fast-track pass */
  fastTrack: {
    A: 'One more look and you got it ALL!',
    B: "One reteach and you didn't just fix it — you *owned* it.",
    C: 'One reteach, near-perfect Form B. Your brain was one small idea away the whole time.',
  } as BandCopy,
} as const;

/** Module strings beyond the canonical table — [original design], same voice. */
export const MODULE_COPY = {
  /** PlacementWelcome framing (DD5: exploration, never a test). */
  placementWelcome: {
    A: "Hi! I'm Ms. Wren. Let's find your starting point!",
    B: "Hi, I'm Ms. Wren. Let's find your perfect starting point. Some of this will feel easy, some might feel new — both help me.",
    C: "I'm Ms. Wren. This helps me skip what you already own — skipping earned material is the whole point. No grade, nothing to pass — just calibration.",
  } as BandCopy,
  placementCta: {
    A: "Let's go!",
    B: "Let's go",
    C: "Let's go",
  } as BandCopy,
  /** Identical warm-neutral acknowledgment on every placement answer. */
  placementAck: {
    A: 'Got it!',
    B: 'Got it!',
    C: 'Got it.',
  } as BandCopy,
  placementPause: {
    A: 'Wiggle break? Or keep going?',
    B: 'Want to stretch, or keep going?',
    C: 'Want a short break, or keep going?',
  } as BandCopy,
  startingPoint: {
    A: 'We found your starting point!',
    B: 'We found your starting point!',
    C: 'We found your starting point.',
  } as BandCopy,
  journeyEmptyShelf: {
    A: 'This shelf is going to fill up!',
    B: 'This shelf is going to fill up.',
    C: 'This shelf is going to fill up — one owned concept at a time.',
  } as BandCopy,
  /** Locked tile reads as "resting", not forbidding (ThisWeekHub). */
  tileResting: {
    A: 'Resting until tomorrow.',
    B: 'Resting until tomorrow morning.',
    C: 'Unlocks tomorrow morning.',
  } as BandCopy,
  /** Increment-4 surfaces stubbed with a warm line. */
  comingThisWeek: {
    A: 'This part is still baking! Come back soon.',
    B: 'This page is coming this week — Ms. Wren is still setting it up.',
    C: 'This part arrives later this week — everything else keeps moving.',
  } as BandCopy,
  guidedIntro: {
    A: "Let's do it together!",
    B: "Let's try these together — I'll start, you finish.",
    C: 'Three examples, then you take over.',
  } as BandCopy,
  lessonRecap: {
    A: 'Want a tiny reminder first?',
    B: "It's been a little while — want a 60-second recap first?",
    C: 'Been a few days — a 60-second recap is on offer before we continue.',
  } as BandCopy,
  hintAffordance: {
    A: 'Help me',
    B: 'A little help?',
    C: 'Hint',
  } as BandCopy,
  /** PuzzleGrove open — the week's one non-computational page (DD12). */
  puzzleOpen: {
    A: 'Puzzle time! This one is for playing.',
    B: 'Back to the Grove! A puzzle about this week\'s idea.',
    C: 'The Grove page — this is where you get to be the teacher.',
  } as BandCopy,
  /** PuzzleGrove qualitative close (strategy talk, never a score). */
  puzzleClose: {
    A: 'What a good puzzle brain!',
    B: 'You tried a strategy, checked it, and stuck with it — that\'s real puzzle work.',
    C: 'You reasoned it through instead of guessing — exactly the point of the Grove.',
  } as BandCopy,
  /** PuzzleGrove park option ("brain marinating"). */
  puzzlePark: {
    A: 'We can let it rest and come back!',
    B: 'Brain marinating — we can come back after the check.',
    C: 'Let it marinate — we can return after the check.',
  } as BandCopy,
  /** WeeklyCheck submit-in-flight. */
  checkTallying: {
    A: 'Counting up your great work…',
    B: 'Tallying your week…',
    C: 'Scoring the check…',
  } as BandCopy,
  /** StrengthenPlan cycle-2 entry — a different angle promised. */
  strengthenCycle2: {
    A: 'Let\'s look at it a brand-new way!',
    B: 'This time we\'ll look at it from a different angle — sometimes the second door opens easily.',
    C: 'Round two, different angle. Same skill, new way in — that\'s how debugging works.',
  } as BandCopy,
  /** StrengthenPlan escalation variant — reinforcements, program-owned. */
  strengthenEscalated: {
    A: 'A real teacher friend wants to explore this with you!',
    B: 'A real teacher from our team wants to look at this with you — that\'s an upgrade, not a problem.',
    C: 'A teacher from our team is joining in. If the hill was too steep, that\'s ours to fix — not yours.',
  } as BandCopy,
  /** MicroReteach intro (worked example first). */
  reteachIntro: {
    A: 'Let\'s watch my favorite example again!',
    B: 'Quick look at the sneaky step together — then brand-new problems.',
    C: 'Two minutes on the one step that\'s fighting you — think of it as reading the bug report.',
  } as BandCopy,
  /** FreshProblems framing (Form B — brand-new by law). */
  freshIntro: {
    A: 'All-new problems, just for you!',
    B: 'Brand-new problems — not the old ones. That would just test your memory of the pages.',
    C: 'Brand-new problems — reusing the old ones would test your memory, not the skill.',
  } as BandCopy,
  /** LS1-R2 adaptive stop — warm early end, concept resurfaces tomorrow. */
  adaptiveStop: {
    A: 'Your brain worked SO hard. We finish tomorrow!',
    B: 'Your brain did heavy lifting today — we\'ll finish fresh tomorrow. It will wait for you.',
    C: 'That was real effort. We stop while it\'s still good — the rest holds until tomorrow.',
  } as BandCopy,
  /** Hub: corrective dual-thread line + reveal-next-week CTA. */
  nextWeekReveal: {
    A: 'A new adventure is ready!',
    B: 'Ready for the next idea? The trail continues.',
    C: 'Next concept is ready when you are.',
  } as BandCopy,
  /**
   * Hub: the week was won TODAY, so the reveal waits for the calendar to turn.
   *
   * The wait is deliberate (P1 — the cycle turns when the day does) but it was
   * SILENT: a child who passed saw a settled Wren line, five finished tiles and
   * no next step, with nothing on screen saying one was coming. The corrective
   * path has said "opens tomorrow" all along; the winning path said nothing,
   * so finishing well looked exactly like being stuck.
   *
   * Names the day, not a duration — "tomorrow" is a thing a six-year-old can
   * check; "in 14 hours" is not.
   */
  nextWeekWaiting: {
    A: 'A new adventure opens tomorrow!',
    B: 'The next idea opens tomorrow — it will be waiting for you.',
    C: 'The next concept opens tomorrow. Nothing more to do today — that is the point.',
  } as BandCopy,
  /**
   * Hub: every week of the level is done. Deliberately says nothing about a
   * next level, because the code path that would move a child to one does not
   * exist yet (`advanceToNextWeek` clamps at WEEKS_PER_LEVEL and nothing
   * changes `enrollment.level`). Promising it here would be the app lying to a
   * child once a week until someone built it.
   */
  levelComplete: {
    A: 'You finished every week! Ms. Wren is so proud of you.',
    B: 'That is every week of this level finished — the whole trail, start to end.',
    C: 'Every week at this level is complete. Worth telling whoever set this up for you.',
  } as BandCopy,
  /** TreasureChest empty settled moment. */
  chestEmpty: {
    A: 'The chest is empty — all caught!',
    B: 'Chest\'s empty — every sneaky one caught. Nice.',
    C: 'Log\'s clear. Every bug beaten.',
  } as BandCopy,
  /** TreasureChest opener. */
  chestOpen: {
    A: 'Let\'s open our treasure chest!',
    B: 'Shall we catch yesterday\'s sneaky ones?',
    C: 'The bug list — let\'s close some entries.',
  } as BandCopy,
} as const;

/**
 * Correct-answer confirms (DD13: brief, specific). Rotated by item index so a
 * string is never mechanical; each names doing, not speed.
 */
export const CONFIRMS: Record<InteractionBand, readonly string[]> = {
  A: ['You did it!', 'That matches!', 'You found it!'],
  B: ['That works — you lined the steps up.', 'Solid — the setup did the job.', 'Yes — you followed the model.'],
  C: ['Correct — clean setup.', 'Right — the method held.', 'Yes — exactly the strategy from the anchor.'],
};

/**
 * Canonical row 7 with the concept slot filled: the spec's B-band string names
 * "Two-digit subtraction" as its worked example — at runtime the actual owned
 * concept takes that slot (same law as row 2's "generic slot — always filled
 * with the specific move"; a line reusable for different weeks unedited would
 * fail the P4 violation test).
 */
export function weekPassedLine(band: InteractionBand, conceptName: string): string {
  if (band === 'B') return `${conceptName} is *yours* now. Up on the shelf it goes.`;
  return COPY.weekPassed[band];
}

/** Miss opener (Acknowledge step of Acknowledge→Locate→Guide→Re-attempt; never a bare ✗). */
export const MISS_OPENER: BandCopy = {
  A: "Good try! Let's look together.",
  B: 'Good thinking so far — one step got sneaky. Let\'s find it.',
  C: 'Not yet — something in one step. Let\'s locate it.',
};
