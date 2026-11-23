# ASK 516 lower-memory plan (W3, seat 33), draft rev 1, 2026-11-23. A PLAN ONLY; nothing is written.

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
L1. ROUNDS ONCE PER NODE RUN.
  - Each Judge Enforcer Build puts THE ROUNDS IN FULL once, on its first output item only, as json.rounds516.
  - Each call body carries a fixed placeholder line where the rounds now stand.
  - The HTTP Request node for that call builds the sent user message by replacing the placeholder with $('<that build node>').first().json.rounds516. The message the model receives is the same, byte for byte, so the prompt-cache prefix is unchanged.
  - The rounds are then held once per build node run, not once per call, in n8n's execution data.
L2. LOGGED PROMPT TRIMMED.
  - The prompt_sent written to debate_enforcer_log keeps the placeholder, followed by "[THE ROUNDS IN FULL: <n> characters, md5 <first 8>; the same in every call of this run]".
  - The stored text then shows that the rounds were sent, and which rounds, without storing a copy per call.
L3. No other change. RULES, items, packing (MAX_CALLS 10, CALL_CHARS 40000), POINTS AT ISSUE and cure code are untouched.

## DEFINITION OF DONE
1. On a replay of 41155 and 41117, the sent user message per call equals the live 516 message, byte for byte.
2. The build node output and the log rows hold the rounds once per node run.
3. One live run on the operator's word completes, with no out-of-memory error, and every judge enforcer call's sent prompt holds the rounds. This is checked from the HTTP node input or the provider usage (input tokens per call close to the replay estimate), not from prompt_sent, which L2 trims.

## THIS PLAN IS WRONG IF
The crash is not driven by per-call copies of the rounds. Measure before building (W4, read-only):
- the n8n execution data size, or the largest node output, in 41155 against 41117, by node;
- whether the crash point (Panel Tokens in 41155, Record Substitution in 41147) holds the enforcer bodies at all.
If the growth sits elsewhere, for example in the library rebuild named at 10320/10321 or in debate-round data unrelated to the enforcer bodies, this plan aims at the wrong thing.
- Known-good case: 41117, which completed before 516.
- Known-bad case: 41155.

## STEPS
1. W4 runs the wrong-if measure, read-only, and posts it.
2. If it holds, W3 sets the exact placeholder text and log marker in rev 2.
3. W4 builds and replays done-checks 1 and 2.
4. Graded by two non-builder seats (the second held while W1 and W2 are stood down).
5. Card in W4's thread, then the write. This step can be undone (revert files).
6. One run, on the operator's word.

## CRITERIA (each can pass or fail)
- C1: the sent message equals the live 516 message on the replays.
- C2: the rounds are stored once per build node run in the outputs.
- C3: prompt_sent carries the marker and no rounds copy.
- C4: the run completes without an out-of-memory error.
"Found nothing" is not a pass for C4. A run that does not reach the enforcer does not test it.
