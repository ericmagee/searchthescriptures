CREATE OR REPLACE FUNCTION public.dash_launch_odv1(p_topic text, p_def_engine text, p_def_profile text, p_ch_engine text, p_ch_profile text, p_fence_reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
declare
  v_req bigint;
  v_eng text[] := array['claude','chatgpt','gemini','grok','mimo','glm','qwen'];  -- ruling 421 (2026-11-04): DeepSeek never debates; it is the enforcer
  v_nokey text[] := array[]::text[];  -- no locked engines; MiMo key verified 2026-10-09 21:07Z (audit 16842); matches ODV1_NOKEY in the dashboard's odv1.js
  de text := lower(trim(coalesce(p_def_engine,'')));
  ce text := lower(trim(coalesce(p_ch_engine,'')));
  dp text := lower(trim(coalesce(p_def_profile,'')));
  cp text := lower(trim(coalesce(p_ch_profile,'')));
  v_fence text;
  v_ovr uuid;
begin
  if p_topic is null or length(trim(p_topic)) < 6 then
    return jsonb_build_object('status','error','message','Give a fuller topic.');
  end if;
  if not (de = any(v_eng)) or not (ce = any(v_eng)) then
    return jsonb_build_object('status','error','message','Pick an engine for each side.');
  end if;
  if de = any(v_nokey) or ce = any(v_nokey) then
    return jsonb_build_object('status','error','message','This engine needs a working key first.');
  end if;
  if dp not in ('plain','oracle') or cp not in ('plain','oracle') then
    return jsonb_build_object('status','error','message','Each side is Plain or The Oracle.');
  end if;
  if dp = 'oracle' and cp = 'oracle' then
    return jsonb_build_object('status','error','message','Only one side can be The Oracle.');
  end if;
  -- Topic fence (WALL-0788 replies 823-831): a census topic stops here unless the operator gives a reason; the reason is stored and travels as a one-use override id.
  v_fence := debate_topic_fence(trim(p_topic));
  if v_fence is not null then
    if p_fence_reason is null or length(trim(p_fence_reason)) < 10 then
      return jsonb_build_object('status','error','fenced',true,'message',v_fence || ' To launch anyway, give a one-line reason (10 characters or more).');
    end if;
    insert into debate_fence_overrides(topic_md5, reason) values (debate_topic_hash(p_topic), trim(p_fence_reason)) returning id into v_ovr;
  end if;
  select net.http_post(
    url := 'https://truthapp.app.n8n.cloud/webhook/oracle-debate-v1',
    body := jsonb_build_object('topic', trim(p_topic),
              'defender', jsonb_build_object('engine', de, 'profile', dp),
              'challenger', jsonb_build_object('engine', ce, 'profile', cp),
              'fence_override_id', v_ovr),
    timeout_milliseconds := 60000
  ) into v_req;
  insert into odv1_launches(topic, def_engine, def_profile, ch_engine, ch_profile, request_id, fence_override) values (trim(p_topic), de, dp, ce, cp, v_req, v_ovr is not null);  -- Queue tab log (operator fix 2026-10-17)
  return jsonb_build_object('status','fired','request_id',v_req,'defender',de||'/'||dp,'challenger',ce||'/'||cp,'fence_override',v_ovr is not null);
end;
$function$
