# ASK 437 plan rev 0 (W4): take the flash models and the named models out of debating, judging and the panel

Assigned: coordinator 9083, relaying the operator (21:24 CST 11-18): "I will remove all flash models from debating and judging and from the panel. We can start with HY4, ernie, ember, glm-legal, minimax, kimi, qwen 3.8, deepseek pro ... just make sure they're gone if they are". Separate from ASK 429. The enforcer model is not touched.

1. OBJECTIVE. No run can seat any of these as a debater, a panel judge, the reserve, an alternate or the single judge, and none is asked the posture agreement:
- gemini (google/gemini-3.8-flash), hy4_flash (tencent/hy4-flash), glm_legal (z-ai/glm-5.3-flashx-legal): flash models.
- hy4 (tencent/hy4), ember (meta/muse-ember), qwen (qwen/qwen3.8-max): named.
- MiniMax (alt_minimax3, alt_minimax31 = minimax-m3.1-flash): named; today reachable only as a dry-regrade qualify_alternate.
The rest of the seating stays in the operator's order (ruling 407 order, with these taken out).

2. ROLES. Planner and builder W4. Graders W1 and W2. Write: W4, on the operator's card in W4's thread. Engine manual: W3.

3. SCOPE. Engine only, two Code nodes, five lines. Child, Shared Library and model_config are not changed.
- Init Seats line 13 ENG (debater engines): drop gemini and qwen. A request naming either is refused at Init ("engine ... is not one of [...]").
- Init Seats line 25 ORDER0: ['chatgpt','sol','sol62','haiku','hydrogen','spark','qwen4max','argon','sonnet'] (ember, glm_legal, hy4, hy4_flash, gemini, qwen out). The panel, reserve, alternates and single judge all come from this list.
- Init Seats line 35 __ALT: ['haiku','hydrogen','spark','qwen4max','argon','sonnet'].
- Init Seats line 46 ALT_MODELS: {} (the two MiniMax models out; qualify_alternate then refuses every model).
- Accept Build line 26 ORDER (who is asked the posture agreement): the same list as ORDER0.
Left as they are: lookup maps that only describe a seat (FAM_PANEL, JFAM, JFAM_I, __JFAM2, ENG_SEAT, Format Markdown names). They seat no one.
SEARCH (live engine 06967796, child e1f2b1c4, library, model_config_jfl):
- Seat lists that choose seats exist only in Init Seats (ENG, ORDER0, __ALT, ALT_MODELS) and Accept Build (ORDER). Resolve Seats, the panel and alternate builders, and the single-judge builders (Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt) take their seats from Init Seats. The child and the library hold no seat list.
- The "deepseek" nodes that ran in runs 39266 and 38226 are all enforcer-side (Enforcer, Judge Enforcer, Reread, Close, Anticheat, Assume Check, Judge Contradiction). DeepSeek already cannot debate (Init line 20) or judge (NOT_PANEL). Not touched.
- ernie, kimi, qwen_flash, glm_flash are in no seat list today.

4. CRITERIA and DONE.
- C1. The target differs from live (on the ASK 429 target, ASK 412 stacking) only in the five lines above. Reasoning guard: no model-setting change. ASK 385 PASS. lib_sha unchanged. Child unchanged.
- C2. Seating trial (a437_w4/sim.cjs): Init Seats, live and target, run for every ordered pair of the 11 debater engines (110 pairs), all asked seats accepting, JFL moved as live (chatgpt, sol, grok, luna). Trial on the plan (rev 0): 0 pairs seat a removed model anywhere; the 38 pairs with a gemini or qwen debater are refused; every pair still gets a three-judge panel. For the 56 pairs with no OpenAI debater: panel sol62, chatgpt, sol and single judge chatgpt, both as today; reserve hydrogen or haiku; at least 3 alternates.
- C3. Replay of Init Seats and Accept Build on stored runs 39266, 38661, 38593, 38450, 38226: the removed seats are gone from panel_order, panel_reserve, alt_order, single_judge and the Accept seat list; panel_order and single_judge are equal to the stored values.
- C4. A dry request with qualify_alternate "minimax/minimax-m3" is refused by the target.
DONE when C1 to C4 pass, both grades are in, the write is read back (rbx 0 diffs), and the engine manual names the new lists.

5. WRONG-IF.
- A removed model is seated in any trial pair or replayed run (C2, C3).
- A pair that runs today loses its three-judge panel, or its single judge changes (C2).
- Alternates fall below 3 for a pair that can run. Trial: only pairs with chatgpt as a debater fall to 1 or 2 (reserve argon); OpenAI debater runs are refused by the operator's rule, so these do not run.

6. RUN EVIDENCE. ASK 417 entry: case = every run; mark = the first run's Init Seats output (panel_order, panel_reserve, alt_order, single_judge) and the Accept Build seat list hold none of the removed seats. Read from the n8n execution.

7. INPUTS IN GIT. This plan and sim.cjs at a437_w4/. Build outputs (targets, replay) go in the same folder.

8. STEPS.
1. W1 and W2 grade this plan. (No card.)
2. W4 builds on the ASK 429 target (or on the ASK 429 fetch-back if 429 is written first) and posts C1 to C4.
3. W1 and W2 grade the build.
4. W4 posts the write card in W4's thread. Undoable only by W4's revert file. (Waits on the operator's card.)
5. W4 writes and reads back; W3 writes the engine manual entry.
