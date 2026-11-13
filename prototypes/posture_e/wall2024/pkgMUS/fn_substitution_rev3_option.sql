-- pkgMUS rev 3, OPTIONAL part (the operator's choice; not needed for the alternate step): odv1_record_panel_substitution
-- accepts the reserve seats of the alternate order. Live s173 already sends the reserve (grok) here when one panel judge fails
-- (Panel Check sub -> Record Substitution), and v_seats lacks it, so that path raises on live today. One change: v_seats gains
-- grok, hydrogen, argon, ember, gemini, spark. Live prosrc md5 edb79b39c7da0ca5deafba228fb2cb8d (3,733 chars);
-- this body md5 aa1de555eb0be94e88c6e789501f0b53 (equal to replace() on live, computed in SQL, read only).
-- Revert: the same statement with the live v_seats line (fn_substitution_live_s173.sql).
CREATE OR REPLACE FUNCTION public.odv1_record_panel_substitution(p_debate_id uuid, p_substitution jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Panel-judge fallback (BB-5685 design, BB-5693 S3, WALL-0966 1328-1330): records the one substitution of a run and
  -- rewrites panel_expected to the dispatched three BEFORE any judgment row is written (derive_debate_outcome FENCE 2b).
  -- NULL substitution: nothing to record, ok. Every refusal raises, so the calling node fails closed.
DECLARE
  v_seats constant text[] := ARRAY['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna','haiku','grok','hydrogen','argon','ember','gemini','spark']; -- pkgMUS rev 3: the reserve seats of the alternate order added (operator 21:08 CST 11-12); pkgJGR: gemini and grok judge no more (operator 21:10Z 11-08); luna added (operator 07:27Z 11-09); haiku added (operator 08:34Z 11-09); pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08); pkgGLX2: old glm removed (Wall 3065)
  v_kinds constant text[] := ARRAY['error','timeout','no_usable_judgment','refused'];
  r record; v_f text; v_s text; v_k text; v_at timestamptz; v_n int; v_new text[];
BEGIN
  IF p_debate_id IS NULL THEN RAISE EXCEPTION 'odv1_record_panel_substitution: p_debate_id required'; END IF;
  IF p_substitution IS NULL OR jsonb_typeof(p_substitution) = 'null' THEN
    RETURN jsonb_build_object('ok', true, 'written', false);
  END IF;
  IF jsonb_typeof(p_substitution) <> 'object' OR NOT (p_substitution ?& ARRAY['failed_seat','substitute','failure_kind','at']) THEN
    RAISE EXCEPTION 'odv1_record_panel_substitution: substitution must be an object with failed_seat, substitute, failure_kind and at';
  END IF;
  v_f := p_substitution->>'failed_seat'; v_s := p_substitution->>'substitute'; v_k := p_substitution->>'failure_kind';
  BEGIN
    v_at := (p_substitution->>'at')::timestamptz;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'odv1_record_panel_substitution: at % does not cast to timestamptz', p_substitution->>'at';
  END;
  IF v_k IS NULL OR NOT (v_k = ANY (v_kinds)) THEN RAISE EXCEPTION 'odv1_record_panel_substitution: failure_kind % is not one of %', v_k, v_kinds; END IF;
  IF v_f IS NULL OR NOT (v_f = ANY (v_seats)) THEN RAISE EXCEPTION 'odv1_record_panel_substitution: failed_seat % is not a panel seat', v_f; END IF;
  IF v_s IS NULL OR NOT (v_s = ANY (v_seats)) THEN RAISE EXCEPTION 'odv1_record_panel_substitution: substitute % is not a panel seat', v_s; END IF;
  SELECT id, panel_expected, panel_substitution, defender_engine, challenger_engine INTO r
    FROM debate_results WHERE id = p_debate_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'odv1_record_panel_substitution: no debate_results row %', p_debate_id; END IF;
  IF r.panel_substitution IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds a substitution; one per run', p_debate_id; END IF;
  SELECT count(*) INTO v_n FROM debate_judgments WHERE debate_id = p_debate_id;
  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;
  IF r.panel_expected IS NULL OR NOT (v_f = ANY (r.panel_expected)) THEN RAISE EXCEPTION 'odv1_record_panel_substitution: failed_seat % is not in panel_expected %', v_f, r.panel_expected; END IF;
  IF v_s = ANY (r.panel_expected) THEN RAISE EXCEPTION 'odv1_record_panel_substitution: substitute % is already in panel_expected %', v_s, r.panel_expected; END IF;
  IF v_s = r.defender_engine OR v_s = r.challenger_engine THEN RAISE EXCEPTION 'odv1_record_panel_substitution: substitute % is a seated debater on this debate', v_s; END IF;
  v_new := ARRAY(SELECT x FROM unnest(array_replace(r.panel_expected, v_f, v_s)) AS x ORDER BY x);
  UPDATE debate_results SET panel_expected = v_new, panel_substitution = p_substitution WHERE id = p_debate_id;
  RETURN jsonb_build_object('ok', true, 'written', true, 'panel_expected', v_new);
END;
$function$;
