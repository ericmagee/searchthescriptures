DO $T$
DECLARE pr text[]; r text := ''; ph text; m0 bigint; m1 bigint; res text; eng text;
BEGIN
  PERFORM set_config('truth.session_id','session_01H1X3AP1fjeQaEbxPP9UEZH',true);
  FOREACH ph IN ARRAY ARRAY['BEFORE','AFTER'] LOOP
    IF ph='AFTER' THEN
      EXECUTE $S1$
-- 1a direct audit_log inserts
REVOKE INSERT ON public.audit_log FROM anon, authenticated;
DROP POLICY IF EXISTS anon_ins ON public.audit_log;
-- 1b class C: invoker RPC writers with caller text (PUBLIC holds EXECUTE too)
REVOKE EXECUTE ON FUNCTION public.log_build(text,text,text), public.log_change(text,text,text), public.save_session(jsonb),
  public.abandon_fold_session(text,text), public.blackboard_ack(bigint,text,text,text), public.blackboard_close(bigint,text,text,text),
  public.blackboard_archive_any_author(bigint[],jsonb,text,text,text), public.conclusion_flag(bigint,text), public.init_load_session(boolean)
  FROM PUBLIC, anon, authenticated;
-- 1b C-4 (W2 9452): definer RPCs that write caller text into day_room / day_room_posts (definer audit triggers)
REVOKE EXECUTE ON FUNCTION public.dr_rest(bigint,text,text,text), public.dr_retract(bigint,text,text,text,bigint) FROM PUBLIC, anon, authenticated;
-- 1c class B: trigger functions to definer
ALTER FUNCTION public.debate_results_write_guard() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.truth_date_normalize() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.debate_judgments_write_guard() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.debate_prompts_guard() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.kb_row_audit() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.log_app_state_build() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION public.sight_embedding_fence() SECURITY DEFINER SET search_path = public, pg_temp;
-- log_override_arming: definer, actor from the request role (C-1). Only the current_user line changes.
CREATE OR REPLACE FUNCTION public.log_override_arming()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $function$
DECLARE
  v_key text; v_old text; v_new text;
  v_old_armed boolean; v_new_armed boolean; v_event text;
BEGIN
  BEGIN
    v_key := CASE WHEN TG_OP = 'DELETE' THEN OLD.key ELSE NEW.key END;
    -- BB-2968 P1: population is the key-name syntax, 15 keys at 2026-09-22 (BB-2984)
    IF v_key ~ '_(authorized|authorized_id|override)$' THEN
      IF TG_OP IN ('UPDATE', 'DELETE') THEN v_old := btrim(OLD.value, '"'); END IF;
      IF TG_OP IN ('INSERT', 'UPDATE') THEN v_new := btrim(NEW.value, '"'); END IF;
      IF TG_OP <> 'UPDATE' OR v_old IS DISTINCT FROM v_new THEN
        -- armed = 'true'; an *_authorized_id key is armed by any value other than none/false/empty
        v_old_armed := coalesce(v_old = 'true'
                         OR (v_key ~ '_authorized_id$' AND v_old NOT IN ('', 'none', 'false')), false);
        v_new_armed := coalesce(v_new = 'true'
                         OR (v_key ~ '_authorized_id$' AND v_new NOT IN ('', 'none', 'false')), false);
        v_event := CASE WHEN v_new_armed AND NOT v_old_armed THEN 'ARMED'
                        WHEN v_old_armed AND NOT v_new_armed THEN 'DISARMED'
                        ELSE 'CHANGED' END;
        INSERT INTO audit_log (session_date, session_title, engine, notes)
        VALUES (
          (NOW() AT TIME ZONE 'America/Chicago')::date,
          'OVERRIDE ' || v_event || ': ' || v_key,
          'log_override_arming',
          'key=' || v_key || ' | op=' || TG_OP || ' | event=' || v_event
          || ' | old=' || coalesce(quote_literal(v_old), 'NULL')
          || ' | new=' || coalesce(quote_literal(v_new), 'NULL')
          || ' | application_name=' || coalesce(current_setting('application_name', true), '?')
          || ' | session_user=' || session_user
          || ' | current_user=' || coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', nullif(current_setting('role', true), 'none'), session_user::text)
          || ' | client_addr=' || coalesce(inet_client_addr()::text, 'local')
        );
      END IF;
    END IF;
  EXCEPTION WHEN SQLSTATE 'P3R01' THEN RAISE; -- BB-2833 P3: the refusal passes through (2905)
    WHEN OTHERS THEN
    NULL;  -- logging must never block the write itself
  END;
  RETURN NULL;
END;
$function$;
-- 1d C-3: anon inserts on the 11 tables whose definer audit triggers copy caller text (anon holds INSERT only; no UPDATE grant)
REVOKE INSERT ON public.the_wall, public.engine_manual, public.operational_doc, public.kb_book_chapters, public.journal_entries,
  public.blackboard, public.blackboard_manual, public.app_source, public.day_room, public.day_room_posts, public.debate_prompts FROM anon;
DROP POLICY IF EXISTS anon_ins ON public.app_source;      DROP POLICY IF EXISTS anon_ins ON public.blackboard;
DROP POLICY IF EXISTS anon_ins ON public.blackboard_manual; DROP POLICY IF EXISTS anon_ins ON public.debate_prompts;
DROP POLICY IF EXISTS anon_ins ON public.engine_manual;   DROP POLICY IF EXISTS anon_ins ON public.journal_entries;
DROP POLICY IF EXISTS anon_ins ON public.kb_book_chapters; DROP POLICY IF EXISTS anon_ins ON public.operational_doc;
-- C-5 (W2 9455): authenticated also holds writes on 4 of them (auth.users has 0 rows today; sign-up state not readable from SQL), so revoke:
REVOKE INSERT, UPDATE ON public.the_wall, public.day_room FROM authenticated;
REVOKE INSERT ON public.day_room_posts FROM authenticated;
REVOKE INSERT, UPDATE ON public.journal_entries FROM authenticated;
-- day_room, day_room_posts and the_wall policies name anon and authenticated; they stay but no longer apply (no grant).
$S1$;
      r := r || E'\n[step 1 applied in this transaction]';
    END IF;
    FOREACH pr SLICE 1 IN ARRAY ARRAY[ARRAY['T1','anon','INSERT INTO audit_log(session_title,engine,notes) VALUES (''ask466 test'',''ask466_test'',''t1'')'],ARRAY['T2.log_build','anon','SELECT log_build(''ask466 test'',''x'',''t2'')'],ARRAY['T2.init_load_session','anon','SELECT init_load_session(false)'],ARRAY['T2.dr_rest','anon','SELECT dr_rest(0,''x'',''x'',''x'')'],ARRAY['T3.log_audit_event','anon','SELECT log_audit_event(''ask466 test'',''t3'',''ask466_test'',current_date)'],ARRAY['T3.record_debate_row_tokens','anon','SELECT record_debate_row_tokens(''ask466-none'',0,0,0,0,''[]''::jsonb)'],ARRAY['T3b.the_wall','anon','INSERT INTO the_wall DEFAULT VALUES'],ARRAY['T3b.engine_manual','anon','INSERT INTO engine_manual DEFAULT VALUES'],ARRAY['T3b.journal_entries','anon','INSERT INTO journal_entries DEFAULT VALUES'],ARRAY['T3b.day_room_posts','anon','INSERT INTO day_room_posts DEFAULT VALUES'],ARRAY['T3b.the_wall_auth','authenticated','INSERT INTO the_wall DEFAULT VALUES'],ARRAY['T4.debate_results','anon','INSERT INTO debate_results(engine,topic) VALUES (''ask466_test'',''ask466 test'')'],ARRAY['T4b.app_state_arm','anon','INSERT INTO app_state(key,value) VALUES (''ask466_test_override'',''"true"'')'],ARRAY['T8.sol_seat_init','sol_seat','SELECT init_load_session(false)'],ARRAY['T5.ddl','postgres','CREATE FUNCTION public.ask466_scratch() RETURNS int LANGUAGE sql AS ''select 1''; DROP FUNCTION public.ask466_scratch()'],ARRAY['T7.engine_manual_apply_preview','postgres','SELECT engine_manual_apply((SELECT max(version) FROM engine_manual),(SELECT md5(content) FROM engine_manual ORDER BY version DESC LIMIT 1),''[]''::jsonb,null,null,null,null,null,false)']] LOOP
      SELECT max(id) INTO m0 FROM audit_log;
      BEGIN
        IF pr[2] <> 'postgres' THEN
          PERFORM set_config('request.jwt.claims', json_build_object('role',pr[2])::text, true);
          EXECUTE 'SET LOCAL ROLE ' || pr[2];
        END IF;
        EXECUTE pr[3];
        EXECUTE 'RESET ROLE';
        PERFORM set_config('request.jwt.claims','',true);
        res := 'OK';
      EXCEPTION WHEN OTHERS THEN
        res := 'ERR ' || SQLSTATE || ' ' || left(SQLERRM,90);
      END;
      EXECUTE 'RESET ROLE';
      PERFORM set_config('request.jwt.claims','',true);
      SELECT max(id) INTO m1 FROM audit_log;
      SELECT string_agg(coalesce(engine,'?') || CASE WHEN notes ~ 'current_user=' THEN '{'||substring(notes from 'current_user=([^ |]+)')||'}' ELSE '' END, ',') INTO eng FROM audit_log WHERE id > m0;
      r := r || E'\n' || ph || ' ' || pr[1] || ' [' || pr[2] || ']: ' || res || ' | audit+' || (m1-m0) || coalesce(' '||eng,'');
    END LOOP;
  END LOOP;
  RAISE EXCEPTION 'ASK466 ROLLBACK TEST (nothing kept):%', r;
END
$T$;