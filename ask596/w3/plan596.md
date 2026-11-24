# ASK 596 PLAN: ONE STANDING TEST SET THAT EVERY BUILD PASSES, rev 0

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade. A plan only: the operator pressed "Plan 596, then 597, then 598" at 01:43 CST (the newest ruling row of seat 33 at that time; Wall 11465). The build needs its own card.

## 0. OBJECTIVE

A build that breaks an earlier fix, or a rule of the coding standard (ASK 599), is refused by a test before it reaches W1's grade or the operator's card.

OBJECTIVE MET when:
1. one command, given any engine file and child file, runs every standing test and prints PASS or FAIL for each;
2. run on the live engine d819ff4c it FAILS on the ASK 590 cut (the defect W1 found by hand at Wall 11452), and run on the ASK 595 target it PASSES that test;
3. run on the engine as it stood before ASK 587 (ask587/w4/write/prewrite_eng587.json) the ASK 587 tests FAIL;
4. every build card after it carries the line of section 5.

Items 2 and 3 are the known-bad cases. A test set that passes on an engine known to hold the defect proves nothing.

## 1. RULES READ

Ruling rows of 2026-11-24 (plans only, each build its own card); ASK 587 item A; Wall 11452, 11462, 11471; the build rule (touched nodes only; no model settings); "leave nothing to chance" (row 506); the scope rule; ASK 599 draft 2 (93f2e922).

## 2. WHAT STANDS TODAY, AS READ FROM THE FILES

1. Test files (names t*.cjs or test*.cjs) stand in 11 of the ASK folders numbered 500 and up: 532, 542, 573, 575, 576, 581, 585, 586, 588, 590, 593. The other folders hold none by those names. ASK 587 has no test file in its own folder; one test of it (t587o3.cjs) stands under ask586.
2. Each test file reads the base and target files of its own build from its own folder by fixed name (for example t593.cjs reads base_eng.json and target_engine_593.json beside it). It cannot be pointed at a later engine as written.
3. Each mixes two kinds of test:
   - BUILD TESTS, true only of that one build: "only these nodes changed", "LIB lines changed: 2784, 2789, 2929, 2959, 3564" (t590s L1.1, L1.3). On any later engine they fail by design.
   - BEHAVIOUR TESTS, true of every engine after that build: "a judge line quoting 8 words of the reversed close sentence is caught" (t590s L2.1), "audit and extractor lines are skipped" (L2.5).
4. The behaviour tests find their code by library line number (t590s reads L2[3564]). Line numbers move with each build, so the same test on a later engine reads the wrong line.
5. No build reruns another ASK's tests. ASK 590 ran 66 tests of its own and none of ASK 587's.

## 3. THE DESIGN

S1. ONE RUNNER. `standing/run.cjs <engine.json> <child.json>`: loads the two workflow files, runs every file in `standing/inv/`, prints one line per test, and ends with "STANDING: <n> PASS, <m> FAIL". It fetches nothing and writes nothing. It lives in the repository (only git survives) with a working copy in /mnt/project-files/standing/.

S2. THREE LAYERS.
- LAYER A, THE STANDARD (ASK 599): one check per rule, as section 3 of standards599.md names it: the reach walk from every trigger (Shared Library node and sticky notes exempt by name); the ESLint rules after a formatter has laid the code out; no cut on a line field outside the shared handler; the named lists counted; the header, the two canvas notes and the manual part equal word for word. Each rule has a number in `standing/baseline.json`. A count above its baseline is a FAIL. A count below it lowers the baseline in the same build.
- LAYER B, THE EARLIER FIXES: one file per ASK, `standing/inv/inv_<ask>.cjs`, holding that ASK's BEHAVIOUR TESTS only. Each test takes the two workflow objects as arguments. It finds its code by a marker in the code (a function name or a marker comment such as /*REV590{*/), never by a line number. If the marker is gone, the test FAILS with "marker not found": removed code is a failure until an ASK says it was meant.
- LAYER C, STORED CASES: a small fixed set of stored judge texts and enforcer replies with the result each must give, copied once into `standing/fixtures/` with its row id: judgments 1272, 1273, 1274 of run 42071 (the ASK 587 cases); enforcer row 53043 (the J6 case); the stored lines of 37203 and 41822 that ASK 590 uses. A case is never edited; a new case is added by the ASK that needs it.

S3. THE LONG LINE, IN EVERY SEND-BACK. One standing test builds a judge line of 2,000 characters and passes it through every builder that makes a send-back item and every record that stores one. It FAILS if any stored or shown copy is shorter than the line. This is the test that fails on d819ff4c today (the E-REVCLOSE item) and that any future send-back must pass without anyone remembering ASK 587.

S4. THE FIRST SET, in this order: ASK 587 A to E (from the six items and the "Marks for the next run" of manual part 11.1, and the offline cases on judgments 1272 to 1274); 595; 590; 588 with 588 R; 593; J6 and J1 of ASK 586 when written. Then backward through the manual's entries, one ASK per file, newest first. An ASK with no test file gets its tests written from its manual entry's marks.

S5. THE RULES OF USE.
1. Every build's notes hold the runner's full output on that build's TARGET files. W1 reruns it on W1's own rebuild. A build with a FAIL is not graded.
2. A build that adds behaviour adds its `inv_<ask>.cjs` in the same commit.
3. A standing test is changed or removed only by an ASK whose card says, in plain words, "this build changes standing test <name>, because the operator's ruling <row> changes that behaviour". Otherwise a failing test means the build is wrong, not the test.
4. The build card carries one line: "STANDING: <n> of <n> PASS on the target; STANDARD: baseline counts unchanged or lower."

## 4. PROOF ASKED OF THE BUILD (W4), BEFORE ITS CARD

1. Runner on d819ff4c and child 31329164: FAIL on S3 at the E-REVCLOSE item; every ASK 587 B to E test PASS (W1's read, Wall 11452).
2. Runner on the ASK 595 target: S3 PASS.
3. Runner on ask587/w4/write/prewrite_eng587.json: the ASK 587 tests FAIL (at least A).
4. Runner on a target with one Anticheat node deleted and on one with an unconnected node added: the reach walk count goes down by one and up by one.
5. A marker renamed in a copy of the library: the test that uses it FAILS with "marker not found".
6. The time one full run takes, in seconds.

## 5. WHAT THIS DOES NOT DO

1. It changes nothing in the engine. It is files and one command.
2. It does not show that a fix works in a run. It shows that code which passed once still behaves the same on the cases stored. A live run remains the only proof of a run.
3. It does not cover an earlier ASK until that ASK's file is written. The backward fill (S4) is long: the manual is 719,080 characters in 31 parts, and I have not counted its entries. The plan does not promise a date for it; each batch is reported with the count covered and the count left.
4. A test checks the cases someone wrote. A defect in a case nobody wrote passes.

## 6. COST AND STORAGE

No model call. No engine copy is stored by the set: it reads the build's own target files. The fixtures are text of a few hundred kilobytes in all. The project files stand at 9.0 GB of 10.0 GB today, so the set must not add engine copies.

## 7. THIS PLAN IS WRONG IF

1. W4 finds that behaviour tests cannot locate their code without line numbers for the older library code that carries no marker (then the plan needs a step that adds markers, which is an engine change and its own card).
2. The ESLint rules cannot be run on n8n code nodes offline (W4 to say which version and how the `$()` names are declared).
3. A full run takes so long that builders would skip it (W4's number in section 4 item 6).

## 8. ORDER WITH THE OTHER WORK

W4's order is unchanged: 595, J1, J2/J3/J6, C1, 594, then 591. The operator's word of 01:32 to 01:35 CST puts the defects, the enforcer and the judges first. Proposed: the runner with S3 and the ASK 587 file only (the smallest set that would have caught tonight's defect) is built right after 595, because every later build in that list then passes through it; the rest of the first set follows 594. That placement is the operator's choice on the build card.
