-- W2 grade queries for ASK 327 rev 2 (debate_removals: removed_rules + alternates_tried on not_counted rows). READ-ONLY.
-- BASELINE measured 2026-11-15 ~09:10 CST, before the build:
--   rows 124 = not_counted 69 + replaced 55; replaced with removed_rules NULL = 41
--   md5 of all rows (old columns, to_jsonb ordered) = 1d5bba03fbe48026bbeaf1ba41381af2
--   10 not_counted rows carry "REMOVED FOR:" in debate_judgments.verdict_raw (expected arrays below; split on "; ", one array even when the line repeats)
-- G1 old columns byte-identical and row count unchanged:
select count(*) n, md5(string_agg((to_jsonb(r) - 'alternates_tried' || jsonb_build_object('removed_rules', case when kind='not_counted' then null else removed_rules end))::text, E'\n' order by (to_jsonb(r) - 'alternates_tried' - 'removed_rules')::text)) m_old from debate_removals r;
-- (compare m_old to the same expression run on the BASELINE; run it now on live and record it before the build)
-- G2 replaced rows untouched, 41 NULL removed_rules stay NULL:
select count(*) filter (where kind='replaced' and removed_rules is null) rp_null, count(*) filter (where kind='replaced' and alternates_tried is not null) rp_alt from debate_removals;
-- G3 expected not_counted removed_rules (independent parse, compare row by row with the view):
with exp as (select r.id debate_id, j.judge_seat seat, (select jsonb_agg(distinct x) from (select distinct m[1] l from regexp_matches(j.verdict_raw,'REMOVED FOR: drv_uncured \d+: ([^\]\n]*)','g') m) q, regexp_split_to_table(q.l,';\s*') x) e
 from debate_judgments j join debate_results r on r.id=j.debate_id where coalesce(j.drv_uncured,0)>0)
select v.run_token, v.seat, v.removed_rules got, e.e expected, (v.removed_rules is not distinct from e.e) ok from debate_removals v join exp e using (debate_id, seat) where v.kind='not_counted' and (v.removed_rules is not null or e.e is not null) order by 1,2;
-- NOTE: jsonb_agg(distinct) sorts; compare as sets if the build keeps source order.
-- G4 37372 sol: removed_rules ["K-C (cure) x1","E-GATE CONTRADICTION x1"]; alternates_tried 2 entries, hydrogen, NOT SEATED, reasons finish length / no JSON object.
select removed_rules, alternates_tried from debate_removals where run_token='ODV1-37372-6n5n7sh9' and seat='sol';
-- G5 variants: 34016 luna suffix "(read 1, count differs)" (state kept/stripped); 35379 sol long list (2 items); 34726 luna 2 items;
--    rows with BOTH "ALTERNATE TRIED" and "ALTERNATE: none" (34726 sol, 34852 chatgpt+sol, 35379 sol): alternates_tried must not invent a seat for the "none" line.
-- G6 rows with no parseable line -> both new columns NULL (count them):
select count(*) filter (where kind='not_counted' and removed_rules is null) nc_rules_null, count(*) filter (where kind='not_counted' and alternates_tried is null) nc_alt_null from debate_removals;
-- G7 readers: no function/view other than the two views reads either view (re-run the pg_proc / pg_class scan from Wall 6881).
