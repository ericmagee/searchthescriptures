# pkgRCS, RUN COST (W1; built on s139; NOT written)

Purpose: the operator's words of 13:21 CST 11-11: "i would like to move forward with tracking and recording the cost. the cost can go at the end of the debate transcript."

Flow change (3 nodes, no new node, connections equal):
- Panel Tokens lists every model call of the run (108 call nodes named literally, as the task runner requires; each item once, by response id). Per call: node, item number, model, family, uncached input, cache read, cache write (5-minute and 1-hour), output, and for OpenRouter the billed USD. Billed USD is usage.cost plus, when the call is on the lab's own provider key (is_byok), cost_details.upstream_inference_cost.
- Write Tokens sends the list as p_calls to record_debate_row_tokens.
- Plain Rule Lines prints "Cost of this run" as the last section of the transcript, read back from Get Row.

Database change (one transaction, before the flow write; file w1/schema_RCS.sql):
- debate_results gains call_costs jsonb and run_cost_usd numeric.
- New table model_prices (per million tokens: input, cache read, cache write 5-minute and 1-hour, output; source page; date read).
- record_debate_row_tokens gains p_calls jsonb DEFAULT NULL. It prices each call: billed if OpenRouter gave a figure; otherwise from model_prices ("price list", an estimate); a model with no row gets no price (NULL, never 0). It stores call_costs and run_cost_usd (sum of priced calls). The old grants are restored exactly. The old five-argument call still works.

Sizes (measured): code +5,885 (Panel Tokens +4,809, Plain Rule Lines +1,076); Write Tokens body +47; model prompts +0. Transcript +3,963 to +5,520 characters on the 7 stored runs. Data the task runner sends to Panel Tokens grows by the outputs of the call nodes (2,412,847 bytes on 35067); Plain Rule Lines receives the Get Row row (281,961 bytes on 35067).

Limits:
- No price is held in the code. Until model_prices has a row for a model, its calls show "no price" and are left out of the total. Today that includes DeepSeek (deepseek-flash) and the Anthropic debaters.
- Estimates follow list prices; no invoice is read. Anthropic 5-minute and 1-hour cache writes are priced apart; OpenRouter calls are billed as returned.
- A call node run more than once in one execution is read on its last run only (none in the 11 stored runs).
- The four existing token totals (input, output, cache write, cache read) are unchanged and undercount: they leave out the resend rounds, Accept, every DeepSeek call, Send Back, Gate, QR and the single judge's re-ask.
- A run that stops before Panel Tokens (failure salvage, dry, regrade) stores no cost; its transcript says "No cost record is stored for this run."
