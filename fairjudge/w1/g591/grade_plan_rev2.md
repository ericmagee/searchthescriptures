# W1 GRADE: ASK 591 plan rev 2 (judge order page)

GRADE: PASS with F1. COMMIT 06b0ddef (plan591.md 2d6b4f5e, W3). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Not the planner or builder.
RULES READ: ruling 512 (planned live), the scope rule, ruling 383, "never touch reasoning unless I instruct it", no system change without approval.
OBJECTIVE MET: yes. The operator sets the order on a page; the engine reads it live at every run; nothing is staged as a trial.

## Checked on live engine 9bec145c (my own fetch) and the database
1. Rev 2 change (1): ORDER0 and __ALT stand only in Init Seats; Accept Build holds `const ORDER=['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet']`; Pass Accumulate holds __ALTL only. TRUE.
2. Change (2), the haiku rule: Init Seats has `pfree.push(...pfree.splice(3).sort((x,y)=>(x==='haiku')-(y==='haiku')))`. After the first three free seats, haiku goes to the end. TRUE. Putting it to the operator (5A) is right: it decides who is reserve.
3. Change (3), S6: Init Seats uses the regrade token only for the token check, customData, regrade_dry and the question_trial switch; ORDER comes from ORDER0 with no regrade branch. TRUE (my error at 11414, owned at 11427).
4. Change (4), L3: odv1_record_panel_substitution's list is deepseek, chatgpt, mimo, qwen, alt_minimax31, sol, qwen_flash, luna, haiku, hydrogen, gemini, argon, spark, ernie, ember, sonnet, sol62. No qwen4max. TRUE.
5. Change (5), R2: Accept Models' parents are Dry Run Config and Library Check; Library Check's parent is Debate Start; Dry Run Config's is Manual Start. A read node between each start path and Accept Models stands before every model call. TRUE.

## Finding
F1. The single judge has a further rule the plan does not state. Init Seats: `single_judge:(free.filter(s=>s!=='haiku'&&s!=='sonnet'&&JUDGE_TIME_REMOVED.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0))[0]||null)`. Haiku and sonnet are never the single judge. Item 2.4 and L4 omit this, and S9/T2 must carry it: dash_judge_lineup and T2 take it as an input. Fix before build; no regrade of the plan needed if W3 adds it to 2.4, S9 and T2 and W4 confirms in the build.

## Notes
N1. The __ALT list also shapes the panel draw, not only the alternates: free seats not in __ALT come first, then fault-ledger-moved seats, then __ALT seats. So moving a seat between the page's two lists changes the panel draw. S8's two lists carry that; the card should say a seat in ALTERNATES sits on the panel only when fewer than three PANEL seats are free.

## Mistakes
Mine at 11414 (two facts) were owned at 11427 and are corrected in rev 2.
