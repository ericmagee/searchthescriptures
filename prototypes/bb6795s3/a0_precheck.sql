-- A0 PRECHECK (BB-6795 step 3). Read-only. Every column must read as the comment says, or the act stops here.
-- Also, outside SQL: no ORACLE_DEBATE_V1 execution running; workflow moMxiV4Irg1uRBZN versionId = activeVersionId = af3c8f7c;
-- the eight nodes in nodes.txt read their LIVE md5 (md5 of the code with a newline appended only if it does not already end in one, as a5 computes it).
SELECT (SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname='chk_challenger_chain_mark')
         = 'CHECK (((challenger_chain_mark IS NULL) OR (challenger_chain_mark = ANY (ARRAY[''FORGED''::text, ''STRAINED''::text, ''SLACK''::text]))))' AS check_is_measured,  -- true
       md5(pg_get_functiondef('derive_debate_outcome(uuid)'::regprocedure)) = '379e6e5543f1a74020a060da3adeb64a' AS derive_is_measured,           -- true
       (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='debate_results'
          AND column_name IN ('citation_check','citation_block','defender_chain_mark')) AS new_cols_present,                                       -- 0
       (SELECT count(*) FROM debate_results WHERE challenger_chain_mark='FOOTED') AS footed_rows,                                                 -- 0
       (SELECT json_object_agg(coalesce(challenger_chain_mark,'NULL'),c) FROM (SELECT challenger_chain_mark,count(*) c FROM debate_results GROUP BY 1) x) AS marks;  -- recorded in the act row
