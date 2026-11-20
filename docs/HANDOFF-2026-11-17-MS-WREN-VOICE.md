# Handoff — give Ms. Wren a natural voice (2026-11-17)

**The owner's ask (verbatim):** "One issue that I have with the app is the audio quality
of Ms. Wren. It is computer generated and not natural. In the next conversation I would
like to address this short coming, so that its is easy for my son to listen to and not
hard to comprehend. Just use one of the free TTS service like Microsoft for this audio
issue."

Repo: `/home/usthr/Penta_University/Math_Tutor/MindFoundry`. Branch
`best-brains-content-engine` sits on main `c6deb5b`, with nothing uncommitted except this
file. The owner has delegated teaching and screen-design decisions. **The voice itself is
the owner's pick**: audition, then ask.

## What is true today (read the code before trusting this)

- **Ms. Wren speaks through one component:**
  `frontend/src/modules/best-brains/components/AudioButton.tsx`.
  - 19 call sites across the Best Brains screens: lesson, guided examples, warm-up,
    practice, check, review, puzzle and treasure chest.
  - It calls `speak(text, {}, onEnd, onError, 'browser')`, **forcing the device's own
    voice** (`speechSynthesis`). That is the robotic voice the owner hears. The header
    calls the browser voice "the accessibility floor, never removable". Keep it as the
    **fallback**, not the default.
  - The button has three states (speak / pause / resume) and checks that a pause really
    happened, because iOS ignores `speechSynthesis.pause()`. A new audio path must keep
    those states working for `HTMLAudioElement` too.
- **A cloud voice path already exists:** `frontend/src/services/ttsService.ts` (975 lines).
  - `speak(…, 'auto' | 'google' | 'browser')` calls the Supabase edge function
    `generate-speech` (`supabase/functions/generate-speech/index.ts`), which uses the
    **OpenAI** `gpt-4o-mini-tts` voice "nova" and returns base64 MP3.
  - It has an in-memory cache (50 entries), request de-duplication, a client throttle,
    and falls back to the browser voice.
  - The Kumon/homework side uses it (`src/components/homework/AudioButton.tsx`,
    `voiceType = 'auto'`).
  - `src/pages/TestTTSPage.tsx` is an existing A/B listening page.
  - Find out why Best Brains was pinned to `'browser'` (cost, latency, or the 11-14
    egress incident?) before changing it. The git log and BRIEF / LEARNINGS docs may say.
- **What gets spoken:** `speakablePrompt(prompt, figureScene(figure), statements)` in
  `frontend/src/modules/best-brains/figures/prompt.ts`. That is the picture's spoken
  line, then the question; `speechChunk.ts` splits long text.
  - Autoplay: band A on every screen; check questions at bands A and B
    (`CheckRunner autoplay={band !== 'C'}`); word problems on word-problem days at any
    band.
  - Most text is **generated per pack** (seeded numbers), so it cannot all be recorded in
    advance. Lesson scripts and guided examples are mostly fixed text.
- **Gates that already guard spoken text:** `bb-spoken-answer-test` (the spoken line
  never gives the answer), `bb-lesson-audio-test` (chunking), and `bb-readability-test`.
  A voice change must keep them green.

## Recommended approach (check the current Microsoft terms first)

**Microsoft Azure AI Speech, free tier (F0), neural voices.** My notes say about 0.5
million characters a month free for neural text-to-speech. **Check the current number,
the sign-up terms (an Azure account may need a card) and the F0 limits on Microsoft's
own pages before committing to it.**
- Do **not** use the unofficial "Edge Read Aloud" endpoint (`edge-tts`). It is free and
  needs no key, but it is not a published API, may break the terms of service, and can
  stop working without notice: not something a child's daily lessons should depend on.

**Shape I'd expect (the session decides after reading the code):**
1. **Server side:** add a provider `azure` to `generate-speech`, or a sibling function.
   The key lives in Supabase secrets, is set by the owner or through the management API,
   and is **never printed, never in the client bundle, never in memory files**.
   - Use SSML: a warm voice, a slightly slower rate (around −10%), and short pauses
     between sentences.
   - Return MP3 at a low bitrate (24 kHz / 48 kbps mono is plenty for speech).
2. **Caching:** the same sentences repeat across sittings and seeds.
   - Cache by hash(text + voice + rate). In the browser, use the Cache API or IndexedDB.
     Server-side, optionally a Storage bucket.
   - Watch **egress**: the org went over its Supabase egress quota on 11-14 and is now on
     Pro (memory `supabase-org-pro-upgrade.md`). Keep files small and cache on the device.
   - Preload the next question's audio while the child works on the current one.
3. **Client:** Ms. Wren's AudioButton uses the new voice with **automatic fallback** to
   the browser voice (offline, quota hit, error, slow network).
   - Keep the speak / pause / resume behaviour.
   - Keep autoplay working: mobile browsers block audio that was not started by a tap.
     The child normally taps to move on, but test autoplay after navigation on a tablet
     (his device is a tablet with the touch number pad) and on a phone.
4. **Free-tier guard:** count characters sent per month (server side). Near the cap,
   fall back to the browser voice rather than fail. Show the count on a parent or admin
   view, or at least in logs.

**Voice audition (owner decides):**
- Generate the same three or four real Ms. Wren lines (a lesson line, a question with
  numbers, a fraction such as "3/8", a time such as "quarter past 10") in three or four
  Microsoft neural voices. Candidates: a warm adult female such as Jenny, Aria, Ava or
  Emma, and one child-friendly option such as Ana.
- Use one or two speaking rates, and let the owner listen on a simple page.
- Check that numbers, fractions, times, "×", "÷", "▢" (the box) and money read naturally.
  Note: `speakablePrompt` already rewrites some symbols, so read it first.

## House rules (binding; from `docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md`)

- **Never send the child's name to an AI or an outside service.**
  - Several Best Brains screens use the child's name (hub, journey map, starting point,
    parent pages).
  - Before any text goes to Microsoft, prove no spoken line contains the name. Strip it,
    or speak those lines with the device voice.
  - Make this a gate with a broken control.
- **Explain before commit:** the exact pathspec and contents, then wait for the word.
  Commit, push and merge are separate instructions.
  - Push with `git push origin best-brains-content-engine:best-brains-content-engine`.
  - Squash-merge, then reset the branch onto main and `push --force-with-lease`.
- **Secrets:** never print a key. Set secrets via `supabase secrets set` or the
  management API without echoing them. After deploying, prove by grepping the live
  bundle that no key is in it.
- **Gates have broken controls** (each must be seen to fail):
  - Ms. Wren uses the cloud voice when it is available and the browser voice when it is
    not;
  - no child's name in text sent out;
  - the character guard fires;
  - the cache key includes the voice.
- **The battery runs serially** (4 GB machine). It is the 29 runs listed in the 11-10
  handoff plus `bb-figure-kind-test`, and new gates join it. Run `tsc` at most twice per
  change set and disclose any extra runs.
- **Every screen change is photographed and looked at.** For audio, also save sample
  MP3s and have the owner **listen** before anything ships.
- **Verify live** by grepping the deployed bundle (mindfoundry.netlify.app). Content
  sits in lazy chunks such as `bb-content-*.js` and `BBFigureView-*.js`.
- Decisions go in inline tables, never pop-up questions. Ask the owner before anything
  that costs money or changes his son's records.

## Where things stand (2026-11-17)

- **Shipped today:**
  - PR #28: balances drawn as balances, B7 / B10 / B2 pictures;
  - PR #29: graphs no longer speak their answers (figures have a `spoken` line next to
    `alt`), and new figure types (tally, pizza circle, pictograph, number track, line
    plot, shaded ray, balance objects and weights).
  - Report: `docs/REPORT-2026-11-17-PICTURE-KIND.md`.
- **Open owner decision:** clock-hand and number-line descriptions are still spoken
  (B12, B17, C18, C2). A ratchet in `bb-spoken-answer-test` stops them from rising.
- **Memory to read:**
  - `~/.claude/projects/-home/memory/mindfoundry-picture-kind.md`;
  - `mindfoundry-recall-not-lookup.md`;
  - `supabase-org-pro-upgrade.md`.
