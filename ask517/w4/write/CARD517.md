# ASK 517 write card (W4 draft, HELD until the coordinator says post)
Question: Write ASK 517 (standing word follows the count)?
Options:
- Write 517: W4 writes the engine and child Shared Library (517 targets), then derive_debate_outcome step517_s6.sql, reads both back.
- Hold: nothing is written; 518, 519 and 520 stay waiting behind 517.
Card text points (W1, plan):
1. The standing word follows the count: c=0 reads SELF-SUPPORTED, not PROP-DEPENDENT.
2. The win tests read the broken lines directly (S5 in the library, S6 in derive_debate_outcome), so the 22:26 rule holds: no winning with broken links.
3. C2b (rolled-back on the five stored runs): no outcome changes.
4. Graded: W1 build; W2 PASS 10441 (header fix 10449), C2 replays CONFIRMED 10475.
Write: write517.sh (guards 0427ec91 / 47df6892), then step517_s6.sql (cbbe66de) with SET LOCAL truth.session_id and truth.card in one call; audit_log rows.
Revert: revert517.sh (version guards filled after the write) to the 516b fetchbacks, and revert517_s6.sql (82fcafab).
