-- pkgRCS schema (W1 draft; NOT APPLIED). Three writes, one transaction, applied BEFORE the workflow write.
-- The new function accepts the old five-argument call too (p_calls defaults to NULL), so the live s139 workflow keeps working,
-- and a workflow revert needs no database revert.
BEGIN;
ALTER TABLE debate_results ADD COLUMN IF NOT EXISTS call_costs jsonb, ADD COLUMN IF NOT EXISTS run_cost_usd numeric;
CREATE TABLE IF NOT EXISTS model_prices(
  model text PRIMARY KEY,                -- exactly as the provider returns it in the reply (for example claude-opus-5-5, deepseek-flash)
  input_per_m numeric NOT NULL,          -- USD per million uncached input tokens
  cache_read_per_m numeric,              -- USD per million tokens read from cache
  cache_write_5m_per_m numeric,          -- USD per million tokens written to the 5-minute cache
  cache_write_1h_per_m numeric,          -- USD per million tokens written to the 1-hour cache
  output_per_m numeric NOT NULL,         -- USD per million output tokens (thinking included)
  source text NOT NULL,                  -- the published pricing page read
  as_of date NOT NULL);
DROP FUNCTION IF EXISTS public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint);
CREATE OR REPLACE FUNCTION public.record_debate_row_tokens(p_run_token text, p_input bigint, p_output bigint, p_cache_write bigint, p_cache_read bigint, p_calls jsonb DEFAULT NULL)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
-- ORDER E (BB-6037): sets a new run's four token columns to the totals the flow computed (pre-save calls plus panel calls).
-- Totals, not increments, so a retried call is harmless; only a row from the last 6 hours, and no figure may go down.
-- pkgRCS: p_calls lists every model call; each is priced here. A call with a billed figure (OpenRouter) keeps it ("billed");
-- otherwise it is priced from model_prices ("price list", an estimate); a model with no row gets usd NULL ("no price"), never 0.
DECLARE v_n integer; v_c jsonb;
BEGIN
  UPDATE debate_results SET input_tokens=p_input, output_tokens=p_output, cache_write_tokens=p_cache_write, cache_read_tokens=p_cache_read
   WHERE run_token=p_run_token AND created_at > now() - interval '6 hours'
     AND p_input >= coalesce(input_tokens,0) AND p_output >= coalesce(output_tokens,0)
     AND p_cache_write >= coalesce(cache_write_tokens,0) AND p_cache_read >= coalesce(cache_read_tokens,0);
  GET DIAGNOSTICS v_n = ROW_COUNT;
  IF p_calls IS NOT NULL AND jsonb_typeof(p_calls)='array' THEN
    SELECT coalesce(jsonb_agg(e.x || jsonb_build_object('usd', e.usd, 'src', e.src) ORDER BY e.ord),'[]'::jsonb) INTO v_c FROM (
      SELECT c.x, c.ord,
        CASE WHEN c.x ? 'b' THEN (c.x->>'b')::numeric
             WHEN p.model IS NOT NULL THEN round((coalesce((c.x->>'i')::numeric,0)*p.input_per_m + coalesce((c.x->>'cr')::numeric,0)*coalesce(p.cache_read_per_m,p.input_per_m)
                  + coalesce((c.x->>'w5')::numeric,0)*coalesce(p.cache_write_5m_per_m,p.input_per_m) + coalesce((c.x->>'w1')::numeric,0)*coalesce(p.cache_write_1h_per_m,p.input_per_m)
                  + coalesce((c.x->>'o')::numeric,0)*p.output_per_m)/1000000, 6) END AS usd,
        CASE WHEN c.x ? 'b' THEN 'billed' WHEN p.model IS NOT NULL THEN 'price list' ELSE 'no price' END AS src
      FROM jsonb_array_elements(p_calls) WITH ORDINALITY c(x, ord) LEFT JOIN model_prices p ON p.model = c.x->>'m') e;
    UPDATE debate_results SET call_costs=v_c, run_cost_usd=(SELECT sum((y->>'usd')::numeric) FROM jsonb_array_elements(v_c) y)
     WHERE run_token=p_run_token AND created_at > now() - interval '6 hours';
  END IF;
  RETURN v_n;
END $function$;
-- the old function's grants, restored exactly (measured from pg_proc.proacl: postgres, anon, authenticated, service_role, lab_seat; no PUBLIC)
REVOKE ALL ON FUNCTION public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint, jsonb) TO anon, authenticated, service_role, lab_seat;
-- model_prices access: W4 to follow the lab's table convention (the flow does not read it; the function is SECURITY DEFINER)
COMMIT;
-- Fill (a seat, from each provider's published pricing page, not from memory), for example:
-- INSERT INTO model_prices VALUES ('claude-opus-5-5',4,0.20,5,8,20,'<pricing page>','<date read>'),('claude-sonnet-5-5',2,0.10,2.5,4,10,'<pricing page>','<date read>'),('deepseek-flash',...);
