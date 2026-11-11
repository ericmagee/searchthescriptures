# W1 grade: pkgALT (W2, Wall 4633; parent_s119_ALT.json sha256 3b6e845d4a663b70)
Against live s119, offline, no paid call. Claim and plants: Wall 4638. Result: PASS WITH LIMITS.
- Diff: Init Seats, Resolve Seats, Accept Build only (plain nodes); connections equal; 418 nodes.
- B1 operator's words (msg cmsg_017ZQamDMHrS6fqMHnQDVo584agStir1LNPv9PdtSDKGzs): claude v opus gives panel chatgpt (terra), sol, luna; alternates grok, argon, haiku in that order (b_init_out.txt, W2 sim). glm, qwen, mimo not added. Haiku row unchanged.
- B2 Wall 4622 cases: chatgpt v opus REFUSED (panel 0), sol refusing REFUSED (panel 2), refusal text equal to live; no alternate seated on the panel (E7, E8, E9).
- B3 round 1 on stored 34852 with the new pool (b3.cjs, b3_out.txt): removed luna -> grok, chatgpt -> argon, sol -> haiku. Gemini debating: luna -> grok, chatgpt -> haiku, sol skipped with reasons recorded (grok G4, argon G1 family, haiku G4). Grok debating: luna -> argon, chatgpt -> haiku. Alternate Build code is unchanged; the live code on the same input gives the same result.
- W4's item (round 1 has no cap of two): CONFIRMED. All three panel seats of 34852 are replaced in round 1; the cap of two exists only in Second Alternate? (round 2). Pre-existing live code, reachable now that the pool is three deep.
- B4 families: gemini debating drops argon; grok debating drops grok; claude/opus debating keeps haiku (live rule, haiku exempt).
- B5 route: Resolve Seats sends alternates with fam openrouter and the row's api_model; Alternate Build wraps the body for openrouter. Grok goes to OpenRouter as x-ai/grok-4.7; the row's provider xai and endpoint are not read on this path.
- B6 argon row absent: Resolve drops argon from the alternates silently; Accept Build throws FAIL-CLOSED ("seat argon has no ACTIVE model_config row"), so a posture run does not start. The row must be written first.
- B7 stored replay (replay_cmp.cjs): 92 of 92 equal. The stored runs never asked grok or argon the posture, so the new seats are not free there; the change is not reached by stored inputs.
- LIMITS: (1) a ledger-moved grok leaves no reserve (panel_reserve null; argon and haiku not tried), the live rule applied to the new first alternate; grok's jfl_move is false today (model_config_jfl read 20:5x CST). (2) Two more posture calls per debate. (3) Round 1 can seat three alternates (W4's item).
