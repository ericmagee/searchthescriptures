# ASK 593 BUILD: Haiku out of the debate engine in full. Build notes for grading, rev 0

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST.
- The operator's words (W3 thread): 01:15 CST "remove Haiku from lineup"; 01:16 CST "remove from debate engine in full". Ruling rows 518 and 519; Wall 11432 and 11433.
- Base: live engine 9bec145c and child 2d5bdc94. A second target is cut on the ASK 590 targets, in case 590 is written first. The write script uses whichever matches the live flow.
- Build: build/build593.cjs. Tests: build/t593.cjs (12 PASS, out_t593.txt). Migration: build/mig593.sql; revert: build/revert593.sql.

## 1. EVERY PLACE HAIKU STOOD, AND WHAT HAPPENS TO IT
ENGINE (17 nodes; afterwards no engine or child node holds the word "haiku"):
1. Init Seats:
   - the judge order ORDER0, and the alternates __ALT;
   - the debater key ENG, and the family maps FAM_PANEL and the call-family map;
   - the haiku-last rule. It is removed; it acts on nothing once haiku is gone.
   - the single judge's filter keeps "not sonnet" only.
2. Accept Build: the agreement order ORDER and ENG_SEAT.
3. Resolve Seats, Build Synthesis, Build Independent Verdict and Build Diagnostic Prompt: the call-family map entry.
4. Resolve Seats and D1 to D4 and C1 to C4 Build: the direct Anthropic id form now reads claude-(opus|sonnet|fable|mythos). A haiku model id is refused there.
5. Format Markdown and Failure Salvage: the display name "Claude Haiku".
6. Shared Library (engine and child), xkJsonModels: the cure note's model list loses "anthropic/claude-haiku-5.5". The Library Check pair passes.

DATABASE (mig593.sql, applied AFTER the engine write):
7. dash_debaters loses the haiku row. dash_launch_odv1 takes its keys from it, so the dashboard no longer offers haiku and a launch naming it is refused.
8. odv1_record_panel_substitution: haiku leaves its seat list. Only that word changes; its comment, which records history, keeps the old notes.
9. model_config row haiku: kept for history, set active = false, with a note. Undo: active true.

LEFT AS THEY ARE, with the reason:
10. dash_odv1_debates and dash_odv1_judges: a display-order list that names haiku, used to sort the judgments of past runs on the dashboard. It seats and routes nothing.
11. odv1_record_panel_alternates: haiku stands only in a comment. Its tests are by model_config, so an inactive haiku row cannot be admitted.
12. Past records (debate_results, debate_judgments, the fault ledger) are not touched.

## 2. WHAT A LAUNCH NAMING HAIKU IS TOLD
- From the dashboard: haiku is no longer in the list. A direct call to dash_launch_odv1 is refused by its own key check.
- At the engine (Init Seats): 'ORACLE_DEBATE_V1 Init refused: defender engine "haiku" is not one of [claude, chatgpt, gemini, grok, mimo, opus, glm, qwen4max, spark, sol62, deepseek].' This is test T3.5.

## 3. WHAT CHANGES IN THE LINE-UP (Init Seats replayed before and after, offline)
- The replay covered 270 cases: 11 debaters, every ordered pair, with no fault-ledger move and with sol or gemini moved. Haiku is seated in none of them after the write.
- No pair that ran before is refused.
- 78 cases change, every one of them a case where haiku sat. The next seat moves up.
- Four pairs lose their reserve and are left with no alternate:
  - chatgpt vs gemini, gemini vs chatgpt, gemini vs sol62 and sol62 vs gemini.
  - Their panel is spark, qwen4max and sonnet, with nothing behind it.
  - Before the write, haiku sat on these panels and sonnet was the reserve.
- PRE-EXISTING, NOT CHANGED (scope rule): the reserve recorder's seat list has never held qwen4max, yet Init Seats makes qwen4max the reserve.
  - Today that happens in 16 pairs; after the write, in 2 (gemini vs spark, spark vs gemini).
  - If such a reserve is used, its record raises.
  - This goes to the operator as its own question.

## 4. ORDER OF THE WRITE, AND REVERT
1. Engine and child first (write/write593.sh), then mig593.sql.
   - In the other order, Accept Build would find haiku in ORDER with no active row and stop every run.
2. Revert:
   - restore the engine and child from the copies saved before the write;
   - run revert593.sql;
   - restore dash_debaters from its definition saved before the write.
3. If ASK 590 is written first, the script takes the second target. If ASK 593 is written first, the ASK 590 write must be re-cut on it: its script refuses a live flow that differs from its base.
