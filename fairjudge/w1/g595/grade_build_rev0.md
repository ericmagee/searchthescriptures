# W1 GRADE: ASK 595 build rev 0 (the E-REVCLOSE item keeps the judge line whole)
GRADE: PASS. Build ask590/w4/fix1500 (notes595.md a4321176, W4, Wall 11453). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Not the builder.
RULES READ: ASK 587 item A (engine manual 11.1), the scope rule, 428, 512. OBJECTIVE MET: yes; the one cut that ASK 590 added to a stored flagged_line is removed.
Checked:
1. W4's base_eng.json and base_child.json equal my own fetches of live d819ff4c and 31329164 (0 differences).
2. My rebuild with buildfix.cjs on my fetches equals target_engine_fix.json and target_child_fix.json (0 node differences). Only the Shared Library changes; only LIB line 3564 differs (14 characters shorter, in engine and child); no slice(0,1500) left in it; connections equal.
3. tfix 8 PASS (rerun by me), including a 2,832-character line reaching flagged_line and response_line whole, and the control showing the live cut. Library pair PASSES (LIB 0e45d9fe625d140d, MAP ccda7f6937ff007a).
Rulings on notes section 4:
- 1 (QR Final / QR Follow Final: a DROPPED reply stored cut to 2,000 in odv1_question_round_log): a stored record cut with no mark. Same class as 587 A. Not in 595 (scope); on the card as a separate line, recommended: store whole.
- 2 and 3 (Panel Build / Build Independent Verdict: reversed close sentences shown to the judges cut to 500; LIB 3564 send-back text cut to 400): a quotation shown to a judge cut with no mark. Same class as 587 A's prompt builders. Not in 595 (scope); on the card as a separate line, recommended: show whole.
- 4 (error messages cut to 300, 120, 80): leave. They are diagnostics, not judge lines or records of a model's text.
