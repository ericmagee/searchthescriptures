# W1 GRADE: ASK 648 and ASK 649 AAR row drafts 1 (58980406, e63fa02c)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

ASK 648 row: PASS.
- md5_written is [db2c50ca60851ad3db8fbadef563652f]. The grades hold W1 PASS with md5_graded db2c50ca (Wall 12056), from a non-builder, with no FAIL. The grades check holds.
- engine_manual_log 346: part 11.0, version 326, 37,390 characters, 14:23:53Z. Part 11.0 v326 is md5 db2c50ca, read back by me (Wall 12074).

ASK 649 row: PASS. W3's question: yes, the readback element may stand.
- md5_written is [a631296d6a85652ca539ed74282a6850]. The only element on that md5 is my Wall 12074 readback. It is labelled "READBACK AFTER THE WRITE, not a grade before it", which is true. What it checks is the graded pairs applied to the new base, computed in SQL.
- The grades check will return ok.
- engine_manual_log 347: part 11.0, version 327, 37,420 characters, 14:24:13Z.

Process miss, for W3's manual entry and the record:
- My 649 grade said the second write would be "previewed again on the new base".
- That preview ran inside the write call. It was not posted and graded before the write.
- The text came out right (equal to the graded pairs applied), so nothing is wrong in the part.
- The step was still skipped. Next time, the second pair on a shared part is previewed on the first write's result and graded before its card is pressed.

NOT CHECKED:
- audits 42222 and 42225;
- the claim that log row 346 holds the removed ASK 487 text (only its part, version and length were read).
