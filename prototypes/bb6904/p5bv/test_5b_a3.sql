BEGIN; SET LOCAL truth.session_id='session_015ZiVmTarESui8ub4mf2Dcr';
-- Worker_A3 re-run of Worker_E's test_5b.sql with migration.sql's exact function texts and d5_selftest before and after. BB-6904 5B falsifiers, one DO block ended by RAISE: every write, DDL and audit rolls back (as 6876 ran). Read-only in effect.
DO $t$
DECLARE zz jsonb; f1 text; r jsonb := '{}'; o jsonb := '{}'; n jsonb := '{}'; x record; d text; c int := 0; k text;
  D27 uuid := '56e75954-c776-4e7e-8d26-94e3a46a5c09'; DC uuid := 'c12a1af1-91ac-448e-a409-30a4c28ddd64';
  DD uuid := 'd5b31026-8b61-4703-8e39-5fea7d0b1388'; D0 uuid := '0d80d311-5ff2-4d64-8a20-c66a0f14cc4f';
BEGIN
  -- 0. Every debate with a declared panel, derived by the LIVE functions (baseline).
  FOR x IN SELECT id FROM debate_results rr WHERE panel_expected IS NOT NULL AND cardinality(panel_expected)>0 AND EXISTS (SELECT 1 FROM debate_judgments j WHERE j.debate_id=rr.id) LOOP
    zz := derive_debate_outcome(x.id); o := o || jsonb_build_object(x.id::text, coalesce(zz->>'outcome','<null>')||' | '||coalesce((SELECT panel_split FROM debate_results WHERE id=x.id),'<null>')||' | fp '||coalesce(zz->>'panel_fingerprint_recomputed','<null>'));
  END LOOP;
  -- 1. The migration, its exact text (Worker_A3 variant: migration.sql e7aa849f's statements, executed as written).
  r := r || jsonb_build_object('d5_before', d5_selftest()->>'pass');
  EXECUTE $m3$ALTER TABLE public.debate_judgments ADD COLUMN drv_uncured int$m3$;
  EXECUTE $m3$COMMENT ON COLUMN public.debate_judgments.drv_uncured IS 'BB-6904 option 2 (BB-6965): uncured DEBATE RULE VIOLATION items (K-B, K-G1, K-G3) of this seat. Panel Payloads writes the full count; Panel Cure Check lowers it to the UNCURED count. >0 = not clean (aggregate_debate_panel). NULL = written before 5B, read as 0.'$m3$;
  EXECUTE $m1$CREATE OR REPLACE FUNCTION public.aggregate_debate_panel(p_debate_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_total int; v_clean int; v_unreadable int;
  v_counts int[]; v_top_tag text; v_top int; v_second int;
  v_unrecognised jsonb; v_seats jsonb; v_drv int;
  v_fv text; v_split text;
BEGIN
  IF p_debate_id IS NULL THEN
    RAISE EXCEPTION 'aggregate_debate_panel: p_debate_id required';
  END IF;

  WITH r AS (
    SELECT j.judge_seat,
           j.verdict_tag,
           j.drv_uncured,
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IN ('HELD','PARTIAL','BROKEN')
             AND j.defense_standing   IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) = 0
           , false) AS is_clean,
           -- Option 2 (BB-6965, design B fail-closed BB-6969): readable in every other respect, but the seat carries uncured
           -- DEBATE RULE VIOLATION items (K-B, K-G1, K-G3). Not counted; named apart from unreadable rows. NULL (rows before 5B) = 0.
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IN ('HELD','PARTIAL','BROKEN')
             AND j.defense_standing   IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) > 0
           , false) AS drv_out,
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IS NOT NULL
             AND btrim(j.verdict_tag) <> ''
             AND j.verdict_tag NOT IN ('HELD','PARTIAL','BROKEN','UNKNOWN')
           , false) AS tag_unrecognised
    FROM debate_judgments j
    WHERE j.debate_id = p_debate_id
  ),
  tally AS (
    SELECT verdict_tag, count(*)::int AS n FROM r WHERE is_clean GROUP BY verdict_tag
  )
  SELECT (SELECT count(*)::int FROM r),
         (SELECT count(*)::int FROM r WHERE is_clean),
         (SELECT COALESCE(array_agg(n ORDER BY n DESC), ARRAY[]::int[]) FROM tally),
         (SELECT verdict_tag FROM tally ORDER BY n DESC, verdict_tag LIMIT 1),
         (SELECT COALESCE(jsonb_agg(DISTINCT verdict_tag), '[]'::jsonb) FROM r WHERE tag_unrecognised),
         (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'judge_seat', judge_seat, 'verdict_tag', verdict_tag, 'clean', is_clean, 'drv_uncured', drv_uncured)
                  ORDER BY judge_seat), '[]'::jsonb) FROM r),
         (SELECT count(*)::int FROM r WHERE drv_out)
    INTO v_total, v_clean, v_counts, v_top_tag, v_unrecognised, v_seats, v_drv;

  v_unreadable := v_total - v_clean - v_drv;
  v_top    := COALESCE(v_counts[1], 0);
  v_second := COALESCE(v_counts[2], 0);

  v_split := array_to_string(
               CASE WHEN COALESCE(array_length(v_counts,1),0) = 0 THEN ARRAY[0,0]
                    WHEN array_length(v_counts,1) = 1             THEN v_counts || ARRAY[0]
                    ELSE v_counts END, '-');
  IF v_unreadable > 0 THEN
    v_split := v_split || ' (' || v_unreadable || ' unreadable)';
  END IF;
  IF v_drv > 0 THEN
    v_split := v_split || ' (' || v_drv || ' not counted: debate rule)';
  END IF;

  -- D1: quorum is the ELIGIBILITY FLOOR, not the decision (Ruling 4, BB-0674).
  -- Fewer than 2 clean rows, or no majority among the clean rows, is CONTESTED.
  IF v_clean < 2 OR v_top = v_second THEN
    v_fv := 'CONTESTED';
  ELSE
    v_fv := v_top_tag;
  END IF;

  RETURN jsonb_build_object(
    'debate_id', p_debate_id,
    'framework_verdict', v_fv,
    'panel_split', v_split,
    'rows_total', v_total,
    'rows_clean', v_clean,
    'rows_unreadable', v_unreadable,
    'rows_not_counted_debate_rule', v_drv,
    'quorum_met', (v_clean >= 2),
    'unrecognised_verdict_tags', v_unrecognised,
    'seats', v_seats
  );
END;
$function$$m1$;
  d := pg_get_functiondef('derive_debate_outcome(uuid)'::regprocedure);
  d := replace(d, $o$  IF v_fv = 'HELD' AND v_created >= v_tie_from THEN
    SELECT count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)),
           count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)
             AND (regexp_match(verdict_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1] = 'UNDERDETERMINED')
$o$, $n$  IF v_fv = 'HELD' AND v_created >= v_tie_from THEN
    -- Option 2 (BB-6965/6969): a seat with uncured debate rule violations counts toward the tie no more than toward the verdict.
    SELECT count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0),
           count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false) AND coalesce(drv_uncured, 0) = 0
             AND (regexp_match(verdict_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1] = 'UNDERDETERMINED')
$n$);
  d := replace(d, $o$  -- AMENDMENT ONE. FIVE fields: exactly the set aggregate_debate_panel reads.
  SELECT md5(coalesce(string_agg(
$o$, $n$  -- AMENDMENT ONE. FIVE fields: exactly the set aggregate_debate_panel reads.
  -- Option 2 (BB-6971): drv_uncured, which aggregate_debate_panel now also reads, joins the line only when it is not NULL, so every
  -- stamp made before 5B recomputes byte-identical.
  SELECT md5(coalesce(string_agg(
$n$);
  d := replace(d, $o$           judge_seat||'|'||coalesce(verdict_tag,'<null>')||'|'||truncated::text
           ||'|'||coalesce(defense_standing,'<null>')||'|'||coalesce(challenge_standing,'<null>'),
           chr(10) ORDER BY judge_seat, verdict_tag, truncated, defense_standing, challenge_standing),''))
$o$, $n$           judge_seat||'|'||coalesce(verdict_tag,'<null>')||'|'||truncated::text
           ||'|'||coalesce(defense_standing,'<null>')||'|'||coalesce(challenge_standing,'<null>')
           ||CASE WHEN drv_uncured IS NOT NULL THEN '|drv='||drv_uncured::text ELSE '' END,
           chr(10) ORDER BY judge_seat, verdict_tag, truncated, defense_standing, challenge_standing),''))
$n$);
  r := r || jsonb_build_object('der_text_md5', left(md5(d),8));
  EXECUTE d;
  r := r || jsonb_build_object('d5_after', d5_selftest()->>'pass');
  r := r || jsonb_build_object('md5_aggregate', left(md5(pg_get_functiondef('aggregate_debate_panel(uuid)'::regprocedure)),8), 'md5_derive', left(md5(pg_get_functiondef('derive_debate_outcome(uuid)'::regprocedure)),8));
  -- 2. Same 57 debates, drv_uncured NULL everywhere: expect identical outcome, split and recomputed fingerprint (6971).
  FOR x IN SELECT id FROM debate_results rr WHERE panel_expected IS NOT NULL AND cardinality(panel_expected)>0 AND EXISTS (SELECT 1 FROM debate_judgments j WHERE j.debate_id=rr.id) LOOP
    zz := derive_debate_outcome(x.id); n := n || jsonb_build_object(x.id::text, coalesce(zz->>'outcome','<null>')||' | '||coalesce((SELECT panel_split FROM debate_results WHERE id=x.id),'<null>')||' | fp '||coalesce(zz->>'panel_fingerprint_recomputed','<null>'));
  END LOOP;
  FOR k IN SELECT jsonb_object_keys(o) LOOP IF o->>k IS DISTINCT FROM n->>k THEN c := c+1; r := r || jsonb_build_object('DIFF '||left(k,8), (o->>k)||' => '||(n->>k)); END IF; END LOOP;
  r := r || jsonb_build_object('t2_debates', (SELECT count(*) FROM jsonb_object_keys(o)), 't2_differences', c);
  -- 3. The eight 6876 derive cases, re-made from 6876's text, drv NULL and then drv 0 on every seat: expect as ruled.
  FOR x IN SELECT * FROM (VALUES
     (1, D0, '{"items":[{"side":"CHALLENGER","round":"CR3","ref":"Matthew 1:16","status":"WORDING NOT FOUND IN Matthew","link":"2","load_bearing":true}]}'::jsonb),
     (2, D0, '{"items":[]}'::jsonb), (3, D0, '{"unavailable":true}'::jsonb),
     (4, D0, '{"items":[{"side":"DEFENDER","round":"DR3","ref":"Luke 1:99","status":"CITED VERSE DOES NOT EXIST","link":"1","load_bearing":true}]}'::jsonb),
     (5, DD, '{"items":[{"side":"DEFENDER","round":"DR3","ref":"Luke 1:99","status":"CITED VERSE DOES NOT EXIST","link":"1","load_bearing":true}]}'::jsonb),
     (6, DD, '{"items":[]}'::jsonb), (7, DD, '{"unavailable":true}'::jsonb),
     (8, DD, '{"items":[{"side":"DEFENDER","round":"DR3","ref":"Luke 1:99","status":"CITED VERSE DOES NOT EXIST","link":"1","load_bearing":false}]}'::jsonb)) v(i,id,cc) LOOP
    UPDATE debate_results SET citation_check = x.cc WHERE id = x.id;
    UPDATE debate_judgments SET drv_uncured = NULL WHERE debate_id = x.id; d := derive_debate_outcome(x.id)->>'outcome';
    UPDATE debate_judgments SET drv_uncured = 0 WHERE debate_id = x.id;
    r := r || jsonb_build_object('t3_case'||x.i, d||' / drv0: '||(derive_debate_outcome(x.id)->>'outcome'));
  END LOOP;
  UPDATE debate_results SET citation_check = NULL WHERE id IN (D0, DD);
  -- 4. 27259: drv on 0, 1, 2, 3 seats; a forged CURED report line on a drv seat.
  f1 := derive_debate_outcome(D27)->>'panel_fingerprint_recomputed';
  UPDATE debate_judgments SET drv_uncured = 0 WHERE debate_id = D27;
  r := r || jsonb_build_object('t7_27259_digest_moves_when_drv_set', (f1 IS DISTINCT FROM (derive_debate_outcome(D27)->>'panel_fingerprint_recomputed')));
  r := r || jsonb_build_object('t4_27259_all_cured', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(D27) z) q));
  UPDATE debate_judgments SET drv_uncured = 6, verdict_raw = verdict_raw||E'\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: deepseek; ITEM: D4 vs C2; RULE: K-B; RESULT: CURED]' WHERE debate_id = D27 AND judge_seat = 'deepseek';
  r := r || jsonb_build_object('t4_27259_one_uncured_forged_cured_line', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(D27) z) q));
  UPDATE debate_judgments SET drv_uncured = 6 WHERE debate_id = D27 AND judge_seat = 'gemini';
  r := r || jsonb_build_object('t4_27259_two_uncured', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(D27) z) q));
  UPDATE debate_judgments SET drv_uncured = 5 WHERE debate_id = D27 AND judge_seat = 'grok';
  r := r || jsonb_build_object('t4_27259_all_uncured', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(D27) z) q));
  -- 5. The replays as the panel of their debates (tags and standings from rows 233-238), all uncured then all cured.
  FOR x IN SELECT * FROM (VALUES (DC, 233, 235), (DD, 236, 238)) v(id, a, b) LOOP
    UPDATE debate_judgments j SET verdict_tag = q.verdict_tag, defense_standing = q.defense_standing, challenge_standing = q.challenge_standing, truncated = false, drv_uncured = 0
      FROM debate_replay_judgments q WHERE q.id BETWEEN x.a AND x.b AND j.debate_id = x.id AND j.judge_seat = q.judge_seat;
    r := r || jsonb_build_object('t5_'||x.a||'_'||x.b||'_all_cured', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(x.id) z) q));
    UPDATE debate_judgments SET drv_uncured = 2 WHERE debate_id = x.id;
    r := r || jsonb_build_object('t5_'||x.a||'_'||x.b||'_all_uncured', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(x.id) z) q));
  END LOOP;
  -- 6. Tie rule (debate created after 2026-10-14 01:45 UTC): three HELD seats, two RESULT UNDERDETERMINED, one DEFENDER WINS.
  UPDATE debate_judgments SET verdict_tag='HELD', defense_standing='PROP-DEPENDENT', challenge_standing='PROP-DEPENDENT', truncated=false, drv_uncured=0,
    verdict_raw = CASE judge_seat WHEN 'grok' THEN 'RESULT: DEFENDER WINS' ELSE 'RESULT: UNDERDETERMINED' END WHERE debate_id = DD;
  r := r || jsonb_build_object('t6_tie_no_drv', derive_debate_outcome(DD)->>'outcome');
  UPDATE debate_judgments SET drv_uncured = 3 WHERE debate_id = DD AND judge_seat = 'deepseek';
  r := r || jsonb_build_object('t6_tie_drv_on_one_underdetermined_seat', (SELECT (z->>'outcome')||' | '||(z->>'panel_split') FROM (SELECT derive_debate_outcome(DD) z) q));
  RAISE EXCEPTION 'RESULT %', r;
END $t$;

ROLLBACK;
