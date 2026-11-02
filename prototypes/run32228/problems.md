# Run ODV1-32228: problems and solutions

Flow version 52b05334 (as given in the brief; the row has no column that records the flow version). Fired 02:09 CST 2026-11-02 (first node 08:09:05Z), stopped about 03:08 CST, status success. The timings file's last node, Record Alternates, starts at 09:09:36Z (03:09:36 CST); the run took about 60.5 minutes.
Row b335085b (debate_results), run token ODV1-32228-3dmdoa5k. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome "UNGRADED [dash] REVIEW" (the stored value joins the two words with a long dash); panel_verdict and framework_verdict CONTESTED; panel_split "1-1-1"; judged_by chatgpt, gemini, qwen; panel_expected chatgpt, gemini, qwen (the field holds the final seats, not the expected DeepSeek, Gemini, GLM); data_class "contested"; quarantine_reason NULL; defense and challenge standing PROP-DEPENDENT; conceded counts NULL ("no majority among the 3 counted seat(s)"); defender chain mark STRAINED, challenger FOOTED; underdetermined_seats chatgpt:COLLISION, gemini:RESULT, qwen:COLLISION, qwen:RESULT.
Cache: 63,456 tokens written, 275,891 read (input 495,118, output 333,452).

**Token limits.** Every seat ran at 64,000 output tokens, with floors of 65,536 for the DeepSeek judges and the MiMo judge (as given in the brief). The only limit the row records is the synthesis call's: "[SYNTHESIS USAGE: prompt=45251 completion=20288 reasoning=16915 finish=stop max_tokens=64000]" (32212: max_tokens=384000). No round was cut: position('TRUNCAT') is 0 in all six rounds, and the challenger's round 2 ends with "PREMISE COUNT: 6" (position 9,025 of 9,040).

Nothing here is applied. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 8,338); the challenger's round 1 (engine_r1, 10,812); the defender's round 2 (claude_r2, 12,843); the challenger's round 2 (engine_r2, 9,040); the defender's link round (engine_r3, 9,478); the challenger's link round (challenger_r3, 6,978); the three stored panel judgments (debate_judgments 888 Qwen 4,633; 889 Gemini 4,869; 890 ChatGPT 8,867), each with its audit, cure and alternate lines; the removed DeepSeek judgment, which is stored only inside drv_removed (verdict_raw with its audit lines, read whole); the single judge (independent_verdict_raw, 11,057); the synthesis with its confirmation (14,163); the review notes (2,570); out_of_round_detail (124); the citation check (citation_check, 28,132 as text: the first 14,000 characters read as text, then all 237 items by side, round, link and status, and every item whose status is not MATCHES in full); panel_verdict, panel_split, panel_fingerprint (60e1ee97...), panel_substitution, drv_removed; odv1_drv_removals (one row); drift guards 8, 59 and 61, read live. debate_replay_judgments holds no row for this run. Each pressed witness was checked by name with SQL position() in the holding side's later rounds. Lexical claims were checked against original_words, lexicon_words and kjv_verses.

**Round labels.** In the judges' text "CR" marks the defender's (Claude's) rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n". The defender's round-2 and link-round "LINK" numbers are not the chain's D numbers: its LINK 1 is D1, LINK 2 is the "he knew the child was not his" premise (D4's footing), LINK 3 is D3, LINK 4 is D5, LINK 5 is the "Mary is the only human parent in the flesh" premise (D6). The challenger's premise list numbers its items 1 to 6 against LINK 5, 1, 2, 3, 4 and 4. Several faults below come from this mismatch.

## Timings (timings_32228.json, seconds)

| Step | Start (Z) | Seconds | 32212 |
|---|---|---|---|
| Defender round 1 | 08:09:05 | 45.5 | 49.1 |
| Challenger round 1 | 08:09:52 | 323.1 | 498.8 |
| Defender round 2 | 08:15:17 | 97.2 | 117.1 |
| Challenger round 2 | 08:16:56 | 466.3 | 535.5 |
| Defender link round | 08:24:44 | 88.2 | 72.3 |
| Challenger link round | 08:26:14 | 231.6 | 612.5 |
| Synthesis (DeepSeek) | 08:30:07 | 124.3 | 127.1 |
| Single judge (Independent Verdict Call) | 08:32:16 | 185.3 | 284.4 |
| Single judge cure (Cure Call deepseek) | 08:35:23 | 60.0 | 93.3 |
| Diagnostic (DeepSeek) | 08:36:25 | 9.0 | 14.4 |
| Panel judge 1, DeepSeek | 08:36:36 | 224.5 | 212.1 |
| Panel judge 2, Gemini | 08:40:21 | 229.1 | 166.5 |
| Panel judge 3, GLM (failed closed) | 08:44:10 | 354.8 | 73.6 |
| Panel reserve, ChatGPT | 08:50:06 | 104.5 | 87.9 |
| Panel cure 1, DeepSeek seat | 08:51:53 | 61.1 | 49.2 |
| Panel cure 2, Gemini seat | not called (no mark) | none | 6.0 |
| Panel cure 3, ChatGPT seat | 08:52:56 | 13.7 | 41.7 |
| Alternate call (Qwen for the DeepSeek seat) | 08:53:11 | 981.7 | 1,194.6 |
| Alternate cure | not called ("Alternate Cure Needed?" 0.0) | none | 484.4 |
| Record Alternates | 09:09:36 | 0.4 | 0.4 |

The challenger's three rounds took 1,021.0 seconds (32212: 1,646.8); the defender's three took 230.9 (32212: 238.5). The alternate call took 981.7 seconds, 27 percent of the run, and was the longest single call.

**Which model took 981.7 seconds.** The timings file names the node only ("Alternate Call openrouter"). The record names the model: drv_removed gives replaced_by "qwen", replaced_by_model "qwen/qwen3.8-max-0902", and the DeepSeek judgment's last audit line reads "ALTERNATE TRIED -- SEAT: deepseek; ALTERNATE: qwen; MODEL: qwen/qwen3.8-max-0902; RESULT: SEATED". There was one alternate call, so the 981.7 seconds are Qwen's. Its reply is the shortest of the run (4,633 characters, judgment 888). Your rule is that a model that cannot answer within the time limit is removed. The record holds no time limit value for the alternate call, so whether 981.7 seconds exceeds it cannot be read from the database. Qwen answered and was seated; if the limit is below 981.7 seconds, the flow seated a model your rule removes. In 32212 the same model took 1,194.6 seconds and was not seated.

---

## A. What the change did

1. **K-C did not fire on a CONCEDED LINKS line in any seat.** In 32212 it fired falsely on DeepSeek, Gemini and the single judge on "names", "never names", "did not name" and "unstated". Here the CONCEDED LINKS lines carry the same class: DeepSeek "not named in [CR3]" and the quoted "I cannot exhibit two layers"; ChatGPT "did not subsequently name" (890, 1,095) and "did not name or answer" (2,281); the single judge "is not named in [DR3]"; Gemini "left unanswered" and "went unanswered". No mark fired on any of them. The record does not log which clauses the mask removed, so this is read from the absence of marks.
2. **Every K-C mark that did fire was in the true class** (section E): DeepSeek D6 vs C2 and the single judge's D1, D2 and D6 vs C1.
3. **K-G4's new cure test ran once and was right on its own test**: ChatGPT D2 vs C3 was CURED with "the pressed witness is named in no later defender round" (section B3).
4. **K-G4 still fires on every DEFENDER LINK BROKEN line**, whatever the ground. It fired on DeepSeek's and the single judge's D5 vs C6, whose grounds are a stated concession; position('unanswer') is 0 in both lines. Both judges retracted, and the retraction changed both seats' results from BROKEN to HELD (B2).
5. **K-G7 fired falsely twice on the link-number mismatch**, and on ChatGPT its cure raised the defender count from 3 to 4 and the standing to COLLAPSED (B3).
6. **The panel counted three seats, not zero**, but they split three ways (B1).
7. **Rounds were shorter for MiMo** (323.1, 466.3, 231.6 seconds against 498.8, 535.5, 612.5) at the 64,000 limit. The record does not show why.

## B. Faults that decided the outcome

### B1. Why the split is 1-1-1
| Seat | Verdict | Clause | What it rests on |
|---|---|---|---|
| Qwen (888), alternate for DeepSeek | HELD | HELD-1, n=6 w=0 k=0 | No link broken or withdrawn; D5 vs C6 UNDERDETERMINED because the legal-heir limb was conceded; defender c=1 (premise 6), challenger c=0, challenge SELF-SUPPORTED. |
| Gemini (889) | PARTIAL | PARTIAL-1, n=6 w=1 k=0 | "D5: WITHDRAWN -- GROUND: Defender in [CR3] conceded premise 6" (3,281); every other link STANDS; c=2 each side. |
| ChatGPT (890), reserve for GLM | BROKEN | BROKEN-1, n=6 w=1 k=1 | D2 vs C3 and C4 DEFENDER LINK BROKEN on Acts 1:8 and the other usage witnesses pressed in challenger round 1 and never named again; D5 WITHDRAWN (3,952); defender COLLAPSED 4 after the K-G7 cure. |

The three seats divide on two questions the rules leave open, not on the text:
1. **What a conceded premise does to its link.** The defender wrote "LINK 4 [premise 5]: SUPPORTED as a conditional only" and "LINK 4 [premise 6]: CONCEDED" (engine_r3, 6,175), and no "WITHDRAWN" anywhere. Five judges read this five ways: Qwen UNDERDETERMINED; Gemini and ChatGPT WITHDRAWN (w=1, while also counting premise 6 in c, so the one concession is counted twice); DeepSeek and the single judge DEFENDER LINK BROKEN, then UNDERDETERMINED after the false K-G4 mark made them retract.
2. **Whether an answer in substance, without the verse's number, answers a pressed witness.** The defender's round 2 met eperchomai and episkiazō by the words themselves: "ἐπέρχομαι (eperchomai, \"come upon\") and ἐπισκιάζω (episkiazō, \"overshadow\") can be used of empowerment, as the challenger says. At Luke 1:35 they are the answer to a question about a man" (claude_r2, 5,223). Acts 1:8, Acts 5:15, Matthew 17:5, Mark 9:7 and Luke 9:34 are at position 0 in the defender's round 2 and link round. ChatGPT broke D2 on them; Qwen, the single judge and DeepSeek say they "were answered in [CR2] III". This question has been open since 32212.
- Without the substitutions the result would still split: DeepSeek's corrected result was HELD (HELD-1), so DeepSeek, Gemini and ChatGPT would be HELD, PARTIAL and BROKEN. GLM's grade is unknown (B4).
- Solution: your rulings on (1) whether a stated CONCEDED premise under a link that stays SUPPORTED is graded WITHDRAWN, BROKEN or neither, and whether it may count in both c and w; (2) whether an answer in substance answers a pressed witness. Then the enforcer can hold every seat to one reading.

### B2. K-G4 fires on BROKEN lines that rest on a concession, and the retractions changed two results
- DeepSeek (removed seat) D5 vs C6: "GROUND: [CR3] LINK 4 [premise 6] concedes it cannot exhibit 'a legal heir received by taking is not seed'". The audit: "D5 vs C6 DEFENDER LINK BROKEN counts a witness as unanswered". The line counts no witness as unanswered. Cure: "RETRACTED: D5 vs C6 / CORRECTED RESULT: HELD-1", with the judge's own reason: "My BROKEN grade rested on the concession ... not on an unanswered witness". Result BROKEN changed to HELD.
- The single judge D5 vs C6: the same ground and the same false mark; cure "The BROKEN grade was unanswered-false ... that stated surrender is counted under CONCEDED LINKS, not as a witness left unanswered, so the line is regraded UNDERDETERMINED". Result BROKEN changed to HELD; the review notes record it as "CURED ... recorded, not for review".
- Judgment: the mark is **false** in both (the trigger is the grade, not the ground). The cure test passed a retraction, as the README says it should. The judges may be right that a concession is not a BROKEN ground, but that is a question for your ruling (B1), and it was settled here by a false mark.
- Solution: fire K-G4 only when the BROKEN line's ground names an unanswered, unnamed or unmet witness; a BROKEN line that rests on a quoted concession goes to the concession rule.

### B3. ChatGPT's count rests on a mis-mapped premise and a false K-G7
1. **Premise 3 counted on witnesses that were not pressed against it.** ChatGPT: "Premise 3 UNEXHIBITED (unanswered witnesses): [DR1] pressed the births 'of God' against D2, but the defender did not subsequently name 1 John 5:1, 1 John 3:9, or 1 John 4:7" (890, 986). The challenger's premise 3 is "LINK 2: ... \"which means he knew the child was not his\"", pressed with Matthew 1:19, Matthew 1:25, Genesis 4:1 and Deuteronomy 22:24. All four are named in the defender's link round (3,801; 3,420; 3,560; "Deuteronomy 22:23-24" at 3,651). The 1 John rows are in no PRESSED WITH list. Premise 3 should be spared. The 1 John rows are indeed at position 0 in the defender's round 2 and link round.
2. **K-G4 on D2 vs C3, CURED: correct on the naming test.** The cure quoted the pressing sentence of challenger round 1 ("eperchomai (come upon) is the empowerment word of Acts 1:8 ... and Acts 5:15 (Peter's shadow)"); kg4Answered found none of the pressed witnesses named in a later defender round. That matches position(): Acts 1:8, Acts 5:15, Matthew 17:5, Mark 9:7 and Luke 9:34 are all 0 in claude_r2 and engine_r3. Whether the substance answer at claude_r2 5,223 counts is B1 (2).
3. **K-G7 on D2 vs C3: false.** "D2 vs C3 DEFENDER LINK BROKEN while counted_premises_defender does not list premise 2." Premise 2 is the challenger's item against the defender's LINK 1 (D1, the passive verb), not against D2; no premise in the list is against D2. The cure answered with "CORRECTED COUNT: DEFENDER 4 / CORRECTED STANDING: DEFENDER COLLAPSED", and the audit stored "ORIGINAL: PROP-DEPENDENT, 3; COUNTED: COLLAPSED, 4". Premise 2's seven witnesses (John 6:42, Luke 4:22, Luke 2:27, Luke 2:41, Luke 2:48, Matthew 1:21, Luke 1:32) are all named in the defender's link round (2,342; 2,426; 2,180; 2,233; 2,684; 2,822; 1,162). The 32212 file warned that K-G7 is fragile wherever list numbers and link numbers differ; here it produced a wrong standing.
4. Under ruling (a) the defender's counted premises are 4 (Isaiah 8:8) and 6 (conceded), c=2, PROP-DEPENDENT; ChatGPT's stored COLLAPSED 4 is unsound by two premises.
5. **Challenger premise 1 VOID**: "premise 1 is void because its quotation requires a body at every generation but does not itself assert a human father at the last link" (2,026). The quotation "Bodily descent is the whole point: it requires a body at every generation." is in the challenger's round 2 (259). The judge prompt's VOID rule was not read, so whether this is a proper VOID cannot be said from the record. The effect is that Luke 1:42 and Galatians 4:4, both unanswered (B5), were not counted.
- Solution: K-G7 maps a D link to the premise whose PRESSED WITH line or quotation belongs to it, not to the premise of the same number; a premise is counted only on witnesses in its own PRESSED WITH list (or a judge must say why another witness belongs to it).

### B4. GLM failed closed on an envelope the parser did not recognise
- panel_substitution: "FAIL-CLOSED: seat \"glm\" returned an envelope this parser does not recognise. Top-level keys: [id,object,created,model,provider,system_fingerprint,service_tier,choices,usage]. NO ROW IS WRITTEN.", failure_kind "no_usable_judgment", substitute "chatgpt", at 08:50:06.819Z. The call ran 354.8 seconds.
- Those keys are the ordinary chat-completion envelope. The parser therefore did not find the reply where it looks inside choices (for example an empty content field with the text elsewhere); which it was cannot be determined, because no part of the reply is stored. In 32212 GLM failed differently ("returned no JSON object", with the first 200 characters stored).
- Solution: as in 32212 B1, store the raw reply of a seat that fails closed; and log which path inside choices was empty. Your word is needed on whether to read GLM's execution record.

### B5. Witnesses pressed against the challenger that its link round never named
The defender's link-round premise list (engine_r3) can be answered only in the challenger's link round. Position 0 in challenger_r3 unless noted:

| Witness | Pressed in | Against challenger premise | Challenger's later rounds |
|---|---|---|---|
| Luke 1:42 "blessed is the fruit of thy womb" | defender link round, premise 1 | 1 (flesh needs a father at the last link) | not named in any challenger round |
| Galatians 4:4 "made of a woman" | defender link round, premise 1 | 1 | not named in the link round; named in challenger rounds 1 (7,798) and 2 (7,883), both before this press, as the mortality idiom (Job 14:1) |
| Luke 1:31 "thou shalt conceive in thy womb" | defender link round, premise 3 | 3 ("therefore also" gives power, not a paternity sentence) | not named in any challenger round |
| Jeremiah 22:24 (the signet plucked from Coniah) | defender link round, premise 6 | 6 | not named; the challenger itself cited it in round 1 (8,362), before the press; its link round says "the signet is set on Zerubbabel" (6,565), an answer in substance |
| Matthew 1:16 | defender link round, premises 1, 2, 6 | 1, 2, 6 | named only as "Matthew 1:11-12, 16" in link 6 (5,754) |

- Who counted them: Luke 1:42 by DeepSeek, Gemini and the single judge; Jeremiah 22:24 by DeepSeek, Gemini, ChatGPT and the single judge. **No judge counted Luke 1:31 or Galatians 4:4.** Qwen counted none and graded the challenge SELF-SUPPORTED (c=0); under ruling (a) its count is unsound by at least premises 1, 3 and 6.
- Every other witness in the defender's six PRESSED WITH lists is named in the challenger's link round (Romans 1:3, Luke 1:35, Luke 3:38, Hebrews 7:10 as "Hebrews 7:5, 10" and "Hebrews 7:9-10", Luke 1:34, Matthew 1:20, John 1:13, Matthew 1:18, 1:19, 1:24, 1:25, Luke 1:32, Haggai 1:1 as "Haggai 2:23; 1:1", Luke 3:23).
- Ruling (b) and the judge prompt: no judge missed an answer in the challenger's round 1 because the prompt names only "[DR2] or [DR3]". The only defender press that the challenger answered in round 1 is Hebrews 10:5 (defender round 1; challenger round 1, 3,937: "names the maker of the body"), and no judge charged it. Every witness the judges counted was pressed in the defender's link round, after which only the challenger's link round exists.

### B6. Witnesses pressed against the defender that its later rounds never named
Searched in the defender's round 2 (for presses in challenger round 1) and link round (for presses in challenger rounds 1 and 2):

| Witness | Pressed in | Against | Defender's later rounds |
|---|---|---|---|
| Isaiah 8:8 "O Immanuel" | challenger rounds 1, 2 (premise 4) | link 3 | not named in either; round 2 says the Isaiah 8:3 child is "not Immanuel" (6,094), and the link round narrowed link 3 to drop "Isaiah 7:14 alone" |
| Acts 1:8, Acts 5:15, Matthew 17:5, Mark 9:7, Luke 9:34 | challenger round 1 (round 2 repeats Acts 1:8 and 5:15 in prose, not in a PRESSED WITH line) | D2 | not named; answered in substance at claude_r2 5,223 (B1) |
| 1 John 5:1, 3:9, 4:7 | challenger round 1 | D2 | not named; John 1:13 answered by name (claude_r2 4,518) |
| Psalm 2:7 with Acts 13:33 | challenger round 1 | D2 | not named |
| Luke 1:13 (Zacharias names John) | challenger round 1 | D1 (naming) | not named; met with Luke 1:60 (claude_r2 3,371) |
| Isaiah 54:3; Matthew 11:11 | challenger round 1 | D3 | not named |
| Acts 8:20, Acts 21:29 | challenger round 1 | D4 (enomizeto) | not named; Acts 16:13 answered by name (claude_r2 2,918) |
| 1 Chronicles 3:17-18; Ezra 3:2 | challenger round 1 | D5 | not named; conditional kept, premise 6 conceded |
| Acts 2:30, 2 Samuel 7:12, Psalm 132:11, Numbers 1:2 | challenger rounds 1 and 2 (premise 1) | link 5 | named and answered in round 2 (709; 774; 831; 11,951); not named in the link round after the round-2 re-press |
| Luke 2:4 | challenger rounds 1 and 2 (premise 1) | link 5 | named as "Luke 1:27 and 2:4" in round 2 (12,130); not named in the link round (the "Luke 2:4" hit at 2,233 is Luke 2:41) |
| Numbers 1:2 | challenger round 2 (premise 6) | link 4 | not named in the link round; premise conceded |

- Every witness in the challenger's premise 2, 3 and 5 lists is named in the defender's link round; premise 3's Deuteronomy 22:24 only as "Deuteronomy 22:23-24".
- Isaiah 8:8 is the one listed witness never answered by name or in substance. DeepSeek, Gemini and ChatGPT counted premise 4; Qwen ("premises 1 and 4 counted in their narrowed forms") and the single judge ("premises 1-5 spared as narrowed/supported") did not. Under ruling (a) those two counts are unsound by one premise.
- Open: does a witness answered after its first press, and re-pressed later without a fresh answer, count as answered (premise 1)? No judge counted premise 1 against the defender.

## C. Concessions, narrowings and STANDS

- The defender's link round holds one express concession ("LINK 4 [premise 6]: CONCEDED", 6,175) and two narrowings ("LINK 5: NARROWED TO" the conditional flesh-line; "LINK 3: NARROWED TO" the New Testament limb). The challenger narrowed nothing and conceded nothing. Out of round, the defender's round 2: "I grant that Genesis 3:15, Jeremiah 31:22 and Galatians 4:4 do not each say \"without a man\" on their own." All four judges list it; ChatGPT also lists two arguments as concessions ("Psalm 139:13 does name the maker of every man ..." and "... can be used of empowerment, as the challenger says"), the second of which is a grant.
- **STANDS beside a dropped limb.** The defender dropped "any claim that a verse names Mary's own descent" (engine_r3, near 120). Gemini then grades D6 STANDS on "bodily descent from David is satisfied through Mary's womb" (889, 3,737). The single judge's cure restated D6 vs C1 as STANDS on "(L3) Luke 1:35 \"of thee\"" and "ἐκ γυναικός". Both route the flesh through Mary, which drift guard 8 forbids ("routing the flesh through Mary alone (her Davidic descent is not established, Sight 6)"); the defender itself holds it only as a conditional.
- **A cure that changed a grade.** The single judge's original D6 vs C1 was UNDERDETERMINED; its RESTATED line reads "D6 vs C1 (Romans 1:3): STANDS". The cure was to restate the ground, not the grade, and it was accepted (K-C CURED, KINDS L1, L2, L3).
- **Narrowing read as withdrawal.** ChatGPT's D5 WITHDRAWN rests on "[CR3] retained only the conditional bar and disclaimed more" (3,952), that is, on the narrowing as much as on the concession. The synthesis grades the narrowed link 3 "CONCEDED-BY-ITS-OWN-SIDE" and says "two were withdrawn by the defender's own hand" (1,690).
- **Counted premise beside STANDS.** Gemini counts premise 4 UNEXHIBITED (Isaiah 8:8) and grades D3 STANDS; ChatGPT counts it and grades D3 vs C3 UNDERDETERMINED. Under the rule a link breaks only on witnesses that "together contradict it", so this is consistent if Isaiah 8:8 does not contradict D3, which ChatGPT says and Gemini does not.
- Solution: your ruling in B1 (1); a check that a STANDS ground does not rest on a limb its side dropped; a cure that changes a grade is not accepted as a restatement.

## D. Grounds that read Matthew 1:18 or 1:25 as excluding the union, or rest on what a verse does not state

Drift guard 8 (rule_num 8), read live: "\"knew her not till she had brought forth her firstborn son\" (Matt 1:25) bounds the abstinence to the pregnancy. So the record holds, at L4 footed on those rows, that Joseph knew Mary his wife within the espousal (Sight 32)", and forbids "routing the flesh through Mary alone". Drift guard 61 forbids "cite the verse that states this premise in its own words, or concede" "from either side and from any seat".

| Seat | Line | Ground (quoted, with position where read) | Class | Flag |
|---|---|---|---|---|
| Gemini | D2 vs C5 STANDS | "The explicit timing of the conception before coming together refutes the inference of begetting by Joseph." (2,705) | 1:18 read as excluding the union | none fired |
| Gemini | reasoning | "this construction cannot overturn the explicit temporal markers of the narrative" (676) | the same | none fired |
| Gemini | D6 vs C1 STANDS | "bodily descent from David is satisfied through Mary's womb" (3,737) | flesh through Mary | none fired |
| DeepSeek (removed) | D1 vs C5 STANDS | "C5's own 'knew her not till' bounds the abstinence through the birth" | 1:25 used against the union | none fired |
| DeepSeek (removed) | D2 vs C3 and D4 vs C5 STANDS | "answered ... by Matthew 1:18 'before they came together'"; "answered the timing witnesses from Matthew 1:18 and 1:25" | 1:18 and 1:25 as excluding the union | none fired |
| DeepSeek (removed) | D6 vs C2 STANDS | "C2 does not state an immediate begetting by Joseph" | stating-verse ground | K-C, correct (E) |
| Qwen | D2 STANDS | "tying Luke 1:34-35 to the question about a man and to the non-knowing before the birth" (2,134) | 1:25 as excluding the union, mildly | none fired |
| Single judge | D1 STANDS | "C5's timing witnesses do not state Joseph begat, and [CR3] LINK2 answers them with Matthew 1:18 and 1:25" | both | K-S2, K-C (cured) |
| Single judge | D2 restated | "(L1) Matthew 1:18 \"before they came together\" ... standing where the man would stand" | 1:18 as excluding the union; accepted by the cure | the cure passed it |
| Single judge | D3 STANDS | "no challenger link in [DR3] exhibits contrary words on Matthew 1:22-23 or Luke 1:34-35" (1,635) | stating-verse ground | **none fired** |
| Single judge | D4 STANDS | "C5/C6 do not deny legal/reported \"father\" language" (1,860) | what a verse does not state | **none fired** |
| Synthesis | section 5 | "1 Corinthians 7:5 \"come together again,\" is sexual reunion ... the citation cuts toward the defender's reading of Matthew 1:18 as conception before cohabitation" (11,153) | 1:18 as excluding the union | not audited (the synthesis audits the challenger seat only) |
| Synthesis | section 5 | "the inference is by construction, not by a row that says it" (11,781) | stating-verse ground against the challenger's premise 4 | not audited |

- Record facts on "came together": original_words gives Matthew 1:18 "prin h sunelqein autouv", G4905; 1 Corinthians 7:5 "sunerchsqe", G4905 (V-PNS-2P), so the challenger's "the same verb names married union at 1 Corinthians 7:5" is borne out; Acts 16:13 also has G4905 ("sunelqousaiv gunaixin", the women who resorted there). lexicon_words G4905: "to convene, depart in company with, associate with, or (specially), cohabit (conjugally)". This is the Sight 32 question again.
- Solution: as in 32212 B5: your digit on Sight 32; an enforcer mark for a ground that reads 1:18 or 1:25 as excluding the union and for one that routes the flesh through Mary; K-S2 to match "exhibits contrary words" and "do not deny".

## E. Checker marks, one by one

| Mark | Seat and item | Judgment |
|---|---|---|
| K-C | DeepSeek, D6 vs C2 | **Correct class** ("C2 does not state an immediate begetting by Joseph"). UNCURED: "no RESTATED line for D6 vs C2". The judge statement does restate it ("The restated line drops the ground that C2's verses do not state an immediate begetting and instead weighs chain against chain ..."), but not under the label RESTATED. The seat was removed on form, as DeepSeek was on D5 in 32212. Its result after the K-G4 retraction was HELD. |
| K-G4 | DeepSeek, D5 vs C6 | **False** (the line rests on a concession; position('unanswer') 0). Cured by retraction; the retraction changed the result (B2). |
| K-G7 | DeepSeek, D5 vs C6 | **False**: "counted_premises_defender does not list premise 5". DeepSeek counted premise 6, which is the premise under D5 (the defender's LINK 4); premise 5 is the SUPPORTED conditional. Cured by retraction. |
| v1 same-model divergence | DeepSeek seat against the single judge (both deepseek-flash): defender conceded 2 against 1 | Correct to report. The difference is Isaiah 8:8 (B6). |
| (none) | Gemini | No mark fired. Missed: D2 (1:18), D6 (flesh through Mary), D5 WITHDRAWN double-counted with premise 6 (B1, C, D). Two C-LABEL OFF THE GUIDE notes, recorded only. |
| (none) | Qwen | No mark fired. Missed: challenger count 0 against four unanswered witnesses, defender premise 4 not counted (B5, B6). EXTRACTOR v18 "SPLIT LINK D4" (see below). |
| K-G4 | ChatGPT, D2 vs C3 | **True fire; CURED correctly on the naming test** (B3 2). The first live use of kg4Answered. |
| K-G7 | ChatGPT, D2 vs C3 | **False** (link-number mismatch); its cure made the count wrong, COLLAPSED 4 (B3 3). |
| K-U | ChatGPT, D3 vs C3 UNDERDETERMINED ("Isaiah 8:8 was left unanswered", 3,570) | **False in substance**: the line states "The unanswered words do not themselves contradict the declared link", and the premise is counted UNEXHIBITED as ruling (a) asks. Review only. |
| C-LABEL OFF THE GUIDE | ChatGPT and Gemini, D1 vs C5; Gemini D3 vs C4 | Recorded, not counted. The challenger's link-round block 5 is the timing chain and does not name Matthew 1:16; correct to record. |
| EXTRACTOR v18 SPLIT LINK D4 | Qwen, ChatGPT, single judge | **Right detection, wrong label.** The split link is the defender's LINK 4 (premise 5 SUPPORTED, premise 6 CONCEDED), which is chain link D5, not D4. |
| K-S2 | Single judge, D1, D2, D6 vs C1 | Correct. |
| K-C | Single judge, D1, D2, D6 vs C1 | Correct class; CURED by RESTATED lines. The D6 cure changed the grade from UNDERDETERMINED to STANDS and rests on the Mary route (C); the D2 restated line keeps the 1:18 reading (D). |
| K-G4 | Single judge, D5 vs C6 | **False** (concession ground). Cured by retraction; result changed from BROKEN to HELD (B2). |
| v18 CHALLENGER CONCEDED 2 STATED BUT NO TAGGED ITEM PARSED | Single judge | **False.** The items are tagged "C1 (DR3 LINK1) UNEXHIBITED:" and "C6 (DR3 LINK6) UNEXHIBITED:"; the parser did not read that form. |
| v18 collision map | Single judge "D1=STANDS ... D5=BROKEN D6=STANDS" | D6 vs C1 was UNDERDETERMINED in the original text; the map reads it as STANDS. |
| K-G2, COUNTED PREMISES FIELD ABSENT | Single judge | Recorded only. |

Masked or cured by the fixes (K-C): the CONCEDED LINKS lines of DeepSeek, Gemini, ChatGPT and the single judge, and the quoted concessions inside them, raised no mark (A1). Right in every case: each rests on a pressed witness unanswered or on a stated concession.
Missed by the checks: the single judge's D3 and D4 silence grounds; every 1:18 and 1:25 ground in D; Gemini's and the single judge's flesh-through-Mary STANDS; ChatGPT's premise 3 counted on witnesses outside its PRESSED WITH list; Qwen's and the single judge's uncounted Isaiah 8:8; every judge's uncounted Luke 1:31 and Galatians 4:4; the double count of the premise 6 concession in c and w.

Solution: K-G4's trigger (B2); K-G7's mapping (B3); accept a judge statement that gives the restated line in full when the label is missing, or tell the judge plainly that the line must begin "RESTATED:"; K-S2 additions (D); the v18 parser reads "UNEXHIBITED:" items; the SPLIT LINK label maps the defender's round link number to its D number.

## F. Citation checker

Totals stored: checked 237, matches 223, mismatches 9, not_checked 5. Load-bearing items: 13 of 21 in the challenger's link round, 25 of 46 in the defender's. **No real verse was reported as non-existent** (32212: Isaiah 8:18). Every non-match, checked against kjv_verses:

| Item | Status | Judgment |
|---|---|---|
| Matthew 1:19, challenger rounds 1 and 2 | WORDING DIFFERS | True but trivial: the challenger wrote "public example", kjv_verses has "publick example" and "just [man]". |
| Genesis 24:60, challenger rounds 1 and 2 | WORDING DIFFERS | True: "thou art the mother of thousands of millions" against "be thou [the mother] of thousands of millions". |
| Haggai 2:23, challenger rounds 1 and 2 | WORDING DIFFERS | True: "and I will make thee as a signet" against "and will make thee as a signet". |
| Ezra 2:61-62, challenger round 2 | WORDING DIFFERS | True: "called after the name" against "was called after their name". |
| 1 Corinthians 1:19, challenger round 2 | WORDING NOT FOUND IN 1 Corinthians | **False.** The words are "\"Joseph her husband\" (1:19)", that is Matthew 1:19; the bare chapter took its book from "1 Corinthians 7:5" earlier in the paragraph. This is the 32212 Genesis 1:24 book-carry fault again. |
| Galatians 4:4, defender round 2 | WORDING NOT FOUND IN Galatians | **False.** "come to be out of a woman" is the defender's rendering of "γενόμενον ἐκ γυναικός", given in parentheses as a gloss, not a KJV quotation. kjv_verses has "made of a woman", which the defender quotes correctly elsewhere. |
| Jeremiah 31:22 and Luke 2:48-49 (defender round 1); Galatians 4:4 (defender round 2); Acts 5:15 (challenger round 2); Haggai 2:23 (challenger link round, link 6) | NOT CHECKED | No reason is stored. |

- Effect on the judges: all four (DeepSeek, Gemini, ChatGPT, Qwen) and the citation lines repeat "1 Corinthians 1:19" as the challenger's error and "Galatians 4:4" as the defender's, and deny those quotations [L1] weight ("These erroneous quotations are denied weight as [L1] footing", Gemini). No grade is shown to rest on that denial.
- Solution: as in 32212 F: carry a book only within one parenthesis or mark a bare chapter NOT CHECKED; do not check a quotation that follows a Greek or Hebrew word in parentheses as a KJV quotation; store a reason for NOT CHECKED.

## G. The synthesis

The synthesis ran at 08:30, before the panel, so it could not report the GLM failure or the split. Its confirmation reviews the single judge ("which was HELD") and says "The debate's verdict is the panel's."
1. **"Both agree" on a charged point.** Section 1, item 7: "No knowing before the birth. ... Both agree." (1,899). The challenger's premise 5 is that "Joseph knew Mary his wife within the espousal", before the conception, and the defender's link-round premise 5 presses Matthew 1:25 against it. Section 1 says it lists only points "no charge on either side contests".
2. **Other charged points in the uncharged list.** Item 1 (the Matthew 1:16 inference is the challenger's premise 2, though the grammar is undisputed, as it says); item 5, "Undisputed at L1–L2" for "of the Holy Ghost" (9,107 as "Undisputed at L1"; the challenger's premises 3 and 4 and the defender's premises 3 and 4 contest it); item 8 (the seed rows, the defender's premise 1 and the challenger's link 1).
3. **"Every premise answered" for the challenger.** "He answered each of the defender's six pressed premises with exhibited footing" (4,436) and "The challenger conceded no load-bearing piece of his own chain" (6,314). Luke 1:42, Luke 1:31, Galatians 4:4 and Jeremiah 22:24 went unnamed (B5).
4. **Narrowing as concession.** Link 3 "CONCEDED-BY-ITS-OWN-SIDE (as first stated)" and "two were withdrawn by the defender's own hand" (1,690); the defender wrote NARROWED TO for both.
5. **The 1:18 reading in its own voice** (D): "1 Corinthians 7:5 ... cuts toward the defender's reading of Matthew 1:18 as conception before cohabitation" (11,153), repeated in the confirmation.
6. **A stating-verse ground in its own voice**: "the inference is by construction, not by a row that says it" (11,781).
7. **Link numbering.** Table 2a uses the defender's round links (L2 "he knew the child was not his") and has no row for D2, the Holy Ghost link, on which ChatGPT broke the chain.
8. Correct: guards bind the challenger seat only (its heading "Drift-guard check [dash] challenger seat only", "No guard violation fired"); its lexical claims checked in H are borne out (G1904 and G1982 rows).
9. Solution: as in 32212 H: check each "uncharged" or "both agree" point against both premise lists; take the unanswered-witness list from the two-way check; write NARROWED for a narrowed link; and hold the synthesis's own voice to guards 8 and 61.

## H. Lexical and grammatical claims checked against the record

Confirmed by original_words (Textus Receptus for the Greek, TAHOT for the Hebrew) and lexicon_words:
- Matthew 1:16 "egennhsen ... ex hv egennhqh": G1080 V-API-3S with the relative R-GSF; Joseph "andra", G435. Matthew 1:20 "gennhqen", G1080 V-APP-NSN, "ek pneumatov ... agiou".
- Romans 1:3 "genomenou" and Galatians 4:4 "genomenon" are both G1096 (V-2ADP-GSM and V-2ADP-ASM), as the defender says ("the same word").
- Luke 1:35: "epeleusetai" G1904, "episkiasei" G1982, "dio kai" (G1352 "consequently:--for which cause, therefore"), "klhqhsetai" G2564 V-FPI-3S, as both sides say.
- G1904 stands in exactly 10 verses including Acts 1:8, and G1982 in exactly 5 (Matthew 17:5, Mark 9:7, Luke 9:34, Acts 5:15, Luke 1:35), as the challenger says.
- Luke 1:34 "andra ou ginwskw", V-PAI-1S: present indicative, as the challenger says.
- Luke 3:23 and Acts 16:13 "enomizeto", both G3543 V-IPI-3S: "the same verb form" (challenger) is borne out. G3543 also stands at Acts 14:19, 16:27, 8:20 and 21:29, as each side cites. lexicon_words G3543: "from νόμος; properly, to do by law (usage) ... by extension, to deem or regard:-- suppose, thing, be wont", so the defender's derivation from nomos is borne out; its conclusion "which is legal standing" goes beyond the gloss, which also gives "suppose".
- Luke 3:23-38 has no G1080 (count 0): "Luke never uses \"begat\"" is borne out.
- Matthew 1:18 "mnhsteuqeishv" G3423 V-APP-GSF (defender's ἐμνηστευθείσης) and "sunelqein" G4905; 1 Corinthians 7:5 G4905 (D).
- Isaiah 7:14 "ha.'al.Mah" H5959; H5959 in 7 verses; H1330 in 50 verses across 19 books. Genesis 3:15 "zar.'A/h", H2233 with a third feminine singular suffix. Jeremiah 31:22 "Ga.ver", H1397 (lexicon: "a valiant man or warrior; generally, a person simply"), close to the defender's "strong man". 2 Samuel 7:12 "mi./me.'Ei./kha", H4578, the challenger's mimme'eykha. Acts 2:30 "osfuov" G3751, also at Hebrews 7:5 and 7:10.
Not borne out: no lexical claim checked here was found false. The universals ("ek with God or Spirit ... always marks covenant ... origin"; "loins-language never describes a generation without a father") are not lexical counts and were not checked; the synthesis flags them as stated beyond their row counts.

## I. Comparison with run 32212 (row 9a52d90b)

| Point | 32212 | 32228 |
|---|---|---|
| Flow | fef4fb2a | 52b05334 (K-C and K-G4 fixes live) |
| Token limits | vendor maximums; synthesis max_tokens 384,000 | 64,000 every seat (floors 65,536 for DeepSeek and MiMo judges); synthesis max_tokens 64,000 |
| Rounds cut | none | none |
| Round lengths (D1, C1, D2, C2, D3, C3) | 7,725; 10,725; 11,442; 11,376; 8,256; 6,697 | 8,338; 10,812; 12,843; 9,040; 9,478; 6,978 |
| MiMo time (rounds 1, 2, 3) | 498.8; 535.5; 612.5 | 323.1; 466.3; 231.6 |
| Run length | 79.3 minutes | about 60.5 minutes |
| GLM | failed closed: "no JSON object" (73.6 s) | failed closed: unrecognised envelope (354.8 s) |
| Alternate | Qwen, 1,194.6 s plus cure 484.4 s, not seated | Qwen, 981.7 s, seated for DeepSeek, no cure needed |
| Seats counted | 0 (all three set aside) | 3 (Qwen, Gemini, ChatGPT) |
| Panel | CONTESTED 0-0 | CONTESTED 1-1-1 (HELD, PARTIAL, BROKEN) |
| Outcome | UNGRADED [dash] REVIEW | UNGRADED [dash] REVIEW |
| False K-C | four (DeepSeek, Gemini, single judge CONCEDED LINKS) | none |
| K-G4 | false on the anchor verse (ChatGPT, four items, seat removed) | new test right on ChatGPT; still fires on concession-ground BROKEN lines (DeepSeek, single judge), and the retractions changed both results |
| K-G7 | correct by chance (numbers matched) | false twice on the number mismatch; ChatGPT's cure made it COLLAPSED 4 |
| Seat removed on form | DeepSeek D5 (no RESTATED line) | DeepSeek D6 vs C2 (no RESTATED line) |
| Concession | link 5 conceded, graded STANDS | premise 6 conceded; graded WITHDRAWN, BROKEN or UNDERDETERMINED by different seats |
| Unanswered witnesses | many; ChatGPT broke links on them | Isaiah 8:8 against the defender; Luke 1:42, Luke 1:31, Galatians 4:4, Jeremiah 22:24 against the challenger; usage rows answered only in substance, on which ChatGPT broke D2 |
| "Came together" / "till" | DeepSeek keystone, single judge cure, Gemini D3 | Gemini D2, DeepSeek D1, D2, D4, single judge D1 and restated D2, the synthesis |
| Citations | Isaiah 8:18 called non-existent; Genesis 1:24 book carry | no non-existent verse; 1 Corinthians 1:19 book carry; Galatians 4:4 gloss flagged |
| Lexical | G1078 at Matthew 1:18 wrong on both sides | no false lexical claim found |
| Cache | 73,782 written, 294,897 read | 63,456 written, 275,891 read |

The K-C fix removed the false class that set aside two seats in 32212, and the new K-G4 cure test worked where it ran. The outcome was lost this time to the open rulings (a conceded premise under a SUPPORTED link; an answer in substance) and to two old faults in the checker: K-G4 firing on any BROKEN line, and K-G7 matching premise numbers to link numbers.

## J. Order proposed

1. B1: your rulings on a conceded premise under a link that stays SUPPORTED (WITHDRAWN, BROKEN or neither; counted once or twice) and on an answer in substance. These alone decide the split.
2. B2: K-G4 fires only on a BROKEN line whose ground is an unanswered witness.
3. B3: K-G7 and the premise counts map by the premise's own PRESSED WITH line and quotation, not by number; a premise counts only on witnesses in its own list.
4. B5 and B6: the two-way unanswered-witness check (Luke 1:31 and Galatians 4:4 were missed by every judge; Isaiah 8:8 by two).
5. E: a judge statement that restates the line in full counts as RESTATED, or the cure prompt says the label is required; a cure may not change a grade.
6. B4: store the raw reply of a seat that fails closed and log the empty path inside choices; your word on GLM's execution record.
7. Time limit: state the alternate call's time limit and remove a model that exceeds it (Qwen 981.7 s here, 1,194.6 s in 32212).
8. C and D: your digit on Sight 32; enforcer marks for 1:18 and 1:25 grounds and for flesh routed through Mary; K-S2 additions.
9. F and G: the book carry, the gloss check, the reason for NOT CHECKED; the synthesis prompt lines.

## Not read

- GLM's panel reply: no part of it is stored, so the failure cause is not determined.
- The texts of the cure replies beyond the excerpts in the audit lines, and Qwen's alternate call beyond its stored judgment.
- The judge prompt and the cure rule text (CURE_RULE_G, CURE_FORM) as sent; so the VOID rule ChatGPT applied, and the time limit for the alternate call, are not seen.
- The execution records (n8n), under the reading rule: so the max_tokens actually sent to each seat, the reason for MiMo's timings, and the combining code for panel_verdict and outcome are not seen. The 64,000 limits and the flow version are as given in the brief.
