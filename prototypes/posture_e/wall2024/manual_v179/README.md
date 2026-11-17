# engine_manual v179 draft (W3): provenance out of the body

Operator, 19:18 CST 11-16: "make the necessary changes to make it compliment" (compliant with section 0 body law: "no provenance in the body").

Base: v178, md5 944287e546a701c3ef9c25cdb8f8f044, 523,644 characters.
Result (rev 2): md5 8b81942147136d89151cedd7ff59ab31, 517,081 characters (-6,563). Measured by SQL. Rev 1 was de8ca989, 517,261.

Steps (core179.sql; read-only; returns nothing if v178's md5 differs):
1. Delete whole lines "- WRITTEN AS ..." (23) and "- Graded PASS by ..." (2).
2. Delete inline sentences " Graded PASS by ... ." (10).
3. pairs179.json, in order: 101 literal pairs. Rev 1 had 91 (Wall-citing parentheticals: 78 removed, 13 cut). Rev 2 adds 10 on W2 7293 and W1 7294: (A3 7007 ...) x3, (W1 Wall 6504, ...) cut, (Wall 6574), (W2's P11 and P12 ...) cut, "matching W1's baseline", two write-report sentences, "Shown offline: W4 cases".
Kept: "(pkgECF, W3 2534)" inside the AUDIT v41 string (literal code text).
After: 0 "WRITTEN AS", 0 "Graded PASS", 0 Wall citations. Seat names left: the AUDIT v41 code literal; the retired flow names (W1, W2 to W7 families); "the 37281 W3-form line" (a line form named in data).
Log row (W1 7294 item 4): the v179 engine_manual_log row carries the 25 deleted lines verbatim from v178, so the n8n ids, revert targets and library shas of s206 to s209 stay on record.
Not in scope: test evidence ("Shown offline", replay counts) and rulings, which state how the rules were set.
