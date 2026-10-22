CREATE OR REPLACE FUNCTION public.record_integrity_scan()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
  f jsonb := '[]'::jsonb;
  n int;
  m int;
BEGIN
  -- 1. FUTURE-DATED ROWS (the UTC rollover class). audit_log is append-only and is NOT
  --    backfillable by design -- it is reported so the number is never mistaken for zero.
  SELECT count(*) INTO n FROM debate_results WHERE debate_date > (created_at AT TIME ZONE 'America/Chicago')::date;
  SELECT count(*) INTO m FROM journal_entries WHERE entry_date > (created_at AT TIME ZONE 'America/Chicago')::date;
  n := n + m;
  SELECT count(*) INTO m FROM kb_sights WHERE session_date > (created_at AT TIME ZONE 'America/Chicago')::date;
  n := n + m;
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','HIGH','check','future_dated_rows','count',n,
      'detail','Rows dated ahead of their own America/Chicago creation day in debate_results/journal_entries/kb_sights. Root cause class: CURRENT_DATE or new Date() resolving in UTC. Use truth_today().');
  END IF;
  SELECT count(*) INTO m FROM audit_log WHERE session_date > (created_at AT TIME ZONE 'America/Chicago')::date;
  IF m > 0 THEN
    f := f || jsonb_build_object('severity','INFO','check','audit_log_future_dated_historical','count',m,
      'detail','audit_log is append-only and deliberately NOT backfilled -- the ledger records what was written, wrong date included. Guarded going forward only.');
  END IF;

  -- 2. A SEVERED ROUND THAT ESCAPED QUARANTINE. The write guard catches inserts; this catches
  --    anything that arrived another way or was updated after insert.
  SELECT count(*) INTO n FROM debate_results
   WHERE quarantine_reason IS NULL
     AND (COALESCE(claude_r1,'')||COALESCE(engine_r1,'')||COALESCE(claude_r2,'')||COALESCE(engine_r2,'')||
          COALESCE(engine_r3,'')||COALESCE(challenger_r3,'')||COALESCE(synthesis,'')||COALESCE(independent_verdict_raw,'')) ~ 'TRUNCAT';
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','CRITICAL','check','unquarantined_truncated_rows','count',n,
      'detail','A verdict is being counted over a round the token cap severed. Match on the CAPITALISED marker only -- a case-insensitive search also hits ordinary debate prose about truncation.');
  END IF;

  -- 3. TEST-SHAPED TOPICS STILL COUNTED AS STUDY EVIDENCE.
  SELECT count(*) INTO n FROM debate_results
   WHERE data_class = 'study' AND topic ~* '(^__|SELFTEST|smoke test|VERIFY RPC|WRITE PATH|delete me|wiring test|Wiring smoke)';
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','HIGH','check','test_rows_classed_study','count',n,
      'detail','A write-path or smoke test is sitting in the admissible set and may carry a verdict.');
  END IF;

  -- 4. THE HELD+COLLAPSED ARTIFACT (pre-v11 rubric; Coupling B was written to dissolve it). A verdict is paired with the defense
  --    standing of the same reading (THE DEBATE FIXED, BB-7397, DoD 6, BB-7418, option (b) BB-7425): each counted panel judgment beside
  --    its own standing; and a debate row created before __CUTOVER__ (the publish that made framework_verdict the panel's word), where
  --    framework_verdict was still the single judge's own word beside its own standing. A later debate row pairs the panel's verdict
  --    with the single judge's standing, which is not one reading, so it is not counted here.
  SELECT count(*) INTO n FROM debate_judgments WHERE verdict_tag='HELD' AND defense_standing='COLLAPSED';
  SELECT count(*) INTO m FROM debate_results WHERE framework_verdict='HELD' AND defense_standing='COLLAPSED' AND created_at < TIMESTAMPTZ '__CUTOVER__';
  n := n + m;
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','MEDIUM','check','held_with_collapsed_defense','count',n,
      'detail','Judgments, and debate rows created before __CUTOVER__, graded HELD while the same reading''s defense COLLAPSED -- the single-verse-era artifact. Read each by its epoch before citing; engine_manual v11 Coupling B forbids the pairing going forward.');
  END IF;

  -- 5. ADMISSIBLE-SET HEALTH, always reported so the board is never read without its exclusions.
  f := f || jsonb_build_object('severity','INFO','check','admissible_set',
        'detail', (SELECT 'study_rows=' || study_rows || ' scored=' || study_scored || ' held=' || study_held
                          || ' held_pct=' || COALESCE(study_held_pct::text,'n/a')
                          || ' | excluded: harness=' || excluded_harness || ' test=' || excluded_test
                          || ' guard_fire=' || excluded_guard_fire || ' quarantined=' || excluded_quarantined
                          || ' | legacy_kb=' || legacy_kb_rows || ' (held ' || legacy_kb_held || ', frozen ' || legacy_kb_last_date || ', inclusion UNRULED)'
                   FROM scoreboard_stats));

  -- 6. A FENCED SIGHT CARRYING A VECTOR (added 2026-07-28, Eric-ruled). production_safe=false marks
  --    a cliff, fork, OPEN, SUPERSEDED, WITHDRAWN or L4-only sight -- material the Oracle must not
  --    serve. As of this date the fence is STRUCTURAL: constraint kb_sights_fenced_rows_carry_no_vector
  --    plus trigger trg_sight_embedding_fence, which strips the vector on demotion. Six rows had
  --    already drifted in before it existed (sights 113/114/115/163 SUPERSEDED, 538 CLIFF, 560 OPEN),
  --    held out of the served set only by a WHERE clause hand-copied into three readers and absent
  --    from the writer update_sight_embeddings. This check exists so that if the constraint or the
  --    trigger is ever dropped, the drift is REPORTED and not merely re-enabled in silence.
  SELECT count(*) INTO n FROM kb_sights WHERE production_safe IS NOT TRUE AND embedding IS NOT NULL;
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','CRITICAL','check','fenced_sight_carries_vector','count',n,
      'detail','A sight with production_safe=false is holding an embedding, so it is one forgotten WHERE clause away from the Oracle retrieval surface. Expected 0 while kb_sights_fenced_rows_carry_no_vector and trg_sight_embedding_fence are both live -- a nonzero count means one of them is gone. Clear the vectors (UPDATE kb_sights SET embedding=NULL WHERE production_safe IS NOT TRUE) and restore the fence before trusting any retrieval result.');
  END IF;

  -- 7. A BLACKBOARD CROSS-REFERENCE POINTING AT NOTHING (added 2026-08-04, Eric-directed).
  --    blackboard.refs is a plain text[] with no foreign key. It legitimately carries non-entry
  --    tokens (workflow ids, function names, version tags), so ONLY tokens shaped ^BB-[0-9]+$ are
  --    checked -- everything else is free text by design and is not a defect. The board cites
  --    itself by entry_ref, not by id, so a typo in a ref silently points at nothing and raises
  --    no error. Baseline at install: 681 BB-shaped tokens, 0 dangling. The first nonzero is a
  --    real event, not noise.
  SELECT count(*) INTO n
    FROM (SELECT unnest(refs) AS ref FROM blackboard WHERE refs IS NOT NULL) t
   WHERE t.ref ~ '^BB-[0-9]+$'
     AND NOT EXISTS (SELECT 1 FROM blackboard x WHERE x.entry_ref = t.ref);
  IF n > 0 THEN
    f := f || jsonb_build_object('severity','MEDIUM','check','dangling_blackboard_refs','count',n,
      'detail','One or more blackboard.refs tokens are shaped like an entry reference but match no entry_ref. The cross-reference layer is unvalidated text -- nothing rejects a typo at write time. Find them with: SELECT entry_ref, ref FROM (SELECT entry_ref, unnest(refs) ref FROM blackboard WHERE refs IS NOT NULL) t WHERE ref ~ ''^BB-[0-9]+$'' AND NOT EXISTS (SELECT 1 FROM blackboard x WHERE x.entry_ref = t.ref). A dangling ref cannot be repaired in place: refs is mutable, but subject and body are not, so a ref cited in the body text must be corrected by a follow-up entry.');
  END IF;

  RETURN jsonb_build_object(
    'scanned_at_cdt', to_char(NOW() AT TIME ZONE 'America/Chicago','YYYY-MM-DD HH24:MI'),
    'clean', NOT EXISTS (SELECT 1 FROM jsonb_array_elements(f) e WHERE e->>'severity' IN ('CRITICAL','HIGH','MEDIUM')),
    'findings', f,
    'note', 'A marker nobody queries is not a safeguard. This scan is the reader (journal 703; engine_manual v16 section 5 item 14). It reports; it never blocks and never writes.');
END;
$function$
