-- ASK 424 input: the 245 stored claude_r1 texts that carry a DECLARED CHAIN heading (d1_all.json holds [run_token, claude_r1] for each).
-- Read:  select json_agg(json_build_array(run_token, claude_r1)) from debate_results where claude_r1 ~ 'DECLARED CHAIN';
-- Check (order-free; run 2026-11-18 23:15Z): n 245, m ae3c4ec952fdef57533504fabb3249ed. The same figure from d1_all.json: md5 of the sorted md5s of the texts, joined by ','.
select count(*) n, md5(string_agg(md5(claude_r1), ',' order by md5(claude_r1))) m from debate_results where claude_r1 ~ 'DECLARED CHAIN';
