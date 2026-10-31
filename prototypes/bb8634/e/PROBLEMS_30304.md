# Run 30304 (BB-8746): isolated whole read by Worker_E

Run B body, execution 30304, row 5b80b464 (ODV1-30304-tz1mntnx). Defender claude (plain), challenger MiMo (oracle).
Outcome UNDERDETERMINED; panel HELD, 2-0, GLM not counted. Single judge HELD, DEFENDER WINS.
Read whole: six rounds, synthesis, single judge, three panel judgments, citation check, audit lines. Compared with runs 30196 and 30268.
Conclusion 76 item (6) as served: (6) In debate, put this to the opponent: "According to Hebrews 7:14, How is it evident that our Lord sprang out of Juda?  Given the law: Numbers 1:2, 18."

## The result the order measured

1. **The wrong-if did not fire.** The regex found 2 question forms in the challenger's round 1, and 0 in rounds 2 and 3. Both carry Numbers 1:2, 18 in the same sentence (the MEASURED item: yes, both times):
   - "Question to the defender: how is it "evident that our Lord sprang out of Juda," given Numbers 1:2, 18, if the flesh runs through a woman whose house the text never names?"
   - "By what reckoning is it "evident that our Lord sprang out of Juda" (Hebrews 7:14), given Numbers 1:2, 18 — if the flesh runs through a house the text never names?"
2. **Compared with 30268:** 0 questions there, 2 here, with the same served set except the item's wording. The new wording worked.
3. **The defender answered it head-on** (round 2, section 1, titled with the question). Its answer:
   - prodelon "states that the fact is open. It does not state the route";
   - there are "two routes": a legal route (Joseph names and takes) and a flesh route (Romans 1:3, Galatians 4:4);
   - Numbers 1:2, 18 are census rules and "do not state that tribal standing never passed through a woman": Jair (Numbers 32:41 with 1 Chronicles 2:21-22), Sheshan's daughter (1 Chronicles 2:34-35), Barzillai (Ezra 2:61).
4. **The question drew two concessions in round 3:**
   - "I drop any claim that a verse states Mary's Davidic lineage in so many words";
   - on the wife's-house register: "I concede that this does not by itself prove the case."

   The synthesis counted the defender's Davidic route as not held: "the seed rows it was pressed with stand with no row set against them."
5. **It did not change the outcome.** UNDERDETERMINED, as in 30268. The judges who broke the challenger broke it on C3 (Matthew 1:18, 1:25), not on the Juda question.

## Problems, each with a solution

### 1. The defender's answer to the question was only partly met

- **What happened.** The challenger answered Ezra 2:61 with Ezra 2:62 ("as polluted, put from the priesthood") and Jair with "Segub begat Jair." It never answered two things:
  - Sheshan's daughter (1 Chronicles 2:34-35);
  - the core move, that prodelon "states that the fact is open. It does not state the route."
- **Cause.** Sight 11 carries the answer to that move. Its summary reads: "Evident = prodelon (openly manifest, visible to all - not reported/claimed). Sprang = anateillo (to arise/spring up from a source...) = biological emergence language." Sight 11 was not served, as in 30268.
- **Solution.** Serve Sight 11 with item (6) in the next run. That changes the served set, so it needs his word.

### 2. The defender's dodge came back after the question

- **What happened.** In round 3 premise 1 the defender listed the seed rows, Numbers 1:2 and Hebrews 7:14, and wrote: "None of these names whose body carries the line."
- **Compared with 30268.** It is the same single-verse test as 30268's "They do not name which parent carried it." Asking the question did not retire the dodge. It moved it from round 2 to round 3.
- **Solution.** The same as problem 1. The challenger's round 3 has to answer it by chain, with Sight 11's anateillo ("biological emergence language") and Numbers 1:2, 18. No flow change.

### 3. The question was asked in round 1 only

- **What happened.** In round 2 the challenger answered the "two routes" reply as a statement ("The text will not split"). In round 3 it argued from Hebrews 7:14 again as a statement. It did not put the question again against the defender's answer.
- **Solution.** None for now. One run is not enough to say whether this is a fault. Watch it in the next run.

### 4. Seven real verses were printed to the judges as "does not exist", and one of the flags carried a grade

- **What happened.** The citation check marked Isaiah 8:18, Jeremiah 18:7-8 (round 2), and Job 14:1, Hebrews 7:5, 1 Corinthians 7:5, 1 Samuel 16:13, 2 Samuel 7:14 (round 3) "CITED VERSE DOES NOT EXIST". All seven are in kjv_verses (checked at my seat). GLM repeated every one of them.
- **New in this run.**
  - The single judge's cure note for D2 vs C3 says the challenger's answer "rests on 1 Corinthians 7:5, which the citation check reports as not found, so the witness stands unanswered and the line stays" BROKEN. The false flag carried a BROKEN grade.
  - The fault now reaches round 2 as well as round 3.
- **Compared.** This is the fifth run with it: 29328, 29609, 30196, 30268, 30304.
- **Solution.** Make the citation-fetch fix its own order now. Never print "does not exist" unless a direct lookup finds no such verse.

### 5. GLM's written cure was rejected as malformed, and no alternate was seated

- **What happened.**
  - GLM graded C3 BROKEN, then wrote a RETRACTED line on the cure call. The parser refused it ("malformed line") and recorded K-G4 UNCURED.
  - Qwen was tried as the alternate and not seated ("2 uncured item(s)").
  - Gemini made the same BROKEN grade and the same retraction. Gemini's was accepted.
- **Compared with 30268.** Again a seat that broke C3 was not counted. This time the seat had written the cure.
- **Solution.** The parser's acceptance test for a RETRACTED line, in a later flow order. It is the advisor's "SHORT line test rejects a written cure" item.

### 6. The same model gave different standings at two seats

- **What happened.** The DeepSeek seat and the single judge both ran deepseek-flash. The seat gave the challenger SELF-SUPPORTED, and the single judge gave PROP-DEPENDENT with four BROKEN lines. The audit flagged it.
- **Solution.** Keep it on WALL-1820's list. No change in this order.

### 7. The challenger's C3 broke again on Matthew 1:18 and 1:25

- **What happened.** Gemini (before its retraction), GLM and the single judge broke "Joseph knew Mary his wife within the espousal" on Matthew 1:18 and 1:25. The challenger's round 3 used Sight 32's "her coming into his house" line. The single judge called that "redefinition of 'come together' as taking into the house ... not shown from the text."
- **Compared with 30196.** The same break on the same two verses, now in two runs.
- **Solution.** No flow change. This is the doctrine Wall walk on Matthew 1:18-25, already waiting on his word.

### 8. Two challenger universals without a count, and Genesis 4:1 made into a rule

- **What happened.** The synthesis found the challenger clean on the guards. It named two thin points:
  - the universals "neither verb denotes begetting at any row" and "no row removes the father the text names";
  - Genesis 4:1 "as though the row governs every conception." The defender's reply ("does not say all conceptions are ordinary") was not answered.
- **Solution.** Corpus wording, in a later order: the held entries should carry the counts behind their universals.

### 9. Defender citation and fact errors

- **What happened.**
  - Defender round 2 wrote that Levi was born "of Leah and Jochebed." The challenger corrected it (Genesis 35:23; Exodus 6:20).
  - The check also caught the defender's Esther 2:7 wording and its round 3 "thy husband shall," given as Luke 1:35.
- **Solution.** None needed. The check and the challenger caught them.

## What worked

1. The new item (6) wording produced the question twice, each time with Numbers 1:2, 18.
2. The defender had to answer the question by name, and it gave up two limbs.
3. The synthesis guard test found the challenger clean. It also named the defender's conceded Davidic route as the debate's net movement.
4. The cure step worked for Gemini (retraction accepted) and for the single judge's two K-C lines.

## My recommendation

Serve Sight 11 with item (6) in the next run, so the challenger can meet "states the fact, not the route" with anateillo, the source word in "sprang." That is a served-set change and needs his word. Open the citation-fetch fix as its own order at the same time, since it now carries grades.

Worker_E, seat 3, session_014Qy67bHv8uBmRXbWGSrghm
