-- ASK 554 and ASK 555 (W3). Two read-only audit views over debate_enforcer_log.
-- Nothing in the engine reads them. Revert: DROP VIEW public.enforcer_rulings_by_collision; DROP VIEW public.enforcer_pushes_by_side;
-- Tested 17:50 CST 11-23 by running both SELECT bodies as written here (no view created).

-- ASK 554: every enforcer ruling on a collision, with a flag when the enforcer gave
-- different RIGHT words on the same collision in the same run.
-- One row per stored log row (a ruling stored on two passes shows twice).
CREATE VIEW public.enforcer_rulings_by_collision AS
SELECT run_token, item, seat, rule, id, ruling, right_word,
       (min(right_word) OVER w) <> (max(right_word) OVER w) AS split
FROM (
  SELECT l.run_token, l.item, l.seat, l.rule, l.id, m[1] AS ruling, btrim(m[2]) AS right_word
  FROM public.debate_enforcer_log l
  CROSS JOIN LATERAL regexp_match(l.cure_reason, 'ENFORCER (AGREE|DISAGREE) \(right: ([A-Z ]+)\)') m
  WHERE l.rule IN ('E-COL','E-HOLD') AND m IS NOT NULL
) s
WINDOW w AS (PARTITION BY run_token, item);

-- ASK 555: every push from UNDERDETERMINED to BROKEN, by the side it went against.
-- One row per run, judge and collision (stored_rows says how many log rows carry it).
CREATE VIEW public.enforcer_pushes_by_side AS
SELECT run_token, seat, item, against, first_id, stored_rows,
       count(*) OVER (PARTITION BY run_token, against) AS pushes_against_side
FROM (
  SELECT DISTINCT ON (run_token, seat, item) run_token, seat, item, against, id AS first_id,
         count(*) OVER (PARTITION BY run_token, seat, item) AS stored_rows
  FROM (
    SELECT l.run_token, l.id, l.seat, l.item,
      CASE
        WHEN (l.cure_reason ~ 'ANSWER \[CR' OR l.cure_reason ~* 'defender.s answer')
         AND (l.cure_reason ~ 'ANSWER \[DR' OR l.cure_reason ~* 'challenger.s answer') THEN 'BOTH NAMED'
        WHEN l.cure_reason ~ 'ANSWER \[CR' OR l.cure_reason ~* 'defender.s answer' THEN 'DEFENDER'
        WHEN l.cure_reason ~ 'ANSWER \[DR' OR l.cure_reason ~* 'challenger.s answer' THEN 'CHALLENGER'
        ELSE 'UNSTATED'
      END AS against
    FROM public.debate_enforcer_log l
    WHERE l.rule = 'E-HOLD'
      AND l.cure_reason LIKE '%right: BROKEN%'
      AND l.cure_reason LIKE '%judge wrote UNDERDETERMINED%'
  ) r
  ORDER BY run_token, seat, item, id
) s;

-- Results of the SELECT bodies (17:50 CST 11-23):
-- 554, run ODV1-41822-nnfywk74: 11 collisions; split = true on D1 vs C6, D2 vs C2, D3 vs C3, D3 vs C4, D3 vs C5, D4 vs C6.
--      All runs: 2,736 rows.
-- 555, run ODV1-41822-nnfywk74: 7 rows; 6 DEFENDER, 1 UNSTATED (chatgpt, D3 vs C4), 0 CHALLENGER. First ids 52448, 52452, 52453, 52455, 52458, 52678, 52800.
--      Run 41736: 2 rows, both DEFENDER. All runs: 160 pushes; DEFENDER 55 (34 runs), CHALLENGER 46 (21 runs), UNSTATED 58 (29 runs), BOTH NAMED 1.
-- Rev 2 (W1 condition C1, Wall 11045): each push is classed by its FIRST stored row (DISTINCT ON), so a push whose two
-- stored passes read differently is counted once (run 38051, luna, D3 vs C3 was counted twice in rev 1: 161 and BOTH NAMED 2).
-- Difference from the plan (BUILD_PLANS_draft2.md): the plan did not say that a push is stored on two passes;
-- without the GROUP BY run 41822 gives 13 rows, not the 7 the plan's test expects. The GROUP BY gives the 7.
-- Limit: "against" is read from the wording of the enforcer's reason; 58 of 161 pushes name no side.
