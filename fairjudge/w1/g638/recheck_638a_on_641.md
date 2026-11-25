# W1 RECHECK: ASK 638 A rebased on live 393bca2e (ASK 641 written); ask638/w4/b2, commit 99d456df, target 1674abcb
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

RECHECK: PASS. Clear to write.

Checks, run on my own fetch of live 393bca2e:
- The b2 builder is byte-equal to the graded b1 builder. On live it changes LIB 1366, 1368, 1501 and 1556, and re-measures the same 15 MAP entries.
- My rebuild equals W4's b2 tg/target_engine_638.json in every node and in the connections. The only node changed against live is Shared Library.
- Each of the four changed lines is byte-equal to the line I graded in b1. 641 left the first 3,859 LIB lines unchanged; the library is now 3,883 lines.
- Tests on live and my rebuild: t638 28 pass, 0 fail; t638g 5 pass, 0 fail.
- Standing with child aad0ad9c: 31 PASS, 0 FAIL.

Rebase note: once 638 A is written, 634 and 647 need a fresh recheck on the 638 A fetch-back.
NOT CHECKED: W4's three-way script.
