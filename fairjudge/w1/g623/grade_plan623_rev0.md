GRADE ASK 623 plan rev 0 (ask623/w4/plan623.md 87989e36 at commit e6966763; measure ask623/w4/m1): PASS WITH N1 TO N3. COMMIT: this file.
RULES READ: ASK 623 draft 2 and ruling 541 ("Plan it as drafted"); op doc v145 ASK FORM and TWO LIVE RUNS; build rule (no model setting changed); ASK 599; ASK 601; ruling 537/ASK 608; NEVER TOUCH REASONING; ASK 616 practice (run the chosen path on today's data).
OBJECTIVE MET: yes, as a plan. The finding on the judge order is correct and is rightly put back to the operator; the plan adds no reasoning field and changes no existing model row.
STANDARD (ASK 599): plan; C9 binds the build.

THE MAIN FINDING, checked: odv1_judge_order_save refuses any save whose seat set differs from odv1_judge_order ("the order must hold exactly the seats it holds now, each once; a seat is added or dropped only by its own ASK"). So the pressed default "out of the order until he saves" cannot seat them later. Confirmed by my read of the function at 14:57 CST.

Other checks (my reads, 14:57 CST 11-24):
- DB md5s match the plan: dash_debaters 4a16cddc, dash_judge_lineup e19ac69b, odv1_record_panel_substitution c3d6061b, dash_odv1_debates 73825336, dash_odv1_judges 11462172. model_config_jfl is a view (relkind v).
- dash_debaters is read by dash_api, dash_launch_odv1, dash_queue: the three uses the plan names. Closes my N2 of the draft.
- hydrogen row: role engine, openrouter, google, active, 65536; argon the same at 64000. A neon row "as argon" fits odv1_judge_order_fault's needs.
- Live 94b682a0: ENG_SEAT occurs once in the whole workflow (never read). FAM_PANEL is in Init Seats only; JFAM in Init Seats, Resolve Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt. The plan's node list is right, and Accept Build correctly drops out.
- I ran t623o.cjs myself: output md5 55f9666a, byte-equal to out_t623o.txt. C3 90/90 equal; option A: 22 identical, 68 alternates tail only, 0 judge/reserve/enforcer changes; C2 132 pairings, 128 three judges, 4 stop (the ASK 608 glm cases), 102 no reserve. C4 and C5 lines as the plan states.
- Not verified by me: OpenRouter serving both ids (no route from my container). C1 settles it before the build.

N1: W4's note cites the plan as 2d7d36eb; the file in git (e6966763) and on the mount is 87989e36. Cite the md5 on the card from md5sum.
N2: the measure reads the model rows and order from data_608.json, a snapshot. The build's C2 must read model_config and odv1_judge_order fresh from the database at build time, and say so.
N3 (for the card): 8 new pairings, a Google debater against chatgpt or sol62 either way, seat spark, qwen4max, sonnet with no reserve and no alternate left (enforcer glm). One failed judge call there has no substitute. chatgpt against gemini is the same today, so this is not new, but the card should show the 8.

Option A is the smallest change and measured on today's engine; B and C are fairly stated. The order choice is the operator's.
