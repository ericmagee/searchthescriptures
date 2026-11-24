# ASK 588 D7: the one continuation (follow-up) pass. Build notes for grading

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST.
- Operator's choice, 06:01Z 11-24: "One continuation pass". Ruling rows 514 and 515: "is it okay for a judge to ask a continuation question from the previous judge, but the judge still got to keep his original question".
- Design: plan588.md D7, graded by W1 at Wall 11386 (F3, F4).
- This is a separate write from ASK 588. It is built on the graded 588 targets and has its own switch.

## 1. WHAT IT DOES
1. After the six first-pass answers, each of the three judges reads all six questions and answers. Each judge may then put at most one follow-up to each debater.
2. A follow-up is on a question already put to that debater, whether by this judge or by another judge.
3. The judge gives the question number (Q<n>) and copies the words of that question, or of the passage it quotes, that the answer left open. The program writes the follow-up:
   `Your answer to Q<n> did not answer: "<open>". Please explain that part.`
4. "NONE" asks nothing.
5. A follow-up does not use the judge's one question. Q1 to Q6 stay as they are, and the follow-ups are numbered Q7 and after.
6. The checks, in qfCheck:
   - Q<n> exists;
   - Q<n> was put to that debater;
   - Q<n> has an answer;
   - Q<n> is not itself a follow-up;
   - the open words are at least 8 characters and stand word for word in Q<n> or its quoted passage;
   - there is at most one follow-up per debater per judge.
   A follow-up that fails is dropped and recorded. There is no second return.
7. The debater answers by its own route (Anthropic direct or OpenRouter). It sees its rounds, the question, its own answer and the follow-up.
8. QR Merge puts the follow-ups into the same single block before the transcript, each marked "FOLLOW-UP to Q<n>".
9. Follow-ups are not contradiction candidates.
10. A fault anywhere in the follow-up pass keeps the first pass exactly as in 588, and records the skip.

## 2. THE SWITCH (Init Seats)
- `qr_follow` is on whenever the question round is on, unless `qr_follow:false` is sent. A value that is not true or false fails the run start, as question_trial does.
- With the switch off, QR Merge's output is identical to 588's output (test T9.6).

## 3. CHANGES (on target_engine_588.json 024290a7)
- Engine target_engine_588f.json is 6e2334ab, with 407 to 420 nodes. The child is unchanged (16ed1670).
- Changed: Init Seats and QR Merge only (test T9.5).
- New (13 nodes):
  - QR Follow Build;
  - QR Follow Ask (a copy of QR Ask);
  - QR Follow Final;
  - QR Follow D Build, D Route, D anthropic, D openrouter, D Done;
  - QR Follow C Build, C Route, C anthropic, C openrouter, C Done.
- Wiring: QR Answer C Done, then the follow-up pass, then QR Merge.
- The 588 readers (the swap, the stubs, Alternate Pass Call, Build Save Body) are unchanged, because QR Merge stays the one output.
- The checks are recorded with pass:'follow' in the review_notes line.

## 4. CHECKS
- t588f: 36 PASS (out_t588f.txt). F4 (a) is covered by T9.10 to T9.16. F4 (b) is T6.2 of t588.
- Syntax: syn588f, 378 code parts, 0 errors.
- Library Check pair (588f engine with the 588 child): PASSES.

## 5. COST (F4 c)
- Up to 3 more judge calls and up to 6 more answers.
- Each follow-up judge call carries the full judge body and the block, about as large as a question-round ask.

## 6. LIMITS
- The same limits as 588: the enforcer turn and the single judge do not see the block, and the answers are not counted as rounds.
- A judge seat that is not an OpenRouter seat skips the follow-up pass, as it skips the round.

## 7. WRITE AND REVERT
- The write is separate from 588 and comes after it: base engine = the 588 write, target 6e2334ab.
- Revert to the 588 engine, or to 7536d7bf together with the child a7113b8d.
