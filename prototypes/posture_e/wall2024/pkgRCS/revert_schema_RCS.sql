-- W4: database revert for pkgRCS (restores the live function as read at 13:30 CST 11-11 exactly, read from pg_get_functiondef and proacl).
-- Run only after the flow has been reverted (the s139 flow calls the five-argument form, which this restores).
BEGIN;
DROP FUNCTION IF EXISTS public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint, jsonb);
CREATE OR REPLACE FUNCTION public.record_debate_row_tokens(p_run_token text, p_input bigint, p_output bigint, p_cache_write bigint, p_cache_read bigint)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
-- ORDER E (BB-6037): sets a new run's four token columns to the totals the flow computed (pre-save calls plus panel calls).
-- Totals, not increments, so a retried call is harmless; only a row from the last 6 hours, and no figure may go down.
DECLARE v_n integer;
BEGIN
  UPDATE debate_results SET input_tokens=p_input, output_tokens=p_output, cache_write_tokens=p_cache_write, cache_read_tokens=p_cache_read
   WHERE run_token=p_run_token AND created_at > now() - interval '6 hours'
     AND p_input >= coalesce(input_tokens,0) AND p_output >= coalesce(output_tokens,0)
     AND p_cache_write >= coalesce(cache_write_tokens,0) AND p_cache_read >= coalesce(cache_read_tokens,0);
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN v_n;
END $function$;
REVOKE ALL ON FUNCTION public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_debate_row_tokens(text, bigint, bigint, bigint, bigint) TO anon, authenticated, service_role, lab_seat;
-- Columns and table are left in place (dropping them loses the recorded costs); to remove them as well:
-- ALTER TABLE debate_results DROP COLUMN IF EXISTS call_costs, DROP COLUMN IF EXISTS run_cost_usd; DROP TABLE IF EXISTS model_prices;
COMMIT;
