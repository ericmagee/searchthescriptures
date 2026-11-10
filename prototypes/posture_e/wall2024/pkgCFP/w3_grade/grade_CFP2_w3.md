# Regrade of pkgCFP rev 2 (W1, commit f6a5a9ed, on live s105): PASS on the code, one size correction, one stated limit, one note. Shelf only.
Grader W3 (non-builder). Written 02:41 CST 2026-11-10 (time read from the database). Claim Wall 4103.

About my rev 1 grade: I passed rev 1 and listed the silent drop of an ellipsis pair as note 1. W2 failed rev 1 on the same point. W2 was right: under my own
rule a missed pair that leaves no trace is a fault, not a note. Reported as my mistake.

## Checks that pass
- Rebuild: build_CFP.cjs on the live s105 fetch-back gives parent_s105_CFP2.json node for node. Only Judge Contradiction Build differs from live s105 (418 nodes).
- Code size confirmed: 11,164 to 11,961 characters (+797; rev 1 was +502).
- Rev 2 against rev 1 on all 46 stored debates: 35 outputs byte-equal; 11 differ only in the label of a merged candidate; candidates and quotes differ in none.
  So my rev 1 scan stands: 30 of 30 testable stored shown pairs are candidates.
- The fix (my rev 1 notes 1 and 2, W2's finding): a pair whose earlier or closing quote joins two sentences with an ellipsis is now a candidate, carried by the
  longest part that stands in one round, and the unchanged Record confirms a planted CONFIRMED answer that copies the candidate's quotes. Planted on 33644:
  earlier across CR2 and CR3 (Q1); both quotes with an ellipsis (Q6); a part found nowhere but under five words, which the anti-cheat test ignores (Q5); three
  parts over three rounds (Q9); a closing quote whose first part stands only in CR3 (Q7); a challenger pair (Q12). Rev 1 made no candidate for five of these six.
- Two shown pairs that fit to the same sentence pair are one candidate (Q11). A closing quote found nowhere in CR4 makes no candidate (Q8); the anti-cheat
  check cannot show such a pair.
- The merged label reads "the judges' CONTRADICTION lines (<seats>) and the anti-cheat check (found by the system; both quotes checked)" (my rev 1 note 4).
- No new log row shape; the Record is unchanged (rolled-back insert done in the rev 1 grade).

## Size correction
W1's post says the prompt is as rev 1. The longer merged label adds text: over the 22 existing stored calls the prompt grows +2,836 characters in all with rev 2,
against +1,824 with rev 1 (from size_CFP2.txt and size_CFP.txt). The one new call (33644, about 141,000 characters) is the same.

## Stated limit, confirmed (Q3, Q4)
A shown pair is still dropped with no trace when no part of its earlier quote stands inside one round: the quote must run from the end of one round into the
start of the next (the anti-cheat test joins rounds 1 to 3 into one text). This is the same kind of drop W2 failed in rev 1, now confined to that one form.
0 of 35 stored REVERSED answers come near it. I do not count it against a shelf package; it should be named in any write request.

## Note
When the same pair is also a judge's contradiction question from the question round, the label reads "the anti-cheat check, luna (found by the system; both
quotes checked)" (Q10): the judge is listed as part of the system finding. Wording only.

## Not tested, as W1 states
What DeepSeek answers to these candidates (set C or a replay).

## Files
w3_cfp2.cjs, w3_cfp2.txt.
