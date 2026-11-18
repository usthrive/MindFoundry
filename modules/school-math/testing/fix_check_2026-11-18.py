"""Fix check for TEACHER-RUN-2026-11-18 (curriculum FIXes + applied NOTEs).

Recomputes every changed key and every "wrong answer <- rule" value, confirms each stated
string is present in the curriculum file, runs the exam-value gate (list read at run time
from EXAM-READING.md's "Exam values for the no-exam-items gate" section) over the tier-2
surfaces, and the tier-1 scan over the whole curriculum folder.
Run: python3 -I fix_check_2026-11-18.py
"""
import itertools
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(ROOT, "design", "curriculum")
G2 = open(os.path.join(CUR, "GRADE-2.md"), encoding="utf-8").read()
G4 = open(os.path.join(CUR, "GRADE-4.md"), encoding="utf-8").read()
EC = open(os.path.join(CUR, "EXAM-COVERAGE.md"), encoding="utf-8").read()
MM = open(os.path.join(CUR, "METHODOLOGY-MODEL.md"), encoding="utf-8").read()
RV = open(os.path.join(CUR, "G2-U01-REVIEW-2DAY.md"), encoding="utf-8").read()
ER = open(os.path.join(ROOT, "research", "phase0", "EXAM-READING.md"), encoding="utf-8").read()

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


def digits(n):
    return [int(c) for c in str(n)]


def sfl(a, b):
    """smaller digit from larger in each column (3-digit or 2-digit)"""
    w = max(len(str(a)), len(str(b)))
    da, db = str(a).zfill(w), str(b).zfill(w)
    return int("".join(str(abs(int(x) - int(y))) for x, y in zip(da, db)))


def left_aligned(top, *others):
    """add with shorter numbers written under the LEFT of the top number, no carry between
    columns beyond normal addition of the shifted values"""
    w = len(str(top))
    total = top
    for o in others:
        total += o * 10 ** (w - len(str(o)))
    return total


print("== FIX 1 mock A1 (EXAM-COVERAGE §2)")
a, b = 34, 59
chk("key 34+59", a + b, 93)
chk("43 only the ones of 59 added", a + 9, 43)
chk("48 tens digit of 59 added as ones", a + 5 + 9, 48)
chk("83 new ten lost (ones 13 -> 3, tens 3+5)", (3 + 5) * 10 + (4 + 9) % 10, 83)
chk("95 rounded 59 up to 60, then +1 not -1", a + 60 + 1, 95)
chk("103 extra ten", a + b + 10, 103)
chk("813 tens total then ones total", int(f"{3+5}{4+9}"), 813)
pool = [43, 48, 83, 95, 103, 813]
chk("pool sides (below, above)", (sum(p < 93 for p in pool), sum(p > 93 for p in pool)), (3, 3))
chk("worked route 34+50+9", 34 + 50 + 9, 93)
present("A1 row", EC, "Add mentally: 34 + 59 = □. Choices (one draw, ascending for reading) 48 · 93 · 95 · 103")
chk("A1 draw values are pool values or key", all(v in pool + [93] for v in (48, 93, 95, 103)), True)

print("== FIX 2 G2-U02 L3")
chk("358+126", 358 + 126, 484)
chk("forget the ten", 400 + 70 + 4, 474)
chk("ones 8+6", 8 + 6, 14)
present("U02 L3", G2, "358 + 126 → 474")

print("== FIX 4 G2-U03 L5")
chk("47+6+8", 47 + 6 + 8, 61)
chk("6 and 8 under the 4 (tens): left aligned", left_aligned(47, 6, 8), 187)
chk("tens 4+6+8", 4 + 6 + 8, 18)
present("U03 L5", G2, "47 + 6 + 8 written with the 6 and 8 under the 4 → 187")

print("== FIX 5 G2-U04 L1")
chk("82-45", 82 - 45, 37)
chk("jumps 82 -> 42 -> 37", (82 - 40, 82 - 40 - 5), (42, 37))
chk("smaller digit from larger", sfl(82, 45), 43)
chk("stopped after the tens jump", 82 - 40, 42)
chk("the two rule values differ", sfl(82, 45) != 82 - 40, True)
chk("open a ten 12-5", 12 - 5, 7)
present("U04 L1", G2, "82 − 45 → 43")

print("== FIX 7 + NOTE 17 probe W and P6")
W = [(29, 36), (47, 28)]
P6 = [(64, 28), (58, 26)]
chk("W(a) 29+36", sum(W[0]), 65)
chk("W(b) 47+28", sum(W[1]), 75)
chk("W one carry each (ones >= 10)", [(x % 10 + y % 10) >= 10 for x, y in W], [True, True])
chk("P6(a) 64+28", sum(P6[0]), 92)
chk("P6(b) 58+26", sum(P6[1]), 84)
probe_answers = [65, 75, 86, 95, 22, 25, 255, 237, 365, 357, 579, 583, 92, 84]
chk("P1(a) 38+19+13+16", 38 + 19 + 13 + 16, 86)
chk("P1(b) 19+28+36+12", 19 + 28 + 36 + 12, 95)
chk("P3 541-286, 612-375", (541 - 286, 612 - 375), (255, 237))
chk("P4 643-278, 524-167", (643 - 278, 524 - 167), (365, 357))
chk("P5 wholes", (264 + 315, 266 + 317), (579, 583))
chk("probe's fourteen answers all different", len(set(probe_answers)), 14)
chk("no P6 answer within 1 of a W answer", any(abs(sum(p) - sum(w)) <= 1 for p in P6 for w in W), False)
chk("W(a) key is not U02 L1's worked key 83", sum(W[0]) != 47 + 36, True)
present("W row", G2, "| W | warm, not a pair | 29 + 36 | 47 + 28 |")
present("P6 row", G2, "64 + 28 \"in your head\" → 92 | 58 + 26 → 84")

print("== FIX 8 G2-U01 L5")
chk("695+10", 695 + 10, 705)
chk("digits changed 695 -> 705", sum(x != y for x, y in zip("695", "705")), 2)
chk("rule 'add to tens digit and stop'", 605, 600 + 0 + 5)
present("U01 L5 explain", G2, "\"Which digits changed? Why did the hundreds change too?\"")

print("== FIX 9 G2-U02-CK A3 and FIX 10 / 11 wording")
sums = [(345, 231), (362, 254), (347, 226), (376, 258), (645, 432)]


def new_units(a, b):
    ten = (a % 10 + b % 10) >= 10
    c = 1 if ten else 0
    hund = ((a // 10) % 10 + (b // 10) % 10 + c) >= 10
    return ten, hund


fits = [s for s in sums if new_units(*s) == (False, True)]
chk("only one sum makes a new hundred and no new ten", fits, [(362, 254)])
chk("376+258 makes both", new_units(376, 258), (True, True))
chk("645+432 makes neither a new ten nor a new hundred", new_units(645, 432), (False, False))
for line in ("Which sum makes a new hundred?", "It makes no new ten.",
             "In which subtraction must you open a hundred?"):
    chk(f"words in «{line}» <= 10", len(line.split()) <= 10, True)
present("A3 read aloud", G2, "«Which sum makes a new hundred? It makes no new ten.»")
present("U02 L4", G2, "T1 «Which sum makes a new hundred?»")
present("U04 L4", G2, "T1 «In which subtraction must you open a hundred?»")
chk("U04 L4 example 528-263 needs a hundred opened (tens 2 < 6)", (528 // 10) % 10 < (263 // 10) % 10, True)
chk("528-263", 528 - 263, 265)

print("== FIX 12 G2-U01 L3 three-part bond")
chk("471 = 400+70+1", 400 + 70 + 1, 471)
chk("605 three parts", [600, 0, 5], [605 // 100 * 100, (605 // 10) % 10 * 10, 605 % 10])
chk("skip-zero rule 600+50", 600 + 50, 650)
present("U01 L3", G2, "605 = 600 + 0 + 5: the tens part takes 0")
present("METHODOLOGY N-F1", MM, "**Three-part form** (expanded form only, first used G2-U01 L3)")
present("METHODOLOGY N-I2", MM, "a 0 part must be typed as 0 (605 = 600 + 0 + 5)")
present("review D1-Q3 points to METHODOLOGY", RV, "(N-I2, three-part form: METHODOLOGY §6.1–6.2, N-F1 / N-I2)")

print("== FIX 13 G2-U04 L7")
chk("900-486 exact", 900 - 486, 414)
chk("486 to nearest ten", round(486, -1), 490)
chk("estimate 900-490", 900 - 490, 410)
present("U04 L7", G2, "900 − 486 estimated as 900 − 490 = 410")

print("== FIX 14 G2-U02 L2")
chk("324+51", 324 + 51, 375)
chk("51 under 32 (line up on the left)", left_aligned(324, 51), 834)
chk("no regroup in 324+51", all(x + y < 10 for x, y in zip(digits(324)[::-1], digits(51)[::-1])), True)
present("U02 L2", G2, "324 + 51 → 834")

print("== FIX 15 G2-U01 L1")
chk("399 + 1", 399 + 1, 400)
chk("rule 'ten tens written 100 after the 3'", int("3" + str(99 + 1)), 3100)
present("U01 L1", G2, "399, count on by 1 → 3100")

print("== NOTEs applied")
chk("#16 45+8 is more than 52", 45 + 8 > 52, True)
present("#16", G2, "\"45 + 8 is already more than 52\"")
chk("#19 A2 key 34+37+16+25", 34 + 37 + 16 + 25, 112)
chk("#19 113 = ones mis-added to 23, carry 2", (3 + 3 + 1 + 2 + 2) * 10 + 3, 113)
chk("#19 tens before carry", 3 + 3 + 1 + 2, 9)
pool2 = [87, 92, 102, 113, 122, 922]
chk("#19 A2 pool sides", (sum(p < 112 for p in pool2), sum(p > 112 for p in pool2)), (3, 3))
chk("#19 87 = 34+37+16", 34 + 37 + 16, 87)
chk("#19 102 carry 1", (9 + 1) * 10 + 2, 102)
chk("#19 122 carry 3", (9 + 3) * 10 + 2, 122)
present("#20", G2, "It gets 179 more books.")
chk("#20 C7 268+345+179", 268 + 345 + 179, 792)
chk("#22 biggest digit picks 291; ones first pick 436; true greater 436",
    (max((291, 436), key=lambda n: max(digits(n))), max((291, 436), key=lambda n: n % 10), max(291, 436)),
    (291, 436, 436))
chk("#24 ten-frames: 54 = 5 full frames and 4", divmod(54, 10), (5, 4))
chk("#24 54-38", 54 - 38, 16)
chk("#25 count-up 356 -> 400 -> 500 -> 531", (400 - 356, 500 - 400, 531 - 500, 44 + 100 + 31), (44, 100, 31, 175))
chk("#25 other route 356 -> 456 -> 526 -> 531", (356 + 100, 456 + 70, 526 + 5), (456, 526, 531))
present("#26", G2, "then add back the number you took away")
chk("#26 574-231 and check", (574 - 231, 343 + 231), (343, 574))

print("== Gate-driven renumbering (G4-U03)")
S, D = 86, 18
chk("G4-U03 L4 (86-18)/2", (S - D) // 2, 34)
chk("G4-U03 L4 larger", (S - D) // 2 + D, 52)
chk("G4-U03 L4 check both clues", (34 + 52, 52 - 34), (86, 18))
chk("G4-U03 L4 rule: 18 and 68 add to 86, differ by", (18 + 68, 68 - 18), (86, 50))
S, D = 94, 16
chk("G4-U03-CK B6 94-16", S - D, 78)
chk("G4-U03-CK B6 78/2", 78 // 2, 39)
chk("G4-U03-CK B6 larger", 39 + 16, 55)
chk("G4-U03-CK B6 check", (39 + 55, 55 - 39), (94, 16))
chk("G4-U03-CK B6 '78 and 16 differ by'", 78 - 16, 62)
chk("G4-U03-CK B6 key is not CK A3's", 39 not in (32, 51) and 55 not in (32, 51), True)
chk("G4-U03 L4 values are not CK keys", not ({34, 52} & {32, 51, 39, 55}), True)
present("G4 L4", G4, "(86 − 18) ÷ 2 = 34 → 34 and 52")
present("G4 B6", G4, "**78 ÷ 2 = 39** and 39 + 16 = **55**")

print("== Reuse rule (EXAM-COVERAGE §4): check/mock keys vs new lesson and probe numbers")
mock_keys = {93, 98, 903, 256, 798, 804, 361, 743, 170, 210}
ck_keys = {81, 112, 844, 697, 843, 62, 792}
new_lesson_nums = {375, 834, 324, 51, 358, 126, 484, 474, 47, 61, 187, 82, 45, 42, 37, 43,
                   900, 486, 490, 410, 414, 44, 31, 400, 500, 291, 436}
chk("no mock key is a new lesson number", sorted(mock_keys & new_lesson_nums), [])
chk("no U02-CK key is a new lesson number", sorted(ck_keys & new_lesson_nums), [])
chk("no mock / CK key is a probe answer", sorted((mock_keys | ck_keys) & set(probe_answers)), [])

print("== Exam-value list (read from EXAM-READING.md at run time)")
sec = ER[ER.index("## Exam values for the no-exam-items gate"):]
sec_lines = [l for l in sec.splitlines() if l.startswith("- Q")]
vals = set()
for l in sec_lines:
    body = l.split(":", 1)[1]
    for m in re.finditer(r"\d+", body):
        if "□" in body[max(0, m.start() - 1):m.end() + 1]:
            continue  # a digit-box numeral (e.g. 43□) is not a value; its whole is listed
        v = int(m.group(0))
        if v >= 10:
            vals.add(v)
his = {515, 426, 839, 700, 800}  # his written answers (reading table), checked with the list
print("  list values (>= 10):", sorted(vals))
must = {56, 60, 66, 67, 523, 73, 63, 53, 17, 23, 27, 127, 49, 15, 14, 173, 197, 355, 455, 240, 24, 810, 100}
chk("list holds Q1/Q2/Q3 printed choices and Q6/Q7 values", sorted(must - vals), [])
tier1 = sorted(v for v in vals | his if v >= 100 and v % 100 != 0)
tier2 = sorted(vals | his)
print("  tier 1 (three-digit, not round hundreds):", tier1)

WB = lambda v: re.compile(r"(?<![\d,.A-Za-z-])" + str(v) + r"(?![\d,])")  # not E240, T17, 3,523

print("== Tier 1 scan, every file of the curriculum folder (word-bounded, numbers as written)")
for fn in sorted(os.listdir(CUR)):
    if not fn.endswith(".md"):
        continue
    txt = open(os.path.join(CUR, fn), encoding="utf-8").read()
    hits = sorted({v for v in tier1 if WB(v).search(txt)})
    if hits:
        print(f"  {fn}: {hits}")


def rows_between(text, start, stop_prefix=None, row_prefixes=None):
    L = text.split("\n")
    i = next(k for k, l in enumerate(L) if l.startswith(start))
    out = []
    for k in range(i + 1, len(L)):
        l = L[k]
        if stop_prefix and any(l.startswith(p) for p in stop_prefix):
            break
        if l.startswith("| ") and not l.startswith("| Lesson") and not l.startswith("| #") \
                and not l.startswith("| §") and not l.startswith("|---"):
            lab = l.split("|")[1].strip()
            if row_prefixes is None or any(lab.startswith(p) for p in row_prefixes):
                out.append((k + 1, lab, l))
    return out


def scan(name, rows):
    for n, lab, l in rows:
        hits = []
        for v in tier2:
            for m in WB(v).finditer(l):
                # skip format codes like T17 / L15 / E124 / N-I1 and dates / times
                pre = l[max(0, m.start() - 1):m.start()]
                if pre.isalpha() or pre == "-":
                    continue
                hits.append((v, l[max(0, m.start() - 28):m.end() + 10].replace("\n", " ")))
        if hits:
            for v, ctx in hits:
                print(f"  {name} :{n} [{lab[:12]}] {v}  …{ctx}…")


print("== Tier 2 scan (hits listed for judgement; see the fix log for each verdict)")
scan("GRADE-2 probe", rows_between(G2, "### §0.2", ["**What the probe"]))
for u in ("### G2-U01", "### G2-U02", "### G2-U03", "### G2-U04"):
    scan("GRADE-2 " + u[4:10], rows_between(G2, u, ["### ", "**Entry check"]))
scan("GRADE-2 G2-U02-CK", rows_between(G2, "**Chapter check G2-U02-CK**", ["Parent view"]))
scan("GRADE-2 U05 L3/L5", rows_between(G2, "### G2-U05", ["**Entry check"], ["L3", "L5"]))
scan("GRADE-2 U06", rows_between(G2, "### G2-U06", ["**Entry check"]))
scan("GRADE-2 U07 L4/S1", rows_between(G2, "### G2-U07", ["**Entry check"], ["L4", "**S1"]))
scan("GRADE-2 U13 L5", rows_between(G2, "### G2-U13", ["**Entry check"], ["L5"]))
scan("GRADE-2 G2-U05-CK", rows_between(G2, "**Chapter check G2-U05-CK**", ["Parent view", "### "]))
scan("GRADE-4 G4-U03 L4", rows_between(G4, "### G4-U03", ["**Entry check"], ["L4"]))
scan("GRADE-4 G4-U03-CK A3/B6", rows_between(G4, "**Chapter check G4-U03-CK**", ["Parent view", "### "], ["A3", "B6"]))
scan("EXAM-COVERAGE mock", rows_between(EC, "| § · pts |", ["**Point check"]))
rv_lines = [(k + 1, "review", l) for k, l in enumerate(RV.split("\n"))]
scan("REVIEW-2DAY", rv_lines)

print(f"\nTOTAL checks {N}, mismatches {BAD}")
