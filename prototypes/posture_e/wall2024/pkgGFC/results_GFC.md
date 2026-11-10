# pkgGFC results (W3 build, offline on s110; builder's own tests; graders W1 and W2)
Candidate: pkgGFC/parent_s110_GFC.json (copy /mnt/project-files/wall2024/parent_s110_GFC.json). Build pkgGFC/build_GFC.cjs. Tests pkgGFC/t_GFC.cjs, output pkgGFC/t_GFC_out.txt. Labels pkgGFC/labels_GFC.md (commit 10373766, before the build).
Size (measured): +500 code, Shared Library only; no prompt text; connections equal.
Change: the gate reply reader. A CHANGE TO field that holds a collision line "D<i> vs C<j> ..." followed by a FORCED line for the SAME pair is read as the collision line alone, with the FORCED line read as if it stood in the reason field.

- T1 OK. Execution 34626 as stored: gate item G5 of luna CURED, no new item, gate 5 of 5, luna drv_uncured 1 (live: 2). All written rows equal, byte for byte, the rows live code gives for the same words with the FORCED line in the reason field.
- T2 OK. Reason-field form: candidate equals live.
- T3 FORCED line names another pair: not split; rows equal live.
- T4 FORCED line with a quotation not in its round: stays UNCURED, drv_uncured 2; same seats and count as live gives for that line in the reason field.
- T5 separators " / ", " -- ", " | ", a space alone: read, rows equal the reason-field form. "FORCED (Commitment 4):" read (CURED).
- T6 FORCED line alone; collision line alone; the word FORCED in prose: rows equal live. Collision line graded UNDERDETERMINED with a FORCED line: UNCURED, equal to live's reason-field result. Two FORCED lines: CURED. Lower case "forced:": CURED (not compared with live's reason-field reading of lower case).
- T7 terra and sol rows unchanged in every test; luna's G1 to G4 rows equal live for the same reply.
- T9 scan (measured), debate_enforcer_log, 27,128 rows: 2,626 replies with CHANGE TO; 126 gate replies; gate replies with a collision line followed by a FORCED line inside CHANGE TO: 0. One gate reply (grok) has a FORCED line inside CHANGE TO after a CONCEDED LINKS line: not matched by the change. No E-GATE M row is stored. The one real case is luna's G5 in execution 34626 (a dry regrade; its rows are not in the log). Send-back replies are not touched by the change.
- NOT REACHED: a RULE K-G4 gate item answered in this form; the Alt Gate Record path (same library function; no stored alternate gate reply in this form).
Effect on 34626: luna keeps 1 uncured item (S12). By my study the removal of luna stands on S12 alone, so this change alone does not change the outcome there.
