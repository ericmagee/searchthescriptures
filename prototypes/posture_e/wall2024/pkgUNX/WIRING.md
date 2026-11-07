# pkgUNX: K-UNX, an UNEXHIBITED count on a layered answer (W3 2676, 2677)

**Rule (TRIAL for one run, side-neutral).** A premise that a seat counts UNEXHIBITED, in CONCEDED LINKS or CHALLENGER CONCEDED LINKS, is checked against its answering link-round block (LINK j of [CR3] or [DR3], read by lbBlockText). If FOOTING LAYERS (lbFoot, the K-LB reader) reads two or more layer kinds in that block, the count must do one of two things:
- name a layer the block lacks ([L1], [L2] or [L3] not read in the block, or [L4]); or
- be restated as a fit ruling: a CORRECTED COUNT without the premise, with the fit graded at the collision (FORCED, ruling 411).

A count resting on a ground that is not a layer is not read. Those grounds are an unanswered or unnamed witness, answers marked NOT COUNTED, a struck or barred answer, VOID, a narrowed link, and an ASSUMES premise. K-UNX is the mirror of K-LB.

**Edits (24 nodes).**
- The 2 prompts get one parenthesis on the CONCEDED LINKS definition.
- The 3 extractors get the library, a kunxLines call after drvBlocks, and ENF.
- The 19 cure and gate nodes get the library, ENF, the 3 rule lists, and the cure block before K-LB's.

**Cure.** A STATEMENT that names a layer the block lacks, or a CORRECTED COUNT below the count read. The mark is not counted in audit_flags. Eric's silence rule applies as for every TRIAL rule.

**Bases (rev, W3 2683 condition 1).** All 24 nodes are built on the live nodes of e3030157 (fetchback_live_s10.json, run 33218), which already hold PTA A, LNX, FCB, RSA, RFL, JFL (ac37ff3), GRA, KSC and L2R. Every anchor held on live. The bases are in pkgUNX/base/ and each base sha equals the live node. UNX is written alone on top of e3030157; nothing else is rebased on it. The 482792b JFL rebase is moot, since JFL ac37ff3 is live.

**MEANS ground (W3 2683 condition 2).** A count that says the answer does not meet the press's MEANS is a fit ground and is not read when: (a) the segment says so (meet or answer, then MEANS, meaning, significance, inference, claim or press, within 80 characters); (b) it points at one press of that premise in the other side's UNSUPPORTED-L4 PREMISES list, by quoting its MEANS (the pkgOAN 8-word test), by sharing 4 consecutive words with it, or by naming its verse; and (c) the answering block quotes that MEANS on no line (the pkgOAN test). Neither true 33149 count quotes the MEANS word for word (chatgpt names Matthew 1:19, sol paraphrases "a husband who knew himself to be the father"), so the strict quote test alone would exempt neither. That is why (b) also accepts the 4-word run or the verse.

**Replay (33040 to 33197).** 37 verdicts hold 31 UNEXHIBITED premise segments, which gave 12 items before the MEANS ground and give 10 now (the two 33149 premise 2 counts drop). Every item is a count that rests on fit or meaning against a block with 2 or 3 layer kinds:
- 33040 gemini: premise 2, on both sides.
- 33060 sol: C4.
- 33083 chatgpt: D6 and C3.
- 33149: chatgpt C2 and sol C2 (true counts on the MEANS; exempt since the MEANS ground).
- 33175 chatgpt: C6, which rests on the retired stating-verse test.
- 33197: gemini C5, chatgpt C1 and C5, and the single judge's C1.

sol 33197 (0 counted) raises none. The exemption list was set by reading the first replay. It removed 4 items whose grounds were not layer grounds: 33060 sol C6 (NOT COUNTED answers), 33083 chatgpt D5 (a witness not named), 33083 sol C3 (left without counted answers), and 33129 sol C4 (the narrowed-link rule).

**Test.** `node pkgUNX/test_UNX.cjs` gives 48 OK (F1 to F6 test the MEANS ground). It covers the replay, the base + edits identity for 24 nodes, the cure block on mocks, units including 33197 LINK 5, and an acorn scope check of the 22 library nodes.

**Revert.** Restore pkgUNX/base/.
