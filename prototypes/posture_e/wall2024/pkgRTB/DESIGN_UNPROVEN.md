# pkgRTB family 4: K-G11 / K-P (a BROKEN line or a count resting on a press that is no witness), design (W2, 11-08)

Fourth family of the approved rule table (D50, Eric 07:42 CST 11-08, Wall 3161). Same method as families 1 to 3: one row in
pkgRTB/rule_table.cjs, every copy rendered from it at build time, a conformance test against the engine's own checks, and a byte-equal
replay once the old text is put back. Base: the s67 library (strip_RTB3 -> GDS -> SGA3; Shared Library 298c80173d04).

## What the engine enforces (source of truth; no engine change in this family)

Raised in the 4 Payloads/Verdict nodes (drvBrokenPW and the count reader):
- K-G11: a LINK BROKEN line resting, as unanswered, only on verses no premise of the list carries under PRESSED WITH (ruling 392).
- K-P (line form, premise==null): the same, where a verse is a press the ledger marks UNPROVEN (ruling 398).
- K-G10 / K-P (count form, premise!=null): a premise counted UNEXHIBITED only on such verses.
Cure (Panel Cure Build, one branch for K-G11 and line-form K-P):
- RETRACTED for the link (family 2 reason check), or
- one RESTATED line not graded LINK BROKEN, or
- one RESTATED LINK BROKEN line that names, as left unanswered, a verse in the side's proven pressed-witness set (pwUnans ∩ pwk).
  Two RESTATED lines: UNCURED.
Cure (count-form K-P): one CORRECTED COUNT for the side at most (conceded count - open K-G10/K-P premises), plus the CORRECTED STANDING
that count makes true. No STATEMENT cure for K-P (K-G10 has one: quote the PRESSED WITH line that carries the verse).
Both are TRIAL (ENF_STATUS): marked, removes no seat.

## Copies today, and where they drift

| copy | where | count | drift |
|---|---|---|---|
| K-G11 clause | cure ask (library) | 26 | matches the engine |
| K-P clause, BROKEN half | cure ask | 26 | "a RESTATED line ... that rests on a proven press": the engine needs the restated line to NAME, as left unanswered, a proven pressed witness. "Rests on" is looser; the K-G11 clause already says it the engine's way |
| K-P clause, count half | cure ask | 26 | matches |
| AUDIT v26 (K-G11) / v28 (K-P) marks | Payloads x4 (30 copies with the gate/merge carriers) | 30 / 8 | "answer it in the cure" with no cure form: no RETRACTED reason rule, no restated-line rule |
| send-back line for these items | cureLabel | all | prints only the judge's line; the judge sees no cure form |
| ledger + agreement (rulings 392, 398) | Panel Build, prompt nodes | 18 / 32 | explanations of the rules, not cure forms; out of scope |
| PW_PRESSR | engine | 30 | a second copy of CURE_PRESS inside the engine; equal today; engine code, out of scope (noted for a later engine package) |

## The row

```
PU: {
 restated: 'one RESTATED LINK BROKEN line that names, as left unanswered, a verse the ledger marks PROVEN (or PROVEN BY REFERENCE) under PRESSED WITH: for that side',
 notBroken: 'one RESTATED line for it that is not graded LINK BROKEN',
 retract: RX.render.clause('that line'),      // family 2
 count: 'CORRECTED COUNT for that side without that premise, and the CORRECTED STANDING that count makes true',
 render: { kg11Clause, kpClause, mark (v26/v28 tail: "Cure it with ...") }
}
```

## Test
- Conformance: the K-P BROKEN wording equals the K-G11 restated wording (one render); a restated example line passes the engine's
  pwUnans ∩ pwk test on a saved run with a proven press, and a "rests on" line that names no proven press fails it; the count wording
  matches the count branch (cap and standing).
- No old copy left; render counts equal the tally.
- Replay: every changed node on every saved run byte-equal once each render is put back.

## Not in scope
- No reader or cure logic changes. K-G10's STATEMENT cure keeps its text.
