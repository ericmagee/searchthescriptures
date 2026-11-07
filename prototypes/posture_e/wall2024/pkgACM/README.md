# pkgACM: reader phase 2 completion, item 1a (W3 order, Wall 2992)

The ANSWER CHECK line and its MEANS, ANSWER and grade fields are now read by the shared reader (`__RL.readLine`, form `ANSWER CHECK`) in the 4 Send Back nodes. A line the reader refuses keeps the old read. A claims() line with more than one round also keeps the old read.

- **claims() (pkgMNP), 4 nodes.** Before, MEANS was read by `(["“]?)([^"”]*?)\1`, which cannot cross an inner quote.
- **cure() (pkgMNP), 4 nodes.** The CHANGE TO's verse, grade and MEANS now come from one reader read. Before, there were three separate reads.
- **enf428Cure() E-ANS, the 2 Record nodes.** Both the flagged line and the CHANGE TO are read by the reader. Before, one AC regex needed a quoted MEANS, `--` separators and `[CR n]` rounds.
- **Reader in the Build nodes.** Send Back Build and Alt Send Back Build get the same embedded reader text the Record nodes carry (pkgSBX).

Base: live s50 (0247fc93). The shas are in patched.plan.json:

| Node | Base | Patched |
|---|---|---|
| SBB | e42a822d056b | fce7a381bd93 |
| SBR | 0f5ee9f231f4 | bbc6947a54ec |
| Alt SBB | 679e84bfb19b | dc902df8e797 |
| Alt SBR | 310e9bde82a6 | 51d3b2d94d44 |

Test (`node --max-old-space-size=8000 pkgACM/test_ACM.cjs`, output in test_ACM.txt): 10 OK, 0 FAIL.

**Behaviour changes, for W3's ruling:**

1. **claims() on the corpus** (2573 texts, 4561 lines that name ANSWER CHECK). No line changes its MEANS NONE claim, grade, verse or round where the old read worked.
   - 668 lines now carry the whole MEANS text instead of null (an inner quote). None of them is a NONE claim either way.
   - 94 lines that the old read skipped (`[Defender R3]` / `[Challenger R3]` rounds) are now read. None of them is a NONE claim.
   - Result: no E-MNP item is added or removed on the corpus.
2. **enf428Cure on the corpus.**
   - 453 lines the old AC regex refused are now read. These are the `[Defender Rn]` rounds, bare MEANS and dash variants.
   - 20 lines read a different ANSWER text, because the reader drops markdown `*`. The cure's word compare drops `*` too.
   - The E-ANS cure is record-only ("CURE (record-only until promoted)"), so no seat changes.
3. **Node replay** (17 runs, 67 node runs, s50 base against patched): 1 output changed.
   - 33299 Send Back Record, sol, an E-ANS record-only cure: UNCURED "the CHANGE TO is not an ANSWER CHECK line" becomes UNCURED "the CHANGE TO answer is not found word for word in [CR2]".
   - The status is the same, and only the reason changed.

Not in this package: the library reads of the same field (gateAnsGround2024, ac, dptCheck, kagRow0) are item 1b. They ship as a LIB repack after the next written LIB version.
