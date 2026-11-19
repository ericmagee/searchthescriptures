CREATE OR REPLACE FUNCTION public.odv1_eng_label(e text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT CASE lower(coalesce(e,'')) WHEN 'chatgpt' THEN 'ChatGPT' WHEN 'deepseek' THEN 'DeepSeek' WHEN 'mimo' THEN 'MiMo' WHEN 'glm' THEN 'GLM' WHEN '' THEN '?' ELSE initcap(e) END
$function$
