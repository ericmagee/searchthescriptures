# THE LAST EIGHT DAYS OF ASKs: SAME FIXES AGAIN, OR NEW WORK? Draft 1

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade (Wall 11588). The operator's question: "are we fixing the same changes over and over, or are these new changes that we are resolving? ... Is there a pattern?"

## 0. THE ANSWER FIRST

1. Mostly new work, by number. Of the 260 ASKs of the eight days I can name 41, about one in six, that are a fix, a correction or a further step of an earlier ASK of the same eight days. This is a floor: I counted from titles and first Wall posts, not from every plan.
2. But the follow-ups are not spread evenly. They sit in a few chains, and the chains show three patterns (section 3). In those places the answer to "the same thing again" is YES.
3. The larger pattern is not repetition. It is that changes are written faster than runs prove them. Of the 87 ASKs that have a record row, 18 have their objective met; 41 are "in part" and 26 "not yet", in most cases because no run has shown them (section 2).

## 1. WHAT I READ, AND WHAT I DID NOT

1. READ BY SQL: ask_aar_snapshots, all 138 rows (ids 3 to 170; ASK 481 to 602; 87 distinct ASKs): ask, rev, title, objective_met, prior_row, owner, date. For the 173 ASK numbers of the window with no record row (343 to 480, and 35 numbers between 481 and 602), the first 150 to 170 characters of the first Wall post that names each.
2. THE WINDOW: by the first Wall post naming each number, ASK 343 to 602 first appear 2026-11-16 to 2026-11-24: 7 on 11-16, 48 on 11-17, 55 on 11-18, 54 on 11-19, 10 on 11-20, none on 11-21 or 11-22, 73 on 11-23, 13 on 11-24. Total 260.
3. NOT READ: the plans, the builds and the grades of each ASK; the operator's words that began each. So "new" and "follow-up" below are MY READING OF TITLES AND FIRST POSTS, except where a record row names the earlier ASK itself (marked ROW).
4. THE RECORD HAS A HOLE: the ASK record table begins at ASK 481 (11-19). ASK 343 to 480 have no record row, so for the first three days there is no stated objective and no "objective met" to count.

## 2. THE COUNT (the 87 ASKs with a record row, latest row of each)

Objective met: yes 18; in part 41; not yet 26; no 2 (ASK 526 and ASK 541). 45 of the 138 rows are revisions of an earlier row (prior_row set).

## 3. THE CHAINS (each arrow is "then")

A. ONE CHECK TAUGHT A MODEL'S WORDING ONE FORM AT A TIME. The checks read free text that judges and debaters write, and each new way of writing a thing needed its own ASK.
- The layer check (LAY): 346, 365, 397, 559 and 560, 561, 562, 566 and 567, 581. Titles: "absence-only blocks not excused by LAY", "C1B runs LAY on DR1", "Against D1 style heads open LAY blocks", "LAY reads tag positions and the Oracle close ANSWER blocks", "LAY reads five more layer tag forms".
- The UNEXHIBITED check (K-UNX): 520, 536, 542, 545. ROW: 542's title names "the ASK 520 exemption".
- The [L2] gloss check: 382, 383, 431, 436, 438, 533, then 586 J2.
- The keystone and its retracted line: 402, 470, 552, then 586 J1.
- The shared line reader: 394, 395, 573.
Reading: the same KIND of fault many times, not the same fault. 23 follow-ups.

B. ONE FACT KEPT IN SEVERAL PLACES, CHANGED IN ONE.
- The judge line-up: 407 (seats added 11-18), 437 (the same seats taken out, the same day), 486 (haiku last), 487 and 503 (ROW-less; the Wall calls 503 "the ASK 487 correction"), 593 (haiku out in full), 594 (the reserve recorder's own seat list lacked qwen4max), 591 (the order moved to one table) with fix 1 and fix 2, 602, 601.
- The cut of a judge's line: 587 item A made the stored line whole; 590 added a new 1,500-character cut; 595 removed it; the 595 follow-on removed the rest of that kind; 597 is the plan to leave one handler. ROW: 595's title says "the 1,500-character cut added by ASK 590 removed".
- Engine calls on the public key: 494, 499, 502: the same move made for the save nodes, then the panel reply nodes, then the record and early alternate calls.
- DeepSeek taken out: 455, 458, 459, 460, 461, 478, 480: found again in another node or workflow each time.
- A counted send-back and its record rows: 531, 541 (objective met: no), 546 ("541 fix A"), 549 (rework).
Reading: HERE THE ANSWER IS YES, the same fix again, because the first fix reached one copy. 18 follow-ups.

C. A RULE OF THE TEAM'S OWN WORK CORRECTED AFTER IT WAS SET.
- The record row's grade count: 498 (two non-builder grades), 521 (one). ROW: 521 follows 498.
- Sight 1822: 511, 512, 514 (revisions 7, 8, 9 in one day).
- The Wall and write rules of 11-18 and 11-19: 412 to 425, 441 to 453, 462 to 469: many small rules, each its own ASK.

D. NEW WORK, NOT REPEATS (by title): the database access audit (481, 483, 489, 491, 492); the judges' reasoning rules (504 to 510, 513, 515 to 519, 523 to 527, 530, 532, 534); the Oracle's text (537, 557 and 558, 563, 564); one copy of code in the Shared Library (424, 476, 539, 570 to 581); the question round (588); the manual in parts (582, 583); Sol 6.2 as a debater (584).

## 4. THE ROOT CAUSES, AS FAR AS THE RECORD SHOWS (items 1 and 2 are read from the chains; item 3 is my inference)

1. Lists and limits typed into several nodes. Chain B. The team already carries the remedy: ASK 596 (one standing test set of every earlier fix), 597 (one handler), 598 (dead nodes out), 599 (the coding standard, approved), 591 (one table for the order).
2. Checks that read free text by pattern. Chain A. No ASK yet addresses this as a class; each form is still met one at a time.
3. INFERENCE: few runs against many changes. 260 ASKs first appear in the window, and the record shows 18 of 87 with the objective met. A fault that a run would show is instead found by the next ASK. The record row of ASK 596 on the Wall gives one case in its own words: "ASK 590 passed its 66 tests and brought back" the cut.

## 5. WHAT I CANNOT SAY FROM THE RECORD

1. Whether any of the 219 ASKs I read as new repeats an ASK from before 11-16.
2. How many ASKs of 343 to 480 met their objective: no record row exists for them.
3. Which chains the operator himself asked for step by step, and which the team split.
