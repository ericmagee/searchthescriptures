# W3 second grade of pkgGK1 rev 1 (W2, Wall 4390): PASS with limits

File /mnt/project-files/wall2024/parent_s113_GK1.json against live s113. Offline; nothing written. Claim Wall 4395. Labels committed before any run (commit a9fdaefe). Harness pkgGK1/w3_grade (k.cjs, t.cjs). MEASURED.

## Diff
- 418 nodes; connections equal; only the Shared Library differs; +97 code; prompt 0; one library line (index 1903, the filter of new K items charged to a gate change).
- Baseline: Gate Record replayed with live s113 code on the stored inputs of run 34726 gives the stored output of the run (seat figures and all 29 rows, timestamps apart).

## Stored case and plants (Gate Record, luna's gate reply edited)
| Case | Live s113 | pkgGK1 | Label |
|---|---|---|---|
| P0 stored | uncured 12; G14 UNCURED | uncured 11; G14 CURED; K-G1 row written RECORD-ONLY | met |
| a. G14 changed to the wrong side | 12 | 12 (G14 not cured, still counted) | met |
| b. G14 BROKEN with no FORCED line; raises K-B and K-G1 | 12 | 12 (K-B still charged to G14) | met |
| c. G14 answered KEEP | 12 | 12 | met |
| e. G15 changed to CHALLENGER LINK BROKEN on the unanswered witness (K-G1, challenger side), with G14 as stored | 13 | 11 | met (the package's class, both sides) |
- terra and sol: output equal in every case. Rows changed on P0: 2 of 29 (G14 to CURED; the K-G1 new-item row to RECORD-ONLY). Judgment bodies changed: 1 (luna).
- Rolled-back insert of the two changed rows through record_enforcer_log: 2 rows written, then rolled back; 0 left.

## Limits
1. The verdict keeps a link BROKEN on an unanswered witness with a conceded count of 0. Recorded, not repaired (W2 states this).
2. The exemption is for any K-G1 raised by an applied change on an E-GATE M CONTRADICTION item. It is not tied to the link the item names. With one line changed per item I could not make a K-G1 on another link; NOT SHOWN either way.
3. The K-G1 row keeps cure_status UNCURED with "(RECORD-ONLY)" in its reason. That is the existing form for record-only new items; a reader who counts UNCURED rows in the log over-counts by one. In plant a the row reads RECORD-ONLY while its gate item is counted for not being cured: the count is right, the row's wording says less than the whole.
4. A K-G1 raised from a gate item that is not E-GATE M stays counted by the code as read; I could not plant one.
5. Alternate and round 2 copies use the same library line and were not run. NOT SHOWN: luna keeps its seat (no chain to the seat by me).
