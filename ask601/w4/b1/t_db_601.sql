-- ASK 601 DB test (W4): pg_temp copies only; temp tables stand in for debate_results and debate_judgments; nothing public is written.
CREATE TEMP TABLE dr AS SELECT id, panel_expected, defender_engine, challenger_engine, NULL::jsonb drv_removed FROM debate_results WHERE run_token IN ('ODV1-42071-uclot7fi','ODV1-42234-501p8uuq');
CREATE TEMP TABLE dj (debate_id uuid);
DO $d$
DECLARE f text := pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure);
  a text[] := ARRAY[$q$ v_deb_f text[]; v_pan_m text[];
$q$,$q$  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);
$q$,$q$    IF v_am IS NOT DISTINCT FROM v_rmm THEN$q$]; b text[] := ARRAY[$q$ v_deb_f text[]; v_pan_m text[]; v_deb_m text[];
$q$,$q$  SELECT array_agg(replace(regexp_replace(lower(btrim(mc.api_model)),'^anthropic/',''),'.','-')) INTO v_deb_m FROM unnest(ARRAY[r.defender_engine, r.challenger_engine]) AS e(eng)
    JOIN model_config mc ON mc.seat = CASE e.eng WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE e.eng END;  -- ASK 601: debaters' models
  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);
$q$,$q$    IF replace(regexp_replace(lower(btrim(v_am)),'^anthropic/',''),'.','-') = ANY (coalesce(v_deb_m, ARRAY[]::text[])) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G-SAME: % is the model of a debater in this debate (ASK 601)', v_am; END IF;
    IF v_am IS NOT DISTINCT FROM v_rmm THEN$q$]; i int;
BEGIN
  IF md5(f) <> '39d84307b0db052e1ddeddfe400638b2' THEN RAISE EXCEPTION 'public.odv1_record_panel_alternates(uuid,jsonb,jsonb) is not the expected text (md5 39d84307); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  f := replace(f, 'FUNCTION public.odv1_record_panel_alternates(', 'FUNCTION pg_temp.pa_new('); f := replace(replace(replace(f,'FROM debate_results WHERE','FROM pg_temp.dr WHERE'),'UPDATE debate_results SET','UPDATE pg_temp.dr SET'),'FROM debate_judgments WHERE','FROM pg_temp.dj WHERE');
  EXECUTE f;
END $d$;
DO $d$
DECLARE f text := pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure);
  a text[] := '{}'; b text[] := '{}'; i int;
BEGIN
  IF md5(f) <> '39d84307b0db052e1ddeddfe400638b2' THEN RAISE EXCEPTION 'public.odv1_record_panel_alternates(uuid,jsonb,jsonb) is not the expected text (md5 39d84307); nothing changed'; END IF;
  FOR i IN 1..coalesce(cardinality(a),0) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  f := replace(f, 'FUNCTION public.odv1_record_panel_alternates(', 'FUNCTION pg_temp.pa_old('); f := replace(replace(replace(f,'FROM debate_results WHERE','FROM pg_temp.dr WHERE'),'UPDATE debate_results SET','UPDATE pg_temp.dr SET'),'FROM debate_judgments WHERE','FROM pg_temp.dj WHERE');
  EXECUTE f;
END $d$;
DO $d$
DECLARE f text := pg_get_functiondef('public.dash_judge_lineup(text,text,jsonb,text[])'::regprocedure);
  a text[] := ARRAY[$q$ dmc text[]; mfam text[];
$q$,$q$  FOREACH s IN ARRAY ord0 LOOP
$q$,$q$    ELSE pfree0 := pfree0 || s; END IF;
$q$]; b text[] := ARRAY[$q$ dmc text[]; mfam text[]; dm text[];  -- ASK 601: debaters' models
$q$,$q$  dm := ARRAY(SELECT replace(regexp_replace(lower(btrim(m.api_model)),'^anthropic/',''),'.','-') FROM unnest(deb) x JOIN model_config_jfl m ON m.active AND m.seat = CASE x WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE x END);  -- ASK 601, as Init Seats
  FOREACH s IN ARRAY ord0 LOOP
$q$,$q$    ELSIF EXISTS (SELECT 1 FROM model_config_jfl m WHERE m.active AND m.seat = s AND m.api_model IS NOT NULL AND replace(regexp_replace(lower(btrim(m.api_model)),'^anthropic/',''),'.','-') = ANY (dm)) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'runs the same model as a debater ('||(SELECT m.api_model FROM model_config_jfl m WHERE m.active AND m.seat = s LIMIT 1)||')'); END IF;  -- ASK 601
    ELSE pfree0 := pfree0 || s; END IF;
$q$]; i int;
BEGIN
  IF md5(f) <> 'caea9e6cf4b09b2d23fa9311672182c0' THEN RAISE EXCEPTION 'public.dash_judge_lineup(text,text,jsonb,text[]) is not the expected text (md5 caea9e6c); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  f := replace(f, 'FUNCTION public.dash_judge_lineup(', 'FUNCTION pg_temp.jl_new(');
  EXECUTE f;
END $d$;
ALTER TABLE dr ADD COLUMN pe0 text[]; UPDATE dr SET pe0 = panel_expected WHERE true;
CREATE TEMP TABLE res (t text, fn text, result text);
CREATE FUNCTION pg_temp.try_pa(p_fn text, p_run text, p_rm text, p_alt text) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE v_id uuid; v_m text; o jsonb;
BEGIN
  UPDATE pg_temp.dr SET drv_removed = NULL, panel_expected = pe0 WHERE true;
  SELECT d.id INTO v_id FROM pg_temp.dr d JOIN debate_results x ON x.id = d.id WHERE x.run_token = p_run;
  SELECT api_model INTO v_m FROM model_config WHERE seat = p_alt;
  BEGIN
    IF p_fn = 'new' THEN o := pg_temp.pa_new(v_id, jsonb_build_array(jsonb_build_object('removed_seat',p_rm,'alternate_seat',p_alt,'alternate_api_model',v_m)), jsonb_build_array(jsonb_build_object('seat',p_rm)));
    ELSE o := pg_temp.pa_old(v_id, jsonb_build_array(jsonb_build_object('removed_seat',p_rm,'alternate_seat',p_alt,'alternate_api_model',v_m)), jsonb_build_array(jsonb_build_object('seat',p_rm))); END IF;
    RETURN 'WRITTEN';
  EXCEPTION WHEN others THEN RETURN 'RAISED: '||regexp_replace(SQLERRM,'^odv1_record_panel_alternates: ','');
  END;
END $f$;
INSERT INTO res SELECT 'T3 '||c.run||' '||c.rm||'->'||c.alt, f, pg_temp.try_pa(f, c.run, c.rm, c.alt)
  FROM (VALUES ('ODV1-42234-501p8uuq','sol','sonnet'),('ODV1-42234-501p8uuq','sol','chatgpt'),('ODV1-42234-501p8uuq','spark','argon'),
               ('ODV1-42071-uclot7fi','spark','sonnet'),('ODV1-42071-uclot7fi','spark','chatgpt'),('ODV1-42071-uclot7fi','spark','argon')) c(run,rm,alt),
       (VALUES ('old'),('new')) v(f);
-- T2: page copy, live vs new, all 16x15 pairs: differ only where a seat runs a debater's model.
WITH d AS (SELECT x FROM unnest(ARRAY['chatgpt','claude','opus','gemini','sol','sol62','grok','mimo','deepseek','qwen','luna','spark','argon','sonnet','qwen4max','glm']) x),
p AS (SELECT a.x a, b.x b FROM d a, d b WHERE a.x<>b.x),
r AS (SELECT a, b, public.dash_judge_lineup(a,b) o, pg_temp.jl_new(a,b) n FROM p)
INSERT INTO res SELECT 'T2 pairs '||count(*)||', equal '||count(*) FILTER (WHERE o=n)||', differ '||count(*) FILTER (WHERE o<>n), 'page',
  coalesce(string_agg(a||' vs '||b||': dropped '||(n->'dropped'->>'sonnet'), '; ') FILTER (WHERE o<>n),'none') FROM r;
-- T5 (as run, 11-24 ~11:5x CST): page copy (new) on the 90 engine pairs, hashed the same way as t1_601.cjs target output (engine md5 59457aaf675dc2acc87a698fa06aebe8).
WITH d AS (SELECT x FROM unnest(ARRAY['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62']) x),
r AS (SELECT a.x||'|'||b.x k, pg_temp.jl_new(a.x,b.x) n FROM d a, d b WHERE a.x<>b.x)
INSERT INTO res SELECT 'T5 pairs '||count(*), 'page=engine',
  md5(string_agg(k||':'||(SELECT string_agg(v,',' ORDER BY o) FROM jsonb_array_elements_text(n->'panel') WITH ORDINALITY q(v,o))||'/'||coalesce(n->>'reserve','')||'/'||coalesce((SELECT string_agg(v,',' ORDER BY o) FROM jsonb_array_elements_text(n->'alternates') WITH ORDINALITY q(v,o)),''), ';' ORDER BY k COLLATE "C"))||' (engine 59457aaf675dc2acc87a698fa06aebe8)' FROM r;
SELECT * FROM res ORDER BY t, fn;
