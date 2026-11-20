# ASK 504 plan rev 1 (W3, seat 33, 11-20; replaces rev 0 7501f2d0 after W4's build rev 0 findings, build504_rev0_findings.md): the deciding step of every break must be layered

Team: W3 plans, W4 checks and builds. W1 and W2 stay asleep (the operator, 03:45:05Z: "Just you two."). The build rule's second non-builder grade is HELD; W4 tells the operator before any card.

## 1. THE OPERATOR'S WORDS
- 21:44 CST 11-19 (W4's thread): "The layers are there, but the deciding step in each break is not layered. This is the fault."
- 21:21 CST 11-19 (W4's thread), the done test: "it's fixed when the corpus has all HELD"
- 03:44:48Z: "Plan it now" on W4's card.

## 2. EVIDENCE (run 40995, ODV1-40995-inaaza3z, debate_judgments; W3 read argon and sol62 at 21:47 CST)
- argon, D4: "D4 also fails against [L1] Matthew 1:20 ... with [L2] gennao (G1080, ...) and [L3] Matthew 1:18 [L4]." The [L4] tag stands alone: no inference is written. The step that decides ("fails") is not stated at all.
- sol62, D4 vs C4: "DEFENDER LINK BROKEN (Commitment 3) -- The source clause accounts for the conception rather than merely naming a covenant relation -- GROUND: [L1] ... | [L2] ... | [L3] Matthew 1:18 ... The answer 'of the Holy Ghost is covenant origin and anointing' transfers a title argument to a clause about what is conceived." The deciding sentence carries no [L4] tag, names none of the lower layers as its footing, and does not meet the layers the defender's answer cited ([CR3]: 1:20's "Joseph thou son of David" and "Mary thy wife"). The answer is quoted, then dismissed.
- Per W4 (not read by W3): argon's D5 "leaves no window for marital union" skips the espousal (1:18) before the finding; sol62 leans on Luke 1:34 with no layer; sol wrote no D vs C lines in this form.
- Why the present rules let it through: rule B and Commitment 13 require the LOWER layers on a BROKEN line ([L1] quoted, [L2] when a word turns, [L3] when relied on), and E-COL checks that they are present. Nothing requires the step from those layers to "fails" to be written, tagged and footed. The manual already says a judge's "excludes or denies" ground "is the judge's own [L4] and needs two exhibited lower layers"; no check enforces it.

## 3. OBJECTIVE
Every collision line that grades a link BROKEN, and every FORCED line, states its deciding step as a written [L4] inference that (a) rests on lower layers named on that line, and (b) meets the answer's own layers. A line without one is sent back like a missing layer. Expected effect, the operator's test: on this topic the corpus has all HELD.

## 4. THE CHANGE (W4 locates every copy from fresh live reads; touched text only; no model settings; reasoning untouched)
C1. Rule text (where rule B and the FORCED form are defined, and every copy the judges receive): a LINK BROKEN line and a FORCED line carry one line
   `DECIDES [L4]: "<the inference, one sentence>" -- FROM: <the lower layers it rests on, by tag and reference, each already on the line> -- MEETS: <the answer's own layer, quoted with its tag or reference> -- WHY IT FAILS: <the lower layer that the answer's layer cannot agree with>`.
   A bare [L4] tag, an inference with no FROM, or a break that quotes the answer without MEETS and WHY IT FAILS, is not a deciding step. Two quotations at one layer are one layer (as rule B).
C2. Commitment 13 (Accept Build posture): add "for a break, the deciding step as a written [L4] inference, from the lower layers on the line, meeting the answer's own layers (DECIDES)". The Commitment that pairs with C1.
C3. E-COL enforcer: add the DECIDES check beside its layer-presence check, with the same send-back on a miss (Enforcer Build, Judge Enforcer, Alt and R2 Alt Judge Enforcer, and the send-back templates that list misses). The check reads form only: DECIDES present, FROM names lower layers present on the line, MEETS quotes words found in the answer round named. The enforcer does not judge the inference (as today: "You do not judge the debate").
C4. Both sides (ruling 364; Commitment 4): C1 to C3 apply to CHALLENGER LINK BROKEN lines the same way.

## 5. A MISS AFTER SEND-BACK (rev 1)
The operator chose O1 (void the break) at about 04:0xZ. W4's build rev 0 (B2b) shows O1 cannot be built on the present apply path: a RETRACTED or VOID collision line is NOT APPLIED (SB_FORM; W3 2351), and KEYSTONE and RESULT do not move. Building O1 as stated needs a new "not graded" form that every grade reader, pkgRCD, the RESULT recompute and the panel count all read. W3 MISTAKE: rev 0 offered O1 without quoting ruling 428 (md_notes_rulings 428): "a live disagreement sends the judge's line back once with the quoted reason, the judge keeps the decision and both are recorded". Code voiding a judge's grade sets that aside.
Design (team call), in two parts:
D1 (build now): the DECIDES send-back gives the judge its two lawful cures: write the DECIDES line, or regrade the pair yourself as a graded collision line (STANDS or UNDERDETERMINED, with its layers). Both go through the present apply path. The judge keeps the decision (428).
D2 (the operator's choice, on a card that quotes 428 and says it revisits his O1): a break still without DECIDES after the one send-back:
- R1 (recommended): recorded, not voided, for the proving run: the line keeps the judge's grade and is marked DECIDES UNCURED in the record and the AAR. Then he decides from the count.
- R2: void it as O1 said: the wide change, a new "not graded" form read by every grade reader, pkgRCD, the RESULT recompute and the panel count; it sets aside 428.
Press-only breaks: a break resting on an unanswered press (sol62 D5, Commitment 5) also needs DECIDES, because the operator's words are "the deciding step in each break". The E-COL layer-count exemption W4 calls ruling 392 stays as it is for the layer count. md_notes_rulings 392 reads "a press must have a premise behind it; a verse pressed without one isn't a witness", which is not that exemption; W4 names the exemption's source before any card, and if it is the operator's ruling, the card quotes it.

## 6. CHECKS
- B1 (W4, offline): the changed texts and nodes only; connections equal; prompt size before and after per node.
- B2 (W4, offline): the E-COL check run on the run 40995 judge texts flags argon D4 (bare [L4]) and sol62 D4 (no DECIDES); and passes a hand-written conforming line.
- Q1 (the operator's release): rerun this topic, spark/oracle vs qwen4max/plain. Read from the DB: every LINK BROKEN or FORCED line in debate_judgments carries DECIDES with FROM and MEETS; the send-back count for DECIDES; the outcome.
- DONE (the operator's test): the corpus has all HELD on this topic.

## 7. WRONG-IF
1. A judge writes a full DECIDES line that still breaks a link: the form holds, the corpus is not all HELD. Report it to the operator with the line; do not loosen C1.
2. The enforcer starts judging inferences (sends back a conforming line for its content): the check is too wide; narrow it.
3. Send-backs exhaust the cure budget and the run ends without judgments: report; do not raise limits without his word.

## 8. STEPS
1. W4 checks this plan against live (locations, copies, sizes).
2. The operator answers D2 (R1 or R2), on a card quoting 428.
3. W4 builds D1 (and R2 only if chosen); B1, B2; W4 tells the operator the second grade is held; his card; write; fetchback.
4. Q1 on his release; W3 manual entry on its own card after.
