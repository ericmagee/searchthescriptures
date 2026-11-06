# pkgOGS wiring (for W4). Base: live ff8967bb + pkgOGR 4d5d9ca (n17). Names and settings from W4's fetch-back (22:30Z) and prewrite_kgw_7796fc67.json.

New nodes
1. C4G Build: Code v2, jsCode = pkgOGS/patched/C4G_Build.js.
2. C4G Route: Switch v3.2, copy of C4 Route with numberOutputs 8 and output `={{ $json.resend ? $json.call.fam_idx : 7 }}`.
3. C4G Call anthropic / openai / gemini / grok / mimo / openrouter / deepseek: exact copies of the seven C4 Call nodes (same method, url, credentials,
   jsonBody `={{ $json.call.body }}`, timeout, retry, onError continueErrorOutput).
4. C4G Extract: Code v2, jsCode = pkgOGS/patched/C4G_Extract.js.

Connections
- C4 Extract output 0: to C4G Build (was Build Synthesis). C4 Extract output 1 stays to Failure Salvage.
- C4G Build -> C4G Route.
- C4G Route outputs 0-6 -> C4G Call <family> in the same order as C4 Route (anthropic, openai, gemini, grok, mimo, openrouter, deepseek); output 7 -> C4G Extract.
- Each C4G Call: output 0 (success) AND output 1 (error) -> C4G Extract. A failed re-call keeps the first round; it does not end the run.
- C4G Extract output 0 -> Build Synthesis.

Changed nodes
- Build Synthesis: pkgOGS/patched/Build_Synthesis.js (on pkgOGR/patched; reads $('C4G Extract') for dr4).
- Failure Salvage: pkgOGS/patched/Failure_Salvage.js (reads C4G Extract, falls back to C4 Extract).

C4G Extract never throws on the re-call: a refusal, an empty reply or an HTTP error keeps C4 Extract's round (grants_resend.kept = first, with why).
