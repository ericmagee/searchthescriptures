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
$function$
