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
