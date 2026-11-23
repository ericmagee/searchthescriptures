# Fair judging ground: DRAFT build plans (W3, draft 2)

Draft 2 folds the builder's anchor check (W4, Wall 10963, findings 1 to 7). Draft 2a adds W1's two notes from the PASS grade (Wall 10966): the " (RECORD-ONLY)" match in P3 and the expected side per row in the P5/P6 test. Nothing else is changed from the graded draft 2 (md5 3212b8e4).
Changes in draft 2: P1 (mark quotation, filter place, alternate reply text), P2 (the CHANGE TO is read from a.to), P3 (how RECORD-ONLY is reached), P4 (where the readback starts), P8 (alternate copy), P10 (filter place), and a note on escape levels.

DRAFT ONLY. Nothing here is written, and nothing may be written until the operator rules and each plan passes grading. Asked by the coordinator 16:20 CST 11-23. Source of the proposals: fairjudge/w3/PROPOSALS_rev1.md rev 2 (md5 6908ea29).

Read for the targets: the builder's fetch-back of the live engine, askbfx/w4/write/fetchback_engine_bfx.json (engine 5bc57e2a, 397 nodes; Shared Library 1,144,751 characters). Positions below are character offsets in that file's Shared Library code and are given only to find the place. The builder takes a fresh live readback before any write and matches on the quoted anchor text, not on the offset. The Shared Library stores its code as quoted source lines, so an anchor here stands one escape level down from the node's stored text (W4 10963).

Common to every plan:
(a) Writer: W4 alone, on a press of W4's own card. Touched nodes only. No model setting changes. No prompt text changes unless the plan says so.
(b) Revert: restore the touched nodes from the pre-write export taken at the readback, then fetch back and compare the md5 of each touched node with the pre-write md5.
(c) Proof: an offline harness run of the changed function on the stored rows of run 41822 (run41822/enforcer_log.json, results.json), with one control that must not change. A live run proves it afterward.
(d) Grading: one non-builder seat per plan.

## P1. A judge's cure statement is not a collision line
Target: Shared Library, the E-COL collision-group builder. Anchor: `for(const j of __ecfJ)for(const l0 of j.t.split('\n')){const l=l0.replace(/^[\s*\-•]+/,'');` followed by `if(!__ecfColl(l))continue;` (near 756016). E-ONE rows are built from the E-COL rows (anchor `__e1.push({...base,rule:'E-ONE'`), so one filter serves both.
Step 0 (trace), answered from the record: argon's stored verdict text (run41822/judgments.json) holds the K-CMTL audit mark ending "...; STATEMENT: (Commitment 3, Commitment 7, Commitment 8, Commitment 13)" and then, on the next line, "FORCED: D4 vs C6 applies (Commitment 3, Commitment 7, Commitment 8, Commitment 13).; JUDGE STATEMENT: FORCED: D4 vs C6 applies (...).]". The judge's statement held a line break. The mark is built by `(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')` (near 377595). cureSafe replaces "[", "]" and the ";" before a field name and nothing else; cureCut only cuts at 600 characters (W4 10963 item 1). A line break in a statement passes into the mark, so the tail of the mark became a line of its own that begins with FORCED. Both statements pass through cureSafe, so one change there covers both. chatgpt's text is not in judgments.json (the seat was removed); its flagged line has the same shape. W4 confirms on the live code.
Change: (1) cureSafe replaces line breaks with a space, so a mark stays on one line. (2) In the builder loop, skip a line that is part of an audit mark: add, before `if(!__ecfColl(l))continue;`, `if(/^\[AUDIT\b/.test(l)||/;\s*JUDGE STATEMENT:\s/.test(l))continue;`. Both in one write; (2) guards against any other mark that breaks a line. The same skip goes into the keystone loop (P10), which reads the same lines through linesOf. It is placed in the two loops and not in linesOf, because linesOf has six other readers this plan does not touch.
Not changed, and stated as open: `__ecfJ` also holds, for each seat in Alternate Cure Normalize, that seat's raw cure reply text (W4 10963 item 2). A raw reply line "FORCED: D3 vs C5 applies (Commitment 7)." carries no mark tail and would not be skipped on an alternate. No row of run 41822 came that way (52441, 52792, 52793 all carry the mark tail). Whether reply text belongs in `__ecfJ` is a design question for the team; this plan does not change it.
Revert: (b).
Test: feed the builder chatgpt's and argon's stored verdict text of run 41822. Expect no group for "FORCED: D3 vs C5 applies (Commitment 7)." (rows 52441, 52511, 52535) and none for argon's two statements (rows 52792, 52793, 52819, 52820). Control: the real lines behind rows 52439 and 52440 still form their groups.

## P2. The E-COL cure test reads the reply
Target: Shared Library, the E-COL cure branch. Anchor: `const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(` and, two statements on, `if(!fs)return res(false,'the line names no answering side');` (near 644260).
Change: when the answer is a CHANGE and its CHANGE TO text grades the pair BROKEN or FORCED, build L from the answer's own text, `a.to`, with the same unescape the branch applies to it.line; otherwise from it.line as now. `__to` cannot be used: it is declared inside the layer-fault block, which closes before `const L=`, and it does not exist when there is no layer fault (W4 10963 item 3; my misread in draft 1). The pair match `pm` keeps its fallback to it.item.
Effect, stated: L feeds everything after the side test (FORC and the quotation checks), so those checks then read the CHANGE TO as well. That is intended: the reply is what is being tested.
Revert: (b).
Test: item of row 52535 with chatgpt's stored CHANGE TO, which carries "ANSWER [CR4]". Expect the side test to find side C and the branch to go on to its quotation checks, not "the line names no answering side". Controls: a CHANGE TO with neither an ANSWER tag nor LINK BROKEN is still refused with that reason; the items of rows 52837 and 52838 (argon, CURED) still cure.

## P3. A gate change the engine refuses does not remove the seat
Targets: Shared Library, (1) the E-APPLY item pushes that refuse a change under pkgPS (anchors `(pkgPS, W3 2446)'` and `pkgPS, W3 2446: a premise change stays inside the premises its items name)'`, near 337194 and 337442) and under pkgSGA (anchors `(pkgSGA2, W1 2695)'` and `write the whole line with its label (pkgSGA)'`, near 334737 and 335153); (2) the E-GATE cure loop, anchor `const __rct=!cured&&a.ans==='CHANGE'&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct);` (near 441581).
Change: (1) add `rfs:'pkgPS'` or `rfs:'pkgSGA'` to those pushed items; no other field changes. (2) In the cure loop, when the answer is CHANGE and the matching item carries `rfs`, the result row keeps cured false, takes the reason "<package> refused the gate change; the judge's line before the change stands (recorded, no seat removed): <the refusal's own reason>", and is returned with `live:false` (anchor `return {gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:` near 446125). The existing code then does the rest: for a row that is not cured and not live it writes "; RECORD-ONLY, not counted" in the audit mark (near 476320) and ends cure_reason with " (RECORD-ONLY)" (near 477265). The database sets the stored status from that exact ending (enforcer_status_stored, ASK 546; W4 10963 item 4), so no new wording is written for it. The drv_uncured tally reads the same `live` field. To confirm at readback: the statement that sums drv_uncured from the gate result rows; I read the two markers, not the sum. The text " (RECORD-ONLY)" stands four times in the Shared Library, so any match is made on its surrounding text (the `r.live&&r.oa` expression), never on the marker alone (W1 10966). (3) W1's condition: the send-back items the refused change was written to answer are stored the same way, with the same refusal reason, so the record shows they were not cured.
Not changed: silence ("no GATE line for this item (silence counts)") and every other refusal.
Revert: (b).
Test: sol62's gate answers of run 41822. Expect rows 52585 and 52586 stored RECORD-ONLY with the pkgPS reason, drv_uncured for sol62 not raised by them, and the count line left at the value before the change (1). Controls: a silent gate item still stores UNCURED and counts; a pkgRCT refusal still stores as it does now.

## P4. The run row and the run report carry every written verdict
Targets: Build Save Body (the `RN` value saved as review_notes; anchor `saveBody:{engine:S.challenger.engine,review_notes:RN,`) and Format Markdown (the report). Source of the data: the removed seats already held in alternates_seated and alternates_tried (field removed_seat) and each removed body's verdict text.
To confirm at readback (not yet read): the node at which a removed seat's verdict text is last carried. The readback starts at Alternate Merge and Pass Accumulate (W4 10963 item 5).
Change: append to RN one line per removed seat: `REMOVED SEAT: <seat>; VERDICT WORD: <the word of its RESULT line>; REMOVED BY: <rule and item of the row that stayed UNCURED>`. Format Markdown prints the same lines under the panel. No other column of the saved row changes; nothing counted changes.
Revert: (b).
Test: run 41822 data. Expect three lines: sol62, chatgpt and gemini, each BROKEN (W1, Wall 10936 A), and every other field of saveBody identical to the stored row.

## P5 step 1 and P6 step 1. Two audit views (record-only, no engine write)
Target: the database, two new views over debate_enforcer_log. No engine node is touched.
Change 1, enforcer_rulings_by_collision: for each run_token and item of rules E-COL and E-HOLD, one row per seat with the RIGHT word read from cure_reason by the pattern `ENFORCER (AGREE|DISAGREE) \(right: ([A-Z ]+)\)`, and a column split = true when the item has more than one RIGHT word in the run.
Change 2, enforcer_pushes_by_side: E-HOLD rows whose cure_reason holds "right: BROKEN" and "judge wrote UNDERDETERMINED", with a column against = DEFENDER when the reason holds "ANSWER [CR" or names the defender's answer, CHALLENGER when it holds "ANSWER [DR" or names the challenger's answer, else UNSTATED; and a count by side for the run.
The run report (W4) reads both views and prints them. The engine is not changed.
Revert: DROP VIEW for each.
Test: run token ODV1-41822-nnfywk74. View 1 must mark D3 vs C4 and D2 vs C2 as split (AAR DEFECT 3). View 2 must return the seven rows and no row against the challenger. Expected side by row under the stated patterns: 52448 DEFENDER ("ANSWER [CR4]"); 52452 UNSTATED (its reason names "D3's proposed ... means" and gives no ANSWER tag); 52453 DEFENDER ("ANSWER [CR4]"); 52455 DEFENDER ("the defender's answer"); 52458 DEFENDER ("ANSWER [CR4]"); 52678 DEFENDER ("The defender's answer", "ANSWER [CR3]"); 52800 DEFENDER ("the defender's answer", "ANSWER [CR3]"). Six DEFENDER, one UNSTATED, none CHALLENGER. The stored reasons use a curly apostrophe, so the pattern is `defender.s answer`, case-insensitive. Control: run 41736 returns rows without error.

## P8. "Lacks a layer" means the tag is absent
Finding at the read: this check is already in the engine as a trial. Shared Library holds `const EPS_STATUS='TRIAL';` (near 878898), and rows 52470 and 52479 of run 41822 already end "(TRIAL pkgEPS: would not be sent: the push counts the premise but names no layer the block lacks; the block exhibits [L1], [L2], [L3])". The trial caught both rows the proposal rests on.
Target: Shared Library, that one constant.
Change: `EPS_STATUS='TRIAL'` to `EPS_STATUS='LIVE'`. With LIVE the existing code stores "ENFORCER HELD (pkgEPS, not sent; ...)" and the push is not sent back.
To confirm at readback: the Shared Library builds the alternate copy from the panel copy by line-number patch lists; the alternate path must get the same constant (W4 10963 item 6).
Revert: the constant back to 'TRIAL'.
Test: E-PREM items of sol in run 41822. Expect rows 52470 and 52479 stored ENFORCER HELD and not sent back, and sol's count not raised from 1 to 2 by them. Control: an E-PREM push that names a layer the block does not exhibit is still sent.
For the grader: the trial's record over earlier runs should be read before this is released (how many pushes it would have held, and whether any was a true missing layer).

## P10. The keystone check is done by the engine
Targets: Shared Library, the E-KEY item builder. Anchors: `const link=m[1];const own=ls.filter(x=>x!==l&&new RegExp('^(?:FORCED\\s*:\\s*)?'+link+'\\b').test(x)).slice(0,6);KG.push({seat:j.seat,line:l,link,grade:m[2].trim(),own});` (near 770776) and `for(const g of KG){if(__ekK(g)){__EKR.push(g);continue;} /* pkgEKR */` (near 772062).
Change: (1) derive the word in code: BROKEN when one of the judge's own lines on that link grades DEFENDER LINK BROKEN, or is a FORCED line whose ANSWER is a defender round ([CRn]); STANDS otherwise. A CHALLENGER LINK BROKEN line never counts (W1's condition). (2) When the judge's keystone word equals the derived word, store a code row in the pkgEKR form ("NOT ASKED (code): the keystone word follows from the judge's own lines") and ask the enforcer nothing. (3) Only on a mismatch build the E-KEY item, and hand the enforcer only the lines that counted in (1).
Not changed: the RULE E-KEY text, pkgEKR, pkgEKD.
Revert: (b).
Test: argon's verdict text of run 41822. Expect derived STANDS, equal to the judge's word, so no E-KEY item and no row like 52801. Controls: a judge with a DEFENDER LINK BROKEN line on the keystone link and the word STANDS still gets an E-KEY item; the pkgEKR path still fires on a confirmed closing contradiction.
Found at the read: one of the "FORCED: D4" lines the enforcer was handed in row 52801 is the stray statement line of P1 ("FORCED: D4 vs C6 applies (Commitment 3, ...).; JUDGE STATEMENT: ...]"). It carries no ANSWER tag, so under change (1) it does not count. P1 and P10 meet at this line: the KG loop reads the same lines (linesOf), so the audit-mark skip of P1 is written into the KG loop too (W4 10963 item 7). P10 is not released without P1.

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
1. The statement that sums drv_uncured from the gate result rows (P3).
2. Where a removed seat's verdict text is last carried (P4).
3. The pkgEPS trial's record over earlier runs (P8).
