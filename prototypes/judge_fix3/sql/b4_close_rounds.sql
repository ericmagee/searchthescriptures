-- judge_fix3 B4: storage for the close rounds (D4 = defender_r4, C4 = challenger_r4). NOT APPLIED. Apply BEFORE the flow package: the save
-- path (record_debate_row) inserts only keys that are debate_results columns, so a run on the new flow before this migration would drop both rounds silently.
-- 1. the two columns; 2. the write guard (trg_debate_results_write_guard) quarantines a truncated close round as it does rounds 1-3;
-- 3. record_integrity_scan check 2 reads the close rounds too; 4. dash_odv1_by_id returns them (def_r4, cha_r4).
-- 2-4 edit the LIVE definition in place (pg_get_functiondef, replace, EXECUTE), so nothing else in those functions changes; each replacement
-- refuses unless its anchor is found exactly once. Run inside one transaction.
BEGIN;
ALTER TABLE public.debate_results ADD COLUMN IF NOT EXISTS defender_r4 text;
ALTER TABLE public.debate_results ADD COLUMN IF NOT EXISTS challenger_r4 text;
COMMENT ON COLUMN public.debate_results.defender_r4 IS 'ORACLE_DEBATE_V1 round 4: the defender''s CLOSE ROUND (final defense; answers witnesses still pressed). judge_fix3 B4.';
COMMENT ON COLUMN public.debate_results.challenger_r4 IS 'ORACLE_DEBATE_V1 round 4: the challenger''s CLOSE ROUND (final words; may not press). judge_fix3 B4.';

DO $mig$
DECLARE d text; n int;
BEGIN
  -- 2. debate_results_write_guard
  d := pg_get_functiondef('public.debate_results_write_guard()'::regprocedure);
  IF position('defender_r4' in d) > 0 THEN RAISE EXCEPTION 'write guard already carries the close rounds: migration already applied'; END IF;
  n := (length(d) - length(replace(d, $a$COALESCE(NEW.challenger_r3,'')||' '||$a$, ''))) / length($a$COALESCE(NEW.challenger_r3,'')||' '||$a$);
  IF n <> 1 THEN RAISE EXCEPTION 'write guard: blob anchor found % times', n; END IF;
  d := replace(d, $a$COALESCE(NEW.challenger_r3,'')||' '||$a$, $a$COALESCE(NEW.challenger_r3,'')||' '||COALESCE(NEW.defender_r4,'')||' '||COALESCE(NEW.challenger_r4,'')||' '||$a$);
  n := (length(d) - length(replace(d, $a$IF NEW.challenger_r3 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r3 '; END IF;$a$, ''))) / length($a$IF NEW.challenger_r3 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r3 '; END IF;$a$);
  IF n <> 1 THEN RAISE EXCEPTION 'write guard: seat anchor found % times', n; END IF;
  d := replace(d, $a$IF NEW.challenger_r3 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r3 '; END IF;$a$,
    $a$IF NEW.challenger_r3 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r3 '; END IF;
    IF NEW.defender_r4 ~ 'TRUNCAT' THEN v_seats := v_seats || 'defender_r4 '; END IF;
    IF NEW.challenger_r4 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r4 '; END IF;$a$);
  EXECUTE d;
  -- 3. record_integrity_scan, check 2
  d := pg_get_functiondef('public.record_integrity_scan()'::regprocedure);
  n := (length(d) - length(replace(d, $a$COALESCE(challenger_r3,'')||COALESCE(synthesis,'')$a$, ''))) / length($a$COALESCE(challenger_r3,'')||COALESCE(synthesis,'')$a$);
  IF n <> 1 THEN RAISE EXCEPTION 'integrity scan: anchor found % times', n; END IF;
  d := replace(d, $a$COALESCE(challenger_r3,'')||COALESCE(synthesis,'')$a$, $a$COALESCE(challenger_r3,'')||COALESCE(defender_r4,'')||COALESCE(challenger_r4,'')||COALESCE(synthesis,'')$a$);
  EXECUTE d;
  -- 4. dash_odv1_by_id
  d := pg_get_functiondef('public.dash_odv1_by_id(uuid)'::regprocedure);
  n := (length(d) - length(replace(d, 'engine_r3 as def_r3, challenger_r3 as cha_r3,', ''))) / length('engine_r3 as def_r3, challenger_r3 as cha_r3,');
  IF n <> 1 THEN RAISE EXCEPTION 'dash_odv1_by_id: anchor found % times', n; END IF;
  d := replace(d, 'engine_r3 as def_r3, challenger_r3 as cha_r3,', 'engine_r3 as def_r3, challenger_r3 as cha_r3, defender_r4 as def_r4, challenger_r4 as cha_r4,');
  EXECUTE d;
END
$mig$;
COMMIT;
-- Not changed (read, reported): dash_debate_by_id, dash_debate_result and get_pending_debates_for_findings read only rounds 1-2 or the older
-- columns and serve other variants; the dashboard front end is not in this repository and must read def_r4/cha_r4 to show the close rounds.
