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
