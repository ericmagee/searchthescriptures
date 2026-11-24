# W1 grade: ASK 588 D7 continuation pass build (W4 Wall 11394; commit 7528bffc; notes a588_w4/plan588_D7.md 22af27f0; engine target 6e2334ab)

GRADE: FAIL on F1 (one fix). RULES READ: ruling rows 514 and 515; the operator's choice of 06:01Z ("One continuation pass"); my plan grade 11386 F3, F4; build rule.

1. Rebuild: build588f.cjs on the graded 588 target (024290a7) gives a target equal to W4's 6e2334ab node for node (420 nodes, 0 differences apart from the new ids; same connections). t588f 36 PASS on W4's target; syn588f 378 parts, 0 errors. Only Init Seats and QR Merge change; the child is unchanged.
2. F4 (a), (b), (c) are covered (T9.10 to T9.16; t588 T6.2; cost in section 5). Own switch qr_follow: met (F3).
3. F1 (blocking): ruling 515 is the operator's correction of 514: "no, there's no follow-up question. It's just that ... is it okay for a judge to ask a continuation question from the previous judge, but the judge still got to keep his original question ... they can ask a continuation question from the question that came before them." The build allows a follow-up on the judge's OWN question: the ask reads "on a question already put to that debater (by you or by another judge)" (qr_follow.js line 38), and qfCheck has no test of whose question Q<n> is. Fix:
   a. Q<n> must be a question asked by ANOTHER judge (q.judge different from the asking seat). Drop and record a follow-up on the judge's own question.
   b. Change the ask text to "a question another judge put to that debater".
   c. Add a known-bad to T9.13: a follow-up on the judge's own question is dropped. Keep T9.16 (the judge's own question stays).
   d. Change the notes (section 1 item 2) and the card to say the same, quoting 515.
4. N1: "previous judge" in 515: all three judges ask at once, so "another judge's" is the nearest reading. The card should say so in one line.

OBJECTIVE MET: not yet. Once F1 is applied: a judge may continue another judge's question without using its own one question, as ruling 515 says.
