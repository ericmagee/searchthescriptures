-- ASK 500 A1 (W4, build of plan500.md rev 1 d018ed85; W1 10110, W2 10111). dash_launch_odv1 sends the start-webhook header. Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card, after A0 (vault secret "odv1_start_webhook" exists).
-- The new source is built from the live source by three exact replacements (each anchor must occur once), so the CRLF line ends and every other byte stay as they are. Header name: x-odv1-key (the operator uses this name in the n8n credential "ODV1 start webhook"). The value is read inside the function only; it is never printed.
do $s$
declare src text; nsrc text; a1 text; a2 text; a3 text; b1 text; b2 text; b3 text;
begin
  select prosrc into src from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure;
  if md5(src) <> '3b74a293a3259e4eda43e7d307681dcc' then raise exception 'ASK 500 A1: dash_launch_odv1 is not the planned base (md5 %)', md5(src); end if;
  a1 := E'  v_ovr uuid;\r\n';
  b1 := E'  v_ovr uuid;\r\n  v_key text;  -- ASK 500: start-webhook header value, read from Vault\r\n';
  a2 := E'begin\r\n  if p_topic is null';
  b2 := E'begin\r\n  select decrypted_secret into v_key from vault.decrypted_secrets where name = ''odv1_start_webhook'';  -- ASK 500\r\n  if v_key is null or length(v_key) < 32 then\r\n    raise exception ''dash_launch_odv1: the start webhook secret odv1_start_webhook is missing (ASK 500)'';\r\n  end if;\r\n  if p_topic is null';
  a3 := E'              ''fence_override_id'', v_ovr),\r\n    timeout_milliseconds := 60000\r\n';
  b3 := E'              ''fence_override_id'', v_ovr),\r\n    headers := jsonb_build_object(''Content-Type'', ''application/json'', ''x-odv1-key'', v_key),  -- ASK 500\r\n    timeout_milliseconds := 60000\r\n';
  if (length(src) - length(replace(src, a1, ''))) / length(a1) <> 1 then raise exception 'ASK 500 A1: anchor 1 count'; end if;
  if (length(src) - length(replace(src, a2, ''))) / length(a2) <> 1 then raise exception 'ASK 500 A1: anchor 2 count'; end if;
  if (length(src) - length(replace(src, a3, ''))) / length(a3) <> 1 then raise exception 'ASK 500 A1: anchor 3 count'; end if;
  nsrc := replace(replace(replace(src, a1, b1), a2, b2), a3, b3);
  execute format('CREATE OR REPLACE FUNCTION public.dash_launch_odv1(p_topic text, p_def_engine text, p_def_profile text, p_ch_engine text, p_ch_profile text, p_fence_reason text DEFAULT NULL::text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''public'', ''extensions'', ''pg_temp'' AS %L', nsrc);
  insert into audit_log(session_title, engine, notes)
  values ('ASK 500 A1: dash_launch_odv1 sends the start-webhook header (x-odv1-key from Vault)', 'W4_2026_11_06',
   'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
   || ' | prosrc 3b74a293 -> ' || md5(nsrc) || ' | three replacements: v_key declare; Vault read with raise if missing, before any insert or post; headers Content-Type and x-odv1-key on net.http_post');
end $s$;
do $c$ declare s text; begin
  select prosrc into s from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure;
  if s not like '%x-odv1-key%' or s not like '%odv1_start_webhook%' then raise exception 'ASK 500 A1: new source missing'; end if;
  if (select proacl::text from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure) <> '{postgres=X/postgres,service_role=X/postgres,lab_seat=X/postgres}' then raise exception 'ASK 500 A1: ACL changed'; end if;
  if not (select prosecdef from pg_proc where oid = 'public.dash_launch_odv1(text,text,text,text,text,text)'::regprocedure) then raise exception 'ASK 500 A1: not SECURITY DEFINER'; end if;
end $c$;
