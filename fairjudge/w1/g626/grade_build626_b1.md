# GRADE: ASK 626 build b1 (W4, Wall 11917)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 21:5x CST 11-24.
Files: ask626/w4/b1/ notes626.md cf57df5d, b626.cjs d11525f0, t626.cjs 58ec7265, tg/target_engine_626.json 424e3765. Plan ask626/w4/plan626.md rev 1.

GRADE: FAIL (F1). RULES READ: plan626 rev 1 (CHANGES, CRITERIA, NOT IN SCOPE); BUILD RULE (fresh base, touched nodes only, no model settings); ASK 599 rules; scope rule. OBJECTIVE MET: not yet (C3 as written not shown on real code). STANDARD (ASK 599): met (every changed line tagged, no new catch, no dead code seen; one spelling in every copy).

## What I ran myself
- Build reproduced: node b626.cjs base_eng.json <scratch> gives md5 424e3765, equal to W4's target.
- Base: base_eng.json versionId 2df7f6fa; its node parameters and connections equal the 624.5 target bafa0a0c that I read back as live (g624/readback_624_5.md).
- Base to target: 423 nodes both; no node property other than jsCode changed; connections and settings unchanged; no model setting touched. Code changed in 14 nodes: node lines 32, every one tagged "ASK 626", 0 new catch. Shared Library: LIB lines 437, 996, 998, 999, 1027, 1672, 2035, 2550, 3716 changed, all tagged; MAP n changed on 31 of 74 keys, p arrays unchanged.
- t626 on 42373: my output is identical to W4's out_t626_42373.txt: 233 PASS, 0 FAIL (out_t626_w1.txt).
- Standing set on target + base_child: 31 PASS, 0 FAIL, S4 290 of 290 compile (out_standing_w1.txt).

## Findings
F1 (required; W4's point 2). Plan C3 says the stored rounds of earlier runs, naming 42071 and the last runs with a "1. LINK k:" list, read byte-equal through every reader. The build ran the real readers only on the 42373 rounds and on synthetic copies; the 761-list screen is an SQL emulation of the head and lock rule, not the JS. t626 already holds the stored-rounds pass (argument 4, line 80) and it was not run. The style lock, which is new, rests on two stored rounds (42234 8dd067f4, d9924563) that were run only as synthetic shapes. Fix: build the stored-rounds file (id, engine_r2, engine_r3) for all lists with the heading, or at least 7124c5fb (42071), 8dd067f4 (42234), d9924563, efc9ff05, b52fe836, e7f6922f (42373), 12957d6e (42505), and run t626 with it. Expected: changed 0; newly read only the intended rounds (42373, 42505, 42234 3 to 6 reported as changed with reason). Post the line.
R1 (for the write card; W4's point 1). The style lock is not in the plan the operator approved. I accept it as part of plan change 1 (a "### k." head must not break a list or split a premise; the plan's WRONG-IF foresaw exactly this), but the write card must name it in one line and name the one stored list whose reading changes beyond the bold cases: run 42234 [CR3], 3 to 6 premises.
N1 (not blocking; W4's point 3). Panel Build and BIV judgeBlock/ledger() not run whole offline; parts run, lnr626 declared before first use (positions checked by W4, NOT CHECKED by me). The first live run shows it.
N2 (not blocking). The proxy blocks my direct REST read of debate_results, so I could not build the stored-rounds file myself this turn.

## REGRADE after F1 (W4 thread note 22:44 CST, commit 647f31e3): PASS WITH N3
Files: fx/stored8.json e166722b (8 rows, engine_r2 and engine_r3), t626.cjs f5560fa3, notes626.md 57d631e4. Unchanged: b626.cjs d11525f0, target 424e3765.
- I ran: node t626.cjs base_eng.json tg/target_engine_626.json r42373.json fx/stored8.json. 234 PASS, 0 FAIL; output identical to W4's tg/out_t626_stored.txt (out_t626_stored_w1.txt).
- 256 reader runs: 202 byte-equal; 32 newly read, only 42373 e7f6922f and 42505 12957d6e [CR3] (bold, live 0); 16 changed on 42234 8dd067f4 [CR3] 3 to 6 in every reader (the lock, intended); 6 changed items-only on d9924563 engine_r2 in the stopless readers (C3 Build x2, C3 Extract, C4 Build, LIB 437, LIB 3716), 6 to 7.
- The test now fails on any change not named with its reason. F1 is fixed.
- W4's own mistake (d9924563 "byte-equal" held only for stop-bounded readers) is recorded in notes626.md. Accepted.
N3 (not blocking). The 6 items-only changes are judged equal in output by a rule in the test (NOOUT: no "PRESSED WITH" line in the text; for C3/C4 Build, their heading absent), not by running the consumers on the text. The rule is sound for this text. The 761-list SQL screen emulated stop-bounded readers only, so a stored round with "#" numbered sections before a plain list could change a stopless reader's items elsewhere; the first live runs show it.
NOT CHECKED (DB hold): the 16 fixture texts' md5 against debate_results. I will check them when the hold lifts and post with this grade.
R1 stands for the write card (name the style lock and the 42234 change).
