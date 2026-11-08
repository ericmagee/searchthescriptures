# pkgEKL: DeepSeek RULE K-W does not turn a wrong layer into CONCEDED (W3 ruling 3167 item 1 (a))

DeepSeek enforcer fix. Nodes (base pkgEKN/patched = live s61): Enforcer Build d0a0a62d24e9 -> ed35761ec9e6; Alt Judge Enforcer Build 2c7332529206 -> 11880d7711c1.

Fault: RULE K-W said "if it still claims it, STANDS WITHOUT IT is right only when the layer the judge names carries that same fact; if the named
layer does not carry it, the right answer is CONCEDED". A judge's wrong layer became a concession, even when DeepSeek's own sentence quoted the
side's kept words resting the fact on a verse (33644 gemini DEFENDER CR3 LINK 6: "The side keeps the conception's source: 'I rest it on
Matthew 1:20... and on Luke 1:35', while Job 14:1 carries only the granted phrase").

Change (two passages, both nodes):
1. Still claims, and words of the side outside the flagged sentence carry the fact (rest it on a verse they quote whose own words state that same fact; a bare restatement carries
   nothing): STANDS WITHOUT IT is right. A layer carrying only the granted or withdrawn point is DISAGREE with the sentence
   "right: STANDS WITHOUT IT because <the side's own kept words, quoted>" (a wrong layer, not a concession). CONCEDED only when no such words exist.
2. NOT HELD (pkgEKN) graded on the same line.

Test (node pkgEKL/test_EKL.cjs): 6 OK. 26 runs per node; 22 main and 17 Alt K-W prompts differ only by the two passages; every other item byte-equal.
Saved rows the rule bears on (rows_EKL.md): class A (DISAGREE NEEDS: YES against STANDS WITHOUT IT) stays DISAGREE where the layer is wrong; the
sentence now names the kept words instead of implying CONCEDED. Class B (AGREE with CONCEDED, NEEDS: YES: ids 860, 862, 14967) all rest on a bare
restatement ("the side still claims the seed through the woman" with no verse carrying it), so CONCEDED stays right: none moves away from CONCEDED.
Live bar: no K-W DISAGREE sentence implies CONCEDED where it quotes the side's kept words resting the fact on a verse.

v2 (W2 3173): "rest it on a verse they quote" -> "rest it on a verse they quote whose own words state that same fact" in both passages, so a quoted verse that does not state the fact (class B 860, 862: Galatians 4:4 for the seed of David) stays CONCEDED.
