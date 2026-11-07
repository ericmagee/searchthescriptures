# pkgKG1L (W1, 2026-11-07; W3 2952, grade_33442): a gate K-G1 item lists both lines of its contradiction

**Fault (33442 chatgpt, false removal).** K-G1 says a collision graded LINK BROKEN on an unanswered witness contradicts the same side's
CONCEDED LINKS count of 0. The gate item listed only the collision line, so gateLineFor2024 aimed any CHANGE TO at the collision. chatgpt fixed
the count line ("CHALLENGER CONCEDED LINKS: 2 -- Premises 3 and 5 ..."). The engine read that as dropping the collision (E-APPLY, W3 2351),
refused it, counted K-G1 uncured, and removed the seat.

## Change (6 library nodes)

The 6 nodes are Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge and Alternate Merge Seat.

1. **gateNewK2024.** A K-G1 item also lists the side's CONCEDED LINKS line from the corrected text (CHALLENGER CONCEDED LINKS for a challenger
   link). gateLineFor2024 already matches a change to the listed line with the same label, and sbLabel knows both count labels, so a count-line
   change now replaces the count line.
2. **gateCure2024, K-G1 items.**
   - **A change pkgRCT refuses** is recorded and removes no seat. Such a change recounts premises the same judge took out by a CURED
     CORRECTED COUNT at the cure. W3 2819 item 3 already treats a refused NOT APPLIED item this way; a K-G1 change used to fall through to
     "not applied" and count.
   - **An applied change that raises CHALLENGER CONCEDED LINKS above 0** writes a `[pkgKG1L ORACLE CONCEDE ...]` note naming the chain
     (W3: every Oracle concede needs a cause).

Everything else runs unchanged, including the K re-read, E-APPLY, the check that a change raised a new LIVE item (W3 2341), and pkgRCT.

**For W3 to rule.** Should part 2's first point, the pkgRCT refusal, stand as built? The alternative is that a K-G1 change pkgRCT refuses still
counts. Then a judge that retracted at the cure and was pushed back to BROKEN by DeepSeek can only cure by retracting again or by naming a
layer the block lacks.

## Result on 33442 chatgpt (pkgKG1L/e2e_33442.cjs)

Gate Build (patched) feeds Gate Record (patched), with chatgpt's saved live gate reply.

- G1 now lists both lines.
- chatgpt's change lands on the count line. pkgRCT refuses it: premises 3 and 5 were taken out by its own cure CORRECTED COUNT, and the
  reason names no lacking layer.
- G1 is CURED, the gate shows chatgpt with uncured_counted 0 (it was 1), and challenger_conceded_links stays 0. So no Oracle concede arises
  here, which corrects the "would be 2" in grade_33442.
- The base run reproduces the live gate field exactly.

## Replay (pkgKG1L/e2e_all.txt)

- **Scope.** 23 runs, 45 gate pairs (Gate Build to Gate Record, and Alt Gate Build to Alt Gate Record), base vs patched, each with the saved
  live gate reply.
- **Result.** 44 are unchanged and 1 changes (33442 Gate Record, above).
- **Base vs saved live.** The base equals the saved live gate field on 16 of 45. The other 29 are older runs whose live code predates v10;
  harness drift, not this package.

## Library: pkgLIB_v11 = v10 + strip_KG1L

- **Pack order.** strip_s45 strip_L1Q strip_TRM strip_DEC strip_V18 strip_CRW strip_KSP strip_KWT strip_KWC strip_L1Q2 strip_KWA
  strip_KG1L.
- **Shared Library.** json_sha f21d5cb47e324015, 387,031 bytes, 2,086 lines.
- **orig_stack.** v10 orig_stack with the 6 KG1L files.
- **Tests.** test_LIB: 11 OK. test_recent with ORIG=pkgLIB_v11/orig_stack/patched: 15 runs x 22 = 330/330 identical (299 with real output).
