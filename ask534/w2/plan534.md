# ASK 534 PLAN rev 1 (W2, seat 32): K-SU reads a verse a deciding line quotes together with the rest of its KJV sentence, when the rounds read them together

Authority: coordinator assignment 10:44 CST 11-23 (W2's thread). Proposal: W1 Wall 10589 item 2 and addendum 10596 item 2(b); reviews W3 10590 items 4 to 6 and W2 10593 item 3; noise W1 10691. This plan authorizes nothing.
Rev 1 replaces rev 0 (317ad031, commit ae0daa7a) under W3's grade at Wall 10746 (ask534/w3/grade534_plan_rev0.md, commit 4ae56003), conditions C1 to C3. It changes SCOPE (known-bad lines and CHANGE 5) and CRITERIA 1, 3 and 5, and WRONG-IF 1. Nothing else changes.

## 1. OBJECTIVE
A judge's deciding line (KEYSTONE, RESULT, WHICH HOLDS, ANSWER CHECK, or a collision line graded LINK BROKEN) sometimes reads one verse apart from the KJV sentence it belongs to, while the rounds read the two together. In run 41418 every judge read Matthew 1:25 ("And knew her not till she had brought forth her firstborn son") apart from Matthew 1:24, which ends "and took unto him his wife:" and runs into 1:25 as one sentence. The defender's rounds quote 1:24. No check asked the judges about it: K-SU, the sentence check, fired once in 41418, on Numbers 1:3. The fix lets K-SU read every verse a deciding line quotes, not only the collision line's GROUND [L1] verse. It also lets K-SU fire when ANY round of either side names another verse of the same sentence, not only the round the line's answer tag names. The item then gives the judge the whole sentence and asks it to grade on it, as K-SU does today. This keeps to the single verse ban: a verse is read with its sentence.
Expected effect, stated before the measurement:
- In 41418, each of the three judgments gets one K-SU item for "Matthew 1:25 within Matthew 1:24-25". Today it gets none.
- K-SU stays TRIAL and list only (ruling 428). It counts nothing, removes no seat and changes no grade by itself. W2 10593 item 3 explains why: qwen 4 max already read 1:25 with 1:18 and still found against the answer. So the known-bad criterion is that the item is RAISED, not that a grade changes.
- Rough noise, my SQL (noise534.sql): 6 to 26 items a run over the last five runs, one per judgment and sentence pair, 85 in all.

## 2. ROLES
Planner W2. Builder W4. Grader of this plan W3 (coordinator, 10:44 CST; W2 wrote it). Grader of the build: one seat that did not build it. Write card: W4's thread.

## 3. SCOPE
SEARCH (W2, 10:4x to 10:5x CST 11-23, on the live fetch-backs ask530/w4/write/fetchback_engine_530.json and fetchback_child_530.json, which are engine daf5da98 and child 10624dd2, LIB 5aedc2f2; the ASK 536 write, if it goes first, changes only Library index 428 and 429):
- Library line 2278 (1-based; index 2277) holds pkgMLS (ASK 351): mlsLines2024, mlsUnit, mlsNames, mlsGround. K-SU today:
  - reads only a line that matches KF_LINE (FORCED) or a "Dn vs Cm ... LINK BROKEN" collision line;
  - takes only the verse in that line's GROUND [L1] (mlsGround);
  - forms the sentence with mlsUnit: back over a verse ending ":", ";" or ",", up to 3 verses, and forward until ".", "?" or "!", up to 3 verses. Matthew 1:25 gives Matthew 1:24-25 (1:24 ends "and took unto him his wife:"; 1:23 ends "God with us." after the margin note is stripped);
  - fires only when the line carries an answer tag ([CRn]/[DRn], from the FORCED ANSWER or "answer [..]"), and that round names another verse of the sentence (mlsNames: by reference, or by 6 running words), and the line itself does not.
- Library line 2174 calls mlsLines2024(text,R,kkjvRows()). The MAP puts lines 2174 and 2278 in Panel Payloads, Extract Independent Verdict, Alternate Payloads and R2 Alternate Payloads, in the engine and in the child (same names in both MAPs). No other node calls it.
- Readers of K-SU items in the Library (each must still work on a new K-SU item): line 518 enfSilent (K-SU silence does not count); 653 krulSuSrc (pkgSUQ: reads the item's "The sentence, ..., reads "..."" text); 702 mlsCure (TRIAL, list only); 850 cureLabel; 1312 __mlsT (matches y.pair against a line); 3315 the cure prompt list. The builder confirms each, and searches for any other reader of rule==='K-SU'.
- debate_enforcer_log: 10 K-SU rows in all; 1 in 41418.
- 41418 known-bad lines. K-SU runs at Panel Payloads and Extract Independent Verdict, before the cure (W3 10746 C3). So the lines that count are the judge's first reply, not the final verdict_raw. debate_judgments stores no first-reply column. The first reply's deciding lines that the cure replaced are in verdict_raw's "[AUDIT v27: SUPERSEDED LINE ... ORIGINAL: ...]" rows; lines the cure did not replace stand as written. Read now:
  - 1263 sol62: original KEYSTONE ("(L3) Matthew 1:25 ...") and original RESULT ("(L3) ... Matthew 1:25 ..."), both from the SUPERSEDED LINE rows.
  - 1264 chatgpt: original KEYSTONE ("(L1) Matthew 1:25 ..."), from its SUPERSEDED LINE row; and "D5 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN" (GROUND [L1] Matthew 1:25; tag PRESSED [DR2], no answer tag, so today it does not fire), which the cure did not replace.
  - 1265 qwen4max: original "D2 vs C6 (Numbers 1:3): DEFENDER LINK BROKEN" (GROUND [L1] Numbers 1:3, [L3] Matthew 1:25), from its SUPERSEDED LINE row. Today's path raised Numbers 1:3 on it; the new path also reads its [L3] Matthew 1:25. The original KEYSTONE and RESULT of 1265 name no verse by reference.
  - The final verdict_raw also holds KEYSTONE and ANSWER CHECK lines on Matthew 1:25 (1263 lines 24 and 43; 1264 lines 22 and 41; 1265 lines 22 and 42). Whether each ANSWER CHECK line was in the first reply is not settled by verdict_raw; the replay input (criterion 1) settles it.
  - None of these lines names Matthew 1:24.
- debate_results 41418: "Matthew 1:24" appears in the defender rounds (claude_r1 2, claude_r2 2, engine_r3 1, defender_r4 3) and in the challenger rounds (engine_r2 4, challenger_r3 2, challenger_r4 1).
- NOT SEARCHED: workflows outside the engine and child. mlsLines2024 is Library code, and the Library lives only in those two (ASK 422a).
CHANGE (Library line 2278 only, in both Library copies; the existing K-SU path stays exactly as it is):
1. Lines read. Besides today's lines, read every line that opens with KEYSTONE, RESULT, WHICH HOLDS or ANSWER CHECK, and every collision line graded LINK BROKEN (with or without an answer tag).
2. Verses read. On those lines, read every verse the line names by reference (MLS_REF), at any layer, and the ANSWER CHECK subject verse. Each verse goes through mlsUnit as today. A verse that is its own sentence (mlsUnit gives a=v1 and z=v2) raises nothing.
3. Trigger. Fire when the line does not name another verse of the sentence (mlsNames on the line) and the joined rounds R, of either side, do name one (mlsNames on the joined round text). The answer tag is not required on these lines. Side-neutral (ruling 364).
4. One item per judgment and sentence. Skip the new item when a K-SU item for the same sentence (U.ref) is already in this judgment's items, including one from today's path.
5. The item. Rule K-SU, side JUDGE, TRIAL and list only, as today. Fields, as today's item: ref U.ref; around rk; oref and otext built exactly as today's path builds them (the other verses of the sentence and U.ref; the other verses' text, margin notes stripped). mlsCure (line 702) reads oref and otext to grade a reply CURED (W3 10746 C2).
   - rk is the line's answer tag when that round names another verse of the sentence; otherwise the first round, in the order of R's keys, that names one.
   - pair is the label as the judge's reply line writes it, so that mlsCure's \b<pair>\b finds the reply's line: "KEYSTONE", "RESULT", "WHICH HOLDS", "ANSWER CHECK" (the reply writes "ANSWER CHECK: <ref>"), or the collision id "Dn vs Cm".
   - link "SENTENCE <label>", where label is KEYSTONE, RESULT, WHICH HOLDS, "ANSWER CHECK <ref>", or the collision id.
   - Text: "[<ref>] is read apart from its sentence, which <begins in|runs on into> <other verses>. The sentence, <U.ref>, reads "<U.text>". The answer [<rk>] reads them together. Grade <label> on the whole sentence." This keeps the form krulSuSrc's regex at line 653 reads (/The sentence, [^\n]*?, reads "([\s\S]*)"\. The answer \[/), so line 653 does not change (W3 10746 C1, option b).
   - The audit mark is the existing "[AUDIT v35: VERSE READ APART FROM ITS SENTENCE (K-SU; TRIAL, list only) -- <label> -- <ref> within <U.ref>]".
6. Nothing else changes: K-ML, how items are grouped into a judge's send-back, every count, and every other check.
NOT IN SCOPE, under the scope rule: deciding lines that quote a verse by its words only, with no reference; STANDING lines; the enforcer's ASK 530 E-COL item, which runs on the enforcer path. W3 10590 item 5 asked how a K-SU item and another item on the same line combine. K-SU counts nothing, so there is no double count. The grouping is not changed; the builder reports, in the replay, which send-back the new items ride.

## 4. CRITERIA and DONE
Population: debate_judgments of runs ODV1-41418, 41155, 41117, 41102 and 41090 (3 judgments each, 15 in all), with their debate_results rounds and kjv_verses. Offline, no model call.
1. Known bad, 41418: each of judgments 1263, 1264 and 1265 raises exactly one new K-SU item whose sentence is Matthew 1:24-25. The item is raised; no grade is promised.
   Replay input (W3 10746 C3): the text the node saw, which is each judge's first reply as Panel Payloads and Extract Independent Verdict received it in the 41418 execution (W4 reads it from n8n). If the execution no longer holds it, the input is verdict_raw with each SUPERSEDED LINE ORIGINAL put back in place of the line that replaced it, and with the audit rows and the lines the cure added removed. The builder names which input was used, with its md5. The expected item holds on either: 1263 by its original KEYSTONE or RESULT, 1264 by its original KEYSTONE or its D5 vs C2 line, 1265 by its original D2 vs C6 line.
2. Known good, synthetic: a KEYSTONE line on 1264's text that quotes "Matthew 1:24-25" whole raises nothing. So does one that names Matthew 1:24 and Matthew 1:25 separately. A line quoting Matthew 1:18 (one sentence, ending ".") raises nothing.
3. Known good, unchanged path: the 10 stored K-SU rows replay unchanged (same items, same text), each on its run's first-reply input as in criterion 1. 41418's Numbers 1:3 item is still raised once.
4. Noise: the builder lists every new item on the 15 judgments (judgment, label, verse, sentence). "Found nothing" is not a legitimate result for 41418. STOP: if any run gives more than 30 new items, the plan returns to W2 with the list before any build is graded.
5. Readers: a new item passes through enfSilent, krulSuSrc, mlsCure, cureLabel, __mlsT and the cure prompt list, run on the 41418 items, without error. The cure prompt shows the item's text. Also:
   a. krulSuSrc returns the whole sentence text of Matthew 1:24-25 for each new 41418 item (W3 10746 C1).
   b. mlsCure, known good: a reply whose label line (for example "ANSWER CHECK: Matthew 1:25 ..." or "KEYSTONE: ...") also names Matthew 1:24, or quotes 6 running words of it, reads CURED. Known bad: the same line without Matthew 1:24 reads UNCURED (W3 10746 C2).
6. Both Library copies differ from live only at line 2278. MAP n, the header sha, runcheck and the Library Check pair all pass (test539.js --pair), as for ASK 536.
DONE: criteria 1 to 6 pass, the build is graded PASS by a non-builder, and the operator's card is pressed in W4's thread. The first released run after the write shows the K-SU mark on a deciding line, or the run shows no such line. Until then: UNEXERCISED.

## 5. WRONG-IF
1. On 41418, the new rule does not raise Matthew 1:25 within 1:24-25 on the first-reply lines named in SCOPE (rev 1), or on any ANSWER CHECK line on Matthew 1:25 that the criterion 1 input holds. Then the trigger is aimed wrong. I ran the check before posting. On each of the six lines (the three ANSWER CHECK lines and the three KEYSTONE lines), the line names neither "Matthew 1:24" nor its words "took unto him his wife", and the 41418 rounds name "Matthew 1:24". So the trigger fires on all six. Over all of 41418's deciding lines, noise534.sql raises the 1:25/1:24 pair on 22 lines before dedupe.
2. The new rule raises an item on a line that already names the other verse of the sentence (known good, criterion 2). The SQL test excludes such lines by reference.
3. Most new items fall on verses the rounds name only in a list, such as a genealogy (Matthew 1:2-16), and not as a sentence they read together. My SQL shows genealogy pairs in 41090 and 41155 (Matthew 1:2/3, 1:5/6, 1:12/11, 1:16/15). If the builder's real-code replay shows such pairs as most of any run's items, the limit needs a further test, and the plan returns to W2.

## 6. RUN EVIDENCE
Case: a judge's KEYSTONE, RESULT, WHICH HOLDS, ANSWER CHECK or LINK BROKEN line quotes a verse of a multi-verse KJV sentence, the line does not name the rest, and a round does. Mark: "[AUDIT v35: VERSE READ APART FROM ITS SENTENCE (K-SU; TRIAL, list only) -- KEYSTONE" (or RESULT, WHICH HOLDS, ANSWER CHECK) in the judgment's review notes, and a debate_enforcer_log row with rule K-SU on that label. Judges' wording cannot be forced. The noise count says such a line occurs in every one of the last five runs.

## 7. INPUTS IN GIT
This plan and noise534.sql, in git under ask534/w2/ (the commit is named in the Wall post) and at /mnt/project-files/ask534/w2/. The build's replay script and outputs go under ask534/w4/.

## 8. STEPS
1. W3 grades this plan. No card.
2. W4 runs criteria 1, 3 and 4 with the real code on the population. No card. On STOP, the plan returns to W2.
3. W4 builds Library line 2278 in both copies (engine and child), with MAP n and the header sha, and runs criteria 2, 5 and 6. No card.
4. A non-builder seat grades the build. No card.
5. The operator's write card, in W4's thread, says that the new K-SU items are TRIAL and list only: they count nothing, and no 41418 outcome changes by them. It waits on the card.
6. A non-writer seat reads back the write.
