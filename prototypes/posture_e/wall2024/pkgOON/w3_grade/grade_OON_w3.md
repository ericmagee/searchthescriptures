# W3 second grade of pkgOON (W2, Wall 4376): PASS with limits

File /mnt/project-files/wall2024/parent_s113_OON.json against live s113 (fetchback_live_s113.json). Offline; nothing written. Claim Wall 4387. Labels committed before any run of the candidate (commit 70d7e6f9). Harness pkgOON/w3_grade (d.cjs diff, o.cjs, p.cjs plants, q.cjs strong check). MEASURED.

## Diff
- 418 nodes both; connections equal; only the Shared Library node differs; +40 code; prompt 0.
- One library line differs (index 1633): NONE added to the pkgOOS word list, with a comment. Outside it, only the library sha in the header and the per-node size numbers of the map differ (10 nodes use the line).

## Stored case (run 34726, Gate Build on stored inputs)
- Live s113: luna 15 gate items (as in the run). Candidate: luna 4 (2 premise items, 2 contradiction items). The 11 NONE items raise no gate item. terra and sol output byte-equal.
- Strong check: the candidate's output on the stored NONE answers equals live s113's output on the same answers rewritten STRUCK (the "to" field apart). So NONE does exactly what the existing strike word does, and nothing else.

## Plants (entered at the parsed send-back item, luna S12 unless stated)
| Plant | Result |
|---|---|
| "NONE", "none.", "(NONE)" | struck, as labeled |
| "KEEP", "NO CHANGE", "NONETHELESS the row stands", "Not applicable" | same as live (NOT APPLIED) |
| a full row whose quotation begins "None of ..." | same as live (applied as a row, not struck) |
| "OUT-OF-ROUND CONCESSIONS: NONE" | same as live (NOT APPLIED) |
| "STRUCK" | same as live |
| row made to end COUNTED, answer NONE | NOT APPLIED with the pkgOOS reason, as labeled |
| NONE on other rules (E-ANS S1, E-VOID S6, E-PREM S8, E-UNG S25) | same as live in kind and reason (S25's item differs only in its gate number, which shifts when the 11 go) |
| "NONE; the row stands as written" | STRUCK. Wrong by meaning. LIMIT. |
| "NONE OF THE ROWS CHANGE; I KEEP ALL" | STRUCK. Wrong by meaning. LIMIT. |

## Limits
1. Any answer on an E-OOR item that begins with the word NONE strikes the row, whatever follows. A judge who means "no change" and begins with NONE loses the row. Stored answers: 11 NONE, all meaning strike (W2's scan; not re-counted by me). The row struck is one the code check found absent from the round, so the cost of a wrong strike is a row that should not stand as written in any case.
2. "OUT-OF-ROUND CONCESSIONS: NONE" on a row item is still not read and still counts.
3. The judge is still not told the strike form in the "not found verbatim" message. pkgOON reads what luna wrote; it does not tell the next judge.
4. Plants enter after the reply parser; the parser was exercised only by the stored reply. Gate Record, the alternate and round 2 copies use the same library line and were not run by me. The whole chain was not replayed by me (W2 and W4 did, with matching figures: luna 12 to 1).
5. luna stays removed on the one K-G1 count; pkgOON does not restore the seat.

No enforcer log row form changes, so no rolled-back insert was run.
