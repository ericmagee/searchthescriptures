-- ASK 500 A1 rolled-back test (W4). One DO block ending in RAISE, so everything rolls back; pg_net sends only committed rows, so nothing is posted (plan 4). No secret value is read into the output: only md5 equality is printed.
-- T3 needs the Vault secret to be absent, and postgres cannot rename or update vault.secrets (has_table_privilege update = false). So this test is meant to run BEFORE A0: T3 runs on the real absence, then the test creates a temporary random secret (rolled back) for T2. If the secret already exists, T3 prints SKIPPED and T2 uses the real secret.
do $t$
declare r text := ''; src text; nsrc text; a1 text; a2 text; a3 text; b1 text; b2 text; b3 text; v jsonb; had boolean; q record; n0 bigint; l0 bigint; base_md5 text;
begin
  perform set_config('truth.session_id', 'session_01H1X3AP1fjeQaEbxPP9UEZH', true);
  select prosrc into src from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure;
  base_md5 := md5(src);
  r := r || 'B0 base prosrc md5 ' || base_md5 || ' (PASS if 3b74a293a3259e4eda43e7d307681dcc)' || E'\n';
  a1 := E'  v_ovr uuid;\r\n';
  b1 := E'  v_ovr uuid;\r\n  v_key text;  -- ASK 500: start-webhook header value, read from Vault\r\n';
  a2 := E'begin\r\n  if p_topic is null';
  b2 := E'begin\r\n  select decrypted_secret into v_key from vault.decrypted_secrets where name = ''odv1_start_webhook'';  -- ASK 500\r\n  if v_key is null or length(v_key) < 32 then\r\n    raise exception ''dash_launch_odv1: the start webhook secret odv1_start_webhook is missing (ASK 500)'';\r\n  end if;\r\n  if p_topic is null';
  a3 := E'              ''fence_override_id'', v_ovr),\r\n    timeout_milliseconds := 60000\r\n';
  b3 := E'              ''fence_override_id'', v_ovr),\r\n    headers := jsonb_build_object(''Content-Type'', ''application/json'', ''x-odv1-key'', v_key),  -- ASK 500\r\n    timeout_milliseconds := 60000\r\n';
  nsrc := replace(replace(replace(src, a1, b1), a2, b2), a3, b3);
  execute format('CREATE OR REPLACE FUNCTION public.dash_launch_odv1(p_topic text, p_def_engine text, p_def_profile text, p_ch_engine text, p_ch_profile text, p_fence_reason text DEFAULT NULL::text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''public'', ''extensions'', ''pg_temp'' AS %L', nsrc);
  r := r || 'S1 new prosrc md5 ' || md5(nsrc) || ', length ' || length(nsrc) || ', ACL ' || (select proacl::text from pg_proc where oid='public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure) || E'\n';
  had := exists (select 1 from vault.secrets where name = 'odv1_start_webhook');
  select count(*) into n0 from net.http_request_queue; select count(*) into l0 from odv1_launches;
  if not had then
    begin v := public.dash_launch_odv1('SELFTEST ask500 T3 allowed topic about Romans 8', 'gemini', 'plain', 'spark', 'oracle');
      r := r || 'T3 secret missing: returned ' || coalesce(v->>'status','?') || ' (FAIL: should raise)' || E'\n';
    exception when others then
      r := r || 'T3 secret missing: raised "' || sqlerrm || '"; queued ' || ((select count(*) from net.http_request_queue) - n0) || ', launches logged ' || ((select count(*) from odv1_launches) - l0) || ' (PASS if both 0)' || E'\n';
    end;
    perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'), 'odv1_start_webhook', 'ASK 500 test only, rolled back');
  else
    r := r || 'T3 SKIPPED: odv1_start_webhook already exists' || E'\n';
  end if;
  v := public.dash_launch_odv1('Is salvation by bloodline?', 'gemini', 'plain', 'spark', 'oracle');
  r := r || 'T1 fenced topic, no reason: status ' || coalesce(v->>'status','?') || ', fenced ' || coalesce(v->>'fenced','?') || ' (PASS if error, true)' || E'\n';
  select count(*) into n0 from net.http_request_queue;
  v := public.dash_launch_odv1('SELFTEST ask500 T2 allowed topic about Romans 8', 'gemini', 'plain', 'spark', 'oracle');
  r := r || 'T2a allowed topic: status ' || coalesce(v->>'status','?') || ', queued ' || ((select count(*) from net.http_request_queue) - n0) || ' (PASS if fired, 1)' || E'\n';
  select * into q from net.http_request_queue where id = (v->>'request_id')::bigint;
  r := r || 'T2b url ' || q.url || ', method ' || q.method || ' (PASS if the oracle-debate-v1 URL, POST)' || E'\n';
  r := r || 'T2c header keys ' || (select string_agg(k, ',' order by k) from jsonb_object_keys(q.headers) k) || ' (PASS if Content-Type,x-odv1-key)' || E'\n';
  r := r || 'T2d Content-Type ' || (q.headers->>'Content-Type') || ' (PASS if application/json)' || E'\n';
  r := r || 'T2e header value md5 equals Vault md5: ' || (md5(q.headers->>'x-odv1-key') = (select md5(decrypted_secret) from vault.decrypted_secrets where name='odv1_start_webhook')) || ' (PASS if true; neither printed)' || E'\n';
  r := r || 'T2f body ' || convert_from(q.body,'UTF8') || ' (PASS if topic, defender, challenger, fence_override_id null, as today)' || E'\n';
  r := r || 'T2g timeout ' || q.timeout_milliseconds || ' (PASS if 60000)' || E'\n';
  nsrc := replace(replace(replace(nsrc, b3, a3), b2, a2), b1, a1);
  execute format('CREATE OR REPLACE FUNCTION public.dash_launch_odv1(p_topic text, p_def_engine text, p_def_profile text, p_ch_engine text, p_ch_profile text, p_fence_reason text DEFAULT NULL::text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''public'', ''extensions'', ''pg_temp'' AS %L', nsrc);
  r := r || 'R1 prosrc md5 after the revert replacements ' || (select md5(prosrc) from pg_proc where oid='public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure) || ' (PASS if equal to B0)' || E'\n';
  raise exception 'ASK500 A1 TEST ROLLBACK%', E'\n' || r;
end $t$;
