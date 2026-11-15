with n as (select * from ( WITH rep AS (
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
   FROM ncp) z), o as (select * from public.debate_removals),
 cmp as (select (select count(*) from o) o_rows, (select count(*) from n) n_rows,
  (select count(*) from (select debate_id,run_token,created_at,seat,api_model,drv_uncured,kind,replaced_by,replaced_by_model from o except all select debate_id,run_token,created_at,seat,api_model,drv_uncured,kind,replaced_by,replaced_by_model from n) a) old_not_in_new,
  (select count(*) from (select debate_id,run_token,created_at,seat,api_model,drv_uncured,kind,replaced_by,replaced_by_model from n except all select debate_id,run_token,created_at,seat,api_model,drv_uncured,kind,replaced_by,replaced_by_model from o) a) new_not_in_old,
  (select count(*) from (select debate_id,seat,removed_rules::text from o where kind='replaced' except all select debate_id,seat,removed_rules::text from n where kind='replaced') a) replaced_rules_diff,
  (select count(*) from n where kind='not_counted') nc_rows,
  (select count(*) from n where kind='not_counted' and removed_rules is not null) nc_rules,
  (select count(*) from n where kind='not_counted' and alternates_tried is not null) nc_tried,
  (select count(*) from n where kind='replaced' and removed_rules is null) rep_null,
  (select count(*) from n where kind='replaced' and alternates_tried is not null) rep_tried)
select row_to_json(cmp) from cmp