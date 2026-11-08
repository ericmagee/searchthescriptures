# pkgEPC (W1, 11-08): DeepSeek enforcer calls sent together, not one by one

Why (33506, W4): Judge Enforcer Call deepseek took 1013 s (17 min) of a 76-min run. The node sends its calls ONE AT A TIME:
options.batching.batch.batchSize = 1 on all four enforcer call nodes (present since at least s10; no recorded reason).
33506 Main had 5 calls (completion tokens 29.0k, 22.8k, 57.5k, 50.9k, 33.5k; 81-98% reasoning; all finish "stop").
Sent together, the node waits only for the slowest call. Estimate by token share: the slowest is ~300 s, so Main ~1013 s -> ~300 s (about 12 min saved).
Alt had 4 calls in 264 s -> ~117 s. Estimate only; measured on the first live run.

Change (n8n only, 4 HTTP nodes, base live s53): batchSize 1 -> 10 (MAX_CALLS is 10, so one batch). batchInterval 0, timeout 900000, retry settings,
body, credential: unchanged. Plan with param hashes: plan_EPC.json.
- Judge Enforcer Call deepseek, Alt Judge Enforcer Call deepseek, Judge Enforcer Retry Call deepseek, Alt Judge Enforcer Retry Call deepseek.

Safety:
- Item order: HttpRequestV3 runs the items of one batch with Promise.allSettled and returns them in item order (read in the n8n 2.15.1 source, Wall 2949;
  W4's PPJ check 2962 saw 3 concurrent calls return in order). The Records read the replies by item index, so nothing downstream changes.
- Token cost per call is unchanged (same bodies). Only wall time changes.
- Risk: DeepSeek throttling with up to 10 concurrent calls. The pkgESR retry path (split and resend once) already catches an errored call.
Revert: batchSize back to 1 on the 4 nodes.
