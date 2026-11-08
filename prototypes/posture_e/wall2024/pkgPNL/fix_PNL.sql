-- pkgPNL database half (W2; Eric 18:45 CST 11-07: qwen/qwen3.8-flash replaces sol on the panel; alternates z-ai/glm-5.3-flash, mimo, grok).
-- Write order: pkgMIM2 (../pkgMIM2/fix_MIM2.sql, graded PASS, not yet live) and this file BEFORE the pkgPNL n8n nodes. Without MIM2 the first
-- run that seats mimo as an alternate errors at Record Alternates; without part 2 a reserve substitution naming qwen_flash or glm_flash errors.
-- Part 1: two new model_config seats, kept apart from the old qwen (qwen3.8-max-0902) and glm (glm-5.3) rows, as W3 asked. Provider openrouter
--         and role engine, so odv1_record_panel_alternates already accepts glm_flash. max_tokens 64000 (standing "set all to 64k").
--         Both ids answered HTTP 200 on the engine's OpenRouter credential (W4, Wall 3011; glm with provider order z-ai, as the call nodes send it).
--         The sol row is left as it is: no node names sol after pkgPNL, so it is never seated.
-- Part 2: odv1_record_panel_substitution's seat list gains qwen_flash and glm_flash (anchored replace, asserted once, on live md5 06081e8a...).
-- Revert: revert_PNL.sql.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $do$
BEGIN
 IF EXISTS (SELECT 1 FROM model_config WHERE seat IN ('qwen_flash','glm_flash')) THEN RAISE EXCEPTION 'pkgPNL: a qwen_flash or glm_flash row already exists'; END IF;
END $do$;
INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, notes, family, updated_at) VALUES
 ('qwen_flash','openrouter','engine','qwen/qwen3.8-flash','https://openrouter.ai/api/v1/chat/completions',64000,'qwen/qwen3.8-flash',false,true,
  'pkgPNL (W2, session_01H1X3AMSmHoLYeowLik4uwT) on the operator''s instruction 2026-11-07 18:45 CST (W3 thread): "replace 6.1 sol with qwen/qwen3.8-flash". Panel judge in place of sol (Init Seats ORDER0). A new seat, apart from the qwen row (qwen3.8-max-0902), so old enforcer_log rows of seat qwen do not mix with this model. Probe: HTTP 200 on the engine''s OpenRouter credential, provider Alibaba (W4, Wall 3011). max_tokens 64000 per "set all to 64k". Undo: DELETE FROM model_config WHERE seat = ''qwen_flash''.',
  'qwen', now()),
 ('glm_flash','openrouter','engine','z-ai/glm-5.3-flash','https://openrouter.ai/api/v1/chat/completions',64000,'z-ai/glm-5.3-flash',false,true,
  'pkgPNL (W2, session_01H1X3AMSmHoLYeowLik4uwT) on the operator''s instruction 2026-11-07 18:45 CST (W3 thread): "replace grok with z-ai/glm-5.3-flash as the first alternate". First alternate and the panel reserve (Init Seats ORDER0). A new seat, apart from the glm row (glm-5.3, removed as a judge 2026-11-06), so old rows of seat glm do not mix with this model. Probe: HTTP 200 with provider order z-ai, provider Z.AI (W4, Wall 3011). max_tokens 64000 per "set all to 64k". Undo: DELETE FROM model_config WHERE seat = ''glm_flash''.',
  'zhipu', now());
DO $do$
DECLARE d text; n int;
 a1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol'];$a$;
 b1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol','qwen_flash','glm_flash']; -- pkgPNL$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF d IS NULL THEN RAISE EXCEPTION 'pkgPNL: function not found'; END IF;
 IF md5(d) <> '06081e8a693ae1c95fea1f84d614d8ea' THEN RAISE EXCEPTION 'pkgPNL: live definition md5 % is not the graded base', md5(d); END IF;
 n := (length(d)-length(replace(d,a1,'')))/length(a1); IF n<>1 THEN RAISE EXCEPTION 'pkgPNL: anchor found % times', n; END IF;
 EXECUTE replace(d,a1,b1);
END $do$;
SELECT seat, provider, api_model, max_tokens, family, active FROM model_config WHERE seat IN ('qwen_flash','glm_flash','sol','mimo','grok') ORDER BY seat;
SELECT md5(pg_get_functiondef(oid)) AS substitution_md5_after FROM pg_proc WHERE proname='odv1_record_panel_substitution';
COMMIT;
