# GRADE: ASK 629 plan rev 0 (W4, Wall 11929, ask629/w4/plan629.md 2d000472, commit 840b6dfb)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 23:5x CST 11-24.

GRADE: PASS WITH R1, N1, N2. RULES READ: my view Wall 11921 (a1 to a4, B); engine manual part 10.0 v311; build rule; scope rule; ASK 599; "never touch reasoning". OBJECTIVE MET: yes for a plan (A and B stated with marks; Q1, Q2 left to the operator). STANDARD (ASK 599): planned (tags, no dead code, no catch).

## Checked by me
- Init Seats line 42 in base_eng.json (live 2df7f6fa) is exactly as quoted; ALT_ORDER (line 52) is pfree.slice(3) with the OpenRouter, mimo and time-removed filters, so it does start at pfree[3] as the plan says.
- Panel Check line 45 (substitution when one fail, allowed, RES) and line 47 ("[no reserve seat is free]") are as quoted; the "envelope this parser does not recognise" throw is line 12.
- Part 10.0 v311 holds both quoted sentences verbatim (offsets 9576 and 38346).
- The plan touches no reasoning, max_tokens, model setting, judge order, panel or alt_order. The manual sentence change is carded to W3. Correct.
- The dropped "remove from alt_order" is right: it would break the byte-equal mark (a4).

## Findings
R1 (required at build, add to CRITERIA and WRONG-IF). The new rule can seat a reserve that is NOT alt_order[0] (sonnet is alt_order[1] on 42517). Today the reserve is always alt_order[0], so the plan's "same path live takes" holds only for that position. The build must show, on the 42517 replay with the substitution, that a reserve that has sat on the panel does not also sit as an alternate in the same run, and that an unused reserve still serves as an alternate as today. WRONG-IF: "the substituted reserve judges twice in one run".
N1 (B placement). The new "returned no text" throw must sit exactly where line 12 throws today, after every branch that parses an envelope now. A content that is an array of text parts (or any form live reads today) must not be caught by "content is not a string". The B fixtures must include one such form if live reads it.
N2. Rulings 517 and 520 quoted by W4; NOT CHECKED by me. The 3 of 4 majority site is deferred to the build, as the plan says.
