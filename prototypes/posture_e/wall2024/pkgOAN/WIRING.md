# pkgOAN wiring (for W4). Base: live 98daac9e (fetchback_98daac9e.json, 360 nodes). Same pattern as pkgOGS (C4G).

New nodes
1. C3G Build: Code v2, jsCode = pkgOAN/patched/C3G_Build.js.
2. C3G Route: Switch v3.2, copy of C4G Route: mode expression, numberOutputs 8, output `={{ $json.resend ? $json.call.fam_idx : 7 }}`.
3. C3G Call anthropic / openai / gemini / grok / mimo / openrouter / deepseek: exact copies of the seven C3 Call nodes (same method, url,
   credentials, jsonBody `={{ $json.call.body }}`, timeout, retry, onError continueErrorOutput).
4. C3G Extract: Code v2, jsCode = pkgOAN/patched/C3G_Extract.js.

Connections
- C3 Extract output 0: to C3G Build (was D4 Verse Sheet). C3 Extract output 1 stays to Failure Salvage.
- C3G Build -> C3G Route.
- C3G Route outputs 0-6 -> C3G Call <family> in the same order as C3 Route; output 7 -> C3G Extract.
- Each C3G Call: output 0 (success) AND output 1 (error) -> C3G Extract.
- C3G Extract output 0 -> D4 Verse Sheet.

Changed nodes (jsCode from pkgOAN/patched/)
- C3 Build, C3 Extract (the press block and the press check).
- Every reader of the [DR3] round now reads C3G Extract: Build Synthesis, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract,
  D4 Words Plan; Failure Salvage reads C3G Extract and falls back to C3 Extract.
- D4 Verse Sheet (httpRequest): url `={{ $('C3G Extract').first().json.sheet_url }}` (was C3 Extract).

Not changed: C4 Build's z-ai conversation helper (__ZH) reads `$(side+prev+' Extract')` by a built name, so for a z-ai Oracle it continues
from C3 Extract's round (the first). No z-ai debater is seated now.

C3G Extract never throws on the re-call: a refusal, an empty reply or an HTTP error keeps C3 Extract's round (press_resend.kept = first, with why).
Revert: the 10 changed nodes' jsCode from fetchback_98daac9e.json, D4 Verse Sheet's url, C3 Extract output 0 back to D4 Verse Sheet, and the 10 new nodes removed.
