# ASK 588 WRITE CARD: the judges' question round goes LIVE

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST. The build passed W1's grade (Wall 11393, commit 50203549). Build commit 23546e0b; the build is on the Wall at 11392.

## 1. WHAT THE WRITE DOES
1. The question round runs on every fresh run. Before the judges judge, each of the three panel judges puts one question to each debater. Each debater answers. All three judges then read all six questions and answers, and then they judge.
2. A judge chooses the passage and the form. The program writes the question, using the fixed forms of ruling 414 item 2:
   - MEANING: `What does "<term>" in this passage mean?`
   - FIT: `How does this passage fit <verse>?`
   - AGREE: `How do these two passages agree?` This form is kept by your choice D3. It is used only when a debater's closing round contradicts its own earlier round.
3. The program checks each question before it is sent:
   - the quotation is word for word from the round the judge names;
   - the term stands in the quotation;
   - the verse is named in the quotation;
   - no verse appears that the debater has not cited.
   A question that fails goes back to the judge once.
4. The answers follow your choice D1 A. The judges' text says: "Each answer explains only the passage it quotes and is read with the round it came from, as an explanation of that passage. Every quotation you write in your lines, and every concession you count, comes from the eight rounds of the transcript ([CR1] to [DR4]): an answer is never quoted as a round, and a concession is counted only where a round makes it." D1 B, where the answers count like rounds, is its own ASK.
5. A fault anywhere in the round skips the round. The skip is recorded, and the run never stops for it.
6. The questions and answers are stored in the run's review_notes, on the line `[QUESTION ROUND v1: ...]`. That line gives the status (RAN or SKIPPED), every question and answer, and the reason for any skip.

## 2. BEFORE AND AFTER (Init Seats)
- BEFORE: `if(b.question_trial===true&&!DRY)fail('question_trial runs only in a dry regrade (md_notes_rulings 413).');` and `...(b.question_trial===true?{question_trial:true}:{})`
- AFTER: the gate is removed. The setting becomes `...((RG!==null?b.question_trial===true:b.question_trial!==false)?{question_trial:true}:{})`.
  - On a fresh run the round is ON unless the run body sends `question_trial:false`.
  - In a regrade the round runs only when `question_trial:true` is sent.
- QR Ask Build's dry-only throw is removed. The QR Trial? node is unchanged: it follows the setting above, so it passes on every fresh run.

## 3. WHERE IT WORKS, AND ITS LIMITS
1. Every later turn of a judge reads the bodies that carry the round: send-back, gate, late gate, cures 1 to 3, the reserve, the alternates in the engine and in the child, and the panel check.
2. LIMIT: the enforcer turn (Judge Enforcer Build) does not see the questions and answers.
3. LIMIT: the single judge path is not connected today, because Build Independent Verdict has no parent node. It gets no questions.
4. LIMIT: the answers are not counted as rounds. This is D1 A; D1 B is its own ASK.
5. The AGREE question becomes a contradiction candidate for Judge Contradiction Build. This is the same as in the trials (34299 to 34780).
6. The round is skipped when a panel judge seat is not an OpenRouter seat, or when a debater's family is neither Anthropic nor OpenRouter.
7. LIMIT: the reads of the live data (Final Output, Resolve Seats) cannot be run offline.

## 4. THE STEP AFTER THE WRITE, BEFORE THE OPUS 5.5 RUN (your launch; my session cannot start runs)
Run a dry regrade of run 42071 with `question_trial:true`. It exercises both answer routes: the defender goes through OpenRouter and the challenger goes direct to Anthropic. I then read the review_notes line and report it. After that, the Opus 5.5 run goes ahead, as you chose ("Hold the run").

## 5. COST
About 0.35 to 0.6 million added input tokens per run, plus several minutes.

## 6. CHECKS
- t588: 82 PASS.
- Syntax: 372 code parts, 0 errors.
- Library Check pair: PASSES. LIB 14d848a99adaf445 and MAP 3675b0b63c7c05f7 are the same in the engine and the child.
- W1 rebuilt the targets and they match node for node.
- No model setting is touched.

## 7. HOW IT IS WRITTEN, AND HOW TO UNDO IT
- I write only on your press, and only while no run is live, using the script /mnt/project-files/ask588/w4/write/write588.sh.
- Before writing, the script checks:
  - that the live versions are 7536d7bf (engine) and a7113b8d (child);
  - that the fresh fetch equals the build base;
  - that t588 still passes.
- The engine is written first, then the child. Each is fetched back, and the Library Check pair is rerun. W1 reads it back.
- Engine: 398 to 407 nodes (9 new, 35 changed). Child: the Shared Library only.
- REVERT: restore engine 7536d7bf and child a7113b8d together, from revert_eng588.json and revert_child588.json, which the script saves before the write.
