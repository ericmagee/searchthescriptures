# pkgKWT (W1, 11-07): K-W NOT HELD quote test takes "I grant that X" with X quoted whole (W3 grade_33411 Fault 2; W2 2924)

33411 sol, item DEFENDER CR2 LINK 6 #9 "I grant that two fatherhoods stand together there.": the test strips "I grant", leaving the 6-word body
"that two fatherhoods stand together there", which (6 words or fewer) must be quoted whole. sol quoted "two fatherhoods stand together there" (the whole
granted proposition) and was UNCURED, then removed (false removal).
Fix: __rn (the runs a reason must quote) also adds the runs of the body without a leading "that", "how" or "whether", only when 3 or more words remain
(W3 2932: "I withdraw that sentence." keeps its floor; test_KWT.txt 5 OK). Runs are only ADDED: every reason
that passed before still passes (monotone); side-neutral. Applies to the line's own body and the pkgNHQ full sentences (same __rn).
19 library nodes (patched.plan.json); base = pkgLIB v6 full sources (pkgKWT/base_v6).
replay_KWT.txt: 13 runs (33218-33411) x 19 nodes = 247, 246 identical; the 1 change is 33411 Panel Cure Check: sol's K-W row UNCURED -> CURED
("answered: NOT HELD, with a reason that quotes the flagged sentence"); gemini and chatgpt stay CURED.
Ships as pkgLIB_v7 = v6 + KWT: library json_sha 722f5ac196975eae (rebuilt with the 3-word floor); test_LIB 11 OK, SRCDIR 11 OK, test_recent 286/286.
