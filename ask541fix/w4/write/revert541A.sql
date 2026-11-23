-- ASK 541 fix A revert (W4, seat 35). One transaction.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $g$ BEGIN
  IF md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure)) <> '6b17204de59d589c5472d650d93fbd11'
    THEN RAISE EXCEPTION 'GUARD: live functiondef is not the 541A text 6b17204d'; END IF;
END $g$;
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

UPDATE debate_enforcer_log SET cure_status='UNCURED' WHERE id IN (52025,52225) AND cure_status='RECORD-ONLY';
UPDATE debate_enforcer_log SET cure_status='RECORD-ONLY' WHERE id=51983 AND cure_status='UNCURED';
DO $c$ BEGIN
  IF md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure)) <> '53b69433da746729f10ecea51730670b'
    THEN RAISE EXCEPTION 'REVERT CHECK: functiondef not back to 53b69433'; END IF;
END $c$;
COMMIT;
