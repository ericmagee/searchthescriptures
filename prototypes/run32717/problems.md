# Run 32717: findings

Worker_A3, 2026-11-04. Not posted; no one contacted.
Run ODV1-32717-j5nhhdh2 (debate 0e6de296), "Did Christ have a biological father?", saved 2026-11-04 13:14 CST.
- Defender: Claude Sonnet 5.5, plain. Challenger: Claude Opus 5.5, oracle.
- Panel:
  - Gemini HELD ("DEFENDER WINS"), removed under a debate rule; no alternate seated.
  - ChatGPT PARTIAL (RESULT UNDERDETERMINED).
  - Grok HELD ("DEFENDER WINS").
- Split "1-1 (1 not counted: debate rule)". Outcome UNGRADED — REVIEW.

**Read by me, whole:**
- Every round: claude_r1 8049, engine_r1 7789, claude_r2 11695, engine_r2 20154, engine_r3 19448, challenger_r3 15779, defender_r4 17976, challenger_r4 7972.
- synthesis 16157, review_notes 8829.
- The three judgments with all audit and cure lines: Gemini 35740, ChatGPT 39295, Grok 55513.

**Not read:** the single judge's text, and the citation_check rows.

**Columns:** claude_r1, claude_r2, engine_r3 and defender_r4 are the defender (CR1-CR4). engine_r1, engine_r2, challenger_r3 and challenger_r4 are the challenger (DR1-DR4).

## 1. All three judges counted the Mary route unexhibited, and the keystone still stood

- **The challenger charged the Mary route in the ruling 421 form** (DR2, premise 5): "ASSUMES: Mary is of the house of David -- ROWS GIVE: Joseph 'was of the house and lineage of David' (Luke 2:4); Mary's kin 'thy cousin Elisabeth' (Luke 1:36), 'of the daughters of Aaron' (Luke 1:5)." The defender's sentence it charges (CR2): "Flesh descent from David is therefore met by Mary."
- **All three judges counted premise 5 UNEXHIBITED:**
  - Gemini: "Premise 5: UNEXHIBITED -- STEP: LINK 5 -- ASSUMES: Mary is of the house of David".
  - ChatGPT: "premise 5 UNEXHIBITED: STEP: meet Davidic flesh descent through Mary".
  - Grok: "premise 5 UNEXHIBITED (kept words still assert David's flesh through Mary)".
  - ChatGPT and Grok both answered the K-W item on "I concede that no row states Mary's house" with CONCEDED. This is the first run on this question in which every judge counted the Mary route.
- **Every judge still graded the keystone D6 ("Jesus had no human biological father") STANDS.**
  - Grok: "One defender step, that Mary's flesh meets David's seed, assumes a house no row gives and is counted, but it is not a withdrawn or broken declared link." Its chain mark: "the unstated house of Mary is a side step, not the load-bearing conception link."
  - ChatGPT: "D6 vs C1 (Acts 2:30): UNDERDETERMINED -- Davidic flesh descent is agreed, but its route is disputed".
- **The defender's own words make the Mary route the only route it gives for the flesh.**
  - Its link round narrowed LINK 5 to "the flesh of the child came from Mary alone, so Romans 1:3 reads as met through her. I concede that no row states Mary's house."
  - Its close kept it: "Luke 1:35 says 'born of thee,' so the human flesh is her flesh. I rest on no verse that states Mary's house, and none is needed."
  - It granted the flesh is required: "Davidic flesh descent is agreed" (ChatGPT's own summary of the record).
- **The count reached the premise and stopped there.** The keystone needs the fact the counted premise lacks: Romans 1:3, "made of the seed of David according to the flesh." No judge carried the count up to the keystone.
- **This is 32510 P4 and P6 once more,** now in its plainest form: the premise is counted and the conclusion it carries is untouched.
- **Fix:** where a counted UNEXHIBITED premise carries a fact the keystone needs, the keystone collision is graded on whether any other exhibited layer carries that fact. If none does, the keystone is BROKEN-by-meaning, written as a FORCED line. Code can flag it: a keystone graded STANDS by a judge who counts, as UNEXHIBITED, a premise quoting the keystone's own footing verse (here Romans 1:3) is sent to cure.

## 2. The panel lost a seat, and the alternate path failed

- **Why Gemini was removed:** it graded D3 vs C2 CHALLENGER LINK BROKEN on "The canonical text explicitly excludes sexual relations prior to the birth." In the cure it retracted the grade. The rule now reads "a meaning break is cured only by a FORCED line, never by a retraction (ruling 421)", so K-G4 stayed UNCURED and the seat was removed.
- **What happened next:** "ALTERNATE TRIED -- SEAT: gemini; ALTERNATE: none; MODEL: none; RESULT: NOT SEATED; WHY: the removed seat's rulebook and transcript could not be read."
  - With two seats counted, the panel had no majority on the challenger's standing or counts. Hence UNGRADED.
  - This is an engine fault, not a judging one: the alternate could not be built from the removed seat's inputs.
- **Fix:** the alternate build reads the rulebook and transcript from the run's shared payload, not from the removed seat's call. Test it with a forced removal on a stored run before the next live run.

## 3. Absence answers still pass the answer check

- **The defender answered by absence in every round.**
  - CR3: "These verses say the seed comes of David's body. They do not name a begetter's act."
  - CR4: "Romans 1:3 gives the flesh as David's seed. It does not say through whom." And: "It does not say that a woman could not be the link." And: "None of them states a human begetting".
  - CR2: "The challenger has offered no verse that states Joseph as begetter." The challenger named this one a single-verse demand (DR2: "The defender demands a single stating verse"), as DG-61 has it.
- **All three judges graded the absence answers MEETS.** Examples:
  - Romans 1:3, "It does not say through whom." ChatGPT: "The answer accepts the flesh marker and disputes its route." Grok: "the link can agree the marker is a separate flesh-line verse." Gemini: MEETS.
  - Acts 2:30, "a woman's child comes out of them as surely as a man's. So the verse does not name Joseph as the begetter." All three MEETS.
- **This is the gap named in the 32677 findings (section 4).** It is unchanged.
- **Fix:** as before. An answer whose operative clause is an absence FAILS unless it exhibits a fit, and K-C reads ANSWER quotations.

## 4. Grok used an absence ground against the challenger

- **Grok graded the challenger's Romans 1:3 answer FAILS:** "Romans 1:3 names David, and the answer's 'the man the verses name is Joseph' is not in that verse."
- **The answer was a chain:** "Both verses put the seed in a man. The man the verses name is Joseph (John 6:42; Luke 2:48)." It cited its other rows. "Not in that verse" is the single-verse ground DG-61 bars from either side.
- **The same judge passed the defender's "It does not say through whom"** on the same verse. That is one standard for one side and another for the other (posture commitment 4).
- **Fix:** K-C reads FAILS and MISSES reasons as well as GROUND clauses, both sides alike.

## 5. The "only" voids were correct (finding withdrawn)

- **The three judges voided defender premises 4 and 5 for "ONLY", and the voids were right.**
  - The charges read "The inference that loins run only through fathers" and "The inference that the child's standing as Son of God is covenant and resurrection only".
  - "The inference that ..." states what the charge says the quote claims. The quotes ("The defender's own witness counts loins through fathers"; "The title is covenant and resurrection") carry no "only". The charge added it.
- **The first version of this section called these voids wrong.** It treated the "inference that" clause as a description outside the charge. That was a misreading of the charge, corrected after the operator's feedback (2026-11-04). The enforcer's contrary flag was wrong, and that is now fixed live.

## 6. The cure parser marked correct cures UNCURED

- **Grok's K-W and K-S3 cures are all marked UNCURED** with "the RESPONSE says neither STANDS WITHOUT IT ... nor CONCEDED".
- **Grok's JUDGE STATEMENT for each one gives exactly that form.** For example: "STANDS WITHOUT IT because (L1) Matthew 1:16 'of whom was born Jesus' and (L2) gennaō ..."; "CONCEDED: the kept claim that Romans 1:3 is met through Mary still assumes Mary's house". The form sits in the JUDGE STATEMENT field, and the parser reads only the STATEMENT field.
- **A false K-V mark on challenger premise 6.** The check read Grok's line "premise 6 UNEXHIBITED ... VOID, not counted: 4 (ONLY), 5 (ONLY)" as a VOID ruling on premise 6. Grok answered: "I did not void premise 6."
- **Fix:** the K-W and K-S3 parsers read the JUDGE STATEMENT field as well as STATEMENT. The K-V segmenter splits on the premise number at the start of each clause, so trailing VOID notes do not attach to the preceding premise.

## 7. The judges contradict themselves on premise 5 (B7 fired)

- **The new self-contradiction check (B7) caught this on Gemini and Grok:** premise 5 counted UNEXHIBITED while the same judge's ANSWER CHECK on Romans 1:3, Luke 2:4, Luke 1:36 and Luke 1:5 reads MEETS.
- **The worst case is Gemini.** It counts premise 5 UNEXHIBITED for assuming Mary's house, and then grades MEETS on the defender's Romans 1:3 answer "Luke 1:35 says 'born of thee,' so the human flesh is her flesh". That answer is the assumption itself.
- **B7 is a REVIEW flag and changes nothing.** It is the right detector for section 1. Wiring it to a cure that asks the judge to reconcile the keystone with the counted premise would close the gap.

## 8. The challenger's errors

1. **Matthew 1:20 quoted cut,** without "Joseph, thou son of David": DR2 twice and DR3 (audit S-H). DG-8 forbids "of the Holy Ghost" "cut from its row". The synthesis again reports "No violation of DG-8."
2. **A trimmed gloss.** nomizō is quoted as "properly, to do by law (usage), i.e. to accustom" (DR3). The lexicon continues "by extension, to deem or regard:-- suppose". Grok's FAILS on this answer is sound.
3. **"Coniah's grandson."** The challenger calls Zerubbabel "Coniah's grandson" through Haggai 2:23 ("Zerubbabel ... the son of Shealtiel") and 1 Chronicles 3:17 ("the sons of Jeconiah; Assir, Salathiel his son"). 1 Chronicles 3:19 reads "the sons of Pedaiah [were], Zerubbabel". DG-56 holds this divergence open ("Zerubbabel: Shealtiel/Pedaiah; Sight 560, OPEN"). The challenger states one register as fact. The synthesis reports "No violation of DG-56."
4. **Ezra 2:61-62 overstated again:** "a line carried by the wife's house was struck" (DR4). Ezra 2:62 says "they were not found: therefore were they, as polluted, put from the priesthood."
5. **Psalm 2:7 without Hebrews 5:5 and Hebrews 1:5** (audit S-G, DG-18).

## 9. The defender's errors

1. **almah glossed as "a young woman of marriageable age, unmarried"** (CR1). The lexicon reads "a lass (as veiled or private); damsel, maid, virgin." It was flagged GLOSS ADDED.
2. **Ezra 2:61 offered as "the precedent for counting through a wife's line"** (CR2). Ezra 2:62 records that line put from the priesthood. The defender dropped it in CR3.
3. **[L2] tags not counted:** CR1 "conceives, bears" and "overshadow, therefore"; CR4 G1453 egeirō, which is not in the cited verse.

## 10. The synthesis and the single judge

- **The synthesis names the defender's gap correctly** ("Defender's link D6 relies on Romans 1:3 ... arguing that this flesh descent was provided through Mary. However, defender formally conceded ..."). It reports no drift-guard violation, against its own audit flags S-H (DG-8) and S-G (DG-18).
- **It again frames the challenger's weakest point as an absence:** "no explicit L1 verse narrates an act of marital union" (DG-61).
- **The single judge (Gemini) still runs, and the synthesis prints a review of it** (ruling 402).
- **A false flag (audit v25):** the close-round numbering check flags the challenger's C4.

## 11. Order of work

1. Keystone propagation: a counted UNEXHIBITED premise that carries the keystone's needed fact reaches the keystone, with B7 wired to a cure (sections 1 and 7). It decided this run.
2. The alternate build after a seat removal (section 2). It made this run UNGRADED.
3. Absence answers FAIL, and K-C reads ANSWER and FAILS reasons on both sides (sections 3 and 4).
4. Cure parser fields and the K-V segmenter (section 6).
5. Debater and synthesis items (sections 8 to 10).
