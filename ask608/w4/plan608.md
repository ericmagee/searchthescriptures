# ASK 608 PLAN rev 0 (W4): the enforcer is never of a debater's family

## OBJECTIVE
Operator ruling 13:13 CST 11-24 ("Bar it", card cmsg_017ZQamDMHrS6fqMHnQDVo58EhAazBkmJHVCbK6fLbzhJF; md_notes_rulings row 537 of seat 33): the enforcer may not be of the same model family as a debater. Today the enforcer is always seat luna (openai/gpt-6-luna, family openai). Every listed pairing has an OpenAI debater (chatgpt = openai/gpt-6.1-terra, sol62 = openai/gpt-6.2-sol), so luna is barred in all of them, and the engine needs another enforcer. LIVE on write (ruling 512).

Which seat replaces luna is the operator's to choose (a model setting). It is put to him on card cmsg_017ZQamDMHrS6fqMHnQDVo5897VRzyNGNssQEmL9fwdkEF with three options:
- A (recommended): the next seat in his saved judge order;
- B: one fixed backup seat he names;
- C: refuse the run.
This plan is written for A. The parts that change under B or C are marked [B] and [C].

## ROLES
- W4 plans, builds and writes. A write happens only on a press of W4's own card.
- W1 grades the plan and the build, then does the readback after the write.
- W3 drafts the engine manual entry and the ASK AAR row.
- The coordinator relays.

## SCOPE, with SEARCH
Search: the live engine fbc09389 and child b9cd4e5c (fetch-backs in ask611/w4/write), every node's parameters for "luna" and ".enforcer"; and the public functions for "luna" or "enforcer".

Found:
- Resolve Seats sets the enforcer, with `const enf=need('luna')`. It puts out `enforcer:{seat:'luna',api_model,max_tokens}`. This is the only place the enforcer is chosen.
- Six readers take `RS.enforcer`, unchanged: Enforcer Build, Anticheat Build, Close Enforcer Build, Judge Contradiction Build, Assume Check Build, and the Shared Library (both workflows; the Judge Enforcer path). No change is needed in them; they follow whatever seat Resolve Seats names.
- Other "luna" hits are seat-to-family or seat-to-provider tables (Init Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt, Accept Build, dash_judge_lineup, odv1_record_panel_substitution), and the Library's xkJsonModels list (keyed by model, a JSON-format note). None of them picks the enforcer. No change.
- NOT IN SCOPE, for the operator's notice: Resolve Seats also sets `deepseek: M['deepseek']||enf`. Seat deepseek_debate is inactive, so the Independent Verdict (A2) call and the Diagnostic Prompt run on luna's model too. Ruling 608 names the enforcer only, so this plan keeps those two exactly as today (they keep luna). If the operator wants the ruling to reach them, that is a separate ASK.

Change, in Resolve Seats only (engine; the child has no Resolve Seats):
1. Keep `enf=need('luna')` for the deepseek fallback, unchanged.
2. Add the ASK 608 test: luna is barred when its family (model_config family) is one of the debaters' families, or its model is a debater's model (ASK 601's model match).
3. When luna is barred, under A: walk the saved judge order, `S.judge_order.panel` and then `S.judge_order.alternate`. Take the first seat that meets all of these:
   - it has an active model_config row with api_model and max_tokens above 0, and is an OpenRouter seat (JFAM);
   - its family is not a debater's family (no both-Anthropic exception, because the ruling has none);
   - its model is not a debater's model;
   - it is not in panel_order, is not the reserve, and is not the single judge.
   That seat is the enforcer, and it is removed from the alternates list for this run, so it never both judges and enforces. If no seat qualifies, the run fails closed before any call, with the reason. [B: take the one named seat with the same checks, or fail closed. C: fail closed whenever luna is barred.]
4. The output carries `enforcer:{seat:<chosen>,api_model,max_tokens}`, so every reader names the right seat. It also adds `enforcer_barred:{seat:'luna',why}` when luna was replaced, and sets `$execution.customData.set('enforcer_seat',<seat>)`.
5. No DB change. The dashboard does not show the enforcer today, and this plan does not add it.

## CRITERIA AND DONE
- T1: Resolve Seats is run old against new, offline, on every pairing the engine accepts against today's model_config (the 90 engine pairs of ASK 601's t1_601).
  - Where no debater is OpenAI, the output must be byte-equal to today's (luna stays).
  - Where a debater is OpenAI: the enforcer is the first qualifying seat of the saved order; that seat is gone from the alternates; and everything else is equal to old.
- T2: on today's saved order (panel sol, sol62, spark; alternates terra, qwen4max, gemini flash, argon, sonnet), the chosen enforcer for each of the four listed pairings is listed in the build notes, for the operator to see before the press.
- T3: no seat at all qualifies, so Resolve Seats fails closed with the reason.
- T4: the standing set passes 29/0, and the pair Library check passes (Library untouched).
- T5: coding standard ASK 599: no dead code; ASK 608 tags on the changed lines.
- Done when: it is written live, W1's readback matches, and the first two live runs show the enforcer seat in customData, not of a debater's family, with enforcer rows recorded.

## WRONG-IF
- Any output changes in a pairing with no OpenAI debater.
- The chosen enforcer also sits as a judge, the reserve, or an alternate in the same run.
- The Independent Verdict or Diagnostic Prompt model changes (out of scope).
- Any node other than Resolve Seats changes.

## RUN EVIDENCE (ASK 417)
Run 42071 (11-23): enforcer openai/gpt-6-luna against defender openai/gpt-6.2-sol. On the enforcer's send-back, gemini changed BROKEN to HELD, and the enforcer told qwen4max and spark that the right grade was STANDS for the defender (W3 draft 2, item 608, ask603/w3/judge_enforcer_asks_draft2.md 80d823bd).

## INPUTS IN GIT
- ask603/w3/judge_enforcer_asks_draft2.md 80d823bd (item 608).
- Live fetch-backs ask611/w4/write/fetchback_eng611.json (fbc09389) and fetchback_child611.json (b9cd4e5c).
- ask601/w4/b1/t1_601.cjs (pair harness to reuse).

## STEPS, with their cards
1. Plan rev 0 to W1 for grade (Wall root 11613), while the operator answers the A/B/C card.
2. Build on a fresh live fetch (base named), with T1 to T5. Then W1 grades the build.
3. Write card to the operator ("Write it" / "Hold"), naming the enforcer each listed pairing would get.
4. On the press: run gate, PUT the engine, fetch back, then audit, Wall, the W1 readback, and memory. W3 writes the manual entry and the AAR row.
