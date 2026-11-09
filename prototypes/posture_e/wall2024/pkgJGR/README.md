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

## Restack on pkgKWI (Wall 3416 order: KWI first, then JGR)

The 8 n8n nodes and fix_JGR.sql are unchanged (KWI's n8n nodes are the 3 enforcer builds; no overlap).
Library: the same qwen_flash effort-low rule added to Alternate_Build.js and R2_Alternate_Build.js of strip_KWI.

- Build: `JGR_LIB_BASE=strip_KWI JGR_LIB_OUT=strip_JGR_KWI node pkgJGR/build_JGR.cjs` (defaults unchanged; plan in plan_JGR_KWI.json)
- Strip pkgLIB/strip_JGR_KWI: vs strip_KWI only those 2 files differ, each by the one inserted rule (checked by re-inserting).
- Pack pkgLIB_JGR_KWI: Shared Library 15db65d8dc08. vs pkgLIB_KWI_s68 only Shared_Library.js, Alternate_Build.js, R2_Alternate_Build.js differ.
- E4 rebase (new stub lines 1-8 + live s68 lines 9+): Alternate Build 5c3021cc9e65, Early Alternate Build 9c46fdee804b; both rebuild to strip_JGR_KWI Alternate_Build (315134 = __N, equal).
- Test: test_JGR_bodies_KWI.txt 9 OK, 0 FAIL.

Write order with KWI: pkgKWI in full first, then fix_JGR.sql, the 8 JGR n8n nodes, pkgLIB_JGR_KWI (Shared Library + Alternate Build + R2 Alternate Build stubs) and the E4 heads above. If JGR is written alone (no KWI), use pkgLIB_JGR as before.

## Restack on pkgKWI rev 2 (ebc12ba; Wall 3424-3427): pkgJGR/on_KWI
KWI rev 2 also changes Panel Build, Reserve Build and Accept Build, so the 8 JGR n8n nodes are rebuilt on KWI's patched nodes where KWI has them
(s68 elsewhere): `JGR_NODE_DIR=pkgKWI/patched JGR_NODE_OUT=pkgJGR/on_KWI/patched JGR_LIB_BASE=strip_KWI JGR_LIB_OUT=strip_JGR_KWI node pkgJGR/build_JGR.cjs`.
- Accept Build 2d5bb0d231e3 -> 0e3c897c4545; Panel Build 1589ccee3cc1 -> 77c4eb2aafd0; Reserve Build 6fe983c85cf0 -> ac0ae6051997.
  The other 5 nodes are as before (KWI does not touch them): Init Seats bd876ec6df3c, Resolve Seats 321fe39cbe1b, Build Synthesis 0b346cff1513,
  Build Independent Verdict 51ebc43626e7, Build Diagnostic Prompt 312cd7ee2154.
- Check: for each of the 8 nodes, the lines JGR adds and removes on the KWI base equal those it adds and removes on s68 (so KWI's changes are kept).
- Tests on this base (same env): on_KWI/test_JGR.txt 100 OK, 0 FAIL; on_KWI/test_JGR_bodies.txt 9 OK, 0 FAIL. Plan: on_KWI/plan_JGR_KWI.json.
- Library: unchanged from the section above (pkgLIB_JGR_KWI, SL 15db65d8dc08, E4 5c3021cc9e65 / 9c46fdee804b).
Write order: pkgKWI rev 2 in full, then fix_JGR.sql, the 8 nodes from on_KWI/patched, pkgLIB_JGR_KWI and its E4 heads.

## Revision 3: mimo in qwen_flash's place (Eric 07:14Z 11-09, "we mimo as an alternate", after the qwen flash check failed, W4 3446): pkgJGR/mimo
Build: `JGR_THIRD=mimo JGR_NODE_OUT=pkgJGR/mimo/patched JGR_LIB_BASE=strip_KWI JGR_LIB_OUT=strip_JGR_MIMO JGR_PLAN_OUT=pkgJGR/mimo/plan_JGR_mimo.json node pkgJGR/build_JGR.cjs /mnt/project-files/wall2024/fetchback_live_s71.json`
(without JGR_THIRD the build reproduces on_KWI and strip_JGR_KWI byte for byte; checked).
- Model: OpenRouter xiaomi/mimo-v2.6-pro (model_config seat mimo api_model; /api/v1/models/xiaomi/mimo-v2.6-pro/endpoints read 11-09: 5 endpoints incl. Xiaomi, all support reasoning).
  The engine already routes seat mimo through openrouter (JFAM mimo:'openrouter'; Panel/Reserve Build xiaomi/ branch: max_tokens max(64000,65536)=65536, no temperature).
- n8n (bases = live s71, restacked after WLD went live; 4 nodes, fewer than qwen_flash because mimo is already in every family map and ENG_SEAT):
  Init Seats 717ed6aebedc -> 21acedf61a53 (ORDER0 chatgpt, sol, mimo, qwen); Accept Build 2d5bb0d231e3 -> 956c8f2682fd (ORDER; __orc rule);
  Panel Build 40a89f70b6d7 (WLD) -> fdc42c4b0ee4; Reserve Build 6fe983c85cf0 -> 3a1b147c0ba7 (__orc rule).
- Rule (pkgPNL3's, narrowed to mimo): a body whose model is exactly xiaomi/mimo-v2.6-pro and that sets no reasoning gets reasoning {effort:'low'}.
  Why: mimo was dropped as a judge 11-03 because its reserve calls spent the whole 65,536-token limit (32471, 32482); BB-5700 8a: thinking on did not answer in 900 s.
- Library: Alternate Build, R2 Alternate Build get the same rule (strip_KWI -> strip_JGR_MIMO). Pack pkgLIB_JGR_MIMO: Shared Library f26dc10af647; E4 on s70: Alternate Build 70eccb840c00, Early Alternate Build 3770f7852805.
- DB: fix_JGR.sql unchanged (still removes gemini and grok; mimo is already in the substitution list, and the alternates function accepts provider xiaomi with an xiaomi/ model, pkgMIM2).
- test_JGR_mimo.cjs (mimo/test_JGR_mimo.txt), base fetchback_live_s71: 109 OK, 0 FAIL. Every saved run: panel chatgpt, sol, mimo; single chatgpt; no reserve, no alternates;
  Resolve Seats judges terra, sol, xiaomi/mimo-v2.6-pro (openrouter); Panel Build 33530/33815/33828/33846 mimo body 65536 + effort low, terra/sol no reasoning; Accept Build asks chatgpt, sol, mimo.
- Risks: mimo also debates; a debate where mimo is a debater gets a 2-judge panel (terra, sol), and with an OpenAI debater only mimo is left (as with qwen_flash). No saved run has mimo debating.
  mimo's speed as a judge with effort low is unmeasured: W4's one off-run check call decides.
- Check-call body: mimo/check_body_33530.json (also /mnt/project-files/wall2024/jgr_mimo_check_33530.json): the patched Panel Build's mimo body on saved run 33530.
