# W1 grade: ASK 583 step 6.4, Daily Drive Sync (W4)

GRADE: PASS WITH ONE CONDITION (S1). Files: target_sync_6_4.json 66d76070, build584sync.py b352bc24, out_sync_6_4.txt f7196c60 (copied into fairjudge/w1/g583/inputs_w4_6_4/ in this commit).
RULES READ: plan 2c 6.4, C6 c, C6 d; op doc v143 s7 A (Daily Drive Sync, anti-hollow gates), s8 (backup supremacy), s30 (writes); the 20:52 no-cap ruling.
OBJECTIVE MET: yes. The mirror reads the whole manual from engine_manual_full, so it never receives the pointer row, and a hollow text is not pushed.

## Checks I ran
1. Base: the live version of Daily Drive Sync is bb717f49 (get_workflow_history, newest, 2026-11-19 15:24Z), the same as W4's base file.
2. Node diff of base against target: 49 nodes on each side; connections are identical; exactly two nodes change.
   - Fetch Engine Manual: the URL changes from the engine_manual table read to rpc/engine_manual_full. The method stays GET, which is allowed because the function is STABLE.
   - Build Engine Manual: only the floor check is added in front of the unchanged return.
3. The floor (100,000 characters plus a version) guards the mirror push only. It refuses no write to the manual, so it is not a cap under the 20:52 ruling. Today's manual is 707,670 characters.
4. W4's offline cases 1 to 8 cover the single row, the array, the pointer row (blocked), an empty reply, null content, no version, exactly the floor, and one under the floor. They match the code.
5. Item 4, the limit: a blocked push throws, and the chain stops before FTP Vol1, Vol2 and Calendar. This is the same behavior as the three existing book gates (Build FTP Vol1, Build FTP Vol2 and Build Calendar Book each throw ANTI-HOLLOW), so it adds no new class of failure. Accepted.

## Condition
S1. Write 6.4 only after the 6.3 migration is written and read back. Until then rpc/engine_manual_full does not exist, the fetch fails, and the chain stops at the engine manual every day.
C6 c (anon REST call to rpc/engine_manual_full) is shown by W4 after 6.3 is written. C6 d is shown at the next sync after the cut.
