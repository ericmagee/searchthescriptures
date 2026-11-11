# Grades of pkgKWN and pkgG4M (W2, Wall 4590), by W3

Against live s119 (fetchback_live_s119.json). Offline. MEASURED unless marked. Claim and plants: Wall 4592, before my first run. Scripts and outputs: repo w3_grade_KWN_G4M/ (g1 sizes and diff, g2 K-W plants, g3 the K-W rows of run 34852, g4 the gate note).

## Sizes (mine)
- parent_s119_F1.json (sha256 0527da8bc3bf9b67): code 3,245,024 to 3,245,165 = +141. Shared Library line 1403 only (+136). Connections equal.
- parent_s119_F2.json (a8b496c953343de1): +251. Lines 1134 (+541) and 1139 (-290).
- parent_s119_F1F2.json (47c91c9069b52f0b): +392; the three lines, nothing else.
W2's figures agree. Fixed prompt text 0; pkgG4M adds judge-visible text only on the items it marks (W2: +455 characters per item; not re-measured by me).

## pkgKWN (fault A, K-W NOT HELD reader): PASS WITH LIMITS
Run through cureVerdicts of the rebuilt source, live against candidate.
- 1, the stored line of sol in run 34852: live UNCURED, candidate CURED. As expected.
- 3 (NOT HELD after a lead, quoting another sentence), 4 (prose "It is not held against ..."), 5 (bare "not held."): UNCURED on both. As expected.
- 6 (a lead that says CONCEDED, or REASSERTED IN with its quote, then NOT HELD): the earlier form wins on both. Unchanged.
- 8, the 100 K-W and K-S3 cure rows of run 34852, RESPONSE line alone: 11 change, all sol, all "Fact granted: ... NOT HELD: ..." lines. 10 of them are CURED in the stored run through their STATEMENT line, so with both lines the stored status changes for one row only (sol, DEFENDER CR2 LINK 2 #2), which is W2's replay result. No K-S3 row changes.
- LIMIT a (plant 2): a lead joined to NOT HELD by a colon or a dash, with no full stop ("Fact granted: NOT HELD: ..."), stays refused. W2 states the reader looks after . ; ! ?; this form is one a judge may well write.
- LIMIT b (plant 7, against my expectation): NOT HELD standing inside a quotation of other words, after a sentence end inside that quotation, is now read as the judge's NOT HELD when six flagged words follow it. Live refuses it. Contrived; the DeepSeek K-W check still reads the answer for sense.
- LIMIT c (plant 10): a line opening "**NOT HELD:**" is now CURED where live refused it. A gain, not stated in the post.
- Same as live: leading spaces accepted; a NOT HELD on a second line of the RESPONSE is not read; a STATEMENT with no RESPONSE is "no written response".

## pkgG4M (fault E, gate K-G4 note): NOT PASSED
What works: the note appears on terra's stored line (a break whose GROUND names no witness left unanswered), names the pair, appears on a challenger-side break, and falls back to "D<i> vs C<j>" with no pair. An item whose line says "left unanswered" keeps the live note unchanged.
FAIL: the note's FORCED form reads FAILS: "<why that answer cannot take the meaning>". The K-F test (library line 373) accepts a FAILS only as words found in the round of the ANSWER. Planted: a FORCED line for D4 vs C1 with true MEANS and ANSWER quotations and FAILS written as a reason gives "the FAILS quotation is not in [CR3]"; with FAILS as words of the answer it gives no item. So a judge who follows the new note to the letter stays uncured. That is the fault this package sets out to end: an item whose own instruction is a path that cannot cure.
The same words are on live in the other branch of the note (line 1139, the "unanswered is false" note); pkgG4M moves them into one shared string and shows them on more items. The gate header words the same field rightly: FAILS: "<the layer of that answer that fails>", each quotation word for word.
Suggested: in the shared string write FAILS: "<the words of that answer that cannot take the meaning, quoted>". One string, both notes; about +10 characters.
Also, wording only: "a CHANGE TO that still breaks the link stays uncured" is followed by "Cure it with one FORCED line", and a FORCED line after a CHANGE TO that still breaks does cure (gate header). "stays uncured without a FORCED line" would say it.
NOT RUN by me: luna's and terra's whole gate messages of 34852 (W2's replay covers Gate Build); the stored replay of the 25 nodes.

## Combined parent
Holds the three changed lines of the two packages and nothing else. It carries the pkgG4M fault, so it is NOT PASSED as it stands. pkgKWN alone (parent_s119_F1.json) can go forward.

## pkgG4M rev 2 (parent_s119_F2r2.json, sha256 dda875af81a74c8a): PASS
Claim and expectations: Wall 4603, before any run. Script g5.cjs, output g5_out.txt (run from my scratch folder beside the export cut). MEASURED.
- Size: code 3,245,024 to 3,245,319 = +295; Shared Library lines 1134 and 1139 only; connections equal. Agrees with W2.
- (a) The note appears on terra's stored line, on a challenger-side break, and with no pair in the key ("D<i> vs C<j>"), with FAILS: "<the words of that answer that cannot take the meaning, quoted>" and "stays uncured without a FORCED line". As expected.
- (b) A line that says "left unanswered" keeps the live note; only the FAILS words change (the fault was on live line 1139 too and is corrected there). As expected.
- (c) A FORCED line with true MEANS and ANSWER quotations and FAILS as words of the answer gives no K-F item. A FAILS written as a reason is still refused by K-F, as it should be; the note no longer asks for one.
- (d) My new plant: the shared string is built at the top of the function; "link" is defined on the line above, nothing throws, no silent empty note. An item with no key gives no note, as live.
- (e) A side with no press cure gives no note, as live.
- Observation, not a fault: an item with no line text at all would carry the meaning-break note. The only caller (library line 1824) passes K-G4 items, which carry their line.
- NOT RUN by me: the whole gate messages and the stored replay of the 25 nodes (W2's replay: 402 of 403 equal). The joint file is not graded by me: it holds my own pkgVP1B rev 2.
