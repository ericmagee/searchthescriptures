# pkgFUN rev 10 (W1): rev 9 with W3 Wall 4090 and W2 Wall 4091 fixed. Offline; for grading only; no write request until the operator answers ASK 7.

Rule in one sentence: a K-S3 answer that opens with COUNTED (or "Yes."/"Agreed."/"Correct."/"Confirmed." alone, then COUNTED as its own sentence on the next
line) is cured unless the whole answer, with the lines under it, is one listed refusal, and then it reads UNCURED; TOUCHES NO LINK reads exactly as on s105.

Changes against rev 9 (build_FUN10.cjs):
- W3 4090: every entry whose subject or object is a bare count noun moves from the enforced list to note only (the note stays, as on live):
  "the/that/this count is wrong (not right, mistaken, an error ...)", "I do not accept the/this/that count", "I withdraw/retract my/the count",
  "On reflection, I withdraw my/the count". Reason: the enforcer's charge is that the judge's count is wrong, so a correct answer can say any of these
  about its old count and then give CORRECTED COUNT, a labeled line the reader does not see.
- W2 4091: E4 dropped. "TOUCHES NO LINK:" with its reason on the next line reads as on s105 (UNCURED); W3's 4076 request is given up in this package.
  The live gap W2 traced (a refusal of 5 or more words as the reason cures) is sized separately in pkgTNR (operator ASK 8).

Entry review (coordinator 07:28Z): each entry left enforced, and why a correct answer cannot be that sentence alone after COUNTED with a correction under it.
- Pronoun subjects or objects (it/this/that is wrong, not right, not a concession, a courtesy, not valid, cannot stand, I withdraw it, I deny it ...):
  right after "COUNTED." the pronoun's nearest referent is the COUNTED answer or the grant, so the sentence takes the count back. A judge correcting his
  own count names it ("my count was wrong", "the count is wrong"), and those forms are not enforced.
- Bare words (Wrong. Incorrect. Not so. Withdrawn. Retracted. Struck. Not accepted. Not counted. Only in part. Under protest. No.) and "No, it should not be":
  standing alone after COUNTED they answer COUNTED itself.
- "I do not agree/accept (it)", "I disagree/object/reject", "I refuse", "I do not count/concede it", "it should not / cannot be counted",
  "the rule does not apply", "the grant is not a concession / does not apply", "the defender never granted it", "nothing in the round grants it",
  "I deny that it is a concession", "the enforcer is wrong": each denies the grant or the count of it; none can describe an old count being corrected.
- "My count stands", "the count stays as written", "I maintain my first answer": a corrected count does not stand, so these cannot head a correction.
- "I withdraw/retract my count of it" and "... after all": the count OF the grant, or a reversal of COUNTED, not the old total.
- "Counted is wrong": the subject is the COUNTED answer.

Size: Shared Library 604,776 to 605,515 characters (+739, +0.12%; rev 9 was +698). No prompt text, no model call, no log field.
Write file pkgFUN/parent_s105_FUN10.json: 418 nodes; only the Shared Library differs from live s105.

Checks
- w1_cases_FUN10.txt: 25 of 25 as labeled (labels 8ebdd953 and e4153976, before each build).
- Old cases on rev 10 (w1_old_cases_on_FUN10.txt): 5 differ from their old labels, each a label withdrawn here: N17 and F1f (count noun, now note only),
  N4, F3c, F3d (next-line TOUCHES reason, now as s105).
- W2's 623 (w2_623_base_FUN10.txt): 576 match (rev 9 583; the 7 are the next-line TOUCHES and count-noun forms, now read as the base); no case where rev 10
  is wrong and the base right.
- Every W3 grade file incl. good9, bad9 (w3_sets_on_FUN10.txt): 0 correct answers live cures refused. 5 refusals live refuses cure, all from "Yes." forms:
  the four W3 noted on rev 9 as reading like their one-line forms, and "Yes.\nCOUNTED. The count is wrong.", which now reads like its one-line form
  (cured with a note, as on live) under W3's own proposed fix.
- gate_FUN10.txt on s105: 767 node runs byte-equal, target item changes 0, 17 near-miss checks: GATE PASS.
