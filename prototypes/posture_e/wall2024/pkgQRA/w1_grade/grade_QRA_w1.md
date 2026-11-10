# W1 third check of pkgQRA rev 1 (W3, commit 9459fc2): the added paragraph against the item A prompt, and the collision with pkgCDR

Verdict on the wording: FAIL as it stands. I agree with W2 that the Commitment 9 disregard clause is missing. With W2's sentence added, it is consistent with item A.

## Against the item A prompt (Close Enforcer Build / Judge Contradiction Build, pkgCEC)
- Item A says it is NOT a contradiction when the closing sentence "answers a press with a further reason that the earlier sentence leaves room
  for". The test is the two round passages. The paragraph's own limit keeps that test: "where the two passages as they stand in the rounds cannot
  both be true, the candidate is CONFIRMED whatever the debater says afterwards". Consistent.
- Item A says a closing sentence that asserts again what the same side withdrew or dropped IS a contradiction. "An answer cannot withdraw either
  passage, and it does not undo a contradiction made in the closing round" matches it and the operator's 14:42 CST rule. Consistent.
- Item A's reply form requires both quotes "word for word, each from the round it stands in". "Quote only from the rounds, never from an answer"
  and the [CRQ]/[DRQ] header ("NOT A ROUND, NEVER QUOTE FROM IT") agree. The Record checks quotes against the stored rounds, not the prompt, so a
  quote from an answer cannot be confirmed in any case.
- The gap: "Read the answer before you answer its candidate: it may show how the two passages can both be true." Item A gives the enforcer
  room only for a reason the earlier sentence leaves room for, inside the rounds. An answer is given after the close and may bring a new verse or
  argument. Commitment 9 tells the judges that anything beyond the passage, and any verse not already cited, is disregarded; the paragraph does not
  tell the enforcer. W2's sentence closes it: "Read it only as an explanation of the two passages: anything beyond them, and any verse not already
  cited in the rounds, is disregarded." I support it as written. W2's minor point ("the debater asked answered") is also right: in 34299 only
  the defender was asked.

## Collision with pkgCDR rev 1 (my item A feed), both in Judge Contradiction Build
- Both change Judge Contradiction Build. pkgCDR adds its code before `const cands=found.filter(` and changes the candidate `by:` text. pkgQRA adds
  its code before `const R=(lab,k)=>`, after the candidates are formed, and changes the user line, the two closing-round joins and the return. No
  anchor is shared, and pkgQRA reads the finished `cands`, so it sees pkgCDR's added candidates.
- Built both ways on s102: build_QRA on parent_s102_CDR.json, and build_CDR on parent_s102_QRA.json. All 418 nodes are byte-equal between the
  two orders.
- On the combined node: probe_QRA 22 OK. My pkgCDR cases are unchanged (11 of 12, the same C9 label error). On 34299 the candidates are J1 (the
  Luke 1:34 pair, judges and the ANTI-CHEAT CHECK) and J2 (the "ordinary means" pair, the REVERSAL CHECK). The three defender answers print
  under J1 (qra matched 3).
- Order: neither has to be built on the other first. Whichever is written first, the other is rebuilt with its own build script on the new
  fetch-back. Each script refuses only a node that already carries its own marker, and the result is the same node.
