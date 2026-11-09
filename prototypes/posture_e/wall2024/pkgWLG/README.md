# pkgWLG: gate reads "unanswered" against answers only (W2, 11-09)

Approved by the operator 22:09Z 11-08 (option 1): the gate treats a judge's "unanswered" claim as false only for a witness NAMED IN AN ANSWER.

Change (kg4Split in the 26 library strip files): a pressed witness counts as answered only where a later round names it inside an answer,
read with kgaInAns2024 (byte-equal logic to WLD rev 2e's answer reader wldInAns2024: verse lists with quoted words, and answer headings
only in the 27 forms the saved runs carry, pkgWLD/rev2/heading_forms_saved.txt). Reason texts say "named in no answer in a later ... round" and "rests on in an answer".

Build (base live s74, library strip_JGR_HAIKU): `node pkgWLG/build_WLG.cjs pkgLIB/strip_JGR_HAIKU pkgLIB/strip_WLG`.
Pack: pkgLIB_WLG (Shared Library ee9abc8f0ef1 -> ed1ec6fb07c0), hashes.json gives live s74 -> new.
E4 rebase on live s74: pkgLIB_WLG/e4_rebase (Alternate Build db5f46588890 -> a4058f4d0524, Early Alternate Build 1b52f7008e96 -> 9d20eaf9deb4).

Test: `node pkgWLG/test_WLG.cjs pkgLIB/strip_JGR_HAIKU pkgLIB/strip_WLG` -> test_WLG.txt, replay_changes.json.
- kgaInAns2024 = wldInAns2024 at 312537 verse positions in 1460 saved texts.
- Replay of every kg4Split node, live strip vs WLG strip, on every saved run: 789 node runs, 786 byte-equal, 3 changed:
  33506 Gate Build (hit list narrowed, status unchanged); 33617 Gate Build (D2 vs C1, D4 vs C4: reason text names the answered witness);
  33083 Panel Cure Check (Haggai 2:23 is answered in CR3, so only Jeremiah 22:24 is named unanswered; CURED in both).
Stacking: W1's KBF fold also changes the library; whichever lands second is rebuilt on the first.
