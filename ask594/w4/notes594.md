# ASK 594: THE RESERVE RECORDER ACCEPTS QWEN4MAX. Plan and build rev 0

W4, 2026-11-24 CST. For W1's grade, then the operator's card. LIVE, not trial (ruling 512).

1. OBJECTIVE: a run whose panel or reserve includes qwen4max can use the one judge substitution. Today the recorder refuses qwen4max, so a failed qwen4max seat (or qwen4max as the reserve) stops the run instead of seating the reserve.
2. ROLES: planner and builder W4; grader W1; the write waits on W4's own card.
3. SCOPE: one array literal in the database function odv1_record_panel_substitution. Nothing else.
   SEARCH: every public function whose text names 'sol62' (pg_proc): dash_debaters, dash_odv1_debates, dash_odv1_judges (all already name qwen4max) and odv1_record_panel_substitution (does not). odv1_record_panel_alternates reads model_config, not a list (qwen4max is active, openrouter, engine). Live engine 1afd3099: Init Seats ORDER0 is chatgpt, sol, sol62, gemini, spark, qwen4max, argon, sonnet; the alternate tail __ALT is gemini, spark, qwen4max, argon, sonnet; Resolve Seats JFAM names qwen4max; Panel Check builds the substitution {failed_seat, substitute} from the panel and the reserve. Every other ORDER0 seat is in the recorder's list.
   CASE: run 42071 (Sol 6.2 Oracle against Claude): panel gemini, qwen4max, spark; reserve argon. Had qwen4max failed, the recorder would have raised "failed_seat qwen4max is not a panel seat".
4. CRITERIA AND DONE (test594, read-only, temp copies of the old and new body, a debate id that does not exist so nothing is written):
   - qwen4max as failed seat: old refuses "failed_seat qwen4max is not a panel seat"; new passes the seat check (stops at "no debate_results row"). PASS.
   - qwen4max as substitute: old refuses "substitute qwen4max is not a panel seat"; new passes. PASS.
   - control gemini to argon: both pass the seat check. PASS.
   - control haiku: both still refuse. PASS.
   DONE: live body names qwen4max; grants unchanged (postgres, service_role, lab_seat EXECUTE).
5. WRONG-IF: the panel could never seat qwen4max (then this is dead). Checked: ORDER0 and __ALT seat it whenever an openai-family debater removes chatgpt, sol and sol62, as in run 42071.
6. RUN EVIDENCE: NO PROBE on a normal run (a substitution fires only when a panel seat fails). A dry regrade with test_fail_seat qwen4max would show it; that needs the operator's release.
7. INPUTS IN GIT: ask594/w4/ (write594.sql, revert594.sql, notes594.md) in the project folder; repo commit with the post.
8. STEPS: (a) W1 grade; (b) card to the operator; (c) on the press, run write594.sql in one call (it refuses unless the live body md5 is 58fb41af), read back md5 and grants, audit row, Wall, W1 readback.
NOT AUTHORIZED by this post: any write.
