# ASK 582 second pass, batch 3 (last): leftover card and approval notes; one stale count; times written in UTC put in Central

Plan Wall 11269; conditions Wall 11270. Pairs: b3_pairs_all.json ea979c3c300a708221d920ad0cc1ce8e (part -> list of {old, new, kind}; kind is "cut" or "time"). 21 pairs in 8 parts: 5 cuts, 16 time conversions.

## What this batch is, and what it is not
The survey of the date and clock hits (README of batch 1; note of 21:59 CST) found that most dated text in the body is KEPT under the law, not history to move:
- a ruling of the operator cited by its time (operational_doc 0 (7): "the ruling is cited by its row and time");
- the one line of why of an entry (operational_doc 0 (3)), including the three 09.7 Why lines that hold "since ASK";
- live cutoffs stored in functions (`v_agree_from` 2026-11-19 18:03:57Z in 10.0 and 11.0; `v_505_from` 2026-11-20 04:44:38Z in 10.0): these are the stored values and stay as stored (P2);
- price page dates and the DeepSeek peak hours in UTC (13.0, 17.0): live schedule values (P2);
- "Shown by run ..." and "Shown live ..." lines: the evidence that a fix worked.
So batch 3 is small. CUTS (5): card and approval notes the class A regex missed outside the batch 1 parts (09.1; 09.7 two; 12.0), and one stale count in 11.0 ("2,537 rows were pending at 17:36 CST ..."), a snapshot of a figure the live system changes (operational_doc 0 (5b)).
TIMES (16): every operator ruling time and run or execution time written with Z is rewritten in Central (CST, UTC-6, all dates are in November), because the operator's standing rule is Central time only (operator's note at the head of the operational document; his word of 03:06 CST 2026-11-23, "stop using UTC time"). Seconds are dropped from ruling times and kept on run and execution times. THIS IS A CHOICE FOR THE OPERATOR: the card offers the cuts alone.

## P1. Regex and counts
regexp_matches(content, '[0-9]{2}:[0-9]{2}(:[0-9]{2})?Z', 'g') on the latest row of every part.
Before (MEASURED in the rehearsal, 22:28 CST 2026-11-23): 08.0 2, 09.1 1, 09.8 1, 10.0 3, 11.0 15, 11.1 1, 12.0 1 (24 in all).
After: 10.0 2 and 11.0 1: the stored cutoffs `v_agree_from` (twice) and `v_505_from`, KEPT.

## P3. Order and figures (rolled-back rehearsal of the 8 writes on the bases as they stand after batch 2; all pair counts 1)
08.0 v242 e2e4f4e6 -> v266 66b93d15cbef4c7b61ed802528628acc 39,155
09.1 v255 c32aa3dc -> v267 4ffa58d84574daa93dc40d5d86877b17 38,692
09.7 v259 feb419b6 -> v268 214414c4f6c867f54df7c027dfd39680 38,360
09.8 v242 7928a79d -> v269 d1dca7d09477f6651daf2e7ec68b159b 28,520
10.0 v260 deda7adc -> v270 8c82d856bd1dcae7e53d04ceb62f8864 39,763
11.0 v261 150f5f24 -> v271 e3a459cbbf3b14191811948b2deb276b 37,966
11.1 v250 2f668823 -> v272 57c1a2b367e2dcfd94d0870e479f7989 34,773
12.0 v262 954f32e5 -> v273 c99809d9816ce3443c6e3cbefe76410f 37,902
engine_manual_full() after: version 273, 73df124aea0662b03955b5a63191c13a, 705,968 (from 706,382; 414 fewer).
Readback: node mrb.cjs <base> <new> <that part's pairs> <part>. If the operator takes the cuts alone, the figures are measured again and posted before the write.

## Time conversions, for the grader to check each (Z minus 6 hours)
14:56Z -> 08:56 CST (08.0 twice, 09.8, 10.0); 16:44:02Z -> 10:44 CST; 16:03Z and 16:04Z -> 10:03 and 10:04 CST; 17:00Z -> 11:00 CST (twice); 17:05Z -> 11:05 CST; 19:22:48Z -> 13:22:48 CST; 20:25:45Z -> 14:25:45 CST; 16:05:44Z -> 10:05:44 CST; 18:25:54Z -> 12:25 CST; 19:00:40Z -> 13:00:40 CST; 18:00:40Z -> 12:00:40 CST; 08:24:13Z -> 02:24 CST; 08:30:57Z -> 02:30 CST; 14:57Z -> 08:57 CST. None crosses midnight, so no date changes.

## Left as it is, named for the grader
10.0 line 97, "The operator approved the override on his card (...)": it is the only statement of why a line the reasoning guard refuses is live; kept as the citation of that ruling.
