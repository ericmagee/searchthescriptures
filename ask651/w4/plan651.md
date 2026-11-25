ASK 651 PLAN rev 0 (W4). The PROVEN IN check misses a verse that was quoted, when the quotation is long.

DEFECT
PRS refCheck tests whether a PROVEN IN round quotes the verse. It reads only 160 characters after the reference:
  const after=t.slice(h.pos,h.pos+160); /^[^\n"“]{0,40}["“][^"”\n]{4,}["”]/
When the closing quotation mark falls past character 160, the test fails, and the verse is classed UNPROVEN with the reason "named there but not quoted with its reference". Luke 1:35 is 221 characters in the KJV.
Proof (42528): DR1 (C1B Extract) quotes Luke 1:35 whole five times; the [L1] line of press P5 carries [L2] G1904, G1982 and [L3] Luke 1:31, 1:32. All five hits failed the test.

WHERE (the same line, four copies, live 7f4e5503)
D4 Build; Panel Build; Build Independent Verdict; Shared Library (PRS source used by the judge checks).

CHANGE (one expression, each copy, tagged /* ASK 651 */)
  const after=t.slice(h.pos,(e=>e<0?t.length:e)(t.indexOf('\n',h.pos)));
The window runs to the end of the line. The quotation test itself is unchanged: an opening and a closing mark on the same line.

EFFECT, replayed offline with live D4 Build code on the stored rounds
- 42528 D4 open_list (b): before "premise 2: Matthew 1:20, Luke 1:35, Galatians 4:4; premise 3: Luke 1:35; premise 4: Luke 1:35, Luke 1:34"; after 651 alone "premise 2: Matthew 1:20, Galatians 4:4; premise 4: Luke 1:34". Luke 1:35 becomes PROVEN BY REFERENCE in premises 2, 3 and 4.
- 42373: no change (no long-quote miss there).
- Judge-facing: Panel Build and Build Independent Verdict print the same classes in the panel ledger. In 42528 the judges were told, three times, "Luke 1:35 (PROVEN IN [DR1]: the verse is named there but not quoted with its reference)". After 651 that line goes away.

TESTS (t651)
1. Each of the four copies: Luke 1:35 in 42528 DR1 gives PROVEN BY REFERENCE.
2. Every PROVEN BY REFERENCE verdict of 42528 and 42373 is unchanged (no verse loses its class).
3. A quotation that has no closing mark on its line still fails.
4. A verse named but not quoted still gives "not quoted".
5. Panel Build and Build Independent Verdict replayed on the stored 42528 and 42373 inputs: the ledger text changes only on the Luke 1:35 lines.

NOT CHANGED: the rule (ruling 398), the cap, and the WALL-2024 floor. No model settings and no reasoning.
Build and write wait on Eric's card.
