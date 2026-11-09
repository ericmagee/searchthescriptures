-- pkgJGR rev 4 (luna) revert: also deletes the luna model_config row. puts both functions back to the s67 bases (substitution ef13ee23, alternates 2967885d). Run only after pkgJGR (md5 guards).
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $jgrr$
DECLARE d text;
 so text := $a$ARRAY['deepseek','gemini','grok','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL$a$;
 sn text := $a$ARRAY['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna']; -- pkgJGR: gemini and grok judge no more (Eric 21:10Z 11-08); luna added (Eric 07:27Z 11-09); pkgPNL$a$;
 ao text := 'WHERE mc.seat = v_alt AND mc.active';
 an text := $a$WHERE mc.seat = v_alt AND v_alt NOT IN ('gemini','grok') /* pkgJGR: gemini and grok judge no more (Eric 21:10Z 11-08) */ AND mc.active$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> '0e57f1f4dd2956309f15d26b0e943bc4' THEN RAISE EXCEPTION 'revert_JGR: substitution md5 %', md5(d); END IF;
 EXECUTE replace(d,sn,so);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'ef13ee2352254756df48526d7a344336' THEN RAISE EXCEPTION 'revert_JGR: substitution md5 after %', md5(d); END IF;
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> '4c0ba26e3d8785ac07155e2f2e36a32a' THEN RAISE EXCEPTION 'revert_JGR: alternates md5 %', md5(d); END IF;
 EXECUTE replace(d,an,ao);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> '2967885d5e43685982f7187e4a6c477f' THEN RAISE EXCEPTION 'revert_JGR: alternates md5 after %', md5(d); END IF;
 DELETE FROM model_config WHERE seat = 'luna';
END $jgrr$;
