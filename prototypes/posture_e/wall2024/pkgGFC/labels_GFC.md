# pkgGFC labels (W3 build, offline on s110). Written before the build and before any test run.
Change: the gate reply reader (gateRead2024). When a CHANGE TO field holds a collision line "D<i> vs C<j> ..." followed by "FORCED: D<i> vs C<j> ..." for the SAME pair,
the field is read as the collision line alone and the FORCED line is kept beside it; gateForcedM2024 and gateForced2024 read that FORCED line as they read one in the reason field.
No prompt text. Nothing else changes.

- T0 The base chain on s110 reproduces the stored rows of execution 34626.
- T1 34626 as stored (luna G5, FORCED after "; " inside CHANGE TO): G5 CURED, no new item raised, gate 5 of 5, luna drv_uncured 1 (item S12 remains). luna's written verdict equals, line for line, the verdict live code gives for the same words with the FORCED line in the reason field.
- T2 The same reply with the FORCED line already in the reason field: candidate output equals live output (whole chain to the rows).
- T3 PLANT other pair: "D4 vs C2 ...; FORCED: D4 vs C3 ...": not split; output equals live (uncured as today).
- T4 PLANT bad FORCED (a quotation not in its round) inside CHANGE TO: the item stays UNCURED; the result is the same as live gives for that bad line in the reason field.
- T5 PLANT separators: " / FORCED:", " -- FORCED:", ". FORCED:", " FORCED:" (space only): each read; state any that is not.
- T6 PLANT a CHANGE TO that is a FORCED line alone, and one that is a collision line alone: output equals live.
- T7 terra and sol rows unchanged in every test. Other gate items of luna (G1 to G4) unchanged.
- T8 Size measured by diff against the s110 fetch-back; only the Shared Library changes; connections equal.
- T9 Scan (measured): stored gate replies and send-back replies in debate_enforcer_log whose CHANGE TO holds a collision line followed by a FORCED line; count, and what the candidate would do with each.
- NOT COVERED unless a case is found: a RULE K-G4 gate item answered in this form (none in 34626).
