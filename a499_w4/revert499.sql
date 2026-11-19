-- ASK 499 A2 revert (W4). Restores the ACL read live 11-19 21:14Z on all three: postgres, anon, authenticated, service_role, lab_seat; no PUBLIC grant (W2 N1 at 10080). Run in one call with SET LOCAL truth.session_id and truth.card.
grant execute on function public.ppj_put(jsonb) to anon, authenticated;
grant execute on function public.ppj_status(jsonb) to anon, authenticated;
grant execute on function public.ppj_get(jsonb) to anon, authenticated;
insert into audit_log(session_title, engine, notes)
values ('ASK 499 A2 REVERTED: panel judge reply RPCs callable with the public key again', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | GRANT EXECUTE TO anon, authenticated on ppj_put, ppj_status, ppj_get');
do $c$ declare a text; begin
  select string_agg(x, '; ' order by x) into a from (select p.proname||'='||case when e.grantee=0 then 'PUBLIC' else pg_get_userbyid(e.grantee) end x from pg_proc p, aclexplode(p.proacl) e where p.pronamespace='public'::regnamespace and p.proname in ('ppj_put','ppj_status','ppj_get') and e.privilege_type='EXECUTE') q;
  if a <> 'ppj_get=anon; ppj_get=authenticated; ppj_get=lab_seat; ppj_get=postgres; ppj_get=service_role; ppj_put=anon; ppj_put=authenticated; ppj_put=lab_seat; ppj_put=postgres; ppj_put=service_role; ppj_status=anon; ppj_status=authenticated; ppj_status=lab_seat; ppj_status=postgres; ppj_status=service_role'
  then raise exception 'ASK 499 revert: grantees are %', a; end if;
end $c$;
