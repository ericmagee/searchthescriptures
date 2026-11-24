# W1 GRADE: ASK 593 manual pairs draft 1 and AAR row draft 1
GRADE: PASS with F1 (manual) and PASS with F1 (AAR row). COMMIT 7176890a (em_pairs_593_draft1.json e0f1c050; aar_row_593_draft1.sql bc98d169; W3). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 518, 519, verify before asserting, scope rule. OBJECTIVE MET: yes, after the findings.

## Checks asked
- md5_written: md5sum of ask593/w4/build/target_engine_593.json = 046ac782, target_child_593.json = 1c741179; both equal the flows read back at 11443 (my rebuild and my fetches of a17c7a7b / e9ddab5e, 0 node differences). Confirmed.
- hydrogen: absent from ORDER0 and __ALT in Init Seats and from ORDER in Accept Build on live a17c7a7b (and on 9bec145c before). So pair 10.0 #2 also corrects a stale "hydrogen" in the manual; true to live.

## Manual pairs
- Each old text occurs exactly once at the latest version of its part (02.0 v251, 04.0 v282, 10.0 v274 x3, 17.0 v265).
- Content checked against live: 17 engine nodes changed (my diff 9bec145c to a17c7a7b); the refusal text, the dashboard, the recorders, the four no-reserve pairs and the 2 qwen4max pairs as in t593 and my reads.
- F1: part 09.0 still states the current xkJsonModels list as "terra, sol, luna or Haiku" in two lines ("JSON CURE ANSWERS: a cure call to terra, sol, luna or Haiku (`xkJsonModels()` ...)" and "A cure call to terra, sol, luna or Haiku (`xkJsonModels()`) no longer carries ..."). After 593 the list holds no Haiku. Add a pair for 09.0 (or a line in the new 10.0 entry naming 09.0). Other remaining "haiku" lines (08.0, 09.4, 09.5, 09.8, 11.0, 17.0 limits, 17.1) are records of past runs or past limits and may stand; 10.0's are covered by the new entry's override clause.

## AAR row
- Every file md5 in build_files and revert equals md5sum by me (17 files plus notes and card). LIB/MAP before 14d848a99adaf445 / 3675b0b63c7c05f7 and after a5b27df14d596da7 / e6f0341b87c6190c confirmed by the Library pair test on my flows. Function md5s 4a16cddc, 1b1c2188, 1fb7adfe, 91083e19 as in my readback.
- F1: run_evidence "in the usual debate the panel is terra, sol and 6.2 sol and the reserve is gemini" is a guess (labelled W3's reading), and likely wrong for the runs now launched: when Sol 6.2 or another openai-family model debates, chatgpt, sol and sol62 all leave the panel. Name the pair the expectation is for (e.g. "with claude against opus"), or drop the clause.
- objective_met 'in part' (no run on a17c7a7b) is right. Live is now d819ff4c (590 on 593); the row may say so in one clause.
