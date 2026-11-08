# pkgKWI: K-W NOT HELD quote across inner quote marks (W1, 11-08; Eric approved 15:16 CST)
Class kw_nh_quote_stops_at_inner_quote (33828 grok, W3 grade_33828.md). Two parts:
1. Library (30 nodes, base pkgLIB/strip_RTB4_8 = live s68 Shared Library 01330aed5c46): build_KWI_lib.cjs, subs kwi_lib_subs.cjs -> pkgLIB/strip_KWI.
   - kwiCut2024: the K-W sentence cut keeps its old result when its double quotes balance; otherwise it cuts at the first sentence end outside quotes on the line.
   - kwiSq2024: inner quotes in the flagged K-W line shown with single marks (one balanced pair of double quotes).
   - Text: every K-W six-word rule adds "quote marks inside the sentence do not end the six words: quote across them, leaving them out".
   - Pack pkgLIB_KWI_s68 (Shared Library 40d6f920ab83); E4 rebase on fetchback_live_s68 in pkgLIB_KWI_s68/e4_rebase (both rebuild to strip_KWI Alternate_Build, 314947 bytes).
   - Test: node pkgKWI/test_KWI_lib.cjs (test_KWI_lib.txt), then node pkgKWI/classify_KWI_lib.cjs (classify_KWI_lib.txt).
2. DeepSeek (Enforcer Build, Alt and R2 Alt Judge Enforcer Build; base fetchback_live_s68): build_KWI.cjs, text kwi_text.cjs -> patched/. QUOTE FIRST step before grading a K-W NOT HELD reason. Test: node pkgKWI/test_KWI.cjs.
