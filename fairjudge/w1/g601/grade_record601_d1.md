GRADE ASK 601 record, draft 1 (W3, commit 4be327a2). COMMIT: this file.
(1) ENGINE MANUAL pairs, em_pairs_601_draft1.json dbf275af: FAIL, one finding (F1, a missing comma).
(2) AAR ROW, aar_row_601_draft1.sql 84bd102c: PASS.
RULES READ: body laws of part 00.1 (no provenance, no operator's name); ASK 497 row method; op doc v145 TWO LIVE RUNS.
OBJECTIVE MET: (1) not yet, because of F1. (2) yes.
STANDARD (ASK 599): this is text, not code.

(1) Checked by me, by SQL on the live parts:
- 03.0 is md5 a281a5db and 2,688 characters; 10.0 is md5 df2791bc and 47,439. Both equal the stated bases.
- Each of the 8 old strings stands exactly once. The 8th stands at the very end of 10.0, so the new entry is the last.
- The after lengths, computed from the pairs, are 2,780 and 51,000, matching the notes.
- Against the live code (Init Seats lines 36 to 38, Resolve Seats lines 17 to 23 of 21316a8e), these claims are all true:
  - the four-step test;
  - the family test first, so a double failure carries the family reason;
  - a missing Accept Models row drops nothing;
  - Resolve Seats stops on a panel judge with the quoted line;
  - the reserve becomes null;
  - alternates are filtered;
  - D.mc_seat / C.mc_seat against D.model / C.model.
- Neither file holds the operator's name or an em dash. "(ASK 601; ...)" in the entry head follows the 14 existing "(ASK " heads in part 10.0.

F1: pair 10.0 #2 drops the "and" but leaves no comma. The live sentence reads "...(qwen, ...; deepseek, which judges nowhere, md_notes_rulings 421) and without a seat of the same `FAM_PANEL` family...". After the pair it reads "...md_notes_rulings 421) without a seat of the same...", with no comma between the list items.
Fix: start the old string at "421) and without a seat of the same `FAM_PANEL`..." and the new string at "421), without a seat of the same `FAM_PANEL`...".

N1, your open question on the single judge. The code does not test the single judge for the same model. Init Seats draws single_judge from free.filter(s => s !== 'sonnet' && not time-removed && not a debater's family); there is no __SAMEM test. The manual already says the single judge is "not sonnet" (10.0, "The single judge ... is the first free seat that is not time-removed, not of a debater's family and not sonnet"). I recommend one Limits sentence: "The single judge's draw has no same-model test; it is already not sonnet, the one judge seat that now shares a debater's model." Without that sentence, "a judge seat ... does not sit" reads wider than the code. This is a note, not a FAIL, because the rule text names the panel, the reserve and the alternates only.

(2) AAR row, checked:
- The values agree with my files: target 9cb87181; readback 1725ad0d, with the reversal md5s 39d84307 and caea9e6c; build grade Wall 11625, commit 5e7ed949.
- objective_met 'in part' is right. The rule is UNEXERCISED, and TWO LIVE RUNS is owed.
- The W3 reads by head only, and the audit id not read by W3, are stated.
- The session line is the coordinator's, with checks at the end, in the ASK 497 form.
- The manuals field is "NOT WRITTEN". After the manual write, a row revision follows, as stated.
