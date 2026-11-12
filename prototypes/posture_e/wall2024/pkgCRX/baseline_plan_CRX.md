# Baseline replay plan for pkgCRX: run 34726 J1 on the OLD judge prompt (W2 draft for W4)

Why: in ASK 125, 34726 J1 split on the new prompt (CONFIRMED on send 1, NOT on send 2). Only one stored old-prompt reply exists (CONFIRMED). With no old-prompt baseline, we cannot tell whether the package caused the split or the item varies anyway.

## W2 reading of the two items (no model call)
- 34726 J1, "The "her seed" of Genesis 3:15 fits and is not an independent proof" (CR2) against "Genesis 3:15 carries my D4 on its own words" (CR4): a contradiction on the words. "On its own words" is an independent proof.
  - Send 2's NOT gives as its reason "the closing says only that it supports the narrowed D4". The J1 CLOSING BLOCK holds no narrowing: its [L4] row ends "Genesis 3:15 carries my D4 on its own words". The "narrowed D4" text is in the next candidate's block (J2, "## D4 NARROWED ... Genesis 3:15") and in the rounds themselves.
  - So the misreading can come from the block layout, since J2's block sits right under J1. It can also come from the rounds alone. The text cannot settle which; the baseline below does.
- 34852 J1: the model reads NOT on both sends, as the stored old reply did. Its reason, "the narrower inference ... which that withdrawal left room for", is a defensible reading. Both W2 and W3 had called this case weak. It is the item, not the package. I withdraw it as an expected CONFIRMED.
- 35296 J2 (not a must-item): NOT, then CONFIRMED. Send 2 gives W3's reading. This is a move toward the ruling, not a fault.

## Calls
- Request A, OLD: the stored 34726 judge prompt (crx_stored_judge_prompts.json, id 28739 row for 34726; byte-equal to the old code's build), with the same system message, deepseek-flash, temperature 0, max_tokens 64000. 4 sends.
- Request B, NEW: the ASK 125 body 34726_CRX (ask_bodies.json, sha 044521c6). 2 more sends, giving 4 new samples in all with ASK 125.
- 6 calls. Resend rule as before: a failed send is resent once, up to 8 calls.

## Cost
- ASK 125 MEASURED: 0.092 USD for 10 completed calls, so 0.0092 per call. 34726 is the largest of the five bodies (MEASURED: old prompt 140,145 characters, new 141,795, against a five-body new average of 134,822), so allow 0.011 per call.
- ESTIMATE: 8 calls x 0.011 = under 0.09 USD; 6 calls with no resend about 0.066 USD.

## Decision rule
- If OLD gives NOT on at least 1 of its 4 sends, the item varies without the package. The 34726 J1 split is not a regression, and pkgCRX passes on its other must-items (all held in ASK 125).
- If OLD gives CONFIRMED on 4 of 4 and NEW gives NOT on at least 2 of its 4 samples, the package is at fault. I build rev 2, which prints all CLOSING BLOCKs after the candidate list instead of under each candidate, so no block sits beside another candidate's line.
- Anything between these is reported with the replies quoted, for the graders.
