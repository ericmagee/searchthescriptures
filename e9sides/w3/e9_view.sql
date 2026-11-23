-- E9 rev 1 (W3). Read-only: a view and column comments. No column is renamed, no row changes, no engine node changes. Rev 1 drops the comments on defender_r4 and challenger_r4: those names already match their sides, and each already holds a comment (judge_fix3 B4) that rev 0 would have overwritten.
CREATE VIEW public.debate_rounds_by_side WITH (security_invoker = true) AS
SELECT id, run_token, created_at, defender_profile, challenger_profile,
  CASE WHEN defender_profile='oracle' THEN 'DEFENDER' WHEN challenger_profile='oracle' THEN 'CHALLENGER' ELSE 'NONE' END AS oracle_side,
  claude_r1 AS defender_r1, claude_r2 AS defender_r2, engine_r3 AS defender_r3, defender_r4,
  engine_r1 AS challenger_r1, engine_r2 AS challenger_r2, challenger_r3, challenger_r4,
  CASE WHEN defender_profile='oracle' THEN claude_r1 WHEN challenger_profile='oracle' THEN engine_r1 END AS oracle_r1,
  CASE WHEN defender_profile='oracle' THEN claude_r2 WHEN challenger_profile='oracle' THEN engine_r2 END AS oracle_r2,
  CASE WHEN defender_profile='oracle' THEN engine_r3 WHEN challenger_profile='oracle' THEN challenger_r3 END AS oracle_r3,
  CASE WHEN defender_profile='oracle' THEN defender_r4 WHEN challenger_profile='oracle' THEN challenger_r4 END AS oracle_r4,
  CASE WHEN defender_profile='oracle' THEN engine_r1 WHEN challenger_profile='oracle' THEN claude_r1 END AS opponent_r1,
  CASE WHEN defender_profile='oracle' THEN engine_r2 WHEN challenger_profile='oracle' THEN claude_r2 END AS opponent_r2,
  CASE WHEN defender_profile='oracle' THEN challenger_r3 WHEN challenger_profile='oracle' THEN engine_r3 END AS opponent_r3,
  CASE WHEN defender_profile='oracle' THEN challenger_r4 WHEN challenger_profile='oracle' THEN defender_r4 END AS opponent_r4
FROM public.debate_results;
COMMENT ON COLUMN public.debate_results.claude_r1 IS 'DEFENDER round 1. Not Claude and not the Oracle unless defender_profile=oracle. Read through debate_rounds_by_side.';
COMMENT ON COLUMN public.debate_results.claude_r2 IS 'DEFENDER round 2. Not Claude and not the Oracle unless defender_profile=oracle. Read through debate_rounds_by_side.';
COMMENT ON COLUMN public.debate_results.engine_r3 IS 'DEFENDER round 3 (despite the name). Read through debate_rounds_by_side.';
COMMENT ON COLUMN public.debate_results.engine_r1 IS 'CHALLENGER round 1 (despite the name). Read through debate_rounds_by_side.';
COMMENT ON COLUMN public.debate_results.engine_r2 IS 'CHALLENGER round 2 (despite the name). Read through debate_rounds_by_side.';
COMMENT ON COLUMN public.debate_results.challenger_r3 IS 'CHALLENGER round 3. Read through debate_rounds_by_side.';
