-- ASK 492 step (option A). Run only on a card pressed in W4's thread, with SET LOCAL truth.session_id and truth.card.
drop policy anon_ins on public.debate_results;
revoke insert on public.debate_results from anon;
insert into audit_log(session_title, engine, notes)
values ('ASK 492: debate_results direct anon INSERT closed (policy anon_ins dropped, INSERT revoked from anon)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | DROP POLICY anon_ins; REVOKE INSERT FROM anon. record_debate_row (definer) unchanged.');
do $c$ begin
  if has_table_privilege('anon','public.debate_results','insert') then raise exception 'ASK 492: anon still holds INSERT'; end if;
  if not has_table_privilege('anon','public.debate_results','select') then raise exception 'ASK 492: anon lost SELECT'; end if;
  if exists (select 1 from pg_policy where polrelid='public.debate_results'::regclass and polname='anon_ins') then raise exception 'ASK 492: anon_ins still present'; end if;
  if not has_function_privilege('anon','public.record_debate_row(jsonb)','execute') then raise exception 'ASK 492: record_debate_row path changed'; end if;
end $c$;
