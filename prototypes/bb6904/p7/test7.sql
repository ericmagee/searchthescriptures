-- BB-6904 (g) step 7: migration7.sql executed whole inside one DO block ended by RAISE (every write and DDL rolls back), then the
-- falsifiers of odv1_record_panel_alternates on 27259 (debaters mimo and claude; panel deepseek, gemini, grok).
DO $t$
DECLARE r jsonb := '{}'; D uuid := '56e75954-c776-4e7e-8d26-94e3a46a5c09'; x jsonb;
  M31 text := '{"removed_seat":"grok","alternate_seat":"alt_minimax31","alternate_api_model":"minimax/minimax-m3.1-flash"}';
  M3 text := '{"removed_seat":"gemini","alternate_seat":"alt_minimax3","alternate_api_model":"minimax/minimax-m3"}';
BEGIN
  EXECUTE $m$ALTER TABLE public.debate_results ADD COLUMN drv_removed jsonb;
COMMENT ON COLUMN public.debate_results.drv_removed IS 'BB-6904 (g): the rulings removed for uncured DEBATE RULE VIOLATIONS and the alternates that sat (seat, api_model, verdict_tag, standings, drv_uncured, verdict_raw, replaced_by, replaced_by_model, at). Written once, before any judgment row, by odv1_record_panel_alternates. NULL = no alternate sat.';
-- THE FAMILY TABLE (6993: one table, read by Resolve Seats through Fetch Models and by odv1_record_panel_alternates alike).
ALTER TABLE public.model_config ADD COLUMN family text;
COMMENT ON COLUMN public.model_config.family IS 'BB-6993: the model family. No judge, reserve or alternate sits on a debate in which a model of its own family debates (Claude never judges Claude). Read by ORACLE_DEBATE_V1 Resolve Seats and odv1_record_panel_alternates; a seat without a family fails the run closed.';
UPDATE public.model_config SET family = CASE seat
  WHEN 'chatgpt' THEN 'openai' WHEN 'claude_synthesis' THEN 'anthropic' WHEN 'deepseek' THEN 'deepseek' WHEN 'deepseek_debate' THEN 'deepseek'
  WHEN 'gemini' THEN 'google' WHEN 'glm' THEN 'zhipu' WHEN 'grok' THEN 'xai' WHEN 'kimi' THEN 'moonshot' WHEN 'mimo' THEN 'xiaomi'
  WHEN 'qwen' THEN 'qwen' END
 WHERE seat IN ('chatgpt','claude_synthesis','deepseek','deepseek_debate','gemini','glm','grok','kimi','mimo','qwen');
-- THE PERMANENT ALTERNATES (6997 item 4): documented here; the flow does not read its pool from these rows.
INSERT INTO public.model_config (seat, provider, role, api_model, max_tokens, active, family, notes) VALUES
 ('alt_minimax31', 'openrouter', 'alternate', 'minimax/minimax-m3.1-flash', 32000, true, 'minimax', 'BB-6904 (g), BB-6997: permanent alternate judge, MiniMax M3.1 Flash, reasoning effort max, hard-coded in ORACLE_DEBATE_V1. MiniMax never debates.'),
 ('alt_minimax3', 'openrouter', 'alternate', 'minimax/minimax-m3', 32000, true, 'minimax', 'BB-6904 (g), BB-6997: permanent alternate judge, MiniMax M3, reasoning effort max, hard-coded in ORACLE_DEBATE_V1. MiniMax never debates.');

CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(p_debate_id uuid, p_alternates jsonb, p_drv_removed jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- BB-6904 (g), step 7: records the alternates of one run and rewrites panel_expected to name them, BEFORE any judgment row is
  -- written (derive_debate_outcome FENCE 2b and 4), after odv1_record_panel_substitution (the reserve), whose panel_expected it
  -- reads. It never writes panel_substitution. The two alternates are constants here as in the flow (6997). Guards, from the
  -- constants and model_config.family, not from the payload: G1 never of a family that debates in this debate (6993); G2 never the
  -- model of the seat it replaces; G3 never a model already on the panel, and the alternates distinct. At most two. Every refusal raises.
DECLARE
  v_pool constant text[] := ARRAY['alt_minimax31','alt_minimax3'];
  v_ids constant text[] := ARRAY['minimax/minimax-m3.1-flash','minimax/minimax-m3'];
  v_alt_family constant text := 'minimax';
  r record; a jsonb; i int; k int; v_n int; v_new text[]; v_used text[] := ARRAY[]::text[];
  v_rm text; v_alt text; v_am text; v_rmm text; v_deb_f text[]; v_pan_m text[];
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
  -- The debaters' families, by Init Seats' engine-to-seat map, from the one family table: one entry per debater, in seat order,
  -- so two debaters on one engine give two entries (7013); a debater with no model_config row or no family gives NULL (fails closed).
  SELECT array_agg(lower(btrim(mc.family)) ORDER BY e.ord) INTO v_deb_f
    FROM unnest(ARRAY[r.defender_engine, r.challenger_engine]) WITH ORDINALITY AS e(eng, ord)
    LEFT JOIN model_config mc ON mc.seat = CASE e.eng WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE e.eng END;
  IF v_deb_f IS NULL OR cardinality(v_deb_f) < 2 OR array_position(v_deb_f, NULL) IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: the debaters'' families could not be read for debate %', p_debate_id; END IF;
  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);
  v_new := r.panel_expected;
  FOR i IN 0 .. jsonb_array_length(p_alternates) - 1 LOOP
    a := p_alternates -> i; v_rm := a ->> 'removed_seat'; v_alt := a ->> 'alternate_seat';
    IF v_rm IS NULL OR NOT (v_rm = ANY (v_new)) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed seat % is not in panel_expected %', v_rm, v_new; END IF;
    k := array_position(v_pool, v_alt);
    IF k IS NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is not one of the permanent alternates %', v_alt, v_pool; END IF;
    IF v_alt = ANY (v_new) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % already sits on the panel', v_alt; END IF;
    IF (p_drv_removed -> i ->> 'seat') IS DISTINCT FROM v_rm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed ruling % does not name seat %', i, v_rm; END IF;
    v_am := v_ids[k];
    IF (a ->> 'alternate_api_model') IS DISTINCT FROM v_am THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is model %, not %', v_alt, v_am, a ->> 'alternate_api_model'; END IF;
    SELECT api_model INTO v_rmm FROM model_config WHERE seat = v_rm;
    IF v_alt_family = ANY (v_deb_f) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G1: family % debates in this debate', v_alt_family; END IF;
    IF v_am IS NOT DISTINCT FROM v_rmm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G2: % is the model of seat %', v_am, v_rm; END IF;
    IF v_am = ANY (coalesce(v_pan_m, ARRAY[]::text[])) OR v_am = ANY (v_used) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G3: % already sits on this panel', v_am; END IF;
    v_used := v_used || v_am;
    v_new := array_replace(v_new, v_rm, v_alt);
  END LOOP;
  v_new := ARRAY(SELECT x FROM unnest(v_new) AS x ORDER BY x);
  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;
  RETURN jsonb_build_object('ok', true, 'written', true, 'panel_expected', v_new);
END;
$function$;

-- Repeat removals (6904 g): read-only; what a repeat count triggers is the operator's choice.
CREATE OR REPLACE VIEW public.odv1_drv_removals AS
  SELECT r.id AS debate_id, r.created_at, e ->> 'seat' AS seat, e ->> 'api_model' AS api_model, (e ->> 'drv_uncured')::int AS drv_uncured,
         e ->> 'replaced_by' AS replaced_by, e ->> 'replaced_by_model' AS replaced_by_model
    FROM debate_results r, jsonb_array_elements(r.drv_removed) e
   WHERE r.drv_removed IS NOT NULL;$m$;
  r := r || jsonb_build_object('md5_fn', left(md5(pg_get_functiondef('odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure)),8),
    't0_families', (SELECT jsonb_object_agg(seat, family) FROM model_config), 't0_rows_without_family', (SELECT count(*) FROM model_config WHERE family IS NULL));
  r := r || jsonb_build_object('t1_empty', odv1_record_panel_alternates(D, '[]'::jsonb, '[]'::jsonb));
  BEGIN x := odv1_record_panel_alternates(D, ('['||M31||']')::jsonb, '[{"seat":"grok"}]'); r := r || jsonb_build_object('t2_rows_exist','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t2_rows_exist', SQLERRM); END;
  DELETE FROM debate_judgments WHERE debate_id = D;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax31","alternate_api_model":"minimax/other"}]', '[{"seat":"grok"}]'); r := r || jsonb_build_object('t4_model_mismatch','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t4_model_mismatch', SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"qwen","alternate_seat":"alt_minimax31","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"qwen"}]'); r := r || jsonb_build_object('t5_not_on_panel','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t5_not_on_panel', SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, ('['||M31||','||replace(M31,'"grok"','"gemini"')||']')::jsonb, '[{"seat":"grok"},{"seat":"gemini"}]'); r := r || jsonb_build_object('t6_same_twice','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t6_same_twice', SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, '[{},{},{}]', '[{},{},{}]'); r := r || jsonb_build_object('t7_three','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t7_three', SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, ('['||M31||']')::jsonb, '[{"seat":"gemini"}]'); r := r || jsonb_build_object('t8_ruling_seat','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t8_ruling_seat', SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_haiku","alternate_api_model":"anthropic/claude-haiku-5.5"}]', '[{"seat":"grok"}]'); r := r || jsonb_build_object('t11_not_an_alternate','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t11_not_an_alternate', SQLERRM); END;
  UPDATE model_config SET family = 'minimax' WHERE seat = 'mimo'; -- inside the block only: a debater of the alternates' family
  BEGIN x := odv1_record_panel_alternates(D, ('['||M3||']')::jsonb, '[{"seat":"gemini"}]'); r := r || jsonb_build_object('t12_g1_family','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t12_g1_family', SQLERRM); END;
  UPDATE model_config SET family = NULL WHERE seat = 'mimo';
  BEGIN x := odv1_record_panel_alternates(D, ('['||M3||']')::jsonb, '[{"seat":"gemini"}]'); r := r || jsonb_build_object('t13_debater_without_family','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t13_debater_without_family', SQLERRM); END;
  UPDATE model_config SET family = 'xiaomi' WHERE seat = 'mimo';
  BEGIN -- t14 (7013): both debaters on one engine; must seat, not fail on the family read; undone by its own RAISE
    UPDATE debate_results SET challenger_engine = defender_engine WHERE id = D;
    x := odv1_record_panel_alternates(D, ('['||M3||']')::jsonb, '[{"seat":"gemini"}]');
    r := r || jsonb_build_object('t14_same_engine_debaters', x, 't14_engines', (SELECT defender_engine||'/'||challenger_engine FROM debate_results WHERE id = D));
    RAISE EXCEPTION 't14 undo';
  EXCEPTION WHEN others THEN IF SQLERRM <> 't14 undo' THEN r := r || jsonb_build_object('t14_same_engine_debaters', 'REFUSED: '||SQLERRM); END IF; END;
  r := r || jsonb_build_object('t14_after_undo', (SELECT jsonb_build_object('engines', defender_engine||'/'||challenger_engine, 'drv_removed', drv_removed IS NOT NULL) FROM debate_results WHERE id = D));
  BEGIN x := odv1_record_panel_alternates(D, ('['||M31||','||M3||']')::jsonb, '[{"seat":"grok"},{"seat":"gemini"}]');
    r := r || jsonb_build_object('t9_two', x, 't9_row', (SELECT jsonb_build_object('panel_expected', panel_expected, 'drv_removed_n', jsonb_array_length(drv_removed), 'panel_substitution', panel_substitution) FROM debate_results WHERE id = D));
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t9_two', 'REFUSED: '||SQLERRM); END;
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"alt_minimax31","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"deepseek"}]'); r := r || jsonb_build_object('t10_second_write','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t10_second_write', SQLERRM); END;
  RAISE EXCEPTION 'RESULT %', r;
END $t$;
