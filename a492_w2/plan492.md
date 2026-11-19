# ASK 492 plan rev 2 (W2, 11-19; replaces rev 1 4972bdbe; rev 2 is headings only, THE ASK FORM op doc §29, per W1 9772): close the public key's direct INSERT on debate_results (advisor P5)

## 1. OBJECTIVE
The public (anon) key can insert any row into debate_results by a direct REST POST. Close that path without breaking any live writer.
Expected effect: a direct anon POST to /rest/v1/debate_results is refused with 42501; every RPC writer and every read is unchanged.

## 2. ROLES
Planner W2. Builder and writer W4, on a card pressed in W4's thread. Graders W1 and W3 (neither is the builder). Readback by two non-writers.

## 3. SCOPE
Scope: the anon INSERT grant and the anon_ins policy on debate_results, nothing else.
SEARCH (every writer of debate_results, read live 11-19 ~11:45 CST):
1. Grants and policies (pg_policy, information_schema.role_table_grants):
   - anon: INSERT and SELECT grants; policy anon_ins FOR INSERT TO anon WITH CHECK (true).
   - anon and authenticated hold no UPDATE or DELETE grant. authenticated holds no INSERT grant.
   - SELECT policies: anon_ro_debate_results, anon_sel, obsidian_ro_select (unchanged by this ASK).
2. Database functions that write the table (prosrc search for INSERT INTO, UPDATE or DELETE FROM debate_results). All are SECURITY DEFINER, owned by postgres, and anon and authenticated hold EXECUTE on each:
   - record_debate_row(jsonb), md5 b6e8e638: the only INSERT.
   - UPDATE only: derive_debate_outcome (7b568ff9), odv1_mark_grading_failed (9d7e7054), odv1_record_panel_alternates (ccaa64d7), odv1_record_panel_substitution (91083e19), record_debate_row_tokens (7fcaf1b3).
   - These run as postgres, so this ASK does not change them.
3. Triggers on the table (unchanged): debate_results_write_guard, debate_results_reject_w2, truth_date_normalize, snapshot_debate_results.
4. n8n: the all-workflow REST scan (git 0aafde28, n8n_rest_targets.json, 14:24Z 11-19) lists 24 workflows with a direct POST to debate_results. Their active flags were re-read now with search_workflows:
   - Active (12): zwfk72lxBBf6ccJa Oracle Hardening Test (Live Ask); 7J1X84r53L9U6gEF Gemini-GW5; DYb3AQcRjbMd8uci GK-W5; L3c1B9CP7Gg5jBiA ChatGPT-W2; RoPZZyTLqRTHgtn3 Gemini-GW4; VQTAWakBWRNhttQ9 GK-W4; XhMAcZ2HpYOeBEku ChatGPT-W5; fYsUpVVChY1PClQi ChatGPT-W4; hOHBx1a3eybQM8BV GK-W2; rvC9iSBgXQ1IRVhc Gemini-GW2; wogSURAMptn8hQOt L2 Adversarial Specialist (Gemini); wp6RHcIda3l30H9R ChatGPT-W3.
   - Inactive (12): 3mV1UBs09SZTfK0u, ALwKqNIw0i0YLcGC, DB7E7eb3i4DPJaHx, L2dnmMe0HPiT9vxb, O4hG1nxEbQiztSMa, OuzlkGSKXryID4Y7, QCMqpp3zxPA9XFe4, Udlm6jD9QwTp6E5x, b17zNbN3hjV7vFBi, cVvQhy2Y1jwfW3TM, f1XislR6JOhQSQyP, rveOzNV4Ir0OzcGI.
   - Their Save nodes carry no n8n credential; the key is in the node headers. NOT TRACED: whether that key is the anon key or the service key. If it is the service key, this ASK does not touch them.
   - The engine (moMxiV4Irg1uRBZN) writes only through rpc/record_debate_row and the UPDATE functions above, so it is not affected.
5. Use in the record: rows with no ODV1 run token, by variant, newest first: oracle_test last 10-27 (Oracle Hardening Test; 13 retained n8n executions, newest 10-27 19:02Z); W1 last 10-02 (W1 workflows saved through record_debate_row); every other direct-POST variant last wrote 07-09 to 07-18. The other 11 active workflows have no retained n8n execution.
6. Dashboard and app: the dashboard page (git a482_w1/base: index.html, patch-base.js, odv1.js) calls only rpc/dash_api, the dr_* and registry RPCs, and the edge function ask. The edge function ask (v71) does not name debate_results. The repo app code outside prototypes does not name it. Other edge functions not read.

Finding that limits the gain:
record_debate_row is a SECURITY DEFINER function that anon can EXECUTE. It inserts any payload columns that exist in the table. So after this ASK the public key can still write a forged row through rpc/record_debate_row. This ASK closes the direct path and the advisor finding; it does NOT end forging. Closing the RPC needs the engine's key to be traced first (its Save to DB uses an n8n header credential), and is a separate ASK.

Key trace (team call, 11:45 CST 11-19): NOT DONE, by decision.
Reading the Save node headers would put the key value, possibly the service key, into a transcript. The team ruled not to read them. Supabase API logs record only the JWT role, but none of the 12 active writers has run inside the log window: the 11 W-series workflows have no retained n8n execution and no row since July, and the Oracle Hardening Test last ran 10-27 19:02Z. So the key each one sends is unknown to W2, and the first save after the step will show it.
W1 9755 C-1 (taken): W1 read the Oracle Hardening Test (zwfk72lxBBf6ccJa) Save to DB and reports the ANON key (JWT role anon). Option A therefore WILL break its save, after its paid calls. The other 11 are treated as anon until traced.
Card requirement (C-1): the card states that A breaks the Oracle Hardening Test's save. With A it offers the operator a choice: (i) repoint that save at rpc/record_debate_row (a separate build), or (ii) unpublish the workflow.

Options:
A. (recommended) DROP POLICY anon_ins ON debate_results; REVOKE INSERT ON debate_results FROM anon.
   - Effect: a direct anon POST is refused with 42501. The engine, every RPC and every service-key writer are unchanged. Reads are unchanged.
   - Risk: any of the 12 active legacy workflows above that sends the anon key fails at its save step, after its model calls have run (paid). None has run since 10-27, and 11 of them have no row since July.
B. NOT part of this ASK. Unpublishing the 12 active legacy direct writers (as ASK 480 did for the DeepSeek W-series) is a separate question for the operator later. Evidence to bring then: none has run inside the log window; 11 have no row since July; the Oracle Hardening Test last wrote 10-27; their key is untraced by team decision.
C. No build. Keep the path open until the record_debate_row ASK, and close both together.

NOT SEARCHED: the Cure Call (c7366RPLb8vdMQg6) and SX4Z cannot be read by n8n MCP; edge functions other than ask were not read.

Not changed: No model, wording or reasoning setting. No engine node. No function.

## 4. CRITERIA and DONE
Before the build: test492_rollback.sql passes in full (C1 allowed; T1 refused 42501; T2 record_debate_row records as anon; T3 anon reads 2 test rows; R1 policy and grant restored).
- C1: anon direct insert before (shows T1 can fail).
- T1: anon direct insert after: refused 42501.
- T2: anon rpc record_debate_row still records a row.
- T3: anon still reads debate_results.
- R1: the revert restores the policy and the grant.
Done: step492.sql's closing checks pass (anon holds no INSERT, keeps SELECT, anon_ins gone, record_debate_row still anon-callable), the audit row is written, and two non-writers read it back.

## 5. WRONG-IF
1. One of these 12 active legacy direct writers sends the anon key and runs after the step. Its save fails with 42501, after its model calls have run:
   zwfk72lxBBf6ccJa Oracle Hardening Test (Live Ask); 7J1X84r53L9U6gEF Gemini-GW5 Blind Analysis; DYb3AQcRjbMd8uci GK-W5 Grok Blind Analysis; L3c1B9CP7Gg5jBiA ChatGPT-W2 Dialog; RoPZZyTLqRTHgtn3 Gemini-GW4 Steel Man; VQTAWakBWRNhttQ9 GK-W4 Grok Steel Man; XhMAcZ2HpYOeBEku ChatGPT-W5 Blind Analysis; fYsUpVVChY1PClQi ChatGPT-W4 Steel Man; hOHBx1a3eybQM8BV GK-W2 Grok Dialog; rvC9iSBgXQ1IRVhc Gemini-GW2 Dialog; wogSURAMptn8hQOt L2 Adversarial Specialist (Gemini); wp6RHcIda3l30H9R ChatGPT-W3 ChatGPT Leads.
   None of them has run inside the log window (evidence above). Check after the write: n8n executions and debate_errors for these 12. The revert restores the path in one statement pair.
2. Some writer not found by this SEARCH (another edge function, an outside client) posts directly with the anon key.

## 6. RUN EVIDENCE
NO PROBE. A debate run does not use the direct POST path (the engine saves through rpc/record_debate_row), so no ASK 417 case fires on it. Evidence instead: the rolled-back test, and edge_logs with no 42501 on rpc/record_debate_row in the next run.

## 7. INPUTS IN GIT
plan492.md, step492.sql 133ad316, revert492.sql 928b6eca and test492_rollback.sql 872417c8, in /mnt/project-files/ask492/. The commit hash is posted on the Wall when the commit is made.

## 8. STEPS
1. Rolled-back test (test492_rollback.sql), run by W2 on the operator's approval prompt. Waits on: the operator's word.
2. Write: step492.sql (option A). Waits on: W4's card, pressed in W4's thread. The card states C-1 (the Oracle Hardening Test save breaks unless ASK 495 has unpublished it first).
3. Readback by two non-writers. Waits on: step 2.
Revert: revert492.sql. Waits on: a W4 card.
