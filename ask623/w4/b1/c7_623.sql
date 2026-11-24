SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $dry$ DECLARE r jsonb := '{}'::jsonb; x record; j text; BEGIN
BEGIN EXECUTE $i$INSERT INTO debate_results (engine, topic, defender_engine, challenger_engine, panel_expected) VALUES ('ASK623-C7','ASK 623 C7 rolled-back test','claude','grok',ARRAY['sol','sol62','spark']) RETURNING id$i$ INTO j;
  r := r || jsonb_build_object('live_before_write|sub|neon', odv1_record_panel_substitution(j::uuid, jsonb_build_object('failed_seat','sol','substitute','neon','failure_kind','error','at',now()))->'panel_expected');
EXCEPTION WHEN others THEN r := r || jsonb_build_object('live_before_write|sub|neon','REFUSED: '||SQLERRM); END;
EXECUTE $b0$DO $d$ BEGIN
  IF EXISTS (SELECT 1 FROM model_config WHERE seat='neon') THEN RAISE EXCEPTION 'model_config already has a neon row; nothing changed'; END IF;
  INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, notes, family)
  SELECT 'neon', provider, role, 'google/gemini-4-neon', endpoint, 64000, 'google/gemini-4-neon', false, true, 'ASK 623: Gemini 4 Neon, debater and judge seat. 64,000 tokens by the standing word for debaters and judges. No reasoning setting.', 'google' FROM model_config WHERE seat='argon';
  IF NOT FOUND THEN RAISE EXCEPTION 'argon row not found; nothing changed'; END IF;
END $d$$b0$;
EXECUTE $b1$DO $d$
DECLARE f text := pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure);
  a text[] := ARRAY[$q$'luna','hydrogen','gemini'$q$];
  b text[] := ARRAY[$q$'luna','hydrogen','neon'/* ASK 623 */,'gemini'$q$]; i int;
BEGIN
  IF md5(f) <> 'c3d6061b49b0f31866b7f1d92f63ca5f' THEN RAISE EXCEPTION 'public.odv1_record_panel_substitution(uuid,jsonb) is not the expected text (md5 c3d6061b); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  EXECUTE f;
END $d$$b1$;
EXECUTE $b6$DO $d$ DECLARE v_before jsonb := odv1_judge_order_lists(); f text; BEGIN
  IF v_before <> '{"panel":["sol","sol62","spark"],"alternate":["chatgpt","qwen4max","gemini","argon","sonnet"]}'::jsonb OR (SELECT max(id) FROM odv1_judge_order_log) <> 2 THEN RAISE EXCEPTION 'judge order is not version 2 as read; nothing changed: %', v_before; END IF;
  f := odv1_judge_order_fault(ARRAY['sol','sol62','spark'], ARRAY['chatgpt','qwen4max','gemini','argon','sonnet','hydrogen','neon']);
  IF f IS NOT NULL THEN RAISE EXCEPTION 'the new order fails its own check: %', f; END IF;
  INSERT INTO odv1_judge_order VALUES ('hydrogen','alternate',6),('neon','alternate',7);  -- ASK 623, option A
  INSERT INTO odv1_judge_order_log (saved_by, before, after) VALUES ('ASK 623', v_before, odv1_judge_order_lists());
END $d$$b6$;

-- C7 (rolled back): the two recorders accept hydrogen and neon after the write; G1 still refuses a Google alternate when a Google seat debates.
FOR x IN SELECT * FROM (VALUES ('sub','neon','claude'),('sub','hydrogen','claude'),('alt','neon','claude'),('alt','hydrogen','claude'),('alt','neon','gemini'),('alt','hydrogen','neon')) v(k,s,d) LOOP
  BEGIN
    EXECUTE $i$INSERT INTO debate_results (engine, topic, defender_engine, challenger_engine, panel_expected) VALUES ('ASK623-C7','ASK 623 C7 rolled-back test',$1,'grok',ARRAY['sol','sol62','spark']) RETURNING id$i$ INTO j USING x.d;
    IF x.k='sub' THEN
      r := r || jsonb_build_object(x.k||'|'||x.s||'|'||x.d, odv1_record_panel_substitution(j::uuid, jsonb_build_object('failed_seat','sol','substitute',x.s,'failure_kind','error','at',now()))->'panel_expected');
    ELSE
      r := r || jsonb_build_object(x.k||'|'||x.s||'|'||x.d, odv1_record_panel_alternates(j::uuid, jsonb_build_array(jsonb_build_object('removed_seat','sol','alternate_seat',x.s,'alternate_api_model',(SELECT api_model FROM model_config WHERE seat=x.s))), jsonb_build_array(jsonb_build_object('seat','sol')))->'panel_expected');
    END IF;
  EXCEPTION WHEN others THEN r := r || jsonb_build_object(x.k||'|'||x.s||'|'||x.d, 'REFUSED: '||SQLERRM);
  END;
END LOOP;
RAISE EXCEPTION 'C7623 %', r::text; END $dry$;