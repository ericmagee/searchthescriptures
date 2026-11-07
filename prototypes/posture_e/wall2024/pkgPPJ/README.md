# pkgPPJ: parallel Panel Judges 1-3 (W1, 2026-11-07; Eric approved 13:57 CST)

**Problem.** The three panel judges are called one after another (366 s in 33389). n8n runs one node at a time,
so splitting into three branches would still run them in turn.

**Change.** Two new nodes go into the main workflow, and a small webhook workflow is added.

- **Panel Judges Prep** (Code) builds one item per seat slot. Each item's body is exactly what the live provider node's
  jsonBody expression gave; the three openrouter transforms are copied verbatim. The provider comes from the same route
  index the Route switches use.
- **Panel Judges Parallel** (HTTP Request, 3 items) sends all three items at once. In n8n-nodes-base HttpRequestV3 the
  items go out together through Promise.allSettled and come back in item order. The merge is therefore by seat slot,
  and each reply also echoes its slot and provider.
- **WALL-2024 Panel Judge Call** (new webhook workflow, `patched/Panel_Judge_Call.workflow.json`) routes each item by
  provider to the same 6 provider HTTP nodes: same credentials, URL, 900 s timeout and grok conv-id (the parent's
  execution id). It answers `{ppj_slot, ppj_provider, response}`. Wrap turns a provider error into plain
  message, description and status fields, because an Error's message does not survive JSON.
- **The 16 provider judge nodes** (`Panel Judge k <provider>`) become Code nodes with the same names. Each hands out its
  slot's reply exactly as before, so Panel Check, Panel Payloads, Panel Tokens, Alternate Payloads, Shared Library and the
  openrouter xAI maps are unchanged. A missing, mismatched or transport-failed slot becomes `{error:{message:'pkgPPJ ...',
  ppj_transport:true}}`, which Panel Check handles as a failed judge call, the same as a provider error today.
- **Unchanged.** Routes, Panel Judge 1 Empty?, Panel Judge 1 deepseek retry (still a direct call), and every downstream
  node. No retry is added or removed.
- **Wiring.** `QR Trial?` output 1 and `QR Merge` now go to Panel Judges Prep (they went to Panel Judge 1 Route).
  Prep goes to Parallel, and Parallel goes to Panel Judge 1 Route.

Rejected: Execute Workflow per item (its source awaits each item in turn), and a Code node calling providers (the keys
would leave n8n credentials).

## Tests: `node --max-old-space-size=12000 pkgPPJ/test_PPJ.cjs` (output in test_PPJ.txt)

All 16 saved runs with panel judge replies, including 33430 and 33442. 134 checks pass, 0 fail.

- **T1.** Prep's provider equals the node that ran live, and its body equals the live expression, for every slot of the
  12 runs whose Panel Build has the s47 route fields. 4 older runs (33276 33289 33311 33322) predate jidx0 and are not
  applicable. With every saved node visible, 0 bodies change, so no judge reply ever fed another judge's body, and
  computing all three bodies before the calls is equivalent.
- **T2.** Each same-name Code node returns the saved live reply byte for byte.
- **T3.** Panel Check output is identical with the Code nodes and with the live replies. On the s47-shape runs it also
  equals the saved live Panel Check output.
- **T4** (33430, 33442). The failure paths, transport error, slot order swapped, provider mismatch, and provider 429
  through Wrap, all reach Panel Check as a judge failure that carries the message.
- **T5.** Prep fails closed on a route index with no provider.

**Memory.** The execution gains the Parallel node's output, a second copy of the 3 replies: max 488,451 bytes, mean
277,792. Each webhook call is its own small execution holding one body and one reply.

## For W4: write list (n8n)

1. Create a Header Auth credential for the webhook (any header name and a long random value).
2. Import `patched/Panel_Judge_Call.workflow.json` as a new workflow. Set the webhook credential on node "Panel Judge Call",
   then activate it. Note its production URL.
3. In the main workflow:
   - Add "Panel Judges Prep" (code: `patched/Panel_Judges_Prep.js`).
   - Add "Panel Judges Parallel" from `patched.wiring.json`, with the production URL and the same header-auth credential.
   - Replace the 16 nodes listed in `plan_PPJ.json` "replace" (type code v2, jsCode from `patched/<file>`; keep the name,
     id, position and onError continueRegularOutput; drop the credentials).
   - Rewire the 4 connections.
4. Revert: restore the 16 nodes from `base_s47/*.json`, remove the 2 new nodes, restore the 2 connections into
   Panel Judge 1 Route, and deactivate the webhook workflow.

## Dry checks at a gap, before the first live run

- **(a) Held call time.** Call the webhook once with a saved 33442 judge body (deepseek or openrouter) and confirm the
  answer arrives after more than 100 s, with no proxy 524 or 504. Live judge calls have taken up to 645 s.
- **(b) Concurrency.** From a scratch workflow, one HTTP node sends 3 small items to the webhook. All 3 must return, and
  the wall time must be about the slowest call, not the sum. Do this while a parent execution is running, to rule out a
  production concurrency limit queuing the sub-calls behind the parent.
- **(c) Provider check.** Run one small item per provider in use (openrouter, deepseek, grok, mimo) and confirm each
  answer has `ppj_slot`, `ppj_provider` and a `response` with choices or candidates.
