# pkgPPJ: parallel Panel Judges 1-3 (W1, 2026-11-07; Eric approved 13:57 CST)

**Problem.** The three panel judges are called one after another (366 s in 33389). n8n runs one node at a time,
so splitting into three branches would still run them in turn.

**v2 (W4 2962).** Dry check (a) failed on v1, which held the webhook HTTP call open until the reply came. Slot 2 answered at 117 s, and
slots 1 and 3 got HTTP 524 at about 125 s, so the host proxy cuts calls held open past about 100 s. v2 holds no call open: the webhook
answers at once, the sub-workflow stores the reply in Supabase, and the main workflow polls for it.

**Change (v2).**

- **Panel Judges Prep** (Code) builds one item per seat slot. The body is exactly the live jsonBody expression; the openrouter transforms
  are copied verbatim, and the provider is taken from jidx0/jidx. It also makes a random `ppj_nonce` (`ppj-<execution id>-<32 random chars>`)
  and a start time `ppj_t0`.
- **Panel Judges Parallel** (HTTP, 3 items, timeout 60 s) posts the 3 items to the webhook at once. The webhook uses `responseMode:
  onReceived`, so each POST returns in under a second.
- **WALL-2024 Panel Judge Call** (webhook workflow) runs Provider Route, then the same 6 provider nodes (same credentials and timeouts;
  x-grok-conv-id is the parent's execution id, W3 2953), then Wrap, then Store Reply. Store Reply posts to rpc `ppj_put` with the existing
  Supabase Anon Key credential and retries 5 times. The reply is stored as JSON text, so its bytes and key order come back unchanged; jsonb
  would reorder the keys.
- **The polling loop.** Panel Judges Wait (15 s, run once) leads to Panel Judges Poll (rpc `ppj_status`, slot numbers only, so it stays
  small), then to Panel Judges Done?. Done? is true when the stored slots plus the failed dispatches reach 3, or 980 s have passed since
  `ppj_t0`; false loops back to Wait.
- **Panel Judges Fetch** (rpc `ppj_get`, run once) reads the 3 rows. **Panel Judges Collect** (Code) gives one item per slot in slot order,
  `{ppj_slot, ppj_provider, response}`. A slot with no stored reply, a failed dispatch, or unreadable text gets
  `{error:{message, ppj_transport:true}}`.
- **The 16 provider judge nodes** become same-name Code nodes that take their slot from Collect, by slot number. Downstream is unchanged, and
  so are the routes and the DeepSeek Empty?/retry.
- **Wiring.** QR Trial? output 1 and QR Merge go to Prep. Then Prep, Parallel, Wait, Poll, Done?: true goes to Fetch, then Collect, then
  Panel Judge 1 Route; false goes back to Wait.
- **Database** (`sql/ppj_store.sql`, revert `sql/ppj_store_revert.sql`, for W4 to run with SET LOCAL truth.session_id):
  - Table `ppj_replies`: nonce, slot 1-3, provider, seat, response_text, unique (nonce, slot). RLS is on with no policies.
  - Three SECURITY DEFINER functions `ppj_put`, `ppj_status` and `ppj_get(payload jsonb)`, executable by anon, the same pattern as
    record_debate_judgment.
  - `ppj_put` checks the nonce and slot, keeps the first reply per slot, and deletes rows older than 3 days.
  - Not run by W1: the DDL audit trigger refuses unstamped writes, and a seat stages DB changes.

## Tests v2: test_PPJ.txt, 152 OK, 0 fail, 16 runs incl. 33430 and 33442

- **T1.** Bodies equal the live expressions. 0 bodies change with every saved node visible.
- **T2.** Each saved reply goes through Wrap, the stored row text, ppj_get rows given in reverse order, Collect, and the Code node, and comes
  out byte for byte equal to the saved reply. Collect's slot order is checked.
- **T3.** Panel Check output is identical.
- **T4** (33430, 33442). Each failure reaches Panel Check as a judge failure with its message: a reply not stored, a dispatch that failed
  with 524, a provider mismatch, unreadable stored text, and a provider 429 through Wrap.
- **T5.** Prep fails closed on a bad route index.
- **Memory.** Fetch plus Collect output hold up to 987,556 bytes (mean 561,573), which is two copies of the 3 replies, one as text and one
  parsed. Each Poll output is a few bytes.

## Dry checks for W4 at a gap, before the first live run

- **(a2)** Send the 3 full 33442 judge bodies through Parallel. Each POST must return in under 5 s. All 3 rows must appear in ppj_replies
  (the longest took 252 s in 33442), and Fetch then Collect must give the 3 replies.
- **(b2)** Run the Wait to Poll to Done? loop in a scratch workflow with a nonce that has no rows. It must loop and end at the deadline;
  for the check, set the deadline to 60 s in the scratch copy.
- **(c)** One item per provider in use, as before.
- **Node versions.** Confirm the Wait node parameters (typeVersion 1.1, amount 15, unit seconds) in the n8n editor, with validate_node_config.
