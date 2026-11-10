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
