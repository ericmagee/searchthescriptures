# ASK 629 PLAN (W4), rev 0: a free reserve when the next seat is JFL-moved; a failure line that says why a judge gave no text

Source: run 42517 (ODV1-42517-5yb0fmgv, row fd0edbff), W4 proposal Wall 11919, W1 view Wall 11921 (a1 to a4, B).
Live base: engine moMxiV4Irg1uRBZN 2df7f6fa (polled 23:48 CST 11-24; nothing running).
Reasoning: no reasoning setting is touched. Q1 and Q2 (hydrogen) are Eric's and are asked separately below; this plan does not depend on them.

## 1. OBJECTIVE
A. When one panel judge fails, a reserve takes its place if any eligible free seat exists. On 42517 the reserve was null and the run failed closed, though sonnet and neon were free, eligible and had accepted the posture.
B. When a judge returns a reply with no text, the failure line says why: finish_reason and the token counts. On 42517 it said "returned an envelope this parser does not recognise", which hid the cause (hydrogen spent 65,533 of 65,536 output tokens on reasoning; finish length; content null).
Expected effect: 42517 replayed seats sonnet as reserve, makes one substitution and does not fail closed for want of a reserve; its failure line reads "finish_reason length; output tokens 65,536 (reasoning 65,533); prompt tokens 75,848; no text".

### Why the reserve was null (from execution 42517, Init Seats output)
- judge_order v6: panel [gemini, qwen4max, hydrogen]; alternate [sol, sol62, spark, chatgpt, argon, sonnet, neon].
- Dropped: sol and chatgpt (family openai debates), sol62 and spark (debaters).
- jfl_moved: [chatgpt, grok, luna, argon, sol]. So pfree = [gemini, qwen4max, hydrogen, argon, sonnet, neon]; pfree[3] = argon, JFL-moved.
- Init Seats line 42: `panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0&&!JFL_MOVED.has(pfree[3]))?pfree[3]:null;` gives null.
- alt_order was [argon, sonnet, neon].
- My Wall 11919 said "Reserve was null" without the cause. The cause is the JFL rule, not an empty pool.

### The rule it meets (engine manual part 10.0, quoted)
- "At ALTERNATE, Init Seats moves the seat to the end of the panel order, so it takes no panel place and is not the reserve while three unmoved seats remain; it stays in the alternate pool."
- "The reserve is the next seat unless it is JFL-moved or time-removed, in which case there is no reserve."
The first sentence (a JFL-moved seat is not the reserve) is kept. The second sentence's last clause ("in which case there is no reserve") is what changes: the reserve becomes the next seat that is neither JFL-moved nor time-removed. No operator ruling for "no reserve" was found (md_notes_rulings searched for reserve, JFL, judge fault, judge order, 591: rows 294, 407, 517, 518, 520, 521, 527, 531, 532, 541; none sets it). This is a change to the engine and to a manual sentence, so it needs Eric's card.

## 2. ROLES
W4 plans and builds; W1 grades (one non-builder seat); W3 drafts the manual entry (part 10.0) and the AAR rows; Eric approves on W4's card.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change:
- A: Init Seats line 42 only.
  `panel_reserve = pfree.slice(3).find(s => JUDGE_TIME_REMOVED.indexOf(s) < 0 && !JFL_MOVED.has(s)) || null` /* ASK 629 */.
- B: Panel Check envelope() only. When choices[0] exists and message.content is not a string, it throws "FAIL-CLOSED: seat "<seat>" returned no text: finish_reason <f>; output tokens <n> (reasoning <r>); prompt tokens <p>. NO ROW IS WRITTEN." in place of the "envelope this parser does not recognise" text. Any field that is absent prints "not given". Every other envelope stays as it is.
Not changed:
- ALT_ORDER. It already starts at pfree[3], so today the reserve also heads alt_order when pfree[3] is the reserve. The plan keeps that. Removing the reserve from alt_order (my Wall 11919 wording) is dropped: it would change runs where pfree[3] is the reserve, which a4 requires byte-equal.
- Resolve Seats line 22. The reserve still passes the family and same-model checks there; on 42517 sonnet (anthropic) passes against sol62 (openai) and spark (meta).
- The judge order table, its version, the panel, model_config, max_tokens and all reasoning settings.
SEARCH: every reader of panel_reserve and alt_order in the live engine; Resolve Seats reserve0/reserve; Panel Check RES and the substitution branch; Reserve Build; the agreement (posture) seat list.
NOT SEARCHED: dashboard pages (they do not read panel_reserve; to be confirmed at build by grep of the dashboard repo files).

## 4. CRITERIA AND DONE
- a1, the alternate stage with one fewer free alternate.
  - With sonnet as reserve, alt_order stays [argon, sonnet, neon], as live keeps the reserve in alt_order.
  - The build shows, by reading Reserve Build and the alternate stage, how a seat already used as the reserve is treated when it is reached in alt_order. That is the same path live takes today whenever pfree[3] is the reserve.
  - The count of seats is not changed. The build reads and quotes where the 3 of 4 majority is counted (not yet read; no claim made here) and states it on the 42517 replay.
- a2, the ASK 591 and v6 order rulings, quoted. Ruling 517 (ASK 591): "if the order cannot be read the run stops before any model call and does not fall back." Ruling 520: a regrade draws from the current order.
  - The change reads the same order and draws from the same pfree. It does not reorder, add or drop a seat.
  - No breach: the order still governs. The reserve is the first seat after the panel in that order that the JFL and time rules allow.
- a3, the Panel Check substitution line, quoted (Panel Check line 45): `if(fails.length===1&&allowed&&RES){const f=fails[0]; ... sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,...}}`.
  - Line 47 throws "[no reserve seat is free]" when RES is null. Both stay as they are.
- a4, replay on 42517.
  - Init Seats, with its 42517 inputs (Judge Order Read, Accept Final, Accept Models) taken node-filtered from execution 42517, gives panel_reserve sonnet.
  - Resolve Seats keeps sonnet.
  - Panel Check, with the 42517 judge replies, returns one substitution (slot 3, hydrogen to sonnet) and does not throw.
  - Byte-equal on runs where pfree[3] exists and is not JFL-moved or time-removed: the stored Init Seats outputs of at least five recent executions, old against new, panel_reserve identical.
- B: the 42517 hydrogen reply gives the line above.
  - Every other envelope fixture (string content; Gemini candidates; error objects) gives the same output as live.
- Standing set (ASK 596) passes. The coding standard (ASK 599) is met: every changed line is tagged `/* ASK 629 */`, there is no dead code, and no catch is added.
DONE: W1 PASS on the build; Eric presses the write card; written, fetched back and read back by W1; two clean live runs.

## 5. WRONG-IF
- A run where pfree[3] is eligible seats a different reserve than live.
- A JFL-moved or time-removed seat becomes the reserve.
- The reserve is a seat that is a debater, of a debater's family, of a debater's model, or did not accept the posture (Resolve Seats and free already bar these; the test shows it on 42517 and on a constructed case).
- Any change to the panel, alt_order, the judge order or a model setting.
- B changes the outcome of any reply (it changes text only).

## 6. RUN EVIDENCE
Case: run 42517 (execution 42517), replayed offline from node-filtered execution data. Mark: panel_reserve sonnet; one substitution; failure line as in OBJECTIVE.
Live mark: the first live run where pfree[3] is JFL-moved shows a non-null reserve in Init Seats. It cannot be forced, so the two clean live runs prove only no regression, unless such a pairing occurs.

## 7. INPUTS IN GIT
Base engine (ask626/w4/b1/base_eng.json, live 2df7f6fa; refetched at build). Execution 42517 Init Seats output (quoted above). Build files to be ask629/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. Card to Eric: "Build ASK 629 (reserve fallback and failure line), live?" (W4's card).
3. Build and offline tests (no card); W1 grades the build.
4. Card to Eric: "Write ASK 629 to the live engine?" (W4's card). Then the write, fetch back, audit_log, Wall, W1 readback.
5. Card to Eric for the part 10.0 manual sentence (W3's card).
6. Two clean live runs.

## QUESTIONS FOR ERIC (not in this plan; reasoning is his)
- Q1: cap hydrogen's reasoning so it leaves room for the verdict.
- Q2: move hydrogen out of the panel order.
Ruling 541 (14:48 CST 11-24) set hydrogen at its present row with "no reasoning setting". On 11-12 it spent 58,777 of 64,000 tokens on reasoning, and on 42517 65,533 of 65,536.

## OTHER 42517 FINDINGS (not in this plan's scope; for the coordinator to number)
- F-a (W3): row fd0edbff has quarantine_reason null and no failure line in review_notes, though the error says "with the failure noted". Panel Failure Note writes failed_msg to the execution only.
- F-b (W3): four Close Enforcer calls (z-ai/glm-5.3, $0.33) are billed in call_costs with 0 debate_enforcer_log rows. The two good panel judgments (gemini and qwen4max, $0.44) are not stored.
- F-c (W1 Wall 11923, W3 Wall 11924): five call_costs rows with negative input tokens, all gemini-3.8-flash. Dollars are right. Possible ASK 627 defect.
- F-d (W3): the DR1 pkgBAR re-call sent back 0 sentences, as in 42373.
