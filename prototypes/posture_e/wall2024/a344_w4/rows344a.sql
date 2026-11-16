-- ASK 344a: two alternate-judge rows (rev 2: dsv41 dropped) (model settings at default: no reasoning field; max_tokens 64000 as the other judges).
-- Run with SET LOCAL truth.session_id in the same call. Refuses if any seat already exists.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM model_config WHERE seat IN ('qwen4max','ernie55')) THEN RAISE EXCEPTION 'ASK 344a: a seat already exists'; END IF;
  INSERT INTO model_config (seat, provider, role, api_model, max_tokens, active, family, needs_upgrade, notes) VALUES
   ('qwen4max','openrouter','engine','qwen/qwen4-max',64000,true,'qwen',false,'ASK 344: alternate judge only, end of the alternate order (operator 2026-11-16 14:24 CST, card Alternates only).'),
   ('ernie55','openrouter','engine','baidu/ernie-5.5-flash-preview:free',64000,true,'baidu',false,'ASK 344: alternate judge only, end of the alternate order (operator 2026-11-16 14:28 CST).');
END $$;
