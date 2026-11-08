# pkgJGR (W2, 11-08): gemini and grok judge no more; panel terra, sol, qwen_flash

Eric (W3 thread, 21:08Z/21:10Z 11-08): "i want to remove grok and gemini pro .. they're getting too expense", "remove gemini and grok judges".
Third panel seat: qwen3.8-flash (seat qwen_flash), Eric's pick on W3's card. Seat qwen_flash: model_config row active (qwen/qwen3.8-flash,
openrouter, 64000), probed HTTP 200 (W4, Wall 3011); never yet judged live.

## n8n (base live s68; the 6 seat nodes are also byte-equal in s67; plan_JGR.json)
| Node | base | patched | change |
|---|---|---|---|
| Init Seats | 717ed6aebedc | bd876ec6df3c | ORDER0 ['gemini','chatgpt','qwen','sol','grok'] -> ['chatgpt','sol','qwen_flash','qwen']; JFAM_I + qwen_flash |
| Resolve Seats | 1b7062041862 | 321fe39cbe1b | JFAM + qwen_flash |
| Accept Build | 8b28d616a012 | cfe92a2710f3 | ORDER as ORDER0; ENG_SEAT + qwen_flash |
| Build Synthesis | 6be782556e0e | 0b346cff1513 | single-judge family map + qwen_flash |
| Build Independent Verdict | 6c4e6e4d004d | 51ebc43626e7 | same |
| Build Diagnostic Prompt | 8121ab566149 | 312cd7ee2154 | same |
qwen stays in ORDER0 as before (NOT_PANEL and JUDGE_TIME_REMOVED keep it off every seat).

## Revision 2 (W3 FAIL, Wall 3409): pkgPNL3's reasoning rule, for qwen_flash only
33530: qwen/qwen3.8-flash spent all 64,000 tokens on reasoning and returned no content; live s68 still sends it that body. The rule from pkgPNL3,
narrowed to the one model: __orc adds reasoning {effort:'low'} to a body whose model is exactly qwen/qwen3.8-flash and that sets no reasoning.
- n8n: Panel Build d5544003283e -> 1365bf01ccb8; Reserve Build 1a23a0c2a327 -> b6f09af9dd8c; Accept Build (with the seat edits) -> 04bba2849249.
- Library: Alternate Build and R2 Alternate Build (base s68 strip_RTB4_8 -> pkgLIB/strip_JGR). Pack pkgLIB_JGR: Shared Library f071318370ae;
  stubs changed: Alternate Build, R2 Alternate Build. E4 rebase on fetchback_live_s68: Alternate Build def27c04a8a1, Early Alternate Build
  ebca2ac30170, each rebuilding byte-equal to the strip_JGR full source (313961).
- test_JGR_bodies.cjs (test_JGR_bodies.txt) 9 OK, 0 FAIL: every base-vs-patched difference is reasoning effort low on a qwen/qwen3.8-flash body
  (33530 Panel Build slot 3, Accept Build posture body; 33815/33828 Panel Build no change; Reserve Build glm_flash unchanged, and with a
  qwen_flash reserve gains the field); library sources differ by the one line; __orc leaves qwen max and terra alone and keeps a set reasoning.
- Before the first run: W4 off-run call with the stored 33530 slot-3 body plus reasoning effort low (finish_reason, reasoning_tokens).

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

Write order: fix_JGR.sql, then the 8 n8n nodes, the library pack (Shared Library, Alternate Build and R2 Alternate Build stubs) and the E4 heads.
Revert: the s68 nodes (prewrite copy), then revert_JGR.sql.
