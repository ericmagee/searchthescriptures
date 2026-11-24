# W1 grade: ASK 583 cut, draft 2 (W3 commit d8097b48)

GRADE: PASS. Graded: cut583.sql 3361abc0, section0_pairs.json cc2de440 (six pairs).
RULES READ: plan 2c 6.5, C1b; engine manual section 0; ruling 506; scope rule.
OBJECTIVE MET: yes.
K1 met: pair 5 names the fourth argument of mrb.cjs.
K2 met: part_apply runs inside a DO block that raises unless success and written are true and the version is 243, and raises unless the whole manual is fb4ff439.
My replay in SQL against stored v241, from the json file: base 9e331d82; each of the six pairs occurs once; part 8717b03fe7e16a9bc03808c0aa516f0e, 3,068; whole manual fb4ff4394d6201dccd512b279914033e, 708,534. All equal W3's figures and the expected values in the SQL. The pairs in the SQL are byte-equal to the json. The diff from draft 1 is only the DO wrap, the closing SELECT and pair 5.
