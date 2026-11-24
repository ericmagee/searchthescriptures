GRADE: ASK 594 plan and build rev 0 (reserve recorder accepts qwen4max; W4 Wall 11517, commit fe4df734; write594.sql c8b70c45, revert594.sql b2866a3f, notes594.md 2e335824). PASS.
RULES READ: op doc s29 (THE ASK FORM, BEFORE THE BUILD, WRONG-IF), s30 (DENIALS, TIMEOUTS AND WRITES: a write asserts the prior state), s12 not touched; ruling 512 (live, not trial).
OBJECTIVE MET: yes. With the new body a failed qwen4max seat, or qwen4max as the reserve, passes the seat check instead of stopping the run.

ASK FORM: all eight headings present (OBJECTIVE, ROLES, SCOPE with SEARCH and CASE, CRITERIA and DONE, WRONG-IF, RUN EVIDENCE, INPUTS IN GIT, STEPS). PASS.

Own checks (W1, read-only):
1. Live body md5 58fb41afc2a7101b1e424037b73aae67 equals the write's guard; grants {postgres, service_role, lab_seat} EXECUTE. PASS.
2. The anchor `'sonnet','sol62']; --` occurs exactly once in pg_get_functiondef, so replace() changes one place only. PASS.
3. SEARCH re-run: every public function naming 'argon', 'sol62' or 'spark': dash_debaters, dash_odv1_debates, dash_odv1_judges (all name qwen4max) and odv1_record_panel_substitution (does not). Matches W4. PASS.
4. Live engine 1afd3099 (my fetch): Init Seats ORDER0 = chatgpt, sol, sol62, gemini, spark, qwen4max, argon, sonnet; __ALT = gemini, spark, qwen4max, argon, sonnet. qwen4max is the only ORDER0 or __ALT seat missing from the recorder list. PASS.
5. Test on pg_temp copies of the old body and the write's new body (same replace), with a debate id that does not exist:
   - qwen4max failed, argon sub: old "failed_seat qwen4max is not a panel seat"; new "no debate_results row" (passes the seat check).
   - gemini failed, qwen4max sub: old "substitute qwen4max is not a panel seat"; new passes.
   - gemini to argon: both pass. haiku as failed or substitute: both refuse.
   Afterward the live md5 is unchanged and no temp object remains. PASS.
6. WRONG-IF: run 42071 seated qwen4max on the panel (W4's case; memory and Wall 11287 agree). PASS.
7. RUN EVIDENCE: NO PROBE with its reason, and a dry regrade path named for the operator's release. Accepted.
Note (not a finding): the revert does not check the body md5 before replacing; acceptable, since it only undoes this exact text.
STANDARD (ASK 599): one change (rule 10) with a guarded prior state; no dead code; the new literal is named by its comment (rule 4 n/a); refusals raise (rule 7). Met.
