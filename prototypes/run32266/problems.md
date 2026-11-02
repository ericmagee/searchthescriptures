# Run ODV1-32266: problems and solutions

Run 32266, flow version d9ec1e19 (as given in the brief; the row has no column that records the flow version), the first run with the close rounds (defender round 4, then challenger round 4) and the third judge fix set (judge_fix3). Fired 10:50 CST 2026-11-02 (first node 16:50:02Z), stopped 11:42 CST (Record Alternates starts 17:41:52Z and runs 0.6 s), status success. The run took about 51.8 minutes (3,110.6 s).
Row b5fe299c (debate_results), run token ODV1-32266-dzm9ve0y. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome "DEFENDER PREVAILS"; panel_verdict and framework_verdict HELD; panel_split "3-0"; judged_by and panel_expected deepseek, gemini, sol; data_class "contested"; quarantine_reason NULL; defense standing SELF-SUPPORTED, conceded_links 0; challenge standing PROP-DEPENDENT, challenger conceded 0; both chain marks FOOTED; underdetermined_seats deepseek:COLLISION, gemini:COLLISION, gemini:RESULT, sol:COLLISION; panel_substitution NULL; drv_removed holds one entry (GLM, 14 uncured, replaced by Sol), matching the one row in odv1_drv_removals.
Seats: DeepSeek (judgment 894) HELD, 0 uncured; Gemini (895) HELD, 0 uncured; Sol (896, alternate for GLM) HELD, 0 uncured.
Cache: 100,006 tokens written, 357,603 read (input 645,822, output 503,826). Synthesis usage: "prompt=52950 completion=39027 reasoning=33957 finish=stop max_tokens=64000".

**Nothing here is applied.** Nothing was written to the database, n8n or git. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 9,119); the challenger's round 1 (engine_r1, 11,406); the defender's round 2 (claude_r2, 11,350); the challenger's round 2 (engine_r2, 9,804); the defender's link round (engine_r3, 8,251); the challenger's link round (challenger_r3, 10,731); the defender's close (defender_r4, 19,156); the challenger's close (challenger_r4, 5,496); the three judgments with their audit, cure and alternate lines (debate_judgments 894 DeepSeek 12,588; 895 Gemini 4,278; 896 Sol 12,103); GLM's removed judgment, stored only inside drv_removed (verdict_raw with its audit lines, read whole); the single judge (independent_verdict_raw, 12,419); the synthesis with its confirmation (21,616, in two parts); review_notes (3,660); out_of_round_detail; panel fields; the citation check (34,797 as text: totals, all 295 items by side, round, reference, link and load-bearing mark, every item whose status is not MATCHES); drift guards 8, 18, 57, 59 and 61, read live.
**The enforcer log** (debate_enforcer_log, 27 rows, ids 36 to 62): every row's seat, role, model, kind, rule, item, flagged_line, response_line, cure_status and cure_reason. prompt_sent holds four texts: DeepSeek's (12,492) read whole; the single judge's (12,091) and Sol's cure prompt (10,437) carry the identical rule block (characters 1 to 7,061, same md5 as DeepSeek's), and each one's FLAGGED ITEMS section was read whole; GLM's (21,478) differs from the start (it opens with the layer rule) and was read whole. full_reply holds five texts, each read whole: DeepSeek 6,571; GLM 18,118; single judge 3,145; Sol's alternate judgment (row 61, kind alternate_reply, 11,210, identical to the first 11,210 characters of judgment 896); Sol's cure 1,256. There is **no failed_reply row** in this run.
Each pressed witness was checked by reference with SQL position() in the holding side's later rounds, and its quoted words against kjv_verses. Code was read only from the local package (prototypes/judge_fix3/new), to explain one check; no execution record was read.

**Round labels.** "CR" marks the defender's rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n", with round 4 the close. **Two numbering mismatches** run through the record:
- The challenger's round-2 premise list files premise 2 ("Joseph is excluded by the text's own timeline", the defender's D1 wording) under "LINK 6", and premise 3 (the angel maxim, from the defender's round-2 section on D1) under "LINK 2". The defender's link round answers under the same labels. No judge graded a defender link broken, so the mismatch decided nothing here.
- Both closes renumber. The defender's close: "I number D1-D6 in the order of the link round: D1 the row of Matthew 1:16; D2 \"of a woman\" ...; D3 Isaiah 7:14; D4 Luke 1:34-35; D5 the lineage; D6 the means of conception", against the declared chain (D1 Matthew 1:18 and 1:20; D3 Matthew 1:16; D4 Isaiah 7:14). The challenger's close: "C1 the seed ...; C4 the means of begetting", against its six links in the link round. Sol says so ("the later renumbering in CR4 does not govern"); the single judge's K-SC statement grades its "D4" (Isaiah) by quoting the close's "D3 rests on the Greek of Matthew 1:23", which is the renumbering bleeding into a grade.

## Timings (timings_32266.json, seconds; Z times)

| Step | Start (Z) | Seconds | 32255 |
|---|---|---|---|
| Defender round 1 | 16:50:02 | 60.5 | 48.3 |
| Challenger round 1 | 16:51:05 | 307.6 | 477.9 |
| Defender round 2 | 16:56:14 | 109.9 | 181.8 |
| Challenger round 2 | 16:58:06 | **24.1** | 378.8 |
| Defender link round | 16:58:31 | 72.9 | 65.9 |
| Challenger link round | 16:59:46 | 226.8 | 340.5 |
| Defender close | 17:03:35 | 103.1 | none |
| Challenger close | 17:05:20 | 33.6 | none |
| Synthesis (DeepSeek) | 17:05:55 | 203.6 | 149.6 |
| Single judge | 17:09:23 | 209.9 | 255.7 |
| Single judge cure | 17:12:55 | 115.8 | 95.4 |
| Diagnostic | 17:14:53 | 18.6 | 12.5 |
| Panel judge 1, DeepSeek | 17:15:15 | 290.7 | 183.8 |
| Panel judge 2, Gemini | 17:20:06 | 152.2 | 153.4 |
| Panel judge 3, GLM | 17:22:38 | **619.4** | 434.2 (failed closed) |
| Panel cure 1, DeepSeek | 17:33:00 | 77.8 | 50.4 |
| Panel cure 3, GLM | 17:34:20 | **316.8** | 29.1 (ChatGPT) |
| Alternate call, Sol for GLM | 17:39:40 | 116.3 | 985.2 (Qwen) |
| Alternate cure, Sol | 17:41:38 | 12.2 | 316.7 (Qwen) |
| Record Alternates | 17:41:52 | 0.6 | 0.4 |

- No reserve was called ("Reserve Needed?" 0.0) and no Gemini cure was called (no mark on Gemini).
- The closes took 136.7 s together, below the README's estimate of 320 to 810 s. The challenger's four rounds took 592.1 s; the defender's four took 346.4 s.
- **GLM took 619.4 s for its judgment and 316.8 s for its cure: 936.2 s in all.** Each call is within your 900-second limit; together they exceed it. Whether the limit is per call or per seat is yours to say. GLM answered this time (its 32228 and 32255 failures were empty answers); it was removed for 14 uncured items (B2), not for time.
- Sol's alternate call (116.3 s) and cure (12.2 s) are the fastest alternate on record (Qwen: 985.2 s and 316.7 s in 32255).

---

## A. What the change did

1. **The first graded result: HELD 3-0, DEFENDER PREVAILS.** Every seat counted; no seat graded a defender link broken; the one challenger link graded broken by a counted seat (DeepSeek D6 vs C4) was retracted in the cure.
2. **The close rounds worked as built.** The defender's close answered every witness the challenger had cited in its link round, by reference and with the verse quoted in full (D). The witness left unanswered in 32255 by the same pairing class (Luke 1:5) is now answered in full: "Luke 1:5: \"THERE was in the days of Herod, the king of Judaea, a certain priest named Zacharias, of the course of Abia: and his wife was of the daughters of Aaron, and her name was Elisabeth.\"" (defender_r4, 12,424). Under ruling 373 every premise against the defender is answered.
3. **The C4 check stayed silent, rightly.** Every reference in the challenger's close appears in its earlier rounds (Luke 2:33, John 1:45, Psalm 132:11, Matthew 1:24, 2 Samuel 7:14 and 1 Chronicles 28:6 included), and the code writes "AUDIT v24: CLOSE-ROUND PRESS CHECK (C4)" only when it finds a new reference (Build Save Body, C4 Extract). The synthesis agrees: "The challenger's close round pressed no new verse."
4. **Sol sat and judged soundly in substance** (C). It is the only seat that found the challenger's unanswered witness (Isaiah 7:11).
5. **A6 works:** every RESPONSE line in the log is the seat's own line for that rule and item (the 32255 B5 fault is gone).
6. **A7 works in part:** S-C fired with a 12-item list (true), S-A fired three times (two true), and S-E fired once (false) (G).
7. **K-N fired once, truly** (the single judge's count of narrowings as concessions), and the cure restated the count to 0.
8. **But the outcome rests on counts that do not follow ruling 372 for the challenger** (B1), and GLM was removed on a form rule the cure prompt does not state (B2), as DeepSeek and Qwen were in 32255.

## B. Faults

### B1. Is HELD 3-0 sound? The verdict is; the challenger counts are not

| Seat | Verdict | Clause | Defender count | Challenger count | Sound? |
|---|---|---|---|---|---|
| DeepSeek (894) | HELD | HELD-1, n=6 w=0 k=0 | 0, SELF-SUPPORTED | 0, PROP-DEPENDENT | Verdict and defender count sound. Challenger count **unsound** (premise 3). CHALLENGE STANDING and CHALLENGER CHAIN MARK rest on the retracted D6 vs C4 BROKEN ("C4 ... is graded CHALLENGER LINK BROKEN at Matthew 1:25"; "it loses the Matthew 1:25 collision"), never restated. RESULT rests on the DG-8 reading (D). |
| Gemini (895) | HELD | HELD-1, n=6 w=0 k=0 | 0, SELF-SUPPORTED | 0, **SELF-SUPPORTED** | Verdict sound. Challenger count and standing **unsound** (premise 3). Its RESULT reads "UNDERDETERMINED -- Neither side broke the opposing chain", beside a HELD tag. Every collision ground names only defender rounds ("the witness Matthew 1:25 was answered in [CR2] and [CR4]"), including on lines that weigh a challenger link. Thin: no line weighs a pressed witness against the challenger. |
| Sol (896) | HELD | HELD-1, n=6 w=0 k=0 | **1** (premise 5), PROP-DEPENDENT | **2** (premises 3, 4), PROP-DEPENDENT | Verdict sound. Challenger premise 3 **right**; premise 4 right only under a full-verse reading of ruling 3. Defender premise 5 **unsound as reasoned** (below). |
| GLM (removed) | HELD | HELD-1 | 0 | 0 | Removed (B2). Challenger count unsound (premise 3). |
| Single judge (no vote) | HELD | HELD-1 | 2, cured to 0 (K-N, true) | 0 | Challenger count unsound (premise 3). |

**The verdict.** HELD-1 needs no defender link withdrawn or broken. Every premise against the defender was answered in a later defender round by reference with the words quoted correctly (the table in D), and no seat graded a defender link BROKEN. Even at Sol's defender count of 1, or at 3 under the strictest reading (below), twice the count does not exceed L=6, so the defense is at worst PROP-DEPENDENT and the verdict HELD stands. **HELD 3-0 is sound.**

**Challenger premise 3 (Isaiah 7:11) is unanswered under ruling 3, and two counted seats did not count it.** The defender pressed Isaiah 7:11 first in its round 2 ("[L1] Isaiah 7:11 sets the standard: \"Ask thee a sign of the LORD thy God; ask it either in the depth, or in the height above.\"", claude_r2 8,109) and listed it under its link-round premise 3 ("PRESSED WITH: Isaiah 7:11 \"ask it either in the depth, or in the height above\""). The challenger's later rounds:
- round 2 (3,401): "On D4: the defender says Isaiah 7:11's \"depth or height\" standard requires a sign beyond an ordinary birth. That is the defender's inference, not the verse's definition." The reference is named, but "depth or height" is not the KJV's words (kjv_verses: "ask it either in the depth, or in the height above"). By ruling 3 the verse counts only "quoted fully and correctly"; this is an answer in substance and does not count. The citation check marks both round-2 items for Isaiah 7:11 (items 101 and 129) NOT CHECKED, so the judges were never told the words differ (F).
- link round: position 0. Close: position 0 (and the close answers nothing).
Under ruling 372 premise 3 is UNEXHIBITED and counts: the challenger count is at least 1 on every seat. DeepSeek, Gemini, GLM and the single judge wrote 0; only Sol counted it ("CR2 presses Isaiah 7:11 ... DR3 neither fully quotes nor explains away this witness"). The stored challenger_conceded_links (0) is therefore wrong by one. It does not move the verdict, and the stored standing PROP-DEPENDENT is right by coincidence (DeepSeek's rests on a retracted grade). Gemini's SELF-SUPPORTED is wrong.
**Why no check caught it:** K-G6's ledger reads a verse as answered when the reference is named (the README, A8: "the ledger (isNamed; K-G6's source) need the reference named"). The prompts' challenger ledger reads "C3 -- 4 verse(s) carried; 4 named". Ruling 3 asks for the words quoted fully and correctly; the ledger asks only for the reference.
- Solution: the ledger and K-G4 to test the quoted words against kjv_verses (as the citation check does), not the reference alone; the citation check to check a quotation in quotation marks after a reference (F).

**Challenger premise 4 (Luke 1:35).** The defender pressed Luke 1:34-35 in round 1. The challenger's round 1 answers: "[L1] Luke 1:35: \"The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee.\"" (engine_r1 5,811): the reference named and the first clause quoted correctly, without the "therefore also ..." clause. Round 2 names only "Luke 1:34-35"; the link round does not name it. Answered under the reading the earlier reviews used (reference and correct words); not answered if "quoted fully" means the whole verse. Sol counts it on the second reading.

**Sol's defender premise 5 count.** Sol: "Its CR3 quotations of Luke 3:23, Luke 2:49, Acts 14:19, Acts 16:13 and the household passages are shortened, not complete verses; the lexical discussion alone cannot supply two prior layers." Two faults:
- Ruling 373 counts an answer in any later defender round. The defender's close quotes Luke 3:23 and Luke 2:49 in full (defender_r4: "And Jesus himself began to be about thirty years of age, being (as was supposed) the son of Joseph, which was the son of Heli,"; "And he said unto them, How is it that ye sought me? wist ye not that I must be about my Father's business?"). Sol did not read the close for footing.
- Sol applies the full-verse reading unevenly. By the same test, premise 1's witnesses Hebrews 7:14 ("our Lord sprang out of Juda") and 2 Timothy 2:8 ("Jesus Christ of the seed of David") and premise 2's 1 Corinthians 7:5 ("come together again") are answered only by fragments in every defender round (the close does not name them). Sol spares premise 1 on its footing and VOIDs premise 2. The household witnesses of premise 5 (Luke 2:27 "the parents", Luke 2:41 "his parents", Luke 4:22, John 6:42, Acts 16:13) are fragments in the link round and absent from the close; on the full-verse reading premise 5 would count for those witnesses, but that is not the ground Sol gives.
- The challenger's own presses were fragments of the same size (premise 5: Luke 2:27 "the parents brought in the child Jesus"; Luke 2:41 "his parents went to Jerusalem"), so the strict reading would also void much of what the challenger pressed.

**Sol's VOIDs.** Defender premises 2 and 4, challenger premises 1 and 6 are VOID for charges that add to their quotes. Each is defensible under the rule's clause ("a claim the quote's own words do not make"): premise 1's charge "Silence in Matthew 1:16 is treated as carrying no meaning" against the quote "Silence in a genealogy is not a denial of paternity"; premise 6's "The espousal is made to supply the means of begetting" against "the canon's stated means of begetting is the husband knowing his wife". They move no count that matters (every witness under them was answered).

- Solution: your ruling on "quoted fully": the whole verse, or the pressed words quoted correctly. The two readings give a defender count of 0 or up to 3, and a challenger count of 1 or 2. The verdict is HELD either way. Tell the judges which, in the rule text and in CURE_RULE.

**The defender's close: what it answered, and what it added.**
- It answered every witness still pressed, each under "ANSWER: <reference> -- <link> -- \"<the verse in full>\"": the 34 references of the challenger's link round and the round-1 and round-2 witnesses Acts 1:8, Luke 9:34, Acts 5:15, Song of Solomon 1:3, Hebrews 11:3, Genesis 2:7, 1 Corinthians 15:45, Genesis 4:17, 4:25, 1 Samuel 1:19. Every quotation in it MATCHES in the citation check (items 215 to 272). The system's list of what was still pressed (README B1) is not stored in the row, so whether the close answered that list item by item cannot be read.
- **It brought new matter the challenger had no counted round to answer.** Five references no earlier round of either side names: Leviticus 15:16 ("Seed is ordinarily the man's", 5,229), Isaiah 7:13 ("the 'you' of verse 14 is plural", 6,433), Deuteronomy 22:23 ("The label \"wife\" does not prove knowing within the espousal", 10,905), Luke 3:38 (16,683) and 1 Corinthians 15:47 (17,018). It also opens with a counter-press built on verses already cited: "**The challenger's chain breaks on its own verse.** ... The not-knowing runs to the birth, so it covers the conception." The challenger's close may answer nothing that counts ([DR4] answers nothing, README B3), though it replied in substance ("timing and covenant-language, held as written, and none of them a contrary statement about the father").
- **Does the rule allow it?** The rule as built says the close "may keep, narrow or concede; it may not press", and "[CR4] presses nothing" in the counting sets. New supporting verses are not forbidden by any text quoted in the record, and there is no D4 check like the C4 check. The counter-press paragraph is a press in substance against C4 and C6. It mattered once: the single judge's two BROKEN lines read "the defender answered in [CR4] and the challenger did not resolve it in [DR4]", grading the challenger down for not answering in a round whose answers do not count (both lines were retracted). GLM's removed D4 vs C3 line rested on the close's "four ways" argument ("Isaiah 8:3's child differs in means, mother and name").
- The close also narrowed twice ("NARROWED TO: the sign-sentence of Isaiah 7:14 is fulfilled as Matthew 1:22-23 says ..."; "NARROWED TO: Romans 1:3 says ...") and conceded limbs ("I concede that no verse states the route of Mary's descent from David"). Narrowing is allowed; graded in narrowed form, no seat counted these as concessions after the cure.
- Solution: a D4 check that lists references no earlier defender round names (mark, not strike, as B2 does for C4), and a line in the judge rule: an argument first made in [CR4] grounds no CHALLENGER LINK BROKEN, since the challenger has no counted round to answer it.

**The challenger's close.** It pressed no new reference and the C4 check rightly did not fire (A3). It did narrow ("NARROWED TO: the seed rows require seed out of a man's body ...") and kept "the narrower limb I pressed" on Isaiah. No seat counted anything from it.

### B2. Why GLM was removed and Sol sat: GLM retracted correctly, and the parser refused every retraction

- GLM answered (619.4 s): HELD, HELD-1, both counts 0, with ten CHALLENGER LINK BROKEN lines. The checks flagged 17 items (enforcer rows 39 to 55): ten K-G4, one K-B (layer), two K-DG8, four K-C. Its cure (316.8 s) wrote, for each BROKEN line, a retraction in this form: "RETRACTED: D1 vs C6 (Matthew 1:18) -- regraded UNDERDETERMINED -- [DR1] answered this witness ('The verse dates the FINDING: \"she was found with child\" -- found when Joseph came to take her') and [DR3] C6 answered it again ... -- GROUND: ...", and then "CORRECTED RESULT: HELD-1", a STATEMENT and a RESPONSE for every item.
- **The parser read none of the ten retractions**: every K-G4 row's cure_reason ends "malformed line: RETRACTED: D1 vs C6 (Matthew 1:18) -- regraded UNDERDETERMINED -- ...", then "no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it" or "unanswered-false: statement quotes CR1, but a later challenger round names the pressed witness". The answer form gives "RETRACTED: D<n> vs C<m>" alone, and also says "A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named", but gives no separate line for that regrade. GLM put the regrade on the RETRACTED line; DeepSeek wrote "RETRACTED: D6 vs C4" and a separate "RESTATED: D6 vs C4 ...: UNDERDETERMINED". The form does not say which.
- **Judgment:** correct to the coded form; **false in substance**. All ten retractions name the challenger's answering rounds and quote them. The same class as 32255 B1 and B3 (a form rule the cure prompt does not state).
- The other four uncured items:
  - K-B D6 vs C6 (row 48): "exhibits 1 layer kind (L1)". The line carries "[L1] Matthew 1:18 '...'" and "[L2] prin e sunelthein (before they came together)": a plain transliteration with its meaning, which A1 means to count. **False mark**; the A1 pattern seems not to take a three-word transliteration (inference from the result; the code path was not traced).
  - K-DG8 D6 vs C6 (row 51): **true mark** ("dates the child before any coming together"); cured in substance by the retraction, refused as malformed.
  - K-DG8 KEYSTONE (row 50): "the restated line keeps what K-DG8 marks". The restated KEYSTONE quotes the declared link ("'Christ had no biological father: his flesh came from Mary alone ...'") and grounds the grade on "[L1] Matthew 1:20 ... [L1] Luke 1:35 ... [L1] Galatians 4:4 ... [L1] Luke 3:23". The words matched are the link's own text, quoted, not the judge's ground. False in substance, the 32255 negated-clause class in a new form (a quoted clause).
  - K-C D2 vs C4 (row 55): true class ("the angel's answer names no man"); refused only because the retraction was malformed.
- Three items were cured (rows 52 to 54, K-C REASONING, KEYSTONE, CONCEDED LINKS). Two of those marks are false: GLM's KEYSTONE ("[CR3] dropped only the unstated limb that a verse names Mary's own lineage") and CONCEDED LINKS ("premise 1's 'I concede that no verse names Mary's genealogy' surrenders a limb") report the defender's own concession; neither sets a chain aside on a stating-verse ground.
- Had GLM's cure been read, its corrected result was HELD-1 with every collision UNDERDETERMINED: the panel would still be HELD 3-0. GLM's challenger count of 0 is unsound for premise 3 (B1), as DeepSeek's and Gemini's are.
- **Sol sat** because GLM was removed for uncured items (drv_removed: "drv_uncured":14, "replaced_by":"sol"; GLM's audit: "ALTERNATE TRIED -- SEAT: glm; ALTERNATE: sol; MODEL: openai/gpt-6.1-sol; RESULT: SEATED"). panel_substitution is NULL: no seat failed closed and no reserve was called. Sol drew one mark (K-DG8 KEYSTONE), cured in 12.2 s.
- Solution: let the RETRACTED line carry its regrade (read the link from the first "D<n> vs C<m>" and take the rest as the restated line), or say in the answer form that the regrade is a separate RESTATED line; skip K-DG8 matches inside a quoted declared link; count a multi-word plain transliteration with its meaning as [L2].

### B3. The single judge and DeepSeek grounded cures on [DR4]

- Single judge, K-G4 D1 vs C4 and D6 vs C6 (rows 56, 57): "RESTATED: D1 vs C4 (Matthew 1:25): UNDERDETERMINED -- [DR4] names and answers Matthew 1:25"; RESPONSE "[DR4] names Matthew 1:25 ... and answers the witness". [DR4] answers nothing (README B3). The answering rounds are the challenger's round 1 ("'Till' [L2] heōs hou ... bounds the abstinence to the pregnancy", 4,748) and link round (668). The cure was accepted ("CURED; WHY: retracted"): the result is right, the reason is false. The prompt's own rule reads "UNDERDETERMINED only with the round that answered each witness named", and [DR4] is not in its list of answering rounds.
- DeepSeek (rows 36, 37): "the challenger answered this timing row in [DR3] LINK 4 and again in [DR4]". [DR3] suffices; the [DR4] clause is surplus and wrong.
- The synthesis confirmation repeats the error: "the pressing sentences were in fact quoted in [CR3] and named again in [DR4]".
- Solution: the K-G4 and K-S cure checks to refuse [DR4] (and [CR4] as a press) as a named answering or pressing round.

## C. Each seat's grades, with quotes

**DeepSeek (894).**
- D1, D2, D5 STANDS; D3 vs C1, D4 vs C3, D6 vs C2 UNDERDETERMINED, each naming [CR4]; D6 vs C4 CHALLENGER LINK BROKEN, retracted in the cure and restated UNDERDETERMINED. Sound after the cure, except as below.
- REASONING restated (K-C, CURED) still ends on a stating-verse ground: "the challenger's inference that the flesh runs through the husband, and that Joseph knew Mary within the espousal, is carried by its own readings of the timing rows and not by a row that states it". The K-C cure check passed it on its layer kinds (L1, L2, L3). **False pass.**
- RESULT never restated: "Joseph 'knew her not till she had brought forth,' so the challenger's claim that Joseph begat Jesus is refuted". A DG-8 ground (D); K-DG8 did not mark it.
- CHALLENGE STANDING and CHALLENGER CHAIN MARK rest on the retracted BROKEN (B1). Challenger count 0: unsound (premise 3).
- Same-model audit: "seat deepseek and the single judge both ran deepseek-flash; ... defender conceded count 0 vs 2" (review only; the single judge's 2 was cured to 0).

**Gemini (895).** Every collision UNDERDETERMINED, D6 STANDS; both standings SELF-SUPPORTED, both counts 0. Grounds are one-line and name defender rounds only. No mark fired. Its HELD is sound; its challenger standing is not (B1). Its RESULT "UNDERDETERMINED" beside HELD is recorded in underdetermined_seats (gemini:RESULT).

**Sol (896).** Every collision UNDERDETERMINED, each with the answering round named; KEYSTONE restated as procedural ("STANDS records its procedural survival, not an independent finding about the route of the flesh or the occurrence of union"), a sound cure. Its CITATION CHECK line is the most exact of the panel ("The correct complete Job 25:4 quotation in DR3 can independently count"). Its counts: B1. Its DEFENDER CHAIN MARK "STRAINED -- The CR3 restatement supporting D5 exhibits lexical discussion but lacks qualifying quoted textual and cross-reference footing in its own block" rests on the same premise-5 reading and is unsound for the same reason (the close quotes the footing in full).

**GLM (removed).** Ten BROKEN lines, nine of them on Matthew 1:25 or 1:18 read against the union or on what a verse does not name (D). Its own cure retracted them all (B2).

**Single judge (independent_verdict_raw).** Original: CONCEDED LINKS 2 on narrowings (K-N, true, cured to 0); D1 vs C4 and D6 vs C6 BROKEN (retracted, B3); KEYSTONE quoting the link (K-DG8, cured). The restated KEYSTONE adds a new stating-verse ground: "and no verse states Joseph begat him" (unmarked; D). RESULT and REASONING keep the DG-8 reading (D). K-SC on D4 is a **false mark**: the line says "the defender conceded almah's breadth", a limb, not the link; cured harmlessly.

## D. Pressed witnesses, answered or unanswered (SQL position(), later rounds of the holding side)

**Against the defender** (the challenger's round-2 list; later rounds: defender round 2 for presses first made in challenger round 1, the link round, the close):

| Premise (label) | Witness | Link round (position: words) | Close | State |
|---|---|---|---|---|
| 1 (LINK 6) | Romans 1:3 | 257: full verse | 12,046 (fragment) | answered |
| 1 | Acts 2:30 | 986: "of the fruit of his loins, according to the flesh" | 11,425 full | answered |
| 1 | 2 Samuel 7:12 | 1,049: "which shall proceed out of thy bowels" | 11,138 full | answered |
| 1 | Hebrews 7:14 | 1,227: "our Lord sprang out of Juda" | 0 | answered by fragment only |
| 1 | 2 Timothy 2:8 | 1,104: "Jesus Christ of the seed of David" | 0 | answered by fragment only |
| 1 | Numbers 1:2 | 1,344: "by the house of their fathers... every male by their polls" | 13,648 full | answered |
| 2 (LINK 6) | Matthew 1:18 | 1,667: full verse from "When as" | 779 | answered |
| 2 | Matthew 1:25 | 1,972: "And knew her not till she had brought forth her firstborn son" | 597 full | answered |
| 2 | Genesis 4:1 | 2,205: "And Adam knew Eve his wife; and she conceived, and bare Cain" | 1,225 full | answered |
| 2 | 1 Corinthians 7:5 | 2,753: "come together again" | 0 | answered by fragment only |
| 2 | Deuteronomy 22:24 | 2,632: "his neighbour's wife" | 10,532 full | answered |
| 2 | Matthew 1:19, 1:20 | 2,560; 2,129 | 9,727; 979, full | answered |
| 3 (LINK 2) | Matthew 1:19, 1:20, Genesis 4:1 | Matthew 1:19 full; 1:20 from "fear not"; Genesis 4:1 named ("does not bear on this link"), quoted under premise 2 | full | answered |
| 4 (LINK 2) | Luke 1:34; Luke 1:27; Matthew 1:25; Matthew 1:20 | 3,725 full; 4,265 "a virgin espoused to a man"; named; "Mary thy wife" | 334; 11,754; 597; 979, full | answered |
| 5 (LINK 5) | Luke 2:48 | 5,094: "thy father and I have sought thee sorrowing" | 2,266 full | answered |
| 5 | Luke 2:27; 2:41; 4:22; John 6:42; Acts 16:13 | 5,153 "the parents"; 5,180 "his parents"; 5,207 "Is not this Joseph's son?"; 5,251 "whose father and mother we know?"; 4,988 "where prayer was wont to be made" | 0 for all five | answered by fragment only |
| 6 (LINK 4) | Isaiah 7:16; Isaiah 8:8; Isaiah 7:14 | 5,744 "For before the child shall know to refuse the evil"; 6,348 "O Immanuel"; 5,589 full | 6,806; 8,204; 318, full | answered |

Every quoted word above was checked against kjv_verses and is correct. Every premise is answered by reference with correct words; a full verse is missing only where the table says "fragment only". The defender's count is 0 on the reading the earlier reviews used.

**Against the challenger** (the defender's link-round list; later rounds: challenger rounds 1 to 3 after the pressing round; the close answers nothing):

| Premise | Witness | Challenger rounds | State |
|---|---|---|---|
| 1 | Matthew 1:16 | link round 141, full | answered |
| 2 | Galatians 4:4; Genesis 3:15 | link round 1,825 and 2,431, full | answered |
| 3 | **Isaiah 7:11** (first pressed in defender round 2) | round 2, 3,401: "Isaiah 7:11's \"depth or height\" standard" (not the KJV words); link round 0 | **unanswered** (B1) |
| 3 | Isaiah 7:14; Matthew 1:23 | link round 3,181 and 4,739, full | answered |
| 4 | Matthew 1:25 | link round 668, full | answered |
| 4 | Luke 1:35 | round 1, 5,811, first clause correct; rounds 2 and 3 do not quote it | answered on the loose reading only (B1) |
| 5 | Galatians 4:4; Romans 1:3 | link round full; round 1, 368, full | answered |
| 6 | Matthew 1:18 | round 1, 4,103, full; round 2 misquote ("her mother", NOT COUNTED); link round 10,591 named only | answered (round 1, ruling 373) |
| 6 | Matthew 1:20 | link round 5,634, full | answered |

**Grounds that read Matthew 1:18 or 1:25 against the union (drift guard 8, live: "\"knew her not till she had brought forth her firstborn son\" (Matt 1:25) bounds the abstinence to the pregnancy"), and K-DG8:**

| Seat, line | Words | K-DG8 |
|---|---|---|
| DeepSeek D6 vs C4 | "the text places no knowing before the birth" | fired, true; cured |
| DeepSeek RESULT (counted, unrestated) | "Joseph 'knew her not till she had brought forth,' so the challenger's claim that Joseph begat Jesus is refuted" | **missed** |
| Single judge REASONING, RESULT, CHALLENGE STANDING | "contradicted by [L1] Matthew 1:25"; "breaks on the not-knowing until the birth"; "against Matthew 1:25" | **missed** (none restated) |
| Single judge D1 vs C4, D6 vs C6 | "contradicted by the not-knowing till the birth"; "contradicted by the conception being before they came together" | **missed** (both later retracted under K-G4) |
| GLM D6 vs C6 | "dates the child before any coming together" | fired, true |
| GLM D1 vs C6, D2 vs C4, D2 vs C6, D5 vs C5, D6 vs C4, D6 vs C5, REASONING, RESULT | "closes the knowing through the birth"; "bounds the not-knowing across the whole conception window"; "spans the not-knowing to the birth, past the conception"; "shut by Matthew 1:25's 'till'"; "closes the knowing across the conception window"; "shuts the knowing that route requires"; "spans the not-knowing across the whole pregnancy"; "Joseph did not know her until after the birth, so no man begat Christ" | **missed** (eight; GLM removed) |
| KEYSTONE lines of the single judge, GLM and Sol | the declared link quoted ("his flesh came from Mary alone") | fired on all three; true to the letter, doubtful in substance (the line names the link it grades) |

K-DG8 reads the phrasing "before any coming together" and "no knowing"; it does not read "closes the knowing", "spans the not-knowing", "breaks on the not-knowing", "contradicted by ... Matthew 1:25" or a RESULT line. The README's A3 addition ("the stated timing") did not meet these forms.

**Grounds on "no verse states" (drift guard 61) and K-C / K-S:** DeepSeek REASONING (K-C fired, true; the restatement keeps "not by a row that states it", false pass); GLM REASONING, D2 vs C4 (true), KEYSTONE and CONCEDED LINKS (false, B2); the single judge's D5 STANDS ("C5's lack of a Mary genealogy is an argument from silence that does not state Joseph begat", K-S2, review only, true) and its restated KEYSTONE ("no verse states Joseph begat him", **missed**, introduced by a cure). GLM's D6 vs C5 ("names David as the flesh's ancestor and no begetter at the last step") is the same class, unmarked.

**"Son of God" read as paternity (drift guard 18):** no judge's ground rests on it. Every seat that weighs Luke 1:35 uses it for "the angel's answer names no man" (GLM) or for the conception's source, not the title. No K check exists for this class; none was needed in this run.

## E. Enforcer marks and RESPONSEs, row by row (27 rows)

| Row | Seat, rule, item | Mark | Cure, RESPONSE |
|---|---|---|---|
| 36 | DeepSeek K-G4 D6 vs C4 | fires on any BROKEN line; the ground is DG-8, not an unanswered witness (the 32228 B2 and 32255 B4 class) | CURED by retraction; RESPONSE sound ("[DR3] LINK 4 quotes it in full") |
| 37 | DeepSeek K-DG8 D6 vs C4 | true | CURED, restated; RESPONSE sound except "[DR3] and [DR4] both press" (B3) |
| 38 | DeepSeek K-C REASONING | true | CURED, but the restatement keeps a stating-verse ground (C); RESPONSE sound |
| 39-47, 49 | GLM K-G4 x10 | fire on every BROKEN line; true that each line weighs answered witnesses | **UNCURED, false in substance**: every retraction refused as malformed (B2); RESPONSEs sound, each names and quotes the answering round |
| 48 | GLM K-B D6 vs C6 | **false** ([L2] prin e sunelthein with its meaning) | UNCURED (B2) |
| 50 | GLM K-DG8 KEYSTONE | true to the letter only (quoted link) | UNCURED, false in substance; RESPONSE sound |
| 51 | GLM K-DG8 D6 vs C6 | true | UNCURED on the malformed retraction; RESPONSE sound |
| 52 | GLM K-C REASONING | borderline ("names no husband"; "not on any single stating verse") | CURED; RESPONSE sound |
| 53, 54 | GLM K-C KEYSTONE, CONCEDED LINKS | **false** (they report the defender's concession) | CURED; harmless |
| 55 | GLM K-C D2 vs C4 | true | UNCURED on the malformed retraction |
| 56, 57 | Single K-G4 D1 vs C4, D6 vs C6 | true in effect (the lines say the challenger "did not resolve it in [DR4]") | CURED by retraction on a false reason ([DR4], B3) |
| 58 | Single K-N CONCEDED LINKS | true | CURED; sound |
| 59 | Single K-SC D4 | **false** (a limb conceded, not the link) | CURED; harmless |
| 60 | Single K-DG8 KEYSTONE | true to the letter only | CURED; the restatement adds "no verse states Joseph begat him" (unmarked) |
| 61 | Sol alternate_reply | record of its first judgment | none |
| 62 | Sol K-DG8 KEYSTONE | true to the letter only | CURED; RESPONSE sound and the best of the run |

**Missed:** the DG-8 lines in D; the K-C class in DeepSeek's restated REASONING and the single judge's restated KEYSTONE; K-G6 on challenger premise 3 on every seat but Sol (the ledger counts names, B1); stale STANDING and CHAIN MARK lines after a retraction (DeepSeek), as in 32255 B4.

## F. Citation checker

Totals: checked 295, matches 287, mismatches 4, not_checked 4. Every non-match, checked against kjv_verses:

| Item | Status | Judgment |
|---|---|---|
| 49, Job 25:4, challenger round 1 | WORDING DIFFERS | **True**: "born of woman" against "born of a woman". The challenger's round 2 then quotes only the first clause ("How then can man be justified with God?"), dropping the words its argument needed; the link round quotes it correctly (item 184). |
| 103, Isaiah 7:14, challenger round 2 | WORDING DIFFERS | **False in substance**: the round quotes "The 1611 margin on Isaiah 7:14 reads \"or, thou, O virgin, shalt call\"", and the kjv_verses row holds that margin: "[shall call: or, thou, O virgin, shalt call]". The words are in the row, labelled as the margin. The same quotation in round 1 was not itemized at all. Every judge repeats it as NOT COUNTED. |
| 113, Matthew 1:18, challenger round 2 | WORDING DIFFERS | **True**: "When as her mother Mary" against "his mother". |
| 207, Genesis 4:25, challenger link round, link 6 (load-bearing) | WORDING DIFFERS | **True**: "called her name Seth" against "called his name Seth". The defender's close caught it. |
| 46, Hebrews 10:5, challenger round 1 | NOT CHECKED | No quotation at that place (a heading); no reason stored. |
| 97, Galatians 4:4, challenger round 2 | NOT CHECKED | No quotation ("On Galatians 4:4: the defender says ..."). |
| **101 and 129, Isaiah 7:11, challenger round 2** | NOT CHECKED | **A miss that matters**: "Isaiah 7:11's \"depth or height\"" is a quotation in quotation marks, and its words are not the KJV's. Marked, it would have told every judge that premise 3's only answer does not count (B1). |

- Item 272 carries a broken reference, "Matthew 1:18,1" (from "Matthew 1:18, 1:20, 1:25" in the close), marked MATCHES.
- Quotations not itemized at all, among others: the challenger's link round "[L2] Luke 1:34: \"Then said Mary unto the angel ...\"" and its full Matthew 1:23; the defender's link round Luke 2:27, Acts 14:19 and Acts 16:13; most of the challenger's close (references in parentheses after the quotation). None was misquoted.
- No real verse was called non-existent, and no book was carried from another clause.
- Solution: read a margin note as part of the row when the round says it quotes the margin; check a quotation that follows "<reference>'s"; check a quotation whose reference follows it in parentheses; store a reason for NOT CHECKED; reject a malformed reference.

## G. The synthesis (DeepSeek, 203.6 s; checks S-A to S-E in review_notes)

1. **S-A, "Matthew 1:25's span. Both read the not-knowing as running through conception and gestation to the birth": true.** The challenger never says "conception"; it says "'Till' ... bounds the abstinence to the pregnancy" and holds "Joseph knew Mary his wife within the espousal". The same misreading drives section 5 ("Its own grant is that Matthew 1:25's 'till' covers the conception and gestation"), which S-A did not catch.
2. **S-A, "Both cite the same verb" (Acts 14:19): true.** Acts 14:19 is at position 0 in all four challenger rounds.
3. **S-A on the confirmation (2:61): half right.** The paragraph's "the *ἕως οὗ* span both sides read alike" is false (item 1), but the reason given, Ezra 2:61, comes from another sentence.
4. **S-C, 12 items: true.** Section 1 is headed "points no charge on either list contests" and lists Matthew 1:16 (the defender's premise 1), Matthew 1:25 (premise 4), Galatians 4:4 (premises 2 and 5), Genesis 4:1 and Deuteronomy 22:24 (the challenger's premise 2), and more. A7's wider heading forms worked.
5. **S-E: false.** It reports that "no defender round holds those words affirmed" for "the several defender limbs dropped by its own hand". The defender's link round writes "I drop" three times (first at 192): "I drop any claim that a verse states Mary's own lineage", "I drop the general maxim about how angels speak", "I drop the claim about what a narrator would or would not write".
6. **Missed:**
   - "Isaiah's near horizon. The sign is bounded by a child's knowing-years in Ahaz's day (Isaiah 7:16; 8:3-4; 8:8). Granted": the defender granted "a near-term horizon for the kings' deliverance" and narrowed the fulfilment, not that the sign is so bounded.
   - "Challenger (R2): \"No verb of knowledge appears. The verse does not state the ground of the intent.\"": those words are in the challenger's round 1.
   - Section 2a: "All six were entered SUPPORTED" is true of the labels, but premise 3's witness Isaiah 7:11 was never answered (B1). S-B did not fire; the ledger counts names.
   - The confirmation: "named again in [DR4]" (B3); and it calls the §3 guard scan "one-sided by construction", which is the design (the guards bind the seat that argues the record's reading only).
7. **Right:** the narrowings are graded NARROWED-BY-ITS-OWN-SIDE (four of six), not as concessions (the 32255 G4 fault is gone); the Genesis 4:25 misquote is noted and the verse not counted; the close-round renumbering of D6 is reported; the C4 no-new-press finding is right; DG-18 is applied to the challenger correctly ("the title runs to Solomon too").

## H. Where the challenger, which argues the record's reading, erred on the record

The defender is not bound by the drift guards (tandem manual) and is graded here by the debate rules only. The challenger is bound. Each item below is shown by rows read.
1. **Misquotations:** Matthew 1:18 "her mother" (round 2, inside its own premise list); Genesis 4:25 "called her name Seth" (link round, load-bearing); Job 25:4 "born of woman" (round 1) and the clause cut in round 2; Isaiah 7:11 "depth or height" (round 2, B1).
2. **"At its one Gospel row"** (link round, of "born of a woman/women", with "The served count of the phrase's rows is five, and they are the five quoted"). kjv_verses holds Luke 7:28: "For I say unto you, Among those that are born of women there is not a greater prophet than John the Baptist". The canonical rows are Job 14:1, 15:14, 25:4, Matthew 11:11 and Luke 7:28 ("born of"), with Galatians 4:4 ("made of"). The count of five omits Luke 7:28, and Matthew 11:11 is not the one Gospel row.
3. **"The first Adam had no spouse"** (round 2, 4,975). The challenger's own Genesis 4:1 reads "And Adam knew Eve his wife".
4. **"the thirty-nine clauses before it in the register use the active egennēsen"** (link round 433). The record holds no Greek text; the kjv_verses rows of Matthew 1:2-16 hold "begat" 41 times. The count is not supported by the record. The defender's close adopts it ("says 'begat' thirty-nine times").
5. **"Matthew 1:20's γεννηθέν ... the same verb form the defender treats as non-narration in verse 16"** (round 2). The rounds themselves give two forms (egennēthē at 1:16, gennēthen at 1:20); "the same verb form" is not what the record shows.
6. **"The rows that fill what 1:16 leaves quiet name the father: Matthew 1:25"** (link round, LINK 1, [L3]). Matthew 1:25 names Joseph as the one who "called his name JESUS"; it names no father. The synthesis notes it.
7. **Luke 2:33 as a register naming Joseph father** (close: "The narrator, Luke 2:27 ...; Luke 2:33: \"Joseph and his mother marvelled\""). The words name Joseph and "his mother", not "his father"; the defender had pressed this in round 2.
8. **"Matthew 1:24 'took unto him his wife' is the coming, the same idiom as 1 Corinthians 7:5 'come together again'"** (close). The quoted words differ; no row read shows them to be one idiom.
9. **The union's window.** Drift guard 8 holds at L4 that "Joseph knew Mary his wife within the espousal" and says "When the union is challenged, answer it from the seed chain above; do not decline it". The defender's close pressed the window ("Conception came before the coming together"); the challenger's close restated the timing rows ("held as written") and did not show a window. The synthesis names this as the challenger's most exposed joint. It is a weakness in the debate, not an error against the record.
10. **Drift guard 61.** The challenger used the stating-verse form it forbids: "\"Of a woman\" never means \"without a man\" at any row in the canon" (round 2); "no row says a woman conceived without a man" (link round); "no row states that no man was involved" (close). Its "No verse in the canon names Mary as David's seed" rests on drift guard 8's own "her Davidic descent is not established", but it was pressed as a stating-verse demand, and the defender listed it so (its premise 5).
11. **Drift guard 59.** "Matthew 1:23 quotes the naming clause as the prophecy's content" (link round) and "I need no more than that" (close) understate the apostle's application: the challenger's own full quotation of Matthew 1:23 opens "Behold, a virgin shall be with child". It did not deny Matthew's application, so this is imprecision, as the synthesis says, not a breach.
12. **Drift guards 18 and 57: kept.** "\"Son of God\" is a covenant title ... 2 Samuel 7:14 ... 1 Chronicles 28:6"; Luke 1:32 before the question; Isaiah 7:14 laid with ha-almah at [L2], Isaiah 7:16 and 8:3-4 as the bound, and the margin quoted correctly.
13. Not checkable on the record: "בְּתוּלָה ... 50 rows across 19 books, 9 in the Torah" (round 1); the record read holds no Hebrew concordance.

## I. The challenger's round 2: 24.1 seconds for 9,804 characters

- **Complete:** it ends "PREMISE COUNT: 6"; six premises, each with a quoted charge and a PRESSED WITH list; position('TRUNCAT') is 0 in all eight rounds.
- **Coherent:** it answers the defender's round 2 point by point (seed rows, Matthew 1:25, D3, D5, D4, Galatians 4:4, Hebrews 10:5) and lists its premises in the required form.
- **Odd:** the time. Its other rounds took 307.6 s, 226.8 s and 33.6 s; the same model's round 2 took 378.8 s in 32255 and 466.3 s in 32228. The record holds no usage for the rounds (engine_prompt_tokens, engine_model_reported and engine_response_id are NULL), so whether it reasoned, or for how long, cannot be read. The round carries more errors than the others: the "her mother" misquotation, the cut Job 25:4, "depth or height", "the first Adam had no spouse", "the same verb form", and the two link mislabels (premise 2 as LINK 6, premise 3 as LINK 2). Its Isaiah 7:11 answer, the one that does not count, is in this round.
- Solution: store per-round usage (prompt, completion and reasoning tokens, finish reason) in the row, as the synthesis line already does.

## J. Comparison with runs 32255 and 32228

| Point | 32228 | 32255 | 32266 |
|---|---|---|---|
| Flow | 52b05334 | e9f2a2dd (judge_fix2) | d9ec1e19 (judge_fix3, close rounds) |
| Rounds | 6 | 6 | 8 (closes 19,156 and 5,496) |
| Round lengths D1, C1, D2, C2, D3, C3 | 8,338; 10,812; 12,843; 9,040; 9,478; 6,978 | 8,117; 11,178; 16,004; 8,864; 7,123; 8,654 | 9,119; 11,406; 11,350; 9,804; 8,251; 10,731 |
| MiMo rounds (s) | 323.1; 466.3; 231.6 | 477.9; 378.8; 340.5 | 307.6; **24.1**; 226.8; 33.6 |
| Run length | about 60.5 min | about 71.4 min | about 51.8 min |
| GLM | failed closed, 354.8 s, nothing stored | failed closed, 434.2 s, 64,000 reasoning tokens, content empty | **answered**, 619.4 s; cure 316.8 s; removed for 14 uncured, every one a refused retraction or a false mark |
| Alternate | Qwen 981.7 s, seated | Qwen 985.2 s + 316.7 s, not seated | **Sol 116.3 s + 12.2 s, seated** |
| Reserve | ChatGPT for GLM | ChatGPT for GLM | none called |
| Panel | CONTESTED 1-1-1 | CONTESTED 1-1 (DeepSeek not counted) | **HELD 3-0** |
| Outcome | UNGRADED [dash] REVIEW | UNGRADED [dash] REVIEW | **DEFENDER PREVAILS** |
| Unanswered against the defender | Isaiah 8:8; usage rows in substance | Deuteronomy 24:1; Psalm 2:7 with Acts 13:33; Luke 1:5 | **none** (the close answered every one); fragments only for 8 witnesses |
| Unanswered against the challenger | Luke 1:42, 1:31, Galatians 4:4, Jeremiah 22:24 | none | **Isaiah 7:11** (counted by Sol only); Luke 1:35 on the full-verse reading |
| Defender narrowings | premise 6 conceded | four narrowings | four in the link round, two in the close; no link conceded |
| Form refusals that decided a seat | (K-G4 flips) | DeepSeek ([L2] script), Qwen (brackets, tag place) | GLM (RETRACTED line with its regrade) |
| K-DG8 | not built | 1 fire, refused falsely | 5 fires (2 true, 3 on quoted keystone links); about 14 DG-8 lines missed |
| K-N, K-SC | not built | 0, 0 (right) | K-N 1 true; K-SC 1 false |
| S checks | none | S-A 1 true | S-A 3 (2 true), S-C 1 true, S-E 1 false |
| Citations | book carry; Galatians 4:4 gloss | dual reference; Romans 1:3 gloss | margin flagged falsely; Isaiah 7:11 not checked |
| RESPONSE misfiled | n/a | 2 rows | none |
| Cache | 63,456 written, 275,891 read | 74,021 written, 257,062 read | 100,006 written, 357,603 read |

The close rounds removed the fault that decided 32255: witnesses left unanswered against the defender. The same structure now leaves one asymmetry: the defender's close may bring new matter, and nothing marks it, while the challenger's close may answer nothing. The outcome was graded for the first time, and the verdict is sound; the counts beneath it repeat the 32255 lesson in a new place: a check that tests names (the ledger) where the rule tests words (ruling 3).

## K. Order proposed

1. B1: your ruling on "quoted fully" (the whole verse, or the pressed words correctly). Then the ledger and K-G4 to test quoted words against kjv_verses, not the reference alone; with that, K-G6 would have marked challenger premise 3 on every seat.
2. B2: the RETRACTED line to carry its regrade, or the answer form to say the regrade is a separate RESTATED line. With either, GLM would have been counted (HELD).
3. B1 (close): a D4 new-reference check (mark, not strike), and a judge-rule line that an argument first made in [CR4] grounds no CHALLENGER LINK BROKEN.
4. B3: refuse [DR4] as an answering round and [CR4] as a pressing round in the cure checks.
5. D: K-DG8 to read "closes/spans/bounds the not-knowing", "breaks on the not-knowing", "contradicted by ... Matthew 1:25 / before they came together", and RESULT, REASONING and STANDING lines; to skip a quoted declared link.
6. C, D: the K-C and K-S cure checks to refuse a restatement that keeps or adds a stating-verse ground ("not by a row that states it", "no verse states Joseph begat him"); a retraction to restate the STANDING and CHAIN MARK lines that rest on it.
7. B2: count a multi-word plain transliteration with its meaning as [L2]; K-C not to fire on a sentence reporting a side's own concession; K-SC not to fire on a conceded limb.
8. F: margins, "<reference>'s" quotations, parenthetical references, NOT CHECKED reasons, malformed references.
9. G: S-E to read "I drop" as an affirmed drop; S-A to read the synthesis's later sections for the same "both" claim.
10. Both closes to keep the declared numbering (D1 to D6, C1 to C6).
11. I: store per-round usage in the row.
12. Time rule: say whether 900 s applies per call or per seat (GLM 936.2 s over two calls).

## Not read

- The system's list of still-pressed witnesses given to the defender's close (README B1 (a), (b)): it is not stored in the row, so the close cannot be checked against it item by item.
- The panel and alternate prompts as sent: not stored; only the cure prompts are. The challenger ledger is seen only as quoted in the cure prompts ("C3 -- 4 verse(s) carried; 4 named").
- The execution records (n8n), under the reading rule: per-round token usage and reasoning, the max_tokens sent to each seat, and why the challenger's round 2 took 24.1 s.
- The A1 [L2] pattern was not traced in code for GLM's K-B item; the cause given in B2 is an inference from the result.
- The Hebrew and Greek counts claimed in the rounds (bethulah rows; egennēsen clauses): the record read holds the KJV only.
- debate_replay_judgments was not queried for this run.
