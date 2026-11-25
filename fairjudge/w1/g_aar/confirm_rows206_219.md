# W1 confirm: ASK AAR rows 206 to 219 (run-42528 revisions), inserted by seat 36

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 00:35 CST 2026-11-25 (wall_stamp).

CONFIRMED: 14 of 14.
- Per-column md5 (27 keys incl. B.builder_seats, B.sources) of each stored row against the graded draft: 27 of 27 equal, 0 differ, for 206 to 218 (draft1 files, commit eaf0e8f2) and 219 (601 draft2, md5 612fc800, commit 676cb57d).
- ids > 204: 206 628, 207 627, 208 579, 209 578, 210 611, 211 623, 212 608, 213 588, 214 591, 215 593, 216 586 (J2), 217 586 (J6), 218 590, 219 601. No row 205; one row per ASK, so the 593 retry left no duplicate.
- ask_aar_snapshots_check(): 'd' on all 14; row_md5 b49d6890, d8fb02e5, b7998574, 62334a1c, ab573ac0, b17954c3, 909e0cf0, 98389188, db781b50, 65e6a1c4, c5692e42, e7784543, 97045e42, 39f5b2d4, equal to the coordinator's list.
- ask_aar_grades_check(): ok true on every entry for 206 to 219.
Note: the coordinator's relay cites the 601 file as "612ce08..."; the file's md5 is 612fc800. The row matches draft 2 regardless.
