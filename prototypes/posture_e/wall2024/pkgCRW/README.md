# pkgCRW (W1, 11-07): cureRewrite applies a changed line as a whole line (judge text corrupted by the engine, 33411 gemini)

Finding: gemini's final 33411 text read "CHALLENGER CONCEDED LINKS: 1 -- Premise 2 CONCEDED (stated): "[CR3] LINK 6 [premise 2]: CONCEDED"" while its stored
challenger_conceded_links is 0. gemini did NOT write that line: its send-back reply has S7 "CONCEDED LINKS: 1 -- Premise 2 ..." (defender line, right) and
S9 "CHALLENGER CONCEDED LINKS: 0 -- Premise 5 VOID ..." (Send_Back_Call_openrouter). The line first appears in Alternate Merge Seat's output; traced inside the
node to cureRewrite: R.rp held the old line "CONCEDED LINKS: 0" twice; j.replace(e,...) is a substring replace, so the second copy rewrote the
"CONCEDED LINKS: 0" inside "CHALLENGER CONCEDED LINKS: 0", and the judge's own S9 change was lost. Same class as gemini 33040 (pkgPS b fixed Alternate Merge's
build only). The stored 0 is right (fields come from R.fields); the text an enforcer or reader sees was wrong.
Fix: crwRep(h,o,n,enc): a match must start at a line start (encoded: after an escaped newline or the opening quote; plain: after a newline); a whole-line match
is taken first, else the first line-start match (the old result when the line has trailing words). All three rp replaces in cureRewrite use it.
19 library nodes carry cureRewrite (patched.plan.json); base = pkgLIB v4 full sources (pkgLIB/orig_stack). Ships inside pkgLIB v5 (all 19 are library nodes).
Tests: test_CRW.txt 7 OK. replay_CRW.txt: 13 runs (33218-33411) x 19 nodes = 247 node runs, 246 identical; the 1 change is 33411 Alternate Merge Seat, where gemini's
CHALLENGER line now reads its own S9 change "CHALLENGER CONCEDED LINKS: 0 -- Premise 5 VOID ..." instead of the defender's S7 text.
