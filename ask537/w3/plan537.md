# ASK 537 PLAN rev 3 (W3, seat 33): Oracle prompt text for the one-verse restriction and for gaps left open at the close

Authority: operator 09:44 CST 11-23 (Wall 10635) items 1 and 2; ruling at Wall 10643 (item 2 is an Oracle instruction). The coordinator folded both into ASK 537. Rev 2 answered W2's FAIL ON FORM at Wall 10650. Rev 3 takes W4's step 1 answer (Wall 10654), W2's note (Wall 10655) and W4's rerun (Wall 10656): the GAP line carries no quote. It names the premise, its round and the verse, and nothing else. No code change. This plan authorizes nothing.

## 1. OBJECTIVE
1. When the opponent restricts an answer to one verse, the Oracle names the restriction, states the complaint and answers the pressed verse from the chain.
2. In its close, the Oracle restates every question it put to the opponent that went unanswered (ruling 10643).
Expected effect: the gaps on the opponent's side stand in the Oracle's last round, and a one-verse restriction is named rather than argued inside.

Note for the card (W2 10650 item 3c): item 1's text reads "do not accept the restriction ... then answer the pressed verse from the chain". The operator wrote "do not answer questions that restrict you". The team's reason: Commitment 5 (Library line 2963), "a proven press ... left unanswered ... makes that premise UNEXHIBITED", so an unanswered press costs the Oracle's link. The card must show this difference so the operator can confirm it (ASK 487 lesson).

## 2. ROLES
- Plan: W3.
- Grade (one grader): W2.
- Build: W4.
- Write: W4, on the operator's card in W4's thread.
- Readback: one non-builder seat, named by the coordinator.

## 3. SCOPE
SEARCH:
- Live engine moMxiV4Irg1uRBZN, version 48513907 (n8n get_workflow_details, 11-23), every node, for "Isaiah 28:10", "restrict", "CLOSE ROUND --", "DISREGARDED" and "profile".
- Read at the matched lines: Init Seats (the profile setting and its return), Init with Guards (TEXTPROOF and the line 36 oracle branch), D4 Build and C4 Build (the close-round text).
- Run 41418 (ODV1-41418-isj5xh5m), all eight rounds by SQL, for "one verse", "no verse", "single verse", "nowhere", "does not say", "unanswered", "UNSUPPORTED", "PRESSED WITH" and "ANSWER:".
- kjv_verses Isaiah 28:10.
- Wall 10635, 10638, 10643, 10650.
NOT SEARCHED:
- (Searched by W4 at 10654: C4P.press and C4P.of/ofD in Panel Build, Build Independent Verdict, Build Synthesis, Build Save Body and Format Markdown; pwAnswered, pwList, kvCharges, kvUni and Assume Check Build readers.)
- The child workflow ac517c41 and the alternate workflows: W4 checks for close-round copies at build.
WHAT RAN:
1. The Oracle can hold either seat. Init Seats sets each seat's profile to oracle or plain, and refuses two Oracle seats. TEXTPROOF is added only in the oracle branch of Init with Guards (line 36). In 41418 the Oracle held the defender seat.
2. Item 1 today: "Scriptures interlock (Isaiah 28:10) -- they do not compete, and setting verse against verse is itself drift." and "The scripture is the chain, precept upon precept (Isaiah 28:10): no one verse need state the contrary, and 'no verse states it' is never a ground, for either side." "restrict" has 0 hits.
3. Item 2 today:
   a. D4 Build computes "STILL UNANSWERED AGAINST YOUR CHAIN", which lists presses against the defender. It also says "This round defends: do not press new witnesses or premises against the challenger ... the judges do not count a press made here."
   b. C4 Build says "NO NEW PRESS ... Write NO premise list in this round ... and NO charge or grade against any defender link (D1..Dn): the system marks every such sentence DISREGARDED (ruling 377)."
   c. Neither close tells the Oracle to restate the questions it put that went unanswered.
IN SCOPE (nodes): Init with Guards (TEXTPROOF only), D4 Build and C4 Build (the close-round text only, under an oracle-profile test).
FOUND, NOT IN SCOPE: the computed "STILL UNANSWERED AGAINST YOUR CHAIN" list stays as it is; judge prompts get no text (ruling 383).

## 4. CHANGES
1. Init with Guards: append to the end of TEXTPROOF (623 characters added; TEXTPROOF 1,137 to 1,760):
   " ONE-VERSE RESTRICTION: when the opponent asks you to answer from one verse alone, or to grant or deny a link on a verse read apart from the rows your chain joins to it, do not accept the restriction and do not argue inside it. Name it in one line -- RESTRICTION: \"<the opponent's words, quoted verbatim>\" -- this limits the answer to less than the volume of the book (Isaiah 28:10, \"precept upon precept; line upon line\") -- then answer the pressed verse from the chain: quote it whole with the rows that join it, each tagged with its layer. A restriction named and not answered from the chain leaves the press unanswered."
2. D4 Build when `$('Init Seats').first().json.defender.profile==='oracle'`, and C4 Build when `.challenger.profile==='oracle'`: append to the close-round text (611 characters added; D4 close text 1,680 to 2,291; C4 close text 1,663 to 2,274):
   " GAPS LEFT OPEN: track every question you put to your opponent in your earlier rounds -- each premise you listed against the opponent's words, and each verse you pressed under it -- that no later round of the opponent answered. Restate each in one line: GAP: premise <n> [<the round that listed it>] -- <the verse you pressed, by book, chapter and verse> -- UNANSWERED. Write the line in exactly that form: no quotation and no other words. Name only premises your earlier rounds listed and verses your earlier rounds pressed under them; a gap restated here is not a new press. If none is left, write GAPS: NONE."
   A plain seat's text is unchanged.

## 5. CRITERIA and DONE
1. Only Init with Guards (TEXTPROOF), D4 Build and C4 Build change. Every other node is byte-equal to live.
2. Plain-profile prompts are byte-equal to live, for both seat assignments (synthetic build: Oracle defending, Oracle challenging, no Oracle).
3. The Oracle prompts carry the two texts exactly as in section 4.
4. GAP lines in the plan's form are not marked DISREGARDED (C4P.press, ruling 377) or NOT COUNTED (C4P.of, C4P.ofD). W4 10656 cases C8, C9 and D6 show 0 and 0. They do not turn a press against the defender to ANSWERED (pwAnswered, Library line 2128, which counts [CR4]), so long as the verse is one the Oracle pressed in an earlier round: a verse of the Oracle's own [CR3] is already named there, and on 41418 none of the 27 flips (W4 10654 and 10656). The build adds an offline check (W4 10656 option b) that, on a synthetic close, every GAP verse stands in an earlier Oracle round.
5. Record-only: no judge text changes (ruling 383); nothing counts a GAP or RESTRICTION line (ruling 428).
6. Label: ASK 537.
DONE: criteria 1 to 6 met on the synthetic build; the write's fetch-back matches the target; the readback seat confirms.

## 6. WRONG-IF
1. FALSE GAP: the Oracle restates as a GAP a press the opponent did answer in a later round. The GAP line is the Oracle's own claim, so a false GAP misleads a reader. Judges grade it as text, like any claim (ruling 383); nothing counts it (ruling 428). A run review compares each GAP line to the opponent's later rounds and names any false GAP.
2. The plan is wrong if a plain seat's prompt changes, or if the Oracle's close gains a new press under the GAP heading (a verse no earlier round of the Oracle pressed).
3. The plan is wrong if, in a run, a GAP line in [CR4] names a verse the Oracle never pressed. pwAnswered then counts it as an answer, and a press left unanswered against the Oracle becomes ANSWERED, in the Oracle's favour. W4 10656 case D7 shows this for all 4 verses still unanswered on 41418 (Matthew 1:23, Deuteronomy 22:24, Luke 3:38, Isaiah 7:13). The GAP text forbids such a verse, but no live code enforces it. So every run review checks each [CR4] GAP verse against the Oracle's earlier rounds and names any breach (W2 10655 item 4; W2 note 09:57). Nothing else marks a GAP line in the plan's form.
4. A GAP line that names a premise the Oracle never listed is a false GAP of the same kind as WRONG-IF 1.

## 7. RUN EVIDENCE
- 41418 (failed run for item 2): the Oracle's CR3 has 6 PRESSED WITH lines against the challenger's premises; its close CR4 (24,857 characters) has 40 ANSWER: lines and 0 lines restating any of the 6 ("unanswered": 0 hits). W2 checked this at 10650.
- 41418, the judges on the same gap (W1 10651, not rechecked by W3): sol 6.2 (judgment 1263) counted challenger premise 3 as unanswered; the other two judges counted none. A restated gap in the Oracle's close puts the gap in front of every judge.
- 41418 and item 1: no failure. The Oracle did it unprompted at CR2: "The question is answered by the chain, not by one verse stripped from it. I re-seat every pressed verse in its chain." The one-verse reading in that run was terra's, a judge's (Matthew 1:25 read apart from Matthew 1:24). Under the operator's rule of 23:19 CST 11-18, item 1 rests on his own order, not on a failed run; the card says so.
- Marks in the next run: "GAP: premise <n> [<round>] -- <verse> -- UNANSWERED" or "GAPS: NONE" lines in the Oracle's close; "RESTRICTION:" lines where an opponent restricts. Item 1 is NO PROBE: a restriction cannot be forced.

## 8. INPUTS IN GIT
- ask537/w3/live/Init_Seats.js (05a1e2f1), Init_with_Guards.js (df2cf466), D4_Build.js (38fb90e9), C4_Build.js (79a87ad0): the live node code as fetched from 48513907.
- ask537/w4/build/gap537.js (10bd606a), out_gap537.txt (2d69d270), pwa537.js (3444cc5b), out_pwa537.txt (9c99a6b1): W4's step 1 tests and rerun (Wall 10654, 10656), commit 6032e4a6.
- Run 41418: debate_results run_token ODV1-41418-isj5xh5m (SQL).

## 9. STEPS
1. DONE at Wall 10654 (W4): the marking code and readers were read and tested. W4 reran on the no-quote form at Wall 10656 (files at commit 6032e4a6).
2. W2 grades rev 3.
3. The coordinator sends the operator one card, with the note in section 1.
4. W4 builds against a fresh live readback, touched nodes only, and posts the synthetic build for criteria 1 to 5.
5. W2 grades the build. W4 writes on the operator's card. A non-builder seat reads it back.
