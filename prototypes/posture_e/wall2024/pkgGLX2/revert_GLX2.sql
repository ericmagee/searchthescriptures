-- pkgGLX2 revert: back to the pkgGLX version (d7477482) and glm active.
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $glx2$
DECLARE d text;
 o text := $a$'mimo','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08); pkgGLX2: old glm removed (Wall 3065)$a$;
 nw text := $a$'mimo','glm','qwen','alt_minimax31','sol','qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08)$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'ef13ee2352254756df48526d7a344336' THEN RAISE EXCEPTION 'pkgGLX2 revert: not the pkgGLX2 version (md5 %)', md5(d); END IF;
 EXECUTE replace(d,o,nw);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'd74774822595a35c422fa260c0d0ac00' THEN RAISE EXCEPTION 'pkgGLX2 revert: md5 after is %', md5(d); END IF;
 UPDATE model_config SET active = true, updated_at = now() WHERE seat = 'glm' AND NOT active;
END $glx2$;
