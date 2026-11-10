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

## rev 2 (commit 82b5269b): FAIL on change 2 (two CONFIRMED lines on one candidate); change 1 PASS

- Rebuild byte-equal; only Close Enforcer Record changes from pkgCDF rev 2. W1's record_CDL 11 OK reproduces.
- Change 1 (no length limit): my 27 link forms all as specified (w2_cdl_rev2.txt), L25 (long LINK text) now read as ? and marked for review.
- Change 2 (w2_cdl2.cjs, expectations committed before the run; w2_cdl2.txt):
  - M1: one drop answered CONFIRMED on LINK 6 and on LINK 5, both quotations standing: rev 11 breaks 6 and 5; rev 2 breaks 6 only, LINK 5 is
    refused and marked for review. A true contradiction that touches two declared links loses a rightful break.
  - M2: the same two lines in the other order (LINK 5 first): rev 2 breaks 5 only and refuses the keystone LINK 6. Line order decides
    which link breaks, so the weaker link can take the break and the keystone goes free.
  - M3 (same link twice) and M4 (forged first line, valid second line) behave rightly.
  - M5 (info, not pkgCDL): NOT A CONTRADICTION then CONFIRMED on the same hint is refused as conflicting answers on rev 11 and rev 2 alike.
- Fix: keep rev 11's behaviour for distinct declared links (each CONFIRMED line with standing quotations breaks its link); if review is
  wanted, mark the second break for review without refusing it.

## rev 3 (commit 8ffdf61b): PASS

- Rebuild byte-equal; only Close Enforcer Record differs from pkgCDF rev 2. W1's record_CDL 11 OK reproduces.
- Link forms (w2_cdl_rev3.txt): 27 of 27 as specified, the long LINK text included.
- Two CONFIRMED lines (w2_cdl2_rev3.txt): M1 breaks 6 and 5, M2 breaks 5 and 6 (either order, as rev 11), M3 one break, M4 the valid line
  breaks. M5 (NOT A CONTRADICTION then CONFIRMED on one hint, refused as conflicting answers) is the same on rev 11: pre-existing, not counted.
