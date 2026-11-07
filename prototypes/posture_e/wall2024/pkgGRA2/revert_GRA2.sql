-- pkgGRA2 revert: the reverse anchored replaces, each asserted once, back to the live base (md5 a3f6ab00dd33d323b084ffd89fa13b0f, checked after).
DO $do$
DECLARE d text; n int;
 a1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.provider = 'openrouter' AND mc.role = 'engine';$a$;
 b1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.role = 'engine' AND (mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 a2 text := $a$is not an active openrouter reserve seat with a family$a$;
 b2 text := $a$is not an active reserve seat the openrouter alternate call serves (provider openrouter, or xai with an x-ai/ model), with a family$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 n := (length(d)-length(replace(d,b1,'')))/length(b1); IF n<>1 THEN RAISE EXCEPTION 'pkgGRA2 revert: fixed anchor 1 found % times', n; END IF;
 n := (length(d)-length(replace(d,b2,'')))/length(b2); IF n<>1 THEN RAISE EXCEPTION 'pkgGRA2 revert: fixed anchor 2 found % times', n; END IF;
 d := replace(replace(d,b1,a1),b2,a2);
 IF md5(d) <> 'a3f6ab00dd33d323b084ffd89fa13b0f' THEN RAISE EXCEPTION 'pkgGRA2 revert: result md5 % is not the base', md5(d); END IF;
 EXECUTE d;
END $do$;
