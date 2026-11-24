# ASK 611 build rev 0 (W4, 11-24): stop four extra copies of the debate in the judging
Plan: ask611/w4/plan611.md e597b4ff (W1 PASS, Wall 11647).
Base: live engine ff7ab4cf and child ecdc6218.
Targets: target_engine_611.json (66e3e781, rev 1) and target_child_611.json (afc58aff). The child changes only in its Shared Library, so that the Library stays equal across the pair.
Build: build611.cjs.

## Changes, in plain words
1. QR Merge
   - It no longer puts out a second copy of the three judge requests. It still runs qrAdd on each, so a missing anchor still fails the merge as before.
   - It puts out the judges without the body, plus the question-round text.
2. The readers of QR Merge rebuild each judge request with QR Merge's own qrAdd text, from the Panel Build request plus the question-round text. One snippet replaced the old one at every place it stood:
   - Shared Library LIB lines 620, 1523, 1934, 2297, 3266, 3332 and 3493 (in engine and child alike);
   - Panel Check;
   - Reserve Build.
3. Alternate Pass Call: the "Panel Build" piece of the child input rebuilds the judge requests the same way. The child receives the same input as today.
4. Panel Judges Prep
   - It no longer puts out the body. Nothing else in its items changes.
   - Panel Judges Parallel's jsonBody (was "$json") now builds the body at the moment it is sent, by Prep's own steps: the same P1, P23 and ORF text, and the same choice between the question-round body and the Panel Build body.
5. Close Enforcer Build: copy 2 no longer carries a body; it carries temperature 0.6 and body_from_copy 1.
6. Close Enforcer Record rebuilds copy 2's request as copy 1's with temperature 0.6, for the prompt in its log rows (W1 N1).
7. Close Group Batch Build puts out {bt, k} only.
   - Close Group Batch Call openrouter's jsonBody (was "$json.body") fetches the request at send time from Close Enforcer Build or Assume Check Build, by the same filter and index. For copy 2 it uses copy 1 at temperature 0.6.
   - Close Group Retry Build fetches the request the same way.
Nothing is deleted. No prompt, reasoning or model setting changes.

## Tests (t611.cjs, out_t611.txt; on 42234's and 42071's stored rows)
T1, every case PASS on both rows:
- the readers' QR-merged Panel Build equals the old one;
- every Library key carries the rebuild at every site;
- the child input "Panel Build" piece equals the old one (42234: 888,418 characters);
- the three judge requests posted equal the old ones (md5 per request), with and without the question round;
- the five close batch requests sent equal the old ones;
- the retries equal the old ones;
- Close Enforcer Record's prompts equal the old ones.
T2, what the four steps hold:
- 42234: 3,208,947 characters fewer (QR Merge 888,364 -> 464; Panel Judges Prep 888,628 -> 572; Close Enforcer Build plus Batch Build 2,312,882 -> 879,891).
- 42071: 2,187,621 fewer.
T3: standing 29/29; pair Library Check PASSES (lib 802077b0878612c9, map 86cbe4d352598877).

## Write
write/write611.sh: engine, then child. It refuses while a run is live, or when live is not ff7ab4cf / ecdc6218. It re-runs t611, standing and pair, saves the revert files, then fetches back.
If ASK 601 is written first, re-cut with B611E/B611C on its fetch-back.

## Open, said plainly
- The two jsonBody expressions were tested as JavaScript, offline. They have not run in n8n's own expression evaluator. A precedent is QR Ask's jsonBody, which runs ORF-style code with a Map in an expression on live today. The first live run is the proof.
- Found while building, not in this ASK: Close Enforcer Resume ("return $('Close Enforcer Build').all()") and Close Enforcer Needed? pass the close items on, which is one more copy each. After this change that is about 650k each on 42234, a candidate for a next step.

Rev 1 (for W1 grade 60c7aeb8, Wall 11649):
- F1 (rule 1): Panel Judges Prep no longer defines ORF or qt. ORF moves, unchanged, into the Panel Judges Parallel expression, its only reader. Prep keeps P1 and P23, which it reads for the provider. The expression no longer carries P1 or P23.
- F2 (rule 10): both jsonBody expressions (Panel Judges Parallel; Close Group Batch Call openrouter) carry an ASK 611 comment inside.
- Reran: t611 T1 ALL PASS on rows 42234 and 42071 (35 PASS), T2 saves 3,208,947 and 2,187,621; standing 29/29; pair Library Check PASSES (lib 802077b0878612c9, map 86cbe4d352598877). Engine 66e3e781, child afc58aff (unchanged).
