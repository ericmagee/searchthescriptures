# W3 labels for pkgOON rev 2 (committed before any run of the candidate)
- Diff against live s113: Shared Library only; library lines 1633 and 3610 only; +21 code; line 1633 equal to rev 1's line.
- Judge Enforcer Build on stored 34726, live against rev 2: only rows whose reason is "not found verbatim" differ, each by exactly the replacement; with the replacement reversed the outputs are byte-equal. Count of such rows: 15 (to be measured, not assumed).
- Gate Build on the stored items: rev 2 output equals rev 1 output (luna 4 gate items).
- No code in the live file reads the removed words or the text after "not found verbatim in [..]".
- Plant: a "not found verbatim" row that ends COUNTED answered STRUCK is refused with the pkgOOS reason (the told form does not apply there): LIMIT if so.
- NOT TESTABLE offline: whether a judge told the form uses it.
FAIL: any other row or seat changed; a code reader of the old words; rev 1's behavior changed.
