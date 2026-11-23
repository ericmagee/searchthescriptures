# ASK 536 post-write readback (W2), prepared before the write

Coordinator assignment 17:32Z. This readback reads files on disk only. It makes no n8n call: the write script fetches.

**Run after W4's write:** `python3 /mnt/project-files/ask536/w2/readback.py /mnt/project-files/ask536/w2/spec536.json`
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

**Spec (spec536.json):**
- Fetch-backs: ask536/w4/write/fetchback_{engine,child}_536.json. Base: ask536/w4/write/prewrite_{engine,child}.json. Both are written by write536.sh.
- Targets: ask536/w4/build/target_engine_536.json 4d2f03b3 and target_child_536.json 237375a7 (W4 10730; W2 PASS 10733).
- Nodes changed: Shared Library only. Indexes 428 and 429. 31 MAP n. Sha c75101694c687e31.

**Dry run (out_dry536.txt):** the fetch is taken as the targets, and the base as W4's live536 fetch.
- Every check passes, except "versionId moved".
- That one fails, as it must, because the target carries the live versionId. This shows the check is live.

**If live moves before the write:** write536.sh stops ("MOVED before any PUT"). The targets would then have to be rebuilt and this spec updated.
