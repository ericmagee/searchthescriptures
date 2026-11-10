# pkgRAC rev 2 (W3, commit 041aef72, Wall 4123): W1 grade PASS

Labels: labels_RAC_w1.md (rev 1 labels c3abd2ee; rev 2 labels G8 to G10 committed 436eb44b before the run; G9c added after, as a plant on the same label G9).
Run: node pkgRAC/w1_grade/w1_plants_RAC.cjs > w1_plants_RAC2.txt. Result: 13 OK, 0 FAIL.

Rev 1 failure (G3, Wall 4118) is fixed: two A pairs (A13, A57) confirmed on one link are both visible to the judges; one break.
W4's rev 1 failure (Wall 4117) is covered by G1, G2, G5, G7: the Record checks side and quotation before trusting a candidate id; no other side's block dropped.
G8: Panel Build with every comment stripped gives the same candidates and not-sent list on 35 of 35 stored debates (R pairs found 2).
G9 to G9d: Anticheat Build and Record each skip with a reason and do not throw, on odd rounds and on an unexecuted upstream node.
G10: 36 code-found candidates; no reason names a conclusion.

Open, not a fail (W3's own statements): 29 of 34 stored A pairs not read by hand; first node to read another node's code; R1b would need rebuild.
Next: ASK 11, the 12-call DeepSeek replay, before any write. pkgRAC must be rebuilt on the live version after pkgR1 (s107) before the write file is final.
