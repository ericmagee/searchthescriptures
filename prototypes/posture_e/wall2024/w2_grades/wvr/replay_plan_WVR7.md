# Paid replay plan for pkgWVR rev 7 (W2 draft for W4)

Package: parent_s160_WVR7.json, sha 3b1535e0569a18f0 (W1, Wall 5367), on live s160. Replaces the rev 2, 3 and 6 plans. The operator ruled 35379 a contradiction (ASK 116, Wall 5360) and 33846 Ezra 2:61 a contradiction (ASK 117, Wall 5365). Nothing but the operator's word blocks the ask.

## Method
- For each run, build the rev 7 Close Enforcer Build request from the stored rounds in debate_results (cr1 claude_r1, cr2 claude_r2, cr3 engine_r3, cr4 defender_r4, gr1 engine_r1, gr2 engine_r2, dr3 challenger_r3, dr4 challenger_r4).
- Send the DEFENDER call only. The challenger call is byte-equal to live in all four runs (+0).
- deepseek-flash, temperature 0, two sends per request, as in ASK 112.
- Sizes: w2_grades/wvr/replay_plan_sizes_rev7.cjs (MEASURED, against live s160, system plus user prompt characters).

## Calls
| Run | Defender prompt chars | +chars vs live | pkgWVR candidates in the call |
|---|---|---|---|
| 32924 | 59,948 | +1,248 | X1 LINK 4 Galatians 4:4 |
| 33083 | 67,978 | +904 | X1 LINK 5 Galatians 4:4 |
| 33846 | 69,932 | +4,377 | X5 LINK 2 1 John 5:1; X6 LINK 3 1 Chronicles 28:6; X7 LINK 4 Ezra 2:61 |
| 35379 | 71,436 | +1,741 | X7 LINK 6 Galatians 4:4 |

- 4 requests x 2 sends = 8 DeepSeek calls; 269,294 prompt characters per send round.
- Cost ESTIMATE: under 0.08 USD (ASK 112 measured 0.058 USD for 6 calls of about 135,000 characters each; these are about half that size).
- Baseline: 2 no-package sends of the 33846 request (no stored close-enforcer reply exists for it), ESTIMATE under 0.02 USD.

## What each case must show
1. 33846 X5, 1 John 5:1: CONFIRMED (the single judge confirmed this pair in that run).
2. 33846 X6, 1 Chronicles 28:6: CONFIRMED.
3. 35379 X7, Galatians 4:4: CONFIRMED (operator ruling, ASK 116). 33846 X7, Ezra 2:61: CONFIRMED (operator ruling, ASK 117).
4. 32924 X1 and 33083 X1, Galatians 4:4: CONFIRMED (W2 hand reading, Wall 5350, the same kind as 35379 X7, which the operator ruled a contradiction).
5. Every other candidate (33846 X1 to X4, 35379 X1 to X6): the same verdict as without the package (35379 against its stored reply; 33846 against the baseline sends).
6. No NEW item that a hand reading does not support.

## Changes from earlier plans
- Rev 7 sizes and candidates are the same as rev 3 and rev 6 (MEASURED on the full stored rounds).
- 35379 X7, 32924 X1 and 33083 X1 now have a fixed expected verdict: CONFIRMED.
- 33083 Luke 1:27 is no longer named, so it is no longer in the call and cannot serve as the control. Its false-break risk is closed offline (fixed plant set). The controls are the rev 2 request below and item 5.
- 33083 prompt: 67,978 (+904), down from 68,895 (+1,821).
- Control (W1 proposal, Wall 5347, accepted): one extra request built from rev 2 for the 33083 defender call (68,895 characters, carries X2 Luke 1:27), two sends. X2 must be NOT A CONTRADICTION on both. It shows how the enforcer treats a false name. Added cost ESTIMATE about 0.02 USD. Total: 12 calls, ESTIMATE under 0.12 USD.
