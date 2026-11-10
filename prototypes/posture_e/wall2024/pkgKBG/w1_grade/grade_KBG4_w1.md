# W1 regrade of pkgKBG rev 4 (commit dcc9b75; Wall 3895)

Verdict: FAIL, one narrow fix.

Reproduced: build_KBG4.cjs on fetchback_live_s98.json equals parent_s98_KBG4.json; against live s98 only the 3 Send Back Record nodes differ.

Plants (w1_plant_KBG4.cjs / .txt, run 33798, terra, Job 14:1):
- All rev 3 readings hold, and the rev 3 fault is fixed: "and I keep my link" (J5) and "and the chain follows" (J6) now read UNCURED; "and Matthew 1:20 reflects it" (J13), "and I maintain my chain as declared" (J15), "and this keeps my link whole" (J18) UNCURED.
- A keep-word clause that gives a reason stays CURED: "and I hold D6 because Matthew 1:16 names Joseph husband, not father" (J16), "and the verse supports D6 since it says begat of no man" (J17).
- Stored: the 20 kept sentences in kbg4_stored.json all state content of their own; I agree with W3's reasons.

FAULT: a position-only clause that names the link by its number is kept, because kbg4_own.cjs refuses its position rule for any clause holding a digit:
- "I grant it, and I stand on D6." (J14) reads CURED.
- kbg4_own: "I grant it, and I hold D6 as declared." kept; "I grant it, and I keep LINK 4." kept.
  ("and D6 stands." and "and my keystone stands." are cut.) This is the 34108 defender's own form ("I keep D1 through D6 as declared").
FIX: before the digit test, take out link names (D1-D9, C1-C9, LINK n, premise n, keystone), so the digit test still keeps a clause holding a verse reference.
No rolled-back insert on a FAIL.
