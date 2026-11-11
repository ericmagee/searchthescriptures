## pkgACO: Anticheat order (W1)

Ruling 427 (md_notes_rulings, 2026-11-04) says the anti-cheat check runs "after both closes and before the judges are seated".
Before this package, the Anticheat nodes ran after Save to DB. So the readers already written into Build Independent Verdict (the ANTI-CHEAT CHECK note in the single judge's transcript) and Build Save Body (the AUDIT ANTI-CHEAT (TRIAL) rows in the review notes) never fired on a live run. Only the panel read the result.

Change: connections only, with no code and no new node.
- Close Enforcer Record leads to Anticheat Build.
- Anticheat Only? (false) leads to Regrade After Quotes?.
- Regrade After Quotes? (true, regrade) leads to Panel Build.
- Regrade After Quotes? (false, live) leads to Build Independent Verdict, as before.
- Check Save (ok) leads to Panel Build.

Effect on a live run:
- The single judge's requests built from Build Independent Verdict (Verdict, the re-ask when it runs, and Cure through its prefix) carry one note per REVERSED close sentence whose two quotes code found in the record. The note sits at the end of that side's close round.
- The stored review notes carry the AUDIT ANTI-CHEAT rows.
- On a regrade, the same nodes run in the same order as before.
- An anti-cheat-only dry regrade no longer passes through the Regrade After Quotes? If node, which has no side effect and no reader.

Size: code +0, nodes +0, workflow JSON -4. Fixed prompt text +0. The variable text added to the single judge's request was measured on stored live runs at 0 to 1,824 characters (mean 709 over 7 runs). The review notes grow by 196 to 1,596 characters.

Limits:
- The single judge and Save to DB start later by the Anticheat time, measured at 102 to 233 seconds over 11 exports. The total run time is unchanged because the same nodes run one at a time.
- If Anticheat Build or Anticheat Record throws, the run now stops before the single judge and before Save to DB. Before this package it stopped after the save. Anticheat Call deepseek continues on error, with 3 tries and a 900-second timeout.
- A note is shown only when code finds both quotes. A REVERSED answer with QUOTE NOT FOUND stays record-only (2 of 5 on run 35067).
- The note changes a judge's input, so a live run does not verify it. It needs a paid replay of the single judge's Verdict request on stored text.

Grades: PASS WITH LIMITS by W4 (Wall 4889; file wall2024/grade_ACO_w4.md) and W2 (Wall 4890; repo wall2024/w2_grades/aco, commit 8f75c068). Builder reply: W1 Wall 4891. W4's optional on-error guard was not added. The 35067 notes split defender, defender, challenger and measure 1,824 characters with line breaks (1,818 without). W2's 1,866 is the same text plus W2's own 8-character line labels on 6 added lines.
Parent: wall2024/parent_s135_ACO.json (sha 2047f8ee), built on s135 (35cacebd). Unproven until the paid Verdict replay and two clean runs.
