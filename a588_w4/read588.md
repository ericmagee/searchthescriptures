# ASK 588 read (W4): the judges' question round on the live engine 7536d7bf (ASK 587 base)

Read from the 587 fetch-back (ask586/w4/build/live587_eng.json), md_notes_rulings 413 and 414, Wall 4844 and 9642. Nothing written.

## 1. Why it never ran live
1. Ruling 413 (11-03, operator's "yes approved") approved the round "as a TRIAL ... run only on the dry re-grade of run 32404". Ruling 414 approved Commitment 8 "in the TRIAL posture only, added to the live posture only if the trial earns it".
2. The build follows that plan, so three gates keep the round dry-only:
   a. Init Seats: `if(b.question_trial===true&&!DRY)fail('question_trial runs only in a dry regrade (md_notes_rulings 413).')`;
   b. QR Trial? (IF node): passes only when `Init Seats.question_trial === true`; every live run goes straight to Panel Judges Prep;
   c. QR Ask Build: `if(S.question_trial!==true||S.dry!==true)throw 'FAIL-CLOSED ... outside a dry question-round trial'`.
3. The round ran in four dry regrades (34299, 34626, 34703, 34780). W2 recorded 0 live runs at Wall 4844 (11-11). After the trials, no seat brought the operator the card to put it live. That is the team's omission, mine included as engine owner. No seat removed it; it was never switched on.

## 2. What the round does (live code)
1. Each of the 3 panel judges, before judging, is asked for ONE question to EACH debater (2 per judge, 6 in all), in JSON: round, exact quote, question; a contradiction question when a closing round contradicts an earlier round (quotes both).
2. QR Check: quote word for word in the named round of that debater; no verse that debater did not cite; no framing words ("defend", "respond to", ...). A failing reply is returned once. A repeated contradiction question is redirected (pkgQRD rev 5).
3. QR Final: each passing question goes to the debater's own model with its own four rounds; answer at most 250 words.
4. QR Merge: all six questions and answers are appended to all three judges' prompts before they judge. Judge Contradiction Build reads contradiction questions; Replay Rows records the round (posture mode).
5. Ruling 414 item 2 (fixed question form) is NOT in the code: the code still uses the free question and the framing-word list.

## 3. What does not fit a live run on the 587 base
1. Data source: QR Check, QR Final and QR Merge read the rounds from `Regrade Load` and the debater models from `Regrade Row`, which exist only in a regrade. Live needs `Final Output` (rounds, as Panel Build already does: `F=RGL?RGL.f:$('Final Output')`) and `Resolve Seats` (RS.defender.model, RS.challenger.model).
2. The reserve does NOT get the round: Reserve Build copies `Panel Build.judges[slot].body`, not the QR Merge body. (My NOT CHECKED at Wall 9642 4d: now checked, it does not.)
3. Alternates do NOT get the round: Alternate Build writes its own prompt from Panel Build.
4. Follow-up turns of the panel judges (Judge Enforcer Build, Send Back Build, Panel Cure Normalize 1-3, Cure Normalize) take `Panel Build.judges[..].body`, so a send-back turn would not carry the six answers the judge read. Each needs to read the QR Merge body when the round ran.
5. The single judge (Build Independent Verdict) does not get the round.
6. Prompt labels say "(TRIAL)"; Replay Rows stores the round only in posture mode.
7. The round routes only OpenRouter seats (fail-closed otherwise). Every judge seat in the live table is OpenRouter; only deepseek is not, and it is not a judge seat.

## 4. Cost (estimate, not measured on a live run)
1. Judge asks: 3 calls, each the judge's full prompt again (the agreement plus 42071-size rounds, about 143,000 characters of rounds); up to 3 returns. QR Check sends a 16-token "OK" call when no return is needed.
2. Debater answers: 6 calls; defender rounds about 94,000 characters, challenger about 49,000 (42071); answers at most 250 words.
3. The six questions and answers (about 3,000 tokens) ride in every later turn of each judge.
4. Rough total: 0.35 to 0.6 million extra input tokens per run, plus several minutes of wall time.

## 5. Plan outline (to be built and graded)
1. Remove the dry-only gates (Init Seats, QR Trial?, QR Ask Build); the round runs on every live run, and a `question_round:false` input skips it.
2. QR Check, QR Final, QR Merge read live rounds and debater models.
3. Reserve, alternates, follow-up turns and the single judge receive the QR block.
4. Drop "(TRIAL)" from the prompt text; store the round's record on every live row.
5. Test on stored 42071 rounds offline; Library Check pair; W1 grade; write card with exact before and after text.
