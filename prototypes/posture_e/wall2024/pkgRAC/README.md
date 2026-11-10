# pkgRAC rev 2 (W3): pairs found by the two code-side closing checks go to the closing enforcer

**SHELVED 2026-11-10 by the operator's answer "1" to ASK 19. Do not write any pkgRAC file. Reason: pkgRAC/check34108/reading_check_w3.md (a handed pair costs the closing enforcer its own search).**

WRITE FILE: pkgRAC/parent_s108_RAC.json, rebuilt on live s108 (s107 + pkgRLF). Five nodes are byte-equal to the graded build; Close Enforcer Record now carries pkgRLF's round-label reading and pkgRAC's changes together (11,835 to 12,406, +571, the same change). 77 checks ALL OK on s108. The s106 and s107 files must not be written. BUILDER'S RECOMMENDATION: no write until the four-call check on debate 34108 is read (pkgRAC/check34108/).

Authority: the operator's "option 1" (08:27 CST 2026-11-10) to W3's ask of 20:30 CST 2026-11-09. Built on live s106. NOT WRITTEN. A write needs two non-builder grades, a DeepSeek replay of the new prompt, and the operator's "write pkgRAC" in W4's thread.

## What it does
Every pair found by the close-round reversal check and by the anti-cheat check is handed to the per-side closing enforcer as a candidate, before any judge.
- Confirmed by the enforcer (and by the code check in Close Enforcer Record): the link breaks; the judges see the pair in the existing CONFIRMED CLOSING CONTRADICTIONS block; it leaves the check block.
- Answered NOT A CONTRADICTION: the check block stays and ends with the approved sentence: "The closing enforcer examined this pair and did not confirm a contradiction. The close sentence is not footing for any link; grade this side's earlier answer on its own words, against the verse."
- Not examined (no answer, or the pair could not be sent): the block stays and ends with the second sentence only.
- The "is DISREGARDED" wording leaves both blocks.

## Build
`node pkgRAC/build_RAC.cjs /mnt/project-files/wall2024/fetchback_live_s106.json pkgRAC/parent_s106_RAC.json`

## Size (measured, rev 2)
| Part | Before | After | Change |
|---|---|---|---|
| Close Enforcer Build | 7,940 | 9,514 | +1,574 |
| Close Enforcer Record | 11,649 | 12,220 | +571 |
| Anticheat Build | 8,322 | 8,479 | +157 |
| Anticheat Record | 4,157 | 4,373 | +216 |
| Panel Build | 174,249 | 174,778 | +529 |
| Build Independent Verdict | 143,664 | 143,623 | -41 |
| Code total | | | +3,006 (rev 1 was +2,452) |
- Connections changed: 4. Nodes: 418 (none added). Model calls: none added.
- Closing enforcer prompt over the 35 stored debates: +10,156 characters on 5,044,040 (+0.201%), mean +290 per debate (rev 1: +12,112); 17 of 35 prompts equal live (no pair).
- Judges' prompt: no growth unless the enforcer answers no on a pair (+78 characters per block, less 4 to 7 saved by the shorter sentence).

## Rev 2 (both graders failed rev 1)
1. W4, Wall 4117: an A or R id was trusted without its side or quotations, so a line carrying another pair's id could remove that pair's block unexamined. Now an A or R id counts only when the line's side is the candidate's side and the two closing quotations overlap; any other line is read as NEW (it still breaks its own link if its quotations stand) and the candidate is logged NO ANSWER and keeps its block. Plants P24 to P31.
2. W1, Wall 4118 (G3): a second pair confirmed on a link already broken left every judge's prompt. Now a block is removed only when the pair is in the list the CONFIRMED CLOSING CONTRADICTIONS block prints; a repeat keeps its block with the second sentence only. Plant P32.
3. W4's minor note: a pair answered both ways now ends "examined ... did not confirm". Plant P28.
4. W1 note 1: the reason on a handed pair no longer states a conclusion. An anti-cheat pair carries its verse only; a reversal pair carries nothing.
5. W1 note 3: Anticheat Build and Anticheat Record are wrapped so that a failure skips the check with a stated reason (shown in the AUDIT ANTI-CHEAT line) and never stops the debate. Same output as live on 38 of 38 stored debates. Plants P33 to P36.
6. W1, Wall 4122: the reversal code is cut from Panel Build's source between two code marks ('const REFP=' and the end of the C4X block), not at a comment, so the approved comment strip (R2) does not break it. Plant P37 (Panel Build with its comment lines removed: same candidates).

## Parts
1. Connections, so the anti-cheat call runs before the closing enforcer: Quote Report to Anticheat Build; Anticheat Only? (false) to Close Enforcer Build; Regrade After Quotes? (true) to Panel Build; Check Save to Panel Build.
2. Close Enforcer Build: candidates A<n> (anti-cheat pair, n = the digits of its id) and R<side><n> (reversal pair; side 1 defender, 2 challenger). The reversal pairs come from Panel Build's own reversal code, read from that node's source (no third copy). A quotation with an ellipsis is passed as its longest part that stands in one round.
3. Close Enforcer Record: accepts ids A<n> and R<n>; a pair that could not be sent is logged as item NOT SENT, NOT CHECKED.
4. Panel Build and Build Independent Verdict: the block endings above (same C4X text in both; the build refuses if they differ).

## Stated effects
1. The single judge's prompt is unchanged except the reversal block's last sentence (2 of 34 stored debates). It never saw the anti-cheat block and still does not (the block is switched off in Build Independent Verdict).
2. The anti-cheat DeepSeek call now runs before the single judge and before the save. Build Save Body therefore writes its AUDIT ANTI-CHEAT lines into the saved row on a live run (today only on a regrade).
3. The anti-cheat-only dry regrade now stops before the closing enforcer.
4. A confirmed A or R pair breaks a link by default, as every confirmed closing contradiction does.

## Limits
1. The enforcer's reading of the new candidates is unproven. In set C (W3 reading, /mnt/project-files/w3/setBC_reading_w3.md) the closing enforcer, not handed the anti-cheat pairs, found them in 0 of 5 debates and returned 1 false and 2 doubtful CONFIRMED lines of 23. Handing the pair as a candidate forces an answer on it; whether the answer is right needs the replay below.
2. The candidate line says "LINK (you name it)". If the enforcer echoes that, the line is recorded NO ANSWER and the pair reads "not examined".
3. Ellipsis quotations: the part kept can be the neutral one (W2's note on pkgCFP).
4. Close Enforcer Build reads Panel Build's code text; it is the first node to read another node's code (W1). If Panel Build is ever moved into the Shared Library (R1b), the reversal read fails and is logged NOT CHECKED (loud, not silent), and pkgRAC must be rebuilt to read the library. W1's pkgR1 does not move Panel Build.
5. The "[round N]" label form (W4, Wall 4107) is not handled here; W2's fix covers it in the same node (Close Enforcer Record). Whichever is written second is rebuilt on the other.

## Difference from pkgCFP rev 2 (W1, shelf)
pkgCFP sends the anti-cheat pairs to the post-panel judge contradiction enforcer, after the judges have graded, and leaves the reversal pairs out. pkgRAC sends both kinds to the closing enforcer before any judge, so a confirmed pair breaks the link before grading, and it changes the block wording the operator approved. If pkgRAC is written, pkgCFP is not needed.

## Tests (pkgRAC/test_RAC.cjs, output test_RAC.txt): ALL OK, 77 checks
- T1 the four connections. T2 Build on the 35 stored debates: 34 anti-cheat pairs in 16 debates and 2 reversal pairs in 2 debates all sent, 0 not sent.
- T3 Record plants P1 to P9 (confirmed A and R ids, not a contradiction, wrong link, quotation not standing, NOT SENT row).
- T4 Panel Build on 34 stored debates: 16 equal live, 18 differ only in the last sentence of a block (and the character count field). Build Independent Verdict: 32 equal, 2 differ in the reversal ending only; never shows the anti-cheat block. P10 to P17 the three endings and the removal of a confirmed pair.
- T5 failure paths P18 to P23 (Panel Build source without the reversal code, anti-cheat check skipped or not executed, a quotation crossing rounds).
- T6 to T8: the rev 2 plants P24 to P36 above.
- Rolled-back insert of 3 rows (rows_RAC.json) through record_enforcer_log: accepted ("rows": 3, "recorded": true).

## Owed before a write
A DeepSeek replay of the new closing enforcer prompt (pkgRAC/replay, 7 bodies, two sends each, 14 calls): both stored reversal pairs (34108 and 33575, each R11) and the five set C debates with their anti-cheat pairs. Labels in pkgRAC/replay/README.md. Both graders read the two reversal pairs as NOT contradictions, as I do; a CONFIRMED on either fails the replay.

## Open risk, stated
A confirmed handed pair breaks a link. The anti-cheat pairs are DeepSeek's own earlier rulings and only two of the 34 stored ones have a hand reading. The replay reads every pair it sends by hand; the other 29 are not read.

## Engine manual part (enters on write)
Close-round checks to the closing enforcer (pkgRAC): the anti-cheat call runs after Quote Report and before the closing enforcer. Close Enforcer Build adds the anti-cheat pairs (ids A<n>) and the close-round reversal pairs (ids R<side><n>) as candidates. A confirmed pair breaks its link and is shown only in CONFIRMED CLOSING CONTRADICTIONS. A pair answered NOT A CONTRADICTION keeps its block with the two-sentence ending; a pair not examined keeps it with the second sentence. A pair that could not be sent is logged under E-CLOSECON as NOT SENT, NOT CHECKED.
