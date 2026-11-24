# W1 grade: ASK 588 build, the judges' question round live (W4 Wall 11392; commit 23546e0b; plan rev 1 notes a588_w4/plan588.md 57f2d790)

GRADE: PASS. RULES READ: plan rev 0 and my grade 11386 (F1 to F4); the operator's choices of 06:01Z (D1 "A now, B as its own ASK"; D3 "Keep it"; one continuation pass as the next build with its own switch; "Hold the run"); rulings 414, 512; build rule (touched nodes only, no model settings).

1. Base: n8n history shows live engine 7536d7bf (05:17:40Z) and child a7113b8d (05:17:45Z), with nothing newer. W4's base_eng.json and base_child.json equal my own fetch of those versions node for node (398 and 156 nodes, 0 parameter differences, same connections).
2. Rebuild: build588.cjs on those bases, in my scratch directory, gives targets equal to W4's 024290a7 and 16ed1670 node for node, apart from the random ids of the 9 new nodes (407 and 156 nodes, 0 differences, same connections). The child md5 16ed1670 is exact.
3. Tests: t588 82 PASS on W4's own targets (024290a7) and on my rebuild. syn588: 372 code parts, 0 syntax errors. The Library Check pair passes (LIB 14d848a99adaf445, MAP 3675b0b63c7c05f7).
4. Scope: no model setting is touched.
   - Of the changed engine nodes, only jsCode changed, except Alternate Pass Call (workflowInputs, which hands qa through to the child) and QR Answer (position only).
   - 24 nodes gain only the 14 characters `QR Merge");$("` in their node-reference preamble.
   - Panel Check and Reserve Build change only the Panel Build read, to the swap.
   - The child changes only in the Shared Library.
   - The new Anthropic nodes use the existing Anthropic credential; the new OpenRouter node is a copy of QR Answer.
5. Plan grade 11386:
   - F1 and F2: the operator chose (A; keep AGREE).
   - F3: the continuation pass is not in this build; it is the next build, behind its own switch.
   - F4 (b): met by T6.2.
   - F4 (a) and (c) move with the continuation build.
   - The option A text keeps ruling 414(1)'s words "read with the round it came from".
6. Live under ruling 512: the round is on by default on every fresh run (T0.2, T0.3). In a regrade it is opt-in. A fault skips the round and never stops the run (T5.1 to T5.11).
7. FOR THE CARD:
   - The limits in 11392 item 7 must be on it: the enforcer turn does not see the block; the single judge is not connected; answers are not counted as rounds; and the live reads (Final Output, Resolve Seats) and both routes are first exercised live.
   - The dry regrade of 42071 with question_trial:true needs the operator's launch.
   - Revert: both workflows together.
8. N1: libpatch.js and the rounds data used by t588 are only on /mnt/project-files, not in git. Commit libpatch.js with the build files.

OBJECTIVE MET: yes. Every deciding judge path reads the same questions and answers on every fresh run, and a fault skips the round, not the run.
