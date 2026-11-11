# pkgRCS rev 2, RUN COST (W1; LIVE in s140, version 5062d21e, 13:37 CST 11-11, with its schema change and price fill; graded PASS by W2 and W4)

Purpose: the operator's words of 13:21 CST 11-11: "i would like to move forward with tracking and recording the cost. the cost can go at the end of the debate transcript."

Flow change (3 nodes, no new node, connections equal):
- Panel Tokens lists every model call of the run (108 call nodes named literally, as the task runner requires; each item once, by response id). Per call: node, item number, model, family, uncached input, cache read, cache write (5-minute and 1-hour), output, and for OpenRouter the billed USD. Billed USD is usage.cost plus, when the call is on the lab's own provider key (is_byok), cost_details.upstream_inference_cost.
- Write Tokens sends the list as p_calls to record_debate_row_tokens.
- Plain Rule Lines prints "Cost of this run" as the last section of the transcript, read back from Get Row: the total, its billed and estimated parts, and one row per model. The per-call list is stored in the database only.
- The Panel Tokens list loop is inside try; a fault there leaves the old fields as they were.

Database change (one transaction, before the flow write; file w1/schema_RCS.sql):
- debate_results gains call_costs jsonb and run_cost_usd numeric.
- New table model_prices (per million tokens: input, cache read, cache write 5-minute and 1-hour, output; peak multiplier and peak hours; source page; date read), row-level security on with no policies.
- Fill (written with the schema): claude-opus-5-5, claude-sonnet-5-5 (platform.claude.com pricing page) and deepseek-flash (api-docs.deepseek.com pricing page, off-peak rates, 2x in peak hours 01-04 and 06-10 UTC Monday to Friday), read 11-11.
- Revert: w4/rcs/revert_schema_RCS.sql (W4) restores the live five-argument function and grants.
- record_debate_row_tokens gains p_calls jsonb DEFAULT NULL. It prices each call: billed if OpenRouter gave a figure; otherwise from model_prices ("price list", an estimate); a model with no row gets no price (NULL, never 0). It stores call_costs and run_cost_usd (sum of priced calls). The old grants are restored exactly. The old five-argument call still works.

Sizes (measured, rev 2): code +6,374 (Panel Tokens +4,849, Plain Rule Lines +1,525); Write Tokens body +47; model prompts +0; nodes +0. Transcript +877 to +1,026 characters on the 7 stored runs. Data the task runner sends to Panel Tokens grows by the outputs of the call nodes (2,412,847 bytes on 35067); Plain Rule Lines receives the Get Row row (281,961 bytes on 35067).

Limits:
- No price is held in the code. A model with no row in model_prices shows "no price" and is left out of the total; the transcript gives the count. Prices change: a seat must update the rows when a provider changes its page.
- DeepSeek peak pricing ignores Chinese public holidays (a call then is priced at peak, the higher figure). A DeepSeek call with no time is priced at peak.
- Estimates follow list prices; no invoice is read. Anthropic 5-minute and 1-hour cache writes are priced apart; OpenRouter calls are billed as returned.
- A call node run more than once in one execution is read on its last run only (none in the 11 stored runs).
- The four existing token totals (input, output, cache write, cache read) are unchanged and undercount: they leave out the resend rounds, Accept, every DeepSeek call, Send Back, Gate, QR and the single judge's re-ask.
- A run that stops before Panel Tokens (failure salvage, dry, regrade) stores no cost; its transcript says "No cost record is stored for this run."
