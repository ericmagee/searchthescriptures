# ASK 536 plan (W1, seat 34), rev 2a, 2026-11-23. A PLAN ONLY; nothing is written.
Rev 2 replaces rev 1 (65dd7cba) on W4's hold at Wall 10715: sol's rows 51202 and 51203 are raised at Library 478 and 479 through unxNamed, not through unxLack at 473 to 476. Sol's counts name no layer, or say no layer is missing. So they are not this misreading, and rev 2 takes them out of the known-bad set, criteria 4(a) and 4(b), ruling 428 and the card. MY MISTAKE: rev 1 named them without checking which raise produced them.
Rev 2a (W2 FAIL at Wall 10718): row 51164 (challenger premise 3) is the ASSUMES-ground item (Library 470 to 472, the ua.asm path: "on an ASSUMES ground ... does not quote the block's [L1] Matthew 1:16"), not the 473 raise. Line 473 runs only when no ua item was found, so NEW does not stop 51164. It leaves the known-bad set. MY MISTAKE: I did not read 51164's flagged line.
Rev 1 replaced rev 0 (2759e5c1) on W2's FAIL at Wall 10707 items 3 to 5.
Source: proposal W1 10596 item 4 (coordinator point 3, run 41418), reviewed by W2 at 10684 ("CONFIRMED, with one correction"). Rulings: 383 (only the Oracle is bound by guards; this touches no judge text), 428 (a rule is record-only until it passes a known case), the 11-19 18:28 CST scope rule.

## 1. OBJECTIVE
The engine reads a judge's UNEXHIBITED count correctly when the count says a layer is missing "despite" other layers, or writes a word such as "fit" between the layer tag and "missing". It no longer raises a K-UNX item that claims the judge said the block lacks a layer the judge in fact said was present.

Expected effect, stated before the build: in run 41418, sol 6.2 (judgment 1263) defender premises 1, 2 and 3 and challenger premise 3 read "(L4) fit missing despite (L1) and (L3)" or "(L1)–(L3)". unxLack names [4], not [1,3]. The 473 K-UNX items on defender premises 1, 2 and 3 (rows 51161 to 51163) are not raised. Challenger premise 3's item (51164) is the ASSUMES-ground item at 470 to 472 and is not changed by this ASK.
WHAT THE FALSE ITEMS DID IN 41418 (W2 10707 item 3): K-UNX is a TRIAL rule that "removes no seat", but the judges answered the false items by lowering their own counts:
- sol 6.2, rows 51161 and 51162 (defender premises 1 and 2): "CORRECTED COUNT 2 takes the premise out of the count". This is the 3-to-2 count with no premise named (AUDIT v50; Worker_E 10683 item 5a).
So the false item changed sol 6.2's defender count. (Sol's rows 51202 and 51203, where sol lowered its count to 1, come from the raise at 478 and 479 and are NOT in this ASK; see section 3, NOT IN SCOPE (c).) With the fix, the item is not raised, so the judge is not prompted to change its count. The judge's decision still stands as written (ruling 428); the engine only stops asking a false question. This corrects an engine reading, not a rule.

## 2. ROLES
Planner W1. Builder W4. Grader W2 (one non-builder grader, op doc v141). Write card: W4's thread.

## 3. SCOPE
SEARCH (W1, 11-23, on target_engine_531.json fa7711aa through ask516/w4/b/lib.py; and SQL):
- Library line 427 to 430: unxLack. The pre test reads the 40 characters before a layer tag, cut at the last "." or ";". The post test reads the 60 characters after it.
- Every caller of unxLack: Library lines 473 to 476 (K-UNX raise), 1223 and 1224 (K-UNX-A cure), 1227 (K-UNX cure), 1390 (send-back count check), 2934 (E-PREM epk), 3399 (epsHold).
- debate_judgments, all runs: 368 "Premise n ...: UNEXHIBITED" fragments in 149 judgments. Of these, 14 hold "despite", "though", "although" or "even with", or a tag followed by one or two words and then "missing", "absent" or "lacking" (ask536/w1/frags536.json, the 12 stored ones plus 4 synthetic ones).
- debate_enforcer_log: 166 K-UNX rows, all kind cure, in 56 runs (11-07 to 11-23).
CHILD: the child MqQHRl7mQQ0z8QdT holds its own Library, byte-equal to the engine's. The same line changes in both copies, and both LIB hashes stay equal. The change adds no MAP key, so the ASK 539 map check is not touched.
NOT SEARCHED: the judges' cure STATEMENTs (response_line) for the 166 K-UNX rows, and the E-PREM rows that reach line 2934 or 3399. W4 replays both in criterion 4.
IN SCOPE: Library line 428 and 429 (the pre and post tests in unxLack), in both Library copies. No other line.
NOT IN SCOPE (scope rule):
- (a) A negation that sits before an intervening "[Ln]" tag (for example "lacks [L2] and [L4]" names only [2] today). This is a separate gap with no failed run behind it.
- (b) The K-UNX rule text and its count consequence.
- (c) The raise at Library 478 and 479 (unxNamed, "the count names no layer the block lacks"), which drew sol's rows 51202 and 51203 in 41418. Sol counted an answer failure as UNEXHIBITED and the item read sol's words correctly. Whether the ASK 520 exemption should have spared it is a separate item.

## 4. CRITERIA and DONE
CHANGE (line 428 and 429 of unxLack):
1. PRE: after the existing cut at the last "." or ";", the pre window is also cut after the last "despite", "though", "although" or "even with". A negation word before one of those words no longer reaches a tag after it.
2. POST: the post test allows, before its existing pattern, an optional closing ")" or "]" and then up to two words. Neither word may be a layer tag, "but", "and", "or", "though", "although" or "despite". So "(L4) fit missing" and "[L4] fit is lacking" name L4, while "[L1] but [L3] missing" still names only L3.
3. Nothing else in unxLack changes. The have and missing logic is the same.
TESTS (ask536/w1/sim536.cjs, run by W1 on frags536.json; OLD is line 427 to 430 verbatim):
- Known bad, 41418 j1263 defender premises 1, 2 and 3 and challenger premise 3: OLD names [1,3] each time. NEW names [4]. For the three defender premises no 473 K-UNX is raised (line 474 needs every segment's missing to be empty, and a named L4 is always missing). Challenger premise 3 is a reading test only; its row 51164 comes from 470 to 472.
- Known good, unchanged:
  - j1248 premise 1 ("lacks an exhibited [L4] fit") names [4].
  - j1251 premise 6 names [].
  - j1205 names [].
  - Synthetic A ("lacks [L2] and [L4]; [L1] and [L3] are exhibited") names [2].
  - Synthetic B ("[L3] missing, [L4] fit missing") names [3,4].
  - Synthetic C ("[L1] but [L3] missing") names [3].
- Changed and correct:
  - j1245: "fit fails at P4–P5 despite [L1]–[L3]" moves from [4,1] to [4].
  - j1245 premises 5 and 6 move from [4,1,3] to [4].
  - j1248 premise 2 and j1254 premises 1 and 4 ("[L4] fit is missing" or "lacking") move from [] to [4].
  - Synthetic D ("[L2] gloss is absent though [L1] stands") moves from [1] to [2].
- W1's run (rev 1): 17 rows, 11 changed. Each change is listed above, and each moves to the layer the text calls missing.
DONE:
4. W4's replay on the live engine and child (04450043 and 334f0518, or later):
   - (a) All 166 stored K-UNX rows are re-run through line 473 to 476 with the stored judgment text, OLD against NEW. Each row that would not be raised is listed. Every listed row must be one where the count names the missing layer as L4, or names, through "despite", a layer the block exhibits. KNOWN BAD, by name: 51161, 51162 and 51163 (sol 6.2, judgment 1263). Each must not be raised under NEW. 51164, 51202 and 51203 are reported unchanged (51164 raised at 470 to 472 ; 51202 and 51203 at 478 and 479; under OLD and NEW).
   - (b) The stored cure STATEMENTs of those rows are re-run through 1223 to 1227. Each change of cure status is listed. For 51161 to 51163, the before status (all three CURED today; 51161 and 51162 by "CORRECTED COUNT ... takes the premise out of the count") and the after status (no item raised) are reported by name.
   - (c) The E-PREM paths at 2934 and 3399 and the check at 1390 are re-run on the stored rows of 41418, 41155, 41117, 41102 and 41090. Each change is listed.
5. Both Library copies hold the same text. Library Check passes on both, and the ASK 539 map check is unchanged.
6. RULING 428: the change corrects a reading of the judge's own words. It adds no item and no count. Its effect at 473 is to stop raising a false TRIAL item. In 41418 that item drew a count correction from sol 6.2 (51161 and 51162), so the change can leave a judge's own count higher than it was in such a run, because the judge is no longer asked to lower it. That is the judge's count as first written, not a count the engine sets. The card states this. If 4(b) or 4(c) shows any other count change, the plan returns to W1 before any card.

## 5. WRONG-IF
1. Any stored K-UNX row stops being raised where the count truly names, as missing, a layer the block does not exhibit, other than L4.
2. NEW names a layer that the text says is present ("despite [L1]", "[L1] stands").
3. A cure status, an E-PREM epk, an epsHold or a 1390 result changes, and W4 cannot show from the judge's text that the new reading is the right one.
4. The two Library copies differ after the build.

## 6. RUN EVIDENCE
NO PROBE (ASK 417). Judges' wording cannot be forced. UNEXERCISED until a released run in which a judge writes "missing despite" or "(L4) fit missing" in an UNEXHIBITED count. The proof on such a run is that no K-UNX row is raised for that premise, or that the row names only layers the count calls missing.

## 7. INPUTS IN GIT
This plan, ask536/w1/frags536.json and ask536/w1/sim536.cjs, in git and at /mnt/project-files/ask536/w1/. The build's replay and outputs go under ask536/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds both Library copies on the live engine and child, and runs criteria 4 and 5. No card.
3. W2 grades the build. No card.
4. The operator's write card in W4's thread names the change: the engine reads "missing despite" and "fit missing" as the judge wrote them, so a K-UNX item no longer says the judge called a present layer missing. The card also states that in 41418 the false item led sol 6.2 to lower its defender count from 3 to 2, and that without it the judge keeps the count it wrote. The card says nothing about sol.
5. W4 writes. W2 reads back. No run is released for this ASK alone.
