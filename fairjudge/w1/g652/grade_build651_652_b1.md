# W1 BUILD GRADE: ASK 651 + 652 b1 (ask652/w4/b1/, target 1aa1517517fc227ef4e8d9cd75d05917)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: PASS.
- Base: W4's base_eng.json matches my live readback of 7f4e5503 (live_eng634.json) in every node's parameters and in its connections (426 nodes).
- Rebuild: I ran b651.cjs then b652.cjs on my own copy of live. The result equals W4's target 1aa15175 in every node's parameters and in its connections.
- Scope: only D4 Build, Panel Build, Build Independent Verdict and Shared Library change.
  - In each of the three nodes, the diff is the ASK 651 window line plus one ASK 652 guard line at the top of the refs(xw) loop. Each carries its tag.
  - In the Shared Library, the diff is LIB line 36 (651, with '\n' written escaped, which meets N1) plus re-measured MAP lengths for 29 consumers. That is the Shared Library form, as in 641.
- The ASK 652 guard is the rev 1 text: it accepts PRSP.verses or PRSP.over.
- Standing on my rebuild: 31 PASS, 0 FAIL (292 of 292 and 67 of 67 compile).
- W4's t651_652.cjs, run by me against my rebuild: ALL PASS (28). This includes the cap case (10 real presses give 8 counted, and "over the cap" names Matthew 1:9 and 1:10, not the [L3] John 1:1), and PRSP null giving identical output.
- Judge-facing ledger, 42528, before and after (I read the diff):
  - AGAINST THE DEFENDER: Luke 1:35 goes from "named there but not quoted" to PROVEN BY REFERENCE in premises 2, 3 and 4. Matthew 1:20 and Galatians 4:4 are no longer listed. The Luke 1:34 floor item stays.
  - AGAINST THE CHALLENGER (the Oracle's presses): the layer verses no longer appear as "UNPROVEN ... no MEANS sentence". Job 14:1 and Acts 13:33 are counted as presses with their MEANS. The 2 Samuel 7:12 floor item stays.
  - Premise verse counts become presses only.
- 42373: 24 changed lines between before and after; tests 20-25 cover it.
NOTES:
- A new judge-facing line appears where layer verses sit in a premise head: "other verses the premise names (informational, not witnesses)". Example: 42528 Oracle premise 2, Matthew 1:24. The plan did not name it. It is informational and does not change the count rule. I mark it for the operator's card, not as a fault.
- The Panel Build and BIV after-ledgers are byte-equal for each run, as are the before-ledgers. That is expected, since ledger652.cjs runs the same reader.
STANDARD (ASK 599): two tagged expressions per node, no new helpers. Met.
NOT CHECKED: W4's claim that the 42528 "before" replay matches live Panel Build 18 of 18 lines (I did not fetch the execution); the Library Check pair hashes.
