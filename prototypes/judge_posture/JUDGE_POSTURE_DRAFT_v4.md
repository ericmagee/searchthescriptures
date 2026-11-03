# Judge Posture and Acceptance Protocol (draft v4)

Worker_A3, 2026-11-02. Not live. Nothing in the engine has changed.
v4 folds in the feedback of Worker_G1 (7:35 PM CST) and Worker_E (7:39 PM CST) on v1, carried in the operator's v3 file (prototypes/judge_posture/JUDGE_POSTURE_DRAFT_v3.md). Where the two disagreed, the choice and its reason are stated in Part 8.

## Why this exists (corrected)

In run 32306, GLM rested eight collision lines on a "states in its own words" ground (D1 vs C1, D2 vs C1, D3 vs C2, D3 vs C4, D4 vs C2, D5 vs C6, D6 vs C1, D6 vs C2). About five run against the challenger only; D5 vs C6 and D6 vs C2 cut both ways, and D4 vs C2 is partly aimed at the defender. Part of this is the rulebook's own fault: it gives two tests (a pressed witness is tested by its own words; a chain is weighed by footing) and never says where one ends and the other begins (Worker_E A1).
The synthesis is an analyst and gives no verdict. Its fault in 32306 is words in quotation marks beside Hebrews 7:14 that the KJV does not hold. v1's claim that it held the challenger alone to the stating-verse test is withdrawn: it described both sides' vulnerabilities in the same form (Worker_E B4).

What this protocol adds, at its true size: a refusal at the door for a model that will not agree to the fence, and a sentence of the judge's own to quote back at every cure. Enforcement still runs after the judgment (Worker_G1 A3). The instrument that tests for a double standard is the swapped-sides replay in Part 7, not the judge's self-report.

## Part 1. The acceptance step

1. Acceptance is the first turn of the judging conversation. It adds no call and stays in the prompt cache with the cure turns.
2. The judge receives Part 2 only, and replies with:
   - each commitment's heading, copied verbatim, each followed by one line in its own words;
   - the line: I ACCEPT THIS POSTURE AND WILL BE HELD TO IT.
3. Code checks the verbatim headings and the acceptance line. The own-words lines are stored and quoted back at cures, but not graded.
4. A reply that omits or alters a heading or the acceptance line is returned once with the fault named. A second failure is recorded.
5. A refusal on the model's own policy grounds is recorded, and the seat still sits. No seat is removed at the door until acceptance rates per model are measured (Part 7, step 2), because a removal also draws on the alternate pool and can leave a run UNGRADED.
6. At every cure, the system quotes the judge's own accepted line for the commitment the flagged line breaks: "You accepted: <its words>. Your line: <the line>."

## Part 2. The posture (the text the judge accepts)

You are an adjudicator of a debate record. You are not deciding what is true. You are deciding what each side established in the record, under the rules you are given.

### Commitment 1. The record is the only evidence.
The evidence is the rounds of both sides. The system also serves you the KJV citation report, the pressed-witness ledger and the challenger link numbers; these report on the rounds and are part of the record. The pre-checks are aids that decide nothing. Your own knowledge, from training or anywhere else, is not evidence: it does not raise or lower any argument, settle any disputed point, or supply any missing step.

### Commitment 2. I repair nothing.
You supply no missing step for either side. A debater's inference, exhibited in the record with its footing, is evidence: an [L4] stands when it exhibits at least two lower layers ([L1] KJV text, [L2] Hebrew or Greek word, [L3] cross-reference) and the chain from them, and falls when it does not. Any inference of your own shows two lower layers, as a debater's must.

### Commitment 3. Each test in its place.
A pressed witness contradicts a link only when its own words state the contrary.
A collision where the witnesses pressed against a link are the other side's own chain read together is weighed chain against chain, by footing. There, "no verse states it", "the text nowhere narrates it" or "no witness's own words state it" is never a ground, for either side (DG-61).

### Commitment 4. One standard for both sides.
The same evidentiary, logical and answering threshold applies to both sides, whatever the position, its popularity, or its agreement with consensus. No side receives heightened scrutiny. A test you apply to one side's link you apply to the other side's link on the same collision line.

### Commitment 5. Silence is not neutral.
A witness carried under a listed premise's PRESSED WITH line, and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED (ruling 372). It is not missing information; it is a failure to respond that the record shows. A verse pressed with no listed premise behind it is not a witness (ruling 392). A premise carries at most eight witnesses (ruling 393).
Where both sides answered and the record still leaves a point open, it is UNDERDETERMINED, by the same test for both sides.

### Commitment 6. I void only by quoting.
You rule a listed premise VOID only by quoting the words of its charge that go beyond its quote, and naming the kind: a negation, a universal, or a claim the quote's own words do not make. Paraphrase, reordering and dropped words are not stronger.

## Part 3. The answer form (procedure, not posture)

Each judgment carries two checkable lines blocks, after the collision points:

```
SILENCE: <each pressed witness you counted unanswered: verse, premise, rounds searched>
SAME TEST: <each test you applied on a collision line: "test T on D<i>; on C<j>: <result>">
```

SILENCE is checked against the ledger. SAME TEST is checked for a test applied to one link of a collision line and not to the other. EXTERNAL, PRIOR MATCH and BLIND (v1) are dropped: they are self-report that a judge satisfies by typing (Worker_G1 B11).

## Part 4. Posture and counting rules

The posture governs how the judge reads the record. The counting rules govern how the outcome is computed; the verdict follows the counts. Where a judge's printed prose and its counts disagree after a cure, the corrected lines are printed in place of the originals (fix set 8, R4), and only then is a remaining disagreement flagged.

## Part 5. Checks against the accepted posture

| Commitment | Check | State |
|---|---|---|
| 1 | K-LXX (Septuagint footing a judge missed) | built, fix set 8 (offline), TRIAL |
| 2 | K-LB, footing read from the block | built, fix set 8 (offline), TRIAL |
| 3 | K-C and K-S2 on every GROUND clause and the reasoning line, K-S2 sent to cure; scoped to chain-against-chain collisions per commitment 3 | widened in fix set 8; scoping UNBUILT |
| 4 | SAME TEST check; swapped-sides replay | UNBUILT |
| 5 | K-G1, K-G4, K-G6, K-G10, K-G11, ledger, cap | K-G10, K-G11, cap built in fix set 8 (offline), TRIAL |
| 6 | K-V with the universal pre-check | built, fix set 8 (offline), TRIAL |

None of fix set 8 is live. The live flow is cfcbb37b.

## Part 6. The synthesis

The synthesis is an analyst. It takes no acceptance step. It carries two bars: it quotes only words the transcript holds, KJV words included (checked by the citation check), and it gives no verdict, including no doctrinal verdict.

## Part 7. Test plan

Each test changes one thing, uses the stored rounds of run 32306 through the existing dry-regrade path (results to debate_replay_judgments, nothing overwritten), and is compared against the stored judgments field by field.

1. **Swapped sides (the main test).** The same rounds with the defender and challenger labels and numbering swapped. A judge whose grade follows the position, not the footing, shows it link by link. Needs a swap mode in the regrade path (UNBUILT).
2. **Acceptance rate.** The acceptance turn alone, per panel and alternate model. Records accept, hedge or refuse. No removal rule is set until this is read.
3. **Posture replay.** The same rounds, posture added, nothing else changed. Compare counts, VOID rulings and GROUND clauses.
4. **Negative control.** A planted judgment line with a "states in its own words" ground on a chain-against-chain collision; the cure quote-back must fire.
5. Results reported before anything is written live.

## Part 8. Choices made between the two reviews

1. **PRIOR line: dropped.** Worker_G1 proposed a system-stated prior drawn from DG-8. Worker_E showed that this puts the record's guard text into the judges' prompt, against rulings 382 ("we can not impose our corpus on the judges") and 383. The prior is measured by the swapped-sides replay instead.
2. **Inference: "I repair nothing"** (Worker_G1 B5), with the two-test boundary (Worker_E A1) as its own commitment.
3. **Cap: stated as the ruling.** The implementation (fix set 8 truncates to the first eight distinct verses, and lists the rest as over the cap) belongs in the engine manual, with the alternative of refusing the list at write time (Worker_G1 B8).
4. **Removal: recorded, not removed,** until rates are measured (both reviews).
