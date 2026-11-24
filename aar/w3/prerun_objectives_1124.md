# PRE-RUN AAR OBJECTIVES for the next live run (draft 1)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST, on the coordinator's order. For W1's grade.

- LIVE NOW (W1 readback, Wall 11557): engine 6834c21b, child ecdc6218, LIB 47a39128fec62d31.
- No run has executed since run 42071 (debate_results last row 21:57 CST 2026-11-23). Every item below is live and UNEXERCISED.
- Each OBJECTIVE is the ASK's own, from its plan to done as its AAR row or its plan holds it. An objective is a brief expectation of what the ASK achieves; it is never a command from the operator.
- Each EXPECT is what the run's record shows if the objective is met. Items marked ONLY IF show nothing unless their case arises in the run; a run in which the case does not arise leaves that item UNEXERCISED, not met.
- Sources: ask_aar_snapshots rows 158 to 166 (objective and run_evidence, read by SQL); plan591.md d84a0dd3 section 3; notes594.md section 1; notes_j3.md 5b527f95; Wall 11543, 11552, 11556.

## 1. ASK 587: engine form fixes A to E (row 158)
OBJECTIVE: a judge is not sent back, counted or removed for a defect of the engine's own making, and a judge's RESULT is not raised to a challenger win past a counted challenger break. A real fault of the same kind is still raised.
EXPECT:
- A (always): every flagged_line over 1,500 characters in debate_enforcer_log is the judge's whole line; no E-COL send-back reads "no deciding step" on a line that carries "-- WHY IT FAILS:"; no E-COL item for a line ending " [...]".
- B (ONLY IF a judge answers KEEP quoting the answering side's own sentence): the item is CURED with "quotes the answer".
- C1 (ONLY IF a judge writes no "D<k> vs C" line): no KEYSTONE item "names no collision line of D<k>".
- C2 (ONLY IF a second reading carries the first reading's grade): the E-REREAD row reads RECORD-ONLY.
- D (ONLY IF an AUDIT v25 line holds "counted as one CHALLENGER LINK BROKEN"): its RECOMPUTED RESULT is not CHALLENGER WINS, and the seat's last AUDIT v61 WORD is not CHALLENGER WINS.
- E (always): removed_rules holds no "UNREAD COUNTED LINE" from a SEND-BACK ITEM line.

## 2. ASK 588 with D7 and 588 R: the question round (row 159)
OBJECTIVE: before they judge, the judges put their questions to the debaters and the debaters answer, on every fresh live run; every judge who decides reads the same questions and answers; a fault in the round never stops the run. A judge may ask one continuation of another judge's question and keeps its own.
EXPECT (always, on a fresh run):
- one row in odv1_question_round_log for the run_token, status RAN, or SKIPPED with its reason;
- every judge request carries the question block before the transcript;
- both answer routes ran (the OpenRouter route and the Anthropic route), each answer with its finish;
- continuations, if any, are numbered Q7 and after, and none continues the asking judge's own question;
- no judge is sent back for quoting a round; an answer is never counted as a round.
NOT EXPECTED: a "[QUESTION ROUND v1" line in review_notes (it never writes).

## 3. ASK 590: one closing check (row 161)
OBJECTIVE: the closing-round anti-cheat check is merged into the closing enforcer's two reads, with the send-back, live on every run.
EXPECT:
- (always) no Anticheat node executes; no judge request holds "[ANTI-CHEAT CHECK]";
- (ONLY IF the close holds a candidate) debate_enforcer_log holds E-CLOSECON rows answered CONFIRMED, REVERSED READING or NOT A CONTRADICTION;
- (ONLY IF a REVERSED READING is found) the judges read it under "[REVERSED CLOSE SENTENCES]"; a judge line that quotes it gets one E-REVCLOSE item, sent once, counted against no seat.

## 4. ASK 593: Haiku out (row 160)
OBJECTIVE: Haiku is removed from the debate engine in full: no panel judge, no alternate, no debater, and not offered by the dashboard.
EXPECT (always): no seat list of the run (Init Seats, Accept Build) names haiku; no judgment row and no enforcer row names a haiku model.

## 5. ASK 595 and its follow-on: no one's words cut (rows 162, 165)
OBJECTIVE: no judge line is cut in the E-REVCLOSE item; a DROPPED question-round reply, the reversed close quotations (judges' prompt and send-back) and the MEANS block of the K-ML check are whole.
EXPECT:
- (ONLY IF an E-REVCLOSE item stands on a judge line over 1,500 characters) flagged_line and response_line equal the judge's whole line;
- (ONLY IF a question or continuation is DROPPED) its row in odv1_question_round_log holds the judge's reply whole;
- (ONLY IF a reversed close sentence is over 500 characters) it stands whole in the judges' prompt and in the send-back;
- (ONLY IF a MEANS block runs past 1,500 characters) no K-ML item is raised for a word that an [L2] or [L3] past that point carries. K-ML is TRIAL and list only; it moves no count.

## 6. ASK 594: the reserve recorder accepts qwen4max (no AAR row yet)
OBJECTIVE: a run whose panel or reserve includes qwen4max can use the one judge substitution.
EXPECT (ONLY IF a panel seat fails and qwen4max is the failed seat or the reserve): the substitution is recorded and the reserve is seated; the run does not stop at the recorder.

## 7. ASK 586 J1: the keystone must break (row 163)
OBJECTIVE: a judge's RESULT against the defender requires that judge's own KEYSTONE line to read BROKEN; a BROKEN verdict beside a keystone that STANDS gives UNDERDETERMINED, whichever side the Oracle sits on.
EXPECT:
- (always) no stored judgment holds a seat's word CHALLENGER WINS beside KEYSTONE STANDS;
- (ONLY IF a judge writes a break beside KEYSTONE STANDS) that seat's word is UNDERDETERMINED and the record names the rule "KEYSTONE STANDS (the keystone link is not broken; ASK 586 J1 ...)"; the break still counts as a broken link.

## 8. ASK 586 J6: a DISAGREE answers every verse on the judge's GROUND (row 164)
OBJECTIVE: an enforcer DISAGREE reaches a judge only when it answers every verse on that judge's GROUND line.
EXPECT:
- (ONLY IF a DISAGREE leaves a GROUND verse unanswered) a debate_enforcer_log row reads "RECORDED, NOT SENT BACK, ASK 586 J6: the enforcer's DISAGREE does not answer ..."; that judge gets no send-back for it; no seat count moves;
- (always) a DISAGREE that answers every GROUND verse is sent back as before.

## 9. ASK 586 J2: the [L2] entry quotes a side's gloss (row 166)
OBJECTIVE: when a judge's break turns on a word's meaning, the [L2] entry quotes the gloss as a side gave it in the rounds, word for word, with its round; a faulty entry goes back once; the judge keeps the decision.
EXPECT:
- (always) the judges' request holds the form `[L2] <word> (<Strong's number>): "<gloss>" [<round>]`;
- (ONLY IF a break line names a Strong's number in an [L2] entry) the entry is in the new form, or one E-L2G row is written with the judge's whole line and "record-only, counts against no seat"; no seat count moves by it;
- MEASURE: how many break lines go back for E-L2G (on stored run 42071 it would have been 11 of 13 under the old judges' text).
LIMIT TO READ FOR: the send-back builders stop before this check on a pass with no enforcer item.

## 10. ASK 586 J3: a break that says a side granted something names the grant (no AAR row yet)
OBJECTIVE: a judge's break line that says a side granted, conceded, dropped or withdrew something names the grant by its number from THE GRANTS LISTS, or says NOT A LISTED GRANT and quotes the side's words with their round; the judge keeps the decision.
EXPECT:
- (always) each judge request holds THE GRANTS LISTS block once, above the COLLISION POINTS instructions, with both sides' lists or "none", and no sentence cut;
- (ONLY IF a break line uses a grant word) it names a G number of that side's list or NOT A LISTED GRANT, or one E-GRT row is written with the judge's whole line and "record-only, counts against no seat"; no seat count moves by it;
- MEASURE: how many break lines go back for E-GRT (on stored run 42071: 2 of 13), and whether any goes back for a grant word used of something other than a grant.
LIMIT TO READ FOR: the same send-back stop as J2.

## 11. ASK 591 and its fix 1: the judge order comes from the table (no AAR row yet)
OBJECTIVE: the operator puts the panel judges and the alternates in order on the dashboard page and saves; the next run seats judges in that order; no model edits engine code to change it. The single judge is not shown or computed (fix 1).
EXPECT (always):
- the node Judge Order Read executes at the run's start, before Accept Models;
- review_notes holds one line "[JUDGE ORDER v<n>: panel list ...; alternates list ... | SEATED: panel ...; reserve ...; alternates ...]" with no "single judge" in it;
- the seats the run seats equal the line-up the dashboard page showed for that pair of debaters before the launch (v<n> is the version saved on the page);
- (ONLY IF the read fails) the run stops at the read with its message, before any model call.

## 12. WHAT THIS RUN CANNOT SHOW
- ASK 596 (the standing test set) and ASK 599 (the coding standard) are not run features.
- ASK 597 and ASK 598 are approved and not yet built.

## 13. FOR W1
1. The EXPECT lines of items 6, 10 and 11 are my reading of W4's notes and Wall posts (no AAR row holds them yet). Check them against the live code.
2. Items 1 to 5 and 7 to 9 repeat the run_evidence of their AAR rows; where I shortened a line, the row governs.
3. After your grade the coordinator carries this sheet into the run's AAR; each line is then answered met, not met or UNEXERCISED with the evidence.
