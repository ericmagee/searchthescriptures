# pkgRHN grade, W1 (non-builder)

Package: pkgRHN (W2), commit 520b6b64, parent wall2024/parent_s156_RHN.json sha 5ce95a93fc3661c6, base fetchback_live_s156.json.
Verdict: PASS WITH LIMITS.

## Checks
1. Mapcheck (w4/uow/mapcheck.cjs): 17 nodes differ (the 17 round Extract nodes), connections equal, 442 nodes both, code +3,060.
2. Own diff: 17 changed nodes, each +180, all parse (0 syntax faults). Prompt 0 (normalizer runs on raw round text only).
3. W2 test_RHN.cjs rerun: PASS 26 FAIL 0.
4. Stored scan: all debate_results rows (213 runs, 8 round columns), first three non-empty lines holding "Round N": 1,720 lines. Lines whose number differs from the round: 11. Ran live and new __RFX (extracted from each file, D4 Extract) on each:
   - 5 "#" headings (24355, 24364, 26551, 32306): old and new equal (still normalized).
   - 4 long body sentences (27088, 32980, 33175, 33828 types; over 160 characters): equal, untouched by both.
   - 35554 defender close original ("as declared in my round 1"): live rewrites to "round 4 (close)"; new leaves it. FIXED.
   - 33040 challenger close "**Status of my links, as my round 3 numbered them:**": live would rewrite to "round 4 (close)"; new leaves it. Second body case fixed (bold body line).
5. Plants (replay_rhn_w1.cjs): plain and marked headings "Round 3 close", "DEFENDER ROUND 3: CLOSE", "Defender, Round 3 (close)", "Defender — Round 3 — Close" still normalized; "As shown in Round 2, the seed is flesh." left alone.

## Limits (record only; none seen in stored rounds)
- A marked heading with a possessive or article before Round ("# My Round 3 close", "# The Round 3 Close") is no longer normalized. The word check applies with markup too. 0 stored cases.
- A plain heading with an inner full stop ("Round 3. Close.") is no longer normalized. 0 stored cases.
- W2's own limit stands: "**Round 2 grants stand.**" is still treated as a heading.
- Behavior change: when a body sentence among the first three lines is skipped, the loop continues and may rewrite a later heading line ("I said in my round 4 ...\n# Round 3" now becomes "# Round 4 (close)"; live left it). This is the intended heading fix, noted so graders see it.
- Pre-existing, unchanged: "### The Defender's Round 2 Link Round" in round 3 becomes "Round 3 (link round) Link Round".
