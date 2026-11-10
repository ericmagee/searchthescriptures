# pkgFUN (W1): COUNTED with a negation in its reason is not refused unless the negation is aimed at the count

Found by W1 grading pkgKCB (Wall 3867); coordinator 00:38Z 11-10: build on live s97, graders W3 and W4.
Base: live s97 library (pkgFUK rev 3 + pkgFCD + pkgKNL rev 5) = pkgLIB/strip_KCB_base; s97 rebuilds byte-equal to it (30 of 30).

Fault (pkgFUK rev 3, ENFORCED, live since s96): the K-S3 COUNTED reading refuses any negation in the answer's first sentence. A correct COUNTED whose reason describes the concession with a negation ("COUNTED: by this grant D6 does not stand.", "COUNTED: the defender no longer holds D6 as declared.") reads UNCURED, is asked once, and a judge that repeats it stays UNCURED (can be removed).

Fix (cureVerdicts, the K-S3 COUNTED line; 26 library files): a negation refuses COUNTED only when aimed at the count itself: not/never/no/nor/cannot/neither/none/n't, up to two filler words (a, an, the, be, been, being, is, was, this, that, it, to, as, so), then concession, conceded, conceding, counted, countable, right, correct, true, accurate, apply/applies/applied, agree*. Read over the whole answer. The rest of rev 3 is unchanged: COUNTED must be the first word, then the end or punctuation.

Build: `node pkgFUN/build_FUN.cjs`; `FB=/mnt/project-files/wall2024/fetchback_live_s97.json node gate/pack.cjs pkgLIB/strip_FUN pkgLIB_FUN`; `node pkgFUK/parent_on.cjs <fb s97> pkgLIB_FUN pkgLIB/strip_FUN pkgFUN/parent_s97_FUN.json`.
Write file: pkgFUN/parent_s97_FUN.json: 418 nodes, 1 changed (Shared Library), connections unchanged, 30 sources byte-equal to strip_FUN.

Proof:
- probe_FUN.cjs 50 OK (34108 luna, Normalize and Check nodes, live base against FUN):
  - correct COUNTED with negations: "D6 does not stand", "no longer holds D6", "cannot hold ... without conceding D6", "D6 is not held once ...": live UNCURED, FUN CURED.
  - correct COUNTED with "withdrew", "retracted", "concedes what D6 had denied", "though it came late", "disputed", "objected earlier but", "not a mere title", "I do not dispute it", "My count did not include this grant": CURED live and FUN.
  - refusals aimed at the count: "That is not right.", "It should not be counted.", "it does not apply here.", "I do not agree.", "This is not correct.": live CURED, FUN UNCURED; "it is not a concession", "COUNTED, not a concession.", W3's five forms of 3817, "Counted.": UNCURED both.
  - pkgFUK rev 2 B and C cases rerun on FUN.
- replay_FUN.cjs: 176 stored cure replies byte-equal (no stored K-S3 answer is COUNTED).
- gate_FUN_s97.txt: see the Wall post.
- Rolled-back insert of 2 rows (panel cure K-S3 CURED with a negation, panel cure K-S3 UNCURED "That is not right."): accepted, rows 2.
Not covered: "COUNTED, but that is wrong." still reads CURED (no negation); pkgKCB's reservation list is the place for it. pkgKCB rebases on this file (same line).
Manual part: "A K-S3 answer reads COUNTED when COUNTED is its first word; a negation in the reason refuses it only when it denies the count itself (not a concession, not right, not counted, does not apply)."

## Rev 2 (W1, 2026-11-10)

Rev 1 was failed by W3 (its negation targets were too broad). Rev 2 replaces the
negation test in the K-S3 COUNTED reading with W3's closed list of present-tense
refusals (pkgFUN/w3_grade/w3_closed_list_idea.cjs), with two changes by W1:

- "could" and "may" are dropped from the modal group, so "I could not count it
  before the close" is no longer read as a refusal.
- Quoted text is skipped before the list is applied, so a quoted refusal does not
  count as the seat's own refusal.

KCB's case is carried: "COUNTED, but that is wrong." reads UNCURED.

Files:
- build_FUN2.cjs: builds pkgLIB/strip_FUN2 from pkgLIB/strip_KCB_base.
- probe_FUN2.cjs / .txt: W3's 34 correct answers and 28 refusals through the
  nodes, plus KCB's case and the B and C cases: 84 OK, 0 FAIL. Against live, 7
  correct answers move to CURED and 20 refusals move to UNCURED.
- w1/w1_plant_FUN2.cjs / .txt: 10 extra W1 plants. None moves CURED to UNCURED.
  Three move UNCURED to CURED (a quoted refusal, "it is a concession, not a
  courtesy", "cannot hold D6 and this grant together").
- replay_FUN2.cjs / .txt: 176 stored replies, byte-equal.
- gate_FUN2_s98.txt: gate against the s98 fetch-back: 767 node runs byte-equal or same error, 0 target item changes, 17 near-miss checks passed, GATE PASS.
- parent_s98_FUN2.json: write file. Against live s98 only the Shared Library
  differs; connections equal; 30 sources byte-equal to strip_FUN2.
- Rolled-back insert (tag W1-FUN2-ROLLBACK, one CURED and one UNCURED panel
  K-S3 cure row): accepted, {"rows": 2, "recorded": true}.

## Rev 3 (W1, 2026-11-10)

Rev 2 was failed by W4 (Wall 3890: a leading but/though/yet refused correct answers) and by W3 (Wall 3894: 17 of 20 further
correct answers read UNCURED; listed words inside a longer sentence were read as a refusal). Rev 3 takes W3's fix
(w3_grade/w3_whole_sentence_idea.cjs): a refusal is a WHOLE sentence from the closed list, or the whole remainder after
"COUNTED, but/though/yet/however"; a connector alone is not a refusal, and listed words inside a longer sentence are not a refusal.
The reader is pkgFUN/fun3_ref.cjs, put into the K-S3 line by build_FUN3.cjs. W1 added whole-sentence refusals from both graders'
lists (see the file header). Eric ruled (19:05 CST 11-09) that the live version stays and the fix is written on top.

- allplants_FUN3.cjs / .txt: every planted COUNTED answer from W3's and W4's rev 1 and rev 2 grade files, and W1's, through the
  live s98 line and the rev 3 line. 149 distinct answers. Correct 91: rev 3 reads all 91 CURED; none that live reads CURED
  is lost; 29 that live reads UNCURED now read CURED. Refusals 58: rev 3 reads 54 UNCURED (live 25). The 4 read CURED are
  reservations from W3's first list ("COUNTED, though late in the round.", "COUNTED, yet the link stands.", "COUNTED, unless
  the titles are excluded.", "COUNTED, although it grants only titles."), which W3 now holds should not remove a seat.
- W2's independent test set (pkgFUN/w2_testset, 113 cases labeled from the rulebook): rev 3 matches 112 (live s98 73, rev 2 82);
  w2_testset_FUN3.txt. The one miss is "COUNTED.\nThat is not right.": the refusal is on a second line, outside the RESPONSE line,
  which Normalize does not pass to the reader (label for W3 to rule). To reach 112, rev 3 also widens the COUNTED opening:
  a bullet, a numbered opening, ANSWER: or RESPONSE: before COUNTED is taken off, and closing markup then a space, a parenthesis
  or a single dash may follow COUNTED ("**COUNTED** The defender ...", "- COUNTED. ...", "`COUNTED` the ...",
  "COUNTED (correcting my count): ...", "COUNTED - the grant ..."). Further whole-sentence refusals from W2's set are in fun3_ref.cjs.
- probe_FUN3: 80 OK, 4 FAIL; the 4 are the reservations above (read CURED, as live does).
- replay_FUN3: 176 stored cure replies byte-equal.
- gate on the s98 fetch-back: 767 node runs byte-equal or same error, 0 target item changes, 17 near-miss checks passed, GATE PASS.
- Rolled-back insert (CURED "COUNTED, though the defender calls it a courtesy.", UNCURED "COUNTED, but I disagree."): accepted, rows 2.
- Write file parent_s98_FUN3.json: against live s98 only the Shared Library differs (form 3 pack, pkgLIB_FUN3S).

## Rev 4 (W1, 2026-11-10)

Rev 3 was failed by W3 (Wall 3933): it tested every sentence, so a short later sentence that points back at the defender's claim
("The defender calls it courtesy. It is not.") read as a refusal. W2's extended set (Wall 3928) found five refusals rev 3 read CURED.
Rev 4 reader: pkgFUN/fun4_ref.cjs, built by build_FUN4.cjs into pkgLIB/strip_FUN4 from strip_KCB_base (the s98 and s100 Shared Library are the same).
- W3's split: list P (points back: "that is wrong", "it is not", "no", "I disagree", "it does not apply", "withdrawn", "not counted" ...) is a refusal
  only as the FIRST sentence after COUNTED; list B (names the count or the grant: "I retract my count of it", "I do not count it after all",
  "my count stands", "the count is wrong", "it should not be counted", "that grant is not a concession of D6", "that grant does not apply to D6",
  "the defender did not concede it", "I maintain my first answer" ...) is a refusal in any sentence.
- Markup marks (* _ backtick [ ]) are set aside before the split, so "**COUNTED.** That is not right." reads like the plain form, and
  "[COUNTED] ..." opens like "**COUNTED** ...". A leading but/though/although/yet/however/and/still/so/then is taken off each sentence.
Checks:
- W2's set (now 180 cases): rev 4 175 match, 0 correct answers refused (live s98 120). The 5 misses: 3 refusals on a second line, outside the
  RESPONSE line (W3 ruled this a limit of what reaches the reader; W2 is building it); 2 pointing-back refusals after a neutral sentence
  ("The grant is in round 4. I do not agree.", "I have read the note. That is wrong."), which W3's first-sentence rule accepts as misses.
- W3's 16 pointing-back correct answers: all CURED (line level); W3's node plant on rev 4 (w3_plant_FUN3_nodes_on_FUN4.txt): 0 of 6 correct read UNCURED.
- All graders' planted answers (allplants_FUN4.txt, 170 distinct): correct 107, all CURED, none lost against live; refusals 63, 57 UNCURED (live 25).
- probe_FUN4: 80 OK, 4 FAIL (W3's four reservations, CURED as on live). replay_FUN4: 176 stored replies byte-equal.
- Gate on the s100 fetch-back: 767 node runs equal, 0 target item changes, 17 near-miss checks passed, GATE PASS.
- Rolled-back insert (CURED "COUNTED. The defender calls it courtesy. It is not.", UNCURED "COUNTED. I retract my count of it."): accepted, rows 2.
- Write file parent_s100_FUN4.json: against live s100 only the Shared Library differs (form 3 pack, pkgLIB_FUN4S).

## Rev 5 (W1, 2026-11-10)

W3 failed rev 4 (grade_FUN4_w3.md): splitting the whole answer at colons and dashes let reported speech ("Earlier I wrote: my count stands.") and
pleas the judge rejects ("... I refuse.") read as refusals, 12 of W3's 20 new correct answers. Rev 5 takes W3's rule (w3_first_sentence_idea.cjs):
- ENFORCED: only the first sentence after COUNTED, cut at . or ! only, when the whole of it (after a leading but/though/yet/however/and/still/so/then)
  is a sentence of list P or B; this also covers "COUNTED, but I disagree." A first sentence that ends in "?" is never a refusal.
- RECORD-ONLY NOTE: when the first sentence is not a refusal but the rev 4 reader finds a listed sentence later, the reading stays CURED and the
  cure reason reads "answered: the close concession is counted (NOTED, record-only: a later sentence reads like a refusal: "...")". The reason
  keeps its prefix, so the library's tests of it are unchanged.
- Reader pkgFUN/fun5_ref.cjs; build build_FUN5.cjs -> pkgLIB/strip_FUN5 from strip_KCB_base (Shared Library equal in s98, s100 and s102).
Checks:
- fun5_ref against W3's sketch on all of W3's tables (120 texts, good and bad, 4n included): 0 differ in enforced or noted.
- W2's 180 (w2_testset_FUN5.txt): 164 match, 0 correct refused; 16 refusals CURED (12 later sentences, 1 first sentence "I reverse that: it is not counted.", 3 on a second line; 11 of them NOTED), the same 16 W3's sketch names; live s100 reads all 16 CURED.
- W3's node plants (w3_plant_FUN4_nodes_on_FUN5.txt): 0 of 6 correct read UNCURED; "COUNTED. I refuse." UNCURED.
- All planted answers (allplants_FUN5.txt): 107 correct all CURED, 0 lost against live; 63 refusals, 56 UNCURED (live 25).
- probe_FUN5: 80 OK, 4 FAIL (W3's four reservations, CURED as on live). replay_FUN5: 176 stored replies byte-equal.
- Node-level reason (note_rows_FUN5.txt): a later "I retract my count of it." reads CURED with the NOTED text.
- Gate on the s102 fetch-back: 767 node runs equal, 0 target item changes, GATE PASS.
- Rolled-back insert (rollback_FUN5.sql, the NOTED CURED row and an UNCURED row): {"rows": 2, "recorded": true}.
- Write file parent_s102_FUN5.json: against live s102 only the Shared Library differs; connections equal.
The trade (later refusals noted, not enforced) is the operator's to approve before the write.

## Rev 6 (W1, 2026-11-10)

W3 failed rev 5 (grade_FUN5_w3.md): a first-sentence pointer followed by its explanation ("COUNTED. I withdraw that. The grant is a close concession
of D6 and I add it to my count.") was enforced; live reads it CURED. The fault was in W3's rule, built faithfully. Rev 6 takes W3's measured fix
(w3_pointer_idea.cjs):
- A sentence of list P (that / this / it / one word) is ENFORCED only when it is the whole answer after COUNTED; when text follows, it is NOTED.
- A sentence of list B (names the count or the grant) stays ENFORCED as the whole first sentence.
- "!" directly after COUNTED is read as a stop. A first sentence ending in "?" (alone or in a run of marks) is never a refusal.
- Reader pkgFUN/fun6_ref.cjs; build build_FUN6.cjs -> pkgLIB/strip_FUN6 from strip_KCB_base (Shared Library equal in s98 to s103).
Checks:
- fun6_ref against W3's sketch: 387 texts (all of W3's tables, good5 and bad5 included, and W2's 257), 0 differ in enforced or note.
- W2's 257 (commit 133cd0ee):
  - narrow column (w2_testset_FUN6_257_narrow.txt): 251 match, 0 correct refused. The 6 misses are those of rev 5 on the 210: "I reverse
    that: it is not counted." and 5 of W3's first-sentence refusals not in the lists. 3 NOTED cases have no note, and 19 notes fall on cases not
    labeled NOTED, all on correct answers whose status stays CURED.
  - old column (w2_testset_FUN6_257_old.txt): 233 match, 0 correct refused.
- W3's 36 new correct answers through the nodes (w3_plant_FUN5_nodes_on_FUN6.txt): 0 read UNCURED (rev 5: 4).
- All planted answers (allplants_FUN6.txt): 107 correct all CURED, 0 lost against live; 56 of 63 refusals UNCURED.
- probe_FUN6: 80 OK, 4 FAIL (W3's four reservations, as live). replay_FUN6: 176 stored replies byte-equal.
- Node-level reason (note_rows_FUN6.txt):
  - "COUNTED. I withdraw that. The grant is ..." reads CURED with the NOTED text;
  - "COUNTED. I withdraw that." alone reads UNCURED.
- Gate on the s103 fetch-back: 767 node runs equal, GATE PASS. Rolled-back insert (rollback_FUN6.sql): {"rows": 2, "recorded": true}.
- Write file parent_s103_FUN6.json: against live s103 only the Shared Library differs; connections equal.
- W4's 32 new forms (w4_grade5/w4_new_forms.txt, narrow; w4_new_forms_FUN6.txt): live 22, rev 6 25 (the same as rev 5), worse than live on 0.
  - Correct refused, by live and rev 6 alike: "Counted. The grant stands." (lower-case keyword; W4 asks W2 for the label).
  - Refusals read CURED (not in the lists): "I decline.", "Scratch that.", "I take it back.", "Nope.", "Disregard this line.", "My answer stays as
    before.". Live reads them CURED too. Candidate list additions, not built: rev 6 is W3's measured rule as given.
The trade (pointers followed by text and later refusals are noted, not enforced) is the operator's to approve before the write.
