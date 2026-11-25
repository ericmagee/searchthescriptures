# ASK 654 plan, rev 0 (W3): the Oracle answers a pressed verse AT that verse, through the four layers

Planner W3 (session_01H1X3ANsGiMnhnbkfphocmo). Not built. Not written. Nothing here is the operator's instruction to write; part 1 changes what the Oracle is told and needs his instruction on the exact words.

Source: the operator in the W3 thread, 2026-11-25, verbatim.
- 15:13 CST: "yes. you're correct.  but you first some must prove your position using the framework (Layers)"
- 15:17 CST: "No, you only need to Matthew 1:23 (because that's the scripture in question .. correct?)   ... GO to our book Follow the Percepts and ready chapter 2."
- 15:21 CST: "you are now correct"
- 15:24 CST: "we can't move forward because we still have a fault that exist for the Oracle (regardless of which model is being used as the engine).  how should be this be resolve ... else the gap remains."
Book: kb_book_chapters book_id 1 order_index 3, "The Four Layers" (footer Chapter 2), read whole.

## 1. OBJECTIVE
When a verse is pressed against the Oracle, the Oracle answers at that verse by the four layers of the book's chapter 2: Layer 1, what the verse's words state, read with the verses around it; Layer 2, its word; Layer 3, the rest of scripture; Layer 4, inference named as inference, on either side. A code check sends back an answer that does not.
Expected effect: in the next run every Oracle answer to a pressed verse carries, on that verse, an [L1] quotation of it and at least one of [L2] or [L3], and names as [L4] the inference the opponent rests on it. The judges then grade a layered reading of the pressed verse, not an answer from other rows.
Why now: in run 42528 the Oracle answered Matthew 1:23 with Mary's espousal standing (CR3 "where Mary is already Joseph's wife"; CR4 "accords with her espousal standing"); sol, sol62 and chatgpt held the keystone broken there. The synthesis: "The force of the word "virgin" in the row Matthew applies is not addressed in any round."
No verse, topic or judge phrase is named in any text this ASK adds (operator 11-20: a fix is never for a single case).

## 2. ROLES
Planner W3. Builder W4 (engine, n8n). Grader W1. Write card: W4's thread for the engine; W3's thread for the manual entry. Part 1's words go to the operator on a card of their own before any build is written (it touches what the Oracle is told).

## 3. SCOPE
Three parts.
PART 1, instruction, Oracle seat only (Ruling 383). One standing paragraph in the Oracle's own prompt (GUARDHOLD in Init with Guards, by the manual). DRAFT WORDS, for the operator's ruling, not final:
"ANSWER AT THE PRESSED VERSE. For every verse pressed against you, answer at that verse before any other row, by the four layers. [L1]: quote the verse whole and say what its words state, read with the verses around it. [L2]: its word, in the lexicon gloss as served. [L3]: the rows that read with it. [L4]: name as inference what is inferred from it, your own step and the step your opponent rests on it. Then show the fit with your chain."
PART 2, check, by code. An answer to a pressed verse that lacks, on that verse, an [L1] quotation of it and one of [L2] or [L3] is sent back to its seat once, on the existing send-back paths (manual 06.0: D4B sends back for a pressed verse with no ANSWER line and for layer points; the link rounds have C3G and the B nodes). OPEN FOR REVIEW: Oracle seat only, or both seats (a form check on layers is side-neutral).
PART 3, conflict to settle before parts 1 and 2. BARRED MOVES (a), both debaters (manual 06.0): "an answer from silence, answering a press from what a verse does not name, state or say". A Layer 1 statement of what the pressed verse states must not be harvested and voided as (a). W4 reads the finder and reports; if it is harvested, the plan gains a bound in rev 1.
Read with, not replaced: the ASK 408 line ("answer from the DAVIDIC seed rows ... the absence alone is never your answer") and DG-8 (b) ("answer it from the seed chain above"). Under part 1 those rows are the pressed verse's Layer 3, after its Layer 1 and 2. Whether either needs a word changed is W1's review question; a guard change is the operator's to instruct and none is proposed.
NOT IN SCOPE: any sight, any guard, the judges' prompts, the plain seat's prompt (unless part 2 is ruled both seats), any model setting, reasoning effort, max_tokens.
SEARCH: NOT DONE in rev 0. W3 read engine manual parts 05.0 and 06.0 whole; W3 does not read n8n. W4 owes the search of the engine, the child and every workflow they reach for: the GUARDHOLD string and its uses; the D3, D4, C3, C4 round forms and their B and G nodes; the barred-move finder copies; the layer-point check (pkgLAYB) copies; every hit listed. Rev 1 carries it.

## 4. CRITERIA and DONE
C1. Part 1's words name no verse, book, topic or judge phrase.
C2. Part 1 reaches the Oracle seat only; the plain seat, the judges and the enforcers do not see it (shown by W4's reach read).
C3. Part 3 is answered with the finder's phrases and a replay on stored rounds: a Layer 1 sentence inside an answer to a press is not voided, or the bound that prevents it is in the build.
C4. Part 2 replayed on the stored Oracle rounds of 42528, 42517 and 42373: the count of answers to pressed verses that would be sent back is stated, each listed; no answer that carries the layers on its verse is sent back (zero false items).
C5. Size stated in characters for each node and each prompt; calls added stated (a send-back is at most one per round, on paths that exist).
C6. Standing set PASS before and after; Library Check PASSES.
DONE: live, read back, and two live runs with no issues in which the Oracle's answers to pressed verses carry the layers on the verse.

## 5. WRONG-IF
- The Oracle already receives an instruction to layer the pressed verse that W3's manual read missed (W4's search decides).
- The barred-move finder cannot tell a Layer 1 statement from an answer from silence without a rule that names a case.
- The check cannot find "the answer to a pressed verse" in the link rounds by code (only D4 has the ANSWER line form).
- The paragraph makes the Oracle drop the seed rows; they are its Layer 3 and must stay.

## 6. RUN EVIDENCE
NO PROBE yet. Mark for the next run, to be registered at build: in every Oracle round that answers a press, each pressed verse has an [L1] quotation of itself and an [L2] or [L3] on it; the review note of a round sent back names the pressed verse that lacked layers.

## 7. INPUTS IN GIT
This plan: ask654/w3/plan654.md (commit named in the Wall post). W3's run 42528 findings: fairjudge/w3/oracle_loss/run_42528.md. W4's finder read and replays: to come, under ask654/w4/.

## 8. STEPS
1. W4: finder read (part 3) and the search (heading 3). No card.
2. W1: review question on ASK 408 and DG-8 (b). No card.
3. W3: plan rev 1 with the search, the finder result and part 2's seat question settled; W1 grades.
4. The operator: a card in the W3 thread on part 1's exact words and on part 2 (Oracle only, or both seats). Waits on W1's PASS of rev 1.
5. W4: build, replays; W1 grades the build.
6. The operator: W4's write card.
7. W3: manual entry (parts 05.0 and 06.0) on W3's card; AAR row.
