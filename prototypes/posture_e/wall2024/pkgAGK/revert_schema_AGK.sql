-- Revert pkgAGK: restores the s140 body of odv1_record_panel_alternates (md5 968d39e6151ec06e9eeee8f39d8c4286).
DO $agk$
DECLARE s text; src text;
  o text := $o$v_alt NOT IN ('gemini','grok') /* pkgJGR: gemini and grok judge no more (operator 21:10Z 11-08) */$o$;
  n text := $n$v_alt <> 'gemini' /* pkgJGR: gemini judges no more (operator 21:10Z 11-08); pkgAGK: grok back (operator 02:50Z 11-11) */$n$;
BEGIN
  SELECT prosrc INTO src FROM pg_proc WHERE oid = 'public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure;
  IF (length(src) - length(replace(src, n, ''))) / length(n) <> 1 THEN RAISE EXCEPTION 'pkgAGK revert: new seat test not found exactly once'; END IF;
  s := replace(pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure), n, o);
  EXECUTE s;
  SELECT prosrc INTO src FROM pg_proc WHERE oid = 'public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure;
  IF md5(src) <> '968d39e6151ec06e9eeee8f39d8c4286' THEN RAISE EXCEPTION 'pkgAGK revert: restored body md5 % is not the s140 body', md5(src); END IF;
END $agk$;
