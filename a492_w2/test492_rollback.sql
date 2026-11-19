-- ASK 492 test. Everything rolls back (final RAISE). Topics are test-shaped (SELFTEST), so the write guard marks them data_class test.
do $t$
declare r text := ''; v jsonb; n int;
begin
  perform set_config('truth.session_id', 'session_01H1X3AMSmHoLYeowLik4uwT', true);
  set local role anon;
  begin insert into public.debate_results(engine, topic, variant) values ('ask492', 'SELFTEST ask492 C1', 'ask492_test'); r := r || 'C1 anon direct insert before: allowed' || E'\n';
  exception when others then r := r || 'C1 anon direct insert before: ERROR ' || sqlstate || E'\n'; end;
  reset role;
  drop policy anon_ins on public.debate_results;
  revoke insert on public.debate_results from anon;
  set local role anon;
  begin insert into public.debate_results(engine, topic, variant) values ('ask492', 'SELFTEST ask492 T1', 'ask492_test'); r := r || 'T1 anon direct insert after: ALLOWED (FAIL)' || E'\n';
  exception when insufficient_privilege then r := r || 'T1 anon direct insert after: refused 42501 (PASS)' || E'\n'; end;
  begin v := public.record_debate_row(jsonb_build_object('engine','ask492','topic','SELFTEST ask492 T2','variant','ask492_test')); r := r || 'T2 anon rpc record_debate_row after: recorded ' || coalesce(v->>'recorded','?') || ' (PASS if true)' || E'\n';
  exception when others then r := r || 'T2 anon rpc record_debate_row after: ERROR ' || sqlstate || ' (FAIL)' || E'\n'; end;
  begin select count(*) into n from public.debate_results where variant = 'ask492_test'; r := r || 'T3 anon select after: ' || n || ' test rows seen (PASS if 2)' || E'\n';
  exception when others then r := r || 'T3 anon select after: ERROR ' || sqlstate || ' (FAIL)' || E'\n'; end;
  reset role;
  create policy anon_ins on public.debate_results as permissive for insert to anon with check (true);
  grant insert on public.debate_results to anon;
  r := r || 'R1 after revert: anon INSERT ' || has_table_privilege('anon','public.debate_results','insert')
        || ', anon_ins present ' || exists (select 1 from pg_policy where polrelid='public.debate_results'::regclass and polname='anon_ins') || ' (PASS if true, true)' || E'\n';
  raise exception 'ASK492 TEST ROLLBACK%', E'\n' || r;
end $t$;
