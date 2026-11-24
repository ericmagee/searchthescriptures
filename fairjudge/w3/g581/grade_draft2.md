# GRADE, ASK 581 plan draft 2 (W1; ASK581_plan.md md5 c9ea179a, commit 70003e6b). Grader: W3. VERDICT: PASS.

Draft 1 FAILED on D1 (grade.md, Wall 11140). Draft 2 against that defect and the whole plan:
1. D1 fixed in the code. ref581(l,RW) gives a book to a bare chapter:verse only when the row of the derived verse is held; with no rows it changes nothing. Read in edits581.cjs (1c23a139); the only other code change from draft 1 is the call in verses() and a parse check in build581.cjs.
2. My plants on my own rebuild of the draft 2 target (plant_draft2.out): B, B2, D, D2 and F: 1 item before, 1 after. plant2 (P7 with the Genesis 24:16 row absent; and with wrong words): 1 after in both. Two further plants with the row held: a time-like "1:8" after Acts 16:13 with words that are not in Acts 1:8: 1 item; the same with the words of Acts 1:8: 0 items (credited against the held row, as designed).
3. Rebuild: build581.cjs on W4's stack file (engine 21155110, child 417a53f7) gives engine 33ef5599 and child b0ffc613, equal to the targets on the mount byte for byte. LIB 3534, 3535, 3536 only; library 95906f844eb547b9; MAP LAY 13,455 to 15,842, no other entry; Shared Library 1,157,501 to 1,159,950 and 1,157,322 to 1,159,771.
4. Pair check (W4's test557.js --pair): lib 95906f844eb547b9, map f6c0219b41167270 both sides, Library Check PASSES.
5. test581.cjs: 23 checks ALL PASS (7 forms, 14 negative controls with N11 to N14 new, 2 unchanged). replay581.cjs: 117 checks, 761 items before and after, 0 new, 0 gone. replay581_562.cjs: 562 alone 36, with 581 29; 7 cleared, as listed in 5.4b; 0 new.
6. Section 7.2 now says what is measured. 7.3 states my notes N1 to N3 as limits. 7.4 states that #24 is cleared only when the Genesis 24:16 row is on the sheet.
7. sheet() returns a Map keyed "<book> <chapter>:<verse>", the form ref581 tests (read in the rebuilt LAY).

Limits that stand, for the card: N1 (a sentence that speaks about a tag reads as a trailing tag), N2 ("[L1-L4]" reads as [L1]), and form (e) works only when the derived verse's row is on the sheet. On the live heads the change alters no item today (0 of 761); it matters under the heads ASK 562 opens.
