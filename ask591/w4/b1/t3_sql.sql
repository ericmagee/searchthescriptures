CREATE TEMP TABLE odv1_judge_order (seat text PRIMARY KEY REFERENCES public.model_config(seat), list text NOT NULL CHECK (list IN ('panel','alternate')), ord integer NOT NULL CHECK (ord >= 1), UNIQUE (list, ord));
CREATE TEMP TABLE odv1_judge_order_log (id bigserial PRIMARY KEY, saved_at timestamptz NOT NULL DEFAULT now(), saved_by text NOT NULL, before jsonb, after jsonb NOT NULL);
INSERT INTO odv1_judge_order (seat, list, ord) VALUES ('chatgpt','panel',1), ('sol','panel',2), ('sol62','panel',3), ('gemini','alternate',1), ('spark','alternate',2), ('qwen4max','alternate',3), ('argon','alternate',4), ('sonnet','alternate',5);
CREATE OR REPLACE FUNCTION pg_temp.odv1_judge_order_lists()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
  SELECT jsonb_build_object(
    'panel',     coalesce((SELECT jsonb_agg(seat ORDER BY ord) FROM odv1_judge_order WHERE list='panel'), '[]'::jsonb),
    'alternate', coalesce((SELECT jsonb_agg(seat ORDER BY ord) FROM odv1_judge_order WHERE list='alternate'), '[]'::jsonb));
$f$;
CREATE OR REPLACE FUNCTION pg_temp.odv1_judge_order_fault(p_panel text[], p_alt text[])
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE v_all text[] := coalesce(p_panel,'{}') || coalesce(p_alt,'{}'); s text; v_src text; v_act int;
BEGIN
  IF cardinality(v_all) = 0 THEN RETURN 'the order is empty'; END IF;
  IF (SELECT count(DISTINCT x) FROM unnest(v_all) x) <> cardinality(v_all) THEN RETURN 'a seat stands twice'; END IF;
  FOREACH s IN ARRAY v_all LOOP
    IF NOT EXISTS (SELECT 1 FROM model_config WHERE seat = s AND active AND role = 'engine') THEN RETURN 'seat '||s||' has no active model_config row'; END IF;
  END LOOP;
  SELECT count(*) INTO v_act FROM unnest(coalesce(p_panel,'{}')) x;
  IF v_act < 3 THEN RETURN 'the panel list holds '||v_act||' seat(s); it needs at least three'; END IF;
  -- The reserve recorder admits only the seats it names (ASK 591 L3): every seat that could stand fourth must be on its list.
  SELECT prosrc INTO v_src FROM pg_proc WHERE oid = 'public.odv1_record_panel_substitution'::regproc;
  FOREACH s IN ARRAY v_all LOOP
    IF position(''''||s||'''' in v_src) = 0 THEN RETURN 'seat '||s||' is not on the reserve recorder''s list (odv1_record_panel_substitution)'; END IF;
  END LOOP;
  RETURN NULL;
END $f$;
CREATE OR REPLACE FUNCTION pg_temp.odv1_judge_order_read()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE l jsonb := pg_temp.odv1_judge_order_lists(); p text[]; a text[]; f text; v bigint;
BEGIN
  p := ARRAY(SELECT jsonb_array_elements_text(l->'panel')); a := ARRAY(SELECT jsonb_array_elements_text(l->'alternate'));
  f := pg_temp.odv1_judge_order_fault(p, a);
  IF f IS NOT NULL THEN RAISE EXCEPTION 'JUDGE ORDER: the order table could not be read (%); no call was made', f; END IF;
  SELECT max(id) INTO v FROM odv1_judge_order_log;
  RETURN jsonb_build_object('panel', l->'panel', 'alternate', l->'alternate', 'version', coalesce(v,0));
END $f$;
CREATE OR REPLACE FUNCTION pg_temp.odv1_judge_order_save(p_panel jsonb, p_alt jsonb, p_by text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE p text[]; a text[]; f text; v_before jsonb; v_id bigint; i int;
BEGIN
  IF jsonb_typeof(p_panel) <> 'array' OR jsonb_typeof(p_alt) <> 'array' THEN RETURN jsonb_build_object('error','the two lists must be arrays'); END IF;
  p := ARRAY(SELECT jsonb_array_elements_text(p_panel)); a := ARRAY(SELECT jsonb_array_elements_text(p_alt));
  IF (SELECT array_agg(x ORDER BY x) FROM unnest(p || a) x) IS DISTINCT FROM (SELECT array_agg(seat ORDER BY seat) FROM odv1_judge_order) THEN
    RETURN jsonb_build_object('error','the order must hold exactly the seats it holds now, each once; a seat is added or dropped only by its own ASK');
  END IF;
  f := pg_temp.odv1_judge_order_fault(p, a);
  IF f IS NOT NULL THEN RETURN jsonb_build_object('error', f); END IF;
  v_before := pg_temp.odv1_judge_order_lists();
  LOCK TABLE odv1_judge_order IN EXCLUSIVE MODE;
  DELETE FROM odv1_judge_order;
  FOR i IN 1 .. cardinality(p) LOOP INSERT INTO odv1_judge_order VALUES (p[i],'panel',i); END LOOP;
  FOR i IN 1 .. coalesce(cardinality(a),0) LOOP INSERT INTO odv1_judge_order VALUES (a[i],'alternate',i); END LOOP;
  INSERT INTO odv1_judge_order_log (saved_by, before, after) VALUES (coalesce(nullif(p_by,''),'dashboard'), v_before, pg_temp.odv1_judge_order_lists()) RETURNING id INTO v_id;
  RETURN jsonb_build_object('ok', true, 'version', v_id, 'order', pg_temp.odv1_judge_order_lists());
END $f$;
CREATE TEMP TABLE t3 (k int, id text, ok boolean, got text);
INSERT INTO pg_temp.odv1_judge_order_log (saved_by, before, after) VALUES ('ASK 591 seed (live Init Seats order)', NULL, pg_temp.odv1_judge_order_lists());
INSERT INTO t3 SELECT 1,'seed passes the fault check', pg_temp.odv1_judge_order_fault(ARRAY['chatgpt','sol','sol62'],ARRAY['gemini','spark','qwen4max','argon','sonnet']) IS NULL, coalesce(pg_temp.odv1_judge_order_fault(ARRAY['chatgpt','sol','sol62'],ARRAY['gemini','spark','qwen4max','argon','sonnet']),'NULL');
INSERT INTO t3 SELECT 2,'read on the seed', (r->>'version')='1' AND r->'panel'='["chatgpt","sol","sol62"]' AND r->'alternate'='["gemini","spark","qwen4max","argon","sonnet"]', r::text FROM (SELECT pg_temp.odv1_judge_order_read() r) x;
INSERT INTO t3 SELECT 3,'refuse: not arrays', r ? 'error', r::text FROM (SELECT pg_temp.odv1_judge_order_save('"x"','[]','t') r) x;
INSERT INTO t3 SELECT 4,'refuse: a seat added (grok)', r->>'error' LIKE 'the order must hold exactly%', r::text FROM (SELECT pg_temp.odv1_judge_order_save('["chatgpt","sol","sol62","grok"]','["gemini","spark","qwen4max","argon","sonnet"]','t') r) x;
INSERT INTO t3 SELECT 5,'refuse: a seat dropped (sonnet)', r->>'error' LIKE 'the order must hold exactly%', r::text FROM (SELECT pg_temp.odv1_judge_order_save('["chatgpt","sol","sol62"]','["gemini","spark","qwen4max","argon"]','t') r) x;
INSERT INTO t3 SELECT 6,'refuse: a seat twice', r->>'error' LIKE 'the order must hold exactly%', r::text FROM (SELECT pg_temp.odv1_judge_order_save('["chatgpt","sol","sol62","sol"]','["gemini","spark","qwen4max","argon","sonnet"]','t') r) x;
INSERT INTO t3 SELECT 7,'refuse: two panel seats', r->>'error' LIKE 'the panel list holds 2 seat(s)%', r::text FROM (SELECT pg_temp.odv1_judge_order_save('["chatgpt","sol"]','["sol62","gemini","spark","qwen4max","argon","sonnet"]','t') r) x;
INSERT INTO t3 SELECT 8,'fault: inactive seat (haiku)', f LIKE 'seat haiku has no active%', f FROM (SELECT pg_temp.odv1_judge_order_fault(ARRAY['chatgpt','sol','sol62'],ARRAY['haiku']) f) x;
INSERT INTO t3 SELECT 9,'fault: seat off the recorder list', f LIKE 'seat % is not on the reserve recorder%', f FROM (SELECT pg_temp.odv1_judge_order_fault(ARRAY['chatgpt','sol','sol62'],ARRAY['luna']) f) x;
INSERT INTO t3 SELECT 10,'fault: empty', f='the order is empty', f FROM (SELECT pg_temp.odv1_judge_order_fault('{}','{}') f) x;
INSERT INTO t3 SELECT 11,'after refusals: table and log unchanged', pg_temp.odv1_judge_order_lists()='{"panel":["chatgpt","sol","sol62"],"alternate":["gemini","spark","qwen4max","argon","sonnet"]}' AND (SELECT count(*) FROM pg_temp.odv1_judge_order_log)=1, pg_temp.odv1_judge_order_lists()::text;
INSERT INTO t3 SELECT 12,'valid save (gemini into the panel)', (r->>'ok')='true' AND (r->>'version')='2' AND r->'order'='{"panel":["chatgpt","sol","sol62","gemini"],"alternate":["spark","qwen4max","argon","sonnet"]}', r::text FROM (SELECT pg_temp.odv1_judge_order_save('["chatgpt","sol","sol62","gemini"]','["spark","qwen4max","argon","sonnet"]','dashboard') r) x;
INSERT INTO t3 SELECT 13,'log row holds before and after', l.before='{"panel":["chatgpt","sol","sol62"],"alternate":["gemini","spark","qwen4max","argon","sonnet"]}' AND l.after->'panel'='["chatgpt","sol","sol62","gemini"]' AND l.saved_by='dashboard', l.before::text||' -> '||l.after::text FROM pg_temp.odv1_judge_order_log l WHERE id=2;
INSERT INTO t3 SELECT 14,'read gives the saved order and version 2', (r->>'version')='2' AND r->'panel'='["chatgpt","sol","sol62","gemini"]', r::text FROM (SELECT pg_temp.odv1_judge_order_read() r) x;
DELETE FROM pg_temp.odv1_judge_order WHERE list='panel' AND ord>2;
DO $d$ BEGIN PERFORM pg_temp.odv1_judge_order_read(); INSERT INTO t3 VALUES (15,'read raises on a bad table (two panel seats)',false,'no raise');
EXCEPTION WHEN OTHERS THEN INSERT INTO t3 VALUES (15,'read raises on a bad table (two panel seats)', SQLERRM LIKE 'JUDGE ORDER: the order table could not be read (the panel list holds 2 seat(s)%); no call was made', SQLERRM); END $d$;
SELECT k,id,ok,left(got,220) got FROM t3 ORDER BY k;