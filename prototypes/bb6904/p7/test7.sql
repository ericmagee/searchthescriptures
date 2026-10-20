-- BB-6904 (g) step 7: falsifiers for odv1_record_panel_alternates, one DO block ended by RAISE (every write rolls back). 27259 is
-- used (debaters mimo and claude; panel deepseek, gemini, grok); its judgment rows are deleted inside the block where a case needs none.
DO $t$
DECLARE r jsonb := '{}'; D uuid := '56e75954-c776-4e7e-8d26-94e3a46a5c09'; x jsonb;
  rm jsonb := '[{"seat":"grok","api_model":"grok-4.7","verdict_raw":"X","replaced_by":"alt_minimax"}]';
BEGIN
  EXECUTE 'ALTER TABLE public.debate_results ADD COLUMN drv_removed jsonb';
  EXECUTE $i$INSERT INTO public.model_config (seat, provider, role, api_model, max_tokens, active, notes) VALUES
 ('alt_haiku', 'openrouter', 'alternate', 'anthropic/claude-haiku-5.5', 32000, true, 'BB-6904 (g) first alternate judge (operator, recorded BB-6981): Claude Haiku 5.5, reasoning effort max, never a debater. Id per BB-6984, confirmed by the qualify runs.'),
 ('alt_minimax', 'openrouter', 'alternate', 'minimax/minimax-m3.1-flash', 32000, true, 'BB-6904 (g) second alternate judge (operator, recorded BB-6981): MiniMax M3.1 Flash, paid route, reasoning effort max. Id per BB-6984, confirmed by the qualify runs.')$i$;
  EXECUTE $f$CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(p_debate_id uuid, p_alternates jsonb, p_drv_removed jsonb, p_g1_by_maker boolean DEFAULT true)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- BB-6904 (g), step 7: records the alternates of one run and rewrites panel_expected to name them, BEFORE any judgment row is
  -- written (derive_debate_outcome FENCE 2b and 4), after odv1_record_panel_substitution (the reserve), whose panel_expected it
  -- reads. It never writes panel_substitution. Guards, re-checked here from model_config, not taken from the payload: G1 never a
  -- seated debater's model (and, when p_g1_by_maker, never its maker); G2 never the model of the seat it replaces; G3 never a model
  -- already on the panel, and the alternates distinct. At most two (the pool holds two). Every refusal raises.
DECLARE
  v_pool constant text[] := ARRAY['alt_haiku','alt_minimax'];
  r record; a jsonb; i int; v_n int; v_new text[]; v_used text[] := ARRAY[]::text[];
  v_rm text; v_alt text; v_am text; v_amk text; v_rmm text; v_deb_m text[]; v_deb_k text[]; v_pan_m text[];
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
  -- The debaters' models and makers, by Init Seats' engine-to-seat map.
  SELECT array_agg(mc.api_model), array_agg(CASE WHEN position('/' in mc.api_model) > 0 THEN lower(split_part(mc.api_model, '/', 1)) ELSE mc.provider END)
    INTO v_deb_m, v_deb_k FROM model_config mc
   WHERE mc.seat = ANY (ARRAY(SELECT CASE e WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE e END
                              FROM unnest(ARRAY[r.defender_engine, r.challenger_engine]) e));
  IF v_deb_m IS NULL OR cardinality(v_deb_m) < 2 THEN RAISE EXCEPTION 'odv1_record_panel_alternates: the debaters'' models could not be read for debate %', p_debate_id; END IF;
  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);
  v_new := r.panel_expected;
  FOR i IN 0 .. jsonb_array_length(p_alternates) - 1 LOOP
    a := p_alternates -> i; v_rm := a ->> 'removed_seat'; v_alt := a ->> 'alternate_seat';
    IF v_rm IS NULL OR NOT (v_rm = ANY (v_new)) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed seat % is not in panel_expected %', v_rm, v_new; END IF;
    IF v_alt IS NULL OR NOT (v_alt = ANY (v_pool)) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is not a pool seat', v_alt; END IF;
    IF v_alt = ANY (v_new) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % already sits on the panel', v_alt; END IF;
    IF (p_drv_removed -> i ->> 'seat') IS DISTINCT FROM v_rm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: removed ruling % does not name seat %', i, v_rm; END IF;
    SELECT api_model, CASE WHEN position('/' in api_model) > 0 THEN lower(split_part(api_model, '/', 1)) ELSE provider END INTO v_am, v_amk
      FROM model_config WHERE seat = v_alt AND active;
    IF v_am IS NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: pool seat % has no active model_config row', v_alt; END IF;
    IF (a ->> 'alternate_api_model') IS DISTINCT FROM v_am THEN RAISE EXCEPTION 'odv1_record_panel_alternates: % is model % in model_config, not %', v_alt, v_am, a ->> 'alternate_api_model'; END IF;
    SELECT api_model INTO v_rmm FROM model_config WHERE seat = v_rm;
    IF v_am = ANY (v_deb_m) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G1: % is a seated debater''s model', v_am; END IF;
    IF p_g1_by_maker AND v_amk = ANY (v_deb_k) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G1 (by maker): % makes a seated debater', v_amk; END IF;
    IF v_am IS NOT DISTINCT FROM v_rmm THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G2: % is the model of seat %', v_am, v_rm; END IF;
    IF v_am = ANY (coalesce(v_pan_m, ARRAY[]::text[])) OR v_am = ANY (v_used) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G3: % already sits on this panel', v_am; END IF;
    v_used := v_used || v_am;
    v_new := array_replace(v_new, v_rm, v_alt);
  END LOOP;
  v_new := ARRAY(SELECT x FROM unnest(v_new) AS x ORDER BY x);
  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;
  RETURN jsonb_build_object('ok', true, 'written', true, 'panel_expected', v_new);
END;
$function$$f$;
  -- 1. empty: ok, nothing written
  r := r || jsonb_build_object('t1_empty', odv1_record_panel_alternates(D, '[]'::jsonb, '[]'::jsonb, true));
  -- 2. judgment rows exist: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"}]', rm, true); r := r || jsonb_build_object('t2_rows_exist','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t2_rows_exist', SQLERRM); END;
  DELETE FROM debate_judgments WHERE debate_id = D;
  -- 3. G1 by maker: Haiku against a Claude debater (claude_synthesis, anthropic): refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_haiku","alternate_api_model":"anthropic/claude-haiku-5.5"}]', '[{"seat":"grok"}]', true); r := r || jsonb_build_object('t3_g1_maker','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t3_g1_maker', SQLERRM); END;
  -- 4. a payload model that is not model_config's: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax","alternate_api_model":"minimax/other"}]', rm, true); r := r || jsonb_build_object('t4_model_mismatch','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t4_model_mismatch', SQLERRM); END;
  -- 5. removed seat not on the panel: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"qwen","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"qwen"}]', true); r := r || jsonb_build_object('t5_not_on_panel','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t5_not_on_panel', SQLERRM); END;
  -- 6. the same pool seat twice (G3): refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"},{"removed_seat":"gemini","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"grok"},{"seat":"gemini"}]', false); r := r || jsonb_build_object('t6_g3_twice','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t6_g3_twice', SQLERRM); END;
  -- 7. three alternates: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{},{},{}]', '[{},{},{}]', true); r := r || jsonb_build_object('t7_three','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t7_three', SQLERRM); END;
  -- 8. removed ruling naming another seat: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"gemini"}]', true); r := r || jsonb_build_object('t8_ruling_seat','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t8_ruling_seat', SQLERRM); END;
  -- 9. G1 by model only (switch false): Haiku may sit against a Sonnet debater; two alternates, distinct: accepted
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"grok","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"},{"removed_seat":"gemini","alternate_seat":"alt_haiku","alternate_api_model":"anthropic/claude-haiku-5.5"}]', '[{"seat":"grok"},{"seat":"gemini"}]', false);
    r := r || jsonb_build_object('t9_two_by_model', x, 't9_row', (SELECT jsonb_build_object('panel_expected', panel_expected, 'drv_removed_n', jsonb_array_length(drv_removed), 'panel_substitution', panel_substitution) FROM debate_results WHERE id = D));
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t9_two_by_model', 'REFUSED: '||SQLERRM); END;
  -- 10. a second write: refused
  BEGIN x := odv1_record_panel_alternates(D, '[{"removed_seat":"deepseek","alternate_seat":"alt_minimax","alternate_api_model":"minimax/minimax-m3.1-flash"}]', '[{"seat":"deepseek"}]', true); r := r || jsonb_build_object('t10_second_write','NOT REFUSED');
  EXCEPTION WHEN others THEN r := r || jsonb_build_object('t10_second_write', SQLERRM); END;
  RAISE EXCEPTION 'RESULT %', r;
END $t$;
