CREATE OR REPLACE FUNCTION public.enforcer_status_stored(st text, why text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  /* ASK 541 (plan rev 1, W3): an UNCURED row that is record-only by the engine's own marker is stored as RECORD-ONLY; a row whose cure_reason says it is counted in drv_uncured is never relabelled. */
  SELECT CASE
    WHEN st = 'UNCURED'
     AND (   strpos(coalesce(why,''), 'RECORD-ONLY: nothing is sent back') > 0
          OR strpos(coalesce(why,''), 'CURE (record-only until promoted)') > 0
          OR strpos(coalesce(why,''), 'RECORD-ONLY here') > 0)
     AND strpos(lower(coalesce(why,'')), 'counted in drv_uncured') = 0
    THEN 'RECORD-ONLY'
    ELSE st
  END
$function$;
