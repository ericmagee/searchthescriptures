# Run ODV1-32212: problems and solutions

Flow version fef4fb2a (as given in the brief; the row has no column that records the flow version). Fired 00:16 CST 2026-11-02, stopped 01:35 CST, status success (79.3 minutes, 06:16:38Z to 07:35:54Z).
Row 9a52d90b (debate_results), run token ODV1-32212-7r5e2xwm. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome "UNGRADED [dash] REVIEW (the stored value joins the two words with a long dash)"; panel verdict CONTESTED, split "0-0 (3 not counted: debate rule)"; judged_by chatgpt, deepseek, gemini; data_class "contested"; quarantine_reason NULL; drv_removed NULL; standings fields NULL ("no majority among the 0 counted seat(s)"). The GLM seat failed closed and ChatGPT substituted (panel_substitution, 07:04:38Z).
Cache: 73,782 tokens written, 294,897 read (input 556,423, output 366,112).

**Token limits.** This is the first run with every seat at its vendor maximum output (MiMo 131,072, Claude 128,000, DeepSeek 384,000, Gemini 65,536, ChatGPT 128,000, GLM 131,072, Qwen 131,072) and with the doubling and +8,192 adjustments removed. The limits were set to 64,000 after this run was fired; this run carries the vendor maximums. The only limit the row itself records is the synthesis call's: "[SYNTHESIS USAGE: prompt=44801 completion=22489 reasoning=19326 finish=stop max_tokens=384000]" (32205: max_tokens=65536).

Nothing here is applied. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 7,725); the challenger's round 1 (engine_r1, 10,725); the defender's round 2 (claude_r2, 11,442); the challenger's round 2 (engine_r2, 11,376); the defender's link round (engine_r3, 8,256); the challenger's link round (challenger_r3, 6,697); the three stored panel judgments (debate_judgments 885 DeepSeek 9,883; 886 Gemini 5,884; 887 ChatGPT 16,599), each with its audit, cure and alternate lines; the single judge (independent_verdict_raw, 16,935); the synthesis with its confirmation (13,670); the review notes (3,275); the citation check (citation_check, 26,598 as text, read in two parts); out_of_round_detail; panel_verdict, panel_split, panel_fingerprint (d7533fc9...), panel_substitution, drv_removed; drift guards 8, 59 and 61, read live. Each pressed witness was checked by name with SQL position() in the answering side's later rounds. Lexical claims were checked against original_words, lexicon_words and kjv_verses. odv1_drv_removals and debate_replay_judgments hold no row for this run.

**Round labels.** In the judges' text "CR" marks the defender's (Claude's) rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n".

## Timings (timings_32212.json, seconds)

| Step | Start (Z) | Seconds | 32205 |
|---|---|---|---|
| Defender round 1 | 06:16:38 | 49.1 | 51.6 |
| Challenger round 1 | 06:17:29 | 498.8 | 472.2 |
| Defender round 2 | 06:25:49 | 117.1 | 117.3 |
| Challenger round 2 | 06:27:48 | 535.5 | 734.2 |
| Defender link round | 06:36:46 | 72.3 | 107.3 |
| Challenger link round | 06:38:00 | 612.5 | 704.7 |
| Synthesis (DeepSeek) | 06:48:14 | 127.1 | 197.2 |
| Single judge (Independent Verdict Call) | 06:50:26 | 284.4 | 315.7 |
| Single judge cure (Cure Call deepseek) | 06:55:12 | 93.3 | 43.2 |
| Diagnostic (DeepSeek) | 06:56:47 | 14.4 | 13.2 |
| Panel judge 1, DeepSeek | 06:57:04 | 212.1 | 233.8 |
| Panel judge 2, Gemini | 07:00:36 | 166.5 | 129.9 |
| Panel judge 3, GLM (failed closed) | 07:03:22 | 73.6 | 25.2 |
| Panel reserve, ChatGPT | 07:04:38 | 87.9 | none |
| Panel cure 1, DeepSeek seat | 07:06:08 | 49.2 | 23.5 |
| Panel cure 2, Gemini seat | 07:06:59 | 6.0 | none |
| Panel cure 3, ChatGPT seat | 07:07:05 | 41.7 | 9.5 (GLM) |
| Alternate call (Qwen for the DeepSeek seat) | 07:07:49 | 1,194.6 | none |
| Alternate cure (Qwen) | 07:27:46 | 484.4 | none |
| Record Alternates | 07:35:54 | 0.4 | 0.3 |

The challenger's three rounds took 1,646.8 seconds (32205: 1,911.1); the defender's three took 238.5 (32205: 276.2). The alternate call and its cure took 1,679 seconds, 35 percent of the run, and seated nobody.

---

## A. What the change did

1. **No round is cut off.** The challenger's round 2 is complete: it ends with "PREMISE COUNT: 6" at position 11,361 of 11,376, and its six-item list against the defender (LINK 1 to LINK 6, each with "PRESSED WITH:") is present. position('TRUNCATED') is 0 in it (32205: 8,611). The link round was therefore not forfeited, and every judge counted premises on both sides (L=6 against each side). This is the 32205 fault B1 removed.
2. **Rounds did not grow.** Only the challenger's round 2 is longer (11,376 against 8,679, which was cut). The challenger's round 1 is shorter (10,725 against 13,435) and its link round is less than half (6,697 against 14,057). The defender's rounds are 7,725, 11,442 and 8,256 (32205: 9,299, 10,930, 10,243). The higher limits removed the cut without making the rounds longer.
3. **MiMo was faster on rounds 2 and 3** (535.5 and 612.5 seconds against 734.2 and 704.7) and slightly slower on round 1 (498.8 against 472.2). The record does not show why.
4. **The synthesis call used less of a larger limit**: completion 22,489 tokens with 19,326 reasoning (32205: 33,705 and 30,119), finish "stop".
5. **GROUND on every collision line** in all four stored judgments (counted in section D). GLM's reply is not stored, so its lines cannot be counted.
6. **The panel collapsed.** All three stored seats were set aside by checker flags (B2), so no seat counted. Two of the three removals rest on false flags.
7. **Cache writes rose** to 73,782 (32205: 24,630), the level of 32194 (73,395).

## B. Faults that decided the outcome

### B1. GLM failed closed with a reply that begins as valid JSON
- Evidence (panel_substitution): "FAIL-CLOSED: seat \"glm\" returned no JSON object. First 200 chars: {\"verdict_tag\":\"HELD\",\"defense_standing\":\"SELF-SUPPORTED\",\"challenge_standing\":\"SELF-SUPPORTED\",\"conceded_links\":0,\"challenger_conceded_links\":0,\"counted_premises_defender\":[],\"counted_premises_challe", failure_kind "no_usable_judgment", substitute "chatgpt", at 07:04:38.128Z. The call ran 73.6 seconds.
- What the record shows: the first 200 characters open a JSON object with the same keys in the same order as the three stored judgments. Nothing more of the reply is stored: there is no debate_judgments row for GLM, and no other table found holds it.
- Whether it was cut off, carried trailing text, or was invalid JSON further on (for example an unescaped quotation mark or raw line break inside "reasoning", which in the stored judgments is a long string full of quoted round text) **cannot be determined from the database.** The full reply is only in the execution record, which the reading rule keeps closed.
- One fact the 200 characters do give: GLM's verdict was HELD, SELF-SUPPORTED on both sides, 0 conceded each side, with an empty counted_premises_defender list. Every stored seat instead found the defense COLLAPSED with 4 or 5 conceded. GLM's grading would have been the outlier.
- Solution: (1) store the full raw reply of any seat that fails closed (a column on the substitution record, or a debate_judgments row with verdict_tag NULL), so the cause can be read; (2) the parser should take the first balanced JSON object and record which of three faults it met: no closing brace (cut off), text after the closing brace (trailing text), or a parse error at a stated position (invalid JSON). Your word is needed on whether to read GLM's execution record for this run.

### B2. All three counted seats were set aside, two on false flags
The rule applied: a seat with an uncured debate-rule violation is "NOT COUNTED". Each seat's removal, flag by flag:

**DeepSeek (judgment 885, drv_uncured 2).**
1. K-C on CONCEDED LINKS, UNCURED, "WHY: the restated line keeps the ground that a verse does not state the link". **False.** The original line counts premises from the defender's own surrenders and quotes one of them: "premise 5 CONCEDED (stated): \"I concede that no verse names Mary as daughter of Heli...\"" (position 1,944). The restated line rests premise 2 on "(CR3) LINK 2 never names the pressed witnesses Acts 1:8 and Acts 5:15" (cure statement, position 8,338). Neither sets aside the challenger's chain for want of a stating verse; the checker matched "names" and "never names", the known false class. The judge's own cure statement says so: "nothing is set aside for want of a single stating verse."
2. K-C on D5, UNCURED, "WHY: no RESTATED line for D5". **Correct in class, failed on form.** The line reads "D5: STANDS -- GROUND: the Ezra 2:62, Numbers 27:4 and Luke 1:5, 1:36 witness concerns priestly and inheritance registers and never states Mary's line, and [CR3] LINK 5 conceded that no verse names her line" (position 4,212). That is a verse-silence ground (K-S2 also fired on it, correctly), and it is turned the wrong way: the absence of a stated Mary-line is the challenger's point, not the defender's. The cure gave a judge statement but no RESTATED line.
3. The Qwen alternate (qwen/qwen3.8-max-0902) was tried for this seat: "RESULT: NOT SEATED; WHY: 3 uncured item(s)". Its reply is not stored, so its three items cannot be judged.

**Gemini (judgment 886, drv_uncured 1).**
1. K-C on CONCEDED LINKS, UNCURED, "WHY: the restated line keeps the ground that a verse does not state the link". **False.** Every item in the line rests on a pressed witness left unanswered or on a stated concession ("Premise 2 is UNEXHIBITED (no footing offered) because Acts 1:8 and Acts 5:15 were pressed and left unanswered"). The restated line says "(CR3) did not name them" (position 5,239), and the original "regarding Mary's unstated link to Heli and Nathan" (position 1,604). The checker matched "did not name" and "unstated". Gemini was removed on this single false flag.
2. No alternate could be tried: "no pool model passes the guards: qwen G3: qwen/qwen3.8-max-0902 already sits as the other alternate".

**ChatGPT, the reserve (judgment 887, drv_uncured 4).**
1. K-G4 on D2 vs C2, D4 vs C5, D5 vs C2 and D6 vs C4, all UNCURED. The WHY clauses are "the later round (CR3) mat 1:20", "(DR2) luk 3:23; (DR3) luk 3:23", "(CR3) rom 1:3" and "(CR2) act 2:30; (CR3) act 2:30", each with "no SHORT line quoting its answer". **False.** The checker found the collision line's anchor verse (Matthew 1:20, Luke 3:23, Romans 1:3, Acts 2:30) in a later round and demanded the judge quote that round's "answer". The anchor verse is the link's own label, not the pressed witness. The pressed witnesses themselves are at position 0 in the answering side's later rounds: Acts 1:8 and Acts 5:15 (defender rounds 2 and link); Haggai 2:23 and Jeremiah 18:7-8 (defender link round); Hebrews 7:14 and 2 Timothy 2:8 (defender rounds 2 and link; the "7:14" hits are 2 Samuel 7:14 and Isaiah 7:14); Acts 14:19 and Acts 16:27 (challenger rounds 2 and link). The judge supplied what K-G4 asks, the quoted pressing sentence and its round, in each cure ("PRESSED: D2 vs C2 | (DR2) | \"The verbs that do appear do not denote begetting...\""). This is the 32194 K-G4 fault inverted: there the check looked only at the quote; here it looks at the label.
2. The cure reply was prose and was not read for a cure: "chatgpt prose recorded, not read for a cure".
3. K-G7 on D4 vs C2, CURED by retraction. **Correct in this run.** Here the challenger's premise list numbers its items by the defender's link numbers (LINK 1 to LINK 6), so premise 4 is the premise against link 4; ChatGPT voided premise 4 ("Premise 4 is VOID") and still broke D4. The class remains fragile wherever list numbers and link numbers differ (32205).

- Effect: with zero counted seats the panel is CONTESTED 0-0 and the outcome UNGRADED. From the stored fields, the three seats agree on defense COLLAPSED and challenge PROP-DEPENDENT; conceded links 4, 5, 4 and challenger conceded 2, 2, 1; verdict tags PARTIAL, PARTIAL, BROKEN. Had the false flags not fired, Gemini and ChatGPT would have counted, and DeepSeek would still have fallen on D5. (This reading of the combination comes from the stored fields; the combining code was not read.)
- Rule: K-C is "sets aside the challenger's chain on the ground that no one verse in it states the link or its contrary in its own words"; K-G4 is "the rule counts it only with the quoted pressing sentence and its round".
- Solution: (1) exclude "name", "names", "named", "never names", "did not name", "named in neither", "unstated" and text inside quotation marks taken from a round from the K-C pattern (open since 32157 B2); (2) make K-G4 search the answering side's later rounds for the pressed witness's own reference, not the collision line's anchor verse, and accept the PRESSED line when the witness is at position 0; (3) read a prose cure reply for its PRESSED, RESTATED and RETRACTED lines rather than discarding it; (4) do not run an alternate for a seat whose only uncured items fall in a known false class.

### B3. Witnesses the challenger pressed that the defender never named in a later round
Searched with position() in the defender's round 2 (claude_r2, for presses in challenger round 1) and link round (engine_r3, for presses in challenger rounds 1 and 2), with short-form variants. Position 0 unless noted:

| Witness | Pressed in | Against | Defender's later rounds |
|---|---|---|---|
| Hebrews 7:14 "our Lord sprang out of Juda" | challenger rounds 1, 2 | link 6 | not named |
| 2 Timothy 2:8 "of the seed of David" | challenger rounds 1, 2 | link 6 | not named |
| Acts 1:8, Acts 5:15 (the two verbs) | challenger rounds 1, 2 | link 2 | not named; answered in substance in defender round 2, position 4,813: "That is true of the verbs by themselves" |
| Luke 9:34; Psalm 2:7 with Acts 13:33, Hebrews 5:5; Romans 1:4 | challenger round 1 | link 2 | not named |
| Isaiah 7:16 | challenger rounds 1, 2 | link 3 | not named in either round |
| 1 Corinthians 7:5; Deuteronomy 24:1 | challenger round 1 | links 1, 6 | not named |
| Luke 1:13 (John the Baptist's father named) | challenger round 1 | link 5 | not named |
| Genesis 16:10, 24:60, Isaiah 54:3, Genesis 16:15-16, 25:21-26 (woman-seed rows with fathers); Jeremiah 31:21, 31:31 | challenger round 1 | link 5 | not named; set aside: "Genesis 3:15 and Jeremiah 31:22 are supporting rows. Link 5 does not rest on them alone." (claude_r2, near 10,754) |
| Numbers 1:2, 1:18 | challenger rounds 1, 2 | links 4, 5 | not named |
| Luke 2:4 "of the house and lineage of David" | challenger round 1 | link 6 | not named (the "Luke 2:4" hits are Luke 2:44 and 2:48) |
| Matthew 1:1 | challenger round 2 | link 1 | named in defender round 2 (2,549) before the press; not named in the link round, which dropped the claim |
| Genesis 5:3; Luke 1:27 | challenger round 2 | links 4, 6 | not named in the link round |
| 1 Chronicles 3:17-18, Haggai 2:23, Jeremiah 18:7-8 | challenger round 2 | link 5 | not named |
| Luke 1:5 | challenger rounds 1, 2 | link 5 | not named by number; answered in substance in defender round 2 at 10,225 ("On Luke 1:36, Elisabeth \"of the daughters of Aaron\" does not bar Mary from Judah") |

- How the judges handled it: ChatGPT broke D2, D5 and D6 on Acts 1:8 and 5:15, Haggai 2:23 and Jeremiah 18:7-8, and Hebrews 7:14 and 2 Timothy 2:8; the flags then removed the seat (B2). Gemini and the single judge counted Acts 1:8 and 5:15, Isaiah 7:16 and Hebrews 7:14 with 2 Timothy 2:8 as unexhibited premises but graded every link STANDS. DeepSeek counted none of them as unanswered: its D2 STANDS says the Acts witness "was met in [CR2] Part III", which holds only in substance.
- Two of ChatGPT's witnesses were answered in substance before the re-press: Acts 1:8 and 5:15 (defender round 2, 4,813) and Luke 1:5 (10,225). The rule names no status for an answer given in substance without the verse's number, nor for a re-press after such an answer.
- Rule: "Grade a link BROKEN when the other side exhibited ... witnesses that together contradict it and the broken side's later rounds left any of those witnesses UNANSWERED."
- Open question for you: does an answer in substance, without the reference, count as answered? And the 32205 question stands: does "Noted. Not conceding here. Goes to review." (claude_r2, position 144) count as answered?
- Solution: the two-way check from 32205 B2: for each link, list the witnesses pressed against it and their positions in the answering side's later rounds, and make an uncounted unanswered witness a cure item, after your rulings.

### B4. Witnesses the defender pressed that the challenger never named in a later round
Searched in the challenger's rounds after each press:
- Isaiah 7:11 (the sign "in the depth, or in the height above", defender round 1): position 0 in all three challenger rounds.
- Hebrews 10:5 "a body hast thou prepared me" (defender rounds 1, 2): position 0 in all three.
- Luke 2:49 "my Father's business" (defender rounds 1, 2): position 0 in all three.
- 2 Samuel 12:24, the stated begetting of Solomon set against the challenger's 1 Chronicles 28:6 parallel (defender round 2): position 0 in rounds 2 and link. The challenger repeated 1 Chronicles 28:6 in round 2 without answering it.
- Exodus 6:23 and Numbers 2:3 (Elisheba of Judah, against the Aaron objection; defender round 2): position 0.
- The "for" (gar) of Matthew 1:20 answering 1:19 (defender round 2, position 3,477): "gar" and "answers the taking" are at position 0 in all challenger rounds.
- Acts 14:19, 16:27 and 21:29 (defender round 2 and link-round premise 5): position 0 in challenger rounds 2 and link. Answered in substance in the challenger's link round at 4,757: "where a supposition in these rows is mistaken ... the mistake is stated by the narrative, not by the verb". ChatGPT broke the challenger's link on these (D4 vs C5); Gemini and the single judge counted them unexhibited.
- Isaiah 8:8 (defender link-round premise 6): position 0 in the challenger's link round. Gemini and the single judge counted it.
- Luke 1:34, 1:35 and gennēthen (defender link-round premise 2 and link 2): position 0 in the challenger's link round, which narrowed its link 2.
- Luke 1:60 and 1:31 (mothers name the child): not named, but answered in substance in challenger round 2 with Genesis 4:25 and 5:3 ("a mother's naming never cancels a father").
- No judge counted Isaiah 7:11, Hebrews 10:5, Luke 2:49, 2 Samuel 12:24 or Exodus 6:23 against the challenger.
- Solution: the check in B3 runs both ways.

### B5. Grounds that rest on what a verse does not state, or on Matthew 1:18 and 1:25 read as excluding the union
Drift guard 8 (DG-8), read live, holds: "\"knew her not till she had brought forth her firstborn son\" (Matt 1:25) bounds the abstinence to the pregnancy. So the record holds, at L4 footed on those rows, that Joseph knew Mary his wife within the espousal (Sight 32)", and forbids "routing the flesh through Mary alone". Drift guard 61 (DG-61) forbids "cite the verse that states this premise in its own words, or concede" "from either side and from any seat".

| Seat | Line | Ground (quoted, with position) | Class | Flag |
|---|---|---|---|---|
| DeepSeek | D6 STANDS, KEYSTONE | "the timing witness Matthew 1:25 was answered in [CR3] LINK 6 with [L1] Matthew 1:18 and the challenger dropped its timing claim in [DR3] LINK 3, and no exhibit anywhere says Joseph begat Jesus" (4,487) | both: accepts the defender's reading of 1:18 ("fixes that they had not cohabited", engine_r3 5,690) as an answer to 1:25, and a stating-verse ground. It also misreads the narrowing: the challenger dropped only "that the conception fell after the taking" and kept "Matthew 1:25 bounds the stated abstinence to the pregnancy by its own \"till\"" (challenger_r3, 1,108) | none fired |
| DeepSeek | D5 STANDS | "never states Mary's line" (4,337) | verse silence | K-S2, K-C (B2) |
| DeepSeek | D3 STANDS | "answered in [CR3] LINK 3, which conceded the sign row alone states no fatherless conception" | STANDS on a concession (C below) | none |
| Gemini | D3 STANDS | "Luke 1:34 and Matthew 1:25 confirm Mary had no sexual knowledge of a man before the birth" (2,605) | 1:25 read as excluding the union | none fired |
| Gemini | D5 STANDS | "The seed of David according to the flesh is preserved through the mother when no male begetter is named" (2,872) | verse silence, and the flesh routed through Mary | none fired |
| Gemini | D6 STANDS | "No passage in the text states that Joseph begat Jesus or that a human seed was supplied" (3,029) | stating-verse ground | K-S2, correct |
| ChatGPT | D2, D4, D5, D6 BROKEN; D4 vs C5 BROKEN | unanswered pressed witnesses | not this class | K-G4 (false, B2) |
| Single judge | D1 vs C1, D2, D4, D6 | "no verse states the contrary of D1's pattern-break claim"; "no witness states the conception was of a man"; "the titles do not state biological fatherhood"; "no witness states the contrary of \"no biological father.\"" | stating-verse grounds | K-S2 on all four, correct |
| Single judge | D1 vs C1 cure, accepted as CURED | "the presses on this link (Matthew 1:25, Deuteronomy 22:24, Genesis 4:1) were answered in (CR3) LINK 6 from (L1) Matthew 1:18 ... \"The conception precedes cohabitation.\"" | 1:18 read as excluding the union, accepted by the cure | the cure passed it |

- The defender's link round rests link 6 on this reading: "Matthew 1:18's \"before they came together\" fixes that they had not cohabited" (engine_r3, 5,690) and "The conception precedes cohabitation" (5,047).
- Record fact on "came together": original_words gives Matthew 1:18 "prin h sunelqein autouv", συνέρχομαι (G4905, V-2AAN); lexicon_words glosses G4905 "to convene, depart in company with, associate with, or (specially), cohabit (conjugally)". The same verb stands at Acts 16:13 ("sunelqousaiv gunaixin", the women who resorted there). This is the Sight 32 question again.
- Solution: (1) your digit on the Sight 32 correction; (2) the enforcer flags a ground that reads Matthew 1:18 or 1:25 as excluding the union, and a STANDS ground that routes the flesh through Mary; (3) K-S2 should also match "no exhibit anywhere says" and "No passage in the text states", which it missed on DeepSeek D6.

## C. Concessions graded STANDS

- No round contains "CONCEDED" or "WITHDRAWN" (position 0 in all six). The defender narrowed links 1, 3, 4 and 5 ("NARROWED TO", engine_r3 from 61) and wrote one express concession under link 5: "I concede that no verse names Mary as daughter of Heli, and that the Nathan line in Luke 3:31 is not stated to be Mary's." (engine_r3, 4,195). The challenger narrowed its links 2 and 3 ("I drop the bare form", 1,181; "I drop any claim that the conception fell after the taking", 2,480).
- Every stored seat graded D5 STANDS after counting premise 5 as conceded. DeepSeek: "premise 5 CONCEDED (stated)" and "D5: STANDS". Gemini: "Premise 5 is CONCEDED (stated)" and "D5: STANDS". The single judge: premise 5 CONCEDED, D5 vs C4 UNDERDETERMINED. The link was narrowed rather than withdrawn, so w=0 is consistent with the rule as written; but the kept limb, "The flesh descent from David must come through Mary", is the limb DG-8 calls "routing the flesh through Mary alone (her Davidic descent is not established, Sight 6)", and the defender itself says "Mary's house is not named, so I do not assert it".
- DeepSeek's D3 STANDS rests expressly on the defender's narrowing ("which conceded the sign row alone states no fatherless conception").
- The judges' premise counts and link grades pull apart: DeepSeek counts premises 1, 3, 4 and 5 conceded and grades D1, D3, D4 and D5 STANDS; Gemini counts premises 1, 2, 3, 5 and 6 conceded or unexhibited and grades all six links STANDS. No flag compares the two. K-U fired only on ChatGPT, whose D1 and D3 lines say "unanswered" (C below).
- Out-of-round concessions: DeepSeek lists "The loins idiom multiplies fathers; it does not delete them." (engine_r2, 1,035) as a challenger concession. It is the challenger's argument against the defender, not a concession. The row's out_of_round_detail (4 items) comes from the single judge, not the panel.
- Solution: your ruling on whether a narrowed link that keeps a limb forbidden by DG-8 can be graded STANDS; then a check that compares each seat's counted premises with its link grades.

## D. GROUND on every collision line

| Seat | Collision lines | With GROUND | Form |
|---|---|---|---|
| DeepSeek (885) | 6 | 6 | "-- GROUND:" |
| Gemini (886) | 6 | 6 | "-- GROUND:" |
| ChatGPT (887) | 7 | 7 | ". GROUND:" (0 in the "-- GROUND:" form) |
| Single judge | 6 | 6 | "-- GROUND:" |
| GLM | not stored | unknown | |

Counts are of "GROUND:" before the first audit line. The extractor read ChatGPT's form.

## E. Checker flags

| Flag | Seat and item | Judgment |
|---|---|---|
| K-C | DeepSeek, CONCEDED LINKS | **False** ("names", "never names"). Uncured, and it removed the seat with D5. |
| K-C | DeepSeek, D5 | Correct class (verse silence); uncured for form (no RESTATED line). |
| K-S2 | DeepSeek, D5 | Correct. |
| K-C | Gemini, CONCEDED LINKS | **False** ("did not name", "unstated"). Removed the seat on its own. |
| K-S2 | Gemini, D6 | Correct. |
| K-G4 | ChatGPT, D2 vs C2, D4 vs C5, D5 vs C2, D6 vs C4 | **False**: matched the collision line's anchor verse, not the pressed witness. Uncured; removed the seat. |
| K-G4 | ChatGPT, D4 vs C2 | Cured by retraction. |
| K-G7 | ChatGPT, D4 vs C2 | Correct here (list numbers match link numbers in this run); cured by retraction. |
| K-U | ChatGPT, D1 and D3 STANDS ("unanswered Matthew 1:1", "unanswered Isaiah 7:16") | **False in substance.** The rule breaks a link only on witnesses that "together contradict it"; ChatGPT judged that they do not ("does not contradict the declared pattern break"; "does not itself contradict that application"). Review only. |
| C-LABEL OFF THE GUIDE | ChatGPT, D2 vs C2 and D4 vs C2 | Recorded, not counted. The challenger's link-round block 2 is the seed rows, not Matthew 1:20 or Luke 3:23. |
| K-S2 | Single judge, D1 vs C1, D2, D4, D6 | Correct. |
| K-C | Single judge, REASONING, D1 vs C1, D5 vs C4 | Cured. D5 vs C4 matched "names neither Joseph nor Mary"; the class is borderline. The D1 cure was accepted on the 1:18 reading (B5). |
| K-C | Single judge, CONCEDED LINKS | **False** ("named in neither", and the quoted "no verse names Mary"). Uncured. |
| K-C | Single judge, D2 and D6 | Correct class; uncured for form (no RESTATED line). |
| v19 itemization | Single judge: "COUNTS 3 BUT JUDGE STATED 6" and "COUNTS 2 BUT JUDGE STATED 4" | **False.** The itemization lists 3 CONCEDED and 3 UNEXHIBITED items for the defender, and 2 and 2 for the challenger; the counter counts only "CONCEDED". |
| v18 collision map | Single judge: "D1=STANDS ... D6=STANDS" | Wrong: the text grades D1 vs C1, D3 vs C6 and D5 vs C4 UNDERDETERMINED. |
| K-G2 | Single judge, citation line absent | Recorded only. |
| v1 same-model divergence | DeepSeek seat against the single judge (also deepseek-flash): challenge PROP-DEPENDENT against COLLAPSED; 4 against 6; 2 against 4 | Correct to report. |

Missed (no flag fired): DeepSeek D6 and KEYSTONE "no exhibit anywhere says Joseph begat Jesus"; Gemini D3 (1:25 read as excluding the union); Gemini D5 (verse silence, flesh through Mary); Gemini's and DeepSeek's STANDS grades beside their own unexhibited premise counts (C).

Solution: the K-C and K-G4 changes in B2; the v19 counter counts UNEXHIBITED; K-U fires only when the line does not state that the witness fails to contradict; the K-S2 additions in B5.

## F. Citation errors

1. **One real verse reported as non-existent.** Isaiah 8:18, challenger link round, link 6, load-bearing: status "CITED VERSE DOES NOT EXIST". kjv_verses holds it: "Behold, I and the children whom the LORD hath given me [are] for signs and for wonders in Israel from the LORD of hosts", and the challenger quoted it correctly (challenger_r3, 5,731). ChatGPT then wrote "an invalid Isaiah 8:18 citation; those quotations receive no [L1] footing" (887, 6,930) and the single judge "the misfired \"Isaiah 8:18\"". In 32205 fifteen link-round items failed this way; here every other link-round item matched, so the path is mostly but not wholly mended.
2. **"Genesis 1:24" is a parser error, and "WORDS ARE AT Genesis 20:14" is a false match.** The challenger wrote "\"took unto him his wife\" (1:24)" (engine_r1, 3,254), meaning Matthew 1:24 (kjv_verses: "and took unto him his wife:"). The bare chapter took Genesis from "Genesis 4:1" earlier in the paragraph. Genesis 20:14 reads "restored him Sarah his wife" and does not hold the words. All three panel seats repeated it as the challenger's error: DeepSeek "the challenger's Genesis 1:24 quotation is really Genesis 20:14 (words right, reference wrong...)", Gemini "the challenger misattributed 'took unto him his wife' to Genesis 1:24", ChatGPT "The challenger's Genesis 1:24 citation is wrong".
3. **True errors, confirmed against kjv_verses:** Isaiah 7:16 in the challenger's link round, "forsaken because of both her kings" (5,457) for "forsaken of both her kings"; Isaiah 8:3 "Then I went" (engine_r2, 3,646) for "And I went"; Isaiah 8:4 quoted without "and the spoil of Samaria" (rounds 1 and 2) and with "taken away from before the king" (link round); Numbers 27:4 "why is the name of our father done away" (engine_r2, 10,033) for "Why should the name of our father be done away"; 1 Chronicles 3:17 "the sons of Jeconias" (10,234) for "the sons of Jeconiah"; Jeremiah 31:21 "the virgin of Israel" for "O virgin of Israel"; 2 Samuel 12:24 "he went in unto her" (claude_r2, 5,841) for "went in unto her".
4. Totals stored: checked 223, matches 211, mismatches 12, not_checked 0.
5. Solution: (1) find why Isaiah 8:18 alone failed on the link-round path; (2) carry a book forward only within one parenthesis, or mark a bare chapter "NOT CHECKED" (open since 32205 E2); (3) "WORDS ARE AT" only when the quoted words are found in that verse; (4) the panel prompt should not hand judges a "DOES NOT EXIST" item without a second lookup.

## G. Lexical and grammatical claims checked against the record

Confirmed by original_words (TR-Scrivener1894) and lexicon_words:
- Luke 3:23 has υἱός (G5207) once; Luke 3:24-38 has no G5207 (count 0), as the defender says ("the Greek gives the word huios only once, at the head").
- Luke 3:23 "wv enomizeto uiov" and Acts 16:13 "ou enomizeto proseuch einai": both G3543, V-IPI-3S. The challenger's "the same verb form" and the defender's "a different construction" (hou against hōs) are both borne out. lexicon_words G3543: "to accustom (passively, be usual); by extension, to deem or regard:-- suppose, thing, be wont".
- John 1:13 has ἀνδρός (G435) under θελήματος (G2307), as the defender ("The word there is andros") and the challenger ("it denies thelēma (will), not seed") both say.
- Romans 1:3 γενομένου, G1096 V-2ADP-GSM; Matthew 1:25 οὐκ ἐγίνωσκεν, V-IAI-3S; Matthew 1:22 τοῦτο ὅλον γέγονεν.
- ἐπέρχομαι (G1904) stands in exactly the ten verses the challenger lists, and ἐπισκιάζω (G1982) in the five; ὀσφύς (G3751) at Acts 2:30 and Hebrews 7:5, 10; H5959 (almah) in 7 verses; H1330 (bethulah) in 50 verses across 19 books.

Not borne out:
- **Challenger:** "Matthew 1:1 \"generation\" and Matthew 1:18 \"birth\" are one word: genesis (G1078, birth or generation)" (challenger_r3, 534). In this text Matthew 1:18 has γέννησις (G1083, "nativity:--birth"), not γένεσις; G1078 stands at Matthew 1:1, James 1:23 and 3:6 only. No variant is recorded for the word. DeepSeek spared this premise on that footing, and the synthesis lists it as "Matt 1:1/1:18 *genesis*, G1078" (3,507).
- **Defender:** "the genesis clause" (claude_r2, 2,285) for Matthew 1:18, the same misreading from the other side.

## H. The synthesis

The synthesis ran at 06:48, before the panel (06:57 to 07:35), so it could not report the panel failure; "GLM", "panel failure" and "truncat" are at position 0 in it. Its confirmation says "The debate's verdict is the panel's."
1. **No "both agree" and no "every link answered".** Both phrases are absent. Section 1 lists nine points "neither side's list charges".
2. **A false uncharged point.** Item 6, "Luke 3:23's *enomizeto* carries no verdict of its own" (1,234), is charged: it is premise 5 of the defender's list, quoting those words (engine_r3, 7,541 and 7,663).
3. **A challenger answer the record does not hold.** Under "Do the timing rows deny the begetting?": "Challenger: the *gar* answers the taking" (6,050). No challenger round contains "gar" or "answers the taking" (B4).
4. **A concession the record does not hold.** "LINK 6 ... PARTLY CONCEDED-BY-ITS-OWN-SIDE" (3,064). The defender marked link 6 "SUPPORTED" and wrote no concession under it.
5. **Overstated point.** Item 3: "The defender conceded in its link round that the titles \"state status.\"" (849). The defender wrote "\"wife\" and \"husband\" are betrothal titles. They state status, not cohabitation." (engine_r3, 5,615), an argument for its link 6, not a grant that the espousal was marriage in law.
6. **Guards bind the challenger seat only**: "## 3. Drift guard violations by the challenger" (6,371), "None found." Correct by the tandem manual.
7. **Lexical repetition.** It carries the G1078 error at Matthew 1:18 (G).
8. **Confirmation counts.** It says the audit flags the stating-verse ground "in eleven rows"; the single judge's text holds ten such lines (four K-S2, six K-C). It was right that the "stated 6 / counted 3" rows were not reconciled, though the counter, not the judge, is at fault (E).
9. Solution: the synthesis prompt checks each "uncharged" point against both premise lists, and attributes no answer to a side unless a round holds it; it takes the unanswered-witness list from the B3 check.

## I. Comparison with run 32205 (row 3ee68a78)

| Point | 32205 | 32212 |
|---|---|---|
| Token limits | per-seat limits with doubling and +8,192; synthesis max_tokens 65,536 | vendor maximums, adjustments removed; synthesis max_tokens 384,000 |
| Rounds | challenger round 2 cut at 8,611, no premise list, link round forfeited, auto-quarantined | no round cut; challenger round 2 complete with 6 premises; quarantine NULL |
| Round lengths (D1, C1, D2, C2, D3, C3) | 9,299; 13,435; 10,930; 8,679; 10,243; 14,057 | 7,725; 10,725; 11,442; 11,376; 8,256; 6,697 |
| MiMo time (rounds 1, 2, 3) | 472.2; 734.2; 704.7 | 498.8; 535.5; 612.5 |
| Run length | 53.4 minutes | 79.3 minutes, 28 of them on an alternate that was not seated |
| Panel | DeepSeek, Gemini, GLM all counted; HELD 3-0 | GLM failed closed; ChatGPT reserve; all three set aside; CONTESTED 0-0 |
| Outcome | UNDERDETERMINED | UNGRADED [dash] REVIEW |
| Premise counting | L=0 by forfeit for most seats | L=6 each side; defense COLLAPSED on every stored seat |
| Unanswered witnesses | many, none counted | many; counted as unexhibited premises by Gemini, ChatGPT and the single judge; ChatGPT broke links on them and was removed by a false K-G4 |
| Concessions | none; narrowings only | one express concession (link 5) graded STANDS beside a conceded premise count |
| GROUND | 11/11, 9/9, 6/6; single judge ". GROUND:" | 6/6, 6/6, 7/7 (ChatGPT ". GROUND:"); single judge "-- GROUND:" |
| "Came together" / "till" | single judge broke two challenger links on 1:25 | DeepSeek's keystone and the single judge's cure rest on 1:18; Gemini D3 on 1:25 |
| False flags | K-C on "name"; contradiction-test grounds | K-C on "names", "never names", "did not name", "unstated" (two seats removed); K-G4 on the anchor verse (one seat removed); K-U against a stated non-contradiction; v19 counter |
| Citations | fifteen real verses called non-existent; one book-carry error | one real verse called non-existent (Isaiah 8:18); one book-carry error with a false "WORDS ARE AT" |
| Synthesis | two inaccuracies; audit challenger seat only | four inaccuracies (H2 to H5); audit challenger seat only |
| Cache | 24,630 written, 291,189 read | 73,782 written, 294,897 read |

The higher limits did what they were for: no round was cut, the premise lists exist, and the judges could count. The outcome was lost instead to the checker: false K-C and K-G4 flags set aside the two seats they hit, and the third fell on a correct flag it did not cure in form.

## J. Order proposed

1. B2: the K-C pattern exclusions and the K-G4 change to search for the pressed witness rather than the anchor verse; read prose cure replies. These alone decided this run.
2. B1: store the full raw reply of a seat that fails closed, and parse the first balanced JSON object with a named fault; your word on reading GLM's execution record for this run.
3. B2 (4): skip the alternate when the only uncured items are in a known false class; the Qwen alternate cost 1,679 seconds and was not seated.
4. F1 and F2: the Isaiah 8:18 link-round failure, the bare-chapter book carry, and "WORDS ARE AT" only on a real match.
5. B3 and B4: the two-way unanswered-witness check, after your rulings on "answered in substance" and on "Goes to review".
6. B5 and C: your digit on the Sight 32 correction; the enforcer flags for 1:18 and 1:25 grounds, for flesh routed through Mary, and the K-S2 additions; your ruling on STANDS for a narrowed link that keeps a DG-8 limb.
7. E: the v19 counter counts UNEXHIBITED; K-U honours a stated non-contradiction.
8. G and H: the synthesis prompt lines, and a lexical check of "one word" claims against original_words.

## Not read

- GLM's panel reply beyond its first 200 characters: no table holds it. Its failure cause is therefore not determined.
- The Qwen alternate's reply and its cure reply: not stored; only the line "NOT SEATED; WHY: 3 uncured item(s)".
- The texts of the panel cure replies, beyond the excerpts recorded in the audit lines.
- The execution records (n8n), under the reading rule: so the seat max_tokens actually sent, the reason for MiMo's timings, the combining code for panel_verdict and outcome, and the cause of the GLM fault are not seen.
