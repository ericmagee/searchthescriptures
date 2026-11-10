# GRADE (W3): pkgK7C (W2, commit 14584aae, pkgK7C/parent_s112_K7C.json) on live s112: PASS, with four limits
Labels committed before any run of the candidate (1661934c). First non-builder grade; W4 gives the second.

## What it is
A K-G7 cure item whose link the engine's confirmed closing contradiction broke reads CURED ("the link is broken by the engine's confirmed closing contradiction, which no count carries (pkgK7C)"), and its premise is left out of the count the cure step expects.

## Diff and size (measured by me)
- 418 nodes in both files; only the Shared Library differs; +590 code; connections and all other node fields equal; no prompt text.

## Through the chain, at the written rows (execution 34703, stored replies, Panel Cure Check to Replay Rows)
- Harness check: my replay of live s112 gives the three stored replay rows exactly.
- Candidate against live: luna's row and sol's row identical. terra's row: two audit lines differ and no field (the K-G7 report line's WHY, "retracted" to the pkgK7C reason; the ALTERNATE TRIED line, "2 uncured item(s)" to "1 uncured item(s)"). drv_uncured, verdict, counts unchanged: luna 0, terra 1, sol 0, all BROKEN.
- Haiku: K-G7 on "D6" UNCURED to CURED; uncured 2 to 1; still NOT SEATED (K-C).
- Log: 551 rows in both; 2 rows differ (terra K-G7, Haiku K-G7), no new row, no new kind or status value. Rolled-back insert of the two changed rows through record_enforcer_log: 2 rows written inside the transaction, then rolled back.
- Note on W2's "written rows unchanged": no field changes, but terra's row text changes in the two audit lines above.

## Plants (cure check called directly on Haiku's stored cure inputs; outputs h_out.txt, h3_out.txt, h4_out.txt)
All as labelled:
- No confirmed line; a confirmed line on defender link 5 only; on challenger link 6 only; a confirmed row with no side; neither record executed: identical to live.
- "D16 vs C5" with links 1 and 6 confirmed: identical to live (no prefix match).
- "D6 vs C2" (usual label): CURED. Link given as text "6": CURED. Confirmed line only in the Judge Contradiction Record: CURED.
- Challenger item "D2 vs C6" with challenger link 6 confirmed: CURED; with defender link 6 confirmed: identical to live; challenger item "D6 vs C2" with challenger link 6 confirmed: identical to live.
- K-G4, K-G1, K-F, K-C, K-G6 on D6 with link 6 confirmed: identical to live. Only K-G7 changes.
- A second K-G7 item on D1 (not confirmed) beside D6: the D1 item reads as in live. With both lines in the witness form, live expects a corrected count of 6 and the candidate 5; a count of 5 cures D1 in the candidate only; a count of 6 cures both in both; a count of 4 cures neither D1.
- First plant of the D1 item had no response line and read "no written response" in both files, so it did not meet its condition; redone with its response line (h3, h4).

## Stored scan and counted tags
- Five stored executions (34703, 34626, 34299, 33371, 33490), every panel and alternate cure input: 497 cure items. Items whose status or reason differs: 4, all rule K-G7 on the confirmed link 6 (34703 Haiku and terra; 34626 luna twice). Status changes: 1 (Haiku, UNCURED to CURED). No removal or seating changes. Matches W2's stored count of 4.
- Counted tags touched: the cure-step report line (v21), rule K-G7 only. No v38, v41 to v48, v51 or v52 line is touched.

## Limits (none a FAIL of the package as its manual section states it)
1. The judge is still asked the item, so a judge may still answer RETRACTED and withdraw a break the engine then restores (W2 states this).
2. K-G4 on the same line is untouched. terra's own D6 line drew K-G4 and K-G7 together in 34703; K-G4 was cured only because terra retracted. A judge who keeps the line can still be counted on K-G4.
3. The test is by link, not by ground: a D6 BROKEN line that rests on a witness is also read CURED when link 6 is confirmed broken, and its premise is not required in the count.
4. It would not have seated Haiku in 34703: Haiku's K-C item is a true failure and keeps it out.

## Manual section
pkgK7C/manual_section_K7C.md matches what the code does. It goes on the shelf; it enters the manual only on the operator's write and W4's confirmation.
