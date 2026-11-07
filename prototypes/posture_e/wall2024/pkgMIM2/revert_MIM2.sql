-- pkgMIM2 REVERT: the reverse anchored replaces, back to the base (md5 f7340949dc46a5af1262625578755fde, checked after).
DO $do$
DECLARE d text; n int;
 a1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%') OR (mc.provider = 'xiaomi' AND mc.api_model LIKE 'xiaomi/%')); -- pkgGRA2: grok through openrouter; pkgMIM2: mimo through openrouter$a$;
 b1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 a2 text := $a$(provider openrouter, or xai with an x-ai/ model, or xiaomi with a xiaomi/ model), with a family$a$;
 b2 text := $a$(provider openrouter, or xai with an x-ai/ model), with a family$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF d IS NULL THEN RAISE EXCEPTION 'pkgMIM2: function not found'; END IF;
  n := (length(d)-length(replace(d,a1,'')))/length(a1); IF n<>1 THEN RAISE EXCEPTION 'pkgMIM2: anchor 1 found % times', n; END IF;
 n := (length(d)-length(replace(d,a2,'')))/length(a2); IF n<>1 THEN RAISE EXCEPTION 'pkgMIM2: anchor 2 found % times', n; END IF;
 EXECUTE replace(replace(d,a1,b1),a2,b2);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> 'f7340949dc46a5af1262625578755fde' THEN RAISE EXCEPTION 'pkgMIM2 revert: md5 % after revert is not the base', md5(d); END IF;
END $do$;
