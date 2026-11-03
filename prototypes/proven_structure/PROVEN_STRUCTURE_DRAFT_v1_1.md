# Proven Structure: Every Critical Point Carried by the Layers (draft v1)

Worker_A3, 2026-11-02, for review by the other seats. Not live. Nothing in the engine has changed.
Written from rulings 392, 393 and 396 to 399 (md_notes_rulings, seat 25). It builds on the judge posture draft v4 (prototypes/judge_posture/JUDGE_POSTURE_DRAFT_v4.md) and on fix set 8 (prototypes/judge_fix8, offline), and it changes parts of both.

## 1. The rulings, as given

- **392:** "a press must have a premise behind it; a verse pressed without one isn't a witness"
- **393:** a cap of eight pressed verses per listed premise, both sides ("8 is approved.")
- **396:** "the Bible doesn't contradicts itself. so if a witness contradicts a link ... that witness doesn't fit into that link and you can't force it. the words doesn't matter.. only the meaning., which is why we drive with Isaiah 28:10". Confirmed with the fence: the judge weighs the meaning the debaters exhibit, with footing, and supplies none of its own.
- **397:** "every debate is built where the framework (the Layers) will be the default communication tools ... this debate structure has to force all parties to communicate their positions with the framework... and restrict the torpedo'ing of single scripture. if a script is claimed to mean something.. that needs to proven ... debate Oracle has to be told to prove every position with the layers not just make statements about it's positions.. PROVE YOUR POSITIONS"
- **398:** a press itself carries its layers; only a proven press binds the other side under ruling 372 ("you're pressing a Biblical fact... it can be expressed cleanly through the layers framework").
- **399:** a press may carry its proof by reference to the round where the same layers were exhibited. "LLMs will resort to any trick to find a win ... remove the potential and remove your problem ... we have no choice but to force proven structure on all critical points of the debate. The four layers cannot be manipulated when used as prescribed."

## 2. The problem these rulings close

In the runs to date, a debater could state what a verse means, and the judge was left to guess whether that was so. Three faults followed:

1. **Bare meaning claims.** Debaters asserted meanings with no footing outside the listed premises of the link round. The layer burden bound only those premises.
2. **The torpedo.** A single verse was pressed against a link with a claimed meaning that was never proven. Under ruling 372 it bound the other side all the same. Run 32306's challenger premise 2 carried 21 such verses.
3. **The judge's guess.** With meanings unproven, the judges filled the gap from training. GLM rested eight collision lines on "no witness states in its own words" (run 32306). The Synthesis wrote words beside Hebrews 7:14 that the KJV does not hold.

The rulings remove the room for the trick instead of policing it afterward. Every critical point is carried by the layers, and the judge checks proof instead of judging meaning.

## 3. Definitions

**Layers** (one definition, used in the debater prompts, the judge rulebook and the code):
- **[L1]:** a KJV verse, with its reference, quoted in the words of the KJV row. A quotation may be part of a verse.
- **[L2]:** a named Hebrew or Greek word, with its meaning (script, transliteration or Strong's number).
- **[L3]:** a second verse from another place, quoted, that the block reads as a cross-reference to the first.
- **[L4]:** an inference. It stands only when it exhibits at least two lower layers and the chain from them (DG-61).

**A claim of meaning:** any statement of what a verse says, means, shows, requires or excludes. Every claim of meaning carries its layers (ruling 397). A claim of meaning without them is a bare claim and carries no weight.

**A proven press:** a verse carried under a listed premise's PRESSED WITH line, among that premise's first eight (rulings 392, 393), with the meaning pressed against the link exhibited in layers. The layers may be given in place, or by a checked reference (section 4).

**A witness:** only a proven press is a witness. An unproven press is a bare claim. Leaving it unanswered costs the other side nothing (ruling 398).

**A proven answer:** an answer to a proven press that shows, with layers, how the witness's meaning fits the link. Restating the link's own footing while passing over the witness is not an answer (as today). The answer is held to ruling 397 like any claim.

**A forced link:** a link that cannot take a proven witness's meaning. It breaks (ruling 396). Scripture does not contradict itself, so the fault lies in the link, never in the witness. The words of no single verse decide it.

## 4. Proof by reference (ruling 399), and its fence

A press or an answer may write, for example, "proven in [DR2], Matthew 1:25" instead of repeating its layers.

The reference is checked in code. The named round must hold that verse, carrying at least two layer kinds, in a block that states the same meaning the press claims. A reference that does not check out is an unproven press.

The fence exists because the reference is itself a place to cheat: "proven in [DR2]" written when [DR2] holds no such layers. Checking it keeps ruling 399's own condition: the layers cannot be manipulated when used as prescribed.

What code can check and what it cannot:
- **Code can check:** the round exists; the verse is quoted there with its reference; at least two layer kinds appear in that block (the footing reader of fix set 8, R5).
- **Code cannot check:** that the referenced block states the same meaning. The judge checks that, and records it in its SILENCE line (posture v4, Part 3), so the check can be audited.

## 4b. Every layer is checked against the record

Ruling 397 makes the layers the language of the debate. A layer that cannot be checked becomes the next place for the trick. Today only [L1] is checked: the KJV citation check marks a misquoted verse NOT COUNTED. Under this design every layer kind is checked against the record, for debaters, judges and the synthesis alike.

**[L1] and [L3]: as today, extended.** Every quoted verse, whether footing or a cross-reference, is checked against the KJV table, and a quotation that does not match is NOT COUNTED. The check is extended to the synthesis, whose quotations are not checked today. Run 32306's synthesis wrote "how the Messiah's Davidic descent is evident" beside Hebrews 7:14, a verse that reads "For [it is] evident that our Lord sprang out of Juda".

**[L2]: new.**
1. **The [L2] sheet.** Before rounds 2 to 4, each debater is served, for every verse already cited, the original words of that verse from the original-words table: position, transliteration, Strong's number, and the lexicon gloss (lexicon_words.anchor_gloss). It is served the same way the KJV verse sheet is, and to both seats alike. The Oracle draws on the corpus and the plain seat does not, but both prove [L2] from the same record.
2. **The [L2] check.** An [L2] tag counts only when the word it names is in a verse the same block cites. The match is on its Strong's number, or on its transliteration with accents and the table's beta-code letters normalized (the table writes gennhqen for gennēthen). A word in no cited verse is NOT COUNTED, marked "[L2] not in the cited verse".
3. **The meaning.** Code cannot grade a meaning, so the gloss is printed beside each counted [L2] in the judges' copy. The judge weighs the stated meaning against the gloss as part of the proof, and supplies none of its own (ruling 396's fence).
4. **Example from the record.** Matthew 1:20 carries gennhqen (G1080, "to procreate (properly, of the father, but by extension of the mother) ... conceive") and paralabein (G3880, "to receive near, i.e. associate with oneself ... take (unto, with)"). A debater's [L2] on either is checkable. An [L2] on a word not in the verse is not.
5. **Limit stated.** The original-words table holds the 66 books only. An [L2] on an Apocrypha verse cannot be checked; it is marked UNVERIFIABLE and carries no weight as [L2]. The Apocrypha stays at [L1] (operational_doc §13).

**[L4]:** stands only on two checked lower layers. An [L2] marked NOT COUNTED does not count toward the two.

## 5. What changes, by part

| Part | Change |
|---|---|
| Debater prompts (D1-D4 Build, C1-C4 Build) | Every claim of meaning carries its layers. Every press under PRESSED WITH carries its layers, or a reference to the round that does. At most eight witnesses per premise. A bare claim carries no weight, and the judges are told so. |
| The Debate Oracle seat | Told plainly: "Prove every position with the layers. A statement of your position is not proof of it." |
| The pressed-witness ledger | Lists each press as PROVEN (layers in place), PROVEN BY REFERENCE (checked) or UNPROVEN. Unproven presses are shown, marked "not a witness (ruling 398)". |
| Ruling 372 counting (K-G1, K-G4, K-G6, K-G10, K-G11) | Counts only proven presses. An unproven press left unanswered does not make a premise UNEXHIBITED. |
| Judge rulebook (Panel Build, Build Independent Verdict) | Sentence (B), "A witness contradicts a link only when its own words state the contrary", is removed. Ruling 396 takes its place: a link that cannot take a proven witness's meaning is forced and breaks; the meaning weighed is the one the debaters exhibit. "No witness states in its own words" is never a ground, for either side. |
| Posture draft v4 | Commitment 3 ("each test in its place") is replaced by ruling 396's sentence. Commitment 5 counts proven presses only. The rest stands. |
| Checks | A new TRIAL check, K-P: a judge counts an unproven press as a witness, or grades BROKEN on one. K-C and K-S2 keep catching the single-verse ground everywhere, with no chain-against-chain scoping needed. |
| Verse sheet and citation check | The [L2] sheet is served beside the KJV verse sheet. The [L2] check joins the KJV check, and both read the debaters, the judges and the synthesis (section 4b). |
| Synthesis | It quotes only words the transcript or the KJV table holds, and it gives no verdict, doctrinal or otherwise (posture v4, Part 6). Its quotations are checked like everyone else's. |

## 6. What it costs

- **Longer rounds.** Every press carries layers or a reference. Ruling 399 accepts the length ("there's no other way"). The eight-witness cap bounds it.
- **Fewer witnesses counted** in the early runs, while debaters learn the form. Many presses in the stored runs would read as unproven.
- **More code:** the reference checker, the proven/unproven ledger, K-P, the [L2] sheet and the [L2] check.
- **Longer prompts:** the [L2] sheet adds one row per original word of every cited verse. A round citing 40 verses carries roughly 40 times 20 rows. The sheet may need to list only the words a side has already tagged [L2], plus the words of the verses pressed under PRESSED WITH.

## 7. Questions for the other seats

1. Is the definition of "a claim of meaning" too wide? Does it catch sentences that are only description, such as "Matthew 1:18 dates the finding"?
2. Should an unproven press be shown to the judges at all, marked "not a witness", or left out of their copy?
3. Is two layer kinds the right bar for a press, the same as for an [L4]? Or should a press need [L1] plus one more?
4. When the judge cannot confirm that a referenced block states the same meaning, should the press fall (strict), or stand with a note (lenient)?
5. Should the [L2] sheet carry every original word of every cited verse, or only the words a side has tagged and the words of pressed verses (section 6, cost)?
6. Should a judge's own [L2] (allowed under posture commitment 2 when it shows two layers) be held to the same check, with a NOT COUNTED [L2] voiding the judge's ground?
7. Fix set 8 is built but not live. Should this change join fix set 8 before the live write, or follow it as fix set 9? Joining saves one live cycle, but adds risk to a package already at 42 code nodes plus 9 new ones.

## 8. Test plan once returned

1. **Unit fixtures** from runs 32306, 32302 and 32293: classify every press as proven, proven by reference or unproven, and hand-check the classifier on one run before trusting it.
2. **[L2] check fixtures:** every [L2] tag in runs 32306 and 32302 matched against the original-words table. Report how many count, how many name a word in no cited verse, and how many fall on Apocrypha verses.
3. **Measurement on stored runs:** for 32284, 32293, 32302 and 32306, how many presses are proven, and which counts and outcomes would move. The stored debaters were never told this rule, so the numbers measure the gap, not the rule.
4. **Dry regrade of 32306** with the new judge rulebook and nothing else changed, compared field by field with the stored judgments.
5. **One live run** after the write, read whole, to see whether the debaters prove their presses when told to.
6. Results reported before anything is written live.

---

## Feedback: Worker_E (seat 3, session_014Qy67bHv8uBmRXbWGSrghm), 2026-11-02, 9:56 PM CST

The direction follows rulings 396 to 399, and it settles a conflict I raised on the posture draft. With judge sentence (B) removed, there are no longer two tests to choose between, and K-C needs no chain-against-chain scoping. Below are the points that need work. Each claim names what I read:
- md_notes_rulings 395 to 399;
- the original-words and lexicon tables;
- the live flow cfcbb37b;
- prototypes/judge_fix8 and JUDGE_POSTURE_DRAFT_v4.md, on branch claude/truth-app-onboarding-cfwndu.

### A. The [L2] gloss must not go to the judges

1. **Printing the lexicon gloss in the judges' copy puts the record into the judges' prompt.** Section 4b item 3 has the judge "weigh the stated meaning against the gloss". The gloss is the record's Strong's entry, not material either debater presented. On this topic the glosses lean. The live lexicon rows read:
   - G1080 (gennaō): "to procreate (properly, of the father, but by extension of the mother)";
   - G4905 (synerchomai): "to convene ... or (specially), cohabit (conjugally)".

   A judge weighing a debater's meaning against those words is grading by a source the system chose. That runs against ruling 383 ("the judges grade the text (evidence present to them) alone") and ruling 382 ("we can not impose our corpus on the judges"). It also cuts against ruling 396's fence, under which the judge "supplies none of its own".
   **Recommendation:** serve the [L2] sheet, gloss included, to both debaters alike, as drafted. Give the judges only the check's result for each [L2] tag (COUNTED, NOT COUNTED "not in the cited verse", or UNVERIFIABLE), and a gloss only where a debater quoted it in its own round.

### B. The [L2] check as drafted will miss most tags

2. **Debaters name the dictionary form; the table holds the form in the verse.** The original-words table stores the inflected word of each verse in beta code. At Matthew 1:20 it holds "gennhqen" (G1080) and "paralabein" (G3880). The lexicon stores the dictionary form with accents ("gennáō", "episkiázō", "synérchomai"). Debaters in the stored runs mostly write the dictionary form ("gennaō", "episkiazō", "synerchomai") and rarely a Strong's number. A transliteration match on the verse's word therefore fails on most correct tags, and the check would mark sound [L2] NOT COUNTED.
   **Recommendation:**
   - Match the debater's word to the lexicon's dictionary form (accents and the beta-code letters normalized: q for theta, h for eta, w for omega, v for final sigma).
   - Take that row's Strong's number, and count the tag when that number occurs in a verse the block cites.
   - Accept the inflected form only as a second route.
   - Build a fixture from every [L2] tag in runs 32302 and 32306 (the draft's test item 2) before the check can mark anything NOT COUNTED.
3. **Hebrew words carry attached prefixes in the table.** The debater writes "ha-almah"; the table and the lexicon give "almah" (H5959). Strip prefix forms (the article, the conjunction, prepositions) before matching, or match on the Strong's number only.
4. **Row counts are [L2] claims too, and code can check them.** Debaters write "H5959, 7 rows" and "bethulah, 50 rows, 19 books". A count of occurrences is a query on the original-words table, so the check can recompute it and mark a wrong count. This is cheaper than checking a meaning, and the stored runs carry such counts on both sides.

### C. What the forced-link grade needs before it can be checked

5. **"A link that cannot take a proven witness's meaning ... breaks" needs a written form.** With sentence (B) gone, BROKEN rests on the judge's finding that a link cannot take a meaning. That is the place where a judge's own reading enters most easily.
   **Recommendation:** a forced-link line must quote three things:
   - the pressing side's exhibited meaning, with its layers;
   - the holding side's answer;
   - the layer of the answer that fails to show the fit.

   Code can then check that all three quotations stand in the rounds named. A forced-link line without them is returned for cure. This keeps ruling 396's fence ("supplies none of its own") checkable rather than promised.

### D. Proof by reference

6. **The judge has no line for the reference check.** Section 4 says the judge records whether a referenced block states the same meaning "in its SILENCE line (posture v4, Part 3)". Posture v4's SILENCE line holds only "each pressed witness you counted unanswered: verse, premise, rounds searched". A confirmation of a reference does not fit it.
   **Recommendation:** add one line form, `REFERENCE: <press> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- "<the referenced block's words>"`, so the judge's call can be audited the same way.
7. **"Block" needs one definition shared with the footing reader.** The reference check counts layer kinds "in that block". Rounds 1 and 2 have no fixed blocks: run 32302's challenger link round had no "LINK n:" block at all (judge_fix7 J5). Use fix set 8 R5's own block rule and state it in the rulebook, so the code and the judge read the same span.

### E. Answers to section 7

1. **Too wide:** yes. Limit "a claim of meaning" to the critical points ruling 399 names: a declared link, a listed premise, a press, an answer, and an [L4]. "Matthew 1:18 dates the finding" then needs layers when it answers a press, and not when it only describes.
2. **Show unproven presses?** Show them, marked "not a witness (ruling 398)". The judges and the reviewers can then see the classifier's call, and K-P has something to fire on.
3. **The bar for a press:** [L1] plus one other kind. The quoted verse is always the press; the claimed meaning beyond its words needs one more layer.
4. **Strict or lenient:** strict, with the judge's REFERENCE line (item 6) giving the reason.
5. **The [L2] sheet:** one row per distinct Strong's number in the cited verses (dictionary form, Strong's number, gloss), not per word position. Words repeat, and a deduplicated sheet is far smaller than 40 verses times 20 rows. Add the words of the verses pressed under PRESSED WITH.
6. **A judge's own [L2]:** yes, the same check. A NOT COUNTED [L2] in a judge's ground voids that ground.
7. **Fix set 8 or 9:** fix set 9, after fix set 8 is live and one run on it has been read whole. One variable per live change (operational_doc §27).

### F. Smaller points

8. **K-G10 and K-G11** (section 5, ruling 372 counting) exist in fix set 8 (prototypes/judge_fix8/lib/kg10.js, kg11.js). They are not in the live flow cfcbb37b. The table should mark them as fix set 8 items, so a reader of the live system does not look for them.
9. **Section 2 item 3 ("the judges filled the gap from training").** In run 32306, GLM's "no witness states in its own words" lines followed sentence (B), which the rulebook then held. This draft removes that sentence, which is the cause. I recommend saying so, rather than calling it a judge's training.
10. **Ruling 395** puts the swapped-sides test off until the bugs are worked through. Section 8 therefore has no test that separates a judge's position bias from its reading of the layers. The dry regrade of 32306 (item 4) is the right first measure. Its report should say this limit plainly.

---

## Feedback: Worker_G1 (seat 19, session_01M2TmBMZs8YsrdDbSzBTsip), 2026-11-02, 10:03 PM CST

I agree with Worker_E's sections A to F and do not repeat them. In particular, the lexicon gloss belongs to the debaters, not the judges (Worker_E item 1), and the [L2] match must go through the dictionary form and the Strong's number (items 2 and 3). The points below are additional.

I read:
- md_notes_rulings 392 to 399;
- lexicon_words (columns and three rows: G1080, G4905, H5959);
- the run 32306 transcript (whole, for my review of that run).

I did not read prototypes/judge_fix8 or the posture draft v4.

### A. The [L3] definition changes the burden, and it needs a ruling of its own

1. **As drafted, any second quoted verse is [L3].** Section 3 reads: "[L3]: a second verse from another place, quoted, that the block reads as a cross-reference to the first."
   - That settles the question run 32306 left open. There, the defender's link 5 block quoted Jeremiah 22:30, Matthew 1:12 and Luke 1:32, all tagged [L1]. Gemini spared it by calling Matthew 1:12 [L3]; GLM counted it as one layer kind.
   - Under this definition Gemini was right, and K-LB would not have fired.
2. **The consequence is that two quoted verses alone now meet the two-layer bar.** No Hebrew or Greek and no stated chain beyond "reads as a cross-reference" is needed, for an [L4], for a press (Worker_E's answer 3: [L1] plus one more), and for an answer. That may be the intended reading of Isaiah 28:10 (line upon line), but it lowers the bar from what K-LB enforces today.
3. **Recommendation:**
   - Put the [L3] definition to the operator as its own question.
   - State the answer in the rulebook beside the two-layer rule.
   - Change K-LB to match the same day, so code and judges count the same way.
   - If two verses are to suffice, the block must at least state the link between them in one sentence ("Matthew 1:12 places Joseph's line in Jechonias's seed"). Otherwise two unrelated quotations pass as a chain.

### B. Under this definition every stored press is unproven, so the measurement step measures the format

4. **No stored press is proven by this definition.**
   - The PRESSED WITH line today carries a reference and a quotation only, for example `Romans 1:3 "made of the seed of David according to the flesh"`. That is [L1] alone, and the meaning pressed is not stated at all.
   - So every stored press in every run is unproven, except where a reference to a proving round could be inferred, and no stored press carries one.
   - Test plan item 3 will therefore report close to zero proven presses, and the shift in counts is fixed by the format rather than by anything the debaters argued.
   - Recommendation: say this in item 3, and state the new PRESSED WITH form before the measurement.
5. **The PRESSED WITH line needs a written form for a proven press.** For example:

   `<reference> "<quote>" -- MEANS: <one sentence> -- [L2] <word> (<meaning>) | [L3] <reference> "<quote>" | PROVEN IN [<round>]`

   Then the ledger's PROVEN, PROVEN BY REFERENCE and UNPROVEN classes (section 5) are a parse, not a judgment. Without a form, the classifier has to decide what "the meaning pressed" is, and that is the judge's guess moved into code.

### C. Two scope gaps in "a claim of meaning"

6. **A charge in a premise list is not a claim of meaning.** The UNSUPPORTED-L4 PREMISES list asserts that the other side's inference has no footing. That is a claim about the opponent's block, and it cannot carry layers of its own. The witnesses under it can.
   - Recommendation: exempt the charge sentence by name, or a strict reader will void every premise as a bare claim.
   - This also bears on the VOID problem in run 32306, where ChatGPT voided 11 of 12 premises.
7. **Proof by reference: whose rounds?** Section 4's example is "proven in [DR2], Matthew 1:25", but it does not say whether a side may cite the other side's round.
   - Borrowing the opponent's exhibited layers is legitimate on the record: they are in the transcript.
   - But a side citing an opponent's block "for the same meaning" is the likeliest place for the meaning to be bent, since the opponent exhibited those layers for its own reading.
   - Recommendation: allow it, but require the REFERENCE line (Worker_E item 6) to quote the referenced block's stated meaning beside the press's.

### D. Count claims need a stated unit (an addition to Worker_E item 4)

8. **A recomputed count must name its unit, or a correct count will be marked wrong.**
   - Debaters count rows in different units. Stored runs have "7 rows," "50 rows, 19 books," and on another topic "40 tokens in 37 verses."
   - The original-words table follows one text base for each Testament (TR-Scrivener 1894 and Leningrad-TAHOT, operational_doc §13). A count taken from another concordance can differ and still be honest.
   - Recommendation: the check reports the record's count in verses and in tokens, and marks a debater's count "DIFFERS FROM THE RECORD (n verses, m tokens)", not "wrong". The debater prompts should require the unit.

### E. A record item to check before the [L2] sheet is served

9. **The almah gloss is unusually short.**
   - H5959, the most contested word in this topic, carries the gloss "young woman, maid, virgin".
   - Of the 7,992 Hebrew rows in lexicon_words, only 8 have a gloss under 40 characters, and H5959 is one of them.
   - updated_at equals created_at on all 14,197 rows. But nothing I read shows that column is maintained by a trigger, so it does not prove the row was never changed.
   - The standing rule is "quote lexicon whole, never trimmed." Before the sheet puts this gloss in front of both debaters, someone should check it against its source. I am not claiming it was trimmed; I am saying the record cannot show from here that it was not.

### F. Answers to section 7 where I differ from Worker_E or add to it

10. **Question 3 (the bar for a press):** [L1] plus one more, as Worker_E says. The "one more" must be an [L2] or an [L3] under a settled definition (item 3 above). A stated meaning sentence alone is not a layer.
11. **Question 4 (strict or lenient):** strict. Add that a reference to a round of the other side falls if the quoted meanings differ (item 7).
12. **Question 7 (fix set 8 or 9):** fix set 9, as Worker_E says. Also, the [L3] definition (item 3) should be ruled before fix set 8 goes live, because it changes how K-LB in fix set 8 counts.

### G. On section 2's account of the cause

13. **Worker_E item 9 is right, and it corrects my own earlier finding.**
    - In my review of run 32306 I described GLM's "no witness states in its own words" lines as the retired single-verse ground, applied by the judge.
    - The rulebook GLM received then held sentence (B): "A witness contradicts a link only when its own words state the contrary."
    - So GLM was following a rule it was given, not only its training. My finding should have named that sentence as the cause. This draft removes it, which is the fix.
