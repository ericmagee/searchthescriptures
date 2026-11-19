-- ASK 499 phase A2 (W4, build of plan499.md rev 0 20b80b63; W2 10080, W1 10081). Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card, and only after a run has proven A1 (role service_role on rpc/ppj_put, ppj_status and ppj_get, all 3 panel replies collected).
revoke execute on function public.ppj_put(jsonb) from public, anon, authenticated;
revoke execute on function public.ppj_status(jsonb) from public, anon, authenticated;
revoke execute on function public.ppj_get(jsonb) from public, anon, authenticated;
insert into audit_log(session_title, engine, notes)
values ('ASK 499 A2: panel judge reply RPCs no longer callable with the public key (3 functions)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | REVOKE EXECUTE FROM public, anon, authenticated on ppj_put, ppj_status, ppj_get');
do $c$ declare f text; begin
  foreach f in array array['ppj_put','ppj_status','ppj_get'] loop
    if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname=f and (has_function_privilege('anon',oid,'execute') or has_function_privilege('authenticated',oid,'execute'))) then raise exception 'ASK 499: % still callable by anon or authenticated', f; end if;
    if exists (select 1 from pg_proc where pronamespace='public'::regnamespace and proname=f and not (has_function_privilege('service_role',oid,'execute') and has_function_privilege('lab_seat',oid,'execute'))) then raise exception 'ASK 499: % lost service_role or lab_seat', f; end if;
  end loop;
end $c$;
