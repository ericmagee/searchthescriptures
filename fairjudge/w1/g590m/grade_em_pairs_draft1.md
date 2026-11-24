# W1 grade: engine manual pairs for ASK 590, 595, 586 J1 and J6, draft 1

GRADE: PASS with F1 to F4. em_pairs_590_595_586_draft1.json fdf336ce, commit 5b340440.
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: the body law (the manual holds only what the engine does); ASK 590, 595, 586 J1 and J6 as written; rulings 427, 428; scope rule.
OBJECTIVE MET: yes, once F1 to F3 are applied.
STANDARD (ASK 599): manual text, no code.

## Checks run
- Old texts on the current parts (manual v287): each of the ten occurs exactly once (09.2 v279 x3, 09.5 v257, 09.8 v269, 09.3 v242, 04.0 v284, 09.1 v267, 08.0 v266 x2).
- Against live engine 04273989 and child c9acb53a (my fetch, the readback of Wall 11485). Found in the code, after allowing for escaped quotes: every quoted engine text in the pairs; the statuses REVERSED, REVERSED (second check), NOT REVERSED (form), NOT REVERSED (other side's words), NOT REVERSED (one check of two) and REVERSED (CONFIRMED stands); the "STATUS -- reason" filing (log() in Close Enforcer Record); the 120000 cap and rev_not_checked; C.reversed under cec; the E-REVCLOSE item with flagged_line and response_line both __h.line, whole; the J6 instruction texts and the held reason "RECORDED, NOT SENT BACK, ASK 586 J6: the enforcer's DISAGREE does not answer ..."; the J1 judges' text in Panel Build and Build Independent Verdict; and "KEYSTONE STANDS (the keystone link is not broken; ASK 586 J1 ...)".
- Connections on live: Close Enforcer Build goes to Assume Check Build; Close Enforcer Record goes to Regrade After Quotes?; Regrade After Quotes? (true) goes to Panel Build; Check Save (true) goes to Panel Build. No connection leads into any Anticheat node.
- J1: the result is decided in one function, rd386, which is called in 3 places, and each call passes key: P.key.raw. Inside rd386 the word moves only when CHALLENGER WINS meets ks586(key) === 'STANDS'.
- Not re-measured by W1: the read sizes (55,000 to 190,000 characters). The J1 counts (149 / 56 / 32 runs) agree with my J1 grade, Wall 11467.

## Findings
F1. 09.2 says: No node, child or library text holds "ANTI-CHEAT CHECK". This is FALSE. Panel Build and Build Independent Verdict still hold `[ANTI-CHEAT CHECK -- computed by the system's enforcer, not by a judge (a TRIAL check) ...` in __ACX. That block writes nothing, because it returns '' unless $('Anticheat Record').isExecuted, and Anticheat Record is never reached. Say that instead. This is the same block W4 asks about on Wall 11487 (r.close_q and r.earlier_q cut to 400).

F2. 09.2 says: (dfl_counted counts CONFIRMED only). The name dfl_counted stands in no node, no library line and no manual part. What the code does: the confirmed list takes only rows whose status begins CONFIRMED, so a REVERSED row is never in it. Write that instead.

F3. Part 09.6 now says the opposite of live and needs a pair. Its line "on a run that reaches Anticheat Resume by the regrade path (Close Enforcer Record > Regrade After Quotes?)" is wrong now, because Regrade After Quotes? (true) leads to Panel Build. Also, the 09.5 pair says "the same sentence stands", but the old note reads "this note by itself breaks no link" and the new block reads "this by itself breaks no link". Quote the new sentence or say "the like sentence".

F4. 08.0 (J1). The sentence asked about is correct: a KEYSTONE line that reads BROKEN or WITHDRAWN, or that cannot be read, moves no word. It is not complete. ks586 also reads UNDERDETERMINED, and it accepts an em dash, an en dash, a single dash or a colon in place of "--". Better: "A KEYSTONE line that reads any word but STANDS, or that the reader cannot read, moves no word."

Note. The 09.2 sentences "cut to 500 characters" and "cut to 400 characters" are right on 04273989. If W4's 595 follow-on (Wall 11487) is written, its manual pair must replace them.
Other parts that name the anti-cheat nodes (08.0, 09.7, 17.0, 17.1) describe nodes that still stand, or are history. They hold until ASK 598 removes the nodes.
