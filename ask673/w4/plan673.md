# ASK 673 PLAN rev 2 (W4; rev 1 498e6052 failed C3 only, W1 Wall 12779; rev 0 0d78c2e1 PASS WITH C1 TO C3, Wall 12777): a send-back reply written as a whole new judgment is not lost

## ROLES
W4 builds and writes. W1 grades the plan and build and reads back the write. W3 drafts the manual entry and the AAR row. Eric chooses A, B or C.

## OBJECTIVE
When a seat answers its send-back with a whole new judgment instead of SENDBACK lines, the record and the operator see what it said (verdict, WHICH HOLDS, RESULT), and the seat gets one chance to answer in the required form. The judge keeps the decision (ruling 428); no reading of the seat is made for it.

## FINDINGS FROM SEARCH (live engine 66ba992d; run 43103)
1. Sol's send-back reply (debate_enforcer_log 55101, 31,712 chars) is a full JSON judgment: verdict_tag HELD, "WHICH HOLDS: DEFENDER", "RESULT: UNDERDETERMINED", D4 and D6 no longer broken. It holds no "SENDBACK: Sn" and no "Sn RESPONSE:" line.
2. The send-back reader (Shared Library, SENDBACK line and ASK 527 RESPONSE reader) found no answer, marked S9 to S24 "WRITTEN, NOT READ" / "SEND-BACK NO ANSWER", kept the first verdict (BROKEN) and the seat was removed with 23 uncured.
3. What preceded the reversal (W1 C2; counted by SQL 11:57 CST): the send-back prompt to sol (55101, 65,631 chars) carried 8 enforcer marks "(right: X)", 5 of them "(right: STANDS)", the rest MEETS or MISSES. Sol reversed to HELD after those marks. Under B or C the reply that would be read was made after the enforcer named the mark it held right; whether that sits with ruling 428 is Eric's call. THE CARD STATES THIS beside options B and C.
4. Nothing in the row, the review notes or the removal reason says that Sol's second reply held for the Oracle. Only the raw full_reply shows it.

## CHANGES (options; Eric chooses)
A. Record only. The reader detects a reply that carries a verdict_tag and WHICH HOLDS but no SENDBACK or RESPONSE line, and writes one review line and one removal-reason line: "SEND-BACK REPLY WAS A WHOLE JUDGMENT (verdict <tag>, WHICH HOLDS <side>); not read for cures". Nothing counted changes. No model call.
B. A plus one format re-send. On that detection only, the seat is sent its own items once more with one added line quoting the required form ("Answer each item with SENDBACK: Sn || KEEP || why, or SENDBACK: Sn || CHANGE TO: <line> || why"). Its answer is read by the existing reader. One extra call per such seat (about $0.30 to $0.60 for a Sol-size prompt; measured in the build).
C. Read the whole new judgment as the seat's judgment. This changes what counts and is a rule change; listed only because Eric may want it.
Recommendation: B. It keeps the format rule and ruling 428, and stops a reversal from vanishing.

## NOT IN SCOPE
ASK 672. The pkgPS rule. Any prompt or rubric line beyond the one format line in B.

## CRITERIA
C1. Replay of the reader on 55101: detection fires; the line quotes verdict HELD and WHICH HOLDS DEFENDER from the reply.
C2. Replay on the last 10 runs' send-back replies: detection fires only on replies with no SENDBACK/RESPONSE line and a verdict field; count stated.
C3. (B) the re-send fires at most once per seat per pass and never on a delivery failure path (those keep ASK 611 retry rules). If the re-send is answered by a whole judgment again, the A line is written and nothing more is sent. The replay includes a planted case: a re-send answered by a whole judgment again (the 55101 reply reused as the re-send answer) must give the A line and no second re-send.
C4. Library Check pair passes; header sha matches (library header rule).

## WRONG-IF
Detection fires on a normal reply that also restates its verdict (C2 checks). The re-send line says what a verse means or which side holds (it must not).

## RUN EVIDENCE
43103: Wall 12772 items 5 and 8; enforcer log 55101 to 55125.

## STEPS
1. W1 grades the plan. 2. Eric chooses A, B or C on a card. 3. Build offline from a fresh live fetch; replays; W1 grades. 4. Write card; write on press; fetch-back, audit, Wall, W1 readback. 5. First live run shows the line (and the re-send under B) when it arises.

## INPUTS IN GIT
The plan, the 55101 reply and prompt (as stored), the replay script and its outputs over the last 10 runs' send-back replies are saved under ask673/w4/inputs/ with md5s and committed to branch claude/untitled-9jle0o before the build is graded; commit id posted on the Wall.

## DONE
Eric's choice recorded; written on his press; W1 readback MATCH; the first live run where a whole-judgment reply occurs shows the line (and under B the one re-send and its reading); manual entry and AAR row by W3.
