#!/usr/bin/env node
/* bar_models_check.js — checks the generators of design/experience/BAR-MODELS-PRACTICE.html
   (spec: design/experience/BAR-MODELS-PRACTICE-SPEC.md §10).
   Loads the page's window-free generator block (<script id="gen">) in Node and, for every session
   (1-13) x 2,000 forms (plus every W1 twin and W5 look-again of each form), asserts: no throw; every
   key recomputed here from what is on the screen (story text, sentence, bond, bar); every wrong
   choice and review value equals its named rule (rules re-implemented here); every wrong sentence
   is false for the bar; the asked slot is empty (or "?") in every pre-answer bar and bond; part
   widths in proportion and >= 18 %; one quantity per answer box; <= 10 words a sentence; stories
   2 + 1; no key-word phrases; no G1-U02 setting; key place and numeric rank <= 40 % (two-way <= 60 %);
   no repeated operand tuple in a session; consecutive forms and extra practice share no tuple with
   the earlier form; exam values (read at run time from EXAM-READING.md; never printed) never appear;
   the page's hash mask covers every listed value; ladders: rungs 1-3 number-free, rung 1 a question,
   rung 4 the answer; the page's grader accepts every key and rejects every rule value.
   Then broken controls, each of which must fire.
   Run:  node testing/bar_models_check.js            (output also saved to testing/bar_models_check.out.txt)
         node testing/bar_models_check.js --dump     (writes testing/dump-bar-models.txt)
         node testing/bar_models_check.js --emit-mask (prints the page's MASK; counts on stderr) */
"use strict";
var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var PAGE = path.join(ROOT, "design/experience/BAR-MODELS-PRACTICE.html");
var SPEC = path.join(ROOT, "design/experience/BAR-MODELS-PRACTICE-SPEC.md");
var EXAM_READING = path.join(ROOT, "research/phase0/EXAM-READING.md");
var OUT = path.join(__dirname, "bar_models_check.out.txt");
var DUMP = path.join(__dirname, "dump-bar-models.txt");
var N_FORMS = +(process.env.BM_FORMS || 2000);

/* ---------- the exam list, read at run time only; never printed, never written to a file ---------- */
function readExamList() {
  var listed = {};
  var er = fs.readFileSync(EXAM_READING, "utf8");
  var sec = er.split(/## Exam values for the no-exam-items gate/)[1] || "";
  sec = sec.split(/\n## /)[0];
  sec.split("\n").filter(function (l) { return /^- Q/.test(l); }).forEach(function (l) {
    l.replace(/^- Q\d+[ab]?:/, "").replace(/Q\d+[ab]?:/g, "").split(/[^0-9□]+/).forEach(function (tok) {
      if (!tok || tok.indexOf("□") >= 0) return;
      listed[+tok] = 1;
    });
  });
  var fromSection = Object.keys(listed).length;
  /* his written answers: the list the subtraction checker already carries, read from its source at run time */
  var tpc = fs.readFileSync(path.join(__dirname, "test_prep_check.js"), "utf8");
  var m = tpc.match(/his written answers[^\n]*\n\s*\[([0-9 ,]+)\]\.forEach/);
  if (m) m[1].split(",").forEach(function (t) { if (t.trim()) listed[+t.trim()] = 1; });
  var tpp = fs.readFileSync(path.join(ROOT, "design/experience/TEST-PREP-SUBTRACTION.html"), "utf8");
  var m2 = tpp.match(/var EXAM = \[([0-9 ,\n]+)\];/);
  if (m2) m2[1].split(",").forEach(function (t) { if (t.trim()) listed[+t.trim()] = 1; });
  var all = Object.keys(listed).map(Number);
  return { all: all, fromSection: fromSection, written: !!m, page: !!m2 };
}
function bucketOf(v) { return (Math.imul(((v | 0) + 40503) >>> 0, 2654435761) >>> 0) >>> 24; }
function maskHex(values) {
  var bits = new Array(256).fill(0);
  values.forEach(function (v) { bits[bucketOf(v)] = 1; });
  var s = "";
  for (var c = 0; c < 64; c++) { var nib = 0; for (var k = 0; k < 4; k++) if (bits[c * 4 + k]) nib |= 1 << k; s += nib.toString(16); }
  return s;
}
function maskedBy(hex, v) { var b = bucketOf(v); return ((parseInt(hex.charAt(b >> 2), 16) >> (b & 3)) & 1) === 1; }
if (process.argv.includes("--emit-mask")) {
  var L0 = readExamList(), set0 = {};
  L0.all.forEach(function (v) { set0[bucketOf(v)] = 1; });
  var share0 = 0; for (var v0 = 1; v0 <= 999; v0++) if (set0[bucketOf(v0)]) share0 += 1;
  console.error("values read: " + L0.all.length + " (section " + L0.fromSection + ", written answers " + (L0.written ? "found" : "MISSING") + ", page list " + (L0.page ? "found" : "MISSING") + "); buckets set: " + Object.keys(set0).length + "; numbers 1-999 masked: " + share0);
  console.log(maskHex(L0.all));
  process.exit(0);
}

/* ---------- log ---------- */
var lines = [], fails = 0, checks = 0, failKinds = {};
function log(s) { lines.push(s); console.log(s); }
function ok(cond, what) {
  checks += 1;
  if (!cond) {
    fails += 1;
    var kind = String(what).replace(/\d+/g, "#");
    failKinds[kind] = (failKinds[kind] || 0) + 1;
    if (fails <= 40) log("  FAIL: " + what);
  }
  return cond;
}

/* ---------- load the generator block ---------- */
var html = fs.readFileSync(PAGE, "utf8");
var gm = html.match(/<script id="gen">([\s\S]*?)<\/script>/);
if (!gm) { console.error("no <script id=\"gen\"> block"); process.exit(2); }
if (/\bwindow\b|\bdocument\b/.test(gm[1].replace(/\/\*[\s\S]*?\*\//g, ""))) { console.error("generator block touches window/document"); process.exit(2); }
var G = new Function(gm[1] + "\nreturn GEN;")();

var EXL = readExamList();
var EXAM = {}, TIER1 = {};
EXL.all.forEach(function (v) { EXAM[v] = 1; if (v >= 100 && v <= 999 && v % 100 !== 0) TIER1[v] = 1; });
var examHits = { tier1: 0, tier2: 0 };
var SUB = { n: 0 }, CONTROLS = { fired: 0, n: 0 };
function shared(bA, bB) { var t = {}, n = 0; bA.items.forEach(function (it) { t[it.meta.tuple] = 1; }); bB.items.forEach(function (it) { if (t[it.meta.tuple]) n += 1; }); return n; }

/* ---------- independent arithmetic (written here, not copied from the page) ---------- */
function D(n) { return [Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10]; }
var PV = [100, 10, 1];
var RULE = {
  addWhenPart: function (p) { return p.W + p.k; },
  sfl: function (p) { var A = D(p.W), B = D(p.k); return A.reduce(function (s, d, i) { return s + Math.abs(d - B[i]) * PV[i]; }, 0); },
  noReduce: function (p) { var A = D(p.W), B = D(p.k), s = 0; for (var i = 0; i < 3; i++) s += (A[i] >= B[i] ? A[i] - B[i] : A[i] + 10 - B[i]) * PV[i]; return s; },
  countStart: function (p) { return p.key + 1; },
  oneShort: function (p) { return p.key - 1; },
  tenOff: function (p) { return p.key - 10; },
  hundredOff: function (p) { return p.key - 100; },
  extraTen: function (p) { return p.key + 10; },
  takeWhenWhole: function (p) { return p.a > p.b ? p.a - p.b : p.b - p.a; },
  noCarry: function (p) { var A = D(p.a), B = D(p.b); return A.reduce(function (s, d, i) { return s + ((d + B[i]) % 10) * PV[i]; }, 0); },
  carryWhole: function (p) {
    var A = D(p.a), B = D(p.b), cols = [A[0] + B[0], A[1] + B[1], A[2] + B[2]], s = "";
    cols.forEach(function (c, i) { if (s !== "" || c !== 0 || i === 2) s += String(c); });
    return Number(s);
  },
  countStartOn: function (p) { return p.key - 1; }
};
var PART_RULES = ["addWhenPart", "sfl", "noReduce", "countStart", "tenOff"];
var WHOLE_RULES = ["takeWhenWhole", "noCarry", "carryWhole", "countStartOn", "extraTen"];
var POOL = ["addWhenPart", "sfl", "noReduce", "countStart", "extraTen", "tenOff", "hundredOff", "oneShort"];
function sentenceTrue(parts, q) {
  var v = parts.map(function (x) { return x === "?" ? q : x; });
  if (v[1] === "+") return v[0] + v[2] === v[3];
  if (v[1] === "−") return v[0] - v[2] === v[3];
  return false;
}
function clamp(f) { return f < 0.18 ? 0.18 : f > 0.82 ? 0.82 : f; }

/* ---------- text checks ---------- */
function words(s) { return s.split(/\s+/).filter(function (t) { return /[A-Za-z0-9?□]/.test(t); }).length; }
function sentencesOf(text) { return String(text || "").split(/(?<=[.!]|[^\s]\?)\s+/).filter(function (s) { return s.trim(); }); }
var KEYWORD = /\baltogether\b|\bin all\b|\bmeans? (to )?(add|adding|subtract|take away|plus|minus)\b|\bkey ?words?\b|\bleft means\b|\bmore means\b|\bfewer means\b/i;
var G1U02 = /\b(ducks?|ponds?|birds?|fences?|apples?|bowls?|boats?|docks?|shells?|buckets?|fish|fishes|tanks?|stickers?|pages?|balloons?|party|parties)\b/i;
function nums(text) { return (String(text).match(/\d+/g) || []).map(Number); }
function hasNum(text, n) { return new RegExp("(^|[^0-9])" + n + "([^0-9]|$)").test(String(text)); }

/* every child-facing text of an item */
function textsOf(it) {
  var t = [].concat(it.prompt, [it.say]);
  it.steps.forEach(function (st) {
    t.push(st.label, st.pre, st.post);
    (st.hints || []).forEach(function (x) { t.push(x); });
    (st.choices || []).forEach(function (c) { if (typeof c === "string") t.push(c); else { t.push(c.t, c.msg, c.say); } });
    (st.diag || []).forEach(function (d) { t.push(d.msg); });
  });
  return t.filter(function (x) { return x; });
}

/* ---------- the key, recomputed from what is on the screen ---------- */
var WHOLE_K = { join2: 1, joinLater: 1, start: 1 }, PART_K = { takeAway: 1, static: 1, changeJoin: 1, changeSep: 1, startJoin: 1 };
function keyFromScreen(it, F) {
  var m = it.meta, f = it.figure;
  if (it.story) {
    var ns = nums(it.prompt.join(" "));
    if (!F(ns.length === 2, it.id + ": a story carries two numbers")) return null;
    var x = ns[0], y = ns[1], k = m.story;
    if (k === "join2" || k === "joinLater" || k === "start") return x + y;
    if (k === "takeAway" || k === "static" || k === "changeSep") return x - y;
    if (k === "changeJoin" || k === "startJoin") return y - x;
    F(false, it.id + ": unknown story kind"); return null;
  }
  if (f && f.type === "bond") {
    var b = f.bond;
    if (b.whole === null) return b.parts[0] + b.parts[1];
    return b.whole - (b.parts[0] === null ? b.parts[1] : b.parts[0]);
  }
  if (f && f.type === "bar") {
    var bar = f.bar;
    if (bar.whole === "?") return +bar.parts[0] + +bar.parts[1];
    return +bar.whole - +(bar.parts[0] === "?" ? bar.parts[1] : bar.parts[0]);
  }
  if (f && f.type === "eq") {
    var e = f.parts, bi = e.indexOf("□");
    if (bi === 4) return e[1] === "+" ? e[0] + e[2] : e[0] - e[2];
    if (bi === 0) return e[1] === "+" ? e[4] - e[2] : e[4] + e[2];
    if (bi === 2) return e[1] === "+" ? e[4] - e[0] : e[0] - e[4];
  }
  F(false, it.id + ": no screen to recompute from"); return null;
}

/* ---------- teacher-read gates (second read, 2026-11-21) ---------- */
/* (1) a spoken line never ties "whole" / "part" to a value or to the "?" before he decides */
var QTOK = /(^|[\s(])\?(?=[\s.,)]|$)/;
function tiedLine(s) { return /\b(whole|parts?)\b/i.test(s) && (/\d/.test(s) || /question mark/i.test(s) || QTOK.test(s)); }
function saysTied(say) { return sentencesOf(say).some(tiedLine); }
/* (3) a line may name the ?, a bar, a box or a circle only when that thing is on the screen at that step */
var NOUNS = { "?": QTOK, bar: /\bbars?\b/i, box: /\bbox(es)?\b/i, circle: /\bcircles?\b/i };
function visibleAt(it) {
  var vis = {}, f = it.figure, out = [];
  if (f && f.type === "bond") { vis.circle = 1; vis["?"] = 1; }
  if (f && f.type === "bar") { vis.bar = 1; vis["?"] = 1; }
  if (f && f.type === "eq") vis.box = 1;
  var base = Object.assign({}, vis);
  it.steps.forEach(function (st) {
    var own = {};
    if (st.type === "label" || st.role === "match") { own.bar = 1; own["?"] = 1; }
    if (st.role === "shape") own.bar = 1;
    if (st.role === "sentence") own["?"] = 1;
    if (st.bond) { own.circle = 1; own["?"] = 1; }
    if (st.type === "num" && QTOK.test(st.pre || "")) own["?"] = 1;
    out.push(Object.assign({}, vis, own));
    Object.assign(vis, own);
  });
  out.base = base;
  return out;
}
function screenNounFails(it) {
  var vis = visibleAt(it), bad = [];
  function test(t, v, where) { if (!t) return; Object.keys(NOUNS).forEach(function (nm) { if (NOUNS[nm].test(t) && !v[nm]) bad.push(where + ' names "' + nm + '" not on the screen: ' + t); }); }
  it.prompt.forEach(function (t) { test(t, vis.base, "prompt"); });
  it.steps.forEach(function (st, j) {
    if (st.type === "paper") return; /* the paper step asks him to draw one */
    var v = vis[j], w = "step " + (j + 1);
    [st.label, st.pre, st.post].forEach(function (t) { test(t, v, w); });
    (st.hints || []).slice(0, 3).forEach(function (t) { test(t, v, w + " help"); });
    (st.choices || []).forEach(function (c) { if (c && c.msg) test(c.msg, v, w + " clue"); });
    (st.diag || []).forEach(function (d) { test(d.msg, v, w + " clue"); });
  });
  return bad;
}
/* (2) "left" and "more": a word used in a form is used on both sides; with two stories or more on each side, both words both sides */
function storyWords(it) { var t = it.prompt.join(" "); return { left: /\bleft\b/i.test(t), more: /\bmore\b/i.test(t) }; }
function wordFails(items) {
  var bad = [], side = { left: { whole: 0, part: 0 }, more: { whole: 0, part: 0 } }, n = { whole: 0, part: 0 };
  items.filter(function (it) { return it.story; }).forEach(function (it) {
    var w = storyWords(it), sd = it.meta.p.asked; n[sd] += 1;
    if (w.left) side.left[sd] += 1; if (w.more) side.more[sd] += 1;
    var tag = it.meta.word || "none";
    if ((tag === "left") !== w.left || (tag === "more") !== w.more) bad.push("a story's text does not carry its planned word (" + tag + ")");
  });
  ["left", "more"].forEach(function (w) { if ((side[w].whole > 0) !== (side[w].part > 0)) bad.push('"' + w + '" on one side only (whole ' + side[w].whole + ", part " + side[w].part + ")"); });
  if (n.whole + n.part >= 3 && n.whole >= 1 && n.part >= 1 && !(side.left.whole && side.left.part) && !(side.more.whole && side.more.part)) bad.push("stories on both sides, but neither word on both sides");
  if (n.whole >= 2 && n.part >= 2 && !(side.left.whole && side.left.part && side.more.whole && side.more.part)) bad.push("two or more stories on each side, but not both words on both sides");
  return bad;
}
/* (6) keys: distinct within a session; a twin's or look-again's key is never a key met that day */
function keyFails(base, extra) {
  var bad = [], seen = {};
  base.forEach(function (it) { if (seen[it.meta.key]) bad.push("a repeated key in the session (" + it.meta.key + ")"); seen[it.meta.key] = 1; });
  extra.forEach(function (it) { if (seen[it.meta.key]) bad.push("a twin or look-again key met earlier that day (" + it.meta.key + ")"); seen[it.meta.key] = 1; });
  return bad;
}
/* (7) the bank: every setting has whole-asked and part-asked stories; every frame's text carries exactly its tag;
   every kind has a frame with no "left"/"more"; both words sit on both sides */
function bankFails(bank, side) {
  var bad = [], bySet = {}, wordSide = { left: {}, more: {} }, noneKind = {};
  bank.forEach(function (fm) {
    var sd = side[fm.kind]; (bySet[fm.set] = bySet[fm.set] || {})[sd] = 1;
    var s = sd === "whole" ? fm.f(37, 25) : fm.f(62, 37), t = s.join(" ");
    var hasL = /\bleft\b/i.test(t), hasM = /\bmore\b/i.test(t);
    if ((fm.word === "left") !== hasL || (fm.word === "more") !== hasM) bad.push("frame " + fm.set + "/" + fm.kind + " text does not match its tag " + fm.word);
    if (fm.word !== "none") wordSide[fm.word][sd] = 1; else noneKind[fm.kind] = 1;
    if (s.length !== 3 || !/\?$/.test(s[2])) bad.push("frame " + fm.set + "/" + fm.kind + " is not 2 + 1");
  });
  Object.keys(bySet).forEach(function (k) { if (!bySet[k].whole || !bySet[k].part) bad.push("setting " + k + " has stories on one side only"); });
  Object.keys(side).forEach(function (k) { if (!noneKind[k]) bad.push("kind " + k + " has no frame without left/more"); });
  ["left", "more"].forEach(function (w) { if (!wordSide[w].whole || !wordSide[w].part) bad.push('"' + w + '" is not on both sides of the bank'); });
  return bad;
}

/* ---------- one item; returns its failures (so a broken control can call it) ---------- */
function checkItem(it, where, T) {
  var out = [];
  function F(c, what) { SUB.n += 1; if (!c) out.push(where + ": " + what); return c; }
  var m = it.meta, p = m.p, a = m.args || {};
  F(Array.isArray(it.prompt) && it.steps.length > 0, "shape");
  /* the problem */
  F(p.W === p.a + p.b && p.a !== p.b && p.a > 0 && p.b > 0, "whole = part + part, parts differ");
  F(p.key === (p.asked === "whole" ? p.W : p.b), "key is the asked value");
  if (p.asked === "part") F(p.k === p.a, "known part");
  var rg = m.promoted ? "r100" : a.range || (m.gen === "ckValue" ? "r1000" : "");
  if (m.promoted) F(a.range === "r20", "only a within-20 draw may step up");
  if (rg === "r20") F(p.W >= 11 && p.W <= 20 && Math.min(p.a, p.b) >= 2, "range within 20");
  if (rg === "r100") F(p.W >= 30 && p.W <= 99 && Math.min(p.a, p.b) >= 10 && p.a % 10 && p.b % 10, "range within 100");
  if (rg === "r1000") F(p.W >= 230 && p.W <= 999 && Math.min(p.a, p.b) >= 101 && p.a % 100 && p.b % 100 && p.W % 100, "range three-digit, no round hundreds");
  var car = (function () { var A = D(p.a), B = D(p.b), c1 = A[2] + B[2] >= 10 ? 1 : 0, c2 = A[1] + B[1] + c1 >= 10 ? 1 : 0; return c1 + c2; })();
  var tr = a.tr || (m.gen === "ckValue" ? "some" : "any");
  F(tr === "any" || (tr === "none" && car === 0) || (tr === "some" && car >= 1) || (tr === "two" && car === 2) || (tr === "one" && car === 1) || (tr === "atmost1" && car <= 1), "trades as promised (" + tr + ")");
  var sk = keyFromScreen(it, F);
  if (sk !== null) F(sk === p.key, "key recomputed from the screen (" + sk + " vs " + p.key + ")");
  if (it.story) {
    F(p.asked === "whole" ? !!WHOLE_K[m.story] : !!PART_K[m.story], "story kind matches the asked part");
    F(it.prompt.length === 3 && /\.$/.test(it.prompt[0]) && /\.$/.test(it.prompt[1]) && /\?$/.test(it.prompt[2]) && it.prompt[2].indexOf("?") === it.prompt[2].length - 1, "story is two sentences and one question");
  }
  /* figures: the asked slot empty / "?" and the key nowhere on them */
  var f = it.figure;
  if (f && f.type === "bond") {
    var b = f.bond;
    if (p.asked === "whole") F(b.whole === null && b.parts.indexOf(p.a) >= 0 && b.parts.indexOf(p.b) >= 0, "bond: whole circle empty");
    else F(b.whole === p.W && b.parts.indexOf(null) >= 0 && b.parts.indexOf(p.k) >= 0, "bond: one part empty");
    F([b.whole].concat(b.parts).indexOf(p.key) < 0, "bond shows the key");
  }
  if (f && f.type === "bar") checkBar(f.bar, p, F, "figure bar", true);
  if (f && f.type === "eq") F(f.parts.indexOf("□") >= 0 && f.parts.indexOf(p.key) < 0, "sentence shows the key");
  /* steps */
  it.steps.forEach(function (st, j) {
    var W = "step " + (j + 1) + " (" + (st.role || st.type) + ")";
    if (!st.ungraded) {
      F(st.hints && st.hints.length === 4, W + ": four rungs");
      if (st.hints && st.hints.length === 4) {
        for (var r = 0; r < 3; r++) F(!/\d/.test(st.hints[r]), W + ": rung " + (r + 1) + " has a number");
        F(/\?$/.test(st.hints[0]), W + ": rung 1 is a question");
      }
    }
    if (st.bond) { F(st.bond.whole === null || st.bond.parts.indexOf(null) >= 0, W + ": bond with an empty circle"); F([st.bond.whole].concat(st.bond.parts).indexOf(p.key) < 0, W + ": bond shows the key"); }
    if (st.type === "pick") checkPick(st, it, p, F, W, T);
    if (st.type === "num") checkNum(st, it, p, F, W);
    if (st.type === "label") checkLabel(st, p, F, W);
  });
  /* text */
  var texts = textsOf(it);
  texts.forEach(function (t) {
    sentencesOf(t).forEach(function (s) { F(words(s) <= 10, "sentence over 10 words: " + s); });
    F(!KEYWORD.test(t), "key-word phrase: " + t);
    F(!G1U02.test(t), "a G1-U02 setting word: " + t);
  });
  F(!hasNum(it.say, p.key), "read-aloud says the key");
  F(!saysTied(it.say), "read-aloud ties whole/part to a value or the ?: " + it.say);
  screenNounFails(it).forEach(function (x) { F(false, x); });
  if (p.key >= 0) it.steps.forEach(function (st) {
    [st.label, st.pre, st.post].forEach(function (t) { if (t) F(!hasNum(t, p.key), "a label states the key: " + t); });
  });
  /* exam values: tier 2 on operands, keys, choices and shown values; tier 1 anywhere */
  var fields = [p.W, p.a, p.b, p.key];
  it.steps.forEach(function (st) {
    (st.choices || []).forEach(function (c) { if (typeof c.v === "number") fields.push(c.v); if (c.t) nums(c.t).forEach(function (v) { fields.push(v); }); if (c.bar) [c.bar.whole].concat(c.bar.parts).forEach(function (x) { if (x !== "?") fields.push(+x); }); });
    (st.diag || []).forEach(function (d) { fields.push(d.v); });
    (st.chips || []).forEach(function (c) { if (c !== "?") fields.push(+c); });
    nums(st.pre || "").concat(nums(st.post || "")).forEach(function (v) { fields.push(v); });
  });
  texts.forEach(function (t) { nums(t).forEach(function (v) { fields.push(v); }); });
  var hit1 = 0, hit2 = 0;
  fields.forEach(function (v) { if (EXAM[v]) hit2 += 1; if (TIER1[v]) hit1 += 1; });
  if (T) { examHits.tier1 += hit1; examHits.tier2 += hit2; }
  F(hit2 === 0, "an exam value is an operand, key, choice or shown value (" + hit2 + " hit(s); values not printed)");
  F(hit1 === 0, "a tier-1 exam value appears (" + hit1 + " hit(s); values not printed)");
  return out;
}
function checkBar(bar, p, F, W, supplied) {
  var labels = [bar.whole].concat(bar.parts);
  if (p.asked === "whole") F(bar.whole === "?" && bar.parts.indexOf(String(p.a)) >= 0 && bar.parts.indexOf(String(p.b)) >= 0, W + ": ? over the whole bar");
  else F(bar.whole === String(p.W) && bar.parts.indexOf("?") >= 0 && bar.parts.indexOf(String(p.k)) >= 0, W + ": ? on a part");
  F(labels.indexOf(String(p.key)) < 0, W + ": the asked slot is filled with the key");
  if (supplied) {
    var vals = bar.parts.map(function (x) { return x === "?" ? p.key : +x; });
    F(bar.sizes && bar.sizes[0] === vals[0] && bar.sizes[1] === vals[1], W + ": part widths follow the values");
    var fr = G.barFrac(bar.sizes), want = clamp(vals[0] / (vals[0] + vals[1]));
    F(Math.abs(fr - want) < 1e-9 && fr >= 0.18 && fr <= 0.82, W + ": proportion and the 18 % floor");
  }
}
function checkPick(st, it, p, F, W, T) {
  F(st.key >= 0 && st.key < st.choices.length && st.choices[st.key].rule === "key", W + ": key index");
  F(st.choices.filter(function (c) { return c.rule === "key"; }).length === 1, W + ": exactly one key");
  var texts = st.choices.map(function (c) { return c.t; });
  F(new Set(texts).size === texts.length, W + ": choices differ");
  var gk = G.grade(st, st.key);
  F(gk.right, W + ": the grader rejects the key");
  st.choices.forEach(function (c, i) { if (i !== st.key) { var g = G.grade(st, i); F(!g.right && g.rule === c.rule, W + ": the grader accepts a wrong choice or loses its rule"); F(!!c.msg, W + ": a wrong choice has no clue"); } });
  if (st.role === "decide") {
    F(st.choices.length === 2 && st.choices[0].t === "The whole" && st.choices[1].t === "A part", W + ": fixed two-way order");
    F(st.key === (p.asked === "whole" ? 0 : 1), W + ": decide key");
    var wrong = st.choices[1 - st.key].rule;
    F(p.asked === "whole" ? /^(qAsPart|boxAsPart)$/.test(wrong) : /^(qAsWhole|boxAsWhole)$/.test(wrong), W + ": decide rule");
    var r4 = it.story ? "The question asks for " + (p.asked === "whole" ? "the whole." : "a part.") : "The " + (it.meta.gen === "box" ? "box" : "?") + " is " + (p.asked === "whole" ? "the whole." : "a part.");
    F(st.hints[3] === r4, W + ": rung 4 is the answer");
  }
  if (st.role === "sentence") {
    st.choices.forEach(function (c, i) {
      var tr = sentenceTrue(c.parts, p.key);
      F(i === st.key ? tr : !tr, W + ": " + (i === st.key ? "the key sentence is false" : "a wrong sentence is true") + ": " + c.t);
      F(c.t === c.parts[0] + " " + c.parts[1] + " " + c.parts[2] + " = " + c.parts[3], W + ": sentence text");
      if (i === st.key) return;
      var big = Math.max(p.a, p.b), small = Math.min(p.a, p.b), want = {
        addSeen: [p.W, "+", p.k, "?"], qAsWhole: ["?", "−", p.k, p.W], wholeAsPart: [p.W, "+", "?", p.k],
        takeSeen: [big, "−", small, "?"], bigPartWholeAdd: [small, "+", "?", big], bigPartWholeTake: [big, "−", "?", small]
      }[c.rule];
      F(want && JSON.stringify(want) === JSON.stringify(c.parts), W + ": sentence rule " + c.rule + " recomputed differently");
      F(p.asked === "part" ? /^(addSeen|qAsWhole|wholeAsPart)$/.test(c.rule) : /^(takeSeen|bigPartWholeAdd|bigPartWholeTake)$/.test(c.rule), W + ": sentence rule fits the asked part");
    });
    F(st.hints[3].indexOf(st.choices[st.key].t) >= 0, W + ": rung 4 shows the key sentence");
  }
  if (st.role === "whole") {
    var kt = p.asked === "whole" ? "The ?" : String(p.W);
    F(st.choices[st.key].t === kt, W + ": which-is-the-whole key");
    st.choices.forEach(function (c, i) {
      if (i === st.key) return;
      if (c.rule === "partAsWhole") F(c.t === String(p.a) || c.t === String(p.b) || c.t === String(p.k), W + ": partAsWhole shows a part");
      else F(c.rule === "qAsWhole" && c.t === "The ?" && p.asked === "part", W + ": qAsWhole only when the ? is a part");
    });
  }
  if (st.role === "match") {
    var keyB = p.asked === "whole" ? { whole: "?", parts: [String(p.a), String(p.b)] } : { whole: String(p.W), parts: [String(p.k), "?"] };
    F(JSON.stringify(st.choices[st.key].bar) === JSON.stringify(keyB), W + ": the key bar");
    var big2 = String(Math.max(p.a, p.b)), small2 = String(Math.min(p.a, p.b));
    var WANT = { qOnPartBig: { whole: big2, parts: [small2, "?"] }, qOnPartSmall: { whole: small2, parts: [big2, "?"] },
      qOnBrace: { whole: "?", parts: [String(p.W), String(p.k)] }, wholeAsPart: { whole: String(p.k), parts: [String(p.W), "?"] } };
    st.choices.forEach(function (c, i) { if (i !== st.key) F(WANT[c.rule] && JSON.stringify(WANT[c.rule]) === JSON.stringify(c.bar), W + ": bar rule " + c.rule + " recomputed differently"); });
  }
  if (st.role === "shape") {
    F(st.warm === true, W + ": the shape is a warm-up (never counted)");
    F(st.choices[st.key].shape === "one2", W + ": shape key");
    st.choices.forEach(function (c, i) { if (i !== st.key) F((c.rule === "twoBars" && c.shape === "two") || (c.rule === "threeParts" && c.shape === "one3"), W + ": shape rule"); });
  }
  if (st.role === "value") {
    F(st.numeric && st.choices[st.key].v === p.key, W + ": value key");
    var vs = st.choices.map(function (c) { return c.v; });
    F(new Set(vs).size === 4, W + ": four different values");
    st.choices.forEach(function (c, i) {
      if (i === st.key) return;
      F(POOL.indexOf(c.rule) >= 0 && RULE[c.rule](p) === c.v, W + ": pool value " + c.rule + " recomputed differently (" + c.v + ")");
      F(c.v > 0 && c.v !== p.key, W + ": pool value positive and not the key");
    });
    var rank = vs.filter(function (v) { return v < p.key; }).length;
    F(rank === st.rank, W + ": recorded rank");
    if (T) T.tally("rank " + it.meta.gen, rank, 4);
    F(hasNum(st.hints[3], p.key), W + ": rung 4 shows the answer");
  }
  if (T && !st.two) T.tally((it.meta.gen + " " + st.role + " place"), st.key, st.choices.length);
  if (T && st.two) T.tally2((it.meta.gen + " decide"), st.key);
}
function checkNum(st, it, p, F, W) {
  if (st.role === "addback") {
    F(st.answer === p.W && st.addBack && st.addBack.k === p.k, W + ": add-back expects the whole");
    var from = it.steps[st.addBack.from];
    F(from && from.role === "find", W + ": add-back points at the answer step");
    F(G.grade(st, String(p.W), String(p.key)).right, W + ": add-back of the key");
    F(G.grade(st, String(p.key + 3 + p.k), String(p.key + 3)).right && !G.grade(st, String(p.W), String(p.key + 3)).right, W + ": add-back of his own answer");
    F(/^your answer \+ \d+ =$/.test(st.pre) && !st.post, W + ": one quantity");
    F(!G.grade(st, String(p.W), "").right, W + ": add-back with no answer to check is not right");
    F(st.hints[3].indexOf("=") < 0 && !hasNum(st.hints[3], p.W), W + ": rung 4 claims a sum it cannot know");
    return;
  }
  F(st.answer === p.key, W + ": answer is the key");
  F(G.grade(st, String(p.key)).right, W + ": the grader rejects the key");
  F(hasNum(st.hints[3], p.key), W + ": rung 4 shows the answer");
  var allowed = p.asked === "part" ? PART_RULES : p.W <= 20 ? ["takeWhenWhole", "countStartOn"] : WHOLE_RULES;
  if (it.meta.form === "a+b=?") allowed = WHOLE_RULES.slice(1);
  var seen = {}, lastIdx = -1;
  (st.diag || []).forEach(function (d) {
    F(allowed.indexOf(d.rule) >= 0, W + ": review rule " + d.rule + " not allowed here");
    F(RULE[d.rule] && RULE[d.rule](p) === d.v, W + ": review value " + d.rule + " recomputed differently (" + d.v + ")");
    F(d.v > 0 && d.v !== p.key && !seen[d.v], W + ": review value positive, not the key, not repeated");
    F(String(d.v).length <= st.max, W + ": a review value the box cannot take (" + d.v + ")");
    seen[d.v] = 1;
    var idx = allowed.indexOf(d.rule); F(idx > lastIdx, W + ": review values in priority order"); lastIdx = idx;
    var g = G.grade(st, String(d.v));
    F(!g.right && g.rule === d.rule, W + ": the grader accepts a rule value or loses its rule");
    F(!!d.msg && !/\d/.test(d.msg), W + ": review line has no number and is not empty");
  });
  /* collisions: every allowed rule that gives a fresh, unmasked value appears, the earlier rule winning */
  var want = [], seen2 = {}; seen2[p.key] = 1;
  allowed.forEach(function (nm) { var v = RULE[nm](p); if (v > 0 && !seen2[v] && !G.masked(v) && String(v).length <= st.max) { seen2[v] = 1; want.push(nm); } });
  F(JSON.stringify(want) === JSON.stringify((st.diag || []).map(function (d) { return d.rule; })), W + ": collisions resolved by priority");
  /* one quantity per answer box (S6) */
  F(!/\b(digits?|tens|ones|hundreds)\b/i.test([st.label, st.pre, st.post].join(" ")), W + ": a label that could ask for digits or places");
  if (it.story) F(/^[a-z]+\.$/.test(st.post) && st.pre === "" && st.post === it.meta.noun + ".", W + ": answer box names one thing (" + st.post + ")");
}
function checkLabel(st, p, F, W) {
  var whole = p.asked === "whole";
  var A = whole ? { whole: "?", parts: [String(p.a), String(p.b)] } : { whole: String(p.W), parts: [String(p.k), "?"] };
  F(JSON.stringify(st.answer) === JSON.stringify(A), W + ": label answer");
  F(JSON.stringify(st.chips.slice().sort()) === JSON.stringify([A.whole].concat(A.parts).sort()), W + ": chips are the three labels");
  F(st.asked === p.asked, W + ": asked");
  var sz = whole ? [p.a, p.b] : [p.k, p.key];
  F(st.sizes[0] === sz[0] && st.sizes[1] === sz[1], W + ": slot widths follow the values");
  var fr = G.barFrac(st.sizes);
  F(fr >= 0.18 && fr <= 0.82 && Math.abs(fr - clamp(sz[0] / (sz[0] + sz[1]))) < 1e-9, W + ": proportion and the 18 % floor");
  F(st.prefill === undefined && st.value === undefined, W + ": the bar is drawn empty");
  F(G.grade(st, { whole: A.whole, a: A.parts[1], b: A.parts[0] }).right, W + ": the grader rejects the parts swapped");
  F(G.grade(st, G.keyValue(st)).right, W + ": the grader rejects the key");
  if (whole) {
    var g1 = G.grade(st, { whole: String(p.a), a: "?", b: String(p.b) });
    F(!g1.right && g1.rule === "qOnPart", W + ": ? on a part when the whole is asked → qOnPart");
  } else {
    var g2 = G.grade(st, { whole: "?", a: String(p.W), b: String(p.k) }), g3 = G.grade(st, { whole: String(p.k), a: String(p.W), b: "?" });
    F(!g2.right && g2.rule === "qOnBrace", W + ": ? over the bar when a part is asked → qOnBrace");
    F(!g3.right && g3.rule === "partOnBrace", W + ": a part over the bar → partOnBrace");
  }
  F(st.hints[3].indexOf(whole ? String(p.a) : String(p.W)) >= 0, W + ": rung 4 shows the bar");
}

/* ---------- tallies ---------- */
function Tallies() { this.t = {}; this.t2 = {}; }
Tallies.prototype.tally = function (name, k, n) { var e = this.t[name] = this.t[name] || { c: new Array(n).fill(0), n: 0 }; e.c[k] += 1; e.n += 1; };
Tallies.prototype.tally2 = function (name, k) { var e = this.t2[name] = this.t2[name] || { c: [0, 0], n: 0 }; e.c[k] += 1; e.n += 1; };
Tallies.prototype.report = function (fail) {
  var self = this, outl = [];
  Object.keys(this.t).sort().forEach(function (k) {
    var e = self.t[k], mx = Math.max.apply(null, e.c) / e.n;
    fail(mx <= 0.40, k + ": one place/rank holds the key on " + (100 * mx).toFixed(1) + " % of draws");
    outl.push(k + " " + e.c.map(function (c) { return (100 * c / e.n).toFixed(0) + "%"; }).join("/") + " (n " + e.n + ")");
  });
  Object.keys(this.t2).sort().forEach(function (k) {
    var e = self.t2[k], mx = Math.max.apply(null, e.c) / e.n;
    fail(mx <= 0.60, k + ": the two-way key sits on one side " + (100 * mx).toFixed(1) + " % of draws");
    outl.push(k + " whole/part " + e.c.map(function (c) { return (100 * c / e.n).toFixed(0) + "%"; }).join("/") + " (n " + e.n + ")");
  });
  return outl;
};

/* ---------- session-level checks ---------- */
function sessionChecks(b, F) {
  var s = b.s, its = b.items, tuples = {};
  F(its.length >= 5 && its.length <= 8, "s" + s + ": 5-8 questions");
  var all = its.slice();
  if (!b.held) its.forEach(function (it, i) { all.push(G.twin(b, i, 1)); all.push(G.twin(b, i, 2)); });
  all.forEach(function (it) { F(!tuples[it.meta.tuple], "s" + s + ": a repeated operand tuple"); tuples[it.meta.tuple] = 1; });
  keyFails(its, all.slice(its.length)).forEach(function (x) { F(false, "s" + s + ": " + x); });
  wordFails(its).forEach(function (x) { F(false, "s" + s + " form " + b.counter + ": " + x); });
  if (s >= 2 && s <= 6) its.forEach(function (it) { if (it.meta.p.W >= 100) F(G.carries(it.meta.p.a, it.meta.p.b) <= 1, "s" + s + ": a three-digit item with two trades before session 8"); });
  var shapes = []; its.forEach(function (it, i) { it.steps.forEach(function (st) { if (st.role === "shape") shapes.push(i); }); });
  var firstBuild = -1; its.forEach(function (it, i) { if (firstBuild < 0 && it.meta.mode === "build" && !b.held) firstBuild = i; });
  F(firstBuild < 0 ? shapes.length === 0 : shapes.length === 1 && shapes[0] === firstBuild, "s" + s + ": the warm-up shape once, on the first build question");
  var AVS = {}; G.AVOID.forEach(function (v) { AVS[v] = 1; });
  its.forEach(function (it) {
    var t = it.meta.tuple.split("|").map(Number);
    F(G.laneOf(t[0], t[1]) === (s + b.counter) % 2, "s" + s + ": a base tuple outside its lane");
    F(!b.exclude[it.meta.tuple], "s" + s + ": an excluded tuple");
    t.forEach(function (v) { F(!(AVS[v] && (v >= 100 || (s === 10 && v >= 21))), "s" + s + ": a worked-example number as an operand"); });
  });
  var gens = its.map(function (it) { return it.meta.gen; }), sk = its.map(function (it) { return it.skill; });
  if (s === 1) F(gens.every(function (g) { return g === "bond"; }), "s1 all bonds");
  if (s === 2) F(gens.every(function (g) { return g === "box"; }) && new Set(its.map(function (it) { return it.meta.form; })).size >= 5, "s2 boxes in at least 5 places");
  if (s === 3) {
    F(its.slice(0, 2).every(function (it) { return it.meta.args.range === "r20"; }) && its.slice(2).every(function (it) { return it.meta.p.W > 20 && it.meta.p.W < 100; }) && gens.filter(function (g) { return g === "match"; }).length === 3, "s3 shape (within 20 first, 3 matches)");
    var ms = its.filter(function (it) { return it.meta.gen === "match"; }).map(function (it) { return it.meta.p.asked; });
    F(ms.indexOf("whole") >= 0 && ms.indexOf("part") >= 0, "s3 matches on both sides");
  }
  if (s === 4) F(sk.slice(0, 6).every(function (k) { return k === "labelWhole"; }) && sk[6] === "labelPart" && its.length === 7, "s4 six whole, then one part");
  if (s === 5) F(sk.slice(0, 6).every(function (k) { return k === "labelPart"; }) && sk[6] === "labelWhole" && its.length === 7, "s5 six part, then one whole");
  if (s === 6) F(sk.every(function (k) { return k === "decide"; }), "s6 decide + label");
  if (s === 7 || s === 8) F(sk.every(function (k) { return k === "build"; }) && its.length === 5, "s" + s + " five build questions");
  if (s === 8) F(its.every(function (it) { return G.carries(it.meta.p.a, it.meta.p.b) >= 1; }) && its.filter(function (it) { return G.carries(it.meta.p.a, it.meta.p.b) === 2; }).length >= 2, "s8 trades");
  if (s === 9) {
    F(its.filter(function (it) { return it.meta.mode === "build"; }).length === 3 && its.filter(function (it) { return it.meta.mode === "solve"; }).length === 3 && its.filter(function (it) { return it.paper; }).length === 1, "s9 3 model + 3 solve + 1 paper");
    F(its.some(function (it) { return it.meta.change; }) && its.some(function (it) { return it.meta.p.asked === "whole"; }), "s9 change unknown and whole unknown present");
    its.forEach(function (it) { if (it.paper) F(it.steps[0].type === "paper" && it.steps[0].ungraded, "s9 paper step ungraded"); });
  }
  if (s === 10) {
    var total = 0; its.forEach(function (it) { it.steps.forEach(function (st) { if (!st.ungraded) { F(st.pts > 0, "s10 every graded step has points"); total += st.pts || 0; } }); });
    F(total === 15, "s10 15 points (" + total + ")");
    F(its.map(function (it) { return it.section; }).join("") === "AAABBBC", "s10 sections");
    its.forEach(function (it) { it.steps.forEach(function (st) { F(!st.selfCheck && !st.optional && !st.bond && st.role !== "shape", "s10 no self-check, optional step, bond or shape in the check"); }); });
  }
  return tuples;
}

/* ========================= run ========================= */
function main() {
  log("BAR-MODELS-PRACTICE generator check · " + new Date().toISOString());
  log("page: " + path.relative(ROOT, PAGE) + " · forms per session: " + N_FORMS);
  log("");
  log("1. Exam list (read at run time; values never printed)");
  log("  values read: " + EXL.all.length + " (gate section " + EXL.fromSection + "; written answers " + (EXL.written ? "found" : "MISSING") + "; subtraction page list " + (EXL.page ? "found" : "MISSING") + "); tier 1: " + Object.keys(TIER1).length);
  ok(EXL.fromSection > 10 && EXL.written && EXL.page, "the exam list could not be read in full");
  var cov = EXL.all.filter(function (v) { return G.masked(v); }).length;
  ok(cov === EXL.all.length, "the page's mask misses " + (EXL.all.length - cov) + " listed value(s)");
  log("  page mask covers " + cov + " of " + EXL.all.length + " listed values; numbers 1-999 masked: " + (function () { var c = 0; for (var v = 1; v <= 999; v++) if (G.masked(v)) c++; return c; })());
  ok(G.bucket(123) === bucketOf(123) && G.bucket(901) === bucketOf(901), "page and checker hash differ");
  var srcHits = 0;
  [PAGE, SPEC, DUMP].forEach(function (fp) { if (!fs.existsSync(fp)) return; nums(fs.readFileSync(fp, "utf8")).forEach(function (v) { if (TIER1[v]) srcHits += 1; }); });
  ok(srcHits === 0, "a tier-1 exam value is written in the page, the spec or the dump (" + srcHits + ")");
  log("  tier-1 values written in the page, spec or dump: " + srcHits);
  log("");
  log("1b. The story bank (" + G.BANK.length + " frames, " + Object.keys(G.BANK.reduce(function (o, f) { o[f.set] = 1; return o; }, {})).length + " settings)");
  var bf = bankFails(G.BANK, G.SIDE);
  bf.forEach(function (x) { ok(false, "bank: " + x); });
  G.BANK.forEach(function (fm) { var sd = G.SIDE[fm.kind], t = sd === "whole" ? fm.f(37, 25) : fm.f(62, 37); t.forEach(function (x) { ok(words(x) <= 10 || /\d{3}/.test(x), "bank sentence over 10 words: " + x); ok(!KEYWORD.test(x) && !G1U02.test(x) && !NOUNS.box.test(x), "bank: a key-word, G1-U02 or 'box' word: " + x); }); });
  log("  every setting on both sides, every frame's text = its tag, a plain frame for every kind, left and more on both sides: " + (bf.length ? bf.length + " failure(s)" : "yes"));

  log("");
  log("2. Sessions 1-13 × " + N_FORMS + " forms (each with its twins and look-agains)");
  var T = new Tallies(), nItems = 0, throws = 0, prevTuples = {}, EXC = {}, PROMOTED = { n: 0 }, SETSIDE = {};
  var t0 = Date.now();
  for (var s = 1; s <= 13; s++) {
    var sItems = 0;
    for (var c = 0; c < N_FORMS; c++) {
      var b;
      try {
        var opts = {};
        if (s >= 11) {
          var MISSED = [[], [{ skill: "build", n: 3 }, { skill: "box", n: 1 }], [{ skill: "labelPart", n: 2 }], [{ skill: "decide", n: 1 }, { skill: "match", n: 1 }, { skill: "solve", n: 1 }, { skill: "bond", n: 2 }, { skill: "read", n: 1 }]];
          opts.missed = MISSED[c % MISSED.length];
          if (!EXC[c]) { var ex = {}; for (var q = 1; q <= 10; q++) G.buildSession(q, c, {}).items.forEach(function (it) { ex[it.meta.tuple] = 1; }); EXC[c] = ex; }
          opts.exclude = EXC[c];
        }
        b = G.buildSession(s, c, opts);
      } catch (e) { throws += 1; ok(false, "s" + s + " form " + c + " throws: " + e.message); continue; }
      var tuples = sessionChecks(b, ok);
      if (s >= 11) {
        if (opts.missed.length) ok(b.items[0].skill === opts.missed[0].skill, "s" + s + ": extra practice starts with the most-missed skill");
        Object.keys(tuples).forEach(function (k) { ok(!opts.exclude[k], "s" + s + ": an extra-practice tuple from an earlier session"); });
      }
      if (c > 0 && s <= 10) ok(shared(prevTuples[s], b) === 0, "s" + s + " form " + c + ": shares a tuple with the form before");
      if (s <= 10) prevTuples[s] = b;
      if (s === 4) { /* within 20: sessions 3 and 4 of one form never share a pair */
        var r3 = {}; G.buildSession(3, c, {}).items.forEach(function (it) { if (it.meta.args.range === "r20") r3[it.meta.tuple] = 1; });
        b.items.forEach(function (it) { if (it.meta.args.range === "r20") ok(!r3[it.meta.tuple], "s4 form " + c + ": a within-20 pair from session 3"); });
      }
      b.items.concat(b.held ? [] : b.items.map(function (it, i) { return G.twin(b, i, 1); }).concat(b.items.map(function (it, i) { return G.twin(b, i, 2); }))).forEach(function (it) {
        if (it.meta.promoted) PROMOTED.n += 1;
        if (it.story) { var sd = it.meta.p.asked, st2 = SETSIDE[it.meta.set] = SETSIDE[it.meta.set] || { whole: 0, part: 0 }; st2[sd] += 1; }
      });
      var list = b.items.slice();
      if (!b.held) b.items.forEach(function (it, i) { list.push(G.twin(b, i, 1)); list.push(G.twin(b, i, 2)); });
      list.forEach(function (it) {
        try { checkItem(it, "s" + s + "/" + c + "/" + it.id, T).forEach(function (msg) { ok(false, msg); }); }
        catch (e) { throws += 1; ok(false, "s" + s + "/" + c + "/" + it.id + " check throws: " + e.message); }
        ok(true, "item");
        sItems += 1;
      });
    }
    nItems += sItems;
    log("  session " + s + ": " + sItems + " items checked");
  }
  log("  within-20 draws that stepped up to within 100 (twins and look-agains only, recorded): " + PROMOTED.n);
  var setLine = Object.keys(SETSIDE).sort().map(function (k) { var e = SETSIDE[k], f = e.whole / (e.whole + e.part); ok(f >= 0.15 && f <= 0.85, "setting " + k + " predicts the side (" + (100 * f).toFixed(0) + " % whole)"); return k + " " + (100 * f).toFixed(0) + "%"; });
  log("  share of whole-asked stories per setting (all sessions): " + setLine.join(", "));
  log("  " + nItems + " items, " + throws + " throws, " + ((Date.now() - t0) / 1000).toFixed(1) + " s; exam hits: tier 1 " + examHits.tier1 + ", tier 2 " + examHits.tier2);
  log("");
  log("3. Choice order (key place ≤ 40 %, numeric rank ≤ 40 %, two-way ≤ 60 %)");
  T.report(ok).forEach(function (l) { log("  " + l); });

  /* ================= broken controls ================= */
  log("");
  log("4. Broken controls (each must fire)");
  var base4 = G.buildSession(4, 0, {}), base3 = G.buildSession(3, 0, {}), base10 = G.buildSession(10, 0, {});
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function fired(hit, name) { CONTROLS.n += 1; if (hit) CONTROLS.fired += 1; ok(hit, "control did NOT fire: " + name); log("  " + (hit ? "fired" : "MISSING") + ": " + name); }
  function fires(name, it, re) { var f = checkItem(it, "control", null); fired(f.some(function (m) { return re.test(m); }), name); }
  var c1 = clone(base4.items[2]); c1.steps.forEach(function (st) { if (st.role === "find") st.answer += 1; });
  fires("a corrupted key", c1, /answer is the key/);
  var c2 = clone(base4.items[3]); var fd = c2.steps.filter(function (st) { return st.role === "find"; })[0]; fd.diag[0].v += 1;
  fires("a review value whose rule gives another number", c2, /recomputed differently/);
  var c2b = clone(base10.items[0]); var pk = c2b.steps[0], wi = pk.key === 0 ? 1 : 0; pk.choices[wi].v += 1; pk.choices[wi].t = String(pk.choices[wi].v);
  fires("a pool value whose rule gives another number", c2b, /pool value .* recomputed differently/);
  var c3 = clone(base3.items[3]); var bar = c3.figure.bar; if (bar.whole === "?") bar.whole = String(c3.meta.p.key); else bar.parts[bar.parts.indexOf("?")] = String(c3.meta.p.key);
  fires("a filled asked slot", c3, /asked slot is filled|\? over the whole bar|\? on a part/);
  var c4 = clone(base4.items[1]); c4.prompt[0] = "A very big library in our town has " + c4.meta.p.a + " picture books.";
  fires("an 11-word sentence", c4, /over 10 words/);
  var c5 = clone(base4.items[1]); c5.steps[0].hints[1] = "Altogether means add.";
  fires("“altogether means add”", c5, /key-word phrase/);
  var t1 = Object.keys(TIER1).map(Number)[3 % Object.keys(TIER1).length];
  var c6 = clone(base10.items[3]); var oldA = c6.meta.p.a;
  c6.prompt = c6.prompt.map(function (s) { return s.split(String(oldA)).join(String(t1)); }); c6.say = c6.say.split(String(oldA)).join(String(t1));
  c6.meta.p.a = t1; c6.meta.p.W = t1 + c6.meta.p.b; c6.meta.p.key = c6.meta.p.W;
  fires("a fixture item carrying a tier-1 value (built at run time from the list)", c6, /tier-1 exam value appears/);
  var c7 = clone(base4.items[0]); var sst = c7.steps.filter(function (st) { return st.role === "sentence"; })[0]; var wj = sst.key === 0 ? 1 : 0;
  var kp = sst.choices[sst.key].parts; sst.choices[wj].parts = [kp[2], "+", kp[0], "?"]; sst.choices[wj].t = kp[2] + " + " + kp[0] + " = ?";
  fires("a wrong sentence that is true", c7, /wrong sentence is true/);
  var c8 = clone(base4.items[1]); c8.prompt[0] = "Five ducks swim on a pond.";
  fires("a G1-U02 setting", c8, /G1-U02 setting/);
  var c9 = clone(base4.items[1]); c9.steps[0].hints[1] = "Count up " + c9.meta.p.a + " jumps.";
  fires("a number in rung 2", c9, /rung 2 has a number/);
  var base1 = G.buildSession(1, 0, {}), base6 = G.buildSession(6, 0, {});
  var c10 = clone(base1.items[0]); c10.say = "Look at the bond and its empty circle. The parts are " + c10.meta.p.a + " and " + c10.meta.p.b + ".";
  fires("a read-aloud line tying “part” to the numbers before the tap", c10, /read-aloud ties whole\/part/);
  var c11 = clone(base6.items[0]); c11.steps[0].hints[1] = "The ? is a part of the story.";
  fires("a story help line naming the ? before any bar is on the screen", c11, /names "\?" not on the screen/);
  var c12 = clone(base6.items[0]); c12.steps[0].hints[2] = "Look at the bar.";
  fires("a help line naming the bar before it is drawn", c12, /names "bar" not on the screen/);
  /* the words: strip "left" from every part-asked story of a form that has it on both sides */
  var wf = false;
  for (var c13 = 0; c13 < 50 && !wf; c13++) {
    var f6 = G.buildSession(6, c13, {}), its6 = clone(f6.items);
    if (!its6.some(function (it) { return it.story && it.meta.p.asked === "whole" && storyWords(it).left; })) continue;
    its6.forEach(function (it) { if (it.story && it.meta.p.asked === "part") it.prompt = it.prompt.map(function (x) { return x.replace(/\bleft\b/g, "here"); }); });
    wf = wordFails(its6).some(function (m) { return /one side only|does not carry/.test(m); });
  }
  fired(wf, "“left” only in whole-asked stories (part-side “left” removed)");
  var bank2 = G.BANK.filter(function (fm) { return !(fm.set === "library" && G.SIDE[fm.kind] === "part"); });
  fired(bankFails(bank2, G.SIDE).some(function (m) { return /library has stories on one side only/.test(m); }), "a setting whose stories all ask for the same side");
  var tb = G.buildSession(4, 3, {}), tw = clone(G.twin(tb, 0, 1)); tw.meta.key = tb.items[0].meta.key;
  fired(keyFails(tb.items, [tw]).length > 0, "a twin whose key is the answer just shown");
  var dupK = clone(tb.items); dupK[1].meta.key = dupK[0].meta.key;
  fired(keyFails(dupK, []).length > 0, "two questions with the same key in one session");
  /* mask control: a mask with one listed value's bit cleared must fail coverage */
  var victim = EXL.all[0], b0 = bucketOf(victim), hex = G.MASK, ci = b0 >> 2, nib = parseInt(hex.charAt(ci), 16) & ~(1 << (b0 & 3));
  var bad = hex.slice(0, ci) + nib.toString(16) + hex.slice(ci + 1);
  var badCov = EXL.all.filter(function (v) { return maskedBy(bad, v); }).length;
  fired(badCov < EXL.all.length, "a mask with one listed value's bit cleared (coverage " + badCov + " of " + EXL.all.length + ")");
  /* place control: a key always first */
  var TC = new Tallies(); for (var z = 0; z < 100; z++) TC.tally("control place", 0, 4);
  var placeFired = false; TC.report(function (cnd) { if (!cnd) placeFired = true; });
  fired(placeFired, "a key always in the first place");
  /* tuple control: a session with a question repeated */
  var dupB = G.buildSession(4, 0, {}); dupB.items[1] = dupB.items[0];
  var dupFired = false; sessionChecks(dupB, function (cnd, w) { if (!cnd && /repeated operand tuple/.test(w)) dupFired = true; return cnd; });
  fired(dupFired, "a session with a repeated tuple");
  /* fresh-form control: a re-sit that re-uses the lane of the form before (same counter) must fail the consecutive-form gate */
  fired(shared(G.buildSession(5, 7, {}), G.buildSession(5, 7, {})) > 0, "a re-sit that repeats the form before (same lane and draw)");
  /* extra-practice control: built without the exclusion, it must share a tuple with sessions 1-10 for some form */
  var exFired = false;
  for (var e = 0; e < 400 && !exFired; e++) { var exc = {}; for (var q = 1; q <= 10; q++) G.buildSession(q, e, {}).items.forEach(function (it) { exc[it.meta.tuple] = 1; }); G.buildSession(11, e, { missed: [{ skill: "bond", n: 3 }] }).items.forEach(function (it) { if (exc[it.meta.tuple]) exFired = true; }); }
  fired(exFired, "an extra-practice form built without its exclusion list");

  log("");
  var kinds = Object.keys(failKinds);
  if (kinds.length) { log("Failure kinds:"); kinds.forEach(function (k) { log("  " + failKinds[k] + " × " + k); }); }
  log((fails === 0 ? "PASS" : "FAIL") + " bar_models_check: " + (checks + SUB.n) + " assertions, " + fails + " failures; " + nItems + " items over 13 sessions × " + N_FORMS + " forms (with twins and look-agains); exam values shown: tier 1 " + examHits.tier1 + ", tier 2 " + examHits.tier2 + "; broken controls fired " + CONTROLS.fired + " of " + CONTROLS.n);
  fs.writeFileSync(OUT, lines.join("\n") + "\n");
  process.exit(fails === 0 ? 0 : 1);
}

/* ---------- a readable dump ---------- */
function barText(b) { return "[ over the bar: " + b.whole + " ]  [ " + b.parts[0] + " | " + b.parts[1] + " ]" + (b.sizes ? "  widths " + b.sizes.join(":") + " (left part " + Math.round(100 * G.barFrac(b.sizes)) + " %)" : ""); }
function dumpItem(it, tag) {
  var L = [];
  var m = it.meta, p = m.p;
  L.push("  " + tag + " " + it.id + " · " + it.skill + (it.section ? " · Section " + it.section : "") + " · " + (p.asked === "whole" ? "the whole is asked" : "a part is asked") + " · W " + p.W + " = " + p.a + " + " + p.b + " · key " + p.key + (m.story ? " · story " + m.story + " · setting " + m.set + " · word " + (m.word || "none") : "") + (m.form ? " · form " + m.form : "") + (m.promoted ? " · stepped up to within 100" : ""));
  L.push("    Teacher: " + it.prompt.join(" "));
  L.push("    Read aloud: " + it.say);
  var f = it.figure;
  if (f && f.type === "bond") L.push("    Bond: top " + (f.bond.whole === null ? "(?)" : f.bond.whole) + " · parts " + f.bond.parts.map(function (x) { return x === null ? "(?)" : x; }).join(", "));
  if (f && f.type === "bar") L.push("    Bar: " + barText(f.bar));
  if (f && f.type === "eq") L.push("    Sentence: " + f.parts.join(" "));
  it.steps.forEach(function (st, j) {
    var head = "    " + (j + 1) + ". [" + (st.role || st.type) + (st.pts ? " · " + st.pts + " pt" : "") + (st.gate ? " · new part" : "") + (st.optional ? " · optional" : "") + (st.warm ? " · warm-up, not counted" : "") + (st.ungraded ? " · not graded" : "") + "] " + (st.label || "");
    L.push(head);
    if (st.type === "pick") st.choices.forEach(function (c, i) { L.push("       " + (i === st.key ? "✓" : "·") + " " + (c.shape ? "(drawing) " : "") + c.t + (i === st.key ? "" : "   ← " + c.rule + (c.msg ? ": “" + c.msg + "”" : ""))); });
    if (st.type === "num") {
      L.push("       box: " + (st.pre ? st.pre + " " : "") + "[ ]" + (st.post ? " " + st.post : "") + "   key " + st.answer + (st.addBack ? " (or his own answer + " + st.addBack.k + ")" : ""));
      if (st.bond) L.push("       bond shown after the tap: top " + (st.bond.whole === null ? "(?)" : st.bond.whole) + " · parts " + st.bond.parts.map(function (x) { return x === null ? "(?)" : x; }).join(", "));
      (st.diag || []).forEach(function (d) { L.push("       wrong " + d.v + " ← " + d.rule + " (" + G.RULES[d.rule].name + "): “" + d.msg + "”"); });
    }
    if (st.type === "label") {
      L.push("       empty bar, widths " + st.sizes.join(":") + " · chips " + st.chips.join("  ") + (st.selfCheck ? " · self-check after Check" : ""));
      L.push("       key: over the bar " + st.answer.whole + " · parts " + st.answer.parts.join(" and "));
    }
    if (st.type === "chips") L.push("       chips: " + st.choices.join(" · "));
    if (st.hints) st.hints.forEach(function (hn, r) { L.push("       rung " + (r + 1) + ": " + hn); });
  });
  return L;
}
if (process.argv.includes("--dump")) {
  var outL = ["Bar Models: Part-Whole — readable dump (generated by testing/bar_models_check.js --dump, " + new Date().toISOString() + ")",
    "Every session at two seeds (form 0 and form 1). For practice sessions, the W1 twin and the W5 fresh look-again of question 1 are shown too.",
    "Choices: ✓ = the key; every other choice is followed by its named rule and the clue he sees.", ""];
  for (var s = 1; s <= 13; s++) {
    [0, 1].forEach(function (c) {
      var opts = s >= 11 ? { missed: c ? [{ skill: "build", n: 3 }, { skill: "labelPart", n: 1 }] : [] } : {};
      var b = G.buildSession(s, c, opts), info = G.SESSIONS[s - 1];
      outL.push("================================================================");
      outL.push("Session " + s + " · " + info.date + " · " + info.title + " · form " + c + (s >= 11 ? " · built from " + (opts.missed.length ? opts.missed.map(function (m) { return m.skill + " ×" + m.n; }).join(", ") : "no misses (mixed)") : ""));
      b.items.forEach(function (it, i) { dumpItem(it, "Q" + (i + 1)).forEach(function (l) { outL.push(l); }); });
      if (!b.held) {
        dumpItem(G.twin(b, 0, 1), "twin of Q1").forEach(function (l) { outL.push(l); });
        dumpItem(G.twin(b, 0, 2), "fresh look-again of Q1").forEach(function (l) { outL.push(l); });
      }
      outL.push("");
    });
  }
  fs.writeFileSync(DUMP, outL.join("\n") + "\n");
  console.log("wrote " + DUMP + " (" + outL.length + " lines)");
  process.exit(0);
}
main();
