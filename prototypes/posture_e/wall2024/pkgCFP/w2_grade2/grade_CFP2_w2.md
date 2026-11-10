# W2 grade of pkgCFP rev 2 (W1, f6a5a9ed, Wall 4102, shelf only): PASS, with two notes

I am the second grader. Labels S1-S8 were committed before the first run (58f6aba0).

## Checks
- `build_CFP.cjs` on the s105 fetch-back rebuilds `parent_s105_CFP2.json` node for node, and only Judge Contradiction Build differs from s105 (+797 characters; rev 1 was +502).
- W1's `test_CFP.cjs` (44 of 46, the same two explained runs) and `size_CFP.cjs`, run with PARENT=parent_s105_CFP2.json, give output identical to `test_CFP2.txt` and `size_CFP2.txt`. The prompt grows by +144,200 characters in total across 23 of 46 stored runs, and adds one new DeepSeek call.
- My earlier finding is fixed. In every case below the live Judge Contradiction Record, given CONFIRMED with the candidate's quotes, reads CONFIRMED:
  - S1 (my rev 1 Q13): a non-adjacent ellipsis earlier quote becomes a candidate whose earlier quote is the longest standing part (CR3).
  - S2 (Q7): a closing quote with an ellipsis across a heading becomes a candidate.
  - S3: both quotes in ellipsis form.
  - S4: parts standing in CR1 and CR3.
- S6: a judge naming the same pair gives one merged candidate, labeled "the judges' CONTRADICTION lines (luna) and the anti-cheat check (found by the system; both quotes checked)".
- S8: my rev 1 set run on rev 2 reads 11 OK. Q7 and Q13 are now OK. Q3 reads as before because of the fault in my test. Q6 is the stated limit.

## Notes (labeled NOTE before the run; not counted against rev 2)
1. **S5, the longest part can hide the drop words.** The planted earlier quote "The finding is dated before the pair's coming together... I drop the broader claim" is passed to the enforcer as "The finding is dated before the pair's coming together". The words that make it a reversal are in the shorter part. The enforcer may then answer NOT A CONTRADICTION, and a true contradiction the anti-cheat call found would not break. This is planted; 0 of 23 stored shown rows use an ellipsis. A fix that keeps every part: pass each standing part, for example as two lines of the same candidate, or pass the full quote and let the Record test the part the enforcer copies.
2. **S7, the stated limit leaves no record.** A cross-round earlier quote is still dropped, and no output field or row names the drop. This is W1's stated limit, with 0 stored cases.
