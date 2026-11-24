# ASK 623 BUILD rev 0 (W4): Gemini 4 Neon and Gemini 4 Hydrogen as debaters and judges

Plan: ask623/w4/plan623.md 87989e36 (W1 PASS N1 to N3, Wall 11716). The operator pressed "Append both; run the 2 checks" at 15:01 CST 11-24 (option A).
C1 (the two paid check calls) passed: Hydrogen execution 42337, finish stop, 14,453 completion tokens; Neon execution 42339, finish stop, 16,582 completion tokens. No reasoning setting (ask623/w4/chk/).
Base: live engine 94b682a0 and child b9cd4e5c, fetched 15:43 CST 11-24 (base_*.json). DB rows and judge order v2 read 15:41 CST (data_623_db.json).

## What changes

Engine (build623.cjs -> target_engine_623.json, md5 e449c187). Five nodes; connections equal; seven ASK 623 tags.

| Node | Change | md5 before | md5 after |
|---|---|---|---|
| Init Seats | debater list ENG gains hydrogen and neon; FAM_PANEL gains neon:'google'; JFAM gains neon | 0579c436 | 4f5f1e7d |
| Resolve Seats | JFAM gains neon | 1ccc321b | 7b249264 |
| Build Synthesis | JFAM gains neon | 0d54cc5a | c9dcd887 |
| Build Independent Verdict | JFAM gains neon | ece7e0dc | 268c1be4 |
| Build Diagnostic Prompt | JFAM gains neon | 34cc106a | cea21f77 |

Database (write623.sql, md5 01b4aa75; seven blocks, each md5-gated, each anchor exactly once, each refuses and changes nothing if its object moved):
1. model_config: new row neon (google/gemini-4-neon, family google, openrouter, role engine, argon's endpoint, max_tokens 64000, active). No reasoning field. The hydrogen row is unchanged.
2. odv1_record_panel_substitution (c3d6061b): seat list gains neon.
3. dash_debaters (4a16cddc): rows 12 hydrogen "Gemini 4 Hydrogen" and 13 neon "Gemini 4 Neon" (launch picker, launch check, queue labels).
4. dash_judge_lineup (e19ac69b): FAM gains neon:google; JFAM_OR gains neon.
5. dash_odv1_debates (73825336) and 6. dash_odv1_judges (11462172): judge sort list gains neon (display only).
7. Judge order (option A): asserts version 2; runs odv1_judge_order_fault on the new order; appends hydrogen (alternate 6) and neon (alternate 7); log row saved_by 'ASK 623', so the order reads version 3.

Child: no change. Library: no change (LIB 802077b0878612c9).

## Criteria
- C2 (t623.cjs, out_t623.txt): 132 pairings. 128 seat three judges. 4 stop with the ASK 608 reason before any round (chatgpt/sol62 against glm, both ways), unchanged. No seated judge, reserve or alternate is of a debater's family (both-Anthropic aside) or runs a debater's model; no enforcer of a debater's family. ALL PASS.
- 12 pairings have no reserve and no alternate (named for the card): chatgpt vs gemini, gemini vs chatgpt, gemini vs sol62, sol62 vs gemini (as today), and the 8 new ones: chatgpt vs hydrogen, chatgpt vs neon, hydrogen vs chatgpt, neon vs chatgpt, sol62 vs hydrogen, sol62 vs neon, hydrogen vs sol62, neon vs sol62. These 8 (W1 N3) seat spark, qwen4max, sonnet with enforcer glm.
- C3a: 90 present pairings under order v2, live against target: 90 of 90 byte-equal. C3b: under v3, 22 identical, 68 change only in the alternates tail, 0 judge, reserve or enforcer changes. Live today refuses hydrogen and neon as debaters (Init).
- C4: Neon against Hydrogen, both ways: judges sol62, spark, sol; no Google seat; enforcer luna.
- C5: the 8 Google pairings against chatgpt or sol62: enforcer glm.
- C6 (dry623.sql, rolled back by its own RAISE; out_dry623.json; c6_623.cjs, out_c6_623.txt): all seven blocks apply; dash_judge_lineup equals the engine's Resolve Seats line-up (panel, reserve, alternates) on 128 of 128 seated pairings, 0 differ. The 4 ASK 608 stops are engine stops; the DB line-up does not model the enforcer (as today). Order version 3, neon row as above, dash_debaters lists 12 debaters ending hydrogen, neon; the fault check accepts neon on the panel.
- C7 (c7_623.sql, rolled back; out_c7_623.txt): before the write the substitution recorder refuses neon ("not a panel seat"). After it, odv1_record_panel_substitution and odv1_record_panel_alternates accept hydrogen and neon. G1 still refuses a Google alternate when a Google seat debates. No DELETE used.
- C8: standing set 31 PASS 0 FAIL on target and child, with S4 compile-all 290 of 290 engine and 67 of 67 child (out_standing_623.txt). Pair Library Check PASSES (out_pair_623.txt).
- C9 (ASK 599): no dead code (every added key is read by the table lookup it joins); ASK 623 tags on each changed line (7 in the engine, 10 in the DB script).

## Write order (on the press of the write card)
1. Run gate (no engine or child execution running).
2. write623.sql through the database tool with SET LOCAL truth.session_id.
3. write/write623.sh: rebuild, t623, standing set, live-equals-base check, revert copy, PUT engine, fetch back engine and child, standing on the fetch-back, pair Library check.
4. Read back: dash_judge_lineup for the 8 new chatgpt/sol62 pairings and Neon against Hydrogen; order version 3; audit_log row; Wall; W1 readback; W3 manual entry and AAR row.
Revert: revert_eng_623.json (written by the script before the PUT); the DB blocks are reversed by the same md5-gated replace with the strings swapped, the neon row set inactive, and the order restored through a log row.

## After the write
The operator moves hydrogen or neon on the Judge order page with Save when the operator wants them to judge. Run evidence per the plan: each seat in a live run in each role, two live runs per path.
