with r as (select * from debate_results order by created_at desc limit 1)
select r.id, r.created_at, r.run_token, r.outcome, r.challenger_model, r.defender_model, r.judged_by, r.panel_substitution, r.drv_removed,
 (select count(*) from debate_judgments j where j.debate_id=r.id) n_judg,
 (select string_agg(judge_seat||':'||coalesce(judge_api_model,'')||':'||coalesce(verdict_tag,''),' ') from debate_judgments j where j.debate_id=r.id) judges,
 (select string_agg(distinct status,',') from odv1_question_round_log q where q.run_token=r.run_token) qr,
 (select jsonb_object_agg(k, n) from (select coalesce(seat_role,'')||'/'||coalesce(seat,'')||'/'||coalesce(kind,'') k, count(*) n from debate_enforcer_log e where e.debate_id=r.id or e.run_token=r.run_token group by 1) x) enf,
 (select count(*) from debate_enforcer_log e where (e.debate_id=r.id or e.run_token=r.run_token) and coalesce(response_line,'')||coalesce(cure_reason,'') ilike '%pkgFRM%') pkgfrm,
 position('no reply in the batch call' in coalesce(r.review_notes,''))>0 e_pds, position('no body' in coalesce(r.review_notes,''))>0 e_nobody,
 (select count(*) from odv1_drv_removals d where d.debate_id=r.id) drv_rm
from r;
