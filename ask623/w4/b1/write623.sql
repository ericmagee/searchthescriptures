-- ASK 623 DB write (W4): the neon model row; the two new seats in the five fixed seat lists; hydrogen and neon appended to the judge order's alternates (option A, card 15:01 CST). md5-gated exact replaces; each block refuses and changes nothing if its object moved.
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $d$ BEGIN
  IF EXISTS (SELECT 1 FROM model_config WHERE seat='neon') THEN RAISE EXCEPTION 'model_config already has a neon row; nothing changed'; END IF;
  INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, notes, family)
  SELECT 'neon', provider, role, 'google/gemini-4-neon', endpoint, 64000, 'google/gemini-4-neon', false, true, 'ASK 623: Gemini 4 Neon, debater and judge seat. 64,000 tokens by the standing word for debaters and judges. No reasoning setting.', 'google' FROM model_config WHERE seat='argon';
  IF NOT FOUND THEN RAISE EXCEPTION 'argon row not found; nothing changed'; END IF;
END $d$;
DO $d$
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
END $d$;
DO $d$
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
END $d$;
DO $d$
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
END $d$;
DO $d$
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
END $d$;
DO $d$
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
END $d$;
DO $d$ DECLARE v_before jsonb := odv1_judge_order_lists(); f text; BEGIN
  IF v_before <> '{"panel":["sol","sol62","spark"],"alternate":["chatgpt","qwen4max","gemini","argon","sonnet"]}'::jsonb OR (SELECT max(id) FROM odv1_judge_order_log) <> 2 THEN RAISE EXCEPTION 'judge order is not version 2 as read; nothing changed: %', v_before; END IF;
  f := odv1_judge_order_fault(ARRAY['sol','sol62','spark'], ARRAY['chatgpt','qwen4max','gemini','argon','sonnet','hydrogen','neon']);
  IF f IS NOT NULL THEN RAISE EXCEPTION 'the new order fails its own check: %', f; END IF;
  INSERT INTO odv1_judge_order VALUES ('hydrogen','alternate',6),('neon','alternate',7);  -- ASK 623, option A
  INSERT INTO odv1_judge_order_log (saved_by, before, after) VALUES ('ASK 623', v_before, odv1_judge_order_lists());
END $d$;
