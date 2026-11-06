-- pkgJFL anon test (W3 2652): read model_config_jfl as anon, the way Accept Models and Fetch Models do, in one rolled-back block.
-- Run with SET LOCAL truth.session_id=... first. It always ends in an exception that carries the result; nothing is kept.
DO $T$ DECLARE a text; b text; c text; BEGIN
BEGIN EXECUTE 'SET LOCAL ROLE anon'; EXECUTE $Q$SELECT count(*)::text||' rows / '||count(jfl_block)||' blocks' FROM (SELECT * FROM public.model_config_jfl WHERE active) x$Q$ INTO a; EXCEPTION WHEN others THEN a:='ERR '||SQLERRM; END;
EXECUTE 'RESET ROLE';
EXECUTE $Q$INSERT INTO public.judge_fault_ledger(log_id,run,run_token,seat,seat_role,judge_model,fault_kind,item,flagged_line,cure_reason) VALUES
 (-91,900001,'ODV1-900001-x','sol','panel','openai/gpt-6.1-sol','K-W','t1','l1','w1'),(-92,900002,'ODV1-900002-x','sol','panel','openai/gpt-6.1-sol','K-W','t2','l2','w2')$Q$;
BEGIN EXECUTE 'SET LOCAL ROLE anon'; EXECUTE $Q$SELECT 'sol block '||(jfl_block IS NOT NULL)||', starts '||left(jfl_block,22) FROM public.model_config_jfl WHERE active AND seat='sol'$Q$ INTO b; EXCEPTION WHEN others THEN b:='ERR '||SQLERRM; END;
BEGIN EXECUTE $Q$SELECT count(*)::text FROM public.judge_fault_ledger$Q$ INTO c; EXCEPTION WHEN others THEN c:='refused ('||SQLERRM||')'; END;
EXECUTE 'RESET ROLE';
RAISE EXCEPTION 'JFL ANON: select * as anon: % | with 3 runs of sol K-W: % | anon reads the ledger table: %', a, b, c;
END $T$;
-- Expected after jfl_fix_anon.sql: "15 rows / 0 blocks | sol block true, starts [[JUDGE FAULT LEDGER]] | refused (permission denied ...)".
-- Before it (live at 33195): the first part is "ERR permission denied for table judge_fault_ledger".
