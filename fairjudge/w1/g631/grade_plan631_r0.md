# W1 GRADE: ASK 631 plan rev 0 (ask631/w4/plan631.md md5 dbe7362f, commit 9d1ab08d)

GRADE: PASS WITH N1 to N3
RULES READ: build rule, op doc s29 (stacked packages, one revert file each), card rule (table, function and engine nodes are infrastructure), ASK 599.
OBJECTIVE MET: yes. On a panel failure the held enforcer rows and the judge texts are kept, in a table no count reads.
STANDARD (ASK 599): C5 names it; graded at build.

Checked this turn:
- debate_enforcer_log: 0 rows for the 42517 row (created 04:11:40Z); 659 for 42528. Matches s5.
- Functions naming debate_judgments: aggregate_debate_panel, dash_odv1_debates, dash_odv1_judges, derive_debate_outcome, judge_seat_parse_history, record_integrity_scan (the plan's six), plus the writers debate_judgments_write_guard, record_debate_judgment, odv1_record_panel_alternates, odv1_record_panel_substitution. The case for a separate table holds.
- odv1_panel_incomplete_judgments and odv1_record_incomplete_panel do not exist yet.
- Live dc258730 order: Write Judgment 1 -> 2 -> 3 -> Write Enforcer Log -> Derive Outcome -> Panel Done; each error output goes to Panel Failure Note.
- NOT CHECKED: the 103 rows in Close Enforcer Record cec_log for 42517 (n8n execution data; C1 measures it).

N1. A failure at Write Judgment 2 or 3 follows a successful Write Judgment 1, so "Write Judgment 1 has run: none" drops judgments 2 and 3, which are not stored. Take each slot whose own Write Judgment k did not succeed.
N2. "Write Enforcer Log has already run" must mean that it succeeded. A failure at Write Enforcer Log itself sends its error to Panel Failure Note, and an errored node can still count as executed. Then the held rows would be skipped and lost. Test for success (an output with no error), and add that case to C2.
N3. The source quote reads "yes #631"; the operator's message reads "#631. yes". Quote it as written. The reserve reply's slot value is not stated in (c); state it.

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
