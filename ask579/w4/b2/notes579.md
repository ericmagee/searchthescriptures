# ASK 579 BUILD re-cut (W4): the nine B/G Extract nodes take their served text from the Shared Library

Base: live engine 20db58ee (423 nodes) and child 74353c40, fetched 16:3x CST 11-24 after a check that no execution was running (base_eng_579.json, base_child_579.json). LIB before 2f5aa1e63d51edb1.
Method: W3's t579.js (be789169), unchanged, then fixhdr579.js (8bd90c58) resets the header sha. out_t579.txt: ALL PASS (99 checks).

## What changes
- Engine: nine nodes (C1B, D2B, C3G, D4B, C4G, C4B Extract: the try block's served call; C2B, D3B, C3B Extract: the __O423 statement) now rebuild that text from the Shared Library; the Shared Library gains 270 lines and nine MAP entries. Nothing else; connections equal.
- Child: Shared Library only (same LIB). Connections equal.
- New library sha a3c1e42f5b0ebda6, 3852 lines. Targets: target_engine_579.json 115b1db5, target_child_579.json fe01ca77.

## Measured
- Nine nodes 226,060 to 41,693 characters (saved 184,367). Shared Library +70,069 in engine and in child.
- Net stored saving: 44,229 with the child copy; 114,298 once ASK 578 removes the child copy.
- N1 (cost beside the saving): 37 existing library lines (4,623 characters) are reused by the new entries; 54 existing MAP entries also serve one of those lines. A later edit to any of those 37 lines changes the Extract nodes too.
- Not taken: the four statements __LB423, __CC423, __LC423, __A423.

## Criteria
- C6 replay on run 42071 inputs (c6/c6_579.cjs f869c51b; rundata_42071.json 35c0b165): live code 9 of 9 equal (c6/out_c6_579_live.txt); packed target 9 of 9 equal (out_c6_579_target.txt). W1 agreed the baseline (Wall 11757).
- The try-node re-call path is NOT SHOWN by 42071: a re-call ran only in C2B and C3B. It is untested until a live run produces one.
- Pair Library Check PASSES (lib a3c1e42f5b0ebda6, map ed7212a3189a4565; out_pair_579.txt).
- Standing set 31 PASS 0 FAIL, S4 290 of 290 engine, 67 of 67 child (out_standing_579.txt).
- Rebuild is deterministic: rebuilt from the base files, byte-equal to both targets.

## Write (write/write579.sh e9d23edc), on the press of the write card
1. Run gate (no engine or child execution). 2. Rebuild; must be byte-equal to the graded targets; C6 9 of 9. 3. Fetch live; the ten engine nodes and the child Shared Library must equal the base; the rest is taken as live. 4. Revert copies. 5. Standing set and pair check on the PUT bodies. 6. PUT engine, then child. 7. Fetch back; params equal PUT; standing, pair check, C6 on the fetch-back.
Then audit_log, Wall, W1 readback; W3 manual entry and AAR row. Run evidence: two clean live runs.
