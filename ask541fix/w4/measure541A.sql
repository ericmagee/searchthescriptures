-- 541 fix A dry run: new CASE over debate_enforcer_log (engine status = UNCURED for RECORD-ONLY rows)
WITH s AS (SELECT id, created_at, cure_status cur, CASE WHEN cure_status='RECORD-ONLY' THEN 'UNCURED' ELSE cure_status END eng, coalesce(cure_reason,'') w FROM debate_enforcer_log),
n AS (SELECT id, created_at, cur, CASE WHEN eng='UNCURED' AND (strpos(w,'RECORD-ONLY: nothing is sent back')>0 OR (strpos(w,'CURE (record-only until promoted)')>0 AND strpos(w,'ENFORCED, pkgACX')=0) OR strpos(w,'RECORD-ONLY here')>0 OR w LIKE '% (RECORD-ONLY)%') AND strpos(lower(w),'counted in drv_uncured')=0 THEN 'RECORD-ONLY' ELSE eng END nw FROM s)
SELECT created_at >= '2026-11-23 18:19:00+00' since_541, cur, nw, count(*) FROM n WHERE cur IS DISTINCT FROM nw GROUP BY 1,2,3;
-- result 14:0x CST 11-23: since 541: 52025, 52225 UNCURED->RECORD-ONLY; 51983 RECORD-ONLY->UNCURED. Before 541: 371 UNCURED->RECORD-ONLY (273 M1-M3 + 98 M4), not relabelled (541 policy).
