# pkgQRD labels (W2, item C option 1: redirect repeated contradiction questions; written before the build, 10:5x CST 11-10)
Operator: "1." at 10:45 CST 11-10 in W2's thread, answering item C (option 1, redirect repeated questions). Finding: pkgQRC/itemC_second/finding.md.
Base live s109 (fetchback_live_s109.json). Nodes: QR Check and QR Final only (plain Code nodes). The question round runs only when question_trial is on (dry regrades).

Rule built: after the three judges' first questions, a judge whose contradiction question to a debater names the same closing round and the same
earlier round as an earlier judge's (in seat order) contradiction question to that debater, with one earlier quote containing the other or one
closing quote containing the other, is returned once with one new sentence:
 "Another judge already asks the <side> about the contradiction between <earlier round> and <closing round>. If you see a different contradiction
  in that debater's closing round, ask about it instead; if you see none, keep your question."
The one-question rule stays. A judge already returned for a fault gets the sentence added to its return. In QR Final, for a side returned only
because it repeated: the second reply's question is used if it passes the checks; if it fails, the first question is kept (never dropped).

Expected (any other result is a FAIL):
- Q1 only QR Check and QR Final change; sizes measured; the new sentence is the only new prompt text.
- Q2 34108 stored question round (dry regrade execution 34299): luna's defender question stands; chatgpt and sol are returned on the defender side
  only, each with the sentence naming CR3 and CR4; no challenger side is returned (three different questions); no fault list changes.
- Q3 every other stored QR Check input on the mount (if any): no return where no two judges share a contradiction pair.
- Q4 QR Final plants on 34299, chatgpt's second reply: (a) a different contradiction that passes: used, status PASSED ON RETURN, record notes the
  redirect; (b) a second reply that fails a check: first question kept, status PASSED, record notes "redirect reply failed, first kept";
  (c) the same question again: used (it passes). The challenger side of a redirected judge keeps its first question in all three.
- Q5 a judge returned for a fault on the challenger side and a repeat on the defender side: both noted in one return; the faulted side follows
  today's rule (dropped if the second still fails).
- Q6 two contradiction questions that share the rounds but no quote: not a repeat. Non-contradiction questions are never returned for repeating.
- Cost stated: each return is a full judge call instead of the no-op call (34299 first asks: about 75,000 to 77,000 prompt tokens each, measured).

## Rev 2 (W3 FAIL, Wall 4196): an earlier judge counts as "already asking" only when its first reply has no fault on either side
(a judge returned for a fault may change or lose its question). Added before rev 2 was run:
- Q7 luna faulted on the challenger side: luna not counted; chatgpt stands; sol redirected by chatgpt. luna and chatgpt both faulted: no redirect.
- Q1 to Q6 as before.

## Rev 3 (W3 FAIL of rev 2, commit 8a6d1c31): the earlier judge must be fault-free AND not itself redirected on that side. Written before rev 3 is built or run.
- Q8 chain plant: judge 1 repeats judge 0, judge 2 repeats judge 1 but not judge 0 (judge 2's quote is inside judge 1's, not judge 0's):
  judge 1 is redirected against judge 0; judge 2 is NOT redirected (judge 1 is redirected); judge 2's question stands.
- Q9 exhaustive walk, 3 judges, defender side: each judge's first question is one of 9 (closing quote X, Y (first part of X), Z (second part of X),
  W (other sentence), each with earlier quote E or E2, or a non-contradiction question), and each judge is fault-free or faulted on the challenger
  side; every redirected judge's second reply is one of (fails, a new passing contradiction, the same question). Required in every case:
  (i) every contradiction question that passed first is still asked by some judge after QR Final (its own, or a judge whose final question
      names the same rounds with one quote inside the other);
  (ii) no defender question that passed first is DROPPED;
  (iii) every judge that is counted as already asking keeps its first defender question;
  (iv) live s110 returns no judge for a repeat (only for faults).

## Rev 4 (W1 FAIL of rev 3, Wall 4202): two questions are the same contradiction only when BOTH quotes overlap (earlier inside earlier AND closing
inside closing). Written before rev 4 is built or run.
- Q10 W1's plant: two judges quote the same round 3 sentence against different closing sentences: neither is a repeat; nobody is returned.
- Q9 walk again, with the check (i) made strict: a first contradiction question counts as still asked only by a final question whose earlier
  quote AND closing quote overlap it (rev 3's walk used the same OR as the code, so it could not see this loss).

## Rev 5 (W1 FAIL of rev 4, Wall 4207): a judge is redirected only when its earlier quote lies inside the standing judge's earlier quote AND its
closing quote lies inside the standing judge's closing quote (equal or narrower). A wider question is never redirected. Written before rev 5 is
built or run.
- Q11 W1's plant: luna asks Y (part of X); chatgpt asks X (Y plus more); sol asks Z, faulted, second reply fails. chatgpt is NOT redirected and
  keeps X. Reverse order (chatgpt X first, luna Y second): luna IS redirected against chatgpt.
- Q9 walk again, check (i) made directional: a first contradiction question counts as still asked only by a final question whose earlier quote
  contains it AND whose closing quote contains it (rev 4's walk accepted overlap in either direction, so a narrower final question counted as
  covering a wider one; that is why it could not see W1's loss).
- Q8 chain and Q10 as before.
