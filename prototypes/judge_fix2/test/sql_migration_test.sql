-- Run on a LOCAL scratch Postgres 16 only (never the project database). Stub of what the migration depends on: the Supabase roles and
-- debate_results(id). Then: BEGIN; the migration; one rpc call as anon; read back as postgres; anon read refused; ROLLBACK.
CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;   -- as Supabase grants by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
CREATE TABLE public.debate_results (id uuid PRIMARY KEY, run_token text);
INSERT INTO public.debate_results VALUES ('2b0c5f2e-0000-4000-8000-000000032212','ODV1-32212-test');
BEGIN;
\i sql/w2_debate_enforcer_log.sql
SET LOCAL ROLE anon;
SELECT public.record_enforcer_log('2b0c5f2e-0000-4000-8000-000000032212','ODV1-32212-test',
 '[{"seat":"deepseek","seat_role":"panel","judge_model":"deepseek/x","kind":"cure","rule":"K-C","item":"D5","flagged_line":"D5: STANDS -- ...","prompt_sent":"THE CURE ASK","full_reply":"RESTATED: D5 vs C5 ...\nRESPONSE: K-C D5 | I accept the mark.","response_line":"I accept the mark.","cure_status":"CURED","cure_reason":null,"at":"2026-11-02T07:00:00Z"},
   {"seat":"glm","seat_role":"panel","judge_model":"z-ai/glm","kind":"failed_reply","item":"no_usable_judgment","full_reply":"{\"verdict_tag\":\"HELD\" ...","reply_error":"returned no JSON object","at":"2026-11-02T07:04:38Z"}]'::jsonb) AS rpc_result;
RESET ROLE;
SAVEPOINT before_anon_read;
SET LOCAL ROLE anon;
\echo anon reads the table (expect: permission denied):
SELECT count(*) FROM public.debate_enforcer_log;
ROLLBACK TO SAVEPOINT before_anon_read;
RESET ROLE;
SELECT id, run_token, seat, kind, rule, item, length(full_reply) AS reply_chars, response_line, cure_status FROM public.debate_enforcer_log ORDER BY id;
ROLLBACK;
SELECT to_regclass('public.debate_enforcer_log') AS table_after_rollback;
