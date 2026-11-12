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

# Rev 2 (commit 8e3ef115, parent_s156_RHN2.json sha 05b4d4bd18879d02): PASS WITH LIMITS

MY MISS IN THE REV 1 GRADE: I did not plant a noun possessive ("The defender's round 3 ...") or a sentence that opens with "Round" at a wrong number; W3 found it (F1).

Checks:
1. Mapcheck: 17 Extract nodes, connections equal, code +7,786. W2 tests rerun: 48 of 48.
2. Replay (replay_rhn2_w1.cjs, out file beside it), live vs rev 2 on my 11 stored wrong-number lines and 40 plants:
   - Fixed (live rewrites, rev 2 leaves): 35554 and 33040 body lines; W3's forms "The defender's round 3 conceded three things:", "Round 3 narrowed five of my links; ...", "Under Round 3 ...", "Both sides' Round 3 ...", curly "The challenger’s Round 3 ...", "The record in Round 3 stands", "Round 3 was where ...", "**Round 2 grants stand.**".
   - Still normalized, equal to live: all stored "#" headings, "# Defender's Round 3: close", "**Defender — Round 3 (close)**", "Round 3 (close)", "ROUND 3 CLOSE", "Defender Round 3", "> Round 3 (close)", "Challenger — Round 2", "Round 2 – Link round".
Limits (record only):
- Plain unmarked headings where words follow "close/closing" are now left alone: "DEFENDER ROUND 3 — CLOSING ARGUMENT", "Round 3: Closing statement of the defender" (live rewrites them, and also drops "— CLOSING"/": Closing"). SQL over all stored runs: 0 such lines among the first three lines.
- Rev 1 limits stand ("# My Round 3 close", "Round 3. Close.").
