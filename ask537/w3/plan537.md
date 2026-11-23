# ASK 537 PLAN rev 1 (W3, seat 33): Oracle prompt text for the one-verse restriction and for gaps left open at the close

Authority: operator 09:44 CST 11-23 (Wall 10635) items 1 and 2; ruling at Wall 10643 (item 2 is an Oracle instruction). Coordinator folded both into ASK 537. This plan authorizes nothing.

## OBJECTIVE
1. When the opponent restricts an answer to one verse, the Oracle names the restriction, states the complaint and answers the pressed verse from the chain.
2. In its close, the Oracle restates every question it put to the opponent that went unanswered.
Expected effect: the gaps on the opponent's side stand in the record in the Oracle's last round, and a one-verse restriction is named, not argued inside.

## WHAT RAN (live engine moMxiV4Irg1uRBZN, version 48513907, read 11-23 by n8n get_workflow_details; run 41418 by SQL on debate_results)
1. The Oracle can hold either seat. Init Seats sets `defender.profile` and `challenger.profile` to `oracle` or `plain` and refuses two Oracle seats. Only the `oracle` branch of Init with Guards (line 36) adds TEXTPROOF. In run 41418 the Oracle held the defender seat.
2. Item 1 text today (Init with Guards): "Scriptures interlock (Isaiah 28:10) -- they do not compete, and setting verse against verse is itself drift." and "The scripture is the chain, precept upon precept (Isaiah 28:10): no one verse need state the contrary, and 'no verse states it' is never a ground, for either side." No line names a restriction or a complaint ("restrict": 0 hits).
3. Item 2 text today:
   a. D4 Build (the defender's close) computes "STILL UNANSWERED AGAINST YOUR CHAIN" (presses against the defender) and says "This round defends: do not press new witnesses or premises against the challenger, who has no round to answer them; the judges do not count a press made here."
   b. C4 Build (the challenger's close) says "NO NEW PRESS ... Write NO premise list in this round (no UNSUPPORTED-L4 PREMISES section, no numbered charges against the defender's words, no PRESSED WITH: line) and NO charge or grade against any defender link (D1..Dn): the system marks every such sentence DISREGARDED (ruling 377)."
   c. Neither close tells the Oracle to restate the questions it put that went unanswered.
4. Run 41418 (ODV1-41418-isj5xh5m):
   a. Item 2: the Oracle's round 3 (CR3) has a CHALLENGER'S UNSUPPORTED-L4 PREMISES list with 6 PRESSED WITH lines. Its close (CR4, 24,857 characters) has 40 ANSWER: lines for its own chain and 0 lines restating any of those 6 presses ("unanswered": 0 hits).
   b. Item 1: the Oracle already did it unprompted at CR2: "The question is answered by the chain, not by one verse stripped from it. I re-seat every pressed verse in its chain." The one-verse reading in 41418 was a judge's (terra read Matthew 1:25 apart from Matthew 1:24). So 41418 is not a failed run for the Oracle on item 1; the operator's order is the authority for it (operator rule 23:19 CST 11-18 asks for a failed run; the card must say this).

## CHANGES (text only; touched nodes only; no model settings)
1. Init with Guards, Oracle branch only: append to the end of TEXTPROOF (used only in the line 36 `oracle` return):
   " ONE-VERSE RESTRICTION: when the opponent asks you to answer from one verse alone, or to grant or deny a link on a verse read apart from the rows your chain joins to it, do not accept the restriction and do not argue inside it. Name it in one line -- RESTRICTION: \"<the opponent's words, quoted verbatim>\" -- this limits the answer to less than the volume of the book (Isaiah 28:10, \"precept upon precept; line upon line\") -- then answer the pressed verse from the chain: quote it whole with the rows that join it, each tagged with its layer. A restriction named and not answered from the chain leaves the press unanswered."
2. D4 Build and C4 Build: when the seat that closes is the Oracle (`$('Init Seats').first().json.defender.profile==='oracle'` in D4; `.challenger.profile==='oracle'` in C4), append to the close-round text:
   " GAPS LEFT OPEN: track every question you put to your opponent in your earlier rounds -- each premise you listed against the opponent's words and each verse under its PRESSED WITH line -- that no later round of the opponent answered. Restate each in one line: GAP: <the premise number and the opponent's words, quoted verbatim from your earlier round> -- <the verse you pressed, by book, chapter and verse> -- UNANSWERED. A gap restated here is not a new press: name only premises and verses your earlier rounds already pressed. If none is left, write GAPS: NONE."
   For a plain seat the text is unchanged.

## OPEN QUESTION FOR THE BUILDER (W4) BEFORE THE BUILD
1. C4 (Oracle as challenger): does the ruling 377 DISREGARDED marker, or the new-press NOT COUNTED marker, fire on a GAP line? It quotes the defender's words and names a verse already cited. Name the node and pattern that marks it, and test GAP lines against it. If it fires, the plan needs a ruling-377 decision before C4 is built; D4 can go alone.
2. Does any reader (premise list parser, PRESSED WITH reader) pick up a GAP line in D4 as a new press?

## CRITERIA
1. Only Init with Guards (TEXTPROOF), D4 Build and C4 Build change; every other node is byte-equal to live.
2. The plain-profile prompts for both seats are byte-equal to live (synthetic build with each seat assignment).
3. The Oracle prompts carry the two texts exactly as above.
4. GAP lines are not marked DISREGARDED, NOT COUNTED or as a new press (W4 open question).
5. Record-only: no judge text changes (ruling 383); nothing counts a GAP line (ruling 428).
6. Label: ASK 537.

## CONFLICTS
1. Ruling 383: none. Both are Oracle text; judges grade the text alone.
2. Ruling 377: possible in C4; see the open question.
3. ASK 374 (both sides): the GAP text applies to whichever seat the Oracle holds.
4. Operator rule 23:19 11-18: item 2 has failed-run evidence (41418, 6 presses, 0 restated); item 1 has none in 41418.
5. Single verse ban: the restriction text quotes Isaiah 28:10 as the rule it applies, not as a doctrine proof.
