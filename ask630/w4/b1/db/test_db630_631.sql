SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $T$
DECLARE r jsonb := '{}'::jsonb; n int; j jsonb; row record; upd text := 'not refused'; tok text := 'ODV1-42517-5yb0fmgv';
BEGIN
EXECUTE $SQL$-- ASK 630 and ASK 631 (W4), DB part. Applied before the engine write; unused until the engine calls it.
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
$SQL$;
UPDATE debate_results SET quarantine_reason = NULL WHERE run_token = tok;
n := odv1_mark_panel_incomplete(tok, 'Panel Check', 'FAIL-CLOSED: seat "hydrogen" returned no text: finish_reason length; output tokens 65,536 (reasoning 65,533); prompt tokens 75,848. NO ROW IS WRITTEN.', false);
r := r || jsonb_build_object('mark_n', n);
SELECT quarantine_reason, right(review_notes, 330) AS tail, data_class, framework_verdict, outcome INTO row FROM debate_results WHERE run_token = tok;
r := r || jsonb_build_object('q', row.quarantine_reason, 'tail', row.tail, 'dc', row.data_class, 'fv', row.framework_verdict, 'outcome', row.outcome);
r := r || jsonb_build_object('again_n', odv1_mark_panel_incomplete(tok, 'X', 'Y', false));
UPDATE debate_results SET quarantine_reason = NULL WHERE run_token = tok;
r := r || jsonb_build_object('skip_n', odv1_mark_panel_incomplete(tok, 'X', 'Y', true));
r := r || jsonb_build_object('outcome_row_n', odv1_mark_panel_incomplete('ODV1-42528-dqwbcshc', 'X', 'Y', false));
j := odv1_record_incomplete_panel('fd0edbff-ffe8-4bc3-9e41-16c8cbfb2a90', tok, 'Panel Check', '[{"slot":1,"judge_seat":"gemini","judge_api_model":"google/gemini-3.8-flash","finish_reason":"stop","completion_tokens":29340,"reply_text":"VERDICT TEXT"},{"slot":3,"judge_seat":"hydrogen","reply_text":"  "},{"slot":null,"judge_seat":"sonnet","reply_text":null}]'::jsonb);
r := r || jsonb_build_object('pij', j);
EXECUTE 'SELECT jsonb_agg(jsonb_build_object(''slot'',slot,''seat'',judge_seat,''tok'',completion_tokens,''note'',note,''node'',failed_node)) FROM odv1_panel_incomplete_judgments' INTO j;
r := r || jsonb_build_object('pij_rows', j);
BEGIN EXECUTE 'UPDATE odv1_panel_incomplete_judgments SET note = ''x'''; EXCEPTION WHEN others THEN upd := SQLERRM; END;
r := r || jsonb_build_object('update_refused', upd);
r := r || jsonb_build_object('trigger_ops', (SELECT pg_get_triggerdef(oid) FROM pg_trigger WHERE tgname = 'trg_odv1_pij_guard'));
r := r || jsonb_build_object('priv', jsonb_build_object(
  'anon_mark', has_function_privilege('anon','odv1_mark_panel_incomplete(text,text,text,boolean)','EXECUTE'),
  'auth_mark', has_function_privilege('authenticated','odv1_mark_panel_incomplete(text,text,text,boolean)','EXECUTE'),
  'svc_mark', has_function_privilege('service_role','odv1_mark_panel_incomplete(text,text,text,boolean)','EXECUTE'),
  'anon_rec', has_function_privilege('anon','odv1_record_incomplete_panel(uuid,text,text,jsonb)','EXECUTE'),
  'svc_rec', has_function_privilege('service_role','odv1_record_incomplete_panel(uuid,text,text,jsonb)','EXECUTE'),
  'anon_tbl', has_table_privilege('anon','odv1_panel_incomplete_judgments','SELECT,INSERT,UPDATE'),
  'auth_tbl', has_table_privilege('authenticated','odv1_panel_incomplete_judgments','SELECT,INSERT,UPDATE'),
  'rls', (SELECT relrowsecurity FROM pg_class WHERE relname='odv1_panel_incomplete_judgments')));
RAISE EXCEPTION 'T630RESULT %', r::text;
END $T$;