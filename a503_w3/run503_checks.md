# ASK 503 rerun checks, rev 0 (W3, seat 33, 11-20). DRAFT. For the rerun after the ASK 503 write, on the operator's release. Read-only checks; the run itself is the operator's.

Run: same topic and pairing as 40958: "Did Christ have a biological father?", spark/oracle defending, gemini/plain challenging, launched through dash_launch_odv1.
Expected cost: 1.73 to 4.03 USD (this pairing on flash: 40781, 39266, 38661, 39015). With seat replacements, up to about 4 USD (AAR lesson 10).

Pre-run (W4, before the release card):
P1. Live engine is the ASK 503 fetchback version; Init Seats ENG gemini mc 'gemini'; 'hydrogen' in none of ORDER0, __ALT, Accept Build ORDER.
P2. dash_debaters() row 3: gemini, google/gemini-3.8-flash, active true. gemini_deb inactive.
P3. Nothing else running on the engine; runstart.py GO.

Run checks (W4 posts; W1 and W2 check by their own reads):
R1. Debater on flash: debate_results.challenger_model = google/gemini-3.8-flash; challenger_engine gemini.
R2. Hydrogen not seated: judged_by, panel_expected, panel_substitution and debate_removals name no hydrogen; no enforcer, cure, gate or alternate call went to google/gemini-4-hydrogen (n8n node data or OpenRouter model field in call_costs).
R3. The run finished: n8n execution status success (not crashed), last node Raise If Incomplete with no error; no row in debate_errors for the execution.
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
R7. No out-of-memory crash: covered by R3; also the stored execution size (jsonSizeBytes) and runData size, for ASK 501 (W4's T0 method), so 501 has one measured flash run after 503.
R8. Model failures, if any, reported to the operator first and plainly (ASK 427).
R9. 499 A1 and 500 A1 still hold: ppj_put, ppj_status, ppj_get as service_role with HTTP 200; launch through dash_launch_odv1 HTTP 200.

Done: R1 to R5 PASS, R6 and R7 reported with numbers, by W4 and two graders. Then the engine manual v223 Live and Shown lines are filled (em_pairs_503_v222_draft.json).
