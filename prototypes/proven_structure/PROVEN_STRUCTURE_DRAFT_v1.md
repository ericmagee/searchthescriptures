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

## 6. What it costs

- **Longer rounds.** Every press carries layers or a reference. Ruling 399 accepts the length ("there's no other way"). The eight-witness cap bounds it.
- **Fewer witnesses counted** in the early runs, while debaters learn the form. Many presses in the stored runs would read as unproven.
- **More code:** the reference checker, the proven/unproven ledger, and K-P.

## 7. Questions for the other seats

1. Is the definition of "a claim of meaning" too wide? Does it catch sentences that are only description, such as "Matthew 1:18 dates the finding"?
2. Should an unproven press be shown to the judges at all, marked "not a witness", or left out of their copy?
3. Is two layer kinds the right bar for a press, the same as for an [L4]? Or should a press need [L1] plus one more?
4. When the judge cannot confirm that a referenced block states the same meaning, should the press fall (strict), or stand with a note (lenient)?
5. Fix set 8 is built but not live. Should this change join fix set 8 before the live write, or follow it as fix set 9? Joining saves one live cycle, but adds risk to a package already at 42 code nodes plus 9 new ones.

## 8. Test plan once returned

1. **Unit fixtures** from runs 32306, 32302 and 32293: classify every press as proven, proven by reference or unproven, and hand-check the classifier on one run before trusting it.
2. **Measurement on stored runs:** for 32284, 32293, 32302 and 32306, how many presses are proven, and which counts and outcomes would move. The stored debaters were never told this rule, so the numbers measure the gap, not the rule.
3. **Dry regrade of 32306** with the new judge rulebook and nothing else changed, compared field by field with the stored judgments.
4. **One live run** after the write, read whole, to see whether the debaters prove their presses when told to.
5. Results reported before anything is written live.
