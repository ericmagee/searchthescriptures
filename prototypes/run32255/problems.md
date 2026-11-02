# Run ODV1-32255: problems and solutions

Flow version e9f2a2dd (as given in the brief; the row has no column that records the flow version), the first run on the second judge fix set (judge_fix2). Fired 08:14 CST 2026-11-02 (first node 14:14:54Z), stopped about 09:27 CST (Record Alternates starts 15:26:17Z and runs 0.4 s; the three judgments are written 15:26:17Z to 15:26:18Z), status success. The run took about 71.4 minutes (4,283 s).
Row 3014ed5a (debate_results), run token ODV1-32255-5uddr87o. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, 27 record labels served).
Result fields: outcome "UNGRADED [dash] REVIEW" (the stored value joins the two words with a long dash); panel_verdict and framework_verdict CONTESTED; panel_split "1-1 (1 not counted: debate rule)"; judged_by and panel_expected chatgpt, deepseek, gemini; data_class "contested"; quarantine_reason NULL; defense standing PROP-DEPENDENT with conceded_links NULL ("no majority among the 2 counted seat(s)": ChatGPT 3, Gemini 2); challenge standing SELF-SUPPORTED, challenger conceded 0; defender and challenger chain marks FOOTED; underdetermined_seats chatgpt:COLLISION, gemini:COLLISION, gemini:RESULT; drv_removed NULL and no row in odv1_drv_removals.
Seats: DeepSeek (judgment 891) HELD, 1 uncured, not counted; Gemini (892) HELD, 0 uncured; ChatGPT (893, reserve for GLM) BROKEN, 0 uncured.
Cache: 74,021 tokens written, 257,062 read (input 584,229, output 372,579).

**Token limits.** Every seat ran at 64,000 output tokens (as given in the brief). Two records carry the limit: the synthesis line "[SYNTHESIS USAGE: prompt=46841 completion=25806 reasoning=22378 finish=stop max_tokens=64000]", and, new in this run, GLM's stored reply, whose usage reads "completion_tokens":64000 with "reasoning_tokens":64002 and finish_reason "length" (B2). No round was cut: position('TRUNCAT') is 0 in all six rounds; the challenger's round 2 ends "PREMISE COUNT: 6"; no judgment is marked truncated.

Nothing here is applied. Nothing was written to the database, n8n or git. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 8,117); the challenger's round 1 (engine_r1, 11,178); the defender's round 2 (claude_r2, 16,004); the challenger's round 2 (engine_r2, 8,864); the defender's link round (engine_r3, 7,123); the challenger's link round (challenger_r3, 8,654); the three panel judgments with their audit, cure and alternate lines (debate_judgments 891 DeepSeek 15,523; 892 Gemini 5,768; 893 ChatGPT 8,467); the single judge (independent_verdict_raw, 18,486); the synthesis with its confirmation (14,002); review_notes (3,807); out_of_round_detail (393); panel_substitution, panel_split, panel_fingerprint (37ab8bfb...), drv_removed (NULL); the citation check (citation_check, 24,529 as text: totals, all 208 items by side, round, link, reference and load-bearing mark, and every item whose status is not MATCHES in full); drift guards 8 and 18, read live.
**The enforcer log** (debate_enforcer_log, 35 rows, ids 1 to 35): every row's seat, role, model, kind, rule, item, flagged_line, response_line, cure_status and cure_reason. prompt_sent holds five distinct texts (one per seat, checked by md5): DeepSeek's (14,558) read whole; for Gemini (10,109), ChatGPT (10,287), the single judge (14,479) and Qwen (18,521), the rule block (characters 1 to 6,306) and the answer form are identical by md5 to DeepSeek's, and each seat's FLAGGED ITEMS section was read whole. full_reply holds one text per seat, each read whole: DeepSeek 7,758; Gemini 1,004; ChatGPT 5,720; single judge 6,891; Qwen cure 7,784; Qwen's alternate judgment (kind alternate_reply) 9,762. GLM's failed reply (kind failed_reply, 476,825) was **not** read whole: it was parsed as JSON, its first 1,500 and last 2,500 characters were read, and its reasoning (235,196 characters, stored twice, as "reasoning" and inside "reasoning_details") was searched by position() (B2).
Each pressed witness was checked by name with SQL position() in the holding side's later rounds (section D). Citation flags were checked against kjv_verses. Code was read only from the local package (prototypes/judge_fix2/new), to explain marks; no execution record was read.

**Round labels.** In the judges' text "CR" marks the defender's (Claude's) rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n". This run, unlike 32228, has no number mismatch: the challenger's round-2 premise list names "LINK 1, 1, 2, 3, 5, 6" by the defender's chain numbers D1 to D6, and the defender's link round answers under the same numbers (LINK 1 [premise 1], LINK 1 [premise 2], LINK 2, LINK 3, LINK 5, LINK 6; no LINK 4 because nothing was pressed against D4).

## Timings (timings_32255.json, seconds; Z times)

| Step | Start (Z) | Seconds | 32228 |
|---|---|---|---|
| Defender round 1 | 14:14:54 | 48.3 | 45.5 |
| Challenger round 1 | 14:15:44 | 477.9 | 323.1 |
| Defender round 2 | 14:23:44 | 181.8 | 97.2 |
| Challenger round 2 | 14:26:48 | 378.8 | 466.3 |
| Defender link round | 14:33:08 | 65.9 | 88.2 |
| Challenger link round | 14:34:16 | 340.5 | 231.6 |
| Synthesis (DeepSeek) | 14:39:58 | 149.6 | 124.3 |
| Single judge (Independent Verdict Call) | 14:42:32 | 255.7 | 185.3 |
| Single judge cure (Cure Call deepseek) | 14:46:49 | 95.4 | 60.0 |
| Diagnostic (DeepSeek) | 14:48:27 | 12.5 | 9.0 |
| Panel judge 1, DeepSeek | 14:48:41 | 183.8 | 224.5 |
| Panel judge 2, Gemini | 14:51:45 | 153.4 | 229.1 |
| Panel judge 3, GLM (failed closed) | 14:54:18 | 434.2 | 354.8 |
| Panel reserve, ChatGPT | 15:01:35 | 80.4 | 104.5 |
| Panel cure 1, DeepSeek seat | 15:02:57 | 50.4 | 61.1 |
| Panel cure 2, Gemini seat | 15:03:50 | 7.8 | not called |
| Panel cure 3, ChatGPT seat | 15:03:58 | 29.1 | 13.7 |
| Alternate call (Qwen for the DeepSeek seat) | 15:04:29 | **985.2** | 981.7 |
| Alternate cure (Qwen) | 15:20:57 | 316.7 | not called |
| Record Alternates | 15:26:17 | 0.4 | 0.4 |

The challenger's three rounds took 1,197.2 seconds (32228: 1,021.0); the defender's three took 296.0 (32228: 230.9). The alternate call is the longest single call of the run, 23.0 percent of it; with its cure, Qwen took 1,301.9 seconds (30.4 percent).

**Which model made the 985.2-second call.** The timings file names only the node ("Alternate Call openrouter"). The record names the model: DeepSeek's judgment ends "[AUDIT v21: ALTERNATE TRIED -- SEAT: deepseek; ALTERNATE: qwen; MODEL: qwen/qwen3.8-max-0902; RESULT: NOT SEATED; WHY: 13 uncured item(s)]", and enforcer row 21 (kind alternate_reply, seat qwen, item "replaces deepseek") holds its reply. There was one alternate call, so the 985.2 seconds are Qwen's.
**Your rule.** A model that cannot answer within the 15-minute limit (900 s) is removed. Qwen's alternate call exceeded it by 85.2 seconds, and its cure call then ran another 316.7 seconds. The flow let the call finish and judged it; nothing in the record shows a 900-second limit applied. Qwen was not seated here, but for its uncured items, not its time. In 32228 the same model took 981.7 seconds and **was** seated; under your rule it should have been removed there too.
**The third panel judge (434.2 s)** is GLM (z-ai/glm-5.3): Panel Judge 3 starts 14:54:18Z and ends 15:01:32Z, and the substitution and GLM's failed_reply row are stamped 15:01:35.004Z. It was within the limit but produced no answer (B2).

---

## A. What the change did

1. **The enforcer log works and holds every exchange.** 35 rows: 33 cure items (each with prompt, full reply, RESPONSE line, result and reason), Qwen's first reply, and GLM's failed reply in full. It is the first run in which a failed seat's reply is stored; it settles what 32228 B4 could not (B2).
2. **W1 (a RESPONSE line for every item) was followed by every seat**, including ChatGPT, which wrapped its whole cure in a JSON judgment; the parser still read its PRESSED, STATEMENT and RESPONSE lines.
3. **K-G6 fired again** (the R2 finding, drvLabAt now reading "answered in [CR2] or [CR3]:"): three marks on the single judge, all true by the ledger, which raised its defender count from 0 to 2.
4. **The R2 ruling (373) reached the ledger**: premise 1's ledger line "3 verse(s) carried; 2 named" counts Deuteronomy 22:24 as named through the defender's round 2 ("Deuteronomy 22:20-24", claude_r2 12,602), a round later than the challenger's round 1 that first pressed it.
5. **K-N fired 0 times and K-SC 0 times, both correctly**: no judge tagged a narrowing CONCEDED (stated), and no STANDS line says the defender conceded its link (C).
6. **K-DG8 fired once, truly**, on the single judge's CHALLENGER LINK BROKEN line on the timing rows; its cure was then refused falsely (B4).
7. **Citation Scan (fix 6) removed the book-carry fault**: no bare reference took a book from another clause, and no real verse was called non-existent (F).
8. **But the outcome was lost to form.** DeepSeek's one uncured item is a layer-form refusal on plain transliterations (B1), and Qwen's thirteen are a bracket-form and tag-position refusal (B3). Had DeepSeek been counted, the panel would have held two HELD seats against one BROKEN.

## B. Faults that decided the outcome

### B1. Why the split is 1-1, and DeepSeek's one uncured item

| Seat | Verdict | Clause | Counted? | What it rests on |
|---|---|---|---|---|
| DeepSeek (891) | HELD | HELD-1, n=6 w=0 k=0 | **no** ("1 not counted: debate rule") | Every link STANDS or UNDERDETERMINED; defender c=3 (premises 1, 4, 5 UNEXHIBITED); challenger c=0. K-C D5 vs C2 UNCURED. |
| Gemini (892) | HELD | HELD-1, n=6 w=0 k=0 | yes | Every collision UNDERDETERMINED, D6 STANDS; defender c=2 (premises 1, 5), premise 4 VOID; challenger c=0. |
| ChatGPT (893), reserve for GLM | BROKEN | BROKEN-1, n=6 w=0 k=2 | yes | D3 vs C6 BROKEN on Psalm 2:7 and Acts 13:33, D5 vs C2 BROKEN on Luke 1:5, all three named in no later defender round; defender c=3; challenger c=0 with premises 2, 4, 5, 6 VOID. |

The panel aggregate needs two clean seats that agree; one HELD against one BROKEN is CONTESTED, mapped to "UNGRADED [dash] REVIEW".

**DeepSeek's uncured item (enforcer row 4).** The mark: K-C on "D5 vs C2 (Romans 1:3): UNDERDETERMINED -- ... the row does not name Joseph -- GROUND: ... the text leaves the immediate source unstated." The mark is **true** (a stating-verse ground). The RESPONSE is **sound**: "The mark is right: \"the row does not name Joseph\" was the retired test, and [DR2] presses \"Romans 1:3 'made of the seed of David according to the flesh,'\" which [CR3] LINK 5 answers with [L2] genomenou (made, come to be)." The RESTATED line drops the ground and exhibits two kinds: "([L1] Romans 1:3 \"made of the seed of David according to the flesh,\" [L2] sperma, seed, and sarx, flesh) ... [CR3] LINK 5 exhibits [L1] Romans 1:3 with [L2] genomenou (made, come to be) and Galatians 4:4 \"made of a woman\" with [L2] ek sou (out of you)". The check stored "UNCURED; KINDS: L1; WHY: the restated line names no chain footing: it exhibits 1 layer kind".
- **Why.** drvKinds counts an [L2] tag only when the words after it carry Hebrew or Greek script, transliteration marks or a Strong's number (DRV_SRC, the code's note "BB-6926 option A ... no italic alternative"). "sperma", "sarx", "genomenou" and "ek sou" carry none, so all three [L2] tags were refused. The same seat's D5 vs C5 passed only because it also carried "[L3] Ezra 2:59-62" (KINDS L1, L3, its two [L2] tags also refused); its D1, KEYSTONE and D6 passed because "gennēthen" carries a macron.
- **Judgment.** The refusal is correct to the coded rule and **false in substance**: the line names two layer kinds of the chain it weighs. The cure prompt says only "exhibiting at least two kinds of layer"; it never tells the judge that an [L2] word must be written in its own script, with marks, or with a Strong's number.
- **Effect.** The seat was not counted, the alternate was called (985.2 s plus 316.7 s), and the panel lost its majority.
- Solution: either tell the judge the [L2] form in CURE_FORM, or let the K-C cure accept a transliterated word with a gloss in parentheses as [L2] (your option A ruling governs; it is yours to change).

**The two open questions from 32228, re-checked.**
1. **A conceded (here: counted) premise under a link that stands.** Ruling 372 settles the count: an unanswered pressed witness makes the premise UNEXHIBITED and counts. It does not settle the link's grade, and that is what divides the counted seats. The panel prompt reads: "Grade a link BROKEN when the other side exhibited [L1]/[L2]/[L3] witnesses that together contradict it and the broken side's later rounds left any of those witnesses UNANSWERED ... Grade UNDERDETERMINED only when the side's later rounds answered every such witness", and also "A limb the link round narrows counts in its narrowed form." The defender narrowed D3 ("Luke 1:35 gives the Spirit's coming as the stated ground ('therefore') of the calling") and D5 ("The only human body it names as the source of his flesh is Mary's. I concede no verse names Mary's line").
   - ChatGPT read the letter: an unanswered witness breaks the link (D3, D5 BROKEN).
   - DeepSeek and Gemini counted the premises but kept the links: DeepSeek "D3: STANDS -- ... the pressed Psalm 2:7/Acts 13:33 go to the dropped begetting limb"; Gemini graded D1 vs C1 and D5 vs C2 UNDERDETERMINED beside its counted premises 1 and 5, which the letter does not allow ("only when ... answered every such witness").
   - On the text: Acts 13:33 applies "this day have I begotten thee" at the resurrection; it does not, on its words, deny that Luke 1:35's "therefore" grounds the calling. Luke 1:5 ("his wife [was] of the daughters of Aaron, and her name [was] Elisabeth") does not deny that Mary's womb is the named source of the flesh. Against the narrowed links, ChatGPT's two BROKEN lines do not show the "together contradict" the rule requires; against the links as first declared, they may. The record cannot settle which form a judge must test.
2. **An answer in substance without the verse named.** Luke 1:5 was first pressed in the challenger's round 1 ("Elisabeth, who is \"of the daughters of Aaron\" (1:5)"). Under ruling 373 the defender's round 2 is a later round, and it answers the point in substance: "Elisabeth's kinship (Luke 1:36) proves no tribe for Mary. *suggenis* (kinswoman) is a general word, and Aaron married Elisheba of Judah's house (Exodus 6:23; Ruth 4:20)." It names Luke 1:36, not 1:5, and does not quote 1:5's words; the rule's "ANSWERED when any later round ... quotes it or names it by reference" is therefore not met. Qwen quoted that same answer in its restated D5 vs C2. Psalm 2:7 and Acts 13:33 (first pressed in the challenger's round 2) are met in the defender's link round only through Romans 1:4: "Romans 1:4 says *horisthentos* (declared, marked out) at the resurrection. That is a declaration, not a ground." These two answers in substance decide ChatGPT's two BROKEN lines and every seat's count of premise 5.
- Solution: your rulings on (1) whether an UNEXHIBITED premise breaks the link it is filed under, or the link breaks only when the unanswered witness contradicts the link in its narrowed form; and (2) whether an answer in substance (here Exodus 6:23 with Ruth 4:20 for Luke 1:5; Romans 1:4 for Acts 13:33) answers a pressed witness. With (1) for "narrowed form" and DeepSeek counted, the panel would read HELD 2-1; with (1) for "the letter", Gemini's and DeepSeek's UNDERDETERMINED and STANDS lines beside counted premises are unsound.

### B2. GLM failed closed again, and its reply is now stored: it ran out of tokens in its reasoning
- panel_substitution: "FAIL-CLOSED: seat \"glm\" returned an envelope this parser does not recognise. Top-level keys: [id,object,created,model,provider,system_fingerprint,service_tier,choices,usage]. NO ROW IS WRITTEN.", failure_kind "no_usable_judgment", substitute "chatgpt", at 15:01:35.004Z. The same message as 32228.
- **Stored in full:** enforcer row 35, kind failed_reply, seat glm, model z-ai/glm-5.3, reply_error the message above, full_reply 476,825 characters.
- **Opening:** "{\"id\":\"gen-1793631258-zUwxEQtigjzxFJtYkQzz\",\"object\":\"chat.completion\",\"created\":1793631259,\"model\":\"z-ai/glm-5.3\",\"provider\":\"InferenceNet\", ... \"choices\":[{\"index\":0,\"logprobs\":null,\"finish_reason\":\"length\",\"native_finish_reason\":\"length\",\"message\":{\"role\":\"assistant\",\"content\":null,\"refusal\":null,\"reasoning\":\"Let me work through this debate carefully.\n\nThe topic: \"Did Christ have a biological father?\" ..."
- **End:** "... So C5 could be graded CHALLENGER LINK BROKEN via the unanswered-witness route ... Hmm wait [dash] but the unanswered-witness counting rule applies to witnesses \"quoted against a link\"" then the envelope closes: "\"usage\":{\"prompt_tokens\":27163,\"completion_tokens\":64000,\"total_tokens\":91163,\"cost\":0.23257304, ... \"completion_tokens_details\":{\"reasoning_tokens\":64002, ...}}".
- **Cause, read from the record:** message keys role, content, refusal, reasoning, reasoning_details; content NULL; finish_reason "length"; 64,000 completion tokens, all reasoning. GLM spent the whole 64,000-token limit thinking and never began its answer. position('verdict_tag') in its reasoning is 0, position('CLAUSE:') is 0. The parser's message ("an envelope this parser does not recognise") is wrong about the cause: the envelope is ordinary; the answer is empty.
- Whether 32228's GLM failure (354.8 s, same message) had the same cause cannot be read; no part of that reply was stored.
- Solution: (a) name this failure kind ("finish_reason length with empty content: the reasoning used the whole limit") in the substitution detail; (b) for GLM, either raise the output limit, cap its reasoning (a reasoning budget or effort setting), or drop it from the panel; the choice is yours. Under your time rule GLM was within the limit (434.2 s).

### B3. The Qwen alternate: all 13 items uncured on form, and its count unsound
- Qwen's first reply (row 21): HELD, defender c=0, SELF-SUPPORTED, with every collision UNDERDETERMINED. It named three unanswered witnesses and counted none: "unanswered Deuteronomy 24:1 does not state that Joseph begat Jesus"; "unanswered Psalm 2:7 and Acts 13:33 do not remove the therefore"; "unanswered Luke 1:5 does not state Mary's tribe". Under ruling 372 its count is unsound by three premises. **K-G6 did not fire on Qwen** (a miss); K-U fired three times (marks only, true by the letter).
- Its 13 cure items (rows 22 to 34): six K-S, seven K-C. Each mark is in the true class (stating-verse grounds), with one wrong side label (E). Qwen restated every line, with a RESPONSE for each. All 13 were refused on form:
  - K-S (rows 22 to 27): "the restated line names no round that answered the witness". Qwen wrote "CR2 and CR3 are the answering rounds" without brackets; DRV_ANS reads only "[CR2]" or "[CR3]". The first-pass audit had already said so ("beside a round it names without a bracket, which K-S does not read as named").
  - K-C (rows 28 to 34): "exhibits 0 layer kinds" (one row: 1 kind). Qwen placed each tag after its words ("Matthew 1:18-20 [L1] with gennaō (to beget) and ek (out of) [L2]"); drvKinds reads the words after a tag, so each tag met the next phrase and failed.
- **Judgment:** correct to the coded rules, false in substance. The cure prompt prints the rounds in brackets but never says a round without brackets is not read, and never says where a tag must stand. Gemini's tags were also placed after their words; its K-C cure passed by the accident that the word after its second [L2] tag ("egennēthē") carries a macron.
- Not seated, rightly on substance (its c=0 is unsound) and also under your time rule (985.2 s). The record gives the form reason only.
- Solution: read rounds with or without brackets, or say in CURE_FORM that brackets are required; count a tag that follows its words, or say in CURE_FORM that the tag comes first; let K-G6 run on the alternate's judgment.

### B4. The single judge: a false K-G4 trigger, a true K-DG8 refused falsely, and a lax K-G6 cure
- **K-G4 on D1 vs C1 (row 10): false trigger.** The line's ground is "the timing rows exclude the espousal knowing C1 asserts, and DR3's answer does not remove them"; it counts no witness unanswered. K-G4 still fires on every BROKEN line, as in 32228 B2. The judge retracted ("[DR3] itself names the pressed timing witnesses"), giving a reason for a ground the line never used. The retraction was right in substance, because the line broke DG-8 (next item).
- **K-DG8 on D1 vs C1 (row 13): true mark, UNCURED falsely.** Drift guard 8, read live: "\"knew her not till she had brought forth her firstborn son\" (Matt 1:25) bounds the abstinence to the pregnancy. So the record holds, at L4 footed on those rows, that Joseph knew Mary his wife within the espousal (Sight 32)." The restated line reads "... this line does not rest on Matthew 1:25 or Matthew 1:18 as excluding any union." dg8Lines matched the words inside that denial; the README says hedged and reported clauses are skipped, but a negated clause is not. Cure reason: "the restated line keeps what K-DG8 marks". The review notes carry it as "REVIEW THIS ROW".
- **Missed by K-DG8:** the single judge's RESULT, never restated after the retraction: "RESULT: DEFENDER WINS -- the challenger's claim that Joseph knew Mary within the espousal is contradicted by the stated timing". It names no verse, so the test could not see it. Its REASONING ("[L4] The challenger's C1 is broken at collision"), CHALLENGE STANDING ("C1 is graded CHALLENGER LINK BROKEN, so it cannot be SELF-SUPPORTED") and CHALLENGER CHAIN MARK ("though it is broken at collision") also stand unrestated beside a retraction. The synthesis confirmation notes this tension.
- **K-G6 premise 4 (row 19): cured on a VOID argument.** The statement form asks for "the transcript's words that show the verse is not a pressed witness of that premise". The judge wrote instead that the premise is VOID because "[DR2] item 4 adds \"(pressed as begetting-cause)\""; the check accepted it ("counted: DEFENDER COUNT 2"). Whether that parenthetical is part of the charge is a real question (E, premise 4), but the statement does not do what the form asks.
- The single judge does not vote; its result stayed HELD (HELD-1), and its defender count went from 0 to 2.

### B5. Two response_line values in the log are attached to the wrong rule
- Row 13 (K-DG8 D1 vs C1) stores "I accept the mark. The line was wrong because [DR3] answers the pressed witnesses; I retract rather than press an answered witness.", which is the K-G4 RESPONSE. The reply's K-DG8 RESPONSE is "The mark is correct; the original ground read the timing rows too strongly, so the line is retracted and restated without that reading."
- Row 17 (K-C D6) stores the K-S D6 RESPONSE ("The mark is correct as to form; D6 stands because ..."). The reply's K-C D6 RESPONSE is "I accept the mark; D6 is restated on the chain as a whole and not on the retired single-stating-verse ground."
- enfRows takes the first RESPONSE line whose item matches, without the rule. No cure result was changed (both items had their own RESPONSE line), but a reader of the log sees the wrong text.
- Solution: match the RESPONSE line by rule and item ("RESPONSE: K-DG8 D1 vs C1").

## C. Concessions and narrowings

- The defender's link round holds no stated surrender of a link. It holds four narrowings, each in the "NARROWED TO" form: LINK 1 premise 1 ("I drop any claim that Matthew 1:19 contains a verb of knowledge"); LINK 2 ("I concede \"in every row.\""); LINK 3 ("I drop any claim beyond this ground"); LINK 5 ("I concede no verse names Mary's line, and I do not rest on Luke 3:23's \"Heli\" as hers"). Premise 2 and LINK 6 are SUPPORTED. The challenger narrowed and conceded nothing in its link round.
- **K-N (fix 2): no judge counted a narrowing as CONCEDED (stated)**, so 0 fires is right. ChatGPT: "Premise 1 is narrowed, not stated-conceded; the ledger nevertheless marks its witness unanswered." Gemini: "premise 3 SUPPORTED in narrowed form". DeepSeek's DEFENSE STANDING says "conceded or left unexhibited premises 1, 4 and 5", but its CONCEDED LINKS items are all tagged UNEXHIBITED.
- **K-SC: 0 fires, right by design.** No STANDS line says the defender conceded its link. The class it does not cover is the one in B1 (1): STANDS beside a premise counted UNEXHIBITED (DeepSeek D1 with premise 1, D3 with premise 4).
- Out of round (stored, 4): four sentences of the defender's round 2, among them "I accept the challenger's KJV rows." and "Noted that no verse names Mary's line." The judges list them consistently; DeepSeek adds one challenger sentence from its round 1 ("the young-woman word does not by itself establish a fatherless conception").
- **The synthesis reads narrowings as concessions** (G4).

## D. Pressed witnesses, answered or unanswered (SQL position(), later rounds of the holding side)

**Against the defender** (the challenger's round-2 premise list; later rounds: the defender's round 2 for presses first made in the challenger's round 1, and the link round):

| Premise (link) | Witness | Defender round 2 | Defender link round | State |
|---|---|---|---|---|
| 1 (D1) | Matthew 1:19 | 12,241 | 241 | named |
| 1 (D1) | Deuteronomy 22:24 | as "Deuteronomy 22:20-24" (12,602) | 0 | named by range in round 2 (pressed first in challenger round 1) |
| 1 (D1) | Deuteronomy 24:1 | 0 (the "24:1" hit at 8,772 is Genesis 24:16) | 0 | **unanswered** |
| 2 (D1) | Matthew 1:20; 2 Samuel 7:14; 1 Chronicles 28:6 | named | 510; 1,834; 1,852 | named |
| 3 (D2) | Acts 16:13; Numbers 1:2; Numbers 1:18; Luke 2:48; John 6:42 | named | 2,193; 2,553; "1:18" 424; 2,662; 2,648 | named |
| 4 (D3) | Luke 1:32; Romans 1:4 | 8,324; 0 | 3,348; 3,204 | named |
| 4 (D3) | Psalm 2:7; Acts 13:33 | 0 (the "2:7" hit at 2,408 is Esther 2:7) | 0 | **unanswered by name**; Romans 1:4 met in substance |
| 5 (D5) | Luke 1:36; Luke 3:23; Ezra 2:59; Ezra 2:61-62; Hebrews 7:14 | named | 4,120; 2,431; "Ezra 2:59-62" 4,146; same; 4,657 | named |
| 5 (D5) | Luke 1:5 | 0 (the "1:5" hit at 3,033 is Matthew 1:5) | 0 | **unanswered by name**; answered in substance in round 2 (B1) |
| 6 (D6) | 2 Samuel 7:12; Psalm 132:11; Acts 2:30; Romans 1:3; Hebrews 7:14 | 400; 415; 429; 440; 452 | 4,421; 4,436; 4,453; 3,742; 4,657 | named |

- The three unanswered premises (1, 4, 5) match the stored ledger lines exactly ("NOT NAMED: Deuteronomy 24:1"; "Psalms 2:7, Acts 13:33"; "Luke 1:5"). The ledger did not take Matthew 1:5 for Luke 1:5, Esther 2:7 for Psalm 2:7, or Genesis 24:16 for Deuteronomy 24:1.
- Who counted them: DeepSeek and ChatGPT 1, 4, 5; Gemini 1, 5 (4 VOID); the single judge 1, 5 after K-G6 (4 VOID); Qwen none.
- Witnesses pressed in prose but in no PRESSED WITH list (not counted by the rule unless a judge quotes the pressing sentence; no judge did): Acts 1:8 and 1 Samuel 16:13 (0 in both later rounds; the defender's round 2 "I accept the challenger's KJV rows" is a grant); 1 John 3:9, 4:7, 5:1 (0; John 1:13 answered by name); Isaiah 8:8, Luke 1:13, Matthew 11:11, Isaiah 54:3 (0); Jeremiah 18:7-8 (0; met in substance, "So the sentence stood").

**Against the challenger** (the defender's link-round premise list; the only later round is the challenger's link round): every witness is named there: Matthew 1:18 (1,229), Matthew 1:25 (864), Luke 1:34 (1,556), Genesis 3:15 (2,416), Galatians 4:4 (3,198), Luke 1:35 (2,536), Matthew 1:16 (2,593), Hebrews 7:14 (3,680), Romans 1:3 (2,216), Matthew 1:20 (602), Luke 3:23 (6,544). Challenger c=0 is right on the record; every seat has it.
- The defender's round 2 also set legal-sonship rows against the challenger's register case in prose: Ruth 4:17, Genesis 48:5, Exodus 2:10, Esther 2:7, and Exodus 6:23 with Ruth 4:20. Each is at position 0 in the challenger's rounds 2 and 3. They stand in no PRESSED WITH list, and no judge counted them. GLM's unfinished reasoning was weighing exactly these when it ran out of tokens.
- Under ruling 373 no witness was found answered only in the challenger's round 1, because the defender pressed no listed witness before its link round.

## E. Checker marks, one by one (33 cure items plus first-pass marks)

| Rule and item | Seat | Mark | Cure and RESPONSE |
|---|---|---|---|
| K-C REASONING ("no row names Joseph as the one who begat Jesus") | DeepSeek | true | CURED; RESPONSE sound |
| K-C KEYSTONE ("the seed rows name David's line, not Joseph's begetting") | DeepSeek | true, borderline (a reading of the rows as much as an absence) | CURED; sound |
| K-C D1 ("names no verse where Joseph begat Jesus") | DeepSeek | true | CURED; sound |
| K-C D5 vs C2 | DeepSeek | true | **UNCURED, false in substance** (B1) |
| K-C D5 vs C5 ("the row does not state Joseph begat Jesus") | DeepSeek | true; the audit says it "sets aside the defender's chain", but the ground sets aside the challenger's Luke 3:23 reading (wrong side label) | CURED; sound |
| K-C D6 ("no verse states a human biological father") | DeepSeek | true | CURED; sound |
| K-S2 D5 vs C5, D6 | DeepSeek | true; review only | none |
| v1 same-model divergence (seat against the single judge) | DeepSeek | correct to report | none |
| K-C REASONING ("no verse states that Joseph begat Jesus") | Gemini | true | CURED (by tag-position accident, B3); RESPONSE sound but thin |
| K-G4 D3 vs C6, D5 vs C2 | ChatGPT | true (the grounds are unanswered witnesses, with the pressing sentence quoted) | CURED on the naming test: right by name; Luke 1:5's substance answer is B1 (2). RESPONSE sound ("I accept the need to identify the pressing words") |
| K-G4 D1 vs C1 | single | **false trigger** | CURED by retraction (B4) |
| K-S D5 vs C2 | single | **false in substance**: "no verse names Mary's line" reports the defender's concession, not a ground | CURED; sound |
| K-S D6 ("do not state Joseph begat Jesus") | single | true | CURED; sound |
| K-DG8 D1 vs C1 | single | true | **UNCURED falsely** (B4); the log stores the wrong RESPONSE (B5) |
| K-C REASONING, KEYSTONE, D6 | single | true | CURED; sound (D6 RESPONSE misfiled, B5) |
| K-C D5 vs C5 ("the narrowed D5 does not assert a named Mary line") | single | **false**: it states the scope of the narrowed link and sets aside no chain | CURED; harmless |
| K-G6 premises 1, 5 | single | true | CURED by count; sound |
| K-G6 premise 4 | single | true by the ledger | CURED on a VOID argument the form does not ask for (B4) |
| K-S x6, K-C x7 | Qwen | true class; K-C D4 vs C2 labelled "the challenger's chain", but "no row states that they exclude a father" sets aside the defender's D4 rows | all **UNCURED on form** (B3); RESPONSEs sound but formulaic |
| K-U x3 (unanswered witness named in an UNDERDETERMINED line) | Qwen | true by the letter | marks only |

**Missed:**
- Gemini D6 STANDS, "The keystone is neither withdrawn nor broken by any affirmative text naming a human biological father" (the K-C class; the extended "no text says/states" patterns did not take "any affirmative text naming").
- Gemini D3 vs C6, "leave the biological mechanism unnarrated" (the stating-verse class).
- Gemini's UNDERDETERMINED lines beside its counted premises (B1 (1)).
- K-G6 on Gemini's premise 4: the single judge's identical VOID drew a K-G6 mark, Gemini's did not.
- K-G6 on Qwen (c=0 against three named unanswered witnesses).
- The single judge's RESULT on the timing rows (B4).
- ChatGPT's BROKEN lines tested against the links as first declared, not as narrowed (B1).
- For Gemini's and Qwen's K-C items the cure prompt reads "CHALLENGER CHAIN: not found in the prompt; weigh its links as the rounds give them", while DeepSeek's and the single judge's prompts carry the challenger ledger. The record does not show why. It may also explain the two K-G6 misses; this is an inference, not verified.

**Premise 4 VOID.** The challenger's premise 4 is: LINK 3: "makes the Holy Ghost's act the stated cause of the child's being called the Son of God" (pressed as begetting-cause). The quotation is verbatim from the defender's round 1. Gemini and the single judge call the premise VOID because of the parenthetical; DeepSeek and ChatGPT count it. The panel rule reads "A charge is stronger than its quote only when it asserts what the quote does not: a negation, a universal (all, none, only, never), or a claim the quote's own words do not make." Whether "(pressed as begetting-cause)" is part of the charge or a note on how it is pressed is yours to rule. It moves the defender count between 2 and 3, not the verdict.

**ChatGPT's challenger VOIDs.** Premises 2, 4, 5 and 6 are VOID "because their charges add exclusivity or conclusions". The defender's charges do add "only" (premises 2, 4, 6) and "settles Jesus's biological descent" against the quote "Reckoning is by the father's house" (premise 5; Qwen also VOIDs it). These are defensible under the rule's universal clause. They change nothing: every listed witness was answered.

## F. Citation checker

Totals stored: checked 208, matches 202, mismatches 4, not_checked 2. **No real verse was called non-existent, and no bare reference took a book from another clause** (32228: 1 Corinthians 1:19). Every non-match, checked against kjv_verses:

| Item | Status | Judgment |
|---|---|---|
| John 6:42, defender round 1 | WORDING DIFFERS | **False in substance.** The defender wrote "\"Is not this Joseph's son?\" (John 6:42; Luke 4:22)". kjv_verses Luke 4:22 ends "Is not this Joseph's son?", so the words match the second reference given. Every judge repeats it as an error; the single judge says "is Luke 4:22, not John 6:42", though the defender gave both. |
| Romans 1:3, challenger round 1 (item 35) | WORDING NOT FOUND | **Gloss class.** "of the seed of David *kata sarka* (according to flesh)": a transliteration inserted into the KJV words. The challenger's plain quotation of Romans 1:3 (item 23) matches. Same class as 32228's Galatians 4:4. |
| Romans 1:3, challenger link round, link 4 (load-bearing) | WORDING NOT FOUND | **True by the letter**: "[L1] Romans 1:3 \"ek spermatos Dauid kata sarka\"" offers a transliteration as an [L1] quotation. The judges deny it [L1] weight. |
| Hebrews 7:9-10, challenger round 2 | WORDING DIFFERS | **True**: "Levi also, who receiveth the tithes, payed tithes in Abraham" against kjv_verses "Levi also, who receiveth tithes". |
| 1 Samuel 16:13, challenger round 1 (item 26) | NOT CHECKED | The quotation "the Spirit of the LORD came upon David" is in kjv_verses. The round names the verse once, but the scan holds two items for it (25 MATCHES, 26 NOT CHECKED). No reason is stored. |
| Luke 1:36, defender round 2 | NOT CHECKED | No quotation is attached ("Elisabeth's kinship (Luke 1:36)"); no reason is stored. |

- Solution: when one quotation carries two references, check it against each and pass it if any matches; treat a transliteration inside quotation marks as a gloss, not a KJV quotation (as proposed in 32228); store a reason for NOT CHECKED; drop a duplicate item for one citation.

## G. The synthesis (DeepSeek, 149.6 s; checks S-A to S-D in review_notes)

1. **S-A fired once, rightly**: "Matthew 1:16's last link ... Both affirm, and both agree the passive is a birth row and not a counter-witness." The defender presses Matthew 1:16 as a witness in its link-round premises 2, 4 and 5, and its D2 rests on the passive. "Not a counter-witness" is drift guard 8's own phrase ("is non-narration, NOT a counter-witness"), not the defender's.
2. **S-A missed three other "both" claims** (it reads only "both agree"): "Both use 3:38": Luke 3:38 is at position 0 in all three challenger rounds; "Both now agree" that "Son of God" is a covenant title that "does not by itself name a begetter": the defender's link round holds the opposite ("That is a declaration, not a ground"); "the defender ... withdrew the Septuagint citation": the defender wrote "I withdraw nothing, but I do not rely on any Septuagint row" (claude_r2 7,817).
3. **S-C did not fire, a miss.** Section 1 is headed "no charge on either side's list contests these", yet it lists Matthew 1:16 (the defender's link-round premises 2, 4, 5), Galatians 4:4 (premise 2), Matthew 1:25 (premise 1), Hebrews 7:14 (the defender's premise 3; the challenger's premises 5 and 6) and the covenant-title rows (2 Samuel 7:14, 1 Chronicles 28:6, Psalm 2:7, Acts 13:33, Romans 1:4: the challenger's premises 2 and 4). S-C looks for the word "uncharged"; this heading does not use it.
4. **Narrowings graded as concessions**: the defender's links 1, 3 and 6 (its numbering) are "CONCEDED-BY-ITS-OWN-SIDE" where the defender wrote "NARROWED TO"; "the Mary-line claim ... conceded outright"; "his strongest-looking link was withdrawn". The panel rule says "A limb the link round narrows counts in its narrowed form." No S check covers this; it is the synthesis copy of K-N.
5. **The unanswered witnesses are missing.** "No link on either side ended NO-FOOTING-EXHIBITED except the defender's original Mary-line claim." Premises 1, 4 and 5 are UNEXHIBITED under ruling 372 (D). S-B (light ledger test) fires only on "every link answered", which the synthesis does not say.
6. **S-B and S-D: no fire, right.** The synthesis says the challenger answered all six premises (true, D) and that guards bind the challenger seat only ("Drift guard violations [dash] CHALLENGER seat only").
7. **Its DG-18 fire is right on the rule text.** Drift guard 18, read live, carries "RULE ADDITIONS: ... never quote Psalm 2:7 without its three NT occasions", and the challenger gave only Acts 13:33. Its quotation of the challenger is wrong in one word: "this day have begotten thee" (synthesis 6,644) against the challenger's "this day have I begotten thee" (engine_r2 5,064).
8. Solution: S-A to read any "both" sentence (both use, both cite, both affirm, both now agree) and to test it against both sides' rounds; S-C to read section 1's heading as an "uncharged" list; a synthesis check that writes NARROWED for a link so marked; the synthesis prompt to take the unanswered-witness ledger.

## H. Comparison with run 32228 (row b335085b)

| Point | 32228 | 32255 |
|---|---|---|
| Flow | 52b05334 | e9f2a2dd (judge_fix2) |
| Rounds cut | none | none |
| Round lengths (D1, C1, D2, C2, D3, C3) | 8,338; 10,812; 12,843; 9,040; 9,478; 6,978 | 8,117; 11,178; 16,004; 8,864; 7,123; 8,654 |
| MiMo time (rounds 1, 2, 3) | 323.1; 466.3; 231.6 | 477.9; 378.8; 340.5 |
| Run length | about 60.5 minutes | about 71.4 minutes |
| GLM | failed closed, "unrecognised envelope", 354.8 s; cause unknown (nothing stored) | same message, 434.2 s; reply stored; cause: 64,000 reasoning tokens, content null |
| Alternate | Qwen 981.7 s, seated for DeepSeek | Qwen 985.2 s plus cure 316.7 s, not seated (13 uncured, all on form); over the 15-minute rule both times |
| Seats counted | 3 (Qwen, Gemini, ChatGPT) | 2 (Gemini, ChatGPT); DeepSeek kept but not counted |
| Panel | CONTESTED 1-1-1 (HELD, PARTIAL, BROKEN) | CONTESTED 1-1 (HELD, BROKEN; DeepSeek HELD not counted) |
| Outcome | UNGRADED [dash] REVIEW | UNGRADED [dash] REVIEW |
| Defender concession | premise 6 conceded | none stated; four narrowings |
| Number mismatch (list against links) | yes; K-G7 false twice | none; K-G7 did not fire |
| K-G4 | false on concession grounds (two results flipped) | true and rightly cured on ChatGPT; one false trigger on the single judge (no result flipped) |
| K-G6 | silent (ledger heading mismatch) | fired 3 times, all true; missed on Gemini and Qwen |
| K-C | 4 marks, all true class | 18 marks: 16 true, 1 false, 1 borderline; two cures refused on form decided the panel |
| New checks | none | K-N 0 and K-SC 0 (both right), K-DG8 1 (true, refused falsely), S-A 1 (true) |
| Unanswered against the defender | Isaiah 8:8; usage rows answered only in substance | Deuteronomy 24:1; Psalm 2:7 with Acts 13:33; Luke 1:5 (answered in substance) |
| Unanswered against the challenger | Luke 1:42, Luke 1:31, Galatians 4:4, Jeremiah 22:24 | none in the listed premises |
| Citations | 1 Corinthians 1:19 book carry; Galatians 4:4 gloss | no book carry; John 6:42 dual reference; Romans 1:3 gloss |
| Cache | 63,456 written, 275,891 read | 74,021 written, 257,062 read |

The second fix set did what it was built to do where it ran: the log is complete, K-G6 is live again, the narrowing and concession checks stayed quiet when nothing called for them, K-DG8 found the one DG-8 ground it could see, and the citation scan lost its book-carry fault. The outcome was lost to three things: two form rules in the cure checks that the cure prompt does not state (the [L2] script rule; bracketed rounds and tag position); the 32228 open question 1 in a new form (an UNEXHIBITED premise under a link that stands); and GLM's empty answer.

## I. Order proposed

1. B1: your rulings on (1) whether an UNEXHIBITED premise breaks its link, or the link breaks only when the unanswered witness contradicts the link in its narrowed form; and (2) whether an answer in substance answers a pressed witness (Luke 1:5; Acts 13:33). These two decide the split.
2. B1, B3: the cure prompt states every form the cure checks enforce (the [L2] script rule; brackets on rounds; the tag before its words), or the checks accept the plain forms. Your BB-6926 option A governs the [L2] rule. With the forms stated, DeepSeek would have been counted.
3. B2: name GLM's failure ("reasoning used the whole limit, content empty"); your choice of a larger limit, a reasoning cap, or removing GLM.
4. Time rule: enforce 900 seconds on the alternate call and its cure; Qwen exceeded it here (985.2 s) and in 32228 (981.7 s, seated).
5. B4: K-G4 to fire only on a BROKEN ground that names an unanswered witness (the 32228 item, still open); dg8Lines to skip negated clauses; a retraction must restate the RESULT, REASONING, STANDING and CHAIN MARK lines that rest on the retracted grade; K-DG8 to read "contradicted by the stated timing".
6. E: K-G6 on the alternate's judgment and on every panel seat (find why Gemini's and Qwen's cure prompts say the challenger ledger was "not found"); the K-G6 statement cure not to accept a VOID argument; your ruling on premise 4's parenthetical.
7. B5: match the log's RESPONSE line by rule and item.
8. E: K-C side labels; K-C to take "any affirmative text naming"; the single judge's false K-C on a scope sentence.
9. F: dual references, transliteration glosses, reasons for NOT CHECKED, duplicate items.
10. G: S-A on every "both" sentence; S-C on the section heading; NARROWED in the synthesis; the ledger in the synthesis prompt.

## Not read

- GLM's 235,196 characters of reasoning (stored twice) beyond its opening, its end and the position() searches: it is unfinished thinking with no answer.
- The panel prompts as sent: they are not stored in the record. The VOID, BROKEN, UNANSWERED WITNESS and narrowing rules quoted here come from the local package (prototypes/judge_fix2/new/Panel Build.js), which the brief gives as the base of e9f2a2dd; that the live flow equals it is not verified here.
- The execution records (n8n), under the reading rule: so the per-seat max_tokens sent (other than GLM's and the synthesis's, which the record shows), the reason the ledger was "not found" in Gemini's and Qwen's cure prompts, and whether any time limit is set on the alternate call, are not seen.
- debate_replay_judgments holds no row for this run (by debate_id or run token).
