with nv as (select * from (
 WITH rep AS (
         SELECT r.id AS debate_id,
            r.run_token,
            r.created_at,
            e.value ->> 'seat'::text AS seat,
            e.value ->> 'api_model'::text AS api_model,
                CASE
                    WHEN (e.value ->> 'drv_uncured'::text) ~ '^[0-9]+$'::text THEN (e.value ->> 'drv_uncured'::text)::integer
                    ELSE NULL::integer
                END AS drv_uncured,
            'replaced'::text AS kind,
            e.value ->> 'replaced_by'::text AS replaced_by,
            e.value ->> 'replaced_by_model'::text AS replaced_by_model,
            e.value -> 'removed_rules'::text AS removed_rules
           FROM debate_results r
             CROSS JOIN LATERAL jsonb_array_elements(
                CASE
                    WHEN jsonb_typeof(r.drv_removed) = 'array'::text THEN r.drv_removed
                    ELSE '[]'::jsonb
                END) e(value)
        ), nc AS (
         SELECT r.id AS debate_id,
            r.run_token,
            r.created_at,
            j.judge_seat AS seat,
            j.judge_api_model AS api_model,
            j.drv_uncured,
            j.verdict_raw
           FROM debate_judgments j
             JOIN debate_results r ON r.id = j.debate_id
          WHERE COALESCE(j.drv_uncured, 0) > 0 AND NOT (EXISTS ( SELECT 1
                   FROM rep
                  WHERE rep.debate_id = r.id AND rep.seat = j.judge_seat))
        ), ncp AS (
         SELECT nc.*,
            rf.n_rf, rf.n_rf_distinct, rf.rf_text,
            al.n_tried, al.n_bad, al.tried
           FROM nc
             CROSS JOIN LATERAL ( SELECT count(*) AS n_rf, count(DISTINCT x.v) AS n_rf_distinct, min(x.v) AS rf_text
                   FROM ( SELECT substring(l.line FROM 'REMOVED FOR: drv_uncured [0-9]+: (.*)\]\s*$') AS v
                           FROM regexp_split_to_table(COALESCE(nc.verdict_raw, ''), '\n') l(line)
                          WHERE l.line ~ 'REMOVED FOR: drv_uncured [0-9]+: ') x) rf
             CROSS JOIN LATERAL ( SELECT count(*) AS n_tried,
                    count(*) FILTER (WHERE y.m IS NULL) AS n_bad,
                    jsonb_agg(jsonb_build_object('seat', y.m[1], 'alternate', y.m[2], 'model', y.m[3], 'result', y.m[4], 'why', y.m[5]) ORDER BY y.ord) FILTER (WHERE y.m IS NOT NULL) AS tried
                   FROM ( SELECT l.ord,
                            regexp_match(regexp_replace(regexp_replace(substring(l.line FROM 'ALTERNATE TRIED -- .*$'), '; REMOVED FOR: drv_uncured [0-9]+: .*$', ''), '\]\s*$', ''),
                              '^ALTERNATE TRIED -- SEAT: ([^;]*); ALTERNATE: ([^;]*); MODEL: ([^;]*); RESULT: ([^;]*); WHY: (.*)$') AS m
                           FROM regexp_split_to_table(COALESCE(nc.verdict_raw, ''), '\n') WITH ORDINALITY l(line, ord)
                          WHERE l.line ~ 'ALTERNATE TRIED -- ') y) al
        )
 SELECT rep.debate_id,
    rep.run_token,
    rep.created_at,
    rep.seat,
    rep.api_model,
    rep.drv_uncured,
    rep.kind,
    rep.replaced_by,
    rep.replaced_by_model,
    rep.removed_rules,
    NULL::jsonb AS alternates_tried
   FROM rep
UNION ALL
 SELECT ncp.debate_id,
    ncp.run_token,
    ncp.created_at,
    ncp.seat,
    ncp.api_model,
    ncp.drv_uncured,
    'not_counted'::text AS kind,
    NULL::text AS replaced_by,
    NULL::text AS replaced_by_model,
        CASE
            WHEN ncp.n_bad > 0 OR ncp.n_rf_distinct > 1 OR ncp.n_rf = 0 OR ncp.rf_text IS NULL OR btrim(ncp.rf_text) = '' THEN NULL::jsonb
            ELSE to_jsonb(string_to_array(ncp.rf_text, '; '))
        END AS removed_rules,
        CASE
            WHEN ncp.n_bad > 0 OR ncp.n_rf_distinct > 1 OR ncp.n_tried = 0 THEN NULL::jsonb
            ELSE ncp.tried
        END AS alternates_tried
   FROM ncp
) z),
old as (select * from debate_removals),
k_old as (select md5(string_agg((to_jsonb(r) - 'alternates_tried' || jsonb_build_object('removed_rules', case when kind='not_counted' then null else removed_rules end))::text, E'\n' order by (to_jsonb(r) - 'alternates_tried' - 'removed_rules')::text)) m, count(*) n from old r),
k_new as (select md5(string_agg((to_jsonb(r) - 'alternates_tried' || jsonb_build_object('removed_rules', case when kind='not_counted' then null else removed_rules end))::text, E'\n' order by (to_jsonb(r) - 'alternates_tried' - 'removed_rules')::text)) m, count(*) n from nv r),
exp as (select r.id debate_id, j.judge_seat seat, (select jsonb_agg(distinct x) from (select distinct m[1] l from regexp_matches(j.verdict_raw,'REMOVED FOR: drv_uncured \d+: ([^\]\n]*)','g') m) q, regexp_split_to_table(q.l,';\s*') x) e
 from debate_judgments j join debate_results r on r.id=j.debate_id where coalesce(j.drv_uncured,0)>0),
g3 as (select v.run_token, v.seat, v.removed_rules got, e.e expected from nv v join exp e using (debate_id, seat) where v.kind='not_counted' and (v.removed_rules is not null or e.e is not null))
select jsonb_build_object(
 'old', (select to_jsonb(k_old) from k_old), 'new', (select to_jsonb(k_new) from k_new),
 'rp_null', (select count(*) from nv where kind='replaced' and removed_rules is null),
 'rp_alt', (select count(*) from nv where kind='replaced' and alternates_tried is not null),
 'old_cols_on_replaced_identical', (select count(*) from old o join nv n on o.debate_id=n.debate_id and o.seat=n.seat and o.kind=n.kind where o.kind='replaced' and o.removed_rules is distinct from n.removed_rules),
 'nc_rules_null', (select count(*) from nv where kind='not_counted' and removed_rules is null),
 'nc_alt_null', (select count(*) from nv where kind='not_counted' and alternates_tried is null),
 'g3', (select jsonb_agg(jsonb_build_object('rt',left(run_token,10),'seat',seat,'got',got,'set_equal',(select coalesce(jsonb_agg(x order by x),'[]') from jsonb_array_elements_text(coalesce(got,'[]')) x) = (select coalesce(jsonb_agg(x order by x),'[]') from jsonb_array_elements_text(coalesce(expected,'[]')) x))) from g3),
 'g4', (select jsonb_agg(jsonb_build_object('rules',removed_rules,'alt',alternates_tried)) from nv where run_token='ODV1-37372-6n5n7sh9' and seat='sol'),
 'none_rows', (select jsonb_agg(jsonb_build_object('rt',left(n.run_token,10),'seat',n.seat,'n_alt',jsonb_array_length(n.alternates_tried),'alts',(select jsonb_agg(a->>'alternate') from jsonb_array_elements(n.alternates_tried) a))) from nv n join debate_judgments j on j.debate_id=n.debate_id and j.judge_seat=n.seat where n.kind='not_counted' and j.verdict_raw like '%ALTERNATE TRIED%' and j.verdict_raw like '%ALTERNATE: none%')
) r