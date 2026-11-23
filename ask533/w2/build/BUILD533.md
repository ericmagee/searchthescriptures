# ASK 533 BUILD (W2, seat 32): K-GLS, a judge's [L2] gloss held to the KJV renderings of its number

Plan: ask533/w1/plan533.md rev 1a (md5 2cac4f82, commit 4ad3167b; rev 1 W2 PASS at Wall 10763; rev 1a is W1's ruling at 10779 on W3's build grade 10778 C1).

**BUILD REV 1a.** The first build (Wall 10777, targets 2b220881 and 9165c26c) left index 1311 unchanged, so a retraction answering only a K-GLS item was applied. W3 10778 C1 found this; W1 ruled option (i) at 10779. This build adds index 1311 (__mlsT: a K-GLS item matches by link, and K-GLS joins the silent set; a link another rule also names is still applied). The K-GLS cure reads such a retraction as CURED, recorded only, not applied; when another rule's item names the same link the retraction is applied and the cure reads "retracted". Everything below is updated to rev 1a. Assignment: coordinator, 17:06Z. W3 grades the build. W4 writes on the operator's card.

## 1. Base (fresh read)
- W4's fetch at ask533/w4/live/: live_engine.json 3a001d95 (engine version daf5da98) and live_child.json cf85b641 (child version 10624dd2). Library header sha 5aedc2f2ac70ba66.
- If any other ASK (536, 541, 528, 534, 542) is written first, the patch must be run again on a new fetch. patch533.js finds each line by its index and asserts its old text, so it stops if the base has moved.

## 2. Files (ask533/w2/build/)
| File | md5 | What it is |
|---|---|---|
| patch533.js | 237c1e3e | `node patch533.js <live.json> <target.json> engine\|child` |
| kgls_fn.js | 550f71af | kl2gLines (the test, the item and the AUDIT v66 mark) |
| cure_branch.js | 0ec5dea1 | the K-GLS cure branch, after K-L2's |
| e340_ren.js | a9378179 | L2 Count Plan: e340 exports ren (engine only) |
| target_engine_533.json | 8eb0881e | engine target |
| target_child_533.json | 621c3303 | child target |
| harness533.js | cc2709ff | loads a MAP package's Library part offline with a stub $ |
| test533.js | 3529b153 | `node test533.js <live_engine.json> <target_engine.json>` |
| out_test533.txt | c3859558 | its output: ALL PASS |
| diff533.py, compile533.js | a3ff46cf, fe10daa6 | the structural diff and the compile check |
| glosses533.py / glosses533.json | 7cb630e6 / c8704fc4 | 154 judge [L2] glosses on collision lines (SQL md5 dffa0fc3, 9,852 chars) |
| ren533.json, dread533.json | f612ffb5, 5386da0d | KJV renderings per number, and the numbers the debaters gloss per run. Both come from one SQL doc (md5 e6fb5de25d1e09dfdc433a0b13ca46fa, 25,167 chars). That md5 was checked on the extracted text before the split. |

## 3. What changes (touched lines only)
- **Shared Library** (both workflows), 10 array indexes:
  - 483: kl2gLines is placed before kl2Lines on its line. Line 379 closes kl2Lines for the packages, so nothing can be added after 488.
  - 489: one K-GLS cure sentence in __CURE396.
  - 514: 'K-GLS':'TRIAL'.
  - 517: enfSilent excludes K-GLS.
  - 849: cureLabel.
  - 1052: cure keys.
  - 1212: the cure branch.
  - 1311 (rev 1a): __mlsT in cureRecompute. A K-GLS item matches the retracted link, and K-GLS is in the silent set, so a retraction that answers only K-GLS items is recorded and not applied.
  - 2177: X10 = kl2gLines(text), after X9.
  - 3314: the FLAGGED ITEMS line.
  - 33 MAP n values are re-measured. The header sha goes from 5aedc2f2ac70ba66 to 9a4d55c66bf65d7f.
- **L2 Count Plan** (engine only): e340 gains out.ren. The node goes from 497ef36d to b23982fe (+337 chars). The AUDIT v57 text is not touched.
- **diff533.py**:
  - The engine differs only in L2 Count Plan and Shared Library. The child differs only in Shared Library.
  - Connections and settings are equal. MAP keys and p are equal. Only the 10 indexes change.
- **Checks**:
  - runcheck: OK on both targets.
  - The 539 pair check: PASSES (map 3dce26b788552d8f).
  - compile533: 49/47 packages compile with no n mismatch, and L2 Count Plan compiles.

## 4. Declared choices (where the build goes past the plan's words)
- a. **ren entries.** Each carries lt and lg as well as w and ph. lt is needed for the plan's skip (a part equal to the transliteration), and lg for the LEXICON WORDING label.
- b. **The item's text.** item.line carries the judge line, the why and the item text, because the FLAGGED ITEMS line (3314) prints only x.line.
- c. **The item's own renderings.** item.ren holds the renderings of its own numbers, so the cure does not depend on $ at cure time.
- d. **Content words are split at any non-letter**, not only at spaces. Without this, "who/which" (G3739, judgment 1239) was raised although both words are KJV renderings: WRONG-IF 1. e340 splits at spaces. This choice affects K-GLS only.
- e. **AUDIT v66.** v65 is the highest in the live engine. If another ASK takes v66 first, the label must move.
- f. **Not changed:**
  - (Rev 1a: line 1312 (__mlsT) IS now changed, by W1's ruling at 10779. See index 1311 above.)
  - Format Markdown's display.
  - The child's L2 Count Plan, which passes the engine's output through.
- g. **"to beget" (G1080).** It raises an item, per the plan's stated choice (no table of irregular verbs).

## 5. Offline results (out_test533.txt, ALL PASS)
1. The live Library has no kl2gLines; the target has it.
2. Known bad and known good cases, all in run 41418:
   - a. 1263 D5 vs C2 is raised on "including conjugal cohabitation". "to come together" is not raised.
   - b. 1265 D5 vs C2 is raised on "to cohabit conjugally".
   - c. 1265 H2233 "seed" and H6635 "host, war" raise nothing.
   - d. 1265 G1537 "out of" raises nothing. The G1080 parts "to procreate", "of the father" and "by extension of the mother" are raised, as the plan expects.
   - e. On the cure path, where REN is given, no mark is written.
3. The read path through $('L2 Count Plan').e340.ren:
   - When the export is present, the item and the AUDIT v66 mark are written.
   - When it is absent, no item is raised. The mark gives the NOT READ count and says "the renderings export was not found".
4. Cure cases:
   - RESTATED "(G4905, to come together)": CURED.
   - RESTATED "(G4905, to cohabit conjugally)": UNCURED, naming the part.
   - RETRACTED with a reason and one CORRECTED RESULT: CURED, recorded only, not applied (rev 1a).
   - 4i (rev 1a), K-GLS only: the RETRACTED is recorded and not applied. cureRecompute returns null, so no count moves.
   - 4j (rev 1a), K-GLS plus K-L2 on one link: the RETRACTED is applied (retracted ["D5 vs C2"]), and the K-GLS cure reads "retracted".
   - A RESPONSE with no RESTATED or RETRACTED line: UNCURED.
   - No reply: UNCURED and silent.
   - enfSilent is false for K-GLS on the target. The live code would count it.
   - cureOwn strips "K-GLS".
   - cureLabel is "K-GLS D5 vs C2".
   - The existing K-RUL trial adds its own "no ruling card" row on a RESTATED line. That row is not part of this build.
5. Replay: 148 judge lines, 154 glosses, 227 parts checked, 68 items raised, and 7 NOT READ. Every raised part is listed in the output. Under WRONG-IF 1, I read each one and found none that holds a KJV rendering of its number in any form forms() gives.
6. kl2Lines (K-L2) output is equal OLD and NEW on all 148 lines.

**Limits of the offline replay:**
- The lines are synthetic: "- Dn vs Cm (cited verse): STANDS | [L2] word (num, gloss); ...", built from the stored glosses, not the full verdict text.
- The read set is a proxy: the numbers the debaters gloss anywhere in that run's rounds.

## 6. Left for W4's pinned replay (plan criteria 7 and 8)
- 7(c) on real executions: K-L2 items, AUDIT v28 marks and drv_uncured are equal OLD and NEW.
- 7(d): the e340 AUDIT v57 text is byte-equal on 41418.
- 7(e): ren is non-empty at the Library in the engine and the child, in the four packages that call kl2gLines (Panel Payloads, Alternate Payloads, R2 Alternate Payloads, Extract Independent Verdict).
- 8: Library Check and the 539 map check on the written versions.
