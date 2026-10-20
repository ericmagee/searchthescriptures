-- The 9 judgments measured (read-only). Save the json_agg value as rows.json, then: node measure.cjs ../p4/drv_block_0b3cbac.js rows.json
SELECT json_agg(x) FROM (SELECT '27259' src, judge_seat seat, verdict_tag tag, defense_standing ds, conceded_links conc, verdict_raw raw FROM debate_judgments WHERE debate_id='56e75954-c776-4e7e-8d26-94e3a46a5c09'
 UNION ALL SELECT 'replay '||id, judge_seat, verdict_tag, defense_standing, conceded_links, verdict_raw FROM debate_replay_judgments WHERE id BETWEEN 233 AND 238) x;
