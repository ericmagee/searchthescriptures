-- pkgGLX (W2, 2026-11-08 CST; Wall 3061, operator order 01:32 CST "remove GLM flash"). One DO block, all or nothing. Run at a gap, not during a run.
-- 1. model_config seat glm_flash (z-ai/glm-5.3-flash): active true -> false. Fetch Models and Accept Models read model_config_jfl with active=eq.true,
--    and odv1_record_panel_alternates accepts only an ACTIVE row, so this takes glm_flash out of the panel, reserve and alternate pools.
-- 2. odv1_record_panel_substitution: 'glm_flash' leaves its seat list (anchored replace, asserted once, on live md5 fcca52b1...).
-- Not touched: the old seat glm (z-ai/glm-5.3); qwen_flash (on probation, Wall 3061 item 2). Live n8n s54 names glm_flash nowhere (checked).
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $glx$
DECLARE d text; n int;
 o text := $a$,'qwen_flash','glm_flash']; -- pkgPNL$a$;
 nw text := $a$,'qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08)$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'fcca52b10a6cb3eadd80208e48f0250f' THEN RAISE EXCEPTION 'pkgGLX: odv1_record_panel_substitution is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d)-length(replace(d,o,'')))/length(o) <> 1 THEN RAISE EXCEPTION 'pkgGLX: anchor not found exactly once'; END IF;
 EXECUTE replace(d,o,nw);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'd74774822595a35c422fa260c0d0ac00' THEN RAISE EXCEPTION 'pkgGLX: substitution md5 after write is %, expected d7477482...', md5(d); END IF;
 UPDATE model_config SET active = false, updated_at = now(),
   notes = coalesce(notes,'') || ' | pkgGLX 2026-11-08: inactive, removed from panel, reserve, alternate and substitution lists (Wall 3061, 01:32 CST order).'
  WHERE seat = 'glm_flash' AND active;
 GET DIAGNOSTICS n = ROW_COUNT;
 IF n <> 1 THEN RAISE EXCEPTION 'pkgGLX: expected 1 active glm_flash row, updated %', n; END IF;
 PERFORM log_audit_event('pkgGLX','model_config glm_flash inactive; odv1_record_panel_substitution seat list without glm_flash (fcca52b1 -> d7477482)','W2',current_date);
END $glx$;
SELECT seat, api_model, active FROM model_config WHERE seat IN ('glm_flash','glm','qwen_flash') ORDER BY seat;
