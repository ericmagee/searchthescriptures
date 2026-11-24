CREATE OR REPLACE FUNCTION pg_temp.t591_lineup(p_def text, p_ch text, p_order jsonb DEFAULT NULL, p_moved text[] DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE
  -- Init Seats' constants (engine 489b977b): NOT_PANEL, FAM_PANEL, JUDGE_TIME_REMOVED, the single judge's "not sonnet".
  NOT_PANEL constant text[] := ARRAY['deepseek','qwen'];
  TIME_REMOVED constant text[] := ARRAY['qwen'];
  FAM constant jsonb := '{"chatgpt":"openai","sol":"openai","sol62":"openai","luna":"openai","grok":"xai","gemini":"google","hydrogen":"google","argon":"google","spark":"meta","ember":"meta","ernie":"baidu","sonnet":"anthropic","claude":"anthropic","opus":"anthropic","glm":"zhipu","qwen":"qwen","qwen4max":"qwen","glm_legal":"zhipu","hy4":"tencent","hy4_flash":"tencent"}';
  JFAM_OR constant text[] := ARRAY['gemini','grok','chatgpt','mimo','glm','alt_minimax31','qwen','sol','sol62','luna','argon','hydrogen','spark','ernie','ember','glm_legal','qwen4max','hy4','hy4_flash','sonnet'];
  l jsonb := p_order;
  pan text[]; alt text[]; ord0 text[]; moved text[]; dfam text[]; bothc boolean; deb text[];
  free text[] := '{}'; pfree0 text[] := '{}'; pfree text[]; panel text[]; reserve text; alts text[] := '{}'; sj text;
  dropped jsonb := '{}'::jsonb; s text; f text; dmc text[]; mfam text[];
BEGIN
  pan := ARRAY(SELECT jsonb_array_elements_text(l->'panel')); alt := ARRAY(SELECT jsonb_array_elements_text(l->'alternate'));
  ord0 := pan || alt;
  moved := coalesce(p_moved, ARRAY(SELECT seat FROM model_config_jfl WHERE active AND jfl_move));
  deb := ARRAY[lower(btrim(p_def)), lower(btrim(p_ch))];
  dfam := ARRAY(SELECT FAM->>x FROM unnest(deb) x WHERE FAM ? x);
  bothc := coalesce((FAM->>deb[1]) = 'anthropic' AND (FAM->>deb[2]) = 'anthropic', false);  -- a debater outside FAM (mimo) gives NULL; NULL must read as false
  FOREACH s IN ARRAY ord0 LOOP
    IF s = ANY (deb) THEN dropped := dropped || jsonb_build_object(s, 'is a debater'); ELSE free := free || s; END IF;
  END LOOP;
  FOREACH s IN ARRAY free LOOP
    f := FAM->>s;
    IF s = ANY (NOT_PANEL) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'not a panel seat'); END IF;
    ELSIF f IS NOT NULL AND f = ANY (dfam) AND NOT (f = 'anthropic' AND bothc) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'family '||f||' debates in this debate'); END IF;
    ELSE pfree0 := pfree0 || s; END IF;
  END LOOP;
  pfree := ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE NOT (x = ANY (moved)) AND NOT (x = ANY (alt)) ORDER BY n)
        || ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE (x = ANY (moved)) AND NOT (x = ANY (alt)) ORDER BY n)
        || ARRAY(SELECT x FROM unnest(pfree0) WITH ORDINALITY u(x,n) WHERE x = ANY (alt) ORDER BY n);
  panel := pfree[1:3];
  IF coalesce(cardinality(panel),0) <> 3 THEN
    RETURN jsonb_build_object('error','NOT GRADED: the derived panel is '||coalesce(cardinality(panel),0)||' seat(s); the roster is exactly three', 'dropped', dropped);
  END IF;
  FOREACH s IN ARRAY panel LOOP IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'sits on the panel'); END IF; END LOOP;
  -- Resolve Seats: debaters' families from model_config (claude is seat claude_synthesis).
  dmc := ARRAY(SELECT CASE x WHEN 'claude' THEN 'claude_synthesis' WHEN 'deepseek' THEN 'deepseek_debate' ELSE x END FROM unnest(deb) x);
  mfam := ARRAY(SELECT coalesce(lower(btrim(m.family)),'') FROM unnest(dmc) WITH ORDINALITY u(x,n) LEFT JOIN model_config m ON m.seat = u.x ORDER BY n);  -- as Resolve Seats: no row or no family reads as ''
  IF cardinality(pfree) > 3 AND NOT (pfree[4] = ANY (TIME_REMOVED)) AND NOT (pfree[4] = ANY (moved)) THEN
    reserve := pfree[4];
    IF NOT EXISTS (SELECT 1 FROM model_config m WHERE m.seat = reserve AND m.active AND m.api_model IS NOT NULL AND coalesce(m.max_tokens,0) > 0
                   AND ((coalesce(lower(btrim(m.family)),'') = 'anthropic' AND mfam <@ ARRAY['anthropic']) OR NOT (coalesce(lower(btrim(m.family)),'') = ANY (mfam)))) THEN reserve := NULL; END IF;
  END IF;
  FOREACH s IN ARRAY coalesce(pfree[4:], '{}') LOOP
    IF NOT (s = ANY (JFAM_OR)) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'not an OpenRouter seat'); END IF; CONTINUE; END IF;
    IF s = 'mimo' THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'mimo is never an alternate'); END IF; CONTINUE; END IF;
    IF s = ANY (TIME_REMOVED) THEN IF NOT dropped ? s THEN dropped := dropped || jsonb_build_object(s,'removed for judge time'); END IF; CONTINUE; END IF;
    IF EXISTS (SELECT 1 FROM model_config m WHERE m.seat = s AND m.active AND m.api_model IS NOT NULL AND coalesce(m.max_tokens,0) > 0
               AND ((coalesce(lower(btrim(m.family)),'') = 'anthropic' AND mfam <@ ARRAY['anthropic']) OR NOT (coalesce(lower(btrim(m.family)),'') = ANY (mfam)))) THEN alts := alts || s; END IF;
  END LOOP;
  SELECT x INTO sj FROM unnest(free) WITH ORDINALITY u(x,n)
   WHERE x <> 'sonnet' AND NOT (x = ANY (TIME_REMOVED)) AND NOT (coalesce(FAM->>x,'') <> '' AND (FAM->>x) = ANY (dfam)) ORDER BY n LIMIT 1;
  RETURN jsonb_build_object('panel', to_jsonb(panel), 'reserve', reserve, 'alternates', to_jsonb(alts), 'single_judge', sj,
    'moved', to_jsonb(moved), 'dropped', dropped, 'version', NULL,
    'note', 'As the engine would seat it now. A seat that does not accept the posture at the run''s start is left out then; the page cannot know that before the run.');
END $f$;



WITH o(oi,name,ord) AS (VALUES
 (1,'seeded','{"panel":["chatgpt","sol","sol62"],"alternate":["gemini","spark","qwen4max","argon","sonnet"]}'::jsonb),
 (2,'alt_into_panel','{"panel":["chatgpt","sol","sol62","gemini"],"alternate":["spark","qwen4max","argon","sonnet"]}'),
 (3,'panel_to_alt','{"panel":["chatgpt","sol","spark"],"alternate":["sol62","gemini","qwen4max","argon","sonnet"]}'),
 (4,'reversed','{"panel":["sol62","sol","chatgpt"],"alternate":["sonnet","argon","qwen4max","spark","gemini"]}'),
 (5,'sonnet_first','{"panel":["sonnet","chatgpt","sol","sol62"],"alternate":["gemini","spark","qwen4max","argon"]}')),
k(ki,x) AS (SELECT * FROM unnest(ARRAY['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62']) WITH ORDINALITY u(x,n) ),
k2(ki,x) AS (SELECT n,x FROM unnest(ARRAY['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62']) WITH ORDINALITY u(x,n)),
mv(mi,m) AS (VALUES (1,'{}'::text[]),(2,'{sol}'),(3,'{gemini}'),(4,'{chatgpt,spark}')),
r AS (SELECT o.oi,o.name,d.ki di,c.ki ci,mv.mi,d.x d,c.x c,mv.m,pg_temp.t591_lineup(d.x,c.x,o.ord,mv.m) j
      FROM o, k2 d, k2 c, mv WHERE d.x<>c.x),
l AS (SELECT oi,name,di,ci,mi, name||';'||d||';'||c||';'||array_to_string(m,'+')||';'||
   CASE WHEN j ? 'error' THEN 'E' ELSE
   (SELECT string_agg(v,',' ORDER BY n) FROM jsonb_array_elements_text(j->'panel') WITH ORDINALITY q(v,n))||'|'||coalesce(j->>'reserve','')||'|'||
   coalesce((SELECT string_agg(v,',' ORDER BY n) FROM jsonb_array_elements_text(j->'alternates') WITH ORDINALITY q(v,n)),'')||'|'||coalesce(j->>'single_judge','') END line FROM r)
SELECT name, count(*) n, md5(string_agg(line,E'\n' ORDER BY di,ci,mi)) m FROM l GROUP BY oi,name ORDER BY oi;
