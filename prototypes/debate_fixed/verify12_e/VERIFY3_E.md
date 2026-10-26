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

## Re-verify after amendment 3 (22a4aec; falsifiers 5e8f598 committed first)
- F18e, F18f, F18f2 CURED on 56cc79b (at56_f18e.txt), UNCURED on 22a4aec; F18e.0 UNCURED both; F18g CURED both.
- My E1 to E3 (e_echo.cjs): all UNCURED on 22a4aec.
- F15, F12, F15c, F18, F18b, F18b2, F18d.1-3, F16.1-3 as before; F17 rerun on fx/kjv25.json (0282498b): heads and Verdict HELD for Gemini, counts 1 and 3, "sent as alternate for Grok, not seated" (rerun3.txt).
- Regression (regression3.txt): 7 of 8 equal to base; h_f11_27795 the declared move.
- Changed set still the 15 of CHANGED12.txt; NEW12_MD5S.json 63 entries, 0 mismatches; cureReasoned identical in all 14; rulings 105 and 7564 text in 14 of 14.
- PASS against DoD 15 to 18 as ruled (7571: drop only text equal to the flagged or BROKEN line).
- LIMIT, measured (e_probe.cjs): P1 a fragment of the flagged line ([DR1] and its quotation) after the bar, no reason: CURED, HELD-1.
  P2 the flagged line with one word changed: CURED, HELD-1. The reader cannot tell these from P3, a real reason quoting the same kind of words (CURED).

## Step 5 (draft verify), Worker_E
- Workflow details read: versionId 75dcb465-116a-4dde-a8bc-090232a135a4 (draft), activeVersionId 449a4cf2 (live unchanged).
- Draft 75dcb465 fetched by me (get_workflow_version, saved by tool) and compared by cmp12_e.py with new12 files at 22a4aec and my own
  earlier fetch of 449a4cf2 (s11/step4/u2.json): 231 nodes, same names; 63 code nodes all equal to new12; 15 changed, all written;
  no other node differs from 449a4cf2; no other field of the 15 differs; connections equal (STEP5_CMP.txt).
- 449a4cf2 against base12: 63 of 63 equal, so the undo target is the verified base.
- Not redone by me: A3's restore round trip (8c7b8f7d, then 75dcb465). The undo is restore 449a4cf2-5097-446c-95b2-8b36628c8f28.

## Step 6b (publish), Worker_E
- On the operator's "1" verified at the transcript (BB-7598). Pre-act read: draft 75dcb465, active 449a4cf2, updatedAt 2026-10-22T17:05:59Z (= step 5 fetch); board head 7598.
- publish_workflow(75dcb465) returned activeVersionId 75dcb465-116a-4dde-a8bc-090232a135a4.
- Fetch-back (next call) of 75dcb465: md5 of the saved file equals the step 5 fetch (f9a1db84); cmp12_e.py: 63 of 63 code nodes equal new12, 15 changed, others and connections equal 449a4cf2 (STEP6B_CMP.txt).
- Details read back: activeVersionId 75dcb465. log_build audit 22963. Undo: restore 449a4cf2-5097-446c-95b2-8b36628c8f28 and publish it.
