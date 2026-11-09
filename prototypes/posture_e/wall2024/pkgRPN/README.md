# pkgRPN: remove the unused direct provider call nodes (list WALL-3627 item 3; operator "all approve" 16:27Z 11-09)

Base: live s78 (3a5af84b), library strip_FUM. Builder W4. Graders: two non-builder seats.

## What changes
- Removes the 112 nodes named `* openai`, `* gemini`, `* grok`, `* mimo` (100 HTTP call nodes, 12 Panel Judge code nodes). DeepSeek, openrouter and the direct anthropic debater calls stay.
- Every switch output that led to a removed node (112 outputs) now leads to one new Code node, `Provider Removed Stop`, which throws FAIL-CLOSED naming the family and model. Switch output counts and indexes are unchanged (`jidx`, `fam_idx` stay positional).
- Removes the removed nodes' names from the node-accessor maps and name lists in 7 code nodes: Panel Payloads, Alternate Payloads, R2 Alternate Payloads (library, via strip_RPN + repack: Shared Library a6b7001894b6 -> 6a808e7a6806), Panel Check, Panel Tokens, Build Save Body (direct). No other code changes; E4 nodes unchanged; 30/30 stubs rebuild.
- 509 -> 398 nodes.

## Reachability (why no item can reach a removed node)
- Debaters: Init Seats `ENG` maps every engine to `openrouter` except `deepseek`; Resolve Seats switches a seat to `anthropic` only on the direct path. Debater Builds use FAMS index of seat.fam, so only outputs anthropic(0), openrouter(5), deepseek(6) are reachable.
- Judges, reserve, single judge, cure: Resolve Seats `JFAM` maps every seat to `openrouter` except `deepseek`; alternates are filtered to `JFAM[k]==='openrouter'` and carry fam 'openrouter'; cure Builds copy the judge's fam (B.fam/jd.fam). Reachable: deepseek(0), openrouter(5), skip(6).
- If a future config produced another family, the run fails closed at `Provider Removed Stop` instead of silently calling a removed node.

## Tests
- `pkgRPN/test_RPN.cjs`: every saved run in inputs/ (35 runs): old vs new source of the 6 changed nodes on the same saved inputs: 175 same, 0 different (162 with real output, 13 where both threw identically on old run shapes). R2 Alternate Payloads has no saved input (never ran).
- All 163 code nodes in the target parse; genwrite dry run reaches only the running-execution guard.
- Build: `python3 pkgRPN/build_RPN.py <fetchback s78>`; pack strip_RPN (LIB_N=30) to pkgLIB_RPN; `FB=<fetchback> node pkgLIB/e4_rebase.cjs pkgLIB_RPN`; `python3 pkgRPN/target_RPN.py <out>`.
