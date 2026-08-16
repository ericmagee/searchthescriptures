-- REVOKE PUBLIC EXECUTE ON THE 53 SECURITY DEFINER APP FUNCTIONS (Eric ruled 2026-08-15).
--
-- WHAT THE SET IS. public holds 455 functions; 385 are PUBLIC-executable. 145 of those belong
-- to the vector and pg_trgm extensions and MUST keep PUBLIC execute — they are not touched here.
-- 240 are app functions owned by postgres, and exactly 53 of those are SECURITY DEFINER. Those
-- 53 are this migration's scope. They run as their owner, so an ambient PUBLIC grant on them is
-- the one that actually carries privilege.
--
-- BLAST RADIUS, MEASURED BEFORE WRITING THIS — not estimated:
--   anon           53/53 explicit EXECUTE  -> UNAFFECTED (27,228 calls in the 15-day window)
--   service_role   53/53 explicit EXECUTE  -> UNAFFECTED
--   authenticated  51/53 explicit EXECUTE  -> two gaps, repaired in step 1 below
--   berean_ro       0/53 explicit EXECUTE  -> loses access it reaches only via PUBLIC
--
-- ON berean_ro. pg_stat_statements shows zero statements attributed to it across the full
-- window (stats_reset 2026-07-31 14:59:33Z, dealloc 0, so nothing was ever evicted and the
-- absence is real). Attribution was verified by probe rather than assumed: a statement run
-- under SET LOCAL ROLE berean_ro is recorded against berean_ro, so the zero covers the
-- PostgREST SET ROLE path and not only direct login. The window cannot see a cadence longer
-- than 15 days, so a monthly job remains possible; it is deliberately left to fail loudly with
-- permission denied rather than be pre-granted on a guess. Repair is one GRANT.

-- Migrations are applied inside a transaction by the runner, so no explicit BEGIN/COMMIT here:
-- an inner COMMIT would end the runner's transaction early and split this migration's atomicity.

-- ---- STEP 1: close the two authenticated gaps FIRST, so no window exists where the app loses
-- ---- access. Both are the gate quiz, and authenticated reaches them ONLY through PUBLIC today:
-- ---- acl {=X/postgres, postgres=X/postgres, service_role=X/postgres, anon=X/postgres}.
-- ---- This preserves current behaviour exactly; it does not extend it.
GRANT EXECUTE ON FUNCTION public.pose_gate_quiz(p_topic text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grade_gate_quiz(p_quiz_id bigint, p_answer text, p_session_id text) TO authenticated;

-- ---- STEP 2: drop the ambient PUBLIC grant on all 53.
-- ---- Trigger functions are included and are safe: PostgreSQL checks EXECUTE on a trigger
-- ---- function at CREATE TRIGGER time, not when the trigger fires.
REVOKE EXECUTE ON FUNCTION public.advance_user_tier(p_new_tier text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.app_source_guard() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.auto_close_idle_sessions() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.blackboard_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.blackboard_manual_guard() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_post(p_room uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_debate_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_fold_unlock_core() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(p_identifier text, p_endpoint text, p_max_requests integer, p_window_minutes integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_founders_rank() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cron_verify_load_integrity() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.day_room_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.day_room_bell_striker() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.day_room_retract_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.debate_prompts_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.debate_queue_expire_stale() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.engine_manual_guard() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_dr_snapshot() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_pending_snapshots(p_limit integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grade_gate_quiz(p_quiz_id bigint, p_answer text, p_session_id text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.guards_digest() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_rate_limit(p_identifier text, p_endpoint text, p_window_start timestamp with time zone) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_room_member(p_room uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_room_moderator(p_room uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.kjv_mirror_digest() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_pamphlet_change() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_to_snapshot_queue() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.manuscript_mirror_digest() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.mark_sql_backup(p_date text, p_counts jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.open_session(p_next_sight integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.operational_doc_guard() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.origin_mirror_digest() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.pose_gate_quiz(p_topic text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prune_rate_limits() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prune_ref_challenges() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prune_snapshot_queue(retain_days integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_session_drive_log(p_session_date date, p_drive_id text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.submit_debate_challenge(p_topic text, p_ip text, p_rounds integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_next_sight() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.the_wall_audit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.tier3_queue_resolved(p_held_sample integer, p_semantic_threshold double precision) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.tlink_manual_guard() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.touch_session(p_session_date date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_conclusion_embeddings(p_updates jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_kjv_embeddings(p_updates jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_sight_embeddings(p_updates jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.upsert_sights_batch(p_sights jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.upsert_threads_batch(p_threads jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_chat_verse_link() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_room_anchor() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.verify_load() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.wake_link_manual_guard() FROM PUBLIC;

-- ---- STEP 3: restore berean_ro to what its own creating migration says it is.
-- ---- 20260621192522_create_berean_readonly_role built it as a DIRECT-LOGIN read-only export
-- ---- role: CREATE ROLE ... WITH LOGIN PASSWORD, CONNECT, USAGE, SELECT ON ALL TABLES. No
-- ---- migration in this database ever granted it to authenticator — every statement in
-- ---- supabase_migrations.schema_migrations was searched. The membership was added out-of-band
-- ---- with no record of intent, and it is what puts a read-only export role on the PostgREST
-- ---- auth path. Reversible with: GRANT berean_ro TO authenticator;
REVOKE berean_ro FROM authenticator;
