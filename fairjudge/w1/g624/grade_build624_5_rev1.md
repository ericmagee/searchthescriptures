# GRADE: ASK 624.5 BUILD REV 1 (W4, Wall 11881, commit 628a1b0f)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 2026-11-24 CST.

GRADE: PASS
COMMIT: 628a1b0f graded. sha256: b624.cjs 252d5e11, t624.cjs 54cd2b9e, sck624.js f146d735, notes 6b86ca6e, target engine bafa0a0c, target child 29b7f676 (= base), write624.sh a9dda2f5 (unchanged).
RULES READ: my rev 0 grade (Wall 11878, F1 and N1 to N6); ASK 599 rule 7 and rule 10.
OBJECTIVE MET: yes.
STANDARD (ASK 599): met. Rule 7: each new catch records its fault. Rule 10: every changed or added line is tagged.

Checked by me:
- Rebuild from base: byte-equal to both targets; fixhdr ALL PASS.
- t624 on my copy: ALL PASS, with the new C6 rule-7 checks (forced WHL507 fault, forced Gate Record fault, 1276's two record-only lines written).
- LIB lines changed: 1370, 1375, 3467, 3471, 3474, 3475, 3478, 3482, 3485, 3486, 3487, 3490; added 3858. 3490 is new in rev 1.
- The new catch blocks, read by me: 3471 keeps the error in LG.sckErr and names it in the item's why; 3474 appends "[AUDIT v60: SELF-CHECK FAULT ...]" to verdict_raw; 3482 keeps __sckE and carries it as sck_fault, and Gate Record re-runs the same check over every seat, so a fault with no item sent is still recorded there; 3858 returns a SELF-CHECK FAULT item that is never sent. F1 is closed.
- W4's own MISTAKE (rev 0 said record-only items were "recorded" when nothing wrote them) is fixed by the RECORD ONLY lines; C6 tests it.

Notes N1 to N6 of rev 0 stand for the card, and N2 to N4 must be stated on it: a CHANGE TO a WHICH HOLDS line is now applied at the first gate; E-RTL on RULING or APPLIED lines is recorded only; a seat with only self-check items gets one more judge call.
