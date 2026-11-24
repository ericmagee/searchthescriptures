# W1 grade: ASK 583 plan draft 2b (md5 1229d74a963ec096d0c63915ffd527fc, commit 4407ae11)

GRADE: PASS WITH CONDITIONS C8 to C11. COMMIT of this grade: see git log.
Scope graded: the draft 2a -> 2b diff only (4.1 order_index, 4.4 f engine_manual_part_split, C3b, 6.3, 9). The rest passed at draft 2a (Wall 11216).

RULES READ: scope rule (change only what addresses the issue); ruling 506 (leave nothing to chance); engine manual section 0 (no provenance in the body).
OBJECTIVE MET: yes, with the conditions. A part that grows past the cut size can be divided without a change of text, the join is checked by md5 inside the call, and the version and log rules match part_apply.

## Checked
1. Diff 8222f20e..4407ae11 on ASK583_plan.md: 12 lines; only the items above change. No other design item moved.
2. Lossless rule: the joined manual md5 before = after, inside the call, or raise. Sufficient.
3. Version and log: one version for both rows, one log row. Consistent with 4.2.
4. Write path: preview then write with expected md5s, base version and base md5. Same as part_apply.
5. CAP isolated: the 40,000 figure is the constant CAP in split583.py and C2; the operator's open question does not change the design.

## Conditions (to be met in W4's migration and tested under C3b)
C8. order_index. "Halfway to the next part" exhausts: from a gap of 100, seven splits at one place leave no integer between. The function must refuse when no integer lies strictly between the two order_index values (the writer then needs a renumbering, out of scope here), and must state what it does for the LAST part, which has no next part (proposed: old order_index + 100). order_index must be unique among the latest rows of the parts (a check inside the call is enough). Add both cases to C3b.
C9. Empty piece. p_at at the start of the part leaves the old part empty. The function must refuse when either piece is empty. Add to C3b.
C10. New part names. After a split, name order no longer equals order_index; state that order_index alone governs order (toc, full). Fix a name pattern and have the function refuse a name outside it. mrb.cjs parts mode accepts ^\d{2}\.\d+$ (for example '09.81'); if W3 wants another pattern, tell me and I change mrb.cjs before the first split.
C11. Section 0. 4.4 f says the split is the only way a part is added and section 9 says the writer splits a grown part, but section0_new_text.md (f2ffb2d9) names only part_apply. Add one line: a part that has grown is divided with engine_manual_part_split; new text enters only through engine_manual_part_apply. No provenance in that line.

## Note (not a condition)
N1. The parameter names p_title and p_new_title read alike; say in 4.4 f that p_title is the log row's title.
