# ASK 559 and ASK 560: absence moves and the opening round (W1, PLAN draft 1b)

Draft 1b folds W3's two notes on the PASS (Wall 10994): the Change 1 control, and the "against" remainder. Draft 1a folded W4's anchor answers (Wall 10989, 10990). No exact code text has changed since draft 1.

DRAFT ONLY. Nothing is written. Each change needs grading (W3), the builder's anchor check (W4), and the operator's approval of exact text. Nothing goes to the operator until the open ASK 557/558 card is answered (coordinator, 17:03 CST 11-23).

Basis: W4 Wall 10987 (BAR and LAY coverage); ruling 421 ("answer a press with the fit your rows show, never with an absence; the absence form is barred to both sides"); rulings 397 to 400 (PROVEN STRUCTURE); ruling 503 (the Oracle's opening must be solid).
Read: fetch-back of engine 5bc57e2a (askbfx/w4/write/fetchback_engine_bfx.json): LAY as rebuilt from the Shared Library LIB and MAP entry "LAY" (11,691 characters); IMP and BAR in D2B Build; C1B Build; the connections of D1 and C1. Rounds of run 41822.
Offline checks were run in node with the live code text (scratch harness; the code was cut from the fetch-back, not retyped).

Scope rule: each ASK changes only what addresses its own issue. Neither ASK changes a prompt, a model setting, corpus text or a ruling.

## ASK 559. Absence moves that pass both BAR and LAY

### What the record shows
1. LAY.structure excuses a block when absent(x) is true: every sentence is an absence sentence (ABS) carrying a reference, and no conclusion word (CONC). It excuses such blocks under any head.
2. BAR (IMP.harvest) takes sentences only in answer blocks ("ANSWER:", "answers to", "pressed rows", "answers on/for the press") and, in "against" blocks, only sentences that begin with "no" (W4 10987 item 1).
3. So a LINK, PREMISE or "against" block made only of absence sentences under a bare label head passes both. Offline, live LAY: "LINK 2:" followed by two absence sentences with references: 0 items. Same for "PREMISE 3". (If the head itself states the link, absent() is false and LAY already flags it.)
4. Phrasings in LAY's ABS but not in BAR's AB: "does not give / call / write / speak / show / carry / narrate", "nowhere states / says / names / records / mentions / calls / gives / shows / carries / narrates", "is (not|never) recorded / written / given / said / shown". Offline, live BAR on an ANSWER block: "Luke 1:35 does not show a begetting", "Matthew 1:18 nowhere says ...", "... is not recorded as ..." give 0 hits; "does not name" gives 1.

### Change 1 (LAY, the excuse follows BAR's reach)
Target: LAY.structure in the Shared Library LIB, engine and child (the child's Library Check compares lib and map sha, W4 10987). Reset the "library sha" header in both in the same write.
Anchor: `if(absent(x))return;` (one occurrence in LAY).
Exact change: `if(absent(x)&&/\banswers?\s+to\b|^[\s#>*_-]*ANSWER\s*:|\bpressed\s+rows\b|\banswers?\s+(?:on|for)\s+the\s+press/i.test(b.head))return;`
The pattern is IMP's own ANS test. An absence-only block is still excused where BAR harvests every sentence (answer blocks); elsewhere it gets today's STRUCTURE item ("no verse quoted ..."), the item a link or premise without footing already gets. "Against" heads are left out on purpose, since BAR takes only "no ..." sentences there.
Remainder, stated (W3 N2): an "against" block whose head LAY's block reader does not take as a block head (for example "D3 against C5:" or "**Against C5**"; offline 0 items before and after) still passes LAY, and BAR takes only its "no ..." sentences. Closing that needs a change to LAY's block reader (CP) or to BAR's against rule; it is not in this change.
With ASK 557 Change D (draft 5b) the same line reads `if(absent(x)&&!need.length)return;`. If both are released, the line is `if(absent(x)&&!need.length&&<the pattern>.test(b.head))return;`, written once, with one sha reset. If 559 goes alone, the line above.
Both sides alike: ruling 421 bars the absence form to both sides, and LAY runs on both (D2B to D4B, C2B to C4B Build).

### Change 2 (BAR, the phrasings LAY knows)
Target: `const AB=` in IMP, inline in 14 nodes with one identical text (md5 of the AB line 46b1ee27): C1B, D2B, C2B, D3B, C3B, D4B, C4B Build and the same seven Extract nodes. All 14 change alike. The Shared Library's IMP copy (a different, older AB) is not changed. W4 10989: it is read by the six judge-side entries Send Back Build/Record, Alt Send Back Build/Record and R2 Alt Send Back Build/Record. That is the judges' harvest, not the debaters' send-back, so it is outside this issue; changing it would also move the LIB sha. If the team wants the judges' list aligned, that is a separate ASK.
Exact change, two edits in the AB literal:
(a) the verb list after "does not / did not / never": `(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject|tell|record)\b` becomes `(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject|tell|record|give|call|write|speak|show|carry|narrate)\b|\bnowhere\s+(?:states?|says?|names?|records?|mentions?|calls?|gives?|shows?|carr(?:y|ies)|narrates?)\b`
(b) the passive: `(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|ruled\s+out|named|stated)\b` becomes `(?:itself\s+|themselves\s+)?(?:not|never)\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|ruled\s+out|named|stated|recorded|written|given|said|shown)\b`
GIVE (concessions) and the NOT A REQUIREMENT rebuttal are unchanged.

### Revert
Restore the 14 IMP nodes and both Shared Libraries from the pre-write export; compare md5 per node; Library Check passes.

### Test (offline first, on the live code text)
1. Change 1: "LINK 2:" and "PREMISE 3" absence-only blocks give 1 STRUCTURE item each (today 0). Control (W3 N1): a block whose head is "Answer on the press: Matthew 1:20 does not name the Spirit as father (Matthew 1:20)." followed by absence sentences is excused both before and after (0 and 0), and BAR harvests it. Already run on the cut code: 0 to 1, 0 to 1, control 0 to 0. Note: a head "ANSWER: ..." or "Answers to the presses:" is not a LAY block head (CP), so LAY gives 0 there both ways; those blocks are BAR's alone.
2. Change 2: the ANSWER block above gives 4 hits (today 1). Result already run: 1 to 4.
3. Controls on run 41822, all eight rounds: LAY items and BAR hits identical before and after (already run: LAY CR2 to CR4 and DR2 to DR4 0 items both ways; BAR 0 hits both ways on the stored rounds).
4. Library Check passes in engine and child.
Risk stated: "does not give" and "does not show" also fit a sentence that criticizes the opponent ("the challenger does not give a verse"). BAR already carries the same risk with "does not name"; such a sentence is in an answer block and is sent back once with the barred-move note. The live run shows whether it fires falsely.

## ASK 560. CR1 is checked by neither LAY nor BAR

### What the record shows
1. D1 has no B re-call. D1 Extract goes to C1 Verse Sheet and Failure Salvage. C1 has C1B (BAR only).
2. IMP's ROUNDS is ['CR2','DR1','DR2','CR3','DR3','CR4','DR4']; CR1 is not in it, so BAR.check('CR1', ...) harvests nothing.
3. 33 nodes read `$('D1 Extract')`.
4. Offline, live LAY on CR1 of run 41822 (run with no Verse Sheet rows; W4 10990: a verse not on the sheet gets credit with no quote test, so with D1 Verse Sheet rows the count can only rise): 4 STRUCTURE items, the four summary lines D1 to D4 ("D1: The promised seed proceeds ...", "D2: The father is named in four registers ...", "D3: The canon's means is knowing ...", "D4: Yes, Christ had a biological father ..."). BAR with CR1 added: 0 hits.

### Step 1 (record-only)
Target: one new Code node "D1 Check" between D1 Extract and C1 Verse Sheet (pass-through of D1 Extract's item). It loads LAY with D2B Build's pkgLAYB loader line as it stands (W4 10989 item 2; no wiring to the Shared Library). D1 Verse Sheet runs before D1 Extract (W4 10990), so LAY's quote test reads its rows and holds an IMP/BAR copy identical to D2B Build's (with ASK 559 Change 2 if released), with 'CR1' added to ROUNDS in this copy only. Output: the D1 Extract item plus `lay_check` and `bar_check`. Build Save Body appends one line to review_notes: `[AUDIT: CR1 CHECK (record-only) -- LAY ITEMS: <n>; BARRED SENTENCES: <m>; HEADS: <heads, 200 chars each>]`. No send-back; nothing counted.
Touched: new D1 Check, connections D1 Extract to D1 Check to C1 Verse Sheet, Build Save Body (one appended line).
Test: run 41822 CR1 gives LAY ITEMS 4 and BARRED SENTENCES 0; every other saved field unchanged.

### Step 2 (send-back, for team decision after Step 1 shows on a run)
A D1B chain on the C1B model: D1B Build, D1B Route, D1B Call anthropic, D1B Call openrouter, D1B Extract, sending CR1 back once when LAY or BAR finds items (with ASK 557 Change D's Oracle flag if released).
Readers: to leave the 33 readers of `$('D1 Extract')` untouched, the present D1 Extract is renamed (for example "D1A Extract", code unchanged) and the final node of the new chain is named "D1 Extract". Only D1B Build reads the renamed node. W4 10989 item 3: $('D1 Extract') stands 74 times in 33 nodes; D1 Extract has main 0 to C1 Verse Sheet and an error output to Failure Salvage, whose literal map __L keys "D1 Extract". An API PUT rewrites nothing (W4, from training, not checked on this instance), so a rename must change the node name, every connections key and target, the 74 references and the __L key in one write.
LARGE. Not proposed for release now. Step 1 tells the team whether CR1 fails often enough to warrant it; in run 41822 it would have fired on the four summary lines, and the team should decide first whether an opening's summary lines are critical points under rulings 397 to 400.

### Revert
Step 1: delete D1 Check, restore the D1 Extract to C1 Verse Sheet connection and Build Save Body from the pre-write export.

## Found at this read, outside both scopes (for the coordinator's failure list, not planned here)
DR1 is not checked by LAY either: C1B Build runs BAR only. Offline, live LAY on DR1 of run 41822: 4 STRUCTURE items (the challenger's D1 to D4 summary lines).
