CREATE OR REPLACE FUNCTION public.record_enforcer_log(p_debate_id uuid, p_run_token text, p_rows jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_n int;
BEGIN
  IF p_run_token IS NULL OR btrim(p_run_token) = '' THEN RAISE EXCEPTION 'record_enforcer_log: p_run_token required'; END IF;
  IF p_rows IS NULL OR jsonb_typeof(p_rows) <> 'array' THEN RAISE EXCEPTION 'record_enforcer_log: p_rows must be a json array'; END IF;
  INSERT INTO debate_enforcer_log (debate_id, run_token, seat, seat_role, judge_model, kind, rule, item, flagged_line, prompt_sent,
                                   full_reply, reply_error, response_line, cure_status, cure_reason, at)
  SELECT p_debate_id, p_run_token, r->>'seat', r->>'seat_role', r->>'judge_model', COALESCE(r->>'kind','cure'), r->>'rule', r->>'item',
         r->>'flagged_line', r->>'prompt_sent', r->>'full_reply', r->>'reply_error', r->>'response_line', r->>'cure_status', r->>'cure_reason',
         NULLIF(r->>'at','')::timestamptz
    FROM jsonb_array_elements(p_rows) r;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN jsonb_build_object('recorded', true, 'rows', v_n);
END;
$function$
