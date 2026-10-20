CREATE TEMP TABLE j2x(d text) ON COMMIT DROP;
DO $do$
DECLARE d text := pg_get_functiondef('derive_debate_outcome(uuid)'::regprocedure); n text;
  a1 text := E'      v_outcome := ''UNDERDETERMINED'';\n    END IF;\n  END IF;\n\n  IF v_outcome IS NULL THEN';
  a2 text := E'  OR v_b_ud     IS DISTINCT FROM v_ud THEN';
  a3 text := E'           underdetermined_seats = v_ud,';
  a4 text := E'  v_counted text[]; v_ud text[]; v_b_ud text[];';
  a5 text := E'    ''underdetermined_seats'',      v_ud,';
  cnt int;
BEGIN
  IF md5(d) <> '379e6e5543f1a74020a060da3adeb64a' THEN RAISE EXCEPTION 'refused: derive_debate_outcome is not the measured source'; END IF;
  FOREACH n IN ARRAY ARRAY[a1,a2,a3,a4,a5] LOOP
    cnt := (length(d) - length(replace(d, n, ''))) / length(n);
    IF cnt <> 1 THEN RAISE EXCEPTION 'refused: anchor occurs % times: %', cnt, left(n, 60); END IF;
  END LOOP;
  d := replace(d, a4, a4 || E'\n  v_cc jsonb; v_block text; v_b_block text; v_side text; v_bad text;');
  d := replace(d, a1, E'      v_outcome := ''UNDERDETERMINED'';\n    END IF;\n  END IF;\n\n'
 || E'  -- CITATION RULE (BB-6795 J2; ruled BB-6799, BB-6805, BB-6828, BB-6830). A side that would prevail with a load-bearing quotation\n'
 || E'  -- (an [L1] quotation in a LINK block of its link round, the link not conceded) whose wording is NOT FOUND in the book named, or\n'
 || E'  -- whose cited verse does not exist, does not prevail: the outcome is the review value and citation_block records why. Same test for\n'
 || E'  -- both sides. WORDS ARE AT <ref> does not trip it. An unavailable check fails open, recorded and audited (BB-6830). NULL = before J2.\n'
 || E'  SELECT citation_check, citation_block INTO v_cc, v_b_block FROM debate_results WHERE id = p_debate_id;\n'
 || E'  v_block := NULL;\n'
 || E'  IF v_cc IS NOT NULL AND coalesce((v_cc->>''unavailable'')::boolean, false) THEN\n'
 || E'    v_block := ''citation check unavailable'';\n'
 || E'  ELSIF v_cc IS NOT NULL THEN\n'
 || E'    v_side := CASE WHEN v_outcome IN (''DEFENDER PREVAILS'', ''DEFENDER PREVAILS, WEAKENED'') THEN ''DEFENDER''\n'
 || E'                   WHEN v_outcome = ''CHALLENGER PREVAILS'' THEN ''CHALLENGER'' END;\n'
 || E'    IF v_side IS NOT NULL THEN\n'
 || E'      SELECT string_agg((e->>''ref'')||'' (''||(e->>''status'')||'', LINK ''||coalesce(e->>''link'',''?'')||'', ''||(e->>''round'')||'')'', ''; '' ORDER BY o)\n'
 || E'        INTO v_bad FROM jsonb_array_elements(coalesce(v_cc->''items'', ''[]''::jsonb)) WITH ORDINALITY AS t(e, o)\n'
 || E'       WHERE e->>''side'' = v_side AND coalesce((e->>''load_bearing'')::boolean, false)\n'
 || E'         AND (e->>''status'' LIKE ''WORDING NOT FOUND IN %'' OR e->>''status'' = ''CITED VERSE DOES NOT EXIST'');\n'
 || E'      IF v_bad IS NOT NULL THEN\n'
 || E'        v_block := v_side||'' would prevail on load-bearing quotation(s) the KJV citation check could not find: ''||v_bad;\n'
 || E'        v_outcome := v_review;\n'
 || E'      END IF;\n'
 || E'    END IF;\n'
 || E'  END IF;\n'
 || E'  IF v_block IS NOT NULL AND v_block IS DISTINCT FROM v_b_block THEN\n'
 || E'    PERFORM log_audit_event(''W-D CITATION RULE'', format(''derive_debate_outcome: debate %s: %s. outcome written as %L.'', p_debate_id, v_block, v_outcome), ''W-D'', truth_today());\n'
 || E'  END IF;\n\n'
 || E'  IF v_outcome IS NULL THEN');
  d := replace(d, a2, E'  OR v_b_ud     IS DISTINCT FROM v_ud\n  OR v_b_block  IS DISTINCT FROM v_block THEN');
  d := replace(d, a3, a3 || E'\n           citation_block    = v_block,');
  d := replace(d, a5, a5 || E'\n    ''citation_block'',             v_block,');
  INSERT INTO j2x VALUES (d);
END
$do$;
SELECT md5(d) new_md5, length(d) new_len, (length(d)-15677) delta, substr(d, strpos(d,'-- CITATION RULE')-60, 300) head_ctx, (SELECT count(*) FROM regexp_matches(d,'citation_block','g')) n_cb FROM j2x;
