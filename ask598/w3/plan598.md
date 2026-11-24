# ASK 598 PLAN: REMOVE THE NODES THAT NOTHING REACHES, rev 1 (W1 F1 to F4 of Wall 11482)

MISTAKES IN REV 0, MINE: my scan missed 42 readers (W1 F1), and it named the child's R2 Alternate Merge Seat as a reader of the engine's dead Cure Check when the child has its own live Cure Check (W1 F2).

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade. A plan only (the operator's press "Plan 596, then 597, then 598", 01:43 CST). Each build stage needs its own card.

## 0. OBJECTIVE

The engine holds no node that nothing reaches, and no code that reads such a node (rule 1 of the coding standard, approved 01:57 CST 2026-11-24: "Code that is switched off is removed, not left").

OBJECTIVE MET when: the ASK 596 reach walk counts 0 unreached nodes in the engine and the child (the Shared Library node and canvas notes exempt), no code names a removed node, the standing test set passes, and one run completes on the smaller engine with the same seats, grades and stored columns as today, save the columns section 4 names.

## 1. RULES READ

Ruling 402 (the operator, 11-02, of the single judge: "it trash ... what sense would it make to turn on something that doesn't work"); ruling 428 ("the single judge switched off under ruling 402"); ruling 427 and ASK 590 (the anti-cheat read moved into the closing enforcer); ASK 599 rule 1; the build rule; the scope rule; Wall 11462.

## 2. WHAT STANDS TODAY (my own walk of W4's fetch-back of live engine d819ff4c and child 31329164, ask590/w4/write_r593)

1. Engine: 422 nodes; start nodes Manual Start, Debate Start, Respond Accepted. Walking every connection from them leaves 29 nodes unreached: the Shared Library node (read by code, not by a connection) and 28 others. This agrees with W1's count (Wall 11462). No node is marked disabled.
2. The 28:
   - ANTI-CHEAT, 6 (unreached since ASK 590, 01:32 CST 2026-11-24): Anticheat Build, Anticheat Needed?, Anticheat Call openrouter, Anticheat Record, Anticheat Only?, Anticheat Resume.
   - SINGLE JUDGE AND DIAGNOSTIC, 22: Build Independent Verdict, Verdict Judge Route, Verdict Call openrouter, Verdict Normalizer, Extract Independent Verdict, SJ Re-ask?, SJ Re-ask Build, SJ Re-ask Call openrouter, SJ Re-ask Pick, Cure Build, Cure Needed?, Cure Call openrouter, Cure Normalize, Cure Check, FUM Needed? Cure, FUM Call Cure openrouter, FUM Merge Cure, Build Diagnostic Prompt, Diagnostic Judge Route, Diagnostic Call openrouter, Diagnostic Normalizer, Extract Diagnostic.
3. Child: 156 nodes; only its Shared Library node is unreached. Nothing to remove.
4. THE 28 ARE STILL NAMED BY LIVE CODE. A scan of every reached node's code for `$('<name>')`, and of the library for the name, finds:
   - Anticheat Record: read by Panel Build and Build Save Body. Anticheat Call openrouter: read by Panel Tokens.
   - Extract Independent Verdict: read by Failure Salvage, Assume Check Record, Judge Contradiction Build, and named in the Shared Library (engine and child).
   - Cure Check: read by Alternate Merge Seat, Alternate Pass Call, Failure Salvage, the child's R2 Alternate Merge Seat, and named in the library.
   - Verdict Normalizer, Diagnostic Normalizer, Cure Call openrouter: read by Build Save Body. Extract Diagnostic: read by Failure Salvage.
   - Verdict Call, SJ Re-ask Call, Cure Call, FUM Call Cure, Diagnostic Call (each "... openrouter"): read by Panel Tokens.
   - Build Independent Verdict, Cure Build, Cure Normalize, SJ Re-ask Build, SJ Re-ask Pick, Verdict Normalizer: named in the Shared Library, both copies (its map of which library lines each node runs).
   - THE GROK PASS-BACK LIST (W1 F1, missed by my scan): a list of node names, `for (const xn of [... "Diagnostic Call openrouter", "Verdict Call openrouter", ... "Cure Call openrouter" ...])`, stands in 38 engine nodes (36 HTTP request bodies, Panel Judges Prep, Early Alternate Build) and 4 child HTTP nodes (R2 Alternate Call, R2 Alt Send Back Call, R2 Alt Gate Call, R2 Alt Late Gate Call). Stage B takes the three names out of all 42.
   - THE CHILD (W1 F2): the child has its own live code node named Cure Check. R2 Alternate Merge Seat's `$("Cure Check")` reads THAT node; it is not a reader of the engine's dead Cure Check and is not cut, unless W4 shows otherwise. The child's real readers are by payload: the engine's Alternate Pass Call sends `"Cure Check": {ran}` to the child; the child's Alternate Pass Check HOLD list and its IF nodes A379 Gate 06 and A379 Gate 22 test `ran["Cure Check"] === true`. Stage B lists these and states, for each, the result with the key gone.
   - No `$node["..."]` or `$items("...")` form names any of the 28 (W1).
   - Named by nothing: Anticheat Build, Anticheat Needed?, Anticheat Only?, Anticheat Resume, Build Diagnostic Prompt, Cure Needed?, Diagnostic Judge Route, FUM Merge Cure, FUM Needed? Cure, SJ Re-ask?, Verdict Judge Route.
5. Size: the 28 nodes are 175,615 characters of the engine file's 6,576,380.
6. NOT READ BY ME: what each of those live readers does when the node it names has not run (run 42071 completed with the single-judge nodes not run, so each coped there; I have not read how), and which library lines belong only to the removed nodes. W4 reads both in the build.

## 3. THE DESIGN

S1. A node is removed together with every reader of it. Deleting the 28 alone would leave live code that names nodes which do not exist, and library lines that nothing runs. For each removed node: its node; its connections; each `$('<name>')` branch in a live node; its entry in the library's map; each library line that only removed nodes run; its line in Panel Tokens' list.

S2. TWO STAGES, each its own build, grade and card.
- STAGE A, ANTI-CHEAT (6 nodes; readers Panel Build, Build Save Body, Panel Tokens). The operator's ruling stands behind it already: ASK 590, "Build it, with the send-back" (row 516), moved the read into the closing enforcer.
- STAGE B, SINGLE JUDGE AND DIAGNOSTIC (22 nodes; readers Build Save Body, Failure Salvage, Assume Check Record, Judge Contradiction Build, Alternate Merge Seat, Alternate Pass Call, Panel Tokens, the child's R2 Alternate Merge Seat, the library in both copies). The operator switched the single judge off (ruling 402), and it has stored no verdict since 2026-11-12 (W1, Wall 11462). Removing it for good is more than switching it off, so stage B's card asks him in plain words: REMOVE the single judge and the diagnostic from the engine, or KEEP them unwired. The card RECOMMENDS REMOVE (W1 F4), quoting rule 1 of the standard ("Code that is switched off is removed, not left") and his words of 01:44 CST ("so that we don't have things like dead code in our program? That's just unacceptable."), and names the saved engine version as the way back. Rewiring is not proposed; it would reverse ruling 402.

S3. PROOF BEFORE EACH CARD (W4):
1. The reach walk on the target: 22 unreached after stage A, 0 after stage B (Shared Library exempt).
2. No parameter of any node of any type in the target, engine or child, holds the exact quoted name of a removed node. Whole names only (W1 F3): Cure Build and Cure Normalize are parts of the names Panel Cure Build, Alternate Cure Normalize and the like, and a substring search gives about 25 false hits. The child's own Cure Check is exempt by workflow.
3. KNOWN-BAD: a target with the nodes deleted and one name left in an HTTP request body's pass-back list FAILS the scan of item 2.
4. CONTROL: on stored runs 37203, 41822 and 42071, every live node that lost a branch gives byte for byte the same output from the same inputs, base against target (the branch read a node that did not run, so its removal must change nothing); the same for the child's Alternate Pass Check and A379 Gates 06 and 22 with the `Cure Check` key gone. Any difference is listed and explained before the card.
5. The Library Check pair passes; the standing test set passes; the count of nodes and of library lines before and after.

## 4. WHAT CHANGES IN A RUN AND IN THE RECORD

1. No seat, grade, count or standing rule changes. The removed nodes do not run today.
2. Stored columns: Build Save Body today fills the single judge's and the diagnostic's columns from nodes that did not run. After stage B those columns are written empty by plain code, not by a failed read. W4 names each column and its value before and after; past rows are not touched.
3. Panel Tokens no longer lists the removed calls.
4. The engine manual: part 07.0 ("Synthesis, single judge, diagnostic", 14,737 characters) and every entry on the anti-cheat nodes and the single judge describe nodes that will not exist. The body law says the text holds only what the engine does. W3 drafts the manual pairs for each stage after its write, W1 grades, the operator's card. This is the larger part of the work: by my scan 9 manual parts name the anti-cheat nodes.
5. ASK 593 and ASK 590 edited Build Independent Verdict, and the ASK 586 J2 and J3 texts name it as a twin of Panel Build. After stage B those edits fall away and the texts act through Panel Build alone, as texts586_J2J3J6.md draft 2 section 0 item 5 says.

## 5. LIMITS

1. Not shown by a run until one completes on the smaller engine.
2. My scan reads `$('<name>')` and the name in the library. A node read another way (by `$node["<name>"]`, by an expression in a non-code node's parameters, or by a name built in code) is not in section 2 item 4. S3 item 2 must search those forms.
3. If the operator later wants a single judge again, it is rebuilt from the saved engine version, not switched on.

## 6. THIS PLAN IS WRONG IF

1. A reader's branch for a removed node does run today in some path (then it is not dead, and item 4 of S3 shows a difference).
2. A dashboard or database function reads the single judge's or the diagnostic's columns and breaks on empty ones (W4 names the readers of those columns).
3. The operator keeps the single judge (then stage B is dropped, and the 22 nodes stay as a named exception to rule 1, written into the standard's baseline with his ruling).

## 7. ORDER WITH THE OTHER WORK

After the ASK 596 core, which holds the reach walk. W4's order (595, the 596 core, J1, J2/J3/J6, C1, 594, the rest of 596, 591) is not changed by this plan. Stage A is small and could follow 594; stage B waits on the operator's choice.
