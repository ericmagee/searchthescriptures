# ASK 503 rerun checks, rev 0 (W3, seat 33, 11-20). DRAFT. For the rerun after the ASK 503 write, on the operator's release. Read-only checks; the run itself is the operator's.

Run: same topic and pairing as 40958: "Did Christ have a biological father?", spark/oracle defending, gemini/plain challenging, launched through dash_launch_odv1.
Expected cost: 1.73 to 4.03 USD (this pairing on flash: 40781, 39266, 38661, 39015). With seat replacements, up to about 4 USD (AAR lesson 10).

Pre-run (W4, before the release card):
P1. Live engine is the ASK 503 fetchback version; Init Seats ENG gemini mc 'gemini'; 'hydrogen' in none of ORDER0, __ALT, Accept Build ORDER.
P2. dash_debaters() row 3: gemini, google/gemini-3.8-flash, active true. gemini_deb inactive.
P3. Nothing else running on the engine; runstart.py GO.

Run checks (W4 posts; W1 and W2 check by their own reads):
R1. Debater on flash: debate_results.challenger_model = google/gemini-3.8-flash; challenger_engine gemini.
R2. Hydrogen not seated: judged_by, panel_expected, panel_substitution, debate_removals (api_model, replaced_by_model) and early_alternate (alt_seat, api_model) name no hydrogen; and no entry of debate_results.call_costs has "m" = google/gemini-4-hydrogen. call_costs is a jsonb array column on debate_results, one entry per model call, "m" is the model; it is written by Write Tokens, so it exists only if the run reached Write Tokens (run 40891: 74 entries, 6 hydrogen).
R3. The run finished: from the DB, run_cost_usd and call_costs are written (Write Tokens ran) and debate_errors has no row for the execution. The n8n execution status (success, last node Raise If Incomplete) is an n8n read by W4 only (see N8N below).
R4. Tokens and cost saved: run_cost_usd not null; Write Tokens called rpc/record_debate_row_tokens as service_role with HTTP 200 and no 42501 (this also proves 494 A2's last function).
R5. Drive transcript saved (Save to Drive ran; file found by run token).
R6. Length and size against the pre-487 flash runs, reported as numbers, not judged alone:
    | measure | flash runs (40781, 39266, 38661, 39015) | hydrogen (40891, 40958) | rerun |
    | minutes | 22.4 to 57.2 | 60.9, 66.1 | |
    | enforcer rows | 215 to 347 | 496, 658 | |
    | challenger r3 chars | 12,581 to 19,551 | 37,564, 33,844 | |
    | engine_r2 chars | 9,000 to 12,027 | 27,945, 34,802 | |
    | stored execution MB | 16.9 to 22.7 | 26.9, not stored | |
    | cost USD | 1.73 to 4.03 | 5.15, not written | |
    Expected: inside or near the flash range. Outside it on the high side: report, and look at seat replacements first (W4's alternate and retry minutes).
R7. No out-of-memory crash: covered by R3 (DB part). The stored execution size (jsonSizeBytes) and runData size for ASK 501 (W4's T0 method) are n8n reads by W4 only, and so is duration (debate_results has only created_at); see N8N below.
R8. Model failures, if any, reported to the operator first and plainly (ASK 427).
R9. 499 A1 and 500 A1 still hold: ppj_put, ppj_status, ppj_get as service_role with HTTP 200; launch through dash_launch_odv1 HTTP 200.

N8N (coordinator, 00:34Z 11-20): n8n execution reads are approved for W4 only. W4 makes as few calls as possible, in one batch right after the rerun ends, covering R3 status, R7 size and duration, and the ASK 501 M1 numbers. Graders do not make their own n8n reads. They check W4's numbers against the database figures (R2 call_costs, run_cost_usd, debate_errors, enforcer row count).
Done: R1 to R5 PASS, R6 and R7 reported with numbers, by W4 and two graders. Then the engine manual v223 Live and Shown lines are filled (em_pairs_503_v222_draft.json).
