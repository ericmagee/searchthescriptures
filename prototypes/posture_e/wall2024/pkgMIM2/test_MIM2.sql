-- pkgMIM2 test: pg_temp copies of the live and the fixed function, with the two run-state refusals (alternates already written, judgment rows
-- present) and the final UPDATE taken out, so only the seat guards are tested on 33345's real debate row (defender/challenger families, panel).
-- 33345's panel before its alternate write (chatgpt, gemini, sol) stands in for r.panel_expected, which now names grok. Nothing is written; the closing RAISE rolls the whole block back.
DO $t$
DECLARE d text; o text:=''; r jsonb; did uuid := '3767070d-3f3d-4dd4-bbc3-0e4a7c961090';
 a1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 b1 text := $a$(mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%') OR (mc.provider = 'xiaomi' AND mc.api_model LIKE 'xiaomi/%')); -- pkgGRA2: grok through openrouter; pkgMIM2: mimo through openrouter$a$;
 a2 text := $a$(provider openrouter, or xai with an x-ai/ model), with a family$a$;
 b2 text := $a$(provider openrouter, or xai with an x-ai/ model, or xiaomi with a xiaomi/ model), with a family$a$;
 s1 text := $a$  IF r.drv_removed IS NOT NULL THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds alternates; one write per run', p_debate_id; END IF;$a$;
 s2 text := $a$  IF v_n > 0 THEN RAISE EXCEPTION 'odv1_record_panel_alternates: debate % already holds % judgment row(s); panel_expected is rewritten only before any', p_debate_id, v_n; END IF;$a$;
 s3 text := $a$  UPDATE debate_results SET panel_expected = v_new, drv_removed = p_drv_removed WHERE id = p_debate_id;$a$;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 o := o||'live md5 '||md5(d)||E'\n';
 IF position(s1 in d)=0 OR position(s2 in d)=0 OR position(s3 in d)=0 THEN RAISE EXCEPTION 'strip anchors missing'; END IF;
 d := replace(replace(replace(replace(replace(d,' SECURITY DEFINER',''),s1,''),s2,''),s3,''),'r.panel_expected',$a$ARRAY['chatgpt','gemini','sol']::text[]$a$);
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.mim2_o(');
 EXECUTE replace(replace(replace(d,a1,b1),a2,b2),'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.mim2_n(');
 BEGIN r := pg_temp.mim2_o(did, $j$[{"removed_seat": "sol", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.6-pro"}]$j$::jsonb, '[{"seat":"sol"}]'::jsonb); o := o||'T1 live, 33345: sol -> mimo: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T1 live, 33345: sol -> mimo: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.mim2_n(did, $j$[{"removed_seat": "sol", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.6-pro"}]$j$::jsonb, '[{"seat":"sol"}]'::jsonb); o := o||'T2 fixed, 33345: sol -> mimo: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T2 fixed, 33345: sol -> mimo: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.mim2_n(did, $j$[{"removed_seat": "chatgpt", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.7"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T3 fixed, 33345: chatgpt -> grok (pkgGRA2 still passes): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T3 fixed, 33345: chatgpt -> grok (pkgGRA2 still passes): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.mim2_n(did, $j$[{"removed_seat": "sol", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.5"}]$j$::jsonb, '[{"seat":"sol"}]'::jsonb); o := o||'T4 fixed, mimo with a wrong model refused: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T4 fixed, mimo with a wrong model refused: REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.mim2_n(did, $j$[{"removed_seat": "chatgpt", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.7"},{"removed_seat": "sol", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.6-pro"}]$j$::jsonb, '[{"seat":"chatgpt"},{"seat":"sol"}]'::jsonb); o := o||'T5 fixed, two alternates grok + mimo (33345, the pkgODD case): OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T5 fixed, two alternates grok + mimo (33345, the pkgODD case): REFUSED '||SQLERRM||E'\n'; END;
 BEGIN r := pg_temp.mim2_n(did, $j$[{"removed_seat": "sol", "alternate_seat": "alt_minimax31", "alternate_api_model": "minimax/minimax-m3.1-flash"}]$j$::jsonb, '[{"seat":"sol"}]'::jsonb); o := o||'T6 fixed, minimax still refused: OK '||r::text||E'\n';
 EXCEPTION WHEN OTHERS THEN o := o||'T6 fixed, minimax still refused: REFUSED '||SQLERRM||E'\n'; END;
 RAISE EXCEPTION 'MIM2 RESULTS%', E'\n'||o;
END $t$;
