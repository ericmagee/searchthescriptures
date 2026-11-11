# Manual section: pkgCMX (a closing contradiction keeps the other side's break) (W2)

Enter only when written. Figures MEASURED.

Add to CONTRADICTION IN THE CLOSING ROUND (pkgCEC), after "BROKEN by default, for every judge, whatever grade a judge gave that link":
- The code sets the break on every collision line that names the broken link, except a line that already carries the OTHER side's break. That covers both a break the judge graded (DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN) and a break that the other side's confirmed contradiction set. Such a line keeps its grade, and the recompute records "<side> break not set: the line already carries the <other side> break".
- When no line takes the break, it is counted once as "<side> LINK BROKEN" ("no collision line names it; counted as one ..."), so both sides' breaks enter the counts, the standings and the RESULT.
- Before pkgCMX, the closing break replaced the other side's graded break. A challenger contradiction could then erase a defender break by meaning and turn BROKEN into HELD (W4 plant, Wall 4818).
- The gate's reading of collision lines (gateAnsOpen) follows the same rule.

Size: Shared Library +395 (lines 1323, 1484, 1671); prompt 0.

Limits:
- The count line reads "no collision line names it" even when a line names the link but carries the other side's break; the "not set" line beside it says which.
- A judge's keystone reason text is not rewritten when a non-keystone link breaks (Wall 4808 Problem 2, record-only).

First-run check: on a run with a confirmed closing contradiction, no recompute line reads "(CHALLENGER LINK BROKEN to DEFENDER LINK BROKEN)" or "(DEFENDER LINK BROKEN to CHALLENGER LINK BROKEN)"; each such line reads "break not set". No Panel Cure Check, Cure Check, Gate or Alternate Merge error.
