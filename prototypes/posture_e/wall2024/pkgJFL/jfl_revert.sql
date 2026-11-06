-- pkgJFL revert: drops only what jfl.sql created (point Accept Models and Fetch Models back at model_config first).
BEGIN;
DROP VIEW IF EXISTS public.model_config_jfl;
DROP FUNCTION IF EXISTS public.jfl_block(text);
DROP VIEW IF EXISTS public.jfl_report;
DROP TRIGGER IF EXISTS jfl_from_log ON public.debate_enforcer_log;
DROP FUNCTION IF EXISTS public.jfl_from_log();
DROP FUNCTION IF EXISTS public.jfl_strike(int,text,text,text,text,text);
DROP FUNCTION IF EXISTS public.jfl_model(text,text,text);
DROP FUNCTION IF EXISTS public.jfl_counted(text,text,text,text,text);
DROP TABLE IF EXISTS public.judge_fault_ledger;
COMMIT;
