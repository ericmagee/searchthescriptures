# Run 32643: findings

Worker_A3, 2026-11-05. Not posted; no one contacted.
Run ODV1-32643-ypd6cswa (debate 5917f301), "Did Christ have a biological father?", saved 2026-11-04 07:23 CST. Defender: Claude Sonnet 5.5, plain. Challenger: Claude Opus 5.5, oracle. Panel: Gemini HELD ("DEFENDER WINS"), ChatGPT PARTIAL ("DEFENDER WINS"), Grok BROKEN ("CHALLENGER WINS"). Split 1-1-1; outcome UNGRADED — REVIEW.

**Read:** every round in full (claude_r1 6554, engine_r1 11929, claude_r2 12780, engine_r2 16752, engine_r3 19321, challenger_r3 12033, defender_r4 12725, challenger_r4 9896), synthesis 21884, review_notes 6279, the three judgments in full (31889, 27104, 24150), and the 13 enforcer rows. The whole read was delegated to a reader; the points below were then checked against the record directly. **Not read whole:** the plain MATCHES rows of citation_check, and independent_verdict_raw (the single judge, not part of the panel).

**Columns:** claude_r1, claude_r2, engine_r3 and defender_r4 are the defender. engine_r1, engine_r2, challenger_r3 and challenger_r4 are the challenger. Each round names its side in its first line.

## 1. The Mary fault from run 32510 returned, and the rules shielded it again

- **The defender built the Davidic flesh through Mary.**
  - Round 2 (claude_r2 ~9796): "So the fleshly seed of David that the child bears is Mary's."
  - Round 3 (engine_r3 ~10447): "So the seed of David is carried to the child by her." And at ~13450: "The origin is carried by Link 4's chain through Mary, with Joseph the legal heir."
- **In its close it gave up the ground but kept the link** (defender_r4).
  - At ~10321: "I do not claim Mary's line is stated. I claim only that no row requires Joseph as the begetter."
  - At ~9954: "I grant it requires descent."
  - D5 ("Christ had no biological human father") is KEPT on "D1 to D4 as narrowed".
- **The challenger's charge was exact** (engine_r2, premise 5): "This assumes Mary is of David's house, which no quoted row gives." Sight 6 holds the same: "Mary's tribe is never explicitly named in the KJV."
- **All three judges ruled the charge VOID.** They read "which no quoted row gives" as an added negation.
- **Fault:** the void rule cannot tell an inflated charge from a true statement that the record lacks a fact. The defender's link went uncounted on that alone.
- **Fix:** a charge that a quote assumes a fact no quoted row gives is checked against the rows, not voided as a negation. This is P3 of the 32510 review (prototypes/run32510/problems.md) appearing in the void rule.

## 2. Gemini's answer check passed the Mary route

- **The line:** "ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: 'the flesh is David's seed' -- ANSWER: 'The origin is carried by Link 4's chain through Mary, with Joseph the legal heir.' -- MEETS".
- Romans 1:3 reads "made of the seed of David according to the flesh". DG-8 (a) forbids "routing the flesh through Mary alone (her Davidic descent is not established, Sight 6)".
- **Fault:** the check confirms that the words are present, not that the answer's layers carry the meaning. This is 32510 P7.
- **Fix:** as in 32510 P7. The check quotes the answer's meaning and confirms that the answer's own layers carry it.

## 3. The defender narrowed every link at no cost

- **What it narrowed.** In round 3: LINK 1 (premise 1), LINK 2, LINK 3 and LINK 4. In the close: D3 and D4. D5 was KEPT on the narrowed links.
- **What no judge tested:** whether D5 still stands once the dropped limbs are gone. This is 32510 P4 and P6.
- **The counts differ:**
  - ChatGPT counted one narrowing (premise 4, the dropped "only") as a concession, against K-N.
  - Grok counted two.
  - Gemini counted none.
  - No majority gives conceded_links NULL.
- **Fix:** as in 32510 P4 and P6. A narrowed link is graded on the footing left after the narrowing. If it still needs the dropped limb, it is CONCEDED.

## 4. Grok alone graded the seed verses as the record holds them

- **The grades:** D4 vs C5 and D5 vs C5 are DEFENDER LINK BROKEN (FORCED).
- **The ground:** the defender's "No row requires Joseph" and "Nothing in them names Joseph" do not show a fit with 2 Samuel 7:12 ("which shall proceed out of thy bowels") or Acts 2:30 ("of the fruit of his loins, according to the flesh").
- **Its MISSES/FAILS:** 2 Samuel 7:12, Acts 2:30, Hebrews 7:10 and Hebrews 7:14 (defender), and Luke 1:13 (challenger).
- **A count fault:** K-G7 flagged D4 graded BROKEN with premise 5 uncounted. The cure added premise 4 instead ("premise 4 is now counted with premise 6"), and its JSON counted_premises_defender still reads [6]. The cure text and the stored count disagree.

## 5. The challenger's errors

1. **A false parity claim.** Against Luke 1:13 ("thy wife Elisabeth shall bear thee a son, and thou shalt call his name John"), it answered that the angel speaks "the same way" to Joseph, citing Matthew 1:21. Matthew 1:21 reads "And she shall bring forth a son, and thou shalt call his name JESUS". It has no "bear thee". Grok's MISSES is sound.
2. **An overstatement on Ezra 2:61-62.** It says the line was refused for being "reckoned through the wife's house". The text says only "they were not found."
3. **A miscount.** It counts the "seed of a woman" rows as four. Ruth 4:12 ("of the seed which the LORD shall give thee of this young woman") is another, and the reader names 1 Samuel 2:20 and Leviticus 12:2 as more. The defender granted the count unchecked.
4. **Glosses short of the lexicon.**
   - goneis is given as "parents, those who begat"; the lexicon reads "a parent".
   - almah in round 2 leaves out the lexicon's "virgin". Round 4 gives the full gloss.

## 6. ChatGPT penalised a correct answer

- **What it counted:** challenger premise 1 (C1, "Joseph knew Mary his wife within the espousal") as UNEXHIBITED. Its ground was that Matthew 1:19 was "not answered on the meaning pressed."
- **The answer it had:** challenger_r3 ~3458, "No verb of knowing stands in the verse. 'No husband who had known her would be' so minded is the defender's inference."
- **Why the answer was right:** the meaning pressed was itself the defender's inference. Counting C1 conceded on this ground also runs against DG-8, which holds the union within the espousal at L4.

## 7. The defender's glosses

- parthenos is given as "a maiden who has not known a man". The lexicon reads "a maiden; ... unmarried daughter: virgin".
- almah is given in round 1 as "a young woman of marriageable age". Round 2 corrects it to the lexicon wording.
- **Fix:** as in 32510, section 3, item 2. The gloss is served to both debaters, and an [L2] meaning goes no further than the gloss.

## 8. Smaller faults

- **Quotations:** 473 matched, 0 mismatched, 2 not checked (binding errors). The defender wrote "my father's business" (claude_r1 ~4616); the KJV reads "Father's".
- **The synthesis:**
  - It states "No verdict is offered here." Its appended confirmation block (~18850) sides with the record: "routes the seed through a descent the record does not establish".
  - It attributes "generations, but in each span" to the challenger's link round. The words are in engine_r2, and the join changes the punctuation ("generations. But").
  - It attributes "The Ezra rows are about the priesthood" to the defender's round 4. The sentence is in engine_r3.
  - It quotes DG-63 guard wording ("needs MORE proof than a positive claim, not less") that is in neither the transcript nor the KJV.
  - One S-E audit flag (5.5, ~18476) looks false. "Conceded: the verbs alone mean presence and power." is in engine_r3 at ~7001.
- **Why UNGRADED (an inference; the row does not name its trigger):** review_notes carries REVIEW flags.
  - AUDIT v18: the single judge stated 3 challenger concessions with no parsable item.
  - AUDIT v29: five close-round concessions not marked COUNTED.
  - AUDIT v23: three synthesis checks failed.
  - AUDIT v28: one synthesis-verdict flag.
  - All three seats are underdetermined on collisions.

## 9. Order of work

1. The void rule (section 1). It decided this run's keystone collision.
2. The meaning check (section 2) and the narrowed-link rule (section 3). These are the same fixes as 32510 P7, P4 and P6, still unbuilt.
3. Grok's count fault (section 4) and the K-N breach by ChatGPT (section 3). These are cure and count consistency.
4. Gloss serving (section 7) and the synthesis quotation checks (section 8).
