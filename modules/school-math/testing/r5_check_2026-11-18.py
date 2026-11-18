"""R5 check (IMPROVEMENTS-FROM-R5 applied 2026-11-18).

Recomputes every new or changed key and every "wrong answer <- rule" value written in the R5
apply, confirms each stated string is present in its file, checks the one new numeric choice
pool for numeric-rank rotation, checks the probe's new F / W rows, runs the reuse rule
(CURRICULUM-MAP §7.12) for the new lesson numbers, and runs the exam-value gate (list read at
run time from EXAM-READING.md's "Exam values for the no-exam-items gate" section, plus his
written answers) over the files changed: tier 1 over every file; tier 2 over the changed rows
and new text.
Run: python3 -I r5_check_2026-11-18.py   (output kept in r5_check_2026-11-18.out.txt)
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(ROOT, "design", "curriculum")


def rd(*p):
    return open(os.path.join(ROOT, *p), encoding="utf-8").read()


G2 = rd("design", "curriculum", "GRADE-2.md")
G1 = rd("design", "curriculum", "GRADE-1.md")
DD = rd("design", "curriculum", "DESIGN-DEFAULTS.md")
CM = rd("design", "curriculum", "CURRICULUM-MAP.md")
EC = rd("design", "curriculum", "EXAM-COVERAGE.md")
ML = rd("design", "curriculum", "METHOD-LEDGER.md")
RV = rd("design", "curriculum", "G2-U01-REVIEW-2DAY.md")
IM = rd("design", "curriculum", "IMPROVEMENTS-FROM-R5.md")
LL = rd("meta", "LICENCE-LOG.md")
LG = rd("research", "phase2-gaps", "EVIDENCE-LEDGER-FINAL.md")
ER = rd("research", "phase0", "EXAM-READING.md")

N = 0
BAD = 0


def chk(label, got, stated):
    global N, BAD
    N += 1
    ok = got == stated
    BAD += 0 if ok else 1
    print(f"  {'OK ' if ok else 'BAD'} {label}: got {got}, stated {stated}")


def present(label, text, s):
    chk(f"text present [{label}]", s in text, True)


def sfl(a, b):
    """smaller digit from larger in each column"""
    w = max(len(str(a)), len(str(b)))
    da, db = str(a).zfill(w), str(b).zfill(w)
    return int("".join(str(abs(int(x) - int(y))) for x, y in zip(da, db)))


def trades(a, b):
    """number of column trades (carries) in a + b"""
    c, n = 0, 0
    while a or b:
        t = a % 10 + b % 10 + c
        c = 1 if t >= 10 else 0
        n += c
        a //= 10
        b //= 10
    return n


def ones_ten_zero_forgotten(a, b):
    """'the ones make a ten: write 0 and forget it' (no carry from the ones only)"""
    o = (a % 10 + b % 10) % 10
    t = ((a // 10) % 10 + (b // 10) % 10)  # carry dropped
    h = a // 100 + b // 100 + t // 10
    return h * 100 + (t % 10) * 10 + o


def row(text, unit_heading, label):
    """the lesson row starting with '| <label>' inside the unit's table"""
    i = text.index(unit_heading)
    j = text.find("\n### ", i + 1)
    block = text[i:j if j > 0 else None]
    for l in block.split("\n"):
        if l.startswith("| " + label + " ") or l.startswith("| " + label + "|"):
            return l
    raise KeyError(unit_heading + " " + label)


print("== Proposal 5: G2-U01 L2 (how many tens; the noun dropped)")
chk("tens in 380", 380 // 10, 38)
chk("'the tens digit is all the tens' on 380", (380 // 10) % 10, 8)
chk("50 + 70", 50 + 70, 120)
chk("'5 + 7' with the noun dropped", 5 + 7, 12)
chk("120 is 12 tens", 120 // 10, 12)
present("U01 L2 row", row(G2, "### G2-U01", "L2"), "how many tens in 380 → 8")
present("U01 L2 row", row(G2, "### G2-U01", "L2"), "50 + 70 → 12")

print("== Proposal 2: G2-U01 L3 (parts in any order)")
chk("6 ones + 2 hundreds + 4 tens", 6 + 200 + 40, 246)
chk("digits in the order heard (6, 2, 4)", int("624"), 624)
present("U01 L3 row", row(G2, "### G2-U01", "L3"), "6 ones + 2 hundreds + 4 tens → 624")

print("== Proposal 2: G2-U01 L6 (split another way; take one part away)")
chk("628 = 600 + 28", 600 + 28, 628)
chk("628 = 500 + 128", 500 + 128, 628)
chk("628 = 620 + 8", 620 + 8, 628)
chk("628 = 500 + [] key", 628 - 500, 128)
chk("'a split keeps the other digits' -> 28 (and 500 + 28 is not 628)", (628 % 100, 500 + 28 != 628), (28, True))
chk("5 hundreds 12 tens 8 ones = 628", 500 + 120 + 8, 628)
chk("628 - 20 (take the 2 tens)", 628 - 20, 608)
chk("'take 2 ones' 628 - 2", 628 - 2, 626)
present("U01 L6 row", row(G2, "### G2-U01", "L6"), "628 = 500 + □ → 28")
present("U01 L6 row", row(G2, "### G2-U01", "L6"), "628 − 20 → 626")
chk("U04-EC pair: 405 = 3 hundreds 10 tens 5 ones", 300 + 100 + 5, 405)

print("== Proposal 8: G2-U01 L7 (number line to 1,000)")
chk("538: tens before / after", (538 // 10 * 10, 538 // 10 * 10 + 10), (530, 540))
chk("538: hundreds before / after", (538 // 100 * 100, 538 // 100 * 100 + 100), (500, 600))
chk("'add a ten' rule on 538", 538 + 10, 548)
chk("bridge demo: 52 on 0-100 sits where 520 sits on 0-1,000", 52 / 100 == 520 / 1000, True)
key = 470
tick = 10
pool = {
    47: 470 // 10,                       # read as a 0-100 line
    407: 400 + (470 - 400) // tick,      # tens ticks read as ones
    430: 500 - (470 - 400),              # seven ticks counted back from 500
    480: 400 + ((470 - 400) // tick + 1) * tick,  # ticks counted, not spaces
    500: round(470, -2),                 # nearest hundred tick read
    570: 470 + 100,                      # hundreds counted from the first tick after 0
}
for k, v in pool.items():
    chk(f"pool value {k} from its rule", v, k)
below = sum(v < key for v in pool)
above = sum(v > key for v in pool)
chk("pool sides (below, above) -> key rank rotates", (below, above), (3, 3))
chk("pool values all different from the key and each other", len(set(pool) | {key}), 7)
present("U01 L7 pool", row(G2, "### G2-U01", "L7"), "Key 470: three below, three above")
present("U01 L7 row", row(G2, "### G2-U01", "L7"), "the next ten after 538 → 548")

print("== Proposal 5 / 6: G2-U02 noun lines")
chk("U02 L4 example 453 + 281, tens 5 + 8", (453 // 10) % 10 + (281 // 10) % 10, 13)
chk("U02 L5 example 487 + 365, ones 7 + 5", 7 + 5, 12)
chk("§4.1 line 8 ones + 8 ones", 8 + 8, 16)
present("§4.1 noun line", G2, "\"8 ones and 8 ones make 16 ones; 16 ones are 1 ten and 6 ones\"")

print("== Proposal 7: G2-U02 L6 tens first inside the ones column")
ones = [1, 8, 8, 9]  # 21 + 18 + 38 + 19
chk("ones digits of 21, 18, 38, 19", [21 % 10, 18 % 10, 38 % 10, 19 % 10], ones)
chk("1 + 9", 1 + 9, 10)
chk("8 + 8", 8 + 8, 16)
chk("10 + 16 = ones total", 10 + 16, sum(ones))
chk("sum 21 + 18 + 38 + 19", 21 + 18 + 38 + 19, 96)
present("U02 L6 row", row(G2, "### G2-U02", "L6"), "1 and 9 make 10 ones, 8 and 8 make 16 ones, 10 ones and 16 ones make 26 ones")

print("== Proposal 10: G2-U02 L7 and G2-U04 L7 routes, G2-U04 L1 count up")
chk("359 + 41", 359 + 41, 400)
chk("59 + 41 make a hundred", 59 + 41, 100)
chk("359 + 241", 359 + 241, 600)
chk("'ones make a ten: write 0, forget it' on 359 + 241", ones_ten_zero_forgotten(359, 241), 590)
chk("120 + 130 as tens", (12 + 13, (12 + 13) * 10, 120 + 130), (25, 250, 250))
chk("500 - 359", 500 - 359, 141)
chk("count-up jumps 359 -> 400 -> 500", (400 - 359, 500 - 400, 41 + 100), (41, 100, 141))
chk("smaller from larger on 500 - 359", sfl(500, 359), 259)
chk("91 - 87", 91 - 87, 4)
chk("count up 87 -> 90 -> 91", (90 - 87, 91 - 90), (3, 1))
chk("smaller from larger on 91 - 87", sfl(91, 87), 16)
present("U02 L7", row(G2, "### G2-U02", "L7"), "359 + 241 → 590")
present("U04 L7", row(G2, "### G2-U04", "L7"), "500 − 359 → 259")
present("U04 L1", row(G2, "### G2-U04", "L1"), "91 − 87 → 16")

print("== Proposals 1 / 9: G2-U03 L2 and L6")
chk("L2 bond 356 + 175 = 531", 356 + 175, 531)
true_forms = {(356, "+", 175, 531), (175, "+", 356, 531), (531, "-", 356, 175), (531, "-", 175, 356)}
chk("four true forms with = last (two +, two -)", (len(true_forms), sum(f[1] == "+" for f in true_forms)), (4, 2))
chk("each true form holds", all((a + b == c) if op == "+" else (a - b == c) for a, op, b, c in true_forms), True)
chk("L6 821 - [] = 364 key", 821 - 364, 457)
chk("L6 check 821 - 457", 821 - 457, 364)
chk("L6 smaller from larger on 821, 364", sfl(821, 364), 543)
chk("L6 [] - 247 = 385 key", 247 + 385, 632)
chk("L6 check 632 - 247", 632 - 247, 385)
chk("L6 'subtract the two numbers I see' 385 - 247", 385 - 247, 138)
chk("L5 noun row 7 + 6 + 8 ones", 7 + 6 + 8, 21)
present("U03 L6 row", row(G2, "### G2-U03", "L6"), "□ − 247 = 385 → 138")
present("U03 L6 row", row(G2, "### G2-U03", "L6"), "821 − □ = 364 → 543")

print("== Proposals 5 / 11: G2-U04 noun lines")
chk("L3 452: 5 tens 2 ones = 4 tens 12 ones", 50 + 2 == 40 + 12, True)
chk("L4 528: 5 hundreds 2 tens = 4 hundreds 12 tens", 500 + 20 == 400 + 120, True)
chk("L4 needs a hundred opened (tens 2 < 6)", (528 // 10) % 10 < (263 // 10) % 10, True)
chk("L5 623: 2 tens 3 ones = 1 ten 13 ones", 20 + 3 == 10 + 13, True)
chk("L5 623 after the first trade: 6 hundreds 1 ten = 5 hundreds 11 tens", 600 + 10 == 500 + 110, True)
chk("L5 623 - 258", 623 - 258, 365)
chk("L6 300 = 30 tens = 29 tens + 10 ones", (300 // 10, 290 + 10), (30, 300))
chk("L2 574 - 231 (whole on top)", 574 - 231, 343)

print("== Proposal 4: bars within 20 / 100 first (U05 L1-L2, U06 L1)")
chk("U05 L1 8 + 5", 8 + 5, 13)
chk("U05 L2 43 + 26", 43 + 26, 69)
chk("U05 L2 236 + 148", 236 + 148, 384)
chk("U06 L1 12 - 7", 12 - 7, 5)
chk("U06 L1 64 - 38", 64 - 38, 26)

print("== Proposals 3 / 6: probe F and W rows (GRADE-2 §0.2)")
F = [(7, 5), (9, 4)]
chk("F sums", [a + b for a, b in F], [12, 13])
chk("F: both cross ten (ones total in the teens)", all(10 <= a + b <= 19 for a, b in F), True)
W = [(42, 35), (29, 36), (139, 284)]
chk("W sums", [a + b for a, b in W], [77, 65, 423])
chk("W ladder trades (no / one / two)", [trades(a, b) for a, b in W], [0, 1, 2])
P = [86, 95, 22, 25, 255, 237, 365, 357, 579, 583, 92, 84]
answers = [12, 13, 77, 65, 423] + P
chk("seventeen probe answers, all different", (len(answers), len(set(answers))), (17, 17))
chk("no P6 answer within 1 of a W answer", any(abs(p - w) <= 1 for p in (92, 84) for w in (77, 65, 423)), False)
present("F row", G2, "| F | **facts that cross ten**")
present("W row", G2, "42 + 35 (no trade, 77) → 29 + 36 (one trade, 65) | 139 + 284 (two trades, 423)")

print("== Counts (CURRICULUM-MAP §3, GRADE-2 §2)")
u = {}
for m in re.finditer(r"^\| (G2-U\d\d) \|[^\n]*?\| (\d+)(?: \(\+1 stretch\)| \+ S1)? \|", CM, re.M):
    u[m.group(1)] = int(m.group(2))
chk("CURRICULUM-MAP Grade 2 unit lesson counts sum", sum(u.values()), 71)
chk("U01, U03 counts", (u.get("G2-U01"), u.get("G2-U03")), (7, 6))
present("map header", CM, "## 3. Grade 2 — 14 units, 71 lessons")
present("GRADE-2 header", G2, "# GRADE 2 — school-math (14 units, 71 lessons)")
lessons = {}
for unit in ("G2-U01", "G2-U02", "G2-U03", "G2-U04", "G2-U05", "G2-U06", "G2-U07", "G2-U08", "G2-U09",
             "G2-U10", "G2-U11", "G2-U12", "G2-U13", "G2-U14"):
    i = G2.index("### " + unit)
    j = G2.find("**Entry check", i)
    lessons[unit] = len(re.findall(r"^\| L\d+[ `]", G2[i:j], re.M))
chk("GRADE-2 lesson rows counted per unit (sum)", sum(lessons.values()), 71)
chk("GRADE-2 lesson rows U01 / U03", (lessons["G2-U01"], lessons["G2-U03"]), (7, 6))

print("== METHOD-LEDGER rows and link sentences")
for r in ("A12", "A13", "B18"):
    line = next(l for l in ML.split("\n") if l.startswith(f"| {r} |"))
    link = line.rstrip(" |").split(" | ")[-1]
    chk(f"{r} link sentence carries no number", bool(re.search(r"\d", link)), False)

print("== Reuse rule (CURRICULUM-MAP §7.12) for the new lesson numbers")
new_u01 = {380, 38, 50, 70, 120, 246, 624, 628, 600, 28, 500, 128, 620, 608, 626, 470, 47, 407,
           430, 480, 570, 52, 520, 538, 530, 540, 548, 250}
new_other = {359, 241, 41, 590, 130, 25, 141, 259, 91, 87, 16, 821, 364, 457, 543, 247, 385, 632,
             138, 43, 26, 69, 64, 21, 405, 139, 284, 423, 42, 35, 77}
mock_keys = {93, 98, 903, 256, 798, 804, 361, 743, 170, 210}
ck_keys = {81, 112, 844, 697, 843, 62, 792, 266, 402, 169, 88, 369}
probe = {65, 75, 86, 95, 22, 25, 255, 237, 365, 357, 579, 583, 92, 84, 541, 612, 643, 524, 286,
         375, 278, 167, 264, 315, 266, 317}
small_ok = lambda v: v < 10
chk("no check / mock key is a new lesson number",
    sorted(v for v in (mock_keys | ck_keys) & (new_u01 | new_other) if not small_ok(v)), [])
# 25 tens (a count of tens in a route, U02 L7) is the probe's P2(b) key 25 as a working value:
# allowed (the probe is not a check), listed for the record
print("  note: new lesson numbers equal to a probe value (lesson vs probe is not restricted):",
      sorted((new_u01 | new_other) & probe))
rv_nums = {int(x.replace(",", "")) for x in re.findall(r"\d[\d,]*", RV)}
round_ok = lambda v: v < 10 or (v % 100 == 0 and v <= 1000)
clash = sorted(v for v in new_u01 & rv_nums if not round_ok(v))
chk("no new G2-U01 lesson number is a number of the 2-day review (round hundreds exempt)", clash, [])

print("== Exam-value list (read from EXAM-READING.md at run time)")
sec = ER[ER.index("## Exam values for the no-exam-items gate"):]
vals = set()
for l in (l for l in sec.splitlines() if l.startswith("- Q")):
    body = l.split(":", 1)[1]
    for m in re.finditer(r"\d+", body):
        if "□" in body[max(0, m.start() - 1):m.end() + 1]:
            continue
        v = int(m.group(0))
        if v >= 10:
            vals.add(v)
his = {515, 426, 839, 700, 800}
print("  list values (>= 10):", sorted(vals))
tier1 = sorted(v for v in vals | his if v >= 100 and v % 100 != 0)
tier2 = sorted(vals | his)
WB = lambda v: re.compile(r"(?<![\d,.A-Za-z-])" + str(v) + r"(?![\d,])")

print("== Tier 1 (three-digit list values, round hundreds excepted): every changed file")
changed = {
    "GRADE-2.md": G2, "GRADE-1.md": G1, "DESIGN-DEFAULTS.md": DD, "CURRICULUM-MAP.md": CM,
    "EXAM-COVERAGE.md": EC, "METHOD-LEDGER.md": ML, "G2-U01-REVIEW-2DAY.md": RV,
    "meta/LICENCE-LOG.md": LL,
    "EVIDENCE-LEDGER-FINAL.md (P3.1 block)": LG[LG.index("## Post-freeze revision P3.1"):],
    "IMPROVEMENTS-FROM-R5.md (Applied section)": IM[IM.index("## Applied (2026-11-18)"):] if "## Applied (2026-11-18)" in IM else "",
}
t1hits = 0
for name, txt in changed.items():
    hits = sorted({v for v in tier1 if WB(v).search(txt)})
    t1hits += len(hits)
    print(f"  {name}: {hits if hits else 'none'}")
chk("tier-1 hits in changed files", t1hits, 0)

print("== Tier 2 (every list value) over the changed rows and new text")
# Allowed contexts (EXAM-COVERAGE §4 'not restricted': working values, the step 100, range words).
ALLOW = [
    (100, "jumps of 44, 100 and 31", "pre-existing U03 L2: a jump of 100 (step size)"),
    (100, "jumps of 100, 70 and 5", "pre-existing U03 L2: a jump of 100 (step size)"),
    (100, "say 100 as ten tens", "pre-existing U01 L2: place word (§4 'ten tens is 100')"),
    (100, "within 100", "range word (§4 'within 100')"),
    (100, "0–100 line", "range word: the label of a 0 to 100 line (R5 C12 bridge), never an operand, key or choice"),
    (100, "nearest 10 / 100", "place word in a sister-module description (METHOD-LEDGER A13)"),
]
targets = []
for unit, labels in (("### G2-U01", ["L2", "L3", "L6", "L7"]), ("### G2-U02", ["L3", "L4", "L5", "L6", "L7"]),
                     ("### G2-U03", ["L2", "L3", "L5", "L6"]),
                     ("### G2-U04", ["L1", "L2", "L3", "L4", "L5", "L6", "L7"]),
                     ("### G2-U05", ["L1", "L2"]), ("### G2-U06", ["L1"]), ("### G2-U07", ["L2", "L3", "L4"])):
    for lab in labels:
        targets.append((f"GRADE-2 {unit[4:10]} {lab}", row(G2, unit, lab)))
for prefix in ("**Entry check G2-U02-EC**", "**Entry check G2-U04-EC**", "| F |", "| W |",
               "**Three lessons added from R5", "**A lesson day's anatomy** (N = 8; DD1) `",
               "**A lesson day's anatomy** (N = 8; DD1): two", "- **Story routine (DD17",
               "- **Home note per unit"):
    i = G2.index(prefix)
    j = G2.find("\n\n", i)
    if prefix.startswith("| "):
        j = G2.find("\n", i)
    if prefix.startswith("- **"):
        j = G2.find("\n- **", i + 3)
    targets.append(("GRADE-2 " + prefix[:28], G2[i:j]))
i = G2.index("Every column is said with its **unit noun**")
targets.append(("GRADE-2 §4.1 noun/fade lines", G2[i:G2.index("**Guided progression**", i)]))
i = G2.index("On one or two days of the unit, that last item")
targets.append(("GRADE-2 §4.1 preview", G2[i:G2.find("\n\n", i)]))
for r in ("A12", "A13", "B18"):
    targets.append(("METHOD-LEDGER " + r, next(l for l in ML.split("\n") if l.startswith(f"| {r} |"))))
for prefix in ("- **Lesson-day anatomy**", "**Two kinds of check, named**", "**Warm block**",
               "- **Note: one bar or two", "- **Cross-reference (2026-11-18", "**Story routine, Grades 1–2**",
               "**Terms added 2026-11-18**", "**Default preview in Grade 2 autumn**",
               "- **Parent page per unit: a four-part home note**"):
    i = DD.index(prefix)
    j = DD.find("\n- **", i + 3)
    targets.append(("DESIGN-DEFAULTS " + prefix[:26], DD[i:j]))
i = RV.index("**Lessons added after this review")
targets.append(("REVIEW-2DAY note", RV[i:RV.find("\n\n", i)]))
targets.append(("LICENCE-LOG", LL))
t2bad = 0
for name, txt in targets:
    for v in tier2:
        for m in WB(v).finditer(txt):
            ctx = txt[max(0, m.start() - 30):m.end() + 12].replace("\n", " ")
            ok = next((why for av, s, why in ALLOW if av == v and s in txt[max(0, m.start() - 40):m.end() + 40]), None)
            if ok:
                print(f"  allowed  {name}: {v}  …{ctx}…  [{ok}]")
            else:
                t2bad += 1
                print(f"  HIT      {name}: {v}  …{ctx}…")
chk("tier-2 hits not allowed", t2bad, 0)

print(f"\nTOTAL checks {N}, mismatches {BAD}")
