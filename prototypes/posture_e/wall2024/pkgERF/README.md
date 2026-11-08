# pkgERF (W1, 11-08): DeepSeek enforcer calls fail into the split retry, not into a hidden whole-node re-send

Fault (33506, W4 Wall 3042): Judge Enforcer Call deepseek took 1013 s. Its one stored attempt has all 5 replies created at +666 s (other runs: +0 or +1 s,
table below). That fits a first attempt failing after ~656 s, the node's retryOnFail wait of 10 s, then all 5 calls sent again (~347 s).
n8n keeps only the last attempt, so the first error is lost, and the first attempt's tokens are paid for nothing.

Evidence table (saved inputs, lag = reply created minus node start, s):
33040 J 0 / 33060 J 0 (2 per-item errors "Response body timed out after 300000ms" kept as items, no re-send) / 33411-33497 J and Alt 0 / 33506 Alt 0-1 / 33506 J 667.

Change (n8n settings only, base live s53): Judge Enforcer Call deepseek and Alt Judge Enforcer Call deepseek: retryOnFail true -> false (maxTries 3 and
waitBetweenTries 10000 dropped). onError stays continueRegularOutput, so a failure becomes an output item. pkgESR's Retry Build then splits each failed
call in two and re-sends those halves once; the failure text is kept in enf428.esr.why (the Record stores it), so the next failure is diagnosable.
Parameters, bodies, credential: unchanged (params sha 48228dad44d7 both). The two Retry Call nodes keep their own retry (the last chance). Plan: plan_ERF.json.

What it does not do: it does not shorten the time until a hung call fails (the 300 s no-data timeout / 900 s timeout stay). It removes the blind full
re-send, keeps the error, and re-sends smaller halves.

Test `node pkgERF/test_ERF.cjs` (test_ERF.txt): 10 OK, 0 FAIL, live s53 code on saved 33506/33497 inputs.
- no failure: marker only (today's path).
- node-level failure (one error item): every call split, 33506 J 10 halves for 5 calls, 252/252 ids once; Alt 8 halves, 87/87; 33497 14 halves, 271/271.
- one call fails (per-item, as 33060): only its 2 halves.
- Record after a node-level failure with halves answered by their calls' original replies: 252 rows, verdict fields equal the no-failure Record; enf428 calls 5 -> 10.
Revert: retryOnFail true, maxTries 3, waitBetweenTries 10000 on the two nodes.
