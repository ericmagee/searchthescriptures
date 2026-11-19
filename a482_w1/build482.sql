-- REV 3 (W1, 11-19 17:0xZ): row 2 name ChatGPT -> OpenAI (engine fallback only); the dashboard names every model from its id (operator 17:00Z).
-- REV 2 (W1, 11-19 17:1xZ): dash_debaters row 3 reads model_config seat gemini_deb (ASK 487 rev 1, W3 9682): the gemini debater runs google/gemini-4-hydrogen at 64000 while judge seat gemini stays on flash. Write ASK 487's gemini_deb row BEFORE this build; the closing DO check (10 active rows with a version) refuses otherwise.
-- ASK 482 build (W1, 11-19). Bases read live 16:2xZ: dash_api prosrc md5 0cb68ad8, dash_launch_odv1 0e6fe0f3, dash_odv1_judges f5580573. Changed lines only: dash_api +1 WHEN (odv1_engines); dash_launch_odv1 v_eng line; dash_odv1_judges display order (Init Seats ORDER0). Run as one transaction on W4 card.
BEGIN;
-- ASK 482 (i): the engines a debate may seat. A MIRROR of the engine's Init Seats ENG (workflow moMxiV4Irg1uRBZN, version e0a61271) less the refused engines (deepseek; any minimax). The engine list lives in engine code; the ASK 417 registry check for 482 (C6) compares the two at every engine readback and run start. The version is read live from model_config, never typed here.
CREATE OR REPLACE FUNCTION public.dash_debaters()
 RETURNS TABLE(ord integer, key text, name text, mc_seat text, api_model text, active boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select l.ord, l.key, l.name, l.mc_seat, m.api_model, coalesce(m.active, false)
  from (values
    (1,'claude','Claude','claude_synthesis'),
    (2,'chatgpt','OpenAI','chatgpt'),
    (3,'gemini','Gemini','gemini_deb'),
    (4,'grok','Grok','grok'),
    (5,'mimo','MiMo','mimo'),
    (6,'haiku','Haiku','haiku'),
    (7,'opus','Opus','opus'),
    (8,'glm','GLM','glm'),
    (9,'qwen4max','Qwen 4 Max','qwen4max'),
    (10,'spark','Spark','spark')
  ) as l(ord, key, name, mc_seat)
  left join model_config m on m.seat = l.mc_seat
  order by l.ord;
$function$;
REVOKE ALL ON FUNCTION public.dash_debaters() FROM PUBLIC, anon, authenticated;

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
    WHEN 'odv1_engines'  THEN (SELECT coalesce(jsonb_agg(to_jsonb(d) ORDER BY d.ord), '[]'::jsonb) FROM dash_debaters() d)  -- ASK 482
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
  v_eng text[] := array(select key from dash_debaters());  -- ASK 482: the same list the dashboard shows (Init Seats ENG less deepseek and minimax); DeepSeek never debates (operator 21:24 CST 11-18)
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
         order by array_position(array['chatgpt','sol','sol62','haiku','gemini','hydrogen','spark','qwen4max','argon','sonnet'], judge_seat), created_at), '[]'::jsonb)
  from debate_judgments where debate_id = p_id;
$function$;
-- W2 9649 N2: closing checks; any failure raises and the whole build rolls back.
DO $chk$ BEGIN
  IF (SELECT count(*) FROM dash_debaters() WHERE active AND api_model IS NOT NULL) <> 10 THEN RAISE EXCEPTION 'ASK 482 check: dash_debaters() does not return 10 active rows with a version'; END IF;
  IF position($q$'qwen'$q$ in (SELECT prosrc FROM pg_proc WHERE proname='dash_launch_odv1')) > 0 THEN RAISE EXCEPTION 'ASK 482 check: dash_launch_odv1 still names qwen'; END IF;
  IF position('array(select key from dash_debaters())' in (SELECT prosrc FROM pg_proc WHERE proname='dash_launch_odv1')) = 0 THEN RAISE EXCEPTION 'ASK 482 check: v_eng is not read from dash_debaters()'; END IF;
  IF position('odv1_engines' in (SELECT prosrc FROM pg_proc WHERE proname='dash_api')) = 0 THEN RAISE EXCEPTION 'ASK 482 check: dash_api has no odv1_engines action'; END IF;
END $chk$;
COMMIT;
