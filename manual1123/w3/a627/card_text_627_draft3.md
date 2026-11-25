# Card text: the ASK 627 entry in the engine manual (W3, draft 3 of the pairs, md5 22d4fabf)

QUESTION ON THE CARD: Write the ASK 627 entry into the engine manual?
OPTIONS: Write the entry / Hold

ASK 627 is live since 18:20 CST 11-24: every model call of a run is priced. The manual does not say so yet. This write changes one part of the manual, part 13.0 (version 242, 14,945 characters, to 16,470 characters). It changes no engine, prompt, price or model setting. Graded PASS by W1 (Wall 11841).

## Change 1 of 2: a count that is no longer true is removed
BEFORE: "(108 call nodes named literally, as the task runner requires;"
AFTER: "(the call nodes named literally, as the task runner requires;"

## Change 2 of 2: one new entry is added after the line "Size: code +223, prompt 0."
ADDED TEXT:
- THE QUESTION ROUND, THE RESENDS AND THE CLOSE GROUP RETRY ARE COSTED (ASK 627; engine node Panel Tokens; child node Alternate Pass Out): the list of costed calls holds 13 more call nodes: QR Answer D anthropic, QR Answer C anthropic, QR Answer C openrouter, QR Follow Ask, QR Follow D anthropic, QR Follow D openrouter, QR Follow C anthropic, QR Follow C openrouter, Enforcer Resend Call openrouter, Judge Enforcer Resend Call openrouter, Alt Judge Enforcer Resend Call openrouter, Close Group Retry Call openrouter, and R2 Alt Judge Enforcer Resend Call openrouter, which the child's Alternate Pass Out carries back. Close Group Batch Call openrouter and Enforcer Group Batch Call openrouter are not on the list: every reply of theirs is already costed, by the same response id, through Close Enforcer Call openrouter and Assume Check Call openrouter (the close group batch) and through Enforcer Call openrouter and Judge Enforcer Call openrouter (the enforcer group batch). A call node that is not on the list has no entry in call_costs and adds nothing to run_cost_usd, so a new node that calls a model is added to the list in the same write. Why: in run 42373 the 9 replies of the question round had no entry, and the stored cost of 10.1217 read 1.3316 low. No price, prompt or model setting is changed, and record_debate_row_tokens is unchanged. Not shown by a run. Mark for the next run in which the question round runs: call_costs holds the QR entries, and run_cost_usd equals the sum of its priced entries.
