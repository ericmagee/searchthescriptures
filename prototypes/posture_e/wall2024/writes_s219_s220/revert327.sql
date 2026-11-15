-- Revert of ASK 327: the debate_removals view before 15 Nov (md5 of viewdef 1a74286139e370b742a044a9c0924f16). The new column must be dropped, so DROP then CREATE.
DROP VIEW public.debate_removals;
CREATE VIEW public.debate_removals AS
 WITH rep AS (
         SELECT r.id AS debate_id, r.run_token, r.created_at,
            (e.value ->> 'seat'::text) AS seat, (e.value ->> 'api_model'::text) AS api_model,
                CASE WHEN ((e.value ->> 'drv_uncured'::text) ~ '^[0-9]+$'::text) THEN ((e.value ->> 'drv_uncured'::text))::integer ELSE NULL::integer END AS drv_uncured,
            'replaced'::text AS kind, (e.value ->> 'replaced_by'::text) AS replaced_by, (e.value ->> 'replaced_by_model'::text) AS replaced_by_model, (e.value -> 'removed_rules'::text) AS removed_rules
           FROM (debate_results r CROSS JOIN LATERAL jsonb_array_elements(CASE WHEN (jsonb_typeof(r.drv_removed) = 'array'::text) THEN r.drv_removed ELSE '[]'::jsonb END) e(value))
        )
 SELECT rep.debate_id, rep.run_token, rep.created_at, rep.seat, rep.api_model, rep.drv_uncured, rep.kind, rep.replaced_by, rep.replaced_by_model, rep.removed_rules FROM rep
UNION ALL
 SELECT r.id AS debate_id, r.run_token, r.created_at, j.judge_seat AS seat, j.judge_api_model AS api_model, j.drv_uncured, 'not_counted'::text AS kind, NULL::text AS replaced_by, NULL::text AS replaced_by_model, NULL::jsonb AS removed_rules
   FROM (debate_judgments j JOIN debate_results r ON ((r.id = j.debate_id)))
  WHERE ((COALESCE(j.drv_uncured, 0) > 0) AND (NOT (EXISTS ( SELECT 1 FROM rep WHERE ((rep.debate_id = r.id) AND (rep.seat = j.judge_seat))))));
