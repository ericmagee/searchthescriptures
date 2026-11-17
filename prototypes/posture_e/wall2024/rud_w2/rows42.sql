-- ASK 354 replay input: run with the Supabase connector; save the tool output file, then: node rows42_extract.cjs <saved output file>  (writes rows42.json)
select json_agg(json_build_object('id',id,'seat',judge_seat,'raw',verdict_raw) order by id) from debate_judgments where created_at >= '2026-11-14' and created_at < '2026-11-17 08:00:00+00';
