# ASK 518 plan (W3, seat 33), rev 1, 2026-11-23. A PLAN ONLY; nothing is written.
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
- Graders: W2 and W4, per Wall 10381. If the one-grader op doc change is written first, one non-builder grade suffices.
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
- S1. In both PROMPTs, that sentence ends instead: "...; differs only in wording; or differs only by a reference: it ties its point to a verse whose words, as the debater's own rounds quote them, do not give that point (a wrong reference, or one grouped with the verse that does give it). Read such a sentence with that reference set aside; if its point then agrees with the earlier sentence, it is not a contradiction. A sentence whose point itself cannot be true with the earlier sentence is still a contradiction, whatever its references."
- S2. Engine manual: the E-CLOSECON entry gains the same case. This is W3's entry, with its own read and card.
- Not changed:
  - The two-confirmation rule (pkgJC2).
  - The judges' CONTRADICTION lines.
  - The outcome rule of ASK 505 (a confirmed closing contradiction takes a win away from the side that made it).

## 4. CRITERIA and DONE
- C1: on 41117, both copies of the new Judge Contradiction prompt answer J1 and J2 NOT A CONTRADICTION. The input is 41117's own built body, with the sentence replaced. Each copy is run three times.
- C2: the known-good contradictions on 41117 stay CONFIRMED under the new Close Enforcer prompt: NEW CHALLENGER LINK 6 (rows 48692 to 48694, a narrowed claim asserted again). Each is run three times.
- C3: every E-CLOSECON row CONFIRMED in 41024, 41043, 41090, 41102 and 41117 is replayed with the new prompt. Any that turns NOT A CONTRADICTION is listed with its two sentences. For each, the build post says whether the change is a reference-only fault (expected) or a lost contradiction (a FAIL).
- C4: the only node parameters that change are the two PROMPT sentences. The library, other nodes and connections are unchanged.
- C5: one live run on the operator's word. Every CONFIRMED closing contradiction in it has a point that conflicts, not only a reference.
- DONE: C1 to C5 pass, and the manual entry is written and read back.
- Cost note: C1 to C3 call the enforcer model (the ENFORCER row of model_config) about 40 times. Nothing is written.

## 5. WRONG-IF
This plan is wrong if the new sentence clears a closing sentence whose point conflicts with the earlier one.
- Known-bad (must stay CONFIRMED): 41117 NEW LINK 6. It is also wrong if any C3 row turns that is not reference-only.
- Known-good (must turn): 41117 J1 and J2.
If C1 still confirms J1 or J2 on two or more of three runs, the prompt change does not carry the rule. Then the plan is revised to a code test (for example, comparing each side's quoted rows), not shipped.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry for this path. W1 adds a case, mark "reference-only close", if the registry takes one. C5 is read from the run's E-CLOSECON rows.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W1 commits the built bodies, the replay script and its replies at build.

## 8. STEPS
1. W2 and W4 grade this plan. Waits on: nothing.
2. W1 builds S1 and runs C1 to C4. Waits on: step 1.
3. Grades of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. Waits on: step 3.
5. W3 writes S2 after a read, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C5). Waits on: step 4.
