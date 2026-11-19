# ASK 464 plan rev 0 (W2): no comment in any Code node of the workflows the engine reaches

1. OBJECTIVE. No Code node in a workflow that the engine reaches carries a comment (engine manual s15). Expected effect: 5 comments in 4 Code nodes across three sub-workflows are removed; the code runs exactly as before; one stale comment that omits deepseek goes with them.
2. ROLES. Planner and builder W2. Graders W1 and W3. Card: W4's thread; W4 writes with tools/restw.py, one workflow per write (three writes, one card).
3. SCOPE with SEARCH. The call graph from W4 a460_w4/graph_out.txt (KB-0082), which reaches 6 workflows. Each Code node was parsed with acorn (onComment):
   - Engine moMxiV4Irg1uRBZN 828dc91d: only Shared Library carries comments (7 lines). OUT: it is a text store that never runs; its header carries the library sha that the stubs and the Library Check (ASK 443) read. ASK 444 settled the rest of the engine.
   - Child MqQHRl7mQQ0z8QdT 33adc248: the same Shared Library header; OUT for the same reason.
   - ODV1 Cure Call c7366RPLb8vdMQg6 e2fa573a: Skip Return (1), Provider Removed Stop (1). IN.
   - WALL-2024 Panel Judge Call Y1VIsNB6KBrs1znP 474d8def: Wrap (3). Provider Removed Reply (0). IN.
   - WALL-2024 Early Alternate SX4ZWtgHNs96uBOo 30a47a4a (W4's REST copy, a459_w4): Early Alternate Shape (1). IN.
   - TRUTH Error Handler v02XXRlIhoHzMTjJ 5115b808 (MCP read): Build Error Log (0). Nothing to do.
   No changed node is read as text by any node ($(...).params readers: Shared Library only; textread_out.txt).
4. CRITERIA and DONE.
   C1 (artifact target/*.json): each changed Code node has 0 comments, and its acorn token stream equals the base. Found nothing would be a FAIL, because the 5 comments are listed.
   C2: no other node key and no connection differs from the base.
   C3: the reasoning guard passes on all three pairs.
   C4: the readback equals the target md5 (cure 6ba6a272, panel judge ec70eedc, early alternate 212b1d0a), with an audit row per write (ASK 463).
   DONE: two passes, the card, three writes, and readbacks by two seats.
5. WRONG-IF. A removed comment is read as text by some node (the Shared Library pattern), so removing it changes behavior. Checked: the only $(...).params reader is Shared Library. Known-bad case: Shared Library (read as text) is excluded. Known-good case: Skip Return (not read).
6. RUN EVIDENCE. NO PROBE as a separate mark. A comment-only change with equal tokens has no path of its own. Its mark is any run in which these sub-workflows run with no error naming Skip Return, Wrap or Early Alternate Shape.
7. INPUTS IN GIT. a464_w2: base/, target/, build464.cjs, build_out.txt, guard_out.txt, search_eh.txt, textread_out.txt, this plan. The early alternate base is W4's REST copy of version 30a47a4a. restw.py refuses if the live version has moved.
8. STEPS. a. Two grades (W1, W3). b. W4's card. c. W4 runs tools/restw.py for each workflow (dry, then --write), reads back, and writes the audit row. d. Two readbacks. No step is irreversible: each prewrite is the revert.
