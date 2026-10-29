-- Worker_E verify of BB-8109, 29 Oct 11:4x CDT. Population: ODV1, unquarantined, since 17 Oct, topic biological father.
-- (A) counted word vs written RESULT for cure-overturned seats
SELECT r.run_token, j.id, j.judge_seat, (regexp_match(j.verdict_raw, '\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: (\w+); COUNTED: (\w+)'))[2:3] orig_counted,
 (regexp_match(j.verdict_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1] written,
 judgment_result_word(j.verdict_raw, j.judge_seat, j.challenge_standing) counted
FROM debate_judgments j JOIN debate_results r ON r.id=j.debate_id
WHERE r.run_token LIKE 'ODV1-%' AND r.quarantine_reason IS NULL AND r.created_at >= '2026-10-17' AND r.topic='Did Christ have a biological father?' AND j.verdict_tag='HELD' AND j.verdict_raw ~ 'CORRECTED RESULT';
-- result: 793, 796, 801, 810, 811, 812, 820; written CHALLENGER WINS; counted UNDERDETERMINED x6, DEFENDER WINS x1 (812).
-- (C) second instrument: lines on STANDS/UNDERDETERMINED carrying a stating-ground phrase
SELECT r.run_token, j.judge_seat, l FROM debate_results r JOIN debate_judgments j ON j.debate_id=r.id,
 LATERAL unnest(regexp_split_to_array(replace(j.verdict_raw, '\n', E'\n'), E'\n')) l
WHERE r.run_token LIKE 'ODV1-%' AND r.quarantine_reason IS NULL AND r.created_at >= '2026-10-17' AND r.topic='Did Christ have a biological father?'
 AND l ~ '(STANDS|UNDERDETERMINED)' AND l ~* '(no [a-z ]{0,30}(verse|row|witness|quotation)[a-z ]{0,30}(states?|names?)|not stated by|does not state|names? a human begetter|states? that joseph)'
 AND l !~ '^\s*(RESULT|\[AUDIT|\[EXTRACTOR)';
-- result: 34 lines.
