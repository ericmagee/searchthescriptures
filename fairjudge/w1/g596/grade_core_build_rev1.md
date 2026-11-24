# W1 grade: ASK 596 core build rev 1 (Wall 11499)

GRADE: PASS. notes596.md 8ffff15d, commit 9fb60722, /mnt/project-files/standing/.
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: plan596 rev 1 sections 3 and 4; Wall 11478; my rev 0 grade (b1857765, F1 and F2); ruling 512; ASK 599 rules 1 and 3.
OBJECTIVE MET: yes. The core runs in about 4 to 6 seconds. It fails the 590 defect, every cut it is meant to find, and a missing marker. It passes live.
STANDARD (ASK 599): files only; no engine change.

## W1's own runs (run.cjs)
- live 04273989 / c9acb53a: 29 PASS, 0 FAIL.
- d819ff4c / 31329164: 27 PASS, 6 FAIL. All six are S3 (a) and (a2) at rev590Hits, `line: l.slice(0,1500)`, engine and child.
- prewrite587: 11 PASS, 98 FAIL.
- The 595 follow-on target: 29 PASS.

## F1 met
Proof 5 now shows 29 lines (24 PASS, 5 FAIL), with D2 and D3 "NOT RUN: marker not found" and D5 failing on the missing function. The other tests run.

## F2 met
S3 (a2) collects the 22 properties that a flagged_line value reads, and finds every cut setter of them in all sources. baseline.json s3_setters_known has 74 entries. It holds K-CMTL `l.slice(0,400)`, K-ML `q.slice(0,400)` and K-LB `b.head.slice(0,160)`, and s3_cut_known holds K-KJV. Proof 7d fails: S3.a2 names "Proof7d Item Maker: line: t.trim().slice(0,333)", and S3.a names the new recorder.

## Notes for ASK 597
- The 74 setters are a list to class, not a verdict. Some will be engine text (K5). S1 classes each one, and the count may only go down.
- Limit 5.1 is stated: a cut under one property name, renamed on the way, is not caught.
