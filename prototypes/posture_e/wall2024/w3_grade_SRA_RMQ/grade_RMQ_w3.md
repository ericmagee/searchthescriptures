# pkgRMQ (W1; ASK 174, run 36156 finding A) : W3 grade

File graded: wall2024/pkgRMQ/parent_s174_RMQ.json, sha256 f14751a32619da66 (on live s174).

## Verdict: NOT PASSED (finding F1: wrongful refusals against a judge). The must-case holds.

## What holds (MEASURED this turn)
- Identity against fetchback_live_s174.json: Shared Library only, code +1,808; connections equal; 443 nodes. Packing: 43 stubs, 2 throwing.
- Builder's test rerun by me: 15 of 15.
- The 36156 form (retraction quoting "Matthew 1:22 gives its own reading of the word", the answer graded MISSES): base CURED, new UNCURED (my plant W3).

## F1: the 6-word window and the short-answer branch refuse honest retractions
The operator's ruling of 11-06: "A judge keeps its seat when it honestly retracts a wrong break, with a quoted reason." An UNCURED K-G4 item counts against the seat. Run through the builder's own harness (w3/grade_RMQ/w3_plants.cjs), base against new:
- W1. The missed answer is short ("of the Holy Ghost", under 6 words). The judge retracts quoting ANOTHER sentence, of a later round [CR4], that holds those words. Base CURED, new UNCURED. Real answers this short are common: the stored 36156 verdict of that judge holds "I grant it", "I grant the reach", "These give a status" as ANSWER fields.
- W2. The missed answer holds verse words. The judge retracts quoting a later, different answer [CR4] that quotes the same verse (6 words in a row shared, all of them the verse). Base CURED, new UNCURED.
In both the quotation is not the answer the judge graded a miss. The refusal is wrong and removes a seat's cure.

## Fix asked (sketch run by me: w3/grade_RMQ/rmq_idea.cjs, 8 lines as expected)
Carry the round of each graded answer with it (acq as answer plus round). A quotation is the missed answer only when its round label equals that round AND one text holds the other whole (the quotation holds the whole answer, or the answer holds the whole quotation of 6 words or more). Result on my forms: the 36156 form, a longer quotation holding the answer, and six words from inside the answer are refused; another sentence of the same round, a later-round sentence holding a short answer's words, and shared verse words all cure.
Limit that stays under the sketch: a short answer and another sentence of the SAME round that holds its words is still refused (last line of the sketch). If that is not acceptable, short answers need the line of the record, not words.

## Limits to carry
- (a) The grade as raised governs: the same answer graded MISSES on one line and MEETS on another still lists it (my W6). The stored 36156 verdict shows this pair after the cure.
- (b) A retraction that paraphrases the missed answer without quotation marks is outside this rule (it has no quoted reason and fails as on live).
- (c) Size as measured by the builder: code +1,808; prompt +88 per tagged item.
