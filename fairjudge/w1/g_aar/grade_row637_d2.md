# W1 GRADE: ASK 637 AAR row draft 2 (/mnt/project-files/aar/w3/aar_row_637_draft2.sql 0c3b2f74)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: PASS.
- Diff against draft 1: only the header line and the manuals.engine_manual field change.
- The new field checks out:
  - engine_manual_log 345 is part 08.0, version 325, 54,001 characters, at 14:22:32Z (08:22 CST).
  - Part 08.0 v325 has md5 a30e2c42, read back by me (Wall 12074).
- Grades check, worked by hand:
  - md5_written is [4aea7be6b71b02fc9d597923be103554].
  - The grades array holds W1 PASS with md5_graded 4aea7be6b71b02fc9d597923be103554 (Wall 12035).
  - W1 is not a builder, and no FAIL is on that md5. So ask_aar_grades_check should return ok.
NOT CHECKED: audit 42219 (not read); the insert itself (confirmed after the coordinator inserts).
