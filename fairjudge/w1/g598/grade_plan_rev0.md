# W1 grade: ASK 598 plan rev 0

GRADE: PASS with F1 to F4. ASK 598 plan rev 0 (ask598/w3/plan598.md 334e61a1, commit 4c802916).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

RULES READ: rulings 402, 427, 428; ASK 590; ASK 599 rule 1 (approved 01:57 CST); the operator's words 01:44 CST ("dead code in our program? That's just unacceptable"); build rule; scope rule; ruling 512.
OBJECTIVE MET: yes, as a plan; live stages, each with its card.
STANDARD (ASK 599): a plan, no code; rule 1 is its objective.

## Section 2, against my own scan

Scans: walk598.js (reach walk from every trigger or start node) and readers598.js (every exact quoted node name, in the parameters of every node of any type: code, HTTP request, IF, execute-workflow), on engine d819ff4c and child 31329164.

- Reach: engine starts Manual Start, Debate Start, Respond Accepted; 29 unreached = Shared Library + the same 28 W3 lists. No node disabled, no sticky notes. Child: start Alternate Pass In; only Shared Library unreached. AGREES.
- No `$node["..."]` and no `$items("...")` form names any of the 28, in either flow.
- Readers W3 found: all confirmed (Panel Build, Build Save Body, Panel Tokens, Failure Salvage, Assume Check Record, Judge Contradiction Build, Alternate Merge Seat, Alternate Pass Call, the library in both copies).

## Findings

F1. READERS THE PLAN MISSES, in non-code nodes. The grok reasoning_details pass-back holds a list of node names (`for (const xn of ["C1 Call openrouter", ..., "Diagnostic Call openrouter", "Verdict Call openrouter", ..., "Cure Call openrouter", ...])`). That list stands in 38 engine nodes (36 HTTP request bodies, Panel Judges Prep, Early Alternate Build) and in 4 child HTTP request nodes (R2 Alternate Call, R2 Alt Send Back Call, R2 Alt Gate Call, R2 Alt Late Gate Call, each "... openrouter"). Stage B must take the three names out of all 42, and they count as touched nodes.

F2. THE CHILD. (a) The child holds its own live code node named Cure Check. A `$("Cure Check")` in the child (R2 Alternate Merge Seat) reads that node, not the engine's dead one; it is not a reader to cut unless W4 shows otherwise. (b) The real child readers of the engine's Cure Check are by payload: Alternate Pass Call (execute-workflow, non-code) sends `"Cure Check": {ran: ...}`; the child's Alternate Pass Check holds "Cure Check" in its HOLD list, and the IF nodes A379 Gate 06 and A379 Gate 22 test `ran["Cure Check"] === true`. S1 lists these and says what the child does when the key is gone (today it is always false).

F3. S3 item 2 and item 3. The scan searches the exact quoted name in the parameters of every node type, not `$('<name>')` and the library map alone, and matches whole names (Cure Build and Cure Normalize are parts of Panel Cure ... and Alternate Cure ... names; a substring scan raises false hits in about 25 nodes). The known-bad of item 3 leaves one name in an HTTP request body's list, the form the plan's scan missed.

F4. Stage B's card. Rule 1 is approved and the operator called dead code unacceptable at 01:44. The card may still ask REMOVE or KEEP, but it should recommend REMOVE and quote both, and say the engine version before stage B is the way back (5.3).

Minor: my size of the 28 is 173,660 characters (JSON of each node) against W3's 175,615; a difference of measure, not material.

## S3 proofs

Items 1, 4 and 5 are sound. Item 4 should include the child's A379 Gates 06 and 22 on the stored runs (same result with the key absent).
