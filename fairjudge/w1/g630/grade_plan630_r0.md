# W1 GRADE: ASK 630 plan rev 0 (ask630/w4/plan630.md md5 b79313c4, commit 5fd00b90)

GRADE: PASS WITH N1
RULES READ: build rule (touched items only), op doc s29 (W4 writes), live-not-trial, two-live-runs, card rule (DB function and engine node are infrastructure).
OBJECTIVE MET: yes. A failed panel on a live, non-regrade run marks its row in the same execution with the cause; the watchdog then skips it.
STANDARD (ASK 599): the function and the node expressions are new code; graded against the 10 rules at build.

Checked this turn:
- Operator source: message cmsg_...xVXBq at 10:41:19Z (04:41 CST) reads "#630. yes". Matches.
- Watchdog: cron odv1_grading_failed_watchdog */30; odv1_mark_grading_failed SECURITY DEFINER, anon false, authenticated false, service_role true (same as record_debate_row). Row created 04:11:40Z (22:11:40 CST) holds "GRADING FAILED ... (watchdog pkgGFM, 2026-11-25 01:30 CST)", outcome null, data_class contested. Matches the correction to Wall 11932.
- Live dc258730: Panel Failure Note has 13 inputs (Panel Payloads ... Write Enforcer Log) and goes to Dry Failed?; Dry Failed? true = Dry Failure Stop, false = Panel Tokens; Panel Tokens also fed by Panel Done; Panel Tokens code has no $input, $json or $prevNode. Matches.
- Panel Failure Note is a code node that reads the error item and sets customData panel_failed; it fires only on an error path, so the new node does not run on a passing panel.

N1. Panel Failure Note is also fed by Write Judgment 1 to 3, Derive Outcome and later nodes. If a failure comes after the outcome is stored, the UPDATE matches no row (outcome IS NOT NULL) and returns 0, so that failure leaves no mark on the row. This may be right, since a verdict stands, but name it in section 5 beside the regrade case, and have C2 cover it (it does for "outcome set"; say which nodes it stands for).

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
