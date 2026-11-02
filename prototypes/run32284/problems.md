# Run ODV1-32284: problems and solutions

Run 32284, flow version 681c085a (as given in the brief; the row has no column that records the flow version), the first run on the fourth judge fix set (judge_fix4: F1 to F10 and the partial-quotation rule, ruling 384). Fired 12:59 CST 2026-11-02 (as given; the first timed node, the defender's round 1 call, starts 19:04:18Z, 13:04 CST, in timings/timings_32284.json), stopped about 13:42 CST (Record Alternates 19:42:23Z; the judgment rows are written 19:42:24Z to 19:42:25Z; the poll at 19:42:38 reads "32284:success"), status success. From the first timed node to Record Alternates the run took about 38.1 minutes.
Row fe9193e5 (debate_results), run token ODV1-32284-bysy7bwx. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome UNDERDETERMINED; panel_verdict and framework_verdict HELD; panel_split "3-0"; judged_by and panel_expected chatgpt, gemini, glm (the trigger's reply had panel_expected deepseek, gemini, glm); data_class "study"; quarantine_reason NULL; defense standing SELF-SUPPORTED, conceded_links 0; challenge standing SELF-SUPPORTED, challenger conceded 0; defender chain mark FOOTED, **challenger chain mark STRAINED**; underdetermined_seats chatgpt:COLLISION, gemini:COLLISION, gemini:RESULT, glm:COLLISION, glm:RESULT; panel_substitution {failed_seat deepseek, substitute chatgpt, failure_kind no_usable_judgment, at 19:39:32.525Z}; drv_removed NULL and no row in odv1_drv_removals; citation_block NULL; out_of_round_concessions 5.
Seats: ChatGPT (judgment 897, openai/gpt-6.1-terra, the reserve in DeepSeek's slot) HELD, 0 uncured; Gemini (898, google/gemini-3.8-flash) HELD, 0 uncured; GLM (899, z-ai/glm-5.3) HELD, 0 uncured. Single judge (no vote): deepseek-flash, HELD.
Tokens: input 558,000, output 286,891; cache 72,307 written, 251,851 read. Synthesis usage: "prompt=52264 completion=24622 reasoning=20296 finish=stop max_tokens=64000".

**Nothing here is applied.** Nothing was written to the database, n8n or git. The database was read with SELECT statements only. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 6,390); the challenger's round 1 (engine_r1, 10,952); the defender's round 2 (claude_r2, 11,814); the challenger's round 2 (engine_r2, 7,993); the defender's link round (engine_r3, 9,715); the challenger's link round (challenger_r3, 9,207); the defender's close (defender_r4, 15,868); the challenger's close (challenger_r4, 9,157); the three judgments with their audit, cure and recompute lines (debate_judgments 897 ChatGPT 5,734; 898 Gemini 6,024; 899 GLM 5,100); the single judge's text (independent_verdict_raw, 11,469); the synthesis (17,306); review_notes (2,670); the citation report (citation_check, 34,936 as text; 297 items); the panel fields and panel_substitution; engine_manual version 85, sections 8 to 12 (characters 14,997 to 37,270, 22,274 characters); the judge_fix4 README.
**The enforcer log** (debate_enforcer_log, 5 rows, ids 63 to 67), every column of every row. prompt_sent holds two texts: Gemini's cure prompt (rows 63 and 64, 10,405, one md5) read whole; the single judge's cure prompt (rows 65 and 66, 11,031) has the same rule block (characters 1 to 6,732, same md5) and the same ANSWER FORM (same md5), and its FLAGGED ITEMS section was read whole. full_reply holds three texts, each read whole: Gemini 1,261 (rows 63 and 64, one md5); single judge 4,151 (rows 65 and 66, one md5); DeepSeek 0 (row 67).
Each pressed witness was checked by reference with SQL position() in the later rounds of the holding side, and each quotation named below was checked against kjv_verses (margin notes removed, italic brackets opened, punctuation and case set aside). Code was read only from the local package (prototypes/judge_fix4/new, the C4P block of D4 Extract), to explain two checks; no execution record was read. Timings come from the local file timings/timings_32284.json.

**Round labels.** "CR" marks the defender's rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n", with round 4 the close. Quotations from the record that hold a long or short dash show it as [dash].
**Numbering in the record.**
- The declared chain (defender round 1): D1 the conception "of the Holy Ghost" (Matthew 1:18, 1:20; Luke 1:34-35); D2 Matthew 1:16 and Luke 3:23; D3 Isaiah 7:14 with Matthew 1:23 and 1:25; D4 Galatians 4:4 and Luke 2:49; D5 Jechonias and Jeremiah 22:30; D6 the conclusion (keystone).
- The challenger's premise list (round 2) files six premises as LINK 1, LINK 2, LINK 2, LINK 4, LINK 5, LINK 6 (none against D3). The defender's link round lists six premises against the challenger, numbered 1 to 6, and the challenger's link round answers them as LINK 1 to LINK 6 (C1 to C6).
- **The defender's close renumbers:** "I hold D1[dash]D6 as declared ... I have not seen the text of my round 1 declaration, so I take D1[dash]D6 in the order the challenger's blocks answer them: D1 Joseph did not beget the child, D2 the conception was of the Holy Ghost, D3 the title Son of God rests on that conception, D4 the seed of David came through Mary, D5 Joseph's place in the registers is his as husband, D6 Jeremiah 22:30 bars the seed of Jechonias from the throne."
- **The challenger's close renumbers:** "I rest on the rows already offered and restate them now under my own numbers": C1 the timing rows, C2 the seed rows, C3 the father named, C4 the reckoning, C5 the title, C6 the curse. Its C2 to C5 are not the link round's LINK 2 to LINK 5 (the link round's LINK 2, the angel's verbs, has no block in the close), and it names the defender's links by the defender's close numbers ("D4 answers by routing the seed through Mary's body"; "D5 narrows Joseph to husband").

## Timings (timings_32284.json, seconds; Z times)

| Step | Start (Z) | Seconds | 32266 |
|---|---|---|---|
| Defender round 1 | 19:04:18 | 39.5 | 60.5 |
| Challenger round 1 | 19:05:00 | 183.6 | 307.6 |
| Defender round 2 | 19:08:05 | 106.2 | 109.9 |
| Challenger round 2 | 19:09:53 | 192.3 | 24.1 |
| Defender link round | 19:13:07 | 118.9 | 72.9 |
| Challenger link round | 19:15:08 | 243.6 | 226.8 |
| Defender close | 19:19:13 | 116.4 | 103.1 |
| Challenger close | 19:21:11 | 194.3 | 33.6 |
| Synthesis (DeepSeek) | 19:24:27 | 131.4 | 203.6 |
| Single judge | 19:26:43 | 240.2 | 209.9 |
| Single judge cure | 19:30:46 | 26.6 | 115.8 |
| Diagnostic | 19:31:14 | 7.7 | 18.6 |
| Panel judge 1, DeepSeek | 19:31:24 | **318.2 (failed closed)** | 290.7 |
| Panel judge 2, Gemini | 19:36:42 | 142.4 | 152.2 |
| Panel judge 3, GLM | 19:39:05 | **25.3** | 619.4 |
| Reserve, ChatGPT for DeepSeek | 19:39:32 | 132.3 | none |
| Panel cure 2, Gemini | 19:41:47 | 32.2 | none |
| Record Alternates | 19:42:23 | 0.4 | 0.6 |

- The challenger's four rounds took 813.8 s; the defender's four took 381.0 s. The challenger's close (194.3 s) took nearly six times its 32266 time.
- No alternate was sought (no seat had an uncured item); only Gemini was sent a cure.
- GLM's 25.3 s judgment is the shortest panel call on record in these files, and it carries the faults in B2.

---

## A. What the change did

1. **F1 recompute worked twice.** Gemini's cure retracted "D3 vs C1 ... CHALLENGER LINK BROKEN"; the stored text now reads "RESULT: UNDERDETERMINED -- recomputed after the cure from the cured lines (RETRACTED D3 vs C1 (CHALLENGER LINK BROKEN to UNDERDETERMINED)): HELD-1, CHALLENGE STANDING SELF-SUPPORTED, no collision line stands graded CHALLENGER LINK BROKEN", the collision line is replaced, and "[AUDIT v25: RECOMPUTED AFTER CURE ...]" keeps the original line and "RESULT -- DEFENDER WINS". The single judge's text was recomputed the same way, and its CHALLENGE STANDING moved from PROP-DEPENDENT at c=0 (a standing the section 8 definitions do not allow) to SELF-SUPPORTED. Both recomputes follow section 8: HELD, the challenge SELF-SUPPORTED, no CHALLENGER LINK BROKEN line, so UNDERDETERMINED.
2. **F2:** no K-DG8 mark was raised anywhere; the cure prompt carries no CURE_RULE_G clause.
3. **F3:** Gemini's "RETRACTED: D3 vs C1" followed by "RESTATED: D3 vs C1 ... UNDERDETERMINED" was read as a retraction; both Gemini items CURED. The single judge's "RETRACTED: D6 vs C1 | [DR3] names ..." (reason on the same line) was also read.
4. **F5 (new verses):** "[AUDIT v25: CLOSE-ROUND NEW-VERSE CHECK (D4) -- the defender's close round names 3 verse reference(s) no earlier round of either side names (Luke 1:31, Luke 21:35, Luke 2:5); each is NEW IN CLOSE, marked NOT COUNTED". ChatGPT's CITATION CHECK repeats it ("The three new [CR4] references ... are not counted"). **F5 (numbering) did not fire on either close** (B3).
5. **F8 and ruling 372:** ChatGPT counted two challenger premises UNEXHIBITED for "pressed witness unanswered", the first use of that tag in these runs; whether the witness it named was pressed is the question in B1.
6. **The reserve worked:** DeepSeek failed closed with an empty reply; ChatGPT judged its slot; panel_substitution and the failed_reply log row (67) were written.
7. **GLM was counted for the first time** (it failed closed in 32228 and 32255 and was removed in 32266), after 25.3 s, with the faults in B2.
8. **The outcome is UNDERDETERMINED by the tie rule** (2 of 3 counted HELD seats wrote RESULT: UNDERDETERMINED). Sound as section 8 is written, but it turns on two points the rulebook leaves open (B1).

## B. Faults

### B1. Is the UNDERDETERMINED sound? By section 8 as written, yes; it rests on two open points

| Seat | Verdict, clause | Defender | Challenger | RESULT | Follows from its own lines? |
|---|---|---|---|---|---|
| ChatGPT (897, reserve) | HELD, "HELD-1 -- n=6 w=0 k=0" | 0, SELF-SUPPORTED (L=6 c=0) | **3** (premises 4, 5, 6), PROP-DEPENDENT (L=6 c=3; 2c = L is a tie, not COLLAPSED) | DEFENDER WINS | **Yes**: HELD with the challenge not SELF-SUPPORTED gives DEFENDER WINS. **But the count of 3 does not follow from the ledger or from section 8's UNEXHIBITED tag** (below). |
| Gemini (898) | HELD, HELD-1 n=6 w=0 k=0 | 0, SELF-SUPPORTED | 0, SELF-SUPPORTED | UNDERDETERMINED (recomputed) | **Yes**, after the cure: no CHALLENGER LINK BROKEN line, the challenge SELF-SUPPORTED. Before the cure its lines contradicted each other (K-G3, rightly marked). |
| GLM (899) | HELD, HELD-1 n=6 w=0 k=0 | 0, SELF-SUPPORTED | 0, SELF-SUPPORTED | UNDERDETERMINED | **Yes** in counts and RESULT; its collision lines are numbered by the defender's close, not the declared chain (B2). |
| Single judge (no vote) | HELD, HELD-1 | 0, SELF-SUPPORTED | 0, SELF-SUPPORTED (recomputed from PROP-DEPENDENT at c=0) | UNDERDETERMINED (recomputed) | Yes, after F1. Its opening paragraph still reads "The challenger's link C1 is broken on that footing", and its CHALLENGER CHAIN MARK (STRAINED) rests on the same retracted reading; F1 rewrites neither line. |

**The tie.** Section 10: "a HELD or PARTIAL panel whose counted seats of that verdict mostly wrote RESULT: UNDERDETERMINED gives UNDERDETERMINED." Gemini and GLM wrote it; ChatGPT did not. 2 of 3 is "mostly". The tie is applied correctly.

**ChatGPT's three challenger premises, quoted:**
- Premises 4 and 5: "UNEXHIBITED (pressed witness unanswered). In [CR2], the defender quoted Luke 3:31, \"which was the son of Nathan, which was the son of David,\" against the seed and reckoning arguments ... No later challenger round through [DR3] names or answers Luke 3:31." The record agrees that no challenger round names Luke 3:31 (position() 0 in every challenger round; the defender names it in round 2 at 1,291 and in the close at 7,390). **But Luke 3:31 is not a pressed witness of either premise.** The defender's link round lists premise 4 "PRESSED WITH: Galatians 4:4 ... Romans 1:3 ... Hebrews 7:10 ... Mark 11:10" and premise 5 "PRESSED WITH: Deuteronomy 25:6 ... Ruth 4:17 ... Numbers 1:2". The code's ledger, quoted in the single judge's cure prompt, reads "C4 -- 4 verse(s) carried; 4 named;; C5 -- 3 verse(s) carried; 3 named". The challenger's link round names every one (D).
- Premise 6: "UNEXHIBITED (inadequate footing): its Matthew 1:11 quotation is not counted, and the remaining Matthew 1:12 quotation does not exhibit both named rows ... lacks an exhibited Hebrew or Greek [L2] or a usable [L3]". Section 8 tags UNEXHIBITED for "no footing offered, or a pressed witness left unanswered". The block offers footing: "Matthew 1:12: \"And after they were brought to Babylon, Jechonias begat Salathiel; and Salathiel begat Zorobabel\"" (MATCHES). Its "[L2] the name's rows in the New Testament are two" is a count, not a word, so it is not an [L2] by the layer rule; the narrowed claim carries no [L4] tag, so the floating rule does not reach it either. Section 8 says what a two-layer block is (SUPPORTED) and what a block with no footing is (UNEXHIBITED); it does not say what a block with one valid layer is.

**Why the outcome is fragile.** Section 8's UNANSWERED WITNESS rule reads "a verse the other side quoted against a link or listed premise (... against the challenger: [CR1], [CR2], [CR3])". On that wording, a verse quoted in the defender's round 2 can be a witness; ChatGPT read it so. On the ledger's reading (the PRESSED WITH lists of the link round), it is not. And a one-layer block is undefined. **Applied uniformly, either point alone flips the outcome**: if Luke 3:31 is a witness of premises 4 and 5, or if premise 6 is unexhibited, Gemini and GLM would also count the challenger 1 or more, every seat would write DEFENDER WINS, and the outcome would be DEFENDER PREVAILS. As the rules stand, Gemini's and GLM's zero follows the ledger and the section 8 tags, ChatGPT's three does not, and the UNDERDETERMINED is sound.

**The defender's count of 0 is sound on every seat** (D): every witness the challenger pressed in its round 2 is named in the defender's link round. One weakness: premise 1's witnesses 2 Samuel 7:12, Psalm 132:11 and Hebrews 7:14 are not named in the LINK 1 block; LINK 5 says "Psalm 132:11 and Hebrews 7:14 are answered under Link 1" (they are not), and LINK 6 names all three with a reason ("They state descent, the [L2] *ek spermatos* (out of seed) of the line, and none of them says Joseph begat"). Ruling 373 does not say whether an answer must stand under the premise it answers.

**Solution.** Your ruling on two points: (1) whether a verse quoted in [CR1] or [CR2] that the link round does not carry under PRESSED WITH is a witness of a premise first listed in [CR3] (if not, section 8's UNANSWERED WITNESS wording should say "listed under PRESSED WITH in the link round"); (2) what a link-round block with exactly one valid layer is (SUPPORTED narrowed, or UNEXHIBITED). Then a check that marks a count item tagged "pressed witness unanswered" whose verse the ledger does not carry for that premise (today K-G6 marks only an under-count).

### B2. GLM graded by the defender's close numbering, in 25.3 seconds

GLM's collision lines follow the close's D1 to D6, not the declared chain: "D1 vs C1 (Matthew 1:25)" (the close's D1, "Joseph did not beget"); "D2 vs C2 (Luke 1:35)"; "D3 vs C3 (Luke 1:35) ... the covenant-title witnesses" (the close's D3, the title); "D4 vs C4 (Romans 1:3) ... routed through Luke 3:31" (the close's D4); "D5 vs C5 (Numbers 1:2)" (the close's D5, the registers); "D6 vs C6 (Jeremiah 22:30)" (the close's D6). Section 8: "D1..Dn and the keystone Dn come from the DECLARED CHAIN in [CR1] only; a later re-declaration never changes them." Consequences:
- The declared D3 (Isaiah 7:14) and D2 (Matthew 1:16 with Luke 3:23) have no line of their own, though section 8 asks for "one line per declared link".
- "KEYSTONE: D6 -- STANDS" names the declared keystone, while GLM's line "D6" is the curse; its DEFENDER CHAIN MARK speaks of "the load-bearing D6 ... Matthew 1:16,18,20", the declared D6.
- "OUT-OF-ROUND CONCESSIONS: NONE", while the record holds, among others, the defender's "I agree" ([CR2]) and the challenger's "The definition is accepted" ([DR1]); the single judge lists five such lines.
- "no floating [L4] on either side, every [L4] block exhibits at least two prior layers", while ChatGPT names three [CR2]/[CR4] blocks it found floating.
No line was graded BROKEN, so none of this moved GLM's counts or RESULT, and no enforcer rule tests collision numbering or the OUT-OF-ROUND line. The F5 numbering note, had it fired (B3), would have told GLM to "Grade by the D numbers of the DECLARED CHAIN".
**Solution:** the numbering check (B3); a mark when a seat's collision lines do not cover each declared D number, or when its Dn line's verse belongs to another declared link; a recorded (uncounted) mark for "OUT-OF-ROUND CONCESSIONS: NONE" when the single judge or the code's list finds some.

### B3. The F5 numbering check missed both closes

The check (C4P.renum in D4 Extract and C4 Extract) fires on the pattern `re-?number|I (now) number|number(ed|ing) (my|the|its|our|his) (chain|links|premises)|in the order of the link round`, or on a D or C number above those declared. The defender's close says "I take D1[dash]D6 in the order the challenger's blocks answer them"; the challenger's close says "restate them now under my own numbers". Neither matches, and no number exceeds 6, so neither close was flagged and review_notes holds no numbering line. GLM then graded by the close's numbers (B2). The defender's close also says "I have not seen the text of my round 1 declaration"; the record does not hold the D4 Build prompt, so whether the declaration was in it cannot be checked here.
**Solution:** match "in the order", "under my own numbers", "my own numbering", "take D1" and a list of the form "D1 <words>, D2 <words>" whose wording differs from the declared link; put the declared chain's text in the D4 Build prompt if it is not there.

### B4. The citation report stops inside the defender's close

The report holds 297 items (292 MATCHES, 5 mismatches, not_checked 0). Its last item is the defender's close "Hebrews 7:9-10". About 25 later quotations in the defender's close (Genesis 35:11, Luke 2:4, Luke 2:5, Luke 1:5, Numbers 1:18, Ezra 2:59, Ezra 10:3, Deuteronomy 25:5-6, Ruth 4:17, Ruth 4:13, Genesis 16:15, Luke 1:13, Luke 1:57-63, Isaiah 7:16, Isaiah 8:8, Matthew 1:12, Matthew 1:16, Jeremiah 22:30, Luke 1:32, Haggai 1:1, Ezra 3:2 and others) and **every quotation in the challenger's close (0 items)** are absent, and none is marked NOT CHECKED. Run 32266's report also stopped near the same size (295). I checked those quotations against kjv_verses: every one matches, so nothing turned on it here. The record does not say why the list ends.
**Solution:** find the limit (item count, request size or round order) and either lift it or mark the rest NOT CHECKED with a reason.

## C. Each seat's grades, with quotes

- **ChatGPT (897).** Defender: "Premises 1 and 2 are VOID ... Premises 3, 4, 5 and 6 are spared". Challenger: premises 4, 5, 6 counted (B1). Collisions: "D1 vs C2 (Luke 1:35): UNDERDETERMINED"; "D2 vs C5 (Numbers 1:2): UNDERDETERMINED"; "D3: STANDS"; "D4 vs C4 (Galatians 4:4): UNDERDETERMINED"; "D5: STANDS"; "D6 vs C4 (Romans 1:3): UNDERDETERMINED". Numbering follows the declared chain. Both chain marks FOOTED. Its CITATION CHECK repeats all five mismatches as NOT COUNTED, including the false Isaiah 7:11 item (F).
- **Gemini (898).** Original "D3 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- the claim that Joseph knew Mary within the espousal is refuted by the text -- GROUND: ... answered in [CR2] and [CR4]". The ground cites only defender rounds and gives no unanswered witness; the challenger's link round names Matthew 1:18 and 1:25 ("dates the finding only"; "the row states no limit beyond it"). The retraction is right. Its D4 line ("routed through Mary by the defender") follows the substance of the close's D4 more than the declared D4 (Galatians 4:4, Luke 2:49), but keeps the declared label set otherwise. Both chain marks FOOTED.
- **GLM (899).** B2.
- **Single judge.** Original "D6 vs C1 ... CHALLENGER LINK BROKEN ... its [DR3] answer \"dates the finding only\" does not meet \"of the Holy Ghost.\"": a BROKEN grade on the judge's view of an answer's strength, not on an unanswered witness; rightly marked K-G4 and retracted. The D1 line carries the K-C and K-S2 marks (E).
- **Row fields.** challenger_chain_mark STRAINED is the single judge's mark ("STRAINED -- the load-bearing C1 inference ... which Matthew 1:25's heōs hou denies"); all three counted seats wrote FOOTED. Section 10 lists what the panel writes (the verdict and "the four standings fields"); the chain marks are not among them, so the row keeps a mark no counted seat gave, resting on a line the single judge retracted. **Solution:** write both chain marks from the counted seats' majority, or null with a review line.

## D. Pressed witnesses, answered or unanswered (SQL position(), later rounds of the holding side)

**Against the defender** (challenger round 2, UNSUPPORTED-L4 PREMISES; answering rounds: defender round 2 for verses also quoted in challenger round 1, the link round and the close):

| Premise | Witnesses | Answered |
|---|---|---|
| LINK 1, "The answer gives a means with no man in it." | 2 Samuel 7:12; Psalm 132:11; Romans 1:3; Acts 2:30; Hebrews 7:14; Luke 1:32; Genesis 4:1; Matthew 1:18; Matthew 1:25 | Link round LINK 1 names Genesis 4:1, Romans 1:3, Acts 2:30, Luke 1:32, Matthew 1:18 and 1:25 with reasons. 2 Samuel 7:12 (7,236), Psalm 132:11 (6,586) and Hebrews 7:14 (6,597) are named only under LINK 5 and LINK 6 (B1); Hebrews 7:14, Romans 1:3 and Acts 2:30 are also answered in round 2 ("Not one of these rows says \"seed of Joseph.\""). None is named in the close. |
| LINK 2, "It points to Mary alone and cannot include Joseph." | Matthew 1:25; Matthew 1:20; Luke 1:27; Luke 2:48; Luke 2:27; John 6:42; John 1:45; Numbers 1:2 | All named in the link round's LINK 2 block (narrowed). |
| LINK 2, "which marks the common belief as not the fact" | Acts 16:13; Luke 2:48; Luke 2:41; Luke 4:22; John 6:42 | All named ("Luke 2:48, 2:41 and 4:22 ... and John 6:42"; book stated earlier in the sentence, as F6 requires). Acts 16:13 is conceded: "I concede that"; the link is narrowed. |
| LINK 4, "This is a correction of the term \"father.\"" | Luke 2:48; Luke 2:27; Luke 2:41; Luke 3:23; John 6:42 | All named in the link round (Luke 3:23 under LINK 2; narrowed). |
| LINK 5, "If Joseph's seed were the child's, Jeremiah 22:30 would bar him ..." | Jeremiah 22:30; 1 Chronicles 3:17; Jeremiah 22:24; Haggai 2:23; Jeremiah 18:7-8; Haggai 1:1; Luke 3:27; Psalm 132:11; Hebrews 7:14 | All named; Psalm 132:11 and Hebrews 7:14 by the pointer to LINK 1 (B1). Narrowed. |
| LINK 6, "Joseph was the husband of Mary, not the one who begat." | 2 Samuel 7:12; Psalm 132:11; Romans 1:3; Acts 2:30; 2 Timothy 2:8; Hebrews 7:14; Genesis 4:1; Matthew 1:25 | All named in LINK 6 with a reason. |

Every seat counted the defender 0. Under ruling 372 that is right: no witness is left unnamed.

**Against the challenger** (defender link round, CHALLENGER'S UNSUPPORTED-L4 PREMISES; answering round: the challenger's link round):

| Premise | Witnesses | Answered in the challenger's link round |
|---|---|---|
| 1, "bounds the abstinence to the pregnancy" | Matthew 1:18; Matthew 1:20; Luke 1:34; Matthew 1:25 | All, under "Pressed." in LINK 1. |
| 2, "Neither denotes begetting at any row." | Luke 1:35; Matthew 1:20; Luke 1:34 | All. |
| 3, "is a covenant title" | Luke 1:35; Matthew 1:18 | Both. |
| 4, "Not covenant metaphor" | Galatians 4:4; Romans 1:3; Hebrews 7:10; Mark 11:10 | All. |
| 5, "the register struck is the wife's-house one" | Deuteronomy 25:6; Ruth 4:17; Numbers 1:2 | All. |
| 6, "The New Testament never cites the curse against Jesus" | Jeremiah 22:30; Matthew 1:12; Luke 1:32; Haggai 1:1 | All; the link is narrowed and its entailment dropped. |

The ledger agrees ("C1 -- 4 verse(s) carried; 4 named ... C6 -- 4 verse(s) carried; 4 named"). **No pressed witness is unanswered in either direction**, so no seat had a ruling-372 UNEXHIBITED to count, and only ChatGPT counted one, on a verse outside the lists (B1). Every pressed witness above is named with its book, and every quoted witness matches kjv_verses (Genesis 4:1 is quoted with a colon by the challenger and a semicolon by the defender; the row has a semicolon; the checker matches both).

## E. Enforcer marks and RESPONSEs, row by row (5 rows)

| Row | Seat, rule, item | Mark right? | Cure and RESPONSE |
|---|---|---|---|
| 63 | Gemini, K-G4, D3 vs C1 | **Right.** A BROKEN line, while the challenger's link round names Matthew 1:18 and 1:25. | CURED, retracted. STATEMENT quotes [DR3] "dates the finding only" and "the row states no limit beyond it", both in the round. RESPONSE quotes [DR3] "before they came together, she was found with child of the Holy Ghost", in the round. **Right.** |
| 64 | Gemini, K-G3, CHALLENGER STANDING | **Right**: SELF-SUPPORTED beside a CHALLENGER LINK BROKEN line. | CURED by the same retraction. **Right.** |
| 65 | Single judge, K-G4, D6 vs C1 | **Right**, as row 63. | CURED, retracted with a reason naming [DR3] and its words; SHORT quotes [DR3] exactly. **The RESPONSE misquotes a round**: "[DR2] presses \"before they came together, she was found with child of the Holy Ghost\""; challenger round 2 quotes only "before they came together, she was found with child". The cure check does not test RESPONSE quotations. |
| 66 | Single judge, K-C, D1 | **Right by the K-C rule**: the ground "C2's verb-rows do not state that the conception is not of the Holy Ghost" sets the challenger's verb rows aside because they do not state the contrary. Note that section 8's collision rule says "A witness contradicts a link only when its own words state the contrary"; the judge's sentence is that test, and the rulebook holds both. | **UNCURED**, "the restated line keeps the ground that a verse does not state the link". The restated line ends "read together they do not state that Joseph begat the child"; it reads the rows together, exhibits [L1], [L2] and [L3], and names [CR3] and [CR4], so the reason given is doubtful. **The outcome is still fair for another reason:** the restated line weighs the seed rows, not the C2 verb rows it had set aside, so it does not grade the flagged item. The RESPONSE also quotes its own line wrongly ("no one verse states"; the line said "do not state"). No vote moved. |
| 67 | DeepSeek, failed_reply | n/a | I. |

Marks not raised that the record supports: GLM's numbering and OUT-OF-ROUND line (B2); ChatGPT's count beyond the ledger (B1). The single judge's K-S2 on D1 (mark only) and K-G2 (no CITATION CHECK line; the single judge's text has none) are right.

## F. Citation checker

Totals: checked 297, matches 292, mismatches 5, not_checked 0. Every non-match, checked against kjv_verses:

| Item | Status | Judgment |
|---|---|---|
| 1 Chronicles 3:17-18, challenger round 1 | WORDING DIFFERS | **True**: "Jecamiah, Hoshama, Nedabiah" against "Jecamiah, Hoshama, and Nedabiah." |
| Esther 2:7, defender round 2 | WORDING DIFFERS | **True**: "Mordecai took her for his own daughter" against "whom Mordecai, when her father and mother were dead, took for his own daughter." |
| "Isaiah 7:11,7", defender round 2 | WORDING NOT FOUND IN Isaiah | **False.** The round reads "Isaiah 7:11, 7:14: \"Ask thee a sign of the LORD thy God... Therefore the Lord himself shall give you a sign.\"" The parser read "7:11, 7:14" as "7:11,7". "Ask thee a sign of the LORD thy God" is in 7:11 and "Therefore the Lord himself shall give you a sign" is in 7:14, each exact; under ruling 384 each part counts. Every seat repeats it as NOT COUNTED; no seat rested on it. |
| Isaiah 8:3, defender round 2 | WORDING NOT FOUND IN Isaiah | **True in letter, a spelling only**: "Maher-shalal-hash-baz" against the row's "Mahershalalhashbaz"; with the hyphens removed the words match. Your ruling decides whether hyphenation is a misquotation. |
| Matthew 1:11, challenger link round, link 6 (load-bearing) | WORDING DIFFERS | **True**: "And Josias begat Jechonias about the time" against "And Josias begat Jechonias and his brethren, about the time". The row's margin ("some read, Josias begat Jakim, and Jakim begat Jechonias") offers no such reading, so the F7 margin rule could not apply. The challenger's close quotes the verse correctly ("Josias begat Jechonias and his brethren"). |

- **The margin rule (F7) was not exercised**: no item reads MATCHES (MARGIN), and no quotation in the rounds quotes a margin.
- **Missed:** the challenger's link round, "(25:5: \"raise up seed unto his brother\")" under Deuteronomy 25:5-6, is not itemized. Those words are not in Deuteronomy 25:5; they stand at Matthew 22:24, Mark 12:19 and Luke 20:28 (WORDS ARE AT), and Deuteronomy 25:7 reads "to raise up unto his brother a name". The book is stated earlier in the same sentence, so F6 would allow the bare reference; the pairing did not take it.
- The report ends inside the defender's close (B4).
- The malformed reference "Matthew 1:18,1" (from "Matthew 1:18, 1:20" in the declared chain) appears again, marked MATCHES, as in 32266.
- Quotations not itemized, none misquoted: the defender's round 1 Genesis 24:43 and Genesis 3:15 ("her seed"), and Luke 1:27 ("the virgin"), each a reference with a short quotation after it.
- **Solution:** split "7:11, 7:14" into two references; pair a quotation after a bare chapter:verse in parentheses; your ruling on hyphenated names; B4.

## G. The synthesis (DeepSeek, 131.4 s; checks S-A to S-E in review_notes)

The synthesis (17,306) and the appended ORACLE_DEBATE_V1 CONFIRMATION were read whole.

**Checks that fired (review_notes):**
- S-A, "Both sides accepted one definition at the top, and the whole debate then turned on a single chronological question that both sides answered from the same three rows in opposite order.": **true** (the sentence quotes neither side).
- S-A, "Both sides agree the relative names Mary as the one \"of whom\" Jesus was born, and that the verse does not say \"Joseph begat Jesus.\"": **true**. The challenger's words are "Matthew 1:16's *egennēthē* (was born) is non-narration; it does not narrate the begetting and cannot overrule what does"; it never states that agreement.
- S-C, 9 items listed as uncharged that name verses in a closing premise list: **true**. For example, section 1 lists "Matthew 1:16's grammar" as charged by neither side, while the challenger's round 2 charges "the inference that the feminine pronoun in Matthew 1:16 excludes Joseph", and the synthesis itself says "The challenger charged only the exclusion inference".
- S-E, "The defender conceded the title's covenant character and contested only *dio kai*.": **true**. The defender's close says of 2 Samuel 7:14 "Said of Solomon ... Solomon's title is by covenant over a begotten son"; of Luke 1:35 it argues the reverse, and its round 2 says "The challenger's 1 Chronicles 28:6 has no \"therefore\"".

**Faults not caught:**
- "Both sides agree the negation is bounded and the abstinence ends at the birth." quotes neither side; S-A missed it.
- "DEFENDER R4 does not contest the title's covenant character (\"Said of Solomon\")" repeats the S-E claim in section 1 in other words; S-E reads only "conceded".
- "The defense held ground procedurally: every pressed verse received a numbered answer in R4": **false**. The close's ANSWER lines answer the verses of the challenger's link round; position() finds none of 2 Samuel 7:12, Psalm 132:11, Hebrews 7:14, 2 Timothy 2:8, Acts 2:30, Luke 2:48, Luke 2:27, John 6:42 or John 1:45 in the close. They were answered in the link round (D). S-B tests only a verse the answering side "never names", so it rightly stayed silent; the sentence is still wrong.
- "Luke 3:31 is named by the defender in R1, R2 and R4": **false** for round 1 (position() 0).
- "Luke 1:34 is present indicative [dash] her state when the angel spoke, not a vow. Neither side disputes.": the defender never addresses the tense; "neither side disputes" is drawn from silence.
- **The CONFIRMATION paragraph argues that the drift guards should bind the defender**: "(iii) the synthesis guard-tests the challenger seat only [dash] the defender's seat is never run against the guards ... that omission is the largest unchecked surface in the document." Ruling 383 binds only the Debate Oracle seat (the challenger). S-D tests only the words "bind both seats", so it did not fire. No graded line rests on the paragraph.
- Section 3 (drift guards, challenger seat only) reports "No guard violation found"; that is the only doctrine finding in the run and is not re-graded here.
- **F9** (Format Markdown printing S-A to S-E under the synthesis) cannot be checked from the database: the formatted document is not stored in the row.
- **Solution:** S-A to read every "both" and "neither" sentence; S-E to read "does not contest" and "grants"; S-B to test "every pressed verse ... in R4" against the close's ANSWER lines; S-D to read "the defender's seat is never run against the guards" and like wording; the diagnostic prompt to state ruling 383.

## H. Errors by the Oracle seat (the challenger) against the record, and misquotations by either side

Graded by the debate rules only, not by doctrine.

**The challenger (MiMo, oracle profile):**
1. Matthew 1:11, link round, load-bearing for its link 6: "and his brethren," dropped (F). Its close quotes the verse correctly.
2. 1 Chronicles 3:17-18, round 1: "and" dropped before "Nedabiah" (F).
3. Deuteronomy 25:5, link round: "raise up seed unto his brother" is not in that verse (F).
4. "Seven sons" (rounds 1 and 2) for 1 Chronicles 3:17-18, a quotation that as the challenger gives it lists eight names (Assir, Salathiel, Malchiram, Pedaiah, Shenazar, Jecamiah, Hoshama, Nedabiah); the kjv_verses rows list the same eight.
5. Round 1: "Luke 1:36 gives her only a kinswoman"; the row reads "thy cousin Elisabeth". The defender corrected it in round 2 ("The KJV says \"thy cousin Elisabeth\" (Luke 1:36), not \"kinswoman.\"").
6. Link round, LINK 2: "*episkiazō* (to overshadow) at its rows [dash] Matthew 17:5; Mark 9:7; Luke 9:34; Acts 5:15; Luke 1:5... Luke 1:35". Luke 1:5 holds no "overshadow" (the row: "There was in the days of Herod ... a certain priest named Zacharias ..."). The Greek counts in the same sentence cannot be checked from kjv_verses.
7. Its close renumbers its links and names the defender's links by the defender's close numbers (B3). Its LINK 2 (the angel's verbs) has no block in the close.
8. Its close argues against the defender's close: "D4 answers by routing the seed through Mary's body. Against that: [L1] Luke 3:23 names no woman ... Genesis 16:10 ... Genesis 24:60 ... none of those rows is Davidic." Ruling 377: the challenger's close "answers nothing and may not press". Every verse there was named in its earlier rounds, so the reference-based C4 check rightly stayed silent; the press is by argument and no check can see it. No seat used it.
9. Correct on the record where tested: "Iechonias occurs twice, Matthew 1:11 and 1:12" (the New Testament rows naming Jechonias in kjv_verses are exactly those two); "Elisabeth, who is \"of the daughters of Aaron\" (Luke 1:5)".
10. The Hebrew counts in round 1 ("*ha-almah* (H5959 ...) [dash] 7 rows ... *Bethulah* (H1330 ...) 50 rows, 19 books, 9 in the Torah") cannot be checked from the tables read.

**The defender (Claude, plain profile):** Esther 2:7 (true misquotation) and Isaiah 8:3 (hyphenation only), both round 2, not load-bearing (F). Its close names Luke 1:31 and Luke 2:5 for the first time (F5, rightly marked); Luke 21:35 was named earlier only as "Luke 21:26, 35" by the challenger, which the reading rule does not take as a reference, so the mark is right under the rule. Every other quotation I checked against kjv_verses matches, including the 25 or so in the close that the citation report never reached (B4). Its close cites the challenger's concession as ground ("C1 grants that the abstinence ... runs to the birth ... So Matthew 1:25 excludes Joseph from the conception"), a [CR4] sentence grading a challenger link, which the CLOSE ROUNDS rule disregards; the two judges who first rested a BROKEN line partly on [CR4] (Gemini, the single judge) retracted it.

## I. DeepSeek's empty reply

- Row 67: kind failed_reply, item no_usable_judgment, judge_model deepseek-flash, full_reply "" (0 characters, md5 d41d8cd98f00b204e9800998ecf8427e), prompt_sent NULL, reply_error "FAIL-CLOSED: seat \"deepseek\" returned no JSON object. First 200 chars: " (nothing after the colon). panel_substitution holds the same text with substitute chatgpt at 19:39:32.525Z.
- The timing file gives "Panel Judge 1 deepseek" 318.2 s.
- **The record holds nothing about why**: no HTTP status, finish reason, token counts or reasoning length for the seat. The same model (deepseek-flash) wrote the single judge's 11,469 characters (240.2 s) and the synthesis minutes earlier. In 32255 an empty GLM reply carried 64,000 reasoning tokens; whether this one did cannot be told from the row.
- **Solution:** store the raw envelope's finish reason, usage and error body in the failed_reply row (prompt_sent too).

## J. Comparison with run 32266

| Point | 32266 | 32284 |
|---|---|---|
| Flow | d9ec1e19 (judge_fix3) | 681c085a (judge_fix4) |
| Round lengths D1, C1, D2, C2, D3, C3, D4, C4 | 9,119; 11,406; 11,350; 9,804; 8,251; 10,731; 19,156; 5,496 | 6,390; 10,952; 11,814; 7,993; 9,715; 9,207; 15,868; 9,157 |
| Run length | about 51.8 min | about 38.1 min (from the first timed node) |
| Panel | DeepSeek, Gemini, Sol (alternate for GLM) | ChatGPT (reserve for DeepSeek), Gemini, GLM |
| Failure | GLM removed, 14 uncured | DeepSeek empty reply, 318.2 s |
| Panel verdict | HELD 3-0 | HELD 3-0 |
| Outcome | recorded in the 32266 file as DEFENDER PREVAILS; **the row now reads UNDERDETERMINED** (the outcome is re-derived on every call; the record does not say when it changed) | UNDERDETERMINED (2 of 3 RESULT lines) |
| Unanswered against the defender | none | none |
| Unanswered against the challenger | Isaiah 7:11 (counted by Sol only) | none by the ledger; ChatGPT counts Luke 3:31, a [CR2] verse outside the lists |
| Recompute after a cure | not built (DeepSeek's standing rested on a retracted line) | F1 worked on Gemini and the single judge |
| K-DG8 | 5 fires | removed (F2); none |
| Close numbering | both closes renumbered, nothing marked | both closes renumbered, nothing marked (B3); GLM graded by the close's numbers |
| New verses in the defender's close | 5, nothing marked | 3 marked NOT COUNTED (F5) |
| Citation false flags | margin (Isaiah 7:14) | malformed "Isaiah 7:11,7"; report stops inside the close |
| S checks | S-A 3 (2 true), S-C 1, S-E 1 false | S-A 2 true, S-C 1 true, S-E 1 true |
| Cache | 100,006 written, 357,603 read | 72,307 written, 251,851 read |

The fix set did what it was built to do on the cure side: the retraction parser read every retraction, the recompute rewrote the standings and RESULT, and no seat was removed. The two runs share one lesson in a new place: the outcome turns on what counts as a pressed witness and what counts as footing, and the rulebook and the ledger answer those questions differently.

## K. Order proposed

1. B1: your rulings on a [CR1]/[CR2] verse not carried under PRESSED WITH, and on a one-layer link-round block. Each decides this outcome. Then a mark for a count item whose witness the ledger does not carry.
2. B3: widen the numbering pattern; check that the declared chain is in the D4 Build prompt.
3. B2: a mark when a seat's collision lines do not cover the declared D numbers; a recorded mark for an empty OUT-OF-ROUND line.
4. B4: the citation report's stopping point; NOT CHECKED with a reason for the rest.
5. F: split comma-joined chapter:verse references; pair a parenthesized bare reference; your ruling on hyphenated names.
6. C: the row's chain marks from the counted seats; F1 to rewrite the REASONING and CHAIN MARK lines that rest on a retracted line.
7. E: the K-C cure check to accept a line that reads the rows together, and to require that the restated line weigh the rows it set aside; RESPONSE quotations checked against the round they name.
8. G: S-A, S-B, S-D and S-E widened as listed; ruling 383 in the diagnostic prompt.
9. I: store the failed seat's finish reason, usage and error body.

## Not read

- The panel, reserve and single-judge prompts as sent: not stored; only the cure prompts are. The defender-side ledger is not quoted in any stored prompt (the cure prompts quote only the challenger chain).
- The D4 Build and C4 Build prompts: not stored, so the defender's "I have not seen the text of my round 1 declaration" cannot be checked against what it was sent.
- The formatted document (Format Markdown output), so F8's itemization text and F9's printed S lines were not seen.
- The execution records (n8n), under the reading rule: why DeepSeek's reply was empty, per-call token usage, and why the run's first timed node is at 13:04 CST against the 12:59 CST given as the firing time.
- The Hebrew and Greek counts claimed in the rounds: the tables read hold the KJV text only.
- debate_replay_judgments was not queried for this run.
