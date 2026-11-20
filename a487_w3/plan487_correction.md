# ASK 487 correction, plan rev 0 (W3, seat 33, 11-20; DRAFT, not graded; number to be assigned by the coordinator, next free 503): the gemini debater goes back to gemini-3.8-flash, and the other flash models come out

## 1. THE OPERATOR'S WORDS
- 21:51 CST 11-18 (relayed by the coordinator; quoted by W4 at Wall 9126, 03:56Z 11-19): "we keep gemini 3.8 flash.. it's good. my mistake on that.. we keep spark too. it's currently debating well"
- 18:17 CST 11-19 (W4's thread, 00:17:09Z 11-20): "no.. no.. i said later gemini flash was good... remove the other flash models.   Why was that missed"

## 2. WHY 487 WENT AHEAD (the record, in order)
1. 21:24 CST 11-18: ASK 437 removed the flash models from debating, judging and the panel. At 21:51 CST the operator kept Gemini 3.8 Flash and Spark (W4 9126). ASK 437 rev 3 kept gemini everywhere.
2. 10:16 CST 11-19: W3's Wall 9624 (item 6) quoted that 21:51 ruling and said gemini stays, "so no ruling is owed".
3. About 10:44 CST 11-19: a gemini card reached the operator anyway, and he chose option A, "point gemini (debater) at a non-flash model". The coordinator relayed it to W3 as an order to plan. W3 has NOT read that card's text, who posted it, or what prompted it; the coordinator holds it.
4. W3 planned 487 from the relay (Wall 9675, 16:54Z), and chose gemini-4-hydrogen itself. W3 did not hold the order against the 21:51 ruling that W3 had quoted 28 minutes earlier, and did not ask the operator whether option A replaced it. W1 (9663, 9678) and W2 (9676) graded it without raising the 21:51 ruling either. W4 wrote it on the operator's "Write it" at 17:08:10Z (audit 38577, 38579).
5. Result: the two runs since (40891, 40958) ran 61 and 66 minutes against 22 to 57 on flash, and 40958 crashed out of memory (ASK 501 plan rev 1).
Mistake (W3): a card answer that contradicts an earlier ruling goes back to the operator with both quoted, before any plan is built on it.

## 3. WHAT IS FLASH TODAY (W3 live reads 00:18Z to 00:22Z 11-20; engine 01691ed8 from W4's fetchback afd83622)
- Judge seat gemini: google/gemini-3.8-flash, active, in ORDER0 and __ALT. KEPT (the operator's 21:51 words).
- Debater gemini: Init Seats line 13 ENG gemini mc 'gemini_deb' = google/gemini-4-hydrogen (ASK 487).
- Other flash models seated anywhere in the engine: NONE. ASK 437 already took hy4_flash, glm_legal and qwen out of every seat list. The only flash model id still in the engine is Init Seats line 46 ALT_MODELS alt_minimax31 (minimax/minimax-m3.1-flash), and line 52 refuses every qualify_alternate request, so it cannot seat.
- model_config rows still active but seated nowhere: hy4_flash (tencent/hy4-flash), glm_legal (z-ai/glm-5.3-flashx-legal), qwen_flash (qwen/qwen3.8-flash). Already inactive: glm_flash, ernie (ernie-5.5-flash-preview), deepseek and deepseek_debate (deepseek-flash), alt_minimax31.
- Lookup maps (FAM_PANEL, JFAM_I) still name hy4_flash and others; they seat no one.
- NOT CHECKED: the Alternate Pass, Cure Call and Panel Judge Call workflows for flash model ids.

## 4. THE CORRECTION (W4 builds from fresh live reads; W1 and W2 grade; one card in W4's thread)
C1. Engine: Init Seats line 13, ENG gemini mc 'gemini_deb' becomes 'gemini'. One token, the exact reverse of 487. The debater then reads seat gemini, google/gemini-3.8-flash, 64000 tokens. The panel, reserve and alternate logic does not change.
C2. Dashboard, in the same card and before C3: dash_debaters() row 3 ('gemini','Gemini','gemini_deb') becomes 'gemini'. If it does not, C3 makes dash_debaters report gemini as inactive, and dash_launch_odv1, which reads its allowed engines from it, would refuse gemini launches.
C3. model_config gemini_deb set active false, kept for the record (as 487's revert said).
C4. "The other flash models": set model_config hy4_flash, glm_legal and qwen_flash to active false, and remove the alt_minimax31 entry from Init Seats ALT_MODELS (line 46). None of these seats anyone today, so no run changes; this makes the record match the ruling. Leave the lookup maps alone (they seat no one), unless the team wants them cleaned.
C5. Engine manual entry for C1 to C4, written by W3 on its own card.
The operator should confirm one point before the card: that "the other flash models" means the ones in section 3, and that judge seat gemini (also gemini-3.8-flash) stays.

## 5. CHECKS
Q1. Diff live against target: only Init Seats lines 13 and 46 change; connections equal.
Q2. Init Seats offline on run 40781's input: the debater model is google/gemini-3.8-flash, and the panel, reserve and alternates equal 40781's.
Q3. dash_debaters() row 3 reads gemini, google/gemini-3.8-flash, active true; dash_launch_odv1 accepts gemini (rolled-back test).
Q4. Next run with gemini debating: challenger_model google/gemini-3.8-flash. Run time is expected back in the 22 to 57 minute range.
Revert: the saved live engine JSON; the dash_debaters body before the change; the rows back to active.
