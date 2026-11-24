# W1 GRADE: ASK 593 build rev 0 (Haiku out of the debate engine in full)

GRADE: PASS. COMMIT 0ae0d40f (W4; notes 93e0315b). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Not the builder.
RULES READ: rulings 518 and 519 (the operator, 01:15 "remove Haiku from lineup", 01:16 "remove from debate engine in full"), 512 (live), the scope rule, the seat-change rule (both recorder functions read), never touch reasoning.
OBJECTIVE MET: yes. After the write no engine or child node holds "haiku"; the dashboard no longer offers it; a launch naming it is refused; no recorder admits it.

## Checked
1. Base: base_eng.json and base_child.json equal my live fetches of 9bec145c and 2d5bdc94 node for node, connections equal.
2. Rebuild: build593.cjs on the live base gives targets equal to target_engine_593.json and target_child_593.json (0 node differences, connections equal). On the ASK 590 targets (91de1679 / fd127191) it gives targets equal to the _on590 pair. Each anchor is counted, so a drifted base stops the build.
3. A scan of every node's parameters for /haiku/i on my rebuilt engine: 0.
4. Init Seats after: ORDER0 chatgpt, sol, sol62, gemini, spark, qwen4max, argon, sonnet; __ALT gemini, spark, qwen4max, argon, sonnet; the haiku-last line removed; the single-judge filter keeps "not sonnet". Accept Build ORDER matches.
5. t593 rerun by me: 12 PASS. 270 cases replayed; 78 change, each where haiku sat; 0 pairs that ran before are refused.
6. Database, read live:
   - Functions whose source holds "haiku": dash_debaters (row 6), dash_odv1_debates and dash_odv1_judges (display sort arrays), odv1_record_panel_alternates (a comment only), odv1_record_panel_substitution (the seat list and a history comment). No other function.
   - odv1_record_panel_alternates admits an alternate only where model_config mc.active AND role engine AND provider rules hold; with haiku inactive it cannot be admitted. Not changed: correct.
   - odv1_record_panel_substitution: the anchor 'luna','haiku','hydrogen' occurs once; the migration replaces only it; the comment keeps its history.
   - dash_debaters live equals the migration's text plus row (6,'haiku','Haiku','haiku'). dash_launch_odv1 takes v_eng from dash_debaters(), so a launch naming haiku is refused.
   - model_config haiku: active true now; the migration sets it false with a note. claude_synthesis and sonnet are sonnet-5.5; no debater routes to a haiku model, so the direct-Anthropic id form losing "haiku" breaks no route.
7. Write order in write593.sh: engine then child, base chosen by match (live or the 590 write), t593 and the Library pair rerun at write, fetchback compared; the migration after. Accept Build would stop every run if the order were reversed; the script keeps it.

## Rulings asked
- R1, the display arrays of dash_odv1_debates and dash_odv1_judges: LEAVE THEM. They only sort the judgments of past runs, which hold haiku judgments; removing haiku would push those to the end. They seat and route nothing. Scope rule.
- R2, qwen4max as reserve but absent from the substitution recorder: PRE-EXISTING, out of this ASK's scope. 593 lowers it from 16 pairs to 2 (gemini/spark, spark/gemini). It goes to the operator as its own question with ASK 591's L3.

## For the card
- C1: four pairs (chatgpt/gemini both ways, gemini/sol62 both ways) are left with panel spark, qwen4max, sonnet and no reserve or alternate. A judge fault in those debates has no seat to take its place. State it plainly.
- C2: "in full" is met in the engine, child, dashboard and recorders. The model_config row is kept, inactive, for the history of past runs; say so, and that deleting it is a choice he can make.
- C3: if 593 is written before 590, the 590 write must be re-cut on it (its script refuses a changed base). If 590 is written first, 593 takes its second target.
- C4: ASK 591 rev 3 names haiku in its seed and in 5A; on 593's write W3 revises 591 (the haiku card becomes moot).

## Mistakes
None of mine found in this grade.
