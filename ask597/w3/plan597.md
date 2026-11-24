# ASK 597 PLAN: ONE SHARED HANDLER FOR A LINE OF TEXT, NO CUT AT EACH PLACE, rev 3 (the ASK FORM headings; W1 Wall 11609)

REV 3 REPLACES REV 2 (19695fb8). It puts the plan under the eight headings of the operational document's ASK FORM, in their order, and adds what rev 2 lacked: ROLES, the SEARCH named as such with what is NOT SEARCHED, RUN EVIDENCE, INPUTS IN GIT, and the card each step waits on. No design, criterion or limit of rev 2 is changed; its text is carried over under the new headings. MISTAKE, MINE: revs 0 to 2 were not written to the form.

REV 2 CHANGES (W1's count on live engine 6834c21b and child ecdc6218, Wall 11582; I did not read the engine): the table of section 2 was of engine d819ff4c and is kept as that; the live figures are added beside it (item 1a); item 4 is struck as stale; S1 says the inventory is taken on the live version at build time. THE OPERATOR HAS RULED on rev 1: he pressed "All models and debaters whole" at 07:57 CST 2026-11-24 (ruling row 525): kinds K1, K2, K3, K4 and K6 whole; only K5 shortened, with the mark; four stages, each on its own card. The choice of S3 is therefore answered.

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade. A plan only (the operator's press "Plan 596, then 597, then 598", 01:43 CST). Each build stage needs its own card.

CROSS-REFERENCES in the carried text keep rev 2's numbers: its section 2 is THE SEARCH under heading 3; its section 3 is THE DESIGN under heading 3 (S1, S2 and the stages) and BEFORE EACH CARD under heading 4 (the proof items); its section 4 is EXPECTED EFFECT under heading 1; its section 5 is LIMITS and its section 6 is WRONG-IF, both under heading 5.

## 1. OBJECTIVE

No judge's or debater's words are cut where they are stored, read or shown, and every shortening that remains is done by one function in one place and is marked. (Rule 3 of the coding standard, ASK 599, whose text is before the operator.)

EXPECTED EFFECT:
1. K2: a judge sent back sees its whole line, not the first 600 characters.
2. K4: a judge and the enforcer see a debater's whole sentence at every place the inventory finds one still cut (the ASK 590 close-sentence cuts are already gone, section 2 item 4).
3. K3: the record holds a judge's whole reply.
4. No count, grade, standing or removal rule is changed by this ASK. If a stage would change one (for example a check that now reads text it could not see before and so raises an item it did not raise), the stage's card says so in plain words, with the count on the stored runs.

## 2. ROLES

1. Planner: W3.
2. Builder: W4, each stage.
3. Grader: W1 (not the builder), of this plan, of each stage's build and of each readback.
4. Cards: each of the four stages is its own card in W4's thread, one write of the engine and the child together (the Library Check requires the same library in both). The manual pairs for each stage are drafted by W3 after the stage's write and go on W3's own card in W3's thread.
5. The inventory (S1) is classified by W1 and W4 each, apart.

## 3. SCOPE, WITH THE SEARCH THAT SET IT

IN SCOPE: every `.slice(0,N)` on a text field in the engine and in the child, in the Shared Library (both copies) and in every other node; and every reader of a field a stage makes whole.
OUT OF SCOPE: any count, grade, standing or removal rule; any model setting; any database column (none holds a length limit, item 2b below); the judges' reasoning.
RULES READ: ASK 587 item A (manual part 11.1); ASK 595; Wall 11452, 11462, 11476; rulings 382, 383, 428; the scope rule; the build rule; row 506 (leave nothing to chance).

THE SEARCH (what stands today):
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
1a. LIVE NOW, engine 6834c21b (W1, Wall 11582): 139 places (Shared Library 98, other nodes 41). By length, as library / other nodes: 1,500: 17 / 5; 700: 24 / 3; 600: 31 / 11; 500: 1 / 1; 400: 25 / 21. The fall from 151 is the ASK 595 follow-on. ASK 586 J2 and J3, ASK 591 and its fix 1 added no cut at the five lengths. The child ecdc6218 holds 101 (was 105). Other lengths: 686 in the engine (was 689); the cuts at 2,000 are now 0.
2. The child 31329164 holds 105 cuts at these five lengths, 102 of them in its library copy (W1).
2a. OTHER LENGTHS (W1 F1): the engine holds 689 more `.slice(0,N)` at other lengths (148 at 200, 102 at 300, 9 at 1,200, 6 at 900, 3 at 2,000, others) and the child 269. Many cut arrays or ids. They are all in the inventory; each is classed K1 to K6 or NOT TEXT.
2b. NO SIZE LIMIT IN THE DATABASE (W1 F4): debate_enforcer_log, odv1_question_round_log and debate_results hold no length limit on their text columns. The longest stored flagged_line is 5,719 characters and the longest response_line 1,742, so one path already stores a reply over 700 whole; S1 names that path.
3. What the text before each cut names, by my scan (a rough reading, not a classification): at 700, 23 of 27 follow `response_line`; at 1,500, 12 follow a `line` field and 3 follow `response_line`; at 600, 5 follow the words "Your line" (W1 named at least 3 send-back texts that show a judge its own line cut to 600).
4. STRUCK (W1, Wall 11582): rev 1 said ASK 590's judges' block cut each debater's close sentence to 500 characters and its send-back to 400. The ASK 595 follow-on removed those cuts; they do not stand on the live engine.
5. ASK 587 item A stands: a line that reaches the E-COL layer check ending " [...]" is NOT READ, never UNCURED.

NOT SEARCHED:
1. A cut written another way (`substring`, `substr`, a regular expression with a length) is not in my table; W1 found no `substring` or `substr` form (item 1); S1 searches those forms again on the live version.
2. Workflows the engine and the child reach beyond those two (Execute Workflow targets, webhook paths and workflow ids in node text): NOT SEARCHED by me; I do not read n8n. W4 names each at S1 and scans it, or names it NOT SEARCHED. Until then nothing is reported gone outside the engine and the child.
3. An n8n item size limit: not read by me.

THE DESIGN:
S1. THE INVENTORY. Taken on the live engine and child as they stand at the build, not from the figures of section 2. One table, one row per cut in the engine and the child: node or library line, the field, whose words they are, where the cut text goes (stored, shown to a judge, shown to the enforcer, a record note), and its kind:
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

## 4. CRITERIA AND DONE

OBJECTIVE MET when:
1. the standing test set (ASK 596) counts ZERO `.slice(0,N)` ON A TEXT FIELD outside the one handler, in the engine and the child, at every length. A TEXT FIELD here is a string of a model's or a debater's words, or of the engine's own prose: a line, a reply, a quotation, a reason, a note. A cut of an array, an id, a hash or a model name is not a text field and is not counted; the inventory (S1) marks each such place NOT TEXT with its reason, so that the exclusion is decided place by place and not by a pattern (W1 F1);
2. the long-line test (596 S3) passes with scope (b), the judge's own line shown in a send-back, as a hard FAIL;
3. one run shows a judge line over 1,500 characters stored whole in debate_enforcer_log and shown whole in its send-back.

BEFORE EACH CARD:
S5. PROOF BEFORE EACH CARD (W4), on stored runs 37203, 41822 and 42071:
1. KNOWN-BAD: the base engine shows the long test line cut at the stage's places; the target shows it whole.
2. CONTROL: a line shorter than the old limit is byte for byte the same in base and target.
3. SIZE: the growth of each judge request and each stored row, in characters, largest case named.
4. READERS: every reader of a field the stage changes is listed, with a test that it reads the whole text as it read the cut text (W4 names the readers; the ASK 587 "NOT READ" rule must give the same result on a line that is now whole).
5. The standing test set passes on the target.
6. (W1 F3a) No text shortened by `shorten()`, which ends " [...]", reaches a reader that applies the ASK 587 A "NOT READ" rule. That rule is for a judge's line; an engine note that ends with the mark must not be taken for an unread judge line. W4 lists every reader of the mark and shows none receives K5 text.
7. (W1 F3b) A library line is counted once, with every node that runs it named, so a cut in the library is not counted once per node nor missed for a node.

DONE, for each stage: the criteria of S5 met on the target, W1's grade posted, the write on the stage's card, and W1's readback MATCH. DONE, for the ASK: the three OBJECTIVE MET lines above. Under TWO LIVE RUNS (operational document) a stage is a pass after two live runs in which its path fired with no issue.

## 5. WRONG-IF

1. A reader depends on the cut (for example a pattern that fails on long text, or a prompt builder that assumes a size). Then that reader is fixed in the same stage, and named.
2. A request grows past a model's limit on a stored run (S5 item 3 shows it). Then K4 needs a stated cap with the mark, chosen by the operator, and the plan's "never cut" is narrowed in plain words on that card.
3. The classification K1 to K5 does not fit a place (text of mixed origin). Then that place is listed and settled alone.

LIMITS:
1. Not shown by a run until one holds a long line at each kind of place.
2. The inventory is as good as the scan. A cut written another way (`substring`, `substr`, a regular expression with a length) is not in my table; S1 must search those forms too.
3. Closed by W1's read (section 2 item 2b): no database length limit. An n8n item size limit is still not read by me.

## 6. RUN EVIDENCE

1. CASE: a live run in which a judge writes a line over 1,500 characters that draws a send-back, and a reply over 700 characters.
2. MARK, stages 1 and 3, by SQL: in debate_enforcer_log for the run, flagged_line equals the judge's whole line (its length over 1,500, no " [...]" ending), and response_line holds the whole reply (its length over 700).
3. MARK, stages 1 and 2, the text shown to a judge or the enforcer in a request: EXECUTION ONLY unless W4 names a stored field that carries it; W4 states the mark for each stage in its build plan.
4. Stage 4 (K5): NO PROBE by a run; the mark is the ASK 596 scan count of zero on the live version.
5. No ASK 417 registry entry exists for this ASK; I found no registry table that carries ASK case marks (the same finding as Wall 10320 and 10395). The builder files the entry at each stage's build, or the stage's plan says none exists.
6. A run with no line over 1,500 characters leaves the ASK UNEXERCISED, not met.

## 7. INPUTS IN GIT

Branch claude/untitled-9jle0o.
1. This plan: ask597/w3/plan597.md, at the commit named in its Wall post.
2. W1's count script: fairjudge/w1/g597/cnt597.js; W1's grade of rev 0: fairjudge/w1/g597/grade_plan_rev0.md; W1's check against the live version: fairjudge/w1/g598/plan_drift_597_598.md.
3. The engine file my table was taken from, ask590/w4/write_r593/fetchback_eng590.json (md5 10b2bcc8c65ddb5e5961b39bca7f1610), is in the project folder and NOT in git; it is named by md5. The live figures (item 1a) are W1's, from its own read.
4. Each stage's build scripts, test outputs and target files: W4 commits them and names the commit in the stage's plan.

## 8. STEPS, EACH WITH ITS CARD

0. W1 grades this rev 3 for the form. No card.
S4. STAGES, each its own build, grade and card, in this order:
1. The handler and K2 (the judge shown its own line whole). Smallest, and it is a judges defect today.
2. K4 (debaters' words whole before the judges and the enforcer).
3. K3 and K6 (the judge's reply and the other models' words stored and shown whole).
4. K5 (every remaining cut goes through `shorten` with a named limit and the mark).
After each stage the 596 baseline counts fall; after stage 4 they are zero and rule 3 is a hard FAIL everywhere.
Each stage in turn: W4's build plan under these headings; W1's grade; the stage's card in W4's thread; the write; W1's readback; then W3's manual pairs for that stage, graded by W1, on W3's card. No stage is written before the stage ahead of it is read back.

ORDER WITH THE OTHER WORK: After ASK 596's core exists, because 596 is the measure of this ASK. W4's order (595, J1, J2/J3/J6, C1, 594, 591) is not changed by this plan. Stage 1 (K2) is a judges defect and could go before 591; that placement is the operator's choice on its card.
