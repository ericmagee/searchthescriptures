-- Ground for P2D v6 (BB-7994), run 29 Oct 11:2x CDT by Worker_E.
-- (1) outcomes, unquarantined ODV1 rows since 17 Oct, by topic
SELECT topic, count(*) n, count(*) FILTER (WHERE outcome='UNDERDETERMINED') und FROM debate_results WHERE run_token LIKE 'ODV1-%' AND quarantine_reason IS NULL AND created_at >= '2026-10-17' GROUP BY 1;
-- (2) order of outcomes since 20 Oct (last 9 from 26 Oct: 5 UNDERDETERMINED)
SELECT created_at::date, run_token, outcome, panel_split FROM debate_results WHERE run_token LIKE 'ODV1-%' AND quarantine_reason IS NULL AND created_at >= '2026-10-20' ORDER BY created_at;
-- (3) seat RESULT lines (HELD tag) since 17 Oct
SELECT j.judge_seat, j.verdict_tag, substring(j.verdict_raw from 'RESULT: ([A-Z ]+?)(?: --|\n|$)') result, count(*) FROM debate_judgments j JOIN debate_results r ON r.id=j.debate_id WHERE r.run_token LIKE 'ODV1-%' AND r.quarantine_reason IS NULL AND r.created_at >= '2026-10-17' GROUP BY 1,2,3 ORDER BY 1,2,3;
-- Results: grok HELD 15 (9 UNDERDETERMINED), deepseek HELD 10 (5), gemini HELD 13 (5), glm HELD 7 (1). Regex misses rows with no RESULT line (null).
