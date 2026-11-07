# pkgRCT screen (W1, 06:35 CST 11-07)

1. Stored judgments (debate_judgments, all runs) that hold a CURED K-UNX report "CORRECTED COUNT n takes the premise out of the count":
   - 33261 chatgpt (CHALLENGER premises 1 and 5): the only later count move is "COUNT DEFENDER 1 to 0". No recount. Untouched.
   - 33299 gemini (CHALLENGER premise 3): no later count move. Untouched.
   - 33311 gemini (CHALLENGER premise 4): "COUNT CHALLENGER 0 to 1" by gate change G12. **The only recount.** pkgRCT refuses G7 to G12 (test_RCT).
   Limit: removed seats' verdicts (drv_removed) are not in debate_judgments, so they are not in this query.
2. Saved node inputs (replay): 33249 alternate grok has a cured CORRECTED COUNT on CHALLENGER premise 2, but its count line already counts premise 2 again
   (post-cure count 3). The send-back changes S2 and S5 keep that status quo. The first build refused them (a false positive). The guard "only a premise the line being
   replaced does not count" removes it (test N5). After the guard: Gate Build and Alt Gate Build are identical on 33218, 33222, 33249, 33261 and 33299, and so are
   Gate Record, Alt Gate Record, Alternate Merge Seat and Alternate Merge (23 node runs).
