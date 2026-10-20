-- FALSIFIER: run before and after. Per-mark counts; and an md5 over every OTHER column of every row must be identical.
SELECT challenger_chain_mark, count(*) FROM debate_results GROUP BY 1 ORDER BY 1;
SELECT md5(string_agg(md5((to_jsonb(d) - 'challenger_chain_mark')::text), '' ORDER BY id)) other_cols_md5, count(*) FROM debate_results d;
