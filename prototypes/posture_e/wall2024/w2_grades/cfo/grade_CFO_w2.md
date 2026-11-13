# W2 grade: pkgCFO (ASK 167 part B; ASK 178 "Neither: UNDERDETERMINED"), database only. 22:10 CST 11-12

VERDICT: NOT PASSED. One finding (F1); the fix is one clause.

## Checks (MEASURED, live read only)
- derive_debate_outcome on live:
  - md5 f9f1c6127c02223a00b931a4c05d49a0, one overload, SECURITY DEFINER.
  - Each anchor occurs exactly once.
- The DO block's three replaces, run as a SELECT on the live text (no EXECUTE):
  - growth is +795 characters;
  - the block lands after the TIE rule and before the CITATION RULE;
  - the revert's regex removes all three pieces and returns md5 f9f1c612.
- Roles lab_seat, service_role and berean_ro exist on live.
- derive_debate_outcome runs as its owner, so cfo_sides is reachable from W-D after the REVOKE.
- Timing (W1 limit 4): the only W-D call in s175 is the Derive Outcome node. Its upstream chain is Alternate Merge -> Record Substitution/Alternates -> Write Judgment 1-3 -> Write Enforcer Log -> Derive Outcome, so the log rows are written before W-D reads them.
  - Run 36156: the E-CLOSECON rows (03:10:49.6) come after the last judgment (03:10:47.2), both before Derive Outcome.
  - All 3 rows carry debate_id and the run's token.
- Stored debates under cfo_sides (if they were new): 35526 and 35554 have both sides; six other runs have the defender only. This matches W1.

## Plants (local postgres 16; plants_cfo_sides.sql, plants_block.sql)
cfo_sides, 7 of 7 as wanted:
- Q1: J3 judge-found challenger with a bare "CONFIRMED" gives {CHALLENGER}.
- Q2: "CONFIRMED (second check)", "CONFIRMEDLY" and " CONFIRMED" give {}.
- Q3: item "NEW2 ..." gives {}.
- Q4: another rule or kind cure gives {}.
- Q5: a NULL debate_id gives {}.
- Q6: two defender rows and one challenger row give {CHALLENGER,DEFENDER}.
- Q7: a TEST token gives {}.
- anon is refused.

The block (exact pkgCFO text, between a stubbed outcome and the citation rule):
- R1: UNDERDETERMINED from the tie rule, with the challenger forfeiting, gives DEFENDER PREVAILS.
- R2: see F1.
- R3: a challenger forfeit then a defender citation failure gives REVIEW. The citation rule still applies.
- R4: both sides give UNDERDETERMINED.
- R5: created 1 s before the write leaves the outcome unchanged.
- R6: a review outcome stays.

## F1: a challenger forfeit erases "WEAKENED"
- A PARTIAL panel maps to "DEFENDER PREVAILS, WEAKENED" (d5_outcome_for; 1 debate in 30 days).
- With a challenger forfeit, the block writes plain "DEFENDER PREVAILS" (R2). The panel's finding that the defender's chain was weakened is dropped silently, and the package does not state it.
- Fix: `ELSIF v_cfo @> ARRAY['CHALLENGER'] AND v_outcome <> 'DEFENDER PREVAILS, WEAKENED' THEN`, about +50.
- The other reading (a forfeit gives a plain win) is a ruling for the operator. If that is intended, it must be stated.

## Limits
- L1. A defender forfeit is not enforced by this gate. It relies on the engine's link break turning the panel BROKEN. If a panel stays HELD, PARTIAL or tied with a confirmed defender contradiction, the outcome does not change.
  - No stored case exists (all defender-only debates are CHALLENGER PREVAILS or REVIEW).
  - Symmetry would need one more ELSIF.
- L2. Review outcomes stay review. In two stored runs (34726, 34852) the defender confirmed and the outcome is REVIEW.
- L3. Close Enforcer Record accepts the id "NEW 2", which becomes the item "NEW2 ...". dfl_counted does not read that item, so such a row would not forfeit (Q3). No stored row has that form.
- L4. W1's limits (1) to (5) stand. The judge-found path (jcc) forfeits on one check.
