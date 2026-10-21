# BB-6904 revision 8, step 3 (7206): the verdict table on the five stored debates. Stored text only, no model call.

Built by verdict_table.cjs over five.json (md5 73ae11e1) with the patched reference reader (mod_new.js); full run in TABLE_RUN.txt.
Each judge's DEFENDER LINK BROKEN lines are tested for a ground under the rule that judge was given; a line with no ground is removed and
the link graded by the ladder (BROKEN-1 k>=1; BROKEN-2 2w>n or keystone withdrawn; PARTIAL-1 w>=1; PARTIAL-2 defense COLLAPSED; HELD-1).
RESULT per the rulebook (BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS unless the challenge is SELF-SUPPORTED with no challenger
link broken). Panel per aggregate_debate_panel and d5_outcome_for (majority of counted seats; fewer than 2 or a tie is UNGRADED -- REVIEW).

## 1. The rule each judge was given (measured)

Panel Build and Build Independent Verdict, read from the flow versions:

| sentence | 8059223d, ec464cdc, af3c8f7c | db281705 and after |
|---|---|---|
| (a) "is ANSWERED only when this link round quotes it or names it by reference and shows from the text why it does not overturn the link" | present | present |
| "A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings" | present | present |
| (b) "counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it ... and names that round" | ABSENT | present |
| "otherwise it is no ground for BROKEN, and the link is graded under the remaining rules" | ABSENT | present |

ec464cdc and af3c8f7c carry byte-identical code in both nodes. The executions do not record a version id. The runs started at
15:52Z (27177), 16:44Z (27191), 17:57Z (27208), 20:21Z (27259), 07:35Z on 21 Oct (27433); db281705 was published 19:39:00Z 20 Oct (BB-6880).
So 27177, 27191 and 27208 ran without (b) and without the "no ground" sentence under any of the three earlier versions. 27259 and 27433 had both.

FACT FOR THE ADVISOR (7206 item 2b): the sentence "otherwise it is no ground for BROKEN, and the link is graded under the remaining rules"
closes the [L4]-INFERENCE rule ("A judge who grades a link BROKEN because the witnesses exclude, deny or establish something must quote
the words that state it ..."), not the UNANSWERED WITNESS rule. Rule (b) itself says what fails: such a verse "does not count" as an
unanswered witness. Removing a line that fails (b) and grading the link by the ladder follows from (b) and the ladder; it is not that sentence.

## 2. Reasons a BROKEN line is removed (mechanical)

- (b): the line, with its continuation, neither names [DR1]/[DR2] nor quotes words found in those rounds. Applied only where (b) stood.
- (c): every verse in the line's first parentheses is absent from DR1 and DR2 and present in DR3 (first raised after the answering round).
- class 1: the defender's link round [CR3] names the verse. Under (a) this is an answer only if [CR3] also "shows from the text why it
  does not overturn the link". That half needs reading: UNCOMPUTABLE by this check. Shown as its own column, never applied silently.

## 3. The table

| debate | rule (b) | judge | stored | lines BROKEN | removed, and why | re-graded (b, c) | if class 1 is an answer |
|---|---|---|---|---|---|---|---|
| 27177 | no | single | BROKEN-1 k=4, CHALLENGER WINS | 4 | none | BROKEN-1 k=4 | same |
| 27177 | no | deepseek | BROKEN-1 k=3 | 3 | none | BROKEN-1 | same |
| 27177 | no | gemini | BROKEN-1 k=6 | 6 | none | BROKEN-1 | same |
| 27177 | no | grok | BROKEN-1 k=3 | 3 | none | BROKEN-1 | same |
| 27177 | | PANEL | CHALLENGER PREVAILS 3-0 | | | CHALLENGER PREVAILS 3-0 | CHALLENGER PREVAILS 3-0 |
| 27191 | no | single | BROKEN-1 k=3 | 3 | none; all 3 class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27191 | no | deepseek | BROKEN-1 k=2 | 2 | none; both class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27191 | no | gemini | BROKEN-1 k=2 | 2 | none; both class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27191 | no | grok | BROKEN-1 k=5 | 5 | none | BROKEN-1 | BROKEN-1 |
| 27191 | | PANEL | CHALLENGER PREVAILS 3-0 | | | CHALLENGER PREVAILS 3-0 | DEFENDER PREVAILS 2-1 |
| 27208 | no | single | BROKEN-1 k=3 | 3 | none; all 3 class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27208 | no | deepseek | BROKEN-1 k=1 | 1 | none; class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27208 | no | gemini | BROKEN-1 k=1 | 1 | none | BROKEN-1 | BROKEN-1 |
| 27208 | no | grok | BROKEN-1 k=2 | 2 | none; both class 1 | BROKEN-1 | HELD-1, DEFENDER WINS |
| 27208 | | PANEL | CHALLENGER PREVAILS 3-0 | | | CHALLENGER PREVAILS 3-0 | DEFENDER PREVAILS 2-1 |
| 27259 | YES | single | BROKEN-1 k=3 | 3 | all 3 (b) | HELD-1, DEFENDER WINS | same |
| 27259 | YES | deepseek | BROKEN-1 k=3 | 3 | D6 (b); D4, D5 name [DR1]/[DR2] and quote text found there, kept (whether those words press the witness: UNCOMPUTABLE) | BROKEN-1 k=2 | HELD-1 (D4, D5 class 1) |
| 27259 | YES | gemini | BROKEN-1 k=6, def COLLAPSED c=6 | 6 | all 6 (b) | HELD-1, DEFENDER WINS (note A) | same |
| 27259 | YES | grok | BROKEN-1 k=3 | 3 | all 3 (b) | HELD-1, DEFENDER WINS | same |
| 27259 | | PANEL | CHALLENGER PREVAILS 3-0 | | | DEFENDER PREVAILS 2-1 (note A) | DEFENDER PREVAILS 3-0 |
| 27433 | YES | single | BROKEN-1 k=2 | 2 | D4 (b; also class 1, Luke 3:23); D6 (b; also (c): Jeremiah 31:22 is in DR3 only, note B) | HELD-1, DEFENDER WINS | same |
| 27433 | YES | glm (alternate) | HELD-1 | 0 | none | HELD-1, DEFENDER WINS | same |
| 27433 | YES | gemini | BROKEN-1 k=3 | 3 | all 3 (b) | HELD-1, DEFENDER WINS | same |
| 27433 | YES | grok | BROKEN-1 k=1 | 1 | none: D6 names [DR1]/[DR2] and quotes words found in DR1 (7213 D1; note C); the words are a layer verse's, so whether they press the witness: UNCOMPUTABLE | BROKEN-1 k=1, CHALLENGER WINS | same |
| 27433 | YES | deepseek (removed seat) | BROKEN-1 k=1 | 1 | D6 (b): names no round (read by hand from drv_removed) | HELD-1, DEFENDER WINS | same |
| 27433 | | PANEL | CHALLENGER PREVAILS 2-1 | | | DEFENDER PREVAILS 2-1 (deepseek seated or glm) | same |

Citation rule: no load-bearing DEFENDER quotation fails on 27259 or 27433 (citation_check read; 0 items), so a DEFENDER outcome is not
held to review there. 27177, 27191 and 27208 have no citation check stored (before J2). Tie rule: no re-graded HELD seat on these rows
writes RESULT: UNDERDETERMINED.

NOTE A (27259 gemini): with its 6 lines removed the ladder reads PARTIAL-2, because its stored DEFENSE STANDING is COLLAPSED (c=6). Every
one of those 6 conceded items is "left <verse> unanswered" with no pressing sentence quoted and no round named, so under (b) none counts:
defense c=0 (not COLLAPSED; SELF-SUPPORTED or PROP-DEPENDENT is a footing judgment, UNCOMPUTABLE, and changes no clause). Challenger: the 3
UNEXHIBITED items fall the same way, the 2 stated concessions stay: c=2, PROP-DEPENDENT. So HELD-1, DEFENDER WINS. Applied by hand.
NOTE B (27433 single D6): the line's parentheses name Isaiah 7:14/Matthew 1:23; Jeremiah 31:22 is in its prose. The reader takes the
first parentheses only (A3 7201 note 6), so (c) was confirmed by a separate read: Jeremiah 31:22 is in DR3, not in DR1, DR2 or CR3.
NOTE C (27433 grok, corrected after A3 7213 D1): the first run compared text with markdown emphasis left in, so DR1's "**before they came
together**, she was found with child of the Holy Ghost" did not match grok's quote; with emphasis stripped (verdict_table.cjs, norm) the line
names a pressing round and quotes words found there, so it is KEPT and grok stays BROKEN-1 k=1. The words belong to a layer verse
(Matthew 1:18), not the line's witness (Matthew 1:23): the test shows words found in a pressing round, not that they press that witness.
The rerun changes no other grade (quote counts rise on three removed lines that name no round).

## 4. What the table shows

1. Under the rules each judge was given, the stored outcome is wrong on 27259 and 27433: both become DEFENDER PREVAILS 2-1.
2. 27177, 27191 and 27208 were judged without (b). Under their rules no BROKEN line falls mechanically. 27191 and 27208 turn only if
   the link round's naming of the verse is also an answer under (a); that needs a reading of [CR3] line by line (UNCOMPUTABLE here).
   27177 stands as stored under its rules.
3. Limits, both ways: the (b) test is by words found, not meaning. A kept line (27259 deepseek D4, D5; 27433 grok D6) shows words found in a
   pressing round, not that those words press that witness; a removed line names no round or quotes nothing found there. The reader tests
   the first parentheses only; nothing here is a model call.
