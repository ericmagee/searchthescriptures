# pkgERT (W2, 11-07): node retry on the main DeepSeek enforcer calls (lane 1; W3's spec in grade_33482 and Wall 2978)

**Fault (33482):** "Enforcer Call deepseek" (the K-W / K-S3 DeepSeek check, one item) returned `{"error":"aborted"}` after 61 s. Earlier runs on this call took 86 to 236 s and all replied. The node has no retry, so all 67 checks were NO VERDICT.

**Fix (node settings only; base live s50):** `retryOnFail: true, maxTries: 3, waitBetweenTries: 10000` on **Enforcer Call deepseek** and **Anticheat Call deepseek**. These are the same settings as Judge Enforcer Call deepseek. onError (continueRegularOutput), the parameters and the credentials are unchanged, and no code changes. `patched.nodes.json` holds both whole node objects as they should be written.
- Enforcer Call deepseek: dde29686580e -> dead16102737 (sha of the node JSON).
- Anticheat Call deepseek: bcc72051d90b -> 4986f57781f3.

**Why the retry fires even with onError continueRegularOutput:** see `n8n_2.15.1_workflow-execute_excerpt.ts`. After runNode, the engine sets `nodeFailed = runNodeData.data[0][0].json.error !== undefined`. While that is true and tries remain, it re-runs the node after `waitBetweenTries`. The HTTP node returns a failed request as an `{error}` item.

**Limit:** the engine looks only at item 0.
- Enforcer Call sends 1 item in every saved run, so it is fully covered.
- Anticheat Call sends 4 to 5 items. An error on item 0 re-sends all of them, and an error on a later item alone is not retried. A content-level retry (ESR style) would cover the later items if this is ever seen.

**Test:** `node pkgERT/test_ERT.cjs` gives 8 OK.
- Only the three keys change on each node, and they equal the Judge Enforcer Call settings.
- The id, type, parameters and credentials are unchanged.
- The engine rule is read from the tagged n8n source.
- 33482's output is one item with `json.error` "aborted", so the rule would fire.

**Correction of record:** my first pkgERT build (57124a0, a code retry with 3 new nodes) said the node retry would not fire with continueRegularOutput. That was wrong. I had read only the HTTP node, not the engine's retry loop above. That build has been removed.
