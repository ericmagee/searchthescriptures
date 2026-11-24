# ASK 623 PLAN rev 0 (W4): Gemini 4 Neon and Gemini 4 Hydrogen join the debate as debaters and as judges

Base: W3's draft 2 (ask623/w3/ask623_draft2.md 6727a6c3), pressed "Plan it as drafted" 14:48 CST 11-24 (ruling row 541), with W1's N1 and N2 (Wall 11708). Live base: engine 94b682a0, child b9cd4e5c, LIB 802077b0878612c9; dashboard prod dpl_HpfP. The build re-fetches live and names its base.

## OBJECTIVE
The operator can choose Gemini 4 Neon or Gemini 4 Hydrogen as either debater, and can place each as a panel judge or an alternate on the Judge order page. Both seats stand under every rule that binds the present seats: no judge of a debater's family; no judge running a debater's model (ASK 601); the enforcer never of a debater's family (ASK 608); a panel of exactly three. LIVE on write (ruling 512).

Pressed defaults (Q1 to Q4): Hydrogen runs from its present row as it stands (65,536); Neon gets a new row at 64,000; no reasoning or effort field anywhere; the old gemini_deb row stays as it is.

## ONE FINDING THAT CHANGES A PRESSED DEFAULT (put to the operator on a card)
Q3's default was "both seats stay out of the order until he saves". The page cannot do that. `odv1_judge_order_save` refuses any save whose seat set differs from the seats now in `odv1_judge_order`: "the order must hold exactly the seats it holds now, each once; a seat is added or dropped only by its own ASK". So the page can only reorder the eight seats it holds today. Unless this ASK puts Hydrogen and Neon into the order, the operator can never seat them as judges.

Options, measured offline (ask623/w4/m1/t623o.cjs, out_t623o.txt):
- A (recommended): the build adds hydrogen and neon at the END of the alternates list (alternates 6 and 7), and writes an `odv1_judge_order_log` row (saved_by 'ASK 623'), so the page and the engine's JUDGE ORDER line read version 3. On the 90 present pairings: 22 are identical, and 68 change only in the alternates list's tail (hydrogen and neon follow sonnet). No judge, reserve or enforcer changes on any present pairing. The operator then moves them on the page with Save.
- B: the build changes `odv1_judge_order_save` and the Judge order tab so the page can add a seat that has an active engine row and is on the reserve recorder's list. The seats stay out until he adds them. This touches a DB function and the dashboard, and is a larger change.
- C: the operator names their places now, and the build writes that order. C2 is re-run on his order before the write card.

The plan below is written for A. The parts that change under B or C are marked [B] and [C].

## ROLES
- W4 plans, builds and writes. A write happens only on a press of W4's own card.
- W1 grades the plan and the build, then does the readback after the write.
- W3 drafts the engine manual entry and the ASK AAR row (ASK 620).
- The coordinator relays.

## SCOPE, with SEARCH (done 14:50 to 15:00 CST 11-24 on the live engine 94b682a0, child b9cd4e5c, the database, and the dashboard source)

### Searched and found: changes
1. **model_config.** Add a new row `neon`: google/gemini-4-neon, family google, provider openrouter, role engine, endpoint https://openrouter.ai/api/v1/chat/completions (as argon), active, max_tokens 64000. The `hydrogen` row is unchanged. `model_config_jfl` is a view over model_config (relkind v), so it needs no row.
2. **Init Seats** (engine):
   - Debater list `ENG`: add `hydrogen:{fam:'openrouter',mc:'hydrogen'}` and `neon:{fam:'openrouter',mc:'neon'}`.
   - The debater keys MUST equal the seat names. `FAM_PANEL[D.engine]` (the debaters' families) and the DB functions' `CASE e.eng ... ELSE e.eng` (the debaters' models) both look the debater up by its key.
   - `FAM_PANEL`: add `neon:'google'`. `JFAM`: add `neon:'openrouter'`.
3. **JFAM tables** in Resolve Seats, Build Synthesis, Build Independent Verdict and Build Diagnostic Prompt: add `neon:'openrouter'` beside hydrogen.
4. **DB functions with fixed seat lists** (md5-gated exact replaces, as fix601_db.sql):
   - `dash_debaters` (md5 4a16cddc): add `(12,'hydrogen','Gemini 4 Hydrogen','hydrogen')` and `(13,'neon','Gemini 4 Neon','neon')`. This one list feeds the launch picker (dash_api odv1_engines), the launch check (`dash_launch_odv1` v_eng) and the queue labels (`dash_queue`). W1's N2 is covered here.
   - `dash_judge_lineup` (e19ac69b): FAM add `"neon":"google"`; JFAM_OR add 'neon'.
   - `odv1_record_panel_substitution` (c3d6061b): v_seats add 'neon' (hydrogen is there). `odv1_judge_order_fault` refuses a seat that is not on this list, so this comes before the order rows.
   - `dash_odv1_debates` (73825336) and `dash_odv1_judges` (11462172): judge sort list add 'neon' after 'hydrogen'. This is display order only.
5. **odv1_judge_order** [A]: insert hydrogen (alternate 6) and neon (alternate 7), plus one `odv1_judge_order_log` row (before/after lists, saved_by 'ASK 623'). [B: no rows; the save function and the tab change instead. C: his order, written through odv1_judge_order_save's own checks.]
   - Write order: the neon row first, then the substitution list, then the order rows. `odv1_judge_order_fault` requires an active role-engine row and the recorder's list.

### Searched and found: no change, with the reason
- **Accept Build `ENG_SEAT`.** It is defined once and never read in the whole engine (whole-workflow grep: one hit). Adding neon would be dead code (ASK 599 rule 1). No change. The draft listed it; this corrects that.
- **Model-pattern code.** Every Google match in the engine, the child and the Library is by pattern, `/^google\//` or `/^(?:google|qwen|openai|anthropic)\//`: the message shaping in the Build nodes and the Shared Library, the provider handling in every "Call openrouter" expression, and Accept Build's body. So Neon is handled exactly as Hydrogen and Argon are, with no list to extend. No reasoning field is added anywhere ("NEVER TOUCH REASONING").
- **Cost.** `record_debate_row_tokens` keeps OpenRouter's billed figure ("billed"); `model_prices` holds only three direct-API models. A Neon or Hydrogen call is not stored as "no price". No change.
- **Names in reports.** Format Markdown and Failure Salvage build a seat's name from its model id first (MN: google/gemini-4-neon reads "Gemini 4 Neon"), then fall back to a NAME table. Format Markdown's judge sort list (`ORDER`) already omits sol, sol62, spark, argon and sonnet; unknown seats sort first. No change; display only.
- **Prompt text naming seats.** No prompt text lists judges or debaters by name (searched for Argon, Hydrogen, Gemini 4, Gemini Flash, Qwen 4, Grok).
- **Dashboard.** The launch picker is filled from `dash_debaters()`. The static `ODV1_ENG` list in odv1.js is only the fallback when that read fails, and it already holds hydrogen. Names come from the model id (odMName). Read from the ASK 591 copy (ask591/w4/dash_live); the build re-reads odv1.js and the Judge order tab from live dpl_HpfP before claiming no change. [B: the tab changes.]
- **Child.** It names neither seat.
- **odv1_record_panel_alternates, odv1_judge_order_save, odv1_judge_order_fault.** They work from model_config and the order table, not from seat lists. No change under A.

### NOT IN SCOPE (noted)
- The four ASK 608 fail-closed pairings (glm against chatgpt or sol62, both ways) are unchanged.
- The old `gemini_deb` row (Hydrogen, inactive) stays as it is (Q4).

## CRITERIA AND DONE
- **C1. Paid check calls, on their own card.** These are one call per model through OpenRouter, using the engine's own debater body (D1 Build's shape, no reasoning or effort field). Before the call, read each model's OpenRouter page. Record finish_reason, completion tokens and reasoning tokens (R1: Hydrogen spent 58,777 of 64,000 tokens on reasoning on 11-12). A complete answer passes. If the answer is cut off, the ASK returns to the operator with the measurement. Both ids are already confirmed as served by OpenRouter's public models list: Neon has context 1,048,576 and max output 943,718; Hydrogen is listed; both accept max_tokens and temperature.
- **C2. All pairings, offline (done on live 94b682a0 with option A, out_t623o.txt).**
  - 12 debaters give 132 pairings. 128 seat exactly three judges. 4 stop with their stated reason, before any judge call: the ASK 608 glm cases, unchanged.
  - No seated judge or reserve is of a debater's family (both-Anthropic exception aside) or runs a debater's model. No OpenAI pairing keeps luna as enforcer.
  - The no-reserve list (102 in the harness) is shown on the write card. The harness shows reserve null on most present pairings today too (t608), so it is listed, not judged.
  - The build re-runs this on its target with the real node code.
- **C3.** On the 90 present pairings, under order v2, the seat tables added change nothing: 90 of 90 byte-equal (done). Under A, no judge, reserve or enforcer changes; only the alternates tail (done).
- **C4. Neon against Hydrogen, both ways:** judges sol62, spark, sol; no Google seat; enforcer luna (done).
- **C5. A Google debater against chatgpt or sol62:** enforcer glm; judges spark, qwen4max, sonnet (done).
- **C6.** `dash_judge_lineup` for each new pairing equals the engine's line-up (the T5 check of ASK 601, fairjudge/w1/g601).
- **C7.** `odv1_record_panel_substitution` and `odv1_record_panel_alternates` accept hydrogen and neon. This is tested in a rolled-back transaction, with no DELETE.
- **C8.** ASK 612's compile-all passes on the target. The standing set passes (31/0). The pair Library check passes (Library untouched).
- **C9. Coding standard ASK 599:** no dead code; ASK 623 tags on changed lines.
- **DONE:** built, graded, written on the card, read back, and the manual entry written. Each new seat is seen in a live run in each role it is given. TWO LIVE RUNS applies to each path.

## WRONG-IF
- OpenRouter does not serve an id, or C1's answer is cut off.
- A seat list exists that the search missed.
- Any present pairing's judges, reserve or enforcer change without the operator's Save.
- A Google debater leaves a pairing with fewer than three judges, and this is found by a run instead of by C2.
- Any node other than Init Seats, Resolve Seats, Build Synthesis, Build Independent Verdict or Build Diagnostic Prompt changes.
- Any DB object other than those named above changes.

## RUN EVIDENCE (ASK 417)
- For each new debater: a debate_results row naming it as defender or challenger, with all eight rounds and a judgment.
- For each new judge seat (after his Save places it): a JUDGE ORDER line that seats it, and its row in debate_judgments.
- Registry case: "ASK 623 new seats", marked by seat and role.

## INPUTS IN GIT
- ask623/w3/ask623_draft2.md 6727a6c3.
- ask623/w4/m1/t623o.cjs and out_t623o.txt (this measure).
- ask608/w4/b1/data_608.json (order v2 and model rows) and ask608/w4/write/fetchback_eng_608.json (live 94b682a0).
- ask601/w4/b1/fix601_db.sql (DB replace form).

## STEPS, with their cards
1. Plan rev 0 to W1 for grade (Wall root 11613).
2. One card to the operator: the order option (A/B/C) and the two paid check calls, together, after the grade (coordinator 14:54 CST).
3. C1 check calls on his press.
4. Build on a fresh live fetch: engine nodes, DB script, C2 to C9. W1 grades the build.
5. Write card, carrying C2's list.
6. On the press: run gate, DB script, PUT the engine, fetch back, audit, Wall, W1 readback, memory. W3 writes the manual entry.
7. Under A, the operator moves the new seats on the Judge order page when he wants them to judge.
8. Live runs.
