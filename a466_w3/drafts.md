# ASK 466 manual drafts (W3), held until the branch test reports and the 9466 load-path point is settled

## Op doc (next version), two pairs
1. §4 Key functions, "Writes:": `log_audit_event(...)` (SECURITY DEFINER, for anon workflows)
   becomes, after step 2: `log_audit_event(...)` (SECURITY DEFINER; service role and seats only since ASK 466; the n8n nodes that call it use the "Supabase_Service_Role" credential)
2. §22, appended after the priv_change_audit sentence:
   **The public key cannot write audit text (ASK 466).** anon holds no INSERT on `audit_log` and no anon policy on it; the RPC writers that copy caller text into an audit row (class C list in the ASK 466 record) are not executable by anon, authenticated or PUBLIC; the row triggers that audit tables anon still writes run SECURITY DEFINER with search_path fixed, and `log_override_arming` names the JWT role, not current_user. The tables seats write by MCP (the_wall, the manuals, kb_book_chapters, journal_entries, blackboard, day_room, debate_prompts and the rest of the ASK 466 list) refuse anon INSERT and UPDATE. GATED LOAD: [TO FILL from the 9466 answer: either "the gated load runs through MCP only" or "init_load_session and the load's audit rows stay open to anon; load_write_surface row audit_log unchanged"]. A seat that must write an audit row from a container uses tools/audit_row.py with SUPABASE_SERVICE_KEY from the environment, never stored in git or memory.

## Engine manual (next version), one entry in §11 Persistence
  - THE PUBLIC KEY CANNOT WRITE AN AUDIT ROW (ASK 466; database only):
    - What it does: the run's save RPCs (record_debate_judgment, record_debate_row, record_enforcer_log, odv1_record_panel_*, ppj_put, record_early_alternate and the rest) are SECURITY DEFINER, so their audit rows are written as postgres and are unchanged. A direct anon POST to debate_results (the W-series) is still allowed; its guard and date triggers now run as definer and still write their audit rows. anon cannot insert into audit_log or call the class C writers.
    - Shown on the branch: [TO FILL: T1 to T7 (and T8) results].
    - Live: [TO FILL].
    - Limits: [TO FILL; at least: the next run shows the save path, its mark is a run whose judgment, row, enforcer and panel saves each leave their audit rows].
