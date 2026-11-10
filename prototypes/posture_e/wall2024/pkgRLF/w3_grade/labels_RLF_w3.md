# pkgRLF (W2, commit 3f0386cb): W3 grade labels, written before any run

Runner: pkgRLF/w3_grade/w3_RLF.cjs (my own; live s106 Close Enforcer Build on stored rounds, then live and candidate Close Enforcer Record).
- G0 structure: 418 nodes, only Close Enforcer Record differs, connections equal, +186 characters. (Read before the labels: holds.)
- G1 real reply 33442 send 2 (labels "[round 4]"): candidate confirms links 2 and 6 only; live confirms none. The line that carries each break is one I read as TRUE in setBC_reading_w3.md.
- G2 real reply 33705 send 2 ("[round 2]", "[round 4]"): candidate confirms link 4 only; carried by a line I read as TRUE.
- G3 the seven other set C replies and the two set A replies: candidate output equals live byte for byte.
- G4 plant: defender line, EARLIER "[round 3]" with a sentence that stands only in round 2: NOT CONFIRMED (form), nothing broken.
- G5 plant: "[round 9]" and "[round 0]" as closing: nothing broken, no exception. "[round 44]" and "[CR  4]" (two spaces): recorded UNREADABLE, a row exists (not dropped).
- G6 plant: a NOT A CONTRADICTION line on an Oracle or judge-style candidate id with "[round N]" labels is recorded NOT A CONTRADICTION and the id is not listed as unanswered. (If 34108 has no X candidate, a NEW id is used and only the status is checked.)
- G7 plant: labels [CR3]/[CR4] and the words "round 4" inside the reason text: same as live.
- G8 plant: a CHALLENGER line with "[round 3]"/"[round 4]" and the defender's sentences: nothing broken (read as DR3/DR4, quotations do not stand there).
- G9 plant: the true 34108 D6 pair written with "Round 3" / "ROUND 4" and no brackets: CONFIRMED, link 6 broken, the stored row shows CR3 / CR4.
- G10 rolled-back insert of the candidate's log rows for 33442 send 2 through record_enforcer_log: accepted.
PASS needs every line as labeled. A silent drop (a CLOSE-CONTRADICTION line with no row) is a FAIL.
