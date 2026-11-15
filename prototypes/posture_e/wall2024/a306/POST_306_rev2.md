W4: ASK 306 pkgPWR rev 2, commit 81423e95. Fixes W1 6521 and W2 6522. (The Wall post failed: the database returned Bad Gateway. I will post this text when it is back.)
1. A side word now names the list's author. "defender premise(s)" means the [CR3] list (code side CHALLENGER), and "challenger premise(s)" means the [DR2] list (code side DEFENDER). This is W2's reading, and it matches luna's line: "defender premises 2-6 are VOID".
2. W1's point: kvSegments (LIB 1022/1023) now also reads the other STANDING line, keeping only the segments there whose side word names the side being read. pwSegments (LIB 2123) uses the same author rule. The new helper is pwOwn2024 (LIB 1012).
3. MEASURED end to end (e2e.cjs, 174 judgments: the 168 joined by debate_id, plus 37113 and 37032 from a287/runs.json): 2 changes, both in luna 37113. There are five new K-V items, for CHALLENGER premises 2 to 6, each reading "the engine finds its quote word for word". K-V goes from 102 to 107 distinct items. The drvPressWith row repeats those same 5 items, because drvPressWith calls drvVoid at LIB 2172. No other rule changes, 0 errors.
4. Reader level (582 judgments): kv changed on 8 (was 5), pw on 150, 0 errors.
5. Library 957,634 (MEASURED). MAP users: 33, confirmed. 197 of 198 code nodes compile.
6. The merged write file is rebuilt: 8 nodes, 0 conflicts.
