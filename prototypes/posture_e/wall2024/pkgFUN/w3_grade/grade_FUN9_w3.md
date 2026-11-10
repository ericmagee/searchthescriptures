# Regrade of pkgFUN rev 9 (W1, commit 2a8d082b, on live s105): FAIL, one finding
Grader W3 (non-builder). Written 01:27 CST 2026-11-10 (time read from the database). Claim Wall 4088.
Columns: live s105 (version 4b5d599a), rev 8, rev 9. 81 texts.

## Checks that pass
- Rebuild: build_FUN9.cjs on pkgLIB/strip_KRO2_KSL gives the patched files of pkgLIB/strip_KRO2_KSL_FUN9 byte for byte.
- Write file pkgFUN/parent_s105_FUN9.json: 418 nodes; only the Shared Library differs from the live s105 fetch-back; it holds the rev 9 edits and no rev 8 marker.
- Size confirmed: Shared Library 604,776 to 605,474 characters (+698). No prompt text, no model call.
- Rolled-back insert through record_enforcer_log (rev 9's UNCURED and CURED K-S3 row shapes): accepted, 2 rows, rolled back.
- No other log row changes on any text.
- My rev 8 finding 1 is fixed for "my count": the five forms cure, with and without the CORRECTED COUNT line. "My count stands." stays UNCURED.
- My rev 8 finding 2 is fixed: the six "Yes." then "COUNTED is wrong." forms read UNCURED as on live. "Yes.\nCOUNTED." with ". : , ; -", bold, or nothing after it cures (9 forms).
- My rev 8 finding 3 is fixed: "TOUCHES NO LINK:" with "I refuse to answer." / "No reason is needed." / "None." / "N/A" on the next line reads UNCURED, also with a blank line,
  a bullet, or no colon. Six correct next-line reasons cure.
- Consistency: every next-line form I planted reads as its one-line form reads on rev 9.

## Finding (FAIL): a correct answer that live cures is refused, the same fault as rev 8 finding 1 with another subject
The judge accepts the grant, says the count is wrong, and gives the corrected count on its own line. Live CURED, rev 9 UNCURED:
- "COUNTED. The count is wrong.\nCORRECTED COUNT: DEFENDER 3"
- "COUNTED. This count is wrong.\nCORRECTED COUNT: DEFENDER 3"
- "COUNTED. That count is in error.\nCORRECTED COUNT: DEFENDER 3"
- "COUNTED. The count is not right.\nCORRECTED COUNT: DEFENDER 2"
- "COUNTED.\nThe count is mistaken.\nCORRECTED COUNT: DEFENDER 4"
- "COUNTED. The count is in error.\nCORRECTED COUNT: DEFENDER 3\nCORRECTED STANDING: CHALLENGER"
The enforcer's own charge under this rule is that the count is wrong, so "the count is wrong" after COUNTED agrees with the enforcer. The reader cannot see the
CORRECTED COUNT line (a labeled line ends pkgKSL's run), so it cannot tell this answer from a refusal.
My own mistake, reported: in my rev 8 grade (Wall 4085) I wrote that "COUNTED. The count is wrong." stays a refusal. I did not plant it with the correction
line. That label (mine, from the rev 6 grade) is withdrawn. W1 built rev 9 to it.
Smallest fix I see (removes text): in list B keep only "counted" as the subject of the "(...) is wrong" sentence; drop "the count", "that count", "this count".
"COUNTED. The count is wrong." alone then cures with a note, as on live.

## Notes (same as live or as the one-line form, not counted against rev 9)
- Correct answers still refused, as on live: "Yes.\nCOUNTED (the grant counts against D5).", "Yes.\nCOUNTED against D5.", "Yes.\nCounted." The first two cured on rev 8; the fix of finding 2 gave them up.
- Refusals not on the lists cure in the "Yes." form exactly as their one-line forms cure on live: "Yes.\nCOUNTED, wrongly.", "Yes.\nCOUNTED - no, it is not a grant.",
  "Agreed.\nCOUNTED!? No.", "Yes.\nCOUNTED. No.\nMy count stands." Live refuses these four only because of the "Yes." line.
- "TOUCHES NO LINK:\nI will not answer this." and "TOUCHES NO LINK:\n. I refuse to answer." cure, as their one-line forms cure on live.
- "COUNTED. The count stands.", "COUNTED. My count is right.", "COUNTED. My count is not wrong." cure with a note, as on live.

## Files
w3_plant_FUN9.cjs; w3_good9.json (29), w3_good9b.json (4), w3_bad9.json (43), w3_bad9b.json (5); outputs w3_plant_FUN9_*.txt.
