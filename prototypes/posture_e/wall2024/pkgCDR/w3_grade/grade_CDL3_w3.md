# W3 grade of pkgCDL rev 3 (W1, commit 8ffdf61b; write file pkgCDL/parent_s103_CDR11_CDF_CDL.json): PASS on the code

1. The rev 2 failure is fixed (record_cdl2_rev3.txt; the output lines are labeled "pkgCDL rev 2" by my script, the file tested is rev 3): one hint answered CONFIRMED on LINK 6 and LINK 5 breaks both links, in either order, as pkgCDF rev 2 and pkgCDR rev 11 do. Two NEW lines both break; a refused first line does not block a good second line; NOT A CONTRADICTION plus CONFIRMED on one hint is still "conflicting answers". The second-link code is not in the write file.
2. Long link phrases (record_cdl3.txt, 19 OK): nine phrases from 25 to 6,000 characters, with quotation marks, a dash pair, brackets, "D6" or "link 6" at the end of a phrase. On CONFIRMED each is read by its id as LINK ?, breaks nothing and is marked for review; on NOT A CONTRADICTION each is read as answered. A 140,000-character line with no verdict does not stop a good line after it (19 ms).
3. My rev 1 set on rev 3: 62 OK (D6, d6, D-6, "D 6", **D6**, D06 break LINK 6; wrong side letter and other forms are LINK ?; challenger forms; rulings equal to pkgCDF rev 2 on ten plain replies).
4. Only Close Enforcer Record differs from pkgCDF rev 2; against live s103 the three pkgCDR nodes; connections equal.
5. Rolled-back insert of a row whose note quotes a 6,000-character link text: rows 1, recorded true.

Notes, not failures:
- The note quotes the enforcer's whole link text, so a 6,000-character phrase gives a 6,291-character note in the log row. Cutting the quotation at about 200 characters would keep rows readable.
- The one enforced part stands as described on Wall 4048: a CONFIRMED written "LINK D6" (or C<n> on the challenger's line) breaks that link.
- Not proven: what link forms DeepSeek writes; the replay on stored text will show them.
