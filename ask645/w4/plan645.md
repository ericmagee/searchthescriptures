# ASK 645 PLAN (W4), rev 0: a follow-up that names the whole question is dropped

Source: W4 Wall 12025 (cause and fix); the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ee4e389d. Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a token limit, a prompt, or what a judge or debater is sent. The tighter form (open words only from the passage) changes ruling 515's wording and is Eric's; it is not planned here.

## 1. OBJECTIVE
In 42528 (odv1_question_round_log id 5) judge sol62's follow-up to the challenger named Q2 with open = "How does this passage fit Acts 2:30?". That is the whole of Q2's question, which the program wrote (the FIT form). The engine passed it, so Q9 asked the same question again as a paid answer call.
- qfCheck accepts the open words when they stand word for word in "question + quote + earlier_quote". Ruling 515 allows words "of that question or its passage that the answer left open", and the judge is told to give the words "that the answer left unanswered" ("Please explain that part"). The check tests that the words are found, not that they are a part.
Change: qfCheck adds one fault when the normalized open words equal the normalized whole question: "the open words are the whole of Q<n>; a follow-up names the part its answer left open". A faulted follow-up is DROPPED and recorded with its reply, as every faulted follow-up is today.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: the one statement in qfCheck, in each of its three copies: QR Merge, QR Follow Build and QR Follow Final. Each copy gets the same new text, so the three stay one text. After the found test:
`else if(x&&o===qrNorm(x.question))fl.push('the open words are the whole of Q'+n+'; a follow-up names the part its answer left open');`
- Tagged ASK 645.
Not changed: the follow-up prompt, qfQuestion, the DROPPED handling, the answer call, ruling 515's wording, and every other node.

SEARCH:
- qfCheck is defined in QR Merge, QR Follow Build and QR Follow Final (the QR preamble each node carries), and is not in the Shared Library. QR Follow Final applies it to the judges' replies; a fault gives status DROPPED with the reply recorded, and no answer call is made.
- In 42528 the other two follow-ups name a part: Q7 open "during the espousal" (of Q3), and Q8 open "so the flesh requirement is met by woman-becoming without stating loins of a begetting man" (of Q2, a part of its passage). Neither equals its question.

NOT SEARCHED:
- How often a follow-up has named the whole question before 42528. The build counts it over odv1_question_round_log (checks with pass 'follow', status PASSED, open equal to the question of Q<of>).

## 4. CRITERIA AND DONE
- C1. Replay qfCheck (old and new) on every follow-up check in odv1_question_round_log, with its round's qa. Only follow-ups whose open words equal their question change, from PASSED to DROPPED. 42528: sol62's follow-up of Q2 is dropped; qwen4max's (of Q3) and sol's (of Q2) pass as before. The build reports the count over all rows.
- C2. Synthetic cases:
  - open equal to the question with different case, spacing or curly quotes: dropped (qrNorm);
  - open equal to a part of the question: passes, as now;
  - open equal to the whole quoted passage: passes, as now (a passage is the judge's own choice of words, and ruling 515 allows it);
  - NONE: unchanged.
- C3. Engine: only QR Merge, QR Follow Build and QR Follow Final change, each by the one statement; the three qfCheck texts are equal; every other node byte-equal to ee4e389d; standing 31/0; pair check PASSES; reg385 PASS.
- C4. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if a judge may properly re-ask the whole question when the answer left all of it open. Against that: the prompt asks for "the part ... the answer left unanswered" and the program writes "Please explain that part". A judge that finds the whole answer missing can name the passage's words, which still pass.
- A second wrong-if: the operator reads ruling 515 as allowing the whole question. Then this is his to rule, and the build waits.

## 6. RUN EVIDENCE
- Case: the first live run where a follow-up names its whole question.
- Mark: that follow-up's check reads DROPPED with the new fault, and no answer call is made for it.
- If no such case occurs, the path is live and UNEXERCISED, and the two clean runs show the other follow-ups unchanged.
- Cost: saves one answer call per case. NO PROBE.

## 7. INPUTS IN GIT
ask645/w4/plan645.md (this file). The build goes in ask645/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C4 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 645 (a follow-up that repeats the whole question is dropped)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
