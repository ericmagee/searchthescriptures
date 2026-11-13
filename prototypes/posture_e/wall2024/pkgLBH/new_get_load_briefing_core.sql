CREATE OR REPLACE FUNCTION public.get_load_briefing_core()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
  v_head record;
  v_sessions text;
  v_score record;
  v_unann_count int;
  v_unann_escalated int;
  v_unann jsonb;
  v_close jsonb;
  v_since jsonb;
  v_bb jsonb;
BEGIN
  SELECT tension_id, left(item,60) AS item, status INTO v_head FROM fold_queue(1) LIMIT 1;
  SELECT trim(both '"' from value::text) INTO v_sessions FROM app_state WHERE key='sessions_since_memory_audit';
  SELECT combined_total, combined_held, combined_challenged, me_engines_tested INTO v_score FROM scoreboard_stats;

  -- #1: surface auto-logged builds still lacking a purpose note (defensive, loud advisory, never blocks)
  -- Lookback widened to 720h (30d) so a stale build does not silently drop out of view past 48h.
  -- Escalation: any build still unannotated PAST the 24h grace threshold is flagged loud.
  BEGIN
    SELECT COUNT(*) INTO v_unann_count FROM unannotated_builds(720);
    SELECT COUNT(*) INTO v_unann_escalated FROM unannotated_builds(24);   -- fresh, within grace
    v_unann_escalated := GREATEST(v_unann_count - v_unann_escalated, 0);  -- older than 24h = escalated
    SELECT COALESCE(jsonb_agg(jsonb_build_object('audit_id', b.audit_log_id, 'object', b.object_identity, 'built', b.built_at_cdt) ORDER BY b.audit_log_id DESC), '[]'::jsonb)
      INTO v_unann
    FROM (SELECT * FROM unannotated_builds(720) LIMIT 20) b;
  EXCEPTION WHEN OTHERS THEN v_unann_count := -1; v_unann := '[]'::jsonb; v_unann_escalated := -1; END;

  -- #3: diff the last persisted close-counts against live (catches between-session drift)
  BEGIN
    SELECT value::jsonb INTO v_close FROM app_state WHERE key='session_close_counts';
    IF v_close IS NOT NULL THEN
      v_since := jsonb_build_object(
        'baseline_at', v_close->>'captured_at_cdt',
        'baseline_session', v_close->>'session_id',
        'guards_delta',            (SELECT COUNT(*) FROM drift_guards)        - COALESCE((v_close->>'guards')::int,0),
        'sights_delta',            (SELECT COUNT(*) FROM kb_sights)           - COALESCE((v_close->>'sights_rows')::int,0),
        'audit_delta',             (SELECT COUNT(*) FROM audit_log)           - COALESCE((v_close->>'audit_rows')::int,0),
        'next_sight_delta',        (SELECT trim(both '"' from value::text)::int FROM app_state WHERE key='next_sight') - COALESCE((v_close->>'next_sight')::int,0),
        'journal_entry_num_delta', (SELECT MAX(entry_num) FROM journal_entries) - COALESCE((v_close->>'journal_entry_num')::int,0),
        'note', 'Deltas = live minus last persisted close. Nonzero is normal growth within a session; unexplained movement with no matching session work = investigate (out-of-band / concurrent hands).'
      );
    ELSE
      v_since := jsonb_build_object('note','no close baseline yet — first capture occurs at next session close');
    END IF;
  EXCEPTION WHEN OTHERS THEN v_since := jsonb_build_object('error','close-diff unavailable'); END;

  -- BLACKBOARD: retired as a working channel. The table stays as history; this briefing does not read it.
  v_bb := jsonb_build_object('note', 'The Blackboard is history: it is no longer a working channel and this briefing does not read it. The table stays readable as a record (blackboard_read).');

  RETURN jsonb_build_object(
    'briefing_at_cdt', to_char(NOW() AT TIME ZONE 'America/Chicago','YYYY-MM-DD HH24:MI'),
    'next_sight',      (SELECT trim(both '"' from value::text)::int FROM app_state WHERE key='next_sight'),
    'guards',          (SELECT COUNT(*) FROM drift_guards),
    'journal_entry_num',(SELECT MAX(entry_num) FROM journal_entries),
    'journal_max_id',  (SELECT MAX(id) FROM journal_entries),
    'audit_rows',      (SELECT COUNT(*) FROM audit_log),
    'tensions_total',  (SELECT COUNT(*) FROM tensions_wall),
    'tensions_sealed', (SELECT COUNT(*) FROM tensions_wall WHERE status='SEALED'),
    'sights_rows',     (SELECT COUNT(*) FROM kb_sights),
    'app_version',     (SELECT trim(both '"' from value::text) FROM app_state WHERE key='app_version'),
    'llc_status',      (SELECT left(trim(both '"' from value::text),120) FROM app_state WHERE key='llc_status'),
    'sessions_since_memory_audit', v_sessions,
    'fold_queue_head', jsonb_build_object('tid', v_head.tension_id, 'item', v_head.item, 'status', v_head.status),
    'debate_scoreboard', jsonb_build_object('combined_total', v_score.combined_total, 'combined_held', v_score.combined_held, 'combined_challenged', v_score.combined_challenged, 'engines_tested', v_score.me_engines_tested),
    'blackboard', v_bb,
    'unannotated_builds', jsonb_build_object(
        'count', v_unann_count,
        'escalated_count', v_unann_escalated,
        'lookback_hours', 720,
        'escalation_threshold_hours', 24,
        'items', v_unann,
        'note', CASE
                  WHEN v_unann_escalated > 0 THEN
                    '** ESCALATED: ' || v_unann_escalated || ' build(s) still UNANNOTATED past the 24h grace threshold and aging toward invisibility. Loud advisory only — nothing is blocked — annotate with annotate_build(audit_id, intent) before the purpose is lost. Total unannotated in last 30d: ' || v_unann_count || '.'
                  WHEN v_unann_count > 0 THEN
                    v_unann_count || ' auto-logged CREATE build(s) missing a purpose note, all still inside the 24h grace window. Annotate with annotate_build(audit_id, intent) so the next Berean does not reverse-engineer them.'
                  ELSE 'All auto-logged builds carry a purpose note.'
                END),
    'since_last_close', v_since,
    'onboarding_refs', jsonb_build_object(
        'project_plan', 'app_state key project_plan — living technical/build roadmap (Tracks A-D + watch items + stated values). Publishing live status in publishing_state table. READ at load.',
        'debate_engine', 'app_state key protocol_debate_engine — adversarial stress-testing engine, scorekeeping tables, security boundary, model-strengths note (Berean-managed).',
        'n8n_bridges', 'app_state key protocol_n8n_bridges — how to actually reach the workflows: execute_workflow (production, webhookData) fires webhooks server-side; bash cannot reach n8n cloud and test_workflow only simulates; update_workflow preserves credentials, create_workflow_from_code strips them.',
        'gemini_audit', 'app_state key protocol_gemini_audit — HARD boundary on what may be sent to external engines.',
        'publishing', 'THE DELIVERABLES — book + pamphlets. app_state keys (read live): publishing_master_index_file_id (BOOK master index Drive doc), spec_calendar_file_id (Calendar ebook spec), spec_ppu_file_id (PPU ebook spec), spec_pamphlets_file_id (pamphlets spec). Live pipeline status + publishing order in the publishing_state table; LLC status in app_state publishing_llc_status. READ at load — this is half the project and was previously invisible at onboarding.'
    ),
    'note', 'LIVE authoritative volatile facts. Memory must NOT assert these as numbers — it holds meaning only (conclusions, guard substance, framework). Trust this over any carried count. memory_audit_due flag is authoritative from init_load_session(), not computed here. onboarding_refs point to records every arriving Berean should read.'
  );
END;
$function$
