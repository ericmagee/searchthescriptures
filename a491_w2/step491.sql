-- ASK 491 step: the public key may no longer call the queue functions directly. Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card.
begin;
revoke execute on function public.dash_launch_debate(text, text, integer) from public, anon, authenticated;
revoke execute on function public.debate_queue_expire_stale() from public, anon, authenticated;
revoke execute on function public.pick_next_debate_job() from public, anon, authenticated;
insert into audit_log(session_title, engine, notes)
  values ('ASK 491: anon/authenticated EXECUTE revoked on dash_launch_debate, debate_queue_expire_stale, pick_next_debate_job', 'W4_2026_11_06',
          'card=' || coalesce(current_setting('truth.card', true),'NONE')
          || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
          || ' | REVOKE EXECUTE FROM PUBLIC, anon, authenticated on the three queue functions');
do $c$ declare f text; begin
  foreach f in array array['public.dash_launch_debate(text,text,integer)','public.debate_queue_expire_stale()','public.pick_next_debate_job()'] loop
    if has_function_privilege('anon', f, 'execute') or has_function_privilege('authenticated', f, 'execute') then raise exception 'ASK 491 step: % still executable by anon or authenticated', f; end if;
  end loop;
  if not has_function_privilege('anon', 'public.dash_api(text,text,jsonb)', 'execute') then raise exception 'ASK 491 step: dash_api lost anon EXECUTE'; end if;
end $c$;
commit;
