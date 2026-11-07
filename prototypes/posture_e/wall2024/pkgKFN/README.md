# pkgKFN (W1, 2026-11-07; W3 2968 item 2): K-F reads a numbered list quoted on one line

**Fault (33461 gemini, K-F D5 vs C6, debate_enforcer_log row 16676).** [DR3] wrote its order as a numbered list on separate lines
(" 1. Knowing within the espousal ... 2. Conceiving. 3. The finding (1:18). ..."). gemini's FORCED ANSWER quote joined the list on one line and
kept "2. ", "3. ", "4. ", "5. " mid-line. kfFound strips list markers only at line starts (__kfLB), so the ANSWER quotation was "not in [DR3]"
and gemini got a LIVE K-F item. It is not an inner-quote cut: the FAILS quote, which holds the inner "thy wife.", passed.
Check (live s49 kfFound, DR3 text from the 33461 saved Alt Gate Build): ANSWER found false; the same quote with the inline " N. " removed: true.

## Change (all 22 library nodes carry kfFound; Shared Library only)

When the line-start compare fails, kfFound compares again with inline list markers (1-2 digits then "." or ")", standing alone between spaces
or at an end) taken out of BOTH the quote and the round. The first compare is unchanged, so every quotation found today is still found.

## Ships as pkgLIB_v13 = v12 + pkgKFN

- orig_stack = pkgKFN/patched (v12 orig_stack with the one kfFound line changed in all 22).
- pack: strip_s45 strip_L1Q strip_TRM strip_DEC strip_V18 strip_CRW strip_KSP strip_KWT strip_KWC strip_L1Q2 strip_KWA strip_KG1L strip_MIM strip_KFN.
- Shared Library json sha256 67626dac3fbee20f. Every stub changes only because library line numbers move by one.
- test_LIB 11 OK (pkgLIB_v13/test_LIB_out.txt); test_recent (v13 orig vs v13 stubs) 352/352 identical (pkgLIB_v13/test_recent_out.txt).

## Replay, v12 vs v13 on the 16 saved runs (pkgKFN/replay_22_v12_vs_v13.txt, pkgKFN/replay_diff.txt)

352 node runs: 350 identical. The 2 that change are 33461 Extract Independent Verdict and 33461 Panel Payloads. In both the only change is
that the K-F D5 vs C6 mark is gone, with its effects: AUDIT FLAGS 18 -> 17, gemini drv_uncured 14 -> 13. No other run changes.
