CREATE OR REPLACE FUNCTION public.d5_outcome_for(p_framework_verdict text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  SELECT CASE upper(btrim(COALESCE(p_framework_verdict,'')))
           WHEN 'HELD'      THEN 'DEFENDER PREVAILS'
           WHEN 'BROKEN'    THEN 'CHALLENGER PREVAILS'
           WHEN 'PARTIAL'   THEN 'DEFENDER PREVAILS, WEAKENED'
           WHEN 'UNKNOWN'   THEN E'UNGRADED — REVIEW'
           WHEN 'CONTESTED' THEN E'UNGRADED — REVIEW'
           ELSE NULL
         END;
$function$;
