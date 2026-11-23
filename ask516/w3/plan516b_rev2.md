# ASK 516 lower-memory plan (W3, seat 33), draft rev 2, 2026-11-23 (wrong-if revised on W4's trace, Wall 10332). A PLAN ONLY; nothing is written.

Asked by the coordinator (07:21Z 11-23). The operator holds the choice of reverting 516 or tracing first. This draft is for that choice. It is built only if he names it.

## OBJECTIVE
A run on 516 completes without the out-of-memory crash, and every judge enforcer call still has the rounds in full before the model.

## SCOPE
pkgREC (library line 3191), the judge enforcer call bodies in the three Judge Enforcer Builds, their HTTP Request bodies, and the prompt_sent the enforcer log stores. Nothing in RULES, the items, packing or the cure code.

## SEARCH (what I read first)
- Wall 10324 and W4's FIRSTRUNS516.md (the crash facts);
- Wall 10320/10321 (the outside planner's library-rebuild diagnosis);
- debate_enforcer_log for 41117 against 41155:
  - 41117: 27 large prompts, 1.44M characters, no rounds sections;
  - 41155: 49 large prompts, 5.81M characters, with 28 carrying THE ROUNDS IN FULL. Argon, qwen4max and gemini judged, so the alternate panel ran.
- So in 41155 the rounds alone account for about 28 copies of about 150-190k characters each, held in n8n item data and then written to the log.

## CHANGE (draft)
L1. ROUNDS ONCE PER NODE RUN, IN EVERY NODE THAT HOLDS THE BODIES. In 41117, W4 measured the bodies in three nodes per flow: Judge Enforcer Build (1,154,685 characters), Enforcer Group Batch Build (948,208, a second copy), and Judge Enforcer Retry Build (499,802). L1 covers all three and their Alt and R2 Alt counterparts.
  - Each Build puts THE ROUNDS IN FULL once, on its first output item only, as json.rounds516.
  - Every call body that node passes on carries a fixed placeholder line where the rounds would stand. Batch and Retry copy the placeholder, never the rounds.
  - The HTTP Request node for a call builds the sent user message by replacing the placeholder with the rounds from the Build node that made the body. The message the model receives is the same, byte for byte, as the live 516 message, so the cache prefix is unchanged.
L2. LOGGED PROMPT TRIMMED.
  - The prompt_sent written to debate_enforcer_log keeps the placeholder, followed by "[THE ROUNDS IN FULL: <n> characters, md5 <first 8>; the same in every call of this run]".
  - The stored text then shows that the rounds were sent, and which rounds, without storing a copy per call.
L3. No other change. RULES, items, packing (MAX_CALLS 10, CALL_CHARS 40000), POINTS AT ISSUE and cure code are untouched.

## DEFINITION OF DONE
1. On a replay of 41155 and 41117, the sent user message per call equals the live 516 message, byte for byte.
2. The build node output and the log rows hold the rounds once per node run.
3. One live run on the operator's word completes, with no out-of-memory error, and every judge enforcer call's sent prompt holds the rounds. This is checked from the HTTP node input or the provider usage (input tokens per call close to the replay estimate), not from prompt_sent, which L2 trims.

## THIS PLAN IS WRONG IF
W4's trace (Wall 10332) found the only growth between the completed runs and the crashed ones in the per-call copies of the rounds, held in the enforcer Build, Batch and Retry nodes and in the log body. The crash points do not hold those bodies. This is consistent with the rounds driving the crash, but not proven, because n8n kept no node data for 41155. So the wrong-if is now measured on what can be read: a replay of the built nodes, counting the characters held.
- It is WRONG IF the held characters do not come down to the completed-run range: on the 41155 shape (the alternate panel seated), the total held by the enforcer Build, Batch and Retry nodes plus the log body must be no more than what the 515 rev 7 build holds on the same 41155 shape, plus one rounds copy per Build node run. For scale: 41117 on 515 rev 7 held about 2.6M and logged 1.44M; 40958, with the same three alternates seated, logged 1.93M and completed.
- Known-bad case: the 516 build as written, estimated at about 10.5M held plus 5.8M logged on 41155. It must fail this check.
- Known-good case: the 515 rev 7 build on 41117. It must pass.
- If L1 and L2 pass this but a live run on the operator's word still crashes, the rounds were not the cause. Then the plan is wrong and 516b is reverted.

## STEPS
1. Done: W4's read-only trace (Wall 10332).
2. W3 sets the exact placeholder text and log marker after W4's grade of this plan.
3. W4 builds and replays done-checks 1 and 2.
4. Graded by two non-builder seats (the second held while W1 and W2 are stood down).
5. Card in W4's thread, then the write. This step can be undone (revert files).
6. One run, on the operator's word.

## CRITERIA (each can pass or fail)
- C1: the sent message equals the live 516 message on the replays.
- C2: the rounds are stored once per Build node run. The Batch and Retry nodes hold only the placeholder. The held total passes the wrong-if on the 41155 and 41117 replays.
- C3: prompt_sent carries the marker and no rounds copy.
- C4: the run completes without an out-of-memory error.
"Found nothing" is not a pass for C4. A run that does not reach the enforcer does not test it.
