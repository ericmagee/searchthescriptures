# GRADE pkgQRD (W2; write file pkgQRD/parent_s110_QRD.json on live s110, version ed644923) by W3: FAIL (one finding)

Labels pkgQRD/w3_grade/labels_QRD_w3.md (commit 137a6b0a, before any run). Runner w3_QRD.cjs, output w3_QRD_out.txt.

## The finding (R4a, R4b): the contradiction question can be lost, where live keeps it

The candidate redirects a judge against any earlier judge whose question passes at first. It does not look at whether that earlier judge is itself returned for a fault on its other side. A judge returned for a fault has BOTH questions replaced by its second reply (today's rule). So:

- R4a. luna's challenger question fails a check; its defender contradiction question (CR3/CR4) passes. luna is returned for the fault and its second reply is not JSON (a failed call): both of luna's questions are DROPPED. chatgpt and sol were told "Another judge already asks" and switch to another contradiction. At the end NO judge asks the defender about the pair. Live: chatgpt and sol both ask it.
- R4b. The same, with luna's second reply passing but changing its defender question. At the end no judge asks about the pair. Live: chatgpt and sol ask it.

Both are plants; the one stored question round (dry regrade of debate 34108) does not show it. It is a silent loss of the very question item C exists to keep, so I grade it FAIL and not a note.

What would close it (the builder's to write, not my code): a judge counts as "already asks" only when its first reply has no fault on either side. Such a judge is never returned for a fault, and QR Final already keeps its first question on any side it was not redirected on (R4d, R5 show this), so the pair it holds cannot be lost.

## Everything else: as labeled

- R1 OK. 418 nodes, connections equal, only QR Check (6,026 to 7,238) and QR Final (7,842 to 8,116) differ: +1,486 code, measured (3,838,702 to 3,840,188). New prompt text: one sentence of 213 characters per redirected side, in a return only. Both nodes sit behind the QR Trial? switch (question_trial true), so a run without the question round does not reach them.
- R2 OK. Stored round: live returns none; candidate returns chatgpt and sol on the defender side, luna stands; questions and faults equal to live. Cost, measured: a redirected judge's return body is 267,508 characters against 169 for today's no-op call.
- R3 OK. QR Final on the stored retry input equals live apart from the redirect field (6 items).
- R4c OK. Redirected judges that switch to a plain question: used; luna still asks about the pair. R4d OK. Redirected judges that return nothing keep the first question on both sides.
- R5 OK. R6 OK (quotes not contained: no return; an earlier failing question does not redirect the next judge). R7 OK (chain; a judge redirected on both sides gets two sentences with the right rounds). R9 OK (a kept first question is PASSED with the note, never PASSED ON RETURN).
- R8 by reading: QR Merge passes the record on unchanged and prints none of the new fields.

Limits, not findings: a redirected judge may replace its contradiction question with a plain one (R4c); two redirected judges may both move to the same second contradiction (one return only).
