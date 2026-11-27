ADDENDUM 1 TO THE AFTER-ACTION REPORT, RUN 43103.
From W4's read of the live code and the stored row (Wall 12789), made after the report passed. No execution was read. The report's body is not changed.

1. BUGS 5 (empty question-round answer): CAUSE CONFIRMED IN CODE. The two question-round nodes send every debater answer with a fixed limit of 4,000 output tokens. ASK 635 raised hydrogen's limit for its rounds only; these nodes do not use it. Hydrogen's third answer used exactly 4,000 (the other two: 2,391 and 2,986) and gave no text. The empty answer is stored as "" and the line shows no "(no answer)" mark. Fix plan: ASK 674 (W4): each debater's question-round answer is called with that debater's own limit. It changes a token limit, not a reasoning setting; it needs the operator's word, as ASK 635 did.
2. BUGS 6 (ASK 645 dropped two follow-ups): CONFIRMED IN CODE. The rule refuses a follow-up whose open words are the whole question. With an empty answer the whole question is what was left open, so both were refused. The rule worked as written on a case it was not written for.
3. BUGS 9 (round 3 called a second time, nothing named): CAUSE LIKELY, NOT CONFIRMED. The round is called again on any of three counts: barred sentences, layer points, pressed verses short of their layers. The record line prints only the first two. The third count is the likely cause; it can be confirmed only by reading that node's execution, which was not done. Same class as ASK 633.
4. OBJECTIVE, the six items the report marks NOT CHECKED:
ASK 626 (premise-list reader): MET ON THIS RUN for plain numbered lists. Both lists were read (six premises and five); no "list not read" line. The bold and heading path: NOT EXERCISED.
ASK 634 (corrected FORCED line when its flagged line is not in the text): NOT EXERCISED. The case did not arise.
ASK 638 A (a cured drop leaves the array): the array and the count agree on the one case (sol: count 1 to 0, array empty). The drop path itself: NOT EXERCISED.
ASK 651 (long quotations in the PROVEN IN check): MET in what was read. Luke 1:35 was pressed and quoted whole and no line refused it. The panel's first prompt is not in the tables W4 read and was not read.
ASK 652 (layer verses counted as presses): MET in what was read, with the same limit.
ASK 653 ([L2] etymology words): MET for its scope. 242 tags, 225 counted, 17 not counted; 3 of the 17 are the Oracle's, against 15 in run 42528. One class remains: a lexicon entry worded "the base of" (G4561). Two more ("us", twice): cause not read.
5. STATUS OF ALL OBSERVATIONS, 42528 defect 2 (ASK 634): LIVE AND UNEXERCISED, now checked.
6. SUGGESTED IMPROVEMENTS, item 3: the 4,000 limit is confirmed as the cause. Planned as ASK 674.
