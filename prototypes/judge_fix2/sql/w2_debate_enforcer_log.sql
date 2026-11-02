-- judge_fix2 W2 (MIGRATION FILE, NOT APPLIED). Safe to apply once through apply_migration: no DROP; IF NOT EXISTS / CREATE OR REPLACE throughout. Full storage of every enforcer exchange: one row per flagged item per seat (the cure prompt,
-- the full reply, the judge's RESPONSE line, the result), plus each alternate's first reply and the full first reply of a panel seat that
-- failed closed. Written once per run by the flow node "Write Enforcer Log" (POST /rest/v1/rpc/record_enforcer_log), after Alternate Merge,
-- in the same way record_debate_judgment is called by Write Judgment 1-3. The audit-line excerpts in verdict_raw stay as they are.
CREATE TABLE IF NOT EXISTS public.debate_enforcer_log (
  id             bigserial PRIMARY KEY,
  debate_id      uuid REFERENCES public.debate_results(id) ON DELETE CASCADE,
  run_token      text NOT NULL,
  seat           text,                 -- deepseek, gemini, ..., 'single' for the single judge
  seat_role      text CHECK (seat_role IN ('panel','reserve','alternate','single')),
  judge_model    text,
  kind           text NOT NULL CHECK (kind IN ('cure','alternate_reply','failed_reply')),
  rule           text,                 -- K-B, K-G1 .. K-G8, K-S, K-C, K-X, K-N, K-SC, K-DG8; null for a reply row
  item           text,                 -- the flagged item as the report names it (D5, D2 vs C2, CONCEDED LINKS, DEFENDER STANDING)
  flagged_line   text,                 -- the judge's line the mark was raised on, in full
  prompt_sent    text,                 -- the cure prompt (the last user message of the cure call), in full
  full_reply     text,                 -- the judge's whole reply to that prompt (or the alternate's / failed seat's first reply), in full
  reply_error    text,                 -- why there is no reply, when the call failed
  response_line  text,                 -- the judge's RESPONSE line for this item (W1), in full; null when none was written
  cure_status    text CHECK (cure_status IS NULL OR cure_status IN ('CURED','UNCURED')),
  cure_reason    text,
  at             timestamptz,          -- when the flow built the row
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS debate_enforcer_log_run_idx ON public.debate_enforcer_log (run_token);
CREATE INDEX IF NOT EXISTS debate_enforcer_log_debate_idx ON public.debate_enforcer_log (debate_id);
ALTER TABLE public.debate_enforcer_log ENABLE ROW LEVEL SECURITY;  -- no policies: no anon or authenticated read or write; rows go in only through the function below
REVOKE ALL ON TABLE public.debate_enforcer_log FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.debate_enforcer_log_id_seq FROM anon, authenticated;

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
$function$;
REVOKE ALL ON FUNCTION public.record_enforcer_log(uuid, text, jsonb) FROM PUBLIC;
-- The flow calls it with the "Supabase Anon Key" credential, as it calls record_debate_judgment (anon=X, authenticated=X, service_role=X).
GRANT EXECUTE ON FUNCTION public.record_enforcer_log(uuid, text, jsonb) TO anon, authenticated, service_role;
