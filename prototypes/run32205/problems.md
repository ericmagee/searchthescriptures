# Run ODV1-32205: problems and solutions

Flow version f0a13064 (as given in the brief; the row has no column that records the flow version). Fired 23:00 CST 2026-11-01, stopped 23:53 CST, status success (53.4 minutes, 05:00:27Z to 05:53:52Z).
Row 3ee68a78 (debate_results), run token ODV1-32205-iz6ryl2d. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome UNDERDETERMINED; panel verdict HELD, split "3-0"; judged by DeepSeek, Gemini and GLM; no substitution; drv_removed NULL; data_class "contested". The row also carries an automatic quarantine: "truncation marker present in [engine_r2] ... Raise the seat max_tokens and re-run before citing this row."
Cache: 24,630 tokens written, 291,189 read (input 484,548, output 296,802).

Nothing here is applied. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 9,299); the challenger's round 1 (engine_r1, 13,435); the defender's round 2 (claude_r2, 10,930); the challenger's round 2 (engine_r2, 8,679, cut off); the defender's link round (engine_r3, 10,243); the challenger's link round (challenger_r3, 14,057); the three panel judgments (debate_judgments 882 DeepSeek 15,263; 883 Gemini 4,861; 884 GLM 7,994); the single judge (independent_verdict_raw, 16,369); the synthesis (14,280); the review notes (2,514); the citation check (30,616, read in two parts); out_of_round_detail (199); drift guards 8, 29 and 61, read live. Each pressed witness was checked by name in the answering side's later rounds with SQL position(). Lexical claims were checked against original_words, lexicon_words and kjv_verses.

**Round labels.** In the judges' text "CR" marks the defender's (Claude's) rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n" to avoid the clash with the brief's labels.

## Timings (timings_32205.json, seconds)

| Step | Start (Z) | Seconds |
|---|---|---|
| Defender round 1 | 05:00:27 | 51.6 |
| Challenger round 1 | 05:01:20 | 472.2 |
| Defender round 2 | 05:09:14 | 117.3 |
| Challenger round 2 | 05:11:13 | 734.2 |
| Defender link round | 05:23:29 | 107.3 |
| Challenger link round | 05:25:18 | 704.7 |
| Synthesis (DeepSeek) | 05:37:04 | 197.2 |
| Single judge (Independent Verdict Call) | 05:40:26 | 315.7 |
| Single judge cure (Cure Call deepseek) | 05:45:44 | 43.2 |
| Diagnostic (DeepSeek) | 05:46:29 | 13.2 |
| Panel judge 1, DeepSeek | 05:46:44 | 233.8 |
| Panel judge 2, Gemini | 05:50:38 | 129.9 |
| Panel judge 3, GLM | 05:52:48 | 25.2 |
| Panel cure, DeepSeek seat | 05:53:15 | 23.5 |
| Panel cure, GLM seat | 05:53:41 | 9.5 |
| Record Alternates | 05:53:52 | 0.3 |

The challenger's three rounds took 1,911 seconds, 60 percent of the run. The defender's three took 276 seconds.

---

## A. What the changes did

1. **DeepSeek returned at the panel seat.** Its panel judgment took 233.8 seconds and is complete (finish_reason "stop", truncated false). No seat was substituted, unlike runs 32157 and 32194.
2. **GROUND on every collision line in all three panel replies.** DeepSeek 11 of 11, Gemini 9 of 9, GLM 6 of 6, all in the form "-- GROUND:". The single judge wrote GROUND on all 6 of its lines but in the form ". GROUND:" (for example "concede its bound. GROUND: the text's only statement..."), never "-- GROUND:"; the extractor read it.
3. **Caching was recorded** (24,630 written, 291,189 read). Fewer tokens were written than in 32194 (73,395).
4. **GLM's judgment is brief, not cut off.** 25.2 seconds; 5,917 characters before the audit lines, 7,994 with them; finish_reason "stop", truncated false; the reply closes its JSON and ends with both chain marks. It is thinner than the others: 6 collision lines against DeepSeek's 11 and Gemini's 9, no line on Luke 1:34 or on Matthew 1:18 "came together", and "OUT-OF-ROUND CONCESSIONS: NONE" where the other two record the defender's "The text does not name Mary's father."
5. **The synthesis audited the challenger seat only** ("## 3. Drift-guard audit -- challenger seat only"), as the tandem manual requires. The 32157 fault (guards said to bind both seats) did not recur.

## B. Faults that decided the outcome

### B1. The challenger's round 2 was cut off before its premise list, so the link round was forfeited
- Evidence: engine_r2 ends at position 8,610 with "D2 rests on an ἐκ that means \"" followed by "[TRUNCATED: the provider reported the token limit -- raise max_tokens]". The heading promised "CLOSING AND PREMISE LIST"; no list was written. The call ran 734.2 seconds.
- The review notes open: "LINK ROUND FORFEITED: CHALLENGER -- no premises were listed against the defender (list heading absent); the defender link round carries no information."
- The defender's link round says so (engine_r3, position 80): "The challenger's closing was truncated, so I answer under the chain-link labels it names (2, 4, 5, 6)".
- The judges then counted on three different bases:
  1. Gemini and GLM: forfeit, "L=0 c=0".
  2. DeepSeek (panel): used the challenger's round-1 list and found it answered in the defender's round 2, "c=0".
  3. Single judge (also DeepSeek): used the same round-1 list and counted three items unanswered in the defender's link round, "c=3", PROP-DEPENDENT. The audit records the clash: "SAME-MODEL DIVERGENCE ... defender conceded count 0 vs 3".
- Effect: no premise against the defender could be counted by the panel, so the defense was SELF-SUPPORTED with 0 conceded by default. The row was quarantined at write, after the whole panel had already been paid for.
- Rule: the row's own quarantine text, "A verdict rendered over a severed round is not admissible evidence."
- Solution: (1) raise the challenger seat's max_tokens for round 2; (2) when a round returns the truncation marker, retry that call once with a higher limit before the next round starts, and stop the run if the retry is also cut, rather than judging a run that will be quarantined. Your word is needed on the new limit.

### B2. Witnesses the challenger pressed that the defender never named in a later round
Searched by SQL position() in the defender's round 2 (claude_r2) and link round (engine_r3), with book-name and short-form variants. Position 0 in both, unless noted:

| Witness | Pressed in | Against | Defender's later rounds |
|---|---|---|---|
| John 1:45 "Jesus of Nazareth, the son of Joseph" | challenger rounds 1, 2 | link 1, link 6 | not named |
| Luke 4:22 "Is not this Joseph's son?" | challenger round 2 | link 6 | not named |
| Luke 1:63 (words at 1:62) | challenger rounds 1, 2 | link 1 | not named |
| Acts 5:15 | challenger round 1 | link 2 | not named |
| Isaiah 8:8 "O Immanuel" | challenger round 1 | link 3 | not named |
| Matthew 11:11 with Luke 1:5, 1:13 (John the Baptist's father) | challenger rounds 1, 2 | link 4 (Galatians 4:4) | not named |
| Job 14:1 | challenger round 2 | link 4 (Galatians 4:4) | not named |
| Genesis 16:10, 24:60; Isaiah 54:3, 5 (named husbands behind "her seed") | challenger rounds 1, 2 | link 4 (Genesis 3:15) | not named; the defender wrote "Gal 4:4 and Gen 3:15. Noted. Not conceding here. Goes to review." (claude_r2, position 6,690) |
| 1 Chronicles 3:17-18, Haggai 2:23, Jeremiah 18:7-8 | challenger rounds 1, 2 | link 5 (Jeremiah 22:30) | not named; Haggai 1:1 alone was answered |
| Luke 2:4 "of the house and lineage of David" | challenger rounds 1, 2 | link 6 | not named |
| Hebrews 11:17 (monogenēs of Isaac), Acts 13:33, Romans 1:4 | challenger rounds 1, 2 | link 6 | Hebrews 11:17 set aside: "Monogenēs and Isaac. Noted. Not conceding here. Goes to review." (claude_r2, near position 9,850); Acts 13:33 and Romans 1:4 not named |
| Genesis 21:12, Galatians 3:16, 1 Corinthians 15:45 | challenger round 2 | links 4, 6 | not named |
| Luke 2:27, 2:41 ("his parents") | challenger round 1 | link 4 | not named |

- The challenger said so in round 2 (engine_r2, position 8,060): "Two rows the defender set aside rather than answered stand as witnesses I carry".
- How the judges handled it: no judge counted any of them. All three panel seats graded the keystone, link 6, STANDS. GLM's ground for D6 vs C1 reads "every pressed row was answered in the defender's later rounds" (judgment 884, position 4,628), which the table shows to be false. Gemini graded D3 STANDS although Isaiah 8:8 was never named; DeepSeek and Gemini graded D1 STANDS although John 1:45 and Luke 4:22 were never named.
- Rule: "Grade a link BROKEN when the other side exhibited ... witnesses that together contradict it and the broken side's later rounds left any of those witnesses UNANSWERED" (the counting rule quoted in the 32157 file).
- Open question for you: does "Noted. Not conceding here. Goes to review." count as answered or as unanswered? The rule names no such status.
- Solution: the same as 32157 item B5: a check that lists, for each link, the witnesses pressed against it and their position in the defender's later rounds, and makes an uncounted unanswered witness a cure item. A ruling on the "Goes to review" status is needed first.

### B3. Witnesses the defender pressed that the challenger never named in a later round
Searched in the challenger's round 2 (engine_r2) and link round (challenger_r3):
- Matthew 1:22, "Now all this was done, that it might be fulfilled" (defender round 2): position 0 in both. DeepSeek's panel line D3 vs C3 states it: "the challenger answered Isaiah 7:16 but not Matthew 1:22" (judgment 882, position 5,796), and still graded UNDERDETERMINED. That is the K-U class from 32157 (an unanswered witness named, no BROKEN). No K-U flag fired in this run.
- Isaiah 7:11 and the Isaiah 8:3 contrast ("I went unto the prophetess; and she conceived"): position 0 in both.
- Luke 1:31, Genesis 29:32 and Genesis 4:25 (mothers name children): position 0.
- 2 Samuel 12:24 and Hebrews 2:14 (meteschen): position 0. Genesis 2:23: not named (the only "2:23" hits are Deuteronomy 22:23).
- The verb at Matthew 1:20, γεννηθέν (gennēthen): position 0 for "γεννηθ" and "gennēthen" in both rounds. GLM's D2 vs C1 STANDS rests on this, and here the record bears it out.
- πῶς (pōs, "in what manner") at Luke 1:34, and the ἐκ-of-mother rows Matthew 1:3, 1:5, 1:6 (defender link round): not named in the challenger's link round.
- Solution: the check in B2 must run both ways.

### B4. Grounds that rest on what a verse does not state, or on Matthew 1:18 and 1:25 read as excluding the union
Drift guard 8 (DG-8), read live, holds: "'knew her not till she had brought forth her firstborn son' (Matt 1:25) bounds the abstinence to the pregnancy. So the record holds, at L4 footed on those rows, that Joseph knew Mary his wife within the espousal (Sight 32)." Drift guard 61 (DG-61) forbids "cite the verse that states this premise in its own words, or concede" from any seat.

STANDS and BROKEN grades, with their grounds:

| Seat | Line | Ground (quoted) | Class |
|---|---|---|---|
| Single judge | D1 vs C1 CHALLENGER LINK BROKEN | "the text's only statement about Joseph's knowing before the birth is negative" (position 3,292) | 1:25 read as excluding the union |
| Single judge | D6 vs C1 CHALLENGER LINK BROKEN | "no row states Joseph begat the child, and Matt 1:25 negates the knowing" (position 5,643) | both classes; K-C uncured, "NOT COUNTED" |
| Single judge | D3 STANDS | "no pressed witness states that a man was involved" (position 4,227) | verse silence; K-S2, uncured |
| Single judge | D4 STANDS | "the narrowed claim ... is footed and unanswered" | "unanswered" is false: the challenger's link round answered it with Luke 2:48 and 4:22 |
| DeepSeek (panel) | D1 STANDS | "the challenger conceded the grammar ('a change of grammar is not a statement of fact') and offered no verse stating the contrary" (position 3,941) | misread concession; not flagged |
| Gemini | D1 STANDS | "Matthew 1:16 withholds the active verb ... which the defender answered against John 6:42 in CR2" | ignores John 1:45 and Luke 4:22 (B2) |
| Gemini | D3 STANDS | "answering ... Matthew 1:25 in CR3 without an opposing premise listed in DR2" (position 2,932) | rests on the forfeit (B1) and on the defender's link-round reading "Matthew 1:18 and 1:25 both exclude Joseph's knowing before the finding" |
| GLM | D2 vs C1 STANDS | "leaves gennēthen ... unanswered at the verb level" (position 3,230) | sound: verified in B3 |
| GLM | D4 vs C6 STANDS | "the challenger's own narrowing concedes the label states no denial" (position 3,850) | misread: the challenger's narrowed claim ("the row does not state that Joseph was not the father") opposes link 4; it concedes nothing to it |
| GLM | D6 vs C1 STANDS | "no witness the challenger exhibited states in its own words that Joseph begat the child, and every pressed row was answered" | stating-verse ground (K-C, cured by restatement) and a false "every pressed row answered" (B2) |

- The single judge also wrote that the challenger "quotes only to concede its bound" (position 3,239). The challenger's words "the abstinence is stated with its own bound inside the row" are its own reading of 1:25, the same as DG-8's; they are not a concession.
- UNDERDETERMINED lines with the same reading in their body (no grade turned on them): DeepSeek D3 vs C1, "the conception is placed before any coming together at Matthew 1:18" (position 5,287), and D3 vs C3; GLM D3 vs C1, "with 1:18's before they came together".
- Record fact on "came together": lexicon_words gives συνέρχομαι (G4905) as "to convene ... or (specially), cohabit (conjugally)". In original_words the same verb stands at Acts 16:13 (sunelqousaiv, G4905), the women who "resorted" to the place of prayer. The challenger's link round says "The word itself carries the marital-union sense" (challenger_r3, position 5,648), citing 1 Corinthians 7:5 only. This is the Sight 32 question again.
- Solution: (1) your digit on the Sight 32 correction; (2) the enforcer flags a ground that reads Matthew 1:18 or 1:25 as excluding the union; (3) the counting-rule check in B2 also catches "unanswered" or "every pressed row answered" written against the record.

### B5. How HELD 3-0 and UNDERDETERMINED arose together
- Every seat wrote "CLAUSE: HELD-1 -- n=6 w=0 k=0" and "KEYSTONE: D6 -- STANDS" with no withdrawal and no BROKEN defender link, so all three verdict tags are HELD: hence panel verdict HELD, split 3-0.
- The RESULT lines differ: DeepSeek "DEFENDER WINS"; Gemini and GLM "UNDERDETERMINED". underdetermined_seats lists "gemini:RESULT" and "glm:RESULT". The outcome follows the two RESULT lines. (This reading of the derivation comes from the stored fields; the code that combines them was not read.)
- Standings: defense SELF-SUPPORTED, 0 conceded (three seats); challenge SELF-SUPPORTED, 0 conceded (Gemini and GLM against DeepSeek's PROP-DEPENDENT, 1).
- The result row's chain marks and out-of-round fields come from the single judge, not the panel: challenger_chain_mark "STRAINED" (the single judge and DeepSeek) against "FOOTED" from Gemini and GLM; out_of_round_detail holds the single judge's two items word for word.
- So HELD means "no defender link broken", and UNDERDETERMINED means "neither side settled the question". With B1 removing the premise count and B2 and B3 unapplied, nothing could break either chain.
- Solution: none to the combining rule. The causes are B1 to B4. Decide whether the row's chain marks should follow the panel majority rather than the single judge.

## C. Checker flags

| Flag | Seat and item | Judgment |
|---|---|---|
| K-C | Single judge, CHALLENGER CONCEDED LINKS | **False.** The line has no stating-verse ground: "[DR3] LINK 1-6 each name the pressed rows and exhibit at least two prior layers". It matched "name", the known false class. Cured. |
| K-C | Single judge, D6 vs C1 | Correct class. UNCURED for form: "regraded LINK BROKEN without exactly one CORRECTED RESULT line". |
| K-C | Single judge D5 vs C4; panel DeepSeek D5 vs C4, D6 vs C5; GLM D6 vs C1 | Contested class. These grounds say the pressed rows "do not state the contrary" or "do not state a begetting by Joseph". That is the contradiction test ("a witness contradicts a link only when its own words state the contrary"), yet K-C and K-S2 treat it as the retired stating-verse demand. GLM accepted the flag as "the retired stating-verse test". The two rules conflict; your ruling is needed. |
| K-S2 | Single judge D3, D5 vs C4; panel DeepSeek D5 vs C4, D6 vs C1, D6 vs C5; GLM D5 vs C4 | Mostly correct class (verse silence beside a named round). |
| K-S | Single judge D4 | Correct (no answering round named). Cured. |
| K-G4 | Single judge D1 vs C1 and D6 vs C1 | Correct to ask; cured on finding the quotation. The cure accepted "concedes the bound" as an answer, which misreads the challenger (B4). |
| K-G7 | none | Did not fire. The synthesis records the cause it would trip on: "the two link rounds reused the same numerals for different propositions". |

Missed (no flag fired): DeepSeek panel D1 "offered no verse stating the contrary"; GLM D3 vs C1 "neither side's witnesses state in their own words whether the child was begotten by Joseph" (position 3,541); GLM D4 vs C6 concession misread; DeepSeek panel D3 vs C3 unanswered Matthew 1:22 left UNDERDETERMINED (no K-U); Gemini's D3 STANDS resting on the forfeit. Gemini drew no flag at all.

Solution: (1) exclude "name", "names", "does not name" and "never names" from the K-C pattern (from 32157 B2, still open); (2) your ruling on the contradiction-test class; (3) K-U as a cure item (from 32157 B5).

## D. Concessions graded STANDS

- No round contains "CONCEDED" or "WITHDRAWN" (position 0 in all six). The only "conced" hits are "Not conceding here" (defender round 2) and "exhibit-or-concede" (challenger link round).
- The defender narrowed three links in its link round: link 4 ("I drop any claim that Luke 3 is a Mary-line written out in so many words"), link 5 ("I do not claim a verse that names Mary's father") and link 6 ("I drop any claim that the Spirit supplies flesh"). The challenger narrowed its links 5 and 6 ("Limb dropped"). Every judge treated these as narrowings, not withdrawals; GLM: "dropped limbs, not links".
- The defender's two set-asides ("Not conceding here. Goes to review.") are not concessions in form, but no judge weighed them (B2).
- Solution: none to the extractor. The set-aside status needs your ruling (B2).

## E. Citation errors

1. **The citation check reported fifteen real verses as non-existent.** In the link rounds, status "CITED VERSE DOES NOT EXIST" was given to Matthew 1:6 (defender) and to John 1:13, Deuteronomy 22:23, Hebrews 7:13, Hebrews 7:9-10, Genesis 3:12, 16:1, 16:10, Isaiah 54:3, Job 15:14, Job 25:4, Luke 1:13, Luke 2:27, Matthew 1:12 and Luke 3:27 (challenger). Every one is present in kjv_verses, and the quoted words read there; for example Hebrews 7:13, "For he of whom these things are spoken pertaineth to another tribe", and Matthew 1:12, "Jechonias begat Salathiel". The single judge, DeepSeek and GLM repeated the list and gave those quotations "no weight as [L1] footing". The synthesis's confirmation doubted it: "either the checked quotation was mis-worded or the instrument is broken". The instrument is broken: it fails only on link-round items, which carry a link number.
2. **"Ezra 18:7-8" is a parser error.** The challenger wrote "(Haggai 1:1; Ezra 3:2) ... Jeremiah writes his own revocation rule ... (18:7-8)". The bare chapter took the last book named, Ezra. Gemini repeated "Ezra 18:7-8 [intended Jeremiah 18:7-8]".
3. **True errors, confirmed against kjv_verses:** Luke 1:63 cited for words at 1:62 ("And they made signs to his father"); Psalm 139:16 cited for words at 139:15 ("My substance was not hid from thee"); John 7:28 "know whence I am" for "ye know whence I am"; 2 Samuel 12:24 quoted without "and lay with her"; Genesis 4:25 given as "Eve... called his name Seth" where the verse reads "she bare a son, and called his name Seth".
4. Solution: (1) fix the link-round path of the citation checker, testing it on this row's fifteen items; (2) carry the book forward only within one parenthesis, or mark a bare chapter "NOT CHECKED"; (3) the panel prompt should not hand judges a "DOES NOT EXIST" item without a second lookup.

## F. Lexical and grammatical claims checked against the record

Confirmed by original_words (TR-Scrivener1894 and the Hebrew source) and lexicon_words:
- Matthew 1:20 γεννηθέν is G1080 (gennaō), V-APP-NSN, as the defender says; παραλαβεῖν is G3880.
- Romans 1:3 γενομένου and Galatians 4:4 γενόμενον are both G1096 (ginomai), as the defender says.
- Matthew 1:16: ἐξ ἧς, relative G3739 R-GSF (feminine), and ἐγεννήθη V-API.
- Luke 1:34 γινώσκω is V-PAI-1S (present indicative); Luke 1:15 οὐ μὴ πίῃ is an aorist subjunctive (V-2AAS-3S), as the challenger says.
- Luke 3:23 and Acts 16:13 both have ἐνομίζετο, G3543, V-IPI-3S: "the identical verb form", as the challenger says.
- Luke 1:35 in this text has ἐκ σοῦ (G1537, G4771) with γεννώμενον (G1080) and διὸ καί (G1352); Hebrews 2:14 μετέσχεν G3348; Hebrews 2:16 ἐπιλαμβάνεται G1949; Hebrews 11:11 σπέρματος G4690; Hebrews 10:5 κατηρτίσω G2675; Leviticus 12:2 tazria' H2232; Jeremiah 22:30 "ki lo yitslach mi-zar'o ish" matches the defender's Hebrew; Hebrews 11:17 has μονογενῆ (G3439) of Isaac; Isaiah 7:14 and Genesis 24:43 both have ha-'almah (H5959).

Not borne out:
- **Defender:** "The challenger's strongest rows (Rom 1:3, Acts 2:30) ... use ginomai, not gennaō" (claude_r2, position 10,806). Acts 2:30 has no ginomai; its verb is ἀναστήσειν (G450, "raise up").
- **Defender:** ἐνθυμηθέντος (G1760) is set under "LINK none (Matthew 1:19)" (engine_r3, position 5,569); the word stands in Matthew 1:20.
- **Challenger:** "σφυρῶν/ὀσφύος (osphys, 'loins')" at Acts 2:30 (engine_r1, position 9,955). Acts 2:30 has ὀσφύος (G3751). Σφυρά (G4974, "ankle bone") stands at Acts 3:7.
- **Challenger:** "A permanent negation would take the subjunctive with οὐ μή" is Sight 32's unfooted clause again (challenger round 2; footed in the link round with Luke 1:15, Matthew 5:18 and John 11:26).

## G. The synthesis

1. **No false "both agree" was found.** The phrase is absent. Section 1 lists six points "no charge on either side's list contests"; each was checked against both sides' words and holds, including "Both affirm the bound at the birth" for Matthew 1:25.
2. **No false "every link answered".** The phrase is absent. It does not, however, list the unanswered witnesses in B2 or B3, and it never mentions the cut-off round or the forfeit ("truncat" and "forfeit": position 0).
3. **Guards bind the challenger seat only.** Correct (see A5).
4. **Two inaccuracies.** (a) Link 3: "it yielded the Isaiah ground in R2 ('I do not need Isaiah 7:16 to carry it')". The defender declined to rest on the challenger's verse and pressed Isaiah 7:11, 7:14 and 8:3 in the same paragraph; that is not a yield. (b) Link 6: "the R2 answer to the flesh dilemma (Gen 2:7; Gen 2:23; Luke 3:38) does not reappear in R3". Genesis 2:7 and 2:23 are absent from the link round, but Luke 3:38 is present (engine_r3, near position 1,908, under link 4).
5. **Sound points.** The confirmation was right to doubt the citation list (E1), and the synthesis records the numbering clash between the two link rounds (C, K-G7).
6. Solution: the synthesis prompt takes the unanswered-witness list from the B2 check and is told when a round was cut off.

## H. Comparison with run 32194 (row a4922479)

| Point | 32194 | 32205 |
|---|---|---|
| Panel | DeepSeek aborted; ChatGPT substituted; PARTIAL, "2-0 (1 not counted: debate rule)" | All three returned; HELD 3-0; no substitution |
| Rounds | No truncation; the challenger's round 2 has its list (UNSUPPORTED at position 6,673); quarantine null | Challenger round 2 cut off, no list, link round forfeited; auto-quarantined |
| Concessions | Defender "LINK 2: CONCEDED"; Gemini and GLM marked D2 STANDS; the extractor caught it | None; three narrowings each side, treated as narrowings |
| GROUND | On every line (32194 file) | 11/11, 9/9, 6/6 with "-- GROUND:"; single judge 6/6 as ". GROUND:" |
| "Came together" / "till" | Gemini, a counted seat, graded the union link BROKEN on 1:18 | No panel BROKEN; the single judge graded two challenger links BROKEN on 1:25; panel UNDERDETERMINED bodies read 1:18 as excluding |
| K-G4 | ChatGPT dropped; checker checked the quote only | No seat dropped; K-G4 fired only on the single judge, cured |
| False flags | K-G4 missed a later-round answer | K-C fired falsely on "name"; contradiction-test grounds flagged as stating-verse grounds |
| Unanswered witnesses | Not listed in the 32194 file | Many on both sides (B2, B3); none counted |
| Citations | Job 14:4 for 25:4, wording at five verses | Fifteen real verses called non-existent; one parser book error |
| Synthesis | Opens "Both seats engaged chains as chains"; audit "CHALLENGER SEAT ONLY" (not read whole) | Audit "challenger seat only"; two inaccuracies (G4) |
| Standings | No majority between two counted seats; fields null | Unanimous defense SELF-SUPPORTED, 0 conceded; challenge SELF-SUPPORTED by 2 of 3 |
| Cache | 73,395 written, 272,275 read | 24,630 written, 291,189 read |
| Outcome | UNDERDETERMINED | UNDERDETERMINED |

The two runs reach the same outcome by different routes: in 32194 a dropped seat and a missed concession left no majority; in 32205 a cut-off round removed the premise count, and the counting rule was not applied in either direction.

## I. Order proposed

1. B1: raise the challenger's round-2 max_tokens, and retry or stop on a truncation marker before judging (your word on the limit).
2. E1 and E2: fix the citation checker's link-round path and the bare-chapter book carry. These feed false "citation errors" to every judge.
3. B2 and B3: the two-way unanswered-witness check, after your ruling on the "Goes to review" status.
4. C: K-C pattern exclusions, and your ruling on whether "the pressed rows do not state the contrary" is the permitted contradiction test or the retired stating-verse ground.
5. B4: your digit on the Sight 32 correction; then the enforcer flag for grounds that read Matthew 1:18 or 1:25 as excluding the union.
6. B5: decide whether the row's chain marks follow the panel majority or the single judge.
7. G: the synthesis prompt lines.

## Not read

- The execution records (n8n) were not opened, under the reading rule; so the cause of the 734-second challenger round, its max_tokens setting and the outcome-combining code are not seen.
- The 32194 rounds, judgments and synthesis were not read whole in this pass; the comparison uses that run's result fields, review notes, counts by SQL and the 32194 file.
