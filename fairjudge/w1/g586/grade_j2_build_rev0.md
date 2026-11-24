# W1 grade: ASK 586 J2 build rev 0 (Wall 11511)

GRADE: PASS. The deviation is ACCEPTED. notes_j2.md 823dfc37; four targets A (live), B (595c), C (J3 A), D (J3 B).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: texts586_J2J3J6.md 78ba341a section 1 (W1 PASS with C6); ruling 512; 428; 383; 587 A and 595; ASK 599 rules 1 and 3; the ASK 596 standing set; build rule; scope rule; the body law (the text says only what the engine does).
OBJECTIVE MET: yes, with option A.
STANDARD (ASK 599): rule 3, no new cut; E-L2G stores `flagged_line:__ll,response_line:__ll` with `__ll=__l.trim()`. The standing set gives 29 PASS on all four targets (run by W1).

## W1's own checks
- Node by node: A, B, C and D each change only Panel Build, BIV and the Shared Library; the A child changes only its library. Library lines changed on A: 2784, 2789, 2929, 2953, 2959, 3564.
- Hunk walk on A against live (hunks_j2.js):
  - Panel Build and BIV: 4 hunks each, exactly texts 1.1. Two form changes, `, <gloss>)` to `): "<the gloss as a side quoted it, word for word>" [<round>]`, and two added sentences "If the deciding step of a break says more than the quoted gloss says, ...".
  - LIB 2953: the form only.
  - LIB 2784 `it.l2g&&!`; LIB 2789, the record line; LIB 2929 and 2959, l2g.
  - LIB 3564: a pure append of 4,994 characters, with nothing before it changed.
- Texts 1.3 stand word for word with the option A cost sentence, and all three FAULT forms are present.
- t_j2 run by W1 on A: ALL PASS (37). E1 (E-COL reads the new form as the old) answers my C6 condition.
- Baseline 298e5705: only the two `__ll` entries are added, and I read the setter.

## Ruling: the LIB 2953 counting clause
ACCEPTED as built. Under option A the live E-COL [L2] count does not read the gloss. The texts 1.2 clause ("and the quoted gloss stands in the round named, beside that number") would tell the judge a rule the engine does not apply. That breaks the body law and ruling 383 (the judge grades the text it is shown). The clause goes in only with an option B build. The card should say this in one line.

## Notes for the card (plain words)
- First runs: on the 12 stored judgments, 38 of 67 break lines carry an old-form [L2] with a number. Each would go back once (fault 1 or 3). That is 11 of 13 on run 42071. Under option A none counts, but it is one more send-back item per such line until judges use the new form.
- K-GLS (TRIAL, record-only) reads only the old form, so it goes quiet on new-form lines. State it.
- The pre-existing stop (14 of 123 panel passes and 22 of 72 alternate passes with no enforcer item) applies as for J3.
- The order of writes: J2, J3 and the 595 follow-on each refuse a changed base. The four targets cover every order; say which one is written.
