# W1 GRADE: ASK 642 plan rev 0 (ask642/w4/plan642.md f640d33c, commit 69b0a32c)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS.

Checked against live engine ee4e389d (fetched this session):
- Second Alternate? builds a2r.retry with
  `/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1`.
  The plan adds `&&!/\(finish_reason (?:length|max_tokens)\)/.test(x.why)` to this test only. The anchor and the line are as the plan states.
- Scope: one node, one condition. No reasoning, model setting, token limit, prompt or judge text is touched.

STANDARD (ASK 599): the plan tags ASK 642 and adds no catch and no dead code. Build to show this.
NOT CHECKED: the build (not yet made); the live run mark.
