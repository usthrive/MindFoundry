#!/usr/bin/env node
/* test_prep_check.js — checks the generators of design/experience/TEST-PREP-SUBTRACTION.html.
   Loads the page's window-free generator block (<script id="gen">) in Node, draws 2,000 items per
   generator across seeds, and asserts: the key equals the answer computed here; the trade type
   matches the generator's promise; no exam value is an operand, key, choice or shown wrong answer;
   every rule-made wrong value differs from the key (and equals the named rule, re-implemented here);
   for multiple choice, no numeric rank and no displayed place holds the key on more than 40 % of draws.
   Also: every fixed item copied from G2-U01-REVIEW-2DAY.md, by computing its answer; every session's
   item count; sentence length; hints and read-aloud lines never state the key.
   Run: node testing/test_prep_check.js  (output also saved to testing/test_prep_check.out.txt) */
"use strict";
var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var PAGE = path.join(ROOT, "design/experience/TEST-PREP-SUBTRACTION.html");
var EXAM_READING = path.join(ROOT, "research/phase0/EXAM-READING.md");
var OUT = path.join(__dirname, "test_prep_check.out.txt");
var N_DRAWS = 2000;

var lines = [], fails = 0, checks = 0;
function log(s) { lines.push(s); console.log(s); }
var failKinds = {};
function ok(cond, what) {
  checks += 1;
  if (!cond) {
    fails += 1;
    var kind = String(what).replace(/#\d+|c\d+|Q\d+|\d+/g, "#");
    failKinds[kind] = (failKinds[kind] || 0) + 1;
    if (fails <= 40) log("  FAIL: " + what);
  }
  return cond;
}

/* ---------- load the generator block ---------- */
var html = fs.readFileSync(PAGE, "utf8");
var m = html.match(/<script id="gen">([\s\S]*?)<\/script>/);
if (!m) { console.error("no <script id=\"gen\"> block"); process.exit(2); }
if (/\bwindow\b|\bdocument\b/.test(m[1].replace(/\/\*[\s\S]*?\*\//g, ""))) { console.error("generator block touches window/document"); process.exit(2); }
var GEN = new Function(m[1] + "\nreturn GEN;")();

/* ---------- the exam values, read from EXAM-READING.md ---------- */
var er = fs.readFileSync(EXAM_READING, "utf8");
var sec = er.split(/## Exam values for the no-exam-items gate/)[1] || "";
var listed = {};
sec.split("\n").filter(function (l) { return /^- Q/.test(l); }).forEach(function (l) {
  l.replace(/^- Q\d+[ab]?:/, "").replace(/Q5b:/g, "").split(/[^0-9□]+/).forEach(function (tok) {
    if (!tok || tok.indexOf("□") >= 0) return;
    listed[+tok] = 1;
  });
});
/* his written answers from the reading table (Q2 63, Q3 23, Q4 615 and the erased 515, Q5b 413 + 426 = 839, Q7 100 and 700 = 800) */
[63, 23, 615, 515, 413, 426, 839, 100, 700, 800].forEach(function (v) { listed[v] = 1; });
var EXAM = {};
Object.keys(listed).forEach(function (k) { EXAM[k] = 1; });
function isExam(v) { return EXAM[v] === 1; }

/* ---------- independent arithmetic (written here, not copied from the page) ---------- */
function digits(n) { return [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10]; }
function kindOf(a, b) {
  /* do the column the long way and record which places had to be opened */
  var A = digits(a), B = digits(b), openedTen = false, openedHundred = false;
  if (A[2] < B[2]) { openedTen = true; A[2] += 10; A[1] -= 1; }
  if (A[1] < B[1]) { openedHundred = true; A[1] += 10; A[0] -= 1; }
  return openedTen && openedHundred ? "both" : openedTen ? "ones" : openedHundred ? "tens" : "none";
}
function finalTops(a, b) {
  var A = digits(a), B = digits(b);
  if (A[2] < B[2]) { A[2] += 10; if (A[1] === 0) { A[1] = 9; A[0] -= 1; } else A[1] -= 1; }
  if (A[1] < B[1]) { A[1] += 10; A[0] -= 1; }
  return A;
}
var RULE = {
  sfl: function (a, b) { var A = digits(a), B = digits(b); return A.reduce(function (s, d, i) { return s + Math.abs(d - B[i]) * [100, 10, 1][i]; }, 0); },
  noReduce: function (a, b) { var A = digits(a), B = digits(b), s = 0; for (var i = 0; i < 3; i++) s += (A[i] >= B[i] ? A[i] - B[i] : A[i] + 10 - B[i]) * [100, 10, 1][i]; return s; },
  zero: function (a, b) {
    var A = digits(a), B = digits(b), out = [0, 0, 0];
    for (var i = 2; i >= 0; i--) {
      if (A[i] === 0 && B[i] > 0) out[i] = B[i];
      else if (A[i] >= B[i]) out[i] = A[i] - B[i];
      else if (i > 0 && A[i - 1] > 0) { A[i - 1] -= 1; out[i] = A[i] + 10 - B[i]; }
      else out[i] = B[i] - A[i];
    }
    return out[0] * 100 + out[1] * 10 + out[2];
  },
  add: function (a, b) { return a + b; },
  tenOnly: function (a, b) {
    var A = digits(a), B = digits(b), out = [0, 0, 0];
    for (var i = 2; i >= 0; i--) {
      if (A[i] >= B[i]) { out[i] = A[i] - B[i]; continue; }
      if (i === 2) { if (A[1] === 0) { A[0] -= 1; A[1] = 9; } else A[1] -= 1; } else A[0] -= 1;
      out[i] = 10 - B[i];
    }
    return out[0] * 100 + out[1] * 10 + out[2];
  },
  tenTwice: function (a, b) { return a - b - 10; },
  hundredTwice: function (a, b) { return a - b - 100; },
  tensAt10: function (a, b) { return a - b + 10; },
  stopTens: function (a, b) { return a - (b - b % 10); },
  onePast: function (a, b) { return a - b + 1; },
  oneShort: function (a, b) { return a - b - 1; }
};

/* ---------- text checks ---------- */
function wordsIn(sentence) { return sentence.split(/\s+/).filter(function (t) { return /[A-Za-z0-9]/.test(t); }).length; }
function longSentences(text) {
  if (!text) return [];
  return String(text).split(/(?<=[.?!])\s+/).filter(function (s) { return wordsIn(s) > 12; });
}
function hasNumber(text, n) { return new RegExp("(^|[^0-9,])" + n + "([^0-9]|$)").test(String(text)); }
function numbersIn(text) { return (String(text).match(/\d+/g) || []).map(Number); }

/* ---------- rank / place counters ---------- */
function Tally(name) { this.name = name; this.rank = [0, 0, 0, 0]; this.pos = [0, 0, 0, 0]; this.n = 0; this.numeric = false; }
Tally.prototype.add = function (rank, pos) { this.n += 1; if (rank !== null && rank !== undefined) { this.numeric = true; this.rank[rank] += 1; } this.pos[pos] += 1; };
Tally.prototype.report = function () {
  var self = this, maxR = Math.max.apply(null, this.rank) / this.n, maxP = Math.max.apply(null, this.pos) / this.n;
  ok(maxP <= 0.40, this.name + ": a displayed place holds the key on " + (100 * maxP).toFixed(1) + " % of draws");
  if (this.numeric) ok(maxR <= 0.40, this.name + ": a numeric rank holds the key on " + (100 * maxR).toFixed(1) + " % of draws");
  return "key place " + this.pos.map(function (c) { return (100 * c / self.n).toFixed(0) + "%"; }).join("/") +
    (this.numeric ? " · key rank (smallest→largest) " + this.rank.map(function (c) { return (100 * c / self.n).toFixed(0) + "%"; }).join("/") : "");
};

/* ---------- per-step checks used everywhere ---------- */
function stepAnswerNums(st) {
  if (st.type === "num" || st.type === "nl") return st.answer !== undefined ? [st.answer] : (st.landings || []);
  if (st.type === "col") return [st.answer];
  if (st.type === "nums" || st.type === "bond3") return st.answers;
  return [];
}
function checkItem(it, where, opts) {
  opts = opts || {};
  var exempt = {}; ((it.meta && it.meta.stepSizes) || []).forEach(function (v) { exempt[v] = 1; });
  var keys = [];
  if (it.meta && typeof it.meta.key === "number" && !it.meta.textChoices && !it.meta.decide) keys.push(it.meta.key);
  /* an add-back step asks for the start number, which is on screen by design */
  it.steps.forEach(function (st) { if (!st.addBack) stepAnswerNums(st).forEach(function (v) { keys.push(v); }); });
  /* sentences of at most 12 words */
  var texts = [it.prompt, it.say];
  it.steps.forEach(function (st) {
    texts.push(st.label, st.pre, st.post);
    (st.hints || []).forEach(function (t) { texts.push(t); });
    (st.rows || []).forEach(function (r) { texts.push(r.t); });
    (st.choices || []).forEach(function (c) { texts.push(typeof c === "string" ? c : c.t); });
    (st.diag || []).forEach(function (d) { texts.push(d.msg); });
  });
  texts.forEach(function (t) { longSentences(t).forEach(function (s) { ok(false, where + ": sentence over 12 words: " + s); }); });
  /* hints and the read-aloud line never state the key */
  it.steps.forEach(function (st) {
    var own = st.addBack ? [] : stepAnswerNums(st);
    (st.hints || []).forEach(function (hn) { own.concat(keys).forEach(function (k) { if (k >= 10) ok(!hasNumber(hn, k), where + ": hint states the key " + k + ": " + hn); }); });
    if (st.shape) { ok(!hasNumber(st.shape, it.meta.key) && numbersIn(st.shape).every(function (v) { return !isExam(v); }), where + ": shape hint shows the key or an exam value"); }
  });
  keys.forEach(function (k) { if (k >= 10) ok(!hasNumber(it.say, k), where + ": read-aloud line says the key " + k); });
  /* exam values: operands, keys, choices, shown wrong answers, and every number on the item's screen text */
  var fields = [].concat(it.meta.nums || [], it.meta.choices || [], it.meta.shown || [], it.meta.chips || [], keys);
  it.steps.forEach(function (st) {
    if (st.type === "col") fields.push(st.top, st.bottom, st.answer);
    if (st.type === "nl") fields.push(st.start, st.total || 0);
    if (st.type === "pick") st.choices.forEach(function (c) { if (typeof c.v === "number") fields.push(c.v); numbersIn(c.t).forEach(function (v) { fields.push(v); }); });
    if (st.type === "bar") st.chips.forEach(function (c) { if (/^\d+$/.test(c)) fields.push(+c); });
    if (st.type === "bond3") fields.push(st.whole);
    if (st.bond) { if (st.bond.whole) fields.push(st.bond.whole); st.bond.parts.forEach(function (p) { if (p) fields.push(p); }); }
    numbersIn(st.pre || "").concat(numbersIn(st.post || "")).forEach(function (v) { fields.push(v); });
  });
  numbersIn(it.prompt).forEach(function (v) { fields.push(v); });
  if (it.figure) { ["a", "b", "w"].forEach(function (k) { if (typeof it.figure[k] === "number") fields.push(it.figure[k]); }); if (it.figure.text) numbersIn(it.figure.text).forEach(function (v) { fields.push(v); }); }
  fields.forEach(function (v) { if (!exempt[v]) ok(!isExam(v), where + ": exam value " + v + " is an operand, key, choice or shown value"); });
  /* tier 1: a three-digit exam value (round hundreds aside) nowhere in any text */
  texts.forEach(function (t) { numbersIn(t || "").forEach(function (v) { if (v >= 100 && v <= 999 && v % 100 !== 0) ok(!isExam(v), where + ": three-digit exam value " + v + " in text"); }); });
  /* the page's own grader accepts the computed key and rejects every rule-made wrong value */
  it.steps.forEach(function (st, j) {
    if (st.ungraded || st.type === "nl" && st.mode === "on") return;
    var kv = GEN.keyValue(st);
    if (kv !== null) ok(GEN.grade(st, kv).right, where + " step " + (j + 1) + ": grader rejects the computed key");
    if (st.type === "col") {
      ok(GEN.marksRight(st, kv.m), where + ": marks key not accepted");
      var ft = finalTops(st.top, st.bottom), o = digits(st.top);
      ok(st.marks.every(function (mk, i) { return mk === (ft[i] !== o[i] ? String(ft[i]) : ""); }), where + ": regroup marks differ from the long-way column");
    }
    (st.diag || []).forEach(function (d) {
      ok(d.v !== st.answer, where + ": rule value equals the key (" + d.rule + ")");
      if (st.type === "col" || st.type === "num" || st.type === "nl") {
        var val = st.type === "col" ? { d: String(d.v).padStart(String(st.answer).length, "0").split(""), m: [] } : String(d.v);
        if (String(d.v).length === String(st.answer).length || st.type !== "col") ok(!GEN.grade(st, val).right, where + ": grader accepts a rule value");
      }
      if (RULE[d.rule] && it.meta.a !== undefined && st.type !== "num") ok(RULE[d.rule](it.meta.a, it.meta.b) === d.v, where + ": rule " + d.rule + " recomputed differently");
    });
  });
}

/* ================= 1. the exam list ================= */
log("TEST-PREP-SUBTRACTION generator check · " + new Date().toISOString());
log("page: " + path.relative(ROOT, PAGE));
log("");
log("1. Exam values");
var listedVals = Object.keys(EXAM).map(Number).sort(function (a, b) { return a - b; });
log("  read from EXAM-READING.md (+ his written answers): " + listedVals.length + " values: " + listedVals.join(", "));
listedVals.forEach(function (v) { ok(GEN.EXAM.indexOf(v) >= 0, "page's exam list lacks " + v); });
ok(GEN.isExam(17) && GEN.isExam(652) && !GEN.isExam(318), "page's isExam");
/* broken controls: the checks below must fail on bad fixtures */
var bc1 = new Tally("broken control (key always second)"); for (var z = 0; z < 100; z++) bc1.add(1, 1);
var maxPos = Math.max.apply(null, bc1.pos) / bc1.n;
ok(maxPos > 0.40, "broken control: a fixture with the key always shown second is not caught");
ok(isExam(267), "broken control: an exam operand (Q4's first addend) is not caught");
log("  page list covers every value; broken controls caught: key-always-second, exam operand");

/* ================= 2. generators, 2,000 draws each ================= */
log("");
log("2. Generators (" + N_DRAWS + " draws each, seeds 1.." + N_DRAWS + ")");
function seedR(i, salt) { return GEN.rngOf(GEN.seedFor(100 + salt, i)); }
var kindsPromise = { none: "none", ones: "ones", tens: "tens", both: "both", zero: "both" };
["none", "ones", "tens", "both", "zero"].forEach(function (kind, ki) {
  var bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var p = GEN.prob3(seedR(i, ki), kind), f0 = fails;
    ok(p.key === p.a - p.b, "prob3 " + kind + ": key");
    ok(kindOf(p.a, p.b) === kindsPromise[kind], "prob3 " + kind + ": trade type " + kindOf(p.a, p.b) + " for " + p.a + " − " + p.b);
    if (kind === "zero") ok(digits(p.a)[1] === 0, "prob3 zero: no zero in the tens of " + p.a);
    ok(p.a >= 100 && p.b >= 100 && p.key >= 100 && p.a <= 999, "prob3 " + kind + ": range");
    [p.a, p.b, p.key].forEach(function (v) { ok(!isExam(v), "prob3 " + kind + ": exam value " + v); });
    if (fails > f0) bad += 1;
  }
  log("  3-digit, " + (kind === "zero" ? "across zeros" : kind === "none" ? "no trade" : kind === "ones" ? "open a ten only" : kind === "tens" ? "open a hundred only" : "two trades") + ": " + (N_DRAWS - bad) + "/" + N_DRAWS + " draws clean");
});
(function () {
  var bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var p = GEN.prob2(seedR(i, 9)), f0 = fails, A = digits(p.a), B = digits(p.b);
    ok(p.key === p.a - p.b && p.a < 100 && p.b >= 10, "prob2: key/range");
    ok(A[2] < B[2], "prob2: does not cross a ten (" + p.a + " − " + p.b + ")");
    [p.a, p.b, p.key].concat(GEN.nlChips(p.a, p.b)).forEach(function (v) { ok(!isExam(v), "prob2: exam value " + v); });
    if (fails > f0) bad += 1;
  }
  log("  2-digit in the head, across a ten: " + (N_DRAWS - bad) + "/" + N_DRAWS + " draws clean");
})();
["part", "sub", "start"].forEach(function (type, ti) {
  var bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var p = GEN.probMissing(seedR(i, 20 + ti), type), f0 = fails;
    if (type === "part") { ok(p.a + p.key === p.c, "missing part: " + p.a + " + " + p.key + " ≠ " + p.c); ok(kindOf(p.c, p.a) !== "none", "missing part: no trade"); }
    if (type === "sub") { ok(p.c - p.key === p.d, "missing taken away: key"); ok(kindOf(p.c, p.d) !== "none", "missing taken away: no trade"); }
    if (type === "start") { ok(p.key - p.b === p.d, "missing start: key"); ok(digits(p.b)[2] + digits(p.d)[2] >= 10, "missing start: no carry"); }
    p.wrong.forEach(function (w) {
      ok(w.v !== p.key, "missing " + type + ": rule value equals key");
      var known = type === "part" ? p.a : p.d;
      if (w.rule === "sfl") ok(w.v === RULE.sfl(p.c, known), "missing: sfl recompute");
      if (w.rule === "sumSeen") ok(w.v === p.c + known, "missing: sum recompute");
      if (w.rule === "diffSeen") ok(w.v === Math.abs(p.d - p.b), "missing: diff recompute");
    });
    [p.a, p.b, p.c, p.d, p.key].filter(function (v) { return v !== undefined; }).forEach(function (v) { ok(!isExam(v), "missing " + type + ": exam value " + v); });
    if (fails > f0) bad += 1;
  }
  log("  missing " + (type === "part" ? "part (a + □ = c)" : type === "sub" ? "number taken away (c − □ = d)" : "start (□ − b = d)") + ": " + (N_DRAWS - bad) + "/" + N_DRAWS + " draws clean");
});
["sfl", "noReduce", "zero"].forEach(function (rule, ri) {
  var bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var p = GEN.probErr(seedR(i, 30 + ri), rule), f0 = fails;
    ok(p.key === p.a - p.b, "error " + rule + ": key");
    ok(p.w === RULE[rule](p.a, p.b), "error " + rule + ": Sam's answer is not the named rule's (" + p.a + " − " + p.b + " → " + p.w + ")");
    ok(p.w !== p.key, "error " + rule + ": Sam's answer equals the key");
    ok(!isExam(p.w) && !isExam(p.a) && !isExam(p.b) && !isExam(p.key), "error " + rule + ": exam value");
    if (rule === "noReduce") ok(kindOf(p.a, p.b) === "ones" && p.w - p.key === 10, "error noReduce: not a one-trade item with the tens left");
    if (rule === "zero") ok(digits(p.a)[1] === 0 && kindOf(p.a, p.b) === "both", "error zero: not across a zero");
    if (rule === "sfl") ok(kindOf(p.a, p.b) !== "none", "error sfl: no trade needed");
    var rows = GEN.errRows(p);
    ok(rows && rows.filter(function (r) { return r.truth; }).length === 3 && rows.length === 6, "error " + rule + ": rows not 3 true / 3 false");
    (rows || []).forEach(function (r) {
      if (/is too big/.test(r.t)) ok(r.truth === (p.w > p.key), "row truth: too big");
      if (/too small/.test(r.t)) ok(r.truth === (p.w < p.key), "row truth: too small");
      if (/ is not /.test(r.t)) ok(r.truth === (p.w + p.b !== p.a), "row truth: adds back");
      if (/answer is right/.test(r.t)) ok(r.truth === (p.w === p.key), "row truth: right");
      if (/10 too big/.test(r.t)) ok(r.truth === (p.w - p.key === 10), "row truth: 10 too big");
    });
    if (fails > f0) bad += 1;
  }
  log("  find the mistake, rule \"" + GEN.RULES[rule].name + "\": " + (N_DRAWS - bad) + "/" + N_DRAWS + " draws clean");
});

/* multiple choice */
function mcRun(name, make, salt, check) {
  var t = new Tally(name), bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var it = make(seedR(i, salt)), st = it.steps[0], f0 = fails;
    var keyC = st.choices[st.key];
    ok(st.choices.length === 4, name + ": not four choices");
    var rank = null;
    if (st.numeric) {
      ok(keyC.v === it.meta.a - it.meta.b, name + ": key " + keyC.v + " is not " + it.meta.a + " − " + it.meta.b);
      var vals = st.choices.map(function (c) { return c.v; });
      ok(new Set(vals).size === 4, name + ": repeated choice");
      rank = vals.filter(function (v) { return v < keyC.v; }).length;
      st.choices.forEach(function (c, k) {
        if (k === st.key) return;
        ok(c.v !== keyC.v, name + ": a wrong choice equals the key");
        ok(RULE[c.rule] && RULE[c.rule](it.meta.a, it.meta.b) === c.v, name + ": choice " + c.v + " is not made by its rule " + c.rule);
        ok(!isExam(c.v), name + ": exam value " + c.v + " as a choice");
      });
    }
    if (check) check(it, st);
    checkItem(it, name + " #" + i);
    t.add(rank, st.key);
    if (fails > f0) bad += 1;
  }
  log("  " + name + ": " + (N_DRAWS - bad) + "/" + N_DRAWS + " clean · " + t.report());
}
mcRun("choice: subtract in your head", function (r) { return GEN.items.mentalMCItem(r); }, 40);
["ones", "tens", "both", "zero"].forEach(function (k, ki) {
  mcRun("choice: 3-digit " + k, function (r) { return GEN.items.mcColItem(r, k); }, 41 + ki, function (it) { ok(kindOf(it.meta.a, it.meta.b) === kindsPromise[k], "choice " + k + ": trade type"); });
});
["ones", "tens", "none"].forEach(function (target, ti) {
  mcRun("choice: which needs " + (target === "none" ? "no trade" : target === "ones" ? "a ten opened" : "a hundred opened"), function (r) { return GEN.items.whichItem(r, target); }, 50 + ti, function (it, st) {
    var hits = st.choices.filter(function (c) { return kindOf(c.a, c.b) === target; });
    ok(hits.length === 1 && kindOf(st.choices[st.key].a, st.choices[st.key].b) === target, "which " + target + ": not exactly one right choice");
    st.choices.forEach(function (c) { ok(kindOf(c.a, c.b) !== "both", "which: a two-trade distractor"); });
  });
});
mcRun("choice: which is the same (the trade)", function (r) { return GEN.items.sameAsItem(r); }, 55, function (it, st) {
  var v = it.meta.value, eq = st.choices.filter(function (c) { return c.parts[0] * 100 + c.parts[1] * 10 + c.parts[2] === v; });
  ok(eq.length === 1 && eq[0] === st.choices[st.key], "same-as: not exactly one equal choice");
});
(function () {
  var t3 = new Tally("decide (no trade / ten / hundred)"), t4 = new Tally("decide (four choices)"), bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    ["none", "ones", "tens", "both"].forEach(function (k, ki) {
      var four = ki === 3 || i % 2 === 0, it = GEN.items.decideItem(seedR(i, 60 + ki), k, four), st = it.steps[0], f0 = fails;
      ok(st.choices[st.key].kind === kindOf(it.meta.a, it.meta.b), "decide " + k + ": key is not the computed trade");
      ok(it.steps[1].answer === it.meta.a - it.meta.b, "decide: column key");
      checkItem(it, "decide " + k + " #" + i);
      (four ? t4 : t3).add(null, st.key);
      if (fails > f0) bad += 1;
    });
  }
  log("  decide first, then subtract: " + (4 * N_DRAWS - bad) + "/" + 4 * N_DRAWS + " clean · 3 choices: " + t3.report() + " · 4 choices: " + t4.report());
})();

/* the other item generators */
function itemRun(name, make, salt, check) {
  var bad = 0;
  for (var i = 1; i <= N_DRAWS; i++) {
    var it = make(seedR(i, salt)), f0 = fails;
    if (check) check(it);
    checkItem(it, name + " #" + i);
    if (fails > f0) bad += 1;
  }
  log("  " + name + ": " + (N_DRAWS - bad) + "/" + N_DRAWS + " clean");
}
["none", "ones", "tens", "both", "zero"].forEach(function (k, ki) {
  itemRun("column item, " + k + (k === "ones" || k === "tens" ? " (with true/false rows)" : " (with adding back)"), function (r) { return GEN.items.colItem(r, k, { addBack: true, why: k === "ones" || k === "tens" }); }, 70 + ki, function (it) {
    var c = it.steps[0];
    ok(c.answer === c.top - c.bottom && kindOf(c.top, c.bottom) === kindsPromise[k], "column " + k + ": key/trade");
    ok(it.steps[1].answer === c.top && it.steps[1].pre.indexOf(String(c.answer)) === 0, "column " + k + ": adding back");
    if (it.steps[2]) {
      var rows = it.steps[2].rows;
      ok(rows.filter(function (r) { return r.truth; }).length === 3, "column rows not 3/3");
      rows.forEach(function (r) { if (/bigger than/.test(r.t)) ok(r.truth === false, "row: bigger than"); if (/hundreds changed|ones changed/.test(r.t)) ok(r.truth === false, "row: changed"); });
    }
  });
});
itemRun("column item for the test (marks scored)", function (r) { return GEN.items.heldColItem(r, r.pick(["ones", "tens", "zero"])); }, 76, function (it) {
  var c = it.steps[0]; ok(c.pts === 1 && c.markPts === 1, "held column points"); ok(c.marks.some(function (x) { return x; }), "held column: no marks expected");
});
itemRun("number line, in the head", function (r) { return GEN.items.mentalNLItem(r); }, 77, function (it) {
  var st = it.steps[0]; ok(st.answer === st.start - st.total, "line: key");
  ok(st.chips.indexOf(10) >= 0 && st.chips.every(function (c) { return c > 0 && c <= st.total; }), "line: chips");
  var B = digits(st.total), A = digits(st.start);
  ok(st.chips.indexOf(B[1] * 10) >= 0 && st.chips.indexOf(B[2]) >= 0, "line: tens-then-ones route not offered");
  ok(st.chips.indexOf(A[2]) >= 0 && st.chips.indexOf(B[2] - A[2]) >= 0, "line: to-a-ten route not offered");
});
itemRun("open one ten (unit words)", function (r) { return GEN.items.tradeTenItem(r); }, 78, function (it) { var N = it.meta.nums[0]; ok(it.steps[0].answer === N % 10 + 10, "trade ten: key"); });
itemRun("open one hundred (unit words)", function (r) { return GEN.items.tradeHundredItem(r); }, 79, function (it) { var N = it.meta.nums[0]; ok(it.steps[0].answer === Math.floor(N / 10) % 10 + 10, "trade hundred: key"); });
itemRun("ones into a ten", function (r) { return GEN.items.onesFromTenItem(r); }, 80, function (it) { var n = it.meta.nums[0]; ok(it.steps[0].answers[0] === 1 && it.steps[0].answers[1] === n - 10, "ones-to-ten: key"); });
itemRun("how many tens", function (r) { return GEN.items.tensInItem(r, r.next() < 0.5); }, 81, function (it) { var N = it.meta.nums[0]; ok(it.steps[0].answer * 10 === N, "tens in: key"); });
itemRun("tens into ones across a zero", function (r) { return GEN.items.zeroTensWordsItem(r); }, 82, function (it) { ok(it.steps[0].answer === 10, "zero tens words: key"); });
["ten", "hundred"].forEach(function (w, wi) {
  itemRun("chart: build, then open a " + w, function (r) { return GEN.items.chartOpenItem(r, w); }, 83 + wi, function (it) {
    var tg = it.steps[0].charts[0].target, N = it.meta.nums[0], after = it.steps[1].charts[0].target;
    ok(tg[0] * 100 + tg[1] * 10 + tg[2] === N, "chart build target");
    ok(after[0] * 100 + after[1] * 10 + after[2] === N, "chart opened target keeps the value");
    ok(it.steps[2].answer === (w === "ten" ? after[2] : after[1]), "chart open: key");
  });
});
["sfl", "noReduce", "zero"].forEach(function (rule, ri) {
  itemRun("find the mistake item, " + rule, function (r) { return GEN.items.errItem(r, rule); }, 85 + ri, function (it) {
    ok(it.steps[0].revealOnCommit === true && it.steps[1].type === "tf" && it.steps[2].type === "why" && it.steps[2].ungraded, "error: order fix → rows → why (unscored)");
    ok(it.figure.w === RULE[rule](it.meta.a, it.meta.b), "error item: shown work is the named rule");
  });
});
["part", "sub", "start"].forEach(function (type, ti) {
  itemRun("missing number item, " + type, function (r) { return GEN.items.missingItem(r, type); }, 88 + ti, function (it) {
    var st = it.steps[0];
    ok(/whole/i.test(st.choices[st.key].t) === (type === "start"), "missing: part-or-whole key");
    ok(it.steps[1].answer === it.meta.key, "missing: key");
  });
});
["sold", "beads", "start"].forEach(function (tpl, ti) {
  itemRun("story item, " + tpl + " (test form)", function (r) { return GEN.items.storyItem(r, tpl, true); }, 91 + ti, function (it) {
    var p = it.meta.p, bar = it.steps[0].answer, key = it.meta.key;
    if (tpl === "start") { ok(key === p.b + p.d && bar.whole === "?", "story start: key/bar"); }
    else { ok(key === p.c - p.a && bar.whole === String(p.c) && bar.parts.indexOf("?") >= 0, "story " + tpl + ": key/bar"); }
    var sols = it.meta.sentences.map(function (s) {
      var t = s.t.replace(/−/g, "-"), mm;
      if ((mm = t.match(/^(\d+) ([+-]) (\d+) = \?$/))) return mm[2] === "+" ? +mm[1] + +mm[3] : +mm[1] - +mm[3];
      if ((mm = t.match(/^\? ([+-]) (\d+) = (\d+)$/))) return mm[1] === "+" ? +mm[3] - +mm[2] : +mm[3] + +mm[2];
      return NaN;
    });
    ok(sols.filter(function (v) { return v === key; }).length === 1 && sols[it.meta.sentenceKey] === key, "story: not exactly one sentence finds the key");
    ok(it.steps.reduce(function (s, st) { return s + (st.pts || 0); }, 0) === 3, "story: 3 points");
  });
});

/* ================= 3. sessions ================= */
log("");
log("3. Sessions (counters 0..149 each; session 12 with and without misses)");
var SK = ["mental", "which", "two", "zero", "ones", "tens", "missing", "story"];
for (var s = 1; s <= 12; s++) {
  var sizes = {}, bad = 0;
  for (var c = 0; c < 150; c++) {
    var missed = s === 12 && c % 3 ? SK.filter(function (k, ki) { return (c >> ki) & 1; }) : [];
    var S = GEN.buildSession(s, c, { missed: missed }), f0 = fails, n = S.items.length;
    sizes[n] = (sizes[n] || 0) + 1;
    if (s === 11) {
      ok(n === 7, "session 11: not 7 items");
      ok(S.items.map(function (it) { return it.section; }).join("") === "AAABBBC", "session 11: sections");
      var pts = S.items.map(function (it) { return it.steps.reduce(function (t, st) { return t + (st.pts || 0) + (st.markPts || 0); }, 0); });
      ok(pts.join(",") === "2,2,2,2,2,2,3", "session 11: points " + pts.join(","));
      ok(S.heldFrom === 0, "session 11: feedback not held");
    } else ok(n >= 8 && n <= 10, "session " + s + ": " + n + " items");
    if (s === 2) ok(S.heldFrom === 7 && S.items.slice(7).reduce(function (t, it) { return t + it.steps.reduce(function (u, st) { return u + (st.pts || 0); }, 0); }, 0) === 7, "session 2: mini check 7 points");
    if (s === 3) ok(S.heldFrom === 7 && S.items.slice(7).every(function (it) { return it.steps.reduce(function (u, st) { return u + (st.pts || 0); }, 0) === 1; }), "session 3: quick check 1 point each");
    if (s === 12 && missed.length) {
      var skills = {}; S.items.forEach(function (it) { skills[it.skill] = (skills[it.skill] || 0) + 1; });
      missed.forEach(function (k) { ok(skills[k] >= 1, "session 12: missed skill " + k + " not practised"); });
    }
    S.items.forEach(function (it, k) { checkItem(it, "session " + s + " c" + c + " Q" + (k + 1)); });
    if (fails > f0) bad += 1;
  }
  log("  session " + s + " (" + GEN.SESSIONS[s - 1].date + ", " + GEN.SESSIONS[s - 1].title + "): items per draw " + Object.keys(sizes).map(function (k) { return k + "×" + sizes[k]; }).join(" ") + " · " + (150 - bad) + "/150 clean");
}

/* ================= 4. fixed items from G2-U01-REVIEW-2DAY.md ================= */
log("");
log("4. Fixed items copied from G2-U01-REVIEW-2DAY.md (answers computed here)");
function toWords(n) {
  var ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  var tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  var h = Math.floor(n / 100), r = n % 100, out = [];
  if (h) out.push(ones[h] + " hundred");
  if (r) out.push(r < 20 ? ones[r] : tens[Math.floor(r / 10)] + (r % 10 ? "-" + ones[r % 10] : ""));
  return out.join(" ");
}
function wordsToNum(w) { for (var v = 1; v < 1000; v++) if (toWords(v) === w) return v; return NaN; }
function pickKeyVal(st) { return st.choices[st.key].v; }
function rankOf(st) { var k = pickKeyVal(st); return st.choices.filter(function (c) { return c.v < k; }).length; }
function sortedVals(st) { return st.choices.map(function (c) { return c.v; }).sort(function (a, b) { return a - b; }).join(","); }
function placeVal(d) { return d[0] * 100 + d[1] * 10 + d[2]; }
var fixedOk = 0, fixedN = 0;
function fx(label, cond) { fixedN += 1; if (ok(cond, "fixed " + label)) fixedOk += 1; }
for (var c2 = 0; c2 < 30; c2++) {
  var D1 = GEN.buildSession(1, c2).items, D2 = GEN.buildSession(2, c2).items;
  var first = c2 === 0;
  function F(label, cond) { if (first) fx(label, cond); else ok(cond, "fixed " + label + " (counter " + c2 + ")"); }
  F("D1-Q1 blocks 5 flats 0 rods 8 cubes = 508; choices 58·508·580·5008; key rank 2nd", pickKeyVal(D1[0].steps[0]) === placeVal([5, 0, 8]) && sortedVals(D1[0].steps[0]) === "58,508,580,5008" && rankOf(D1[0].steps[0]) === 1);
  F("D1-Q2 nine hundred thirty = 930", D1[1].steps[0].answer === wordsToNum("nine hundred thirty") && D1[1].figure.text === "nine hundred thirty");
  F("D1-Q3 chart 904 = 9,0,4; bond 900 + 0 + 4", JSON.stringify(D1[2].steps[0].charts[0].target) === JSON.stringify(digits(904)) && D1[2].steps[1].answers.join() === [900, 0, 4].join() && D1[2].steps[1].answers.reduce(function (a, b) { return a + b; }) === 904);
  var q4 = D1[3].steps[0], truths = q4.choices.map(function (ch) { return ch.cmp[1] === ">" ? ch.cmp[0] > ch.cmp[2] : ch.cmp[0] < ch.cmp[2]; });
  F("D1-Q4 exactly one false card, and it is the key (438 > 501)", truths.filter(function (t) { return !t; }).length === 1 && truths[q4.key] === false && q4.choices[q4.key].t === "438 > 501");
  F("D1-Q5 count on by tens from 372 (382 given): 392, 402, 412", D1[4].steps[0].pre[0] === 372 + 10 && D1[4].steps[0].landings.join() === [1, 2, 3].map(function (k) { return 382 + 10 * k; }).join());
  F("D1-Q6 100 less than 529 = 429; choices 429·519·528·629; key smallest", pickKeyVal(D1[5].steps[0]) === 529 - 100 && sortedVals(D1[5].steps[0]) === "429,519,528,629" && rankOf(D1[5].steps[0]) === 0);
  var q7rows = D1[6].steps[2].rows;
  F("D1-Q7 10 more than 296 = 306; 3 true / 3 false rows; \"The answer is 206.\" false", D1[6].steps[0].answer === 296 + 10 && q7rows.filter(function (r) { return r.truth; }).length === 3 && q7rows.some(function (r) { return r.t === "The answer is 206." && r.truth === (206 === 296 + 10); }));
  F("D1-Q8 3 boxes of 100 and 12 packs of 10 = 420; chart 4,2,0; almost-state 3,12,0", D1[7].steps[1].answer === 3 * 100 + 12 * 10 && JSON.stringify(D1[7].steps[0].charts[0].target) === JSON.stringify(digits(420)) && JSON.stringify(D1[7].steps[0].almost.state) === "[3,12,0]");
  F("D2-Q1 the 2 in 217 stands for 200; choices 2·20·200·217; key rank 3rd", pickKeyVal(D2[0].steps[0]) === digits(217)[0] * 100 && sortedVals(D2[0].steps[0]) === "2,20,200,217" && rankOf(D2[0].steps[0]) === 2);
  F("D2-Q2 3 + 40 + 900 = 943", D2[1].steps[0].answer === 3 + 40 + 900);
  F("D2-Q3 count on by ones from 897: 898, 899, 900, 901", D2[2].steps[0].landings.join() === [1, 2, 3, 4].map(function (k) { return 897 + k; }).join());
  F("D2-Q4 order 683, 836, 368 → 368, 683, 836", D2[3].steps[0].answer.join() === [683, 836, 368].sort(function (a, b) { return a - b; }).join() && D2[3].steps[0].tiles.slice().sort().join() === "368,683,836");
  F("D2-Q5 100 more than 856 = 956; choices 756·857·866·956; key largest", pickKeyVal(D2[4].steps[0]) === 856 + 100 && sortedVals(D2[4].steps[0]) === "756,857,866,956" && rankOf(D2[4].steps[0]) === 3);
  F("D2-Q6 350 on the chart (3,5,0), opened (0,35,0), 35 tens", JSON.stringify(D2[5].steps[0].charts[0].target) === JSON.stringify(digits(350)) && JSON.stringify(D2[5].steps[1].charts[0].target) === JSON.stringify([0, 350 / 10, 0]) && D2[5].steps[2].answer === 350 / 10);
  F("D2-Q7 418 is \"four hundred eighteen\"", D2[6].steps[0].choices[D2[6].steps[0].key].t === toWords(418) && D2[6].steps[0].choices.filter(function (ch) { return wordsToNum(ch.t) === 418; }).length === 1);
  F("D2-Q8 10 less than 603 = 593; choices 503·593·613·693; key rank 2nd; 2 points", pickKeyVal(D2[7].steps[0]) === 603 - 10 && sortedVals(D2[7].steps[0]) === "503,593,613,693" && rankOf(D2[7].steps[0]) === 1 && D2[7].steps[0].pts === 2);
  F("D2-Q9 390 on the chart (3,9,0); bond 300 + 90 + 0; 1 + 1 points; bond after the chart", JSON.stringify(D2[8].steps[0].charts[0].target) === JSON.stringify(digits(390)) && D2[8].steps[1].answers.join() === "300,90,0" && D2[8].steps[1].gate === true);
  var q10 = D2[9].steps, rowsTruth = {
    "Both numbers have 7 hundreds.": digits(709)[0] === 7 && digits(790)[0] === 7,
    "790 has 9 tens. 709 has 0 tens.": digits(790)[1] === 9 && digits(709)[1] === 0,
    "So 790 is greater than 709.": 790 > 709,
    "709 has 9 ones, so it is greater.": 709 > 790,
    "The number that ends in 9 is greater.": 709 > 790,
    "The 0 in 790 makes it smaller.": 790 < 709
  };
  F("D2-Q10 charts 7,0,9 and 7,9,0; key blue barn (790 > 709); six rows with computed truths; rows after the barn", JSON.stringify(q10[0].charts.map(function (ch) { return ch.target; })) === JSON.stringify([digits(709), digits(790)]) &&
    q10[1].choices[q10[1].key].t === (790 > 709 ? "Blue barn" : "Red barn") && q10[2].rows.length === 6 && q10[2].rows.every(function (r) { return rowsTruth[r.t] === r.truth; }) && q10[1].gate && q10[2].gate);
  [D1, D2].forEach(function (D, di) { D.forEach(function (it, k) { checkItem(it, "review day " + (di + 1) + " Q" + (k + 1)); }); });
}
log("  " + fixedOk + "/" + fixedN + " fixed items match their computed answers (and the same on 29 more display shuffles)");

/* ================= summary ================= */
log("");
log("Checks run: " + checks + " · failed: " + fails);
Object.keys(failKinds).sort(function (a, b) { return failKinds[b] - failKinds[a]; }).slice(0, 30).forEach(function (k) { log("  failure kind ×" + failKinds[k] + ": " + k); });
log(fails ? "RESULT: FAIL" : "RESULT: PASS");
fs.writeFileSync(OUT, lines.join("\n") + "\n");
process.exit(fails ? 1 : 0);
