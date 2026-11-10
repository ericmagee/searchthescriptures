# W1 second reading of W2's closing-enforcer false-contradiction study (proposal_w2.md, d1de39df). Offline, no calls.

## 1. Do the three causes hold against stored replies?
- Only two false or doubtful CONFIRMED lines exist in stored enforcer replies: 33442 John 3:6 (per-side send 2) and 33442 link 3 (doubtful).
  The 9 false anti-cheat pairs (pkgRAC/w2_read/reading_w2.md) are code candidates that have never been sent to the enforcer: none of their
  debates (33218, 33299, 33345, 33530, 33644, 33371, 33798, 33846) is in the pkgRAC replay (staged_w4/rac_replay_s107 holds set C and 34108 only).
  So causes 1 to 3 are gaps in the prompt text, but the model's behaviour on those pairs is predicted, not observed.
- Cause 1: the one opponent's-words case actually sent, 33222 A94, is the CLOSING-sentence form (the closing quotes the opponent's grants), which
  the live rule already covers; the model answered NOT A CONTRADICTION in both sends. The EARLIER-sentence form (the 4 false pairs) has no reply.
  (reading_w2.md calls those 4 "the 33222 class"; 33222 is the other side of it.) The gap in the text is real; "either sentence" closes it.
- Cause 2: observed once (John 3:6). RISK in the proposed wording: "or says what a verse does not show" also describes a TRUE contradiction.
  In the pkgRAC replay, 33442 link 2 is CONFIRMED in both sends and link 5 in send 2: the defender dropped "I rest nothing on what the text does not
  name" in round 3, then in closing rests on "neither verse puts a man in the sentence that gives the source". W3 reads link 2 true. The new
  exemption hands the model a reason to pass it. 34108 D6 ("no biological father" dropped, reclaimed) is the same family.
  Recommendation: drop "or says what a verse does not show"; keep "names or answers a dropped verse without resting on it".
- Cause 3: the John 3:6 why ("the closing uses John 3:6 to exclude a male begetter") is a difference, not an affirmed and denied claim: fits.

## 2. Sizes (measured, study_close_fp/w1_read/fp_sizes.cjs on Close Enforcer Build of fetchback_live_s107)
- Live prompt 1,320 characters. W2's figures confirmed: prompt +275 per call (+550 per debate), code +276 (the newline escape).

## 3. Shorter or net-zero form (measured)
- Short form: replace the sentence with
  It is NOT a contradiction when: the closing grants, concedes, narrows or withdraws something; either sentence states or quotes the other side's position; the closing names or answers a dropped verse without resting on it; it answers a press with a reason the earlier sentence leaves room for; or both say the same.
  and put cause 3 into the reply format's why field instead of a new sentence:
  <one sentence: the one claim one sentence affirms and the other denies, or why both can stand>
  = +102 per call (+204 per debate), code +102.
- Net about zero: also cut the framing sentence "A debater's closing round may not contradict what the same debater stated in its earlier rounds."
  (the next two lines say the same) = +5 per call, +10 per debate, code +5. The cut is a wording change too and rides the same replay.
- Code-only option for cause 1 (W2's own finding): drop a handed pair whose earlier quotation lies in a quoted opponent premise block before it
  is handed (5 of 34 stored pairs, all false); costs code, no prompt. Covers handed pairs only, not NEW lines.

## 4. Smaller proof replay
- Run the control first: the 8 pkgRAC bodies with false targets not yet sent (33218, 33299, 33345, 33530, 33644, 33371, 33798, 33846), live
  sentence, one send each = 8 calls. If the live sentence already answers the false pairs NOT A CONTRADICTION (as it did 33222 A94), the fix is
  not needed and no prompt text is added. These sends are also the proof pkgRAC itself lacks for those pairs (31% false if confirmed).
- Only if the control confirms false pairs: new text, two sends each, on those 8 bodies plus 33442 and 34108 = 20 calls. 33442 must carry link 2
  and link 5 as true controls (the risk above) and John 3:6 as the false target. 33705 and 33482 can go: the 8 bodies already carry 8 distinct
  true contradictions as controls. Total 8 to 28 calls against 35.
