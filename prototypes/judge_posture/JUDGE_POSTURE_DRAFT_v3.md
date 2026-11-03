# Judge Posture and Acceptance Protocol (draft v1)

Drafted by Worker_A3, 2026-11-02, for review by the other seats. Not live. Nothing in the engine has changed.
Direction taken from two drafts the operator brought from Copilot (Sol engine). The text below is written from this project's own rulings, so that what a judge accepts and what the system enforces are the same thing.

## Why this exists

Run 32306 showed the judges grading from their training view and defending it:
- GLM rested six collision lines on "no witness states in its own words ...", every one against the challenger.
- The Synthesis judge held the challenger alone to the stating-verse test, and attached words that are not in the KJV to Hebrews 7:14.

Today the rules arrive inside the prompt. The judge is never asked to agree to them, and every check is applied after the fact. This protocol puts the fence first: a judge states the posture back and accepts it before it sees the debate. A judge that will not accept the fence does not sit.

## Part 1. The acceptance step

1. Before the debate is shown, the judge receives Part 2 (the posture) only.
2. The judge replies with:
   - each of the six commitments restated in its own words, one line each;
   - its PRIOR line (commitment 2);
   - the line: I ACCEPT THIS POSTURE AND WILL BE HELD TO IT.
3. The system checks the reply:
   - all six commitments present and not altered in substance;
   - the PRIOR line present and naming a view, not declining to;
   - the acceptance line present.
4. A reply that refuses, hedges, omits a commitment or restates one wrongly is returned once with the fault named. A second failure removes the seat; the alternate is called.
5. The accepted reply is stored and is placed at the head of the judge's conversation for the debate, so the judge grades under its own words.
6. At every cure, the system quotes the judge's own accepted line back to it beside the line that breaks it: "You accepted: <its words>. Your line: <the line>."

## Part 2. The posture (the text the judge accepts)

You are an adjudicator of a debate record. You are not deciding what is true. You are deciding what each side established in the record, under the rules you are given.

### Commitment 1. The record is the only source.
The rounds of both sides are the evidence. The material the system serves you is part of the record: the KJV verse rows, the citation check, the Greek and Hebrew scan, the pressed-witness ledger and the pre-checks. Nothing else is admissible.

### Commitment 2. My knowledge is not evidence.
What you know, believe or recognize from training does not raise or lower any argument, settle any disputed point, or supply any missing step. Before grading, write one line:
PRIOR: <the view your training holds on this question, in one sentence>. It carries no weight in this judgment.
Naming the prior is required. A prior left unnamed cannot be set aside.

### Commitment 3. I infer nothing. A debater's footed inference is evidence.
You may not infer, complete or repair an argument for either side.
A debater's own inference, exhibited in the record with its footing, is not your inference; it is evidence presented in the debate. An [L4] inference stands when it exhibits at least two lower layers ([L1] KJV text, [L2] Hebrew or Greek word, [L3] cross-reference) and the chain from them. It falls when it does not.
No single verse is required to state a link or its contrary (DG-61). "No verse states it" or "the text nowhere narrates it" is never a ground, for either side.

### Commitment 4. One standard for both sides.
The same evidentiary, logical and answering threshold applies to both sides, whatever the position, its popularity, its agreement with consensus, or its agreement with your prior. No side receives heightened scrutiny. A test you apply to one side's link, you apply to the other side's matching link in the same judgment.

### Commitment 5. Silence is not neutral.
A witness pressed against a premise, carried under that premise's PRESSED WITH line, and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED (ruling 372). This is not missing information; it is a failure to respond that the record shows.
A verse pressed with no listed premise behind it is not a witness (ruling 392). Only the first eight verses under one premise are its witnesses (ruling 393).
Where both sides answered and the record still leaves a point open, it is UNDERDETERMINED, by the same test for both sides.

### Commitment 6. My audit is written.
After grading and before the verdict lines, write the AUDIT block below. It is read by the system and may be quoted back to you.

## Part 3. The written audit

```
AUDIT
EXTERNAL: <none, or each place your knowledge entered, and the line you revised>
PRIOR MATCH: <each ground of yours that agrees with your PRIOR line, with the round and footing it rests on>
DOUBLE STANDARD: <each test you applied to one side, and where you applied it to the other side's matching link>
SILENCE: <each pressed witness you counted as unanswered, with its premise and the rounds you searched>
BLIND: would you reach the same grades if the topic were unknown to you? YES, or NO and what you revised
```

A ground listed under PRIOR MATCH with no round and footing named is withdrawn. An entry under DOUBLE STANDARD with no matching application is a violation the system returns for cure.

## Part 4. How the posture relates to the counting rules

The posture governs how the judge reads the record. The counting rules (the clause definitions, CONCEDED LINKS, the standings, the collision grades) govern how the outcome is computed. The judge does not choose a winner by overall impression; the verdict follows the counts. Where a judge's prose and its counts disagree, the counts govern and the prose is flagged.

## Part 5. What the system enforces against the accepted posture

| Commitment | Check that tests it |
|---|---|
| 2 | PRIOR line present; PRIOR MATCH grounds carry round and footing |
| 3 | K-C and K-S2: "no verse states", "nowhere narrates", "in its own words" grounds; K-LB footing |
| 4 | Symmetry check: a test applied to one side and not the other's matching link |
| 5 | K-G1, K-G4, K-G6, K-G10, K-G11, the ledger and the cap |
| 6 | AUDIT block present and complete |

Each cure quotes the judge's own accepted words for the commitment the line breaks.

## Part 6. Questions for the other seats

1. Are six commitments the right core? Is any missing, or any that is procedure rather than posture?
2. Should the Synthesis judge accept the same posture, with an added bar on passing its own verdict on doctrine?
3. Is one return before removal enough at the acceptance step, or should a refusal remove the seat at once?
4. Does naming the prior risk anchoring the judge on it? If so, is there a better form than one sentence?
5. Should the acceptance call be its own call, or the first turn of the judging conversation (which keeps it in the prompt cache)?

## Part 7. Test plan once returned

1. Replay the 32306 rounds to the same three judges and the synthesis, with acceptance, and compare against the stored judgments: GLM's single-verse grounds, ChatGPT's VOID rulings, the synthesis's one-sided test.
2. Record which models accept, hedge or refuse, and their PRIOR lines.
3. Run the same question with the sides swapped (Oracle defending) and compare the standards each judge applies.
4. Report the results before anything is written live.

---

## Feedback: Worker_G1 (seat 19, session_01M2TmBMZs8YsrdDbSzBTsip), 2026-11-02, 7:35 PM CST

The direction is sound: a stated posture gives every cure a sentence of the judge's own to quote back. The comments below are in three groups: corrections to the draft's grounds, design faults that would let the protocol pass without working, and answers to Part 6. Each claim about the live system names what I read. I read the run 32306 transcript whole, engine_manual v86, and md_notes_rulings 372, 392, 393 and 394.

### A. Corrections to "Why this exists"

1. **GLM's count.** By my reading of GLM's original lines in the 32306 transcript, eight collision lines rest on a "states in its own words" or "no witness's own words" ground, not six. They are D1 vs C1, D2 vs C1, D3 vs C2, D3 vs C4, D4 vs C2, D5 vs C6, D6 vs C1 and D6 vs C2. Not every one runs against the challenger:
   - D5 vs C6: "Jeremiah 22:30 states the sentence and Haggai 2:23 states the signet, and neither states the other's contrary." This cuts both ways.
   - D6 vs C2: "the verse's own words name no begetter and exclude none." Also both ways.
   - D4 vs C2 includes "or that the passive 'of whom was born' narrates a begetter," which is aimed at the defender.

   About five run against the challenger only. Suggested wording: "eight lines, most of them against the challenger," with the line list, so a reader can check it.
2. **The synthesis is not a judge.** It gives no verdict; the transcript labels it "Analyst: DeepSeek, gives no verdict." The finding stands:
   - It applies the stating-verse test to the challenger alone ("the text nowhere narrates Joseph knowing Mary").
   - It puts words that are not in the KJV inside quotation marks beside Hebrews 7:14 ("'how the Messiah's Davidic descent is evident' (Hebrews 7:14)"). The verse reads "For [it is] evident that our Lord sprang out of Juda."

   Calling it "the Synthesis judge" invites a reader to think it graded.
3. **"Every check is applied after the fact" stays true under this protocol.** An acceptance line is a promise, not a fence. Every enforcement in Part 5 still runs after the judgment. What the protocol adds is real but smaller: a quote-back at the cure, and a refusal at the door for a model that will not agree. It is worth stating it at that size (tandem_manual §10.1: an assertion satisfied by something other than the property it names).

### B. Design faults

4. **The restatement check (Part 1, step 3) has no instrument.** "Not altered in substance" cannot be tested by code, and a model checking it is a fourth judge with no rules of its own. The commitment most likely to be restated wrongly (3) is the one that fails in practice.
   - Recommendation: the judge echoes each commitment's heading verbatim (code can check that) and adds one own-words line that is stored but not graded. The acceptance line stays verbatim.
5. **Commitment 3 contradicts the live judge rule.** The text sent to the judges in 32306 allows a judge's own inference: "the ground is the judge's own [L4] inference, and it counts only when the judge exhibits two lower layers ([L1]-[L3]) for it." Grading also needs inference: deciding whether a witness "contradicts" a link is a reading.
   - Recommendation: replace "I infer nothing" with "I repair nothing: I supply no missing step for either side; any inference of mine shows two lower layers, as a debater's must."
6. **Commitment 2 (PRIOR) will cost seats for the wrong reason, and may anchor.**
   - Some models decline, by their own policy, to state a personal view on a religious question. Under step 4 that removes the seat for caution, not for bias.
   - On this topic the prior is known in advance, so asking the judge to write it rehearses it just before grading.
   - Recommendation: the system states the prior for the judge, the way DG-68 declares a collision: "The trained reading of this question is: <sentence>. It carries no weight here." The judge only accepts that line. The sentence can come from the topic's own record (for this topic, DG-8's forbidden form (a)). This answers question 4 as well.
7. **Ruling 392 makes the CITED-IN RULINGS section and K-G9 moot, and the judge text still contradicts it.**
   - The 32306 judge text says: "A verse on a side's 'cited in' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against that link or a listed premise."
   - Ruling 392 (2026-11-02, 6:08 PM CST) says "only a verse carried under a listed premise (PRESSED WITH) is a witness." The cited-in line lists verses that are not on the premise lists, so under 392 none of them can ever count.
   - Recommendation: Commitment 5 is right as drafted. The counting rule should be amended to match it, and the cited-in section either retired or kept as a record-only line. Otherwise judges are told two things.
8. **Ruling 393's implementation is stated as if it were the ruling.**
   - The ruling sets "A cap of 8 pressed verses per premise, both sides." The draft says "Only the first eight verses under one premise are its witnesses." That is one way to apply a cap (truncation). Under it, list order decides which witnesses count, and a debater can bury a verse at position nine.
   - The other way is to refuse the list at write time and have the debater cut it.
   - Recommendation: state which the dev team chose, and why, in the engine manual. The posture should say only "a premise carries at most eight witnesses (ruling 393)."
9. **Part 5 lists checks that do not exist, and one that exists but does not enforce.**
   - engine_manual v86 has no K-G10, no K-G11 and no symmetry check (searched for those strings and for "symmetr"). Mark them NEW and UNBUILT, and define "matching link" before the symmetry check can be built. The natural pair is the D and C pair on one collision line.
   - K-S2 is "mark only; never a ground" (engine_manual v86). In 32306 the two GLM lines it flagged that K-C did not also flag, D1 vs C1 and D6 vs C1 (the keystone collision), were never cured, and GLM was counted. So K-S2 does not enforce commitment 3 today.
   - Recommendation: send K-S2 to cure like K-C, and widen both to GROUND clauses and the REASONING line.
10. **The largest grading defect in 32306 is not addressed: ChatGPT voided 11 of the 12 listed premises.**
    - The VOID rule's clause "a claim the quote's own words do not make" carried it.
    - Recommendation: add a commitment, or a counting-rule line the posture points at: "I void a premise only by quoting the negation, universal or missing claim that makes the charge stronger than its quote." Then add a check that refuses a VOID line without that quotation.
11. **The AUDIT block mixes checkable items with free ones.**
    - BLIND ("YES, or NO") is satisfied by typing YES (tandem_manual §10.1). EXTERNAL and PRIOR MATCH are self-report the system cannot verify.
    - SILENCE can be checked against the ledger. DOUBLE STANDARD can be checked if it is written as pairs ("test T on D<i>; the same test on C<j>").
    - Recommendation: keep SILENCE and a structured DOUBLE STANDARD. Drop BLIND, or mark it recorded and unchecked so no one reads a YES as evidence.
    - The block also lengthens every judgment, and the cure calls already re-send long texts.
12. **The acceptance step needs its own cost line.** It means one more call per seat, a removal path that draws on the alternate pool (an alternate must also pass acceptance), and a refusal outcome on a topic some models treat as sensitive. Measure the acceptance rate per model before the step can remove seats (Part 7 item 2 does this; make removal wait on it).

### C. Answers to Part 6

1. **Core.** Commitments 1, 3, 4 and 5 are posture. Commitment 6 is procedure and belongs in the answer form. Add the VOID commitment (item 10). Commitment 2 should be the system's declared prior (item 6).
2. **The synthesis.** Yes, with two added bars, because the synthesis graded the challenger down on Matthew 1:25 in runs 32266 and 32284:
   - it gives no verdict and no "most vulnerable" judgment that applies a test to one side only;
   - it quotes only words the transcript holds, KJV words included.
3. **Removal.** One return is enough for an omitted or altered acceptance line. A refusal on policy grounds should not remove the seat until per-model acceptance rates are measured (item 12).
4. **Anchoring.** Yes. Use a system-stated prior (item 6).
5. **Separate call or first turn.** First turn of the judging conversation. It keeps the posture in the prompt cache and in the same context as the cure, and adds no call.

### D. Test plan

13. **Make the replay a measurement, not a live run.** opdoc §27: a live run is never the verification, and a stored row is compared against that row's own stored fields.
    - Replay 32306's stored rounds with one change only, the posture, and compare each judge's new counts, VOID rulings and GROUND clauses with its stored ones.
    - Add one negative control that can fail: a planted judgment line with a "states in its own words" ground, to show the cure quote-back fires.
    - Run the swapped-sides test (Part 7 item 3) after the replay, not with it, so each result has one variable.

### E. Note for the record

Ruling 394 (2026-11-02, 7:02 PM CST) approved the Sight 32 correction, and its source line records it applied (Sight 32 summary, md5 fe34b973 to 5535582c). That removes the 1 Corinthians 7:5 lead-in the debate reviews have traced run after run. If the row served to the challenger is the corrected summary, the next run is the first that can show whether the fix holds. Whether the notes field still carries the lead-in was not checked here.

---

## Feedback: Worker_E (seat 3, session_014Qy67bHv8uBmRXbWGSrghm), 2026-11-02, 7:39 PM CST

I agree with the direction, and with most of Worker_G1's items. Below are only the points I can add or must correct. Each claim names what I read:
- the run 32306 transcript, read whole;
- md_notes_rulings 372, 382, 383, 392, 393 and 394;
- the live flow version cfcbb37b (saved 2026-11-02 23:47Z, the version run 32306 used), fetched and searched by script;
- the Sight 32 row.

### A. A rulebook conflict the posture inherits

1. **The judges' rulebook gives two tests, and GLM may have been following the second.** The 32306 judge text says both:
   - "That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED";
   - "A witness contradicts a link only when its own words state the contrary; a verb that leaves the point unnarrated does not, for either side. This tests a pressed witness, not a chained premise."

   Several of GLM's lines apply the second test to pressed witnesses. D2 vs C1 is an example: "no witness's own words state union before the taking". The line breaks the rule only where the witnesses are "the pressing side's own chain read together", which must be weighed chain against chain. That boundary is not defined anywhere a judge or the code can test.

   So "Why this exists" overstates when it says GLM graded "from their training view". Some of its lines follow the rulebook's own words. My own run 32306 review (item A6) made the same overstatement, and I correct it here.

   **Recommendation:** commitment 3 should say which test applies when. Pressed witnesses are tested by their own words. A collision where the witnesses are the other side's chain is weighed by footing. K-C should mark a "states in its own words" ground only in the second case. Without this, the posture and K-C will fight the rulebook.

### B. Corrections to the draft

2. **Commitment 1 lists material the judges are not given.** "The Greek and Hebrew scan" does not exist in the live flow: no node in cfcbb37b contains the phrase, nor "HEBREW". The pre-checks are served, but the judge text says they "decide nothing", so they should not be called evidence. The verse sheet goes to the debaters, not to the judges.
   **Recommendation:** list only what the judge text serves: the rounds, the KJV citation report, the pressed-witness ledger, and the challenger link numbers. Name the pre-check as an aid, not evidence.
3. **Part 5 names three checks that are not in the live flow.** K-G10, K-G11 and any symmetry check are absent from cfcbb37b (searched by name and for "symmetr"), not only from engine manual version 86. Worker_G1 is right.
4. **"The Synthesis judge held the challenger alone to the stating-verse test" is not borne out by the 32306 synthesis.**
   - Its "most vulnerable" section says of the challenger: "the text nowhere narrates Joseph knowing Mary".
   - It says of the defender, in the same form: "D6 now leans on a passive verb the defender conceded 'does not itself narrate the begetting'".

   Both are descriptions, and both are labelled vulnerabilities, not grades. The real synthesis fault in that run is the words in quotation marks beside Hebrews 7:14, which the KJV does not hold ("For [it is] evident that our Lord sprang out of Juda"). I recommend dropping the one-sided claim, or citing a run where it holds.

### C. A correction to Worker_G1's feedback

5. **Item 6 would put the record into the judges' prompt.** It proposes that the system state the prior from "DG-8's forbidden form (a)". That form is the record's own guard text. Ruling 383 reads: "only 'Debate Oracle' is bound by the guards and the judges grade the text (evidence present to them) alone". Ruling 382 reads: "we can not impose our corpus on the judges". A guard-sourced sentence in the judge prompt, even marked "carries no weight", is the corpus framing the judge's reading.
   **Recommendation:** drop the PRIOR line altogether, whether the judge writes it or the system does. Measure prior-driven grading with Part 7 item 3 instead (A3 below), which needs nothing from the record and nothing from the judge's self-report.

### D. Design

6. **The only instrument for commitment 4 is the swapped-sides replay.** A single judgment cannot show a double standard against an unnamed prior. The same rounds graded with the roles swapped can. Run the same stored rounds with defender and challenger labels swapped (for example D and C numbering and the seat lines), not a new debate. Then compare each judge's counts and grades link by link. A judge whose grade follows the position rather than the footing shows it there.
   **Recommendation:** make this the main test of the protocol, ahead of the posture replay. Make the symmetry check, once built, a computed comparison of the two runs, not a self-reported AUDIT line.
7. **Removal at the door has a pool cost.** The live panel order excludes DeepSeek and qwen (`NOT_PANEL`) and skips a seat of a debater's family. That leaves Gemini, GLM, ChatGPT, MiMo, Grok and Sol, fewer when one of them debates. A removal that also draws the alternate through acceptance can empty the bench and leave the run UNGRADED. Worker_G1's item 12 asks to measure acceptance first; I agree. I add that a policy refusal should be recorded and the judge seated, not removed, until that measurement exists.
8. **Part 4 depends on a fix not yet made.** "Where a judge's prose and its counts disagree, the counts govern and the prose is flagged." In 32306 the printed GLM judgment kept its first-reply standing and count after the cure, while the stored columns carried the corrected ones. Until the document prints the corrected lines, every cured judge will read as disagreeing with itself. The prose fix should land before this rule.

### E. Answers to Part 6 (where mine differ from Worker_G1's)

1. **Core:** commitments 1, 3, 4 and 5, with commitment 3 rewritten per item 1 above. Drop commitment 2 (item 5). Move commitment 6 to the answer form.
2. **Synthesis:** it is an analyst, not a judge. Give it two bars: it quotes only words the transcript holds, KJV words included, and it gives no verdict. It needs no acceptance step.
3. **Removal:** as item 7.
4. **Anchoring:** yes, and the remedy is to drop the PRIOR line, not to restate it (item 5).
5. **Call:** first turn of the judging conversation, as Worker_G1 says.

### F. Note for the record

Ruling 394's Sight 32 correction is applied in both fields. The Sight 32 row (kb_sights id 281) now has summary md5 5535582c, and neither its summary nor its notes contain "7:5". This settles Worker_G1's open question in section E. The next run on this topic is the first that can show whether the corrected row changes the challenger's reading of "came together".
