# pkgPNL3 (W2, 2026-11-07 CST): the flash judges leave room for the verdict

Fault (run 33530, W4 Wall 3047; checked on the saved inputs): qwen/qwen3.8-flash (panel slot 3, provider Alibaba) returned finish_reason length,
content null, 64,000 completion tokens all reasoning (230,790 characters). The reserve z-ai/glm-5.3-flash (provider Z.AI) did the same
(63,988 reasoning tokens, 235,317 characters, 1,332 s). The bodies sent carried no reasoning setting. Second failure, so the run stopped fail-closed.

Change: one line in __orc, the helper every judge body builder passes its body through (Panel Build, Reserve Build, Accept Build, and Alternate
Build in the library). For an openrouter body whose model starts qwen/ or z-ai/, and that has no reasoning field yet, add reasoning {effort:'low'}.
For xiaomi/ (mimo), add reasoning {enabled:false} if absent: Panel Build was the one judge builder without it (BB-5700 step 8a).
Why effort and not enabled:false: OpenRouter's reasoning docs say effort "none" (off) is refused by models whose reasoning is mandatory, and the
z-ai GLM entry seen in the models list (glm-5.3-prime) is mandatory with efforts max/high/low. effort is accepted by both kinds; for budget
models OpenRouter turns it into a share of max_tokens (low is about 20%, so about 12,800 of 64,000).
Cure, send-back, gate and accept-return bodies are deep copies of these bodies (cureBody, {...j.body}), so they inherit the field.
max_tokens stays 64000.

Bases: Panel Build = live s53 (19a70deba2a7 -> af0e0fa1f4a6); Reserve Build = pkgRMT/patched (fadf5fd8fc43 -> b0d38d102c01);
Accept Build = pkgPNL2/patched (4dd28adff715 -> 7e4a0c0325af); Alternate Build = library layer pkgLIB/strip_PNL3 on the v14_KCR2 layers,
packed as pkgLIB_v15_PNL3: only the Alternate Build stub changes (cce335deb6aa -> 989b3f52e960); Shared Library is byte-equal to v14_KCR2.
Write order: after pkgRMT, pkgPNL2 and LIB v14_KCR2 (or with them in the same gap): Panel Build, Reserve Build, Accept Build, Alternate Build stub.
Revert: base/*.js for the three nodes; v14_KCR2 Alternate Build stub.

Build: `node pkgPNL3/build_PNL3.cjs`, then `node pkgLIB/pack.cjs <v14_KCR2 base layers> pkgLIB/strip_PNL3` (copied to pkgLIB_v15_PNL3; pkgLIB/patched restored).
Test: `node pkgPNL3/test_PNL3.cjs` (test_PNL3.txt): 23 OK, 0 FAIL, on the saved 33530 inputs:
- Panel Build base code reproduces the stored 33530 panel bodies; patched adds only reasoning effort low to qwen_flash; gemini and terra unchanged.
- Panel Judges Prep (the parallel dispatch) carries it into slot 3's request; slots 1 and 2 unchanged.
- Reserve Build glm_flash: base + effort low; the Panel Reserve openrouter wrapper keeps it and the z-ai provider pin.
- Accept Build on 33530's posture check: qwen_flash and glm_flash gain effort low; gemini, terra, mimo, sol, grok unchanged.
- __orc of all four builders: rule as above; a body that already sets reasoning is kept; non-openrouter untouched.
- Alternate Build stub rebuilds byte for byte; library cureBody and the send-back spread keep the field.

Limit (not testable offline): whether Alibaba and Z.AI honour effort low for these two models. Proposed check before the next full run:
send the two stored 33530 bodies (Panel Build qwen_flash, Reserve Build glm_flash) once each with effort low through OpenRouter and read
finish_reason and reasoning_tokens (about $0.08 total at 33530's prices). Panel Check still seats the reserve if one fails.
