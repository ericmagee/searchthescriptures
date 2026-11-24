# ASK 601 engine manual entry, draft 1 (W3, 11-24), for W1's grade. NOT WRITTEN.
Pairs: manual1123/w3/a601/em_pairs_601_draft1.json (dbf275afa97cbec93d0dbb7cf0c2dc76). Eight pairs, two parts. Each old string stands exactly once in the live part (SQL count by W3, 12:27 CST 11-24).

| Part | Base version, md5, length | After: md5, length |
|---|---|---|
| 03.0 | 252, a281a5db2a9d4b825a0036550b43be01, 2,688 | 8d329c113a302151e038ebe97d71a1c1, 2,780 |
| 10.0 | 302, df2791bcf4a3405edd4f270c8dbb710b, 47,439 | 29b8b25252dc8e3a3ebb4378d7533daa, 51,000 |

Section 0 (part 00.1, version 247, 5bc72deb, 3,185) read in full before drafting. Body law: the pairs state only what the engine and database now do; the provenance below goes to the log rows.

What the pairs do:
1. 03.0: the Resolve Seats line gains the new refusal (a panel judge whose model is a debater's).
2. 10.0 JUDGE ORDER bullet: the pointer "THE JUDGE ORDER IS A TABLE, the last entry" no longer says "last" (the new entry is last); the panel order is also "without a seat whose model is the model of a debater"; the guard list reads G1, G-SAME, G2, G3; the sentence on Claude judging gains "and neither runs the sonnet seat's own model".
3. 10.0 ALTERNATES bullet: G-SAME named between G1 and G2.
4. 10.0 THE JUDGE ORDER IS A TABLE: dash_judge_lineup's own copies now include the same-model test.
5. 10.0: new last entry NO JUDGE RUNS A DEBATER'S MODEL (rule, test, Init Seats, Resolve Seats, database, result, shown offline, limits).

Sources for every statement: ask601/w4/plan601.md 7aab840d; ask601/w4/b1/notes601.md 893bc98e; the target node code read by W3 from b1/target_engine_601.json 9cb87181 (Init Seats 0579c436 lines 35 to 37; Resolve Seats ffb7b688 lines 16 to 22); W1 grade of the build (Wall 11625; fairjudge/w1/g601/grade_build601_rev0.md, N2 for the three model sources, N3 for alt_dropped); W4 write report Wall 11652; W1 readback Wall 11654.

Log text (p_log), both parts: "ASK 601 (ruling card 'Keep same-model judges out', 09:48 CST 2026-11-24; write card 'Write it' pressed 12:18 CST 2026-11-24, W4's thread; written by W4 12:19 CST, Wall 11652, audit 41585; W1 readback MATCH Wall 11654). Engine ff7ab4cf to 21316a8e-9107-4ba7-8966-230d20ad2d3f: Init Seats 7949df51 to 0579c436, Resolve Seats 767dc7b0 to ffb7b688. Database: odv1_record_panel_alternates 39d84307 to ad0d9e9c; dash_judge_lineup caea9e6c to e19ac69b. Child ecdc6218 unchanged."

Not claimed, because the record W3 read does not hold it: whether the single judge's draw passes the same-model test (the single judge is already "not sonnet"). W1 or W4, say if the entry should state it.

Write: needs the operator's card in W3's thread, no run live, part 03.0 then 10.0, each gated on the base md5 above.
