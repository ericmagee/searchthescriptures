# W1 review of run 42071 (ODV1-42071-uclot7fi), Wall 11296 on WALL-11291

Session session_01H1X3ANxr57MZvsu7fHB9kh, seat 34. Posted 22:35 CST 2026-11-23.

VERDICT: all four removals (gemini, qwen4max, spark, alternate argon) are engine-form defects, not judge faults. Three are shown from engine code (Shared Library, engine 196402d0) and reproduced; argon is a reading of its rows.

1. ROOT CAUSE A: the flagged line is cut at 1,500 characters (`String(it.line).slice(0,1500)`), and checks and the apply splice use the cut.
   - qwen4max, row 53144, D2 vs C6: stored line 1,500 chars ending "...and the re"; the full judgment line carries DECIDES [L4], FROM, MEETS [CR3], WHY IT FAILS. The layer check on the cut reported "no deciding step"; "a KEEP does not cure a layer fault" refused the KEEP. False fault. Counterfactual: the KEEP quotes the defender's own CR3 words and would pass the six-word check.
   - gemini, rows 53168, 53240, 53202, D3 vs C4: same false "no deciding step" on the cut. Gemini answered `SENDBACK: S13 || CHANGE TO: RETRACTED: D3 vs C4 || <reason>` (the prompt's form); CURED. The apply step replaced the 1,500-char cut inside the full line, leaving the real tail: row 53240 "RETRACTED: D3 vs C4d. “All this” ... -- WHY IT FAILS: [L1] Matthew 1:23". The engine refused its own output as text after the pair; the gate repeated it; counted in drv_uncured.
2. ROOT CAUSE B: the own-words six-word check skips every 6-word run inside quotation marks in any round. spark, row 53175: the KEEP quotes the defender's "Joseph knew Mary his wife within the espousal" (CR1 l.23, CR3 l.499, CR4 l.846 of rounds dump); the challenger quoted that sentence in DR2 (l.429), so every run was skipped. Reproduced.
3. ARGON, rows 53341, 53360: first reading said keystone STANDS (no D5 collision line); argon changed to STANDS; pkgLAY refused ("still names no collision label", which cannot exist), and the second reading reversed the first (right: BROKEN). Written keystone rule supports STANDS.
4. G4 marks a model used when offered, not when seated (W4 11294). Design question.
5. Judges' reasoning: all three decided on D3 (Matthew 1:18, 1:25, 1:22-23 against the defender's admitted inference); qwen also D2 vs C6 and D4 vs C3; footed in the record.
6. Engine closing contradiction on C1 (my reading: not a contradiction; DR3 "not yet begun when the child was born" vs DR4 "at the birth" both deny a knowing before the birth). It drove gemini's D3 vs C1 challenger break, the first UNDERDETERMINED results of qwen and spark, and a CONTRADICTION line in all three. No seat removed by it.
7. Plan direction: check and splice on the full line; limit the own-words exclusion to scripture rows; keystone form check must not demand a D5 collision label when none exists, and a second reading must not count against the change the first reading asked for.
