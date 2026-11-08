-- pkgGLX2 (W2, 2026-11-08 CST; W3 Wall 3065/3066). The old seat glm (z-ai/glm-5.3), removed from the n8n panel on 2026-11-06, still has an
-- active model_config row and still sits in odv1_record_panel_substitution's seat list. Runs AFTER pkgGLX, at a gap, never during a run.
-- 1. odv1_record_panel_substitution: 'glm' leaves the seat list (on the pkgGLX version d7477482 -> ef13ee23, anchor asserted once, md5 after asserted).
-- 2. model_config seat glm: active true -> false (1 row asserted). odv1_record_panel_alternates accepts only active rows, so it refuses glm after this.
-- Live n8n s54: Init Seats, Resolve Seats and Accept Build give identical output with the glm and glm_flash rows removed from Fetch/Accept Models
-- (33482, 33490, 33497, 33506 saved inputs; run token masked). The glm branches left in Panel/Reserve/Alternate Build and Build Independent Verdict
-- are unreachable once no active row carries the seat.
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $glx2$
DECLARE d text; n int;
 o text := $a$'mimo','glm','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08)$a$;
 nw text := $a$'mimo','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08); pkgGLX2: old glm removed (Wall 3065)$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'd74774822595a35c422fa260c0d0ac00' THEN RAISE EXCEPTION 'pkgGLX2: substitution is not the pkgGLX version (md5 %); write pkgGLX first', md5(d); END IF;
 IF (length(d)-length(replace(d,o,'')))/length(o) <> 1 THEN RAISE EXCEPTION 'pkgGLX2: anchor not found exactly once'; END IF;
 EXECUTE replace(d,o,nw);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'ef13ee2352254756df48526d7a344336' THEN RAISE EXCEPTION 'pkgGLX2: substitution md5 after write is %, expected ef13ee23...', md5(d); END IF;
 UPDATE model_config SET active = false, updated_at = now(),
   notes = coalesce(notes,'') || ' | pkgGLX2 2026-11-08: inactive (removed from the panel 2026-11-06), out of the substitution list (Wall 3065).'
  WHERE seat = 'glm' AND active;
 GET DIAGNOSTICS n = ROW_COUNT;
 IF n <> 1 THEN RAISE EXCEPTION 'pkgGLX2: expected 1 active glm row, updated %', n; END IF;
 PERFORM log_audit_event('pkgGLX2','model_config glm inactive; odv1_record_panel_substitution seat list without glm (d7477482 -> ef13ee23)','W2',current_date);
END $glx2$;
SELECT seat, api_model, active FROM model_config WHERE seat IN ('glm_flash','glm','qwen_flash') ORDER BY seat;
