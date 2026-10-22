# 7397 rev 8 step 3, Worker_E verify of Worker_A3's build (branch claude/truth-app-onboarding-cfwndu, 56cc79b)

Run in a detached worktree of 56cc79b; harnesses are A3's (committed), plus e_echo.cjs (mine).
- base12 equals build11_e new11, all 63 files (md5). Changed set new12 vs base12: 15 files, equal to CHANGED12.txt.
- NEW12_MD5S.json: 63 entries, base12 and new12 both match.
- Order: falsifiers 74ecc5c before d117817; DoD 18 falsifiers 83c211b before 56cc79b (git log).
- Rerun (rerun.txt): F15 base K-G4 UNCURED, new CURED, K-G7 CURED count 3 both; F12 false,false then true,true;
  F15c.1, F15c.2 UNCURED both; F18 pre18 all CURED HELD-1, new all UNCURED, own verdict; F18b, F18b2 CURED; F18d.1-3 UNCURED; F16.1 line present.
- Regression (REGRESSION_E.txt): 7 of 8 equal; h_f11_27795 moved CURED to UNCURED, the move declared before the change.
- Rulings 105 sentence and the 7564 test: word for word in all 14 copies; cureReasoned identical in all 14.
- F17 not rerun by me: kjv25.json is not committed. A3's printed output read only.

FAIL, DoD 18 (E_ECHO_NEW12.txt): a retraction passes the reason test when its STATEMENT copies the flagged item label
(the answer form asks "STATEMENT: <the flagged item, as labelled above> | ..."), because Grok-type labels carry [DR1], a verse and a quotation:
 E1 control, no reason: UNCURED. E2 label copied in full, then "Retracted ... which cures the pressing violation": CURED, HELD-1.
 E3 the BROKEN line pasted as prose: CURED, HELD-1.
The test then reads the retracted line's own grounds as its reason.
