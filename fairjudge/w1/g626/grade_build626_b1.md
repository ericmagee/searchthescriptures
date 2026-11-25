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
