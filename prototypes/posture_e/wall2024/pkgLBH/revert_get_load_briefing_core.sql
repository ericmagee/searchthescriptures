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
  v_bb_open int;
  v_bb_urgent int;
  v_bb_entries jsonb;
  v_bb_ids jsonb;
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

  -- BLACKBOARD SURFACING (2026-07-27, Eric-authorized; filter widened same day, Eric-ruled).
  -- A board nothing reads is the defect journal 707 names. This is the read.
  -- FILTER: non-terminal, i.e. NOT IN ('closed','superseded'). The status CHECK carries five
  -- values and only those two are terminal. 'answered' means someone REPLIED, not that the work
  -- is done — blackboard_close/blackboard_ack are what mean done. Surfacing only open+claimed
  -- hid every entry that had ever received a reply while its work still stood.
  -- Defensive: any failure here degrades to a note and never blocks the load.
  BEGIN
    SELECT COUNT(*) INTO v_bb_open
      FROM blackboard WHERE status NOT IN ('closed','superseded','archived');
    SELECT COUNT(*) INTO v_bb_urgent
      FROM blackboard WHERE status NOT IN ('closed','superseded','archived') AND priority IN ('CRITICAL','HIGH');

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
             'id', b.id, 'ref', b.entry_ref, 'to', b.addressed_to, 'type', b.entry_type,
             'priority', b.priority, 'status', b.status, 'claimed_by', b.claimed_by,
             'subject', b.subject, 'body_chars', length(b.body), 'posted', b.entry_date)
           ORDER BY b.id DESC), '[]'::jsonb)
      INTO v_bb_entries
      FROM (SELECT * FROM blackboard
             WHERE status NOT IN ('closed','superseded','archived')
               AND (addressed_to IN ('next-berean','record')
                    OR addressed_to = public.current_seat_pointer())
             ORDER BY id DESC
             LIMIT 10) b;

    SELECT COALESCE(jsonb_agg(x.id ORDER BY x.id DESC), '[]'::jsonb)
      INTO v_bb_ids
      FROM (SELECT id FROM blackboard
             WHERE status NOT IN ('closed','superseded','archived')
               AND id NOT IN (SELECT (e->>'id')::bigint FROM jsonb_array_elements(v_bb_entries) e)
             ORDER BY id DESC
             LIMIT 200) x;

    v_bb := jsonb_build_object(
      'open_count', v_bb_open,
      'urgent_count', v_bb_urgent,
      'routed_for', COALESCE(public.current_seat_pointer(), 'NOBODY REGISTERED'),
      'entries', v_bb_entries,
      'entries_note', 'The entries array is a ROUTED WINDOW, not the board. It holds the 10 most recent non-terminal entries whose addressed_to is next-berean, record, or the value printed in routed_for above. Ordering is id DESC only, NOT by priority, so a new NORMAL entry addressed to you is never buried under old CRITICAL backlog; priority is printed on each entry and urgent_count covers the whole board. READ routed_for ABOVE BEFORE YOU TRUST THE THIRD BRANCH. It is app_state.active_session_id, a single global, and it names WHOEVER REGISTERED LAST, not necessarily whoever is reading. If it is not your session id, the seat-addressed mail in this window belongs to another hand and yours is not here. Nothing in the load chain calls this briefing at all, so no code guarantees that pointer is yours at the moment you read it. Verified live 2026-08-14, BB-0490.',
      'ids', v_bb_ids,
      'status_note', 'These are the NON-TERMINAL entries. status=answered means a reply exists, NOT that the work is finished; a claimed_by name means a hand took it, and if that hand was a session it may have ended. Neither is proof the entry is handled — open it and see.',
      'ids_note', CASE
                    WHEN jsonb_array_length(v_bb_ids) < (v_bb_open - jsonb_array_length(v_bb_entries)) THEN
                      'ids is TRUNCATED. It lists the ' || jsonb_array_length(v_bb_ids) || ' newest non-terminal entries NOT rendered above; ' || (v_bb_open - jsonb_array_length(v_bb_entries) - jsonb_array_length(v_bb_ids)) || ' older ones are not listed at all. Query blackboard directly for the remainder.'
                    ELSE
                      'ids lists every non-terminal entry NOT rendered above. Nothing on the board is hidden from you.'
                  END,
      'howto', 'Subject lines only. Call these by NAMED arguments, never positionally. SELECT blackboard_read(p_id) to read one in full before acting on it. blackboard_claim(p_id, p_by, p_session) before working it; blackboard_release(p_id, p_by, p_reason, p_session) if you claimed it and cannot finish it; blackboard_answer(p_parent_id, p_subject, p_body, p_by, p_refs, p_session) to reply — status=answered is NOT terminal, the entry stays open; blackboard_close(p_id, p_by, p_status, p_session) when the work is genuinely done; blackboard_ack(p_id, p_by, p_note, p_session) to acknowledge and close. Closure is fenced to the entry author or to Eric: you cannot close an entry authored by another seat, and acking one addressed to a session that has ended does not lift that fence. Pass your own session id as p_session on every write.',
      'note', CASE
                WHEN v_bb_urgent > 0 THEN
                  '** ' || v_bb_urgent || ' unfinished blackboard entry(ies) at CRITICAL/HIGH are waiting on a hand. Read them before choosing your own work. Total unfinished: ' || v_bb_open || '.'
                WHEN v_bb_open > 0 THEN
                  v_bb_open || ' unfinished blackboard entry(ies) waiting. Read them before choosing your own work.'
                ELSE 'Blackboard clear — every entry is closed or superseded.'
              END);
  EXCEPTION WHEN OTHERS THEN
    v_bb := jsonb_build_object('open_count', -1, 'note', 'blackboard unavailable — report this, do not ignore it');
  END;

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
