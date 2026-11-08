-- pkgPNL revert (database half). Run AFTER the n8n nodes are reverted (a live Init Seats naming the new seats needs these rows).
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DELETE FROM model_config WHERE seat IN ('qwen_flash','glm_flash');
DO $do$
DECLARE d text; n int;
 a1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol'];$a$;
 b1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol','qwen_flash','glm_flash']; -- pkgPNL$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 n := (length(d)-length(replace(d,b1,'')))/length(b1); IF n<>1 THEN RAISE EXCEPTION 'pkgPNL revert: patched anchor found % times', n; END IF;
 d := replace(d,b1,a1); IF md5(d) <> '06081e8a693ae1c95fea1f84d614d8ea' THEN RAISE EXCEPTION 'pkgPNL revert: result md5 % is not the base', md5(d); END IF;
 EXECUTE d;
END $do$;
COMMIT;
-- pkgMIM2 has its own revert (../pkgMIM2/revert_MIM2.sql).
