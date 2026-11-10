# pkgKCQ and pkgKWQ (W1, offline, on s113) — faults (a) and (b) of live run 34726

## pkgKCQ: K-C does not read a quotation's own limits as a net statement
- Fault: sol was removed on one K-C item. Its CHALLENGER CONCEDED LINKS line says "That quotation limits its observation to those rows and does not assert the added exclusion." That is a Commitment 6 VOID ground (the charge adds "only" to the [DR2] quotation). netLines read "does not assert" (NET_STATE) plus "rows"/"those" (NET_PLURAL) as a chain set aside because no verse states the link.
- Fix: NET_REPORT also skips a clause whose words before the hit name a "quotation". One library line. +16 code measured on s113. Prompt 0.
- Effect: NET_REPORT is read by netLines (K-C raise), netKeeps (K-C cure keep) and ks2Hit (K-S2).
- Scan (scan.cjs; scan_out.txt): 2,594 stored judge texts (corpus + 7 saved executions). Live K-C raises 12, K-S2 raises 51. The only text that changes is 34726 sol; no other K-C or K-S2 raise is lost.
- Keep scan (scan_keeps.cjs): 9,750 stored lines, netKeeps and ks2Keeps: 0 differ.
- Limit: a net statement whose own subject is a quotation ("the quotation does not state ...") is no longer raised. 0 such raises are stored.
- NOT SHOWN: a whole-node replay of Panel Cure Check on 34726; the function-level read shows the item is not raised.

## pkgKWQ: K-W reads REASSERTED IN with single quotation marks
- Fault: Haiku (alternate for luna) was NOT SEATED on 2 K-W items, both answered "REASSERTED IN CR4 '...'" and "REASSERTED IN DR4 '...'". kwRe accepted only double marks. Both quotations are verbatim in the rounds (checked).
- Fix: kwRe accepts ' and ‘ ’ as well. One library line. +16 code measured on s113. Prompt 0.
- Replay (replay_ex.cjs; replay_ex_out.txt): cureVerdicts, live s113 against candidate, on all 30 saved cure node runs. 28 equal. Changes:
  - 34726 haiku: 2 uncured -> 0 (the two items above).
  - 34299 chatgpt (Panel Cure Normalize 2) K-W DEFENDER CR3 LINK 1 #5: 1 uncured -> 0. The quoted [CR4] sentence is verbatim, but it is the sentence that 34299's anti-cheat check directs be disregarded (the judge's own statement says so).
- Same pattern in 34726 haiku #4: its quoted [CR4] sentence is the confirmed closing contradiction X1 (D1 is broken there anyway).
- Limit (old, not new): kwRe checks form only, not that the quotation is verbatim, nor that the sentence is a disregarded or contradicting one. With double marks the same answers already cure.
- Line scan (scan.cjs): 371 distinct stored lines with REASSERTED IN; live reads 25, candidate 52; the 27 extra are mostly enforcer reasoning and prompt text, not cure answers; the cure answers among them are the three above.

## Files
- parent_s113_KCQ.json, parent_s113_KWQ.json, parent_s113_BOTH.json (the two together, +32).
