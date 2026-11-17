# engine_manual v179 draft (W3): provenance out of the body

Operator, 19:18 CST 11-16: "make the necessary changes to make it compliment" (compliant with section 0 body law: "no provenance in the body").

Base: v178, md5 944287e546a701c3ef9c25cdb8f8f044, 523,644 characters.
Result: md5 de8ca9893d28960e01d36a3dfd65660c, 517,261 characters (-6,383). Measured by SQL.

Steps (core179.sql; read-only; returns nothing if v178's md5 differs):
1. Delete whole lines "- WRITTEN AS ..." (23) and "- Graded PASS by ..." (2).
2. Delete inline sentences " Graded PASS by ... ." (10).
3. pairs179.json, in order: 91 parentheticals that cite Wall posts. 75 + 3 bare are removed; 13 are cut to their non-provenance words (listed in edits179.py CUT).
Kept: "(pkgECF, W3 2534)" inside the AUDIT v41 string (literal code text).
After: 0 "WRITTEN AS", 0 "Graded PASS", 0 bare "(NNNN)" Wall refs; 1 seat ref left (the code literal).
Not in scope: test evidence ("Shown offline", replay counts) and rulings, which state how the rules were set.
