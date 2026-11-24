-- ASK 601 DB write (W4): G-SAME in odv1_record_panel_alternates and the same-model filter in dash_judge_lineup. md5-gated exact replaces.
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
  
  EXECUTE f;
END $d$;
