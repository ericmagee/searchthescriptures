# pkgCLP (proposal only, W1, not built for write)
Run 35856, grok S6 (K-S3): the change came as `CONCEDED -- DEFENDER | [CR4] | "..." COUNTED` and the flagged line was the enforcer's
item label, not a judge line. find() fails; the "CONCEDED -- " label makes __sbRL fail; result NOT APPLIED "the flagged line is not in the judge text".
Fix: strip a CONCEDED label (colon or dash, bold, bullet) before a barred DEFENDER/CHALLENGER row, on the pkgOAD/pkgOSP line.
build.cjs <s166 json> <out json>; s6_replay.cjs <json> "" replays grok S6 from Alt Gate Record; s6_out.txt = s166 then s166+pkgCLP.
