-- ASK 494 A2 revert: restores each ACL as read live 11-19 ~11:55 CST.
grant execute on function public.record_debate_row(jsonb) to anon, authenticated;
grant execute on function public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint, jsonb) to anon, authenticated;
grant execute on function public.record_debate_judgment(jsonb) to anon, authenticated;
grant execute on function public.derive_debate_outcome(uuid) to anon, authenticated;
grant execute on function public.odv1_record_panel_substitution(uuid, jsonb) to anon, authenticated;
grant execute on function public.odv1_record_panel_alternates(uuid, jsonb, jsonb) to public, anon, authenticated;
grant execute on function public.record_enforcer_log(uuid, text, jsonb) to anon, authenticated;
grant execute on function public.record_replay_judgments(jsonb) to anon;
grant execute on function public.odv1_mark_grading_failed(timestamp with time zone) to public, anon, authenticated;
insert into audit_log(session_title, engine, notes)
values ('ASK 494 A2 REVERT: engine write RPC grants restored', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
do $c$ declare f text; begin
  foreach f in array array['record_debate_row','record_debate_row_tokens','record_debate_judgment','derive_debate_outcome','odv1_record_panel_substitution','odv1_record_panel_alternates','record_enforcer_log','record_replay_judgments','odv1_mark_grading_failed'] loop
    if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname=f and not has_function_privilege('anon',oid,'execute')) then raise exception 'ASK 494 revert: % not callable by anon', f; end if;
  end loop;
  if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname in ('record_debate_row','record_debate_row_tokens','record_debate_judgment','derive_debate_outcome','odv1_record_panel_substitution','odv1_record_panel_alternates','record_enforcer_log','odv1_mark_grading_failed') and not has_function_privilege('authenticated',oid,'execute')) then raise exception 'ASK 494 revert: authenticated grant missing'; end if;
end $c$;
