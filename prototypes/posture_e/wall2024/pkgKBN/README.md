# pkgKBN rev 1 (W2): pkgKBG limits

Two limits of pkgKBG (live since s99) in the three Send Back Record nodes
(Send Back Record, Alt Send Back Record, R2 Alt Send Back Record).

1. Lead-in not stripped. `__lm` strips a leading reference label ("Luke 3:23:")
   but not a lead-in word before it, so "On Luke 3:23, I grant ..." is not read
   as a bare grant and the KEEP reads CURED. KBN lets the label regex take an
   optional lead-in (On, In, At, For, Under, As to, Regarding) and a range
   ("3:23-24"):
   `^(?:(?:On|In|At|For|Under|As\s+to|Regarding)\s+)?REF(?:\s*[-–,]\s*\d+)*[.:,]?[*_]*\s+(?=\S)`
2. Wrong reason text. A thesis sentence opening "I affirm ..." is cut by `__gr`
   (which includes "affirm") with a reason that calls it a grant. The reason now
   reads "another bare grant, affirmation or deferral of the answering side".
   The test itself is unchanged.

Built on the s100 fetch-back: `parent_s100_KBN.json`
(`node pkgKBN/build_KBN.cjs`). KBN and pkgVPD rev 2 change the same three nodes
with independent anchors. Whichever is written second must be rebuilt on the
then-live version.

Side effect to grade: `__lm` is also used by pkgKQG's flagged-answer bare test,
so a flagged ANSWER with a lead-in ("On Luke 3:23, I grant it.") now reads bare
there as well.

## Tests (labels fixed before the run, except L10)

- `plant_KBN.cjs` -> `plant_KBN.txt`: 25 OK, 0 FAIL.
  - L1 to L6 (lead-in forms, bold tag, range): live CURED, KBN UNCURED.
  - L7 to L10 controls; L8 and L9 (lead-in followed by content or a reason) stay CURED.
  - A1, A2: reason text.
  - 34108 stored send-back rows: 27 rows equal to the base.
- `replay_KBN.cjs` -> `replay_KBN.txt`: 42 stored runs, 42 equal, 0 differ
  (16 runs could not be replayed by the harness; 68 E-ANS KEEP rows on live).
- Rolled-back insert `rollback_KBN.sql` (3 rows: UNCURED, CURED, deferral;
  tag W2-ROLLBACK-TEST-KBN): the insert took 3 rows, the RAISE rolled it back,
  0 rows remain. 20:00 CST 11-09.

## Mistakes

- L10 "For Luke 3:23, see LINK 2." was labeled CURED before the run. That label
  was wrong: it is a bare deferral and live already cuts it. Corrected to
  UNCURED after the run; the change is noted in the case name.
- I first named this package pkgKBL and the build overwrote the tracked file
  pkgKBL/build_KBL.cjs. I restored it with `git checkout` before any commit
  and renamed this package pkgKBN. Nothing of pkgKBL was committed changed.
