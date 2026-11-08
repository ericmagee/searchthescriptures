-- pkgGLX database test: ONE DO block that ends in RAISE, so everything rolls back. Run only at a gap (no test transactions during a run).
-- Applies fix_GLX's two changes inside the block, then checks: glm_flash refused as alternate and as substitute; qwen_flash, mimo, grok, sol still
-- accepted as alternates; qwen_flash still a substitute; run on 33345's real debate row via pg_temp copies with run-state refusals and final UPDATEs taken out
-- (same method as pkgPNL/test_PNL.sql).
DO $t$
DECLARE d text; o text:=''; r jsonb; did uuid := '3767070d-3f3d-4dd4-bbc3-0e4a7c961090';
 PE text := $a$ARRAY['chatgpt','gemini','qwen_flash']::text[]$a$;
 s1 text := $a$  IF r.drv_removed IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds alternates; one write per run', p_debate_id; END IF;$a$;
 s2 text := $a$  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;$a$;
 s3 text := $a$  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;$a$;
 u1 text := $a$  IF r.panel_substitution IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds a substitution; one per run', p_debate_id; END IF;$a$;
 u2 text := $a$  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;$a$;
 u3 text := $a$  UPDATE debate_results SET panel_expected = v_new, panel_substitution = p_substitution WHERE id = p_debate_id;$a$;
 go text := $a$,'qwen_flash','glm_flash']; -- pkgPNL$a$;
 gn text := $a$,'qwen_flash']; -- pkgPNL; pkgGLX: glm_flash removed (Wall 3061, 01:32 CST 2026-11-08)$a$;
 T text := now()::text;
BEGIN
 -- the fix, as fix_GLX.sql does it
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 o := o||'substitution live md5 '||md5(d)||E'\n';
 EXECUTE replace(d,go,gn);
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 o := o||'substitution after md5 '||md5(d)||' (expected d74774822595a35c422fa260c0d0ac00)'||E'\n';
 UPDATE model_config SET active=false WHERE seat='glm_flash' AND active;
 -- pg_temp copies
 IF position(u1 in d)=0 OR position(u2 in d)=0 OR position(u3 in d)=0 THEN RAISE EXCEPTION 'substitution strip anchors missing'; END IF;
 d := replace(replace(replace(replace(replace(d,' SECURITY DEFINER',''),u1,''),u2,''),u3,''),'r.panel_expected',PE);
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_substitution(','CREATE FUNCTION pg_temp.glx_sub(');
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 IF position(s1 in d)=0 OR position(s2 in d)=0 OR position(s3 in d)=0 THEN RAISE EXCEPTION 'alternates strip anchors missing'; END IF;
 d := replace(replace(replace(replace(replace(d,' SECURITY DEFINER',''),s1,''),s2,''),s3,''),'r.panel_expected',PE);
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.glx_alt(');
 BEGIN r := pg_temp.glx_alt(did, '[{"removed_seat":"gemini","alternate_seat":"glm_flash","alternate_api_model":"z-ai/glm-5.3-flash"}]'::jsonb,'[{"seat":"gemini"}]'::jsonb); o:=o||'T1 alternate glm_flash: ACCEPTED (FAIL) '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T1 alternate glm_flash refused (want refused): '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_alt(did, '[{"removed_seat":"gemini","alternate_seat":"mimo","alternate_api_model":"xiaomi/mimo-v2.6-pro"}]'::jsonb,'[{"seat":"gemini"}]'::jsonb); o:=o||'T2 alternate mimo accepted (want accepted): '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T2 alternate mimo: REFUSED (FAIL) '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_alt(did, '[{"removed_seat":"gemini","alternate_seat":"grok","alternate_api_model":"x-ai/grok-4.7"}]'::jsonb,'[{"seat":"gemini"}]'::jsonb); o:=o||'T3 alternate grok accepted (want accepted): '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T3 alternate grok: REFUSED (FAIL) '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_alt(did, '[{"removed_seat":"gemini","alternate_seat":"sol","alternate_api_model":"openai/gpt-6.1-sol"}]'::jsonb,'[{"seat":"gemini"}]'::jsonb); o:=o||'T4 alternate sol: '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T4 alternate sol: refused '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_sub(did, jsonb_build_object('failed_seat','qwen_flash','substitute','glm_flash','failure_kind','timeout','at',T)); o:=o||'T5 substitute glm_flash: ACCEPTED (FAIL) '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T5 substitute glm_flash refused (want refused): '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_sub(did, jsonb_build_object('failed_seat','qwen_flash','substitute','sol','failure_kind','timeout','at',T)); o:=o||'T6 substitute sol accepted (want accepted): '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T6 substitute sol: REFUSED (FAIL) '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.glx_sub(did, jsonb_build_object('failed_seat','gemini','substitute','grok','failure_kind','error','at',T)); o:=o||'T7 substitute grok accepted (want accepted): '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o:=o||'T7 substitute grok: REFUSED (FAIL) '||SQLERRM||E'\n'; END;
 o := o||'T8 model_config_jfl active rows naming glm_flash: '||(SELECT count(*) FROM model_config_jfl WHERE seat='glm_flash' AND active)::text||' (want 0)'||E'\n';
 RAISE EXCEPTION 'GLX RESULTS%', E'\n'||o;
END $t$;
