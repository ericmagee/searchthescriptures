-- ASK 466 step 1 revert (texts read from pg_policy / proacl 11-19 14:25Z)
BEGIN;
GRANT INSERT ON public.audit_log TO anon;
CREATE POLICY anon_ins ON public.audit_log AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);
GRANT EXECUTE ON FUNCTION public.log_build(text,text,text), public.log_change(text,text,text), public.save_session(jsonb),
  public.abandon_fold_session(text,text), public.blackboard_ack(bigint,text,text,text), public.blackboard_close(bigint,text,text,text),
  public.blackboard_archive_any_author(bigint[],jsonb,text,text,text), public.conclusion_flag(bigint,text), public.init_load_session(boolean)
  TO PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dr_rest(bigint,text,text,text), public.dr_retract(bigint,text,text,text,bigint) TO anon, authenticated;
ALTER FUNCTION public.debate_results_write_guard() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.truth_date_normalize() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.debate_judgments_write_guard() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.debate_prompts_guard() SECURITY INVOKER RESET search_path;
-- GATE ARMOR: protected; one-shot flag armed on the operator's word, once per change.
UPDATE public.app_state SET value = 'true' WHERE key = 'gate_mutation_authorized';
ALTER FUNCTION public.kb_row_audit() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.log_app_state_build() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.sight_embedding_fence() SECURITY INVOKER RESET search_path;
-- log_override_arming: the text before step 1 (inline; R-1)
-- GATE ARMOR: protected; one-shot flag armed on the operator's word, once per change.
UPDATE public.app_state SET value = 'true' WHERE key = 'gate_mutation_authorized';
CREATE OR REPLACE FUNCTION public.log_override_arming()
 RETURNS trigger
 LANGUAGE plpgsql
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
          || ' | current_user=' || current_user
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
GRANT INSERT ON public.the_wall, public.engine_manual, public.operational_doc, public.kb_book_chapters, public.journal_entries,
  public.blackboard, public.blackboard_manual, public.app_source, public.day_room, public.day_room_posts, public.debate_prompts TO anon;
CREATE POLICY anon_ins ON public.app_source FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.blackboard FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.blackboard_manual FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.debate_prompts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.engine_manual FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.journal_entries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.kb_book_chapters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY anon_ins ON public.operational_doc FOR INSERT TO anon WITH CHECK (true);
GRANT INSERT, UPDATE ON public.the_wall, public.day_room TO authenticated;
GRANT INSERT ON public.day_room_posts TO authenticated;
GRANT INSERT, UPDATE ON public.journal_entries TO authenticated;
-- the flag must be false again here
DO $c$ BEGIN IF (SELECT value FROM public.app_state WHERE key='gate_mutation_authorized') IS DISTINCT FROM 'false' THEN RAISE EXCEPTION 'ASK 466: gate flag not consumed'; END IF; END $c$;
COMMIT;
