# ASK 634 PLAN (W4), rev 0: a judge's corrected FORCED line is applied at that pair's FORCED line when the line it flagged is not in its text

Source: W4 Wall 11938 (1), on W3's 42528 AAR DEFECT 2 (Wall 11936); the coordinator's assignment, 05:58 CST 11-25.
Live base: engine 3b72583c. Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a prompt, a count rule or what a judge is sent.

## 1. OBJECTIVE
In run 42528, sol's send-back changes S9, S10 and S14 flagged a line that is sol's own pointer, for example "FORCED: D3 vs C4 remains as corrected above, with [L1] Matthew 1:20 ...". That line was never in sol's judgment text, so the apply refused each one: "the flagged line is not in the judge text" (NOT APPLIED).
- At the gate (G2, G3, G7), sol answered each with CHANGE TO and a whole, well-formed FORCED line for the same pair (D3 vs C4, D5 vs C2, D6 vs C1).
- The gate re-apply anchors on the same flagged line (gateLineFor2024 returns the item's flagged line, because a FORCED line has no sbLabel). So it failed again.
- The item stayed UNCURED and counted in drv_uncured. No CHANGE TO could have cured it; only KEEP would have.
- Debate_enforcer_log rows 54568, 54569 and 54573 hold all three.

Change: in sbApply2024, when the flagged line is not found and the change is a FORCED line for a named pair, the change is applied at the one line of the judge's text (as changed so far in the pass) that is the FORCED line for that pair.
- If there is no such line, or more than one, the change stays NOT APPLIED with the present reason.
- This is the rule the engine already uses for a RETRACTED change (pkgFRP, Shared Library line 1425 to 1426, with the same pair test __pf), and for a collision line, which anchors at the one line with its label (line 1422). FORCED is the one form of a same-pair line that has no such rule.
- Expected effect on 42528, if sol's text holds one FORCED line for each of the three pairs: G2, G3 and G7 are applied and CURED, so drv_uncured for sol falls by 3. The build counts this from the stored judgment text (C1); it is not assumed.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator. This is an engine change, and it changes what counts as cured, so it is infrastructure and needs his press.
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change:
- Shared Library, sbApply2024, the `if(!o)` block at line 1425. Today it looks for the pair's FORCED line only when `to` is "RETRACTED: <pair>". The change also does it when `to` itself is a FORCED line (KF_LINE), taking the pair from `to`.
  - It uses the same filter: lines not emptied by an earlier change in the pass, read through `map`, with exactly one match.
- The LIB entry and its MAP are rebuilt by the library tooling (ASK 576/578 form), so every node that loads the library gets the same text. The library one-copy check (reg385) and the pair check must pass.
- Tagged ASK 634.

Not changed:
- gateLineFor2024; the gate cure rule (line 1830); the K-G4 FORCED path (line 1817, forced_add); the RETRACTED rule itself; what a judge is sent; any count rule.
- A change whose flagged line IS found is unaffected. The new rule runs only after every present anchor has failed.

SEARCH:
- sbApply2024 callers: the send-back apply (line 1596), the gate re-check (line 1713), gateItems2024 (line 1748), the stored-round path (line 2470) and the Late Gate (line 3472). The rule applies in each, since all of them call the one function.
- Gate CHANGE items (line 1816): line = gateLineFor2024(x, to). For a FORCED `to`, sbLabel is null, so the result is the item's flagged line.
- The cure rule (line 1830): a NOT APPLIED item is CURED if its gate change is applied, already stands, was superseded, or was answered KEEP.
- Rows 54568, 54569 and 54573: flagged_line is the pointer, and response_line is "CHANGE TO: FORCED: <pair> -- MEANS ...", in full form.

NOT SEARCHED:
- How often this has happened before 42528. The build counts it over debate_enforcer_log, from rows with "flagged line is not in the judge text" and a FORCED CHANGE TO.
- The child: it reads the engine library text (ASK 578), so it gets the same rule. No child node changes.

## 4. CRITERIA AND DONE
- C1. Replay of sbApply2024 (old and new library) on sol's 42528 judgment and its send-back and gate items, from the stored node outputs.
  - The new library applies G2, G3 and G7 at the FORCED lines of D3 vs C4, D5 vs C2 and D6 vs C1, if sol's text holds exactly one each. The build reports the count it finds.
  - Every other item's result is equal under both.
- C2. Synthetic cases:
  - no FORCED line for the pair: NOT APPLIED, with the same reason;
  - two FORCED lines for the pair: NOT APPLIED;
  - the pair's FORCED line already changed earlier in the pass: applied to the changed text, under the existing last-change rule;
  - a RETRACTED change: unchanged result;
  - a flagged line that is found: unchanged result.
- C3. Over every judge's stored verdict and items in the replay fixture, nothing changes except items whose flagged line is absent and whose `to` is a FORCED line.
- C4. Engine: only the Shared Library node changes, as rebuilt by the tooling. Every other node is byte-equal to 3b72583c. Standing 31/0; S4; Library Check pair PASSES; one-copy check PASSES.
- C5. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on the plan and the build; the operator presses W4's card; W4 writes; W1 reads back; two clean live runs (marked as in section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if sol's pointer line meant "keep the line as it is", so that the FORCED CHANGE TO is a new claim and not a correction of the pointer. Then curing it would credit a change the judge did not mean to make.
  - Against that reading: at the gate, sol was asked about the item and chose CHANGE TO, not KEEP, and wrote the whole line. The gate's own rule takes a CHANGE TO as the judge's correction.
- A second wrong-if: the pair's FORCED line in sol's text is not the line the pointer meant, for example if there are two. The exactly-one rule leaves those NOT APPLIED.
- Known-good case: a change whose flagged line is in the text never reaches the new rule (C2, C3).

## 6. RUN EVIDENCE
- Case: the first live run where a judge's send-back flags a line not in its text and the gate answers with a FORCED CHANGE TO.
- Mark: that item's gate row reads "the gate change was applied" and CURED, not "the flagged line is not in the judge text".
- If no such case occurs, the path is live and UNEXERCISED. The two clean runs then show no change elsewhere: no new NOT APPLIED and no lost cure.
- Cost: nil. NO PROBE: the stored outputs are the test.

## 7. INPUTS IN GIT
ask634/w4/plan634.md (this file). The build goes in ask634/w4/b1/: the library rebuild script, the target engine, the tests and the 42528 fixture (node-filtered: sol's panel payload and its gate items).

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C5 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 634 (a judge's corrected FORCED line is applied at that pair's line)?"
4. W4 writes the engine; fetch back; audit row; Wall post; W1 readback.
5. W3: the engine manual entry and the AAR rows.
6. Two clean live runs.
