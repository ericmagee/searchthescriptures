# ASK 654 plan, rev 5 (W3): the Oracle answers a pressed verse AT that verse, through the four layers

Planner W3 (session_01H1X3ANsGiMnhnbkfphocmo). Rev 5 replaces rev 4 (a57b0211, commit 9e00a66f, Wall 12174): part 1's four layer lines are now the operator's own text of 15:34 CST; nothing else changes. Rev 4 replaces rev 3a (3907c183, commit eadbbcf6, Wall 12172) and restates heading 3 (part 2, the lines read with part 1, the search) and heading 8 after W4's check plan rev 1 (ask654/w4/check_plan654.md adfe60f9, Wall 12173). Part 1's draft words are unchanged from rev 3a. Rev 3 replaces rev 2 (023b2010, commit 2468db29, Wall 12170) and restates heading 3 part 1 and part 2 on the operator's correction of 15:29 CST 2026-11-25, verbatim: "this is not a proper explanation  of the layers ...  why are you revamping the word you read from the book?  when you do that you dilute the meaning." RULE TAKEN: the layers are stated in the book's own words, quoted; W3 adds no wording of its own in their place. The operator 15:31 CST: "you can slightly trim from there .. but not revamp as you did before". Rev 3a replaces rev 3 (8ab76acf, commit bce9a17a, Wall 12171): the two Layer 4 sentences are put in the book's order (W1's check). Rev 2 replaced rev 1 (5b516303, commit 75743561, Wall 12168) and restates headings 1 (expected effect), 3, 4 and 5 after W4's reads on Wall 12169 (files ask654/w4/t654.cjs eafc4aec, t654_out.txt 36739582). Rev 1 replaced rev 0 after W1's review on Wall 12167. Not built. Not written. Nothing here is the operator's instruction to write; part 1 changes what the Oracle is told and needs his instruction on the exact words.

Source: the operator in the W3 thread, 2026-11-25, verbatim.
- 15:13 CST: "yes. you're correct.  but you first some must prove your position using the framework (Layers)"
- 15:17 CST: "No, you only need to Matthew 1:23 (because that's the scripture in question .. correct?)   ... GO to our book Follow the Percepts and ready chapter 2."
- 15:21 CST: "you are now correct"
- 15:24 CST: "we can't move forward because we still have a fault that exist for the Oracle (regardless of which model is being used as the engine).  how should be this be resolve ... else the gap remains."
Book: kb_book_chapters book_id 1 order_index 3, "The Four Layers" (footer Chapter 2), read whole.

## 1. OBJECTIVE
When a verse is pressed against the Oracle, the Oracle answers at that verse by the four layers of the book's chapter 2: Layer 1, what the verse's words state, read with the verses around it; Layer 2, its word; Layer 3, the rest of scripture; Layer 4, inference named as inference, on either side. A code check sends back an answer that does not.
Expected effect: in the next run every Oracle answer to a pressed verse carries the fixed lines of part 1 on that verse: the verse and a verse beside it, what its words state, the opponent's inference from it quoted and named as inference, its word, the rows that read with it. The judges then grade a reading of the pressed verse, not an answer from other rows.
FACT THAT SHAPES THE FIX (W4, Wall 12169 item 5): in 42528 CR4 the Oracle's answer on the pressed verse already carried the tags [L1], [L2], [L3] and [L4], and the layers check found 0 items. The lack is in content: no statement of what the verse states, and its [L4] is its own fit, never the opponent's inference named as inference. A check for tags would pass that block and close nothing.
Why now: in run 42528 the Oracle answered Matthew 1:23 with Mary's espousal standing (CR3 "where Mary is already Joseph's wife"; CR4 "accords with her espousal standing"); sol, sol62 and chatgpt held the keystone broken there. The synthesis: "The force of the word "virgin" in the row Matthew applies is not addressed in any round."
No verse, topic or judge phrase is named in any text this ASK adds (operator 11-20: a fix is never for a single case).

## 2. ROLES
Planner W3. Builder W4 (engine, n8n). Grader W1. Write card: W4's thread for the engine; W3's thread for the manual entry. Part 1's words go to the operator on a card of their own before any build is written (it touches what the Oracle is told).

## 3. SCOPE
Three parts.
PART 1, instruction, Oracle seat only (Ruling 383). One standing paragraph in the Oracle's own prompt (GUARDHOLD in Init with Guards). The layers are in the book's own words (kb_book_chapters book_id 1 order_index 3, "The Four Layers"; each quotation checked by SQL against the stored text 15:30 CST). DRAFT, for the operator's ruling, not final:
"ANSWER AT THE PRESSED VERSE. For every verse pressed against you, take that verse itself through the four layers before any other row.
Layer 1 — What Does the KJV Actually Say? "Read the verse. Read the surrounding verses."
Layer 2 — What Does the Hebrew or Greek Actually Mean? "what did the original word carry?"
Layer 3 — What Does the Rest of Scripture Say? "The meaning is assembled across passages, not extracted from one."
Layer 4 — Inference, Named as Inference. "an inference presented as text is the primary failure mode this method exists to prevent." "every Layer 4 step is flagged as exactly what it is." L4 must have two supporting layers."
THE FOUR LAYER LINES ARE THE OPERATOR'S TEXT of 15:34 CST 2026-11-25 (his message in the W3 thread, cmsg_017ZQamDMHrS6fqMHnQDVo58SmAjhPTJRWBBqEXL48eciB, ending "thoughts?"): he trimmed Layer 1 to two sentences and added "L4 must have two supporting layers." The trigger (heading and first sentence) is W3's and waits on his word.
WORDS IN THAT DRAFT THAT ARE NOT THE BOOK'S: the heading and its first sentence (the trigger, W3's) and the operator's sentence "L4 must have two supporting layers.", which matches the standing rule of manual 05.0 (an [L4] counts as evidence only if it exhibits at least two prior layers).
WITHDRAWN from rev 2 as W3's rewording of the layers: "what the verse's own words state", "its word, in the lexicon gloss as served", "the rows that read with it; the seed rows are this verse's [L3]", "your own step, named as inference", and the line labels STATES and THEIR INFERENCE, NOT TEXT as definitions of a layer.
ORDER CLAUSE (W1, Wall 12167), the operator's text to approve: the ASK 408 line gains "after the pressed verse's own layers" (so it reads "... or challenges the union, answer, after the pressed verse's own layers, from the DAVIDIC seed rows ..."). Without it the Oracle holds two instructions with two first steps for one press. DG-8 (b) is a guard; whether it gains the same clause is the operator's to instruct and none is drafted.
PART 2, check, by code, no new model call: W4's check plan rev 1, ask654/w4/check_plan654.md adfe60f9 (Wall 12173), graded with this plan. It names, restates and defines no layer; it reads only marks the engine already uses. On the ANSWER block to a pressed verse R: an [L1] line quotes R with its reference and an [L1] line quotes another verse of R's chapter; an [L2] line carries a Strong's number; an [L3] line quotes a verse outside R's chapter; an [L4] line quotes the opponent, [DR<n>] "<6 or more words>", word for word in that round. A block that lacks one joins the one existing send-back; nothing is struck. In D4B Build and D3B Build, beside the ASK 628 PRESS LIST check. Replay (W4): the 42528 CR4 block on its pressed verse is listed for two lacks (no surrounding verse at [L1]; no [L4] quoting the opponent); a block written to the marks gives 0 items and 0 finder hits. Cost: 0 calls; about 3,000 characters of code; a note of about 200 characters per listed verse.
HEAD FORM (W4 item 6): the link round has no fixed per-verse answer head (42517 and 42373 wrote none). Part 1 gains one engine-form sentence, for the operator's ruling with the rest: "Head each answer ANSWER: <book chapter:verse> -- D<n> --, in the link round as in the close." It is the close's existing form (manual 06.0) and says nothing of a layer.
SEAT: Oracle seat only in this ASK. The operator named the fault as the Oracle's; PRESS LIST is Oracle-only today. Both seats is possible later at the same cost per seat (W4) and would be its own ASK.
PART 3, SETTLED BY W4's READ (Wall 12169 items 1 to 4). The finder harvests, inside an ANSWER block, a sentence with "does/did not" or "never" + name, state, say, mention, specify, deny, record, tell; "names no"; "states no"; "says nothing"; "is silent"; "without stating/naming"; "is not named/stated". "The verse states X; it does not state Y" IS harvested as BARRED MOVE (a) and, if kept after the one send-back, struck VOID with the press counted unanswered. It is not struck when a NOT A REQUIREMENT -- rebuts line follows within 3 lines (tested on 42528 [DR3]). So the finder is NOT changed: part 1 words [L1] as what the verse states, puts the opponent's step on its own [L4] line, and carries the rebut line for any does-not-state sentence.
LINES THE ORACLE ALREADY HOLDS THAT SET A FIRST STEP FOR A PRESS (W4's search, Wall 12173 item 5; GUARDHOLD is in Init with Guards only, the child has 0 hits). None tells the Oracle to take the pressed verse itself through the layers. Each is the operator's text; none is changed by this plan; each goes to him as a question:
(i) the ASK 408 line, "answer from the DAVIDIC seed rows": the order clause above.
(ii) TEXTPROOF, ONE-VERSE RESTRICTION: "when the opponent asks you to answer from one verse alone ... do not accept the restriction ... then answer the pressed verse from the chain". W4 reads it as pulling against part 1. W3's reading, for review: under part 1 the chain enters as the pressed verse's Layer 3 ("The meaning is assembled across passages, not extracted from one."), so the two agree if the order is said; as worded it sends the Oracle to the chain first.
(iii) GUARDHOLD, "name it as an import the text does not state and answer from the verses the guard names": its "does not state" is BARRED MOVE (a) wording inside an answer block.
(iv) ruling 421, "answer a press with the fit"; __ORACLE9, "presses a word ... gives an [L2]"; the DG-18 and DG-8 topic lines: read with part 1, no change drafted.
NOT IN SCOPE: any sight, any guard, the judges' prompts, the plain seat's prompt (unless part 2 is ruled both seats), any model setting, reasoning effort, max_tokens.
SEARCH: DONE by W4 on live engine a5c3001d and the child (Wall 12169, 12173 item 5): the finder in every B node (C1B to C4B, D2B to D4B); the layers check; the PRESS LIST check; GUARDHOLD (Init with Guards only; child 0 hits); every line that sets a first step for a press, listed above. NOT SEARCHED: none named by W4.

## 4. CRITERIA and DONE
C1. Part 1's words name no verse, book, topic or judge phrase.
C2. Part 1 reaches the Oracle seat only; the plain seat, the judges and the enforcers do not see it (shown by W4's reach read).
C3. A block written to part 1's lines, replayed through the live finder, has no sentence struck (W4's t654 extended to the final words).
C4. Part 2 replayed on the stored Oracle rounds of 42528, 42517 and 42373: every answer to a pressed verse that would be sent back is listed (the 42528 CR4 block on its pressed verse must be among them); a block written to part 1's lines is not sent back (zero false items).
C5. Size stated in characters for each node and each prompt; calls added stated (a send-back is at most one per round, on paths that exist).
C6. Standing set PASS before and after; Library Check PASSES.
DONE: live, read back, and two live runs with no issues in which the Oracle's answers to pressed verses carry the layers on the verse.

## 5. WRONG-IF
- The Oracle already receives an instruction to layer the pressed verse that W3's manual read missed (W4's search decides).
- A block written to part 1's lines is struck by the finder (C3 fails).
- The fixed lines turn the answer into form without content: the STATES line restates the verse and says nothing. The first run's answers are read whole for this.
- The check cannot find "the answer to a pressed verse" in the link rounds by code (only D4 has the ANSWER line form).
- The paragraph makes the Oracle drop the seed rows; they are its Layer 3 and must stay.

## 6. RUN EVIDENCE
NO PROBE yet. Mark for the next run, to be registered at build: in every Oracle round that answers a press, each pressed verse has an [L1] quotation of itself and an [L2] or [L3] on it; the review note of a round sent back names the pressed verse that lacked layers.

## 7. INPUTS IN GIT
This plan: ask654/w3/plan654.md (commit named in the Wall post). W3's run 42528 findings: fairjudge/w3/oracle_loss/run_42528.md. W4's finder read and replays: to come, under ask654/w4/.

## 8. STEPS
1. W4: finder read (part 3) and the search (heading 3). No card.
2. W1: review question on ASK 408 and DG-8 (b). No card.
3. W4: check plan for part 2 to rev 2's words, with the owed search; W1 grades rev 2 and the check plan together.
4. The operator: in the W3 thread, the exact words shown above the card, one question at a time: part 1 with the head form; then the order clause for the ASK 408 line; then the ONE-VERSE RESTRICTION line; then the GUARDHOLD import line. Waits on W1's PASS of rev 1.
5. W4: build, replays; W1 grades the build.
6. The operator: W4's write card.
7. W3: manual entry (parts 05.0 and 06.0) on W3's card; AAR row.
