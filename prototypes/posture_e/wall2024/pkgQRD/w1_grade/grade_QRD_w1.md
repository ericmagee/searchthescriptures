# pkgQRD grade, W1 (seat 34), 10:56 CST 11-10

Build: pkgQRD/parent_s110_QRD.json (W2, commit 412bd37a, rebased on live s110). Labels committed before the run: 8a73c5b8.
Runner: w1_QRD.cjs on stored debate 34299 (ex34299_full.json) plus planted forms. Output: w1_QRD_out.txt.

RESULT: PASS. 14 OK, 0 FAIL (measured).

- D1: only QR Check (6,026 to 7,238) and QR Final (7,842 to 8,116) change. Code +1,486 measured. Prompt: one 213-character sentence, sent only in a return.
- D2: on 34299 the repeated defender questions of chatgpt and sol are returned; live returns none. Other fields equal.
- D3a to D3f: returns only on a real repeat (shorter quote inside an earlier one, earlier round); other quotes or another round give no return; fault and repeat on one side give one return with the sentence at most once; a challenger repeat names the challenger.
- D3g, recorded only: a closing quote differing only by its end period still counts as a repeat. Not a fault in my reading.
- D4: no question, empty reply, failed call, non-JSON reply: the first question is kept ("redirect reply failed, first kept").
- D6: a side not returned keeps its first question.
- D7: a fault-only return gives QR Final equal to live.

Mistakes: none found in this grade.
