# ASK 469 plan rev 0 (W2): tools/gate.cjs refuses a change that adds a comment to a Code node

1. OBJECTIVE. A code change that adds a comment to a Code node is stopped by the gate before its card (engine manual s15), so a grader no longer has to catch it by eye (the miss at ASK 460 rev 1, W1 9287; W2 9288 missed it). Expected effect: tools/gate.cjs exits 6 and names the node.
2. ROLES. Planner and builder W2. Graders W3 and W4. Card NONE: tools only in git, no system write (as for ASK 463).
3. SCOPE with SEARCH. tools/gate.cjs (ASK 442) is the one command run before every card for a code change (README, GATE.md). It had 0 hits for "comment". Searched every Code node of the live engine 828dc91d (182) and child 33adc248 (61) with acorn: all parse except Shared Library, whose text after /*LIB*/ is data; comments today are Early Alternate Build 1 (kept by ASK 444 for the reasoning guard) and the Shared Library header 4. The three sub-workflows have 0 since ASK 464. Change: gate.cjs, 7 lines after CHANGED; GATE.md one line; README row. OUT: rbx.cjs and restw.py (they read back, they do not gate).
4. CRITERIA and DONE.
   C1: a changed Code node whose candidate has more comments than the base (or a new Code node with any) gives exit 6 with the node and counts, before any replay.
   C2: no false refusal: equal counts pass, including Early Alternate Build's kept comment (1 -> 1) and a Shared Library sha change (4 -> 4); a // inside a string is not a comment.
   C3: the existing exits (0, 3, 4, 5) are unchanged when no comment is added.
   C4: a node that cannot be parsed is refused (fail closed), not passed.
   DONE: two passes; the change is in git and listed in README and GATE.md.
5. WRONG-IF. The check would miss the real case it exists for. Run before posting: known-bad is the ASK 460 rev 1 target (381a6020) against its base 5297cdd3, which gives exit 6 on Provider Removed Reply (0 -> 1). Known-good is the ASK 464 targets against their bases, which pass the comment check.
6. RUN EVIDENCE. NO PROBE: a tool, not an engine path. Its mark is the next gate run before a code card that prints "COMMENTS: no changed Code node gains a comment" or exit 6.
7. INPUTS IN GIT. a469_w2: plan_rev0.md, gate_base.cjs (gate.cjs before), mkplants.cjs, tests_out.txt, pl/ (the small plants; engine plants rebuild with mkplants.cjs from the live 828dc91d copy); tools/gate.cjs, GATE.md, README.md.
8. STEPS. a. Tests T1 to T10 (tests_out.txt). b. Two grades. c. Nothing to write.
