SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $dry$ DECLARE r jsonb := '{}'::jsonb; x record; j jsonb; BEGIN
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
EXECUTE $b2$DO $d$
DECLARE f text := pg_get_functiondef('public.dash_debaters()'::regprocedure);
  a text[] := ARRAY[$q$    (11,'sol62','Sol 6.2','sol62')
  ) as l$q$];
  b text[] := ARRAY[$q$    (11,'sol62','Sol 6.2','sol62'),
    (12,'hydrogen','Gemini 4 Hydrogen','hydrogen'),  -- ASK 623
    (13,'neon','Gemini 4 Neon','neon')  -- ASK 623
  ) as l$q$]; i int;
BEGIN
  IF md5(f) <> '4a16cddc116497de72b35376b41d220b' THEN RAISE EXCEPTION 'public.dash_debaters() is not the expected text (md5 4a16cddc); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  EXECUTE f;
END $d$$b2$;
EXECUTE $b3$DO $d$
DECLARE f text := pg_get_functiondef('public.dash_judge_lineup(text,text,jsonb,text[])'::regprocedure);
  a text[] := ARRAY[$q$"hydrogen":"google",$q$,$q$'argon','hydrogen','spark'$q$];
  b text[] := ARRAY[$q$"hydrogen":"google","neon":"google",$q$,$q$'argon','hydrogen','neon'/* ASK 623 */,'spark'$q$]; i int;
BEGIN
  IF md5(f) <> 'e19ac69ba5b59639f0db9847095fbfe8' THEN RAISE EXCEPTION 'public.dash_judge_lineup(text,text,jsonb,text[]) is not the expected text (md5 e19ac69b); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  EXECUTE f;
END $d$$b3$;
EXECUTE $b4$DO $d$
DECLARE f text := pg_get_functiondef('public.dash_odv1_debates()'::regprocedure);
  a text[] := ARRAY[$q$'gemini','hydrogen','spark'$q$];
  b text[] := ARRAY[$q$'gemini','hydrogen','neon'/* ASK 623 */,'spark'$q$]; i int;
BEGIN
  IF md5(f) <> '738253362a2d640f5504f8f884a54afa' THEN RAISE EXCEPTION 'public.dash_odv1_debates() is not the expected text (md5 73825336); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  EXECUTE f;
END $d$$b4$;
EXECUTE $b5$DO $d$
DECLARE f text := pg_get_functiondef('public.dash_odv1_judges(uuid)'::regprocedure);
  a text[] := ARRAY[$q$'gemini','hydrogen','spark'$q$];
  b text[] := ARRAY[$q$'gemini','hydrogen','neon'/* ASK 623 */,'spark'$q$]; i int;
BEGIN
  IF md5(f) <> '1146217296b9399d4da70340a3f4efea' THEN RAISE EXCEPTION 'public.dash_odv1_judges(uuid) is not the expected text (md5 11462172); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  EXECUTE f;
END $d$$b5$;
EXECUTE $b6$DO $d$ DECLARE v_before jsonb := odv1_judge_order_lists(); f text; BEGIN
  IF v_before <> '{"panel":["sol","sol62","spark"],"alternate":["chatgpt","qwen4max","gemini","argon","sonnet"]}'::jsonb OR (SELECT max(id) FROM odv1_judge_order_log) <> 2 THEN RAISE EXCEPTION 'judge order is not version 2 as read; nothing changed: %', v_before; END IF;
  f := odv1_judge_order_fault(ARRAY['sol','sol62','spark'], ARRAY['chatgpt','qwen4max','gemini','argon','sonnet','hydrogen','neon']);
  IF f IS NOT NULL THEN RAISE EXCEPTION 'the new order fails its own check: %', f; END IF;
  INSERT INTO odv1_judge_order VALUES ('hydrogen','alternate',6),('neon','alternate',7);  -- ASK 623, option A
  INSERT INTO odv1_judge_order_log (saved_by, before, after) VALUES ('ASK 623', v_before, odv1_judge_order_lists());
END $d$$b6$;
FOR x IN SELECT * FROM (VALUES ('claude','chatgpt'),('claude','gemini'),('claude','grok'),('claude','mimo'),('claude','opus'),('claude','glm'),('claude','qwen4max'),('claude','spark'),('claude','sol62'),('claude','hydrogen'),('claude','neon'),('chatgpt','claude'),('chatgpt','gemini'),('chatgpt','grok'),('chatgpt','mimo'),('chatgpt','opus'),('chatgpt','glm'),('chatgpt','qwen4max'),('chatgpt','spark'),('chatgpt','sol62'),('chatgpt','hydrogen'),('chatgpt','neon'),('gemini','claude'),('gemini','chatgpt'),('gemini','grok'),('gemini','mimo'),('gemini','opus'),('gemini','glm'),('gemini','qwen4max'),('gemini','spark'),('gemini','sol62'),('gemini','hydrogen'),('gemini','neon'),('grok','claude'),('grok','chatgpt'),('grok','gemini'),('grok','mimo'),('grok','opus'),('grok','glm'),('grok','qwen4max'),('grok','spark'),('grok','sol62'),('grok','hydrogen'),('grok','neon'),('mimo','claude'),('mimo','chatgpt'),('mimo','gemini'),('mimo','grok'),('mimo','opus'),('mimo','glm'),('mimo','qwen4max'),('mimo','spark'),('mimo','sol62'),('mimo','hydrogen'),('mimo','neon'),('opus','claude'),('opus','chatgpt'),('opus','gemini'),('opus','grok'),('opus','mimo'),('opus','glm'),('opus','qwen4max'),('opus','spark'),('opus','sol62'),('opus','hydrogen'),('opus','neon'),('glm','claude'),('glm','chatgpt'),('glm','gemini'),('glm','grok'),('glm','mimo'),('glm','opus'),('glm','qwen4max'),('glm','spark'),('glm','sol62'),('glm','hydrogen'),('glm','neon'),('qwen4max','claude'),('qwen4max','chatgpt'),('qwen4max','gemini'),('qwen4max','grok'),('qwen4max','mimo'),('qwen4max','opus'),('qwen4max','glm'),('qwen4max','spark'),('qwen4max','sol62'),('qwen4max','hydrogen'),('qwen4max','neon'),('spark','claude'),('spark','chatgpt'),('spark','gemini'),('spark','grok'),('spark','mimo'),('spark','opus'),('spark','glm'),('spark','qwen4max'),('spark','sol62'),('spark','hydrogen'),('spark','neon'),('sol62','claude'),('sol62','chatgpt'),('sol62','gemini'),('sol62','grok'),('sol62','mimo'),('sol62','opus'),('sol62','glm'),('sol62','qwen4max'),('sol62','spark'),('sol62','hydrogen'),('sol62','neon'),('hydrogen','claude'),('hydrogen','chatgpt'),('hydrogen','gemini'),('hydrogen','grok'),('hydrogen','mimo'),('hydrogen','opus'),('hydrogen','glm'),('hydrogen','qwen4max'),('hydrogen','spark'),('hydrogen','sol62'),('hydrogen','neon'),('neon','claude'),('neon','chatgpt'),('neon','gemini'),('neon','grok'),('neon','mimo'),('neon','opus'),('neon','glm'),('neon','qwen4max'),('neon','spark'),('neon','sol62'),('neon','hydrogen')) v(d,c) LOOP j := dash_judge_lineup(x.d,x.c); r := r || jsonb_build_object(x.d||'|'||x.c, coalesce((SELECT string_agg(e,',') FROM jsonb_array_elements_text(j->'panel') e),'')||'/'||coalesce(j->>'reserve','none')||'/'||coalesce((SELECT string_agg(e,',') FROM jsonb_array_elements_text(j->'alternates') e),'')); END LOOP;
r := r || jsonb_build_object('_order', odv1_judge_order_lists(), '_version', (SELECT max(id) FROM odv1_judge_order_log), '_neon', (SELECT jsonb_build_object('api',api_model,'mt',max_tokens,'fam',family,'act',active,'role',role) FROM model_config WHERE seat='neon'), '_deb', (SELECT jsonb_agg(key ORDER BY ord) FROM dash_debaters()), '_fault', coalesce(odv1_judge_order_fault(ARRAY['sol','neon','spark'],ARRAY['chatgpt','qwen4max','gemini','argon','sonnet','hydrogen','sol62']),'ok'));
RAISE EXCEPTION 'DRYRUN623 %', r::text; END $dry$;