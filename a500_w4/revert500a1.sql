-- ASK 500 A1 revert (W4): reverses the three replacements exactly; the closing check requires prosrc md5 3b74a293 again. Run in one call with SET LOCAL truth.session_id and truth.card. If A2 is live, revert A2 first (else every dashboard launch is refused).
do $r$
declare src text; nsrc text; a1 text; a2 text; a3 text; b1 text; b2 text; b3 text;
begin
  select prosrc into src from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure;
  a1 := E'  v_ovr uuid;\r\n';
  b1 := E'  v_ovr uuid;\r\n  v_key text;  -- ASK 500: start-webhook header value, read from Vault\r\n';
  a2 := E'begin\r\n  if p_topic is null';
  b2 := E'begin\r\n  select decrypted_secret into v_key from vault.decrypted_secrets where name = ''odv1_start_webhook'';  -- ASK 500\r\n  if v_key is null or length(v_key) < 32 then\r\n    raise exception ''dash_launch_odv1: the start webhook secret odv1_start_webhook is missing (ASK 500)'';\r\n  end if;\r\n  if p_topic is null';
  a3 := E'              ''fence_override_id'', v_ovr),\r\n    timeout_milliseconds := 60000\r\n';
  b3 := E'              ''fence_override_id'', v_ovr),\r\n    headers := jsonb_build_object(''Content-Type'', ''application/json'', ''x-odv1-key'', v_key),  -- ASK 500\r\n    timeout_milliseconds := 60000\r\n';
  nsrc := replace(replace(replace(src, b3, a3), b2, a2), b1, a1);
  if md5(nsrc) <> '3b74a293a3259e4eda43e7d307681dcc' then raise exception 'ASK 500 A1 revert: result is not the base (md5 %)', md5(nsrc); end if;
  execute format('CREATE OR REPLACE FUNCTION public.dash_launch_odv1(p_topic text, p_def_engine text, p_def_profile text, p_ch_engine text, p_ch_profile text, p_fence_reason text DEFAULT NULL::text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''public'', ''extensions'', ''pg_temp'' AS %L', nsrc);
  insert into audit_log(session_title, engine, notes)
  values ('ASK 500 A1 REVERTED: dash_launch_odv1 back to prosrc 3b74a293 (no start-webhook header)', 'W4_2026_11_06',
   'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
end $r$;
