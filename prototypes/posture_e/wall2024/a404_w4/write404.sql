SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
DO $w404$ DECLARE d text := pg_get_functiondef('public.derive_debate_outcome'::regproc); n text; ts text := to_char(now() AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')||'+00';
BEGIN
  IF md5(d) <> '4ad4e2ab746eb2cdf124836daf731196' THEN RAISE EXCEPTION 'ASK 404: derive_debate_outcome drifted from the graded base'; END IF;
  n := replace(replace(replace(replace(d,
 $q$  v_tie_ge_from constant timestamptz := '2026-10-30 23:00:41+00';$q$,
 $q$  v_tie_ge_from constant timestamptz := '2026-10-30 23:00:41+00';
  -- ASK 404 (rulings row 494): a debate created at or after this time (the write time) also takes the tie test when its panel verdict is BROKEN.
  v_broken_tie_from constant timestamptz := '__ASK404_FROM__';$q$),
 $q$  -- TIE: the panel verdict is HELD or PARTIAL and most of its counted seats of that verdict wrote RESULT: UNDERDETERMINED (BB-8634 S3).$q$,
 $q$  -- TIE: the panel verdict is HELD or PARTIAL and most of its counted seats of that verdict wrote RESULT: UNDERDETERMINED (BB-8634 S3).
  -- ASK 404 (rulings row 494): from v_broken_tie_from a BROKEN panel takes the same test. A counted BROKEN seat's word is UNDERDETERMINED
  -- when its challenge is not SELF-SUPPORTED (rd386). A majority or an exact half gives UNDERDETERMINED; CFO and the citation rule still decide after it.$q$),
 $q$  IF v_fv IN ('HELD', 'PARTIAL') AND v_created >= v_tie_from THEN$q$,
 $q$  IF (v_fv IN ('HELD', 'PARTIAL') AND v_created >= v_tie_from) OR (v_fv = 'BROKEN' AND v_created >= v_broken_tie_from) THEN$q$),
 $q$on a debate created at or after v_tie_from whose panel verdict is HELD or PARTIAL,$q$,
 $q$on a debate created at or after v_tie_from whose panel verdict is HELD or PARTIAL (or BROKEN, on a debate created at or after v_broken_tie_from, ASK 404),$q$);
  IF md5(n) <> '9bbbfed01ba7dbbd9469fe1d9b6291d9' THEN RAISE EXCEPTION 'ASK 404: result differs from the graded preview'; END IF;
  EXECUTE replace(n, '__ASK404_FROM__', ts);
END $w404$;