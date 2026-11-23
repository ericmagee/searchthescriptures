# Fair judging ground: DRAFT build plans (W3, draft 1)

DRAFT ONLY. Nothing here is written, and nothing may be written until the operator rules and each plan passes grading. Asked by the coordinator 16:20 CST 11-23. Source of the proposals: fairjudge/w3/PROPOSALS_rev1.md rev 2 (md5 6908ea29).

Read for the targets: the builder's fetch-back of the live engine, askbfx/w4/write/fetchback_engine_bfx.json (engine 5bc57e2a, 397 nodes; Shared Library 1,144,751 characters). Positions below are character offsets in that file's Shared Library code and are given only to find the place. The builder takes a fresh live readback before any write and matches on the quoted anchor text, not on the offset.

Common to every plan:
(a) Writer: W4 alone, on a press of W4's own card. Touched nodes only. No model setting changes. No prompt text changes unless the plan says so.
(b) Revert: restore the touched nodes from the pre-write export taken at the readback, then fetch back and compare the md5 of each touched node with the pre-write md5.
(c) Proof: an offline harness run of the changed function on the stored rows of run 41822 (run41822/enforcer_log.json, results.json), with one control that must not change. A live run proves it afterward.
(d) Grading: one non-builder seat per plan.

## P1. A judge's cure statement is not a collision line
Target: Shared Library, the E-COL collision-group builder. Anchor: `for(const j of __ecfJ)for(const l0 of j.t.split('\n')){const l=l0.replace(/^[\s*\-•]+/,'');` followed by `if(!__ecfColl(l))continue;` (near 756016). E-ONE rows are built from the E-COL rows (anchor `__e1.push({...base,rule:'E-ONE'`), so one filter serves both.
Step 0 (trace, W4, no write): show which text put "FORCED: D3 vs C5 applies (Commitment 7).; JUDGE STATEMENT: ...]" at the start of a line of j.t. GUESS, not checked: the cure audit mark `'; STATEMENT: '+cureSafe(cureCut(x.statement))+'; JUDGE STATEMENT: '` (near 377595) carried a statement with a line break in it, and cureSafe does not remove line breaks, so the tail of the mark became a line of its own.
Change: in the builder loop, skip a line that is part of an audit mark: add, before `if(!__ecfColl(l))continue;`, `if(/^\[AUDIT\b/.test(l)||/;\s*JUDGE STATEMENT:\s/.test(l))continue;`. If step 0 confirms the guess, also make cureSafe replace line breaks with a space, in the same write.
Revert: (b).
Test: feed the builder chatgpt's and argon's stored verdict text of run 41822. Expect no group for "FORCED: D3 vs C5 applies (Commitment 7)." (rows 52441, 52511, 52535) and none for argon's two statements (rows 52792, 52793, 52819, 52820). Control: the real lines behind rows 52439 and 52440 still form their groups.

## P2. The E-COL cure test reads the reply
Target: Shared Library, the E-COL cure branch. Anchor: `const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(` and, two statements on, `if(!fs)return res(false,'the line names no answering side');` (near 644260).
Change: when the answer is a CHANGE and its CHANGE TO text grades the pair BROKEN or FORCED, build L from the CHANGE TO text (the value the branch reads as `__to` in the pkgECL block just above); otherwise from it.line as now. The pair match `pm` keeps its fallback to it.item.
Revert: (b).
Test: item of row 52535 with chatgpt's stored CHANGE TO, which carries "ANSWER [CR4]". Expect the side test to find side C and the branch to go on to its quotation checks, not "the line names no answering side". Controls: a CHANGE TO with neither an ANSWER tag nor LINK BROKEN is still refused with that reason; the items of rows 52837 and 52838 (argon, CURED) still cure.

## P3. A gate change the engine refuses does not remove the seat
Targets: Shared Library, (1) the E-APPLY item pushes that refuse a change under pkgPS (anchors `(pkgPS, W3 2446)'` and `pkgPS, W3 2446: a premise change stays inside the premises its items name)'`, near 337194 and 337442) and under pkgSGA (anchors `(pkgSGA2, W1 2695)'` and `write the whole line with its label (pkgSGA)'`, near 334737 and 335153); (2) the E-GATE cure loop, anchor `const __rct=!cured&&a.ans==='CHANGE'&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct);` (near 441581).
Change: (1) add `rfs:'pkgPS'` or `rfs:'pkgSGA'` to those pushed items; no other field changes. (2) In the cure loop, when the answer is CHANGE and the matching item carries `rfs`, the row is stored as the existing RECORD-ONLY rows are (the form of row 52587: status RECORD-ONLY, reason ending "(RECORD-ONLY)"), with the reason "<package> refused the gate change; the judge's line before the change stands (recorded, no seat removed): <the refusal's own reason>", and it is not counted in drv_uncured. (3) W1's condition: the send-back items the refused change was written to answer are stored the same way, with the same refusal reason, so the record shows they were not cured.
Not changed: silence ("no GATE line for this item (silence counts)") and every other refusal.
Revert: (b).
Test: sol62's gate answers of run 41822. Expect rows 52585 and 52586 stored RECORD-ONLY with the pkgPS reason, drv_uncured for sol62 not raised by them, and the count line left at the value before the change (1). Controls: a silent gate item still stores UNCURED and counts; a pkgRCT refusal still stores as it does now.

## P4. The run row and the run report carry every written verdict
Targets: Build Save Body (the `RN` value saved as review_notes; anchor `saveBody:{engine:S.challenger.engine,review_notes:RN,`) and Format Markdown (the report). Source of the data: the removed seats already held in alternates_seated and alternates_tried (field removed_seat) and each removed body's verdict text.
To confirm at readback (not yet read): the node at which a removed seat's verdict text is last carried (Alternate Merge or Pass Accumulate).
Change: append to RN one line per removed seat: `REMOVED SEAT: <seat>; VERDICT WORD: <the word of its RESULT line>; REMOVED BY: <rule and item of the row that stayed UNCURED>`. Format Markdown prints the same lines under the panel. No other column of the saved row changes; nothing counted changes.
Revert: (b).
Test: run 41822 data. Expect three lines: sol62, chatgpt and gemini, each BROKEN (W1, Wall 10936 A), and every other field of saveBody identical to the stored row.

## P5 step 1 and P6 step 1. Two audit views (record-only, no engine write)
Target: the database, two new views over debate_enforcer_log. No engine node is touched.
Change 1, enforcer_rulings_by_collision: for each run_token and item of rules E-COL and E-HOLD, one row per seat with the RIGHT word read from cure_reason by the pattern `ENFORCER (AGREE|DISAGREE) \(right: ([A-Z ]+)\)`, and a column split = true when the item has more than one RIGHT word in the run.
Change 2, enforcer_pushes_by_side: E-HOLD rows whose cure_reason holds "right: BROKEN" and "judge wrote UNDERDETERMINED", with a column against = DEFENDER when the reason holds "ANSWER [CR" or names the defender's answer, CHALLENGER when it holds "ANSWER [DR" or names the challenger's answer, else UNSTATED; and a count by side for the run.
The run report (W4) reads both views and prints them. The engine is not changed.
Revert: DROP VIEW for each.
Test: run token ODV1-41822-nnfywk74. View 1 must mark D3 vs C4 and D2 vs C2 as split (AAR DEFECT 3). View 2 must return the seven rows 52448, 52452, 52453, 52455, 52458, 52678, 52800 and no row against the challenger. Control: run 41736 returns rows without error.

## P8. "Lacks a layer" means the tag is absent
Finding at the read: this check is already in the engine as a trial. Shared Library holds `const EPS_STATUS='TRIAL';` (near 878898), and rows 52470 and 52479 of run 41822 already end "(TRIAL pkgEPS: would not be sent: the push counts the premise but names no layer the block lacks; the block exhibits [L1], [L2], [L3])". The trial caught both rows the proposal rests on.
Target: Shared Library, that one constant.
Change: `EPS_STATUS='TRIAL'` to `EPS_STATUS='LIVE'`. With LIVE the existing code stores "ENFORCER HELD (pkgEPS, not sent; ...)" and the push is not sent back.
Revert: the constant back to 'TRIAL'.
Test: E-PREM items of sol in run 41822. Expect rows 52470 and 52479 stored ENFORCER HELD and not sent back, and sol's count not raised from 1 to 2 by them. Control: an E-PREM push that names a layer the block does not exhibit is still sent.
For the grader: the trial's record over earlier runs should be read before this is released (how many pushes it would have held, and whether any was a true missing layer).

## P10. The keystone check is done by the engine
Targets: Shared Library, the E-KEY item builder. Anchors: `const link=m[1];const own=ls.filter(x=>x!==l&&new RegExp('^(?:FORCED\\s*:\\s*)?'+link+'\\b').test(x)).slice(0,6);KG.push({seat:j.seat,line:l,link,grade:m[2].trim(),own});` (near 770776) and `for(const g of KG){if(__ekK(g)){__EKR.push(g);continue;} /* pkgEKR */` (near 772062).
Change: (1) derive the word in code: BROKEN when one of the judge's own lines on that link grades DEFENDER LINK BROKEN, or is a FORCED line whose ANSWER is a defender round ([CRn]); STANDS otherwise. A CHALLENGER LINK BROKEN line never counts (W1's condition). (2) When the judge's keystone word equals the derived word, store a code row in the pkgEKR form ("NOT ASKED (code): the keystone word follows from the judge's own lines") and ask the enforcer nothing. (3) Only on a mismatch build the E-KEY item, and hand the enforcer only the lines that counted in (1).
Not changed: the RULE E-KEY text, pkgEKR, pkgEKD.
Revert: (b).
Test: argon's verdict text of run 41822. Its lines on D4 are a CHALLENGER LINK BROKEN line and a FORCED line; expect derived STANDS, equal to the judge's word, so no E-KEY item and no row like 52801. Controls: a judge with a DEFENDER LINK BROKEN line on the keystone link and the word STANDS still gets an E-KEY item; the pkgEKR path still fires on a confirmed closing contradiction.
Open for the grader: whether the FORCED line behind row 52801 is answered by [CRn] or [DRn]; the test result depends on it and I have not read that line's ANSWER tag.

## P14 step 1. The close is checked against the press list (record-only)
Target: D4 Extract (the defender's close), and D4B Extract if the readback shows it on the live path. Record-only: one audit line; nothing is sent to the Oracle.
Change: pressed = each verse reference that heads a line under PRESSED WITH in the challenger's rounds; answered = each reference on a line of the close that starts "ANSWER:". Store `[AUDIT: CLOSE PRESS LIST (record-only) -- PRESSED: <n>; NO ANSWER LINE IN THE CLOSE: <references>]` in the run's review notes.
Revert: (b).
Test: run 41822. Expect PRESSED 21 and the five references Esther 2:7, Isaiah 7:14, John 1:14, John 6:42, Luke 2:49 (FINDINGS A8).
Correction to the proposal's evidence, found at this read: the GAPS instruction of ASK 537 (D4 Build, "GAPS LEFT OPEN: track every question you put to your opponent ...") asks the Oracle for its own presses that the opponent left unanswered. The five verses above are the challenger's presses that the Oracle's close did not answer. They are two different lists. "GAPS: NONE" is therefore not shown false by the five verses. Whether it is true (whether the challenger left any of the Oracle's presses unanswered) has not been checked. P14 step 1 stands as a record of the close; its tie to ASK 537 is withdrawn. AAR DEFECT 14 and item 4 of FOR THE OPERATOR carry the same conflation.

## P16(a). The gloss check also reads the defender's [L2] lines (record-only)
Targets: Shared Library `kl2gLines(text,REN0)` (near 88757; TRIAL, list only) and its call site `const X10=kl2gLines(text);` (near 522689), which reads a judge's text. The renderings come from L2 Count Plan (`out.ren`, ASK 533).
Change: one further call of kl2gLines on the defender's rounds (CR1 to CR4), with a line filter that accepts a defender [L2] line (today's filter takes lines that begin with a link label). Each hit is stored as an audit mark only: `[AUDIT: K-GLS DEFENDER (record-only) -- <Strong's number> "<gloss>": "<word>" is not a KJV rendering (read: <renderings>)]`. No item, no send-back, no count.
Revert: (b).
Test: CR3 of run 41822. Expect one mark for G4690 "seed, including the male sperm", word "sperm", renderings read seed, seeds, issue. Control: a defender [L2] line whose gloss is a rendering yields no mark; the judges' K-GLS items are unchanged.

## Order and dependencies
1. No engine write: P5 step 1 and P6 step 1 (views).
2. One constant: P8.
3. One place each: P2, P1 (after its step 0), P16(a), P14 step 1, P4.
4. Several places: P10, P3.
P1 and P2 touch the same branch family and can go in one write with separate tests. No plan here changes a prompt, a model setting, or corpus text.

## Not read, stated plainly
1. The line reader that precedes the E-COL builder for alternates (`__ecfJ`): I read the panel builder's anchor only.
2. Where a removed seat's verdict text is last carried (P4).
3. The ANSWER tag of the FORCED line behind row 52801 (P10).
4. The pkgEPS trial's record over earlier runs (P8).
