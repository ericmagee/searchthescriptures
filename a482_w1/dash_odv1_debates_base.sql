CREATE OR REPLACE FUNCTION public.dash_odv1_debates()
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb) from (
    select r.id, r.topic, r.created_at, r.run_token,
           r.defender_engine, r.defender_profile, r.defender_model,
           r.challenger_engine, r.challenger_profile, r.challenger_model,
           r.outcome, r.panel_verdict, r.panel_split, r.framework_verdict,
           r.defense_standing, r.challenge_standing, r.conceded_links, r.challenger_conceded_links,
           r.review_notes,
           case when (r.defender_engine='mimo' and r.defender_model like '%/%')
                  or (r.challenger_engine='mimo' and r.challenger_model like '%/%')
                then 'MiMo ran through OpenRouter (mis-routed)' end as note,
           (select coalesce(jsonb_agg(jsonb_build_object('seat', j.judge_seat, 'verdict', j.verdict_tag,
                      'defense_standing', j.defense_standing, 'conceded_links', j.conceded_links,
                      'challenge_standing', j.challenge_standing, 'challenger_conceded_links', j.challenger_conceded_links)
                    order by array_position(array['deepseek','gemini','grok','chatgpt','mimo','glm','qwen'], j.judge_seat)), '[]'::jsonb)
              from debate_judgments j where j.debate_id = r.id) as judges
    from debate_results r where r.variant='ORACLE_DEBATE_V1'
    order by r.created_at desc limit 40) x;
$function$
