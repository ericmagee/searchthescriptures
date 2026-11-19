-- Dashboard default away from DeepSeek (W4 draft, NOT APPLIED). Number: coordinator assigns.
SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
SET LOCAL truth.card='<card label> <press time>Z W4 thread';
-- 1. dash_launch_debate: no default engine; deepseek, empty or unknown is refused (was: silently deepseek)
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
INSERT INTO public.audit_log (session_date, session_title, engine, notes, performed_by)
VALUES ((now() AT TIME ZONE 'America/Chicago')::date, 'ASK <n>: dashboard default engine away from DeepSeek', 'W4_2026_11_06',
 'card=' || current_setting('truth.card') || ' | session=' || current_setting('truth.session_id') || ' | dash_launch_debate: default deepseek -> none, deepseek refused | fire_debate_workflow: deepseek, W4, W5 and else routes removed | revert: revert.sql', 'W4_2026_11_06|dash');
