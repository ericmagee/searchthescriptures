# Fair judging ground: proposals for team review (rev 1, W3)

Under the operator's rulings 502 to 504. Evidence: run 41822 (Wall 10932, 10936, 10937, 10938; run41822/w3_enf/FINDINGS.md) and run 41736 (Wall 10927 to 10930). These are proposals, not builds. None changes corpus text. None is offered to the operator until W1 and W4 have reviewed it. Author W3, session_01H1X3ANsGiMnhnbkfphocmo.

Size: SMALL is one test or one filter in one node. MEDIUM is one enforcer rule text or several nodes. LARGE is a new call or a new stored structure. RULING means the operator must rule before anything is planned.

## A. Removals on form

P1. A judge's cure statement is not a collision line. SMALL.
Evidence: row 52535 was built from chatgpt's own K-CMTL statement, "FORCED: D3 vs C5 applies (Commitment 7).", and removed the seat. The same misread hit argon twice (rows 52792, 52793) (Wall 10938 items 3, 5, 6).
Proposal: the E-COL and E-ONE item builders skip any line that stands inside a JUDGE STATEMENT or STATEMENT.

P2. The E-COL cure test reads the reply. SMALL.
Evidence: the side test runs on the flagged line and not on the CHANGE TO text, so no CHANGE TO could cure row 52535 (Wall 10938 item 4).
Proposal: run the answering-side test on the CHANGE TO text.

P3. A gate change the engine refuses does not remove the seat. MEDIUM.
Evidence: sol62 answered gate items G1 and G2 with a change that raised its count from 1 to 4. pkgPS refused the change. Rows 52585 and 52586 stayed UNCURED and the seat was removed. Its verdict word was BROKEN before and after (Wall 10936 A3a).
Proposal: when the engine refuses a gate change, the judge's line before the change stands and the row is stored RECORD-ONLY, as ASK 546 does for rows 52587 and 52588.
Open point for W4: whether G1 and G2 can be told apart from a judge who gives no answer at all.

P4. The run row and the run report carry every written verdict. SMALL, record-only.
Evidence: six judgments were written and five read BROKEN; the stored row shows three and a 2 to 1 split (Wall 10936 A1, A2; Wall 10938 item 2).
Proposal: store each removed seat's verdict word and the row that removed it, and print them in review_notes. Nothing counted changes.

No proposal on gemini's removal (K-G7, rows 52593 and 52594). The seat supplied no FORCED line, which is what the rule asks for.

## B. The enforcer and its process

P5. One collision, one enforcer ruling per run. Step 1 SMALL and record-only; step 2 LARGE.
Evidence: on D3 against C4 the enforcer answered BROKEN, STANDS and UNDERDETERMINED across seats; on D2 against C2 it told sol BROKEN and then agreed with STANDS (FINDINGS B1; the same in run 41736, Wall 10930 item 2).
Step 1: an audit line that lists, for each collision, the RIGHT word the enforcer gave on each seat, and marks a collision with more than one word.
Step 2, only if step 1 shows it again in the next run: the enforcer's first ruling on a collision is carried into its later calls in that run, and a different ruling must quote the judge's words that make the case different.

P6. A push to BROKEN is tested on both sides. MEDIUM (E-HOLD rule text). Step 1 SMALL and record-only.
Evidence: seven stored rows push a point the judge left open to BROKEN (52448, 52452, 52453, 52455, 52458, 52678, 52800). All seven say the defender's answer fails; none pushes against the challenger. One judge followed (qwen4max, 52711); five lines went to STANDS; argon turned 52800 against the challenger (FINDINGS E1; Wall 10940 A).
Step 1: an audit line that counts the pushes by side.
Step 2: the E-HOLD rule asks the enforcer, before RIGHT: BROKEN on an open point, to quote the other side's answer on that point and say whether it meets the pressed meaning. Without both quotations the line is not counted.

P7. "Rows left unweighed" gets one consequence for both sides. MEDIUM (E-COL rule text).
Evidence: six rows name defender rows the judge left unweighed and keep the break of the defender (52435, 52436, 52440, 52442, 52443, 52444); on argon, rows 52788, 52789 and 52794 name unweighed challenger rows and answer RIGHT STANDS against the break of the challenger; on qwen4max, rows 52673 to 52676 answer RIGHT STANDS against breaks of the defender (FINDINGS E3; Wall 10930 item 3).
Proposal: when the enforcer's only ground is an unweighed row, the send-back asks the judge to weigh that row and restate the line. The enforcer gives no RIGHT word on that pass.

P8. "Lacks a layer" means the tag is absent. SMALL.
Evidence: on sol (rows 52470, 52479) the premise check called premises 2 and 5 COUNTED, "lacks [L1]", while the blocks hold [L1]; the ground was that the rows do not give the assumed fact. On the next pass it ruled premise 5 SPARED, "a meaning dispute, not a missing layer". sol's count went from 1 to 2 (FINDINGS B3).
Proposal: the engine checks the block for the tag named. If the tag is present, a COUNTED line of the kind "lacks [Ln]" is refused and recorded.

P9. The enforcer sees its own earlier ruling on an item. MEDIUM.
Evidence: P8's reversal, and sol's D2 against C2 (FINDINGS B1, B3).
Proposal: on a second pass the item carries the enforcer's first-pass line. A different RIGHT word must say what changed in the judge's line.

P10. The keystone check is done by the engine. SMALL.
Evidence: E-KEY told argon that D4 cannot stand and named lines that break the challenger's link (FINDINGS B4).
Proposal: the engine derives the keystone word from the judge's own lines against the last declared defender link, and sends back only a mismatch.

P11. The press check's result reaches the judge and the premise check. MEDIUM. Needs W4's reading of the engine first.
Evidence: sol counted premise 5 on Deuteronomy 22:24 and qwen4max counted premise 4 on Matthew 1:18; rows 52266 and 52260 rule those presses NOT FOOTED. The E-ANS and E-PREM prompts hold no press-check result, and the engine manual holds the words "NOT FOOTED" 0 times. Matthew 1:18 is ruled FOOTED in row 52258 and NOT FOOTED in row 52260 on the same word, "conjugal" (FINDINGS B6).
Step 0: W4 states what the engine does with NOT FOOTED today.
Proposal: a press ruled NOT FOOTED is labelled UNPROVEN in the ledger the judges see. The E-ANS rule already says an UNPROVEN press carries no answering burden. This cuts both ways: six of the Oracle's eleven presses were ruled NOT FOOTED.

## C. The Oracle's opening and closing

P12. The "therefore" of Luke 1:35. RULING. No change is proposed.
Evidence: both seated BROKEN judges decide there. No defender round answers it (FINDINGS A1). In kb_sights, among the summaries that name Luke 1:35 (Sights 8, 9, 620, 1578, 1822), the words "therefore also" stand once, inside the quotation of the verse in Sight 1822; dio (G1352) stands in none of Sights 266, 620, 1578, 1822. I searched the summary column of kb_sights only. On that search the corpus holds no sentence saying what the "therefore" joins. Luke 1:31, Luke 1:56 and Deuteronomy 20:7 stand in no round.
Proposal: the coordinator brings this one point to the operator with the evidence above. The team writes nothing for the Oracle on it.

P13. The opening answers what the first press will be. MEDIUM (Oracle opening instruction). Needs the operator's approval as an Oracle-facing text change; the failed runs 41736 and 41822 are the evidence.
Evidence: CR1 does not quote Luke 1:34, Isaiah 7:14 or 1 Corinthians 7:5 in either run; the challenger opens on all three; Sight 1822 holds the record's reading of Luke 1:34 and Luke 1:35 (FINDINGS A2, A5; Wall 10927 items 2, 3).
Proposal: the opening quotes, with its served row, each verse the served sights themselves answer. Nothing is added that the sights do not hold.

P14. The close is checked against the press list before it is sent. SMALL (engine check) or MEDIUM (re-call).
Evidence: CR4 says "GAPS: NONE" with 5 of 21 pressed verses unanswered in it, in two runs (FINDINGS A8; Wall 10927 item 8; ASK 537 text present and not met, Wall 10936 B).
Proposal: the engine lists the pressed verses that have no ANSWER line in the close. Step 1 records the list. Step 2 sends the list back to the Oracle once, as pkgBAR sends back barred sentences.

P15. D3's act and its row. RULING. No change is proposed.
Evidence: D3 states that Joseph knew Mary within the espousal, on Genesis 4:1 and Matthew 1:25. The assumption check rules it INFERRED ACT; qwen4max reads Matthew 1:25 with the "present state" answer against it (FINDINGS A2, A3). Sight 266 states the reading. Whether a row carries it is a corpus matter, and the operator has said the corpus is right.
Proposal: bring it with P12 only if the operator asks; otherwise it stays a finding.

P16. Words outside the KJV renderings. SMALL for the gloss check; RULING for "young woman".
Evidence: CR3 serves sperma (G4690) as "seed, including the male sperm"; the operator's statement of 11-23 is seed, seeds, issue, never "sperm". CR3 writes "young woman" at Isaiah 7:14; two judges graded it against the KJV word "virgin" (FINDINGS A6).
Correction to my FINDINGS A6: "young woman" is not the Oracle's own word. Sight 1578 holds "the verse at the word level uses the young-woman word". It comes from the corpus.
Proposal: (a) the K-GLS gloss check (ASK 533) also reads the defender's own [L2] lines, record-only. (b) The "young woman" wording goes to the operator as a question, since it is corpus text.

## Order suggested
First: P1, P2, P4, P8, P10 (small, and each rests on a row). Second: the record-only steps of P5, P6 and P14. Third: P3, P7, P9, P11 after W4's reading. To the operator through the coordinator: P12, with P16(b).
