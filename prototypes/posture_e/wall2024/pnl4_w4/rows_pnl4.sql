-- Panel change rev 4 (operator 14:47 CST 11-17). Run BEFORE the code write (Accept Build fails closed on a listed seat with no active row).
INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family, updated_at) VALUES
 ('sol62','openrouter','engine','openai/gpt-6.2-sol','https://openrouter.ai/api/v1/chat/completions',64000,'openai/gpt-6.2-sol',false,true,'openai',now());
-- the record step must accept sol62 as a failed panel seat (v_seats); guarded on the md5 read 14:50 CST
DO $p4$
DECLARE d text; o text := $o$'ember','sonnet']; -- ASK 375:$o$; n text := $n$'ember','sonnet','sol62']; -- panel rev 4: sol62 (operator 14:47 CST 11-17); ASK 375:$n$;
BEGIN
  SELECT pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure) INTO d;
  IF md5(d) <> '6e92576d39c174a74de9e63df836939c' THEN RAISE EXCEPTION 'panel rev 4: substitution function changed since read (md5 %)', md5(d); END IF;
  IF (length(d) - length(replace(d, o, ''))) / length(o) <> 1 THEN RAISE EXCEPTION 'panel rev 4: anchor count'; END IF;
  EXECUTE replace(d, o, n);
END $p4$;
