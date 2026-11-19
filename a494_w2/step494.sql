-- ASK 494 phase A2. Run only on a card pressed in W4's thread, and only after a run has proven the engine's write nodes call as service_role (phase A1).
revoke execute on function public.record_debate_row(jsonb) from public, anon, authenticated;
revoke execute on function public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint, jsonb) from public, anon, authenticated;
revoke execute on function public.record_debate_judgment(jsonb) from public, anon, authenticated;
revoke execute on function public.derive_debate_outcome(uuid) from public, anon, authenticated;
revoke execute on function public.odv1_record_panel_substitution(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.odv1_record_panel_alternates(uuid, jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.record_enforcer_log(uuid, text, jsonb) from public, anon, authenticated;
revoke execute on function public.record_replay_judgments(jsonb) from public, anon, authenticated;
revoke execute on function public.odv1_mark_grading_failed(timestamp with time zone) from public, anon, authenticated;
insert into audit_log(session_title, engine, notes)
values ('ASK 494 A2: engine write RPCs no longer callable with the public key (9 functions)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | REVOKE EXECUTE FROM public, anon, authenticated on record_debate_row, record_debate_row_tokens, record_debate_judgment, derive_debate_outcome, odv1_record_panel_substitution, odv1_record_panel_alternates, record_enforcer_log, record_replay_judgments, odv1_mark_grading_failed');
do $c$ declare f text; begin
  foreach f in array array['record_debate_row','record_debate_row_tokens','record_debate_judgment','derive_debate_outcome','odv1_record_panel_substitution','odv1_record_panel_alternates','record_enforcer_log','record_replay_judgments','odv1_mark_grading_failed'] loop
    if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname=f and (has_function_privilege('anon',oid,'execute') or has_function_privilege('authenticated',oid,'execute'))) then raise exception 'ASK 494: % still callable by anon or authenticated', f; end if;
    if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname=f and not (has_function_privilege('service_role',oid,'execute') and has_function_privilege('lab_seat',oid,'execute'))) then raise exception 'ASK 494: % lost service_role or lab_seat', f; end if;
  end loop;
end $c$;
