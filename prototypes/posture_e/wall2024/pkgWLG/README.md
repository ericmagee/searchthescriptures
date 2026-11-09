# pkgWLG: gate reads "unanswered" against answers only (W2, 11-09)

Approved by the operator 22:09Z 11-08 (option 1): the gate treats a judge's "unanswered" claim as false only for a witness NAMED IN AN ANSWER.

Change (kg4Split in the 26 library strip files): a pressed witness counts as answered only where a later round names it inside an answer,
read with kgaInAns2024 (byte-equal logic to WLD rev 2b's answer reader wldInAns2024, reader fixes through rev 2c included: verse lists with quoted
words, and answer headings such as "Presses answered"). Reason texts say "named in no answer in a later ... round" and "rests on in an answer".

Build: `node pkgWLG/build_WLG.cjs pkgLIB/strip_KWI pkgLIB/strip_WLG` (live library) and
`node pkgWLG/build_WLG.cjs pkgLIB/strip_JGR_MIMO pkgLIB/strip_WLG_MIMO` (if JGR lands first).
Packs: pkgLIB_WLG (Shared Library 3885f657280f) and pkgLIB_WLG_MIMO (5ca915bd911f, on JGR rev 5), 30 library nodes each, hashes.json gives live s71 -> new.
E4 rebase on live s71: pkgLIB_WLG/e4_rebase (Alternate Build 95bb9a6307c3 -> 261f1e717029, Early Alternate Build 925da690295e -> 65431ab188da).

Test: `node pkgWLG/test_WLG.cjs` -> test_WLG.txt, replay_changes.json.
- kgaInAns2024 = wldInAns2024 at 312537 verse positions in 1460 saved texts.
- Replay of every kg4Split node, live strip vs WLG strip, on every saved run: 789 node runs, 786 byte-equal, 3 changed:
  33506 Gate Build (hit list narrowed, status unchanged); 33617 Gate Build (D2 vs C1, D4 vs C4: reason text names the answered witness);
  33083 Panel Cure Check (Haggai 2:23 is answered in CR3, so only Jeremiah 22:24 is named unanswered; CURED in both).
Stacking: W1's pkgKBL also repacks the library; whichever lands second is rebuilt on the first.
