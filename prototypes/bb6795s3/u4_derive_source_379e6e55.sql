CREATE OR REPLACE FUNCTION public.derive_debate_outcome(p_debate_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_review   constant text := E'UNGRADED — REVIEW';
  v_panel    jsonb;
  v_total    int;
  v_fv       text;
  v_split    text;
  v_judged   text[];
  v_outcome  text;
  v_unmapped boolean := false;
  v_changed  boolean := false;
  v_expected text[];
  v_present  text[];
  v_missing  text[];
  v_extra    text[];
  v_b_fv text; v_b_split text; v_b_out text; v_b_judged text[];
  v_b_pv text; v_b_fp text; v_fp text;
  v_debate_date date;
  v_engine text;
  -- Tie (2026-10-13, operator ruling "2", WALL-0966 1287-1297, BB-5657 item 3): debates created before this
  -- time keep their recorded outcome; moving it back re-derives them.
  v_tie_from constant timestamptz := '2026-10-14 01:45:00+00';
  v_created  timestamptz;
  v_h int; v_hu int;
  v_counted text[]; v_ud text[]; v_b_ud text[];
BEGIN
  IF p_debate_id IS NULL THEN
    RAISE EXCEPTION 'derive_debate_outcome: p_debate_id required';
  END IF;

  SELECT framework_verdict, panel_split, outcome, judged_by, debate_date, engine, created_at,
         panel_verdict, panel_fingerprint,
         (SELECT array_agg(DISTINCT e ORDER BY e) FROM unnest(panel_expected) e),
         underdetermined_seats
    INTO v_b_fv, v_b_split, v_b_out, v_b_judged, v_debate_date, v_engine, v_created,
         v_b_pv, v_b_fp, v_expected,
         v_b_ud
    FROM debate_results WHERE id = p_debate_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'derive_debate_outcome: no debate_results row %', p_debate_id;
  END IF;

  SELECT array_agg(DISTINCT judge_seat ORDER BY judge_seat)
    INTO v_present FROM debate_judgments WHERE debate_id = p_debate_id;
  v_present := COALESCE(v_present, ARRAY[]::text[]);

  -- FENCE 1. No judgment rows at all. The quiet case: "not yet". No audit.
  IF cardinality(v_present) = 0 THEN
    RETURN jsonb_build_object(
      'debate_id', p_debate_id, 'written', false, 'rows_total', 0,
      'panel_expected', v_expected,
      'reason', 'NO PANEL ROWS. W-D refuses to write. This is not a verdict and not an error; the panel has not run for this debate.');
  END IF;

  -- FENCE 2. Rows exist but no panel was declared. Historical rows and strays. AUDITS.
  IF v_expected IS NULL OR cardinality(v_expected) = 0 THEN
    PERFORM log_audit_event(
      'W-D REFUSED -- judgment rows on a debate with NO DECLARED PANEL',
      format('derive_debate_outcome: debate %s holds %s judgment row(s) from seat(s) %s, but panel_expected is NULL or empty. NOTHING WRITTEN. framework_verdict left as %L.',
             p_debate_id, cardinality(v_present), v_present, v_b_fv),
      'W-D', truth_today());
    RETURN jsonb_build_object(
      'debate_id', p_debate_id, 'written', false,
      'rows_total', cardinality(v_present), 'seats_present', v_present,
      'panel_expected', NULL,
      'reason', 'NO DECLARED PANEL. panel_expected is NULL or empty, so W-D cannot know what a COMPLETE panel is for this debate and refuses to grade. Historical rows are NULL here permanently. Audited.');
  END IF;

  SELECT array_agg(e ORDER BY e) INTO v_missing
    FROM unnest(v_expected) e WHERE e <> ALL (v_present);
  SELECT array_agg(p ORDER BY p) INTO v_extra
    FROM unnest(v_present) p WHERE p <> ALL (v_expected);

  -- FENCE 2b. BOTH SIDES NON-EMPTY = MISMATCH, not waiting.
  IF v_missing IS NOT NULL AND v_extra IS NOT NULL THEN
    PERFORM log_audit_event(
      'W-D REFUSED -- ROSTER MISMATCH (not a missing seat)',
      format('derive_debate_outcome: debate %s -- panel_expected %s, seats present %s. Missing %s AND unexpected %s at the same time. This is a WIRING or SPELLING error, not a panel still waiting: a seat named one way was dispatched and a seat named another way answered. Check case and whitespace first. NOTHING WRITTEN. framework_verdict left as %L.',
             p_debate_id, v_expected, v_present, v_missing, v_extra, v_b_fv),
      'W-D', truth_today());
    RETURN jsonb_build_object(
      'debate_id', p_debate_id, 'written', false,
      'panel_expected', v_expected, 'seats_present', v_present,
      'seats_missing', v_missing, 'seats_unexpected', v_extra,
      'mismatch', true,
      'reason', 'ROSTER MISMATCH. Seats are missing AND unexpected seats are present at the same time, so this is NOT a panel still waiting -- a seat was dispatched under one name and answered under another. Case and whitespace are the usual causes. Audited.');
  END IF;

  -- FENCE 3. Dispatched seats have not all reported. ALSO the fence that catches a DELETED
  -- judgment row: a deletion makes the roster incomplete and W-D refuses HERE, before the
  -- fingerprint is ever computed. Deletion is caught by the roster, never by panel_fingerprint_match.
  IF v_missing IS NOT NULL THEN
    RETURN jsonb_build_object(
      'debate_id', p_debate_id, 'written', false,
      'panel_expected', v_expected, 'seats_present', v_present,
      'seats_missing', v_missing, 'mismatch', false,
      'rows_total', cardinality(v_present),
      'reason', 'INCOMPLETE PANEL. Seats were dispatched that have not written a judgment row, and no unexpected seat is present, so these seats genuinely have not answered. W-D writes nothing until every dispatched seat has answered, readably or not.');
  END IF;

  -- FENCE 4. A seat voted that was never dispatched. Quorum corruption. AUDITS.
  IF v_extra IS NOT NULL THEN
    PERFORM log_audit_event(
      'W-D REFUSED -- UNDISPATCHED seat wrote a judgment row',
      format('derive_debate_outcome: debate %s expected seats %s but also holds rows from %s. Every expected seat DID answer, so this is an extra voter, not a naming mismatch. NOTHING WRITTEN.',
             p_debate_id, v_expected, v_extra),
      'W-D', truth_today());
    RETURN jsonb_build_object(
      'debate_id', p_debate_id, 'written', false,
      'panel_expected', v_expected, 'seats_present', v_present,
      'seats_unexpected', v_extra, 'mismatch', false,
      'reason', 'UNDISPATCHED SEAT PRESENT. Every expected seat answered AND a seat that was never dispatched also wrote a row; it would have counted toward quorum. W-D refuses. Audited.');
  END IF;

  v_panel := aggregate_debate_panel(p_debate_id);
  v_total := (v_panel->>'rows_total')::int;
  v_fv    := v_panel->>'framework_verdict';
  v_split := v_panel->>'panel_split';

  SELECT array_agg(s->>'judge_seat' ORDER BY s->>'judge_seat')
    INTO v_judged FROM jsonb_array_elements(v_panel->'seats') s;

  v_outcome := d5_outcome_for(v_fv);

  -- F10 (BB-6689, ruling BB-6692 (3), option (a)): FLAG ONLY. Which COUNTED seat (the aggregate's clean=true) wrote
  -- UNDERDETERMINED, and where: on its RESULT line (the tie rule's own regex, below) or on a collision row
  -- ("D<n> vs C<m> ...: UNDERDETERMINED", at a line start, real or escaped). Entries "seat:RESULT" and "seat:COLLISION";
  -- NULL when none. Written in the gate below and outside the fingerprint; no verdict, outcome or split reads it.
  SELECT array_agg(s->>'judge_seat') INTO v_counted
    FROM jsonb_array_elements(v_panel->'seats') s WHERE (s->>'clean')::boolean;
  SELECT array_agg(x ORDER BY x) INTO v_ud FROM (
    SELECT judge_seat||':RESULT' AS x FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[]))
       AND (regexp_match(verdict_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1] = 'UNDERDETERMINED'
    UNION
    SELECT judge_seat||':COLLISION' FROM debate_judgments
     WHERE debate_id = p_debate_id AND judge_seat = ANY (COALESCE(v_counted, ARRAY[]::text[]))
       AND verdict_raw ~* '(^|\n|\\n)[ \t*_>-]*[DC][0-9]+[^\n\\]*?\mvs\M[^\n\\]*?:[ \t*_]*UNDERDETERMINED') u;

  -- TIE: the panel verdict is HELD and most of the counted HELD seats wrote RESULT: UNDERDETERMINED.
  IF v_fv = 'HELD' AND v_created >= v_tie_from THEN
    SELECT count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)),
           count(*) FILTER (WHERE verdict_tag = 'HELD' AND NOT coalesce(truncated, false)
             AND (regexp_match(verdict_raw, 'RESULT[ \t*_]*:[ \t*_]*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'))[1] = 'UNDERDETERMINED')
      INTO v_h, v_hu FROM debate_judgments WHERE debate_id = p_debate_id;
    IF v_hu * 2 > v_h THEN
      v_outcome := 'UNDERDETERMINED';
    END IF;
  END IF;

  IF v_outcome IS NULL THEN
    v_unmapped := true;
    v_outcome  := v_review;
    PERFORM log_audit_event(
      'W-D UNMAPPED framework_verdict -- outcome forced to review',
      format('derive_debate_outcome: debate %s produced framework_verdict %L, which the D5 map does not cover. outcome written as the review value so it is never NULL. panel_split %L, rows_total %s.',
             p_debate_id, v_fv, v_split, v_total),
      'W-D', truth_today());
  END IF;

  -- AMENDMENT ONE. FIVE fields: exactly the set aggregate_debate_panel reads.
  SELECT md5(coalesce(string_agg(
           judge_seat||'|'||coalesce(verdict_tag,'<null>')||'|'||truncated::text
           ||'|'||coalesce(defense_standing,'<null>')||'|'||coalesce(challenge_standing,'<null>'),
           chr(10) ORDER BY judge_seat, verdict_tag, truncated, defense_standing, challenge_standing),''))
    INTO v_fp FROM debate_judgments WHERE debate_id = p_debate_id;

  -- AMENDMENT TWO is why framework_verdict is absent from the SET list below: W-D ceases
  -- writing that column entirely. It is absent from this condition for the same reason and
  -- not as a consequence of the SET list -- an UPDATE that cannot alter a column must not
  -- be triggered by it.
  IF v_b_pv     IS NULL
  OR v_b_split  IS DISTINCT FROM v_split
  OR v_b_out    IS DISTINCT FROM v_outcome
  OR v_b_judged IS DISTINCT FROM v_judged
  OR v_b_ud     IS DISTINCT FROM v_ud THEN
    -- Every SET expression is evaluated against the OLD row, so `panel_verdict` inside the
    -- CASE is the PRE-update value, NOT the value the line above assigns. That is what makes
    -- the pair land together on the first stamp and hold together on every call after it,
    -- and it is what the paired-nullity CHECK now enforces structurally.
    UPDATE debate_results
       SET panel_split       = v_split,
           outcome           = v_outcome,
           judged_by         = v_judged,
           underdetermined_seats = v_ud,
           panel_verdict     = COALESCE(panel_verdict, v_fv),
           panel_fingerprint = CASE WHEN panel_verdict IS NULL THEN v_fp ELSE panel_fingerprint END
     WHERE id = p_debate_id;
    v_changed := true;
  END IF;

  RETURN jsonb_build_object(
    'debate_id',                  p_debate_id,
    'debate_date',                v_debate_date,
    'engine',                     v_engine,
    'written',                    true,
    'changed',                    v_changed,
    'framework_verdict',          v_b_fv,
    'panel_verdict',              COALESCE(v_b_pv, v_fv),
    'panel_fingerprint',          COALESCE(v_b_fp, v_fp),
    'panel_fingerprint_recomputed', v_fp,
    'panel_fingerprint_match',    (COALESCE(v_b_fp, v_fp) IS NOT DISTINCT FROM v_fp),
    'panel_split',                v_split,
    'outcome',                    v_outcome,
    'judged_by',                  v_judged,
    'underdetermined_seats',      v_ud,
    'panel_expected',             v_expected,
    'unmapped_framework_verdict', v_unmapped,
    'rows_total',                 v_total,
    'rows_clean',                 (v_panel->>'rows_clean')::int,
    'quorum_met',                 (v_panel->>'quorum_met')::boolean,
    'rows_unreadable',            (v_panel->>'rows_unreadable')::int,
    'unrecognised_verdict_tags',  v_panel->'unrecognised_verdict_tags',
    'seats',                      v_panel->'seats',
    'seats_semantic', 'EVERY judgment row with the aggregate''s own word on whether it COUNTED. A seat with clean=false did NOT count toward the verdict. THREE STATES, NOT TWO: counted; not counted with truncated=true (the write guard quarantined it); not counted with truncated=false (its verdict_tag was unreadable -- either listed in unrecognised_verdict_tags, or UNKNOWN, which the aggregate does NOT list). Read this array, never infer an uncounted seat from truncated alone.',
    'underdetermined_seats_semantic', 'FLAG ONLY (F10, BB-6692). Counted seats that wrote UNDERDETERMINED, as seat:RESULT (its RESULT line) or seat:COLLISION (a collision row). NULL when none. It changes no verdict, outcome, split or fingerprint; it shows how much of a clean outcome the judgment tables left open.',
    'judged_by_semantic', 'EVERY seat that returned a judgment row, clean or not, and it EQUALS panel_expected -- W-D does not reach this point otherwise.',
    'framework_verdict_semantic', 'client-supplied at insert; not panel-verified; derive_debate_outcome stopped writing this column at migration app_source v6, id 36, md5 d4563dbff51f42e9aaed0a66245ce9fa; panel-derived verdict is panel_verdict; precedence between the two columns is UNDECIDED and tracked on the board. NOTE: aggregate_debate_panel''s return key of the same name carries the panel''s live computation, not this column.',
    'panel_verdict_semantic', 'THE PANEL''S VERDICT, STAMPED ONCE AND FROZEN at the first complete-panel write. panel_fingerprint is the digest AS STAMPED; panel_fingerprint_recomputed is the digest of the panel AS IT STANDS NOW; panel_fingerprint_match is false when a judgment row has been edited since the stamp. A DELETED judgment row does NOT reach these keys -- it makes the roster incomplete and W-D refuses at the INCOMPLETE PANEL fence, so deletion is caught by the roster, not by the digest. AN INSERTED judgment row does not reach them either: the added seat is undispatched, so W-D refuses at the UNDISPATCHED SEAT PRESENT fence -- insertion is handled by REFUSAL, not by the digest. The ONE path on which an inserted row reaches these keys is a composite edit that ALSO adds the new seat to panel_expected, so that every fence passes; on that path match is FALSE and it is the only thing standing between a silently grown panel and a caller. panel_split, outcome and judged_by are NOT part of the stamp: they are LIVE re-reads of the judgment rows as they stand at each call, and W-D rewrites them on every call where they differ. When panel_fingerprint_match is FALSE those three fields describe a panel that has MOVED since the stamp and NO LONGER describe the stamped panel -- a row reading panel_verdict=HELD beside outcome=CHALLENGER PREVAILS is the footprint of the tamper, kept in the row on purpose so the signal is not confined to a return key nobody stores (Advisor_C BB-1848 s2). panel_fingerprint is a digest of the PANEL CONTENT -- the five fields above -- and is NEVER a debate identifier: two debates whose panels are identical field for field carry IDENTICAL stamps, by design. Scope to one debate is supplied by the WHERE debate_id clause in the recompute, not by the digest. CAVEAT: digest-unchanged implies outcome-unchanged; digest-changed does NOT imply outcome-changed. TIE BRANCH EXCEPTION: on a debate created at or after v_tie_from whose panel verdict is HELD, outcome also depends on the RESULT lines in verdict_raw of the HELD seats, which the digest does not cover; there, digest-unchanged does NOT imply outcome-unchanged.',
    'write_semantic',     'W-D is the SOLE writer of panel_split, outcome, judged_by, and of panel_verdict/panel_fingerprint AT FIRST STAMP ONLY. It NO LONGER writes framework_verdict at all. COMPLETE PANEL (this fence) and READABLE PANEL (W-C) are two different measurements and neither can do the other job.');
END;
$function$
