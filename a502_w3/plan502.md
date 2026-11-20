# ASK 502 plan rev 0 (W3, seat 33, 11-20; THE ASK FORM op doc §29; number assigned by the coordinator, posted at Wall 10178; found by W1 10171 F1, confirmed by W4 10172): the public key can still write early-alternate replies

## 1. OBJECTIVE
rpc/record_early_alternate is SECURITY DEFINER and anyone holding the public (anon) key can call it. It inserts into early_alternate, and the engine reads those rows back (Get Early Alternate, rpc/get_early_alternate, rows for the run_token from the last 6 hours) and uses the stored reply as an alternate judge's reply. The insert keeps the first row per (run_token, seat_for, payload_sha) (ON CONFLICT DO NOTHING), so a row planted first would stand. Move the engine's calls off the public key, prove it with a run, then revoke the public key's EXECUTE.
Expected effect: record_early_alternate (and get_early_alternate, if O1 is chosen) refuse anon and authenticated with 42501; the engine's calls run as service_role and still save and read their rows.

## 2. ROLES
Planner W3. Builder and writer W4, each write on a card pressed in W4's thread. Graders W1 and W2. Readback by two non-writers.

## 3. SCOPE AND EVIDENCE
Scope: the "Record Early Alternate" node in WALL-2024 Early Alternate (SX4ZWtgHNs96uBOo); optionally (O1) the "Get Early Alternate" node in the engine (moMxiV4Irg1uRBZN); EXECUTE grants on the one or two functions. Only the credential and its auth settings change; no URL, body, prompt, model or reasoning setting; no function body.
E1. record_early_alternate(text,text,text,text,text,jsonb,text,integer): SECURITY DEFINER, prosrc md5 16032b5a, 395 chars; returns 0 unless p_run_token starts "ODV1-"; ACL PUBLIC, postgres, anon, authenticated, service_role, lab_seat (W3 read 00:13Z 11-20).
E2. get_early_alternate(text): SECURITY DEFINER, prosrc a76f15b8; returns seat_for, alt_seat, api_model, payload_sha, reply, error and ms for the run_token from the last 6 hours; same ACL.
E3. early_alternate: RLS on, no policies, no table grants to anon or authenticated; reached only through the two functions. 27 rows; the newest is run 40958 (chatgpt, alternate qwen4max, 23:29:52Z 11-19).
E4. Callers, edge logs 00:20Z 11-19 to 00:20Z 11-20: record_early_alternate 1 call (23:29:51Z, anon, HTTP 200, user agent n8n); get_early_alternate 2 calls (19:54:40Z and 23:23:05Z, anon, HTTP 200, n8n). No other caller.
E5. Nodes: "Record Early Alternate" (httpRequest, credential "Supabase Anon Key" uCS43YOAcWVctNfM) in SX4Z, the only caller among the engine, the child, the Cure Call and SX4Z (W4 10172, read through the n8n REST API; the n8n MCP cannot read SX4Z). The engine starts SX4Z with "Early Alternate Start" (executeWorkflow) and reads with "Get Early Alternate" (httpRequest, the same anon credential, rpc/get_early_alternate), from W4's fetchback of engine 01691ed8 (afd83622).
E6. 494 did not cover it: plan494 marked SX4Z NOT SEARCHED (W4 10172).
NOT SEARCHED: how the engine matches payload_sha when it uses a stored reply (decides how hard a planted row is to make stand; it does not change the fix); any caller outside the 24-hour log window.

## 4. OPTIONS
O1 (recommended): A1 moves both nodes, Record Early Alternate in SX4Z and Get Early Alternate in the engine, to the predefined "Supabase account" credential in the form 494 A1 and 499 A1 used; A2 revokes EXECUTE from PUBLIC, anon and authenticated on both functions. This matches 499, which moved the reads (ppj_status, ppj_get) with the write. Get Early Alternate is one of the 42 nodes still on "Supabase Anon Key"; 41 would remain.
O2: the write only, as assigned: A1 moves Record Early Alternate; A2 revokes on record_early_alternate. get_early_alternate stays callable by anon, so anyone with a run_token can read alternate replies for 6 hours.
The choice is a design choice for the team.

## 5. CRITERIA AND DONE
A1 build: W4 makes the targets from fresh live reads (SX4Z through the REST API; the engine through MCP), touched nodes only; W1 and W2 diff live against target (SX4Z: W1 or W2 needs a read path other than the MCP, or relies on W4's fetchback, as for Panel Judge Call in 499).
A1 proof (Q1 to Q3), on the next run in which an early alternate fires (that is not every run; 40781 had none):
Q1. Edge logs show role service_role with HTTP 200 on rpc/record_early_alternate (and rpc/get_early_alternate under O1), and no anon call to them after the write.
Q2. early_alternate has a new row for that run_token.
Q3. The run's alternate reply is used as before (debate_results judged_by or panel_substitution names the alternate).
A2 test (rolled back, like test494_rollback.sql): anon and authenticated get 42501 on the function(s); service_role and lab_seat still insert and read; no anon EXECUTE left; all rolled back.
A2 proof: the next run with an early alternate saves and reads its row with no 42501.
Done: A1 and A2 written on cards, each read back by two non-writers, Q1 to Q3 and the A2 proof pass.
Revert: A1, write back the saved live JSON of SX4Z (and of the engine under O1), on the operator's word. A2, a revert502.sql that restores the grantees as before the step.

## 6. WRONG-IF
1. A caller other than the engine and SX4Z appears in the logs (the dashboard, a lab script): A2 would break it; find it before A2.
2. "Supabase account" does not reach rpc/record_early_alternate as service_role (Q1 shows anon or 401): stop; A1 did not take.
3. The Early Alternate path does not fire in the proof run: A1 is unproven; wait for a run that does, do not write A2.

## 7. STEPS
1. W1, W2 grade this plan; the team picks O1 or O2. 2. W4 builds A1 from fresh live reads; W1, W2 grade. 3. Card in W4's thread; write; readbacks. 4. A run with an early alternate (the operator's release; it can be the ASK 501 proof run). 5. W4 builds A2 (test, step, revert); W1, W2 grade; test on a card, then the step on its own card. 6. Readbacks; A2 proof on the next such run.
