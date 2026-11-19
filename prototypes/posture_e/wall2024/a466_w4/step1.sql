-- ASK 466 step 1 (W4 build, rev 1 plan). NOT APPLIED. Branch first; live only on the operator's card.
BEGIN;
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
-- day_room, day_room_posts and the_wall policies also name authenticated; they stay (anon loses the grant, so they no longer apply to anon).
COMMIT;
