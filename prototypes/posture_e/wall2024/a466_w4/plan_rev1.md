# ASK 466 plan rev 1 (W4): close the public-key write path into audit_log
Changes from rev 0: W1 9448 C-1, C-2, nit; W2 9449 C-3, nits.

## 1. Objective
A caller holding only the public (anon) key cannot write an audit_log row whose text it chose, by any path.
Trigger rows that record a real change made by a permitted path stay, and name the true actor role.

## 2. Search
a. audit_log: anon INSERT + policy anon_ins (check true). 54 functions insert into audit_log: 27 definer, 27 invoker (rev 0 said 55/28:
   my loose regex counted annotate_build, which writes build_intent.audit_log_id). anon may execute all 54.
b. Run path: every run RPC is SECURITY DEFINER (18 named in rev 0); their trigger audit inserts run as postgres.
c. C-2, all n8n workflows (195; 69 active; a466_w4/n8n_rest_targets.json):
   - 9 class C names, complete_session_close, complete_security_check: 0 nodes.
   - log_audit_event: 3 active nodes (Daily Drive Sync, Every-3-Day Orphan Tables Snapshot, Every-3-Day SQL Snapshot), anon JWT inline.
   - REST POST/PATCH to audit_log or app_state: 0 (GETs only).
   - Direct table writes with the anon JWT inline, active: debate_results (20 nodes: DS/GK/Gemini/ChatGPT W-series, Independent Synthesis,
     W7, W14, W16, DS Direct Single Call, Group W2 Dialog), audit_results (Berean Audit), challenge_sessions (Challenger),
     session_log PATCH (Session Orchestrator). None ran in the 48 h of logs; they are live paths all the same.
   - The 11 tables of C-3: 0 public-key writers (n8n reads journal_entries, kb_book_chapters, engine_manual, operational_doc by GET only;
     wall_reply is invoker but no REST call in 48 h; seats write through MCP as postgres; dash_api is definer).
d. Free-text definer writers anon can call: log_audit_event, complete_session_close, complete_security_check.

## 3. Changes
STEP 1 (database only, no workflow change):
 1a. REVOKE INSERT ON audit_log FROM anon, authenticated; DROP POLICY anon_ins ON audit_log.
 1b. Class C (9 invoker RPC writers: log_build, log_change, save_session, abandon_fold_session, blackboard_ack, blackboard_close,
     blackboard_archive_any_author, conclusion_flag, init_load_session): REVOKE EXECUTE FROM anon, authenticated, PUBLIC.
 1b2. C-4 (W2 9452): REVOKE EXECUTE on dr_rest and dr_retract (definer; write caller text into day_room, day_room_posts) FROM PUBLIC, anon, authenticated. T2 covers them.
 1c. Class B to SECURITY DEFINER, SET search_path = public, pg_temp (required, not optional: anon still writes debate_results directly):
     debate_results_write_guard, truth_date_normalize, debate_judgments_write_guard, debate_prompts_guard, kb_row_audit,
     log_app_state_build, sight_embedding_fence, log_override_arming.
     log_override_arming (C-1): also its actor text changes from current_user to
       coalesce(nullif(current_setting('request.jwt.claims', true),'')::jsonb->>'role', current_setting('role', true), session_user)
     so the OVERRIDE ARMED row still names anon; its WHEN OTHERS THEN NULL stays (an arming must not be blocked), and is now harmless.
     No change: log_override_arming_p3 (no trigger), pm_ledger_audit and project_plans_guard (anon cannot write those tables).
     Class A (7 event-trigger functions): no change.
 1d. C-3: REVOKE INSERT, UPDATE FROM anon on the_wall, engine_manual, operational_doc, kb_book_chapters, journal_entries, blackboard,
     blackboard_manual, app_source, day_room, day_room_posts, debate_prompts; drop their anon INSERT/UPDATE policies.
     Their definer audit triggers copy caller text (the_wall_audit: engine = NEW.author, notes = subject).
STEP 2 (closes the rest):
 2a. The 3 n8n log_audit_event nodes move to the existing n8n credential "Supabase_Service_Role" (restw.py; card).
 2b. tools/audit_row.py reads SUPABASE_SERVICE_KEY from env; the operator supplies it to W4's container; never in repo or memory.
 2c. REVOKE EXECUTE ON log_audit_event, complete_session_close, complete_security_check FROM anon, authenticated, PUBLIC.
 Out of scope (true records, not chosen audit text): anon direct writes to debate_results, audit_results, challenge_sessions, session_log
 stay allowed; after 1c their audit rows are written by the definer triggers.

## 4. Tests on a Supabase branch (needs the operator's word; branch hours cost)
T1 anon INSERT into audit_log: denied.
T2 anon calls each class C function: denied.
T3 anon calls each run-path RPC with a test row: succeeds; its trigger audit rows appear.
T3b anon INSERT (and UPDATE where granted) on each of the 11 C-3 tables: denied.
T4 anon POST to debate_results (the W-series body shape): succeeds; debate_results_write_guard and truth_date_normalize rows appear.
T4b anon arms an *_override / *_authorized key on app_state: the write succeeds and the OVERRIDE ARMED row is present and names anon.
T5 postgres DDL and DROP on a scratch function: event-trigger rows appear.
T6 step 2: log_audit_event as anon denied, as service_role written; the 3 n8n nodes run once against the branch.
T7 seat paths through MCP (wall_reply, md_notes, engine_manual_apply, operational_doc): unchanged.

## 5. Wrong if
A public-key writer to one of the 11 C-3 tables or a class C function exists outside n8n (an app, a script, an Artifact page).
Mitigation: step 1 keeps a revert script (the inverse GRANTs, CREATE POLICY texts read from pg_policy now, prior function definitions).

## 6. Roles
Planner W4. Graders W1, W2. Cards in W4's thread: step 1 (database), 2a (workflows), 2c (database). Live only on the operator's press.
