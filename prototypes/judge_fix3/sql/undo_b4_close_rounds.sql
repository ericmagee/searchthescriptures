-- Undo of b4_close_rounds.sql (judge_fix3). Reverses the three function edits in place; the two columns are KEPT (dropping them would delete
-- saved close rounds; drop them by hand only if no row holds one: SELECT count(*) FROM debate_results WHERE defender_r4 IS NOT NULL OR challenger_r4 IS NOT NULL).
BEGIN;
DO $undo$
DECLARE d text;
BEGIN
  d := pg_get_functiondef('public.debate_results_write_guard()'::regprocedure);
  d := replace(d, $a$COALESCE(NEW.challenger_r3,'')||' '||COALESCE(NEW.defender_r4,'')||' '||COALESCE(NEW.challenger_r4,'')||' '||$a$, $a$COALESCE(NEW.challenger_r3,'')||' '||$a$);
  d := replace(d, $a$
    IF NEW.defender_r4 ~ 'TRUNCAT' THEN v_seats := v_seats || 'defender_r4 '; END IF;
    IF NEW.challenger_r4 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r4 '; END IF;$a$, '');
  EXECUTE d;
  d := pg_get_functiondef('public.record_integrity_scan()'::regprocedure);
  d := replace(d, $a$COALESCE(challenger_r3,'')||COALESCE(defender_r4,'')||COALESCE(challenger_r4,'')||COALESCE(synthesis,'')$a$, $a$COALESCE(challenger_r3,'')||COALESCE(synthesis,'')$a$);
  EXECUTE d;
  d := pg_get_functiondef('public.dash_odv1_by_id(uuid)'::regprocedure);
  d := replace(d, 'engine_r3 as def_r3, challenger_r3 as cha_r3, defender_r4 as def_r4, challenger_r4 as cha_r4,', 'engine_r3 as def_r3, challenger_r3 as cha_r3,');
  EXECUTE d;
END
$undo$;
COMMIT;
