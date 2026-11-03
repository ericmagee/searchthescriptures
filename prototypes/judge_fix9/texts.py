# texts.py (judge_fix9): the rule and prompt texts fix set 9 writes, one copy each (patch.py serializes them into the nodes as JSON strings).

# S1: ruling 396 in the place of sentence (B), with the forced-link line form (judges' rulebook: Panel Build, Build Independent Verdict)
R396 = ("FORCED LINK (md_notes_rulings 396: the Bible does not contradict itself; a witness that contradicts a link does not fit into that link, "
 "and the link cannot be forced; the words do not decide it, only the meaning, which is why the debate drives with Isaiah 28:10). A link that "
 "cannot take a proven witness's meaning is forced and breaks. The meaning weighed is the one the debaters exhibit: the pressing side's MEANS "
 "sentence with the layers that carry it, and the holding side's answer with its layers. You supply no meaning of your own. \"No witness states "
 "it in its own words\", \"no verse states it\" and every other form of that ground are never a ground, for either side, for any grade. A "
 "COLLISION POINTS line that grades a link BROKEN because the link cannot take a proven witness's meaning is followed, on the next line, by "
 "exactly one FORCED line: FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the pressing side's MEANS sentence with its layers, quoted word for "
 "word>\" -- ANSWER [<round>]: \"<the holding side's answer, quoted word for word>\" -- FAILS: \"<the words of the layer of that answer that "
 "fails to show the fit, quoted from the ANSWER round>\". Each quotation stands word for word in the round it names; K-F, a TRIAL check, reads "
 "the three, and a forced-link grade without them is returned for cure.")

# S3: proven presses, proof by reference and the REFERENCE line (judges' rulebook)
RPROVEN = ("PROVEN PRESS (md_notes_rulings 398 and 399: a press carries its layers; a press may carry its proof by reference to the round where the "
 "same layers were exhibited). A pressed witness is a verse a listed premise carries under PRESSED WITH: (rulings 392, 393), written <reference> "
 "\"<KJV quote>\" -- MEANS: <one sentence> -- [L2] <word> (<meaning>) | [L3] <reference> \"<quote>\" | PROVEN IN [<round>]. The quoted verse is its "
 "[L1]; it needs one more layer kind, in place ([L2] or [L3]) or by PROVEN IN [<round>]: a round, of either side and not later than the press, "
 "that quotes the same verse with its reference in a block of two layer kinds. The PRESSED-WITNESS LEDGER parses every press: PROVEN, PROVEN BY "
 "REFERENCE, or UNPROVEN, marked not a witness (ruling 398). Only a proven press is a witness: an unproven press left unanswered costs the holding "
 "side nothing, makes no premise UNEXHIBITED and is no BROKEN ground; count no premise on one and grade no link BROKEN on one (K-P, a TRIAL check, "
 "marks a seat that does). For every press the ledger marks PROVEN BY REFERENCE, write one line in reasoning after the COLLISION POINTS lines: "
 "REFERENCE: <the press's reference> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- \"<the referenced block's stated meaning, quoted>\" / \"<the "
 "press's MEANS sentence, quoted>\". CONFIRMED only when the two quoted meanings agree; a press NOT CONFIRMED is unproven (strict). A side may cite "
 "the other side's round, but only for the meaning that round exhibited. K-R, a TRIAL check, marks a referenced press with no REFERENCE line, or "
 "one whose quotations the rounds do not hold.")

# S4: the [L2] check as the judges see it (no gloss reaches the judges)
RL2 = ("[L2] CHECK (computed by the system against the record's original-words table and its lexicon; md_notes_rulings 382, 383: no lexicon gloss "
 "is given to you). Every [L2] tag of the rounds is listed below as COUNTED (its word stands in a verse its block cites), NOT COUNTED (not in the "
 "cited verse, or no Hebrew or Greek word named) or UNVERIFIABLE (an Apocrypha verse, or a verse whose words were not read). An [L2] that is "
 "NOT COUNTED or UNVERIFIABLE is no layer: it gives no footing, proves no press and counts toward no [L4]. A count of occurrences marked DIFFERS "
 "FROM THE RECORD is no ground (the record counts in verses and in tokens, one text base per Testament; the difference is recorded, not called "
 "wrong). An [L2] of your own in a COLLISION POINTS line is held to the same check: its word must stand in a verse that line cites, or it voids "
 "that ground (K-L2, a TRIAL check).")

# S1: the posture text, Commitment 3 (11 nodes), and the cure prompts' sentence (14 nodes)
C3_OLD = ("### Commitment 3. Each test in its place.\\nA pressed witness contradicts a link only when its own words state the contrary.\\nA collision "
 "where the witnesses pressed against a link are the other side's own chain read together is weighed chain against chain, by footing. There, "
 "\\\"no verse states it\\\", \\\"the text nowhere narrates it\\\" or \\\"no witness's own words state it\\\" is never a ground, for either side (DG-61).")
C3_NEW = ("### Commitment 3. No link is forced.\\nA link that cannot take a proven witness's meaning is forced and breaks (ruling 396). I weigh the "
 "meaning the debaters exhibit, with its layers, and supply none of my own.\\n\\\"No verse states it\\\", \\\"the text nowhere narrates it\\\" or "
 "\\\"no witness's own words state it\\\" is never a ground, for either side (DG-61).")
C5_OLD = "A witness carried under a listed premise's PRESSED WITH line, and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED (ruling 372)."
C5_NEW = ("A proven press carried under a listed premise's PRESSED WITH line (it carries its layers, or a checked PROVEN IN reference; ruling 398), and "
 "left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED (ruling 372). An unproven press is not a witness (ruling 398).")
CURE396 = (" FORCED LINK (md_notes_rulings 396): a link that cannot take a proven witness's meaning is forced and breaks; the meaning weighed is the one "
 "the debaters exhibit, and you supply none of your own; that no witness states the point in its own words is never a ground, for either side. "
 "PROVEN PRESS (md_notes_rulings 398): a witness is a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is "
 "not a witness. K-P (you counted a premise UNEXHIBITED, or graded a link BROKEN as left unanswered, on a press the ledger marks UNPROVEN, not a "
 "witness, ruling 398): cure a count with CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true; "
 "cure a BROKEN line with RETRACTED for it and one CORRECTED RESULT, or one RESTATED line that is not graded LINK BROKEN or that rests on a proven "
 "press. K-F (a FORCED line whose quotations do not each stand in the round named, or a link graded BROKEN as forced with no FORCED line): cure it "
 "with one FORCED line for the item, FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the MEANS sentence with its layers>\" -- ANSWER [<round>]: "
 "\"<the holding side's answer>\" -- FAILS: \"<the layer of that answer that fails>\", each quotation word for word in the round it names, or with "
 "RETRACTED for the line and one CORRECTED RESULT, or one RESTATED line not graded LINK BROKEN. K-R (a press proven by reference with no "
 "REFERENCE line, or a REFERENCE line whose quotations the rounds do not hold): cure it with one REFERENCE line: REFERENCE: <the press's reference> "
 "-- [<round>] -- CONFIRMED | NOT CONFIRMED -- \"<the referenced block's stated meaning>\" / \"<the press's MEANS sentence>\". K-L2 (an [L2] of your "
 "own, in a COLLISION POINTS line, whose word stands in no verse that line cites): cure it with RETRACTED for the line and one CORRECTED RESULT, or "
 "one RESTATED line whose [L2] words each stand in a verse it cites, or that drops the [L2]. ")

# S2: the debaters
ORACLE = "Prove every position with the layers. A statement of your position is not proof of it."
PROVE = ("PROVEN STRUCTURE (md_notes_rulings 397 to 400: the layers are the language of this debate). Every critical point you write carries its "
 "layers: a declared link, a listed premise's supporting block, a press, an answer to a press, and every [L4]. [L1] is a KJV verse quoted with its "
 "book, chapter and verse. [L2] is a Hebrew or Greek word named (its dictionary form, transliteration or Strong's number) with its meaning; it "
 "counts only when the word stands in a verse the same block cites. [L3] is any further verse quoted with its reference after the [L1] verse, as "
 "its support (ruling 400). [L4] is an inference: it stands only on two lower layer kinds and the chain from them. At a critical point, a statement "
 "of what a verse means without its layers is a bare claim and carries no weight. An answer to a press shows, with layers, how the witness's "
 "meaning fits your link; restating your link's own footing while passing over the witness is not an answer. The charge sentence of a premise list "
 "(that the other side's inference lacks footing) is exempt; the witnesses under it carry the layers. A count of occurrences names its unit, "
 "verses or tokens (for example \"H5959: 7 verses\"); the system recomputes it from the record.")
PWFORM = ("PRESS FORM (md_notes_rulings 398 and 399: a press carries its layers; only a proven press binds the other side). Write each pressed verse "
 "under PRESSED WITH:, one per line, in this form: <reference> \"<KJV quote>\" -- MEANS: <one sentence: what the verse means against the claim> -- "
 "[L2] <Hebrew or Greek word> (<its meaning>) | [L3] <another reference> \"<its KJV quote>\" | PROVEN IN [<round>]. The quoted verse is its [L1]; "
 "give at least one more layer kind in place ([L2] or [L3]), or write PROVEN IN [<round>], naming a round of either side, not later than this one, "
 "that already quotes that verse with its reference in a block carrying two layer kinds; the meaning you press must be the meaning that block "
 "exhibits. A press without its MEANS sentence and a second layer is UNPROVEN: the judges see it marked not a witness (ruling 398), and leaving it "
 "unanswered costs the other side nothing.")

# S5: the synthesis
SYNTH = (" QUOTE ONLY THE RECORD: every quotation you give is words of the transcript above or of the KJV, with its book, chapter and verse; the "
 "system checks your quotations against the KJV as it checks the debaters'. Give no verdict of any kind: do not say which side won, prevailed, "
 "held, broke or should be believed, do not grade any link, and do not state a doctrinal conclusion of your own.")
