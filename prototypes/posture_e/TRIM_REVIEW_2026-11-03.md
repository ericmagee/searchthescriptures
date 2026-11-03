# Judge instructions: trim review (read-only), 2026-11-03

Reviewer: Worker_E, session_014Qy67bHv8uBmRXbWGSrghm. Private.
Source: Gemini's panel request in dry re-grade 32483 (flow 1a7c9979), read whole: system rulebook 63,582 chars; agreement turn 5,236; agreement reply 1,761; method header 1,108; rounds 113,312.
Baseline: the single-judge prompt of 26 July (workflow_snapshots id 12, "Build Independent Verdict", about 6,000 chars of instruction).
NOT READ: the cure requests (Panel Cure Build 1-3), the single judge's request, the alternate and reserve requests.

## Order the judge meets it
1. System: the rulebook (counting, verdict formula, checks). 63,582 chars.
2. Turn 1: the posture and Commitments 1-8, to accept.
3. Turn 3: the method (Isaiah 28:10), then the transcript.
So the mechanical rulebook is the first and largest thing the judge reads; the posture comes after it.

## A. Conflicts with Commitments 7 and 8 (judging, not counting)
A1. VERDICT DEFINITIONS: "apply these mechanically, first match wins; not your own scale." Against C7 "I judge; I do not only count."
A2. The RESULT line is computed, not judged: "HELD gives DEFENDER WINS only if CHALLENGE STANDING is not SELF-SUPPORTED or at least one collision is graded CHALLENGER LINK BROKEN. Every other case gives UNDERDETERMINED."
A3. Standings by formula: "COLLAPSED = by count, mandatory, not discretionary: 2c > L"; "A SIDE WITH A COUNTED LINK IS NOT SELF-SUPPORTED"; "Never choose a standing ... to agree with another line."
A4. Two rules for BROKEN in one block (COLLISION POINTS): the older rule, "Grade a link BROKEN when ... the broken side's later rounds left UNANSWERED ... Grade UNDERDETERMINED only when the side's later rounds answered every such witness", sits beside the forced-link rule (ruling 411) and C3/C7, under which a link fails by meaning even when answered. The older rule makes "answered" end the question. (Runs 32454, 32456, 32472, 32483: Gemini's and ChatGPT's retractions.)
A5. Answered = named: "ANSWERED when any later round ... quotes it or names it by reference and shows from the text why"; the ledger's NAMED / NOT NAMED stands in for that test.
A6. Concession by form: "A LINK ROUND answer that neither exhibits the premise's layer footing nor concedes counts as CONCEDED"; "A premise counts as CONCEDED only if the link round block itself states it ... or exhibits no layer footing."
A7. Removal by form: DEBATE RULE VIOLATION, "An answer that does not exhibit them leaves the violation standing, and your judgment is then not counted." Together with the cure's "only RETRACTED cures it" (not read here; seen in the cure audits), this is what removed GLM in 32454 and 32456.
A8. Chain marks "MUST NOT change" any count or the verdict: a judgment the judge makes and is told not to use.

## B. Said more than once
B1. FOOTING LAYERS defined twice in full (JUDGE LAYER RULES; DEBATE RULE VIOLATION).
B2. The retired stating-verse test refused about six times (layer rules; challenger clause; CONCEDED LINKS; CHALLENGER CONCEDED LINKS; COLLISION POINTS twice).
B3. "A press needs a premise / a verse under no PRESSED WITH is not a witness" (ruling 392) stated about nine times.
B4. Close-round concessions (ruling 412) stated in COUNTING RULE, WITHDRAWN, CONCEDED LINKS, CHALLENGER CONCEDED LINKS and OUT-OF-ROUND CONCESSIONS.
B5. "No single verse states it is never a ground" stated three times inside COLLISION POINTS.
B6. Commitment 8's text appears twice (agreement turn and the method header).

## C. System facts the judge needs (keep; some can be shorter)
C1. CITATION CHECK AGAINST THE KJV (189 chars). Keep.
C2. [L2] CHECK: 5,924 chars, mostly 121 COUNTED lines. Keep the head and the NOT COUNTED lines only.
C3. GLOSS CHECK: 2,139 + lines. Keep; tune: a single sense with a qualifier ("figuratively, to regenerate.") and two renderings ("be minded, intend.") are flagged TRIMMED.
C4. PRESSED-WITNESS LEDGER: keep the list of presses and their proof status; drop NAMED / NOT NAMED as the answer test (A5).
C5. CHALLENGER LINK NUMBERS: keep (labels).
C6. PRE-CHECK and UNIVERSAL TEST: keep for VOID rulings.
C7. CITATION CHECK, PER SEAT (served labels): keep.

## D. Output burden
Strict JSON with the whole reasoning escaped inside one string; nine fixed line types (RESULT, CLAUSE, KEYSTONE, two standings, two itemized counts, COLLISION POINTS, OUT-OF-ROUND CONCESSIONS) plus ANSWER CHECK, REFERENCE, FORCED and two chain marks. GLM's reply in 32471 was cut off at the end of that one string (the brace repair, approved, covers the symptom).

## E. Measured
July instruction about 6,000 chars; today about 71,700 chars (system 63,582 + agreement 5,236 + reply 1,761 + method 1,108), before cure requests.
