# pkgSGA: send-back changes to one sentence of a count line (33218 E-APPLY)

**Source.** 33218 (W4 report live_test_33218): chatgpt S20, S21 and sol S18, S19 were RECORD-ONLY E-APPLY items, "the flagged line is not in the judge text".

**Fault 1 (the reported items).** E-VOID flags one sentence ("Premise 2 is VOID (Commitment 6): ...") that sits inside the CHALLENGER CONCEDED LINKS line. sbApply2024 only matches whole lines, so the judge's CHANGE TO ("Premise 2 is NOT VOID; ...") was never applied.
Fix: when every other finder fails, the change has no line label of its own, and the flagged text is 30 characters or more and occurs exactly once in the judgment (in one line), the change replaces that sentence inside its line. If an earlier whole-line change already removed the sentence, that change stands and the item is recorded as replaced. No item is raised.

**Fault 2 (found while replaying; live in base, silent).** An E-PREM item flags the whole count line. When the judge answers with a sentence that has no label ("Premise 6 is NOT VOID and is spared ..."), base writes that sentence over the whole line. That loses the label "CHALLENGER CONCEDED LINKS: n --", the other premises' sentences, and any earlier change to the same line.
- 33218 chatgpt: the corrected text had no CHALLENGER CONCEDED LINKS line. Only S26 (premise 6) survived, and S25 (premise 2) was lost.
- 33149 gemini: both count lines were lost.
- 33129 chatgpt: the CHALLENGER CONCEDED LINKS line was lost.
- 33040 gemini: the CHALLENGER CONCEDED LINKS line was lost.

Fix: a CHANGE TO with no label over a labelled line (one SB_FORM reads) replaces the one segment of that line that starts with "Premise N" for its premise. Segments are split after ".", ";" or "--". If the line has no such segment, or more than one, the change is NOT APPLIED. It then goes to the gate (NOT APPLIED is LIVE there), and the judge writes the whole line with its label.

**Bases.** The 6 sbApply2024 nodes of live d5375c6e (fetchback_live_s12.json, run 33222). These are the pkgUNX finals. sbApply2024 is identical in all 6, and nothing outside it changes.

| node | live | final |
|---|---|---|
| Alternate Merge Seat | 8a4f197a | ef920450 |
| Gate Build | b0d70c54 | 397a189c |
| Gate Record | 3ea77e68 | 6e1ae390 |
| Alt Gate Build | cd747e4c | 6fbd3265 |
| Alt Gate Record | 62dea5c3 | f2d8e2cd |
| Alternate Merge | aa05732f | 55400145 |

**Test.** `node pkgSGA/test_SGA.cjs` gives 19 OK. It replays 474 stored send-back and gate answers from 33040 to 33218, base against patched. Exactly 6 seats change, and no result or stored field changes:
- Items no longer raised (now applied): 33218 chatgpt S20, S21; 33218 sol S18, S19; 33129 chatgpt S8, S9; 33129 gemini S5.
- New NOT APPLIED items, each one a line that base destroyed: 33040 gemini S4, and 33149 gemini S17 to S20. In each case the judge added a premise sentence that the count line did not have. These would go to the gate.

**For the grade.** A new premise sentence goes to the gate rather than being appended to the line, because appending would leave the line's count number stale.
