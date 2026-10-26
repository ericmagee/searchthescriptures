SET LOCAL truth.session_id = 'session_014Qy67bHv8uBmRXbWGSrghm';
DO $do$ DECLARE d text; dnew_md5 text; inst text; BEGIN
  IF EXISTS (SELECT 1 FROM blackboard WHERE id > 7644) THEN RAISE EXCEPTION 'DOD20 APPLY REFUSED: board head moved past BB-7644'; END IF;
  d := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  IF md5(d) <> '173f9465687982ab2bcab5935897caab' THEN RAISE EXCEPTION 'DOD20 PATCH REFUSED: derive_debate_outcome md5 % is not the recorded 173f9465', md5(d); END IF;
  IF (length(d) - length(replace(d, $a1$  v_cc jsonb; v_block text; v_b_block text; v_side text; v_bad text;
BEGIN
$a1$, ''))) / length($a1$  v_cc jsonb; v_block text; v_b_block text; v_side text; v_bad text;
BEGIN
$a1$) <> 1 THEN RAISE EXCEPTION 'DOD20 PATCH REFUSED: anchor 1 does not occur exactly once'; END IF;
  d := replace(d, $a1$  v_cc jsonb; v_block text; v_b_block text; v_side text; v_bad text;
BEGIN
$a1$, $r1$  v_cc jsonb; v_block text; v_b_block text; v_side text; v_bad text;
  -- BB-7397 rev 9 DoD 20: the counted seats' majority for the four standings fields.
  v_nc int; v_ds text; v_cl int; v_cs text; v_ccl int;
  v_ds_m boolean; v_cl_m boolean; v_cs_m boolean; v_ccl_m boolean; v_snote text;
BEGIN
$r1$);
  IF (length(d) - length(replace(d, $a2$  -- AMENDMENT THREE (BB-7397, ruled BB-7402): framework_verdict is the panel's verdict.$a2$, ''))) / length($a2$  -- AMENDMENT THREE (BB-7397, ruled BB-7402): framework_verdict is the panel's verdict.$a2$) <> 1 THEN RAISE EXCEPTION 'DOD20 PATCH REFUSED: anchor 2 does not occur exactly once'; END IF;
  d := replace(d, $a2$  -- AMENDMENT THREE (BB-7397, ruled BB-7402): framework_verdict is the panel's verdict.$a2$, $r2$  -- BB-7397 rev 9 DoD 20 (rulings BB-7607 item 3; amendments BB-7615 and BB-7621): the row's four standings fields carry the COUNTED
  -- seats' majority value for each field (the aggregate's clean=true), written at the FIRST STAMP ONLY in the UPDATE below. A field that no
  -- value holds for more than half of the counted seats stays null, and one line appended to review_notes names each counted seat's four
  -- values. The single judge's values never enter these fields; they stay in independent_verdict_raw. A row stamped before keeps its values.
  v_nc := cardinality(COALESCE(v_counted, ARRAY[]::text[]));
  SELECT x, true INTO v_ds, v_ds_m FROM (SELECT defense_standing AS x, count(*) AS c FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE c * 2 > v_nc;
  SELECT x, true INTO v_cl, v_cl_m FROM (SELECT conceded_links AS x, count(*) AS c FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE c * 2 > v_nc;
  SELECT x, true INTO v_cs, v_cs_m FROM (SELECT challenge_standing AS x, count(*) AS c FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE c * 2 > v_nc;
  SELECT x, true INTO v_ccl, v_ccl_m FROM (SELECT challenger_conceded_links AS x, count(*) AS c FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE c * 2 > v_nc;
  IF NOT (COALESCE(v_ds_m, false) AND COALESCE(v_cl_m, false) AND COALESCE(v_cs_m, false) AND COALESCE(v_ccl_m, false)) THEN
    SELECT '[AUDIT v21: PANEL STANDINGS -- no majority among the '||v_nc||' counted seat(s) on '
           ||concat_ws(', ', CASE WHEN NOT COALESCE(v_ds_m, false) THEN 'defense_standing' END, CASE WHEN NOT COALESCE(v_cl_m, false) THEN 'conceded_links' END,
                       CASE WHEN NOT COALESCE(v_cs_m, false) THEN 'challenge_standing' END, CASE WHEN NOT COALESCE(v_ccl_m, false) THEN 'challenger_conceded_links' END)
           ||'; left null. Counted seats (defense standing, conceded, challenge standing, challenger conceded): '
           ||COALESCE(string_agg(judge_seat||' '||COALESCE(defense_standing, 'null')||', '||COALESCE(conceded_links::text, 'null')||', '
                      ||COALESCE(challenge_standing, 'null')||', '||COALESCE(challenger_conceded_links::text, 'null'), '; ' ORDER BY judge_seat), 'none')||'.]'
      INTO v_snote FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[]));
  END IF;

  -- AMENDMENT THREE (BB-7397, ruled BB-7402): framework_verdict is the panel's verdict.$r2$);
  IF (length(d) - length(replace(d, $a3$           panel_fingerprint = CASE WHEN panel_verdict IS NULL THEN v_fp ELSE panel_fingerprint END
     WHERE id = p_debate_id;$a3$, ''))) / length($a3$           panel_fingerprint = CASE WHEN panel_verdict IS NULL THEN v_fp ELSE panel_fingerprint END
     WHERE id = p_debate_id;$a3$) <> 1 THEN RAISE EXCEPTION 'DOD20 PATCH REFUSED: anchor 3 does not occur exactly once'; END IF;
  d := replace(d, $a3$           panel_fingerprint = CASE WHEN panel_verdict IS NULL THEN v_fp ELSE panel_fingerprint END
     WHERE id = p_debate_id;$a3$, $r3$           panel_fingerprint = CASE WHEN panel_verdict IS NULL THEN v_fp ELSE panel_fingerprint END,
           defense_standing  = CASE WHEN panel_verdict IS NULL THEN v_ds ELSE defense_standing END,
           conceded_links    = CASE WHEN panel_verdict IS NULL THEN v_cl ELSE conceded_links END,
           challenge_standing = CASE WHEN panel_verdict IS NULL THEN v_cs ELSE challenge_standing END,
           challenger_conceded_links = CASE WHEN panel_verdict IS NULL THEN v_ccl ELSE challenger_conceded_links END,
           review_notes      = CASE WHEN panel_verdict IS NULL AND v_snote IS NOT NULL THEN concat_ws(' ', review_notes, v_snote) ELSE review_notes END
     WHERE id = p_debate_id;$r3$);
  IF (length(d) - length(replace(d, $a4$It writes framework_verdict at FIRST STAMP ONLY, equal to panel_verdict (AMENDMENT THREE).$a4$, ''))) / length($a4$It writes framework_verdict at FIRST STAMP ONLY, equal to panel_verdict (AMENDMENT THREE).$a4$) <> 1 THEN RAISE EXCEPTION 'DOD20 PATCH REFUSED: anchor 4 does not occur exactly once'; END IF;
  d := replace(d, $a4$It writes framework_verdict at FIRST STAMP ONLY, equal to panel_verdict (AMENDMENT THREE).$a4$, $r4$It writes framework_verdict at FIRST STAMP ONLY, equal to panel_verdict (AMENDMENT THREE). At FIRST STAMP ONLY it also writes defense_standing, conceded_links, challenge_standing and challenger_conceded_links, each the majority of the counted seats, null with a review_notes line where none holds a majority (BB-7397 rev 9 DoD 20).$r4$);
  dnew_md5 := md5(d);
  IF dnew_md5 <> '450aebe1101a67a77aa9a812f5e4d497' THEN RAISE EXCEPTION 'DOD20 APPLY REFUSED: patched source md5 % is not 450aebe1', dnew_md5; END IF;
  EXECUTE d;
  inst := md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure));
  IF inst <> dnew_md5 THEN RAISE EXCEPTION 'DOD20 APPLY REFUSED: installed md5 % differs from patched %', inst, dnew_md5; END IF;
  RAISE NOTICE 'DOD20 APPLIED: installed md5 %', inst;
END $do$;
