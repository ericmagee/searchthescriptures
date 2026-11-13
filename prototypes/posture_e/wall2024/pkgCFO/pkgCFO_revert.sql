-- pkgCFO revert: remove the three inserted pieces from derive_debate_outcome, then drop cfo_sides.
BEGIN;
DO $do$
DECLARE d text := pg_get_functiondef('public.derive_debate_outcome'::regproc);
BEGIN
 d := regexp_replace(d, E'  -- pkgCFO: debates created at or after this time[^\n]*\n  v_cfo_from constant timestamptz := ''[^'']*'';\n  v_cfo text\\[\\];\n', '');
 d := regexp_replace(d, E'  -- pkgCFO \\(ASK 167, ASK 178\\).*?    END IF;\n  END IF;\n\n', '');
 d := replace(d, E'    ''close_forfeit'',              v_cfo,\n', '');
 IF md5(d) <> 'f9f1c6127c02223a00b931a4c05d49a0' THEN RAISE EXCEPTION 'pkgCFO revert: result is not the base (md5 %)', md5(d); END IF;
 EXECUTE d;
END $do$;
DROP FUNCTION IF EXISTS public.cfo_sides(uuid);
COMMIT;
