BEGIN;
DROP TRIGGER IF EXISTS dfl_from_log ON public.debate_enforcer_log;
DROP VIEW IF EXISTS public.dfl_report;
DROP FUNCTION IF EXISTS public.dfl_strike(integer,text,text,text,text);
DROP FUNCTION IF EXISTS public.dfl_from_log();
DROP FUNCTION IF EXISTS public.dfl_put(public.debate_enforcer_log);
DROP FUNCTION IF EXISTS public.dfl_counted(text,text,text,text,text);
DROP TABLE IF EXISTS public.debater_fault_ledger;
COMMIT;
