# pkgUOR: UNDERDETERMINED grounds may stand in the reason after "||"

Base: live s151. Only the Shared Library changes (library lines 1900 to 1915, the UND block of pkgUND). Prompt 0.
Size (MEASURED): Shared Library +495. Nine rebuilt nodes: Send Back Build, Alt and R2 Alt Send Back Build +472 each;
Send Back Record, Alt and R2 Alt Send Back Record, Gate Record, Alt and R2 Alt Gate Record +484 each. Stubs unchanged.
File: /mnt/project-files/wall2024/parent_s151_UOR.json. Build and tests: prototypes/posture_e/wall2024/pkgUOR/.

## Why
The operator ruled on 2026-11-12 (06:02Z) that over-strict line formats are relaxed as needed. In run 35379 haiku answered
four E-UNG items (S8 to S11) with a graded UNDERDETERMINED line and a counted [L1], but wrote what the record leaves open
in its reason after "||", not in the line. The cure read only the line, so all four stayed UNCURED and counted against haiku.
Run 35296 sol S11 (E-HOLD) put "||" straight after the grade, so both its [L1] and its open point stood in the reason.

## Rule
For an E-UNG item graded UNDERDETERMINED, and for an E-HOLD item kept UNDERDETERMINED, the cure reads the open point from the
CHANGE TO line or, if the line has none, from the reason after "||". If the line has no [L1], the [L1] is read from the line
and the reason together. Everything else is unchanged: the graded "Dn vs Cm" line must stand in the CHANGE TO, KEEP does not
cure, RETRACTED does not grade a pressed link, and BROKEN, STANDS and MEETS regrades are read as before. The cure reason says
when the reason supplied the open point or the [L1] ("in the reason after "||", pkgUOR").

## Tests (MEASURED)
- test_out.txt: 19 of 19 as expected. Haiku S8 to S11 and sol S11 go from UNCURED to CURED. Open point nowhere, [L1] nowhere,
  KEEP, no answer, another link's line, RETRACTED, and no reason all stay UNCURED.
- corpus_out.txt: all 13 stored send-back rows the pkgUND cure left UNCURED with a reply line. 5 change (haiku 35379 S8 to S11,
  sol 35296 S11), each UNCURED to CURED; 8 are the same.

## Limits
- The gate path (pkgGUB, a counted line that loses its count when the gate's new line passes) still reads the line only.
- The [L1] count was run with no verse rows (an unread verse counts as given, the pkgUND rule); the live count checks the quoted words.
- The open-point words are pkgUND's list; a reason that negates them ("does not leave it open") is read as stating it, as the line is today.
- Haiku stays removed in 35379: E-GATE x2 and E-APPLY x1 remain true failures.
- Both pkgMSO and pkgRPS also edit the Shared Library; a joint parent is needed before any write.
