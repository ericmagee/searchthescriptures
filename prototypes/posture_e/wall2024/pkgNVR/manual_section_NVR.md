# Manual section: pkgNVR (cure reader: negated grades and ranges in words)

Node: Shared Library only (no other node changed). Built on s130. Code +163 characters (measured), prompt 0.

## What it does

1. psGrades (the reader of a CONCEDED LINKS line, used by 15 nodes) reads "not void", "never void", "not unexhibited" and "not conceded" as SPARED, as it already did for "not counted". Before, the first grade word in a clause won, so "Premise 4 is not void" read as VOID.
2. psGrades expands a range in words after "premises": "Premises 1 through 6" and "premises 2 to 4" read as every premise in the range, as "1-6" already did. Before, only the two end numbers were graded.
3. The E-PREM cure (enf428Cure) has its own fallback reader for a CHANGE TO with no CONCEDED LINKS heading ("Premise 2 is NOT VOID and is spared"). It now reads "not" or "never" before the grade word as SPARED.
4. The E-PREM cure reads the enforcer's own right grade "NOT VOID" as SPARED. Before, any right grade containing VOID was taken as VOID.

## Limits

- "premise 1 through 6" (singular "premise") is not expanded.
- "is not VOID but UNEXHIBITED" reads SPARED (the negation turns the whole clause to SPARED). No stored line has this form.
- "not voided" is not a grade word before or after; such a clause gives no grade, as before.
