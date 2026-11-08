# pkgEWB: DeepSeek E-ANS/E-HOLD full-answer finders match the answer's opening words as whole words (33605 B117)

Nodes (live s57 bases, same edits): Judge Enforcer Build caba029517dd -> e623516c11e9; Alt Judge Enforcer Build 14736afdc9ae -> 0d1f052f879f.

Fault: the finders (eawBlock, eawBlockMeans, eaiBlock) test the answer's first 6 words as a plain substring. 33605 B117 (grok, Acts 16:13):
"i grant that this is a" matched inside "I grant that this is Adam's way of begetting", so the Genesis 4:1 bullet was sent as THE ANSWER IN FULL
and DeepSeek overruled grok's MEETS on the wrong text.

Change: the 4 opening-word tests accept a match only where it starts and ends at a word edge (no letter or digit on either side). Punctuation
handling is unchanged.

Test (node pkgEWB/test_EWB.cjs): 4 OK. 76 node runs over every saved run: only 33605 B117 changes (the wrong block is dropped); nothing outside
E-ANS/E-HOLD changes. B117 now sends no full block: the true Acts 16:13 bullet adds under 60 characters to the quoted answer, so the pkgEAW
gate sends none, and DeepSeek reads the whole answer as the judge quoted it.
Scale: on the saved runs this substring slip happened once. The replay changes none of the other blocks in W3's rough count of 60, so
whatever they are, they are not this fault; I have not yet classified them.
