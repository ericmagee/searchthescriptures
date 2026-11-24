# W1 grade: ASK 591 plan rev 0, the judge order page (W3 Wall 11413; ask591/w3/plan591.md ff4b7e0f, commit 95a60093)

GRADE: PASS with F1 and F2. RULES READ: ruling 512 (live, not trial); scope rule; build rule; the 588 R lesson (Wall 11403: test the node order, not only the text). Live engine read: 9bec145c (my fetch).

1. Live under ruling 512: there is no switch and no record-only stage. The tests are proof before the write. PASS.
2. The objective matches the operator's request of 23:23 and 00:41 CST: he orders the seats, and no code edit is needed. S10 and L1 to L4 keep the scope to the order. No rule, prompt or model setting is changed.
3. Facts checked on live 9bec145c:
   - ORDER0 stands only in Init Seats: ['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'].
   - __ALT stands in Init Seats and Pass Accumulate. Pass Accumulate must follow the table too; W4's R1 names it.
4. S5 (stop, no silent fallback) STANDS, with F1 on where it stops.
   F1: Init Seats is not the start of the run. Its live parent chain is Manual Start / Dry Run Config, then Accept Models, Accept Build, Accept Call openrouter (model calls: the judges' agreement), Accept Check, Accept Return?, Accept Final, Init Seats.
   - Init Seats also uses ORDER0 for the agreement (AGREE_OUT). The plan's item 2.2 names Accept Build as holding the order.
   - A read node placed just before Init Seats would stop the run after the agreement calls, and those agreement calls would have used the old order.
   - Fix: the read node goes before Accept Build, on the fresh path and on every start path (webhook and manual). S5's message says "before any model call" only once T4 shows that on the node order. T4 tests the node order, not only the text.
5. S9 (a second SQL copy of the drawing rule, held equal by T2) STANDS, with F2. It is the only way a static page can show the line-up, and the page says "as the engine would seat it now". But a copy drifts unless every input is the same and the copy is checked on live runs.
   F2:
   a. dash_judge_lineup must take every input Init Seats' drawing uses, from the same source. W4 lists these from the live code: NOT_PANEL; FAM_PANEL; the seated debaters; the fault-ledger move (Init Seats reads jfl_move from Accept Models at run time); the time rule; the guards on alternates.
   b. T2 varies each of those inputs, not only the order (for example, a seat with jfl_move true).
   c. Add a check on every live run. S4's review_notes line records the panel, reserve, alternates and single judge as seated, so any drift from the page shows in the record of the next run. The AAR compares them.
6. S7 and L3 are right: a save cannot add or drop a seat, and a reserve that the substitution recorder would refuse is refused at save. N1: anyone with the dashboard password can change the order. The card says so.
7. S4: Build Save Body runs after Init Seats on the fresh path, and a regrade keeps its seats (S6). T5 tests the node order. PASS.

OBJECTIVE MET: yes once F1 and F2 are applied.
