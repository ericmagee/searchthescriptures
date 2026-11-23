# ASK 518 plan (W3, seat 33), rev 6, 2026-11-23. Replaces rev 5 (aa33ede2, kept as plan518_rev5.md) on W2's C-h and C-i (Wall 10451): S1 names the text the quoted words are checked against and requires the whole quotation; OBJECTIVE narrowed to S1; step 2a and the release card fixed. Rev 5 replaced rev 4 (01fc9e6a) on W1's answer (Wall 10448). Rev 4 replaced rev 3 (e1198a58) after the test calls (W2 readback, Wall 10443). A PLAN ONLY; nothing is written.
Source: the operator's "Four Remaining Bugs in the Run (4) Debug Log", Bug 2 (13:10 CST 11-20, W4 thread), released by his "yes" at 02:02 CST 11-23 (Wall 10381). Run (4) is 41117. The basis for that is in the ASK 517 plan (Wall 10389).

## 1. OBJECTIVE
A closing sentence that differs from an earlier sentence only by an added reference is not confirmed as a closing contradiction. "Added reference" means one thing only: the sentence quotes words, the whole quotation stands in one verse it cites, as the rounds quote that verse, and another verse cited with it does not hold the whole quotation (S1). If the sentence, read with that added reference removed, agrees with the earlier sentence, it is not a contradiction. Any other fault of reference, and any closing sentence whose words or point conflict with an earlier one, is confirmed as today.
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
- S1 (rev 6). In both PROMPTs, that sentence ends instead: "...; differs only in wording; or differs only by an added reference: the closing sentence quotes words, the whole quotation stands, word for word, in one verse it cites as the rounds of this debate quote that verse, and another verse cited with it, as the rounds quote it, does not hold the whole quotation. Read such a sentence with that added reference removed; if it then agrees with the earlier sentence, it is not a contradiction. A sentence whose own words or point cannot be true with the earlier sentence is still a contradiction, whatever its references. Check the quotation only against the verse text the rounds quote, never against your own reading or memory of a verse."
  - The text checked against (W2 C-h): the verse as the rounds of this debate quote it. The enforcer's prompt already carries the rounds in full (516b). The check uses no outside text.
  - Whole quotation (W2 C-h): a part of the quotation found in both verses does not count. On 41117 J1 and J2, the quotation is "thou shalt call his name JESUS". Luke 1:13 also has "thou shalt call his name", but the whole quotation, with JESUS, stands in Matthew 1:21 only.
  - Rev 3's wording is kept in plan518_rev3.md. Its test replies are the record of rev 3, not of this rev.
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
  (c) 41102 Close Enforcer CHALLENGER, the body that raised NEW LINK 1 and LINK 2 (rows 48277, 48279);
  (d) CONTROL: 41024 Close Enforcer CHALLENGER. Its NEW LINK 6 was confirmed by both copies in the log (2 of 2) and again in rev 3's calls (W1 10448).
  Each body is built twice (copy 1 and copy 2), so an arm is 4 bodies x 2 copies x 3 runs = 24 calls.
  Known in the logs (W1 10448): except J1, J2 and 41024 LINK 6, every original known item was confirmed by only 1 of the 2 copies. The 3-of-3 bar in C0 is therefore likely to fail for 41117 LINK 6 and 41102 LINK 1 and LINK 2. If it does, those items show the enforcer's own variance, and the change is judged on J1 and J2 (C1) and on the control (C2).
  C0 shows how often each known item is confirmed with no change at all. A known item that is not confirmed 3 of 3 at baseline cannot be a test of the change, and the build post says so.
- C1: under the new sentence, J1 and J2 are confirmed by pkgJC2 in none of the 3 runs. Under C0(b), the baseline confirms them in at least 2 of 3. Otherwise the change has nothing to cure, and C1 is void.
- C2: every item that C0 confirms in 3 of 3 is also confirmed in 3 of 3 under the new sentence. That always includes the control, 41024 NEW LINK 6, and 41117 LINK 6 and 41102 LINK 1 and LINK 2 where the baseline confirms them 3 of 3. 41102 LINK 1 and LINK 2 cite no verse (W1 10448), so S1 cannot apply to them: any loss on them under the new sentence fails C2 whatever the baseline shows at 2 of 3 or more.
- C3: the rev 3 C3 replies on 41024, 41043 and 41090 showed no loss against the logged rows, so they are not repeated. Any item lost in C2 is listed with its two sentences, and W1 classes each as reference-only (expected) or a lost contradiction (a FAIL).
- C4: the only node parameters that change are the two PROMPT sentences. The library, other nodes and connections are unchanged.
- C5: one live run on the operator's word. Every CONFIRMED closing contradiction in it has a point that conflicts, not only a reference.
- DONE: C1 to C5 pass, and the manual entry is written and read back.
- Cost and route: C0 is 4 bodies x 2 copies x 3 runs = 24 calls. C1 and C2 under the new sentence are the same 4 bodies again, another 24 calls. That is 48 paid calls to the enforcer model (the ENFORCER row of model_config, openai/gpt-6-luna in rev 3's calls). They wait on a NEW release by the operator, asked on a card in W4's thread after this rev is graded. The card says three things: rev 3's 30 calls were made and failed C2; the C2 item, 41117 NEW CHALLENGER LINK 6, was confirmed by only 1 of 2 copies in the original run, so it was never a fully confirmed contradiction (W2 10449); and this rev adds a baseline and a stable control. The calls go only through W4's probe path, as in rev 3. No seat reads a key value. W1 builds the bodies offline; W4 makes the calls and commits the replies; W1 classes them; one non-builder seat reads them back. Nothing is written to the engine.

## 5. WRONG-IF
This plan is wrong if the new sentence clears a closing sentence whose words or point conflict with the earlier one.
- Known-bad (must stay CONFIRMED wherever the baseline confirms it 3 of 3): 41024 NEW LINK 6 (the control); 41117 NEW CHALLENGER LINK 6; 41102 NEW LINK 1 and LINK 2.
- Known-good (must turn): 41117 J1 and J2.
If C2 fails under this rev, a prompt sentence does not carry the rule. The plan is then revised to a code test, not shipped. The test would check the closing sentence's quoted words against the rounds' own rows for each verse it cites, and drop only the cited verse that does not hold them. That code test is not built under this rev.
If C0 shows that the known items are not stable at baseline (fewer than 3 of 3), the build post says so. The operator is then asked whether 518 continues, because two-copy confirmation cannot test the change on those items.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry for this path. W1 adds a case, mark "reference-only close", if the registry takes one. C5 is read from the run's E-CLOSECON rows.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W1 commits the built bodies, the replay script and its replies at build.

## 8. STEPS
1. One non-builder seat grades this rev. Waits on: nothing.
2. W1 builds S1 offline on the 517 engine (the write order is 517 first: W2 10441 limit c), prepares the C0 to C2 inputs, and checks C4. Waits on: step 1.
2a. W1 builds the bodies (4 old, 4 new, each for both copies). W4 posts the release card for 48 calls in W4's thread. Waits on: step 1 (grade of this rev).
2b. W4 makes the calls through the rev 3 probe path and commits the replies. W1 classes them, and one non-builder seat reads them back. Waits on: the operator's press on 2a.
3. Grades of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. Waits on: step 3.
5. W3 writes S2 after a read, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C5). Waits on: step 4.
