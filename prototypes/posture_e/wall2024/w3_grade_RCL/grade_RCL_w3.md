# Grade of pkgRCL (W2) by W3: NOT PASSED (one finding), with two limits and one interaction with pkgCLK rev 3

Candidate: /mnt/project-files/wall2024/parent_s119_RCL.json, sha256 4ce9a83c40ff8015, against live s119. Diff: Close Enforcer Build only, +1,428 code (measured by me), fixed prompt 0, connections equal. Claim and expectations on the Wall before any run. Script p.cjs, output p_out.txt (this folder). MEASURED. Offline: the DeepSeek call itself was not made; whether the enforcer confirms the candidates is NOT SHOWN.
Drift guard 8 read before this grade: a confirmed reclaim breaks defender links and so favours the record's reading; P8 shows the code names the challenger's close by the same test.

## 1. Finding (why NOT PASSED)
P1. Close sentence "I keep D2, D4 and D6 as declared and D1, D3 and D5 as narrowed in round 3." The code adds candidates for LINK 1, 3 and 5, each with the reason "LINK n was narrowed in [CR3] and is kept as declared in the close". That is false: the sentence keeps them as narrowed. The candidate is named "by the code" and its reason is stated as fact to an enforcer that is told to bring nothing from outside the words. A debater who closes honestly on its narrowed links is put up for a break on every one of them, and one wrong CONFIRMED breaks the chain. The link list is taken from the whole sentence, not from the part that "as declared" governs. W4's plants on a negation and on the other side's words test the same weakness.
Suggested: take the link names only from the clause that ends at "as declared"; skip a sentence where a "not" governs the verb; and word the reason as what the code saw, not as a conclusion (for example "the close says ... ; LINK n was narrowed in [CR3]").

## 2. Limits to state
- P3. A concession written in the round 2 form of run 34852 itself ("### LINK 4 (D4): CONCEDED as written") is not read: the line test wants "LINK n:" with nothing between. In 34852 LINK 5 is caught only because round 3 narrowed it again.
- P4. A link narrowed in round 2 and marked "SUPPORTED." in round 3 still gets a candidate from the round 2 line. Recorded; right by the ruling that a contradiction cannot be withdrawn.

## 3. Interaction with pkgCLK rev 3 (for the union, not a fault of pkgRCL alone)
P2. When the only "as declared" sentence stands in the D6 block (the last line of the 34852 close), the Record of pkgCLK rev 3 moves every confirmed pkgRCL candidate to LINK 6: D6 breaks, and LINK 1, 3 and 5 are marked "already broken" and do not break. With the live Record they break as named. In the stored 34852 and 34626 closes the first such sentence stands at the top, so the stored cases are not affected. This is pkgCLK rev 3's stated limit L5 meeting pkgRCL; the two packages should not go live together without deciding it (a code-named candidate could be exempt from the relink).

## 4. As expected
- P0 34852: candidates X3, X4, X5 for LINK 1, 3, 5; with all CONFIRMED the live Record breaks D1, D3, D5 (D3 already broken by X2); both quotations pass the Record's word-for-word test. P5 34626: six candidates, all pass the word-for-word test; D1 to D6 break.
- P6 empty close, no declared chain, no narrowing: no candidate, no error. P7 34726 and 34780: Build output byte-equal to live.
- P8 challenger side (LINK 2 narrowed in [DR3], "My chain stands as declared, C1 to C5." in [DR4]): candidate for CHALLENGER LINK 2; breaks C2 when confirmed. The rule bites both sides.
