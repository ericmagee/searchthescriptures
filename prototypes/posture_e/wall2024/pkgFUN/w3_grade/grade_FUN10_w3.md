# Regrade of pkgFUN rev 10 (W1, commit 33e87cce, on live s105): PASS on the code, one stated limit
Grader W3 (non-builder). Written 02:18 CST 2026-11-10 (time read from the database). Claim Wall 4093. Grading only; no write is requested.
Columns: live s105 (version 4b5d599a), rev 9, rev 10. 141 texts. Labels committed before any run (commit 96e6aac6).

## Checks
- Rebuild: build_FUN10.cjs on pkgLIB/strip_KRO2_KSL gives the patched files of pkgLIB/strip_KRO2_KSL_FUN10 byte for byte.
- Write file pkgFUN/parent_s105_FUN10.json: 418 nodes; only the Shared Library differs from the live s105 fetch-back; rev 10 marker present, no rev 8 or rev 9 marker.
- Size confirmed: Shared Library 604,776 to 605,515 characters (+739). No prompt text, no model call.
- Rolled-back insert through record_enforcer_log (rev 10's UNCURED and CURED-with-note row shapes): accepted, 2 rows, rolled back.
- No other log row changes on any text.

## My rev 9 finding: fixed
All ten forms of "COUNTED. The/This/That count is wrong (in error, not right, mistaken)." with the corrected count on its own line cure, as on live.

## New correct answers (w3_good10.json, 30): 30 cured, none refused
They sit next to the entries still enforced: "My count stands corrected.", "My count no longer stands.", "I do not refuse.", "I do not object.",
"Not under protest.", "It cannot stand uncounted.", "The enforcer is right.", "I do not maintain my first answer.", "I withdraw my objection.",
"I withdraw my earlier count." / "I retract the count." / "I do not accept my earlier count." with the corrected count below,
"The count stays as written, plus this grant.", and "Yes.\nCOUNTED. The count is wrong." with the corrected count below (live refuses this one; rev 10 cures it).

## New refusals (w3_bad10.json, 27): none cured
20 that live cures now read UNCURED, one for each kind of entry left enforced ("That is not right.", "Wrong.", "Not so.", "Only in part.", "I object.",
"I reject it.", "The rule does not apply.", "The defender never granted it.", "I maintain my first answer.", "The count stays as written.",
"I withdraw my count of it.", "I do not count it after all.", "Counted is wrong.", "My count stands.", "The enforcer is wrong.", "I refuse.",
"It is a courtesy.", "Under protest.", the three-line "It should / not be counted.", and "My count stands unchanged." with "CORRECTED COUNT: unchanged").
The 7 that live refuses stay refused, including W2's two next-line TOUCHES refusals.

## Both directions against live, all my rev 9 and rev 10 sets
- Correct answers that live cures and rev 10 refuses: 0.
- Refusals that live refuses and rev 10 cures: 5, all in the "Yes." form, each reading as its one-line form reads on live: "Yes.\nCOUNTED, wrongly.",
  "Yes.\nCOUNTED - no, it is not a grant.", "Agreed.\nCOUNTED!? No.", "Yes.\nCOUNTED. No.\nMy count stands.", "Yes.\nCOUNTED. The count is wrong."
  These are refusals not on the lists; they cure with a note on live in their one-line forms already.

## Stated limit (not a fault of this revision; labeled open before the run, w3_open10.json)
The reader never sees the CORRECTED COUNT line. A pronoun sentence reads the same whether the count under it was corrected or left unchanged:
"COUNTED. That is wrong.\nCORRECTED COUNT: DEFENDER 3" and "COUNTED. That is wrong.\nCORRECTED COUNT: unchanged" are both UNCURED on rev 10 (both CURED on live).
The same holds for "This is an error.", "Withdrawn.", "I withdraw it.", "Incorrect.", "It is not counted." with a corrected count below.
W1's README gives the reason for enforcing them (after COUNTED the pronoun points at COUNTED or the grant). I accept that reading as the likelier one and do
not count these against rev 10. If a judge ever writes one of these and does correct the count, rev 10 will refuse an answer that complied in substance.

## Notes, same as live
- Correct answers still refused: "Yes.\nCOUNTED (the grant counts against D5).", "Yes.\nCOUNTED against D5.", "Yes.\nCounted.", and "TOUCHES NO LINK:" with a
  true reason on the next line (six forms). Rev 9 cured the six; rev 10 gave them up to close W2's finding. They are refused on live today.
- Count-noun sentences and unlisted refusals cure with a note, as on live: "COUNTED. The count is wrong." alone, "COUNTED. The count stands.",
  "COUNTED. My count is right.", "COUNTED. My count is not wrong."
- No stored K-S3 answer says COUNTED, so nothing here is proven on a real reply; the first live COUNTED answers should be read by hand.

## Files
w3_plant_FUN10.cjs; w3_good10.json (30), w3_bad10.json (27), w3_open10.json (8); reruns of w3_good9.json (29), w3_good9b.json (4), w3_bad9.json (43);
outputs w3_plant_FUN10_good.txt, w3_plant_FUN10_bad.txt.
