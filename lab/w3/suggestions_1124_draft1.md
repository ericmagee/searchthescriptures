# W3 suggestions for the lab, 11-24 (draft 1, for Wall 11662; not yet posted)
W3, seat 33, session_01H1X3ANsGiMnhnbkfphocmo. Each item names what was seen today and what is proposed. None is built; each needs its own ASK and the operator's approval.

1. A RUN-LIVE MARK IN THE DATABASE.
   - Seen: no manual write may run while a run is live, but a seat without n8n cannot tell. debate_results shows only a finished run. At 13:07 CST I had to ask W4, and run 42283 started nine minutes later.
   - Proposed: the engine writes one row at its start and closes it at its end (run token, start, end). A function answers "is a run live". The manual write function and the write scripts read it and refuse by themselves.

2. APPROVED WRITES THAT STOP AT AN UNSEEN PROMPT.
   - Seen: after the operator's "Write it" (13:04 CST) and his "Retry" (13:13 CST), the part 10 manual write met a database approval prompt twice and timed out in 60 seconds each time. Part 3 went through, so the manual is half written. The same happened to other seats on earlier days (team memory).
   - Proposed: find what triggers the prompt (the part 10 text holds the words "drop" and "dropped"; part 3 does not; this is a guess, not tested). Then either the operator's settings allow the named write functions, or one seat whose tool does not prompt is named as the writer of record for such calls.

3. ONE SOURCE FOR A SEAT'S MODEL AND FAMILY.
   - Seen: the same-model rule (ASK 601) reads models from three places: the Accept Models rows, model_config_jfl (active rows) and model_config (all rows). They agree today only (W1, Wall 11625, N2).
   - Proposed: one database view that the engine, the Judge order page and the alternate recorder all read.

4. A STANDING CHECK THAT THE COPIES OF THE SEAT RULES AGREE.
   - Seen: the drawing of judges lives in Init Seats, Resolve Seats, dash_judge_lineup and odv1_record_panel_alternates. ASK 601 kept them equal by a one-time test (T5).
   - Proposed: T5 becomes part of the standing set, run before every engine or function write, so a later change to one home cannot leave the page showing a line-up the engine will not seat.

5. MEASURE EVERY RUN'S JUDGING LOAD.
   - Seen: run 42234 died in judging with a possible out-of-memory fault; ASK 611 removed about 3.2 million characters of copies, but whether size caused the crash is not proven.
   - Proposed: the AAR of every run carries the measured sizes (rounds, judge request, close-enforcer requests) from W4's offline measure, so growth is seen before a crash, and run 42283 gives the first comparison.

6. A QUOTATION OF THE OPERATOR CARRIES ITS MESSAGE ID.
   - Seen: a sentence from a review inside a message was quoted as the operator's ruling for a day, in plans, grades and two AAR rows (corrected Wall 11624).
   - Proposed: an op doc rule: every "the operator said" in a plan, grade, manual log or AAR row carries the message id or ruling row; the grader fails it otherwise.

7. THE MANUAL ENTRY IS GRADED WITH THE BUILD.
   - Seen: for ASK 601 the manual entry was drafted after the write, so the AAR row says "manual not written" and needs a second row later.
   - Proposed: W3 drafts the manual pairs when the build passes; the write card names both; the manual is written right after the readback, before the next run; one AAR row.

OPEN QUESTION TO THE OPERATOR (asked 12:01 CST, not answered): my Wall post was stopped at 11:59 CST. Until he says otherwise I post nothing on the Wall, and my graded work goes by thread. This file is posted under Wall 11662 only on his word.
