WITH f AS (SELECT pg_get_functiondef('public.derive_debate_outcome'::regproc) d), n AS (SELECT d, replace(replace(replace(replace(d,
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
 $q$on a debate created at or after v_tie_from whose panel verdict is HELD or PARTIAL (or BROKEN, on a debate created at or after v_broken_tie_from, ASK 404),$q$)
 AS n FROM f)
SELECT md5(d) base_md5, md5(n) new_md5_placeholder, length(n) new_len, length(n)-length(d) added, (SELECT count(*) FROM regexp_matches(n,'__ASK404_FROM__','g')) ph FROM n;