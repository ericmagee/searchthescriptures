# E5 plan rev 0: spark (meta/muse-spark-1.3) prompt cache (W1, 11-19)

## Objective
Cut the defender's cost when spark debates. In run 440, spark cost 0.6475 USD, 37% of the run.

## Evidence (read-only, 11-19)
1. Spark cache hits per run, from debate_results.call_costs (cr = cache read tokens):
   - Run 440 (ODV1-40781): 1 hit in 6 calls, 0.6475 USD.
   - Run ODV1-39266 (11-18 21:37): 5 hits in 6 calls, 0.3389 USD.
   - Runs ODV1-39015 and ODV1-38661: 1 hit each, 0.674 and 0.658 USD.
   - Older challenger-side runs: 0 to 1 hits, apart from ODV1-37510 (4 hits, 0.380 USD).
   - The engine code is the same in high-hit and low-hit runs, so the hit rate varies per run.
2. Run 440 execution (n8n 40781) shows OpenRouter routed every spark call to provider "Meta". The misses are therefore not caused by provider switching.
3. Prompt prefixes in run 440, diffed from the D* Route bodies:
   - Every call starts with the same 193,334-char system message, about 53.6k tokens. This matches the 53,617-token hits in run 39266.
   - D2 and D2B each extend the call before them in full. So does D4B over D4.
   - Even so, D2B (started about 2 s after D2 returned), D3, D4 and D4B read 0 from the cache.
   - So the prompt order is NOT the cause, and the gap between calls is NOT the cause (D2B missed 2 s after D2).
4. Cause, as far as the evidence goes: Meta's automatic (implicit) cache hits only sometimes. The wrapper sends no cache_control for meta/, because its regex is /^(?:google|qwen|openai|anthropic)\//.

## Proposal (one change, after one test)
- T0 test, before any build: one direct OpenRouter call to meta/muse-spark-1.3 with the run 440 D1 body, sending cache_control on the system message. Then make a second identical call, and read usage.prompt_tokens_details.cached_tokens on both.
  - Cost: about 0.2 USD.
  - Needs the operator's approval as a live-model call.
  - Pass: the second call reads 50k tokens or more from the cache.
- Build, only if T0 passes:
  1. Add meta to the regex in every wrapper copy (engine 38, child 4, Cure Call 1).
  2. For meta/, mark the SYSTEM message (the shared 53.6k-token prefix) instead of the longest user message.
  - No change to any wording, model setting or reasoning setting.
- If T0 fails, there is no build. Spark's cost then depends on the provider's own cache, and the team records E5 as closed with no lever.

## Saving
Measured, not guessed: run 39266 (5 hits) cost 0.309 USD less than run 440 (1 hit) for the same seat. If T0 passes, the saving is up to about 0.31 USD per spark run.

## WRONG-IF
1. T0's second call reads 0 from the cache (cache_control is ignored for meta).
2. OpenRouter rejects or reroutes the body that carries content parts for meta.

## Revert
Restore the prior regex in the same nodes, using the pre-build version tokens.

## Open
I cannot read OpenRouter's docs on meta caching, because the proxy blocks openrouter.ai. T0 is the check.
