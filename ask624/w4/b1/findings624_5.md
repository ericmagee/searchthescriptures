# ASK 624.5 build: findings on live engine 912dd47a / child aad0ad9c (W4, 19:12 CST 11-24)
Eric 19:08: "Build; a KEEP is uncured". Plan rev 2 47c54193. Base files: b1/base_eng.json, b1/base_child.json (= ASK 578 fetchbacks).
All late-gate code is Library-built (engine Library only after ASK 578). MAP keys: Late Gate Build, Alt Late Gate Build, R2 Alt Late Gate Build (287 entries each); Gate Record, Alt Gate Record, R2 Alt Gate Record (~300 entries).
- Late Gate Build unique lines LIB 3479-3491 (0-based): reruns gateCure2024 on the gate reply; sends ONLY when a gate change raised a new LIVE item (`hang`, line 3482 `if(!hang.size)return;`). Items come from C.late; message line 3486-3488; reply form "GATE: <id> || KEEP/CHANGE TO ...".
- Gate Record late handling LIB 3466-3474: C2=gateCure2024(..., L.items, lateReply, ctx); a late item's count rides on the gate change that raised it (hang); LG.off reduces C.uncured; line 3472 adds u to p.drv_uncured. Audit line v38 E-GATE LATE.
- gateCure2024 LIB 1814..3463; returns {res,its2,add,fresh,uncured,R2,late}. R2=gateItems2024(seat,raw,F,its2,ctx).
- So 624.5 items (no hang) need: (1) Late Gate Build sends when they exist even with no hang; (2) they are kept OUT of gateCure2024's late items and cured by their own path in Gate Record: read GATE lines (gateRead2024), apply CHANGE TO (sbApply2024 + WHICH HOLDS label), re-run the check, UNCURED (KEEP or no answer) adds 1 to drv_uncured per item, with its own AUDIT line.
- OPEN QUESTION before building: at Late Gate Build time p.verdict_raw is the text BEFORE the gate changes are applied (they are applied in Gate Record). The check must run on the text AFTER the gate (plan). Need the gate-applied text and the recomputed verdict word at Late Gate Build: find where Gate Record applies gate changes (R2 / sbApply path) and reuse it.
- Overlap check: pkgEB7 (LIB 2491, ruling 421, LIVE) is a SELF-CONTRADICTION rule on CONCEDED LINKS vs ANSWER CHECK (UNEXHIBITED premise). Different pair of lines from 624.5's three kinds; no overlap found so far.

## Answer to the open question, and the build design (19:20 CST)
- gateCure2024 -> R2=gateItems2024(seat,raw,F,its2,ctx) -> R1=sbApply2024(...) returns {text:T, fields:{verdict_tag,...}, tag, ...} (LIB 1501). So in Late Gate Build, C.R2.R1.text is the judgment text with the send-back and gate changes applied, and C.R2.R1.fields.verdict_tag (or tag) is the engine's recomputed verdict. That is the input of the check (plan N2: faults(text, word)).
- Text changes are realized through sb items (`add` -> PASS.sb_items) applied later by sbApply2024; Gate Record writes audit lines and rows, not the text.
Design:
1. New Library entry SCK624 (engine Library): items(text,word) -> [{kind,key,lines,itemText}] for (a) WHL507.faults(text,word) WHICH HOLDS AGREEMENT, (b) E-RTL, (c) E-GCA; same function re-run for the cure.
2. sbLabel0 (LIB 1374-1375) learns WHICH HOLDS.
3. Late Gate Build (LIB 3482-3490): compute SCK items from C.R2.R1 for each seat; send when hang OR SCK items; SCK items get gid G<n>, src 'E-SCK', no hang; their texts are the N1 texts + "A KEEP does not cure this item."
4. Gate Record (LIB 3467-3478): gateCure2024 gets L.items without E-SCK; E-SCK answers read with gateRead2024(lt); CHANGE -> sb item added (rule E-GATE, item kind); re-run sbApply2024 with all adds, then SCK624 on its text/word: cured if the item key is gone; KEEP / no answer / still raised -> UNCURED, +1 drv_uncured each; AUDIT line and gate_rows row per item.
5. Alt and R2 Alt variants share these Library lines (one change covers the three paths). Check each MAP before building.
Next: read run 42373 chatgpt stored judgment (DB) to fix E-RTL and E-GCA readers on real text (C1).
