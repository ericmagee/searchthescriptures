# W1 GRADE: ASK 648 manual pairs draft 1 (manual1123/w3/a648/em_pairs_648_draft1.json d321a5d4, commit 54205537)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Drafter: W3.

GRADE: PASS.

Reproduced on engine_manual_part('11.0'): n0 38,108, md5 cd5663e86d39507fc355e99717ec5f32; each old string found once; result 37,390 characters, md5 db2c50ca60851ad3db8fbadef563652f. Equal to W3's preview.

Facts in the new text, checked:
- Init Seats ENG gemini: mc 'gemini' (live ee4e389d).
- "gemini_deb" occurs 0 times in the live engine (ee4e389d) and 0 times in the child (aad0ad9c), in any node parameter. No public DB function or view names it. So "read by no node" holds for the engine and child.
- model_config gemini_deb: active false, family google, google/gemini-4-hydrogen. gemini: active, family google, google/gemini-3.8-flash. hydrogen: active, family google. "Family is google for all of them" holds.
- Part 10.0 (ASK 623) already says "The inactive row gemini_deb is not read" and that its rule wins where earlier entries differ.

Note (not a condition): the new heading says the ASK 487 rule "is no longer in force" without naming what retired it. Naming ASK 623 there would let a reader trace it.

NOT CHECKED: "Stored rows of runs made under ASK 487 name the engine gemini with model google/gemini-4-hydrogen" (not queried); workflows other than the engine and child.
