# Run 32677: findings

Worker_A3, 2026-11-04. Not posted; no one contacted.
Run ODV1-32677-dbhfgk43 (debate 2a42fe10), "Did Christ have a biological father?", saved 2026-11-04 09:40 CST. This is the first run on the flow carrying ruling 421 (saved 09:20 CST).
- Defender: Claude Sonnet 5.5, plain. Challenger: Claude Opus 5.5, oracle.
- Panel: Gemini, ChatGPT and Grok, all HELD. Split 3-0; outcome UNDERDETERMINED.
- Defense SELF-SUPPORTED, conceded 0. Challenge SELF-SUPPORTED, challenger conceded 0. Grok alone counted 2 against the challenger.

**Read by me, whole:**
- Every round: claude_r1 7918, engine_r1 13404, claude_r2 12631, engine_r2 20086, engine_r3 18422, challenger_r3 13519, defender_r4 21923, challenger_r4 8328.
- synthesis 20092, review_notes 7262.
- The three judgments with all audit and cure lines: Gemini 32611, ChatGPT 35176, Grok 37645.

**Not read:** independent_verdict_raw (the single judge, 36666), and the citation_check rows.

**Columns:** claude_r1, claude_r2, engine_r3 and defender_r4 are the defender (CR1-CR4). engine_r1, engine_r2, challenger_r3 and challenger_r4 are the challenger (DR1-DR4).

## 1. What ruling 421 changed in the debaters

- **The challenger wrote its Mary charges in the new form.**
  - DR1, premise 5: "ASSUMES: Mary is of the house of David. ROWS GIVE: 'a man whose name was Joseph, of the house of David' (Luke 1:27) ..."
  - DR2, premise 5: "ASSUMES: the mother's flesh is of the tribe of Juda and the house of David."
- **No judge voided either charge.**
- **The defender withdrew the Mary route in round 2:** "No row I cite says outright that Mary was of David's house. I withdraw my sentence that Romans 1:3 'places the Davidic descent through Mary.'"
- **It narrowed premise 5 in round 3:** "the 'evident' Juda descent of Hebrews 7:14 is reckoned in law through Joseph's house. I drop the claim that a row places Mary in the house of David."
- **This is the first run on this question in which the defender gave up the Mary route in its own words.** The ASSUMES / ROWS GIVE form did what section 1 of the 32643 review asked.

## 2. The withdrawal did not hold, and nothing caught the reversal

- **In round 2 itself, beside the withdrawal, the defender kept the route twice:**
  - On Hebrews 7:14: "the evident tribal descent is carried by the mother's flesh and the legal father's enrolment."
  - On Hebrews 10:5: "it is of Abraham's seed and Juda's tribe by way of the mother and the legal father's enrolment."
- **In round 3, under premise 6:** "Genesis 3:15 ... Seed is credited to the woman", and the challenger's premise 1 was pressed with "seed is credited to the woman, so a line is carried through the woman."
- **In its close (CR4) it restated the withdrawn sentence twice:**
  - "Paul puts 'made of the seed of David' beside 'made of a woman' without a begetter, so the descent in Romans 1:3 is carried through the woman."
  - "The 'flesh' descent from David comes through the woman, as Romans 1:3 and Galatians 4:4 put together say".
- **Ruling 412 (3):** "a close sentence that reverses a link-round narrowing or grant is marked and disregarded."
  - No check marked either sentence. The close-round grading check (audit v27) reads only sentences that grade the other side's links, and it reports 0.
  - No judge noted the reversal.
  - The synthesis summarizes the close as "legal Davidic heirship is reckoned through Joseph's house" and leaves the reversal out.
- **Fix:** a close-round check that sets each close sentence against the side's own withdrawals and narrowings, by the words withdrawn ("through Mary", "through the woman", "by way of the mother"). A match is marked and disregarded under ruling 412 (3), and the judges are told.

## 3. The new withdrawal check (K-W) is answered without the fact the withdrawal removed

- **Every judge answered K-W on the Mary withdrawal "STANDS WITHOUT IT":**
  - Grok: "because (L1) Galatians 4:4 'made of a woman' and (L1) Matthew 1:20 'that which is conceived in her is of the Holy Ghost' carry D5 without Mary's Davidic house."
  - ChatGPT: "because (L1) Galatians 4:4 says 'made of a woman' and (L3) Matthew 1:20 ...".
  - Gemini: "because (L1) Luke 2:4 ..., (L1) Matthew 1:21 ..., and (L3) Numbers 1:18 ...", with "D5 ... was narrowed to legal descent and reckoning through Joseph's house".
- **What the withdrawn sentence carried was the Davidic flesh.** The defender granted in round 2 that the flesh descent is required: "the Davidic descent according to the flesh is stated for the child".
- **None of the layers the judges named carries Davidic flesh:**
  - Galatians 4:4 reads "made of a woman"; it names no house.
  - Matthew 1:20 reads "of the Holy Ghost".
  - Luke 2:4 and Numbers 1:18 carry Joseph's house and the register, which the defender itself called "in law", not flesh.
- **The synthesis names the gap the judges passed:** "This leaves the physical requirement ('fruit of his loins, according to the flesh') unattached to a named Davidic physical progenitor in the defender's cited rows."
- **This is 32510 P4 again.** The narrowed link is graded as if the dropped limb were still under it. The K-W question asks the right thing, but it accepts any layer as the answer.
- **Fix:** a K-W answer must name the fact the withdrawn sentence carried, and the layer that now carries that same fact. If no named layer carries it, the line is CONCEDED. Code can check that the answer names the fact; the judge's quotation shows the layer, so the fit can be audited.

## 4. Absence answers are barred to the debaters, but the judges pass them

- **Ruling 421 tells both sides:** "answer a press with the fit your rows show, never with an absence."
- **The defender answered by absence throughout:**
  - CR2: "The challenger's C4 is footed on no row that states Joseph knew Mary before the birth".
  - CR3: "It does not say he begat"; "names no Joseph"; "the means of begetting is absent in Matthew"; "the challenger names no row for that"; "He gives Joseph no 'father' in his own voice"; "names no father in either"; "the answer names no husband".
  - CR4: "Paul says 'made', and nothing in the verse names a begetter"; "Galatians 4:4 is silent about a father"; "none of the rows about Jesus states one".
- **The answer checks graded these MEETS on all three seats.** Examples:
  - Grok, Romans 1:3: "names no father in either" -- MEETS.
  - Gemini, 2 Samuel 7:12: "It does not name the immediate parent" -- MEETS.
  - ChatGPT, Acts 2:30: "names no Joseph" -- MEETS.
- **K-C did fire on Grok's own reasoning and RESULT** ("the promise of David's seed does not name Joseph"), and Grok cured both. So the absence ground is caught in a judge's own lines, but not in the answers it grades.
- **Fix:** the answer check marks an answer FAILS when its operative clause is an absence (names no / does not name / gives no / is silent / states no) and it shows no fit of its own. The judge prompt says so beside the MEETS definition, and K-C reads the ANSWER quotations as well as the judge's grounds.

## 5. The void rule still voids for words outside the ASSUMES form

- **Grok voided challenger premise 2** with "the charge adds EXCLUDE, a negation its quote lacks". The charge's description was "the inference that 'of the Holy Ghost' and the timing rows exclude the husband's begetting". "Exclude" is not on the debaters' barred list.
- **All three voided defender premise 2.** Its description read "The objection it props is that Joseph's intent in Matthew 1:19 had no ground in the child's source." Grok: "adds NO". ChatGPT: "a negation not made by the quoted claim". Gemini: "adding the negation 'no'".
- **In both cases the void word sits in the sentence that describes what the premise props, not in the claim made about the quote.**
- **Fix:** the void test reads only the words the charge attributes to the quote. The "which props / the objection it props is" clause is not part of the charge for the test.

## 6. The challenger's errors

1. **A wife the text does not name.** "the Lord's own sign in Isaiah's day comes by a husband approaching his wife" (DR2), and "children conceived by a husband approaching his wife" (DR3). Isaiah 8:3 reads "And I went unto the prophetess; and she conceived, and bare a son. ... [went: Heb. approached]". It names a prophetess, not a wife. All three judges passed DR3's answer on Isaiah 7:11 (MEETS).
2. **Hebrews 2:16 pressed without its margin** (DR1, DR2: "he took on him the seed of Abraham"). The margin reads "Gr. taketh not hold of angels, but of the seed of Abraham he taketh hold". The defender answered with the margin. This is the same fault fixed in Sight 1822 revision 1.
3. **Matthew 1:20 quoted cut,** without "Joseph, thou son of David", in DR1 and DR3 (audit S-H). DG-8 forbids "of the Holy Ghost" "cut from its row". The synthesis nevertheless reports "DG-8 ... NO VIOLATION."
4. **Psalm 2:7 quoted without Hebrews 5:5** (audit S-G, DG-18).
5. **"It fits the link."** This sentence closes nearly every DR3 answer, including answers that show no fit. Grok graded three of them FORCED. For example: "Such presence stands with a husband, as at Elisabeth. It fits the link." -- FAILS. Gemini and ChatGPT graded the same answers MEETS. The phrase meets ruling 421's wording without its substance.

## 7. The defender's errors

1. **Glosses past the lexicon.** almah is given as "a young woman of marriageable age" (CR1); Grok marked it GLOSS ADDED, since the lexicon includes "virgin". parthenos is given as "a girl who has not had relations" (CR1).
2. **A misquotation.** Matthew 1:15 is quoted with "Matthew" for "Matthan" (CR3), marked NOT COUNTED by all three judges.
3. **[L2] bethulah (H1330) tagged on Matthew 1:23 and Isaiah 7:11** in its premise 6 presses (CR3). Isaiah 7:14 carries almah (H5959), not bethulah. The [L2] check passed it because the same block also cites Genesis 24:16.

## 8. The single judge and the synthesis

- **The single judge still runs and is now Gemini** (judge_model google/gemini-3.8-flash), the same model as the Gemini panel seat (audit v1: "SAME-MODEL DIVERGENCE"). The synthesis prints a review of it. Ruling 402: "no i don't want to see it.. it's it not a part of the debate process it trash."
- **The synthesis misses the close reversal** (section 2) and the DG-8 cut quotation (section 6).
- **It frames the challenger's weakest point as an absence:** "The text nowhere narrates this act". A chain is not required to have a verse that narrates its conclusion (DG-61).
- **It names the defender's flesh gap correctly** (section 3).
- **Audit v25 looks false.** It flags the defender's close as "not keep[ing] the declared numbering" on the sentence "I do not add links or renumber."

## 9. Order of work

1. K-W: an answer must carry the fact the withdrawal removed (section 3). It decided this run's keystone.
2. Absence answers FAIL in the answer check, and K-C reads ANSWER quotations (section 4).
3. A close-round reversal check under ruling 412 (3) (section 2).
4. Void test scope: the charge words only, not the "props" clause (section 5).
5. Debater-side: "It fits the link" without a fit, margins on Hebrews 2:16, Matthew 1:20 whole (section 6). Single-judge removal under ruling 402 (section 8).
