# W3 grade of pkgFUN rev 5 (W1, commit a88345aa): FAIL, one class, with a measured fix

## Scoreboard
- W2's 210 cases through the nodes (w3_ks3_210_FUN5.txt): live library 140 match (19 correct answers refused, 51 refusals cured); rev 5 188 match, 0 correct answers refused, 22 refusals cured. Rev 5 is not worse than live on any of the 210.
- My earlier tables of correct answers (52 texts, w3_good2, 3, 4, 4n): 0 refused.
- My 36 NEW correct answers (w3_good5.json), through the nodes (w3_plant_FUN5_nodes.txt): 4 read UNCURED. Live reads all 4 CURED, so rev 5 IS WORSE THAN LIVE on these 4:
  1. "COUNTED. I withdraw that. The grant is a close concession of D6 and I add it to my count."
  2. "COUNTED. I retract it. My first reply called the grant a courtesy; it is a concession of D6."
  3. "COUNTED. Withdrawn. I mean my objection; the grant concedes D6."
  4. "COUNTED. No. 1 of the flagged grants is a close concession of D6."
- My 13 new refusals (w3_bad5.json): 10 UNCURED; 3 read CURED ("COUNTED! I disagree.", "COUNTED. I refuse? No: I refuse.", "COUNTED. Is it? It is not a concession."), the safe direction; live reads all 3 CURED.
- Write file against live s102: only the Shared Library differs, connections equal. Against live s103 (pkgKBF written since) the three Send Back Record nodes differ too, so the file must be rebuilt on the s103 fetch-back before any write.
- Rolled-back insert of a NOTED CURED row and an UNCURED row: {"rows": 2, "recorded": true}.

## The class
The first sentence after COUNTED is a bare pointer or one word from list P ("I withdraw that", "I retract it", "Withdrawn", "No"), and the next sentence shows it points at the judge's own earlier objection, or (case 4) the period is not a sentence end. Rev 5 reads the first sentence alone and enforces. In a follow-up the judge has an earlier answer to point at, so the form is natural.
This is in my own rule: w3_first_sentence_idea.cjs enforces the same four (W1 built it faithfully; 0 differ). My miss: I did not plant a first-sentence pointer followed by its explanation.

## Fix, measured (w3_pointer_idea.cjs, a sketch, not a package)
List P (sentences that point: that / this / it / one word) is ENFORCED only when it is the whole answer after COUNTED; when text follows, it is NOTED. List B (sentences that name the count or the grant) stays enforced as the first sentence. "!" directly after COUNTED is read as a stop.
- My correct answers, all tables: 0 of 88 enforced (rev 5: 4).
- W2's set, the 194 cases that open with COUNTED, narrow column, reader level: 172 match, 0 correct refused, the same 8 labeled-ENFORCED cases not enforced as rev 5; no case loses enforcement against rev 5.
- My refusals: bad5 11 of 13 enforced (rev 5: 10); bad2, 3, 4, 4n unchanged.
- Cost, stated: "COUNTED. That is not right. The grant is a courtesy." (a P sentence followed by more text) becomes NOTED, not enforced. Same trade as the one already before the operator (later refusals noted), one step wider.

## Not faults
- 22 of W2's old-column refusals read CURED: the trade the narrow rule states (W2's narrow column expects them NOTED or CURED).
