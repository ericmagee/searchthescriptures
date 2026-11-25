# W1 grade: run-42528 revision rows, draft 1 (W3, commit eaf0e8f2, Wall 11942)

Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 00:14 CST 2026-11-25 (wall_stamp).

GRADE: 13 PASS, 1 FAIL (601). Rulings asked: 591 and 593 'yes' / 'proven by run' AGREED; 601 'in part' AGREED, but one stated reason is false (F1).
RULES READ: op doc s29, s30; s7.4; two-live-runs rule (10:38 CST 2026-11-24); scope rule; ASK 599 standard.
OBJECTIVE MET: yes for 13 rows; 601 row not yet (F1).
STANDARD (ASK 599): no code in these rows; not applicable.

## Checks run (all this turn)
1. File md5s of the 14 drafts equal the Wall 11942 list.
2. Per-column md5 (27 keys incl. B.builder_seats, B.sources) of each draft against its prior row in the DB:
   changed columns are exactly objective_met_reason, run_evidence, objective_source, sources, prior_row in all 14;
   plus manuals for 611 (177) and 578 (181); plus objective_met and status for 591 (194) and 593 (188); plus objective_met for 611 (177, 'no' to 'in part'). Nothing else moves.
3. objective_met_reason: the first length(prior) characters of each draft hash to the DB md5 of the prior text (14 of 14); one RUN REVISION 42528 paragraph is added in each.
4. run_evidence.prior_run_evidence hashes to the prior row's run_evidence (14 of 14).
5. Facts in the new paragraphs checked against the run's rows (debate_results e0e528d8):
   - E-L2G: 2 rows, sol, send_back, CURED (586J2). MATCH.
   - J6 class rows: qwen4max 8, sol 6, sol62 6, chatgpt 3 = 23 (586J6). MATCH.
   - E-CLOSECON: 84 rows, seat "close enforcer"; Close Enforcer Call 4 (590). MATCH.
   - Row 54719: alternate_reply, seat sonnet, "returned no JSON object" (578). MATCH.
   - E-GATE rows: sol 19, sol62 2 (plus chatgpt 2, an alternate); Send Back Call 3, Gate Call 2, Late Gate Call 1; 0 rows "no panel request" (611). MATCH.
   - luna 27 calls, glm 0 (608). MATCH. 424 / 417 / 7 enforcer_check split: MATCH (my count before this grade).
   - haiku: 0 in review_notes, call_costs, enforcer judge_model (593). MATCH.
   - R2 Alternate Call openrouter 1 (578, 627). MATCH.

## Rulings
- 591 (row 194) and 593 (row 188): the only Open condition each prior row names is the operator's two-live-runs rule; 42373 was counted as the first (Wall 11785, 11890). 42528 is the second with no issue for these ASKs. 'yes' / 'proven by run' AGREED. 591's "panel the operator ordered could not sit" is correctly kept as a finding outside the ASK.
- 601 (row 195): 'in part' AGREED. Reason it holds on its own: the family rule bars both seats in this pairing anyway (model_config: hydrogen family google, spark family meta; debaters google/gemini-4-hydrogen and meta/muse-spark-1.3), so run 42528 shows the objective's outcome but does not show the ASK 601 guard acting alone. That is my reasoning from model_config and the family rule, not a reason read from the run's record.

## F1 (FAIL, row 601)
The paragraph and run_evidence.case keep 601 'in part' partly because "the manual entry's Limits line is owed its one-pair revision". The prior row's own manuals column says that revision was written: part 10.0 v308, log row 328, 15:32 CST 2026-11-24, W1 readback MATCH Wall 11731 (engine_manual_log row 328, title "ASK 601: the Limits line states what run 42283 shows", read this turn). Fix: drop that clause; state the remaining reasons (revert601_db.sql not rehearsed; each path one run; and, if W3 agrees, that the family rule masks the guard in this pairing). Change only objective_met_reason and run_evidence.case of 601.

## Notes (no change required)
N1. 579 counts 42528 as a first clean run while four of the nine nodes (C4G, D2B, C4B, C3B) remain unexercised; the paragraph says so. Acceptable as written.
N2. 611's "57 panel send_back rows at 23:20:59" is a time-scoped subset; the run holds 110 panel-seat send_back rows in all (gate and E-APPLY rows included). The paragraph's scope is stated; acceptable.
