# Order on run 30091's findings: problems found and a solution for each

Prepared by Worker E for the operator, 31 October 2026, 01:44 CDT; verse texts added 01:49 CDT. Not posted to the board, by your instruction.

The order's changes went live at 00:41 CDT. The first live run (30188) was refused at its first round. Its re-run, run 30196 ("Did Christ have a biological father?"), finished at 01:35 CDT. I read all of it alone: all six rounds, the single judge, the synthesis, the three panel judgments, their cure calls, the stored citation check, and the transcript.

Stored result: **Defender prevails, HELD 3-0.** Result lines: DeepSeek "Defender wins", Gemini "Underdetermined", GLM "Defender wins". The single judge gave "Defender wins".

## Part 1. Problems found in run 30196

### 1. The defender won while arguing a reading the record's guards forbid

- **What happened.** The defender argued "Jesus had no human biological father". Drift Guard 8(a) forbids that reading, and it prevailed 3-0. The record holds the opposite reading: Sight 32, "Joseph knew Mary within the espousal". The challenger argued that reading. All three judges graded it CHALLENGER LINK BROKEN on Matthew 1:18 ("When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost") and Matthew 1:25 ("And knew her not till she had brought forth her firstborn son: and he called his name JESUS"). They read "knew her not till" as excluding any union before the birth. The record reads that verse as limiting the abstinence to the pregnancy. GLM's grade of D6 against C1 rests on Luke 1:35 ("The Holy Ghost shall come upon thee, and the power of the Highest shall overshadow thee: therefore also that holy thing which shall be born of thee shall be called the Son of God"), read as "leaving no room for a male begetter". That comes close to reading "of the Holy Ghost" as paternity, which Drift Guards 8 and 18 forbid.
- **Cause.** The judges are never shown the guards. That was decided earlier (ruling 61, row BB-7216). The judges therefore grade the standard reading by its own text and have no means of knowing the record forbids it.
- **Solution.** This is your call, because it changes the judging frame. I recommend serving the judges, for each run, the guards that the topic touches, under a heading that states the record's held reading, so that a win for a forbidden reading is flagged instead of stored silently. Until that is decided, a HELD result on a topic a guard governs should carry a note that the defender argued a guarded reading.

### 2. The synthesis checks only the challenger for drift

- **What happened.** The defender used the construct that Luke 3:23 ("being (as was supposed) the son of Joseph, which was [the son] of Heli") gives Mary's line through Heli. The text does not state that construct. Drift Guard 56 forbids resolving the genealogies by a construct the text does not state, and Drift Guard 8(a) forbids routing the flesh through Mary alone. In round 3 the defender narrowed it to "permits". The synthesis drift test is written for the challenger's seat only, so it never examined this.
- **Solution.** Run the same drift test on both seats in the synthesis step.

### 3. Six real verses were printed to the judges as "does not exist"

- **What happened.** The citation check told the judges that six references do not exist. All six are in the verse table, and the challenger quoted them correctly:
  - 1 Kings 8:19 (cited twice): "thy son that shall come forth out of thy loins, he shall build the house unto my name";
  - Jeremiah 22:24: "though Coniah the son of Jehoiakim king of Judah were the signet upon my right hand, yet would I pluck thee thence";
  - Haggai 1:1: "Zerubbabel the son of Shealtiel, governor of Judah";
  - Job 14:1: "Man [that is] born of a woman [is] of few days, and full of trouble";
  - Luke 1:13: "thy wife Elisabeth shall bear thee a son, and thou shalt call his name John".

  DeepSeek repeated the error, and the judges denied those links their verse footing.
- **This is not new.** Run 29609 had four such errors and run 29328 had one. Every case is in the challenger's round 3, on rounds with many citations.
- **Cause, suspected and not measured.** The verse fetch stops at a row limit, so a verse past the limit reads as missing.
- **Solution.** Measure the citation-check fetch on this run. Then page it or raise the limit. Never print "does not exist" unless a direct lookup in the verse table finds no such verse.

### 4. The judges read "NARROWED TO" answers three different ways

- **What happened.** Eight answers in the two link rounds used the new "NARROWED TO" form. DeepSeek counted the challenger's links 3 and 4 as conceded (stated). The single judge counted the defender's link 4 as conceded. Gemini and GLM judged the same answers as narrowings. One answer form produced three readings, and the concession counts moved with them.
- **Solution.** Add one sentence to the judges' counting rule: a NARROWED TO answer is never counted as conceded unless the limb it keeps has no exhibited footing.

### 5. The judges' void counts disagree widely

- **What happened.** For the same premises, the defender's void count was 6 at DeepSeek and 1 at the single judge, both on the same model. The audit flagged it.
- **This is not new.** It is the known void-tolerance problem (row WALL-1820).
- **Solution.** Keep it on that row's list. No change in this order.

### 6. The transcript is still missing two things

- **What happened.** The transcript omits the single judge's judgment and the diagnostic. Its reading guide still quotes the old void text.
- **This is not new.** Both predate this order.
- **Solution.** Add the single judge and the diagnostic to the transcript build, and update the guide's void text, in a later order.

### What worked in this run

- **Five-reader fix.** The extractor counted six LINK lines from a list that was out of order and used LINK labels only.
- **Served-label count.** The judges were told "CHALLENGER 1 of 27 (S-1578)", and Gemini and GLM used it.
- **Premise count.** The challenger's list ended "PREMISE COUNT: 6", and it matched the six premises the ledger gives against the defender.
- **Ledger.** Six premises against each side. Its one unnamed verse (Genesis 3:15, "between thy seed and her seed", challenger premise 6) is correct: the challenger's round 3 does not name it.
- **Counts.** The challenger's word counts are correct: bethulah has 50 verses in 19 books, and almah has 7.
- **Cure step.** DeepSeek and GLM each received one cure call, and both cured.

## Part 2. The refused run and the build problems

- **7. Run 30188 was refused.** MiMo's provider stopped the challenger's first call with its content filter. The flow saved the partial row and stopped, as designed. That makes five such refusals since 22 October, all MiMo. **Solution:** in a later order, retry a refused first call once automatically, and stop only if the retry is refused too.
- **8. Problems caught while building, all fixed before the publish:**
  - a fifth list reader the plan missed;
  - a judge sentence inserted in the wrong place;
  - a label counter that misread "Sight #N";
  - a comment that would have crashed the extractor.

  **Solution, in effect for the future:** find readers by searching the code; read each inserted sentence whole in each node; test counters on stored real rounds; run the whole step before any write.
- **9. Protocol breaches, all filed:**
  - I told you six times that the S4 change waited on your word, when it was the advisor's (row BB-8683);
  - I did not declare that a helper made the writes (row BB-8697);
  - two portions ran at once for a short time;
  - the first stop check came late.
- **10. Left open for a later order:**
  - the Greek and Hebrew word check;
  - a correction path for the one-verse mark;
  - an unflagged withdrawal of a link the defender never conceded.

## My recommendation

Decide problem 1 first, because it is the reason this run's result is wrong on the record's terms. Then fix problem 3, the false "does not exist" lines, before the next paid run. It is a fault in what the system tells the judges, and it has recurred in three runs.
