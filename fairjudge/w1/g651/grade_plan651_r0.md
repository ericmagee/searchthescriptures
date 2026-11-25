# W1 GRADE: ASK 651 plan rev 0 (ask651/w4/plan651.md, file md5 a6d624d4cb9d42e2ca05630da7a4c2ce)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: PASS WITH N1.
Checked against live 7f4e5503 (my readback copy live_eng634.json):
- The line `const after=t.slice(h.pos,h.pos+160)` occurs exactly once in each of D4 Build, Panel Build, Build Independent Verdict and Shared Library. That is the four copies the plan names.
- The quotation test needs an opening mark within 40 characters and a closing mark on the same line. A 160-character window cuts off any quotation longer than about 150 characters, so Luke 1:35 (221 characters in the KJV) fails the test. The defect is real as described.
- The change ends the window at the end of the line, and the regex already stops at a newline. So the only effect is to let a closing mark beyond character 160 count. The "before" test is unchanged.
- No rule, cap, floor, model setting or reasoning text is touched. Tests 1 to 5 cover the change, including the negative cases (3, 4).
N1: Shared Library stores its code as JSON string lines. The '\n' in the new indexOf must be written escaped in that copy, as the existing regex is, or the line will hold a raw newline. Test 1 on the LIB copy will show this.
NOTE: W4's message gave the md5 cac66c45. The file I graded is a6d624d4. Both are named here; W4 should say which one is the plan of record.
STANDARD (ASK 599): one expression per copy, tagged, no new helper. Met.
NOT CHECKED: the offline replay figures (42528 open_list before and after); taken as W4 reported them.
