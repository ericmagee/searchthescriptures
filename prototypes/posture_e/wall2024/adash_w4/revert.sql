-- revert: the live definitions read 11-19 09:26 CST (dash_launch_debate md5 3f23945c, fire_debate_workflow md5 29f0e08a)
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
CREATE OR REPLACE FUNCTION public.dash_launch_debate(p_topic text, p_engine text DEFAULT 'deepseek'::text, p_rounds integer DEFAULT 3)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_depth int; v_token uuid; v_eng text;
BEGIN
  IF p_topic IS NULL OR length(trim(p_topic)) < 6 THEN
    RETURN json_build_object('status','error','message','Give a fuller topic.');
  END IF;
  SELECT COUNT(*) INTO v_depth FROM debate_queue
   WHERE status IN ('pending','running')
     AND submitted_at > now() - interval '24 hours';
  IF v_depth >= 10 THEN
    RETURN json_build_object('status','busy','message','A debate is already running. Wait for it to finish.');
  END IF;
  v_eng := lower(COALESCE(NULLIF(trim(p_engine),''),'deepseek'));
  IF v_eng NOT IN ('deepseek','chatgpt','gemini','grok') THEN v_eng := 'deepseek'; END IF;
  INSERT INTO debate_queue (topic, submitter_ip, rounds, status, engine, variant)
  VALUES (trim(p_topic), 'web-eric', GREATEST(1,LEAST(COALESCE(p_rounds,3),5)), 'pending', v_eng, 'W1')
  RETURNING queue_token INTO v_token;
  RETURN json_build_object('status','queued','queue_token',v_token,'engine',v_eng);
END;
$function$
;
CREATE OR REPLACE FUNCTION public.fire_debate_workflow()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  webhook_url text;
  base text := 'https://truthapp.app.n8n.cloud/webhook/';
  eng text;
  var text;
BEGIN
  eng := COALESCE(NEW.engine, 'deepseek');
  var := COALESCE(NEW.variant, 'W1');

  IF var = 'W4' THEN
    webhook_url := base || 'deepseek-w4-steelman';
  ELSIF var = 'W5' THEN
    webhook_url := base || 'deepseek-w5-blind';
  ELSE
    CASE eng
      WHEN 'deepseek' THEN webhook_url := base || 'claude-vs-deepseek';
      WHEN 'chatgpt'  THEN webhook_url := base || 'claude-vs-chatgpt';
      WHEN 'gemini'   THEN webhook_url := base || 'claude-vs-gemini';
      WHEN 'grok'     THEN webhook_url := base || 'grok-w1';
      ELSE webhook_url := base || 'claude-vs-deepseek';
    END CASE;
  END IF;

  PERFORM net.http_post(
    url := webhook_url,
    body := json_build_object('topic', NEW.topic, 'queue_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 5000
  );

  RETURN NEW;
END;
$function$
;
