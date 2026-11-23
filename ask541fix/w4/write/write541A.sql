-- ASK 541 fix A write (W4, seat 35). Plan Wall 10881; corrections K1-K3 (10894). One transaction.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $g$ BEGIN
  IF md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure)) <> '53b69433da746729f10ecea51730670b'
    THEN RAISE EXCEPTION 'GUARD: live functiondef is not 53b69433'; END IF;
  IF (SELECT count(*) FROM debate_enforcer_log WHERE (id IN (52025,52225) AND cure_status='UNCURED') OR (id=51983 AND cure_status='RECORD-ONLY')) <> 3
    THEN RAISE EXCEPTION 'GUARD: rows 51983/52025/52225 not in prior state'; END IF;
END $g$;
CREATE OR REPLACE FUNCTION public.enforcer_status_stored(st text, why text)
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

UPDATE debate_enforcer_log
   SET cure_status = enforcer_status_stored(CASE WHEN cure_status='RECORD-ONLY' THEN 'UNCURED' ELSE cure_status END, cure_reason)
 WHERE id IN (51983,52025,52225);
DO $c$ BEGIN
  IF (SELECT count(*) FROM debate_enforcer_log WHERE (id IN (52025,52225) AND cure_status='RECORD-ONLY') OR (id=51983 AND cure_status='UNCURED')) <> 3
    THEN RAISE EXCEPTION 'CHECK: rows did not reach new state'; END IF;
  IF md5(pg_get_functiondef('public.enforcer_status_stored(text,text)'::regprocedure)) <> '6b17204de59d589c5472d650d93fbd11'
    THEN RAISE EXCEPTION 'CHECK: functiondef is not 6b17204d'; END IF;
END $c$;
COMMIT;
