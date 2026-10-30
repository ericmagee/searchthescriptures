-- S4 harness (BB-8530/8532, shape 8533). Runs P inside a transaction that RAISEs at the end: nothing persists.
-- Cases are run under the OLD text, then P is applied (EXECUTE) and the same rows are derived under the NEW text.
-- Stored rows 27088, 29912, 29955 (and 29975 if it has a row) are derived under the new text, read only in effect (rolled back).
DO $h$
DECLARE
  d text; nd text; a1 text; r1 text; a2 text; r2 text; k1 int; k2 int;
  c record; did uuid; i int; res text := ''; ids uuid[] := '{}'; olds text[] := '{}'; names text[] := '{}'; exps text[] := '{}';
  o text; fails int := 0; sid uuid; stok text;
BEGIN
  d := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  IF md5(d) <> 'c69444dbba3e0d8be2611731c3639a0e' THEN RAISE EXCEPTION 'S4 HARNESS: live md5 % is not c69444db', md5(d); END IF;
  a1 := E'  v_tie_from constant timestamptz := ''2026-10-14 01:45:00+00'';\n';
  r1 := a1 || E'  -- Tie option 1 (ruling 304, BB-8529): a debate created at or after this time resolves an exact tie of counted HELD seats to UNDERDETERMINED.\n  v_tie_ge_from constant timestamptz := ''2026-10-30 23:00:41+00'';\n';
  a2 := E'    IF v_hu * 2 > v_h THEN\n';
  r2 := E'    IF v_hu * 2 > v_h OR (v_created >= v_tie_ge_from AND v_h > 0 AND v_hu * 2 = v_h) THEN\n';
  k1 := (length(d) - length(replace(d, a1, ''))) / length(a1);
  k2 := (length(d) - length(replace(d, a2, ''))) / length(a2);
  IF k1 <> 1 OR k2 <> 1 THEN RAISE EXCEPTION 'S4 HARNESS: anchor counts % and %, each must be 1', k1, k2; END IF;
  nd := replace(replace(d, a1, r1), a2, r2);
  res := res || format('md5 old %s new %s; ', md5(d), md5(nd));

  FOR c IN SELECT * FROM (VALUES
    ('2 seats 1W/1U after',   '2026-10-30 23:30:00+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','UNDERDETERMINED'],                   ARRAY[0,0],   'UNDERDETERMINED'),
    ('2 seats 2W after',      '2026-10-30 23:30:00+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','DEFENDER WINS'],                     ARRAY[0,0],   'DEFENDER PREVAILS'),
    ('3 seats 1W/2U after',   '2026-10-30 23:30:00+00'::timestamptz, ARRAY['deepseek','gemini','glm'], ARRAY['DEFENDER WINS','UNDERDETERMINED','UNDERDETERMINED'], ARRAY[0,0,0], 'UNDERDETERMINED'),
    ('3 seats 2W/1U after',   '2026-10-30 23:30:00+00'::timestamptz, ARRAY['deepseek','gemini','glm'], ARRAY['DEFENDER WINS','DEFENDER WINS','UNDERDETERMINED'],   ARRAY[0,0,0], 'DEFENDER PREVAILS'),
    ('v_h 0 (all drv) after', '2026-10-30 23:30:00+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','UNDERDETERMINED'],                   ARRAY[1,1],   'SAME AS OLD'),
    ('1W/1U before constant', '2026-10-30 22:00:00+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','UNDERDETERMINED'],                   ARRAY[0,0],   'DEFENDER PREVAILS'),
    ('1W/1U AT constant',     '2026-10-30 23:00:41+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','UNDERDETERMINED'],                   ARRAY[0,0],   'UNDERDETERMINED'),
    ('1W/1U 1 s before',      '2026-10-30 23:00:40+00'::timestamptz, ARRAY['deepseek','gemini'],       ARRAY['DEFENDER WINS','UNDERDETERMINED'],                   ARRAY[0,0],   'DEFENDER PREVAILS')
  ) v(name, ca, seats, results, drvs, expect) LOOP
    INSERT INTO debate_results (engine, variant, topic, data_class, panel_expected, created_at)
    VALUES ('s4-harness', 'ODV1', '__S4 SELFTEST tie harness: '||c.name, 'harness', c.seats, c.ca) RETURNING id INTO did;
    FOR i IN 1..cardinality(c.seats) LOOP
      INSERT INTO debate_judgments (id, debate_id, judge_seat, verdict_tag, verdict_raw, defense_standing, challenge_standing,
                                    conceded_links, challenger_conceded_links, drv_uncured, finish_reason)
      VALUES ((SELECT coalesce(max(id), 0) + 1 FROM debate_judgments), did, c.seats[i], 'HELD',
              E'HELD. harness\nRESULT: '||c.results[i]||E' -- harness row\n', 'SELF-SUPPORTED', 'PROP-DEPENDENT', 0, 1, c.drvs[i], 'stop');
    END LOOP;
    ids := ids || did; names := names || c.name; exps := exps || c.expect;
    olds := olds || coalesce(derive_debate_outcome(did)->>'outcome', '<null>');
  END LOOP;

  EXECUTE nd;
  IF md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure)) <> md5(nd) THEN
    RAISE EXCEPTION 'S4 HARNESS: after EXECUTE the live md5 is not md5(nd)';
  END IF;

  FOR i IN 1..cardinality(ids) LOOP
    o := coalesce(derive_debate_outcome(ids[i])->>'outcome', '<null>');
    IF (exps[i] = 'SAME AS OLD' AND o IS DISTINCT FROM olds[i]) OR (exps[i] <> 'SAME AS OLD' AND o IS DISTINCT FROM exps[i]) THEN fails := fails + 1; END IF;
    res := res || format('[%s] old %s new %s expect %s; ', names[i], olds[i], o, exps[i]);
  END LOOP;

  FOR sid, stok IN SELECT id, run_token FROM debate_results
      WHERE run_token LIKE 'ODV1-27088-%' OR run_token LIKE 'ODV1-29912-%' OR run_token LIKE 'ODV1-29955-%' OR run_token LIKE 'ODV1-29975-%'
      ORDER BY created_at LOOP
    SELECT outcome INTO o FROM debate_results WHERE id = sid;
    res := res || format('[stored %s] stored %s new-text %s; ', stok, o, coalesce(derive_debate_outcome(sid)->>'outcome', '<null>'));
  END LOOP;

  RAISE EXCEPTION 'S4 HARNESS (rolled back): fails %; %', fails, res;
END
$h$;
