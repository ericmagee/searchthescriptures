# Item A study (W1, offline, NOT BUILT): the closing enforcer called once per side instead of once for both sides

Cause on record (W3 dry regrade of 34299, finding 1): one prompt holds both sides (about 151,000 characters); DeepSeek's reasoning
examined only the challenger's closing round ([DR4] named 133 times, [CR4] 14 times, each as the label of a grant the challenger quotes) and
replied NONE. The defender's closing round was never read against the defender's earlier rounds, so the D6 drop in [CR3] reclaimed in [CR4]
was missed although both sentences were in the prompt and the instruction already names a dropped-then-reasserted sentence a contradiction.

Proposal: Close Enforcer Build sends two calls, one holding the defender's four rounds and its candidates, one holding the challenger's.
No hint list and no new rule text (pkgCDR's added text is not used). The per-side instruction (prompt_side.txt) REPLACES the live one.

Measured on 35 stored debates (size_split.txt; characters, tokens estimated at 4 characters per token):
- largest single call: mean 143,384 (live, one call) to 77,404 (split): 46.0% smaller. This is the body n8n holds in memory per call.
- total sent per debate with the live instruction sent twice: +2,032 characters (+1.4%).
- with the shorter per-side instruction (1,297 characters instead of 1,725, prompt_side.txt): +1,176 characters (+0.8%), about 294 tokens.
  Reaching zero total growth would need a per-side instruction of about 700 characters; not proposed (rules would be lost).
- Node code: Build emits two items in place of one (about net zero); Record reads every returned item instead of the first (small growth,
  estimated under 150 characters). The Call node already runs once per item. Not measured, because not built.
Unmeasured cost: DeepSeek reasoning output. Two calls may reason about twice as long as one; only a replay through the approved relay shows it.
Wording note: prompt_side.txt drops the "differs only in wording" exception and says a reclaimed drop is a contradiction "however worded". That is
a rule change for the operator to rule on; keeping the live wording rule the instruction is 1,309 characters and total growth +1,200 characters (+0.8%).
