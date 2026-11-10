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
