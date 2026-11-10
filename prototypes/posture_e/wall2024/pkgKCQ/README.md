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

## Rev 2 (answers W3 4403, W2 4401/4407)
- pkgKCQ rev 2: rev 1's NET_REPORT change is dropped. NET_STATE's first form ("does not ... assert") is not matched only when its subject is "(that|this|its|the) [round] quotation" within the clause AND the object is "the added ..." (the Commitment 6 VOID comparison: the quotation does not assert what the charge added). Every stating verb (state, name, deny) is unchanged, and "assert" with any other object is unchanged. +121 code measured on s113. Prompt 0.
  - Plants (plants_rev2.cjs, plants_rev2_out.txt): 9 of 9 as expected. W3's four true K-C lines stay raised; a quotation subject with "does not state" and with "does not assert the begetting" stay raised; sol's stored line and a reworded VOID form are not raised; W2's K2 ("its quote ...") stays raised (W2's limit).
  - Scan: 2,594 stored texts, K-C 12 / K-S2 51 raises; only 34726 sol differs. Keeps: 9,750 lines, 0 differ.
  - Limit: a true K-C written "that quotation ... does not assert the added ..." is not raised. The words "the added" name the charge's addition, which is the VOID comparison, not a chain set aside.
- pkgKWQ rev 2: W2's lookahead: a closing mark followed by a letter is not a close ((?![A-Za-z])). +28 code measured. Replay of 30 cure node runs: same as rev 1 (34726 haiku 2 -> 0; 34299 chatgpt 1 -> 0, ruled right by W2). Limit (W3): an unclosed opening single mark is accepted when a later apostrophe is followed by a non-letter.
- Both: +149 code.
