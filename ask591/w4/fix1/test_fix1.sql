-- ASK 591 fix 1 (W4): the single-judge chain is off (ruling 402); the line-up stops computing and returning a single judge.
-- Changes dash_judge_lineup only, by exact text replacement of its live definition (md5 f704ad29...); refuses if any anchor is not found exactly once.
DO $d$
DECLARE f text := pg_get_functiondef('public.dash_judge_lineup(text,text,jsonb,text[])'::regprocedure);
  a text[] := ARRAY[
    ', the single judge''s "not sonnet".',
    ' alts text[] := ''{}''; sj text;',
    E'  SELECT x INTO sj FROM unnest(free) WITH ORDINALITY u(x,n)\n   WHERE x <> ''sonnet'' AND NOT (x = ANY (TIME_REMOVED)) AND NOT (coalesce(FAM->>x,'''') <> '''' AND (FAM->>x) = ANY (dfam)) ORDER BY n LIMIT 1;\n',
    ' ''alternates'', to_jsonb(alts), ''single_judge'', sj,'];
  b text[] := ARRAY['.', ' alts text[] := ''{}'';', '', ' ''alternates'', to_jsonb(alts),'];
  i int;
BEGIN
  IF md5(f) <> 'f704ad299b4fc5f762f28a6f8561e395' THEN RAISE EXCEPTION 'dash_judge_lineup is not the ASK 591 text; nothing changed'; END IF;
  FOR i IN 1..4 LOOP
    IF (length(f) - length(replace(f, a[i], ''))) / length(a[i]) <> 1 THEN RAISE EXCEPTION 'anchor % not found exactly once; nothing changed', i; END IF;
    f := replace(f, a[i], b[i]);
  END LOOP;
  f := replace(f, 'FUNCTION public.dash_judge_lineup(', 'FUNCTION pg_temp.jl_fix1(');
  EXECUTE f;
END $d$;

WITH d AS (SELECT x FROM unnest(ARRAY['chatgpt','claude','opus','gemini','sol','sol62','grok','mimo','deepseek','qwen','luna','spark','argon','sonnet','qwen4max','glm']) x),
p AS (SELECT a.x a, b.x b FROM d a, d b WHERE a.x<>b.x),
r AS (SELECT a,b, public.dash_judge_lineup(a,b) - 'single_judge' o, pg_temp.jl_fix1(a,b) n FROM p)
SELECT count(*) pairs, count(*) FILTER (WHERE o = n) equal, count(*) FILTER (WHERE n ? 'single_judge') with_sj,
 count(*) FILTER (WHERE n ? 'error') errs, md5(string_agg(n::text, '|' ORDER BY a,b)) h FROM r;
