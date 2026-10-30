-- BB-8172 / BB-8263: DG-61 one-verse-demand scan over one run's judge text (panel judgments + single judge).
-- Set the run token in the CTE. Returns one row per regex match: seat, matched line. Classification is by hand:
-- for each line, which side's chain is dismissed for one verse not stating the conclusion (DEFENDER / CHALLENGER),
-- or BOTH/NEITHER (e.g. "no verse states Mary's descent either way"); duplicates in the single judge's text
-- (the same line with [L1] and (L1) forms) are counted once.
WITH run AS (SELECT id, independent_verdict_raw FROM debate_results WHERE run_token = 'ODV1-29609-uo88rcr2'),
pat AS (SELECT '([^.\n]{0,160}(in (their|its) own words|does not (in its own words )?state|do not (in their own words )?state|names? no (immediate )?(begetter|parent|father)|silent on|no verse (states|names|gives)|do not name|does not name)[^.\n]{0,120})'::text AS re)
SELECT j.judge_seat AS seat, m[1] AS line
FROM run, pat, debate_judgments j, LATERAL regexp_matches(j.verdict_raw, pat.re, 'gi') m
WHERE j.debate_id = run.id AND m[1] NOT LIKE '%AUDIT v2%'
UNION ALL
SELECT 'single', m[1]
FROM run, pat, LATERAL regexp_matches(run.independent_verdict_raw, pat.re, 'gi') m
WHERE m[1] NOT LIKE '%AUDIT v2%'
ORDER BY 1;
