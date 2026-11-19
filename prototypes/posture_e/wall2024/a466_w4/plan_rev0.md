# ASK 466 plan rev 0 (W4): close the public-key write path into audit_log

## 1. Objective
A caller holding only the public (publishable/anon) key cannot write an audit_log row whose text it chose.
Rows written as the true record of a real change (trigger rows) stay.

## 2. Search (measured 11-19 ~14:20Z)
a. audit_log grants: anon INSERT, SELECT; policy anon_ins (INSERT, WITH CHECK true). lab_seat INSERT/UPDATE (bypassrls). service_role, postgres all.
b. 55 functions in public insert into audit_log: 28 SECURITY DEFINER, 27 SECURITY INVOKER; anon may EXECUTE all 55.
c. REST write traffic, 48 h (11-17 14:00Z to 11-19 14:00Z, edge logs): every write is an RPC. No direct POST/PATCH/DELETE to any table.
   Every run-path RPC is SECURITY DEFINER (record_debate_judgment, record_debate_row, record_debate_row_tokens, record_enforcer_log,
   record_early_alternate, get_early_alternate, odv1_record_panel_alternates, odv1_record_panel_substitution, ppj_put, ppj_get, ppj_status,
   derive_debate_outcome, debate_topic_gate, debate_arsenal_guarded, snapshot_live_counts, tier3_queue_resolved, mark_sql_backup, dash_api).
   Inside a definer function the trigger functions run as postgres, so their audit inserts do not need anon's INSERT.
   This corrects W1 9376 3c: a REVOKE of anon INSERT does not break the run's saves.
d. Free-text writers anon can call today: log_audit_event (definer; callers: n8n x3/day, tools/audit_row.py), complete_session_close,
   complete_security_check (definer); log_build, log_change, save_session, abandon_fold_session, blackboard_ack, blackboard_close,
   blackboard_archive_any_author, conclusion_flag, init_load_session (invoker; none called over REST in 48 h; seats call through MCP as postgres).
e. n8n callers of log_audit_event, all with the public key in the node: TRUTH Daily Drive Sync (ABtaFpBlEuCc0ZFl, node Log Sync),
   Every-3-Day Orphan Tables Snapshot (ROh4Px5Eap2tGKIc), Every-3-Day SQL Snapshot (YWk9m3grughoRpWi). An n8n credential
   "Supabase_Service_Role" (httpHeaderAuth) exists. Engine, child and the 3 reached sub-workflows: 0 hits.

## 3. The 27 invoker functions, by class, and the change each needs
A. Event-trigger functions (fire only on DDL; anon cannot run DDL; the DDL roles keep INSERT): NO CHANGE.
   ddl_audit_logger, ddl_audit_logger_p3, drop_audit_logger, drop_audit_logger_p3, guard_gate_functions, guard_gate_functions_drop, priv_change_audit.
B. Row-trigger functions (fire on table writes; today every anon table write goes through a definer RPC, so they run as postgres):
   debate_judgments_write_guard, debate_prompts_guard, debate_results_write_guard, kb_row_audit, log_app_state_build, log_override_arming,
   log_override_arming_p3 (not attached), pm_ledger_audit, project_plans_guard, sight_embedding_fence, truth_date_normalize.
   Change: none needed for the run. Safety option (B2): ALTER FUNCTION ... SECURITY DEFINER SET search_path=public,pg_temp, so an
   anon direct write to those tables still gets its audit row. Caveat: log_override_arming writes current_user into its note; under definer it
   would read "postgres". Recommend B2 for 9 of them and leave log_override_arming(_p3) invoker (app_state is written only through definer RPCs).
C. RPC writers with caller text (invoker): log_build, log_change, save_session, abandon_fold_session, blackboard_ack, blackboard_close,
   blackboard_archive_any_author, conclusion_flag, init_load_session.
   Change: REVOKE EXECUTE FROM anon, authenticated, PUBLIC (seats keep them through MCP as postgres). Not made definer.

## 4. Change, in two steps
STEP 1 (database only; no workflow change):
  REVOKE INSERT ON public.audit_log FROM anon, authenticated; DROP POLICY anon_ins ON public.audit_log;
  REVOKE EXECUTE on the 9 class C functions FROM anon, authenticated, PUBLIC;
  B2 on 9 class B functions (optional, recommended).
  After step 1, the only public-key path left is log_audit_event, complete_session_close and complete_security_check.
STEP 2 (closes the rest; touches 3 non-engine workflows and one tool):
  a. The 3 n8n nodes switch from the inline public key to the "Supabase_Service_Role" credential (restw.py, one card each or one card for all three).
  b. tools/audit_row.py reads the service key from env SUPABASE_SERVICE_KEY (never written to the repo or memory); W4's container gets it from the operator.
  c. REVOKE EXECUTE ON log_audit_event, complete_session_close, complete_security_check FROM anon, authenticated, PUBLIC; GRANT to service_role.
  Until 2a and 2b are live, 2c would stop those audit rows (the Drive Sync and snapshot logs, and the write-tool rows).

## 5. Test on a Supabase branch (create_branch; costs branch hours; needs the operator's word)
T1 as anon (SET ROLE anon; request.jwt claims for anon): INSERT INTO audit_log ... -> permission denied.
T2 as anon: select log_build('x','x','x') and each class C function -> permission denied.
T3 as anon: each run-path RPC from the 48 h list with a test row (record_debate_judgment, record_debate_row, record_enforcer_log,
   odv1_record_panel_*, ppj_put, record_early_alternate) -> succeeds, and its trigger audit rows appear (count before/after).
T4 as anon: insert one row into each class B table directly (if anon has the table grant) -> with B2 the audit row appears; without B2 the
   write fails; record which.
T5 as postgres: run one DDL and one DROP on a scratch function -> event-trigger rows appear.
T6 step 2: log_audit_event as anon -> denied; as service_role -> row written; the 3 workflows' nodes run once against the branch URL.
T7 wall_reply, md_notes writes, engine_manual_apply through MCP (postgres) -> unchanged.
Without a branch: the same T1-T5 inside BEGIN ... ROLLBACK on live is possible but is a live-database action; not proposed.

## 6. Wrong if
A run-path RPC is invoker or a workflow writes a table directly with the public key (none in 48 h; a longer window may show one: the
next run is the proof). A seat path uses the anon key for a class C function (none in 48 h).

## 7. Roles
Planner W4. Graders W1, W2. Card: W4 thread (database step 1; workflows and step 2c). Live only on the operator's press.
