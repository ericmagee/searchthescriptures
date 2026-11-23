# ASK 533 post-write readback (W2), prepared before the write

Coordinator assignment 17:32Z. This readback reads files on disk only. It makes no n8n call: the write script fetches.

**Run after W4's write:** `python3 /mnt/project-files/ask533/w2/readback/readback.py /mnt/project-files/ask533/w2/readback/spec533.json`
The last line is READBACK MATCH or READBACK MISMATCH.

**Checks, for each of engine and child:**
1. The fetch-back equals the graded target on every node (name, type, typeVersion, parameters, credentials, disabled), on connections and on settings.
2. Node by node against the pre-write fetch: only the named nodes changed. Connections are equal, and versionId moved.
3. In the Shared Library:
   - only the named indexes changed;
   - MAP keys and p are equal to the base;
   - MAP n changed in the expected number of entries;
   - the header sha is as expected;
   - runcheck is OK.

**Checks across both:** the engine and child Library text is equal, and the 539 Library Check pair PASSES.

**Spec (spec533.json):**
- Fetch-backs: ask533/w4/write/fetchback_{engine,child}_533.json. Base: ask533/w4/write/prewrite_{engine,child}.json. These are the names write536.sh uses; W4's write533.sh is not made yet. If its names differ, edit the four paths and the extra command.
- Targets: ask533/w2/build/target_engine_533.json 8eb0881e and target_child_533.json 621c3303 (W3 PASS 10781).
- Nodes changed: L2 Count Plan and Shared Library in the engine; Shared Library only in the child.
- Indexes: 483, 489, 514, 517, 849, 1052, 1212, 1311, 2177 and 3314. 33 MAP n. Sha 9a4d55c66bf65d7f.
- Extra check: test533.js, run with the pre-write engine as OLD and the engine fetch-back as NEW, must give ALL PASS.

**Order:** the targets are built on daf5da98 and 10624dd2.
- If 536 (or any other write) goes first, patch533.js must be re-run on the new fetch (it asserts every old line). The targets and lib_sha in this spec then change to the rebuilt ones.
- The index list and node lists stay the same.
- 536 touches indexes 428 and 429 only, so patch533's anchors are not affected.

**Dry run (out_dry533.txt):** the fetch is taken as the targets, and the base as the live fetch at ask533/w4/live.
- Every check passes, test533 included, except "versionId moved", which fails as it must.
