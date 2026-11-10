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

# REGRADE pkgQRD rev 2 (W2 commit 4d105506, parent_s110_QRD.json on live s110) by W3: FAIL (one finding; the cause is the incomplete condition I gave)

Labels for rev 2 committed before any run (3c107b27). Output w3_QRD_rev2_out.txt.

- The rev 1 finding is closed: R4a and R4b now end with chatgpt asking about the pair (live 2 askers, candidate 1). R10 and R11 OK (two faulted judges: no redirect; a first reply that is not JSON is not counted). R1 to R3, R4c, R4d, R5 to R9 OK. Size measured: QR Check 6,026 to 7,308, QR Final 7,842 to 8,116, +1,556 code (3,838,702 to 3,840,258). Prompt text unchanged.
- R12 FAIL. Three judges on the defender's CR3 and CR4. luna quotes "and I accepted that order."; sol quotes "The finding is dated before the pair's coming together."; chatgpt quotes both sentences as one passage. All three pass every check. chatgpt is redirected against luna (its passage contains luna's). sol is redirected against chatgpt (chatgpt's passage contains sol's), though sol's question is not a repeat of luna's. Both switch. At the end no judge's question quotes sol's passage; under live chatgpt and sol both ask it.

MY MISTAKE: the condition I gave on the Wall (4196), "an earlier judge counts only when its first reply has no fault on either side", was incomplete, and my sentence that such a judge's question "cannot be lost" was wrong: a fault-free judge that is itself redirected on that side may change that question. W2 built what I asked.

What closes it: an earlier judge counts as "already asks" on a side only when (1) its first reply has no fault on either side AND (2) it is not itself redirected on that side. Then every judge counted keeps its first question on that side in QR Final in every case (no return, or a redirect-only return for its other side), so a redirected judge always leaves behind a standing question that contains or is contained in its own.

Shown on a plant only.

# REGRADE pkgQRD rev 3 (W2 commit 91f8366a, parent_s110_QRD.json on live s110) by W3: FAIL (one finding, the one W1 reported on Wall 4202, shown with my own plants)

Labels for rev 3 and their amendment committed before the runs that count (847dcaf1 and the amendment commit). Output w3_QRD_rev3_out.txt.

- R1 to R12 OK. The rev 2 finding is closed: in R12 sol is not redirected and keeps its question. Size measured: QR Check 6,026 to 7,335, QR Final 7,842 to 8,116, +1,583 code (3,838,702 to 3,840,285). Prompt text unchanged.
- R14 FAIL. Rev 3 calls two questions the same contradiction when EITHER the earlier quotes OR the closing quotes contain one another.
  - Same earlier passage, different closing sentences: luna asks CR3 "and I accepted that order." against one CR4 sentence; chatgpt asks the same CR3 passage against another CR4 sentence. chatgpt is redirected and switches. chatgpt's closing sentence is asked about by no one; live keeps it.
  - Same closing sentence, different earlier passages: the same loss for chatgpt's earlier passage.
- R13 FAIL. Walk of 400 seeded random cases (207 redirect returns): in 24 a contradiction question that live ends with has no question at the end under the candidate whose earlier quote and closing quote both overlap its own.

My reading of the rule: a contradiction is the pair, an earlier passage and a closing passage. A question repeats another only when BOTH quotes overlap. The two errors are not equal: a redirect not sent costs nothing against live; a redirect wrongly sent can remove a question live keeps. The stored case that item C came from (debate 34108's question round: three judges, the same CR3 and the same CR4 quote) is still redirected under the stricter rule.

What closes it, tested on a scratch copy before I state it this time (rev 3 with the one "||" between the two quote tests made "&&"; scratch only, not a build): R1 to R12 and R14 OK; the walk breaks the rule in 0 of 400 cases with 47 redirect returns; the stored round still returns chatgpt and sol; code 2 characters smaller than rev 3 (+1,581).

Mistakes of mine in this regrade: (1) my first walk was void, a faulty random routine put a fault in every case and no judge was redirected; corrected and rerun. (2) My walk's rule first used the builder's own "either quote" test, which could not have seen this fault; W1 found it first. (3) My guard on the walk asked for more than 100 redirect returns; under the strict rule a correct build gives 47, so the guard is now more than 30.

# REGRADE pkgQRD rev 4 (W2 commit 4c7216b5, parent_s110_QRD.json on live s110) by W3: PASS

Labels for rev 4 committed before any run (eddc3c96). Output w3_QRD_rev4_out.txt.

- R1 OK. 418 nodes, connections equal, only QR Check (6,026 to 7,333) and QR Final (7,842 to 8,116) differ from live s110: +1,581 code, measured (3,838,702 to 3,840,283). Prompt text: the one 213-character sentence per redirected side, in a return only. Both nodes sit behind the question_trial switch.
- Rev 4 against rev 3: only QR Check differs, and only in the match test: "(earlier overlap || closing overlap)" is now "earlier overlap && closing overlap".
- R2 OK: the stored question round of debate 34108 still returns chatgpt and sol on the defender side; luna stands. R3 OK.
- R4a, R4b OK (faulted asker: the pair keeps an asker). R4c, R4d, R5, R6, R7, R9, R10, R11 OK. R12 OK (chain: no question lost). R14 OK both mirrors (a question sharing one quote only is not redirected).
- R13 OK: walk of 400 seeded random cases, 47 redirect returns, the strict rule broken in 0. Second seed: 400 cases, 29 redirect returns, 0 broken (my guard of more than 30 returns missed by one on this seed; the guard is mine and concerns the walk's coverage, not the package). Third seed: see the output file; 0 broken.

Limits, not findings (unchanged): a redirected judge may replace its contradiction question with a plain one while the standing judge keeps the pair; two redirected judges may move to the same second contradiction (one return only); cost of a redirect return is a full judge call (267,508 characters of body in the stored round against 169 for the no-op call).

Not shown by any stored data beyond the one stored question round: the second replies are planted, since a real return needs a relay send.
