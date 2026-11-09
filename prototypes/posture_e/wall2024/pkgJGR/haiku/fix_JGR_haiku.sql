-- pkgJGR rev 6 DB part (W2, 11-09). One DO block, all or nothing, guarded on the live md5s. Run at a gap. Replaces fix_JGR_luna.sql.
-- 1. odv1_record_panel_substitution: gemini and grok leave the seat list; luna and haiku join it (ef13ee23 -> 8bdd4702).
-- 2. odv1_record_panel_alternates: refuses gemini and grok as an alternate; G1 (family) exempts seat haiku (operator 08:31Z and 08:34Z 11-09:
--    Haiku as the alternate for now, "given it's Claude vs Claude there's no risk of bias") (2967885d -> bd6e6f7e).
-- 3. model_config: row luna (openai/gpt-6-luna; the operator 08:13Z "okay.. luna 6 for now"). Row haiku exists (anthropic/claude-haiku-5.5, active).
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $jgr$
DECLARE d text;
 so text := $a$ARRAY['deepseek','gemini','grok','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL$a$;
 sn text := $a$ARRAY['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna','haiku']; -- pkgJGR: gemini and grok judge no more (operator 21:10Z 11-08); luna added (operator 07:27Z 11-09); haiku added (operator 08:34Z 11-09); pkgPNL$a$;
 ao text := 'WHERE mc.seat = v_alt AND mc.active';
 an text := $a$WHERE mc.seat = v_alt AND v_alt NOT IN ('gemini','grok') /* pkgJGR: gemini and grok judge no more (operator 21:10Z 11-08) */ AND mc.active$a$;
 go text := 'IF v_af = ANY (v_deb_f) THEN';
 gn text := $a$IF v_af = ANY (v_deb_f) AND v_alt <> 'haiku' /* pkgJGR rev 6: haiku exempt from G1 (operator 08:34Z 11-09) */ THEN$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'ef13ee2352254756df48526d7a344336' THEN RAISE EXCEPTION 'pkgJGR: substitution is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d)-length(replace(d,so,'')))/length(so) <> 1 THEN RAISE EXCEPTION 'pkgJGR: substitution anchor not found exactly once'; END IF;
 EXECUTE replace(d,so,sn);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> '8bdd47020bc6f6dc2d95cb87c4ea10b3' THEN RAISE EXCEPTION 'pkgJGR: substitution md5 after write is %', md5(d); END IF;
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> '2967885d5e43685982f7187e4a6c477f' THEN RAISE EXCEPTION 'pkgJGR: alternates is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d)-length(replace(d,ao,'')))/length(ao) <> 1 OR (length(d)-length(replace(d,go,'')))/length(go) <> 1 THEN RAISE EXCEPTION 'pkgJGR: alternates anchors not found exactly once'; END IF;
 EXECUTE replace(replace(d,ao,an),go,gn);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF md5(d) <> 'bd6e6f7e701c6aa1d2ba353ab6eed817' THEN RAISE EXCEPTION 'pkgJGR: alternates md5 after write is %', md5(d); END IF;
INSERT INTO model_config (seat,provider,role,api_model,endpoint,max_tokens,recommended_model,needs_upgrade,active,notes,family) VALUES ('luna','openrouter','engine','openai/gpt-6-luna','https://openrouter.ai/api/v1/chat/completions',64000,'openai/gpt-6-luna',false,true,'pkgJGR rev 4 (built by W2, session_01H1X3AMSmHoLYeowLik4uwT) on the operator''s instruction 2026-11-09 01:27 CST: "add luna 6.1 as a judge". OpenRouter lists no GPT-6.1 Luna (openrouter.ai/openai read 2026-11-09); id openai/gpt-6-luna (GPT-6 Luna, 2026-09-22, 0.10/0.50 USD per million). Judges only when a panel seat debates (Init Seats ORDER0 fourth, never the reserve). No reasoning field sent, as terra and sol. max_tokens 64000 per "set all to 64k". Undo: DELETE FROM model_config WHERE seat = ''luna''.','openai');
 PERFORM log_audit_event('pkgJGR','rev 6: substitution seat list without gemini and grok, with luna and haiku (ef13ee23 -> 8bdd4702); alternates refuse gemini and grok, G1 exempts haiku (2967885d -> bd6e6f7e); model_config row luna','W2',current_date);
END $jgr$;
