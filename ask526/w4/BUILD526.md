# ASK 526 build (W4, seat 35), plan ask526/w3/plan526.md rev 2 (9e2f3819, PASS W1 Wall 10558). NOT written.

1. Base: live engine moMxiV4Irg1uRBZN ea8e8b80 (ASK 520), Library 1baf759d74aecb36.
2. Change (patch526.py 0356771b):
   - Shared Library MAP gains ONE entry, "Alternate Merge CPD" (W1 item 4: the MAP changes, so criterion 5 is restated: only Alternate Merge and the Shared Library MAP differ; no LIB line changes; every other MAP entry equal). p = ERT lines plus cpdSync dependencies (cpd_p.json 5661967a), n 37485.
   - Alternate Merge: one block before "return __AMOUT;" loads that entry and runs cpdSync(raw, {conceded_links:'FINAL PASS', challenger_conceded_links:'FINAL PASS'}, seat); only [AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) lines are kept; the array is replaced and the lines appended; errors go to o.cpd526_error.
   - Run-evidence mark: "COUNT: FINAL PASS to n".
3. Line numbers restated on the live 520 Library (0-based): cpdSync 1536-1546 (skip at 1540); psGrades 1376-1383; ri3Count2024 886, ri3Head2024 888 (885-888); cureSafe 1286; rcObjEnd 1287.
4. Target: target_engine_526_on520.json 3afab90f. Library Check OK 1baf759d. Only Shared Library and Alternate Merge differ; connections and settings equal.
5. Tests (test526.js b55ded6a, out efb99442): 37 rows; 20 derive, exactly W3's cpd37_new_rule.txt list (1265 qwen4max [1,2,5,6] -> [2,5,6]); 17 byte-equal (15 + 1038, 1202 unparsed). 41418 recorded Alternate Merge: only qwen4max changes (array + one DERIVED line); sol62, chatgpt byte-equal.
6. Criterion 4 FINDING (fm526.js 3e7aebb2): Format Markdown re-rendered on the new output shows NO changed line. The transcript prints the raw first reply (counted_premises_defender [1,2,5,6]) and the old "NOT DERIVED ... (kept)" review flag, which stays because lines are appended. Reader-facing; belongs to ASK 529.
7. Stack: patch526 on the 527 target gives Library Check a383650b, same results. Write AFTER 527 (lib527.py asserts the post-520 MAP).
8. Search: SX4Z, c7366RPLb8vdMQg6, Y1VIsNB6KBrs1znP hold no cpdSync, counted_premises or Alternate Merge; the child has no Alternate Merge.
9. Write: write/write526.sh b291898a <engine version>; revert write/revert526.sh 9c1e74c6.
