-- pkgMIM2 (W3 2889 item 2, for pkgMIM e44806c; Eric 10:34 CST 11-07 "yes ... add mimo"): odv1_record_panel_alternates refuses mimo, the second
-- alternate pkgMIM seats, because mimo's model_config row is provider 'xiaomi' (its debate calls go to api.xiaomimimo.com). That is the same
-- refusal grok hit in 33249 before pkgGRA2. As an alternate mimo is served by the openrouter Alternate Call with its row's api_model
-- 'xiaomi/mimo-v2.6-pro', an openrouter slug (Accept Build already sends that body through openrouter).
-- Fix: the seat guard also accepts a xiaomi row whose api_model is the openrouter xiaomi/ slug. G1, G2, G3, MiniMax and the model match stand.
-- Anchored replaces, each asserted once, on the live definition (md5 f7340949dc46a5af1262625578755fde = live after g1 pkgGRA2). Revert: revert_MIM2.sql.
DO $do$
DECLARE d text; n int;
 a1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 b1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%') OR (mc.provider = 'xiaomi' AND mc.api_model LIKE 'xiaomi/%')); -- pkgGRA2: grok through openrouter; pkgMIM2: mimo through openrouter$a$;
 a2 text := $a$(provider openrouter, or xai with an x-ai/ model), with a family$a$;
 b2 text := $a$(provider openrouter, or xai with an x-ai/ model, or xiaomi with a xiaomi/ model), with a family$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF d IS NULL THEN RAISE EXCEPTION 'pkgMIM2: function not found'; END IF;
 IF md5(d) <> 'f7340949dc46a5af1262625578755fde' THEN RAISE EXCEPTION 'pkgMIM2: live definition md5 % is not the graded base', md5(d); END IF;
 n := (length(d)-length(replace(d,a1,'')))/length(a1); IF n<>1 THEN RAISE EXCEPTION 'pkgMIM2: anchor 1 found % times', n; END IF;
 n := (length(d)-length(replace(d,a2,'')))/length(a2); IF n<>1 THEN RAISE EXCEPTION 'pkgMIM2: anchor 2 found % times', n; END IF;
 EXECUTE replace(replace(d,a1,b1),a2,b2);
END $do$;
