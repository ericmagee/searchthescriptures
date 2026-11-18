# ASK 422(b) build (W1): strip code comments from live Code nodes

Plan: a422_w3/plan_422b_rev1.md with rev 2 (W2 PASS 8853/8863, W1 8852, W4 PASS 8864), comment rule W3 Wall 8865 B.
Graders: W2 and W4. Written by W4 on the operator's card. No prompt, model or reasoning setting changes.

## Files
- `strip.cjs`: `node strip.cjs <fetchback.json> <out_dir>`. Read-only on the fetch-back. Writes the stripped workflow and
  `<wf>_nodes.json` (each changed node: name, id, comment count, lengths, sha before and after, proof flags, stripped text, original text).
- `tests.cjs`: the comment rule (a, b, c), strings, regex and template text holding `//` or `/*`, CRLF, ASI after `return`; 3 plants.
- `onlyjs.cjs`: `node onlyjs.cjs <fetchback> <stripped> <nodes.json>`: nothing differs but jsCode, and only in the listed nodes.
- `on_36fcf36b/`: the node lists on the current live pair (engine 36fcf36b, child 365d2828). They keep every commented original in git.
  ASK 422(a) is written first (rev 2 item 6); the build is then rerun on that fetch-back and the lists replaced.

## Scope and exclusions (rev 2 items 2, 3, 4)
- Code nodes only. Excluded: Shared Library (both); every pkgLIB stub (text reads `$('Shared Library').params.jsCode`): 64 engine, 13 child.
  The 30 ASK 409 loader nodes are all stubs, so they are untouched.
- Code that reads code: every Code node was searched for `.params.jsCode`, `jsCode`, `Function(`, `.toString()`, `arguments.callee`, `stack`.
  Only the stubs match. No other node is read as code, so no comment outside the library and the stubs is a marker.
- acorn 8.19.0 (tools/node_modules); every in-scope node parses as the body of an async function.

## Result on 36fcf36b / 365d2828
| | engine | child |
|---|---|---|
| Code nodes | 182 | 62 |
| in scope (not library, not stub) | 117 | 48 |
| changed (carry comments) | 43 | 44 |
| comments / comment characters | 275 / 45,993 | 45 / 3,943 |
| all Code node characters | 3,558,889 -> 3,513,168 | 1,129,352 -> 1,125,411 |
| token equality / tree equality / line count / no comment left | 43/43 each | 44/44 each |
- `onlyjs.cjs`: jsCode changed in exactly the 43 and 44 listed nodes; nothing else differs.
- ASK 385 one-copy check (a385_w4/reg385.cjs) on both pairs: output identical before and after (it compares tokens without comments).
  It FAILS on live before the strip too: REFP has 4 texts, 6 pairs not in registry.accepted (ASK 409 changed REFP). Not caused here.
- REPLAY GATE (rev 2 item 1b): gate/replay.cjs recomputes the library nodes (the stubs). None of the 87 changed nodes is a stub,
  so the gate covers none of them, and `/mnt/project-files/wall2024/inputs` is empty today. All 87 changed nodes rest on token and
  tree equality alone (rev 2 item 1c); the lists are the `_nodes.json` files.

## Limits
- Most comment characters are in the stubs (engine 98,260, child 9,426) and the Shared Library; they stay (rev 2 item 2).
- A line comment leaves its trailing spaces before the line break; nothing else is touched.
