-- ASK 482 REVERT (W1, 11-19): restores the three bodies read live before the build (prosrc md5 dash_api 0cb68ad8, dash_launch_odv1 0e6fe0f3, dash_odv1_judges f5580573), then drops dash_debaters. Dashboard revert: assign_alias truth-app-dashboard.vercel.app -> dpl_5n4sLu6gKhDk6DEfEgBAiE8Q9kNj.
BEGIN;
CREATE OR REPLACE FUNCTION public.dash_api(p_pass text, p_action text, p_arg jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE v_salt text; v_hash text;
BEGIN
  SELECT value INTO v_salt FROM dashboard_secrets WHERE key='dashboard_pass_salt';
  SELECT value INTO v_hash FROM dashboard_secrets WHERE key='dashboard_pass_sha';
  IF v_hash IS NULL THEN RETURN jsonb_build_object('error','gate not configured'); END IF;
  IF encode(digest(coalesce(p_pass,'')||coalesce(v_salt,''),'sha256'),'hex') <> v_hash THEN
    RETURN jsonb_build_object('error','unauthorized');
  END IF;
  RETURN CASE p_action
    WHEN 'dashboard'     THEN dashboard_json()
    WHEN 'sights'        THEN dash_sights(coalesce(p_arg->>'q',''), coalesce((p_arg->>'lim')::int,80))
    WHEN 'sight'         THEN dash_sight((p_arg->>'n')::int)
    WHEN 'conclusions'   THEN dash_conclusions(coalesce(p_arg->>'q',''), coalesce((p_arg->>'lim')::int,80))
    WHEN 'conclusion'    THEN dash_conclusion((p_arg->>'id')::int)
    WHEN 'tensions'      THEN dash_tensions()
    WHEN 'todos'         THEN dash_todos()
    WHEN 'guards'        THEN dash_guards()
    WHEN 'journal'       THEN dash_journal(coalesce(p_arg->>'q',''), coalesce((p_arg->>'lim')::int,60))
    WHEN 'journal_entry' THEN dash_journal_entry((p_arg->>'n')::int)
    WHEN 'audit'         THEN dash_audit(coalesce(p_arg->>'q',''), coalesce((p_arg->>'lim')::int,60))
    WHEN 'blackboard'    THEN dash_blackboard(coalesce(p_arg->>'scope','unfinished'))
    WHEN 'bb_entry'      THEN dash_bb_entry((p_arg->>'id')::bigint)
    WHEN 'search'        THEN dash_search(coalesce(p_arg->>'q',''))
    WHEN 'books'         THEN dash_books()
    WHEN 'chapter'       THEN dash_chapter(p_arg->>'p_book', (p_arg->>'p_chap')::int)
    WHEN 'verse_words'   THEN dash_verse_words(p_arg->>'p_book', (p_arg->>'p_chap')::int, (p_arg->>'p_verse')::int)
    WHEN 'strongs'       THEN dash_strongs(p_arg->>'p_code')
    WHEN 'verse_search'  THEN dash_verse_search(coalesce(p_arg->>'q',''), coalesce((p_arg->>'lim')::int,80))
    WHEN 'ms_books'      THEN dash_ms_books()
    WHEN 'ms_chapters'   THEN dash_ms_chapters((p_arg->>'p_book_id')::int)
    WHEN 'ms_chapter'    THEN dash_ms_chapter((p_arg->>'p_id')::int)
    WHEN 'launch_debate' THEN dash_launch_debate(p_arg->>'p_topic', p_arg->>'p_engine', coalesce((p_arg->>'p_rounds')::int,3))::jsonb
    WHEN 'debate_status' THEN get_debate_status((p_arg->>'p_token')::uuid)::jsonb
    WHEN 'debate_result' THEN dash_debate_result(p_arg->>'p_topic')
    WHEN 'debates'       THEN dash_debates()
    WHEN 'queue'         THEN dash_queue()
    WHEN 'cc_debates'    THEN dash_cc_debates()
    WHEN 'debate_by_id'  THEN dash_debate_by_id((p_arg->>'p_id')::uuid)
    WHEN 'launch_cc'     THEN dash_launch_cc(p_arg->>'p_topic', coalesce(p_arg->>'p_engine','gemini'))
    WHEN 'remote_seats'  THEN dash_remote_seats()
    WHEN 'odv1_debates'  THEN dash_odv1_debates()
    WHEN 'odv1_by_id'    THEN dash_odv1_by_id((p_arg->>'p_id')::uuid)
    WHEN 'launch_odv1'   THEN dash_launch_odv1(p_arg->>'p_topic', p_arg->>'p_def_engine', p_arg->>'p_def_profile', p_arg->>'p_ch_engine', p_arg->>'p_ch_profile', p_arg->>'p_fence_reason')
    WHEN 'odv1_status'   THEN dash_odv1_launch_status((p_arg->>'p_req')::bigint)
    ELSE jsonb_build_object('error','unknown action')
  END;
END;
$function$;

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
$function$;

CREATE OR REPLACE FUNCTION public.dash_odv1_judges(p_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
           'seat', judge_seat, 'model', judge_api_model, 'verdict', verdict_tag,
           'defense_standing', defense_standing, 'conceded_links', conceded_links,
           'challenge_standing', challenge_standing, 'challenger_conceded_links', challenger_conceded_links,
           'verdict_raw', verdict_raw, 'truncated', truncated)
         order by array_position(array['deepseek','gemini','grok','chatgpt','mimo','glm','qwen'], judge_seat), created_at), '[]'::jsonb)
  from debate_judgments where debate_id = p_id;
$function$;

DROP FUNCTION IF EXISTS public.dash_debaters();
COMMIT;
