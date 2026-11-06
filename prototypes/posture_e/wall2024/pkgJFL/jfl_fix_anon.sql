-- pkgJFL fix (run 33195: Accept Models failed, "permission denied for table judge_fault_ledger"). For the live database, where jfl.sql is
-- already applied. jfl_block() becomes SECURITY DEFINER, so model_config_jfl reads the ledger for anon. Anon gets no SELECT on the ledger
-- itself (it holds the judges' own lines); the only path is the block one model's row carries. Revert: ALTER ... SECURITY INVOKER.
-- Needs SET LOCAL truth.session_id=... in the same call.
ALTER FUNCTION public.jfl_block(text) SECURITY DEFINER SET search_path=public;
