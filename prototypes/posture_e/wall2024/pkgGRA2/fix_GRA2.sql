-- pkgGRA2 (33249 ERROR at Record Alternates): odv1_record_panel_alternates refused grok, the alternate Init Seats now seats (pkgGRA, Eric 00:03Z 11-07),
-- because grok's model_config row is provider 'xai'. That row is true: grok's panel, debate and cure calls go to api.x.ai. As an alternate grok is
-- served by the openrouter Alternate Call with its row's api_model 'x-ai/grok-4.7', which is an openrouter slug (33249: the call returned and grok was seated).
-- Fix: the seat guard also accepts an xai row whose api_model is the openrouter x-ai/ slug. Nothing else changes; G1, G2, G3, MiniMax and the model match stand.
-- Anchored replaces, each asserted once, on the live definition (W3's manual-insert pattern). Revert: revert_GRA2.sql.
DO $do$
DECLARE d text; n int;
 a1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.provider = 'openrouter' AND mc.role = 'engine';$a$;
 b1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.role = 'engine' AND (mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 a2 text := $a$is not an active openrouter reserve seat with a family$a$;
 b2 text := $a$is not an active reserve seat the openrouter alternate call serves (provider openrouter, or xai with an x-ai/ model), with a family$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF d IS NULL THEN RAISE EXCEPTION 'pkgGRA2: function not found'; END IF;
 n := (length(d)-length(replace(d,a1,'')))/length(a1); IF n<>1 THEN RAISE EXCEPTION 'pkgGRA2: anchor 1 found % times', n; END IF;
 n := (length(d)-length(replace(d,a2,'')))/length(a2); IF n<>1 THEN RAISE EXCEPTION 'pkgGRA2: anchor 2 found % times', n; END IF;
 IF md5(d) <> 'a3f6ab00dd33d323b084ffd89fa13b0f' THEN RAISE EXCEPTION 'pkgGRA2: live definition md5 % is not the graded base', md5(d); END IF;
 EXECUTE replace(replace(d,a1,b1),a2,b2);
END $do$;
