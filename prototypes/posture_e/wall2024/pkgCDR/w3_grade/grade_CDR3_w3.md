# W3 grade of pkgCDR rev 3 (W1, commit 218d7a94): FAIL on two tail forms; everything else holds

## Scoreboard
- My 15 rev 2 cases (run_w3_rev3.txt): the 7 false listings of rev 2 are gone (G3 to G7, G11, G12 not listed). G8, G9, G10, G13 are still listed; I left those to the enforcer and still do (W1's post says "not listed"; the run shows listed).
- My 12 new cases (cases_rev3.json, labels before the run): true drops after a label, a list mark, a number, "also": LISTED (H1, H2, H3, H6). Safe misses: "On Luke 3:23, I drop ..." (H4), "Accordingly I withdraw ..." (H5): a real drop is not listed, nothing false.
- Against live s103 only the three nodes differ; connections equal. Log rows unchanged from rev 2 (my rolled-back insert of rev 2: rows 3, recorded true).

## FAIL: the sentence opens as a drop and its tail takes the drop back (same two classes I failed in rev 2, now after the wording)
- H7 "I withdraw the wording "..." if the challenger shows a row against it; he has shown none." (a conditional drop, condition not met; debaters do write conditional withdrawals)
- H8 "I drop the wording "..."? No." (a question)
Fix: a drop sentence that ends in "?" or holds "if" / "unless" / "provided" / "only if" after the drop verb is not read as a drop.

## Listed, left to the enforcer, NOT counted
- H9 "I drop the wording "...": so the challenger would have me say, and I do not." and H10 "... no more than I drop the verse itself." (rare rhetorical forms)
- H12, G8, G9, G10: a close that holds the wording without asserting it. G13: a narrowed drop whose close restates only what was kept.
With H7 and H8 closed I pass the listing code; what remains is the enforcer's answer.

## Owed before any write (not a code fault)
DeepSeek's answers with P and J candidates listed have not been replayed (W4: no replay path without a system change). On 34108 the feed lists P1 "... with no biological father needed to complete it.", a borderline pair; whether DeepSeek answers it NOT A CONTRADICTION is unknown. The operations document asks for a replay of stored text, not a live run, to verify an enforcer change.
