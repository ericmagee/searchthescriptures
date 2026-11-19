-- ASK 491 revert: restore EXECUTE as it was (proacl read 17:21Z 11-19: no PUBLIC grant on any of the three; lab_seat and service_role keep theirs throughout). Run on a card in W4's thread with SET LOCAL truth.session_id and truth.card.
begin;
grant execute on function public.dash_launch_debate(text, text, integer) to anon;
grant execute on function public.debate_queue_expire_stale() to anon, authenticated;
grant execute on function public.pick_next_debate_job() to anon;
insert into audit_log(session_title, engine, notes)
  values ('ASK 491 REVERT: EXECUTE restored on the three queue functions', 'W4_2026_11_06',
          'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
do $c$ begin
  if not has_function_privilege('anon','public.dash_launch_debate(text,text,integer)','execute')
     or not has_function_privilege('anon','public.debate_queue_expire_stale()','execute')
     or not has_function_privilege('anon','public.pick_next_debate_job()','execute') then raise exception 'ASK 491 revert: anon EXECUTE not restored'; end if;
end $c$;
commit;
