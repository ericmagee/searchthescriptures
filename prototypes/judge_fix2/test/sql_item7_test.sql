-- LOCAL scratch Postgres only. Stub debate_judgments with the columns aggregate_debate_panel reads, loaded with the stored seats of runs
-- 32212 and 32228 (SELECT read 2026-11-02). Live functions installed first; then BEGIN; the change; the same calls; d5_selftest; ROLLBACK.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE TABLE public.debate_judgments (debate_id uuid, judge_seat text, verdict_tag text, defense_standing text, challenge_standing text, truncated boolean, drv_uncured int);
INSERT INTO public.debate_judgments VALUES
 ('9a52d90b-9a15-4159-9019-ff71f0f31b79','chatgpt','BROKEN','COLLAPSED','PROP-DEPENDENT',false,4),
 ('9a52d90b-9a15-4159-9019-ff71f0f31b79','deepseek','PARTIAL','COLLAPSED','PROP-DEPENDENT',false,2),
 ('9a52d90b-9a15-4159-9019-ff71f0f31b79','gemini','PARTIAL','COLLAPSED','PROP-DEPENDENT',false,1),
 ('b335085b-010c-489c-bc63-6e2fac595dec','chatgpt','BROKEN','COLLAPSED','PROP-DEPENDENT',false,0),
 ('b335085b-010c-489c-bc63-6e2fac595dec','gemini','PARTIAL','PROP-DEPENDENT','PROP-DEPENDENT',false,0),
 ('b335085b-010c-489c-bc63-6e2fac595dec','qwen','HELD','PROP-DEPENDENT','SELF-SUPPORTED',false,0);
\i sql/live_aggregate_debate_panel.sql
\i sql/live_d5_outcome_for.sql
\i sql/live_d5_selftest.sql
\echo === live functions
SELECT run, a->>'framework_verdict' AS verdict, a->>'panel_split' AS split, public.d5_outcome_for(a->>'framework_verdict') AS outcome
  FROM (VALUES ('32212','9a52d90b-9a15-4159-9019-ff71f0f31b79'::uuid),('32228','b335085b-010c-489c-bc63-6e2fac595dec'::uuid)) v(run,id), LATERAL (SELECT public.aggregate_debate_panel(id) a) x;
BEGIN;
\i sql/item7_panel_ungraded.sql
\echo === after the change (inside the transaction)
SELECT run, a->>'framework_verdict' AS verdict, a->>'panel_split' AS split, public.d5_outcome_for(a->>'framework_verdict') AS outcome
  FROM (VALUES ('32212','9a52d90b-9a15-4159-9019-ff71f0f31b79'::uuid),('32228','b335085b-010c-489c-bc63-6e2fac595dec'::uuid)) v(run,id), LATERAL (SELECT public.aggregate_debate_panel(id) a) x;
SELECT public.d5_selftest()->>'pass' AS selftest_pass, public.d5_selftest()->>'failed' AS failed, pg_get_function_identity_arguments('public.aggregate_debate_panel'::regproc) AS signature;
ROLLBACK;
\echo === after ROLLBACK
SELECT public.aggregate_debate_panel('9a52d90b-9a15-4159-9019-ff71f0f31b79')->>'framework_verdict' AS run_32212_verdict;
