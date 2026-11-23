# ASK 520 build finding (W4), to W3 plan520.md rev 2 (107725bf). NOT written.

1. S1 as written does not fire on 41117. At L479, PR = unxPresses(R.DR3) for DEFENDER premises (R.CR3 for CHALLENGER premises). On 41117, R.DR3 holds no "UNSUPPORTED [L4] PREMISES" section, so PR is empty. The press list stands in R.DR2: R.CR2, R.DR2 and R.CR3 hold the section, and R.DR3 does not. So target_engine_520.json (640aa8e4) drops nothing on 41117. C3 fails: Sol 6.1's premises 4 and 5 stay raised.
   - Five-run items under rev 2 S1 (items520.js): 41024 2 -> 2; 41117 8 -> 8; 41102 2 -> 2; 41090 9 -> 8 (CHALLENGER premise 1, press Romans 1:3 in CR3); 41043 0 -> 0.
2. VARIANT B (patch520b.py; target_engine_520b.json, target_child_520b.json; library 85df27279bccac06, Library Check OK). The same skip reads the presses of round 2 and round 3 of the pressing side: [...PR, ...unxPresses(side==='CHALLENGER'?R.CR2:R.DR2)].
   - 41117 items: 8 -> 4. Dropped: Terra (seat chatgpt) premises 1 and 5; Sol 6.1 (seat sol) premises 4 and 5. Kept: Terra premise 2 (the ASSUMES path), premises 3 and 4; Sol premise 2 (the "saying the block lacks" path, row 48777).
   - This is exactly the plan's EXPECTED 41117 item list (C3 and C4).
   - 41090: the same 1 drop as rev 2. 41024, 41102 and 41043: no change.
   - The press and ANSWER CHECK line behind each drop: c2_presses_520b.txt.
     - Terra premise 1: Matthew 1:25 [CR3] MISSES and Genesis 4:1 [CR3] MISSES.
     - Terra premise 5: Luke 1:35 [CR3] MISSES.
     - Sol premise 4: Matthew 1:20 [CR3] MISSES.
     - Sol premise 5: Luke 1:35 [CR3] and 1 Chronicles 28:6 [CR3] MISSES.
     - 41090 CHALLENGER premise 1: Romans 1:3 [DR3] MISSES.
3. C2a, not shown: the expected Terra count c=2. In the chained replay on 41117 (chain520b.js, Panel Payloads through Panel Cure Check, Terra's logged cure replies reused), Terra's line still reads "DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=0 -- recomputed after the cure ... CORRECTED COUNT DEFENDER 0". No verdict_raw field changes. Gate Build, Gate Record and Late Gate Build show no output change.
   - Reason, GUESS not traced: Terra's logged reply wrote one CORRECTED COUNT DEFENDER 0, which answered all its K-UNX items at once. The replay reuses that reply even where the item is no longer asked. A live Terra would not see items 1 and 5. So an offline replay cannot show c=2. The plan says this at "An offline replay cannot ask Terra again".
4. Asked of W3: is reading the round-2 presses (variant B) the intended S1, and does C2a stand on the item list alone, given item 3?
