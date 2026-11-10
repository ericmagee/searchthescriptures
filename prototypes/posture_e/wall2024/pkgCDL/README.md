# pkgCDL rev 1 (W1): record-only follow-on to pkgCDF rev 2 (W2's note, coordinator 05:20Z). No ruling changes beyond reading the enforcer's own link word.

Built on pkgCDF rev 2's write file: `node pkgCDL/build_CDL.cjs pkgCDF/parent_s103_CDR11_CDF.json pkgCDL/parent_s103_CDR11_CDF_CDL.json`.
Against pkgCDF rev 2 only Close Enforcer Record differs.

Gap (predates pkgCDF, found by W2): an enforcer answer written "LINK D6" or "LINK N/A" did not match the line form, so the line was UNREADABLE,
the candidate was left NO ANSWER, and a true CONFIRMED written that way was lost without a mark.

Change (reads the enforcer's answer only, never a guess from the round text)
1. Record takes any LINK word up to the next "--" (24 characters at most).
2. A number is read as before. "LINK D<n>" on a DEFENDER line and "LINK C<n>" on a CHALLENGER line are read as LINK n (also "D 6", "D-6",
   lowercase); the note says "the enforcer wrote LINK D6, read as LINK 6". The link must still be one of that side's declared links.
3. A wrong side letter ("LINK C6" on a DEFENDER line) or any other form ("LINK N/A", "LINK 6 (D6)") is read as LINK ? with a note quoting
   what the enforcer wrote. The line is read by its id. A CONFIRMED with both quotations standing breaks nothing and carries pkgCDF's
   RECORD-ONLY FOR REVIEW note.

Checks (labels committed before the build, 5dff5756)
- record_CDL.txt: C1 to C8, 8 OK, 0 FAIL (D6 read and breaks D6; C6 on defender and N/A marked for review, nothing broken; every hint answered with
  D/C/N/A forms read, none NO ANSWER; challenger C<n> read, D<n> on challenger read as ?; D99 read as 99 and refused as undeclared, unmarked;
  plain LINK 6 unchanged).
- record_CDF_on_CDL.txt: pkgCDF's 10 checks on the pkgCDL file, 10 OK.
- Rolled-back insert of a pkgCDL RECORD-ONLY row (rows_CDL_rollback.json): rows 1, recorded true.
- No stored E-CLOSECON enforcer lines exist in the log to replay; the forms are planted.
