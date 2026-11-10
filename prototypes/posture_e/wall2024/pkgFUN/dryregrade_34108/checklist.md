# Dry regrade of 34108 on the version carrying pkgFUN rev 4: what to check, line by line

W1, 20:40 CST 11-09. Token ODV1-34108-3to8dgrt, regrade_dry true, question_trial true. Each line names what the record should show; mark it MET, NOT MET or NOT REACHED.
Sources: pkgCEC/README.md and probe_CEC (item A), pkgQRC/README.md and itemC_second/finding.md (item C), the last dry regrade (execution 34299, /mnt/project-files/wall2024/ex34299_full.json, live s94), and debate_enforcer_log for the live run.

## 0. Before reading
- 0.1 Live version id and node count recorded; it carries pkgFUN rev 4 (Shared Library K-S3 line has the rev 4 refusal list and the G1 opening).
- 0.2 The run gets past Alternate Build. 34299 stopped there ("Cannot read properties of undefined (reading 'map')"); pkgABH (live s98) fixes it. If it stops again, nothing below the panel can be read.
- 0.3 Where the rows land: judgments to debate_replay_judgments; check whether Write Enforcer Log ran (34299 never reached it).

## Item A: closing contradiction enforcer (pkgCEC rev 5)
- A1 Close Enforcer Build: cec_skip false; links D1-D6 and C1-C6; no missing rounds. cands is empty, because 34108's [DR4] predates item B and holds no OPPONENT'S CONTRADICTIONS block, so DeepSeek must find the pair itself.
- A2 **Close Enforcer Record: one CONFIRMED row, DEFENDER LINK 6.** EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." CLOSING [CR4] "Christ had no biological father." Under the rule, asserting again what the side dropped IS a contradiction, and the prompt says so.
- A3 The "ordinary means" pair ([CR3] "I grant that this is the ordinary means." against [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew, ..."). If DeepSeek lists it, my reading (pkgCEC probe 2b) is NOT A CONTRADICTION: [CR3] already limits the grant ("For this birth Matthew 1:18 states a different order"). A CONFIRMED here is a reading to put to the operator, not a code fault.
- A4 **34299 precedent: A2 was NOT MET.** DeepSeek replied "CLOSE-CONTRADICTION: NONE". Its 25,288 reasoning tokens went almost entirely to the challenger's [DR4]. It met "I drop the wording 'no biological father'" only as the challenger's quoted grant G34, and never read the defender's [CR4] against [CR3]. If A2 fails again, item A has a repeat failure on the record it was built for, and it needs a countermeasure (see the end).
- A5 Log: the E-CLOSECON rows are seat "close enforcer", seat_role panel, cure_status null, with the answer leading cure_reason. They stand at the head of enforcer_log and are recorded in the run's one insert.
- A6 Display (only if A2 is MET): the CONFIRMED CLOSING CONTRADICTIONS block follows the defender's [CR4] in all 3 panel bodies and in the single judge's body, with LINK 6 BROKEN.
- A7 Recompute (only if A2 is MET):
  - Every D6 collision line reads DEFENDER LINK BROKEN with the AUDIT line, in luna, terra and sol.
  - Trigger "CLOSE-CONTRADICTION ...".
  - Counts, standings and verdict are recomputed. Probe expectation: HELD to BROKEN, RESULT CHALLENGER WINS.
  - The single judge also reads BROKEN.
  - A send-back does not undo the break (Alternate Merge Seat).
- A8 Judge Contradiction (after the panel):
  - Candidates are each judge's CONTRADICTION line whose LATER round is CR4 or DR4, plus each QR contradiction question. They are de-duplicated, and a pair already answered before the panel is not sent again.
  - In 34299 this was J1, the defender's [CR3] "I drop the wording "closes the espousal to any knowing."" against [CR4] "The rows state a not-knowing at each stage, ...". It was answered NOT A CONTRADICTION (Link 1 is narrower than the dropped Link 4 wording). I agree, and expect the same.
  - If a judge names the D6 pair here and A2 missed it, a CONFIRMED here still breaks D6 for the panel seats but not for the single judge (known limit).

## Item C: the judges' closing contradiction question (pkgQRC rev 2)
- C1 Six questions (3 judges, 2 debaters). Every check PASSED, no retries, every answer finished (34299: met).
- C2 Each contradiction question:
  - carries earlier_round and earlier_quote;
  - its round is CR4 or DR4, and its earlier round is that side's own;
  - both quotes are word for word.
  - QR Merge labels it CONTRADICTION QUESTION with both quotes.
- C3 Record which pairs were asked. In 34299 all three asked the same pair (the "closes the espousal" drop), and none asked the D6 pair or the "ordinary means" pair. A repeat of that is the known item C second finding, which waits on the operator's answer about W2's card. It is not a fault of rev 2 as approved.
- C4 Whether any judge asks the D6 drop and reassertion. It is the pair the rule targets.
- C5 Each QR contradiction question appears as a candidate in Judge Contradiction Build (A8).

## COUNTED reader (pkgFUN rev 4, K-S3 cure)
- R1 The stored record cannot exercise it. Every K-S3 answer in the live run and in 34299 is TOUCHES NO LINK or NOT HELD; none is COUNTED. The reader is reached only if a judge writes COUNTED this time.
- R2 Each K-S3 row whose RESPONSE opens with COUNTED:
  - Before looking at cure_status, label it by meaning:
    - CURED when it counts the close concession, with or without a reason, including "though" or "however" clauses that keep the count;
    - UNCURED when the first sentence points back to the flagged line, or any sentence refuses the count ("but I disagree", "I do not count it").
  - Then compare it with cure_status.
- R3 Each TOUCHES NO LINK or NOT HELD row: the cure reading equals the replay of the same text on the prior live code. Rev 4 changes only the COUNTED line, and stored_FUN3 showed 348 stored answers, 0 differ.
- R4 Known limits, not faults:
  - a refusal on a second RESPONSE line (W2's pkgKSL);
  - W3's four reservations read CURED, as the prior live code does.
- R5 The K-S3 rows are in the run's one insert.

## Scoreboard lines to compare with the live run
- Live 34108: all 3 judges HELD; every collision UNDERDETERMINED; the D6 drop and reclaim were caught by no judge (UNEXHIBITED rule, rulings 397, 405 and 412, not applied) and by no enforcer.
- The dry regrade passes item A on this record only if A2 is MET and A7 follows.

## If A2 is NOT MET again (a countermeasure for the operator; not built)
- A code pre-check in Close Enforcer Build. For each side, every "I drop ..." / "I withdraw ..." sentence of rounds 1 to 3 that quotes wording is matched against that side's round 4. Wording found again in round 4 as the side's own sentence becomes a listed candidate. DeepSeek must then answer it, and an unanswered candidate is already logged NO ANSWER.
- On 34108 this lists the D6 pair mechanically.
