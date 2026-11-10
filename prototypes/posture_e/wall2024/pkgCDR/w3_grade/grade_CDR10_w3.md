# W3 grade of pkgCDR rev 10 (W1, commit 709bf7b1; write file pkgCDR/parent_s103_CDR.json): FAIL on one point (hints printed "LINK ?"), one-line fix

Graded as stated on Wall 4024: attribution, exact prompt text, Record, prompt size. A verb missing from the hints is not a failure.

## Passes
1. Speaker attribution (prompt_rev10.txt): 366 hints on the 39 stored debates; every one is found word for word in the round named and is on the side whose round it is. Most for one side in one debate: 13. No cap.
2. Prompt text on 34108 (record_rev10.txt): against the live prompt the only changes are one added passage and nine hint lines in place of "none". System prompt and every other request field equal to live. The passage tells the enforcer to read rounds 1 to 3 for anything given up in any words, to report an unlisted one as NEW, that the hints are NOT COMPLETE, and how to answer a hint. The D6 drop is hint P7.
3. Record, my six written replies (record_rev10.txt), all as they should be:
   - a NEW line (not a hint) with both quotations word for word is CONFIRMED (the "ordinary means" grant against "Christ had no biological father.");
   - a NEW line with an invented earlier quotation breaks nothing;
   - a NEW line whose EARLIER is the closing round breaks nothing;
   - a hint CONFIRMED with a closing quotation from the other side's closing round breaks nothing;
   - a challenger hint charged to the defender breaks nothing;
   - hints left unanswered are NO ANSWER.
4. Write file: 418 nodes; only Close Enforcer Build, Close Enforcer Record, Judge Contradiction Build differ from live s103; connections equal.
5. Rolled-back insert of three row shapes (answered hint, NO ANSWER, NEW confirmed): rows 3, recorded true.
6. Size: I confirm W1's figures on 34108 (151,443 to 155,284 characters by my build).

## Fails
124 of the 366 hints (34%) are printed "LINK ?": every hint from rounds 1 and 2 that stands before any LINK heading (CR1 16, CR2 41, DR1 27, DR2 40). The passage says "Use the link the earlier sentence belongs to" and the answer format asks for LINK <n>. If the enforcer copies what the hint line shows and answers
`CLOSE-CONTRADICTION: P1 -- DEFENDER -- LINK ? -- NOT A CONTRADICTION -- ...`
Record cannot read the line and logs that hint as NO ANSWER (record_rev10b.txt, X3). No ruling changes, but the NO ANSWER row is the signal that the enforcer skipped a hint, and the run scoreboard counts NO ANSWER. A third of the hints could show it falsely.
Fix (idea only), either one: Record reads a NOT A CONTRADICTION answer to a hint by its id whatever stands after LINK; or the passage says what to write for a hint whose link is shown as "?".

## Notes, not failures
- A hint answered CONFIRMED under another link than the hint's is taken on the enforcer's link (X1: the D6 hint under LINK 5 breaks LINK 5). Same as live for other candidates.
- A CONFIRMED hint answer may quote only part of the earlier sentence (X4); word for word within the round is what Record checks.
- Hints carry sentences that give nothing up ("That reason removes the cause for putting away ...", 34108 P1). The enforcer answers them NOT A CONTRADICTION; the cost is one output line each, 366 over 39 debates.
- The cost change (about 3% more prompt, one answer line per hint) needs the operator's approval under the operating document, as W1 says.
- Whether DeepSeek finds an unlisted drop, and what it writes for "LINK ?", only the replay on stored text can show.
