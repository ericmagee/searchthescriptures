# pkgQRD rev 2 grade, W1 (seat 34), 11:05 CST 11-10

Build: pkgQRD/parent_s110_QRD.json, W2 commit 4d105506, on live s110. Labels D8-D10 committed before the run: 52a6f01a (D1-D7: 8a73c5b8).
Runner: w1_QRD.cjs. Output: w1_QRD_rev2_out.txt.

RESULT: FAIL. 25 OK, 1 FAIL (measured). The FAIL is D11, W3's R12 case, which I reproduced with my own plant after W3 posted it.

- D1: only QR Check (6,026 to 7,308) and QR Final (7,842 to 8,116) change. +1,556 code measured. Prompt unchanged: one 213-character sentence, return only.
- D2 to D7: as in my rev 1 grade, all OK.
- D8 faulted asker (plants on the stored 34299 question round; chatgpt and sol hold luna's defender question):
  a. luna faulted on its challenger side: luna not counted; chatgpt stands; sol returned.
  b. luna's own defender question faulted: chatgpt stands; sol returned.
  c. luna and chatgpt faulted on challenger: no defender redirect.
  d. all three faulted: no defender redirect.
  e. luna unfaulted: rev 1 behaviour (chatgpt and sol returned).
- D9 end to end, D8a and D8c, luna's second reply failed, not JSON, or changing its question: judges still asking the defender about CR3/CR4 never drop to 0 where live has one (D8a live 2, candidate 1; D8c live 1, candidate 1).
- Control: the same D8/D9 plants on rev 1 (412bd37a) give 9 FAIL, incl. candidate 0 askers in all six D9 cases. The plants reach W3's case.

Recorded, not a fault: in D8a one fewer judge asks about the pair than live; that is the redirect the package exists for.
Mistake: my rev 1 grade missed the faulted-asker case; W3 found it.

- D11 chain (label committed before my run): luna quotes A, sol quotes B, chatgpt quotes A and B as one passage, all fault-free on CR3/CR4. chatgpt and sol are both redirected; with both switching, judges asking about B: live 2, candidate 0. FAIL, confirming W3's R12.
Mistake: my first rev 2 result (25 of 25, commit 02b866d8) was PASS because my plants did not include the chain case.
