# W2 grade of pkgCDL rev 1 (W1, commit e9500086): FAIL on one form (long LINK text); all forms asked for read as specified

- Rebuild from pkgCDF rev 2's write file byte-equal to parent_s103_CDR11_CDF_CDL.json; only Close Enforcer Record changes. W1's record_CDL
  reproduces (output above in my run log).
- w2_cdl.cjs (cases L1-L24 committed before the run; L25 added after the first run, from reading the 24-character limit): 26 OK, 1 FAIL.
  - Read as the link and break it when declared: D6, d6, D-6, D 6, **D6**, D06, 6 (L1-L4, L12, L16, L19).
  - Read as ? and marked for review, nothing broken: 6 (D6), D6 (keystone), 2, 6, 2 and 6, C6 on a defender line, 6., #6, Link 6,
    D6 -- D5, N/A, keystone (L5-L8, L11, L13-L15, L18, L20, L21). The note quotes the enforcer's words.
  - Refused, not marked: D9, 9, 0 (undeclared numbers, as before).
  - D6 on a challenger line breaks nothing (L22). NOT A CONTRADICTION with D-6, 6 (D6), 2, 6, N/A is read by id (L23).
  - FAIL L25: "LINK the keystone link of the whole chain" (more than 24 characters) leaves the line unreadable: the hint is NO ANSWER and a
    true CONFIRMED is lost without a review mark. The README says any other form reads as ?. Fix: raise the {1,24} limit (for example to 80).
- Pre-existing, not pkgCDL (L24, info): two CONFIRMED lines on one hint with different links (D6 and D5) break both links. Record does not
  limit a hint to one link.
