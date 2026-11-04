# Debate court: evidence rules and cross-examination. Worker_E, session_014Qy67bHv8uBmRXbWGSrghm, 2026-11-03. DRAFT, not built.
Order (operator, 3 Nov 16:2x CST): "threat the debate platform like a courtroom. Evidence here has to be handled the same as a court room ... Structure forces compliance." Four fixes before anything else.
Rulings applied: 30 ("1 Law for everyone in the courtroom.. no exceptions"), 370 (enforcers at all failure points), 371 (a written response wherever an enforcer steps in), 366 (DeepSeek is the enforcer), 405 (Commitment 3, meaning), 342 and DG-61 (no single-verse ruler), the TRIAL-then-LIVE status table (a new check enters TRIAL and becomes LIVE only after it proves itself on stored text).

## F1. Evidence objections (fixes 1, 3 and 4)
After every debater round of both sides (D1..D4, C1..C4, and the cross-examination answers), the enforcer seat reads that round and the verse sheet (the KJV text of every cited verse, fetched by code) and lists objections of three kinds only (enforcer_prompt.txt):
- NOT IN EVIDENCE: a fact stated as the text's that no verse on the sheet carries ("Two lines run to David, one through Joseph's legal line and one through the flesh"; Mary of the house of David).
- MISSTATES THE EVIDENCE: a verse cited for what its words do not say (Romans 1:3 cited for flesh "through the mother").
- ASSUMES ITS CONCLUSION: a step that holds only if the side's answer is already true ("Davidic flesh came to Jesus through the woman" holds only if there was no father).
Never an objection: that no single verse states a link (DG-61).
Code checks every objection line before it counts: the STATEMENT must be the round's own sentence verbatim; the EVIDENCE quotation must match the sheet's KJV text. A line failing either is dropped and logged.
Written response (ruling 371): the objected side's next round opens with RESPONSES TO OBJECTIONS, one line each: WITHDRAWN, or SHOWN: <book chapter:verse> "<the words that carry it>". No line, or a SHOWN whose quotation the citation check does not find, counts as WITHDRAWN.
Ruling: each judge writes one OBJECTION line per surviving objection, SUSTAINED or OVERRULED with the verse words. A WITHDRAWN or SUSTAINED statement is struck: no weight, and a declared link resting on it is CONCEDED (the penalty).
Close rounds (fix 4): an objection to a round-4 statement has no later round to answer it; it goes straight to the judges' ruling, and if SUSTAINED the link it serves is CONCEDED.
Status: TRIAL first (marks written and ruled, no seat removed), LIVE after the stored-text test passes.

## F2. Cross-examination, both ways (operator: "I recommend longer examination"; ruling 418: "cross examination should run both ways.. if not someone can launch a lie that's never discredited")
A new phase between round 2 and round 3: three exchanges each way, alternating, the challenger first (XC1, XD1, XC2, XD2, XC3, XD3).
- The asking side: up to 5 questions per exchange, each closed, naming a declared link (D<n> or C<n>) and a verse, e.g. "Which verse states that Mary is of the house of David?"
- The answering side: one ANSWER line per question, beginning YES, NO or THE TEXT DOES NOT SAY, then the verse quoted exactly. An answer to a question of fact with no verse quoted counts as THE TEXT DOES NOT SAY.
- An admission (THE TEXT DOES NOT SAY) about the answerer's own link's fact is listed by code in that side's withdrawal list; the judges grade the link without that fact (S2, S3). An admission about the conclusion of a footed [L4] costs nothing (DG-61).
- The enforcer (F1) runs on each answer turn.
Cost: 12 debater calls and 6 enforcer calls per debate.

## Grading, not instruction (ruling 417: "we can't tell someone when to concede... that's their strategy ... We need to ensure lies don't reap rewards")
No seat is told when to concede. The judges grade every link of both seats by what its scripture carries, whatever the seat answers: a link that cannot agree with the meaning of the scripture pressed against it is BROKEN (ruling 405); a step naming a person, house, time or act no quoted row names is unexhibited and counts as CONCEDED (ruling 397).

## Test on stored text before any live write
Run the enforcer on the eight rounds of 32510 (rounds.json, sheet.json; 8 DeepSeek calls). Pass bar, fixed before the run:
1. It objects to D2 "Two lines run to David ..." (NOT IN EVIDENCE).
2. It objects to D1 or D4's flesh "through the mother / woman" on Romans 1:3 (MISSTATES or ASSUMES ITS CONCLUSION).
3. Every STATEMENT and EVIDENCE line passes the code checks, or the failures are counted.
4. False objections on the challenger's rounds are counted and read one by one; an objection to C1's or C4's declared [L4] "Joseph knew Mary his wife within the espousal" as NOT IN EVIDENCE is a failure of the instruction (it is a built inference, DG-61).
BLOCKED: creating the test workflow was refused by the permission classifier (3 Nov 16:3x CST). Not retried (tandem 4(d)).
