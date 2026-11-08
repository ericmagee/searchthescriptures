# pkgRMT (W1, 11-08; W3 3017 item 4): Reserve Build sends mimo with thinking off

Gap noted in pkgPNL: when mimo is the reserve (for example when terra debates), Reserve Build's xiaomi/ body has no thinking-off flag. Alternate Build and Accept
Build both send reasoning {enabled:false} (BB-5700 step 8a: with thinking on, mimo did not answer within 900 s).
Change: one branch of Reserve Build (base live s53 de5cbc9ead77 -> fadf5fd8fc43) adds reasoning:{enabled:false} to the xiaomi/ body. Nothing else.
Build: `node pkgRMT/build_RMT.cjs`. Test: `node pkgRMT/test_RMT.cjs` (test_RMT.txt) 5 OK: mimo body = base + reasoning off; glm_flash, qwen_flash, grok
and gemini bodies unchanged. No saved run reached Reserve Build, so the openrouter branches are run directly. The glm_flash/qwen_flash checks are trivial: they fall past these branches in both versions.
Not a DeepSeek fix; rides beside one. Under pkgPNL mimo is not the reserve with claude v opus (glm_flash is).
Revert: base_s53/Reserve_Build.js.
