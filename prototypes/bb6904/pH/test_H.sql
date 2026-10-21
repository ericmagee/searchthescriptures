-- BB-6904 portion H: migrate_H.sql run inside one DO block ended by RAISE (all rolls back); falsifiers on a throwaway copy of 27259's row.
DO $t$
DECLARE D uuid := gen_random_uuid(); x jsonb; res text := '';
  PE text[];
BEGIN
  EXECUTE $m$CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(p_debate_id uuid, p_alternates jsonb, p_drv_removed jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- BB-6904 (g), step 7; portion H (7126, 7127): records the alternates of one run and rewrites panel_expected to name them, BEFORE any
  -- judgment row is written (derive_debate_outcome FENCE 2b and 4), after odv1_record_panel_substitution (the reserve), whose
  -- panel_expected it reads. It never writes panel_substitution. The alternates are the flow's reserve judges the openrouter alternate
  -- call serves: an ACTIVE model_config row of provider openrouter and role engine; MiniMax never. Guards, from model_config and
  -- model_config.family, not from the payload: G1 never of a family that debates in this debate (6993); G2 never the model of the seat
  -- it replaces; G3 never a model already on the panel, and the alternates distinct. At most two. Every refusal raises.
DECLARE
  r record; a jsonb; i int; v_n int; v_new text[]; v_used text[] := ARRAY[]::text[];
  v_rm text; v_alt text; v_am text; v_af text; v_rmm text; v_deb_f text[]; v_pan_m text[];
BEGIN
  IF p_debate_id IS NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: p_debate_id required'; END IF;
  IF p_alternates IS NULL OR jsonb_typeof(p_alternates) = 'null' OR (jsonb_typeof(p_alternates) = 'array' AND jsonb_array_length(p_alternates) = 0) THEN
    RETURN jsonb_build_object('ok', true, 'written', false);
  END IF;
  IF jsonb_typeof(p_alternates) <> 'array' OR jsonb_array_length(p_alternates) > 2 THEN
    RAISE EXCEPTION 'odv1_record_panel_alternates: p_alternates must be an array of one or two';
  END IF;
  IF p_drv_removed IS NULL OR jsonb_typeof(p_drv_removed) <> 'array' OR jsonb_array_length(p_drv_removed) <> jsonb_array_length(p_alternates) THEN
    RAISE EXCEPTION 'odv1_record_panel_alternates: p_drv_removed must be an array with one removed ruling per alternate';
  END IF;
  SELECT id, panel_expected, defender_engine, challenger_engine, drv_removed INTO r FROM debate_results WHERE id = p_debate_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'odv1_record_panel_alternates: no debate_results row %', p_debate_id; END IF;
  IF r.drv_removed IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds alternates; one write per run', p_debate_id; END IF;
  SELECT count(*) INTO v_n FROM debate_judgments WHERE debate_id = p_debate_id;
  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;
  SELECT array_agg(lower(btrim(mc.family)) ORDER BY e.ord) INTO v_deb_f
    FROM unnest(ARRAY[r.defender_engine, r.challenger_engine]) WITH ORDINALITY AS e(eng, ord)
    LEFT JOIN model_config mc ON mc.seat = CASE e.eng WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE e.eng END;
  IF v_deb_f IS NULL OR cardinality(v_deb_f) < 2 OR array_position(v_deb_f, NULL) IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: the debaters'' families could not be read for debate %', p_debate_id; END IF;
  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);
  v_new := r.panel_expected;
  FOR i IN 0 .. jsonb_array_length(p_alternates) - 1 LOOP
    a := p_alternates -> i; v_rm := a ->> 'removed_seat'; v_alt := a ->> 'alternate_seat';
    IF v_rm IS NULL OR NOT (v_rm = ANY (v_new)) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed seat % is not in panel_expected %', v_rm, v_new; END IF;
    v_am := NULL; v_af := NULL;
    SELECT mc.api_model, lower(btrim(mc.family)) INTO v_am, v_af FROM model_config mc
      WHERE mc.seat = v_alt AND mc.active AND mc.provider = 'openrouter' AND mc.role = 'engine';
    IF v_am IS NULL OR v_af IS NULL OR v_af = '' THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is not an active openrouter reserve seat with a family', v_alt; END IF;
    IF v_af = 'minimax' THEN RAISE EXCEPTION 'odv1_record_panel_alternates: MiniMax is not an alternate in this publish (7126)'; END IF;
    IF v_alt = ANY (v_new) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % already sits on the panel', v_alt; END IF;
    IF (p_drv_removed -> i ->> 'seat') IS DISTINCT FROM v_rm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed ruling % does not name seat %', i, v_rm; END IF;
    IF (a ->> 'alternate_api_model') IS DISTINCT FROM v_am THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is model %, not %', v_alt, v_am, a ->> 'alternate_api_model'; END IF;
    SELECT api_model INTO v_rmm FROM model_config WHERE seat = v_rm;
    IF v_af = ANY (v_deb_f) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G1: family % debates in this debate', v_af; END IF;
    IF v_am IS NOT DISTINCT FROM v_rmm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G2: % is the model of seat %', v_am, v_rm; END IF;
    IF v_am = ANY (coalesce(v_pan_m, ARRAY[]::text[])) OR v_am = ANY (v_used) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G3: % already sits on this panel', v_am; END IF;
    v_used := v_used || v_am;
    v_new := array_replace(v_new, v_rm, v_alt);
  END LOOP;
  v_new := ARRAY(SELECT x FROM unnest(v_new) AS x ORDER BY x);
  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;
  RETURN jsonb_build_object('ok', true, 'written', true, 'panel_expected', v_new);
END;
$function$
$m$;
  INSERT INTO debate_results SELECT (jsonb_populate_record(NULL::debate_results, to_jsonb(d) || jsonb_build_object('id', D, 'drv_removed', NULL, 'run_token', 'ODV1-0-throwaw1'))).*
    FROM debate_results d WHERE id = '56e75954-c776-4e7e-8d26-94e3a46a5c09';
  SELECT panel_expected INTO PE FROM debate_results WHERE id = D;
  res := res || 'base ' || PE::text || '; ';
  -- good: one
  x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"glm","alternate_api_model":"z-ai/glm-5.3"}]', '[{"seat":"deepseek"}]');
  res := res || 'good1 ' || x::text || '; ';
  UPDATE debate_results SET drv_removed = NULL, panel_expected = PE WHERE id = D;
  -- good: two
  x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"glm","alternate_api_model":"z-ai/glm-5.3"},{"removed_seat":"gemini","alternate_seat":"qwen","alternate_api_model":"qwen/qwen3.8-max-0902"}]', '[{"seat":"deepseek"},{"seat":"gemini"}]');
  res := res || 'good2 ' || x::text || '; ';
  UPDATE debate_results SET drv_removed = NULL, panel_expected = PE WHERE id = D;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"alt_minimax3","alternate_api_model":"minimax/minimax-m3"}]', '[{"seat":"deepseek"}]'); res := res || 'BAD-minimax ACCEPTED; ';
  EXCEPTION WHEN OTHERS THEN res := res || 'minimax refused: ' || SQLERRM || '; '; END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"chatgpt","alternate_api_model":"gpt-6.1-sol"}]', '[{"seat":"deepseek"}]'); res := res || 'BAD-chatgpt ACCEPTED; ';
  EXCEPTION WHEN OTHERS THEN res := res || 'chatgpt refused: ' || SQLERRM || '; '; END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"glm","alternate_api_model":"qwen/qwen3.8-max-0902"}]', '[{"seat":"deepseek"}]'); res := res || 'BAD-model ACCEPTED; ';
  EXCEPTION WHEN OTHERS THEN res := res || 'wrong model refused: ' || SQLERRM || '; '; END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"glm","alternate_api_model":"z-ai/glm-5.3"},{"removed_seat":"gemini","alternate_seat":"glm","alternate_api_model":"z-ai/glm-5.3"}]', '[{"seat":"deepseek"},{"seat":"gemini"}]'); res := res || 'BAD-twice ACCEPTED; ';
  EXCEPTION WHEN OTHERS THEN res := res || 'twice refused: ' || SQLERRM || '; '; END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":null,"alternate_api_model":null}]', '[{"seat":"deepseek"}]'); res := res || 'BAD-null ACCEPTED; ';
  EXCEPTION WHEN OTHERS THEN res := res || 'null refused: ' || SQLERRM || '; '; END;
  RAISE EXCEPTION 'TEST_H RESULTS (rolled back): %', res;
END
$t$;
