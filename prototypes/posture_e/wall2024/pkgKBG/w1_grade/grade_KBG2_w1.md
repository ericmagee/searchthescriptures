# W1 regrade of pkgKBG rev 2 (Wall 3859, commit 7d44d79): FAIL, one fix (narrow the joined-clause exception)

Reproduced: build_KBG2 on base_s94_KVQ.json byte-equal to parent_s94_KBG2.json; probe_KBG2 30 OK; replay_KBG2 42 runs, 68 KEEP rows, 0 differ; probe_VP3_on_KBG2 40 OK.
Rolled-back insert of 2 rows (panel send_back UNCURED with the pkgKBG reason, panel CURED): accepted, rows 2.
FIX 1 of 3857 is done: w1_plant_KBG2.cjs M3-M7 (plain, bullet, bold heading, [L1], verse label) all UNCURED; M1 and M2 (CR2 with and without heading) both CURED, now consistent.

FIX (joined-clause exception). Rev 2 leaves any grant sentence with ", and", ";" or "and I" uncut. Plants (same file):
- J1 "- I grant it is said of Joseph, and of Mary." CURED
- J2 "I grant the dating, and I grant the espousal." CURED
- J3 "I grant it is said of kings; Matthew 1:6." CURED
- J4 "I grant it, and the verse still names no father of Jesus." CURED (correct: a further clause of substance)
Stored rounds, 45 runs (my split, opening formatting stripped): 674 sentences pass the bare test, 56 are left uncut by the exception. Of the 56: 4 qualify only by a ";" or "and" inside parentheses, e.g. 33371 CR2 "I accept that she is "Joseph her husband's" betrothed wife (Matthew 1:19-20; Deuteronomy 22:24)."; 21 qualify only by a clause that continues the grant (", and that ...", "and I grant/accept ...", ", and of/to/the ..."), e.g. 33371 CR3 "I grant that she was Joseph's wife in law during the espousal, and that "came together" (1:18) is the taking home."; 31 carry a further clause of their own (e.g. "I grant it, and I do not say Luke 2:49 withdraws Luke 2:48's title."), which the stated rule rightly keeps.
Ask: read the joined test on the sentence with parenthesised text removed, and do not count a joined clause that only continues the grant ("and that", "and I grant/concede/accept/allow/affirm", or "and" plus a noun phrase with no verb of its own). The CR2 sentence and J4 stay CURED under that rule.
Never looser than live; record-only (ruling 428).
