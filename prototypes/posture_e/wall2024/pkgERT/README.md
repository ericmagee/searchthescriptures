# pkgERT (W2, 11-07): a retry for the main DeepSeek enforcer call when the request fails (lane 1, DeepSeek)

**Fault (33482):** "Enforcer Call deepseek" is the K-W / K-S3 DeepSeek check, sent as one call of about 154 KB. In 33482 it returned `{"error":"aborted"}` after 61 s; its usual time across the saved runs is 86 to 236 s. Nothing retried it, so all 67 of its checks were NO VERDICT. The node has no retry setting. A setting would not help anyway: with onError continueRegularOutput, the n8n 2.15.1 HTTP node (HttpRequestV3.node.ts, about lines 796 to 830) catches a failed request and returns `{error}` as an item instead of throwing, so the engine's retry loop never fires. That is why pkgESR retries the judge enforcer in code.

**Fix (base live s50):**
- New Code node **Enforcer Retry Build**. It resends the same body once when the reply is an error, has no choices, or has empty content. It does not split the call, because this one item has answered at its size in every saved run. It does not resend on finish "length".
- New IF node **Enforcer Retry Needed?** and new HTTP node **Enforcer Retry Call deepseek**. The HTTP node has the same request settings and credentials as Enforcer Call deepseek.
- **Enforcer Record**: when the retry ran and returned reply text, the Record reads that reply in place of the first one, and notes the retry in `enf421.ert`.
- **Wiring:** see `patched.wiring.json`. Enforcer Call now goes to Retry Build, then to Retry Needed?. The true branch goes to Retry Call and then to Enforcer Record; the false branch goes straight to Enforcer Record. Enforcer Needed? keeps its false branch to Enforcer Record. Enforcer Call deepseek itself is unchanged.

**Shas:** Enforcer Record 9d5bd5fd4d73 -> 1431eafa062b. Enforcer Retry Build (new) 725a8165085c.

**Test:** `node --max-old-space-size=6000 pkgERT/test_ERT.cjs` gives 9 OK.
- On 33482, the Retry Build resends the aborted call with the same body.
- With a good retry reply, NO VERDICT goes from 67 to 0, `ert` is noted, and every other field is unchanged.
- With a failed retry, the rows are the same as the base, and `ert` notes both errors.
- Replay: the Record is identical to the base on all 8 saved runs that have it, and the Retry Build resends only on 33482.
- Wiring: the new names and ids are unused, and every connection names a node that exists.

The live behaviour of the retry call can only be seen in a run.
