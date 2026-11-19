CREATE OR REPLACE FUNCTION public.dash_odv1_judges(p_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
           'seat', judge_seat, 'model', judge_api_model, 'verdict', verdict_tag,
           'defense_standing', defense_standing, 'conceded_links', conceded_links,
           'challenge_standing', challenge_standing, 'challenger_conceded_links', challenger_conceded_links,
           'verdict_raw', verdict_raw, 'truncated', truncated)
         order by array_position(array['deepseek','gemini','grok','chatgpt','mimo','glm','qwen'], judge_seat), created_at), '[]'::jsonb)
  from debate_judgments where debate_id = p_id;
$function$
