# ASK 601 (W4): generate the DB write (fix601_db.sql) and the DB test (t_db_601.sql) from one list of exact-text edits.
import json
N="replace(regexp_replace(lower(btrim(%s)),'^anthropic/',''),'.','-')"
JL=('public.dash_judge_lineup(text,text,jsonb,text[])','caea9e6cf4b09b2d23fa9311672182c0',[
 (" dmc text[]; mfam text[];\n", " dmc text[]; mfam text[]; dm text[];  -- ASK 601: debaters' models\n"),
 ("  FOREACH s IN ARRAY ord0 LOOP\n", "  dm := ARRAY(SELECT "+(N%"m.api_model")+" FROM unnest(deb) x JOIN model_config_jfl m ON m.active AND m.seat = CASE x WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE x END);  -- ASK 601, as Init Seats\n  FOREACH s IN ARRAY ord0 LOOP\n"),
 ("    ELSE pfree0 := pfree0 || s; END IF;\n", "    ELSIF EXISTS (SELECT 1 FROM model_config_jfl m WHERE m.active AND m.seat = s AND m.api_model IS NOT NULL AND "+(N%"m.api_model")+" = ANY (dm)) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'runs the same model as a debater ('||(SELECT m.api_model FROM model_config_jfl m WHERE m.active AND m.seat = s LIMIT 1)||')'); END IF;  -- ASK 601\n    ELSE pfree0 := pfree0 || s; END IF;\n")])
PA=('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)','39d84307b0db052e1ddeddfe400638b2',[
 (" v_deb_f text[]; v_pan_m text[];\n", " v_deb_f text[]; v_pan_m text[]; v_deb_m text[];\n"),
 ("  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);\n",
  "  SELECT array_agg("+(N%"mc.api_model")+") INTO v_deb_m FROM unnest(ARRAY[r.defender_engine, r.challenger_engine]) AS e(eng)\n    JOIN model_config mc ON mc.seat = CASE e.eng WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE e.eng END;  -- ASK 601: debaters' models\n  SELECT array_agg(mc.api_model) INTO v_pan_m FROM model_config mc WHERE mc.seat = ANY (r.panel_expected);\n"),
 ("    IF v_am IS NOT DISTINCT FROM v_rmm THEN", "    IF "+(N%"v_am")+" = ANY (coalesce(v_deb_m, ARRAY[]::text[])) THEN RAISE EXCEPTION 'odv1_record_panel_alternates: G-SAME: % is the model of a debater in this debate (ASK 601)', v_am; END IF;\n    IF v_am IS NOT DISTINCT FROM v_rmm THEN")])
def q(s): return "$q$"+s+"$q$"
def block(fn,h,eds,target):
    a=",".join(q(x[0]) for x in eds); b=",".join(q(x[1]) for x in eds)
    return f"""DO $d$
DECLARE f text := pg_get_functiondef('{fn}'::regprocedure);
  a text[] := ARRAY[{a}]; b text[] := ARRAY[{b}]; i int;
BEGIN
  IF md5(f) <> '{h}' THEN RAISE EXCEPTION '{fn} is not the expected text (md5 {h[:8]}); nothing changed'; END IF;
  FOR i IN 1..cardinality(a) LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  {target}
  EXECUTE f;
END $d$;
"""
def tmp(name,newname,keep_tables=False):
    s=f"f := replace(f, 'FUNCTION {name}(', 'FUNCTION pg_temp.{newname}(');"
    if keep_tables: s+=" f := replace(replace(replace(f,'FROM debate_results WHERE','FROM pg_temp.dr WHERE'),'UPDATE debate_results SET','UPDATE pg_temp.dr SET'),'FROM debate_judgments WHERE','FROM pg_temp.dj WHERE');"
    return s
open('fix601_db.sql','w').write("-- ASK 601 DB write (W4): G-SAME in odv1_record_panel_alternates and the same-model filter in dash_judge_lineup. md5-gated exact replaces.\n"+block(*PA,"")+block(*JL,""))
live_pa=PA[2]; 
test="-- ASK 601 DB test (W4): pg_temp copies only; temp tables stand in for debate_results and debate_judgments; nothing public is written.\n"
test+="CREATE TEMP TABLE dr AS SELECT id, panel_expected, defender_engine, challenger_engine, NULL::jsonb drv_removed FROM debate_results WHERE run_token IN ('ODV1-42071-uclot7fi','ODV1-42234-501p8uuq');\nCREATE TEMP TABLE dj (debate_id uuid);\n"
test+=block(PA[0],PA[1],PA[2],tmp('public.odv1_record_panel_alternates','pa_new',True))
test+=block(PA[0],PA[1],[],tmp('public.odv1_record_panel_alternates','pa_old',True)).replace("FOR i IN 1..cardinality(a) LOOP","FOR i IN 1..coalesce(cardinality(a),0) LOOP").replace("ARRAY[]; b text[] := ARRAY[]","'{}'; b text[] := '{}'")
test+=block(JL[0],JL[1],JL[2],tmp('public.dash_judge_lineup','jl_new'))
open('t_db_601_head.sql','w').write(test)
print('ok')
