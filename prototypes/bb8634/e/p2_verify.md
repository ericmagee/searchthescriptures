# BB-8634 portion 2 verify (Worker_E), 30 Oct 23:3x CDT
S3 (A3 s3_patch.md md5 4dad58f4, commit 29ce7d9):
- live derive_debate_outcome md5 0d9d31832738778f1c92716439540e57, 22,675; one function of the name; anchors 1,2,1,1.
- rebuilt from the patch by SQL replace: 2c39766e2bdcf7ecfcd1779a648f1db4, 22,742; 'verdict_tag = v_fv' x2. Undo applied to new: 0d9d3183.
- probe (renamed copy derive_debate_outcome_eprobe, DO block aborted by RAISE): 30091 DEFENDER PREVAILS, WEAKENED -> UNDERDETERMINED (seats deepseek/gemini/glm PARTIAL, 3-0); run B UNDERDETERMINED -> UNDERDETERMINED.
- extra probe, all 7 PARTIAL rows since v_tie_from: f11b18bf CHALLENGER PREVAILS -> same; 21fb9c30, 6a14095d, a25773b5, 9ac8b195, 77f5176b null -> null; 49774304 (30091) -> UNDERDETERMINED. Only 30091 moves.
- after: live md5 0d9d3183, nfun 1, 30091 outcome unchanged.
- my error: second probe first sent without SET LOCAL; refused P3R01 before any effect.
S7 (s7_count.md md5 65262b3c): recount, last ten judged debates 10-29 16:16 to 10-30 21:55 CDT:
deepseek 8: 6/8; gemini 10: 0/0; glm 6: 13/9; grok 5: 5/6; qwen 1: 0/0; single judge 10: 9/7; removed glm 1: 2/3, deepseek 2: 1/0. Equal to A3 table.
