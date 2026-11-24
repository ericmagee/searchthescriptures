# ASK 597 PLAN: ONE SHARED HANDLER FOR A LINE OF TEXT, NO CUT AT EACH PLACE, rev 1 (W1 F1 to F4 of Wall 11481)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade. A plan only (the operator's press "Plan 596, then 597, then 598", 01:43 CST). Each build stage needs its own card.

## 0. OBJECTIVE

No judge's or debater's words are cut where they are stored, read or shown, and every shortening that remains is done by one function in one place and is marked. (Rule 3 of the coding standard, ASK 599, whose text is before the operator.)

OBJECTIVE MET when:
1. the standing test set (ASK 596) counts ZERO `.slice(0,N)` ON A TEXT FIELD outside the one handler, in the engine and the child, at every length. A TEXT FIELD here is a string of a model's or a debater's words, or of the engine's own prose: a line, a reply, a quotation, a reason, a note. A cut of an array, an id, a hash or a model name is not a text field and is not counted; the inventory (S1) marks each such place NOT TEXT with its reason, so that the exclusion is decided place by place and not by a pattern (W1 F1);
2. the long-line test (596 S3) passes with scope (b), the judge's own line shown in a send-back, as a hard FAIL;
3. one run shows a judge line over 1,500 characters stored whole in debate_enforcer_log and shown whole in its send-back.

## 1. RULES READ

ASK 587 item A (manual part 11.1); ASK 595; Wall 11452, 11462, 11476; rulings 382, 383, 428; the scope rule; the build rule; row 506 (leave nothing to chance).

## 2. WHAT STANDS TODAY

My own scan of W4's fetch-back of the live engine (ask590/w4/write_r593/fetchback_eng590.json, engine d819ff4c, 422 nodes), counting `.slice(0,N)` for N of 400, 500, 600, 700, 1500:

| Cut at | Places | In the Shared Library | In other nodes |
|---|---|---|---|
| 1,500 | 24 | 19 | 5 |
| 700 | 27 | 24 | 3 |
| 600 | 42 | 31 | 11 |
| 500 | 10 | 1 | 9 |
| 400 | 48 | 27 | 21 |
| all | 151 | 102 | 49 |

1. W1's strict scan (Wall 11481) gives the same table row by row, 151; W1 withdrew its earlier 141. No `substring` or `substr` form stands.
2. The child 31329164 holds 105 cuts at these five lengths, 102 of them in its library copy (W1).
2a. OTHER LENGTHS (W1 F1): the engine holds 689 more `.slice(0,N)` at other lengths (148 at 200, 102 at 300, 9 at 1,200, 6 at 900, 3 at 2,000, others) and the child 269. Many cut arrays or ids. They are all in the inventory; each is classed K1 to K6 or NOT TEXT.
2b. NO SIZE LIMIT IN THE DATABASE (W1 F4): debate_enforcer_log, odv1_question_round_log and debate_results hold no length limit on their text columns. The longest stored flagged_line is 5,719 characters and the longest response_line 1,742, so one path already stores a reply over 700 whole; S1 names that path.
3. What the text before each cut names, by my scan (a rough reading, not a classification): at 700, 23 of 27 follow `response_line`; at 1,500, 12 follow a `line` field and 3 follow `response_line`; at 600, 5 follow the words "Your line" (W1 named at least 3 send-back texts that show a judge its own line cut to 600).
4. Known from the build files: ASK 590's judges' block shows each debater's close sentence and earlier sentence cut to 500 characters, and its send-back text cuts them to 400 (build590.cjs, build590_l2.cjs), with no mark.
5. ASK 587 item A stands: a line that reaches the E-COL layer check ending " [...]" is NOT READ, never UNCURED.

## 3. THE DESIGN

S1. THE INVENTORY. One table, one row per cut in the engine and the child: node or library line, the field, whose words they are, where the cut text goes (stored, shown to a judge, shown to the enforcer, a record note), and its kind:
- K1: a judge's line as stored (`flagged_line`). Uncut since ASK 587 and 595.
- K2: a judge's own line shown back to that judge in a send-back.
- K3: a judge's reply as stored (`response_line`).
- K4: a debater's words shown to a judge or to the enforcer.
- K5: text the engine itself wrote (a reason, a note, a "why"), kept short for a record.
- K6 (W1 F2): the words of a model that is neither judge nor debater: the enforcer's replies, the assume check, a cure reply, a question round answer. PROPOSED: whole, as K1 to K4. They are a model's words, and a reader of the record needs them as written; the enforcer's reason shown to a judge in a send-back is what the judge must answer.
W1 and W4 each classify; every disagreement is listed and settled before a build.

S2. THE HANDLER. Two functions in the Shared Library, and nowhere else:
- `whole(text)`: returns the text unchanged. Used at every K1 to K4 and K6 place, so that a reader of the code sees that the words are kept whole on purpose.
- `shorten(text, limitName)`: for K5 only. The limit is read by name from one table of limits (rule 4 of the standard: each limit has a name, one home and a stated reason). A shortened text ends with the one mark " [...]", the same mark ASK 587's readers already know.
No other `.slice(0,N)` on a text field may stand. The ASK 596 scan enforces it.

S3. WHOSE WORDS ARE KEPT WHOLE (the choice the operator is asked to make on the first card):
- PROPOSED: K1, K2, K3, K4 and K6 all whole. A model's and a debater's words are never cut, stored or shown. Only K5, the engine's own text, is shortened, and marked.
- WHAT IT COSTS: longer stored rows and longer requests. W4 measures both on the stored runs before each card (S5).

S4. STAGES, each its own build, grade and card, in this order:
1. The handler and K2 (the judge shown its own line whole). Smallest, and it is a judges defect today.
2. K4 (debaters' words whole before the judges and the enforcer).
3. K3 and K6 (the judge's reply and the other models' words stored and shown whole).
4. K5 (every remaining cut goes through `shorten` with a named limit and the mark).
After each stage the 596 baseline counts fall; after stage 4 they are zero and rule 3 is a hard FAIL everywhere.

S5. PROOF BEFORE EACH CARD (W4), on stored runs 37203, 41822 and 42071:
1. KNOWN-BAD: the base engine shows the long test line cut at the stage's places; the target shows it whole.
2. CONTROL: a line shorter than the old limit is byte for byte the same in base and target.
3. SIZE: the growth of each judge request and each stored row, in characters, largest case named.
4. READERS: every reader of a field the stage changes is listed, with a test that it reads the whole text as it read the cut text (W4 names the readers; the ASK 587 "NOT READ" rule must give the same result on a line that is now whole).
5. The standing test set passes on the target.
6. (W1 F3a) No text shortened by `shorten()`, which ends " [...]", reaches a reader that applies the ASK 587 A "NOT READ" rule. That rule is for a judge's line; an engine note that ends with the mark must not be taken for an unread judge line. W4 lists every reader of the mark and shows none receives K5 text.
7. (W1 F3b) A library line is counted once, with every node that runs it named, so a cut in the library is not counted once per node nor missed for a node.

## 4. WHAT THIS CHANGES FOR A JUDGE OR A RUN

1. K2: a judge sent back sees its whole line, not the first 600 characters.
2. K4: a judge and the enforcer see a debater's whole sentence where they now see 400 or 500 characters of it.
3. K3: the record holds a judge's whole reply.
4. No count, grade, standing or removal rule is changed by this ASK. If a stage would change one (for example a check that now reads text it could not see before and so raises an item it did not raise), the stage's card says so in plain words, with the count on the stored runs.

## 5. LIMITS

1. Not shown by a run until one holds a long line at each kind of place.
2. The inventory is as good as the scan. A cut written another way (`substring`, `substr`, a regular expression with a length) is not in my table; S1 must search those forms too.
3. Closed by W1's read (section 2 item 2b): no database length limit. An n8n item size limit is still not read by me.

## 6. THIS PLAN IS WRONG IF

1. A reader depends on the cut (for example a pattern that fails on long text, or a prompt builder that assumes a size). Then that reader is fixed in the same stage, and named.
2. A request grows past a model's limit on a stored run (S5 item 3 shows it). Then K4 needs a stated cap with the mark, chosen by the operator, and the plan's "never cut" is narrowed in plain words on that card.
3. The classification K1 to K5 does not fit a place (text of mixed origin). Then that place is listed and settled alone.

## 7. ORDER WITH THE OTHER WORK

After ASK 596's core exists, because 596 is the measure of this ASK. W4's order (595, J1, J2/J3/J6, C1, 594, 591) is not changed by this plan. Stage 1 (K2) is a judges defect and could go before 591; that placement is the operator's choice on its card.
