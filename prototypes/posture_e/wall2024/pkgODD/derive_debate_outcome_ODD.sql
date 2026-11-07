-- pkgODD (Eric approved W3 ASK 1, 10:14 CST 2026-11-07; W3 Wall 2877, rulings item 11). Staged by W1 for W4 to apply.
-- Effect: at the FIRST STAMP ONLY (unchanged), an exact even split of the counted seats on defense_standing or
-- challenge_standing is written 'TIE' instead of null, with a note appended to review_notes. Outcome, verdict,
-- split and fingerprint are untouched. Applies only to debates stamped after this is applied.
-- Guard: refuses unless the live definition is md5 2c39766e2bdcf7ecfcd1779a648f1db4.
DO $odd$
DECLARE
  v_def text := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  v_anchor constant text := E'  -- AMENDMENT THREE (BB-7397, ruled BB-7402)';
  v_ins constant text :=
E'  -- pkgODD (Eric 10:14 CST 2026-11-07; W3 2877, rulings item 11): an exact even split of the counted seats on a standing is written TIE, not null.\n'
'  IF NOT COALESCE(v_ds_m, false) AND v_nc > 0 AND v_nc % 2 = 0 AND (SELECT count(*) FROM (SELECT defense_standing AS x, count(*) AS c FROM debate_judgments\n'
'     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE x IS NOT NULL AND c * 2 = v_nc) = 2 THEN\n'
'    v_ds := ''TIE''; v_snote := concat_ws('' '', v_snote, ''[pkgODD: defense_standing written TIE, exact split of the ''||v_nc||'' counted seats.]'');\n'
'  END IF;\n'
'  IF NOT COALESCE(v_cs_m, false) AND v_nc > 0 AND v_nc % 2 = 0 AND (SELECT count(*) FROM (SELECT challenge_standing AS x, count(*) AS c FROM debate_judgments\n'
'     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[])) GROUP BY 1) t WHERE x IS NOT NULL AND c * 2 = v_nc) = 2 THEN\n'
'    v_cs := ''TIE''; v_snote := concat_ws('' '', v_snote, ''[pkgODD: challenge_standing written TIE, exact split of the ''||v_nc||'' counted seats.]'');\n'
'  END IF;\n\n';
BEGIN
  IF md5(v_def) <> '2c39766e2bdcf7ecfcd1779a648f1db4' THEN
    RAISE EXCEPTION 'pkgODD: live derive_debate_outcome is md5 %, expected 2c39766e2bdcf7ecfcd1779a648f1db4. Not applied.', md5(v_def);
  END IF;
  IF (length(v_def) - length(replace(v_def, v_anchor, ''))) / length(v_anchor) <> 1 THEN
    RAISE EXCEPTION 'pkgODD: anchor not found exactly once. Not applied.';
  END IF;
  EXECUTE replace(v_def, v_anchor, v_ins || v_anchor);
  RAISE NOTICE 'pkgODD applied: new md5 %', md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure));
END
$odd$;
