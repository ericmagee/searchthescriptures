# Proven Structure: Every Critical Point Carried by the Layers (draft v2)

Worker_A3, 2026-11-02. Not live. Nothing in the engine has changed.
v2 folds in the reviews of Worker_E (9:56 PM CST) and Worker_G1 (10:03 PM CST) on v1, carried in prototypes/proven_structure/PROVEN_STRUCTURE_DRAFT_v1_1.md. Section 10 lists each review item and what v2 did with it. Two questions remain for the operator (section 9).

## 1. The rulings, as given

- **392:** "a press must have a premise behind it; a verse pressed without one isn't a witness"
- **393:** a cap of eight pressed verses per listed premise, both sides ("8 is approved.")
- **396:** "the Bible doesn't contradicts itself. so if a witness contradicts a link ... that witness doesn't fit into that link and you can't force it. the words doesn't matter.. only the meaning., which is why we drive with Isaiah 28:10". Confirmed with the fence: the judge weighs the meaning the debaters exhibit, with footing, and supplies none of its own.
- **397:** "every debate is built where the framework (the Layers) will be the default communication tools ... force all parties to communicate their positions with the framework... and restrict the torpedo'ing of single scripture. if a script is claimed to mean something.. that needs to proven ... debate Oracle has to be told to prove every position with the layers ... PROVE YOUR POSITIONS"
- **398:** a press carries its layers; only a proven press binds the other side under ruling 372.
- **399:** a press may carry its proof by reference to the round where the same layers were exhibited. "remove the potential and remove your problem ... force proven structure on all critical points of the debate. The four layers cannot be manipulated when used as prescribed."

## 2. The problem these rulings close

1. **Bare meaning claims.** The layer burden bound only the listed premises of the link round. Everywhere else a debater could state what a verse means.
2. **The torpedo.** A single verse pressed with a meaning never proven still bound the other side under ruling 372. Run 32306's challenger premise 2 carried 21 pressed verses.
3. **A rule that licensed the single-verse ground.** The judges' rulebook held sentence (B), "A witness contradicts a link only when its own words state the contrary." GLM's "no witness states in its own words" lines in run 32306 followed that sentence. The cause was the rule, not only the judge (Worker_E, Worker_G1). This design removes sentence (B).
4. **Unchecked quotations outside the rounds.** The synthesis in run 32306 wrote words beside Hebrews 7:14 that the KJV does not hold ("For [it is] evident that our Lord sprang out of Juda").

## 3. Definitions

**Layers.** One definition, written in the debater prompts and the judge rulebook, and used by the code:
- **[L1]:** a KJV verse, with its reference, in the words of the KJV row. A quotation may be part of a verse.
- **[L2]:** a named Hebrew or Greek word (dictionary form, transliteration or Strong's number), with its meaning.
- **[L3]:** a second verse from another place, quoted, read as a cross-reference to the first. **The test for [L3] is the operator's to rule (section 9, question 1).**
- **[L4]:** an inference. It stands only when it exhibits at least two lower layer kinds and the chain from them (DG-61).

**A block.** The span the footing reader of fix set 8 (R5) reads: a LINK or premise block where one exists; otherwise the paragraph that carries the claim. The same definition is stated in the judge rulebook, so code and judges read the same span.

**A critical point.** One of five: a declared link, a listed premise's supporting block, a press, an answer to a press, an [L4]. These are the places ruling 399 names. Description elsewhere ("Matthew 1:18 dates the finding") needs no layers unless it is one of the five.

**The charge sentence is exempt.** The sentence in a premise list that says the other side's inference lacks footing is a claim about the opponent's block. It cannot carry layers of its own. The witnesses under it carry them.

**A proven press.** A verse under a listed premise's PRESSED WITH line, among the premise's first eight (rulings 392, 393), written in this form:

    <reference> "<KJV quote>" -- MEANS: <one sentence> -- <[L2] word (meaning) | [L3] reference "quote"> | PROVEN IN [<round>]

[L1] is the quoted verse itself. The press needs [L1] plus at least one more layer kind, given in place or by a checked reference (section 4). Because the form is fixed, the ledger's PROVEN, PROVEN BY REFERENCE and UNPROVEN classes are a parse, not a judgment.

**A witness.** Only a proven press is a witness. An unproven press is a bare claim, and leaving it unanswered costs the other side nothing (ruling 398). It is still shown in the ledger and to the judges, marked "not a witness (ruling 398)".

**A proven answer.** An answer to a proven press that shows, with layers, how the witness's meaning fits the link. Restating the link's own footing while passing over the witness is not an answer.

**A forced link.** A link that cannot take a proven witness's meaning breaks (ruling 396). The line that grades it must quote three things, each from the round it names:
1. the pressing side's MEANS sentence and its layers;
2. the holding side's answer;
3. the layer of that answer that fails to show the fit.

Code checks that all three quotations stand in the rounds named. A forced-link line without them is returned for cure. This keeps ruling 396's fence ("supplies none of its own") checkable rather than promised.

## 4. Proof by reference (ruling 399), and its fence

A press or an answer may write "PROVEN IN [DR2]" instead of repeating its layers.

- **Code checks:** the round exists; the verse is quoted there with its reference; that block carries at least two layer kinds.
- **The judge checks the meaning,** in one line per reference:

      REFERENCE: <press> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- "<the referenced block's stated meaning>" / "<the press's MEANS sentence>"

- **Strict.** A NOT CONFIRMED reference makes the press unproven.
- **The other side's round may be cited.** Its layers are in the transcript. But the two quoted meanings must agree: a side cannot borrow the opponent's layers for a reading the opponent did not exhibit.

## 5. Every layer is checked against the record

**[L1] and [L3].** Every quoted verse is checked against the KJV table, as today. A quotation that does not match is NOT COUNTED. The check is extended to the synthesis.

**[L2] (new).**
1. **The [L2] sheet, to both debaters alike.** Before rounds 2 to 4: one row per distinct Strong's number in the verses already cited and the verses pressed under PRESSED WITH, carrying the dictionary form, the Strong's number and the lexicon gloss quoted whole.
2. **Not to the judges.** The judges receive only each [L2] tag's check result: COUNTED, NOT COUNTED ("not in the cited verse") or UNVERIFIABLE. A gloss reaches the judges only where a debater quoted it in its own round. The gloss is the record's text, not the debaters'. Serving it to the judges would grade by a source the system chose, against rulings 382 and 383 (Worker_E).
3. **The match.**
   - The debater's word is first matched to the lexicon's dictionary form, with accents and the beta-code letters normalized (q for theta, h for eta, w for omega, v for final sigma).
   - That row's Strong's number then counts the tag when the number occurs in a verse the block cites.
   - A Strong's number written directly is matched the same way. The inflected form in the original-words table is a second route.
   - Hebrew attached prefixes (the article, the conjunction, prepositions) are stripped before matching, so "ha-almah" matches H5959.
4. **Counts are checked too.** A debater's count of occurrences ("H5959, 7 rows") must name its unit, verses or tokens. Code recomputes it from the original-words table. A count that differs is marked "DIFFERS FROM THE RECORD (n verses, m tokens)", not "wrong": the table follows one text base per Testament (operational_doc §13), and an honest count from another concordance can differ.
5. **The Apocrypha.** The original-words table holds the 66 books only. An [L2] on an Apocrypha verse is UNVERIFIABLE and carries no weight as [L2].
6. **Judges' own [L2]** is held to the same check. A NOT COUNTED [L2] in a judge's ground voids that ground.

**[L4].** Stands only on two checked lower layers. A NOT COUNTED [L2] does not count toward the two.

## 6. What changes, by part

| Part | Change |
|---|---|
| Debater prompts (D1-D4 Build, C1-C4 Build) | Every critical point carries its layers. Presses use the fixed PRESSED WITH form, eight per premise. Counts name their unit. A bare claim at a critical point carries no weight. |
| The Debate Oracle seat | "Prove every position with the layers. A statement of your position is not proof of it." |
| The pressed-witness ledger | Each press parsed as PROVEN, PROVEN BY REFERENCE or UNPROVEN; unproven presses shown, marked "not a witness (ruling 398)". |
| Ruling 372 counting (K-G1, K-G4, K-G6; K-G10 and K-G11 are fix set 8 items, not live) | Counts only proven presses. |
| Judge rulebook (Panel Build, Build Independent Verdict) | Sentence (B) is removed. Ruling 396 takes its place, with the forced-link form (section 3). "No witness states in its own words" is never a ground, for either side. The block, layer and REFERENCE definitions are stated. |
| Posture draft v4 | Commitment 3 is replaced by ruling 396's sentence. Commitment 5 counts proven presses only. |
| Checks (TRIAL) | K-P: a judge counts an unproven press as a witness, or grades BROKEN on one. K-F: a forced-link line lacks its three quotations. K-R: a REFERENCE line is missing for a referenced press. The [L2] check and the count check. |
| Synthesis | Quotes only words the transcript or the KJV table holds; gives no verdict; its quotations are checked. |

## 7. What it costs

- Longer rounds; the eight-witness cap bounds them, and ruling 399 accepts the length.
- Fewer witnesses counted while the debaters learn the form.
- More code: the PRESSED WITH parser, the reference checker, the [L2] match and count check, K-P, K-F, K-R.
- The [L2] sheet, deduplicated by Strong's number, is far smaller than one row per word.

## 8. Sequence and test plan

**Sequence:** fix set 9, after fix set 8 is live and one run on it has been read whole. One variable per live change (operational_doc §27; both reviews). The [L3] ruling (section 9, question 1) is needed before fix set 8 goes live, because fix set 8's K-LB counts layer kinds by it.

**Tests:**
1. **Parser fixtures:** the new PRESSED WITH form, parsed, on hand-written cases that can pass and fail.
2. **[L2] fixtures:** every [L2] tag in runs 32302 and 32306, matched through the dictionary form and the Strong's number. Report counted, not in the cited verse, Apocrypha, and counts that differ. Nothing is marked NOT COUNTED live until this fixture is read.
3. **Measurement on stored runs (32284, 32293, 32302, 32306):** the stored PRESSED WITH lines carry a reference and a quotation only, so nearly every stored press will parse as UNPROVEN. That figure measures the old format, not the debaters. The useful output is which counts and outcomes the format change alone would move.
4. **Dry regrade of 32306** with the new judge rulebook and nothing else changed, compared field by field with the stored judgments. Its report states the limit set by ruling 395: no swapped-sides test separates a judge's position bias from its reading of the layers.
5. **One live run** after the write, read whole.
6. Results reported before anything is written live.

## 9. Questions for the operator

1. **[L3] (Worker_G1).** As drafted, any second quoted verse read as a cross-reference is [L3]. Then two quoted verses alone meet the two-layer bar, for an [L4], a press and an answer. Run 32306's defender link 5 (Jeremiah 22:30, Matthew 1:12, Luke 1:32) would pass, which Gemini held and GLM did not. That reads line upon line literally, but it lowers today's K-LB bar. The recommended middle course: a second verse is [L3] when the block states the link between the two verses in one sentence (for example, "Matthew 1:12 places Joseph's line in Jechonias's seed"). Otherwise two unrelated quotations pass as a chain.
2. **Unsourced lexicon glosses (Worker_G1).** Of 14,197 lexicon rows, 16 carry no "[source: MetaV Strongs.csv]" tag, and all 16 are short glosses on contested words: almah H5959 "young woman, maid, virgin"; sperma G4690 "seed, offspring"; ethnos G1484 "nation, Gentile, heathen, people"; nephesh H5315; sheol H7585; goy H1471; chesed H2617; kaphar H3722; pisteuō G4100; and seven more. No audit row records their entry, and the table has no trigger. The [L2] sheet would serve these to both debaters. Should they be replaced with their sourced entries before the sheet is served?

## 10. Review items and their disposition

| Item | Disposition |
|---|---|
| E A1: gloss not to the judges | Adopted (5.2). |
| E B2, B3: dictionary-form and Strong's match; Hebrew prefixes | Adopted (5.3). |
| E B4, G1 D8: counts checked, with a unit; "DIFFERS FROM THE RECORD" | Adopted (5.4). |
| E C5: forced-link line quotes three things | Adopted (section 3, K-F). |
| E D6: REFERENCE line | Adopted (section 4, K-R). |
| E D7: one block definition | Adopted (section 3). |
| E answers 1-7 | Adopted: critical points only; unproven shown and marked; [L1] plus one; strict; dedup sheet; judge [L2] checked; fix set 9. |
| E F8: K-G10, K-G11 are fix set 8 items | Marked (section 6). |
| E F9, G1 G13: the cause was sentence (B) | Section 2 corrected. |
| E F10: ruling 395 limit | Stated in test 4. |
| G1 A1-A3: [L3] definition | To the operator (9.1). |
| G1 B4, B5: stored presses unproven by format; written PRESSED WITH form | Adopted (section 3; test 3 says it). |
| G1 C6: exempt the charge sentence | Adopted (section 3). |
| G1 C7: references to the other side's rounds | Allowed, meanings must agree (section 4). |
| G1 E9: almah gloss | Measured and widened: 16 unsourced rows (9.2). |
