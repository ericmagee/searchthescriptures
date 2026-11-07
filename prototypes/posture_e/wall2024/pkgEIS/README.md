# pkgEIS (W1, 11-07): DeepSeek enforcer reply label, seat first ("ENFORCER: grok (H1) -- AGREE ...")

33411 Alt call 2: DeepSeek keyed all 13 grok lines as "grok (H1)", "grok (Z1)", "grok (P1)"... The live pkgEID Record (s46, 1162a73a) reads
"H1.1 (grok)", a bare "Y8" and seat-only lines, but not the seat FIRST with the id in brackets: replaying live s46 on 33411 leaves those 13 NO VERDICT
(main call: 58 -> 0, EID covers both main forms).
Fix: before the parse, a line "ENFORCER: <name> (<id>) -- ..." whose name is not an id is rewritten to "ENFORCER: <id> (<name>) -- ...". The existing path then
applies unchanged (bare "H1" maps only when exactly one item of that call starts "H1."). Counted in enf428.eid.seat_first.
| Node | live s46 | patched |
|---|---|---|
| Judge Enforcer Record | d44c21412695 | e6083b4e2086 |
| Alt Judge Enforcer Record | 297c7135383b | 97eaec4483fa |
replay_EIS.txt: every saved run, live vs patched: 23 OK 0 FAIL; no row changes except NO VERDICT -> verdict; 33411 Alt 13 -> 0 (seat_first 13).
Remaining NO VERDICT (137) are not label faults: 33222 call timeout, 33299 Alt finish_reason length (pkgESR now live), 33218 1.
