-- ASK 466 step 1 revert (texts read from pg_policy / proacl 11-19 14:25Z)
BEGIN;
GRANT INSERT ON public.audit_log TO anon;
CREATE POLICY anon_ins ON public.audit_log AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);
GRANT EXECUTE ON FUNCTION public.log_build(text,text,text), public.log_change(text,text,text), public.save_session(jsonb),
  public.abandon_fold_session(text,text), public.blackboard_ack(bigint,text,text,text), public.blackboard_close(bigint,text,text,text),
  public.blackboard_archive_any_author(bigint[],jsonb,text,text,text), public.conclusion_flag(bigint,text), public.init_load_session(boolean)
  TO PUBLIC, anon, authenticated;
ALTER FUNCTION public.debate_results_write_guard() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.truth_date_normalize() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.debate_judgments_write_guard() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.debate_prompts_guard() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.kb_row_audit() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.log_app_state_build() SECURITY INVOKER RESET search_path;
ALTER FUNCTION public.sight_embedding_fence() SECURITY INVOKER RESET search_path;
-- log_override_arming: restore a466_w4/log_override_arming_before.sql
\i log_override_arming_before.sql
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
COMMIT;
