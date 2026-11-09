# pkgWLG: gate reads "unanswered" against answers only (W2, 11-09)

Approved by the operator 22:09Z 11-08 (option 1): the gate treats a judge's "unanswered" claim as false only for a witness NAMED IN AN ANSWER.

Change (kg4Split in the 26 library strip files): a pressed witness counts as answered only where a later round names it inside an answer,
read with kgaInAns2024 (byte-equal logic to WLD rev 2e's answer reader wldInAns2024: verse lists with quoted words, and answer headings
only in the 27 forms the saved runs carry, pkgWLD/rev2/heading_forms_saved.txt). Reason texts say "named in no answer in a later ... round" and "rests on in an answer".

Build (base live s72, library strip_KBL): `node pkgWLG/build_WLG.cjs pkgLIB/strip_KBL pkgLIB/strip_WLG`.
Pack: pkgLIB_WLG (Shared Library 0fe94aab142b), hashes.json gives live s72 -> new.
E4 rebase on live s72: pkgLIB_WLG/e4_rebase (Alternate Build dde2d8ed8bcd -> a351fcb7a5d2, Early Alternate Build 16658c6e8630 -> 1bc7be3f263f).

Test: `node pkgWLG/test_WLG.cjs pkgLIB/strip_KBL pkgLIB/strip_WLG` -> test_WLG.txt, replay_changes.json.
- kgaInAns2024 = wldInAns2024 at 312537 verse positions in 1460 saved texts.
- Replay of every kg4Split node, live strip vs WLG strip, on every saved run: 789 node runs, 786 byte-equal, 3 changed:
  33506 Gate Build (hit list narrowed, status unchanged); 33617 Gate Build (D2 vs C1, D4 vs C4: reason text names the answered witness);
  33083 Panel Cure Check (Haggai 2:23 is answered in CR3, so only Jeremiah 22:24 is named unanswered; CURED in both).
Stacking: pkgJGR rev 7 also changes the library (Alternate Build, R2 Alternate Build); whichever lands second is rebuilt on the first.
