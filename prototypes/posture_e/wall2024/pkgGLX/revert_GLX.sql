-- pkgGLX revert: substitution seat list back to fcca52b1 (with glm_flash), glm_flash active again.
SET LOCAL truth.session_id = 'session_01H1X3AMSmHoLYeowLik4uwT';
DO $glx$
DECLARE d text;
 o text := $a$,'qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08)$a$;
 nw text := $a$,'qwen_flash','glm_flash']; -- pkgPNL$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'd74774822595a35c422fa260c0d0ac00' THEN RAISE EXCEPTION 'pkgGLX revert: substitution is not the pkgGLX version (md5 %)', md5(d); END IF;
 EXECUTE replace(d,o,nw);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 IF md5(d) <> 'fcca52b10a6cb3eadd80208e48f0250f' THEN RAISE EXCEPTION 'pkgGLX revert: md5 after is %', md5(d); END IF;
 UPDATE model_config SET active = true, updated_at = now() WHERE seat = 'glm_flash' AND NOT active;
END $glx$;
