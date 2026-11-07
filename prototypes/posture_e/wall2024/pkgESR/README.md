# pkgESR (rulings item 9; Eric 11:06 CST 11-07 approved): DeepSeek enforcer calls sized by cost, and a failed call split and retried

Why: the cost of an enforcer call is DeepSeek's reasoning tokens, not the reply. 50 saved calls (33218-33389) ran 2K-64K completion tokens against
max_tokens 64000. 33299 Alt call 1 stopped on finish_reason "length" (47 NO VERDICT); 33222 Main call 2 timed out at 300 s (89 NO VERDICT).
A fit of tokens on item counts by rule has rmse 9605, so item counts only roughly predict cost: sizing lowers the risk, the retry catches the rest.

1. Judge Enforcer Build and Alt: a call also closes when its estimated cost (fitted weights per rule) would pass 40000 tokens; MAX_CALLS 8 -> 10.
2. New nodes per side: Judge Enforcer Retry Build (code) -> Judge Enforcer Retry Needed? (IF esr_retry) -> Judge Enforcer Retry Call deepseek (HTTP,
   a copy of the Call node's settings and credential). A call with no reply, an error, empty content or finish_reason "length" is split into two halves
   of whole items and sent once more. No failure: one marker item, false branch to the Record.
3. Judge Enforcer Record and Alt: the original replies are read from the Call node; each failed call's halves and their replies take its place.
   enf428.esr = {retried, halves, why}. A half that fails again stays NO VERDICT.

Wiring for W4: patched.wiring.json (6 nodes to add; connections to set: Call -> Retry Build -> Retry Needed? -> [true] Retry Call -> Record,
[false] -> Record). Judge Enforcer Needed? keeps its false branch to the Record.
Base: pkgEAI/patched_on_pkgEID. Test: node pkgESR/test_ESR.cjs -> 56 OK, 0 FAIL.
- Every id kept once in every saved run, no item unchecked, calls 65 -> 66.
- No-retry path: Record rows equal to base in every run.
- Retry Build: halves only for 33222 Main call 2 and 33299 Alt call 1, text intact, every id once; marker item elsewhere.
- Retry path with synthetic replies: 33299 Alt NO VERDICT 47 -> 0, 33222 Main 89 -> 5 (the 5 left are rows outside the failed call), other rows unchanged; a half failing again stays NO VERDICT.
