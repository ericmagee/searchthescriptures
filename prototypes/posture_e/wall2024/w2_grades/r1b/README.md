# W2 grade of R1b (W1, Wall 4560): parent_s119_R1b.json, sha256 0f7834baf1fdb688, against live s119 (fetchback sha 80146a7831bd6411)
- SIZE (diff.cjs, MEASURED): code 3,245,024 -> 1,812,268 = -1,432,756, the same as W1. Non-code parameters are 146,398 on both sides, so prompt 0. 418 nodes on both sides. Connections are equal. No non-code change.
- SOURCES (diff.cjs): 45 nodes changed besides the Shared Library. All 45 effective sources (stub rebuilt from the R1b library, against the live jsCode or the live stub rebuilt from the live library) are byte-equal. The 41 unchanged stubs rebuild byte-equal under the new library.
- READ LISTS (reads.cjs): across 86 stubs, 0 have a literal $() read that is missing from the stub's if(false) list. The 45 newly packed nodes have no non-literal $() call. Their only names beyond $ and $input are `this`, `items` and `$1`, the same as in the 41 stubs already live.
- REPLAY (replay.cjs): the R1b stub text itself is run, with $('Shared Library') returning the R1b library. Live jsCode is run on the same stored inputs (inputs/, all runs).
  - 1,254 replays over 43 of the 45 nodes. 1,253 are equal.
  - The 1 difference is Format Markdown 34108. It comes from the clock: the "Run time" line and the chars count. Live run twice against itself differs at the same place.
  - No stored input: Accept DS Return Build and R2 Alt Judge Enforcer Retry Build. Both are source-equal.
- LIBRARY READ COST (MEASURED, node 22 here): library 858,143 -> 1,249,281 chars. Stubs 41 -> 86. JSON parse is 1.3 -> 1.6 ms per stub run.
- NOT TESTABLE OFFLINE: the n8n task runner receiving the larger library in 45 more Code nodes (memory per node run). Only a live run shows it.
