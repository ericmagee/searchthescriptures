# W2 grade of pkgU72 (W1 Wall 5210), parent wall2024/parent_s152_U72.json sha256 0db42d6a5817fc21

VERDICT: PASS WITH LIMITS. MEASURED unless marked.

- Identity: W1's build.cjs on fetchback_live_s152.json gives a file equal to the parent. Library lines 452, 459, 466 only; 442 nodes; connections equal.
- Wiring (read): kunxLines passes `text` (the judge's text) and `rk` (DR3 for a challenger premise, CR3 for a defender premise; the round whose block is read) to unxaCheck, which passes them to unxAcFail on path B only. A press whose check fails is skipped and the loop goes on to the next press. Path A and the other paths are untouched.
- W2 plants on unxAcFail (w2_grades/u72/plants.cjs): 13 of 14 as wanted. Caught: bullet plus bold label and bold grade, no brackets with MISSES, a blockquote prefix, a double space in the reference, "1 Cor. 7:5". Not caught (fires as live): another round, a range 1:25-26, FAILS plus a MEETS line, a numbered line, lowercase "fails", another book with the same verse.
- Stored format scan (debate_judgments id >= 900, 222 judgments, every line that begins "ANSWER CHECK"): 12,547 lines. All seats write the round in square brackets except 9 sol lines with a bare DR3 (also read). No numbered or table lines. 983 lines carry a graded "-- MISSES" or "-- FAILS".
- LIMIT 1 (the UNSAFE direction, the one DIFF): an answer quote that itself holds "-- FAILS" or "-- MISSES" before a real "-- MEETS" is read as a failure, so path B would not fire when it should. In the stored lines: 0 of 12,547.
- LIMIT 2 (W1's): a quote holding "-- MEETS" before a real failure is read as MEETS; the item fires as on live (safe). In the stored lines: 0 of 12,547.
- LIMIT 3 (ESTIMATE, by reading): the check is by reference and round, not by premise. If the same verse is pressed under two premises of one round and the judge fails it under one, path B is also held back for the other.

## Rev 2 (W1 Wall 5219, parent sha256 e177cbe5261791ef): PASS WITH LIMITS (W2 confirms)
- Identity: W1's build.cjs on s152 reproduces the parent exactly.
- W2 plants: 16 of 17 as wanted (plants_rev2_out.txt). New: a [CR3] line with a later "[DR3]" is not read; "-- HOLDS -- ... -- FAILS" is not read; a line with no "-- ANSWER:" label is not read.
- LIMIT 1 unchanged (the one DIFF): "-- FAILS" inside the quoted answer before a real "-- MEETS" is read as a failure. Stored 0 of 12,547.
- LIMIT 3 unchanged: keyed on reference and round, not premise.
