# ASK 443 revert: what relies on engine Library Check (W3, read 11-19 against live e0a61271 / 4982c042)

Revert file: p440_w2/revert445/revert_443.json (removes engine node "Library Check", reconnects Debate Start -> Accept Models).

## In live n8n (a475_w4 fetchback, versionIds e0a61271, 4982c042)
1. Engine connections: Debate Start -> Library Check -> Accept Models. The revert restores Debate Start -> Accept Models. Library Check returns $input.all(), so Accept Models gets the same items either way.
2. No engine node names "Library Check" in its parameters (searched all 397 nodes). No node reads its output by name.
3. Engine Alternate Pass Call sends lib_sha and map_sha to the child; it computes them itself, not from Library Check.
4. The child's "Library Check (ASK 422a)" is a separate node (Alternate Pass In -> it); the revert does not touch it, and it does not read the engine node.

## Outside n8n (git, tools)
5. a417_w2/registry.json, the ASK 443 entry ("engine Library Check after Debate Start ... (pkgLIB2)"): its mark is the ABSENCE of a pkgLIB2 stop. After the revert it would still read EXERCISED on every run, falsely. The entry must be removed or marked REVERTED in the same step.
6. tools/runstart.py checks the library sha at run start on its own (W2 9444); it does not use the node. Not affected.
7. The held ASK 476 build (a476_w3) edits Library Check to read pass.lib; if 443 is reverted, 476 must be rebuilt.
8. Engine manual v208 and op doc describe Library Check (ASK 443 entries); a revert needs a manual version that removes them.

## Effect if reverted
The run would no longer stop when the Shared Library text differs from its header sha (pkgLIB2). The 422(a) engine-against-child check stays.
