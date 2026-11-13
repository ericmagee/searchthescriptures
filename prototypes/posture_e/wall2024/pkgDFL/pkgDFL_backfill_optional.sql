-- OPTIONAL, a separate choice for the operator: record the confirmed closing contradictions already stored
-- (runs before the write). Reads debate_enforcer_log; writes only debater_fault_ledger.
BEGIN;
SELECT count(public.dfl_put(l)) AS rows_read FROM public.debate_enforcer_log l WHERE l.rule = 'E-CLOSECON';
COMMIT;
