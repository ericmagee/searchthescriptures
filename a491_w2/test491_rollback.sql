-- ASK 491 test rev 1 (adds C3, W3 9737 N1). Everything rolls back (final RAISE). The auto-fire trigger is disabled inside the transaction, so no webhook is queued.
-- Do not run while a debate is running (the trigger disable locks debate_queue). The dashboard passphrase is not read or used.
do $t$
declare r text := ''; v jsonb; n int;
begin
  perform set_config('truth.session_id', 'session_01H1X3AMSmHoLYeowLik4uwT', true);
  alter table public.debate_queue disable trigger debate_queue_auto_fire;
  set local role anon;
  begin v := to_jsonb(public.dash_launch_debate('ask491 test control', 'grok', 1)); r := r || 'C1 anon direct dash_launch_debate before: ' || coalesce(v->>'status','?') || E'\n';
  exception when others then r := r || 'C1 anon direct dash_launch_debate before: ERROR ' || sqlstate || E'\n'; end;
  begin n := public.debate_queue_expire_stale(); r := r || 'C2 anon expire_stale before: allowed' || E'\n';
  exception when others then r := r || 'C2 anon expire_stale before: ERROR ' || sqlstate || E'\n'; end;
  begin perform public.pick_next_debate_job(); r := r || 'C3 anon pick_next_debate_job before: allowed' || E'\n';
  exception when others then r := r || 'C3 anon pick_next_debate_job before: ERROR ' || sqlstate || E'\n'; end;
  reset role;
  revoke execute on function public.dash_launch_debate(text, text, integer) from public, anon, authenticated;
  revoke execute on function public.debate_queue_expire_stale() from public, anon, authenticated;
  revoke execute on function public.pick_next_debate_job() from public, anon, authenticated;
  set local role anon;
  begin v := to_jsonb(public.dash_launch_debate('ask491 test direct', 'grok', 1)); r := r || 'T1 anon direct dash_launch_debate after: ALLOWED (FAIL)' || E'\n';
  exception when insufficient_privilege then r := r || 'T1 anon direct dash_launch_debate after: refused 42501 (PASS)' || E'\n'; end;
  begin n := public.debate_queue_expire_stale(); r := r || 'T2 anon expire_stale after: ALLOWED (FAIL)' || E'\n';
  exception when insufficient_privilege then r := r || 'T2 anon expire_stale after: refused 42501 (PASS)' || E'\n'; end;
  begin perform public.pick_next_debate_job(); r := r || 'T3 anon pick_next_debate_job after: ALLOWED (FAIL)' || E'\n';
  exception when insufficient_privilege then r := r || 'T3 anon pick_next_debate_job after: refused 42501 (PASS)' || E'\n'; end;
  begin v := public.dash_api('wrong-pass-ask491', 'launch_debate', jsonb_build_object('p_topic','ask491 test wrongpass','p_engine','grok','p_rounds',1)); r := r || 'T4 anon dash_api wrong pass: ' || left(v::text,80) || E'\n';
  exception when others then r := r || 'T4 anon dash_api wrong pass: ERROR ' || sqlstate || E'\n'; end;
  reset role;
  r := r || 'T5 postgres expire_stale after: ' || public.debate_queue_expire_stale() || ' rows (PASS if no error)' || E'\n';
  r := r || 'T6 anon EXECUTE dash_api: ' || has_function_privilege('anon','public.dash_api(text,text,jsonb)','execute') || ' (PASS if true)' || E'\n';
  grant execute on function public.dash_launch_debate(text, text, integer) to anon;
  grant execute on function public.debate_queue_expire_stale() to anon, authenticated;
  grant execute on function public.pick_next_debate_job() to anon;
  r := r || 'R1 acl after revert: ' || (select string_agg(proname||'='||proacl::text, '; ' order by proname) from pg_proc where pronamespace='public'::regnamespace and proname in ('dash_launch_debate','debate_queue_expire_stale','pick_next_debate_job')) || E'\n';
  raise exception 'ASK491 TEST ROLLBACK%', E'\n' || r;
end $t$;
