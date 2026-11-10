# pkgCDR rev 4 (W1): feed the closing contradiction enforcer (item A countermeasure)

## Rev 4 (W3 FAIL of rev 3, w3_grade/grade_CDR3_w3.md: a conditional drop and a drop phrased as a question were listed)
- cdrCond (cdr_fn.js), W3's fix: an earlier-round sentence that ends in "?" (markup and closing quotes aside), or that holds "if", "unless" or
  "provided" after the drop verb outside quotation marks, is not read as a drop.
- Built on live s103: parent_s103_CDR.json (three nodes differ from live, as rev 3).
- My cases (rev 4 cases added before the run, commit 8702ad59): 32 of 33. NOT LISTED: W3's H7 and H8, and "unless", "provided", "only if",
  "?" inside bold. Still LISTED: a plain drop, "if" only inside the quoted wording, "!" at the end, a condition in the next sentence.
  The miss is C9, my rev 1 label error.
- W2's 40 cases: 39 of 40 (W17, safe miss, as before).
- W3's 15 rev 2 cases: 11 of 15. W3's 12 rev 3 cases: 7 of 12 (H7 and H8 now right). G8, G9, G10, G13, H9, H10 and H12 are LISTED and left
  to the enforcer by W3; H4 and H5 are safe misses.
- Corpus: 39 debates, 2 listings, both on 34108, as rev 3. Record: 4 OK. pkgCEC probe on these nodes: 62 OK, 8 FAIL, the same 8 as rev 3.
  Log rows unchanged (rows_CDR.json).

## Rev 3 (W3 FAIL of rev 2, w3_grade/grade_CDR2_w3.md: 7 false listings from sentences that do not drop the wording)
- cdrObj (cdr_fn.js), W3's proposal:
  - A drop is read only when the drop verb opens the sentence or clause, after list marks, markup and labels ending in a colon such as
    "LINK 6: NARROWED TO:".
  - The dropped thing must follow the verb directly: a quoted span, or the/my/this/that/any + wording/word/words/phrase/claim/limb/sentence/
    reading/premise/step + a quoted span or a "that ..." clause. Only that first object is taken.
  - A sentence is read clause by clause at ";" and at ", but I" / ", and I"; an adverb may stand before or after the verb.
- Built on live s103: parent_s103_CDR.json.
- My cases (W3's seven and a labeled-colon drop added before the run, commit 2faf3de2): 22 of 23. The miss is C9, my rev 1 label error.
  R2 (", but I drop ...") is read through the clause split.
- W2's 20 cases: 19 of 20. W17 "I drop not only the bare statement but the wording ..." is missed, in the safe direction, as W2 labeled it.
- W3's 15 cases: 11 of 15. All 7 FAIL cases are now right. The 4 misses are G8, G9, G10 and G13, which W3 left to the enforcer: the close holds
  the wording without asserting it.
- Corpus: 39 debates, 2 listings, both on 34108. Record: 4 OK. The log rows are byte-equal to rev 1's (rev 1 rolled-back insert; W3's insert of
  3 rows on rev 2).

# Rev 2

## Rev 2 (W2 FAIL of rev 1, w2_grade/grade_CDR_w2.md)
- Fault: a refused drop ("I drop nothing: the wording ... stands.", "I withdraw none of ...", "I give up no part of ...", "I retract nothing; ...") was read
  as a drop, and the close repeating the kept wording was listed. Fix (cdr_fn.js, W2's proposal): the drop verb must not be followed by nothing, none,
  no, neither or not. Another "I drop ..." later in the same sentence is still read (case R2).
- Built on live s103 (the three nodes are the same in s102 and s103): parent_s103_CDR.json.
- My cases (R1-R3 added before the run, commit bcd29617): 14 of 15. The one MISS is still C9, my label error from rev 1. W2's 16 cases: 16 of 16.
- Corpus: 39 debates, 2 listings, both on 34108. Record: 4 OK. Log rows are byte-equal to rev 1, so rev 1's rolled-back insert covers them.

# Rev 1

NOT FOR WRITE until the operator answers (coordinator 02:22Z 11-10). Base: live s102 (rev 2: s103). Write file parent_s103_CDR.json (rev 3), built by
`node pkgCDR/build_CDR.cjs /mnt/project-files/wall2024/fetchback_live_s102.json pkgCDR/parent_s102_CDR.json`. Three code nodes change. No library node,
no connection, no prompt wording, and no log row shape change.

**The miss (execution 34299, dry regrade of 34108; W1 Wall 3950, W3 3958).** With no candidate listed, DeepSeek read only the challenger, answered NONE,
and missed the D6 drop and reclaim. The "ordinary means" pair, which the CLOSE-ROUND REVERSAL CHECK served to the judges, reached no enforcer.

**Changes**
1. Close Enforcer Build (before the panel), cdr_fn.js. Wording a side dropped or withdrew in rounds 1-3 is listed as candidate P<n> when the same
   side states it again as its own in its closing round. A drop sentence is "I drop / withdraw / retract / give up / abandon ...". The wording is a
   quoted span of 3+ words with 2+ content words, or an unquoted "claim / limb / wording / sentence / reading / premise / step that ..." clause of
   5+ words. A closing sentence counts when the wording is outside its quote marks and the sentence does not itself drop, withdraw or grant.
   There are at most 12 per side. Oracle candidates (item B) come first, and a P pair on the same closing sentence as an Oracle pair is left out.
2. Close Enforcer Record reads a P<n> id as it reads X<n> and J<n>. All checks on an answer are unchanged.
3. Judge Contradiction Build (after the panel), jc_feed.js. The pairs of the CLOSE-ROUND REVERSAL CHECK (ruling 412, as served in Panel Build) and
   the ANTI-CHEAT CHECK (ruling 427, Anticheat Record's REVERSED rows) are listed beside the judges' pairs. The earlier round is found by
   word-for-word search of that side's rounds 1-3. A pair overlapping one already listed joins it ("also named by ..."). The reversal check runs in
   Panel Build, after the closing enforcer, so it can feed only this later call. Known limit (pkgCEC rev 2): a break confirmed after the panel does
   not reach the single judge.

**Checks** (labels in cases.json, committed before each part was written or run: 5ddd06f1, 050480b1)
- run_cases.txt: 11 of 12.
  - C1: the 34108 D6 pair is listed as P2.
  - C2, C3, C4: planted restatements are listed.
  - C5 to C8: a reported drop, a quote, a paraphrase and a one-word drop are not listed.
  - C9 MISS is a wrong label of mine: with "Christ had no biological father." removed, [CR4] still holds "... with no biological father needed to
    complete it." (P1), which carries the dropped wording. The listing is right; whether it contradicts is DeepSeek's answer.
  - Post-panel on 34299: the "ordinary means" pair is listed (J2, by the reversal check). The Luke 1:34 pair is listed once (J1, the judges' pair,
    "also named by the ANTI-CHEAT CHECK"). No other new candidate.
- corpus_CDR.txt: 39 stored debates (4 have no closing round). Only 34108 lists anything (P1 and P2); every other debate lists none.
- record_CDR.txt, 4 OK:
  - the prompt lists P1 and P2;
  - a CONFIRMED P2 breaks D6, and a NOT A CONTRADICTION P1 breaks nothing;
  - a NONE reply leaves P1 and P2 NO ANSWER;
  - the log rows keep the rev 4 shape.
- pkgCEC probe on these nodes: 62 OK, 8 FAIL. All 8 assert that 34108 has no candidate, so its written replies now leave P1 and P2 NO ANSWER rows
  or extra candidates. With the drop check switched off (same nodes otherwise): 70 OK, 0 FAIL.
- Rolled-back insert (rollback_CDR.sql, 5 rows: CONFIRMED, NOT A CONTRADICTION, 2 NO ANSWER, NONE FOUND): {"rows": 5, "recorded": true}.

**Not in this package**
- W3 3958 point 6: the K-W withdrawal list has no item for the D6 drop. That is the library's withdrawal reader, a separate fix.
- Point 4: the served checks still say "DISREGARDED". That wording is the operator's.
- Point 9: question-round answers are W3's.
