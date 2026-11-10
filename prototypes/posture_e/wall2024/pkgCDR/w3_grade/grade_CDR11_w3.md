# W3 regrade of pkgCDR rev 11 (W1, commit acff76f2; write file pkgCDR/parent_s103_CDR.json): PASS on the code. Not proven: the enforcer's own reading, which only the DeepSeek replay on stored text can show.

## My rev 10 failure is fixed (record_rev11.txt, 9 OK)
- Y1 NOT A CONTRADICTION with LINK ? to a LINK ? hint is read as answered, not NO ANSWER.
- Y2 CONFIRMED with LINK ? breaks nothing. Y4 a NEW line CONFIRMED with LINK ? breaks nothing.
- Y3 NOT A CONTRADICTION with LINK ? to a hint whose link is known is read as answered.
- Y5 a LINK ? hint CONFIRMED under a declared link with both quotations word for word is CONFIRMED on that link.
- Y6 CONFIRMED under a link that is not declared breaks nothing. Y7 the D6 hint CONFIRMED on LINK 6 breaks LINK 6.

## Cap of 30 hints per side
- Z1 with 40 padding drop sentences in [CR1], the defender has 30 hints and every round is still in the prompt in full.
- Z2 past the cap, the D6 drop reported as NEW with both quotations is CONFIRMED on LINK 6.

## Unchanged checks, rerun
- Attribution (prompt_rev11.txt): 366 hints on the 39 stored debates, all word for word in the round named and on the right side; most for one side in one debate 13, so the cap is not reached on the stored record.
- Prompt on 34108: one passage and the hint lines added, "none" removed, nothing else; system prompt and other request fields equal to live. 151,443 to 155,625 characters.
- My six rev 10 Record replies: 6 OK. Three nodes differ from s103; connections equal.
- Rolled-back insert of two LINK ? rows (answered; not confirmed): rows 2, recorded true.

## Notes, not failures
1. The cap fills from round 1. In Z1 all 30 hints are [CR1] padding and the D6 drop of [CR3] has no hint; the enforcer then has to find it from the full round. Filling from round 3 backward would keep the hints where drops are made. Stored record: never reached.
2. "LINK ? (cannot be told)" and "LINK unknown" on a NOT A CONTRADICTION answer still read NO ANSWER (Y8, Y9). The passage tells the enforcer to write "LINK ?".
3. Hints include sentences that give nothing up; one answer line each.
4. Cost change (W1: about 3.4% more prompt, one answer line per hint) needs the operator's approval.
5. NOT PROVEN by any of this: that DeepSeek finds a drop that is not hinted, confirms the 34108 D6 pair, and confirms nothing false on the other stored debates. That is the replay, which waits on the operator.
