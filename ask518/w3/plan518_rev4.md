# ASK 518 plan (W3, seat 33), rev 4, 2026-11-23. Replaces rev 3 (e1198a58, kept as plan518_rev3.md) after the test calls (W2 readback, Wall 10443): C1 passed; C2 failed (41117 NEW CHALLENGER LINK 6 was confirmed in 0 of 3 runs); C3 lost 41102 NEW LINK 1 and LINK 2; no baseline calls were made, so the cause is not known. Changed: S1 (narrowed), CRITERIA (C0 baseline added; C2 and C3 read against it), cost, STEPS. Rev 3 replaced rev 2 on W2's C-b (Wall 10402); rev 2 replaced rev 1 on W1's two points. A PLAN ONLY; nothing is written.
Source: the operator's "Four Remaining Bugs in the Run (4) Debug Log", Bug 2 (13:10 CST 11-20, W4 thread), released by his "yes" at 02:02 CST 11-23 (Wall 10381). Run (4) is 41117. The basis for that is in the ASK 517 plan (Wall 10389).

## 1. OBJECTIVE
A closing sentence whose only fault is a wrong or grouped verse reference is not confirmed as a closing contradiction. The test is general: if the sentence's point, read with that reference set aside, agrees with the earlier sentence, it is not a contradiction. A closing sentence whose point conflicts with an earlier one is confirmed as today.
The operator, on 41117: the close "compressed two naming verses into one sentence ... carelessly grouping Luke 1:13 ... That is a citation-grouping slip ... not a substantive contradiction".
The operator also ruled at 11:37 CST 11-20: "none of our fixes are for single case instances ... that the equivalent to hard coding." So the rule names no verse, topic or debate.
Expected effect: on 41117, J1 and J2 (CHALLENGER LINK 1) are answered NOT A CONTRADICTION by both checks. LINK 1 is then not broken by the engine, and the "confirmed closing contradiction" reason for 41117's outcome falls away on that link.

CAUSE (debate_enforcer_log, 41117):
- Rows 48698 to 48701, the judge contradiction enforcer, both copies. They CONFIRMED J1 and J2 on CHALLENGER LINK 1.
  - EARLIER [DR2]: "To Zacharias the angel gives 'bear thee a son.' To Joseph he gives 'thou shalt call his name.'" (and "The two rows differ in what they hand to the husband.").
  - CLOSING [DR4]: "Matthew 1:21 and Luke 1:13 give Joseph the naming: 'thou shalt call his name JESUS'."
  - The enforcer's reason: "the close says both rows give Joseph the naming."
- The point of both sentences is that Joseph is given the naming. Only the added reference, Luke 1:13, is wrong.
- The enforcer prompt's NOT-a-contradiction list has no case for a reference fault. Two confirmations are needed (pkgJC2), and both copies read the same prompt, so both confirmed.

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W1 (seat 34), per Wall 10381.
- Grader: one non-builder seat (op doc v140).
- Write card: W4's thread; W4 writes to n8n. The manual entry is W3's, on a card in W3's thread.

## 3. SCOPE, with SEARCH
SEARCH:
- Read: engine moMxiV4Irg1uRBZN and child MqQHRl7mQQ0z8QdT (W4's 07:53Z fetches, ask516/w4/b/live_*.json), plus SX4ZWtgHNs96uBOo and c7366RPLb8vdMQg6.
- Searched for: "NOT a contradiction", "NOT A CONTRADICTION", "CLOSE-CONTRADICTION" and "only in wording", in the library (3560 lines) and in every node.

HITS:
- Close Enforcer Build (engine), const PROMPT: "It is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something; states or quotes the other side's position; answers a press with a further reason the earlier sentence leaves room for; or differs only in wording."
- Judge Contradiction Build (engine), const PROMPT: the same sentence, byte for byte. The two prompts differ elsewhere, and those parts stay.
- Close Enforcer Record and Judge Contradiction Record parse the replies only. Not changed.
- Shared Library: no hit for the sentence. The library reads confirmed lists through cecBroken2024 (L1306), which is unchanged.
- Child workflow, SX4ZWtgHNs96uBOo and c7366RPLb8vdMQg6: no hit.

CHANGE:
- S1 (rev 4, narrowed). In both PROMPTs, that sentence ends instead: "...; differs only in wording; or differs only by an added reference: the closing sentence quotes words, those words stand in one verse it cites, and another verse cited with it does not hold them. Read such a sentence with the added reference removed; if it then agrees with the earlier sentence, it is not a contradiction. A sentence whose own words or point cannot be true with the earlier sentence is still a contradiction, whatever its references."
  - Why narrowed: rev 3's wording ("a verse whose words ... do not give that point") asks the enforcer to weigh what a verse gives. That may clear a contradiction by meaning, not by reference. Rev 4 clears only a sentence whose QUOTED WORDS are found in one cited verse and not in another cited beside it. On 41117 J1 and J2, "thou shalt call his name JESUS" stands in Matthew 1:21 and not in Luke 1:13. The rule names no verse, topic or debate.
  - Rev 3's wording is kept in plan518_rev3.md. Its test replies are the record of rev 3, not of rev 4.
- S2. Engine manual: the E-CLOSECON entry gains the same case. This is W3's entry, with its own read and card.
- Not changed:
  - The two-confirmation rule (pkgJC2).
  - The judges' CONTRADICTION lines.
  - The outcome rule of ASK 505 (a confirmed closing contradiction takes a win away from the side that made it).

## 4. CRITERIA and DONE
- COUNTING: one run = copy 1 (temperature 0) and copy 2 (temperature 0.6) once each on the same built body. pkgJC2 is read per run, as the engine reads it: a candidate is confirmed in a run only when both copies of that run answer CONFIRMED. Every arm below is 3 runs.
- C0, BASELINE (new): the same bodies with the OLD sentence (live text), 3 runs each, on:
  (a) 41117 Close Enforcer CHALLENGER;
  (b) 41117 Judge Contradiction, the body that holds J1 and J2;
  (c) 41102 Close Enforcer, the body that raised NEW LINK 1 and LINK 2 (rows 48277, 48279).
  C0 shows how often each known item is confirmed with no change at all. A known item that is not confirmed 3 of 3 at baseline cannot be a test of the change, and the build post says so.
- C1: under the new sentence, J1 and J2 are confirmed by pkgJC2 in none of the 3 runs. Under C0(b), the baseline confirms them in at least 2 of 3. Otherwise the change has nothing to cure, and C1 is void.
- C2: every item that C0(a) and C0(c) confirm in 3 of 3 is also confirmed in 3 of 3 under the new sentence. This covers NEW CHALLENGER LINK 6 on 41117, and NEW LINK 1 and LINK 2 on 41102, if the baseline confirms them.
- C3: the rev 3 C3 replies on 41024, 41043 and 41090 showed no loss against the logged rows, so they are not repeated. Any item lost in C2 is listed with its two sentences, and W1 classes each as reference-only (expected) or a lost contradiction (a FAIL).
- C4: the only node parameters that change are the two PROMPT sentences. The library, other nodes and connections are unchanged.
- C5: one live run on the operator's word. Every CONFIRMED closing contradiction in it has a point that conflicts, not only a reference.
- DONE: C1 to C5 pass, and the manual entry is written and read back.
- Cost and route: C0 is 3 bodies x 3 runs x 2 copies = 18 calls. C1 and C2 under the new sentence are the same 3 bodies again, another 18 calls. That is 36 paid calls to the enforcer model (the ENFORCER row of model_config, openai/gpt-6-luna in rev 3's calls). They wait on a NEW release by the operator, asked on a card in W4's thread after this rev is graded. The card says that rev 3's 30 calls were made and failed C2, and that this rev adds a baseline. The calls go only through W4's probe path, as in rev 3. No seat reads a key value. W1 builds the bodies offline; W4 makes the calls and commits the replies; W1 classes them; one non-builder seat reads them back. Nothing is written to the engine.

## 5. WRONG-IF
This plan is wrong if the new sentence clears a closing sentence whose words or point conflict with the earlier one.
- Known-bad (must stay CONFIRMED wherever the baseline confirms it 3 of 3): 41117 NEW CHALLENGER LINK 6; 41102 NEW LINK 1 and LINK 2.
- Known-good (must turn): 41117 J1 and J2.
If C2 fails under rev 4, a prompt sentence does not carry the rule. The plan is then revised to a code test, not shipped. The test would check the closing sentence's quoted words against the rounds' own rows for each verse it cites, and drop only the cited verse that does not hold them. That code test is not built under this rev.
If C0 shows that the known items are not stable at baseline (fewer than 3 of 3), the build post says so. The operator is then asked whether 518 continues, because two-copy confirmation cannot test the change on those items.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry for this path. W1 adds a case, mark "reference-only close", if the registry takes one. C5 is read from the run's E-CLOSECON rows.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W1 commits the built bodies, the replay script and its replies at build.

## 8. STEPS
1. One non-builder seat grades this rev. Waits on: nothing.
2. W1 builds S1 offline on the 517 engine (the write order is 517 first: W2 10441 limit c), prepares the C0 to C2 inputs, and checks C4. Waits on: step 1.
2a. W1 builds the six bodies (3 old, 3 new). W4 posts the release card for 36 calls in W4's thread. Waits on: step 1 (grade of rev 4).
2b. W4 makes the calls through the rev 3 probe path and commits the replies. W1 classes them, and one non-builder seat reads them back. Waits on: the operator's press on 2a.
3. Grades of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. Waits on: step 3.
5. W3 writes S2 after a read, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C5). Waits on: step 4.
