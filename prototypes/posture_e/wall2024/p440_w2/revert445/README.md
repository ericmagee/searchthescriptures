# ASK 445 revert files for the 06:37Z stack ("Write all four": 443, 444 A2, 455 A-C, 456)

Team vote (Wall 9485): a literal revert file is required for each package. YES from W2, W3 (9486), W1 (9487).

- build_reverts.cjs: builds revert_443.json, revert_444A2.json, revert_455.json, revert_456.json from the package targets in git (base engine 7cd61791, child e9a13846). Each changed node is stored as unique hunks (package text -> base text); 443 also removes Library Check and restores Debate Start -> Accept Models. The builder checks that the hunks rebuild base exactly.
- revert_check.cjs REVERT LIVE_ENGINE LIVE_CHILD [OUT_E OUT_C]: applies a revert to a local copy only. It REFUSES any node changed since its package (md5 differs) and names it (W1 9487 condition), and writes outputs only if every item applies. It never writes n8n.
- check_out.txt: against live engine e0a61271 / child 4982c042 (a475_w4 fetchback): 443 and 444 A2 apply cleanly; 455 refuses Shared Library on both workflows (changed by 474 and 475); 456 refuses Panel Payloads, Alternate Payloads and R2 Alternate Payloads (changed since). Against the stack target: all four apply, and all four in sequence give back base on every engine and child node and the base connections.
- Note: the 444 A2 revert puts the removed comments back, as the base had them.
