# pkgBAR wiring (for W4). Base: live 98daac9e + n19 + n20 (pkgOAN) + pkgIMP b0208c5. 370 nodes -> 440.

How to build the write
1. After n20 and pkgIMP are live, save the fetch-back, then from wall2024/: `node pkgBAR/build_BAR.cjs <fetch-back.json> <out.json>`.
   It refuses (throws) if any anchor is missing. Compare its printed base shas with pkgBAR/plan_BAR.json (made on the offline stand-in base,
   `node pkgBAR/make_base.cjs`): every changed node's base_sha must match, or the live base differs from what W3 graded.
2. Write from <out.json>: the 46 changed nodes (plan_BAR.json "changed"; code nodes' jsCode, and the 6 Verse Sheet nodes' url) and the 70 new
   nodes (plan_BAR.json "added") with their connections.

New nodes, per round r in C1, D2, C2, D3, C3, D4, C4 (rounds [DR1] [CR2] [DR2] [CR3] [DR3] [CR4] [DR4])
- rB Build (code), rB Route (Switch, 8 outputs, `={{ $json.resend ? $json.call.fam_idx : 7 }}`), rB Call <fam> x7 (exact copies of the
  round's own 7 Calls: method, url, credentials, jsonBody, timeout, retry, onError continueErrorOutput), rB Extract (code).
Connections
- src output 0 -> rB Build, where src is r Extract (C3: C3G Extract; C4: C4G Extract). src output 1 (Failure Salvage) is unchanged.
- rB Build -> rB Route; Route outputs 0-6 -> the Calls in the round Route's order; output 7 -> rB Extract.
- Each rB Call: output 0 and output 1 -> rB Extract (a failed re-call keeps the first round and voids nothing).
- rB Extract output 0 -> what src fed before (C1B -> D2 Verse Sheet, D2B -> C2 Verse Sheet, C2B -> D3 Verse Sheet, D3B -> C3 Verse Sheet,
  C3B -> D4 Verse Sheet, D4B -> C4 Verse Sheet, C4B -> Build Synthesis).

Changed nodes
- Init with Guards: the BARRED MOVES block at the end of dsys and csys (part 1).
- 15 PART2 nodes: the VOID sentence and "Repeated offenses will result in disqualification." after Commitment 14.
- Every later reader of a round reads rB Extract: round Builds and Extracts, Words Plans, Verse Sheet urls, Build Synthesis,
  Build Diagnostic Prompt, C3G Extract, C4G Extract; the z-ai helper in D3, C3, D4, C4 Build.
- Failure Salvage reads rB Extract first, then the G or first Extract. Build Save Body writes the AUDIT v47 lines.

Run report (what to read)
- rB Extract json.bar on each round: resent, kept (first/second), why, first.hits (the sentences sent back), void [{seat, side, round,
  sentence, move, struck}].
- review_notes: "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) ...]" per re-call and "[AUDIT v47: BARRED MOVE VOID (pkgBAR) -- SEAT ...; ROUND ...;
  SENTENCE ...]" per VOID sentence.
- Known gap (same as C3G and C4G): the re-calls' tokens are not added to the run's token sums.

Revert: the 46 changed nodes' parameters from the pre-write fetch-back, the 7 src output-0 connections back to their old targets, and the 70
new nodes removed.
