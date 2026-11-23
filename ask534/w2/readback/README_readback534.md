# ASK 534 post-write readback (W2), prepared before the write

Coordinator assignment 17:40Z. This readback reads files on disk only and makes no n8n call. readback.py is rev 2 (01fb7c72).

**Run after W4's write:** `python3 /mnt/project-files/ask534/w2/readback/readback.py /mnt/project-files/ask534/w2/readback/spec534.json`
The last line is READBACK MATCH or READBACK MISMATCH.

**Assumed names.** W4's write534.sh is not made yet. The spec assumes write532.sh's pattern in ask534/w4/write/: prewrite_{engine,child}.json, full_{engine,child}.json and fetchback_{engine,child}_534.json. If the script uses other names, edit the six paths.

**Checks:**
1. The fetch-back equals write-time full_*.json, on every node, on connections and on settings.
2. Against prewrite_*.json, only Shared Library changes, in both workflows. Connections are equal and versionId moved.
3. Library: only index 2277 changes. MAP keys and p are equal, MAP n changes in 4 entries, the header sha equals the target's, and runcheck is OK.
4. Library line 2277 equals the graded build's (target_engine_534.json 32684105, target_child_534.json 8f52f67b). The build grade is not posted yet: update these if the graded md5s differ.
5. Across both: the engine and child Library text is equal, and the 539 pair check PASSES.

**Dry run (out_dry534.txt):** fetch = target = W4's targets; base = the live fetch at ask533/w4/live (daf5da98 and 10624dd2). Every check passes except "versionId moved", which must fail in a dry run.
