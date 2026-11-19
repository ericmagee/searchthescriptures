import json
LIVE468="LIVE468"; LIVE470="LIVE470"; LIVE472="LIVE472"
P=[]
P.append({"old":"  - A \"PROVEN IN [round]\" MARK IN THE CHALLENGER'S ROUND 2 IS CHECKED AND SENT BACK ONCE (pkgPIN, ASK 298; C2B Build):",
"new":"""  - A B-ROUND PASS KEEPS ITS LAYERS CHECK IN THE BAR RECORD (ASK 468; D2B, C2B, D3B, C3B, D4B and C4B Build and Extract; engine only):
    - Why: a resend already recorded the round's layers check (LAY.check); a pass recorded none, so a pass could not be shown either way.
    - What it does: each B Build declares its layers result before its pass() helper, and every pass item carries lay_check (null when the check errors or the bar check fails first). Each B Extract writes layers: {first: <the Build's lay_check>} into the round's bar record on a kept first version; a resend's own layers entry still wins. Both sides change alike.
    - Reach: record only. The Route switch reads only resend and call.fam_idx, and no node or table reads lay_check or bar.layers, so no path, prompt or count moves.
    - Shown offline: a mock of all six rounds: base passes carry no lay_check and no bar.layers; target passes carry both. Only the 12 nodes' code differs; connections equal; no comment added.
    - Live: """+LIVE468+"""
    - Limits: not shown by a run; its mark is a B-round bar record holding layers.first on a pass.
  - A "PROVEN IN [round]" MARK IN THE CHALLENGER'S ROUND 2 IS CHECKED AND SENT BACK ONCE (pkgPIN, ASK 298; C2B Build):"""})
P.append({"old":"    - Limits: TRIAL, record-only: it counts nothing and removes no seat; a reviewer must read the row. Live and UNEXERCISED.\n\n## 10. The panel",
"new":"""    - Limits: TRIAL, record-only: it counts nothing and removes no seat; a reviewer must read the row. Live and UNEXERCISED.
  - pkgGCA ALSO MARKS A BROKEN KEYSTONE OVER A PAIR ITS OWN JUDGE DOES NOT GRADE BROKEN (ASK 470; TRIAL, record-only; Alternate Merge):
    - What it does: a third finding in the same v54 line. When a judge-written KEYSTONE Dk is BROKEN, every Dk pair the KEYSTONE line names is read: if that pair carries a grade in "Dn vs Cm (ref): GRADE" form and none of its grades is DEFENDER LINK BROKEN or BROKEN, the line adds "the keystone Dk is graded BROKEN on the pair Dk/Cm, which this judge grades <grades>", with " and marks RETRACTED" when the text holds "RETRACTED Dk vs Cm". An engine-derived keystone ("derived by the engine") is skipped. It is the mirror of finding (2).
    - Shown offline: of the stored judgments whose BROKEN keystone names a pair, one is marked: 1228 sonnet, "the keystone D4 is graded BROKEN on the pair D4/C1, which this judge grades CHALLENGER LINK BROKEN and marks RETRACTED"; the others come back unchanged. Only Alternate Merge's code differs; no comment added.
    - Live: """+LIVE470+"""
    - Limits: TRIAL, record-only: it counts nothing and removes no seat; a pair named only as background is still read if it is of the keystone's own D.

## 10. The panel"""})
P.append({"old":"The seat's counts, standings, verdict and RESULT are then recomputed from the corrected lines (§8 definitions).\n- THE GATE (E-GATE):",
"new":"""The seat's counts, standings, verdict and RESULT are then recomputed from the corrected lines (§8 definitions). An item that is not applied is logged in the [AUDIT v37: SEND-BACK ITEM] line and in its E-APPLY enforcer_log row as not counted on that row: it goes to the E-GATE, and if left uncured there it is counted in drv_uncured, which can remove the seat (ASK 472; """+LIVE472+""").
- THE GATE (E-GATE):"""})
json.dump(P,open('pairs_draft.json','w'),ensure_ascii=False,indent=0)
print('ok',len(P))
