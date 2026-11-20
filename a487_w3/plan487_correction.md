# ASK 503 plan rev 2 (W3, seat 33, 11-20; the ASK 487 correction; number assigned by the coordinator 00:19:45Z, posted at Wall 10189; replaces rev 1 594e1c51 and rev 0 989521b0, neither graded; rev 2 cuts the write to exactly the operator's order, per his 18:26 CST words; rev 1 added his 18:20 CST order): the gemini debater goes back to gemini-3.8-flash, and gemini-4-hydrogen stops judging

## 1. THE OPERATOR'S WORDS
- 21:51 CST 11-18 (relayed by the coordinator; quoted by W4 at Wall 9126, 03:56Z 11-19): "we keep gemini 3.8 flash.. it's good. my mistake on that.. we keep spark too. it's currently debating well"
- 18:17 CST 11-19 (W4's thread, 00:17:09Z 11-20): "no.. no.. i said later gemini flash was good... remove the other flash models.   Why was that missed"
- 18:20 CST 11-19 (W4's thread, 00:20:01Z 11-20): "okay. a mistake.  let's remove hydrogen as a judge (it's not a good fit for the panel).  reinstate gemini flash. and rerun."
- 18:26 CST 11-19 (W4's thread, 00:26:39Z 11-20): "why are you touching other models. they should already be removed when you removed gemini flash"

## 2. WHY 487 WENT AHEAD (the record, in order)
1. 21:24 CST 11-18: ASK 437 removed the flash models from debating, judging and the panel. At 21:51 CST the operator kept Gemini 3.8 Flash and Spark (W4 9126). ASK 437 rev 3 kept gemini everywhere.
2. 10:16 CST 11-19: W3's Wall 9624 (item 6) quoted that 21:51 ruling and said gemini stays, "so no ruling is owed".
3. About 10:44 CST 11-19: a gemini card reached the operator anyway, and he chose option A, "point gemini (debater) at a non-flash model". The coordinator relayed it to W3 as an order to plan. W3 has NOT read that card's text, who posted it, or what prompted it; the coordinator holds it.
4. W3 planned 487 from the relay (Wall 9675, 16:54Z), and chose gemini-4-hydrogen itself. W3 did not hold the order against the 21:51 ruling that W3 had quoted 28 minutes earlier, and did not ask the operator whether option A replaced it. W1 (9663, 9678) and W2 (9676) graded it without raising the 21:51 ruling either. W4 wrote it on the operator's "Write it" at 17:08:10Z (audit 38577, 38579).
5. Result: the two runs since (40891, 40958) ran 61 and 66 minutes against 22 to 57 on flash, and 40958 crashed out of memory (ASK 501 plan rev 1).
Mistake (W3): a card answer that contradicts an earlier ruling goes back to the operator with both quoted, before any plan is built on it.

## 3. WHAT IS FLASH TODAY (facts for the operator; nothing here is written) (W3 live reads 00:18Z to 00:22Z 11-20; engine 01691ed8 from W4's fetchback afd83622)
- Judge seat gemini: google/gemini-3.8-flash, active, in ORDER0 and __ALT. KEPT (the operator's 21:51 words).
- Debater gemini: Init Seats line 13 ENG gemini mc 'gemini_deb' = google/gemini-4-hydrogen (ASK 487).
- Other flash models seated anywhere in the engine: NONE. ASK 437 already took hy4_flash, glm_legal and qwen out of every seat list. The only flash model id still in the engine is Init Seats line 46 ALT_MODELS alt_minimax31 (minimax/minimax-m3.1-flash), and line 52 refuses every qualify_alternate request, so it cannot seat.
- model_config rows still active but seated nowhere: hy4_flash (tencent/hy4-flash), glm_legal (z-ai/glm-5.3-flashx-legal), qwen_flash (qwen/qwen3.8-flash). Already inactive: glm_flash, ernie (ernie-5.5-flash-preview), deepseek and deepseek_debate (deepseek-flash), alt_minimax31.
- Lookup maps (FAM_PANEL, JFAM_I) still name hy4_flash and others; they seat no one.
- NOT CHECKED: the Alternate Pass, Cure Call and Panel Judge Call workflows for flash model ids.

## 4. THE CORRECTION (W4 builds from fresh live reads; W1 and W2 grade; one card in W4's thread)
C1. Engine: Init Seats line 13, ENG gemini mc 'gemini_deb' becomes 'gemini'. One token, the exact reverse of 487. The debater then reads seat gemini, google/gemini-3.8-flash, 64000 tokens. The panel, reserve and alternate logic does not change.
C2. Dashboard, in the same card: dash_debaters() row 3 ('gemini','Gemini','gemini_deb') becomes 'gemini', so the Any vs Any list names the model the debater runs (Gemini 3.8 Flash), per the operator's ruling that it lists every debater model with its version. Without C2 the list would still say Gemini 4 Hydrogen. dash_launch_odv1 reads its allowed engines from dash_debaters; seat gemini is active, so gemini launches keep working (Q3).
C6. Hydrogen off the panel (the operator, 18:20 CST): remove 'hydrogen' from the three seat lists that hold it, and nothing else:
  - Init Seats line 25 ORDER0: ['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'];
  - Init Seats line 35 __ALT: ['haiku','gemini','spark','qwen4max','argon','sonnet'];
  - Accept Build line 26 ORDER: the same as ORDER0.
  No seat is added and the order of the others does not change; each later seat moves up one place. The lookup maps that name hydrogen (FAM_PANEL, JFAM_I, Resolve Seats JFAM, __JFAM2 in Build Synthesis, Build Independent Verdict and Build Diagnostic Prompt, Accept Build ENG_SEAT) seat no one and are left alone, as ASK 437 did. model_config row hydrogen is left as it is (as 437 left its rows).
  Effect, derived by hand from Init Seats (W4's offline Init Seats test confirms, Q2):
  - The rerun pairing (spark/oracle vs gemini/plain): no change. Google and meta debate, so hydrogen, gemini, argon and spark were already off this panel. Panel chatgpt, sol, sol62; reserve qwen4max; alternates qwen4max, sonnet, haiku.
  - A pairing where an OpenAI seat debates and no google, meta or anthropic seat does (for example chatgpt vs grok): before, panel haiku, gemini, hydrogen, reserve spark; after, panel haiku, gemini, spark, reserve qwen4max, alternates qwen4max, argon, sonnet.
  - Any other pairing without an OpenAI debater: the panel stays chatgpt, sol, sol62; hydrogen leaves the alternate list, and the seats after it move up.
C5. Engine manual entry for C1, C2 and C6, written by W3 on its own card.
Not in the write (rev 2, the operator's 18:26 CST words): no change to gemini_deb (it stays active and is read by no debater after C1), to hy4_flash, glm_legal, qwen_flash or alt_minimax31. Section 3 is reported to him as fact only: those three rows still read active in model_config, but no engine seat list holds them (ASK 437), and alt_minimax31 cannot seat.

## 5. CHECKS
Q1. Diff live against target: only Init Seats lines 13, 25 and 35 and Accept Build line 26 change; connections equal.
Q2. Init Seats offline on run 40781's input: the debater model is google/gemini-3.8-flash, and the panel, reserve and alternates equal 40781's except that hydrogen is in no list. The same with the challenger swapped to chatgpt vs grok gives the C6 panel above.
Q3. dash_debaters() row 3 reads gemini, google/gemini-3.8-flash, active true; dash_launch_odv1 accepts gemini (rolled-back test).
Q4. The rerun (the operator's "and rerun", 18:20 CST; the release card names the run and its cost, 1.73 to 4.03 USD on this pairing before 487): the same topic and pairing as 40958, challenger_model google/gemini-3.8-flash, no judge or alternate is hydrogen, the run ends success with run_cost_usd written (which also proves record_debate_row_tokens under 494 A2) and a Drive transcript. Run time is expected back in the 22 to 57 minute range.
Revert: the saved live engine JSON; the dash_debaters body before the change (prosrc b6084d5a).
