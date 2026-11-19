# ASK 488 plan, rev 0 (W3, seat 33), 2026-11-19 ~11:00 CST

RULING (operator, 10:50 CST card, relayed by the coordinator): when the counted judges' RESULT words agree,
that RESULT is the run's outcome, even if the tags split. (W1 9666 PROPOSAL A.) Queued for the op doc.

Where the outcome is made: DB function derive_debate_outcome(uuid) (W-D, sole writer of outcome;
live md5 fd0756967bac474c102a66116623540a, 25385 chars). Panel Done only reads its result. No engine change.
Today: v_outcome := d5_outcome_for(framework_verdict) (line 139); CONTESTED and UNGRADED map to
'UNGRADED — REVIEW'. Then the TIE block (lines 156-168), then pkgCFO (170-178), then the citation rule.

CHANGE: one new block between the TIE block (line 168) and pkgCFO (line 170), plus one constant:
  v_agree_from constant timestamptz := '<write time>';   -- debates created at or after it
  IF v_created >= v_agree_from AND cardinality(v_counted) >= 2 THEN
    words := judgment_result_word(verdict_raw, judge_seat, challenge_standing) of every counted seat (v_counted);
    IF every word is non-null and all are equal THEN
      UNDERDETERMINED -> v_outcome := 'UNDERDETERMINED'
      CHALLENGER WINS -> v_outcome := 'CHALLENGER PREVAILS'
      DEFENDER WINS   -> v_outcome := 'DEFENDER PREVAILS', except that a v_outcome already
                         'DEFENDER PREVAILS, WEAKENED' (a PARTIAL panel) is kept: same side.
    END IF;
  END IF;
Counted seats = the aggregate's clean=true seats, the same set the F10 flag (v_ud) already reads,
and the word is the same judgment_result_word the TIE rule uses (it already reads the ENGINE RESULT tag
and the CORRECTED RESULT recompute, so haiku's stale first line is not read).
pkgCFO and the citation rule still run after it, unchanged. panel_split, panel_verdict, tags and the
fingerprint are unchanged; the split stays reported beside the outcome (ruling: "even if tags split").
The function's semantic text gets one sentence: the outcome may follow agreeing RESULT words (ASK 488).

Team design points (graders confirm):
 a. at least 2 counted seats (one seat cannot "agree");
 b. a seat with no readable word (null) blocks agreement;
 c. DEFENDER WINS keeps WEAKENED on a PARTIAL panel (same side; the ruling names the side, not the grade);
 d. from-time = write time, as with every earlier outcome rule. Run 440 (ODV1-40781) keeps its recorded
    outcome unless the operator asks for it to be re-derived.

Expected on run 440 if re-derived in a rolled-back test: counted chatgpt, haiku, sol; words all
UNDERDETERMINED (underdetermined_seats chatgpt:RESULT, haiku:RESULT, sol:RESULT) -> outcome UNDERDETERMINED
instead of 'UNGRADED — REVIEW'; panel_split unchanged.

Tests (rolled back, W4): T1 run 440 with v_agree_from moved before it: UNDERDETERMINED. T2 a run whose words
split: outcome unchanged from today. T3 a PARTIAL panel all DEFENDER WINS: WEAKENED kept. T4 a run with a CFO
row: CFO still decides after. T5 every debate_results row since 2026-11-01 re-derived in the rollback with the
real from-time: 0 outcome changes. Revert: the prior function text (pg_get_functiondef saved, md5 above).
Builder and card: W4. Graders: W1, W2.
Overlaps: none with ASK 486/487 (engine). ASK 482 dashboard shows outcome as stored; no change.
