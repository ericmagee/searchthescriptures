# W3 grade: pkgF3A sketch (a), one retry of the same alternate (W2, commit 0119cef7), on live s110, execution 34626
Labels labels_F3A_w3.md (commit dc7da98f, before any candidate run). Scripts r2.cjs (offline walk of round 2, each stub run as n8n runs it), w3_F3A.cjs. Output w3_F3A_out.txt.

## Verdict: FAIL, narrow. The retry itself works. One record line is dropped (finding A) and I want it closed before a write.

## Size (measured): only "Second Alternate?" differs, 2,274 to 2,723, +449 code. 418 nodes, connections equal. No prompt text.

## Results
- G0 OK. Live Second Alternate? rerun equals the stored output.
- G1 OK. 34626 (haiku "JSON did not parse" for luna): the candidate runs round 2 for luna with haiku again; R2 Alternate Build builds the call.
- G3 unusable twice (the stored unparseable haiku reply planted as the round 2 reply). The walk ran every round 2 code node to the final Alternate Merge with no error.
  The seat stays unfilled, no third call can follow (Second Alternate? is fed only by Alternate Merge 1), and both tries are in alternates_tried. OK.
  FINDING A (FAIL): luna's written row carries ONE "ALTERNATE TRIED" line, not two. The final Alternate Merge adds a round 2 line only when its text is not already in round 1's row, and a second failure with the same text is the same line. A real second failure of the kind "returned content null (finish_reason length)" has the same text every time, so the retry leaves no line in the judge's row. alternate_round2 reads result "lines 0".
  FINDING B: alternate_round2 in the merged output reads tried [] and has no retry field; nothing in it says the round was a retry of haiku.
  Closing condition for A and B (for W2 to write): a retry's round 2 line is written in the removed judge's row even when its text equals round 1's, and the merged record names the retried model.
- G2 good retry (a usable verdict planted as the round 2 reply): the reply was read as usable and went through the round 2 rule checks. It ended NOT SEATED for uncured items, because the alternate's cure, enforcer, send-back and gate calls are not replayed. Seating after a good retry is NOT SHOWN by me (replay limit), not a fault found.
- G4 good first reply. Round 1 seated; NOT SEATED for uncured items; guards; a timeout text: candidate equals live apart from the empty a2r.retry key. OK.
  "No alternate tried": a2r.free reads ["haiku"] where live reads []. That is the family exemption, record only, run stays false. The only readers of a2r are Second Alternate? and Alternate Merge (seats, tried, free); the new key breaks neither.
- G5 mixed plant (pool haiku and a second model; one seat's reply unusable, the other's refused by the rules): the model refused by the rules is not called again. OK.
  FINDING C: the retried model is offered to the first failed seat in panel order, which is not always the seat whose reply was unusable. In my plant haiku (unusable for sol) was built for luna. Limit: sol is not a removed seat in the stored data, so R2 Alternate Build built only luna; the order rule is read from that output. Not harmful (the model was never tried for that seat) but it is not "the same alternate for the same seat".
- G6 the three patterns match the texts live Alternate Payloads writes ("returned content null", "returned no JSON object", "JSON did not parse"). Not retried: any other failure text (for example a failed call or a timeout). Finding, not a fault.
- G7 FINDING D: a2r.tried no longer names the retried model. R2 Alternate Build reads it to exclude models, which is what lets the retry through; as a record it now says haiku was not tried.
- G8 confirmed: Alternate Build and R2 Alternate Build carry the haiku exemption in the family rule; live Second Alternate? does not. The sketch uses the same expression.
- G9 W2's claim (b) CONFIRMED: with a second model planted in the pool, live s110 Second Alternate? runs round 2 for luna with it and live R2 Alternate Build builds its call. No code change.

## Note for the record
This walk is the first time the round 2 nodes ran on any data (the four R2 Alt nodes were NOT REACHED in every run). They ran to the end without error on both plants. That is an offline walk, not a run.


# REGRADE: rev 2 (W2 commit 47dfe25a) and rev 2s (7131abc0). Labels a365f835 before any run. Script w3_F3A2.cjs, output w3_F3A2_out.txt. 22 OK, 0 FAIL.

## Verdict: rev 2 PASS. rev 2s PASS. My closing condition (finding A, with B) is met by both.

## Sizes (measured, the file with the family exemption): rev 2 +1,190 (Shared Library +261, Second Alternate? +565, Alternate Merge +364). rev 2s +485 (Second Alternate? +349, Alternate Merge +136; no library change). No prompt text. Connections equal.

## Tests, same for both forms
- H1 same failure text twice: luna's written row carries 2 ALTERNATE TRIED lines (round 1 row: 1), the row gains exactly one line, the merged record names the retried model, both tries are in alternates_tried, seat unfilled. OK.
- H2 a different failure text the second time: 2 lines, not 3. OK.
- H3 control (round 1 refused by the rules, round 2 with another pool model): the final Alternate Merge output equals live apart from the retry keys. OK.
- H4 no round 2: the final Alternate Merge output equals live. OK.
- H5 Second Alternate? on five other round 1 outcomes: equals live apart from the new keys and the family exemption in a2r.free. OK.
My first H3 was a wrong control (it planted an unusable round 1 reply, which is the retry case); corrected before the result was counted. It showed the note below.

## H6, H7 and my judgment on findings C and D
- C (two unfilled seats): rev 2 gives the retried model only to the seat whose reply was unusable (my plant: haiku is refused for luna with "G5 (pkgF3A) ... retried only for sol"). rev 2s gives it to the first failed seat in panel order (my plant: luna).
- D: rev 2 keeps the retried model in a2r.tried and adds retry_for. rev 2s leaves it out of a2r.tried and names it in retry.
- JUDGMENT: C and D left open do NOT fail rev 2s. C: the model was never tried for the seat it goes to, which is what the live round 2 rule already does with any free model; a seat is still filled or tried, and no reply the rules refused is asked for again. It needs two removed seats in one debate, which no stored run has. D is a record field; the retry is named in alternate_round2.retry and both tries are in alternates_tried. Neither is a silent drop or a wrong verdict.
- So the smaller form is enough: +485 with the family exemption (+439 for the retry, +46 for the exemption; on 34626 the retry does nothing without the exemption).

## Note for the choice between the two sketches (not a fault)
With a second model in the pool and an unusable first reply, both forms call the first model again and the untried model is not called (live would call the untried model). There is one round 2 only, so the retry and the second pool model do not add up: whichever stands first in the pool is called.

## Limits (unchanged)
Seating after a good retry is not shown (the alternate's cure, enforcer, send-back and gate calls are not replayed). Failure texts other than the three patterns are not retried.
