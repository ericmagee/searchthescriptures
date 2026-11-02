-- judge_fix2 UNDO of step 1 (NOT APPLIED). Run only after the flow package is undone (step 3), so nothing calls the function.
-- It deletes every logged exchange; export the table first if any rows must be kept.
DROP FUNCTION IF EXISTS public.record_enforcer_log(uuid, text, jsonb);
DROP TABLE IF EXISTS public.debate_enforcer_log;
