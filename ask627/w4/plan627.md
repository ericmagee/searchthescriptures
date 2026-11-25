# ASK 627 PLAN rev 0 (W4): every model call of a run is priced in call_costs, so run_cost_usd is the whole cost

Source: AAR 42373 DEFECT 7 (W3), W4 Wall 11786. Feeds ASK 625 (cost in every AAR, the operator's ask).

## OBJECTIVE
run_cost_usd and call_costs hold every model call the run made. Today the list of calls that Panel Tokens gathers (__CL) leaves out 15 call steps (13 surely uncounted, 2 batch calls in question), so the stored cost is too low; run 42373 stored $10.12 without its question-round answers.

## ROLES
Plan and build W4; grade W1; write on W4's own card; manual entry and AAR row W3.

## SCOPE, with SEARCH (live engine 6b2cc236, child 04704b68; DB function record_debate_row_tokens; stored call_costs of 42373)
How cost is made today: Panel Tokens builds one entry per call from the reply's usage (__CU: openrouter keeps its billed figure "b"; anthropic, deepseek and gemini give tokens). Write Tokens sends them to record_debate_row_tokens, which prices each entry ("billed", "price list" from model_prices, or "no price" = NULL, never 0) and sets run_cost_usd to the sum. Replies with the same id are counted once (__SN).
Search: every HTTP node whose URL is a model API (72 in the engine, 8 in the child), against __CL (87 entries).
### Found missing: changes
1. Engine Panel Tokens __CL gains 13 entries, and 2 more if C3 says so:
   - question round, answers and follow-up: QR Answer D anthropic, QR Answer C anthropic, QR Answer C openrouter, QR Follow Ask, QR Follow D anthropic, QR Follow D openrouter, QR Follow C anthropic, QR Follow C openrouter;
   - resends and retries whose replies go straight to a Record or Resume step: Enforcer Resend Call openrouter, Judge Enforcer Resend Call openrouter, Alt Judge Enforcer Resend Call openrouter, Close Group Retry Call openrouter;
   - the second alternate pass: R2 Alt Judge Enforcer Resend Call openrouter (through __A379, as the other nine R2 calls).
   - the two batch calls, Close Group Batch Call openrouter and Enforcer Group Batch Call openrouter: see C3; added only if C3 shows their replies are not already counted through the Close Enforcer, Anticheat, Assume Check and Enforcer Call steps (which are in __CL and were billed in 42373).
2. Child Alternate Pass Out: its list of calls carried back (__a379) gains R2 Alt Judge Enforcer Resend Call openrouter, so the engine can price it.
### Searched and found: no change
- Panel judges: priced through Panel Judge 1 to 3 openrouter (billed in 42373). The debaters' 16 round calls: priced (anthropic, price list). QR Ask and QR Retry Ask: priced.
- record_debate_row_tokens: no change; it prices any entry it is given.
### NOT IN SCOPE
Prices in model_prices; the AAR's cost line (ASK 625); any prompt, reasoning or model setting.

## CRITERIA AND DONE
C1 Search repeated on the build base: every model-API HTTP node of engine and child is in __CL (or carried through __A379), except the two batch calls if C3 shows they are counted downstream. The test fails on any node left out without a reason.
C2 Offline, Panel Tokens run with stubbed replies for each added node in each reply shape (anthropic, openrouter with cost, openrouter BYOK): one entry each, with the right family and fields; a node that did not run adds nothing; the same reply id twice is counted once.
C3 The batch question, from data, not guessed: the reply shapes of Close Group Batch Call and Close Enforcer Call (and the Enforcer pair) are compared, ids included. HOW: a node-filtered read of run 42373 (Close Group Batch Call, Close Enforcer Call, Enforcer Group Batch Call, Enforcer Call; then the QR Answer and Resend nodes that ran), which needs the operator's allowance, one group at a time with no run going. If not allowed, the batch calls stay out and the card says their count is unproven.
C4 With the 42373 replies read in C3, the cost the new list gives against the stored $10.12: the difference is named, call by call.
C5 Only Panel Tokens (engine) and Alternate Pass Out (child) change; standing set 31/0 with S4 compile-all; pair Library Check passes; ASK 599 standard (tags, no dead code).

## WRONG-IF
- A batch reply is counted twice (once in the batch node, once in its split step) because the ids differ: C3 exists to prevent this.
- A model in an added call has no row in model_prices: it shows as "no price" (NULL), and run_cost_usd stays low by that call. The build lists any such model.

## RUN EVIDENCE
The first live run in which the question round runs: call_costs holds the QR Answer entries; run_cost_usd equals the sum of the entries. Two live runs.

## STEPS
1. W1 grades this plan. 2. Card to the operator for the C3 read (allowance), with the plan. 3. Build on a fresh fetch; W1 grades the build. 4. Write card. 5. Fetch-back, audit, Wall, W1 readback; W3 manual entry and AAR row.
