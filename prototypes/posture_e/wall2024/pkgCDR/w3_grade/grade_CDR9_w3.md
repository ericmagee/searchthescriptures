# W3 grade of pkgCDR rev 9 (W1, commit 976d36a3; write file pkgCDR/parent_s103_CDR.json): FAIL, on one point with a short fix

Design (b) is right and most of it passes. The one decision left in the code, the verb family, leaves out forms that the stored debates use.

## What passes
1. Speaker attribution (prompt_rev9.cjs / .txt): 194 candidates on the 39 stored debates; every one is found word for word in the round named, and every one is on the side whose round it is. Most for one side in one debate: 10 (cap 30).
2. Prompt text on 34108: the only lines added to the live prompt are the one instruction sentence and P1 to P7; P6 is the D6 drop ("I drop the wording "no biological father" as a bare statement."). The candidate line "none" is the only line removed. Prompt 151,443 to 154,145 characters.
3. Write file: 418 nodes; only Close Enforcer Build, Close Enforcer Record and Judge Contradiction Build differ from live s103; connections equal.
4. W1's record test (record_CDR.txt, 5 OK) covers a CONFIRMED with an empty closing quote (refused) and a NONE reply (all NO ANSWER). I did not repeat it.

## What fails: giving-up forms outside the verb family
Stored-debate scan (corpus_other_verbs_rev9.cjs / .txt), first-person sentences of rounds 1 to 3 with no rev 9 verb:
| family | count on 39 debates | stored example |
|---|---|---|
| concede | 9 | 33218 CR2: I concede the words "Joseph knew the child was not his". |
| do not rest / does not rest / rest nothing | 49 | 33222 CR2: I rest nothing on Galatians 4:4 alone. 33482 CR3: I do not rest on the register through the wife. |
| do not press / claim / assert | 6 | 33490 CR3: That limb floats free, and I do not assert it. |
| narrow (as a verb, without the text) | 3 | 33592 CR2: **D4.** I narrow this link. |
None of these reaches the enforcer (verbs_rev9.txt: 11 stored sentences, 0 sent). "I concede the words "..."" is a drop of a wording in everything but the verb. A footing disowned ("I rest nothing on ...") and then stood on in the closing round is the same cheat.
Planted verbs not sent (27): remove, delete, cede, yield, disclaim, revoke, repudiate, omit, cut, stop claiming, cease to hold, do not maintain, do not stand on, unsay, part with, let ... fall, pull back, back off, back down, stand down, leave out, void, cancel, replace, reword, was wrong to write, do not defend. Controls (waive, walk back, let go, no longer) are sent.
Not asked: "I grant" (694 first-person sentences on the stored record). A grant taken back is the close-round reversal check's work (ruling 412) and would swamp the list.

## Ask for rev 10 (idea only)
1. Add the four stored families and the planted verbs above. Cost on the stored record: about 67 more candidates over 39 debates, under two per debate.
2. If the cap is ever reached, keep round 3 first: the list is filled from round 1, so the cap would cut the round where drops are made.
3. An open vocabulary cannot be closed by plants. I will pass rev 10 when every stored form and the families named here reach the enforcer and points 1 to 4 above still hold; and I will run the scan script on each new run's rounds and report any new giving-up word as a list addition, not as a failure of the design.
The deciding test is still the DeepSeek replay on stored text.
