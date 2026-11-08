# pkgJGR (W2, 11-08): gemini and grok judge no more; panel terra, sol, qwen_flash

Eric (W3 thread, 21:08Z/21:10Z 11-08): "i want to remove grok and gemini pro .. they're getting too expense", "remove gemini and grok judges".
Third panel seat: qwen3.8-flash (seat qwen_flash), Eric's pick on W3's card. Seat qwen_flash: model_config row active (qwen/qwen3.8-flash,
openrouter, 64000), probed HTTP 200 (W4, Wall 3011); never yet judged live.

## n8n (base live s67 = live s68 for all 6 nodes; plan_JGR.json)
| Node | base | patched | change |
|---|---|---|---|
| Init Seats | 717ed6aebedc | bd876ec6df3c | ORDER0 ['gemini','chatgpt','qwen','sol','grok'] -> ['chatgpt','sol','qwen_flash','qwen']; JFAM_I + qwen_flash |
| Resolve Seats | 1b7062041862 | 321fe39cbe1b | JFAM + qwen_flash |
| Accept Build | 8b28d616a012 | cfe92a2710f3 | ORDER as ORDER0; ENG_SEAT + qwen_flash |
| Build Synthesis | 6be782556e0e | 0b346cff1513 | single-judge family map + qwen_flash |
| Build Independent Verdict | 6c4e6e4d004d | 51ebc43626e7 | same |
| Build Diagnostic Prompt | 8121ab566149 | 312cd7ee2154 | same |
qwen stays in ORDER0 as before (NOT_PANEL and JUDGE_TIME_REMOVED keep it off every seat).

## DB (fix_JGR.sql, revert_JGR.sql; md5-guarded, anchored once)
- odv1_record_panel_substitution: gemini and grok leave the seat list (ef13ee23 -> df56563d).
- odv1_record_panel_alternates: refuses gemini and grok (2967885d -> 4c0ba26e).
- model_config: untouched. gemini and grok stay active because they may debate.

## Result (test_JGR.cjs, every saved run with Init Seats input; 100 OK, 0 FAIL)
Panel {chatgpt, sol, qwen_flash} (order by the JFL rule as before), single judge chatgpt (was gemini), synthesis and diagnostic the same,
no reserve, no alternates; gemini and grok in no seat. Resolve Seats judges terra, sol, qwen/qwen3.8-flash, all openrouter. Accept Build asks
chatgpt, sol, qwen_flash (posture), and qwen_flash's body carries its model. The test marks qwen_flash placed in the saved agreement, since no
saved run asked it.

## Risks (not fixed here; for Eric)
1. When an OpenAI model (terra or sol) debates, FAM_PANEL skips both terra and sol, so the panel cannot reach three and Init Seats fails closed.
2. The reserve and the alternate pool are empty: a failed panel seat has no substitute, so a judge failure costs the run.
3. qwen_flash has never judged a live run.
Display maps (Format Markdown) show the seat name qwen_flash as written.

Write order: fix_JGR.sql, then the 6 n8n nodes. Revert: the 6 s68 nodes, then revert_JGR.sql.
