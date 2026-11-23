# ASK 530 PLAN rev 2 (W3, seat 33): the enforcer reads whether a deciding step weighs the answer it quotes, under RULE ONE VERSE

Authority: ASK 530 (operator yes; re-aimed at Wall 10633 to deciding steps that do not engage the MEETS-quoted answer). Route confirmed: an enforcer reading as a record-only TRIAL (W2 10634, W1 10636). Folded in at the coordinator's word (16:00 Z, 11-23): the enforcer's application of RULE ONE VERSE, with run 41418 as the evidence (W1's finding); the operator approved the team's findings at 09:59 CST. Rev 2 answers W2's FAIL at Wall 10663: the child workflow is in scope. Base moved: engine 9240349c and child 334f0518 (both written 16:01 Z, 11-23); lines 3058 and 3193 are unchanged, and the two Library copies are equal. This plan authorizes nothing.

## 1. OBJECTIVE
A collision line whose deciding step reads one verse or passage alone, and leaves unweighed the rows that the answer it quotes laid on the same point, is found by the enforcer and recorded. Today RULE ONE VERSE (Library line 3193) says such a line "is not right", but the E-COL item does not give the enforcer the answer's rows, so the rule cannot reach them ("Rows the item does not give you, you do not supply").
Expected effect, record-only: for each E-COL item, a TRIAL row saying ENGAGE YES or ENGAGE NO, with the verse read alone and the row left unweighed, quoted. Nothing is counted or sent back until a later count card (ruling 428).

## 2. ROLES
- Plan: W3.
- Grade (one grader): W2.
- Known-good set: W1 (condition 5 of 10636), posted before any measurement.
- Build: W4.
- Write: W4, on the operator's card in W4's thread.
- Readback: one non-builder seat, named by the coordinator.

## 3. SCOPE
SEARCH:
- Live engine moMxiV4Irg1uRBZN, first read at version 48513907 and re-read at 9240349c (n8n fetch, 11-23 after 16:01 Z). Between the two, 6 nodes changed: Send Back Build, Send Back Record, Alt Send Back Build, Alt Send Back Record, Shared Library and Assume Check Record. Lines 3058 and 3193 are byte-equal in both versions. In the Shared Library node: "ONE VERSE" (1 hit, line 3193), "THE ANSWER IN FULL" (lines 3025, 3026, 3083, 3197), and every E-COL item builder ("'COLLISION '": lines 2890, 2900, 3057, 3058, 3086, 3120).
- Line 3058 read in full: the E-COL item text gives THE LINE, THE JUDGES WHO WROTE IT, failsNote, the witness ledger for the line's own verses (__wldFor), CODE CHECK notes, the same judge's WHICH HOLDS, THE POINT THIS LINE NAMES and the same judge's FORCED line. It gives no block of the answering side.
- Line 3083: E-ANS items carry "THE ANSWER IN FULL, FROM [<round>] (every line under that pressed verse, its layers included)", cut to 900 characters (eahLine). E-COL has no such block.
- Child workflow MqQHRl7mQQ0z8QdT (ODV1 Alternate Pass), version 334f0518 (n8n fetch, 11-23): its Shared Library (3,566 lines) is byte-equal to the engine's 9240349c Library, so its line 3058 (the E-COL item) and line 3193 (RULE ONE VERSE) are the same. It also has a Library Check (ASK 422a) node. qwen 4 max's judgment 1265 ran in the child (W2 10663).
- debate_enforcer_log rows 51332, 51333 (E-COL, COLLISION D5 vs C2, seat chatgpt (terra), enforcer openai/gpt-6-luna) and 51355 (E-KEY, KEYSTONE D5), read in full.
- debate_results 41418 (ODV1-41418-isj5xh5m) defender_r4: the D5 block and "Matthew 1:24" (3 hits).
- ask530/w3/dec530.json (120 deciding lines from 20 judgments; commit 83d2fde2).
- Wall 10602, 10603, 10633, 10634, 10636.
NOT SEARCHED:
- The E-COL reply parser and the enforcer_log writer for E-COL replies, in the engine and the child: W4 names them at build.
- Workflows other than the engine and the child (for example SX4Z): W4 checks them for E-COL item copies at build.
WHAT RAN (41418):
1. Terra's line (rows 51332 and 51333): "FORCED: D5 vs C2 ... ANSWER [CR4]: \"Joseph knew Mary his wife within the espousal; the withholding runs from the taking to the birth and the begetting stands before it.\" ... GROUND: [L1] Matthew 1:25 ... | [L3] Matthew 1:18 ... -- DECIDES [L4]: \"The account places the finding before the coming together and the withholding through birth, contrary to the proposed knowing before the taking.\" -- FROM: [L1] Matthew 1:25 | [L3] Matthew 1:18".
2. The defender's [CR4] D5 block lays "[L3] Matthew 1:19 ... with Matthew 1:24 \"Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:\"". The answer's "from the taking" rests on Matthew 1:24. Terra's DECIDES and FROM never weigh Matthew 1:24.
3. The enforcer agreed: "ENFORCER AGREE (right: BROKEN) ... CARRIED BY: Matthew 1:18 \"before they came together, she was found with child of the Holy Ghost\"". The keystone row 51355 agreed because the collision lines were BROKEN ("E-KEY therefore requires the keystone to be BROKEN").
4. The item gave the enforcer no Matthew 1:24, so RULE ONE VERSE's "at least one row on the same point that the line left unweighed, quoted from the item" had nothing to quote.
IN SCOPE (nodes): Shared Library line 3058 (the E-COL item text), in the engine AND in the child, with the same change; the E-COL reply parser and writer that W4 names, in both (TRIAL rows only).
FOUND, NOT IN SCOPE: E-KEY (row 51355) follows the collision grades and needs no change of its own; the enforced E-COL AGREE/DISAGREE is unchanged (ruling 428); the judges' prompts are unchanged (ruling 383).

## 4. CHANGES
1. THE ANSWER'S ROWS (line 3058): for an E-COL item whose line has "MEETS: [<round>]" (or "ANSWER [<round>]"), add the answering side's block for the line's link in that round: from the link's head ("D5:" or "LINK 5") to the next link head, its [L1] and [L3] lines only, cut to 1,500 characters. It is headed "THE ANSWER'S ROWS, FROM [<round>] (the rows the answering side laid for <link> in the round THE LINE quotes; for the TRIAL question only)". If no block is found, the block is left out, and the TRIAL row says NO BLOCK.
2. THE TRIAL QUESTION, added to the E-COL item when the block is present:
   "TRIAL QUESTION (ASK 530, record-only; it does not change your AGREE or DISAGREE): under RULE ONE VERSE, read THE LINE's DECIDES step, or its WHY IT FAILS when it has no DECIDES, against THE ANSWER'S ROWS. Write one line. ENGAGE: YES -- \"<a row of THE ANSWER'S ROWS that the step weighs, quoted>\" when the step weighs a row the answer laid on its point. ENGAGE: NO -- <the verse or passage the step reads alone> -- \"<one row of THE ANSWER'S ROWS on the same point that the step leaves unweighed, quoted verbatim>\" when it does not."
3. CODE CHECK of the reply (condition 1 of W2 10634): the quoted row must occur verbatim in THE ANSWER'S ROWS, and for ENGAGE: NO the verse named must be in THE LINE's GROUND or FROM. A failed check is recorded as NO READ, never as YES or NO.
4. RECORD: one enforcer_log row per E-COL item and seat, rule E-ONE, kind enforcer_check, cure_reason "TRIAL (record-only, ASK 530): ENGAGE YES|NO|NO READ|NO BLOCK -- <reply>". No send-back, no count, no audit flag.
Prompt size: the block is at most 1,500 characters per item; the question text is 530 characters per item. On 41418 W4 states the total enforcer prompt before and after (condition 3 of 10634).

## 5. CRITERIA and DONE
1. Only line 3058 and the named reply parser and writer change, in the engine and the child alike. Every other node and every other Library line is byte-equal to live. After the write, the engine's and the child's Libraries are equal to each other (same hash), as they are now, and the child's Library Check (ASK 422a) passes. It checks the MAP hash too, so any new MAP key goes into both copies (W2 10672).
2. The enforced E-COL, E-KEY and E-HOLD outcomes on the 41418 replay are equal to stored (no grade, send-back or count changes).
3. Each E-COL item with a MEETS or ANSWER round carries THE ANSWER'S ROWS and the TRIAL QUESTION, in both workflows. On 41418, the D5 vs C2 items carry Matthew 1:24, and so does the synthetic item for qwen 4 max's D5 (judgment 1265, child).
4. Each reply is parsed and code-checked as in change 3; each item writes exactly one E-ONE row.
5. Ruling 428: record-only. Ruling 383: no judge text.
6. Label: ASK 530.
DONE: criteria 1 to 6 on the build; the measurement in section 7 meets its stop number; the write's fetch-back matches the target; the readback seat confirms.

## 6. WRONG-IF
1. KNOWN BAD: the TRIAL must give ENGAGE: NO on terra's D5 vs C2 line (rows 51332, 51333), naming Matthew 1:18 or Matthew 1:25 as read alone and quoting Matthew 1:24 from the block, and on qwen 4 max's D5 line in judgment 1265. The plan is wrong if either reads ENGAGE: YES.
2. KNOWN GOOD (condition 5 of W1 10636): W1 picks at least 10 lines from dec530.json, each with a one-line reason why its deciding step weighs the answer's rows, and posts them before any measurement. The plan is wrong if more than 1 of them reads ENGAGE: NO.
3. STOP NUMBER (condition 2 of W2 10634), set now: if WRONG-IF 1 or 2 above fails, the team stops. W3 makes one revision of the question text; if the next measurement also fails, ASK 530 closes as NOT SEPARABLE and is reported to the operator. There is no further tuning.
4. A NO READ rate above 20% of items on 41418 means the code check or the block finder is wrong; this is fixed before any count card.
5. The plan is wrong if THE ANSWER'S ROWS changes any enforced grade (criterion 2).

## 7. RUN EVIDENCE
- 41418 rows 51332, 51333 and 51355, as quoted in section 3. The enforcer applied RULE ONE VERSE without the answer's rows.
- Measurement: an enforcer replay on 41418's stored judgments (the D5 lines, W1's known-good lines and every other E-COL item) is a paid call. It needs the operator's release on a card (W1 10636). No replay runs before that.
- Marks in the next live run: E-ONE rows in debate_enforcer_log with TRIAL cure_reason; the item text carries THE ANSWER'S ROWS.

## 8. INPUTS IN GIT
- ask530/w3/live/lib_3058.txt (cb6cc6a2), lib_3083.txt (f47fed05), lib_3193.txt (f9e90f87): the Library lines as read from 48513907, byte-equal in engine 9240349c and child 334f0518.
- ask530/w3/dec530.json (60cdab23), m530.py, m530.out.json: commit 83d2fde2.
- debate_enforcer_log 51332, 51333, 51355 and debate_results 41418: SQL.

## 9. STEPS
1. W2 graded rev 2 PASS (Wall 10672). W1 posts the known-good set (section 6.2).
2. W4 builds against a fresh live readback of the engine and the child: touched lines only, the same change in both, a synthetic E-COL item for 41418 D5 vs C2 printed in full, a stubbed reply run through the code check (one YES, one NO with a verbatim row, one NO with a row not in the block, which must give NO READ), and criterion 2 by an offline replay of the enforced paths with the stored replies.
3. W2 grades the build.
4. The coordinator sends the operator one card: the write, and separately the paid replay release.
5. W4 writes; a non-builder seat reads it back; the replay measures section 6.1 to 6.4.
6. A count card comes only after the measurement passes.
