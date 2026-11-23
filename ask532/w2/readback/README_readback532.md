# ASK 532 post-write readback (W2), prepared before the write

Coordinator assignment 17:40Z. This readback reads files on disk only and makes no n8n call. readback.py is rev 2 (01fb7c72); the 533 and 536 copies are unchanged.

**Run after W4's write:** `python3 /mnt/project-files/ask532/w2/readback/readback.py /mnt/project-files/ask532/w2/readback/spec532.json`
The last line is READBACK MATCH or READBACK MISMATCH.

**Why the target is write/full_*.json.** write532.sh (9c12fb80) builds each body at write time from the fresh fetch with patch532.js (d4294ac9). If 533, 534 or 536 is written first, the body differs from the graded target in their lines. So:
1. The fetch-back must equal write532.sh's own full_{engine,child}.json, on every node, on connections and on settings.
2. Against prewrite_*.json, only Assume Check Build, Assume Check Record and Shared Library change in the engine, and only Shared Library in the child. Connections are equal and versionId moved.
3. Library: only indexes 1511, 1516, 1660, 1667, 1686, 1749, 1752 and 2390 change. MAP keys and p are equal, MAP n changes in 13 entries, the header sha equals the target's, and runcheck is OK.
4. Against the graded build (target_engine_532.json db936598, target_child_532.json c6055bf4, W2 PASS Wall 10792), those eight Library lines and the two Assume Check nodes are equal.
5. Across both: the engine and child Library text is equal, and the 539 pair check PASSES.

**Dry run (out_dry532.txt):** fetch = target = the graded build; base = base_*.json (daf5da98 and 10624dd2). Every check passes except "versionId moved", which must fail in a dry run.
