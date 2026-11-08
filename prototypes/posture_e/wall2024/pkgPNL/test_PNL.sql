-- pkgPNL database test. One DO block that ends in RAISE, so everything rolls back: the two model_config rows are inserted, then pg_temp copies
-- of odv1_record_panel_alternates (with pkgMIM2 applied) and odv1_record_panel_substitution (with pkgPNL part 2), with their run-state
-- refusals and final UPDATEs taken out, run on 33345's real debate row. The pkgPNL panel (chatgpt, gemini, qwen_flash) stands in for
-- r.panel_expected.
DO $t$
DECLARE d text; o text:=''; r jsonb; did uuid := '3767070d-3f3d-4dd4-bbc3-0e4a7c961090';
 PE text := $a$ARRAY['chatgpt','gemini','qwen_flash']::text[]$a$;
 m1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 n1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%') OR (mc.provider = 'xiaomi' AND mc.api_model LIKE 'xiaomi/%')); -- pkgGRA2: grok through openrouter; pkgMIM2: mimo through openrouter$a$;
 s1 text := $a$  IF r.drv_removed IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds alternates; one write per run', p_debate_id; END IF;$a$;
 s2 text := $a$  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;$a$;
 s3 text := $a$  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;$a$;
 a1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol'];$a$;
 b1 text := $a$v_seats constant text[] := ARRAY['deepseek','gemini','grok','chatgpt','mimo','glm','qwen','alt_minimax31','sol','qwen_flash','glm_flash']; -- pkgPNL$a$;
 u1 text := $a$  IF r.panel_substitution IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds a substitution; one per run', p_debate_id; END IF;$a$;
 u2 text := $a$  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_substitution: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;$a$;
 u3 text := $a$  UPDATE debate_results SET panel_expected = v_new, panel_substitution = p_substitution WHERE id = p_debate_id;$a$;
 T text := now()::text;
BEGIN
 INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, notes, family, updated_at) VALUES
  ('qwen_flash','openrouter','engine','qwen/qwen3.8-flash','https://openrouter.ai/api/v1/chat/completions',64000,'qwen/qwen3.8-flash',false,true,'test','qwen',now()),
  ('glm_flash','openrouter','engine','z-ai/glm-5.3-flash','https://openrouter.ai/api/v1/chat/completions',64000,'z-ai/glm-5.3-flash',false,true,'test','zhipu',now());
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 o := o||'alternates live md5 '||md5(d)||E'\n';
 IF position(s1 in d)=0 OR position(s2 in d)=0 OR position(s3 in d)=0 OR position(m1 in d)=0 THEN RAISE EXCEPTION 'alternates strip anchors missing'; END IF;
 d := replace(replace(replace(replace(replace(replace(d,' SECURITY DEFINER',''),s1,''),s2,''),s3,''),'r.panel_expected',PE),m1,n1);
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.pnl_alt(');
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_substitution';
 o := o||'substitution live md5 '||md5(d)||E'\n';
 IF position(u1 in d)=0 OR position(u2 in d)=0 OR position(u3 in d)=0 OR position(a1 in d)=0 THEN RAISE EXCEPTION 'substitution strip anchors missing'; END IF;
 d := replace(replace(replace(replace(replace(d,' SECURITY DEFINER',''),u1,''),u2,''),u3,''),'r.panel_expected',PE);
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_substitution(','CREATE FUNCTION pg_temp.pnl_sub_o(');
 EXECUTE replace(replace(d,a1,b1),'CREATE OR REPLACE FUNCTION public.odv1_record_panel_substitution(','CREATE FUNCTION pg_temp.pnl_sub_n(');
 BEGIN r := pg_temp.pnl_alt(did, $j$[{"removed_seat": "qwen_flash", "alternate_seat": "glm_flash", "alternate_api_model": "z-ai/glm-5.3-flash"}]$j$::jsonb, '[{"seat":"qwen_flash"}]'::jsonb); o := o||'T1 qwen_flash -> glm_flash (first alternate): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T1 qwen_flash -> glm_flash (first alternate): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_alt(did, $j$[{"removed_seat": "qwen_flash", "alternate_seat": "glm_flash", "alternate_api_model": "z-ai/glm-5.3-flash"},{"removed_seat": "gemini", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.6-pro"}]$j$::jsonb, '[{"seat":"qwen_flash"},{"seat":"gemini"}]'::jsonb); o := o||'T2 two alternates glm_flash + mimo (with MIM2): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T2 two alternates glm_flash + mimo (with MIM2): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_alt(did, $j$[{"removed_seat": "gemini", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.7"}]$j$::jsonb, '[{"seat":"gemini"}]'::jsonb); o := o||'T3 gemini -> grok (last alternate): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T3 gemini -> grok (last alternate): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_alt(did, $j$[{"removed_seat": "gemini", "alternate_seat": "qwen_flash", "alternate_api_model": "qwen/qwen3.8-flash"}]$j$::jsonb, '[{"seat":"gemini"}]'::jsonb); o := o||'T4 a seat already on the panel (qwen_flash) refused: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T4 a seat already on the panel (qwen_flash) refused: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_alt(did, $j$[{"removed_seat": "gemini", "alternate_seat": "glm_flash", "alternate_api_model": "z-ai/glm-5.3"}]$j$::jsonb, '[{"seat":"gemini"}]'::jsonb); o := o||'T5 glm_flash with the old glm-5.3 model refused: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T5 glm_flash with the old glm-5.3 model refused: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_sub_o(did, jsonb_build_object('failed_seat','qwen_flash','substitute','glm_flash','failure_kind','timeout','at',T)); o := o||'T6 live substitution qwen_flash -> glm_flash (reserve): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T6 live substitution qwen_flash -> glm_flash (reserve): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_sub_n(did, jsonb_build_object('failed_seat','qwen_flash','substitute','glm_flash','failure_kind','timeout','at',T)); o := o||'T7 fixed substitution qwen_flash -> glm_flash (reserve): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T7 fixed substitution qwen_flash -> glm_flash (reserve): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_sub_n(did, jsonb_build_object('failed_seat','gemini','substitute','glm_flash','failure_kind','error','at',T)); o := o||'T8 fixed substitution gemini -> glm_flash: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T8 fixed substitution gemini -> glm_flash: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.pnl_sub_n(did, jsonb_build_object('failed_seat','gemini','substitute','qwen_flash','failure_kind','error','at',T)); o := o||'T9 fixed substitution to a seat already on the panel refused: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T9 fixed substitution to a seat already on the panel refused: REFUSED '||SQLERRM||E'\n'; END;
 RAISE EXCEPTION 'PNL RESULTS%', E'\n'||o;
END $t$;
