# ASK 567: the layer check reads the Oracle's closing ANSWER blocks (W3, DRAFT 1)

DRAFT ONLY. Nothing is written. Each exact text needs grading (W1), the builder's anchor check (W4) and the operator's approval.

Basis: the operator, 16:51 to 16:52 CST 11-23 ("the Oracle should be breaking everything down with the layers...") and 17:20 CST 11-23 ("as policy leave nothing to chance.. if you do, it will likely fail."). Failed runs as evidence for the Oracle-facing sentence: runs 41736 and 41822.
My mistake that this ASK repairs: ASK 557 Change D (live in engine 215e327a) was planned without a test on a closing ANSWER block (Wall 11010 item 2).

## 1. What the record shows (fetch-back of the written engine 215e327a, ask557/w4/write/fetchback_engine_557.json; LAY rebuilt at 11,987 characters, the MAP length)
1. LAY.structure builds blocks only from lines that match CP. A close's line "ANSWER: <book chapter:verse> -- D<n>" does not match CP. Its text is read by no test.
2. Offline, live LAY with `{oracle:true}`: an ANSWER block holding only an [L1] and an [L3] line gives 0 items. On run 41822's stored close (defender_r4), the 4 items are the D1 to D4 summary lines; none of the 24 ANSWER blocks is read.
3. So in the close, the four layers under each ANSWER line (ASK 557 Change B, live) are asked for by the prompt alone. Nothing sends the close back when they are missing.
4. The live Change B sentence reads "[L1] the pressed verse;" and does not say that the reference is written again on the [L1] line. The reference stands on the ANSWER line. LAY's verse reader credits a tagged verse only when its reference is on the tagged line (test 3 below).

## 2. Change 1. LAY reads an ANSWER line as a block head, for the Oracle seat only
Target: LAY.structure in the Shared Library LIB, engine and child (the child's Library Check compares lib and map sha). Both "library sha" headers reset in the same write.
Anchor (one occurrence in LAY and in the Shared Library text): `for(const l of L){if(CP.test(l)||MD.test(l)){if(cur)B.push(cur);cur=CP.test(l)?{head:l.trim(),lines:[l]}:null;continue;}`
Exact change, the anchor becomes: `for(const l of L){const hd=CP.test(l)||(!!(o&&o.oracle)&&/^[\s>*_#-]*ANSWER\s*:/i.test(l));if(hd||MD.test(l)){if(cur)B.push(cur);cur=hd?{head:l.trim(),lines:[l]}:null;continue;}`
What it does: when the third argument is `{oracle:true}` (passed only by D2B, D3B and D4B Build, and only when the defender's profile is 'oracle'), a line that begins "ANSWER:" opens a block. The block then gets the tests every Oracle block gets today: two verses quoted with their references on [L1] and [L3] lines, an [L1] among them, and an [L2] and an [L4] line. With no third argument, or `{oracle:false}`, `hd` equals `CP.test(l)` and nothing changes for a plain defender or for the challenger.
Not changed: CP, MD, `points()`, the callers, LAY.note, BAR, every prompt but the one sentence of Change 2.

## 3. Change 2. The closing sentence says where the reference goes (Oracle seat only)
Target: D4 Build, the ASK 557 Change B sentence. Anchor (one occurrence): `[L1] the pressed verse;`
Exact change: `[L1] the pressed verse;` becomes `[L1] the pressed verse, with its book, chapter and verse written again at the start of that line and its words quoted;`
Reason: without it the Oracle can keep the form the prompt gives (reference on the ANSWER line, the quotation on the [L1] line) and be sent back by Change 1 for "1 tagged verse(s) quoted with no reference on the line" (test 3). The sentence and the check must ask for the same form.

## 4. Order and dependencies
1. After ASK 566 (W4: how LAY reads tag positions and line forms). An answer written on one line, "ANSWER: Matthew 1:16 -- D1 -- [L1] "..." [L2] ... [L3] Matthew 1:2 -- "..." [L4] ...", draws a false item today (test 4; W4 11008 item 6). Change 2 tells the Oracle to put each layer on its own line, but the check should not depend on that being obeyed. ASK 567 is released only after ASK 566 shows test 4 gives 0, or the team accepts test 4 as a true form fault in writing.
2. With ASK 559 Change 1: its excuse line reads `if(absent(x)&&!need.length&&<pattern>.test(b.head))return;`. For the Oracle an ANSWER block without [L2] and [L4] has `need` non-empty and is not excused. No conflict; one sha reset if written together.
3. ASK 563's audit line counts the same blocks from the stored close; it stays record-only and agrees with this check by construction (both cut at lines that begin "ANSWER:").

## 5. Revert
Restore both Shared Libraries and D4 Build from the pre-write export; compare md5 per node; Library Check passes in both.

## 6. Test (offline, on the cut code; all already run with the exact change text above)
Each block is one ANSWER head with the lines named; verse rows empty, as in W4's tests.
| # | Block | oracle:false, live / changed | oracle:true, live / changed |
|---|---|---|---|
| 1 | [L1] with reference, [L3] with reference, an untagged "It fits" line | 0 / 0 | 0 / 1 ("no [L2] and no [L4] line") |
| 2 | all four layers, each on its own line, references on [L1] and [L3] | 0 / 0 | 0 / 0 |
| 3 | all four, but the [L1] line holds the quotation without its reference | 0 / 0 | 0 / 1 ("one verse only ...; 1 tagged verse(s) quoted with no reference on the line") |
| 4 | all four written on the ANSWER line itself | 0 / 0 | 0 / 1 (false; see section 4 item 1) |
| 5 | head in bold, "**ANSWER: ...**", all four on own lines | 0 / 0 | 0 / 0 |
| 6 | run 41822's form: quotation and "It fits D1: ..." on the ANSWER line, no tags | 0 / 0 | 0 / 1 |
| 7 | block 2 followed by "GAPS LEFT OPEN" and one GAP line | 0 / 0 | 0 / 0 |
Run 41822, all eight stored rounds:
- no third argument and oracle:false: identical live and changed in every round (CR1 4, DR1 4, the rest 0).
- oracle:true: identical in every round but CR4, which goes from 4 items to 28: the 4 summary lines and the 24 ANSWER blocks, each "no [L2] and no [L4] line: write an [L2] for each pressed word, from the [L2] SHEET, and the [L4] inference". No verse item among the 24. LAY.note renders the 28 in 5,451 characters.
After the write: Library Check passes in engine and child; every node but the two Shared Libraries and D4 Build keeps its md5; the Oracle's close message holds the Change 2 words once and a plain defender's holds none of the Change B sentence.
The proof is a live run: a close whose answers lack a layer is sent back once by D4B with the items listed, and the stored close carries the four tags under each ANSWER line (ASK 563's audit line shows the counts).

## 7. Stated limits
1. The close has one re-call (D4B). If the second close still lacks layers, nothing further is sent; the audit line records it.
2. An ANSWER block runs to the next head. Text after the last answer belongs to the last block unless a head follows; test 7 shows the GAPS lines do not add an item.
