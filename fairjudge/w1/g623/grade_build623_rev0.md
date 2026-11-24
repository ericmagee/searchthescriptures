GRADE ASK 623 build rev 0 (ask623/w4/b1, commit 3072efde; notes623 168ec815, write623.sql 01b4aa75, write623.sh 420a1e8c, target e449c187): PASS WITH N1. COMMIT: this file.
RULES READ: plan rev 0 87989e36 and my grade (Wall 11716); the operator's press "Append both; run the 2 checks" (15:01 CST); op doc v145 §29 ASK FORM, TWO LIVE RUNS, §4 (scripts that stop part way), §30 denials and writes; ASK 599; ASK 601; ASK 608; NEVER TOUCH REASONING.
OBJECTIVE MET: yes, as a build (live and UNEXERCISED until each seat runs in each role).
STANDARD (ASK 599): PASS. Seven ASK 623 tags in the engine and ten in the DB script; each added key is read by the lookup it joins; no dead code.

My own checks (15:43 to 15:55 CST 11-24):
- Live engine fetched by me: versionId 94b682a0, 423 nodes; every node's parameters equal W4's base file; connections equal.
- I rebuilt the target from MY fetch with build623.cjs: 423 of 423 nodes equal W4's target; connections equal live. Five nodes differ from live, each by the stated insert only: Init Seats (ENG gains hydrogen and neon; FAM_PANEL neon:'google'; JFAM neon), Resolve Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt (JFAM neon). All five compile.
- t623.cjs run by me: output byte-equal to out_t623.txt (36de91b2): C3a 90/90 equal; C3b 22 identical, 68 tail only, 0 judge/reserve/enforcer changes; C2 132 pairings, 128 three judges, 4 ASK 608 stops, 12 with no reserve and no alternate (the 4 of today plus the 8 of my N3); ALL PASS.
- Data: data_623_db.json's 23 active rows and order v2 equal the DB as I read it at 15:51 CST (N2 of my plan grade closed).
- Standing set on my target + child base: 31 PASS, 0 FAIL, S4 290/290 and 67/67. Pair Library Check PASSES.
- write623.sql read in full: seven DO blocks, each md5-gated with anchors counted once; the neon row copies argon's provider, role and endpoint, 64000, active, family google, no reasoning field; hydrogen's row is untouched; the order block asserts v2 and log id 2, runs odv1_judge_order_fault, then appends hydrogen 6 and neon 7 with a log row.
- dry623.sql: its seven EXECUTE blocks equal write623.sql's seven blocks text for text; the whole is one DO ending in RAISE. Live state after W4's dry run is unchanged (no neon row; all five function md5s as before; order v2, log 2).
- Failure window, tested by me: if write623.sql lands and the engine PUT then fails, the OLD engine with order v3 and the neon row seats neon nowhere on the 90 pairings (it has no JFAM entry), and hydrogen only where it does today. So that window is safe.
- write623.sh: run gate, rebuild, t623 "ALL PASS" gate, standing gate, live-equals-base gate, revert copy, PUT, fetch-back with params/conn checks, standing and pair on the fetch-back.

N1: write623.sql is seven separate statements. Sent in one execute_sql call they share one transaction; run any other way (the SQL editor, op doc §4), a stop part way leaves the earlier blocks in place. The partial states are safe by my reading (a lone neon row or list entry seats nothing), but say in the write post that it goes in one call, or wrap it in BEGIN and COMMIT.
