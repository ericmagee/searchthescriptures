-- pkgGRA2 test: builds the live and the fixed function as pg_temp copies, calls each on the 33249 Record Alternates body (and controls),
-- (p_drv_removed is cut to seat, api_model and verdict_tag; the function reads only its seat), each call inside a sub-block that is rolled back, then raises the results so the whole transaction is rolled back. Nothing persists.
DO $t$
DECLARE d text; o text:=''; r jsonb;
 a1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.provider = 'openrouter' AND mc.role = 'engine';$a$;
 b1 text := $a$WHERE mc.seat = v_alt AND mc.active AND mc.role = 'engine' AND (mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%')); -- pkgGRA2: grok through openrouter$a$;
 a2 text := $a$is not an active openrouter reserve seat with a family$a$;
 b2 text := $a$is not an active reserve seat the openrouter alternate call serves (provider openrouter, or xai with an x-ai/ model), with a family$a$;
 drv jsonb := $j$[{"seat": "chatgpt", "api_model": "openai/gpt-6.1-terra", "verdict_tag": "HELD"}]$j$::jsonb;
BEGIN
 SELECT pg_get_functiondef(p.oid) INTO d FROM pg_proc p JOIN pg_namespace s ON s.oid=p.pronamespace WHERE s.nspname='public' AND p.proname='odv1_record_panel_alternates';
 o := o||'live md5 '||md5(d)||E'\n';
 d := replace(d,' SECURITY DEFINER','');
 EXECUTE replace(d,'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.gra2_o(');
 EXECUTE replace(replace(replace(d,a1,b1),a2,b2),'CREATE OR REPLACE FUNCTION public.odv1_record_panel_alternates(','CREATE FUNCTION pg_temp.gra2_n(');
 BEGIN r := pg_temp.gra2_o('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.7"}]$j$::jsonb, drv); o := o||'T1 live function, 33249 body: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T1 live function, 33249 body: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.7"}]$j$::jsonb, drv); o := o||'T2 fixed function, 33249 body: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T2 fixed function, 33249 body: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "kimi", "alternate_api_model": "kimi-k3"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T3 fixed, kimi (provider moonshot) refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T3 fixed, kimi (provider moonshot) refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "mimo", "alternate_api_model": "xiaomi/mimo-v2.6-pro"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T4 fixed, mimo (provider xiaomi) refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T4 fixed, mimo (provider xiaomi) refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "grok", "alternate_api_model": "x-ai/grok-4.6"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T5 fixed, grok with a wrong model refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T5 fixed, grok with a wrong model refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "gemini", "alternate_api_model": "google/gemini-3.8-flash"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T6 fixed, gemini already on the panel refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T6 fixed, gemini already on the panel refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "alt_minimax31", "alternate_api_model": "minimax/minimax-m3.1-flash"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T7 fixed, alt_minimax31 still refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T7 fixed, alt_minimax31 still refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 BEGIN r := pg_temp.gra2_n('fe0e76b1-dbc6-40aa-abfb-63b1f1b85ab7'::uuid, $j$[{"removed_seat": "chatgpt", "alternate_seat": "opus", "alternate_api_model": "anthropic/claude-opus-5.5"}]$j$::jsonb, '[{"seat":"chatgpt"}]'::jsonb); o := o||'T8 fixed, opus (family anthropic debates here, G1) refused: OK '||r::text||E'\n'; RAISE EXCEPTION 'undo';
 EXCEPTION WHEN OTHERS THEN IF SQLERRM<>'undo' THEN o := o||'T8 fixed, opus (family anthropic debates here, G1) refused: REFUSED '||SQLERRM||E'\n'; END IF; END;
 RAISE EXCEPTION 'GRA2 RESULTS%', E'\n'||o;
END $t$;
