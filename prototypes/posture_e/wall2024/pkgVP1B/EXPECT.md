# pkgVP1B (W3): expectations, written before the candidate was run
Fault (grade_34852.md section 2 item 2): gateAnsOpen2024 ties an ANSWER CHECK graded MISSES or FAILS to every link whose list entry carries the verse; when the verse stands under two links with two MEANS, the check is raised against both.
Fix: when the verse is carried under more than one link, keep the link(s) whose PRESSED WITH line for that verse holds the check's MEANS (6 words in a row, or all of it when shorter). When no entry matches, keep every link (live behaviour; no silent drop).
E1 control (live s119), luna's stored gate text of run 34852: the Matthew 1:20 [CR3] MISSES check is raised against D1 and D4.
E2 candidate, same text: raised against D4 only. Every other item unchanged.
E3 plant: the same check with a MEANS that matches neither entry: raised against D1 and D4 on both.
E4 plant: a MISSES check on a verse under one link (Luke 1:32): same on both.
E5 plant: the LINK 1 MEANS graded MISSES: candidate raises D1 only; control D1 and D4.
E6 plant: the LINK 4 MEANS cut to its first 7 words: candidate D4 only.
E7 plant: the LINK 4 MEANS cut to its first 4 words (under 6, not all of it): OPEN which way; I expect both links kept only if the 4 words stand in both entries, else D4 only. Record the result as a limit.

## Results (after the run; t2_out.txt)
E1, E2, E3, E5, E6 as expected. E7: the 4-word MEANS is all of the check's MEANS, so it is matched whole; it stands only in the LINK 4 entry: D4 only. Limit: a short MEANS whose words stand in both entries keeps both links. E8 (MEANS: NONE), E9 (straight quotes, bold), E10 (both checks MISSES: D1 and D4 each from its own check), E11 (only the LINK 1 check MISSES, with luna's shorter MEANS: D1 only): pass.
NOT TESTED: the challenger side (a [DRn] check against the list that closes [CR3]); stored runs other than 34852; the node run end to end (the function was called through the rebuilt Gate Record source). t1.cjs reads keep.json (the scratch cut of the export, not in the repo).
Size (measured): code 3,245,024 to 3,245,740 = +716; prompt 0. Parent /mnt/project-files/w3/parent_s119_VP1B.json, sha256 3b6368682d35c30e. 10 gate and merge nodes rebuild; 42 stubs rebuilt and compiled.

## Revision 2 (after W4's grade NOT PASSED, Wall 4582): expectations, written before the candidate was run
W4's plant P2: the check's MEANS is verse words; LINK 1's entry quotes the verse shorter, so the words stand only in LINK 4's verse quotation; rev 1 dropped D1 with no mark. Cause: my match read the whole PRESSED WITH line. Rev 2 reads only the entry line's MEANS part (after "MEANS:" to the next " -- ", "| PROVEN" or the line end).
R1: P2 keeps D1 and D4 on the candidate (as live). R2: E1 to E11 of rev 1 unchanged. R3: a check MEANS equal to words of an entry's [L3] layer only: both links kept. R4 limit expected: an entry MEANS that itself holds " -- " is read only to that dash; a run after it does not match, and both links are kept (safe side).

## Revision 2 results
R1: W4's plant P2 (run from a copy of W4's plants.cjs pointed at rev 2) keeps D1 and D4. P0, P1, P3 as W4 recorded. R2: t2_out_r2.txt equals t2_out.txt (E1 to E11 unchanged). R3: both links kept. W4's stored scan (copy of scan2.cjs pointed at rev 2): output byte-equal to W4's scan of rev 1, the same 21 removals in 15 texts. R4 not planted.
Size (measured): code 3,245,024 to 3,245,871 = +847; prompt 0. Parent /mnt/project-files/w3/parent_s119_VP1B_r2.json, sha256 4ffc220eede09ac2.
MY MISTAKE in rev 1: I stated "when no entry holds the MEANS, every link is kept" and matched against the whole witness line, so verse words or layer words could pick a link. I planted no MEANS made of verse words. W4 found it.
