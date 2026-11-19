DO $T$
DECLARE r text := ''; j json; q0 bigint; n0 bigint; n1 bigint;
BEGIN
  PERFORM set_config('truth.session_id','session_01H1X3AP1fjeQaEbxPP9UEZH',true);
  EXECUTE $S$
CREATE OR REPLACE FUNCTION public.dash_launch_debate(p_topic text, p_engine text DEFAULT NULL, p_rounds integer DEFAULT 3)
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_depth int; v_token uuid; v_eng text;
BEGIN
  IF p_topic IS NULL OR length(trim(p_topic)) < 6 THEN
    RETURN json_build_object('status','error','message','Give a fuller topic.');
  END IF;
  v_eng := lower(NULLIF(trim(p_engine),''));
  IF v_eng IS NULL OR v_eng NOT IN ('chatgpt','gemini','grok') THEN
    RETURN json_build_object('status','error','message','Name an engine: chatgpt, gemini or grok.');
  END IF;
  SELECT COUNT(*) INTO v_depth FROM debate_queue
   WHERE status IN ('pending','running')
     AND submitted_at > now() - interval '24 hours';
  IF v_depth >= 10 THEN
    RETURN json_build_object('status','busy','message','A debate is already running. Wait for it to finish.');
  END IF;
  INSERT INTO debate_queue (topic, submitter_ip, rounds, status, engine, variant)
  VALUES (trim(p_topic), 'web-eric', GREATEST(1,LEAST(COALESCE(p_rounds,3),5)), 'pending', v_eng, 'W1')
  RETURNING queue_token INTO v_token;
  RETURN json_build_object('status','queued','queue_token',v_token,'engine',v_eng);
END;
$function$;
-- CREATE OR REPLACE keeps today's grants (a changed default value is allowed; the default is not removed)
-- 2. fire_debate_workflow: no DeepSeek routes; no engine or an unknown one fires nothing
CREATE OR REPLACE FUNCTION public.fire_debate_workflow()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  webhook_url text;
  base text := 'https://truthapp.app.n8n.cloud/webhook/';
BEGIN
  IF COALESCE(NEW.variant, 'W1') NOT IN ('W1') THEN
    RETURN NEW;  -- W4 and W5 variants routed only to DeepSeek workflows (unpublished, ASK 480)
  END IF;
  CASE NEW.engine
    WHEN 'chatgpt' THEN webhook_url := base || 'claude-vs-chatgpt';
    WHEN 'gemini'  THEN webhook_url := base || 'claude-vs-gemini';
    WHEN 'grok'    THEN webhook_url := base || 'grok-w1';
    ELSE RETURN NEW;  -- deepseek, null or unknown: nothing is sent
  END CASE;
  PERFORM net.http_post(
    url := webhook_url,
    body := json_build_object('topic', NEW.topic, 'queue_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 5000
  );
  RETURN NEW;
END;
$function$;
$S$;
  SELECT max(id) INTO q0 FROM debate_queue;
  SELECT count(*) INTO n0 FROM net.http_request_queue;
  j := public.dash_launch_debate('ask dash test topic', NULL, 1); r := r||E'\nno engine: '||j::text;
  j := public.dash_launch_debate('ask dash test topic', 'deepseek', 1); r := r||E'\ndeepseek: '||j::text;
  j := public.dash_launch_debate('ask dash test topic', 'bogus', 1); r := r||E'\nbogus: '||j::text;
  j := public.dash_launch_debate('ask dash test topic', 'gemini', 1); r := r||E'\ngemini: '||(j->>'status')||' engine '||(j->>'engine');
  SELECT count(*) INTO n1 FROM net.http_request_queue; r := r||E'\n  http queued by gemini row: '||(n1-n0);
  INSERT INTO debate_queue (topic, submitter_ip, rounds, status, engine, variant) VALUES ('ask dash test W4','test',1,'pending','gemini','W4');
  INSERT INTO debate_queue (topic, submitter_ip, rounds, status, engine, variant) VALUES ('ask dash test null','test',1,'pending',NULL,'W1');
  INSERT INTO debate_queue (topic, submitter_ip, rounds, status, engine, variant) VALUES ('ask dash test ds','test',1,'pending','deepseek','W1');
  SELECT count(*) INTO n0 FROM net.http_request_queue; r := r||E'\n  http queued by W4/null/deepseek rows: '||(n0-n1);
  r := r||E'\nanon EXECUTE kept: '||has_function_privilege('anon','public.dash_launch_debate(text,text,integer)','EXECUTE');
  RAISE EXCEPTION 'DASH ROLLBACK TEST (nothing kept):%', r;
END
$T$;
