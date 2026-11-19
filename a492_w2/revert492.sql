-- ASK 492 revert: restores the direct anon INSERT path exactly as before.
create policy anon_ins on public.debate_results as permissive for insert to anon with check (true);
grant insert on public.debate_results to anon;
insert into audit_log(session_title, engine, notes)
values ('ASK 492 REVERT: debate_results anon_ins policy and anon INSERT restored', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
do $c$ begin
  if not has_table_privilege('anon','public.debate_results','insert') then raise exception 'ASK 492 revert: anon INSERT missing'; end if;
  if not exists (select 1 from pg_policy where polrelid='public.debate_results'::regclass and polname='anon_ins') then raise exception 'ASK 492 revert: anon_ins missing'; end if;
end $c$;
