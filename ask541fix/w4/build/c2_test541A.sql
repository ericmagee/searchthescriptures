SET LOCAL truth.session_id = 'session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $t$
DECLARE r text;
BEGIN
  IF md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure)) <> '53b69433da746729f10ecea51730670b' THEN RAISE EXCEPTION 'GUARD'; END IF;
  EXECUTE $f$CREATE OR REPLACE FUNCTION public.enforcer_status_stored(st text, why text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  /* ASK 541 (plan rev 1, W3): an UNCURED row that is record-only by the engine's own marker is stored as RECORD-ONLY; a row whose cure_reason says it is counted in drv_uncured is never relabelled.
     541 fix A (plan Wall 10881): M4 " (RECORD-ONLY)" (the engine's suffix on uncounted gate rows) is a marker; M2 does not apply to an E-ASSUME row counted under ASK 531 ("ENFORCED, pkgACX"). */
  SELECT CASE
    WHEN st = 'UNCURED'
     AND (   strpos(coalesce(why,''), 'RECORD-ONLY: nothing is sent back') > 0
          OR (strpos(coalesce(why,''), 'CURE (record-only until promoted)') > 0 AND strpos(coalesce(why,''), 'ENFORCED, pkgACX') = 0)
          OR strpos(coalesce(why,''), 'RECORD-ONLY here') > 0
          OR strpos(coalesce(why,''), ' (RECORD-ONLY)') > 0)
     AND strpos(lower(coalesce(why,'')), 'counted in drv_uncured') = 0
    THEN 'RECORD-ONLY'
    ELSE st
  END
$function$;
$f$;
  UPDATE debate_enforcer_log SET cure_status = enforcer_status_stored(CASE WHEN cure_status='RECORD-ONLY' THEN 'UNCURED' ELSE cure_status END, cure_reason) WHERE id IN (51983,52025,52225);
  SELECT string_agg(x, ' | ') INTO r FROM (
    SELECT 'T1 suffix='||enforcer_status_stored('UNCURED','argon item (RECORD-ONLY)') x
    UNION ALL SELECT 'T2 M2='||enforcer_status_stored('UNCURED','CURE (record-only until promoted)')
    UNION ALL SELECT 'T3 M2+pkgACX='||enforcer_status_stored('UNCURED','CURE (record-only until promoted); ENFORCED, pkgACX')
    UNION ALL SELECT 'T4 M3+counted='||enforcer_status_stored('UNCURED','RECORD-ONLY here; counted in drv_uncured')
    UNION ALL SELECT 'T5 suffix+counted='||enforcer_status_stored('UNCURED','x (RECORD-ONLY) counted in drv_uncured')
    UNION ALL SELECT 'T6 CURED='||enforcer_status_stored('CURED','x (RECORD-ONLY)')
    UNION ALL SELECT 'T7 M1='||enforcer_status_stored('UNCURED','RECORD-ONLY: nothing is sent back')
    UNION ALL SELECT 'T8 plain='||enforcer_status_stored('UNCURED','plain reason')
    UNION ALL SELECT 'T9 null='||enforcer_status_stored('UNCURED',NULL)
    UNION ALL (SELECT 'row '||id||'='||cure_status FROM debate_enforcer_log WHERE id IN (51983,52025,52225) ORDER BY id)
    UNION ALL SELECT 'fn_md5='||md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure))
  ) s;
  RAISE EXCEPTION 'C2 ROLLED BACK: %', r;
END $t$;