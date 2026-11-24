# ASK 588 D7 WRITE CARD: one continuation pass in the question round

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST.
- This card carries out your choice of 06:01Z, "One continuation pass".
- W1 failed rev 0 on ruling 515 (Wall 11395). W1 then gave rev 1 a PASS (Wall 11397, commit aa2e6dce).
- Build: commit 870fa882. Notes: a588_w4/plan588_D7.md.
- This write comes AFTER the ASK 588 write. It changes the engine only.

## 1. YOUR RULING 515 (23:51 CST 11-23)
"no, there's no follow-up question ... is it okay for a judge to ask a continuation question from the previous judge, but the judge still got to keep his original question"

## 2. WHAT THE WRITE DOES
1. After the six first answers, each judge reads all six questions and answers.
2. Each judge may then put at most one continuation to each debater. The continuation must be on a question that ANOTHER judge put to that debater.
3. A judge cannot continue its own question. If it tries, the continuation is dropped and recorded.
4. The judge keeps its own question. Questions Q1 to Q6 stay as they are, and the continuations are numbered Q7 and after.
5. The judge gives the question number, and copies the words of that question, or of the passage it quotes, that the answer left open. The program writes the question:
   `Your answer to Q<n> did not answer: "<the words>". Please explain that part.`
6. "NONE" asks nothing.
7. The program checks each continuation before it is sent:
   - the question exists;
   - it was put to that debater;
   - it was asked by another judge;
   - it has an answer;
   - the copied words stand word for word in that question or its passage;
   - there is at most one continuation per debater per judge.
   A continuation that fails is dropped and recorded.
8. The debater answers by its own route. The judges read the continuations in the same block as the first answers, which stands before the transcript.
9. A fault anywhere in the continuation pass keeps the first pass exactly as ASK 588 has it, and the skip is recorded.

## 3. THE SWITCH
- The pass runs whenever the question round runs.
- Sending `qr_follow:false` turns it off. With it off, the judges receive exactly what ASK 588 gives them (test T9.6).

## 4. LIMITS
- The same limits as ASK 588:
  - the enforcer turn and the single judge do not see the block;
  - the answers do not count as rounds.
- A continuation is not a contradiction candidate.

## 5. COST
- Up to 3 more judge calls and up to 6 more answers per run.

## 6. CHECKS
- t588f: 37 PASS.
- Syntax: 378 code parts, 0 errors.
- Library Check pair: PASSES.
- W1 rebuilt the target and it matches node for node.
- No model setting is touched.
- Engine: 407 to 420 nodes. 13 nodes are new, and only Init Seats and QR Merge change.

## 7. HOW IT IS WRITTEN, AND HOW TO UNDO IT
- The write runs on your press, after the ASK 588 write, while no run is live. The script is /mnt/project-files/ask588/w4/write/write588D7.sh.
- Before writing, the script checks that the live engine equals the 588 target (024290a7) and that t588f passes.
- After writing, the engine is fetched back, the Library Check pair is rerun, and W1 reads it back.
- REVERT: restore the engine to its 588 version, which the script saves first. Or restore all of ASK 588: engine 7536d7bf and child a7113b8d together.
