# ASK 582 second pass, batch 1 (class A: whole provenance lines and clauses), parts 09.0, 11.0, 11.1

Plan: Wall 11269 (W1 PASS WITH CONDITIONS P1 to P3, Wall 11270).

## P1. Regex, flags, counts
Unit: one line of the part's latest row (split on newline), PostgreSQL `~` (case sensitive, no flags):
`Wall [0-9]{4,5}|audit (row )?[0-9]{4,5}|commit [0-9a-f]{7,8}|Card "|Read back|[0-9]{2}:[0-9]{2}(:[0-9]{2})?Z|graded PASS|Page checked|[0-9]{2}:[0-9]{2} (CST|CDT)`
Lines matching, before -> after (MEASURED in a rolled-back rehearsal of the three writes, 21:52 CST 2026-11-23):
- 09.0: 2 -> 0
- 11.0: 23 -> 19
- 11.1: 12 -> 6
"since ASK" correction: the plan's 43 used `[Ss]ince ASK` over every part including 00.1; W1's 42 stands if 00.1 is left out or the match is case sensitive. Class B (batch 2) will state its own regex and counts.

## Remaining hits and why each is kept in batch 1
11.0 (19 lines): 72 (`v_agree_from` 2026-11-19 18:03:57Z, a live cutoff: KEPT, P2); 104 (audit 38890, a constant of the live check ask_aar_snapshots_check: KEPT); 103 (Wall 9881 to 9887, an evidence pointer under operational_doc 0 (3), with an operator time: class C); 34, 35, 89, 96 (dated run evidence: class C, batch 3); 52, 63, 70, 77, 94, 98, 122, 126, 128, 136, 144, 150 (Why lines citing the operator by time: class C, batch 3).
11.1 (6 lines): 3, 15, 59, 90, 96, 103 (the operator cited by time inside Why or Cause sentences: class C, batch 3).

## P3. Write order, expected results, readback
Order: 09.0 (base v242 0b5f5612f098b2101cf7d3dbdb0f9980, 38,944) -> v248 69e266ce6114f15c39ceeffba5ac4e0f, 38,813; then 11.0 (base v245 467c3c6305ed7618532578cca8a6af95, 38,952) -> v249 cd97ea91ec29d369d832a481776eb51b, 38,048; then 11.1 (base v242 710e8cea2d963348587a3746d13355d7, 35,620) -> v250 21ba90304e5bbd83c034caff38c35277, 34,701.
All preview counts are 1 (2, 9 and 10 pairs).
engine_manual_full() after the three writes: version 250, md5 6d7aa379facde0060b8f92f974461a2d, length 707,066 (from 709,020; 1,954 characters removed: 131 + 904 + 919). MEASURED in the rolled-back rehearsal.
Readback: node mrb.cjs <base> <new> b1_pairs_<part>.json <part>, for 09.0 (242 248), 11.0 (245 249), 11.1 (242 250).
Log: each part's p_log carries every pair's old and new text word for word.

## Cuts in plain words
09.0: the note that the operator left the label to the team with its time; the replay's seat, commit and grade pointers.
11.0: the Queue tab card, press time, audit number, function md5s, deployment id and readbacks; the line "Page checked by the operator ..."; the seats' Wall numbers and snapshot row after the proving run; "read by W3 at ..."; "The operator approved the fields on the card at ..."; the ASK 497 plan and file md5s; the test file md5, card time and grade numbers; the card name and time after "Uncured".
11.1: the REVERTED narrative (card, time, the unproven growth trace, version ids, readback), keeping that 516 crashed out of memory on runs 41128 and 41155 and what the enforcer calls carry; "on 2026-11-23" after "replaced it"; seat and Wall pointers on two Shown lines with the run's clock times; plan Wall numbers on ASK 544 and 546; draft file names and md5s on ASK 557/558, 564 and 571; "found by W4's replay the same day (Wall ...)".
NOT kept anywhere else and so flagged for the grader: "(41147 also failed on 516, at Record Substitution, a separate fault)" and "not proven, because n8n kept no node data for 41155" go to the log with the REVERTED narrative.
