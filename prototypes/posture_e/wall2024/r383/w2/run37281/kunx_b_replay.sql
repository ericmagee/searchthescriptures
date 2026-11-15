-- W2 replay of 6718 (b): lowercase "assum*" match on stored UNEXHIBITED count lines (debate_enforcer_log flagged_line/response_line with "CONCEDED LINKS:").
-- Result 05:58Z 11-15: 337 distinct lines, 66 runs; current /\bASSUMES\b/ hits 44; widened-only hits 27 (17 runs): 15 true assumed-fact reasons (6 runs: 32998, 33025, 33311, 35296, 36968 x6, 37281 x5), 12 false (spare/negation prose: "not an assumed fact", "rather than assuming", a quoted charge).
with L as (select distinct on (run_token, seat, t) run_token, seat, t from (
  select run_token, seat, flagged_line t from debate_enforcer_log where flagged_line ~ 'CONCEDED LINKS:'
  union all select run_token, seat, response_line from debate_enforcer_log where response_line ~ 'CONCEDED LINKS:') x where t ~ 'UNEXHIBITED')
select run_token, seat, t from L where t !~ '\mASSUMES\M' and t ~* '\massum(es|ed|ing|ption)\M' order by run_token;
