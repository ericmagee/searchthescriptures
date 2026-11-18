-- ASK 407 rev 2 model_config rows (operator 12:45 CST order names tencent/hy4 and tencent/hy4-flash). Refuses if any seat exists. No reasoning, effort, thinking or temperature column is set; notes is left null.
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $r407$ BEGIN
  IF EXISTS (SELECT 1 FROM model_config WHERE seat IN ('glm_legal','hy4','hy4_flash')) THEN RAISE EXCEPTION 'ASK 407: a seat glm_legal, hy4 or hy4_flash already exists'; END IF;
  INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family) VALUES
   ('glm_legal','openrouter','engine','z-ai/glm-5.3-flashx-legal','https://openrouter.ai/api/v1/chat/completions',64000,NULL,false,true,'zhipu'),
   ('hy4','openrouter','engine','tencent/hy4','https://openrouter.ai/api/v1/chat/completions',64000,NULL,false,true,'tencent'),
   ('hy4_flash','openrouter','engine','tencent/hy4-flash','https://openrouter.ai/api/v1/chat/completions',64000,NULL,false,true,'tencent');
END $r407$;
SELECT seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family FROM model_config WHERE seat IN ('glm_legal','hy4','hy4_flash') ORDER BY seat;
