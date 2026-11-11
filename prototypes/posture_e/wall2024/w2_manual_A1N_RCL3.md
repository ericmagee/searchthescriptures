# Manual sections and first-run checks: pkgA1N and pkgRCL rev 3 (W2)

Written 11-11 by W2 for W3's engine manual and grade plan. Enter each section only when its package is written. Figures are MEASURED on stored runs unless marked ESTIMATE.

## Manual section: pkgA1N (answer check reads the pointed block and later rounds)

Answer check, the side's other lines (pkgA1N). The DeepSeek answer check (E-ANS) reads an answer the way the judges read it. An answer to a pressed verse counts from any later round of the same side (operator rulings, md_notes_rulings rows 86 and 373), and also from a block of the same round that the answer points to.

When the code builds each E-ANS item, it adds THE SIDE'S OTHER LINES ON THIS VERSE. That section holds two things:
- (a) The LINK N section of the same round, for each pointer the answer gives. A pointer is written "under link N" or "(link N)", in any letter case. The section contributes its paragraphs that name the pressed verse, or its opening when none does.
- (b) The paragraphs of the side's later rounds that name the pressed verse. The defender's later rounds are [CR2] to [CR4]; the challenger's are [DR1] to [DR3].

Press lists ("PRESSED WITH", "-- MEANS:") are left out. The section is cut at 900 characters. RULE E-ANS in the check's prompt says that an answer given there counts as the answer.

The check sets no grade itself (ruling 428, record-only trial); its DISAGREE and NO ANSWER rows go back to the judge in the send-back, and the judge keeps or changes its grade. It corrects in both directions: of 48 stored check-only send-backs, 39 were MISSES corrections and 9 were MEETS corrections.

The section is used by Judge Enforcer Build, Alt Judge Enforcer Build and R2 Alt Judge Enforcer Build (Shared Library).

Size: code +1,755; prompt +322 characters per check call.
Cost: +26K to +146K check text per stored run, 0 to 2 more DeepSeek calls per run.

Limits:
- A pointer in other words ("see link 2", "in link 4") is not followed.
- A verse written without its book name is not found.
- A link section is found only by a line opening "LINK N".

## Manual section: pkgRCL rev 3 (reclaim check at the close)

Reclaim candidates at the close (pkgRCL rev 3). Operator ruling ASK 20: a part left out of a narrowed restatement counts as dropped.

Close Enforcer Build looks for a sentence in the defender's close round [CR4] that keeps the chain or links "as declared" (for example "My chain stands as declared, D1 to D6"). For each defender link that was narrowed earlier and is covered by that sentence, it hands the closing enforcer one candidate. DeepSeek decides each candidate; the code only proposes.

Size: code +2,154 in Close Enforcer Build only. Fixed prompt 0. The enforcer prompt grows only when the case occurs: about +1,239 characters in run 34852 (MEASURED).

Limits (graders W3 and W4). Each one is a miss that leaves the earlier behaviour; no false candidate was found. These forms are not read:
- "as declared, not as narrowed"
- words in curly quotation marks
- a sentence broken across lines
- "as they should"
- a question followed by its answer
- a clause that names the other side
- the heading form "LINK 4 (D4): CONCEDED"

A link narrowed and later restored still gets a candidate, and the enforcer decides it. One confirmed sentence can break every narrowed link at once, as the ruling applies.

## First-run checks: pkgA1N (for the grade plan)

On the first live run after the write, read the Judge Enforcer Build output (and Alt Judge Enforcer Build when alternates sit). The run must show:

1. RULE E-ANS in every check call's prompt carries the new sentence ("and also the block the answer points to ...").
2. Each E-ANS item whose answering side names the pressed verse in a later round, or points with "under link N" or "(link N)", carries THE SIDE'S OTHER LINES ON THIS VERSE.
   - No item carries it when the record has neither; this is byte-equal to the s128 item text.
   - The section is at most 900 characters.
   - It holds no PRESSED WITH or "-- MEANS:" line.
   - It holds no paragraph from the other side's rounds.
3. Every pointed section is labelled "[XRn, LINK N]", and N matches the answer's pointer. An answer that only says "fits Link 1 and Link 2" gets no LINK block.
4. Check calls: the run makes 0 to 2 more DeepSeek answer-check calls than the same item set would make on s128. Stored range: panel +0 to +2, alternates +0 to +1. More than 2 added calls in one node is a FAIL to explain.
5. Check text grows by about +26K to +146K characters per run (ESTIMATE for a new debate; MEASURED range on ten stored runs).
6. No Judge Enforcer Build, Alt Judge Enforcer Build or R2 Alt Judge Enforcer Build error. Every E-ANS item is still sent, and items are not renumbered against the judges' lines.
7. The pkgEAF AU lines still act: the full answer block (eaw_blk) is served as on s128.
8. Record, not pass or fail: each E-ANS row whose DeepSeek grade differs from the judge's, with whether the item had the new section. This is the first live evidence of grade effect, which no stored replay shows.

## First-run checks: pkgRCL rev 3 (already in W3's plan if listed; repeated here)

1. When [CR4] has an "as declared" sentence covering earlier-narrowed links, the closing enforcer's request lists one reclaim candidate per such link. Otherwise the request is byte-equal to s128.
2. DeepSeek's reply decides each candidate. A confirmed one is recorded as the dropped part under ruling ASK 20.
3. No Close Enforcer Build error.
