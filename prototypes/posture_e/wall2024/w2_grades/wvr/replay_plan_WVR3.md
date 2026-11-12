# Paid replay plan for pkgWVR rev 3 (W2 draft for W4)

Package: parent_s158_WVR3.json, sha 305dda8d6793ad1f (W1, Wall 5345). Replaces the rev 2 plan. Ask only after the operator rules 35379 Galatians 4:4 and the 33846 Ezra 2:61 pair.

## Method
- For each run, build the rev 3 Close Enforcer Build request from the stored rounds in debate_results (cr1 claude_r1, cr2 claude_r2, cr3 engine_r3, cr4 defender_r4, gr1 engine_r1, gr2 engine_r2, dr3 challenger_r3, dr4 challenger_r4).
- Send the DEFENDER call only. The challenger call is byte-equal to live in all four runs (+0).
- deepseek-flash, temperature 0, two sends per request, as in ASK 112.
- Sizes: w2_grades/wvr/replay_plan_sizes_rev3.cjs (MEASURED, system plus user prompt characters).

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
3. 33846 X7, Ezra 2:61, and 35379 X7, Galatians 4:4: match the operator's ruling.
4. 32924 X1 and 33083 X1, Galatians 4:4: W2 hand reading (Wall, 11:00 CST): both CONFIRMED, the same kind as 35379 X7. If the operator rules 35379 X7 not a contradiction, these two follow that ruling.
5. Every other candidate (33846 X1 to X4, 35379 X1 to X6): the same verdict as without the package (35379 against its stored reply; 33846 against the baseline sends).
6. No NEW item that a hand reading does not support.

## Change from the rev 2 plan
- 33083 Luke 1:27 is no longer named, so it is no longer in the call and cannot serve as the control. Its false-break risk is closed offline (W2 rev 3 grade). The control is now item 5: candidates the package does not touch must not change.
- 33083 prompt: 67,978 (+904), down from 68,895 (+1,821).
- Control (W1 proposal, Wall 5347, accepted): one extra request built from rev 2 for the 33083 defender call (68,895 characters, carries X2 Luke 1:27), two sends. X2 must be NOT A CONTRADICTION on both. It shows how the enforcer treats a false name. Added cost ESTIMATE about 0.02 USD. Total: 12 calls, ESTIMATE under 0.12 USD.
