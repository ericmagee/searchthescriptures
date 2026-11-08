# pkgFRC (W1, 11-08; W4 Wall 3047): reasoning budget for the two flash judges

Fault (run 33530, report live_test_33530_EGLv2_PNL_PPJ.md): qwen/qwen3.8-flash (panel slot 3) returned finish "length", content null, all 64,000
completion tokens spent on reasoning; the reserve z-ai/glm-5.3-flash did the same after 1,332 s. Second failure -> fail-closed, no verdict.
Both seats got the default OpenRouter body (pkgPNL gave them no reasoning setting).

Change (base live s53): the shared OpenRouter body transform, right after its z-ai provider line, adds reasoning {max_tokens: 24000} to a body whose
model is exactly qwen/qwen3.8-flash or z-ai/glm-5.3-flash and that has no reasoning field of its own. 24,000 of the 64,000 leaves 40,000 for the reply
(judge replies run about 6k-15k tokens). Applies wherever these seats are called: panel (Panel Judges Prep, 3 ORF copies), reserve, alternate, cures,
send-back, gate, accept, QR, synthesis/diagnostic/verdict, debater calls. 37 nodes (36 HTTP jsonBody + Panel Judges Prep). Plan: plan_FRC.json; full
patched parameters per node in patched/. No "}}" inside any expression.

Test `node pkgFRC/test_FRC.cjs` (test_FRC.txt): 37 OK, 0 FAIL.
- all 36 jsonBody expressions run in n8n's expression engine (@n8n/tournament), base vs patched, on bodies for 11 models: only the 2 flash bodies gain the
  budget; every other body is byte-identical; a flash body with its own reasoning field keeps it.
- Panel Judges Prep on saved 33530 inputs: slot 3 (qwen_flash) gains the budget; slots 1 (gemini) and 2 (terra) byte-identical.

NOT TESTED offline: whether OpenRouter honours reasoning.max_tokens for these two models. W4 should probe one call each with the saved 33530 slot-3 body
and the reserve body before the run. If glm-5.3-flash ignores the budget, the fallback is reasoning {enabled:false} for that model only (as mimo).
Revert: the 37 base parameter sets (live s53).
