-- pkgODD read-only replay: recomputes, for every stamped debate in the last 8 days, what the patched block would write.
-- ds_new / cs_new = 'TIE' where the live function left the field null on an exact split of an even count of counted seats.
with r as (select id, split_part(run_token,'-',2) run, created_at, defense_standing ds, challenge_standing cs from debate_results where panel_verdict is not null and created_at > now() - interval '8 days'),
c as (select r.*, (select array_agg(s->>'judge_seat') from jsonb_array_elements(aggregate_debate_panel(r.id)->'seats') s where (s->>'clean')::boolean) counted from r),
s as (select c.*, coalesce(cardinality(counted),0) nc,
 (select string_agg(x||':'||n, ',') from (select coalesce(defense_standing,'null') x, count(*) n from debate_judgments j where j.debate_id=c.id and j.judge_seat=any(coalesce(counted,'{}')) group by 1) t) dsv,
 (select string_agg(x||':'||n, ',') from (select coalesce(challenge_standing,'null') x, count(*) n from debate_judgments j where j.debate_id=c.id and j.judge_seat=any(coalesce(counted,'{}')) group by 1) t) csv,
 (select count(*) from (select defense_standing x, count(*) n from debate_judgments j where j.debate_id=c.id and j.judge_seat=any(coalesce(counted,'{}')) group by 1) t where x is not null and n*2=cardinality(counted)) ds2,
 (select count(*) from (select challenge_standing x, count(*) n from debate_judgments j where j.debate_id=c.id and j.judge_seat=any(coalesce(counted,'{}')) group by 1) t where x is not null and n*2=cardinality(counted)) cs2
 from c)
select run, nc, ds, dsv, case when ds is null and nc>0 and nc%2=0 and ds2=2 then 'TIE' end ds_new, cs, csv, case when cs is null and nc>0 and nc%2=0 and cs2=2 then 'TIE' end cs_new
from s order by created_at;
