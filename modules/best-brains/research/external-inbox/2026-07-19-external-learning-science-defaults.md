# Learning-Science Design Defaults for a K–8 Math App

Saved as [ext-04-learning-science.md](sandbox:/mnt/data/ext-04-learning-science.md)

## Practice dosage and mastery gates

**Daily practice length and problem count**

The research base is much stronger on *brief, frequent, distributed practice* than on one universal “right” number of items. In applied classroom research, distributed practice reliably beats massing, including in a recent classroom meta-analysis showing a moderate overall benefit for distributed over massed practice, and in K–4 intervention studies showing that higher weekly frequency improves proximal computation outcomes. At the same time, a first-grade intervention study found that 10-minute sessions produced gains similar to longer 20–40 minute sessions for most students, which argues against long daily practice blocks for new or fragile skills. Developmentally, sustained attention improves markedly from about ages 5–6 to 8–9 and then levels off more gradually, so older children can usually tolerate somewhat longer focused work than younger children. Finally, homework syntheses suggest that simply assigning more time is not a strong lever in elementary grades, which reinforces the case for short, high-quality daily app sessions rather than long digital worksheets. citeturn15search3turn5view0turn5view1turn7search2turn33search2

For an app built around one weekly concept, “one problem” should mean one *cognitively substantial item*—for example, one word problem, one puzzle, one computation set with a single underlying strategy, or one short completion task. That matters because a varied set of six items can be far more effortful than six near-identical drill questions. On that basis, the best research-supported default is to keep daily sessions short and to stop before signs of fatigue, such as rising error rates, repeated hint use, or rushed guessing. citeturn15search3turn5view1turn20view2

| Age | Daily target | Hard cap | Evidence-informed default item count |
|---|---:|---:|---:|
| 5 | 8 minutes | 10 minutes | 4–6 items |
| 8 | 12 minutes | 15 minutes | 6–8 items |
| 11 | 15 minutes | 20 minutes | 8–10 items |

These counts are best treated as starting defaults, not fixed laws. If a learner is highly accurate and still attentive, the app can occasionally add one challenge item; if errors, latency, or help-seeking spike, the app should end the session early and recycle the missed idea later in the week. That kind of adaptive stopping rule fits the larger spacing literature better than demanding a fixed page-length equivalent every day. citeturn15search3turn14search6turn20view2

**Recommendation for the app:** Start with an 8/12/15-minute default for ages 5/8/11, with hard caps of 10/15/20 minutes and about 4–6, 6–8, and 8–10 substantial items respectively. Make the session end condition adaptive: if the student shows two signs of fatigue in one session—such as accuracy dropping below recent baseline, repeated rapid guesses, or heavy hint dependence—stop and resurface the concept tomorrow rather than pushing through. citeturn15search3turn5view1turn20view2turn33search2

**Mastery thresholds and measuring mastery across days**

Mastery-learning research has usually set criterion in the **80–90% correct** range, and later reviews still describe that band as typical practice. But the more important learning-science point is that a single high-scoring session after blocked practice can overestimate durable learning. Research on successive relearning shows that spaced retrieval to criterion across multiple sessions produces much stronger retention than a one-shot criterion, and research on relearning shows that pushing to a very high criterion *within one sitting* is less efficient than returning to the content across later spaced sessions. citeturn10search13turn10search5turn11search1turn11search4

For a weekly-concept model, the gate should therefore combine **accuracy, stability, and spacing**. Accuracy alone is not enough; the student should also show the skill on more than one day, in more than one format, with low dependence on scaffolds. A good mastery estimate is not “Did the student get 9/10 once?” but “Can the student still do this across the week, after a delay, including at least one transfer item?” That approach is also consistent with the literature showing that conceptual and procedural knowledge develop iteratively and that transfer is a more demanding indicator than immediate imitation. citeturn11search1turn11search4turn37view0

A sensible default is: do not advance on the basis of one session; instead require performance across **at least three spaced opportunities**. One practical standard is **at least 85% accuracy on the last three daily independent sets, with no day below 80%, plus a next-day or two-days-later mastery check at 90% or better on a short mixed-format set**. The mastery check should include at least one straightforward item, one item with changed surface features, and one cumulative-review item so that the student must identify the right strategy rather than merely mimic yesterday’s pattern. citeturn10search13turn11search1turn11search4turn13view0

**Recommendation for the app:** Gate advancement at roughly **85–90% independent accuracy across multiple days**, not a single perfect run. A strong default is: advance only when the student hits at least 85% on three spaced daily sets, stays at or above 80% each day, and then earns at least 90% on a short delayed mastery check with one or two transfer items and minimal hint use. citeturn10search13turn11search1turn11search4turn37view0

## Mixing and spiral review

**Interleaving versus blocking in a weekly-concept model, and how much spiral review to include**

Blocked practice has one real advantage: it helps novices get oriented to a brand-new procedure or representation. But once students know the basic idea, interleaving improves the ability to select the right strategy and supports delayed retention. In a large randomized classroom trial in seventh-grade mathematics, mostly interleaved assignments led to much higher scores on a delayed unannounced test than mostly blocked assignments, and the defining feature was that no two consecutive problems required the same strategy. The What Works Clearinghouse elementary math guide likewise recommends mixing previously learned and newly learned problem types throughout intervention as cumulative review, specifically to help students discriminate among problem types rather than solving on autopilot. citeturn13view0turn40view0

For your weekly-concept rhythm, the best compromise is **front-loaded novelty with back-loaded mixing**. Early in the week, students need enough same-concept exposure to understand the new idea. By the middle and end of the week, the set should shift toward interleaving so students must recognize *when* the new concept applies and when older knowledge is relevant instead. This recommendation also matches the broader spacing literature, which shows that distributed review improves long-term retention more than massed re-exposure. citeturn13view0turn15search3turn14search6

A practical spiral-review target is **about 20–30% old content at the start of the week and 30–40% old content by the end of the week**. For short app sessions, that usually means one old item in a five-item set, two old items in a six-to-eight-item set, and three or four old items in a ten-item set. Those old items should not all come from yesterday; stronger spacing comes from sampling one very recent concept, one concept from two to four weeks back, and one older “maintenance” concept that reappears after longer gaps. citeturn40view0turn15search3turn14search6

Non-repetitive practice fits well with this evidence. What matters is not identical repetition but repeated opportunities to retrieve, discriminate, and apply ideas across changing surface forms. In math, interleaving is especially valuable because it trains students to *choose* a method, not just execute one after a cue that already tells them what to do. citeturn13view0turn40view0

**Recommendation for the app:** Use light blocking only at the start of a concept week. Make days one and two about 70–80% current-concept work and days three through five about 60–40 or even 50–50 current-versus-prior concepts, with no two adjacent independent items using the same strategy when avoidable. citeturn13view0turn40view0turn15search3

## Worked examples and fading support

**How to move from worked example to completion problem to independent practice**

The worked-example effect is one of the clearest findings from cognitive load theory: novices learn more efficiently when fully or partially worked solutions reduce unnecessary search. From there, the strongest design pattern is **fading**—gradually removing steps from the example until the learner solves the whole problem independently. Studies on fading worked-out steps found that it supports the transition from studying examples to solving problems, and later work found that fading can outperform simple example-problem alternation. citeturn16search3turn16search7

The key caution is the **expertise reversal effect**. Supports that help novices can become redundant for more knowledgeable learners and can even slow learning once the learner already has a usable schema. That means your app should not keep strong scaffolds on forever; once a student is consistently accurate, support should recede quickly. It also means the app should be able to *re-escalate* support after errors, rather than assuming every student needs the same fixed sequence. citeturn16search2turn16search10

A strong weekly sequence is:  
full worked example → prompted self-explanation of the example → completion problem missing the final step → completion problem missing a middle step → isomorphic independent problem → surface-varied independent problem. This aligns with research showing that comparing procedures, self-explaining, and guided exploration can strengthen both conceptual and procedural knowledge when timed appropriately. citeturn16search3turn16search7turn37view0

In app terms, each fade should remove just one layer of support at a time. For example, on Monday a learner sees every step and hears why it works; on Tuesday the representation is still present but the learner fills one step; by Wednesday the learner gets only a representation and a plan prompt; by Thursday or Friday the learner works independently and sees help only on request or after an error. If the learner misses two similar items in a row, the app should step back one rung rather than simply marking the concept “not mastered.” citeturn16search3turn16search2turn37view0

**Recommendation for the app:** Default to a five-rung progression: full example, prompted example explanation, single-gap completion, multi-gap completion, then independent practice with mixed surface forms. Fade automatically after strong performance, but reverse one rung after repeated similar errors so that scaffolding is adaptive rather than one-directional. citeturn16search3turn16search7turn16search2

## Fluency checks and feedback

**Timed fluency checks**

The case *for* fluency checks is that automaticity matters: when basic facts or simple procedures become fast and accurate, working memory is freed for more complex math. The National Mathematics Advisory Panel explicitly argued that building automaticity can free attention for harder aspects of complex tasks and noted that well-implemented drill and practice can help in specific domains. citeturn19view0

The case *against* heavy reliance on timing is that time pressure adds stress and can distort what you are measuring. In a recent arithmetic-learning study, timed practice increased perceived stress, and in work with mathematically gifted sixth graders, performance was worse under timed than untimed conditions, especially for students with higher anxiety or perfectionism. More broadly, the math-anxiety literature supports a bidirectional relationship in which weak performance and anxiety can reinforce each other. citeturn20view2turn21search2turn21search5turn21search0

For K–8 design, the defensible default is: use timed checks **narrowly**, not as the main engine of learning. They are best reserved for already-understood facts and high-frequency procedures, not for first learning of a concept. They also should not be the gate for conceptual advancement; a student can understand regrouping, fraction comparison, or equation balance without yet being fast. For younger children in particular, visible countdowns and public comparison add risk with limited instructional payoff. citeturn19view0turn20view2turn21search2turn21search0

Age-appropriate implementation looks different by age. At age 5, use “quick checks” with a hidden or soft timer and an accuracy-first message. At age 8, brief one-minute checks can work for facts already taught conceptually, but compare the student to their own prior score rather than to peers. At age 11, one- to two-minute checks can be used occasionally for progress monitoring, but only alongside untimed transfer items so speed never becomes the entire definition of competence. citeturn19view0turn20view2turn21search2

**Recommendation for the app:** Treat timed fluency as a *small supplement*, not a core daily mode. Use it once or twice a week for already-understood facts or short procedures, keep it private and self-referenced, avoid visible countdown pressure for the youngest users, and never make passing a timed task the sole condition for advancing to a new concept. citeturn19view0turn20view2turn21search2turn21search0

**Immediate versus delayed feedback, and how to combine both**

The feedback literature does not support a simplistic “immediate is always best” or “delayed is always best” rule. A classic review found that in applied classroom settings, immediate feedback often helps more, while in some experimental acquisition tasks delayed feedback can improve later retention. Shute’s review similarly concludes that formative feedback should be timely, specific, and supportive, and notes that delayed feedback can be advantageous when transfer is the goal. A later study likewise found that delayed feedback improved transfer even though students *felt* immediate feedback was more helpful. citeturn22search4turn39search0turn22search14

For an app, the most evidence-aligned combination is **immediate micro-feedback plus delayed macro-feedback**. Immediate feedback is important for error correction during daily practice, especially for younger learners and for procedural or misconception-prone items. The WWC practice guide explicitly recommends immediate, supportive feedback and, in fluency work, recommends that students correct errors before moving on. At the same time, a weekly report has a different purpose: it should summarize patterns, strengths, common error types, and next steps after some forgetting has occurred. citeturn40view1turn39search0turn22search4

Another important design point is that **comments beat grades-only signals** for learning. The large feedback meta-analysis by Wisniewski and colleagues concluded that information-rich forms of feedback matter, and prior syntheses it discusses note that specific written comments outperform grades. In app terms, a green checkmark or percentage alone is weak; “You compared denominators, but these fractions have different-sized parts—try a common benchmark” is much stronger. citeturn22search3turn39search10

So the best hybrid is: after each daily item, provide immediate correctness and a brief corrective explanation or prompt; at the end of the week, provide a short teacher-style summary that does not merely restate a score but identifies what the student reliably does, what still breaks, and what will be revisited before mastery is confirmed. citeturn40view1turn39search0turn22search3

**Recommendation for the app:** Give immediate corrective feedback on daily practice items, especially after errors or misconceptions, and require a corrected response when feasible. Then add a delayed end-of-week report that summarizes error patterns, highlights growth, and previews what still needs rehearsal; do not rely on weekly grades alone. citeturn40view1turn22search4turn39search0turn22search3

## Hints and help-seeking

**How many hint levels, and what kind, before revealing answers**

Research on intelligent tutoring systems strongly favors **multi-level hint sequences** that grow more specific over time and end with a “bottom-out” hint. In Carnegie-style tutors, hint sequences often contain multiple levels—sometimes five to eight—with help starting at level one and increasing one level per request. This design reflects the “assistance dilemma”: too little help leaves students stuck, but too much help too early can short-circuit learning. citeturn23search21turn23search6turn23search12

The same literature also warns against **hint abuse**. Students sometimes jump straight to bottom-out hints to harvest answers rather than think, and maladaptive help-seeking is associated with worse learning. At the same time, later work shows that bottom-out hints are not inherently bad; when students actually spend time processing them, they can function like mini worked examples and correlate positively with learning. The crucial variable is not whether hints exist, but whether the system encourages *instrumental* use of hints rather than answer-chasing. citeturn38search3turn38search6turn38search10

For a K–8 math app, a **three-level ladder plus optional reveal** is usually the best balance between research and usability. Many ITSs use longer ladders, but on a phone or tablet, five to eight text-only hints can become tedious and invite skipping. A compact ladder can still preserve the core structure of effective help:  
Level 1: metacognitive cue (“What is the question asking you to compare?”)  
Level 2: strategic cue or representation prompt (“Use a number line/common unit/part-whole model.”)  
Level 3: step-specific cue (“First find how many groups of 4 fit into 28.”)  
Then, if needed, a bottom-out reveal that shows the step or answer *with* a brief why. citeturn23search21turn23search6turn38search6

A further best practice is to require an *attempt before escalation* and a *repair action after reveal*. In other words, the student should not be able to tap immediately from Level 1 to the full answer without at least trying, and after seeing a bottom-out hint, the student should complete a near-transfer follow-up or explain the revealed step in simple language. That design borrows the strengths of both worked examples and productive help-seeking. citeturn23search12turn38search6turn16search3

**Recommendation for the app:** Use a default ladder of three hints—metacognitive, strategic, then step-specific—before a bottom-out reveal. Require at least one genuine attempt before the ladder advances, and after any answer reveal, immediately give a short “fix-it” problem or explanation prompt so hints function as learning supports rather than escape hatches. citeturn23search21turn23search6turn38search6turn23search12

## Conceptual teaching on screen

**What the evidence says about “why before how,” concreteness fading, and CRA**

The strongest research summary is not that conceptual teaching should replace procedures, but that conceptual and procedural knowledge are usually **bi-directional and iterative**. Rittle-Johnson and Schneider’s review concludes that gains in one often support gains in the other, and it highlights comparison, self-explanation, exploration before instruction, and iterating between conceptual and procedural lessons as promising methods. In other words, “why before how” is useful if it means *ground the procedure in meaning*—not if it means postpone usable procedures for a long time. citeturn37view0

Concreteness fading and CRA give a strong structure for doing that. Fyfe and colleagues’ work found that moving from concrete materials to more abstract representations improved children’s transfer more than reversing the sequence, and their review explains why concrete-to-abstract sequences can help learners interpret symbols, ground abstractions, and then strip away irrelevant surface detail. A recent meta-analytic review of the CRA approach also found strong positive effects across intervention studies. citeturn27search0turn27search3turn27search6turn28view0

On screen, virtual manipulatives are a reasonable substitute **when they are tightly linked to symbols and not treated as unstructured play**. A meta-analysis of 66 reports found a moderate overall effect of virtual manipulatives on student achievement and identified affordances such as focused constraint, simultaneous linking of representations, efficient precision, and motivation. Single-case work also shows that virtual manipulatives paired with explicit instruction and prompting can improve accuracy for students with math difficulty. citeturn28view2turn28view1

For your app, that means each lesson should make the “why” visible through a brisk sequence: concrete or virtual action, then an annotated drawing or schematic, then the symbolic form. The same quantities should persist across all three forms so the student can map one to the other. The screen should explicitly highlight correspondences—for example, tapping two groups in a model should light up the “2 ×” part of the equation, and moving a piece should update the symbolic expression. That is much closer to research-backed concreteness fading than simply putting blocks on a screen and hoping insight emerges. citeturn27search6turn28view2turn37view0

**Recommendation for the app:** Teach each new concept through a short concrete-to-representational-to-abstract arc, with explicit links across representations and a fast move from “see why it works” to “try it yourself.” Do not interpret conceptual-first as concept-only: after the why is established visually, transition the learner quickly into guided and then independent procedural use within the same week. citeturn37view0turn27search6turn28view0turn28view2

## Motivation without gamification overload

**How to sustain daily practice without leaning on points, streaks, and badges**

The most stable motivation finding here comes from self-determination theory: students persist better when learning environments support **autonomy, competence, and relatedness**. A large meta-analysis found that teacher autonomy support predicts need satisfaction and self-determined motivation, and the broader SDT literature emphasizes that controlling environments undermine autonomous engagement. citeturn29search4turn29search8

That has direct product implications. Choice can help when it is meaningful but bounded, and classroom experiments show that offering students choices among homework assignments can improve motivation and later performance. Utility-value interventions also matter: when students make personal connections to why a task matters, perceived utility and performance can improve, especially for learners who begin with low performance expectations. citeturn31search5turn31search15

The caution about heavy gamification is not that every game element is harmful; it is that **extrinsic rewards and gamified overlays are not a reliable substitute for good motivational design**. Meta-analytic work on rewards found that some contingent rewards can undermine intrinsic motivation, while later work found that intrinsic motivation predicts quality of performance more strongly than incentives do. Gamification reviews likewise report mixed results and explicitly note that simply adding points, badges, or leaderboards does not automatically increase motivation or learning. citeturn32search0turn32search2turn34search0turn34search10

For a daily-practice math app, the highest-yield motivational features are therefore surprisingly plain: short sessions that feel finishable, visible evidence of real growth, occasional choice, warm explanatory tone, private self-comparison, and meaningful adult connection. Children are more likely to return when they feel “I can do this, I’m getting better, and this work means something,” not when they are trapped defending a fragile streak. If you use game elements at all, they should be light wrappers around mastery and curiosity, not the main reason to practice. citeturn29search4turn31search15turn32search2turn34search10

Good non-gamified defaults include: offering two or three practice-path choices inside the same objective; showing a mastery map that emphasizes skills secured rather than points earned; using personal-best progress messages instead of leaderboards; including occasional “why this matters” prompts tied to school and life; and giving teachers/parents short, supportive summaries so adult encouragement reinforces the routine. Those features support the motivational needs the research repeatedly identifies without turning math into a reward economy. citeturn29search4turn31search5turn31search15turn32search0

**Recommendation for the app:** Build motivation around autonomy, competence, and relevance: offer small choices, show mastery growth clearly, and keep progress private and self-referenced. Use points or streaks, if at all, as a light optional layer; the main loop should be “short success, visible improvement, meaningful next step,” not “protect the badge.” citeturn29search4turn31search5turn31search15turn32search0turn34search10

## Bibliography

Aleven, V., & Koedinger, K. R. (2002). *An effective metacognitive strategy: Learning by doing and explaining with a computer-based cognitive tutor.*

Aleven, V., McLaren, B. M., Roll, I., & Koedinger, K. R. (2016). *Research on help seeking with intelligent tutoring systems.*

Betts, J., McKay, J., Maruff, P., & Anderson, V. (2006). *The development of sustained attention in children: The effect of age and task load.*

Carey, E., Hill, F., Devine, A., & Szücs, D. (2016). *The chicken or the egg? The direction of the relationship between mathematics anxiety and mathematics performance.*

Cerasoli, C. P., Nicklin, J. M., & Ford, M. T. (2014). *Intrinsic motivation and extrinsic incentives jointly predict performance: A 40-year meta-analysis.*

Codding, R. S., VanDerHeyden, A. M., Martin, R. J., Desai, S., Allard, N., & Perrault, L. (2016). *Manipulating treatment dose: Evaluating the frequency of a small group intervention targeting whole number operations.*

Cooper, H., Robinson, J. C., & Patall, E. A. (2006). *Does homework improve academic achievement? A synthesis of research, 1987–2003.*

Deci, E. L., Koestner, R., & Ryan, R. M. (1999). *A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation.*

Ebner, S., MacDonald, M. K., Grekov, P., & Aspiranti, K. B. (2025). *A meta-analytic review of the concrete-representational-abstract math approach.*

Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). *Concreteness fading in mathematics and science instruction: A systematic review.*

Fyfe, E. R., McNeil, N. M., & Borjas, S. (2015). *Benefits of concreteness fading for children’s mathematics understanding.*

Fuchs, L. S., Newman-Gonchar, R., Schumacher, R., Dougherty, B., Bucka, N., Karp, K. S., Woodward, J., Clarke, B., Jordan, N. C., Gersten, R., Jayanthi, M., Keating, B., & Morgan, S. (2021). *Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades.*

Higham, P. A., et al. (2022). *The benefits of successive relearning on multiple learning outcomes.*

Jazbutis, O. R., Wiseheart, M., Radvansky, G. A., & McNeil, N. M. (2023). *Distributed practice and time pressure interact to affect learning and retention of arithmetic facts.*

Kalyuga, S. (2007). *Expertise reversal effect and its implications for learner-tailored instruction.*

Kulik, J. A., & Kulik, C.-L. C. (1988). *Timing of feedback and verbal learning.*

Mawson, R. D., & Kang, S. H. K. (2025). *The distributed practice effect on classroom learning: A meta-analytic review of applied research.*

Moyer-Packenham, P. S., & Westenskow, A. (2013). *Effects of virtual manipulatives on student achievement and mathematics learning.*

National Mathematics Advisory Panel. (2008). *Foundations for Success: The Final Report of the National Mathematics Advisory Panel.*

Patall, E. A., Cooper, H., & Wynn, S. R. (2010). *The effectiveness and relative importance of choice in the classroom.*

Renkl, A., Atkinson, R. K., Maier, U. H., & Staley, R. (2002/2003). *From studying examples to solving problems: Fading worked-out solution steps helps learning.*

Rittle-Johnson, B., & Koedinger, K. R. (2009). *Iterating between lessons on concepts and procedures can improve mathematics knowledge.*

Rittle-Johnson, B., & Schneider, M. (2015). *Developing conceptual and procedural knowledge of mathematics.*

Rohrer, D., Dedrick, R. F., Hartwig, M. K., & Cheung, C.-N. (2019). *A randomized controlled trial of interleaved mathematics practice.*

Shute, V. J. (2008). *Focus on formative feedback.*

Tsui, J. M., & Mazzocco, M. M. M. (2007). *Effects of math anxiety and perfectionism on timed versus untimed math testing in mathematically gifted sixth graders.*

Vaughn, K. E., Dunlosky, J., & Rawson, K. A. (2016). *Effects of successive relearning on recall: Does relearning override the effects of initial learning criterion?*

Wisniewski, B., Zierer, K., & Hattie, J. (2020). *The power of feedback revisited: A meta-analysis of educational feedback research.*