# ASK 596 CORE BUILD rev 1 (W1 F1, F2 of Wall 11291, b1857765): the standing runner, the long-line test S3, and the ASK 587 tests

W4, 2026-11-24 CST. For W1's grade.
- Operator's press (W3 thread, 01:57 CST): "Build the core right after 595". Plan: ask596/w3/plan596.md rev 1 8d4ca45e, sections 3 and 4.
- Files only. Nothing in n8n changes, and nothing is fetched.
- Location: /mnt/project-files/standing/ and the repository, under standing/.

## 0. REV 1 CHANGES
- F1: a group names the tests it holds. When a marker is missing, each test the group holds FAILS by name ("NOT RUN: marker not found"), and the other groups run on. The 587 D group is split in six, so one marker stops only the tests that read it. Proof 5 now gives 29 lines (24 PASS, 5 FAIL), not 20.
- F2: new group S3 (a2). It collects every property that a flagged_line value reads (22 names: line, to, detail, sentence, ...). It then scans every source of engine and child for a setter of one of those properties whose value is cut. This finds the K-CMTL line cut to 400, and the K-ML and K-LB cuts of the debaters' words.
  - On the 595 target there are 74 distinct cut setters. They are named in baseline.json for ASK 597, and a new one FAILS.
  - Proof 7d: one new node makes items whose line is cut to 333, and another node stores it as flagged_line. S3.a2 names the cut setter, and S3.a names the new untraced place.
- W1's ruling, recorded: the K-KJV report goes on the named baseline for ASK 597.

## 1. FILES
- run.cjs: `node run.cjs <engine.json> <child.json> [--detail out.json]`. It runs every file in inv/ and prints one line per test, ending "STANDING: <n> PASS, <m> FAIL (<s> s)". The exit code is 1 on any FAIL.
- lib.cjs: load, library cut, the joined MAP source, every code source, and `line(W, marker)`. A marker that is missing, or found more than once, throws "marker not found".
- inv/inv_587.cjs: ASK 587 A to E as behaviour tests, 22 tests. They are ported from ask586/w4/build/t586.cjs; the target's results are the expected results.
  - Each test finds its library code by marker, never by line number. Markers were chosen to stand once in 587's write, its pre-write, the 595 target and live (tools/markers.cjs).
  - Fixtures: judgments 1272 to 1274 and their extracts (fixtures/, 4 files, 200 KB).
- inv/s3_longline.cjs: S3. See section 2.
- baseline.json: S3 (b) count 3; S3 (a) named lists.
- tools/: gatefn.cjs (a node's built functions, $ stubbed), scope.cjs (acorn scope check), markers.cjs, proofs.cjs (proofs 5 and 7 on scratch copies, deleted after).
- No engine copy is stored. The fixtures are the only data.

## 2. S3, THE PLACES FOUND BY SCAN
(a) The scan reads every object that sets `flagged_line` in every code source of engine and child. On the 595 target it finds 116 places, with identical library text counted once. For each:
1. CUT: the value holds a .slice/.substring/.substr(0,N). That is a FAIL.
2. Traced: the value reads X.p, X comes from a call F(...) in the same source, and F sets `p:`. If that setter is cut, it is a FAIL. That is how the ASK 590 defect is found: `__h.line` from rev590Hits, `line:l.slice(0,1500)`.
3. UNTRACED: the producer is not in the same source, for example an item from another node. On the 595 target there are 100 such places (75 distinct). They are listed by name in baseline.json. A new untraced place is a FAIL until it is read and added by its ASK.
Named exception, for W1's ruling: the K-KJV TRIAL report is stored in flagged_line cut to 4,000 (Alternate Merge Seat, and R2 Alternate Merge Seat in the child). It is a code report of judge quotes not checked, not a judge's line. It is on the baseline list and goes to ASK 597.
(b) Send-back texts that show "Your line:" cut: 3, as W1 counted. A fourth is a FAIL.

## 3. PROOFS (plan section 4), outputs in out/
1. Live d819ff4c / 31329164: 27 PASS, 6 FAIL. All six are S3 (a) and (a2) at the E-REVCLOSE item (rev590Hits line:l.slice(0,1500), engine and child); every ASK 587 test passes.
2. The ASK 595 target: 29 PASS, 0 FAIL.
3. Before 587 (prewrite_eng587, 196402d0): 11 PASS, 98 FAIL. Every A to E test that 587 changed fails, and S3 names 52 cut places.
   - B2 and B3 pass there; they are the controls.
4. Not in the core. The reach walk belongs to Layer A (ASK 599 rules), which comes after 594.
5. A marker renamed in a copy of the library (cureSafe, LIB 1286): D2 and D3 FAIL "NOT RUN: marker not found", and D5 FAILS because its code calls the renamed function. The other 24 tests run and PASS.
6. Time: about 6 seconds for one full run.
7. A new builder that cuts flagged_line: 7a, cut in the value, FAILS and names "Proof7 New Builder". 7b, cut in its producer function, FAILS and names "hits". 7c, a new untraced place, FAILS and names it. 7d, a cut in another node, FAILS and names "Proof7d Item Maker".
Also run: live now (04273989 / c9acb53a, after 595, J1 and J6) 29 PASS; the 595 follow-on target 29 PASS.

## 4. ANSWERS TO PLAN SECTION 7
1. Markers: the older library code needs no added markers for these tests. Unique substrings of the code serve as markers. When an ASK rewrites the line, the test fails "marker not found", which is what S2 asks for. No engine change is needed.
2. ESLint: version 10.1.0 runs offline (/opt/node-tools).
   - It parses a node's code with parserOptions.ecmaFeatures.globalReturn true.
   - The n8n names are declared as readonly globals in the config: $, $input, $json, $execution, $workflow, $env, $node, $now, $today, $items, $item, $prevNode, DateTime, helpers.
   - Tried on QR Final and Send Back Build in 1.1 seconds. Send Back Build gives 26 no-empty, 5 no-undef and 77 no-unused-vars.
3. Time: about 5 seconds a run, so it will not be skipped.

## 5. LIMITS
1. The trace follows one step inside one source. A cut made in another node is caught by S3 (a2) by property name. A cut made in another node under a different property name, then renamed on the way, is not caught.
2. The 587 D tests give the judge's parsed lines with no keystone (P.key null), because J1 reads P.key. J1's own behaviour is not in this file; inv_586j1 comes next.
