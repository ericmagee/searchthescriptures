-- ASK 630 and ASK 631 (W4), DB part. Applied before the engine write; unused until the engine calls it.
-- ASK 630: mark a row whose panel stage failed (live, non-regrade), with its cause.
CREATE OR REPLACE FUNCTION public.odv1_mark_panel_incomplete(p_run_token text, p_node text, p_msg text, p_skip boolean)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_q text; n integer;
BEGIN
  IF p_skip IS TRUE THEN RETURN 0; END IF;
  IF p_run_token IS NULL OR btrim(p_run_token) = '' THEN RAISE EXCEPTION 'odv1_mark_panel_incomplete: p_run_token required'; END IF;
  v_q := 'PANEL INCOMPLETE: failed at node "' || coalesce(p_node,'unknown') || '": ' || left(coalesce(p_msg,''), 300)
         || '. The rounds and synthesis are recorded; no panel verdict stands on this row.';
  UPDATE debate_results
     SET quarantine_reason = v_q,
         review_notes = coalesce(review_notes,'') || E'\n\n[' || v_q || ' REVIEW THIS ROW.]',
         data_class = 'contested',
         framework_verdict = NULL
   WHERE run_token = p_run_token AND outcome IS NULL AND quarantine_reason IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $function$;
COMMENT ON FUNCTION public.odv1_mark_panel_incomplete(text,text,text,boolean) IS 'ASK 630: the engine marks a row whose panel stage failed (live, non-regrade) with its cause; skips a row with an outcome or a quarantine_reason.';
REVOKE ALL ON FUNCTION public.odv1_mark_panel_incomplete(text,text,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.odv1_mark_panel_incomplete(text,text,text,boolean) TO service_role, lab_seat;

-- ASK 631: judgment texts returned by a panel that then failed. Stored, never counted.
CREATE TABLE IF NOT EXISTS public.odv1_panel_incomplete_judgments (
  id bigserial PRIMARY KEY,
  debate_id uuid,
  run_token text NOT NULL,
  slot integer,
  judge_seat text,
  judge_api_model text,
  finish_reason text,
  completion_tokens integer,
  reply_text text NOT NULL,
  failed_node text,
  note text NOT NULL DEFAULT 'PANEL INCOMPLETE; NOT A VERDICT; NOT COUNTED',
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.odv1_panel_incomplete_judgments IS 'ASK 631: judge replies from a panel that failed. NOT A VERDICT; read by no outcome, panel or count. Append-only.';
ALTER TABLE public.odv1_panel_incomplete_judgments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.odv1_panel_incomplete_judgments FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.odv1_panel_incomplete_judgments TO service_role, lab_seat;
DROP POLICY IF EXISTS odv1_pij_seat_read ON public.odv1_panel_incomplete_judgments;
CREATE POLICY odv1_pij_seat_read ON public.odv1_panel_incomplete_judgments FOR SELECT TO lab_seat USING (true); -- ASK 631 (W1 N2): seats read the rows; no write policy, so writes go only through the definer function
CREATE OR REPLACE FUNCTION public.odv1_panel_incomplete_judgments_guard()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public', 'pg_temp'
AS $function$ BEGIN RAISE EXCEPTION 'odv1_panel_incomplete_judgments is append-only (ASK 631): % refused', TG_OP; END $function$;
DROP TRIGGER IF EXISTS trg_odv1_pij_guard ON public.odv1_panel_incomplete_judgments;
CREATE TRIGGER trg_odv1_pij_guard BEFORE UPDATE OR DELETE ON public.odv1_panel_incomplete_judgments FOR EACH ROW EXECUTE FUNCTION public.odv1_panel_incomplete_judgments_guard();
CREATE OR REPLACE FUNCTION public.odv1_record_incomplete_panel(p_debate_id uuid, p_run_token text, p_failed_node text, p_rows jsonb)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_n int;
BEGIN
  IF p_run_token IS NULL OR btrim(p_run_token) = '' THEN RAISE EXCEPTION 'odv1_record_incomplete_panel: p_run_token required'; END IF;
  IF p_rows IS NULL OR jsonb_typeof(p_rows) <> 'array' THEN RAISE EXCEPTION 'odv1_record_incomplete_panel: p_rows must be a json array'; END IF;
  INSERT INTO odv1_panel_incomplete_judgments (debate_id, run_token, slot, judge_seat, judge_api_model, finish_reason, completion_tokens, reply_text, failed_node)
  SELECT p_debate_id, p_run_token, NULLIF(r->>'slot','')::int, r->>'judge_seat', r->>'judge_api_model', r->>'finish_reason',
         NULLIF(r->>'completion_tokens','')::int, r->>'reply_text', p_failed_node
    FROM jsonb_array_elements(p_rows) r
   WHERE jsonb_typeof(r->'reply_text') = 'string' AND btrim(r->>'reply_text') <> '';
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN jsonb_build_object('recorded', true, 'rows', v_n);
END $function$;
COMMENT ON FUNCTION public.odv1_record_incomplete_panel(uuid,text,text,jsonb) IS 'ASK 631: stores judge replies with text from a panel that failed, marked not a verdict.';
REVOKE ALL ON FUNCTION public.odv1_record_incomplete_panel(uuid,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.odv1_record_incomplete_panel(uuid,text,text,jsonb) TO service_role, lab_seat;
