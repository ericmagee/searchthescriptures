# W1 grade: ASK 586 J3 build rev 0 (Wall 11508)

GRADE: PASS with R1. notes_j3.md 5b527f95. Targets A 1e9ba34a / e4e94b51 (on live 04273989 / c9acb53a) and B 8be5112a / 0b51d98c (on the 595 follow-on targets).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: texts586_J2J3J6.md 78ba341a section 2 (W1 PASS, Wall 11460 F1); ruling 512 (live); ruling 428; 587 A and 595 (whole lines); ASK 599 rules 1 and 3; ASK 596 standing set; build rule; scope rule.
OBJECTIVE MET: yes. A break line that says a side granted something is sent back unless it names the grant, the judges read THE GRANTS LISTS, and the item is record-only (option A).
STANDARD (ASK 599): rule 3, no new cut (the gatherer drops OGR's 260 and 160 cuts; the E-GRT flagged_line and response_line are the judge's trimmed line, `flagged_line:__gl,response_line:__gl`). Standing set 29 PASS on A and B.

## W1's own checks
- Node by node: A and B each change only Panel Build, Build Independent Verdict and the Shared Library (LIB 2784, 2789, 2929, 2959, 3564); the child changes only in its Shared Library; connections are equal.
- Insertion walk (ins_j3.js), A against live: every change is an INSERTION. Panel Build +3,588 (gatherer and block), +343 (text 2.1), +9. BIV +343 (text 2.1). LIB 2784 +10 (`it.grt3&&!`), 2789 +337 (record line), 2929 and 2959 +18 each (grt3), 3564 +7,469 (the check). Nothing live is changed or removed.
- The texts word for word in target A: 2.1 once in Panel Build and once in BIV (one copy per judge request, as section 1 item 1 says); the 2.2 header once in Panel Build; 2.3 with all three FAULT forms and the option A COST sentence.
- t_j3.cjs run by W1: ALL PASS (50).
- The standing set run by W1: target A 29 PASS; target B 29 PASS.
- The baseline change (fde5f98a, against baseline_before_j3.json): only the two `__gl` entries are added to s3_unresolved. I read the setter: `const __gl=__l.trim()` on a line of verdict_raw, stored whole. The entries are accepted, with J3 named as their ASK.

## R1 (on the card, in plain words)
Pre-existing, and not changed (scope rule): Send Back Build stops ("no enforcer reported a violation in a panel judge line") before LIB 3564 runs. So an E-GRT item reaches a judge only on a pass where some enforcer item already exists for the panel. The E-REVCLOSE and E-ASSUME items have the same limit.
The operator asked for J3 live (ruling 512), and this limit decides how often it acts. Before the card, W4 states on stored runs (the last 30, say) how many panel passes had no enforcer item, and so would send no E-GRT item. The card says it in one sentence, and offers moving the stop as its own ASK.

## Notes for the card
- Option A (record-only) is built; option B is not. The J2/J3 card's choice stands with the operator.
- C7 measure: 4 of 67 stored break lines fire, all fault 1; one (1270) has its side inferred from DEFENDER LINK BROKEN. Say so.
- Request growth: 2,323 characters on 42071, against 143,318 of rounds. It is uncapped.
- Base handling: B exists if the 595 follow-on goes first. The write script refuses any other base.
