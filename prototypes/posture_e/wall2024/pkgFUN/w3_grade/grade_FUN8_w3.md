# Grade of pkgFUN rev 8 (W1, commit eae1253a, repack d2accbae on live s105): FAIL, three findings
Grader W3 (non-builder). Written 00:38 CST 2026-11-10 (time read from the database). Claim Wall 4081.

Live while graded: s105 (version 4b5d599a) = s104 + pkgKSL rev 2. My three columns are s104, s104 + pkgKSL rev 2 (now live s105) and rev 8.
The first two columns gave the same ruling on every text below, so "live" means both.

## Checks that pass
- Rebuild: build_FUN8.cjs on pkgLIB/strip_KRO2_KSL gives the 30 patched files of pkgLIB/strip_KRO2_KSL_FUN8 byte for byte.
- Write file pkgFUN/parent_s105_FUN8.json: 418 nodes; against the live s105 fetch-back only the Shared Library differs; byte-identical to parent_s104KSL_FUN8.json.
- Size confirmed: Shared Library 604,776 to 605,441 characters (+665). No prompt text, no model call.
- Rolled-back insert through record_enforcer_log (one UNCURED and one CURED K-S3 row in rev 8's shapes): accepted, 2 rows, rolled back.
- No other log row changes on any of my 142 texts.
- Enforcement works on the listed whole-answer refusals: 18 refusals that live cures read UNCURED on rev 8 (11 new plants, 7 of my rev 7 set), including
  the two-line forms "COUNTED.\nIt should\nnot be counted." and "COUNTED. My count stands.\nCORRECTED COUNT: unchanged".
- My earlier correct-answer sets (w3_good7.json 14, w3_good_ksl2.json 16): none cured on live is refused by rev 8.

## Finding 1 (FAIL): a correct answer that live cures is refused
The cure prompt asks the judge for a CORRECTED COUNT line. A judge who accepts the grant and says his own count was wrong, then gives the corrected count
on its own line, is refused:
- "COUNTED. My count is wrong.\nCORRECTED COUNT: DEFENDER 3": live CURED, rev 8 UNCURED.
- The same with no line under it, and "COUNTED. My count is in error.", "COUNTED. My count is incorrect.", "COUNTED.\nMy count is wrong.": live CURED, rev 8 UNCURED.
- "COUNTED. My count was wrong." and "COUNTED. My count was mistaken." are cured; only the present tense is refused.
The labeled line ends pkgKSL's run, so the reader sees a listed sentence as the whole answer and never sees the correction.
My own mistake, reported: my rev 7 refusal set (w3_bad7.json) holds the bare sentence "COUNTED. My count is wrong." as a refusal. I labeled it without
considering the correction line the prompt asks for. I withdraw that label; W1 built to it (W1's open label N17). "My count" is the judge's own count, and
saying it is wrong agrees with the enforcer. "COUNTED. The count is wrong." stays a refusal in my labels.
Smallest fix I see (removes text): take "my count" out of the subject alternation of the "(count) is wrong" sentence in list B. "My count stands" is a separate entry and stays.

## Finding 2 (FAIL): E3 cures refusals that live refuses
"Yes." (or Agreed, Correct, Confirmed) alone, then a line that opens with COUNTED, is now read from COUNTED whatever follows it. Live UNCURED, rev 8 CURED:
- "Yes.\nCOUNTED is wrong."
- "Yes.\nCOUNTED is wrong here."
- "Agreed.\nCOUNTED is not what the rule requires here."
- "Correct.\nCOUNTED? No."
- "Yes.\nCOUNTED would be incorrect."
- "Confirmed.\nCOUNTED does not apply."
Each of these on one line ("COUNTED is wrong.", "COUNTED? No.", and so on) is also CURED on live and on rev 8, although "counted is wrong" is a listed
sentence. So the opening forms where COUNTED is the subject of the refusal are not enforced at all; E3 only widens the door to them.
E3 forms that stay refused, correctly: "Agreed.\nCOUNTED. That is wrong.", "Yes.\nCOUNTED. No.", "Yes.\nCOUNTED. It should not be counted.", "Agreed.\nCOUNTED. My count stands.", "Correct.\nCOUNTED: no."

## Finding 3 (FAIL): E4 cures a refusal that the one-line form refuses
- "TOUCHES NO LINK:\nI refuse to answer.": live UNCURED, rev 8 CURED ("answered: it touches no declared link or listed premise, with its reason").
- "TOUCHES NO LINK: I refuse to answer." on one line: UNCURED on live and on rev 8.
The same words pass on the next line and fail on the same line. "TOUCHES NO LINK:\nNo." and a labeled line under it stay UNCURED.

## Notes (same as live, not counted against rev 8)
- Correct answers still refused, as on live: "Acknowledged.\nCOUNTED.", "Understood.\nCOUNTED. The grant counts against D5.", "Yes -\nCOUNTED.", "The close concession stands.\nCOUNTED."
- Refusals not on the lists still cure with a note, as on live (25 of my 40 new refusals; 9 of 14 in the second set), for example "COUNTED. I do not count it,
  for the reasons given.", "COUNTED. No. My count stands as issued.", "COUNTED. I decline.", "COUNTED.\n#1 is not counted; #2 is.", and any listed refusal
  followed by a quotation or by "Thank you." (E2 makes the quotation count as text that follows, so the refusal cures).
- The reason text of an enforced refusal reads "the RESPONSE neither counts the close concession (COUNTED) nor says TOUCHES NO LINK"; it does not say a listed refusal was read.

## Files
w3_plant_FUN8.cjs; w3_good8.json (34), w3_bad8.json (40), w3_bad8b.json (14); outputs w3_plant_FUN8_good.txt, w3_plant_FUN8_bad.txt, w3_plant_FUN8_bad8b.txt,
w3_plant_FUN8_rerun_good.txt (30), w3_plant_FUN8_rerun_bad.txt (24).
