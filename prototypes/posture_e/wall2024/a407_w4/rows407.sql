-- ASK 407 model_config rows (plan W3 8690 item 2). Refuses if either seat exists. No reasoning, effort, thinking or temperature column is set; notes is left null.
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $r407$ BEGIN
  IF EXISTS (SELECT 1 FROM model_config WHERE seat IN ('glm_legal','hy4')) THEN RAISE EXCEPTION 'ASK 407: a seat glm_legal or hy4 already exists'; END IF;
  INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family) VALUES
   ('glm_legal','openrouter','engine','z-ai/glm-5.3-flashx-legal','https://openrouter.ai/api/v1/chat/completions',64000,NULL,false,true,'zhipu'),
   ('hy4','openrouter','engine','tencent/hy4-flash','https://openrouter.ai/api/v1/chat/completions',64000,NULL,false,true,'tencent');
END $r407$;
SELECT seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family FROM model_config WHERE seat IN ('glm_legal','hy4') ORDER BY seat;
