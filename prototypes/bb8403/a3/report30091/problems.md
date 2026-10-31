# Live run 30091: problems found, and a solution for each

Worker_A3 (seat 25). Written 2026-10-30, 22:11 CDT. Nothing here has been posted to the board.

**The run.** The topic is "Did Christ have a biological father?". Claude defends the standard reading (no biological father); MiMo challenges with the record's reading (Joseph, Sight 32). It is the same request as run B (execution 30009). Run 30091 was fired at 21:30:28 CDT on the published flow with the pressed-verse change and stopped successfully at 22:02:27 CDT.

**Result.** Panel PARTIAL, 3-0 (DeepSeek, Gemini, GLM). The defender conceded 2 links; the challenger conceded none. The stored outcome is **DEFENDER PREVAILS, WEAKENED**. Run B's outcome was UNDERDETERMINED.

**What I read, whole:** both sides' three rounds, both closing lists, all three panel judgments, the single judge's second opinion, the review notes, the synthesis and its diagnostic. I also read the outcome function in the database and the list instructions in the flow. Verses below were pulled live from the King James table.

---

## What the change fixed

1. **Both closing lists now carry the pressed verses.** The challenger's list names, under PRESSED WITH, Hebrews 7:14 ("our Lord sprang out of Juda"), 2 Samuel 7:12 ("which shall proceed out of thy bowels") and John 1:45 ("the son of Joseph"). Run B left all three off.
2. **The defender now answers them by name.** Its link round has a "Pressed verses answered" list under every link.
3. **The defender conceded two links:**
   - Link 1: John 1:13, "not of blood, nor of the will of the flesh, nor of the will of man, but of God," does not exclude a man from the conception.
   - Link 4: Luke 3:23, "being (as was supposed) the son of Joseph," is not shown false by its verb, the same verb as Acts 16:13, "where prayer was wont to be made."

   In run B the defender conceded nothing.
4. **No judge read a carried verse as a charge or voided a premise for carrying one.** Finish condition 2 of the order is met.

---

## Problem 1. The stored outcome contradicts every judge

**What happened.** All three judges graded PARTIAL, and each wrote RESULT: UNDERDETERMINED, as their rulebook requires. The stored outcome is DEFENDER PREVAILS, WEAKENED.

**Why.**
- The outcome function (d5_outcome_for) maps PARTIAL straight to "DEFENDER PREVAILS, WEAKENED".
- The judges' rulebook (Panel Build) says only BROKEN gives CHALLENGER WINS and only a narrow HELD gives DEFENDER WINS: "Every other case gives UNDERDETERMINED".
- The extractor rejects a PARTIAL whose RESULT is anything but UNDERDETERMINED.
- The tie rule in derive_debate_outcome turns HELD into UNDERDETERMINED when most judges write UNDERDETERMINED, but it applies to HELD only.

**Effect.** A defender that loses two links (PARTIAL) is recorded as prevailing. A defender that loses none (run B, HELD) is recorded as UNDERDETERMINED. Losing links improves the defender's recorded outcome.

**Solution.** Make the stored outcome follow the judges' RESULT. Two ways, either of which closes it:
1. Change d5_outcome_for so PARTIAL gives UNDERDETERMINED. The weakness stays on record in panel_verdict (PARTIAL) and in the conceded-links counts.
2. Extend the tie rule in derive_debate_outcome from HELD to PARTIAL.

I recommend 1: one line in one function, and every PARTIAL by rule already carries RESULT: UNDERDETERMINED. Price: one database function change and a re-derivation of past PARTIAL rows, if you want history corrected.

---

## Problem 2. Conceding a link protects the defender from a broken link

**What happened.** The defender's Link 4 says Joseph is called father "only by supposition or custom." The challenger pressed four registers that call Joseph father:
- Mary: Luke 2:48, "thy father and I have sought thee sorrowing";
- the narrator: Luke 2:41, "Now his parents went to Jerusalem every year at the feast of the passover." The Greek is *hoi goneis autou*, "his parents" (G1118);
- the town: Luke 4:22, "Is not this Joseph's son?";
- a disciple: John 1:45, "the son of Joseph."

No defender round answers Luke 2:41. The defender conceded Link 4 instead.

**How it was graded.**
- All three panel judges marked Link 4 WITHDRAWN. A withdrawn link counts toward the PARTIAL clause, and PARTIAL needs only one.
- The single judge's second opinion graded the same link DEFENDER LINK BROKEN, because Luke 2:41 went unanswered. That gives the clause "BROKEN-1", whose result is CHALLENGER WINS.
- The synthesis's diagnostic checked that grade against the text and upheld it.

**Why it matters.** Under the rulebook, a link the defender defends and loses is broken, and the challenger prevails. A link the defender concedes is only withdrawn, and the challenger prevails on withdrawals only when more than half the chain is withdrawn or the conclusion link itself is withdrawn. So the defender scores better by conceding a link that cannot be defended than by defending it and losing. The record's reading lost the outcome at exactly this point.

**Solution.** Add one rule to the judges' rulebook (Panel Build and Build Independent Verdict): a withdrawn defender link that carries a witness pressed against it, which no defender round answers, is also graded at the collision as DEFENDER LINK BROKEN. It then counts toward the broken links as well as the withdrawn ones. The extractor's matching check gains the same rule.

This is a design change to the judging rule. It goes to the pair and the advisor first, then a live run on this topic. Price: two judge texts, one extractor check, one publish, one run.

---

## Problem 3. The record's own side argues in the forbidden form

**What happened.**
- The challenger, which argues the record's reading, opened round 1 with "Rebuttal: the chain asserts what no verse states" and "That sentence is not in the text."
- In its link round (Link 3) it wrote: "a denial of the man must be stated where the text excludes him, and no row does."
- The defender listed exactly this as its premise 3, "A denial requires a stated exclusion." The judges spared it.
- The diagnostic named it: "Silence used as evidence by the seat that denies silence is evidence."

**Why it matters.** DG-61 forbids demanding that one verse state a conclusion, and it binds both sides: "neither combatant may demand a single stating verse of the other." The record's case does not need the demand. The diagnostic names the challenger's strongest argument as the affirmative seed chain:
- 2 Samuel 7:12, "which shall proceed out of thy bowels";
- Acts 2:30, "of the fruit of his loins, according to the flesh";
- Romans 1:3, "made of the seed of David according to the flesh";
- with Joseph "of the house and lineage of David" (Luke 2:4).

**Solution.** In the challenger's frame (Init with Guards and the challenger round builders), state DG-61 as binding on the challenger's own case: argue from the affirmative rows, never demand a stated exclusion. The judges' rulebook gains the mirror check, so a challenger premise built on a stating-verse demand is graded as the defender's would be. Price: two sentences in the challenger frame, one in each judge text, one publish.

---

## Problem 4. The record's side cited none of the record

**What happened.** The challenger was served 27 record labels, among them Sight 1578, Sight 32 and Sights 1 to 4. Its three rounds cite none; the count is 0. Run B's read found the same (BB-8549 F3). Its arguments match Sight 1578's content row for row, including Luke 1:13 and 1:62-63, Luke 1:5 and 1:36, and the four registers, but it never names the record.

**Why it matters.** The record's held conclusion (Sight 32: "Joseph knew Mary his wife within the espousal") is argued as the model's own reading, with no record behind it, so the judges weigh it as one inference against another.

**Solution.** The challenger frame requires that each link round premise resting on a served row cite that row by its label. A check counts the labels cited. Price: one sentence and one check.

---

## Problem 5. The pressed-verse rule is only partly obeyed

**What happened.** The order's failure test (any verse pressed in a round and absent from the counted list of the side it was pressed against) fires on this run.
- **Challenger.** It pressed these in its rounds and left them off its list:
  - Luke 1:13, "thou shalt call his name John," and Luke 1:62-63, the father's naming, against Link 4;
  - Luke 1:5, "his wife was of the daughters of Aaron," and Luke 1:36, "thy cousin Elisabeth," against Link 5;
  - Matthew 17:5, "a bright cloud overshadowed them," against Link 1.
- **Defender.** It pressed Luke 1:60, "Not so; but he shall be called John," against the challenger's naming claim in round 2. The naming claim is not among the defender's six listed premises, so the verse had no line to sit on.

**Cause.** Partly model obedience, and partly structure: each list allows at most six premises. A verse pressed against a seventh claim has nowhere to go, and the instruction says "a pressed verse left off the list is not counted."

**Solution.** Do not leave the count to the debater's memory. Add a code check, with no model call, that compares every reference in a side's rounds against its list. It gives the judges the unlisted ones as "PRESSED, UNLISTED" beside their round, so a judge can still weigh an unanswered witness. The six-premise cap stays. Price: one code step in each judge node, one publish.

---

## Problem 6. One judge still uses the retired stating-verse ground

**What happened.** GLM's conclusion line says "no challenger witness states the union in its own words," and its line on Link 6 against the challenger's first premise rests on the same ground. The flow's own audits flagged both (K-S2, K-C). On the restatement prompt GLM restated the line, the cure was recorded as CURED, and GLM was counted. DeepSeek's and Gemini's result lines ("the text as argued does not settle the question") were not flagged.

**Why it matters.** The instrument caught it, so this is a recurrence, not a miss. In run B the same seat was removed for it, uncured.

**Solution.** No change to the cure mechanism. Record it as a recurrence at this seat (run B is the earlier occurrence; I have not counted others), and test the seat's judge text by harness. Price: a harness run, no publish.

---

## Problem 7. The challenger dropped the list numbering, and an extractor check misfired

**What happened.** The challenger wrote its premises as "LINK 1: ..." with no "1." in front. The instruction asks for a numbered list. The extractor counts only lines beginning with a number, so it reported "PREMISE COUNT 6 AGAINST THE CHALLENGERS OWN LIST OF 0." The panel counted six correctly.

**Cause.** Model format drift. Whether the longer list lines added by this order contributed is not measured.

**Solution.** The extractor also accepts a line beginning "LINK n:" or "LINK none:" as a list item. Price: one pattern in one code node.

---

## Problem 8. The second opinion missed both concessions

**What happened.** The single judge graded Link 1 UNDERDETERMINED although the defender conceded it, and counted no withdrawn links. The extractor flagged it ("WITHDRAWN MISSED D1"). That judge's BROKEN grade on Link 4 is the one the diagnostic upheld. The second opinion does not feed the outcome.

**Why it matters.** The one reading that reached the right point on Link 4 (Problem 2) got there partly by ignoring the concession rule.

**Solution.** None needed for the outcome. Problem 2's rule makes the panel and the second opinion agree on Link 4 for a stated reason.

---

## Problem 9. Citation errors on the record's side

**What happened.** The challenger quoted "the damsel... betrothed to an husband... a man... lie with her... his neighbour's wife" as Deuteronomy 22:24. The first words are verse 23: "If a damsel [that is] a virgin be betrothed unto an husband, and a man find her in the city, and lie with her." Only "his neighbour's wife" is verse 24. All three judges denied it first-layer footing.

**Solution.** The served record already cites "Deuteronomy 22:23-24". The citation check could suggest the right range when quoted words span two verses. Price: low, optional.

---

## Compared with run B

| | Run B (30009) | Run 30091 |
|---|---|---|
| Panel | HELD, 3-0 (one seat substituted) | PARTIAL, 3-0 (no substitution) |
| Defender conceded | 0 | 2 (Links 1 and 4) |
| Stored outcome | UNDERDETERMINED | DEFENDER PREVAILS, WEAKENED |
| Second opinion | HELD | BROKEN-1, CHALLENGER WINS |
| Served sights | 27 labels | the same 27 labels |
| Challenger's reading of Jeremiah 22:30 | "bounded in his days... in Judah" | no "in his days" bound (0 uses), consistent with the runner's 20:52 rewording |

The change did what it was built to do: the pressed verses were carried, answered and counted. The record's reading still lost the outcome, for two reasons that are not about the lists: the outcome map (Problem 1) and the concession shield (Problem 2). Problems 3 and 4 are why the record's side argued more weakly than its own record.

## Not checked by me

- Whether the record's reading wins under Problems 1 and 2 fixed: that needs a run.
- The defender's own guard audit: the synthesis audits the challenger only, by design.
- Exodus 40:35, Isaiah 7:11 and Genesis 24:16 and 24:43 in the defender's round 2. I did not trace by hand which challenger claim each was pressed against.
