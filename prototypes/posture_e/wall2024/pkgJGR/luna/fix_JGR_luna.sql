-- pkgJGR DB part (W2, 11-08; Eric 21:10Z "remove gemini and grok judges"). One DO block, all or nothing, guarded on the live md5s. Run at a gap.
-- 1. odv1_record_panel_substitution: 'gemini' and 'grok' leave the seat list (ef13ee23 -> df56563d).
-- 2. odv1_record_panel_alternates: refuses gemini and grok as an alternate (2967885d -> 4c0ba26e). Their model_config rows stay ACTIVE,
--    because gemini and grok may still debate, so the active-row test alone would accept them.
-- rev 4 (luna): the substitution seat list also gains 'luna' (ef13ee23 -> 0e57f1f4), and model_config gains the luna row (OpenRouter openai/gpt-6-luna).
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $jgr$
DECLARE d text;
 so text := $a$ARRAY['deepseek','gemini','grok','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL$a$;
 sn text := $a$ARRAY['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna']; -- pkgJGR: gemini and grok judge no more (Eric 21:10Z 11-08); luna added (Eric 07:27Z 11-09); pkgPNL$a$;
 ao text := 'WHERE mc.seat = v_alt AND mc.active';
 an text := $a$WHERE mc.seat = v_alt AND v_alt NOT IN ('gemini','grok') /* pkgJGR: gemini and grok judge no more (Eric 21:10Z 11-08) */ AND mc.active$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'ef13ee2352254756df48526d7a344336' THEN RAISE EXCEPTION 'pkgJGR: substitution is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d)-length(replace(d,so,'')))/length(so) <> 1 THEN RAISE EXCEPTION 'pkgJGR: substitution anchor not found exactly once'; END IF;
 EXECUTE replace(d,so,sn);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> '0e57f1f4dd2956309f15d26b0e943bc4' THEN RAISE EXCEPTION 'pkgJGR: substitution md5 after write is %', md5(d); END IF;
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> '2967885d5e43685982f7187e4a6c477f' THEN RAISE EXCEPTION 'pkgJGR: alternates is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d)-length(replace(d,ao,'')))/length(ao) <> 1 THEN RAISE EXCEPTION 'pkgJGR: alternates anchor not found exactly once'; END IF;
 EXECUTE replace(d,ao,an);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> '4c0ba26e3d8785ac07155e2f2e36a32a' THEN RAISE EXCEPTION 'pkgJGR: alternates md5 after write is %', md5(d); END IF;
 INSERT INTO model_config (seat,provider,role,api_model,endpoint,max_tokens,recommended_model,needs_upgrade,active,notes,family) VALUES ('luna','openrouter','engine','openai/gpt-6-luna','https://openrouter.ai/api/v1/chat/completions',64000,'openai/gpt-6-luna',false,true,'pkgJGR rev 4 (built by W2, session_01H1X3AMSmHoLYeowLik4uwT) on the operator''s instruction 2026-11-09 01:27 CST: "add luna 6.1 as a judge". OpenRouter lists no GPT-6.1 Luna (openrouter.ai/openai read 2026-11-09); id openai/gpt-6-luna (GPT-6 Luna, 2026-09-22, 0.10/0.50 USD per million). Judges only when a panel seat debates (Init Seats ORDER0 fourth, never the reserve). No reasoning field sent, as terra and sol. max_tokens 64000 per "set all to 64k". Undo: DELETE FROM model_config WHERE seat = ''luna''.','openai');
 PERFORM log_audit_event('pkgJGR','gemini and grok judge no more: substitution seat list without them, with luna (ef13ee23 -> 0e57f1f4); model_config row luna; alternates refuse them (2967885d -> 4c0ba26e)','W2',current_date);
END $jgr$;
