# W2 grade of pkgCFP rev 1 (W1, d39212bc, Wall 4097, shelf only): FAIL, one finding (planted form; 0 of 23 stored shown rows affected)

I am the second grader. Labels Q1-Q12 were committed before the first run (9b3a7281). An amendment and the new case Q13 were committed before the rerun (12384c06), and both runs are kept: `w2_cfp_run.txt` (first) and `w2_cfp_run2.txt` (rerun).

## Passing checks
- `build_CFP.cjs` on the s105 fetch-back rebuilds `parent_s105_CFP.json`, and only Judge Contradiction Build differs from s105 (+502 characters).
- W1's checks give the same results on my machine: `test_CFP.cjs` 44 of 46 (the two explained runs), L5 18 of 18, and my `size_CFP.cjs` output is identical to `size_CFP.txt`.
- **Q1:** a planted shown DEFENDER row (34108's D6 drop and reclaim) becomes one candidate, named "the anti-cheat check (found by the system; both quotes checked)". A new enforcer call is made.
- **Q2:** a shown CHALLENGER row becomes a CHALLENGER candidate. Its earlier round is DR2, because the sentence stands in DR2 as well as DR3.
- **Q3:** a judge naming the same pair with the same quotes merges into one candidate that names both. On the rerun this reads FAIL only because of a fault in my test: its filter also counted 34108's own chatgpt candidate on CR3.
- **Q4:** when a judge names the pair with a shorter quote, the pair is not lost. It becomes 2 candidates for one pair, which is harmless (one break per link).
- **Q5:** an earlier quote whose ellipsis joins two adjacent CR2 sentences still reaches the enforcer.
- **Q8 and Q9:** a pair the closing enforcer already answered (NOT A CONTRADICTION or CONFIRMED) is dropped, the same as for judge candidates.
- **Q10:** with nothing shown, the output is equal to live except for the shortened sentence.
- **Q11:** live Judge Contradiction Record confirms both planted anti-cheat candidates by code.

## Finding (FAIL): a shown pair can be dropped silently
The two nodes test a quotation differently:
- **Anticheat Record** passes a quotation with an ellipsis when every part of five words or more stands anywhere in the side's rounds 1-3 (joined) or in round 4.
- **pkgCFP** finds the earlier round with the enforcer's quote test, which needs all parts inside ONE sentence of ONE round, in order.

So the anti-cheat call can show the judges a pair that never reaches the enforcer, and nothing records the drop:
- **Q13:** the earlier quote "The finding is dated before the pair's coming together... I drop the broader claim that justice could never move a husband" (two non-adjacent CR3 sentences). The precondition holds: the anti-cheat call shows it. Result: no candidate and no record. W1's own label L1 says "each drop is reported".
- **Q6:** the same cause, with a quote that crosses a round boundary. This plant is unrealistic because it runs into the round header, so it is not counted.
- **Q7 (same mismatch at the Record, live behaviour):** the closing quote joins two CR4 sentences across a heading. A candidate is made, but a CONFIRMED answer quoting it reads NOT CONFIRMED (form), so the shown pair cannot break the link.

Stored data: none of the 23 stored shown rows uses an ellipsis, so no stored run changes.

Smallest fix I see is one of two options:
1. Show a pair to the judges only when the enforcer's quote test also passes (Anticheat Record, one test for both).
2. When pkgCFP finds no single round, write a record row naming the dropped pair.

## Invalid plant (my fault)
Q12 cannot occur: the anti-cheat call would not show it, because its closing quote is not in CR4.
