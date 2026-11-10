# pkgQRD (W2, commit eb0ba9ec; write file pkgQRD/parent_s109_QRD.json, to be rebased by W2 on live s110): W3 labels, committed before any run

Before these labels I compared the write file with the s109 fetch-back node by node and read the changed code of QR Check and QR Final (no code was run).
The grade is finished on the build W2 names on s110; the same runner is rerun there.

Any other result than the one stated is a FAIL.

- R1 Against the fetch-back the build names: 418 nodes, connections equal, only QR Check and QR Final differ; sizes measured; the only new prompt text is the redirect sentence. With question_trial off neither node runs (they sit behind the QR Trial switch): state from the connections.
- R2 Stored question round of debate 34108 (dry regrade execution 34299): live returns no judge; the candidate returns chatgpt and sol on the defender side, luna stands; out.qs and out.faults of every judge equal to live.
- R3 QR Final on the stored 34299 retry input: items equal to live; record equal apart from the new redirect field.
- R4 THE QUESTION MUST NOT BE LOST. Plants of my own on 34299. In each, state which judges ask the defender about the CR3/CR4 pair at the end, under live and under the candidate. The candidate must never end with fewer than one judge asking about the pair where live ends with one or more.
  a. the standing judge (luna) has a fault on its challenger side in its first reply, so it is returned for the fault; its second reply is not JSON (a failed call). chatgpt and sol are redirected and each replies with a different passing contradiction.
  b. as a, but luna's second reply passes on both sides and changes its defender question to another passage.
  c. luna stands; both redirected judges switch to a plain (non-contradiction) question: used; luna still asks about the pair.
  d. both redirected judges' second replies are empty (failed calls): both keep the first question, both sides.
- R5 A redirected judge whose second reply changes its challenger question as well: the challenger side keeps the first (return was only a redirect).
- R6 Not a repeat: same rounds, quotes that do not contain one another; a contradiction question on the other debater; an earlier judge's question that itself fails a check (the later judge is then not redirected).
- R7 Chain: three judges with the same pair: the second and third are both returned against the first; return text names the right side and rounds; a judge redirected on both sides gets two sentences.
- R8 QR Merge (the only other reader of QR Final) reads the record with the new fields without error or changed text other than the fields themselves: by reading its code, and by running it if it runs offline.
- R9 The record never reports a question as PASSED ON RETURN when the first question was kept, and never drops a question that passed at first on a side that was not at fault... except under today's rule for a judge returned for a fault (state it).

## Rev 2 (W2 commit 4d105506, Wall 4197): labels added before any run of rev 2

I read W2's Wall post only; no rev 2 code was run or read before this.

- R1 to R9 as above, with the sizes W2 states (QR Check 6,026 to 7,308; QR Final 7,842 to 8,116; +1,556).
- R4a, R4b now: luna (returned for a fault) is not counted; chatgpt stands and is not returned; sol is redirected against chatgpt. At the end at least chatgpt asks the defender about the pair in both plants.
- R6b changes: with luna's defender question failing, luna has a fault and is not counted (as before); sol is redirected against chatgpt.
- R10 luna and chatgpt both have a fault on the challenger side: sol is not redirected; all three defender questions follow today's rule.
- R11 luna's first reply is not JSON: not counted; chatgpt stands; sol redirected against chatgpt.
- R12 MY OWN CONDITION TESTED. Three judges, same rounds: chatgpt's earlier quote is a long passage that contains luna's earlier quote and sol's earlier quote; luna's and sol's quotes do not contain one another; the closing quotes are three different sentences. chatgpt is redirected against luna; sol is redirected against chatgpt, though sol's question is not a repeat of luna's. If chatgpt and sol both switch, sol's distinct question is asked by no one, where live keeps it. If the plant shows that, it is a loss and a FAIL, and the condition I gave on the Wall (4196) was incomplete: the earlier judge must also not be redirected itself on that side.
