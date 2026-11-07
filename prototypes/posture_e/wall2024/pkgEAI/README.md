# pkgEAI (W3 grade_33389 fault 2): DeepSeek enforcer fix, side-neutral

Judge Enforcer Build and Alt Judge Enforcer Build only. Base: live s45 (d813c20d) Builds = pkgEFG/patched_live_on_pkgEAM (571fef513c90 / d46e8a7dff5a).
Patched: 9dd6e607d23a / 2640866212d2.

1. eaiBlock (eai_lib.js): THE ANSWER IN FULL may also come from the paragraph of a listed round that holds the answer's first 6 words
   (a bullet group is taken from its first bullet). An answer under 3 words is never searched; under 6 words it must hit exactly one paragraph.
2. E-ANS: each finder (verse line, MEANS header, paragraph) passes the gate on its own. Before, a verse-line block the gate refused hid the later finders.
   The grant test also takes a bare "Grant ..." opening.
3. E-HOLD (eahFull): same, each finder gated on its own, paragraph finder last.

Test: node pkgEAI/test_EAI.cjs -> 42 OK, 0 FAIL; 232 items gain a block; calls <= 8 and not_checked unchanged in every run;
20 pushes now held across 33218, 33249, 33299, 33371, 33389 (33389: chatgpt Ezra 2:61 [DR3], "Grant the priestly setting"; chatgpt Hebrews 7:10 [DR3] is already held by live EAM).
