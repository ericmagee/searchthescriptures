# pkgCDR rev 10 (W1): feed the closing contradiction enforcer (item A countermeasure)

## Rev 10 (W2 FAIL of rev 9: 31 true drops used verbs outside the list, 2 split forms, 1 past the cap; coordinator 04:58Z, weighed on the Wall 4023)
- No code filter decides whether a drop reaches the enforcer: it already receives every round in full. The prompt gains one passage: read every
  sentence of each side's rounds 1 to 3 for anything given up, in any words, with or without a verb of giving up, wherever the wording stands
  (same sentence, next sentence, a list below); each thing given up and asserted again in the closing round is a contradiction, reported as NEW
  when not among the candidates; the P candidates are HINTS from a code check and are NOT COMPLETE; how to answer a hint (CONFIRMED with the
  closing quoted, or NOT A CONTRADICTION with CLOSING [<round 4>] "").
- Hints: the rev 9 sentences, no cap, W2's verbs added (yield, cede, scrap, remove, omit, shelve, release, retire, step back, off the table,
  jettison, repudiate, disclaim, delete, excise, unsay, recede from, part with, lay down, back off, let ... fall, leave ... behind, cut ... from,
  stop claiming, cease to, done with, gone from, to one side, any more). "concede" is left out: it marks the side's grants throughout the
  debates and would list them all.
- Hint coverage (run10.txt): 213 of 214 labeled true drops are hinted; the one not hinted (W2's W131 "I concede ... to the challenger") still
  reaches the enforcer in the full round.
- Prompt size (size_CDR.txt, 35 stored debates with a closing round): added 1,319 to 9,502 characters, median 4,712, mean 4,573 (about 1,100
  tokens at 4 characters a token, an estimate); the live prompt averages 143,384 characters, so the call is 3.2% larger on average. Hints per
  debate (corpus_CDR.txt): 1 to 24, median 11; 366 in all.
- Record 5 OK (the D6 hint found by its text; counts no longer fixed). Row shapes unchanged from rev 9 (rolled-back insert of the four shapes:
  rows 4, recorded true). pkgCEC probe 62 OK, 8 FAIL (the same 8).

## Rev 9 (W2 FAIL of rev 8, Wall 4014: 21 true drops hidden; W3 FAIL, grade_CDR8_w3.md: 14 hidden by the opponent, negation and strike rules, 9 short
## wordings no wording match can cover). Option (b), weighed on the Wall (4015): the code stops extracting the wording.
- Every sentence of a side's rounds 1 to 3 that holds a verb of the drop family (drop, withdraw/withdrawal, retract, abandon, relinquish,
  renounce, surrender, disavow, recant, forgo, strike/struck, waive, rescind, discard, give ... up, take ... back, walk back, back away, concede
  ... away, set/put/lay aside, let go, no longer) is a candidate, whole, with CLOSING (not named). Filter by speaker only (the side's own
  rounds); system marks "[VOID ..." are skipped; duplicates once; at most 30 per side.
- The enforcer prompt gains one sentence: for such a candidate, name what it gives up, read the side's closing round, answer CONFIRMED with the
  closing sentence quoted, or NOT A CONTRADICTION with CLOSING [<round 4>] "". Close Enforcer Record is unchanged: a CONFIRMED line stands only
  with both quotations found word for word (an empty closing quote is NOT CONFIRMED, record_CDR R4).
- Reach (run9.txt): true drops that reach the enforcer 178 of 178 over my sets, W2's 114 and W3's seven files. Other labeled sentences that
  reach it: 172 of 173 (the enforcer rules on them).
- Stored debates (corpus_CDR.txt): 194 candidates over 39 debates (35 with a closing round): 115 defender, 79 challenger; per debate 0 to 15,
  median 5. On 34108: P1 to P6 (defender [CR3]), P6 the D6 drop; P7 challenger.
- Record (record_CDR.txt) 5 OK: P6 CONFIRMED breaks D6; six NOT A CONTRADICTION with empty CLOSING read; NONE leaves all 7 NO ANSWER; empty closing
  quote on CONFIRMED refused. Rolled-back insert of the four row shapes: rows 4, recorded true. pkgCEC probe 62 OK, 8 FAIL (the same 8).

## Rev 8 (W2 FAIL of rev 7: 12 true drops not listed; W3 FAIL: 21 planted and 12 real stored drop forms not read)
- W3's rule, with W2's classes: the structural rules of revs 3 to 7 are removed. A clause (split at ";") of the side's rounds 1 to 3 is a drop
  clause when it holds a drop verb in any form (drop, withdraw, retract, abandon, relinquish, renounce, surrender, disavow, recant, forgo,
  strike, give up / give ... up, take back / take ... back, set / put / lay aside, let go of, no longer hold / claim / ...; any tense, active or
  passive), unless at every such verb: the verb is negated ("not", "never", "nor do I", "refuse to" before it; "nothing", "none", "no", "not"
  but not "not only" after it), the passive names the opponent ("by the challenger"), the nearest subject before an active verb is the
  opponent ("the defender granted ... and withdrew"), or strike / struck is not in the side's voice. Questions stay out.
- Wordings taken from a drop clause: every quoted span (3+ words), every "that" clause (5+ words; a trailing "is withdrawn" cut off), the
  subject of a passive drop, and the determiner-led object after a first-person drop verb (3+ words; cut at as / because / which / for /
  punctuation). Conditional, hypothetical and argument's-sake drops are listed; the enforcer sees the whole earlier sentence.
- True drops not listed: 0 on every set (mine 79 + 44 rev 8; W2's 87; W3's cases, rev3, rev4, rev5, rev6, rev7). W3 rev 7 set 29 of 29.
- The rest of each set's misses are labels NOT LISTED that are now listed for the enforcer: conditional, hypothetical, "were I to", "I would
  drop", a second wording the same sentence keeps ("I drop "A" and keep "B""), "withdraw my objection to the reading that".
- Stored debates: W3's scan (corpus_drops_rev8.txt): of 174 drop-word sentences in rounds 1 to 3, 88 now give a wording (rev 7: 54). Listings
  (corpus_CDR.txt): 39 debates, 2 listings, both 34108 (the D6 pair). Three third-person reports listed in a first build (33218, 33506 "the
  defender ... withdrew"; 33750 Ezra "was struck from the register") were removed by the opponent-subject and strike rules before posting.
- Record 4 OK. pkgCEC probe 62 OK, 8 FAIL (the same 8). Log rows unchanged.

## Rev 7 (W3 FAIL of rev 6: the position rule hid 5 true drops and listed 10 false ones; W3 states the fault is its rule)
- W3's request: no condition test after the drop. cdr_fn.js is rev 3 plus the question test of rev 4 (diff against 218d7a94: the cdrCond
  filter only). Kept: the drop verb opens the sentence or clause with the wording directly after it (so a condition before the drop is not read),
  the verb is not negated, the sentence is not a question. Every other drop is listed; the enforcer is shown the whole earlier sentence.
- True drops not listed, all sets: 0 of mine, W2's W17 (as every revision), W3's H4 and H5 (a lead-in before the verb; the rev 3 structure).
- Conditional and argument's-sake drops are now LISTED by design, for the enforcer: my labels 37 (plus C9, my label error) of 79 read
  as misses; W2's 60 cases 58 of 73 in total with 14 such listings; W3's sets cases 11 of 15, rev3 6 of 12, rev4 5 of 9, rev5 12 of 18,
  rev6 10 of 20.
- Questions stay not listed. Corpus 39 debates, 2 listings, both on 34108. Record 4 OK. pkgCEC probe 62 OK, 8 FAIL (the same 8).

## Rev 6 (W3 FAIL of rev 5: six false listings and five true drops hidden by condition words elsewhere in the clause)
- W3's position rule (cdr_fn.js, cdrAfter in cdrObj): a condition counts only where it governs the drop. Before the drop verb it already does
  (the verb must open the sentence or clause). After it, only a condition starting directly after the dropped wording (quoted span or "that"
  clause), after an optional comma and an optional but / and / only / except.
- Family at that position: if (not even if, as if, if only), unless, provided/providing, in case / in the case / in the event, on (a / one / the /
  this) condition, on the understanding, supposing, assuming, (only) when, once, the day, so long as / as long as, contingent or conditional
  on/upon, barring, should / were / had + subject; for the sake of argument, for argument's sake, arguendo, hypothetically.
- Out of the family (W3): until, pending, subject to, granted that, on ... terms, the bare nouns condition / proviso. A sentence ending in "?"
  stays a question.
- My cases: 74 of 79. The misses are C9 (my rev 1 label error) and R5-N20 (until), N21 (pending), N22 (subject to), N30 (granted that): my
  rev 5 labels, now LISTED under W3's trimmed family. Listed means the enforcer sees them; I leave the labels as written.
- W2's 60: 59 (W17). W56 "..., if only to narrow LINK 6." needed the "if only" idiom out of the family.
- W3's sets: cases_rev5 18 of 18, cases_rev4 9 of 9, cases_rev3 7 of 12, cases 11 of 15 (the closes left to the enforcer and H4, H5).
- Corpus 39 debates, 2 listings, both on 34108. Record 4 OK. pkgCEC probe 62 OK, 8 FAIL (the same 8). Log rows unchanged.

## Rev 5 (W2 FAIL of rev 4, W3 agreeing: conditional drops worded "in case", "on condition that", "should the rows fail" were listed)
- cdrCond (cdr_fn.js), W2's fix taken as a family: the conditional is looked for only in the drop clause (from the drop verb up to ";",
  outside quotation marks). The family: if (not "even if", "as if"), unless, provided/providing, in case / in the case / in the event, any
  "condition" or "proviso" ("on one condition"), on ... terms, on the understanding, supposing, assuming, only when, so long as / as long as,
  until, pending, subject to, contingent or conditional on/upon, barring, granted that, and should / were / had + subject (not "even should").
  A sentence ending in "?" stays a question.
- My cases (rev 5 cases added before the run, commit 9fb16ad4): 78 of 79. 35 conditional forms NOT LISTED; 11 true drops LISTED (an "if" after
  ";", "even if", "even should", a condition in the next sentence, "in case" only inside the quoted wording, "whatever", "though", "because",
  "as"). The miss is C9, my rev 1 label error.
- W2's 48: 47 (W17, safe miss). The two rev 4 safe misses ("; if the challenger objects", "even if it costs LINK 6") are now LISTED.
- W3's sets: cases.json 11 of 15, cases_rev3 7 of 12, cases_rev4 9 of 9 (K5, K6, K7 NOT LISTED; K7 "on one condition" needed the noun form).
  The misses are the closes W3 left to the enforcer (G8, G9, G10, G13, H9, H10, H12) and two safe misses (H4, H5).
- Corpus 39 debates, 2 listings, both on 34108. Record 4 OK. pkgCEC probe 62 OK, 8 FAIL (the same 8). Log rows unchanged.

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
