-- pkgAGK: odv1_record_panel_alternates admits grok as an alternate again (gemini stays barred).
-- Operator 02:50Z 11-11 (20:50 CST 11-10): "let's bring grok back ... alternate order be: grok, argon, haika 5.5".
-- One edit in the seat test. Guarded: refuses unless the live body is the s140 body (md5 968d39e6151ec06e9eeee8f39d8c4286)
-- and the old text occurs exactly once. CREATE OR REPLACE keeps owner, grants, SECURITY DEFINER and search_path.
DO $agk$
DECLARE s text; src text;
  o text := $o$v_alt NOT IN ('gemini','grok') /* pkgJGR: gemini and grok judge no more (operator 21:10Z 11-08) */$o$;
  n text := $n$v_alt <> 'gemini' /* pkgJGR: gemini judges no more (operator 21:10Z 11-08); pkgAGK: grok back (operator 02:50Z 11-11) */$n$;
BEGIN
  SELECT prosrc INTO src FROM pg_proc WHERE oid = 'public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure;
  IF md5(src) <> '968d39e6151ec06e9eeee8f39d8c4286' THEN RAISE EXCEPTION 'pkgAGK: live body md5 % is not the s140 body', md5(src); END IF;
  IF (length(src) - length(replace(src, o, ''))) / length(o) <> 1 THEN RAISE EXCEPTION 'pkgAGK: old seat test not found exactly once'; END IF;
  s := replace(pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure), o, n);
  EXECUTE s;
END $agk$;
